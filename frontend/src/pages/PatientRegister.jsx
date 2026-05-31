import { useState } from 'react'
import { ArrowLeft, CalendarDays, CalendarHeart, Eye, EyeOff, Loader2, Lock, Phone, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui.jsx'
import heroImage from '../assets/medical-ai-hero.png'

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d9f8ef_0,#f8fafc_45%,#ffffff_100%)] px-5 py-6 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-7xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex flex-col px-6 py-7 sm:px-10 lg:px-12">
          <Logo />

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 motion-safe:animate-[fadeUp_.7s_ease-out_both]">
            <button
              type="button"
              onClick={() => navigate('/login/patient')}
              className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              <span>Quay lại đăng nhập</span>
            </button>

            <div className="mb-6 grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-lg">
              <CalendarHeart size={27} strokeWidth={2.4} />
            </div>

            <div className="mb-7">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-teal-700">Tài khoản bệnh nhân</p>
              <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-950">Đăng ký MedConsult</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Tạo tài khoản theo số điện thoại để bắt đầu đặt lịch khám và tư vấn trực tuyến.
              </p>
            </div>

          {error && (
            <div className="mb-5 rounded-lg bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600">
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 transition-all bg-white focus:border-teal-500 focus:ring-teal-500/10 disabled:opacity-50"
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 transition-all bg-white focus:border-teal-500 focus:ring-teal-500/10 disabled:opacity-50"
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 transition-all bg-white focus:border-teal-500 focus:ring-teal-500/10 disabled:opacity-50"
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
                  className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 transition-all bg-white focus:border-teal-500 focus:ring-teal-500/10 disabled:opacity-50"
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-extrabold shadow-lg transition-all duration-150 transform active:scale-[0.98] bg-teal-700 hover:bg-teal-800 shadow-teal-700/20 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
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
            <Link to="/login/patient" className="font-semibold text-teal-700 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
          </div>
        </section>

        <section className="relative hidden min-h-full overflow-hidden bg-slate-950 lg:block">
          <img src={heroImage} alt="Bác sĩ tư vấn cùng trợ lý AI y tế" className="absolute inset-0 h-full w-full object-cover object-[72%_center]" />
          <div className="absolute inset-0 bg-teal-950/8" />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(15,118,110,0.02),rgba(15,23,42,0.12))]" />
          <div className="absolute inset-x-10 top-10 flex items-center justify-between text-white/85">
            <span className="text-sm font-extrabold uppercase tracking-[0.18em]">MedConsult</span>
            <span className="rounded-lg border border-white/25 px-3 py-2 text-xs font-bold">Bệnh nhân</span>
          </div>

          <div className="absolute bottom-10 left-10 right-10">
            <div className="max-w-xl rounded-lg border border-white/25 bg-white/92 p-6 text-slate-900 shadow-2xl backdrop-blur motion-safe:animate-[fadeUp_.8s_ease-out_both]">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 text-white">
                  <CalendarHeart size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Hồ sơ sức khỏe cá nhân</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Đặt lịch, nhận tư vấn và theo dõi lịch sử điều trị trong một tài khoản bảo mật.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
