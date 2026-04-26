import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from './hooks/useAuth'

const LoginPage = () => {
  const { login, loading, errors } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [globalError, setGlobalError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localErrors, setLocalErrors] = useState({})

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')
    setLocalErrors({})

    if (!validateEmail(formData.email)) {
      setLocalErrors({ email: ['Format email tidak valid'] })
      return
    }

    const result = await login(formData)
    if (!result.success) {
      setGlobalError(result.message)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    // Clear error when typing
    if (localErrors[name]) {
      setLocalErrors({ ...localErrors, [name]: null })
    }
  }

  const combinedErrors = { ...errors, ...localErrors }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="text-sm text-gray-600 flex items-center gap-1 uppercase font-bold tracking-wider"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Beranda
        </Link>
      </div>

      {/* Header / Logo */}
      <div className="mb-8 text-center flex items-center gap-3">
        <div className="bg-orange-600 p-2 rounded-xl shadow-lg">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12Z" />
          </svg>
        </div>
        <span className="text-2xl font-black text-gray-800 tracking-tight">NadaKita</span>
      </div>

      {/* Login Card */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun</h1>
          <p className="text-sm text-gray-500 font-medium">Lanjutkan perjalanan musikmu</p>
        </div>

        {globalError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              noValidate
              className={`w-full px-5 py-4 bg-gray-50 border-2 ${
                combinedErrors.email ? 'border-red-500 bg-red-50' : 'border-transparent'
              } rounded-2xl focus:bg-white focus:outline-none focus:border-orange-500 transition-all font-medium shadow-inner shadow-gray-200`}
              placeholder="nama@email.com"
            />
            {combinedErrors.email && (
              <p className="text-xs font-bold text-red-500 ml-1 animate-pulse">
                {combinedErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Password*
              </label>
              <Link
                to="/forgot-password"
                title="Lupa password?"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                noValidate
                className={`w-full px-5 py-4 bg-gray-50 border-2 ${
                  combinedErrors.password ? 'border-red-500 bg-red-50' : 'border-transparent'
                } rounded-2xl focus:bg-white focus:outline-none focus:border-orange-500 transition-all font-medium shadow-inner shadow-gray-200`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {combinedErrors.password && (
              <p className="text-xs font-bold text-red-500 ml-1 animate-pulse">
                {combinedErrors.password[0]}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 ml-1">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 bg-gray-50 border-gray-300 rounded focus:ring-orange-500"
            />
            <label
              htmlFor="remember"
              className="text-sm text-gray-600 font-semibold select-none cursor-pointer"
            >
              Ingat saya
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-200 relative overflow-hidden group"
            >
              {loading ? (
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <span className="z-10 tracking-widest">MASUK</span>
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform skew-x-12 duration-500"></div>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm border-t border-gray-100 pt-8">
          <span className="text-gray-500 font-medium">Belum punya akun?</span>{' '}
          <Link
            to="/register"
            className="text-orange-600 font-black hover:underline underline-offset-4 Decoration-2"
          >
            Daftar di sini
          </Link>
        </div>

        {/* <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-black text-gray-300 tracking-widest uppercase ml-1">
          <Link to="/tos" className="hover:text-gray-400 transition-colors">
            Syarat
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-gray-400 transition-colors">
            Privasi
          </Link>
          <span>•</span>
          <Link to="/help" className="hover:text-gray-400 transition-colors">
            Bantuan
          </Link>
        </div> */}
      </div>

      {/* <p className="mt-12 text-[11px] text-gray-400 font-medium italic text-center max-w-lg leading-relaxed px-4">
        "Musik memberikan jiwa pada alam semesta, sayap pada pikiran, dan terbang pada imajinasi."
      </p> */}
    </div>
  )
}

export default LoginPage
