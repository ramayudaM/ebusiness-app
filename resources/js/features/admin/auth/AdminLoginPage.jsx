import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, AlertTriangle, Shield } from 'lucide-react';
import useAdminAuth from './useAdminAuth';

/**
 * AdminLoginPage — Halaman login admin NadaKita
 */
const AdminLoginPage = () => {
  const { login, loading, fieldErrors, serverError, serverErrorType } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true); // STATE 8: default checked
  const [showPassword, setShowPassword] = useState(false); // STATE 7
  const [isSuccess, setIsSuccess] = useState(false); // STATE 9

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password, remember });
    if (success) {
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 800);
    }
  };

  // Helper: tentukan class border input berdasarkan state
  const getInputClass = (fieldName) => {
    const base = "w-full bg-[#0F1320] text-white text-sm placeholder-[#3D4559] rounded-lg border transition-all duration-200 focus:outline-none";
    if (fieldErrors[fieldName]) {
      // STATE 3: error validasi
      return `${base} border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]`;
    }
    if (serverError && serverErrorType === 'credentials') {
      // STATE 5: error dari server — highlight kedua field
      return `${base} border-red-500 focus:border-red-500`;
    }
    // DEFAULT + FOCUS STATE 2
    return `${base} border-[#1E2536] focus:border-[#F15A24] focus:shadow-[0_0_0_3px_rgba(241,90,36,0.15)]`;
  };

  return (
    // Halaman fullscreen dengan background gradient
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: `radial-gradient(ellipse at 20% 20%, #1a0a20 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 80%, #200a08 0%, transparent 50%),
                     #0B0D14`,
      }}
    >
      {/* ===== LOGO + SUBTITLE (Desktop & Tablet: di atas card) ===== */}
      <div className="hidden md:flex flex-col items-center mb-8">
        <span className="text-[#F15A24] text-2xl font-bold tracking-tight">NadaKita</span>
        <span className="text-[#8B92A5] text-[11px] tracking-[0.15em] uppercase mt-1">
          Admin Studio Access
        </span>
      </div>

      {/* ===== CARD ===== */}
      <div className="
        w-full max-w-[calc(100%-2rem)]
        md:w-[440px] md:max-w-[440px]
        lg:w-[400px] lg:max-w-[400px]
        bg-[#161B27] border border-[#1E2536] rounded-xl
        p-6 md:p-8 lg:p-10
      ">

        {/* Logo hanya tampil di dalam card untuk mobile */}
        <div className="flex flex-col items-center mb-6 md:hidden">
          <span className="text-[#F15A24] text-xl font-bold">NadaKita</span>
          <span className="text-[#8B92A5] text-[10px] tracking-[0.15em] uppercase mt-1">
            Admin Studio Access
          </span>
        </div>

        {/* Judul dan Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-white text-xl lg:text-2xl font-bold">Selamat Datang Kembali</h1>
          <p className="text-[#8B92A5] text-sm mt-2">Masuk untuk mengelola ekosistem musik Anda.</p>
        </div>

        {/* ===== ALERT BOX STATE 5 & 6 ===== */}
        {serverError && (
          <div className={`flex items-start gap-3 rounded-lg p-3 mb-5 border ${
            serverErrorType === 'credentials'
              ? 'bg-red-500/10 border-red-500/40'
              : 'bg-amber-500/10 border-amber-500/40'
          }`}>
            {serverErrorType === 'credentials'
              ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            }
            <p className={`text-[13px] leading-snug ${
              serverErrorType === 'credentials' ? 'text-red-300' : 'text-amber-300'
            }`}>
              {serverError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ===== FIELD EMAIL ===== */}
          <div>
            <label className="block text-[#8B92A5] text-[11px] font-semibold tracking-[0.08em] uppercase mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                fieldErrors.email ? 'text-red-500' : 'text-[#3D4559]'
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="admin@nadakita.id"
                className={`${getInputClass('email')} h-12 lg:h-12 pl-11 pr-4 disabled:opacity-60 disabled:cursor-not-allowed`}
                autoComplete="email"
              />
            </div>
            {/* Error per field — STATE 3 */}
            {fieldErrors.email && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* ===== FIELD PASSWORD ===== */}
          <div>
            <label className="block text-[#8B92A5] text-[11px] font-semibold tracking-[0.08em] uppercase mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                fieldErrors.password ? 'text-red-500' : 'text-[#3D4559]'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className={`${getInputClass('password')} h-12 pl-11 pr-11 disabled:opacity-60 disabled:cursor-not-allowed`}
                autoComplete="current-password"
              />
              {/* Tombol show/hide — STATE 7 */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3D4559] hover:text-[#8B92A5] transition-colors disabled:opacity-40"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4 text-[#F15A24]" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
            {fieldErrors.password && (
              <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* ===== ROW: REMEMBER ME + LUPA SANDI ===== */}
          <div className="flex items-center justify-between">
            {/* Checkbox — STATE 8 */}
            <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px] select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    remember
                      ? 'bg-[#F15A24] border-[#F15A24]'
                      : 'bg-[#0F1320] border-[#1E2536] hover:border-[#F15A24]/50'
                  } ${loading ? 'opacity-50' : ''}`}
                  onClick={() => !loading && setRemember(!remember)}
                >
                  {remember && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[#8B92A5] text-[13px]">Remember Me</span>
            </label>

            <Link
              to="/admin/forgot-password"
              className="text-[#F15A24] text-[13px] hover:text-[#D94E1A] transition-colors"
            >
              Lupa sandi?
            </Link>
          </div>

          {/* ===== TOMBOL CTA ===== */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full h-[52px] md:h-[52px]
              flex items-center justify-center gap-2
              rounded-lg font-semibold text-[15px] text-white
              transition-all duration-300 cursor-pointer
              disabled:cursor-not-allowed
              ${isSuccess
                ? 'bg-green-500 hover:bg-green-500'
                : loading
                  ? 'bg-[#D94E1A]'
                  : 'bg-[#F15A24] hover:bg-[#D94E1A] active:scale-[0.99]'
              }
            `}
          >
            {/* STATE 4: Loading */}
            {loading && !isSuccess && (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>Memverifikasi...</span>
              </>
            )}
            {/* STATE 9: Success */}
            {isSuccess && <span>Berhasil! Mengalihkan...</span>}
            {/* STATE 1: Default */}
            {!loading && !isSuccess && (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* ===== DIVIDER + ENKRIPSI INFO ===== */}
        {/* <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#1E2536]" />
          <div className="flex items-center gap-1.5 text-[#3D4559] text-[11px]">
            <Shield className="w-3 h-3" />
            <span>Enkripsi 256-bit NadaKita Studio</span>
          </div>
          <div className="flex-1 h-px bg-[#1E2536]" />
        </div> */}
      </div>

      {/* ===== COPYRIGHT ===== */}
      <p className="text-[#3D4559] text-[11px] tracking-[0.12em] uppercase mt-6">
        © 2026 NadaKita.
      </p>
    </div>
  );
};

export default AdminLoginPage;
