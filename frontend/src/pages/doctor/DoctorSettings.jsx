import { useState } from 'react'
import { Camera, CheckCircle2, Lock, Mail, Phone, Shield, User } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'

export function DoctorSettings() {
  const [avatar, setAvatar] = useState('')
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' })
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('profile')

  function handleChangePassword() {
    setError('')
    if (!passForm.oldPass || !passForm.newPass || !passForm.confirmPass) {
      setError('Vui lòng điền đầy đủ các trường')
      return
    }
    if (passForm.oldPass !== '123456') {
      setError('Mật khẩu cũ không chính xác')
      return
    }
    if (passForm.newPass !== passForm.confirmPass) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    setToast('Đã cập nhật mật khẩu thành công')
    setPassForm({ oldPass: '', newPass: '', confirmPass: '' })
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Hồ sơ cá nhân" subtitle="Quản lý thông tin và bảo mật tài khoản bác sĩ." />

        <div className="grid gap-7 xl:grid-cols-[300px_1fr]">
          {/* Left: Profile card */}
          <div className="flex flex-col gap-5">
            <Card className="text-center">
              <div className="relative mx-auto w-28 h-28 mb-4">
                <div className="w-28 h-28 rounded-full bg-teal-100 flex items-center justify-center text-4xl font-black text-teal-700 overflow-hidden">
                  {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <span>DA</span>}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition shadow">
                  <Camera size={14} className="text-white" />
                  <input hidden type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setAvatar(URL.createObjectURL(file))
                  }} />
                </label>
              </div>
              <h2 className="text-xl font-black text-slate-800">Dr. Alexander</h2>
              <p className="text-sm text-teal-600 font-medium mt-1">Bác sĩ tư vấn</p>
              <p className="text-xs text-slate-400 mt-1">alexander@medconsult.vn</p>
              <div className="mt-5 pt-4 border-t border-slate-100 grid gap-3 text-left">
                <InfoRow icon={<Phone size={15} />} label="0909 555 221" />
                <InfoRow icon={<Mail size={15} />} label="alexander@medconsult.vn" />
                <InfoRow icon={<Shield size={15} />} label="12 năm kinh nghiệm" />
              </div>
            </Card>

            {/* Stats sidebar */}
            <Card>
              <h3 className="text-sm font-bold text-slate-600 mb-4">Thống kê tháng này</h3>
              <div className="grid gap-3">
                <StatRow label="Ca đã tư vấn" value="248" color="teal" />
                <StatRow label="Đánh giá TB" value="4.8 ★" color="amber" />
                <StatRow label="Thời gian TB/ca" value="18 phút" color="blue" />
              </div>
            </Card>
          </div>

          {/* Right: Tabbed content */}
          <Card>
            <div className="tabs mb-6">
              <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
                <User size={15} className="inline mr-1.5" />Thông tin cá nhân
              </button>
              <button className={tab === 'security' ? 'active' : ''} onClick={() => setTab('security')}>
                <Lock size={15} className="inline mr-1.5" />Bảo mật
              </button>
            </div>

            {tab === 'profile' && (
              <div className="grid gap-5 sm:grid-cols-2">
                <EditField label="Họ tên" defaultValue="Dr. Alexander" />
                <EditField label="Tuổi" defaultValue="38" />
                <EditField label="Số điện thoại" defaultValue="0909 555 221" />
                <EditField label="Chức vụ" defaultValue="Bác sĩ tư vấn" />
                <EditField label="Email" defaultValue="alexander@medconsult.vn" />
                <EditField label="Kinh nghiệm" defaultValue="12 năm" />
                <div className="sm:col-span-2 flex justify-end pt-2">
                  <Button onClick={() => {
                    setToast('Đã lưu thông tin thành công')
                    window.setTimeout(() => setToast(''), 2200)
                  }}>Lưu thay đổi</Button>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="max-w-md grid gap-5">
                <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-700">
                  <b>Mật khẩu demo:</b> <code className="bg-white px-2 py-0.5 rounded font-mono">123456</code>
                </div>
                <label className="block">
                  <span className="field-label">Mật khẩu cũ</span>
                  <input className="input" type="password" value={passForm.oldPass} onChange={e => setPassForm({...passForm, oldPass: e.target.value})} placeholder="Nhập mật khẩu hiện tại..." />
                </label>
                <label className="block">
                  <span className="field-label">Mật khẩu mới</span>
                  <input className="input" type="password" value={passForm.newPass} onChange={e => setPassForm({...passForm, newPass: e.target.value})} placeholder="Nhập mật khẩu mới..." />
                </label>
                <label className="block">
                  <span className="field-label">Xác nhận mật khẩu mới</span>
                  <input className="input" type="password" value={passForm.confirmPass} onChange={e => setPassForm({...passForm, confirmPass: e.target.value})} placeholder="Nhập lại mật khẩu mới..." />
                </label>
                {error && <p className="text-red-500 text-sm flex items-center gap-1.5">⚠ {error}</p>}
                <Button onClick={handleChangePassword}>Cập nhật mật khẩu</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}

function InfoRow({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="text-teal-500">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function StatRow({ label, value, color }) {
  const colors = { teal: 'text-teal-600', amber: 'text-amber-500', blue: 'text-blue-600' }
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`font-bold text-sm ${colors[color]}`}>{value}</span>
    </div>
  )
}

function EditField({ label, defaultValue }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="input" defaultValue={defaultValue} />
    </label>
  )
}
