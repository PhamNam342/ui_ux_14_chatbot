import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Lock, User, Eye, EyeOff, AlertCircle, Loader2, KeyRound, ShieldCheck, Stethoscope, DatabaseZap, CalendarHeart } from 'lucide-react'
import { Logo } from '../components/ui.jsx'
import heroImage from '../assets/medical-ai-hero.png'

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
    Icon: ShieldCheck,
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
    Icon: Stethoscope,
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
    Icon: DatabaseZap,
    demoUser: 'advisor',
    demoPass: 'advisor',
    redirectPath: '/advisor'
  },
  patient: {
    title: 'Bệnh nhân',
    subtitle: 'Đặt lịch khám, tư vấn trực tuyến và theo dõi toàn bộ lịch sử điều trị cá nhân.',
    bgGrad: 'bg-[radial-gradient(circle_at_top_left,#d9f8ef_0,#f8fafc_45%,#ffffff_100%)]',
    accentGrad: 'from-teal-600 to-emerald-500',
    accentText: 'text-teal-700',
    focusRing: 'focus:border-teal-500 focus:ring-teal-500/10',
    buttonBg: 'bg-teal-700 hover:bg-teal-800 shadow-teal-700/20',
    glyph: 'P',
    Icon: CalendarHeart,
    demoUser: 'benhnhan01',
    demoPass: '123456',
    redirectPath: '/patient'
  }
}

const roleOptions = [
  { key: 'patient', label: 'Patient' },
  { key: 'admin', label: 'Admin' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'advisor', label: 'Advisor' },
]

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
  const clearFormState = () => {
    setUsername('')
    setPassword('')
    setError('')
    setShowPassword(false)
  }

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
    <main className={`min-h-screen ${config.bgGrad} px-5 py-6 text-slate-900`}>
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-7xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex flex-col px-6 py-6 sm:px-10 lg:px-12">
          <Logo />

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-5">
            <Link
              to="/"
              className="mb-5 inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </Link>

            <div className="mb-4">
              <h1 className="text-3xl font-black tracking-normal text-slate-950">Đăng nhập</h1>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Vai trò
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {roleOptions.map((item) => {
                  const itemConfig = roleConfigs[item.key]
                  const ItemIcon = itemConfig.Icon
                  const active = role === item.key

                  return (
                    <Link
                      key={item.key}
                      to={`/login/${item.key}`}
                      onClick={item.key === role ? undefined : clearFormState}
                      className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-lg border px-2 text-base font-black transition ${
                        active
                          ? `border-transparent bg-gradient-to-br ${itemConfig.accentGrad} text-white shadow-lg`
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <ItemIcon size={22} strokeWidth={2.4} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

          {/* Error message block */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
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
                  className={`w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 transition-all bg-white ${config.focusRing} disabled:opacity-50`}
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
                  className={`w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 transition-all bg-white ${config.focusRing} disabled:opacity-50`}
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

            {role === 'patient' && (
              <div className="pt-1 text-sm text-center">
                <span className="text-slate-500">Chưa có tài khoản? </span>
                <Link to="/register/patient" className={`font-semibold hover:underline ${config.accentText}`}>
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white font-extrabold shadow-lg transition-all duration-150 transform active:scale-[0.98] ${config.buttonBg} disabled:opacity-75 disabled:pointer-events-none cursor-pointer`}
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

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="mt-3 inline-flex w-full items-center justify-between gap-3 border-t border-slate-100 pt-3 text-left text-xs font-bold text-slate-400 transition hover:text-teal-700"
          >
            <span>Tài khoản demo</span>
            <span className="font-extrabold text-teal-700">{config.demoUser} / {config.demoPass}</span>
          </button>

          </div>
        </section>

        <section className="relative hidden min-h-full overflow-hidden bg-slate-950 lg:block">
          <img src={heroImage} alt="Bác sĩ tư vấn cùng trợ lý AI y tế" className="absolute inset-0 h-full w-full object-cover object-[72%_center]" />
          <div className="absolute inset-0 bg-teal-950/8" />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(15,118,110,0.02),rgba(15,23,42,0.12))]" />
          <div className="absolute inset-x-10 top-10 flex items-center justify-between text-white/85">
            <span className="text-sm font-extrabold uppercase tracking-[0.18em]">MedConsult</span>
            <span className="rounded-lg border border-white/25 px-3 py-2 text-xs font-bold">{config.title}</span>
          </div>
        </section>
      </div>
    </main>
  )
}
