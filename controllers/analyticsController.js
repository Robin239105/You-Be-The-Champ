const prisma = require('../utils/prisma');

const getRevenueByDate = async (req, res) => {
  const { days = 30 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - parseInt(days));

  try {
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: since }, paymentStatus: 'PAID' },
      select: { createdAt: true, totalAmount: true }
    });

    const grouped = {};
    orders.forEach(o => {
      const day = o.createdAt.toISOString().split('T')[0];
      grouped[day] = (grouped[day] || 0) + parseFloat(o.totalAmount);
    });

    const data = Object.entries(grouped)
      .map(([date, revenue]) => ({ date, revenue: parseFloat(revenue.toFixed(2)) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTopProducts = async (req, res) => {
  const { limit = 10 } = req.query;
  try {
    const products = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: parseInt(limit)
    });

    const productIds = products.map(p => p.productId);
    const productDetails = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, images: { take: 1 } }
    });

    const detailMap = Object.fromEntries(productDetails.map(p => [p.id, p]));

    const data = products.map(p => ({
      productId: p.productId,
      name: detailMap[p.productId]?.name || 'Unknown',
      price: detailMap[p.productId]?.price,
      image: detailMap[p.productId]?.images?.[0]?.url || null,
      totalSold: p._sum.quantity,
      orderCount: p._count.id
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderTrends = async (req, res) => {
  const { days = 30 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - parseInt(days));

  try {
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, status: true }
    });

    const byDay = {};
    const byStatus = {};

    orders.forEach(o => {
      const day = o.createdAt.toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
      byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    });

    const daily = Object.entries(byDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ success: true, data: { daily, byStatus } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const [totalOrders, totalCustomers, totalProducts, paidOrders, pendingOrders, cancelledOrders] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.findMany({ where: { paymentStatus: 'PAID' }, select: { totalAmount: true } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } })
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await prisma.order.findMany({
      where: { createdAt: { gte: thisMonth }, paymentStatus: 'PAID' },
      select: { totalAmount: true }
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

    res.json({
      success: true,
      data: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        cancelledOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRevenueByDate, getTopProducts, getOrderTrends, getSummary };
