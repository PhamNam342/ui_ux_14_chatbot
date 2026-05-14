import { useState } from 'react'
import { AppShell, Badge, Button, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { doctorSchedule } from '../../data/mock.js'

const hours = Array.from({ length: 25 }, (_, index) => `${String(index).padStart(2, '0')}:00`)

function toMinutes(time) {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}

function eventStyle(time) {
  const [start, end] = time.split(' - ')
  const top = 64 + (toMinutes(start) / 60) * 54
  const height = Math.max(72, ((toMinutes(end) - toMinutes(start)) / 60) * 54)
  return { top: `${top}px`, minHeight: `${height}px` }
}

export function DoctorSchedule() {
  const [view, setView] = useState('chart')
  const columns = [
    { key: 'day', label: 'NGÀY', render: (row) => <div><b>{row.day}</b><p className="text-sm text-slate-500">{row.date}</p></div> },
    { key: 'shift', label: 'CA TRỰC' },
    { key: 'time', label: 'THỜI GIAN' },
    { key: 'room', label: 'PHÒNG / KÊNH' },
    { key: 'type', label: 'HÌNH THỨC' },
    { key: 'patients', label: 'DỰ KIẾN', render: (row) => `${row.patients} bệnh nhân` },
    { key: 'status', label: 'TRẠNG THÁI', render: (row) => <Badge tone={row.status === 'Huỷ' ? 'red' : row.status === 'Chờ' ? 'yellow' : 'blue'}>{row.status}</Badge> },
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
          <Card><p className="text-sm text-slate-500">Tổng ca trực tuần này</p><strong className="mt-2 block text-3xl font-black">5</strong></Card>
          <Card><p className="text-sm text-slate-500">Bệnh nhân dự kiến</p><strong className="mt-2 block text-3xl font-black">45</strong></Card>
          <Card><p className="text-sm text-slate-500">Tư vấn online</p><strong className="mt-2 block text-3xl font-black">14</strong></Card>
        </div>

        {view === 'chart' ? (
          <Card className="mt-7">
            <h2 className="section-title">Timeline lịch trực tuần</h2>
            <div className="week-timeline-wrap">
            <div className="week-timeline">
              <div className="timeline-hours">
                <span>GMT+07</span>
                {hours.map((hour) => <span key={hour}>{hour}</span>)}
              </div>
              {doctorSchedule.map((item, index) => (
                <div className="timeline-day" key={item.day}>
                  <div className={`timeline-date ${index === 2 ? 'active' : ''}`}><span>{item.day}</span><b>{item.date.split('/')[0]}</b></div>
                  <div className="timeline-column">
                    <div className={`timeline-event tone-${item.status === 'Huỷ' ? 'red' : item.status === 'Chờ' ? 'yellow' : 'blue'}`} style={eventStyle(item.time)}>
                      <b>{item.type}</b>
                      <span>{item.time}</span>
                      <small>{item.room} · {item.patients} ca</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </Card>
        ) : (
          <div className="mt-7">
            <DataTable columns={columns} rows={doctorSchedule} footer={false} />
          </div>
        )}
      </div>
    </AppShell>
  )
}
