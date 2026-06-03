import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Globe2,
  Phone,
  MapPin,
  Navigation,
  Star,
  Stethoscope,
  UserRound,
  Wallet,
} from 'lucide-react'
import { Button, Card, PageHeader, TopBar, AppShell } from '../../components/ui.jsx'
import { clinics, doctorAvailability } from '../../data/mock.js'

function toLocalISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDate(dateISO) {
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString('vi-VN')
}

function doctorPrice(doctor) {
  return doctor?.spec === 'Tim mạch' ? 450000 : 320000
}

const slotGroups = [
  { label: 'Ca sáng', slots: ['08:00', '08:30', '09:00', '09:30', '10:30'] },
  { label: 'Ca chiều', slots: ['13:30', '14:00', '15:00', '15:30', '16:30'] },
  { label: 'Ca tối', slots: ['18:00', '19:00'] },
]

const bookingSteps = [
  'Bệnh viện',
  'Chuyên khoa',
  'Bác sĩ',
  'Lịch khám',
  'Xác nhận',
]

const facilityReviews = [
  { name: 'Nguyễn Minh Anh', date: '28/05/2026', rating: 5, text: 'Không gian sạch sẽ, bác sĩ tư vấn kỹ và quy trình đặt lịch nhanh.' },
  { name: 'Trần Hoàng', date: '23/05/2026', rating: 4, text: 'Nhân viên hỗ trợ nhiệt tình, thời gian chờ ngắn hơn dự kiến.' },
  { name: 'Lê Thu Hà', date: '18/05/2026', rating: 5, text: 'Cơ sở hiện đại, điều dưỡng hướng dẫn rõ ràng và chu đáo.' },
  { name: 'Phạm Minh Đức', date: '09/05/2026', rating: 4, text: 'Đặt lịch thuận tiện, bác sĩ giải thích dễ hiểu cho người lớn tuổi.' },
]

export function PatientBooking() {
  const navigate = useNavigate()
  const step2Ref = useRef(null)
  const step3Ref = useRef(null)
  const step4Ref = useRef(null)
  const step5Ref = useRef(null)
  const slotsRef = useRef(null)
  const summaryRef = useRef(null)
  const [clinicId, setClinicId] = useState(null)
  const [specialty, setSpecialty] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [confirmationDetails, setConfirmationDetails] = useState(null)
  const [confirmed, setConfirmed] = useState('')
  const [toast, setToast] = useState('')
  const [previewClinic, setPreviewClinic] = useState(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [reviewSort, setReviewSort] = useState('Mới nhất')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [activeHighlight, setActiveHighlight] = useState('')

  const selectedClinic = clinics.find((clinic) => clinic.id === clinicId)
  const clinicDoctors = useMemo(
    () => doctorAvailability.filter((doctor) => doctor.clinicId === clinicId),
    [clinicId],
  )
  const specialties = useMemo(
    () => [...new Set(clinicDoctors.map((doctor) => doctor.spec))],
    [clinicDoctors],
  )
  const filteredDoctors = clinicDoctors.filter((doctor) => doctor.spec === specialty)
  const dateOptions = Array.from({ length: 7 }, (_, index) => addDays(new Date(), index))
  const price = doctorPrice(selectedDoctor)
  const formComplete = Boolean(selectedClinic && specialty && selectedDoctor && selectedDate && selectedSlot)
  const sortedReviews = [...facilityReviews].sort((a, b) => reviewSort === 'Đánh giá cao nhất' ? b.rating - a.rating : b.date.split('/').reverse().join('').localeCompare(a.date.split('/').reverse().join('')))
  const bookingDetails = formComplete
    ? {
        clinic: selectedClinic,
        doctor: selectedDoctor,
        specialty,
        date: selectedDate,
        slot: selectedSlot,
        price,
      }
    : null
  const currentStep = selectedSlot
    ? 5
    : selectedDoctor
      ? 4
      : specialty
        ? 3
        : selectedClinic
          ? 2
          : 1

  function scrollToSection(ref, highlightKey) {
    window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveHighlight(highlightKey)
      window.setTimeout(() => {
        setActiveHighlight((current) => current === highlightKey ? '' : current)
      }, 900)
    }, 120)
  }

  function selectClinic(id) {
    setClinicId(id)
    setSpecialty('')
    setSelectedDoctor(null)
    setSelectedDate('')
    setSelectedSlot('')
    setConfirmationDetails(null)
    setConfirmed('')
    scrollToSection(step2Ref, 'specialty')
  }

  function selectSpecialty(nextSpecialty) {
    setSpecialty(nextSpecialty)
    setSelectedDoctor(null)
    setSelectedDate('')
    setSelectedSlot('')
    setConfirmationDetails(null)
    setConfirmed('')
    scrollToSection(step3Ref, 'doctor')
  }

  function selectDoctor(doctor) {
    setSelectedDoctor(doctor)
    setSelectedDate('')
    setSelectedSlot('')
    setConfirmationDetails(null)
    setConfirmed('')
    scrollToSection(step4Ref, 'schedule')
  }

  function openConfirmation() {
    if (!formComplete) return
    scrollToSection(step5Ref, 'confirm')
  }

  function confirmBooking() {
    if (!bookingDetails) return
    const newAppointment = {
      id: `appt-${bookingDetails.date}-${bookingDetails.slot}-${bookingDetails.doctor.id}`,
      date: bookingDetails.date,
      time: bookingDetails.slot,
      clinicId: bookingDetails.clinic.id,
      clinicName: bookingDetails.clinic.name,
      doctorName: bookingDetails.doctor.doctor,
      spec: bookingDetails.specialty,
      type: 'Khám trực tiếp',
      price: bookingDetails.price,
    }

    try {
      const raw = window.localStorage.getItem('patientAppointments')
      const existing = raw ? JSON.parse(raw) : []
      const merged = Array.isArray(existing) ? [...existing, newAppointment] : [newAppointment]
      window.localStorage.setItem('patientAppointments', JSON.stringify(merged))
    } catch {
      // localStorage may be unavailable in restricted browser environments.
    }

    setConfirmationDetails(bookingDetails)
    setConfirmed(`Đã xác nhận lịch với ${bookingDetails.doctor.doctor} lúc ${bookingDetails.slot}.`)
    window.localStorage.setItem('medconsult-patient-toast', 'Đặt lịch khám thành công!')
    setToast('Đặt lịch thành công')
    window.setTimeout(() => navigate('/patient/appointments'), 1200)
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Đặt lịch khám"
          subtitle="Chọn cơ sở, chuyên khoa và thời gian phù hợp. Hệ thống sẽ hướng dẫn bạn từng bước."
        />

        <div className="booking-progress booking-progress-five" aria-label="Tiến trình đặt lịch">
          {bookingSteps.map((label, index) => {
            const step = index + 1
            const completed = currentStep > step
            const current = currentStep === step
            return (
              <div key={label} className={`booking-progress-step ${completed ? 'completed' : ''} ${current ? 'current' : ''}`}>
                <span>{completed ? <Check size={16} /> : step}</span>
                <b>{label}</b>
              </div>
            )
          })}
        </div>

        {confirmationDetails ? (
          <Card className="booking-confirm-card">
            <div className="booking-confirm-head">
              <span className="booking-confirm-icon"><CheckCircle2 size={24} /></span>
              <div>
                <h2>{confirmed ? 'Đặt lịch thành công' : 'Xác nhận thông tin lịch khám'}</h2>
                <p>Kiểm tra lại thông tin ca khám trước khi gửi yêu cầu.</p>
              </div>
            </div>
            <div className="booking-confirm-grid">
              <div><small>Bệnh viện / phòng khám</small><b><Building2 size={16} /> {confirmationDetails.clinic.name}</b><span>{confirmationDetails.clinic.address}</span></div>
              <div><small>Bác sĩ</small><b><UserRound size={16} /> {confirmationDetails.doctor.doctor}</b><span>{confirmationDetails.specialty} · {confirmationDetails.doctor.exp} kinh nghiệm</span></div>
              <div><small>Thời gian khám</small><b><Clock3 size={16} /> {confirmationDetails.slot}</b><span>{formatDate(confirmationDetails.date)}</span></div>
              <div><small>Chi phí ước tính</small><b><Wallet size={16} /> {confirmationDetails.price.toLocaleString('vi-VN')} đ</b><span>Chi phí thực tế có thể thay đổi theo chỉ định khám.</span></div>
            </div>
            {confirmed && <div className="booking-confirm-success">{confirmed}</div>}
            <div className="mt-7 flex justify-end gap-3">
              {!confirmed && <Button variant="ghost" onClick={() => setConfirmationDetails(null)}>Quay lại chỉnh sửa</Button>}
              {!confirmed ? <Button onClick={confirmBooking}>Xác nhận đặt lịch</Button> : <Button onClick={() => navigate('/patient/appointments')}>Về trang chủ</Button>}
            </div>
          </Card>
        ) : (
          <div className="booking-workspace">
            <div className="booking-main-flow">
              <Card className="booking-section-card">
                <div className="booking-section-head">
                  <span>1</span>
                  <div><h2>Chọn bệnh viện hoặc phòng khám</h2><p>Chọn trực tiếp từ bản đồ hoặc danh sách cơ sở gần bạn.</p></div>
                </div>
                <div className="booking-clinic-layout">
                  <div>
                    <div className="booking-map-head">
                      <b><MapPin size={17} /> Bản đồ phòng khám</b>
                      <small><Navigation size={14} /> Khoảng cách ước tính: <strong>{selectedClinic?.distance || 'Chọn cơ sở'}</strong></small>
                    </div>
                    <div className="booking-map">
                      <iframe
                        title="Bản đồ phòng khám"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=106.680%2C10.765%2C106.705%2C10.79&layer=mapnik"
                        className="booking-iframe"
                        loading="lazy"
                      />
                      <div className="map-location map-location-user" style={{ left: '10%', top: '62%' }} title="Vị trí của bạn">
                        <Navigation size={17} fill="currentColor" />
                      </div>
                      {clinics.map((clinic) => (
                        <button
                          type="button"
                          key={clinic.id}
                          title={`${clinic.name} · ${clinic.distance}`}
                          aria-label={`Chọn ${clinic.name}`}
                          className={`map-location map-location-clinic ${clinic.id === clinicId ? 'active' : ''}`}
                          style={{ left: `${clinic.coords.x}%`, top: `${clinic.coords.y}%` }}
                          onClick={() => selectClinic(clinic.id)}
                        >
                          <MapPin size={24} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="booking-clinic-list">
                    {clinics.map((clinic) => (
                      <div key={clinic.id} className={`clinic-choice-card ${clinicId === clinic.id ? 'active' : ''}`}>
                        <div className="clinic-choice-top">
                          <span className="clinic-choice-icon"><Building2 size={18} /></span>
                          <div><b>{clinic.name}</b><p>{clinic.address}</p></div>
                        </div>
                        <div className="clinic-choice-meta">
                          <span><Star size={14} fill="currentColor" /> {clinic.rating}</span>
                          <span><Navigation size={14} /> {clinic.distance}</span>
                        </div>
                        <div className="clinic-choice-actions">
                          <button type="button" onClick={() => { setPreviewClinic(clinic); setGalleryIndex(0) }}>Chi tiết</button>
                          <Button className="btn-compact" onClick={() => selectClinic(clinic.id)}>{clinicId === clinic.id ? 'Đã chọn' : 'Chọn cơ sở'}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card ref={step2Ref} className={`booking-section-card ${!selectedClinic ? 'is-locked' : ''} ${activeHighlight === 'specialty' ? 'is-highlighted' : ''}`}>
                <div className="booking-section-head">
                  <span>2</span>
                  <div><h2>Chọn chuyên khoa</h2><p>Danh sách được cập nhật theo cơ sở khám bạn đã chọn.</p></div>
                </div>
                {selectedClinic ? (
                  <div className="specialty-chip-list">
                    {specialties.map((item) => <button type="button" key={item} className={specialty === item ? 'active' : ''} onClick={() => selectSpecialty(item)}><Stethoscope size={15} /> {item}</button>)}
                  </div>
                ) : <p className="booking-helper">Hãy chọn bệnh viện hoặc phòng khám để tiếp tục.</p>}
              </Card>

              <Card ref={step3Ref} className={`booking-section-card ${!specialty ? 'is-locked' : ''} ${activeHighlight === 'doctor' ? 'is-highlighted' : ''}`}>
                <div className="booking-section-head">
                  <span>3</span>
                  <div><h2>Chọn bác sĩ</h2><p>Xem kinh nghiệm, đánh giá và tình trạng lịch khám của bác sĩ.</p></div>
                </div>
                {specialty ? (
                  <div className="booking-doctor-grid">
                    {filteredDoctors.map((doctor) => (
                      <button type="button" key={doctor.id} className={`booking-doctor-card ${selectedDoctor?.id === doctor.id ? 'active' : ''}`} onClick={() => selectDoctor(doctor)}>
                        <span className="booking-doctor-avatar">{doctor.doctor.replace('BS. ', '').split(' ').slice(-2).map((word) => word[0]).join('')}</span>
                        <span><b>{doctor.doctor}</b><small>{doctor.spec}</small><small>{doctor.exp} kinh nghiệm</small><em><Star size={13} fill="currentColor" /> {doctor.rating} · <i>Đang nhận lịch</i></em></span>
                      </button>
                    ))}
                  </div>
                ) : <p className="booking-helper">Hãy chọn chuyên khoa để xem bác sĩ phù hợp.</p>}
              </Card>

              <Card ref={step4Ref} className={`booking-section-card ${!selectedDoctor ? 'is-locked' : ''} ${activeHighlight === 'schedule' ? 'is-highlighted' : ''}`}>
                <div className="booking-section-head">
                  <span>4</span>
                  <div><h2>Chọn lịch khám</h2><p>Chọn ngày trước, sau đó chọn khung giờ còn trống.</p></div>
                </div>
                {selectedDoctor ? (
                  <>
                    <h3 className="booking-subtitle"><CalendarDays size={16} /> Chọn ngày khám</h3>
                    <div className="booking-date-list">
                      {dateOptions.map((date) => {
                        const iso = toLocalISODate(date)
                        return <button type="button" key={iso} className={selectedDate === iso ? 'active' : ''} onClick={() => {
                          setSelectedDate(iso);
                          setSelectedSlot('');
                          setConfirmationDetails(null);
                          setConfirmed('');
                          scrollToSection(slotsRef, 'slots')
                        }}><small>{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</small><b>{date.getDate()}</b><span>Tháng {date.getMonth() + 1}</span></button>
                      })}
                    </div>
                    {selectedDate && (
                      <div ref={slotsRef} className={`booking-slot-area ${activeHighlight === 'slots' ? 'is-highlighted' : ''}`}>
                        <h3 className="booking-subtitle"><Clock3 size={16} /> Chọn khung giờ khám</h3>
                        {slotGroups.map((group) => (
                          <div key={group.label} className="booking-slot-group">
                            <b>{group.label}</b>
                            <div>{group.slots.map((slot) => {
                              const available = selectedDoctor.slots.includes(slot)
                              return <button type="button" key={slot} disabled={!available} className={selectedSlot === slot ? 'active' : ''} onClick={() => {
                                setSelectedSlot(slot)
                                setConfirmationDetails(null)
                                setConfirmed('')
                                scrollToSection(step5Ref, 'confirm')
                              }}>{slot}</button>
                            })}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : <p className="booking-helper">Hãy chọn bác sĩ để xem các lịch khám còn trống.</p>}
              </Card>

              <Card ref={step5Ref} className={`booking-section-card booking-confirm-section ${!bookingDetails ? 'is-locked' : ''} ${activeHighlight === 'confirm' ? 'is-highlighted' : ''}`}>
                <div className="booking-section-head">
                  <span>5</span>
                  <div><h2>Xác nhận đặt lịch</h2><p>Kiểm tra lại thông tin trước khi gửi yêu cầu đặt lịch khám.</p></div>
                </div>
                {bookingDetails ? (
                  <>
                    <div className="booking-confirm-grid">
                      <div><small>Bệnh viện / phòng khám</small><b><Building2 size={16} /> {bookingDetails.clinic.name}</b><span>{bookingDetails.clinic.address}</span></div>
                      <div><small>Bác sĩ</small><b><UserRound size={16} /> {bookingDetails.doctor.doctor}</b><span>{bookingDetails.specialty} · {bookingDetails.doctor.exp} kinh nghiệm</span></div>
                      <div><small>Thời gian khám</small><b><Clock3 size={16} /> {bookingDetails.slot}</b><span>{formatDate(bookingDetails.date)}</span></div>
                      <div><small>Chi phí ước tính</small><b><Wallet size={16} /> {bookingDetails.price.toLocaleString('vi-VN')} đ</b><span>Chi phí thực tế có thể thay đổi theo chỉ định khám.</span></div>
                    </div>
                    <div className="mt-7 flex justify-end">
                      <Button onClick={confirmBooking}>Xác nhận đặt lịch</Button>
                    </div>
                  </>
                ) : <p className="booking-helper">Hãy chọn đầy đủ cơ sở, chuyên khoa, bác sĩ, ngày và giờ khám để xác nhận.</p>}
              </Card>
            </div>

            <aside ref={summaryRef} className="booking-summary-wrap">
              <Card className="booking-summary">
                <h2>Tóm tắt đặt lịch</h2>
                <p>Thông tin được cập nhật theo lựa chọn của bạn.</p>
                <div className="booking-summary-list">
                  <div><Building2 size={16} /><span><small>Cơ sở khám</small><b>{selectedClinic?.name || 'Chưa chọn'}</b></span></div>
                  <div><Stethoscope size={16} /><span><small>Chuyên khoa</small><b>{specialty || 'Chưa chọn'}</b></span></div>
                  <div><UserRound size={16} /><span><small>Bác sĩ</small><b>{selectedDoctor?.doctor || 'Chưa chọn'}</b></span></div>
                  <div><CalendarDays size={16} /><span><small>Ngày khám</small><b>{selectedDate ? formatDate(selectedDate) : 'Chưa chọn'}</b></span></div>
                  <div><Clock3 size={16} /><span><small>Giờ khám</small><b>{selectedSlot || 'Chưa chọn'}</b></span></div>
                  <div><Wallet size={16} /><span><small>Phí khám ước tính</small><b>{selectedDoctor ? `${price.toLocaleString('vi-VN')} đ` : 'Chưa có'}</b></span></div>
                </div>
                <Button className="booking-summary-submit" disabled={!formComplete} onClick={openConfirmation}>Tiếp tục</Button>
                {!formComplete && <small className="booking-summary-note">Vui lòng hoàn tất đầy đủ các bước để tiếp tục.</small>}
              </Card>
            </aside>
          </div>
        )}
      </div>

      {previewClinic && (
        <div className="modal-backdrop">
          <Card className="facility-dialog">
            <button className="dialog-close" onClick={() => setPreviewClinic(null)}>×</button>
            <FacilityGallery index={galleryIndex} setIndex={setGalleryIndex} />
            <div className="facility-dialog-body">
              <div className="facility-title-row"><div><span>Cơ sở y tế được xác minh</span><h2>{previewClinic.name}</h2><p><MapPin size={16} /> {previewClinic.address} · <Navigation size={16} /> {previewClinic.distance}</p></div><div className="facility-score"><b>{previewClinic.rating}</b><span>★★★★★</span><small>128 đánh giá</small></div></div>
              <div className="facility-info-grid"><span><Clock3 size={17} /><b>Giờ làm việc</b><small>07:30 - 20:00, Thứ 2 - CN</small></span><span><Phone size={17} /><b>Hotline</b><small>028 3930 6688</small></span><span><Globe2 size={17} /><b>Website</b><small>medconsult.vn/co-so</small></span></div>
              <div className="facility-section"><h3>Đánh giá bệnh nhân</h3><div className="facility-rating-layout"><div className="facility-rating-summary"><b>{previewClinic.rating}</b><span>★★★★★</span><small>Dựa trên 128 đánh giá</small></div><div className="facility-rating-bars">{[82, 12, 4, 1, 1].map((value, index) => <div key={`${5 - index}-star`}><small>{5 - index} sao</small><span><i style={{ width: `${value}%` }} /></span><em>{value}%</em></div>)}</div></div></div>
              <div className="facility-section"><h3>Chuyên khoa nổi bật</h3><div className="facility-tags">{['Nội tổng quát', 'Tim mạch', 'Tai mũi họng', 'Da liễu', 'Nhi khoa'].map((item) => <span key={item}>{item}</span>)}</div></div>
              <div className="facility-section"><h3>Bác sĩ tại cơ sở</h3><div className="facility-doctor-list">{doctorAvailability.filter((doctor) => doctor.clinicId === previewClinic.id).slice(0, 3).map((doctor) => <article key={doctor.id}><span>{doctor.doctor.replace('BS. ', '').split(' ').slice(-2).map((word) => word[0]).join('')}</span><div><b>{doctor.doctor}</b><small>{doctor.spec} · {doctor.exp} kinh nghiệm</small></div><em><Star size={13} fill="currentColor" /> {doctor.rating}</em></article>)}</div></div>
              <div className="facility-section"><div className="facility-review-head"><h3>Bình luận gần đây</h3><select value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}><option>Mới nhất</option><option>Đánh giá cao nhất</option></select></div><div className="facility-review-list">{sortedReviews.slice(0, showAllReviews ? sortedReviews.length : 2).map((review) => <article key={review.name}><span>{review.name.split(' ').slice(-2).map((word) => word[0]).join('')}</span><div><b>{review.name}<small>{review.date}</small></b><em>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</em><p>{review.text}</p></div></article>)}</div><button className="facility-more" onClick={() => setShowAllReviews((value) => !value)}>{showAllReviews ? 'Thu gọn bình luận' : 'Xem thêm bình luận'}</button></div>
            </div>
            <div className="facility-dialog-actions"><Button variant="outline" onClick={() => window.open('https://maps.google.com', '_blank')}><Navigation size={16} /> Xem chỉ đường</Button><Button variant="outline" onClick={() => window.location.href = 'tel:02839306688'}><Phone size={16} /> Gọi điện</Button><Button variant="outline" onClick={() => { selectClinic(previewClinic.id); setPreviewClinic(null) }}>Chọn cơ sở</Button><Button onClick={() => { selectClinic(previewClinic.id); setPreviewClinic(null) }}><CalendarDays size={16} /> Đặt lịch khám</Button></div>
          </Card>
        </div>
      )}

      {toast && <div className="toast"><span>✓</span> {toast}</div>}
    </AppShell>
  )
}

function FacilityGallery({ index, setIndex }) {
  const gallery = [
    { label: 'Mặt tiền cơ sở', url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sảnh tiếp đón', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Phòng khám', url: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Thiết bị y tế', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' },
  ]
  const move = (direction) => setIndex((index + direction + gallery.length) % gallery.length)
  return <div className="facility-gallery"><img src={gallery[index].url} alt={gallery[index].label} /><span>{gallery[index].label}</span><button className="prev" onClick={() => move(-1)}><ChevronLeft size={19} /></button><button className="next" onClick={() => move(1)}><ChevronRight size={19} /></button><div>{gallery.map((item, itemIndex) => <button key={item.label} className={index === itemIndex ? 'active' : ''} onClick={() => setIndex(itemIndex)} aria-label={item.label} />)}</div></div>
}
