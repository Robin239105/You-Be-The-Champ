import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, Ticket, Settings, Users, ArrowLeft } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Tag },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/admin/users', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-black border-r border-gold/20 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gold/20">
        <Link to="/" className="flex items-center gap-3 group">
          <ArrowLeft size={16} className="text-gold group-hover:-translate-x-1 transition-transform" />
          <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Back to Store</span>
        </Link>
        <h1 className="mt-6 font-cinzel text-xl font-bold text-white tracking-widest uppercase">Admin Panel</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-cinzel text-xs tracking-widest uppercase transition-all ${
                    isActive
                      ? 'bg-gold text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]'
                      : 'text-ivory/60 hover:bg-white/5 hover:text-gold'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-gold/10 text-[10px] text-ivory/30 uppercase tracking-widest">
        v1.0.0 Built with Prisma
      </div>
    </div>
  );
};

export default AdminSidebar;
