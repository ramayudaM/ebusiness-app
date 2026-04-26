import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import useAdminAuthStore from './adminAuthStore';

const useAdminAuth = () => {
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAdminAuthStore();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [serverErrorType, setServerErrorType] = useState(null); // 'credentials' | 'server'

  const login = async ({ email, password, remember }) => {
    setLoading(true);
    setFieldErrors({});
    setServerError(null);
    setServerErrorType(null);

    // Validasi frontend sebelum kirim ke API
    const errors = {};
    if (!email) errors.email = 'Alamat email wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Format email tidak valid.';
    if (!password) errors.password = 'Kata sandi wajib diisi.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/admin/auth/login', { email, password, remember });
      const { user, token } = response.data.data;

      setAuth(user, token);

      // State 9: Success — tombol hijau sebentar, lalu redirect
      return true; // Mark success for UI to handle timing
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      const apiErrors = error.response?.data?.errors;

      if (status === 422 && apiErrors) {
        // Error validasi dari API
        const flat = {};
        Object.keys(apiErrors).forEach(k => { flat[k] = apiErrors[k][0]; });
        setFieldErrors(flat);
      } else if (status === 401 || status === 403) {
        // Kredensial salah atau bukan admin
        setServerError(message || 'Email atau kata sandi yang Anda masukkan salah.');
        setServerErrorType('credentials');
      } else if (!error.response) {
        // Network error
        setServerError('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
        setServerErrorType('server');
      } else {
        // Server error 500
        setServerError('Terjadi kesalahan server. Silakan coba beberapa saat lagi.');
        setServerErrorType('server');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post('/admin/auth/logout'); } catch (e) { /* tetap logout */ }
    clearAuth();
    navigate('/admin/login');
  };

  return { login, logout, loading, fieldErrors, serverError, serverErrorType };
};

export default useAdminAuth;
