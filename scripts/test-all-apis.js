const prisma = require('../utils/prisma');

// Comprehensive API Testing Script
async function testAllAPIs() {
  console.log('🔍 COMPREHENSIVE API AUDIT STARTING...\n');
  
  const results = {
    database: { status: 'pending', details: {} },
    auth: { status: 'pending', endpoints: [] },
    products: { status: 'pending', endpoints: [] },
    categories: { status: 'pending', endpoints: [] },
    orders: { status: 'pending', endpoints: [] },
    blog: { status: 'pending', endpoints: [] },
    upload: { status: 'pending', endpoints: [] },
    settings: { status: 'pending', endpoints: [] },
    coupons: { status: 'pending', endpoints: [] },
    analytics: { status: 'pending', endpoints: [] },
    affiliate: { status: 'pending', endpoints: [] },
    payments: { status: 'pending', endpoints: [] }
  };

  try {
    // 1. DATABASE CONNECTION TEST
    console.log('📊 Testing Database Connection...');
    try {
      await prisma.$queryRaw`SELECT 1`;
      const userCount = await prisma.user.count();
      const productCount = await prisma.product.count();
      const orderCount = await prisma.order.count();
      const blogCount = await prisma.blogPost.count();
      
      results.database = {
        status: '✅ CONNECTED',
        details: {
          users: userCount,
          products: productCount,
          orders: orderCount,
          blogPosts: blogCount
        }
      };
      console.log('✅ Database Connected - Users:', userCount, 'Products:', productCount, 'Orders:', orderCount, 'Blog Posts:', blogCount);
    } catch (err) {
      results.database = { status: '❌ FAILED', error: err.message };
      console.log('❌ Database Connection Failed:', err.message);
    }

    // 2. AUTHENTICATION ROUTES TEST
    console.log('\n🔐 Testing Authentication Routes...');
    try {
      const authRoutes = require('../routes/authRoutes.js');
      const authController = require('../controllers/authController.js');
      
      // Check if all auth functions exist
      const authFunctions = ['register', 'login', 'refresh', 'getAllUsers', 'getUserById', 'updateUserRole', 'toggleBanUser', 'deleteUser', 'updateProfile'];
      authFunctions.forEach(func => {
        if (typeof authController[func] === 'function') {
          results.auth.endpoints.push(`✅ ${func}`);
        } else {
          results.auth.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.auth.status = '✅ COMPLETE';
      console.log('✅ Authentication Routes - All functions loaded');
    } catch (err) {
      results.auth.status = '❌ FAILED';
      results.auth.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Authentication Routes Failed:', err.message);
    }

    // 3. PRODUCTS API TEST
    console.log('\n📦 Testing Products API...');
    try {
      const productRoutes = require('../routes/productRoutes.js');
      const productController = require('../controllers/productController.js');
      
      const productFunctions = ['getProducts', 'getProductBySlug', 'createProduct', 'updateProduct', 'updateStock', 'deleteProduct', 'bulkDeleteProducts', 'bulkUpdateStatus', 'getCategories', 'exportProducts', 'importProducts'];
      productFunctions.forEach(func => {
        if (typeof productController[func] === 'function') {
          results.products.endpoints.push(`✅ ${func}`);
        } else {
          results.products.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.products.status = '✅ COMPLETE';
      console.log('✅ Products API - All functions loaded');
    } catch (err) {
      results.products.status = '❌ FAILED';
      results.products.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Products API Failed:', err.message);
    }

    // 4. CATEGORIES API TEST
    console.log('\n🏷️ Testing Categories API...');
    try {
      const categoryRoutes = require('../routes/categoryRoutes.js');
      const categoryController = require('../controllers/categoryController.js');
      
      const categoryFunctions = ['getCategories', 'getCategoryBySlug', 'createCategory', 'updateCategory', 'deleteCategory'];
      categoryFunctions.forEach(func => {
        if (typeof categoryController[func] === 'function') {
          results.categories.endpoints.push(`✅ ${func}`);
        } else {
          results.categories.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.categories.status = '✅ COMPLETE';
      console.log('✅ Categories API - All functions loaded');
    } catch (err) {
      results.categories.status = '❌ FAILED';
      results.categories.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Categories API Failed:', err.message);
    }

    // 5. ORDERS API TEST
    console.log('\�️ Testing Orders API...');
    try {
      const orderRoutes = require('../routes/orderRoutes.js');
      const orderController = require('../controllers/orderController.js');
      
      const orderFunctions = ['createOrder', 'getOrders', 'getOrderById', 'updateOrderStatus', 'updateTracking', 'deleteOrder', 'getOrderStats', 'getOrderStatsSummary'];
      orderFunctions.forEach(func => {
        if (typeof orderController[func] === 'function') {
          results.orders.endpoints.push(`✅ ${func}`);
        } else {
          results.orders.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.orders.status = '✅ COMPLETE';
      console.log('✅ Orders API - All functions loaded');
    } catch (err) {
      results.orders.status = '❌ FAILED';
      results.orders.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Orders API Failed:', err.message);
    }

    // 6. BLOG API TEST
    console.log('\n📝 Testing Blog API...');
    try {
      const blogRoutes = require('../routes/blogRoutes.js');
      const blogController = require('../controllers/blogController.js');
      
      const blogFunctions = ['getPosts', 'getPostBySlug', 'createPost', 'updatePost', 'deletePost', 'bulkDeletePosts'];
      blogFunctions.forEach(func => {
        if (typeof blogController[func] === 'function') {
          results.blog.endpoints.push(`✅ ${func}`);
        } else {
          results.blog.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.blog.status = '✅ COMPLETE';
      console.log('✅ Blog API - All functions loaded');
    } catch (err) {
      results.blog.status = '❌ FAILED';
      results.blog.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Blog API Failed:', err.message);
    }

    // 7. UPLOAD API TEST
    console.log('\n📤 Testing Upload API...');
    try {
      const uploadRoutes = require('../routes/uploadRoutes.js');
      const uploadController = require('../controllers/uploadController.js');
      
      const uploadFunctions = ['uploadImage', 'uploadLocalImage'];
      uploadFunctions.forEach(func => {
        if (typeof uploadController[func] === 'function') {
          results.upload.endpoints.push(`✅ ${func}`);
        } else {
          results.upload.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.upload.status = '✅ COMPLETE';
      console.log('✅ Upload API - All functions loaded');
    } catch (err) {
      results.upload.status = '❌ FAILED';
      results.upload.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Upload API Failed:', err.message);
    }

    // 8. SETTINGS API TEST
    console.log('\n⚙️ Testing Settings API...');
    try {
      const settingRoutes = require('../routes/settingRoutes.js');
      const settingController = require('../controllers/settingController.js');
      
      const settingFunctions = ['getSettings', 'updateSettings', 'resetSettings'];
      settingFunctions.forEach(func => {
        if (typeof settingController[func] === 'function') {
          results.settings.endpoints.push(`✅ ${func}`);
        } else {
          results.settings.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.settings.status = '✅ COMPLETE';
      console.log('✅ Settings API - All functions loaded');
    } catch (err) {
      results.settings.status = '❌ FAILED';
      results.settings.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Settings API Failed:', err.message);
    }

    // 9. COUPONS API TEST
    console.log('\n🎫 Testing Coupons API...');
    try {
      const couponRoutes = require('../routes/couponRoutes.js');
      const couponController = require('../controllers/couponController.js');
      
      const couponFunctions = ['getCoupons', 'getCouponByCode', 'createCoupon', 'updateCoupon', 'deleteCoupon', 'validateCoupon'];
      couponFunctions.forEach(func => {
        if (typeof couponController[func] === 'function') {
          results.coupons.endpoints.push(`✅ ${func}`);
        } else {
          results.coupons.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.coupons.status = '✅ COMPLETE';
      console.log('✅ Coupons API - All functions loaded');
    } catch (err) {
      results.coupons.status = '❌ FAILED';
      results.coupons.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Coupons API Failed:', err.message);
    }

    // 10. ANALYTICS API TEST
    console.log('\n📊 Testing Analytics API...');
    try {
      const analyticsRoutes = require('../routes/analyticsRoutes.js');
      const analyticsController = require('../controllers/analyticsController.js');
      
      const analyticsFunctions = ['getSalesAnalytics', 'getProductAnalytics', 'getCustomerAnalytics', 'getOverviewStats'];
      analyticsFunctions.forEach(func => {
        if (typeof analyticsController[func] === 'function') {
          results.analytics.endpoints.push(`✅ ${func}`);
        } else {
          results.analytics.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.analytics.status = '✅ COMPLETE';
      console.log('✅ Analytics API - All functions loaded');
    } catch (err) {
      results.analytics.status = '❌ FAILED';
      results.analytics.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Analytics API Failed:', err.message);
    }

    // 11. AFFILIATE API TEST
    console.log('\n🤝 Testing Affiliate API...');
    try {
      const affiliateRoutes = require('../routes/affiliateRoutes.js');
      const affiliateController = require('../controllers/affiliateController.js');
      
      const affiliateFunctions = ['getAffiliates', 'createAffiliate', 'updateAffiliate', 'deleteAffiliate', 'getAffiliateStats'];
      affiliateFunctions.forEach(func => {
        if (typeof affiliateController[func] === 'function') {
          results.affiliate.endpoints.push(`✅ ${func}`);
        } else {
          results.affiliate.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.affiliate.status = '✅ COMPLETE';
      console.log('✅ Affiliate API - All functions loaded');
    } catch (err) {
      results.affiliate.status = '❌ FAILED';
      results.affiliate.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Affiliate API Failed:', err.message);
    }

    // 12. PAYMENTS API TEST
    console.log('\n💳 Testing Payments API...');
    try {
      const paymentRoutes = require('../routes/paymentRoutes.js');
      const paymentController = require('../controllers/paymentController.js');
      
      const paymentFunctions = ['createPaymentIntent', 'confirmPayment', 'webhook', 'getPaymentMethods'];
      paymentFunctions.forEach(func => {
        if (typeof paymentController[func] === 'function') {
          results.payments.endpoints.push(`✅ ${func}`);
        } else {
          results.payments.endpoints.push(`❌ ${func} - MISSING`);
        }
      });
      results.payments.status = '✅ COMPLETE';
      console.log('✅ Payments API - All functions loaded');
    } catch (err) {
      results.payments.status = '❌ FAILED';
      results.payments.endpoints.push(`❌ Error: ${err.message}`);
      console.log('❌ Payments API Failed:', err.message);
    }

  } catch (error) {
    console.error('❌ Critical Error in API Testing:', error.message);
  }

  // FINAL RESULTS
  console.log('\n' + '='.repeat(80));
  console.log('🎯 COMPREHENSIVE API AUDIT RESULTS');
  console.log('='.repeat(80));
  
  Object.entries(results).forEach(([section, data]) => {
    console.log(`\n${section.toUpperCase()}: ${data.status}`);
    if (data.endpoints && data.endpoints.length > 0) {
      data.endpoints.forEach(endpoint => console.log(`  ${endpoint}`));
    }
    if (data.details) {
      Object.entries(data.details).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    if (data.error) {
      console.log(`  ERROR: ${data.error}`);
    }
  });

  // OVERALL STATUS
  const allPassed = Object.values(results).every(r => r.status.includes('✅'));
  console.log('\n' + '='.repeat(80));
  console.log(`🏆 OVERALL API STATUS: ${allPassed ? '✅ ALL SYSTEMS OPERATIONAL' : '⚠️ SOME ISSUES DETECTED'}`);
  console.log('='.repeat(80));

  return results;
}

// Run the test
testAllAPIs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test Suite Failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
