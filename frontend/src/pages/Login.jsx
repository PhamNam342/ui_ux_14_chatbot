import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Lock, User, Eye, EyeOff, AlertCircle, Loader2, KeyRound } from 'lucide-react'
import { Logo } from '../components/ui.jsx'

const roleConfigs = {
  admin: {
    title: 'Quản trị viên',
    subtitle: 'Quản trị phòng khám, bác sĩ, lịch khám và báo cáo.',
    bgGrad: 'bg-[radial-gradient(circle_at_top_left,#d9f8ef_0,#f8fafc_45%,#ffffff_100%)]',
    accentGrad: 'from-teal-500 to-emerald-400',
    accentText: 'text-teal-600',
    focusRing: 'focus:border-teal-500 focus:ring-teal-500/10',
    buttonBg: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20',
    glyph: 'A',
    demoUser: 'admin',
    demoPass: 'admin',
    redirectPath: '/admin'
  },
  doctor: {
    title: 'Bác sĩ chuyên khoa',
    subtitle: 'Theo dõi ca bệnh, tư vấn trực tuyến và đơn thuốc.',
    bgGrad: 'bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#f8fafc_45%,#ffffff_100%)]',
    accentGrad: 'from-cyan-500 to-teal-500',
    accentText: 'text-cyan-600',
    focusRing: 'focus:border-cyan-500 focus:ring-cyan-500/10',
    buttonBg: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20',
    glyph: 'D',
    demoUser: 'doctor',
    demoPass: 'doctor',
    redirectPath: '/doctor'
  },
  advisor: {
    title: 'Cố vấn y khoa',
    subtitle: 'Quản lý dữ liệu y khoa và kiểm thử chatbot chẩn đoán.',
    bgGrad: 'bg-[radial-gradient(circle_at_top_left,#e8f8f0_0,#f8fafc_45%,#ffffff_100%)]',
    accentGrad: 'from-emerald-500 to-lime-400',
    accentText: 'text-emerald-600',
    focusRing: 'focus:border-emerald-500 focus:ring-emerald-500/10',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
    glyph: 'V',
    demoUser: 'advisor',
    demoPass: 'advisor',
    redirectPath: '/advisor'
  },
  patient: {
    title: 'Bệnh nhân',
    subtitle: 'Đặt lịch khám, tư vấn trực tuyến và theo dõi toàn bộ lịch sử điều trị cá nhân.',
    bgGrad: 'bg-[radial-gradient(circle_at_top_left,#f5f3ff_0,#f8fafc_45%,#ffffff_100%)]',
    accentGrad: 'from-violet-500 to-fuchsia-400',
    accentText: 'text-violet-600',
    focusRing: 'focus:border-violet-500 focus:ring-violet-500/10',
    buttonBg: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20',
    glyph: 'P',
    demoUser: 'benhnhan01',
    demoPass: '123456',
    redirectPath: '/patient'
  }
}

export function Login() {
  const { role } = useParams()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Validate role URL
  const config = roleConfigs[role]

  useEffect(() => {
    if (!config) {
      navigate('/', { replace: true })
    }
  }, [role, config, navigate])

  if (!config) return null

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.')
      return
    }

    if (username.trim() !== config.demoUser || password !== config.demoPass) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác cho vai trò này.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate(config.redirectPath)
    }, 850)
  }

  const fillDemoCredentials = () => {
    setUsername(config.demoUser)
    setPassword(config.demoPass)
    setError('')
  }

  return (
    <main className={`relative min-h-screen ${config.bgGrad} flex flex-col justify-between px-5 py-8 text-slate-900 overflow-hidden`}>
      {/* Decorative Blur Spots */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br ${config.accentGrad} opacity-15 blur-3xl -z-10`} />

      <div className="mx-auto flex w-full max-w-md flex-col flex-1 justify-center py-6">
        {/* Top Header Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Login Card */}
        <div className="relative bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-2xl p-8 w-full transition-all duration-300">
          {/* Top Decorative Line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${config.accentGrad}`} />

          {/* Role Glyph Indicator */}
          <div className="flex justify-center -mt-16 mb-5">
            <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${config.accentGrad} text-3xl font-black text-white shadow-lg border-4 border-white`}>
              {config.glyph}
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black tracking-tight">Đăng nhập</h1>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Vai trò: {config.title}</p>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{config.subtitle}</p>
          </div>

          {/* Error message block */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all bg-white/70 ${config.focusRing} disabled:opacity-50`}
                  placeholder={`VD: ${config.demoUser}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                  className={`w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all bg-white/70 ${config.focusRing} disabled:opacity-50`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password Links */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 select-none">
                <input
                  type="checkbox"
                  className={`rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 h-4 w-4`}
                />
                <span>Nhớ tài khoản</span>
              </label>
              <a href="#" className={`font-semibold hover:underline ${config.accentText}`}>
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-extrabold shadow-lg transition-all duration-150 transform active:scale-[0.98] ${config.buttonBg} disabled:opacity-75 disabled:pointer-events-none cursor-pointer`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Tooltip */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full group flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all text-center cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                Trải nghiệm nhanh? Click tự động điền tài khoản:
              </span>
              <span className={`text-sm font-extrabold ${config.accentText} bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm`}>
                {config.demoUser} / {config.demoPass}
              </span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại chọn vai trò</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
