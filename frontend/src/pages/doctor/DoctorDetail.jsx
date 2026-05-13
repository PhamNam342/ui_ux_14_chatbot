import { Link } from 'react-router-dom'
import { AppShell, Avatar, Badge, Button, Card, PageHeader } from '../../components/ui.jsx'

export function DoctorDetail() {
  return (
    <AppShell role="doctor">
      <div className="content-wide">
        <PageHeader title="Chi tiết ca bệnh" subtitle="CA250501-001 - Trần Thị Mai" action={<Link to="/doctor/consult"><Button>Bắt đầu tư vấn</Button></Link>} />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card>
            <h2 className="section-title">Triệu chứng ban đầu</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Bệnh nhân sốt 38.5°C, ho khan, đau họng và mệt mỏi từ hôm qua. Không ghi nhận khó thở nghiêm trọng.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Badge tone="yellow">Trung bình</Badge>
              <Badge>Sốt</Badge>
              <Badge>Ho khan</Badge>
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Thông tin nhanh</h2>
            <div className="patient-summary">
              <Avatar>TM</Avatar>
              <div>
                <h3>Trần Thị Mai</h3>
                <p>CA250501-001</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Info label="Tuổi" value="42" />
                <Info label="Giới tính" value="Nữ" />
              </div>
              <Info label="Số điện thoại" value="0901 234 567" />
              <Info label="Trạng thái" value="Chờ tư vấn" teal />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function Info({ label, value, teal }) {
  return <div className="info-box"><small>{label}</small><b className={teal ? 'text-teal-600' : ''}>{value}</b></div>
}
