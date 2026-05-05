const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateAffiliateCode(firstName) {
  const prefix = (firstName || 'USER').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X').padEnd(4, 'X');
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${suffix}`;
}

const generateTokens = (user) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    console.error('❌ CRITICAL: JWT Secrets are missing in environment variables!');
    throw new Error('Authentication configuration error. Please check your Vercel environment variables.');
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};


const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let affiliateCode = generateAffiliateCode(firstName);
    // Ensure uniqueness
    let existing = await prisma.user.findUnique({ where: { affiliateCode } });
    while (existing) {
      affiliateCode = generateAffiliateCode(firstName);
      existing = await prisma.user.findUnique({ where: { affiliateCode } });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        affiliateCode,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user);
    
    // Save refresh token to DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        affiliateCode: user.affiliateCode,
        affiliateClicks: user.affiliateClicks,
        accessToken,
        refreshToken
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } = generateTokens(user);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
      });

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          affiliateCode: user.affiliateCode,
          affiliateClicks: user.affiliateClicks,
          accessToken,
          refreshToken
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ success: false, message: 'Refresh Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ success: false, message: 'Invalid Refresh Token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid Refresh Token' });
  }
};

const getAllUsers = async (req, res) => {
  const { search, role } = req.query;
  const where = {};
  if (role && role !== 'ALL') where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } }
    ];
  }
  try {
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isBanned: true, createdAt: true,
        _count: { select: { orders: true } }
      }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isBanned: true, createdAt: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { orderItems: { include: { product: { select: { name: true } } } } }
        },
        addresses: true
      }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['ADMIN', 'CUSTOMER'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot change your own role' });
  }
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, role: true }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleBanUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot ban yourself' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: !user.isBanned },
      select: { id: true, email: true, isBanned: true }
    });
    res.json({ success: true, data: updated, message: updated.isBanned ? 'User banned' : 'User unbanned' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
  }
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, refresh, getAllUsers, getUserById, updateUserRole, toggleBanUser, deleteUser };
