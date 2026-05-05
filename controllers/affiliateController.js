const prisma = require('../utils/prisma');

// GET /api/affiliate/me — logged-in user's affiliate stats + commission history
const getMyStats = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        affiliateCode: true,
        affiliateClicks: true,
        commissions: {
          orderBy: { createdAt: 'desc' },
          include: {
            order: { select: { id: true, createdAt: true, totalAmount: true } },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const commissions = user.commissions;
    const totalEarned = commissions.reduce((s, c) => s + parseFloat(c.commission), 0);
    const pendingAmount = commissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + parseFloat(c.commission), 0);
    const approvedAmount = commissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + parseFloat(c.commission), 0);
    const paidAmount = commissions.filter(c => c.status === 'PAID').reduce((s, c) => s + parseFloat(c.commission), 0);
    const referralCount = commissions.length;

    res.json({
      success: true,
      data: {
        affiliateCode: user.affiliateCode,
        affiliateClicks: user.affiliateClicks,
        totalEarned: totalEarned.toFixed(2),
        pendingAmount: pendingAmount.toFixed(2),
        approvedAmount: approvedAmount.toFixed(2),
        paidAmount: paidAmount.toFixed(2),
        referralCount,
        commissions: commissions.map(c => ({
          id: c.id,
          orderId: c.orderId,
          orderAmount: parseFloat(c.orderAmount).toFixed(2),
          commission: parseFloat(c.commission).toFixed(2),
          status: c.status,
          createdAt: c.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/affiliate/click — increment click counter for a code (public)
const trackClick = async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'Code required' });

  try {
    const result = await prisma.user.updateMany({
      where: { affiliateCode: code },
      data: { affiliateClicks: { increment: 1 } },
    });
    res.json({ success: true, incremented: result.count > 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/affiliates — all affiliates with aggregated stats (admin only)
const getAllAffiliates = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { affiliateCode: { not: null } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        affiliateCode: true,
        affiliateClicks: true,
        createdAt: true,
        commissions: {
          select: { commission: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = users.map(u => {
      const totalEarned = u.commissions.reduce((s, c) => s + parseFloat(c.commission), 0);
      const pending = u.commissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + parseFloat(c.commission), 0);
      const paid = u.commissions.filter(c => c.status === 'PAID').reduce((s, c) => s + parseFloat(c.commission), 0);
      return {
        id: u.id,
        email: u.email,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
        affiliateCode: u.affiliateCode,
        affiliateClicks: u.affiliateClicks,
        referralCount: u.commissions.length,
        totalEarned: totalEarned.toFixed(2),
        pendingAmount: pending.toFixed(2),
        paidAmount: paid.toFixed(2),
        createdAt: u.createdAt,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/affiliates/commissions — all commissions with affiliate + order info (admin only)
const getAllCommissions = async (req, res) => {
  try {
    const commissions = await prisma.affiliateCommission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        affiliate: { select: { id: true, email: true, firstName: true, lastName: true, affiliateCode: true } },
        order: { select: { id: true, createdAt: true, totalAmount: true, status: true } },
      },
    });

    const data = commissions.map(c => ({
      id: c.id,
      affiliateId: c.affiliateId,
      affiliateName: `${c.affiliate.firstName || ''} ${c.affiliate.lastName || ''}`.trim() || c.affiliate.email,
      affiliateEmail: c.affiliate.email,
      affiliateCode: c.affiliate.affiliateCode,
      orderId: c.orderId,
      orderAmount: parseFloat(c.orderAmount).toFixed(2),
      commission: parseFloat(c.commission).toFixed(2),
      status: c.status,
      orderStatus: c.order?.status,
      createdAt: c.createdAt,
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/affiliates/commissions/:id — update commission status (admin only)
const updateCommissionStatus = async (req, res) => {
  const { status } = req.body;
  if (!['PENDING', 'APPROVED', 'PAID'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status. Must be PENDING, APPROVED, or PAID' });
  }

  try {
    const commission = await prisma.affiliateCommission.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ success: true, data: commission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyStats, trackClick, getAllAffiliates, getAllCommissions, updateCommissionStatus };
