import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { Badge, Button, Card, PageHeader, TopBar, AppShell } from '../../components/ui.jsx'
import { clinics } from '../../data/mock.js'

function toLocalISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getMonthGrid(anchorDate) {
  const year = anchorDate.getFullYear()
  const month = anchorDate.getMonth()
  const first = new Date(year, month, 1)
  const firstDay = first.getDay() // 0 = Sun

  // 42 cells: 6 tuần x 7 ngày
  const start = new Date(year, month, 1 - firstDay)
  return Array.from({ length: 42 }).map((_, idx) => {
    const d = new Date(start)
    d.setDate(start.getDate() + idx)
    return d
  })
}

function formatDateVN(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
}

function defaultAppointments() {
  // Demo: lấy từ dữ liệu PatientDashboard (đổi sang ISO để render lịch)
  return [
    {
      id: 'demo-1',
      date: '2026-05-22',
      time: '09:00',
      clinicId: 'C-01',
      clinicName: 'Phòng khám Đa khoa Tâm An',
      doctorName: 'BS. Nguyễn Văn Minh',
      type: 'Khám trực tiếp',
    },
    {
      id: 'demo-2',
      date: '2026-05-23',
      time: '14:00',
      clinicId: 'C-02',
      clinicName: 'Phòng khám Tim mạch An Bình',
      doctorName: 'BS. Trần Thị Hoa',
      type: 'Tư vấn trực tuyến',
    },
    {
      id: 'demo-3',
      date: '2026-05-18',
      time: '08:30',
      clinicId: 'C-03',
      clinicName: 'MedCare Family Clinic',
      doctorName: 'BS. Lê Hoàng Anh',
      type: 'Khám bệnh',
    },
  ]
}

function initialAppointments() {
  const defaults = defaultAppointments()
  try {
    const raw = window.localStorage.getItem('patientAppointments')
    if (!raw) return defaults
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.length) return defaults
    const map = new Map(defaults.map((item) => [item.id, item]))
    for (const item of parsed) map.set(item.id, item)
    return Array.from(map.values()).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  } catch {
    return defaults
  }
}

export function PatientAppointments() {
  const [anchor, setAnchor] = useState(() => new Date())
  const [activeDate, setActiveDate] = useState(() => toLocalISODate(new Date()))
  const [appointments] = useState(() => initialAppointments())
  const navigate = useNavigate()

  const todayISO = toLocalISODate(new Date())
  const isPastDate = activeDate < todayISO

  const monthGrid = useMemo(() => getMonthGrid(anchor), [anchor])
  const activeAppointments = useMemo(() => appointments.filter((a) => a.date === activeDate), [appointments, activeDate])

  const activeDayAppointmentsCount = useMemo(() => {
    const map = new Map()
    for (const a of appointments) {
      map.set(a.date, (map.get(a.date) || 0) + 1)
    }
    return map
  }, [appointments])

  const handlePrevMonth = () => setAnchor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const handleNextMonth = () => setAnchor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Lịch khám"
          subtitle="Xem lịch hẹn theo ngày và chọn ngày để xem chi tiết cuộc hẹn."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 font-black">
                <CalendarDays size={18} className="text-violet-600" />
                <span>
                  {anchor.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="px-3" onClick={() => { setAnchor(() => new Date()); setActiveDate(() => toLocalISODate(new Date())) }}>
                  Hôm nay
                </Button>
                <Button variant="ghost" onClick={handlePrevMonth} className="p-2"> <ArrowLeft size={16} /> </Button>
                <Button variant="ghost" onClick={handleNextMonth} className="p-2"> <ArrowRight size={16} /> </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-xs font-black text-slate-500 uppercase mb-3">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthGrid.map((d) => {
                const iso = toLocalISODate(d)
                const inMonth = d.getMonth() === anchor.getMonth()
                const isActive = iso === activeDate
                const count = activeDayAppointmentsCount.get(iso) || 0

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setActiveDate(iso)}
                    className={[
                      'relative rounded-xl border px-2 py-2 text-left transition',
                      isActive ? 'bg-violet-600 border-violet-600 text-white' : (inMonth ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-slate-50 border-slate-100'),
                    ].join(' ')}
                    aria-label={`Chọn ngày ${iso}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={['text-sm font-black', isActive ? 'text-white' : (inMonth ? 'text-slate-900' : 'text-slate-300')].join(' ')}>
                        {d.getDate()}
                      </span>
                      {count > 0 && (
                        <Badge tone="blue">{count}</Badge>
                      )}
                    </div>
                    {count > 0 && (
                      <div className="mt-2 flex items-center gap-1 flex-wrap h-1.5">
                        {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                           <span key={i} className={`block h-1.5 w-1.5 rounded-full ${isActive ? 'bg-violet-200' : 'bg-violet-500'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-xs font-black uppercase text-slate-500">Ngày</div>
                <div className="text-lg font-black">{formatDateVN(activeDate)}</div>
              </div>
            </div>

            {activeAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 px-4 text-center mt-2">
                <CalendarDays size={42} className="text-slate-300 mb-3" />
                <div className="text-slate-500 font-semibold mb-1">Trống lịch</div>
                <p className="text-sm text-slate-400 mb-5">Bạn chưa có lịch hẹn nào trong ngày này.</p>
                {!isPastDate && (
                  <Button onClick={() => navigate('/patient/booking')} className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-none shadow-none">Đặt lịch ngay</Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {activeAppointments.map((a) => (
                  <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black">{a.type}</div>
                        <div className="mt-1 text-sm text-slate-600">
                          <Clock size={14} className="inline-block mr-2 text-slate-400" /> {a.time}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          <span className="font-semibold">{a.doctorName}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          <MapPin size={14} className="inline-block mr-2 text-slate-400" /> {a.clinicName || clinics.find((c) => c.id === a.clinicId)?.name}
                        </div>
                      </div>
                      <Badge tone="green">Đã đặt</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
