import { AppShell, Badge, Card, PageHeader, StatCard, TopBar } from '../../components/ui.jsx'
import { CalendarDays, CheckCircle2, BellPlus, Heart, Weight, TrendingUp } from 'lucide-react'

const upcoming = [
  { date: '22/05/2026', time: '09:00', clinic: 'Phòng khám Đa khoa Tâm An', doctor: 'BS. Nguyễn Văn Minh', type: 'Khám trực tiếp' },
  { date: '23/05/2026', time: '14:00', clinic: 'Phòng khám Tim mạch An Bình', doctor: 'BS. Trần Thị Hoa', type: 'Tư vấn trực tuyến' },
]

const finished = [
  { date: '18/05/2026', title: 'Tư vấn trực tuyến', doctor: 'BS. Nguyễn Văn Minh', note: 'Đã nhận đơn thuốc và hướng dẫn tái khám.' },
  { date: '05/04/2026', title: 'Khám bệnh', doctor: 'BS. Trần Thị Hoa', note: 'Hoàn tất kiểm tra định kỳ tim mạch.' },
]

const healthMetrics = [
  { label: 'Nhịp tim', value: '72', unit: 'bpm', status: 'Bình thường', icon: 'heart', trend: '7 ngày trước' },
  { label: 'Cân nặng', value: '63.5', unit: 'kg', status: 'Ổn định', icon: 'weight', trend: '1 tháng trước (60kg)' },
]

export function PatientDashboard() {
  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader eyebrow="Tổng quan sức khỏe" title="Dashboard bệnh nhân" subtitle="Theo dõi lịch hẹn sắp tới, các ca khám gần đây và nhắc nhở điều trị của bạn." />
        <div className="grid gap-6 lg:grid-cols-3">
          <StatCard
            label="Ca khám lịch hẹn"
            value="02"
            delta="1 lịch trong ngày mai"
            icon={<CalendarDays size={18} />}
          />
          <StatCard
            label="Đã khám xong"
            value="05"
            tone="blue"
            delta="Đã hoàn tất 1 phiên tuần này"
            icon={<CheckCircle2 size={18} />}
          />
          <StatCard
            label="Nhắc tái khám"
            value="03"
            tone="amber"
            delta="Còn 2 nhắc trong tháng"
            icon={<BellPlus size={18} />}
          />
        </div>

        {/* Health Metrics Section */}
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="section-title">Chi số sức khỏe</h2>
            <div className="mt-5 space-y-6">
              {/* Heart Rate */}
              <div className="border-b pb-5 last:border-b-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Heart size={18} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Nhịp tim</p>
                      <p className="text-xs text-gray-500">Bình thường</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">72</p>
                    <p className="text-xs text-gray-500">bpm</p>
                  </div>
                </div>
                <div className="flex gap-1 h-1">
                  {[40, 55, 65, 72, 68].map((val, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-red-500 to-red-300 rounded-full" style={{ opacity: 0.4 + (val / 100) * 0.6 }}></div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Hôm nay</p>
              </div>

              {/* Weight */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <TrendingUp size={18} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Cân nặng</p>
                      <p className="text-xs text-gray-500">Ổn định</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">63.5</p>
                    <p className="text-xs text-gray-500">kg</p>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-12">
                  {[60, 61, 62, 62.5, 63, 63.2, 63.5].map((val, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t" style={{ height: `${(val / 65) * 100}%`, opacity: 0.6 + (i / 10) }}></div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">1 tháng trước (60kg)</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Thông tin y tế</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">Lịch sử bệnh</div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">05/2026:</span> Viêm họng cấp - Sốt, ho khan, đau họng kéo dài
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">04/2026:</span> Theo dõi tim mạch - Đau ngực nhẹ khi vận động
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">01/2026:</span> Viêm dạ dày - Đau bụng thượng vị, ợ chua
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">Dị ứng</div>
                <div className="text-sm text-gray-600">Không có dị ứng thuốc được ghi nhận</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-7 grid gap-7 lg:grid-cols-[1.12fr_0.88fr]">
          <Card className="light-teal-card">
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
