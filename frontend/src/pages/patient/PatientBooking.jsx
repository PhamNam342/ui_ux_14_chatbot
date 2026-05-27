import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, MapPin, Search, Star } from 'lucide-react'
import { Badge, Button, Card, PageHeader, TopBar, AppShell } from '../../components/ui.jsx'
import { clinics, doctorAvailability } from '../../data/mock.js'

function toLocalISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function dateCategory(selectedISO) {
  const todayISO = toLocalISODate(new Date())
  const tomorrowISO = toLocalISODate(addDays(new Date(), 1))
  if (selectedISO === todayISO) return 'Hôm nay'
  if (selectedISO === tomorrowISO) return 'Ngày mai'
  return 'Thứ 6'
}

function clinicShortName(name) {
  // Rút gọn để pin trên bản đồ không bị tràn
  const cleaned = name.replace(/^Phòng khám\s+/i, '').trim()
  if (cleaned.length <= 18) return cleaned
  return `${cleaned.slice(0, 15)}...`
}

export function PatientBooking() {
  const [clinicId, setClinicId] = useState(null)
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('Tất cả chuyên khoa')
  const [selectedDate, setSelectedDate] = useState(toLocalISODate(new Date()))
  const [previewDoctor, setPreviewDoctor] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [confirmed, setConfirmed] = useState('')
  const [toast, setToast] = useState('')
  const [previewClinic, setPreviewClinic] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')

  const userCoords = { x: 10, y: 62 } // vị trí user marker trên khung map
  const selectedDateCategory = dateCategory(selectedDate)
  const selectedClinic = clinics.find((clinic) => clinic.id === clinicId)

  useEffect(() => {
    // Khi đổi phòng khám, reset thao tác chọn bác sĩ/ca để tránh lệch dữ liệu
    setPreviewDoctor(null)
    setSelectedDoctor(null)
    setSelectedSlot('')
  }, [clinicId])

  const clinicDoctors = useMemo(
    () => {
      if (!clinicId) return []
      const byDate = doctorAvailability.filter(
        (item) => item.clinicId === clinicId && item.day === selectedDateCategory,
      )
      // Fallback để UI không bị trống khi mock dữ liệu không có đúng label theo ngày
      return byDate.length ? byDate : doctorAvailability.filter((item) => item.clinicId === clinicId)
    },
    [clinicId, selectedDateCategory],
  )

  const filteredDoctors = clinicDoctors.filter((item) => {
    const normalized = query.trim().toLowerCase()
    const matchesQuery = !normalized || item.doctor.toLowerCase().includes(normalized)
    const matchesSpec = specialty === 'Tất cả chuyên khoa' || item.spec === specialty
    return matchesQuery && matchesSpec
  })

  const specialties = ['Tất cả chuyên khoa', ...new Set(doctorAvailability.map((item) => item.spec))]

  function confirmBooking() {
    if (!selectedDoctor || !selectedSlot || !clinicId) return

    const clinic = clinics.find((c) => c.id === clinicId)
    const newAppointment = {
      id: `appt-${Date.now()}`,
      date: selectedDate,
      time: selectedSlot,
      clinicId,
      clinicName: clinic?.name,
      doctorName: selectedDoctor.doctor,
      spec: selectedDoctor.spec,
      type: selectedDoctor.spec === 'Tim mạch' ? 'Khám bệnh' : 'Khám trực tiếp',
    }

    setConfirmed(`Đã xác nhận lịch với ${selectedDoctor.doctor} lúc ${selectedSlot}.`)
    setToast('Đặt lịch thành công')
    window.setTimeout(() => setToast(''), 2200)

    try {
      const raw = window.localStorage.getItem('patientAppointments')
      const existing = raw ? JSON.parse(raw) : []
      const merged = Array.isArray(existing) ? [...existing, newAppointment] : [newAppointment]
      window.localStorage.setItem('patientAppointments', JSON.stringify(merged))
    } catch {
      // ignore (demo UI)
    }

    setSelectedDoctor(null)
    setSelectedSlot('')
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Đặt lịch khám" subtitle="Chọn bệnh viện trước, sau đó lọc bác sĩ và đặt khung giờ phù hợp." />
        <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
          <Card>
            <h2 className="section-title mb-4 flex items-center gap-2">
              <MapPin size={18} /> Bản đồ phòng khám
            </h2>
            <div className="booking-map">
              <iframe
                title="Bản đồ phòng khám"
                src="https://www.openstreetmap.org/export/embed.html?bbox=106.680%2C10.765%2C106.705%2C10.79&layer=mapnik"
                className="booking-iframe"
                loading="lazy"
              />
              <div className="map-marker map-marker-user" style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}>
                <span className="map-marker-dot" />
                <span className="map-marker-label">Vị trí của bạn</span>
              </div>

              {selectedClinic && (
                <div
                  key={selectedClinic.id}
                  title={selectedClinic.name}
                  className="map-marker map-marker-clinic"
                  style={{ left: `${selectedClinic.coords.x}%`, top: `${selectedClinic.coords.y}%` }}
                >
                  <span className="map-marker-dot" />
                  <span className="map-marker-label">{clinicShortName(selectedClinic.name)}</span>
                </div>
              )}
            </div>
          </Card>
          <Card>
            <h2 className="section-title">Danh sách bệnh viện</h2>
            <div className="mt-5 space-y-4">
              {clinics.map((clinic) => (
                <button key={clinic.id} className={`clinic-card ${clinicId === clinic.id ? 'active' : ''}`} onClick={() => setClinicId(clinic.id)}>
                  <div><b>{clinic.name}</b><p>{clinic.address}</p></div>
                  <div className="flex flex-col items-end text-right">
                    <strong className="flex items-center gap-1">{clinic.rating}<Star size={14} className="fill-amber-400 text-amber-400" /></strong>
                    <small className="mt-1">{clinic.distance}</small>
                    <div className="mt-2 px-2 py-1 bg-teal-50 text-teal-600 rounded text-[11px] font-bold whitespace-nowrap hover:bg-teal-100 transition" onClick={(e) => { e.stopPropagation(); setPreviewClinic(clinic) }}>Chi tiết</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-7">
          <div className="grid gap-4 md:grid-cols-[1.1fr_260px]">
            <label className="search">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Lọc bác sĩ theo tên..." />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <select className="input" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
                {specialties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <label className="input input-date">
                <CalendarDays size={16} className="text-slate-400" />
                <input
                  type="date"
                  className="date-control"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 patient-schedule-board">
            <div className="schedule-board-head">
              <span>Bác sĩ</span>
              {['08:00', '09:00', '10:30', '13:30', '15:00', '16:30', '18:00'].map((slot) => <span key={slot}>{slot}</span>)}
            </div>
            {filteredDoctors.map((item) => (
              <div className="schedule-board-row" key={item.id}>
                <button className="schedule-doctor-label" onClick={() => setPreviewDoctor(item)}>
                  <b>{item.doctor}</b>
                  <small>{item.spec}</small>
                </button>
                {['08:00', '09:00', '10:30', '13:30', '15:00', '16:30', '18:00'].map((slot) => (
                  <span key={slot} className={item.slots.includes(slot) ? 'slot-open' : 'slot-empty'} />
                ))}
              </div>
            ))}
          </div>
          {!clinicId && (
            <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800">
              Hãy chọn một phòng khám ở danh sách bên phải để hiển thị marker và lịch bác sĩ tương ứng.
            </div>
          )}
        </Card>

        <Card className="mt-7">
          <h2 className="section-title">Danh sách bác sĩ & lịch theo ngày</h2>
          <div className="mt-5 space-y-4">
            {filteredDoctors.map((item) => (
              <div className="doctor-list-card" key={item.id}>
                <div>
                  <b>{item.doctor}</b>
                  <p>
                    {item.spec} · {item.day} · Ca gần nhất {item.slot}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Lọc theo ngày bạn chọn: <b>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString('vi-VN')}</b>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="green">Rảnh</Badge>
                  <button className="mini-btn" onClick={() => setPreviewDoctor(item)}>Chi tiết</button>
                  <Button className="btn-compact" onClick={() => setSelectedDoctor(item)}>Chọn bác sĩ</Button>
                </div>
              </div>
            ))}
          </div>
          {filteredDoctors.length === 0 && (
            <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
              Không có bác sĩ phù hợp cho bộ lọc hiện tại. Hãy đổi ngày hoặc chuyên khoa để xem thêm lịch rảnh.
            </div>
          )}
          {confirmed && <div className="mt-5 rounded-lg bg-teal-50 px-4 py-3 text-sm font-bold text-teal-700">{confirmed}</div>}
        </Card>
      </div>

      {previewDoctor && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">{previewDoctor.doctor}</h2>
            <p className="mt-2 text-slate-500">{previewDoctor.spec} · {previewDoctor.exp} kinh nghiệm</p>
            <div className="mt-5 flex items-center gap-2 text-amber-500"><Star size={16} fill="currentColor" /> <b>{previewDoctor.rating}</b> <span className="text-slate-500">điểm đánh giá</span></div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{previewDoctor.about}</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setPreviewDoctor(null)}>Đóng</Button>
              <Button onClick={() => { setSelectedDoctor(previewDoctor); setPreviewDoctor(null) }}>Chọn bác sĩ</Button>
            </div>
          </Card>
        </div>
      )}

      {selectedDoctor && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Chọn ca rảnh</h2>
            <p className="mt-2 text-slate-500">
              {selectedDoctor.doctor} · {selectedDoctor.spec}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Ngày: <b>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString('vi-VN')}</b>
              {' '}· Phòng khám: <b>{clinics.find((c) => c.id === clinicId)?.name}</b>
            </p>
            <div className="doctor-slot-grid mt-6">
              {selectedDoctor.slots.map((slot) => (
                <button key={slot} className={selectedSlot === slot ? 'active-slot' : ''} onClick={() => setSelectedSlot(slot)}>
                  {slot}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedDoctor(null)}>Huỷ</Button>
              <Button onClick={confirmBooking}>Xác nhận lịch hẹn</Button>
            </div>
          </Card>
        </div>
      )}
      {previewClinic && (
        <div className="modal-backdrop">
          <Card className="modal max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black">{previewClinic.name}</h2>
            <p className="mt-2 text-slate-500"><MapPin size={16} className="inline mr-1" />{previewClinic.address}</p>
            <div className="mt-3 flex items-center gap-2 text-amber-500">
              <Star size={18} fill="currentColor" /> <b>{previewClinic.rating}</b>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">Chuyên khoa nổi bật</h3>
              <div className="flex flex-wrap gap-2">
                <Badge tone="blue">Tim mạch</Badge>
                <Badge tone="blue">Hô hấp</Badge>
                <Badge tone="blue">Nội tổng quát</Badge>
                <Badge tone="blue">Nhi khoa</Badge>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-3">Đánh giá từ bệnh nhân</h3>
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1 text-amber-500 mb-1"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                  <p className="text-sm text-slate-600">"Bác sĩ tư vấn rất nhiệt tình, cơ sở vật chất sạch sẽ." - Nguyễn Văn A</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1 text-amber-500 mb-1"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                  <p className="text-sm text-slate-600">"Khám nhanh, thủ tục đơn giản nhưng đôi khi chờ hơi lâu." - Lê Thị B</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-2 text-sm text-slate-700">Viết đánh giá của bạn</h3>
              <textarea 
                className="input w-full min-h-[80px]" 
                placeholder="Chia sẻ trải nghiệm khám bệnh..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <Button className="btn-compact bg-teal-600 hover:bg-teal-700" onClick={() => {
                  if(!feedbackText.trim()) return
                  setToast('Đã gửi đánh giá thành công')
                  window.setTimeout(() => setToast(''), 2200)
                  setFeedbackText('')
                  setPreviewClinic(null)
                }}>Gửi đánh giá</Button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <Button variant="danger" onClick={() => { setPreviewClinic(null); setFeedbackText('') }}>Đóng</Button>
            </div>
          </Card>
        </div>
      )}

      {toast && <div className="toast"><span>✓</span> {toast}</div>}
    </AppShell>
  )
}
