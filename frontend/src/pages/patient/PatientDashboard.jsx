import { AppShell, Badge, Card, PageHeader, StatCard, TopBar } from '../../components/ui.jsx'

const upcoming = [
  { date: '22/05/2026', time: '09:00', clinic: 'Phòng khám Đa khoa Tâm An', doctor: 'BS. Nguyễn Văn Minh', type: 'Khám trực tiếp' },
  { date: '23/05/2026', time: '14:00', clinic: 'Phòng khám Tim mạch An Bình', doctor: 'BS. Trần Thị Hoa', type: 'Tư vấn trực tuyến' },
]

const finished = [
  { date: '18/05/2026', title: 'Tư vấn trực tuyến', doctor: 'BS. Nguyễn Văn Minh', note: 'Đã nhận đơn thuốc và hướng dẫn tái khám.' },
  { date: '05/04/2026', title: 'Khám bệnh', doctor: 'BS. Trần Thị Hoa', note: 'Hoàn tất kiểm tra định kỳ tim mạch.' },
]

export function PatientDashboard() {
  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Dashboard bệnh nhân" subtitle="Theo dõi lịch hẹn sắp tới, các ca khám gần đây và nhắc nhở điều trị của bạn." />
        <div className="grid gap-6 lg:grid-cols-3">
          <StatCard label="Ca khám lịch hẹn" value="02" delta="1 lịch trong ngày mai" />
          <StatCard label="Đã khám xong" value="05" tone="blue" delta="Đã hoàn tất 1 phiên tuần này" />
          <StatCard label="Nhắc tái khám" value="03" tone="amber" delta="Còn 2 nhắc trong tháng" />
        </div>

        <div className="mt-7 grid gap-7 lg:grid-cols-[1.12fr_0.88fr]">
          <Card>
            <h2 className="section-title">Ca khám lịch hẹn</h2>
            <div className="mt-5 space-y-4">
              {upcoming.map((item) => (
                <div className="admin-calendar-event" key={`${item.date}-${item.time}`}>
                  <time>{item.time}</time>
                  <div><b>{item.clinic}</b><p>{item.doctor} · {item.type}</p></div>
                  <Badge tone="green">{item.date}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Nhắc nhở điều trị</h2>
            <div className="mt-5 space-y-3">
              {['Uống Paracetamol sau bữa sáng và tối.', 'Đo nhiệt độ mỗi 6 giờ trong 2 ngày tới.', 'Tái khám nếu còn sốt trên 38°C sau 48 giờ.'].map((item) => (
                <div className="rounded-lg bg-teal-50 p-4 text-sm font-semibold text-slate-700" key={item}>{item}</div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-7">
          <h2 className="section-title">Các ca đã khám xong</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {finished.map((item) => (
              <div key={`${item.date}-${item.title}`} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><b>{item.title}</b><p className="mt-2 text-sm text-slate-500">{item.date} · {item.doctor}</p></div>
                  <Badge tone="blue">Hoàn tất</Badge>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
