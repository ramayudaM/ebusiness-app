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
import { WishlistPage } from '../features/account/pages/WishlistPage';
import { ProfilePage } from '../features/account/pages/ProfilePage';
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import GuestRoute from '../shared/components/GuestRoute'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import AdminLoginPage from '../features/admin/auth/AdminLoginPage'
import AdminRoute from '../shared/components/AdminRoute'
import AdminGuestRoute from '../shared/components/AdminGuestRoute'
<<<<<<< HEAD
import AdminDashboardPage from '../features/admin/dashboard/AdminDashboardPage'
import AdminProductsPage from '../features/admin/products/AdminProductsPage'
import AdminOrdersPage from '../features/admin/orders/AdminOrdersPage'
import AdminCustomersPage from '../features/admin/customers/AdminCustomersPage'
import AdminReportsPage from '../features/admin/reports/AdminReportsPage'
=======
import { Navbar } from '../shared/components/Navbar'
import { Footer } from '../shared/components/Footer'
import { User, Heart } from 'lucide-react'
>>>>>>> origin/main

export function AppRoutes() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> 
      <Route path="/catalog" element={<div>Catalog Page</div>} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/customers" element={<AdminCustomersPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
=======
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/catalog" element={<Navigate to="/explore" replace />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/help/:slug" element={<HelpArticlePage />} />
>>>>>>> origin/main

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
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
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

      <Route path="*" element={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center p-4 transition-colors duration-300">
          <div className="text-9xl font-black text-gray-200 dark:text-gray-800 absolute -z-10 select-none">404</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke alamat lain.</p>
          <Link to="/" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      } />
    </Routes>
  )
}
