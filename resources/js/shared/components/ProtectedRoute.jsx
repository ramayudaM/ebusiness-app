import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../features/auth/authStore'

/**
 * ProtectedRoute — mencegah akses halaman yang membutuhkan login.
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
