import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import PlayerEditions from './pages/PlayerEditions';
import Vintage90s from './pages/Vintage90s';
import Affiliate from './pages/Affiliate';

import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import SizeGuide from './pages/SizeGuide';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminUserList from './pages/admin/AdminUserList';
import AdminCouponList from './pages/admin/AdminCouponList';
import AdminCategoryList from './pages/admin/AdminCategoryList';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/category/*" element={<CategoryPage />} />
        
        <Route path="/player-editions" element={<PlayerEditions />} />
        <Route path="/vintage-90s" element={<Vintage90s />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm isEdit />} />
          <Route path="categories" element={<AdminCategoryList />} />
          <Route path="orders" element={<AdminOrderList />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="coupons" element={<AdminCouponList />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Legal Pages */}
        <Route path="/shipping-policy" element={<LegalPage title="Shipping Policy" />} />
        <Route path="/return-policy" element={<LegalPage title="Return Policy" />} />
        <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
        <Route path="/terms-of-service" element={<LegalPage title="Terms of Service" />} />
        <Route path="/affiliate-program" element={<LegalPage title="Affiliate Program" />} />
        <Route path="/authenticity" element={<LegalPage title="Authenticity & Quality" />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
