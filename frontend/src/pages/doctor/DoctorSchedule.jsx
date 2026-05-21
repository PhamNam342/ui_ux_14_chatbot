import { useMemo, useState } from 'react'
import { AppShell, Badge, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { doctorSchedule } from '../../data/mock.js'

const hours = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`)

function statusTone(status) {
  return status === 'Dự kiến' ? 'yellow' : 'green'
}

export function DoctorSchedule() {
  const [view, setView] = useState('chart')
  const timelineDays = useMemo(() => doctorSchedule.map((item, index) => ({ ...item, column: index + 2 })), [])
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
                <div className="timeline-head timeline-zone">GMT+07</div>
                {timelineDays.map((item, index) => (
                  <div key={item.day} className={`timeline-head ${index === 2 ? 'active' : ''}`}>
                    <span>{item.day}</span>
                    <strong>{item.date.split('/')[0]}</strong>
                  </div>
                ))}

                {hours.map((hour) => (
                  <div className="timeline-row" key={hour}>
                    <div className="timeline-hour">{hour}</div>
                    {timelineDays.map((item) => <div key={`${item.day}-${hour}`} className="timeline-slot" />)}
                  </div>
                ))}

                {timelineDays.map((item) => (
                  <div
                    key={`${item.day}-${item.time}`}
                    className="timeline-event-layer"
                    style={{
                      gridColumn: item.column,
                      gridRow: `${item.startHour + 2} / span ${Math.max(item.endHour - item.startHour, 1)}`,
                    }}
                  >
                    <div className="timeline-event-card">
                      <b>{item.type}</b>
                      <span>{item.time}</span>
                      <small>{item.room} · {item.patients} ca</small>
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
