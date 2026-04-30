const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  const { cartItems, totalAmount, shippingAddress, paymentMethod, couponCode } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount: parseFloat(totalAmount),
        shippingAddress,
        paymentMethod,
        couponCode,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price)
          }))
        }
      },
      include: { orderItems: true }
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { orderItems: { include: { product: true } } }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { orderItems: { include: { product: true } }, user: true }
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Check if user is owner or admin
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};

  try {
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    
    const orders = await prisma.order.findMany();
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
    
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });

    const topProducts = await prisma.product.findMany({
      take: 5,
      include: { 
        _count: {
          select: { orderItems: true }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getDashboardStats };
