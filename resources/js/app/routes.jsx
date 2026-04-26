import { Routes, Route } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import GuestRoute from '../shared/components/GuestRoute'
import ProtectedRoute from '../shared/components/ProtectedRoute'

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

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <div>Admin Dashboard</div>
          </ProtectedRoute>
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
