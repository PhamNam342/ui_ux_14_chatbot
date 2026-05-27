import { useState } from 'react'
import { ArrowLeft, CalendarDays, Eye, EyeOff, Loader2, Lock, Phone, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui.jsx'

export function PatientRegister() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getPasswordStrength = (value) => {
    if (!value) return { label: 'Chưa nhập', score: 0, barClass: 'bg-slate-200' }

    let score = 0
    if (value.length >= 6) score += 1
    if (/[A-Z]/.test(value) || /[a-z]/.test(value)) score += 1
    if (/\d/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1
    if (value.length >= 10) score += 1

    if (score <= 2) return { label: 'Yếu', score: 1, barClass: 'bg-rose-500' }
    if (score <= 4) return { label: 'Vừa', score: 2, barClass: 'bg-amber-500' }
    return { label: 'Mạnh', score: 3, barClass: 'bg-emerald-500' }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!phone.trim() || !fullName.trim() || !dob || !password.trim()) {
      setError('Vui lòng điền đầy đủ số điện thoại, tên, ngày sinh và mật khẩu.')
      return
    }

    if (!/^0\d{9}$/.test(phone.trim())) {
      setError('Số điện thoại chưa đúng định dạng (VD: 0912345678).')
      return
    }

    if (password.trim().length < 6) {
      setError('Mật khẩu cần có ít nhất 6 ký tự.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/login/patient')
    }, 900)
  }

  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,#f5f3ff_0,#f8fafc_45%,#ffffff_100%)] flex flex-col justify-between px-5 py-8 text-slate-900 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 opacity-15 blur-3xl -z-10" />

      <div className="mx-auto flex w-full max-w-md flex-col flex-1 justify-center py-6">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="relative bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-2xl p-8 w-full transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-violet-500 to-fuchsia-400" />

          <div className="relative z-10 flex justify-center -mt-16 mb-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-3xl font-black text-white shadow-lg border-4 border-white">
              P
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black tracking-tight">Đăng ký bệnh nhân</h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Tạo tài khoản theo số điện thoại để bắt đầu đặt lịch khám và tư vấn trực tuyến.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all bg-white/70 focus:border-violet-500 focus:ring-violet-500/10 disabled:opacity-50"
                  placeholder="VD: 0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserRound size={18} />
                </div>
                <input
                  type="text"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all bg-white/70 focus:border-violet-500 focus:ring-violet-500/10 disabled:opacity-50"
                  placeholder="VD: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Ngày sinh
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CalendarDays size={18} />
                </div>
                <input
                  type="date"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all bg-white/70 focus:border-violet-500 focus:ring-violet-500/10 disabled:opacity-50"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all bg-white/70 focus:border-violet-500 focus:ring-violet-500/10 disabled:opacity-50"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Độ mạnh mật khẩu</span>
                  <span
                    className={
                      passwordStrength.score === 1
                        ? 'font-semibold text-rose-500'
                        : passwordStrength.score === 2
                          ? 'font-semibold text-amber-600'
                          : passwordStrength.score === 3
                            ? 'font-semibold text-emerald-600'
                            : 'font-semibold text-slate-400'
                    }
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.barClass}`}
                    style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-extrabold shadow-lg transition-all duration-150 transform active:scale-[0.98] bg-violet-600 hover:bg-violet-700 shadow-violet-600/20 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <span>Đăng ký</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-slate-500">Đã có tài khoản? </span>
            <Link to="/login/patient" className="font-semibold text-violet-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/login/patient')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại đăng nhập bệnh nhân</span>
          </button>
        </div>
      </div>
    </main>
  )
}
