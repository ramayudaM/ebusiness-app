import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import GuestRoute from '../shared/components/GuestRoute'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import AdminLoginPage from '../features/admin/auth/AdminLoginPage'
import AdminRoute from '../shared/components/AdminRoute'
import AdminGuestRoute from '../shared/components/AdminGuestRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>NadaKita — Coming Soon</div>} />
      <Route path="/catalog" element={<div>Catalog Page</div>} />
      <Route path="/product/:slug" element={<div>Product Detail Page</div>} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route path="/cart" element={<div>Cart Page</div>} />

      {/* Protected Customer Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <div>Checkout Page</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/orders"
        element={
          <ProtectedRoute>
            <div>Order History</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/wishlist"
        element={
          <ProtectedRoute>
            <div>Wishlist</div>
          </ProtectedRoute>
        }
      />

      {/* Admin Auth Routes */}
      <Route
        path="/admin/login"
        element={
          <AdminGuestRoute>
            <AdminLoginPage />
          </AdminGuestRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <div className="text-white p-8">Admin Dashboard — Coming Soon</div>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <div>Admin Products</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <div>Admin Orders</div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>404 — Halaman tidak ditemukan</div>} />
    </Routes>
  )
}
