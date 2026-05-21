import { useState } from 'react'
import { AppShell, Card, PageHeader, TopBar } from '../../components/ui.jsx'

export function DoctorSettings() {
  const [avatar, setAvatar] = useState('')
  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Cài đặt tài khoản" subtitle="Quản lý hồ sơ bác sĩ theo phong cách mạng xã hội nội bộ." />
        <Card>
          <div className="settings-social">
            <div className="settings-avatar">
              {avatar ? <img src={avatar} alt="avatar" /> : <span>DA</span>}
              <label className="btn btn-outline mt-4 cursor-pointer">
                Thay ảnh
                <input hidden type="file" accept="image/*" onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  setAvatar(URL.createObjectURL(file))
                }} />
              </label>
            </div>
            <div className="settings-profile-grid">
              <Info label="Họ tên" value="Dr. Alexander" />
              <Info label="Tuổi" value="38" />
              <Info label="Số điện thoại" value="0909 555 221" />
              <Info label="Chức vụ" value="Bác sĩ tư vấn" />
              <Info label="Email" value="alexander@medconsult.vn" />
              <Info label="Kinh nghiệm" value="12 năm" />
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

function Info({ label, value }) {
  return <div className="info-box"><small>{label}</small><b>{value}</b></div>
}
