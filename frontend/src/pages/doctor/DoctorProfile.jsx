import { useState, useEffect, useMemo } from 'react'
import {
  Camera, CheckCircle2, Lock, User, Phone, Mail,
  Stethoscope, BadgeCheck, Shield, Eye, EyeOff, Check,
  Award, Building2, Star, KeyRound, ShieldCheck, X, Pencil, Save
} from 'lucide-react'
import { AppShell, TopBar, PageHeader, Card, Button } from '../../components/ui.jsx'
import { getStoredProfile, saveStoredProfile } from '../../data/doctorStore.js'

const sections = [
  { label: 'Thông tin chuyên môn', icon: <Stethoscope size={16} /> },
  { label: 'Liên hệ', icon: <Mail size={16} /> },
  { label: 'Bảo mật', icon: <Shield size={16} /> },
  { label: 'Thông tin tài khoản', icon: <BadgeCheck size={16} /> }
]

export function DoctorProfile() {
  const [profile, setProfile] = useState({})
  const [avatar, setAvatar] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [saved, setSaved] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [toast, setToast] = useState('')

  useEffect(() => {
    const prof = getStoredProfile()
    if (prof) {
      setProfile(prof)
      setDraft(prof)
      if (prof.avatar) {
        setAvatar(prof.avatar)
      }
    }
  }, [])

  const passwordRules = useMemo(() => [
    { label: 'Tối thiểu 8 ký tự', ok: password.next.length >= 8 },
    { label: 'Có chữ hoa', ok: /[A-Z]/.test(password.next) },
    { label: 'Có chữ thường', ok: /[a-z]/.test(password.next) },
    { label: 'Có chữ số', ok: /\d/.test(password.next) },
    { label: 'Có ký tự đặc biệt', ok: /[^A-Za-z0-9]/.test(password.next) }
  ], [password.next])

  const strength = passwordRules.filter((rule) => rule.ok).length
  const passwordValid = strength === passwordRules.length && password.current && password.next === password.confirm

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function saveProfile() {
    const updated = { ...draft, avatar }
    saveStoredProfile(updated)
    setProfile(updated)
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  function cancelEdit() {
    setDraft(profile)
    setEditing(false)
  }

  function changePassword() {
    if (!passwordValid) return
    if (password.current !== 'doctor') {
      notify('Mật khẩu hiện tại không chính xác.')
      return
    }
    setPasswordOpen(false)
    setPassword({ current: '', next: '', confirm: '' })
    notify('Đổi mật khẩu thành công')
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatar(url)
      // Save avatar to store immediately to persist it
      const updated = { ...profile, avatar: url }
      saveStoredProfile(updated)
      setProfile(updated)
      setDraft(updated)
      notify('Đã cập nhật ảnh đại diện')
    }
  }

  const initials = useMemo(() => {
    if (!profile.name) return 'VA'
    return profile.name
      .split(' ')
      .slice(-2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }, [profile.name])

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide patient-profile-page">
        <PageHeader 
          eyebrow="Thông tin bác sĩ" 
          title="Hồ sơ cá nhân" 
          subtitle="Cập nhật thông tin chuyên khoa, học hàm học vị, thông tin liên hệ và bảo mật tài khoản." 
        />
        
        {saved && (
          <div className="profile-save-notice">
            <CheckCircle2 size={17} /> Thông tin cá nhân đã được cập nhật.
          </div>
        )}

        <div className="patient-profile-layout">
          {/* Side Stack */}
          <div className="profile-side-stack">
            <Card className="patient-profile-card">
              <div className="profile-avatar-wrap">
                {avatar ? (
                  <img src={avatar} alt="Avatar bác sĩ" />
                ) : (
                  <span>{initials}</span>
                )}
                <label title="Thay ảnh đại diện">
                  <Camera size={15} />
                  <input hidden type="file" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              <h2>{profile.name || 'BS. Nguyễn Văn An'}</h2>
              <p>{profile.spec || 'Chuyên khoa Nội tổng quát'}</p>
              <span className="profile-member-since">Mã CCHN: {profile.certificate}</span>
              <div className="profile-active-badge"><i /> Tài khoản đang hoạt động</div>
              
              <div className="profile-contact-list">
                <span><Mail size={15} /> {profile.email}</span>
                <span><Phone size={15} /> {profile.phone}</span>
                <span><Building2 size={15} /> {profile.clinic || 'Phòng khám Đa khoa Tâm An'}</span>
              </div>
            </Card>

            <Card className="profile-nav-card">
              {sections.map((section) => (
                <button 
                  key={section.label} 
                  onClick={() => document.getElementById(`setting-${section.label}`)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </Card>
          </div>

          {/* Main Content Column */}
          <div className="patient-profile-main">
            {/* 1. Thông tin chuyên môn */}
            <Card className="profile-detail-card" id="setting-Thông tin chuyên môn">
              <SectionHead 
                icon={<Stethoscope size={18} />} 
                title="Thông tin chuyên môn" 
                text="Cập nhật trình độ học vị, chuyên khoa lâm sàng và kinh nghiệm lâm sàng của bác sĩ." 
                action={!editing && (
                  <Button onClick={() => setEditing(true)}>
                    <Pencil size={15} /> Chỉnh sửa thông tin
                  </Button>
                )} 
              />
              <div className="profile-form-grid">
                <ProfileField 
                  label="Họ và tên bác sĩ" 
                  value={editing ? draft.name : profile.name} 
                  editing={editing} 
                  onChange={(value) => update('name', value)} 
                />
                <ProfileField 
                  label="Chuyên khoa" 
                  value={editing ? draft.spec : profile.spec} 
                  editing={editing} 
                  onChange={(value) => update('spec', value)} 
                />
                <ProfileField 
                  label="Học vị / Học hàm" 
                  value={editing ? draft.degree : profile.degree} 
                  editing={editing} 
                  onChange={(value) => update('degree', value)} 
                />
                <ProfileField 
                  label="Kinh nghiệm lâm sàng" 
                  value={editing ? draft.exp : profile.exp} 
                  editing={editing} 
                  onChange={(value) => update('exp', value)} 
                />
                <ProfileField 
                  label="Mã chứng chỉ hành nghề" 
                  value={profile.certificate} 
                  editing={false} 
                />
              </div>
              {editing && (
                <div className="profile-edit-actions">
                  <Button variant="ghost" onClick={cancelEdit}>
                    <X size={15} /> Hủy
                  </Button>
                  <Button onClick={saveProfile}>
                    <Save size={15} /> Lưu thay đổi
                  </Button>
                </div>
              )}
            </Card>

            {/* 2. Thông tin liên hệ */}
            <Card className="profile-detail-card" id="setting-Liên hệ">
              <SectionHead 
                icon={<Mail size={18} />} 
                title="Liên hệ" 
                text="Thông tin dùng để nhận thông tin ca khám và lịch làm việc." 
                action={!editing && (
                  <Button onClick={() => setEditing(true)}>
                    <Pencil size={15} /> Chỉnh sửa
                  </Button>
                )}
              />
              <div className="profile-form-grid">
                <ProfileField 
                  label="Số điện thoại" 
                  value={editing ? draft.phone : profile.phone} 
                  editing={editing} 
                  onChange={(value) => update('phone', value)} 
                />
                <ProfileField 
                  label="Email" 
                  value={editing ? draft.email : profile.email} 
                  editing={editing} 
                  onChange={(value) => update('email', value)} 
                />
                <ProfileField 
                  label="Cơ sở phòng khám" 
                  value={editing ? draft.clinic : profile.clinic} 
                  editing={editing} 
                  onChange={(value) => update('clinic', value)} 
                  wide 
                />
              </div>
              {editing && (
                <div className="profile-edit-actions">
                  <Button variant="ghost" onClick={cancelEdit}>
                    <X size={15} /> Hủy
                  </Button>
                  <Button onClick={saveProfile}>
                    <Save size={15} /> Lưu thay đổi
                  </Button>
                </div>
              )}
            </Card>

            {/* 3. Bảo mật */}
            <Card className="profile-security-card" id="setting-Bảo mật">
              <SectionHead 
                icon={<Shield size={18} />} 
                title="Bảo mật tài khoản" 
                text="Thay đổi mật khẩu đăng nhập để bảo vệ không gian làm việc của bác sĩ." 
              />
              <div className="profile-security-row">
                <span><KeyRound size={17} /></span>
                <div>
                  <h3>Mật khẩu đăng nhập</h3>
                  <p>Thay đổi mật khẩu định kỳ để tăng mức độ bảo mật.</p>
                  <small>Cập nhật lần cuối: 3 tháng trước</small>
                </div>
                <Button variant="outline" onClick={() => setPasswordOpen(true)}>
                  <KeyRound size={15} /> Đổi mật khẩu
                </Button>
              </div>
            </Card>

            {/* 4. Thông tin tài khoản */}
            <Card className="profile-detail-card" id="setting-Thông tin tài khoản">
              <SectionHead 
                icon={<BadgeCheck size={18} />} 
                title="Thông tin tài khoản hệ thống" 
                text="Trạng thái phân quyền và hồ sơ bác sĩ được xác thực." 
              />
              <div className="profile-form-grid">
                <ProfileField 
                  label="Tên tài khoản" 
                  value={profile.email} 
                />
                <ProfileField 
                  label="Vai trò" 
                  value="Bác sĩ khám tư vấn (Doctor)" 
                />
                <ProfileField 
                  label="Trạng thái xác thực" 
                  value="Đã xác minh chứng chỉ hành nghề" 
                />
                <ProfileField 
                  label="Đánh giá trung bình" 
                  value="4.9 / 5.0 ★★★★★" 
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {passwordOpen && (
        <PasswordModal 
          password={password} 
          setPassword={setPassword} 
          rules={passwordRules} 
          strength={strength} 
          valid={passwordValid} 
          onClose={() => setPasswordOpen(false)} 
          onSave={changePassword} 
        />
      )}

      {toast && (
        <div className="toast">
          <span>✓</span> {toast}
        </div>
      )}
    </AppShell>
  )
}

function SectionHead({ icon, title, text, action }) { 
  return (
    <div className="profile-section-head">
      <div>
        <h2>{icon}{title}</h2>
        <p>{text}</p>
      </div>
      {action}
    </div>
  ) 
}

function ProfileField({ label, value, editing = false, onChange, icon, wide = false }) { 
  return (
    <label className={`profile-field ${wide ? 'wide' : ''}`}>
      <small>{label}</small>
      {editing ? (
        <input value={value || ''} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <b>{icon}{value || '---'}</b>
      )}
    </label>
  ) 
}

function PasswordModal({ password, setPassword, rules, strength, valid, onClose, onSave }) {
  const update = (field, value) => setPassword((current) => ({ ...current, [field]: value }))
  return (
    <div className="modal-backdrop">
      <Card className="account-dialog">
        <button className="dialog-close" onClick={onClose}><X size={18} /></button>
        <span className="dialog-security-icon"><ShieldCheck size={21} /></span>
        <h2>Đổi mật khẩu</h2>
        <p>Tạo mật khẩu mạnh để bảo vệ tài khoản chuyên môn bác sĩ.</p>
        
        <div className="password-form">
          <label>
            <small>Mật khẩu hiện tại</small>
            <input type="password" value={password.current} onChange={(event) => update('current', event.target.value)} />
          </label>
          <label>
            <small>Mật khẩu mới</small>
            <input type="password" value={password.next} onChange={(event) => update('next', event.target.value)} />
          </label>
          <label>
            <small>Xác nhận mật khẩu mới</small>
            <input type="password" value={password.confirm} onChange={(event) => update('confirm', event.target.value)} />
          </label>
        </div>
        
        <div className="password-strength">
          <div>
            <span style={{ width: `${strength * 20}%` }} />
          </div>
          <b>
            {strength < 3 ? 'Mật khẩu yếu' : strength < 5 ? 'Mật khẩu khá' : 'Mật khẩu mạnh'}
          </b>
        </div>
        
        <div className="password-rules">
          {rules.map((rule) => (
            <span className={rule.ok ? 'ok' : ''} key={rule.label}>
              {rule.ok ? <Check size={13} /> : <Eye size={13} />}
              {rule.label}
            </span>
          ))}
        </div>
        
        {password.confirm && password.next !== password.confirm && (
          <small className="password-error">
            Mật khẩu xác nhận chưa khớp.
          </small>
        )}
        
        <div className="account-dialog-actions">
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button disabled={!valid} onClick={onSave}>Cập nhật mật khẩu</Button>
        </div>
      </Card>
    </div>
  )
}
