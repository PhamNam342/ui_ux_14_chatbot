import {
  Activity,
  CalendarCheck2,
  ClipboardCheck,
  FileHeart,
  HeartPulse,
  Pill,
  Stethoscope,
  Thermometer,
  Wind,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { patientHistory } from '../../data/mock.js'

const metrics = [
  { label: 'Nhịp tim', value: '72', unit: 'bpm', status: 'Bình thường', tone: 'green', icon: <HeartPulse size={18} />, trend: [64, 68, 66, 72, 69, 72], updated: '08:30 hôm nay', history: 'Gần nhất: 69 bpm · 20:15 hôm qua' },
  { label: 'SpO2', value: '98', unit: '%', status: 'Bình thường', tone: 'green', icon: <Wind size={18} />, trend: [96, 97, 97, 98, 97, 98], updated: '08:28 hôm nay', history: 'Gần nhất: 97% · 20:12 hôm qua' },
  { label: 'Huyết áp', value: '118/78', unit: 'mmHg', status: 'Ổn định', tone: 'teal', icon: <Activity size={18} />, trend: [72, 76, 73, 78, 75, 78], updated: '08:25 hôm nay', history: 'Gần nhất: 121/80 · 20:10 hôm qua' },
  { label: 'BMI', value: '22.4', unit: 'kg/m²', status: 'Cần theo dõi', tone: 'amber', icon: <ClipboardCheck size={18} />, trend: [23, 22, 22, 23, 22, 22], updated: '24/05/2026', history: 'Gần nhất: 22.7 kg/m² · tháng trước' },
  { label: 'Nhiệt độ', value: '36.7', unit: '°C', status: 'Bình thường', tone: 'green', icon: <Thermometer size={18} />, trend: [37, 36, 37, 37, 36, 37], updated: '08:20 hôm nay', history: 'Gần nhất: 36.8°C · 20:05 hôm qua' },
]

const diagnoses = [
  { issue: 'Viêm họng cấp', detail: 'Sốt, ho khan, đau họng kéo dài', date: '18/05/2026', doctor: 'BS. Nguyễn Văn Minh', status: 'Đang điều trị', tone: 'green' },
  { issue: 'Theo dõi tim mạch', detail: 'Đau ngực nhẹ khi vận động', date: '05/04/2026', doctor: 'BS. Trần Thị Hoa', status: 'Theo dõi', tone: 'yellow' },
  { issue: 'Viêm dạ dày', detail: 'Đau bụng thượng vị, ợ chua', date: '12/01/2026', doctor: 'BS. Vũ Thanh Lam', status: 'Tái khám', tone: 'blue' },
]

const monthVisits = [2, 1, 3, 2, 4, 2]
const diagnosisTrend = [1, 1, 2, 2, 3, 3]

export function PatientRecords() {
  const navigate = useNavigate()
  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide health-record-page">
        <PageHeader eyebrow="Hồ sơ sức khỏe" title="Hồ sơ bệnh án" subtitle="Theo dõi toàn diện sức khỏe, chẩn đoán và hành trình điều trị của bạn." />

        <section className="health-summary-grid">
          <Summary icon={<Stethoscope size={19} />} label="Tổng số lần khám" value="12" note="+2 lần khám tháng này" trend="up" />
          <Summary icon={<FileHeart size={19} />} label="Chẩn đoán đã phát hiện" value="03" note="1 bệnh đã khỏi" trend="down" />
          <Summary icon={<Pill size={19} />} label="Đơn thuốc gần nhất" value="18/05" note="Tuân thủ điều trị tốt" trend="up" />
          <Summary icon={<CalendarCheck2 size={19} />} label="Lần khám gần nhất" value="18/05" note="Sức khỏe cải thiện" trend="up" />
        </section>

        <Card className="health-metric-section">
          <div className="health-section-heading">
            <div><h2>Chỉ số sức khỏe hiện tại</h2><p>Cập nhật gần nhất hôm nay, lúc 08:30</p></div>
            <Badge tone="green">Ổn định</Badge>
          </div>
          <div className="health-metric-grid">
            {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </div>
        </Card>

        <section className="health-chart-grid">
          <Card className="health-chart-card">
            <div className="health-section-heading"><div><h2>Tần suất khám theo tháng</h2><p>Số lượt khám và tư vấn trong 6 tháng gần nhất</p></div></div>
            <BarChart values={monthVisits} />
          </Card>
          <Card className="health-chart-card">
            <div className="health-section-heading"><div><h2>Diễn biến chẩn đoán</h2><p>Số nhóm bệnh được ghi nhận theo thời gian</p></div></div>
            <LineChart values={diagnosisTrend} />
          </Card>
        </section>

        <section className="record-lower-grid">
          <Card>
            <div className="health-section-heading"><div><h2>Bệnh và chẩn đoán đã phát hiện</h2><p>Danh sách tình trạng cần tiếp tục theo dõi</p></div></div>
            <div className="diagnosis-card-list">
              {diagnoses.map((record, index) => (
                <article className="diagnosis-card" key={record.issue}>
                  <span className={`diagnosis-icon diagnosis-${index === 1 ? 'amber' : 'teal'}`}><FileHeart size={17} /></span>
                  <div><h3>{record.issue}</h3><p>{record.detail}</p><small>Phát hiện: {record.date} · {record.doctor}</small></div>
                  <Badge tone={record.tone}>{record.status}</Badge>
                </article>
              ))}
            </div>
          </Card>

          <Card>
            <div className="health-section-heading"><div><h2>Timeline lịch sử khám</h2><p>Thông tin khám và điều trị gần đây</p></div></div>
            <div className="health-timeline">
              {patientHistory.map((item) => (
                <article className={`timeline-${item.type === 'Tư vấn trực tuyến' ? 'online' : item.type === 'Tái khám' ? 'followup' : 'clinic'}`} key={item.id}>
                  <i />
                  <div className="health-timeline-date">{item.date}</div>
                  <div className="health-timeline-content">
                    <div className="health-timeline-title"><h3>{item.diagnosis}</h3><Badge tone="green">{item.type}</Badge></div>
                    <p>{item.clinic} · {item.doctor}</p>
                    <small>Đơn thuốc: {item.prescription}</small>
                    <Button variant="ghost" onClick={() => navigate('/patient/history')}>Xem chi tiết</Button>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  )
}

function Summary({ icon, label, value, note, trend }) {
  return <Card className="health-summary-card"><span>{icon}</span><div><p>{label}</p><strong>{value}</strong><small className={trend}>{trend === 'down' ? '↓' : '↑'} {note}</small></div><i>{icon}</i></Card>
}

function MetricCard({ label, value, unit, status, tone, icon, trend, updated, history }) {
  return (
    <article className={`health-metric-card metric-${tone}`}>
      <div className="health-metric-top"><span>{icon}</span><small>{status}</small></div>
      <p>{label}</p><strong>{value} <em>{unit}</em></strong>
      <Sparkline values={trend} />
      <small className="health-metric-updated">Cập nhật: {updated}</small>
      <div className="health-metric-history">{history}</div>
    </article>
  )
}

function Sparkline({ values }) {
  const points = values.map((value, index) => `${index * 20},${32 - (value - Math.min(...values)) * (24 / Math.max(1, Math.max(...values) - Math.min(...values)))}`).join(' ')
  return <svg className="health-sparkline" viewBox="0 0 100 36" preserveAspectRatio="none"><polyline points={points} /></svg>
}

function BarChart({ values }) {
  return <div className="health-bar-chart">{values.map((value, index) => <div key={index}><span style={{ height: `${value * 22}px` }} /><small>{['T1', 'T2', 'T3', 'T4', 'T5', 'T6'][index]}</small></div>)}</div>
}

function LineChart({ values }) {
  const points = values.map((value, index) => `${50 + index * 100},${120 - value * 30}`).join(' ')
  return (
    <div className="health-line-chart">
      <svg viewBox="0 0 600 120" style={{ width: '100%', height: '111px' }}>
        <polyline points={points} />
        {values.map((value, index) => (
          <circle key={index} cx={50 + index * 100} cy={120 - value * 30} r="5.5" />
        ))}
      </svg>
      <div>
        {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((month) => (
          <small key={month}>{month}</small>
        ))}
      </div>
    </div>
  )
}
