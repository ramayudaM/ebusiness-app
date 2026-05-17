import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Music, Headphones, ShieldCheck, Sparkles, User, Mail, Lock } from 'lucide-react'

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
    color: 'bg-zinc-800',
  })
  const [localErrors, setLocalErrors] = useState({})

  // Interactive Promo Slide State
  const [activeSlide, setActiveSlide] = useState(0)

  const promoSlides = [
    {
      text: "Menjadi member NadaKita memberikan saya diskon eksklusif dan rekomendasi instrumen berbasis AI. Sangat membantu musisi!",
      author: "Rina Septiani",
      role: "Pianis Profesional",
      tags: ["Diskon Member", "Rekomendasi AI"],
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200"
    },
    {
      text: "Dukungan konsultasi audio 24/7 sangat membantu saya menentukan spesifikasi mixer studio yang tepat. Luar biasa!",
      author: "Dian Nugraha",
      role: "Sound Engineer",
      tags: ["Free Consultation", "Layanan Priority"],
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=1200"
    }
  ]

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % promoSlides.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
  }

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
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-orange-500/30">
      {/* Signature Global Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-700/5 blur-[150px] pointer-events-none z-0"></div>

      {/* Unified Card Container */}
      <div className="w-full max-w-5xl bg-[#0A0A0A]/90 backdrop-blur-2xl border border-zinc-900 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row relative z-10 overflow-hidden min-h-[640px] p-4 md:p-6 gap-6">
        
        {/* LEFT SIDE: Registration Form */}
        <div className="w-full lg:w-[54%] p-4 md:p-6 flex flex-col justify-between relative z-10">
          
          {/* Logo & Header Row */}
          <div>
            <div className="flex items-center justify-between mb-5">
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
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1.5 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 leading-none">
                Daftar Akun Baru
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                Bergabunglah dengan ekosistem audio profesional kami.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1 block">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    noValidate
                    className={`w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border ${
                      combinedErrors.name ? 'border-red-500/50 focus:border-red-500 bg-red-950/5' : 'border-zinc-800 focus:border-orange-500/50'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 placeholder-zinc-650 text-white font-medium transition-all text-xs`}
                    placeholder="Contoh: Andi Wijaya"
                  />
                </div>
                {combinedErrors.name && (
                  <p className="text-[11px] font-semibold text-red-400 ml-1">
                    {combinedErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1 block">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    noValidate
                    className={`w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border ${
                      combinedErrors.email ? 'border-red-500/50 focus:border-red-500 bg-red-950/5' : 'border-zinc-800 focus:border-orange-500/50'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 placeholder-zinc-650 text-white font-medium transition-all text-xs`}
                    placeholder="nama@email.com"
                  />
                </div>
                {combinedErrors.email && (
                  <p className="text-[11px] font-semibold text-red-400 ml-1">
                    {combinedErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1 block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    noValidate
                    className={`w-full pl-10 pr-11 py-2.5 bg-zinc-900/40 border ${
                      combinedErrors.password ? 'border-red-500/50 focus:border-red-500 bg-red-950/5' : 'border-zinc-800 focus:border-orange-500/50'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 placeholder-zinc-650 text-white font-medium transition-all text-xs`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-orange-450 transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {combinedErrors.password && (
                  <p className="text-[11px] font-semibold text-red-400 ml-1">
                    {combinedErrors.password[0]}
                  </p>
                )}

                {/* Password Strength Indicator */}
                <div className="space-y-0.5 pt-0.5">
                  <div className="flex gap-1">
                    <div
                      className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                        passwordStrength.score >= 1 ? passwordStrength.color : 'bg-zinc-850'
                      }`}
                    ></div>
                    <div
                      className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                        passwordStrength.score >= 3 ? passwordStrength.color : 'bg-zinc-850'
                      }`}
                    ></div>
                    <div
                      className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                        passwordStrength.score >= 5 ? passwordStrength.color : 'bg-zinc-850'
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] uppercase tracking-wider text-zinc-500 font-extrabold px-0.5">
                    <span>KEKUATAN PASSWORD</span>
                    <span className={passwordStrength.score > 0 ? 'text-zinc-300' : ''}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1 block">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    noValidate
                    className={`w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border ${
                      combinedErrors.password_confirmation ? 'border-red-500/50 focus:border-red-500 bg-red-950/5' : 'border-zinc-800 focus:border-orange-500/50'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 placeholder-zinc-650 text-white font-medium transition-all text-xs`}
                    placeholder="••••••••"
                  />
                </div>
                {combinedErrors.password_confirmation && (
                  <p className="text-[11px] font-semibold text-red-400 ml-1">
                    {combinedErrors.password_confirmation[0]}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 py-1 ml-1">
                <input
                  type="checkbox"
                  name="agree_terms"
                  id="agree_terms"
                  checked={formData.agree_terms}
                  onChange={handleChange}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-900 text-orange-600 focus:ring-orange-500/30 focus:ring-offset-0 focus:ring-2 cursor-pointer"
                  required
                />
                <label htmlFor="agree_terms" className="text-[9px] md:text-[10px] text-zinc-400 leading-normal font-medium">
                  Saya menyetujui <span className="text-orange-400 font-bold hover:underline cursor-pointer">Syarat & Ketentuan</span> dan <span className="text-orange-400 font-bold hover:underline cursor-pointer">Kebijakan Privasi</span> NadaKita.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading || !formData.agree_terms}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_25px_rgba(234,88,12,0.25)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group tracking-wider text-xs md:text-sm"
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
                      <span className="z-10 tracking-widest uppercase">DAFTAR SEKARANG</span>
                      <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform skew-x-12 duration-500"></div>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center text-xs border-t border-zinc-900/60 pt-4">
            <span className="text-zinc-500 font-medium">Sudah punya akun?</span>{' '}
            <Link
              to="/login"
              className="text-orange-400 font-black hover:text-orange-355 hover:underline underline-offset-4 decoration-2 transition-colors ml-1"
            >
              Masuk di sini
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: Testimonials slider card */}
        <div className="w-full lg:w-[46%] rounded-[2rem] overflow-hidden relative flex flex-col justify-between p-8 shrink-0 min-h-[500px]">
          
          {/* Background Slide Image with Crossfade */}
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

          {/* Bottom Row: Testimonial & Slide controls */}
          <div className="relative z-10 flex flex-col gap-4">
            
            {/* Dark glassmorphic testimonial card */}
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-black/60 backdrop-blur-xl border border-zinc-900 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Quote */}
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

                {/* Inline Slider Arrow buttons inside testimonial block */}
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

export default RegisterPage
