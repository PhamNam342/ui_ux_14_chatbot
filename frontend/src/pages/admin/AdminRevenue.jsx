import { useState } from 'react'
import { CalendarDays, Download, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, StatCard, TopBar } from '../../components/ui.jsx'

const chartData = {
  Tuần: [120, 150, 178, 210, 196],
  Tháng: [520, 680, 760, 910, 1040],
  Năm: [4200, 5100, 6300, 7200, 8400],
}

const revenueBySpecialty = [
  { label: 'Nội tổng quát', value: 45, revenue: '578,000,000đ', color: '#9de4d5' },
  { label: 'Nhi khoa', value: 25, revenue: '321,000,000đ', color: '#14b8a6' },
  { label: 'Sản phụ khoa', value: 20, revenue: '257,000,000đ', color: '#111827' },
  { label: 'Khác', value: 10, revenue: '128,000,000đ', color: '#d5dbe3' },
]

export function AdminRevenue() {
  const [range, setRange] = useState('Tuần')
  const points = chartData[range]

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Báo cáo doanh thu"
          subtitle="Phân tích hiệu quả kinh doanh và số liệu thống kê chi tiết"
          action={<div className="flex gap-3"><Button variant="ghost"><CalendarDays size={16} /> Tháng 10, 2023</Button><Button variant="dark"><Download size={16} /> Xuất báo cáo</Button></div>}
        />
        <div className="grid gap-5 lg:grid-cols-4">
          <StatCard label="Tổng doanh thu" value="1.284 tỷ" delta="+12.5%" icon={<TrendingUp size={20} />} />
          <StatCard label="Số lượt khám" value="3,450" tone="blue" delta="+8.2%" icon={<Users size={20} />} />
          <StatCard label="Giá trị TB" value="372k" tone="amber" delta="-2.4%" icon={<TrendingDown size={20} />} />
          <StatCard label="Bệnh nhân mới" value="412" tone="violet" delta="+15.0%" icon={<Users size={20} />} />
        </div>

        <Card className="mt-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div><h2 className="section-title">Xu hướng doanh thu</h2><p className="text-sm text-slate-500">Thống kê theo {range.toLowerCase()} trong kỳ hiện tại</p></div>
            <div className="segmented">{Object.keys(chartData).map((item) => <button key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item}</button>)}</div>
          </div>
          <RevenueLineChart points={points} />
        </Card>

        <div className="mt-7 grid gap-7 lg:grid-cols-2">
          <Card>
            <h2 className="section-title">Doanh thu theo chuyên khoa</h2>
            <div className="revenue-donut-wrap">
              <div className="donut revenue-donut" />
              <div className="donut-legend">
                {revenueBySpecialty.map((item) => (
                  <div key={item.label}><span style={{ background: item.color }} /><b>{item.label}</b><em>{item.revenue} · {item.value}%</em></div>
                ))}
              </div>
            </div>
          </Card>
          <Card><h2 className="section-title">Bác sĩ doanh thu cao</h2>{['BS. Nguyễn Văn A','BS. Trần Đức B','BS. Lê Thị C','BS. Phạm Văn D'].map((name, i) => <div className="leader" key={name}><span className="avatar avatar-violet">★</span><div><b>{name}</b><p>{['Nội tổng quát','Nhi khoa','Sản phụ khoa','Da liễu'][i]}</p></div><strong>{[342,285,210,195][i]},000,000đ</strong></div>)}</Card>
        </div>
      </div>
    </AppShell>
  )
}

function RevenueLineChart({ points }) {
  const max = Math.max(...points)
  const coords = points.map((value, index) => {
    const x = 60 + index * 190
    const y = 280 - (value / max) * 190
    return { x, y, value }
  })
  const path = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${path} L ${coords.at(-1).x} 300 L ${coords[0].x} 300 Z`

  return (
    <div className="chart-line revenue-line mt-8">
      <svg viewBox="0 0 900 330" role="img" aria-label="Biểu đồ xu hướng doanh thu">
        {[80, 140, 200, 260].map((y) => <line key={y} x1="40" x2="860" y1={y} y2={y} stroke="#eef2f7" />)}
        <path d={areaPath} fill="#10b98122" />
        <path d={path} fill="none" stroke="#08ad8c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((point, index) => (
          <g key={point.x}>
            <circle cx={point.x} cy={point.y} r="6" fill="#08ad8c" stroke="#fff" strokeWidth="4" />
            <text x={point.x} y={point.y - 18} textAnchor="middle" className="chart-value">{point.value}</text>
            <text x={point.x} y="318" textAnchor="middle" className="chart-label">Kỳ {index + 1}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
