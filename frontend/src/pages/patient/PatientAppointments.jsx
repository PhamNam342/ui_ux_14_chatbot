import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { AppShell, Badge, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { clinics } from '../../data/mock.js'

function toLocalISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMonthGrid(anchorDate) {
  const year = anchorDate.getFullYear()
  const month = anchorDate.getMonth()
  const first = new Date(year, month, 1)
  const mondayOffset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - mondayOffset)
  const last = new Date(year, month + 1, 0)
  const total = Math.ceil((mondayOffset + last.getDate()) / 7) * 7
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function getWeekGrid(anchorDate) {
  const mondayOffset = (anchorDate.getDay() + 6) % 7
  const start = new Date(anchorDate)
  start.setDate(anchorDate.getDate() - mondayOffset)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function shiftFor(time) {
  const hour = Number(time?.split(':')[0] || 0)
  if (hour < 13) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

function defaultAppointments() {
  return [
    { id: 'demo-1', date: '2026-05-22', time: '09:00', clinicId: 'C-01', clinicName: 'Phòng khám Đa khoa Tâm An', doctorName: 'BS. Nguyễn Văn Minh', type: 'Khám trực tiếp' },
    { id: 'demo-2', date: '2026-05-23', time: '14:00', clinicId: 'C-02', clinicName: 'Phòng khám Tim mạch An Bình', doctorName: 'BS. Trần Thị Hoa', type: 'Tư vấn trực tuyến' },
    { id: 'demo-3', date: '2026-05-18', time: '18:30', clinicId: 'C-03', clinicName: 'MedCare Family Clinic', doctorName: 'BS. Lê Hoàng Anh', type: 'Khám bệnh' },
    { id: 'demo-4', date: '2026-05-07', time: '08:00', clinicId: 'C-01', clinicName: 'Phòng khám Đa khoa Tâm An', doctorName: 'BS. Nguyễn Văn Minh', type: 'Khám trực tiếp' },
    { id: 'demo-5', date: '2026-05-07', time: '14:00', clinicId: 'C-02', clinicName: 'Phòng khám Tim mạch An Bình', doctorName: 'BS. Trần Thị Hoa', type: 'Khám trực tiếp' },
    { id: 'demo-6', date: '2026-05-14', time: '09:30', clinicId: 'C-01', clinicName: 'Phòng khám Đa khoa Tâm An', doctorName: 'BS. Vũ Thanh Lam', type: 'Khám trực tiếp' },
    { id: 'demo-7', date: '2026-05-14', time: '18:00', clinicId: 'C-02', clinicName: 'Phòng khám Tim mạch An Bình', doctorName: 'BS. Lê Quốc Bảo', type: 'Tư vấn trực tuyến' },
  ]
}

function initialAppointments() {
  const defaults = defaultAppointments()
  try {
    const parsed = JSON.parse(window.localStorage.getItem('patientAppointments') || '[]')
    if (!Array.isArray(parsed)) return defaults
    const appointments = new Map(defaults.map((item) => [item.id, item]))
    parsed.forEach((item) => appointments.set(item.id, item))
    return Array.from(appointments.values())
  } catch {
    return defaults
  }
}

export function PatientAppointments() {
  const [anchor, setAnchor] = useState(() => new Date(2026, 4, 1))
  const [activeDate, setActiveDate] = useState('2026-05-22')
  const [viewMode, setViewMode] = useState('month')
  const [appointments] = useState(() => initialAppointments())
  const calendarDates = useMemo(() => viewMode === 'month' ? getMonthGrid(anchor) : getWeekGrid(new Date(`${activeDate}T00:00:00`)), [anchor, activeDate, viewMode])
  const groupedAppointments = useMemo(() => {
    const grouped = new Map()
    appointments.forEach((appointment) => {
      const dayAppointments = grouped.get(appointment.date) || []
      grouped.set(appointment.date, [...dayAppointments, appointment])
    })
    return grouped
  }, [appointments])
  const activeAppointments = groupedAppointments.get(activeDate) || []
  const todayISO = toLocalISODate(new Date())
  const moveCalendar = (amount) => {
    if (viewMode === 'month') {
      setAnchor((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1))
      return
    }
    const next = new Date(`${activeDate}T00:00:00`)
    next.setDate(next.getDate() + (amount * 7))
    setActiveDate(toLocalISODate(next))
    setAnchor(new Date(next.getFullYear(), next.getMonth(), 1))
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Lịch khám" subtitle="Theo dõi lịch hẹn theo tháng và chọn ngày để xem thông tin chi tiết." />
        <div className="patient-calendar-layout">
          <Card className="patient-month-calendar p-0">
            <div className="patient-calendar-toolbar">
              <button onClick={() => moveCalendar(-1)}><ArrowLeft size={20} /></button>
              <h2>{viewMode === 'month' ? `Tháng ${anchor.getMonth() + 1}, ${anchor.getFullYear()}` : `Tuần ${calendarDates[0].toLocaleDateString('vi-VN')} - ${calendarDates[6].toLocaleDateString('vi-VN')}`}</h2>
              <button onClick={() => moveCalendar(1)}><ArrowRight size={20} /></button>
              <div className="patient-calendar-toggle">
                <button className={viewMode === 'week' ? 'active' : ''} onClick={() => setViewMode('week')}>Tuần</button>
                <button className={viewMode === 'month' ? 'active' : ''} onClick={() => setViewMode('month')}>Tháng</button>
              </div>
            </div>
            <div className="patient-calendar-weekdays">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => <b key={day}>{day}</b>)}
            </div>
            <div className="patient-calendar-grid">
              {calendarDates.map((date) => {
                const iso = toLocalISODate(date)
                const dayAppointments = groupedAppointments.get(iso) || []
                const inMonth = viewMode === 'week' || date.getMonth() === anchor.getMonth()
                const active = iso === activeDate
                const today = iso === todayISO
                return (
                  <button key={iso} className={`patient-calendar-day ${!inMonth ? 'muted' : ''} ${active ? 'active' : ''}`} onClick={() => setActiveDate(iso)}>
                    <span className={today ? 'today' : ''}>{date.getDate()}</span>
                    {dayAppointments.length > 0 && (
                      <div className="patient-calendar-dots">
                        {[...new Set(dayAppointments.map((item) => shiftFor(item.time)))].map((shift) => <i key={shift} className={shift} />)}
                      </div>
                    )}
                    {dayAppointments.length > 1 && <small>{dayAppointments.length}</small>}
                  </button>
                )
              })}
            </div>
            <div className="patient-calendar-legend">
              <span><i className="morning" /> Ca Sáng · 08:00 - 12:00</span>
              <span><i className="afternoon" /> Ca Chiều · 13:00 - 17:00</span>
              <span><i className="evening" /> Ca Tối · 18:00 - 06:00</span>
            </div>
          </Card>

          <Card className="patient-calendar-detail">
            <div className="flex items-center gap-3"><CalendarDays size={18} /><h2 className="section-title">Lịch hẹn khám</h2></div>
            <p className="mt-2 text-sm text-slate-500">{new Date(`${activeDate}T00:00:00`).toLocaleDateString('vi-VN')}</p>
            {activeAppointments.length ? (
              <div className="mt-5 grid gap-3">
                {activeAppointments.map((appointment) => (
                  <div key={appointment.id} className="patient-calendar-appointment">
                    <div><b>{appointment.type}</b><Badge tone="green">Đã đặt</Badge></div>
                    <p><Clock size={14} /> {appointment.time} · {appointment.doctorName}</p>
                    <p><MapPin size={14} /> {appointment.clinicName || clinics.find((clinic) => clinic.id === appointment.clinicId)?.name}</p>
                  </div>
                ))}
              </div>
            ) : <p className="mt-4 text-sm text-slate-500">Bạn chưa có lịch hẹn trong ngày này.</p>}
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
