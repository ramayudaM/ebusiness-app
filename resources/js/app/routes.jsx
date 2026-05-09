import { HomePage } from '../features/home/pages/HomePage';
import { ExplorePage } from '../features/explore/pages/ExplorePage';
import { ProductDetailPage } from '../features/product/pages/ProductDetailPage';
import { HelpPage } from '../features/static/pages/HelpPage';
import { HelpArticlePage } from '../features/static/pages/HelpArticlePage';
import { NotificationPage } from '../features/user/pages/NotificationPage';
import { CartPage } from '../features/cart/pages/CartPage';
import { CheckoutPage } from '../features/cart/pages/CheckoutPage';
import { OrdersPage } from '../features/account/pages/OrdersPage';
import { OrderDetailPage } from '../features/account/pages/OrderDetailPage';
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import GuestRoute from '../shared/components/GuestRoute'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import AdminLoginPage from '../features/admin/auth/AdminLoginPage'
import AdminRoute from '../shared/components/AdminRoute'
import AdminGuestRoute from '../shared/components/AdminGuestRoute'
import { Navbar } from '../shared/components/Navbar'
import { Footer } from '../shared/components/Footer'
import { User, Heart } from 'lucide-react'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/catalog" element={<Navigate to="/explore" replace />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/help/:slug" element={<HelpArticlePage />} />

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

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Legacy Redirects */}
      <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
      <Route path="/profile" element={<Navigate to="/account/profile" replace />} />
      <Route path="/wishlist" element={<Navigate to="/account/wishlist" replace />} />

      {/* Protected Customer Routes */}
      <Route
        path="/account/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/profile"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 text-center">
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Profil Saya</h1>
                <p className="text-gray-500">Halaman profil sedang dalam pengembangan.</p>
              </div>
              <Footer />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/wishlist"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 text-center">
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Wishlist Saya</h1>
                <p className="text-gray-500">Halaman wishlist sedang dalam pengembangan.</p>
              </div>
              <Footer />
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="/track" element={<Navigate to="/account/orders" replace />} />

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
