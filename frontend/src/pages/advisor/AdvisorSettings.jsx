import { useState } from 'react'
import { AppShell, Card, PageHeader } from '../../components/ui.jsx'

export function AdvisorSettings() {
  const [avatar, setAvatar] = useState('')

  return (
    <AppShell role="advisor">
      <div className="content-wide">
        <PageHeader title="Thông tin chuyên gia" subtitle="Quản lý hồ sơ chuyên gia tư vấn dữ liệu y khoa." />
        <Card>
          <div className="settings-social">
            <div className="settings-avatar">
              {avatar ? <img src={avatar} alt="avatar" /> : <span>CG</span>}
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
              <Info label="Họ tên" value="Chuyên gia dữ liệu" />
              <Info label="Tuổi" value="34" />
              <Info label="Số điện thoại" value="0912 445 778" />
              <Info label="Chức vụ" value="Cố vấn y khoa" />
              <Info label="Email" value="advisor@medconsult.vn" />
              <Info label="Kinh nghiệm" value="9 năm" />
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

function Info({ label, value }) {
  return <div className="info-box info-highlight"><small>{label}</small><b>{value}</b></div>
}
