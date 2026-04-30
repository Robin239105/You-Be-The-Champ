const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

const createStripeSession = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } } }
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const lineItems = order.orderItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.images[0]?.url || ''],
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: { orderId: order.id }
    });

    res.json({ success: true, data: { id: session.id, url: session.url } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      }
    });
  }

  res.json({ received: true });
};

const capturePayPalPayment = async (req, res) => {
  const { paypalOrderId, dbOrderId } = req.body;

  try {
    const { capturePayPalOrder } = require('../utils/paypal');
    const captureData = await capturePayPalOrder(paypalOrderId);

    if (captureData.status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: dbOrderId },
        data: { 
          paymentStatus: 'PAID',
          status: 'CONFIRMED'
        }
      });
      res.json({ success: true, data: captureData });
    } else {
      res.status(400).json({ success: false, message: 'PayPal payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createStripeSession, handleStripeWebhook, capturePayPalPayment };
