import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Basic security check - only admins can access
  // In a real scenario, this would check a 'role' field
  if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-black/40 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
