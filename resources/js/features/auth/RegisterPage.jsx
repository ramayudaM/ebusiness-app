import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from './hooks/useAuth'

const RegisterPage = () => {
  const { register, loading, errors } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    agree_terms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: 'Sangat Lemah',
    color: 'bg-gray-200',
  })

  const checkPasswordStrength = (pass) => {
    let score = 0
    if (pass.length > 6) score++
    if (pass.length > 10) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return { score, label: 'Lemah', color: 'bg-red-500' }
    if (score <= 3) return { score, label: 'Menengah', color: 'bg-orange-500' }
    if (score <= 4) return { score, label: 'Kuat', color: 'bg-yellow-500' }
    return { score, label: 'Sangat Kuat', color: 'bg-green-500' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErrors({})

    const newErrors = {}
    if (!formData.name) newErrors.name = ['Nama lengkap wajib diisi']
    if (!formData.email) newErrors.email = ['Email wajib diisi']
    if (formData.password.length < 8) newErrors.password = ['Password minimal 8 karakter']
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = ['Konfirmasi password tidak cocok']
    }

    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors)
      return
    }

    await register(formData)
  }

  const [localErrors, setLocalErrors] = useState({})
  const combinedErrors = { ...errors, ...localErrors }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData({
      ...formData,
      [name]: newValue,
    })

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header / Logo */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-orange-600 p-2 rounded-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12Z" />
            </svg>
          </div>
          <span className="text-xl font-bold">NadaKita</span>
        </div>
        <Link to="/login" className="text-sm text-gray-600 flex items-center gap-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Masuk
        </Link>
      </div>

      {/* Register Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-sm text-gray-500">
            Bergabunglah dengan komunitas audio profesional kami.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap*</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                noValidate
                className={`w-full pl-10 pr-4 py-2 bg-gray-100 border-2 ${
                  combinedErrors.name ? 'border-red-500 bg-red-50' : 'border-transparent'
                } rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition-all`}
                placeholder="Contoh: Andi Wijaya"
              />
            </div>
            {combinedErrors.name && (
              <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tighter">
                {combinedErrors.name[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                noValidate
                className={`w-full pl-10 pr-4 py-2 bg-gray-100 border-2 ${
                  combinedErrors.email ? 'border-red-500 bg-red-50' : 'border-transparent'
                } rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition-all`}
                placeholder="name@example.com"
              />
            </div>
            {combinedErrors.email && (
              <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tighter">
                {combinedErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                noValidate
                className={`w-full pl-10 pr-10 py-2 bg-gray-100 border-2 ${
                  combinedErrors.password ? 'border-red-500 bg-red-50' : 'border-transparent'
                } rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition-all`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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
              <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tighter">
                {combinedErrors.password[0]}
              </p>
            )}
            <div className="flex gap-1 mt-2">
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  passwordStrength.score >= 5 ? passwordStrength.color : 'bg-gray-200'
                }`}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
              Kekuatan:{' '}
              <span className={passwordStrength.score > 0 ? 'text-gray-600' : ''}>
                {passwordStrength.label}
              </span>
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                noValidate
                className={`w-full pl-10 pr-4 py-2 bg-gray-100 border-2 ${
                  combinedErrors.password_confirmation
                    ? 'border-red-500 bg-red-50'
                    : 'border-transparent'
                } rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 transition-all`}
                placeholder="••••••••"
              />
            </div>
            {combinedErrors.password_confirmation && (
              <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tighter">
                {combinedErrors.password_confirmation[0]}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 py-2">
            <input
              type="checkbox"
              name="agree_terms"
              id="agree_terms"
              checked={formData.agree_terms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
              required
            />
            <label htmlFor="agree_terms" className="text-xs text-gray-500 leading-normal">
              Saya setuju dengan{' '}
              <span className="text-orange-600 font-semibold cursor-pointer">
                Syarat & Ketentuan
              </span>{' '}
              dan{' '}
              <span className="text-orange-600 font-semibold cursor-pointer">
                Kebijakan Privasi
              </span>{' '}
              NadaKita.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.agree_terms}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                Daftar
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      {/* <footer className="mt-8 text-[10px] text-gray-400 text-center max-w-sm uppercase tracking-widest leading-loose">
        Pro Audio Ecosystem © 2024 NadaKita Digital Experience. All rights reserved. Secured by
        End-to-End Encryption.
      </footer> */}
    </div>
  )
}

export default RegisterPage
