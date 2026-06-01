import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Camera, CheckCircle2, Lock, Mail, Phone, Shield, User, Calendar, Clock, ClipboardList, Plus, Trash2 } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, TopBar, Badge } from '../../components/ui.jsx'
import { getStoredProfile, saveStoredProfile, getStoredLeaves, saveStoredLeaves } from '../../data/doctorStore.js'

export function DoctorSettings() {
  const location = useLocation()
  const [tab, setTab] = useState(() => location.state?.tab || 'profile') // 'profile', 'work', 'leaves', 'security'
  const [profile, setProfile] = useState({})
  const [leaves, setLeaves] = useState([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (location.state?.tab) {
      setTab(location.state.tab)
    }
  }, [location.state?.tab])

  // Profile forms
  const [avatar, setAvatar] = useState('')

  // Shift/Workday config states (mock defaults)
  const [workDays, setWorkDays] = useState({
    'Thứ 2': { morning: true, afternoon: true, evening: false },
    'Thứ 3': { morning: false, afternoon: true, evening: true },
    'Thứ 4': { morning: true, afternoon: true, evening: false },
    'Thứ 5': { morning: true, afternoon: false, evening: true },
    'Thứ 6': { morning: false, afternoon: true, evening: false },
    'Thứ 7': { morning: true, afternoon: false, evening: false },
    'CN': { morning: false, afternoon: false, evening: false }
  })

  // Leave Form states
  const [leaveStart, setLeaveStart] = useState('')
  const [leaveEnd, setLeaveEnd] = useState('')
  const [leaveReason, setLeaveReason] = useState('')

  // Password forms
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' })
  const [passError, setPassError] = useState('')

  // Load storage details
  useEffect(() => {
    setProfile(getStoredProfile())
    setLeaves(getStoredLeaves())
  }, [])

  // Handle profile edit save
  const handleSaveProfile = (e) => {
    e.preventDefault()
    saveStoredProfile(profile)
    setToast('Đã cập nhật hồ sơ cá nhân thành công!')
    setTimeout(() => setToast(''), 2000)
  }

  // Handle shift changes
  const handleToggleShift = (day, shift) => {
    setWorkDays(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [shift]: !prev[day][shift]
      }
    }))
  }

  const handleSaveShifts = () => {
    localStorage.setItem('med_doctor_shifts', JSON.stringify(workDays))
    setToast('Đã cập nhật lịch ca trực làm việc thành công!')
    setTimeout(() => setToast(''), 2000)
  }

  // Handle leave request submit
  const handleSubmitLeave = (e) => {
    e.preventDefault()
    if (!leaveStart || !leaveEnd || !leaveReason) {
      alert('Vui lòng điền đầy đủ thông tin ngày và lý do nghỉ.')
      return
    }

    const newRequest = {
      id: `LV-${100 + leaves.length + 1}`,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
      status: 'Chờ duyệt'
    }

    const updated = [newRequest, ...leaves]
    setLeaves(updated)
    saveStoredLeaves(updated)
    
    // Clear forms
    setLeaveStart('')
    setLeaveEnd('')
    setLeaveReason('')
    setToast('Đã gửi đơn đăng ký nghỉ phép thành công!')
    setTimeout(() => setToast(''), 2000)
  }

  const handleCancelLeave = (id) => {
    const updated = leaves.filter(l => l.id !== id)
    setLeaves(updated)
    saveStoredLeaves(updated)
  }

  // Handle password updates
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

    setToast('Đã cập nhật mật khẩu tài khoản thành công!')
    setPassForm({ oldPass: '', newPass: '', confirmPass: '' })
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <AppShell role="doctor">
      <TopBar />
      
      <div className="content-wide">
        <PageHeader 
          title="Thiết lập tài khoản bác sĩ" 
          subtitle="Quản lý hồ sơ cá nhân chuyên khoa, ca làm việc trực tuần và đăng ký ngày phép."
        />

        {/* Tabbed workspace */}
        <div className="grid gap-7 xl:grid-cols-[280px_1fr]">
          
          {/* Left panel tabs selector */}
          <div className="space-y-6">
            <Card className="!p-4">
              {/* Doctor Avatar view */}
              <div className="text-center py-4 border-b border-slate-100 mb-4">
                <div className="relative mx-auto w-24 h-24 mb-3">
                  <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-3xl font-black text-teal-700 overflow-hidden shadow-inner">
                    {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <span>DA</span>}
                  </div>
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition shadow">
                    <Camera size={12} className="text-white" />
                    <input 
                      hidden 
                      type="file" 
                      accept="image/*" 
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) setAvatar(URL.createObjectURL(file))
                      }} 
                    />
                  </label>
                </div>
                <h3 className="font-bold text-slate-800 text-base">{profile.name}</h3>
                <span className="text-xs text-teal-600 font-bold block mt-0.5">{profile.spec}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{profile.email}</span>
              </div>

              {/* Sidebar Tabs Links */}
              <div className="flex flex-col gap-1.5">
                {[
                  { key: 'profile', label: 'Hồ sơ chuyên khoa', icon: <User size={15} /> },
                  { key: 'work', label: 'Lịch trực & Ca khám', icon: <Clock size={15} /> },
                  { key: 'leaves', label: 'Đăng ký nghỉ phép', icon: <Calendar size={15} /> },
                  { key: 'security', label: 'Bảo mật tài khoản', icon: <Lock size={15} /> }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
                      tab === item.key 
                        ? 'bg-teal-50 text-teal-700 font-extrabold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Shift Summary mini stats */}
            <Card>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Hiệu suất ca trực</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Đánh giá trung bình:</span>
                  <b className="text-amber-500">4.9 ★</b>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Kinh nghiệm:</span>
                  <b className="text-slate-800">{profile.exp}</b>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Phòng khám chính:</span>
                  <b className="text-teal-700">{profile.clinic}</b>
                </div>
              </div>
            </Card>
          </div>

          {/* Right panel tab detail views */}
          <div>
            
            {/* 1. Doctor Profile edit Form */}
            {tab === 'profile' && (
              <Card className="!p-6">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <User size={18} className="text-teal-600" />
                  Hồ sơ học vị chuyên khoa
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="field-label text-xs">Họ và tên bác sĩ</label>
                      <input 
                        className="input" 
                        value={profile.name || ''} 
                        onChange={e => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="field-label text-xs">Chuyên khoa phụ trách</label>
                      <input 
                        className="input" 
                        value={profile.spec || ''} 
                        onChange={e => setProfile({...profile, spec: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="field-label text-xs">Học vị / Học hàm</label>
                      <input 
                        className="input" 
                        value={profile.degree || ''} 
                        onChange={e => setProfile({...profile, degree: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="field-label text-xs">Mã chứng chỉ hành nghề</label>
                      <input 
                        className="input" 
                        value={profile.certificate || ''} 
                        onChange={e => setProfile({...profile, certificate: e.target.value})}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="field-label text-xs">Kinh nghiệm lâm sàng</label>
                      <input 
                        className="input" 
                        value={profile.exp || ''} 
                        onChange={e => setProfile({...profile, exp: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="field-label text-xs">Số điện thoại liên hệ</label>
                      <input 
                        className="input" 
                        value={profile.phone || ''} 
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="field-label text-xs">Địa chỉ thư điện tử</label>
                      <input 
                        className="input" 
                        value={profile.email || ''} 
                        onChange={e => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <Button type="submit" variant="primary">
                      Lưu hồ sơ bác sĩ
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* 2. Shifts Configuration Form */}
            {tab === 'work' && (
              <Card className="!p-6">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <Clock size={18} className="text-teal-600" />
                  Đăng ký lịch ca trực hàng tuần
                </h3>

                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                    Tùy chọn kích hoạt ngày trực và chọn ca trực tương ứng (Sáng: 08:00 - 12:00, Chiều: 13:30 - 17:30, Tối: 18:00 - 21:00) để người bệnh có thể đăng ký đặt lịch khám.
                  </div>

                  {/* Shifts Grid table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-2.5">Thứ / Ngày trực</th>
                          <th className="py-2.5 text-center">Ca Sáng</th>
                          <th className="py-2.5 text-center">Ca Chiều</th>
                          <th className="py-2.5 text-center">Ca Tối</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(workDays).map(day => (
                          <tr key={day} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/20">
                            <td className="py-3 font-bold text-slate-800">{day}</td>
                            <td className="py-3 text-center">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500/20"
                                checked={workDays[day].morning}
                                onChange={() => handleToggleShift(day, 'morning')}
                              />
                            </td>
                            <td className="py-3 text-center">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500/20"
                                checked={workDays[day].afternoon}
                                onChange={() => handleToggleShift(day, 'afternoon')}
                              />
                            </td>
                            <td className="py-3 text-center">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500/20"
                                checked={workDays[day].evening}
                                onChange={() => handleToggleShift(day, 'evening')}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <Button variant="primary" onClick={handleSaveShifts}>
                      Lưu cấu hình ca khám
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* 3. Leave Request registration */}
            {tab === 'leaves' && (
              <div className="space-y-6">
                
                {/* Leave submission form */}
                <Card className="!p-6">
                  <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                    <Calendar size={18} className="text-teal-600" />
                    Đăng ký lịch xin nghỉ phép
                  </h3>

                  <form onSubmit={handleSubmitLeave} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label text-xs">Từ ngày xin nghỉ</label>
                        <input 
                          type="date" 
                          className="input" 
                          value={leaveStart}
                          onChange={e => setLeaveStart(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="field-label text-xs">Đến hết ngày</label>
                        <input 
                          type="date" 
                          className="input" 
                          value={leaveEnd}
                          onChange={e => setLeaveEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label text-xs">Lý do xin nghỉ</label>
                      <input 
                        type="text" 
                        className="input"
                        placeholder="Ví dụ: Nghỉ phép cá nhân, Đột xuất gia đình..."
                        value={leaveReason}
                        onChange={e => setLeaveReason(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" variant="primary">
                        Gửi yêu cầu nghỉ phép
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Leaves list history log */}
                <Card className="!p-6">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                    <ClipboardList size={16} className="text-teal-600" />
                    Lịch sử đăng ký nghỉ phép
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                          <th className="py-2.5">Mã đơn</th>
                          <th className="py-2.5">Thời gian nghỉ</th>
                          <th className="py-2.5">Lý do</th>
                          <th className="py-2.5">Trạng thái</th>
                          <th className="py-2.5 text-right w-20">Hủy đơn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaves.length > 0 ? (
                          leaves.map(req => (
                            <tr key={req.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/20">
                              <td className="py-3 font-bold text-slate-800">{req.id}</td>
                              <td className="py-3 font-semibold text-slate-700">
                                {req.startDate.split('-').reverse().join('/')} đến {req.endDate.split('-').reverse().join('/')}
                              </td>
                              <td className="py-3 text-slate-600">{req.reason}</td>
                              <td className="py-3">
                                <Badge tone={req.status === 'Đã duyệt' ? 'green' : 'yellow'}>
                                  {req.status}
                                </Badge>
                              </td>
                              <td className="py-3 text-right">
                                {req.status === 'Chờ duyệt' && (
                                  <button 
                                    onClick={() => handleCancelLeave(req.id)}
                                    className="p-1 hover:bg-rose-50 text-rose-600 rounded-md cursor-pointer"
                                    title="Hủy yêu cầu"
                                  >
                                    Hủy đơn
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">
                              Chưa có đơn xin nghỉ phép nào được lập
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>
            )}

            {/* 4. Password Security */}
            {tab === 'security' && (
              <Card className="!p-6">
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                  <Lock size={18} className="text-teal-600" />
                  Bảo mật mật khẩu tài khoản
                </h3>

                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                  <div className="p-3.5 bg-teal-50 border border-teal-100 text-xs text-teal-800 rounded-xl">
                    <b>Mật khẩu mặc định:</b> <code className="bg-white px-2 py-0.5 rounded font-mono font-bold">doctor</code>
                  </div>

                  <div>
                    <label className="field-label text-xs">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      className="input" 
                      placeholder="••••••••"
                      value={passForm.oldPass}
                      onChange={e => setPassForm({...passForm, oldPass: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="field-label text-xs">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="input" 
                      placeholder="Nhập tối thiểu 6 ký tự..."
                      value={passForm.newPass}
                      onChange={e => setPassForm({...passForm, newPass: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="field-label text-xs">Xác nhận lại mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="input" 
                      placeholder="Nhập lại mật khẩu mới..."
                      value={passForm.confirmPass}
                      onChange={e => setPassForm({...passForm, confirmPass: e.target.value})}
                    />
                  </div>

                  {passError && (
                    <p className="text-xs text-rose-500 font-bold">
                      ⚠ {passError}
                    </p>
                  )}

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <Button type="submit" variant="primary">
                      Đổi mật khẩu
                    </Button>
                  </div>
                </form>
              </Card>
            )}

          </div>

        </div>

      </div>

      {toast && <div className="toast toast-green"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}
