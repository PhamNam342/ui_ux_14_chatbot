import { useState } from 'react'
import { CalendarDays, Download, Star, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, StatCard, TopBar } from '../../components/ui.jsx'

const chartData = {
  Tuần: [120, 150, 178, 210, 196],
  Tháng: [520, 680, 760, 910, 1040],
  Năm: [4200, 5100, 6300, 7200, 8400],
}

const clinics = ['Tất cả phòng khám', 'Phòng khám Đa khoa Tâm An', 'Phòng khám Tim mạch An Bình', 'MedCare Family Clinic']

const monthlyRevenue = {
  'Phòng khám Đa khoa Tâm An': [820, 910, 980, 1120, 1280, 1360],
  'Phòng khám Tim mạch An Bình': [640, 720, 790, 860, 930, 1010],
  'MedCare Family Clinic': [520, 610, 690, 760, 840, 900],
}

const revenueBySpecialty = {
  'Tất cả phòng khám': {
    'Tháng 1': [578, 321, 257, 128], 'Tháng 2': [610, 340, 270, 140], 'Tháng 3': [640, 360, 290, 150],
    'Tháng 4': [700, 390, 310, 160], 'Tháng 5': [740, 410, 330, 170], 'Tháng 6': [780, 430, 350, 180],
  },
  'Phòng khám Đa khoa Tâm An': {
    'Tháng 1': [320, 192, 128, 0], 'Tháng 2': [350, 210, 140, 0], 'Tháng 3': [370, 220, 150, 0],
    'Tháng 4': [400, 240, 160, 0], 'Tháng 5': [430, 260, 170, 0], 'Tháng 6': [460, 280, 180, 0],
  },
  'Phòng khám Tim mạch An Bình': {
    'Tháng 1': [448, 192, 0, 0], 'Tháng 2': [480, 200, 0, 0], 'Tháng 3': [510, 210, 0, 0],
    'Tháng 4': [540, 230, 0, 0], 'Tháng 5': [570, 240, 0, 0], 'Tháng 6': [600, 250, 0, 0],
  },
  'MedCare Family Clinic': {
    'Tháng 1': [208, 182, 130, 0], 'Tháng 2': [220, 190, 140, 0], 'Tháng 3': [235, 200, 150, 0],
    'Tháng 4': [250, 215, 160, 0], 'Tháng 5': [265, 230, 170, 0], 'Tháng 6': [280, 245, 180, 0],
  },
}

const specialtyLabels = {
  'Tất cả phòng khám': ['Nội tổng quát', 'Nhi khoa', 'Sản phụ khoa', 'Khác'],
  'Phòng khám Đa khoa Tâm An': ['Nội tổng quát', 'Nhi khoa', 'Da liễu'],
  'Phòng khám Tim mạch An Bình': ['Tim mạch', 'Nội tổng quát'],
  'MedCare Family Clinic': ['Gia đình', 'Nhi khoa', 'Dinh dưỡng'],
}

const SPEC_COLORS = ['#08ad8c', '#08ad8c', '#08ad8c', '#08ad8c']

const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6']

export function AdminRevenue() {
  const [range, setRange] = useState('Tuần')
  const [clinic, setClinic] = useState('Tất cả phòng khám')
  const [period, setPeriod] = useState('Tháng')
  const [specClinic, setSpecClinic] = useState('Tất cả phòng khám')
  const [specMonth, setSpecMonth] = useState('Tháng 1')
  const points = chartData[range]
  const bars = clinic === 'Tất cả phòng khám'
    ? [1980, 2240, 2460, 2740, 3050, 3270]
    : monthlyRevenue[clinic]

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
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <label className="field-label">Quản lý phòng khám</label>
              <select className="input" value={clinic} onChange={(event) => setClinic(event.target.value)}>
                {clinics.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Chu kỳ báo cáo</label>
              <select className="input" value={period} onChange={(event) => setPeriod(event.target.value)}>
                <option>Tháng</option>
                <option>Năm</option>
              </select>
            </div>
          </div>
          <RevenueBarChart values={bars} period={period} />
        </Card>

        <Card className="mt-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div><h2 className="section-title">Xu hướng doanh thu</h2><p className="text-sm text-slate-500">Thống kê theo {range.toLowerCase()} trong kỳ hiện tại</p></div>
            <div className="segmented">{Object.keys(chartData).map((item) => <button key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item}</button>)}</div>
          </div>
          <RevenueLineChart points={points} />
        </Card>

        <Card className="mt-7">
          <div className="grid gap-6 md:grid-cols-[1fr_260px]">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="section-title !mb-0">Doanh thu theo chuyên khoa</h2>
                  <p className="text-sm text-slate-400 mt-1">X: Chuyên khoa – Y: Doanh thu (triệu VNĐ)</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select className="input !py-1.5 !text-sm" value={specClinic} onChange={e => setSpecClinic(e.target.value)}>
                    {clinics.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select className="input !py-1.5 !text-sm" value={specMonth} onChange={e => setSpecMonth(e.target.value)}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <SpecBarChart
                values={revenueBySpecialty[specClinic]?.[specMonth] ?? []}
                labels={specialtyLabels[specClinic] ?? []}
              />
            </div>
            <div className="flex items-center justify-center">
              {(() => {
                const vals = revenueBySpecialty[specClinic]?.[specMonth] ?? []
                const total = vals.filter(v => v > 0).reduce((a, b) => a + b, 0)
                return (
                  <div className="w-full rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-100 border border-teal-200 p-6 text-center">
                    <p className="text-sm text-teal-600 font-semibold mb-1">{specClinic === 'Tất cả phòng khám' ? 'Tất cả cơ sở' : specClinic}</p>
                    <p className="text-xs text-teal-500 mb-4">{specMonth}</p>
                    <p className="text-3xl font-black text-teal-700">{total.toLocaleString('vi-VN')}</p>
                    <p className="text-sm text-teal-500 mt-1">triệu VNĐ</p>
                    <div className="mt-4 pt-4 border-t border-teal-200">
                      <p className="text-xs text-teal-400 uppercase tracking-wide">Tổng doanh thu tháng</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </Card>

        <div className="mt-7 grid gap-7 lg:grid-cols-2">
          <Card>
            <h2 className="section-title">Tỷ lệ doanh thu theo chuyên khoa</h2>
            <div className="revenue-donut-wrap">
              <div className="donut revenue-donut" />
              <div className="donut-legend">
                {[
                  { label: 'Nội tổng quát', value: 45, revenue: '578,000,000đ', color: '#9de4d5' },
                  { label: 'Nhi khoa', value: 25, revenue: '321,000,000đ', color: '#14b8a6' },
                  { label: 'Sản phụ khoa', value: 20, revenue: '257,000,000đ', color: '#111827' },
                  { label: 'Khác', value: 10, revenue: '128,000,000đ', color: '#d5dbe3' },
                ].map(item => (
                  <div key={item.label}><span style={{ background: item.color }} /><b>{item.label}</b><em>{item.revenue} · {item.value}%</em></div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="section-title">Bác sĩ doanh thu cao</h2>
            {['BS. Nguyễn Văn A','BS. Trần Đức B','BS. Lê Thị C','BS. Phạm Văn D'].map((name, i) => (
              <div className="leader" key={name}>
                <span className="avatar avatar-violet"><Star size={15} fill="currentColor" /></span>
                <div><b>{name}</b><p>{['Nội tổng quát','Nhi khoa','Sản phụ khoa','Da liễu'][i]}</p></div>
                <strong>{[342,285,210,195][i]},000,000đ</strong>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function RevenueBarChart({ values, period }) {
  const max = Math.max(...values)
  const labels = period === 'Tháng' ? ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'] : ['2021', '2022', '2023', '2024', '2025', '2026']

  return (
    <div className="revenue-bars mt-7">
      {values.map((value, index) => (
        <div className="revenue-bar" key={labels[index]}>
          <strong>{value}tr</strong>
          <span style={{ height: `${Math.max((value / max) * 220, 24)}px` }} />
          <small>{labels[index]}</small>
        </div>
      ))}
    </div>
  )
}

function SpecBarChart({ values, labels }) {
  const filtered = values.map((v, i) => ({ v, label: labels[i] })).filter(item => item.v > 0)
  if (!filtered.length) return <div className="mt-6 py-8 text-center text-slate-400 text-sm">Không có dữ liệu</div>
  const max = Math.max(...filtered.map(item => item.v))
  return (
    <div className="revenue-bars mt-6">
      {filtered.map((item) => (
        <div className="revenue-bar" key={item.label}>
          <strong style={{ color: '#08ad8c' }}>{item.v}</strong>
          <span style={{ height: `${Math.max((item.v / max) * 220, 24)}px`, background: '#08ad8c' }} />
          <small>{item.label}</small>
        </div>
      ))}
    </div>
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
            <text x={point.x} y={point.y - 18} textAnchor="middle" className="chart-value">{point.value}tr</text>
            <text x={point.x} y="318" textAnchor="middle" className="chart-label">Kỳ {index + 1}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
