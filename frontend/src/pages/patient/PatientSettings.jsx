import { useMemo, useState } from 'react'
import { Bell, CalendarDays, Camera, Check, CheckCircle2, Eye, KeyRound, LockKeyhole, Mail, MapPin, Pencil, Phone, Save, ShieldCheck, Trash2, UserRound, X } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { patientUser } from '../../data/mock.js'

const initialProfile = { name: patientUser.name, age: String(patientUser.age), birthday: '14/08/1984', gender: patientUser.gender, phone: patientUser.phone, email: patientUser.email, location: patientUser.location }
const sections = [{ label: 'Thông tin cá nhân', icon: <UserRound size={16} /> }, { label: 'Liên hệ', icon: <Mail size={16} /> }, { label: 'Bảo mật', icon: <ShieldCheck size={16} /> }, { label: 'Thông báo', icon: <Bell size={16} /> }, { label: 'Quyền riêng tư', icon: <LockKeyhole size={16} /> }]

export function PatientSettings() {
  const [avatar, setAvatar] = useState(patientUser.avatar)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
  const [draft, setDraft] = useState(initialProfile)
  const [saved, setSaved] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [deleteText, setDeleteText] = useState('')
  const [toast, setToast] = useState('')
  const passwordRules = useMemo(() => [{ label: 'Tối thiểu 8 ký tự', ok: password.next.length >= 8 }, { label: 'Có chữ hoa', ok: /[A-Z]/.test(password.next) }, { label: 'Có chữ thường', ok: /[a-z]/.test(password.next) }, { label: 'Có chữ số', ok: /\d/.test(password.next) }, { label: 'Có ký tự đặc biệt', ok: /[^A-Za-z0-9]/.test(password.next) }], [password.next])
  const strength = passwordRules.filter((rule) => rule.ok).length
  const passwordValid = strength === passwordRules.length && password.current && password.next === password.confirm

  function notify(message) { setToast(message); window.setTimeout(() => setToast(''), 1800) }
  function update(field, value) { setDraft((current) => ({ ...current, [field]: value })) }
  function save() { setProfile(draft); setEditing(false); setSaved(true); window.setTimeout(() => setSaved(false), 2200) }
  function cancel() { setDraft(profile); setEditing(false) }
  function changePassword() { if (!passwordValid) return; setPasswordOpen(false); setPassword({ current: '', next: '', confirm: '' }); notify('Đổi mật khẩu thành công') }
  function confirmDelete() { if (deleteText !== 'DELETE') return; setDeleteOpen(false); setDeleteText(''); notify('Đã gửi yêu cầu xóa tài khoản') }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide patient-profile-page">
        <PageHeader eyebrow="Thông tin cá nhân" title="Quản lý tài khoản" subtitle="Cập nhật hồ sơ, thông tin liên hệ và bảo mật tài khoản MedConsult." />
        {saved && <div className="profile-save-notice"><CheckCircle2 size={17} /> Thông tin cá nhân đã được cập nhật.</div>}
        <div className="patient-profile-layout">
          <div className="profile-side-stack">
            <Card className="patient-profile-card">
              <div className="profile-avatar-wrap">{avatar ? <img src={avatar} alt="Avatar bệnh nhân" /> : <span>TM</span>}<label title="Thay ảnh đại diện"><Camera size={15} /><input hidden type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setAvatar(URL.createObjectURL(file)) }} /></label></div>
              <h2>{profile.name}</h2><p>Bệnh nhân MedConsult</p>
              <span className="profile-member-since">Thành viên từ tháng 01/2026</span>
              <div className="profile-active-badge"><i /> Tài khoản đang hoạt động</div>
              <div className="profile-contact-list"><span><Mail size={15} /> {profile.email}</span><span><Phone size={15} /> {profile.phone}</span><span><MapPin size={15} /> {profile.location}</span></div>
            </Card>
            <Card className="profile-nav-card">{sections.map((section) => <button key={section.label} onClick={() => document.getElementById(`setting-${section.label}`)?.scrollIntoView({ behavior: 'smooth' })}>{section.icon}{section.label}</button>)}</Card>
          </div>
          <div className="patient-profile-main">
            <Card className="profile-detail-card" id="setting-Thông tin cá nhân">
              <SectionHead icon={<UserRound size={18} />} title="Thông tin cá nhân" text="Cập nhật thông tin cơ bản để nhận tư vấn phù hợp hơn." action={!editing && <Button onClick={() => setEditing(true)}><Pencil size={15} /> Chỉnh sửa thông tin</Button>} />
              <div className="profile-form-grid"><ProfileField label="Họ và tên" value={editing ? draft.name : profile.name} editing={editing} onChange={(value) => update('name', value)} /><ProfileField label="Tuổi" value={editing ? draft.age : profile.age} editing={editing} onChange={(value) => update('age', value)} /><ProfileField label="Ngày sinh" value={editing ? draft.birthday : profile.birthday} editing={editing} onChange={(value) => update('birthday', value)} icon={<CalendarDays size={15} />} /><ProfileField label="Giới tính" value={editing ? draft.gender : profile.gender} editing={editing} onChange={(value) => update('gender', value)} /></div>
              {editing && <div className="profile-edit-actions"><Button variant="ghost" onClick={cancel}><X size={15} /> Hủy</Button><Button onClick={save}><Save size={15} /> Lưu thay đổi</Button></div>}
            </Card>
            <Card className="profile-detail-card" id="setting-Liên hệ"><SectionHead icon={<Mail size={18} />} title="Liên hệ" text="Thông tin dùng để nhận nhắc lịch và hỗ trợ từ MedConsult." /><div className="profile-form-grid"><ProfileField label="Số điện thoại" value={profile.phone} /><ProfileField label="Email" value={profile.email} /><ProfileField label="Địa chỉ / khu vực" value={profile.location} wide /></div></Card>
            <Card className="profile-security-card" id="setting-Bảo mật"><SectionHead icon={<ShieldCheck size={18} />} title="Bảo mật tài khoản" text="Bảo vệ dữ liệu y tế và quyền truy cập tài khoản của bạn." /><div className="profile-security-row"><span><KeyRound size={17} /></span><div><h3>Mật khẩu đăng nhập</h3><p>Thay đổi mật khẩu định kỳ để tăng mức độ bảo mật.</p><small>Cập nhật lần cuối: 3 tháng trước</small></div><Button variant="outline" onClick={() => setPasswordOpen(true)}><KeyRound size={15} /> Đổi mật khẩu</Button></div></Card>
            <Card className="profile-toggle-card" id="setting-Thông báo"><SectionHead icon={<Bell size={18} />} title="Thông báo" text="Tùy chỉnh cách bạn nhận thông báo quan trọng." /><Toggle label="Nhắc lịch khám" text="Nhận nhắc nhở trước lịch khám và tư vấn." /><Toggle label="Cập nhật hồ sơ sức khỏe" text="Thông báo khi có kết quả hoặc hồ sơ mới." /></Card>
            <Card className="profile-toggle-card" id="setting-Quyền riêng tư"><SectionHead icon={<LockKeyhole size={18} />} title="Quyền riêng tư" text="Kiểm soát dữ liệu và yêu cầu xử lý tài khoản." /><Toggle label="Chia sẻ lịch sử với bác sĩ" text="Cho phép bác sĩ tiếp nhận xem lịch sử điều trị liên quan." /><div className="profile-danger-row"><div><h3>Xóa tài khoản</h3><p>Thao tác này sẽ gửi yêu cầu xóa dữ liệu và không thể hoàn tác.</p></div><button onClick={() => setDeleteOpen(true)}><Trash2 size={15} /> Xóa tài khoản</button></div></Card>
          </div>
        </div>
      </div>
      {passwordOpen && <PasswordModal password={password} setPassword={setPassword} rules={passwordRules} strength={strength} valid={passwordValid} onClose={() => setPasswordOpen(false)} onSave={changePassword} />}
      {deleteOpen && <div className="modal-backdrop"><Card className="account-dialog danger-dialog"><button className="dialog-close" onClick={() => setDeleteOpen(false)}><X size={18} /></button><span className="dialog-danger-icon"><Trash2 size={21} /></span><h2>Xóa tài khoản?</h2><p>Hành động không thể hoàn tác. Dữ liệu y tế và lịch sử sử dụng sẽ được gửi yêu cầu xóa khỏi hệ thống.</p><label><small>Nhập DELETE để xác nhận</small><input value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder="DELETE" /></label><div><Button variant="ghost" onClick={() => setDeleteOpen(false)}>Hủy</Button><Button variant="danger" disabled={deleteText !== 'DELETE'} onClick={confirmDelete}>Xác nhận xóa</Button></div></Card></div>}
      {toast && <div className="toast"><span>✓</span> {toast}</div>}
    </AppShell>
  )
}

function SectionHead({ icon, title, text, action }) { return <div className="profile-section-head"><div><h2>{icon}{title}</h2><p>{text}</p></div>{action}</div> }
function ProfileField({ label, value, editing = false, onChange, icon, wide = false }) { return <label className={`profile-field ${wide ? 'wide' : ''}`}><small>{label}</small>{editing ? <input value={value} onChange={(event) => onChange(event.target.value)} /> : <b>{icon}{value}</b>}</label> }
function Toggle({ label, text }) { const [on, setOn] = useState(true); return <div className="setting-toggle-row"><div><h3>{label}</h3><p>{text}</p></div><button className={on ? 'active' : ''} onClick={() => setOn((value) => !value)}><i /></button></div> }
function PasswordModal({ password, setPassword, rules, strength, valid, onClose, onSave }) {
  const update = (field, value) => setPassword((current) => ({ ...current, [field]: value }))
  return <div className="modal-backdrop"><Card className="account-dialog"><button className="dialog-close" onClick={onClose}><X size={18} /></button><span className="dialog-security-icon"><ShieldCheck size={21} /></span><h2>Đổi mật khẩu</h2><p>Tạo mật khẩu mạnh để bảo vệ dữ liệu sức khỏe cá nhân.</p><div className="password-form"><label><small>Mật khẩu hiện tại</small><input type="password" value={password.current} onChange={(event) => update('current', event.target.value)} /></label><label><small>Mật khẩu mới</small><input type="password" value={password.next} onChange={(event) => update('next', event.target.value)} /></label><label><small>Xác nhận mật khẩu</small><input type="password" value={password.confirm} onChange={(event) => update('confirm', event.target.value)} /></label></div><div className="password-strength"><div><span style={{ width: `${strength * 20}%` }} /></div><b>{strength < 3 ? 'Mật khẩu yếu' : strength < 5 ? 'Mật khẩu khá' : 'Mật khẩu mạnh'}</b></div><div className="password-rules">{rules.map((rule) => <span className={rule.ok ? 'ok' : ''} key={rule.label}>{rule.ok ? <Check size={13} /> : <Eye size={13} />}{rule.label}</span>)}</div>{password.confirm && password.next !== password.confirm && <small className="password-error">Mật khẩu xác nhận chưa khớp.</small>}<div className="account-dialog-actions"><Button variant="ghost" onClick={onClose}>Hủy</Button><Button disabled={!valid} onClick={onSave}>Cập nhật mật khẩu</Button></div></Card></div>
}
