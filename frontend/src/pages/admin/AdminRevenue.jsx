import { useState } from 'react'
import { Award, CalendarDays, Download, Star, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, StatCard, TopBar } from '../../components/ui.jsx'

const timeRevenue = {
  Tuần: [420, 510, 470, 610, 760],
  Tháng: [1980, 2240, 2460, 2740, 3050, 3270],
  Quý: [5500, 6280, 7100, 8120],
  Năm: [4200, 5100, 6300, 7200, 8400],
}

const growthData = {
  Tuần: [2.1, 4.8, 3.2, 6.4, 8.2],
  Tháng: [4.2, 5.1, 5.8, 6.3, 7.4, 8.2],
  Quý: [4.6, 5.8, 7.1, 8.2],
  Năm: [3.8, 4.6, 5.2, 6.7, 8.2],
}

const analyticsLabels = {
  Tuần: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'],
  Tháng: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
  Quý: ['Q1', 'Q2', 'Q3', 'Q4'],
  Năm: ['2021', '2022', '2023', '2024', '2025'],
}

const analyticsTooltipLabels = {
  Tuần: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'],
  Tháng: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
  Quý: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'],
  Năm: ['Năm 2021', 'Năm 2022', 'Năm 2023', 'Năm 2024', 'Năm 2025'],
}

const revenueTrends = {
  Tuần: [5.1, 7.4, -2.8, 9.6, 12.5],
  Tháng: [6.8, 7.1, 8.3, 9.4, 11.2, 12.5],
  Quý: [7.4, 9.1, 10.8, 12.5],
  Năm: [6.2, 8.6, 10.1, 11.4, 12.5],
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

const SPEC_COLORS = ['#0f766e', '#14b8a6', '#6366f1', '#f59e0b']
const SPEC_TRENDS = [8.4, 3.2, -1.5, 2.1]
const SPEC_VISITS = [1240, 860, 710, 395]

const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6']

export function AdminRevenue() {
  const [clinic, setClinic] = useState('Tất cả phòng khám')
  const [specClinic, setSpecClinic] = useState('Tất cả phòng khám')
  const [specMonth, setSpecMonth] = useState('Tháng 1')
  const [notice, setNotice] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const notify = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const exportReport = () => {
    setIsExporting(true)
    window.setTimeout(() => {
      setIsExporting(false)
      notify('Đã chuẩn bị báo cáo doanh thu để tải xuống')
    }, 800)
  }

  return (
    <AppShell role="admin">
      <TopBar />
      {notice && <div className="admin-action-toast">{notice}</div>}
      <div className="content-wide">
        <PageHeader
          title="Báo cáo doanh thu"
          subtitle="Phân tích hiệu quả kinh doanh và số liệu thống kê chi tiết"
          action={<div className="flex gap-3"><Button variant="ghost" onClick={() => notify('Đã mở bộ lọc kỳ báo cáo')}><CalendarDays size={16} /> Tháng 10, 2023</Button><Button disabled={isExporting} variant="dark" onClick={exportReport}><Download size={16} /> {isExporting ? 'Đang xuất' : 'Xuất báo cáo'}</Button></div>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tổng doanh thu" value="1.284 tỷ" delta="+12.5%" icon={<TrendingUp size={20} />} />
          <StatCard label="Số lượt khám" value="3,450" tone="blue" delta="+8.2%" icon={<Users size={20} />} />
          <StatCard label="Giá trị TB" value="372k" tone="amber" delta="-2.4%" icon={<TrendingDown size={20} />} />
          <StatCard label="Bệnh nhân mới" value="412" tone="violet" delta="+15.0%" icon={<Users size={20} />} />
        </div>

        <RevenueOverviewAnalytics clinic={clinic} onClinicChange={setClinic} />

        <SpecialtyRevenueAnalytics
          clinic={specClinic}
          month={specMonth}
          onClinicChange={setSpecClinic}
          onMonthChange={setSpecMonth}
          values={revenueBySpecialty[specClinic]?.[specMonth] ?? []}
          labels={specialtyLabels[specClinic] ?? []}
        />

        <div className="mt-7">
          <Card>
            <h2 className="section-title">Bác sĩ doanh thu cao</h2>
            <div className="grid gap-x-8 md:grid-cols-2">{['BS. Nguyễn Văn A','BS. Trần Đức B','BS. Lê Thị C','BS. Phạm Văn D'].map((name, i) => (
              <div className="leader" key={name}>
                <span className="avatar avatar-violet"><Star size={15} fill="currentColor" /></span>
                <div><b>{name}</b><p>{['Nội tổng quát','Nhi khoa','Sản phụ khoa','Da liễu'][i]}</p></div>
                <strong>{[342,285,210,195][i]},000,000đ</strong>
              </div>
            ))}</div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function RevenueOverviewAnalytics({ clinic, onClinicChange }) {
  const [period, setPeriod] = useState('Tháng')
  const [growthRange, setGrowthRange] = useState('Tháng')
  const [activeIndex, setActiveIndex] = useState(null)
  const values = clinic !== 'Tất cả phòng khám' && period === 'Tháng' ? monthlyRevenue[clinic] : timeRevenue[period]
  const growth = growthData[growthRange]
  const labels = analyticsLabels[period]
  const growthLabels = analyticsLabels[growthRange]
  const tooltipLabels = analyticsTooltipLabels[period]
  const growthTooltipLabels = analyticsTooltipLabels[growthRange]
  const max = Math.ceil(Math.max(...values) / 500) * 500
  const revenueTicks = [1, .75, .5, .25, 0].map((ratio) => ({ ratio, value: max * ratio }))
  const growthTicks = [10, 8, 6, 4, 2]
  const growthCoords = growth.map((value, index) => ({ x: 45 + index * (280 / (growth.length - 1)), y: 170 - (value / 10) * 110, value }))
  const growthPath = growthCoords.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
  const growthArea = `${growthPath} L ${growthCoords.at(-1).x} 170 L ${growthCoords[0].x} 170 Z`
  const formatRevenue = (value) => value >= 1000 ? `${(value / 1000).toFixed(3)} tỷ VNĐ` : `${value} triệu VNĐ`
  const formatAxisRevenue = (value) => value >= 1000 ? `${value / 1000}tỷ` : `${value}tr`
  const periodName = period.toLowerCase()
  const growthPeriodName = growthRange.toLowerCase()

  return (
    <section className="revenue-overview-grid mt-7">
      <Card className="revenue-overview-card">
        <header className="revenue-overview-head">
          <div><span>REVENUE ANALYTICS</span><h2>Doanh thu theo thời gian</h2><p>Phân tích doanh thu theo {periodName}</p></div>
          <select className="input" value={clinic} onChange={(event) => onClinicChange(event.target.value)}>{clinics.map((item) => <option key={item}>{item}</option>)}</select>
        </header>
        <div className="revenue-overview-summary"><div><small>TỔNG DOANH THU</small><strong>1.284 tỷ VNĐ</strong></div><em>↑ 12.5% <small>so với tháng trước</small></em></div>
        <div className="revenue-overview-segmented">{Object.keys(timeRevenue).map((item) => <button className={period === item ? 'is-active' : ''} key={item} onClick={() => { setActiveIndex(null); setPeriod(item) }} type="button">{item}</button>)}</div>
        <div className="revenue-bar-chart">
          <div className="revenue-y-axis">{revenueTicks.map((tick) => <small key={tick.ratio} style={{ bottom: `${tick.ratio * 150}px` }}>{formatAxisRevenue(tick.value)}</small>)}</div>
          <div className="revenue-bar-plot">
            <div className="revenue-grid-lines">{revenueTicks.map((tick) => <i key={tick.ratio} style={{ bottom: `${tick.ratio * 150}px` }} />)}</div>
            <div className="revenue-overview-bars" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(38px, 1fr))` }}>
              {values.map((value, index) => <button className={`revenue-overview-bar ${activeIndex === null || activeIndex === index ? 'is-active' : 'is-muted'}`} key={`${period}-${labels[index]}-${index}`} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} type="button">
                <strong>{formatAxisRevenue(value)}</strong><span><i style={{ height: `${Math.max((value / max) * 150, 20)}px` }} /></span><small>{labels[index]}</small>
                <em><b>{tooltipLabels[index]}</b><small>Doanh thu: {formatRevenue(value)}</small><small>Tăng: {revenueTrends[period][index]}%</small></em>
              </button>)}
            </div>
          </div>
        </div>
      </Card>
      <Card className="revenue-overview-card revenue-growth-card">
        <header className="revenue-overview-head"><div><span>GROWTH INSIGHTS</span><h2>Xu hướng tăng trưởng</h2><p>Theo dõi tốc độ tăng trưởng theo {growthPeriodName}</p></div></header>
        <div className="revenue-overview-summary"><div><small>TĂNG TRƯỞNG HIỆN TẠI</small><strong>↑ 8.2%</strong></div><em>Ổn định <small>so với kỳ trước</small></em></div>
        <div className="revenue-overview-segmented">{Object.keys(growthData).map((item) => <button className={growthRange === item ? 'is-active' : ''} key={item} onClick={() => { setActiveIndex(null); setGrowthRange(item) }} type="button">{item}</button>)}</div>
        <div className="revenue-growth-chart">
          <svg viewBox="0 0 360 210" role="img" aria-label="Biểu đồ xu hướng tăng trưởng">
            {growthTicks.map((value) => {
              const y = 170 - (value / 10) * 110
              return <g className="revenue-growth-grid" key={value}><line stroke="#e2e8f0" x1="45" x2="335" y1={y} y2={y} /><text x="37" y={y + 3} textAnchor="end">{value}%</text></g>
            })}
            <path d={growthArea} fill="#14b8a622" />
            <path d={growthPath} fill="none" stroke="#0f766e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            {growthCoords.map((point, index) => <g className={activeIndex === null || activeIndex === index ? 'is-active' : 'is-muted'} key={point.x} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
              <title>{`${growthTooltipLabels[index]}: tăng trưởng ${point.value}%`}</title>
              <circle cx={point.x} cy={point.y} fill="#fff" r={activeIndex === index ? '7' : '5'} stroke="#0f766e" strokeWidth="3" />
              <text className="revenue-growth-value" textAnchor="middle" x={point.x} y={point.y - 13}>{point.value}%</text>
            </g>)}
            {growthLabels.map((label, index) => <text className="revenue-growth-label" key={label} textAnchor="middle" x={growthCoords[index].x} y="195">{label}</text>)}
          </svg>
        </div>
      </Card>
    </section>
  )
}

function SpecialtyRevenueAnalytics({ clinic, month, onClinicChange, onMonthChange, values, labels }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const specialties = values.map((revenue, index) => ({
    color: SPEC_COLORS[index],
    label: labels[index],
    revenue,
    trend: SPEC_TRENDS[index],
    visits: SPEC_VISITS[index],
  })).filter((item) => item.revenue > 0 && item.label)
  const total = specialties.reduce((sum, item) => sum + item.revenue, 0)
  const specialtiesWithShare = specialties.map((item, index) => ({
    ...item,
    offset: specialties.slice(0, index).reduce((sum, previousItem) => sum + ((previousItem.revenue / total) * 100), 0),
    percentage: (item.revenue / total) * 100,
  }))
  const max = Math.max(...specialties.map((item) => item.revenue), 1)
  const topSpecialty = specialties[0]

  return (
    <Card className="specialty-analytics mt-7">
      <header className="specialty-analytics-head">
        <div><span>PHÂN TÍCH CHUYÊN KHOA</span><h2>Doanh thu theo chuyên khoa</h2><p>So sánh doanh thu tuyệt đối, tỷ trọng đóng góp và xu hướng tăng trưởng.</p></div>
        <div className="specialty-analytics-filters">
          <select className="input" value={clinic} onChange={(event) => onClinicChange(event.target.value)}>{clinics.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="input" value={month} onChange={(event) => onMonthChange(event.target.value)}>{MONTHS.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </header>
      {!specialties.length ? <div className="specialty-empty">Không có dữ liệu doanh thu trong kỳ này.</div> : <div className="specialty-analytics-grid">
        <section className="specialty-bars-panel">
          <div className="specialty-panel-title"><div><b>Doanh thu tuyệt đối</b><small>Đơn vị: triệu VNĐ</small></div><strong>{total.toLocaleString('vi-VN')} triệu</strong></div>
          <div className="specialty-horizontal-bars">
            {specialties.map((item, index) => {
              const isActive = activeIndex === null || activeIndex === index
              return <button className={`specialty-horizontal-bar ${isActive ? 'is-active' : 'is-muted'}`} key={item.label} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} type="button">
                <span className="specialty-bar-label"><b>{item.label}</b><small>{item.visits.toLocaleString('vi-VN')} lượt khám</small></span>
                <span className="specialty-bar-track"><i style={{ background: item.color, width: `${Math.max((item.revenue / max) * 100, 7)}%` }} /></span>
                <strong>{item.revenue}tr</strong>
                <em className={item.trend < 0 ? 'is-down' : ''}>{item.trend < 0 ? '↓' : '↑'} {Math.abs(item.trend)}%</em>
                <span className="specialty-tooltip"><b>{item.label}</b><small>Doanh thu: {item.revenue} triệu VNĐ</small><small>Tăng trưởng: {item.trend > 0 ? '+' : ''}{item.trend}%</small><small>Lượt khám: {item.visits.toLocaleString('vi-VN')}</small></span>
              </button>
            })}
          </div>
        </section>
        <aside className="specialty-share-panel">
          <div className="specialty-top-card"><Award size={19} /><div><small>TOP CHUYÊN KHOA</small><b>{topSpecialty.label}</b><strong>{topSpecialty.revenue} triệu VNĐ</strong><em>↑ {topSpecialty.trend}% so với tháng trước</em></div></div>
          <div className="specialty-donut-wrap">
            <div className="specialty-donut">
              <svg viewBox="0 0 42 42" role="img" aria-label="Tỷ lệ doanh thu theo chuyên khoa">
                <circle className="specialty-donut-base" cx="21" cy="21" fill="none" r="15.9155" strokeWidth="5" />
                {specialtiesWithShare.map((item, index) => {
                  return <circle className={`specialty-donut-segment ${activeIndex === null || activeIndex === index ? 'is-active' : 'is-muted'}`} cx="21" cy="21" fill="none" key={item.label} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} r="15.9155" stroke={item.color} strokeDasharray={`${item.percentage} ${100 - item.percentage}`} strokeDashoffset={-item.offset} strokeWidth={activeIndex === index ? '6.2' : '5'} />
                })}
              </svg>
              <div><b>{total.toLocaleString('vi-VN')}</b><small>triệu VNĐ</small></div>
            </div>
            <small>Tỷ lệ đóng góp</small>
          </div>
          <div className="specialty-legend">
            {specialties.map((item, index) => {
              const percentage = Math.round((item.revenue / total) * 100)
              return <button className={activeIndex === null || activeIndex === index ? 'is-active' : 'is-muted'} key={item.label} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} type="button"><i style={{ background: item.color }} /><span><b>{item.label}</b><small>{item.revenue} triệu · {percentage}%</small></span><em className={item.trend < 0 ? 'is-down' : ''}>{item.trend < 0 ? '↓' : '↑'} {Math.abs(item.trend)}%</em></button>
            })}
          </div>
        </aside>
      </div>}
    </Card>
  )
}
