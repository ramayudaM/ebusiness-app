import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Music, Headphones, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'

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
  
  // Interactive Promo Slide State
  const [activeSlide, setActiveSlide] = useState(0)

  const promoSlides = [
    {
      text: "NadaKita memberikan saya akses instan ke instrumen terbaik dunia. Layanan proteksi dan pengiriman sangat aman.",
      author: "Andi Setiawan",
      role: "Produser Musik",
      tags: ["Premium Instrument", "Garansi Resmi"],
      image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1200"
    },
    {
      text: "Pengiriman logistik yang sangat profesional dan aman. Gitar impian saya sampai tanpa goresan sedikitpun.",
      author: "Budi Cahyono",
      role: "Gitaris Klasik",
      tags: ["Logistik Terproteksi", "Layanan Prioritas"],
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200"
    }
  ]

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % promoSlides.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
  }

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
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-orange-500/30">
      {/* Signature Global Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-700/5 blur-[150px] pointer-events-none z-0"></div>

      {/* Unified Card Container (Style matches homepage dark theme) */}
      <div className="w-full max-w-5xl bg-[#0A0A0A]/90 backdrop-blur-2xl border border-zinc-900 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row relative z-10 overflow-hidden min-h-[640px] p-4 md:p-6 gap-6">
        
        {/* LEFT SIDE: Form & Branding (Structured exactly like reference image) */}
        <div className="w-full lg:w-[54%] p-6 md:p-8 flex flex-col justify-between relative z-10">
          
          {/* Logo & Header Row */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.3)]">
                  <Music size={18} className="text-white" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">NadaKita</span>
              </div>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-orange-500 transition-colors font-bold text-xs uppercase tracking-wider"
              >
                <ArrowLeft size={14} />
                Kembali
              </Link>
            </div>

            {/* Title Block */}
            <div className="mb-6">
              <h2 className="text-3xl font-black text-white tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 leading-none">
                Masuk ke Akun
              </h2>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Mulai menjelajah dan wujudkan impian audio profesional Anda hari ini.
              </p>
            </div>

            {/* Global Error Banner */}
            {globalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded-xl flex items-center gap-2.5"
              >
                <Sparkles size={16} className="shrink-0" />
                <span className="font-semibold text-xs">{globalError}</span>
              </motion.div>
            )}

            {/* Forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  noValidate
                  className={`w-full px-4 py-3.5 bg-zinc-900/40 border ${
                    combinedErrors.email ? 'border-red-500/50 focus:border-red-500 bg-red-950/5' : 'border-zinc-800 focus:border-orange-500/50'
                  } rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 placeholder-zinc-650 text-white font-medium transition-all text-xs md:text-sm`}
                  placeholder="nama@email.com"
                />
                {combinedErrors.email && (
                  <p className="text-[11px] font-semibold text-red-400 ml-1">
                    {combinedErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-bold text-orange-400 hover:text-orange-350 transition-colors"
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
                    className={`w-full px-4 py-3.5 bg-zinc-900/40 border ${
                      combinedErrors.password ? 'border-red-500/50 focus:border-red-500 bg-red-950/5' : 'border-zinc-800 focus:border-orange-500/50'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 placeholder-zinc-650 text-white font-medium transition-all text-xs md:text-sm pr-11`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-orange-450 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {combinedErrors.password && (
                  <p className="text-[11px] font-semibold text-red-400 ml-1">
                    {combinedErrors.password[0]}
                  </p>
                )}
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center gap-2 ml-1 py-0.5">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-orange-600 focus:ring-orange-500/30 focus:ring-offset-0 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-[11px] text-zinc-400 font-semibold select-none cursor-pointer hover:text-white transition-colors"
                >
                  Ingat saya di perangkat ini
                </label>
              </div>

              {/* Action Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_25px_rgba(234,88,12,0.25)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group tracking-wider text-xs md:text-sm"
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
                      <span className="z-10 tracking-widest uppercase">MASUK SEKARANG</span>
                      <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform skew-x-12 duration-500"></div>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center text-xs border-t border-zinc-900/60 pt-4">
            <span className="text-zinc-500 font-medium">Belum punya akun?</span>{' '}
            <Link
              to="/register"
              className="text-orange-400 font-black hover:text-orange-350 hover:underline underline-offset-4 decoration-2 transition-colors ml-1"
            >
              Daftar di sini
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: Gorgeous Testimonial Card with Slider Controls (Recreated exactly like reference image) */}
        <div className="w-full lg:w-[46%] rounded-[2rem] overflow-hidden relative flex flex-col justify-between p-8 shrink-0 min-h-[500px]">
          
          {/* Background Slide Image with Crossfade Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-[0.20]"
              style={{ backgroundImage: `url('${promoSlides[activeSlide].image}')` }}
            ></motion.div>
          </AnimatePresence>

          {/* Custom Linear Dark-Orange Background tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#050505]/95 via-[#0A0A0A]/90 to-orange-950/20 pointer-events-none z-0"></div>

          {/* Top Row: Tags Pills */}
          <div className="flex flex-wrap gap-2 relative z-10">
            {promoSlides[activeSlide].tags.map((tag, index) => (
              <span
                key={index}
                className="px-3.5 py-1.5 bg-zinc-900/60 border border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-300 rounded-full backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom Row: Testimonial & Custom Rounded Arrow Notch Offset */}
          <div className="relative z-10 flex flex-col gap-4">
            
            {/* Dark glassmorphic testimonial card */}
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-black/60 backdrop-blur-xl border border-zinc-900 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Poetic quote */}
              <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-medium italic mb-4">
                &ldquo;{promoSlides[activeSlide].text}&rdquo;
              </p>

              {/* Quote Author */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider leading-tight">
                    {promoSlides[activeSlide].author}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-bold">
                    {promoSlides[activeSlide].role}
                  </span>
                </div>

                {/* Inline Slider Arrow buttons inside bottom right testimonial block */}
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    type="button"
                    className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Previous Slide"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    type="button"
                    className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Next Slide"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage;
