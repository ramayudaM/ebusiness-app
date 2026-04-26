import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../../features/auth/authStore'

/**
 * GuestRoute — mencegah user yang sudah login mengakses halaman Login/Register.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default GuestRoute
