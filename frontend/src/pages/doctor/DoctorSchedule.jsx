import { useEffect, useMemo, useState } from 'react'
import { AppShell, Badge, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { doctorSchedule } from '../../data/mock.js'

const visibleHours = Array.from({ length: 16 }, (_, index) => index + 7)
const hours = visibleHours.map((hour) => `${String(hour).padStart(2, '0')}:00`)
const firstHour = visibleHours[0]
const rowHeight = 78
const headerHeight = 104
const hourColumnWidth = 132
const dayColumnWidth = 214
const dayLabels = ['CN', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7']

function statusTone(status) {
  return status === 'Dự kiến' ? 'yellow' : 'green'
}

export function DoctorSchedule() {
  const [view, setView] = useState('chart')
  const [now, setNow] = useState(() => new Date())
  const currentHour = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  const currentDecimalHour = now.getHours() + now.getMinutes() / 60
  const nowTop = headerHeight + (currentDecimalHour - firstHour) * rowHeight
  const showNowLine = currentDecimalHour >= firstHour && currentDecimalHour <= visibleHours.at(-1)
  const weekDays = useMemo(() => getCurrentWeekDays(now), [now])
  const scheduleForWeek = useMemo(() => doctorSchedule.map((item, index) => ({
    ...item,
    day: weekDays[index].day,
    date: weekDays[index].date,
    dayIndex: index,
  })), [weekDays])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const columns = [
    { key: 'day', label: 'NGÀY', render: (row) => <div><b>{row.day}</b><p className="text-sm text-slate-500">{row.date}</p></div> },
    { key: 'shift', label: 'CA TRỰC' },
    { key: 'time', label: 'THỜI GIAN' },
    { key: 'room', label: 'PHÒNG / KÊNH' },
    { key: 'type', label: 'HÌNH THỨC' },
    { key: 'patients', label: 'DỰ KIẾN', render: (row) => `${row.patients} bệnh nhân` },
    { key: 'status', label: 'TRẠNG THÁI', render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
  ]

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Lịch khám của tôi"
          subtitle="Theo dõi lịch trực cá nhân theo tuần, phòng khám và kênh tư vấn."
          action={
            <div className="segmented">
              <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>Timeline</button>
              <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Bảng</button>
            </div>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          <Card><p className="text-sm text-slate-500">Tổng ca trực tuần này</p><strong className="mt-2 block text-3xl font-black">7</strong></Card>
          <Card><p className="text-sm text-slate-500">Bệnh nhân dự kiến</p><strong className="mt-2 block text-3xl font-black">57</strong></Card>
          <Card><p className="text-sm text-slate-500">Tư vấn online</p><strong className="mt-2 block text-3xl font-black">19</strong></Card>
        </div>

        {view === 'chart' ? (
          <Card className="mt-7">
            <h2 className="section-title">Timeline lịch trực tuần</h2>
            <div className="doctor-timeline-wrap">
              <div className="doctor-timeline">
                <div className="timeline-head timeline-zone"><span>GMT+07</span><strong>{currentHour}</strong></div>
                {scheduleForWeek.map((item, index) => (
                  <div key={`${item.day}-${item.date}`} className={`timeline-head ${weekDays[index].isToday ? 'active' : ''}`}>
                    <span>{item.day}</span>
                    <strong>{weekDays[index].dayNumber}</strong>
                  </div>
                ))}

                <div className="timeline-body">
                  {hours.map((hour) => (
                    <div className="timeline-row" key={hour}>
                    <div className="timeline-hour">{hour}</div>
                    {scheduleForWeek.map((item) => <div key={`${item.day}-${hour}`} className="timeline-slot" />)}
                    </div>
                  ))}

                  {scheduleForWeek.map((item) => (
                  <div
                    key={`${item.day}-${item.time}`}
                    className="timeline-event-layer"
                    style={{
                      left: `${hourColumnWidth + item.dayIndex * dayColumnWidth}px`,
                      top: `${headerHeight + (item.startHour - firstHour) * rowHeight}px`,
                      width: `${dayColumnWidth}px`,
                      height: `${Math.max(item.endHour - item.startHour, 1) * rowHeight}px`,
                    }}
                  >
                    <div className="timeline-event-card">
                      <b>{item.type}</b>
                      <span>{item.time}</span>
                      <small>{item.room} · {item.patients} ca</small>
                    </div>
                  </div>
                  ))}
                  {showNowLine && <div className="timeline-now-line" style={{ top: `${nowTop}px` }}><span>{currentHour}</span></div>}
                </div>
              </div>
            </div>
          </Card>
        ) : (
        <div className="mt-7">
            <DataTable columns={columns} rows={scheduleForWeek} footer={false} />
          </div>
        )}
      </div>
    </AppShell>
  )
}

function getCurrentWeekDays(date) {
  const start = new Date(date)
  const day = start.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start)
    current.setDate(start.getDate() + index)
    return {
      day: dayLabels[current.getDay()],
      date: current.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      dayNumber: current.toLocaleDateString('vi-VN', { day: '2-digit' }),
      isToday: current.toDateString() === date.toDateString(),
    }
  })
}
