import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminAuthStore from '../../features/admin/auth/adminAuthStore';

/**
 * AdminGuestRoute — hanya bisa diakses jika BELUM login sebagai admin.
 * Jika sudah login → redirect ke /admin/dashboard (STATE 11)
 */
const AdminGuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useAdminAuthStore();
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

export default AdminGuestRoute;
