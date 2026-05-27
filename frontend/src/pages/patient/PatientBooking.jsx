import { useMemo, useState } from 'react'
import { Search, Star } from 'lucide-react'
import { Badge, Button, Card, PageHeader, TopBar, AppShell } from '../../components/ui.jsx'
import { clinics, doctorAvailability } from '../../data/mock.js'

export function PatientBooking() {
  const [clinicId, setClinicId] = useState(clinics[0].id)
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('Tất cả chuyên khoa')
  const [previewDoctor, setPreviewDoctor] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [confirmed, setConfirmed] = useState('')

  const clinicDoctors = useMemo(
    () => doctorAvailability.filter((item) => item.clinicId === clinicId),
    [clinicId],
  )

  const filteredDoctors = clinicDoctors.filter((item) => {
    const normalized = query.trim().toLowerCase()
    const matchesQuery = !normalized || item.doctor.toLowerCase().includes(normalized)
    const matchesSpec = specialty === 'Tất cả chuyên khoa' || item.spec === specialty
    return matchesQuery && matchesSpec
  })

  const specialties = ['Tất cả chuyên khoa', ...new Set(clinicDoctors.map((item) => item.spec))]

  function confirmBooking() {
    if (!selectedDoctor || !selectedSlot) return
    setConfirmed(`Đã xác nhận lịch với ${selectedDoctor.doctor} lúc ${selectedSlot}.`)
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
            <div className="booking-map">
              <div className="map-you">Vị trí của bạn</div>
              {clinics.map((clinic) => (
                <button
                  key={clinic.id}
                  className={`map-pin ${clinic.id === clinicId ? 'active' : ''}`}
                  style={{ left: `${clinic.coords.x}%`, top: `${clinic.coords.y}%` }}
                  onClick={() => setClinicId(clinic.id)}
                >
                  {clinic.name}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="section-title">Danh sách bệnh viện</h2>
            <div className="mt-5 space-y-4">
              {clinics.map((clinic) => (
                <button key={clinic.id} className={`clinic-card ${clinicId === clinic.id ? 'active' : ''}`} onClick={() => setClinicId(clinic.id)}>
                  <div><b>{clinic.name}</b><p>{clinic.address}</p></div>
                  <div className="text-right"><strong>{clinic.rating}★</strong><small>{clinic.distance}</small></div>
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
            <select className="input" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
              {specialties.map((item) => <option key={item}>{item}</option>)}
            </select>
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
        </Card>

        <Card className="mt-7">
          <h2 className="section-title">Danh sách bác sĩ</h2>
          <div className="mt-5 space-y-4">
            {filteredDoctors.map((item) => (
              <div className="doctor-list-card" key={item.id}>
                <div>
                  <b>{item.doctor}</b>
                  <p>{item.spec} · {item.day} · Ca gần nhất {item.slot}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="green">Rảnh</Badge>
                  <button className="mini-btn" onClick={() => setPreviewDoctor(item)}>Chi tiết</button>
                  <Button onClick={() => setSelectedDoctor(item)}>Chọn bác sĩ</Button>
                </div>
              </div>
            ))}
          </div>
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
            <p className="mt-2 text-slate-500">{selectedDoctor.doctor} · {selectedDoctor.spec}</p>
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
    </AppShell>
  )
}
