const prisma = require('../utils/prisma');

const COMMISSION_RATE = 0.15;

// Generate unique order number: YBTC-YYYYMMDD-XXXX
async function generateOrderNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `YBTC-${dateStr}`;
  
  // Find the highest order number for today
  const todayOrders = await prisma.order.findMany({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: 'desc' },
    take: 1
  });
  
  let sequence = 1;
  if (todayOrders.length > 0) {
    const lastNum = todayOrders[0].orderNumber.split('-')[2];
    sequence = parseInt(lastNum) + 1;
  }
  
  return `${prefix}-${String(sequence).padStart(4, '0')}`;
}

const createOrder = async (req, res) => {
  const { cartItems, shippingAddress, paymentMethod, couponCode, affiliateCode } = req.body;

  console.log('📦 Create Order Request:', {
    userId: req.user.id,
    cartItems: cartItems.length,
    affiliateCode
  });

  try {
    const orderNumber = await generateOrderNumber();
    
    // SECURITY FIX: Recalculate EVERYTHING on the server
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      if (!product) throw new Error(`Product ${item.id} not found`);
      
      const itemPrice = parseFloat(product.price);
      const quantity = parseInt(item.quantity);
      
      subtotal += (itemPrice * quantity);
      orderItemsData.push({
        productId: item.id,
        quantity: quantity,
        price: itemPrice
      });
    }

    // Shipping Cost (Mirroring frontend logic)
    const shippingMethod = req.body.shippingMethod || 'standard';
    const shippingCost = shippingMethod === 'express' ? 25 : 0;

    let totalAmount = subtotal + shippingCost;

    // Apply Coupon if provided
    let appliedCouponData = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        // Validate min amount against server-calculated subtotal
        if (!coupon.minOrderAmount || subtotal >= parseFloat(coupon.minOrderAmount)) {
          let discount = 0;
          if (coupon.type === 'PERCENTAGE') {
            discount = (subtotal * parseFloat(coupon.value)) / 100;
          } else {
            discount = parseFloat(coupon.value);
          }
          // Cap discount at subtotal
          discount = Math.min(discount, subtotal);
          totalAmount -= discount;
          appliedCouponData = { code: coupon.code, discountAmount: discount };
        }
      }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        shippingAddress: typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress,
        paymentMethod,
        couponCode: couponCode || null,
        affiliateCode: affiliateCode || null,
        orderItems: {
          create: orderItemsData
        }
      },
      include: { orderItems: { include: { product: { select: { name: true, images: true } } } } }
    });

    console.log('✅ Order Created Successfully:', order.orderNumber, 'Total:', order.totalAmount);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('❌ Order Creation Failed:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

async function maybeCreateCommission(order) {
  try {
    if (!order.affiliateCode) return;
    const existing = await prisma.affiliateCommission.findUnique({ where: { orderId: order.id } });
    if (existing) return;
    const affiliate = await prisma.user.findUnique({ where: { affiliateCode: order.affiliateCode } });
    if (!affiliate || affiliate.id === order.userId) return;
    const commission = parseFloat(order.totalAmount) * COMMISSION_RATE;
    await prisma.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        orderId: order.id,
        orderAmount: parseFloat(order.totalAmount),
        commission,
        status: 'PENDING',
      },
    });
  } catch (err) {
    console.error('Commission creation error:', err.message);
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { 
        orderItems: { 
          include: { 
            product: { 
              select: { 
                id: true,
                name: true, 
                images: true,
                slug: true
              } 
            } 
          } 
        } 
      }
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
  const { status, trackingNumber, notes } = req.body;

  try {
    const data = { status };
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
    if (notes !== undefined) data.notes = notes;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data,
      include: { orderItems: { include: { product: true } }, user: true }
    });

    // Create commission when order is confirmed/paid
    if (['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status)) {
      await maybeCreateCommission(order);
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderTracking = async (req, res) => {
  const { trackingNumber, notes } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { trackingNumber, notes }
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

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updateOrderTracking, getDashboardStats };
