import { useState, useEffect } from 'react'
import {
  Camera, CheckCircle2, Lock, User, Phone, Mail,
  Stethoscope, BadgeCheck, Shield, Eye, EyeOff,
  Award, Building2, Star,
} from 'lucide-react'
import { AppShell, TopBar } from '../../components/ui.jsx'
import { getStoredProfile, saveStoredProfile } from '../../data/doctorStore.js'

export function DoctorProfile() {
  const [profile, setProfile] = useState({})
  const [avatar, setAvatar] = useState('')
  const [toast, setToast] = useState('')
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' })
  const [passError, setPassError] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setProfile(getStoredProfile())
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    saveStoredProfile(profile)
    showToast('Đã cập nhật hồ sơ cá nhân thành công!')
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    setPassError('')
    if (!passForm.oldPass || !passForm.newPass || !passForm.confirmPass) {
      setPassError('Vui lòng nhập đầy đủ các trường mật khẩu.')
      return
    }
    if (passForm.oldPass !== 'doctor') {
      setPassError('Mật khẩu cũ không chính xác.')
      return
    }
    if (passForm.newPass !== passForm.confirmPass) {
      setPassError('Mật khẩu xác nhận không trùng khớp.')
      return
    }
    setPassForm({ oldPass: '', newPass: '', confirmPass: '' })
    showToast('Đã cập nhật mật khẩu tài khoản thành công!')
  }

  return (
    <AppShell role="doctor">
      <TopBar />

      <div className="px-6 pb-8 max-w-5xl space-y-6">

        {/* Page header */}
        <div className="pt-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <User size={24} className="text-teal-600" />
            Hồ sơ bác sĩ
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý thông tin cá nhân, chuyên khoa và bảo mật tài khoản</p>
        </div>

        {/* Profile card with avatar */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-extrabold overflow-hidden shadow-lg border-4 border-white/30">
              {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : <span>{(profile.name || 'DA').split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()}</span>
              }
            </div>
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-teal-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-50 transition shadow-md">
              <Camera size={14} />
              <input hidden type="file" accept="image/*" onChange={e => {
                const f = e.target.files?.[0]
                if (f) setAvatar(URL.createObjectURL(f))
              }} />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold">{profile.name || 'Dr. Alexander'}</h2>
            <p className="text-teal-100 mt-0.5 text-sm">{profile.spec || 'Chuyên khoa Nội tổng hợp'}</p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              {profile.degree && (
                <span className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <Award size={12} /> {profile.degree}
                </span>
              )}
              {profile.exp && (
                <span className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <Star size={12} /> {profile.exp}
                </span>
              )}
              {profile.clinic && (
                <span className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <Building2 size={12} /> {profile.clinic}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="text-center bg-white/10 rounded-xl px-5 py-3">
            <div className="text-3xl font-extrabold">4.9</div>
            <div className="text-amber-300 text-sm">★★★★★</div>
            <div className="text-teal-100 text-xs mt-0.5">Đánh giá</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left: Profile form */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Stethoscope size={18} className="text-teal-600" />
                Thông tin chuyên khoa
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label text-xs">Họ và tên bác sĩ</label>
                    <input className="input" value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label text-xs">Chuyên khoa</label>
                    <input className="input" value={profile.spec || ''} onChange={e => setProfile({ ...profile, spec: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label text-xs">Học vị / Học hàm</label>
                    <input className="input" value={profile.degree || ''} onChange={e => setProfile({ ...profile, degree: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label text-xs">Mã chứng chỉ hành nghề</label>
                    <input className="input" value={profile.certificate || ''} disabled onChange={e => setProfile({ ...profile, certificate: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="field-label text-xs">Kinh nghiệm lâm sàng</label>
                  <input className="input" value={profile.exp || ''} onChange={e => setProfile({ ...profile, exp: e.target.value })} placeholder="VD: 8 năm kinh nghiệm" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label text-xs"><Phone size={11} className="inline mr-1" />SĐT liên hệ</label>
                    <input className="input" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label text-xs"><Mail size={11} className="inline mr-1" />Email</label>
                    <input className="input" type="email" value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer">
                    Lưu hồ sơ
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Security */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock size={18} className="text-teal-600" />
                Bảo mật tài khoản
              </h3>

              <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-xs text-teal-800 mb-5 flex items-start gap-2">
                <Shield size={14} className="text-teal-600 shrink-0 mt-0.5" />
                <span>Mật khẩu mặc định: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">doctor</code></span>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { label: 'Mật khẩu hiện tại', field: 'oldPass', show: showOld, toggle: setShowOld },
                  { label: 'Mật khẩu mới', field: 'newPass', show: showNew, toggle: setShowNew },
                  { label: 'Xác nhận mật khẩu mới', field: 'confirmPass', show: showConfirm, toggle: setShowConfirm },
                ].map(({ label, field, show, toggle }) => (
                  <div key={field}>
                    <label className="field-label text-xs">{label}</label>
                    <div className="relative">
                      <input
                        type={show ? 'text' : 'password'}
                        className="input pr-10"
                        placeholder="••••••••"
                        value={passForm[field]}
                        onChange={e => setPassForm({ ...passForm, [field]: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        onClick={() => toggle(v => !v)}
                      >
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}

                {passError && (
                  <p className="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    ⚠ {passError}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer">
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>

            {/* Account info card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Thông tin tài khoản</h4>
              {[
                { label: 'Email đăng nhập', value: profile.email || 'alexander@medconsult.vn', icon: <Mail size={13} /> },
                { label: 'Phòng khám', value: profile.clinic || 'MedConsult Online', icon: <Building2 size={13} /> },
                { label: 'Chứng chỉ hành nghề', value: profile.certificate || 'VN-BS-2019-5821', icon: <BadgeCheck size={13} /> },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-teal-500">{item.icon}</span>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">{item.label}</div>
                    <div className="text-sm text-slate-700 font-semibold">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast toast-green">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}
    </AppShell>
  )
}
