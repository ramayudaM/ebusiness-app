import { Routes, Route } from 'react-router-dom'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>NadaKita — Coming Soon</div>} />
      <Route path="/catalog" element={<div>Catalog Page</div>} />
      <Route path="/product/:slug" element={<div>Product Detail Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/cart" element={<div>Cart Page</div>} />
      <Route path="/checkout" element={<div>Checkout Page</div>} />
      <Route path="/account/orders" element={<div>Order History</div>} />
      <Route path="/account/wishlist" element={<div>Wishlist</div>} />
      <Route path="/admin" element={<div>Admin Dashboard</div>} />
      <Route path="/admin/products" element={<div>Admin Products</div>} />
      <Route path="/admin/orders" element={<div>Admin Orders</div>} />
      <Route path="*" element={<div>404 — Halaman tidak ditemukan</div>} />
    </Routes>
  )
}
