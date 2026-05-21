import { useState } from 'react'
import { AppShell, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { patientUser } from '../../data/mock.js'

export function PatientSettings() {
  const [avatar, setAvatar] = useState(patientUser.avatar)
  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Cài đặt tài khoản" subtitle="Cập nhật ảnh đại diện và thông tin cá nhân của bạn." />
        <Card>
          <div className="settings-social">
            <div className="settings-avatar">
              {avatar ? <img src={avatar} alt="avatar" /> : <span>TM</span>}
              <label className="btn btn-outline mt-4 cursor-pointer">
                Thay ảnh
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    setAvatar(URL.createObjectURL(file))
                  }}
                />
              </label>
            </div>
            <div className="settings-profile-grid">
              <Info label="Họ tên" value={patientUser.name} />
              <Info label="Tuổi" value={String(patientUser.age)} />
              <Info label="Số điện thoại" value={patientUser.phone} />
              <Info label="Chức vụ" value={patientUser.role} />
              <Info label="Email" value={patientUser.email} />
              <Info label="Khu vực" value={patientUser.location} />
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
