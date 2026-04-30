const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// 1. Prisma Singleton — prevents "too many connections" in serverless
const { PrismaClient } = require('@prisma/client');
const globalForPrisma = global;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 2. Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const settingRoutes = require('./routes/settingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

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

// Root route
app.get('/', (req, res) => res.send('API is Live'));

// Export for Vercel
module.exports = app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}
