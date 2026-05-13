import { Link } from 'react-router-dom'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'

export function AdminDoctorDetail() {
  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Chi tiết bác sĩ" subtitle="Hồ sơ chuyên môn, lịch làm việc và hiệu suất gần đây" action={<Link to="/admin/doctors"><Button variant="ghost">Quay lại</Button></Link>} />
        <div className="grid gap-7 lg:grid-cols-[360px_1fr]">
          <Card><div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-teal-100 text-3xl font-black text-teal-700">NM</div><h2 className="mt-5 text-2xl font-black">Nguyễn Văn Minh</h2><p className="text-slate-500">Nội tổng quát</p><Badge tone="green">Đang làm việc</Badge></div></Card>
          <Card><h2 className="section-title">Thông tin liên hệ</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{['Phòng 102','0908 123 456','minh@medconsult.vn','12 năm kinh nghiệm'].map((v) => <div className="info-box" key={v}>{v}</div>)}</div></Card>
        </div>
      </div>
    </AppShell>
  )
}
