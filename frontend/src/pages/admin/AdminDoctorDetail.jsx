import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  Award,
  BriefcaseMedical,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Languages,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldAlert,
  Star,
  Stethoscope,
  Trash2,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { AppShell, Button, TopBar } from '../../components/ui.jsx'
import { adminClinics, adminDoctors, adminSpecialties } from './adminDoctorsData.js'

const tabs = [
  ['personal', 'Thông tin cá nhân', <UserRound size={17} />],
  ['professional', 'Thông tin chuyên môn', <Award size={17} />],
  ['schedule', 'Phân công & Lịch làm việc', <CalendarDays size={17} />],
  ['reviews', 'Đánh giá', <Star size={17} />],
  ['security', 'Tài khoản & Bảo mật', <LockKeyhole size={17} />],
]

const recentReviews = [
  { name: 'Nguyễn Mai Anh', date: '28/05/2026', rating: 5, text: 'Bác sĩ giải thích rõ ràng, tư vấn kỹ và rất tận tâm.' },
  { name: 'Trần Minh Khoa', date: '19/05/2026', rating: 5, text: 'Quy trình khám nhanh, bác sĩ theo dõi tình trạng chu đáo.' },
  { name: 'Lê Thanh Hà', date: '08/05/2026', rating: 4, text: 'Tư vấn dễ hiểu, lịch tái khám được hướng dẫn cụ thể.' },
]

const activityLog = [
  ['Hồ sơ được tạo', '18/02/2024 · Quản trị viên hệ thống'],
  ['Cập nhật chuyên khoa', '14/05/2026 · Điều phối viên nhân sự'],
  ['Đổi phòng khám phụ trách', '21/05/2026 · Quản trị viên hệ thống'],
  ['Cập nhật mật khẩu', '27/05/2026 · Bác sĩ'],
]

const deletedDoctorsKey = 'medconsult-admin-deleted-doctors'

function statusClass(status) {
  return `is-${status.toLowerCase().replaceAll(' ', '-')}`
}

export function AdminDoctorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const sourceDoctor = adminDoctors.find((doctor) => doctor.id === id) || adminDoctors[0]
  const [doctor, setDoctor] = useState(sourceDoctor)
  const [activeTab, setActiveTab] = useState('personal')
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [confirmSuspendOpen, setConfirmSuspendOpen] = useState(false)
  const [dutyOpen, setDutyOpen] = useState(false)
  const [dutyForm, setDutyForm] = useState({
    date: '2026-06-03',
    shift: 'Ca sáng 08:00 - 12:00',
    clinic: doctor.clinic,
    room: doctor.clinicRoom,
    slots: 8
  })

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const passwordRules = useMemo(() => [
    ['Tối thiểu 8 ký tự', newPassword.length >= 8],
    ['Có chữ hoa', /[A-Z]/.test(newPassword)],
    ['Có chữ thường', /[a-z]/.test(newPassword)],
    ['Có số', /\d/.test(newPassword)],
    ['Có ký tự đặc biệt', /[^A-Za-z0-9]/.test(newPassword)],
  ], [newPassword])
  const validPassword = passwordRules.every(([, valid]) => valid) && newPassword === confirmPassword
  const strength = passwordRules.filter(([, valid]) => valid).length

  const updateField = (field, value) => setDoctor((current) => ({ ...current, [field]: value }))

  const updatePassword = (event) => {
    event.preventDefault()
    if (!validPassword) return
    setPasswordOpen(false)
    setNewPassword('')
    setConfirmPassword('')
    notify('Đã cập nhật mật khẩu bác sĩ')
  }

  const deleteDoctor = () => {
    try {
      const deletedDoctorIds = JSON.parse(window.localStorage.getItem(deletedDoctorsKey) || '[]')
      window.localStorage.setItem(deletedDoctorsKey, JSON.stringify([...new Set([...deletedDoctorIds, doctor.id])]))
      window.localStorage.setItem('medconsult-admin-toast', `Đã xóa hồ sơ bác sĩ BS. ${doctor.name}`)
    } catch {
      // The route still closes cleanly if local storage is unavailable.
    }

    navigate('/admin/doctors')
  }

  const handleConfirmSuspend = () => {
    const nextStatus = doctor.status === 'Tạm ngưng' ? 'Đang làm việc' : 'Tạm ngưng'
    updateField('status', nextStatus)
    notify(nextStatus === 'Tạm ngưng' ? 'Đã tạm ngưng tài khoản bác sĩ' : 'Đã kích hoạt lại tài khoản')
    setConfirmSuspendOpen(false)
  }

  return (
    <AppShell role="admin">
      <TopBar title="Quản trị hệ thống" subtitle="Hồ sơ bác sĩ" />
      <main className="content-wide admin-clinic-page admin-doctor-detail-page">
        <button className="admin-doctor-back" type="button" onClick={() => navigate('/admin/doctors')}><ArrowLeft size={17} /> Quay lại danh sách</button>
        <section className="admin-clinic-page-head admin-doctor-detail-head">
          <div>
            <p className="admin-clinic-breadcrumb">Admin <span>/</span> Quản lý bác sĩ <span>/</span> {doctor.name}</p>
            <h1>Hồ sơ bác sĩ</h1>
            <p>Cập nhật thông tin cá nhân, chuyên môn, lịch làm việc và quyền truy cập.</p>
          </div>
          <div className="admin-clinic-head-actions">
            <Button className="admin-doctor-delete-button" onClick={() => setDeleteOpen(true)}><Trash2 size={17} /> Xóa bác sĩ</Button>
            <Button className="admin-primary-btn" onClick={() => notify('Đã lưu thay đổi hồ sơ bác sĩ')}><Save size={17} /> Lưu thay đổi</Button>
          </div>
        </section>

        <section className="admin-doctor-detail-layout">
          <aside className="admin-doctor-profile-card">
            <div className="admin-doctor-profile-cover" />
            <div className="admin-doctor-profile-avatar">{doctor.initials}<button type="button" onClick={() => notify('Sẵn sàng tải ảnh đại diện mới')}>Đổi ảnh</button></div>
            <h2>BS. {doctor.name}</h2>
            <p>{doctor.spec}</p>
            <span className={`admin-doctor-status ${statusClass(doctor.status)}`}>{doctor.status}</span>
            <div className="admin-doctor-profile-summary">
              <span><Star size={16} /><b>{doctor.rating}</b> đánh giá</span>
              <span><Award size={16} /><b>{doctor.experience}</b> năm kinh nghiệm</span>
              <span><Building2 size={16} />{doctor.clinic}</span>
              <span><Phone size={16} />{doctor.phone}</span>
              <span><Mail size={16} />{doctor.email}</span>
            </div>
            <div className="admin-doctor-profile-stats">
              <span><b>{doctor.consultations}</b><small>Lượt tư vấn</small></span>
              <span><b>{doctor.rating}</b><small>Đánh giá</small></span>
              <span><b>{doctor.satisfaction}%</b><small>Hài lòng</small></span>
              <span><b>{doctor.monthCases}</b><small>Ca tháng này</small></span>
            </div>
          </aside>

          <section className="admin-doctor-detail-main">
            <nav className="admin-doctor-detail-tabs" aria-label="Các phần hồ sơ bác sĩ">
              {tabs.map(([tabId, label, icon]) => <button className={activeTab === tabId ? 'is-active' : ''} key={tabId} type="button" onClick={() => setActiveTab(tabId)}>{icon}{label}</button>)}
            </nav>

            {activeTab === 'personal' && <section className="admin-doctor-detail-panel">
              <div className="admin-doctor-panel-head"><div><h3>Thông tin cá nhân</h3><p>Thông tin định danh và liên hệ của bác sĩ trong hệ thống.</p></div><UserRound size={22} /></div>
              <div className="admin-doctor-form-grid">
                <label><span>Họ và tên</span><input value={doctor.name} onChange={(event) => updateField('name', event.target.value)} /></label>
                <label><span>Ngày sinh</span><input type="date" value={doctor.dob} onChange={(event) => updateField('dob', event.target.value)} /></label>
                <label><span>Giới tính</span><select value={doctor.gender} onChange={(event) => updateField('gender', event.target.value)}><option>Nam</option><option>Nữ</option><option>Khác</option></select></label>
                <label><span>Quê quán</span><input value={doctor.hometown} onChange={(event) => updateField('hometown', event.target.value)} /></label>
                <label><span>Số CCCD</span><input value={doctor.cccd} onChange={(event) => updateField('cccd', event.target.value)} /></label>
                <label><span>Số điện thoại</span><input value={doctor.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
                <label><span>Email</span><input type="email" value={doctor.email} onChange={(event) => updateField('email', event.target.value)} /></label>
                <label><span>Địa chỉ hiện tại</span><input value={doctor.address} onChange={(event) => updateField('address', event.target.value)} /></label>
              </div>
            </section>}

            {activeTab === 'professional' && <section className="admin-doctor-detail-panel">
              <div className="admin-doctor-panel-head"><div><h3>Thông tin chuyên môn</h3><p>Học vị, năng lực và các dịch vụ bác sĩ đang phụ trách.</p></div><Award size={22} /></div>
              <div className="admin-doctor-form-grid">
                <label><span>Chuyên khoa</span><select value={doctor.spec} onChange={(event) => updateField('spec', event.target.value)}>{adminSpecialties.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Học vị</span><input value={doctor.degree} onChange={(event) => updateField('degree', event.target.value)} /></label>
                <label><span>Số năm kinh nghiệm</span><input min="0" type="number" value={doctor.experience} onChange={(event) => updateField('experience', event.target.value)} /></label>
                <label><span>Ngôn ngữ hỗ trợ</span><input value={doctor.languages} onChange={(event) => updateField('languages', event.target.value)} /></label>
                <label className="is-wide"><span>Chứng chỉ hành nghề</span><textarea rows="3" value={doctor.certificates} onChange={(event) => updateField('certificates', event.target.value)} /></label>
                <label className="is-wide"><span>Dịch vụ phụ trách</span><textarea rows="3" value={doctor.services} onChange={(event) => updateField('services', event.target.value)} /></label>
              </div>
            </section>}

            {activeTab === 'schedule' && <section className="admin-doctor-detail-panel">
              <div className="admin-doctor-panel-head"><div><h3>Phân công & Lịch làm việc</h3><p>Quản lý phòng khám, phòng chức năng và ca nhận lịch theo tuần.</p></div><CalendarDays size={22} /></div>
              <div className="admin-doctor-form-grid">
                <label><span>Phòng khám phụ trách</span><select value={doctor.clinic} onChange={(event) => updateField('clinic', event.target.value)}>{adminClinics.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Phòng khám cụ thể</span><input value={doctor.clinicRoom} onChange={(event) => updateField('clinicRoom', event.target.value)} /></label>
                <label><span>Trạng thái nhận lịch</span><select><option>Đang nhận lịch</option><option>Chỉ nhận tái khám</option><option>Tạm khóa lịch</option></select></label>
              </div>
              <div className="admin-doctor-week-grid">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => <article className={index === 6 ? 'is-off' : ''} key={day}><b>{day}</b><span>{index === 6 ? 'Nghỉ' : 'Ca sáng'}</span><span>{index > 4 ? 'Ca chiều' : 'Ca tối'}</span></article>)}</div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" onClick={() => setDutyOpen(true)}>
                  <BriefcaseMedical size={17} /> Phân công lịch trực
                </Button>
                <Button variant="outline" onClick={() => navigate(`/admin/doctors/${doctor.id}/schedule`)}>
                  <CalendarDays size={17} /> Xem lịch khám chi tiết
                </Button>
              </div>
            </section>}

            {activeTab === 'reviews' && <section className="admin-doctor-detail-panel">
              <div className="admin-doctor-panel-head"><div><h3>Đánh giá từ bệnh nhân</h3><p>Theo dõi chất lượng tư vấn và phản hồi gần nhất.</p></div><Star size={22} /></div>
              <div className="admin-doctor-rating-layout">
                <div className="admin-doctor-rating-overview"><strong>{doctor.rating}</strong><span>{'★'.repeat(5)}</span><small>{doctor.reviews} lượt đánh giá</small></div>
                <div className="admin-doctor-rating-bars">{[5, 4, 3, 2, 1].map((star, index) => <div key={star}><span>{star} sao</span><i><em style={{ width: `${[82, 12, 4, 1, 1][index]}%` }} /></i><small>{[82, 12, 4, 1, 1][index]}%</small></div>)}</div>
              </div>
              <div className="admin-doctor-review-list">{recentReviews.map((review) => <article key={review.name}><span className="admin-doctor-review-avatar">{review.name[0]}</span><div><b>{review.name}</b><small>{review.date} · {'★'.repeat(review.rating)}</small><p>{review.text}</p></div></article>)}</div>
            </section>}

            {activeTab === 'security' && <section className="admin-doctor-detail-panel">
              <div className="admin-doctor-panel-head"><div><h3>Tài khoản & Bảo mật</h3><p>Kiểm soát quyền truy cập và lịch sử thao tác quan trọng.</p></div><LockKeyhole size={22} /></div>
              <div className="admin-doctor-security-grid">
                <article><UserRound size={20} /><span><small>Tên đăng nhập</small><b>{doctor.email}</b></span></article>
                <article><UsersRound size={20} /><span><small>Vai trò</small><b>Bác sĩ</b></span></article>
                <article><Activity size={20} /><span><small>Trạng thái</small><b>{doctor.status}</b></span></article>
                <article><Clock3 size={20} /><span><small>Lần đăng nhập gần nhất</small><b>30/05/2026 · 20:42</b></span></article>
              </div>
              <div className="admin-doctor-security-actions"><Button onClick={() => setPasswordOpen(true)}><KeyRound size={17} /> Đổi mật khẩu</Button><Button variant="outline" onClick={() => setConfirmSuspendOpen(true)}><ShieldAlert size={17} /> Thay đổi trạng thái</Button></div>
              <h4 className="admin-doctor-log-title"><strong>Nhật ký hoạt động</strong></h4>
              <div className="admin-doctor-activity-log">{activityLog.map(([title, meta]) => <article key={title}><i /><div><b>{title}</b><small>{meta}</small></div></article>)}</div>
            </section>}
          </section>
        </section>
      </main>

      {passwordOpen && <div className="modal-backdrop" onMouseDown={() => setPasswordOpen(false)}>
        <form className="modal admin-doctor-password-modal" onSubmit={updatePassword} onMouseDown={(event) => event.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
          <div className="modal-head"><div><span className="admin-clinic-eyebrow"><KeyRound size={14} /> BẢO MẬT TÀI KHOẢN</span><h2>Đặt lại mật khẩu</h2><p>Tạo mật khẩu mạnh để bảo vệ tài khoản bác sĩ.</p></div><button type="button" onClick={() => setPasswordOpen(false)}>×</button></div>
          <label className="admin-doctor-password-field"><span>Mật khẩu mới</span><div><input required minLength="8" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><button aria-label="Hiện hoặc ẩn mật khẩu" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <label className="admin-doctor-password-field"><span>Xác nhận mật khẩu</span><div><input required type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div></label>
          <div className="admin-doctor-strength"><span><i style={{ width: `${strength * 20}%` }} /></span><small>{strength < 3 ? 'Mật khẩu yếu' : strength < 5 ? 'Mật khẩu khá' : 'Mật khẩu mạnh'}</small></div>
          <div className="admin-doctor-password-rules">{passwordRules.map(([label, valid]) => <span className={valid ? 'is-valid' : ''} key={label}><Check size={15} />{label}</span>)}</div>
          <div className="modal-actions"><Button variant="outline" type="button" onClick={() => setPasswordOpen(false)}>Hủy</Button><Button disabled={!validPassword} type="submit"><KeyRound size={17} /> Cập nhật mật khẩu</Button></div>
        </form>
      </div>}

      {deleteOpen && <div className="modal-backdrop" onMouseDown={() => setDeleteOpen(false)}>
        <section className="modal admin-doctor-delete-modal p-6 text-center" onMouseDown={(event) => event.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
          <div className="admin-doctor-delete-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><ShieldAlert size={26} /></div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px' }}>Xóa hồ sơ bác sĩ?</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>Thao tác này sẽ xóa hồ sơ bác sĩ và không thể hoàn tác. Nhập <b>DELETE</b> để xác nhận.</p>
          <input aria-label="Nhập DELETE để xác nhận xóa" value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder="Nhập DELETE" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '20px', outline: 'none' }} />
          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}><Button variant="outline" onClick={() => setDeleteOpen(false)}>Hủy</Button><Button disabled={deleteText !== 'DELETE'} className="admin-doctor-delete-button" onClick={deleteDoctor} style={{ background: deleteText === 'DELETE' ? '#ef4444' : '#f1f5f9', color: deleteText === 'DELETE' ? '#fff' : '#94a3b8', border: 'none' }}><Trash2 size={17} /> Xóa bác sĩ</Button></div>
        </section>
      </div>}

      {confirmSuspendOpen && (
        <div className="modal-backdrop" onMouseDown={() => setConfirmSuspendOpen(false)}>
          <div className="modal admin-doctor-delete-modal p-6 text-center" onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
            <div className="admin-doctor-delete-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><Activity size={26} /></div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px' }}>
              {doctor.status === 'Tạm ngưng' ? 'Kích hoạt bác sĩ?' : 'Tạm ngưng bác sĩ?'}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của bác sĩ <b>BS. {doctor.name}</b> không?
            </p>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="outline" onClick={() => setConfirmSuspendOpen(false)}>Hủy</Button>
              <Button onClick={handleConfirmSuspend}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}

      {dutyOpen && (
        <div className="modal-backdrop" onMouseDown={() => setDutyOpen(false)}>
          <form className="modal admin-doctor-password-modal" onSubmit={(e) => { e.preventDefault(); setDutyOpen(false); notify('Đã phân công lịch trực cho bác sĩ BS. ' + doctor.name) }} onMouseDown={(event) => event.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '450px' }}>
            <div className="modal-head"><div><span className="admin-clinic-eyebrow"><Stethoscope size={14} /> PHÂN CÔNG NHÂN SỰ</span><h2>Phân công lịch trực</h2><p>Thiết lập ca trực và tự động mở slot nhận lịch khám cho BS. {doctor.name}.</p></div><button type="button" onClick={() => setDutyOpen(false)}>×</button></div>
            <div className="admin-doctor-form-grid" style={{ gridTemplateColumns: '1fr', gap: '12px', marginTop: '16px' }}>
              <label><span>Cơ sở</span><select value={dutyForm.clinic} onChange={(e) => setDutyForm({ ...dutyForm, clinic: e.target.value })}>{adminClinics.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Phòng khám cụ thể</span><input value={dutyForm.room} onChange={(e) => setDutyForm({ ...dutyForm, room: e.target.value })} /></label>
              <label><span>Ngày trực</span><input type="date" value={dutyForm.date} onChange={(e) => setDutyForm({ ...dutyForm, date: e.target.value })} /></label>
              <label><span>Ca trực</span><select value={dutyForm.shift} onChange={(e) => setDutyForm({ ...dutyForm, shift: e.target.value })}><option>Ca sáng 08:00 - 12:00</option><option>Ca chiều 13:30 - 17:30</option><option>Ca tối 18:00 - 21:00</option></select></label>
              <label><span>Số lượng slot nhận khám</span><input type="number" min="1" value={dutyForm.slots} onChange={(e) => setDutyForm({ ...dutyForm, slots: e.target.value })} /></label>
            </div>
            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <Button variant="outline" type="button" onClick={() => setDutyOpen(false)}>Hủy</Button>
              <Button type="submit"><Check size={17} /> Lưu lịch trực</Button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </AppShell>
  )
}
