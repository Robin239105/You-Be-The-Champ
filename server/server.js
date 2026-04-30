const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 1. Initialize Prisma (Standard Vercel Setup)
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

// 2. Self-healing Admin Account
const ensureAdmin = async () => {
  try {
    const email = 'admin@youbethechamp.com';
    const password = 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.upsert({
      where: { email },
      update: { role: 'ADMIN' },
      create: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User'
      }
    });
    console.log('✅ Cloud Admin Verified');
  } catch (err) {
    console.log('🔄 DB Syncing...');
  }
};
setTimeout(ensureAdmin, 5000);

// 3. Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 4. Routes
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

// 5. THE CRITICAL FIX: Safe Error Handler
app.use((err, req, res, next) => {
  console.error("❌ CLOUD ERROR:", err.message);
  console.error("📂 STACK:", err.stack);
  
  res.status(500).json({ 
    success: false, 
    message: "Server Error", 
    error: err.message,
    hint: "Check Vercel Environment Variables (DATABASE_URL, JWT_SECRET)"
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('You Be The Champ API is running...');
});

// Export for Vercel
module.exports = app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
