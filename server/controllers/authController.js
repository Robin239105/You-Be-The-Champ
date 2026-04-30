const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const generateTokens = (user) => {
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
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
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
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        affiliateId: true
      }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, refresh, getAllUsers };
