import { useState } from 'react'
import { Camera, Save } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'

export function DoctorSettings() {
  const [avatar, setAvatar] = useState('')

  function changeAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setAvatar(URL.createObjectURL(file))
  }

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Cài đặt tài khoản" subtitle="Thông tin cá nhân và hồ sơ làm việc của bác sĩ" />
        <Card className="profile-settings">
          <div className="profile-cover" />
          <div className="profile-settings-body">
            <label className="profile-avatar-upload">
              {avatar ? <img src={avatar} alt="Avatar bác sĩ" /> : <span>A</span>}
              <input type="file" accept="image/*" onChange={changeAvatar} />
              <em><Camera size={16} /> Thay ảnh</em>
            </label>

            <div className="profile-settings-info">
              <h2>Dr. Alexander</h2>
              <p>Bác sĩ tư vấn trực tuyến</p>
              <div className="profile-form-grid">
                <label><span className="field-label">Họ và tên</span><input className="input" defaultValue="Dr. Alexander" /></label>
                <label><span className="field-label">Ngày sinh</span><input className="input" type="date" defaultValue="1988-07-12" /></label>
                <label><span className="field-label">Số điện thoại</span><input className="input" defaultValue="0908 123 456" /></label>
                <label><span className="field-label">Chức vụ</span><input className="input" defaultValue="Bác sĩ tư vấn" /></label>
              </div>
              <div className="mt-6 flex justify-end">
                <Button><Save size={16} /> Lưu thay đổi</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
