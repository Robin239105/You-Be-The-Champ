const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;

  try {
    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive coupon' });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (coupon.minOrderAmount && parseFloat(cartTotal) < parseFloat(coupon.minOrderAmount)) {
      return res.status(400).json({ success: false, message: `Minimum order amount of $${coupon.minOrderAmount} required` });
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (parseFloat(cartTotal) * parseFloat(coupon.value)) / 100;
    } else {
      discountAmount = parseFloat(coupon.value);
    }

    res.json({ success: true, data: { discountAmount, code: coupon.code } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCoupon = async (req, res) => {
  const { code, type, value, minOrderAmount, maxUses, expiryDate } = req.body;

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      }
    });
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { validateCoupon, getCoupons, createCoupon, deleteCoupon };
