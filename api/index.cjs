const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

const prisma = require('../utils/prisma');


// 2. Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Routes
const authRoutes = require('../routes/authRoutes.cjs');
const productRoutes = require('../routes/productRoutes.cjs');
const categoryRoutes = require('../routes/categoryRoutes.cjs');
const orderRoutes = require('../routes/orderRoutes.cjs');
const couponRoutes = require('../routes/couponRoutes.cjs');
const settingRoutes = require('../routes/settingRoutes.cjs');
const paymentRoutes = require('../routes/paymentRoutes.cjs');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/payments', paymentRoutes);

// 4. Error Handler
app.use((err, req, res, next) => {
  console.error("❌ CLOUD ERROR:", err.message);
  res.status(500).json({ 
    success: false, 
    message: "Server Error", 
    error: err.message 
  });
});

// Health Check & Diagnostic Tool
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      success: true, 
      status: 'Ready',
      database: 'Connected',
      env: {
        node: process.env.NODE_ENV,
        has_db: !!process.env.POSTGRES_PRISMA_URL,
        has_jwt: !!process.env.JWT_SECRET
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      status: 'Error',
      error: err.message,
      hint: "Check if POSTGRES_PRISMA_URL is set in Vercel"
    });
  }
});

// Root route
app.get('/', (req, res) => res.send('API is Live'));

// Export for Vercel
module.exports = app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}
