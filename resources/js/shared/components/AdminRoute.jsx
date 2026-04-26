import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminAuthStore from '../../features/admin/auth/adminAuthStore';

/**
 * AdminRoute — hanya bisa diakses jika sudah login sebagai admin.
 * Jika belum login → redirect ke /admin/login
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAdminAuthStore();
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminRoute;
