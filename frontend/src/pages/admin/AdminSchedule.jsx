import { createElement, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Activity,
  BadgeCheck,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Filter,
  History,
  MapPin,
  MoreHorizontal,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Stethoscope,
  Users,
  X,
  XCircle,
} from 'lucide-react'
import { AppShell, Button, TopBar } from '../../components/ui.jsx'

const clinics = ['Tất cả cơ sở', 'Phòng khám Đa khoa Tâm An', 'Phòng khám Tim mạch An Bình', 'MedCare Family Clinic']
const specialties = ['Tất cả chuyên khoa', 'Nội tổng quát', 'Tim mạch', 'Nhi khoa', 'Răng Hàm Mặt']
const doctors = ['Tất cả bác sĩ', 'BS. Nguyễn Văn Minh', 'BS. Trần Thị Hoa', 'BS. Lê Hoàng Anh', 'BS. Phạm Minh Tuấn']
const statuses = ['Tất cả trạng thái', 'Chờ xác nhận', 'Đã xác nhận', 'Đang khám', 'Hoàn thành', 'Đã hủy']
const rooms = ['Phòng 102', 'Phòng 108', 'Phòng 201', 'Phòng 305', 'Online']
const availableSlots = ['08:00', '08:30', '09:30', '10:15', '14:00', '15:30', '16:00']
const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const weekDays = [
  ['Thứ 2', '01/06'],
  ['Thứ 3', '02/06'],
  ['Thứ 4', '03/06'],
  ['Thứ 5', '04/06'],
  ['Thứ 6', '05/06'],
  ['Thứ 7', '06/06'],
  ['Chủ nhật', '07/06'],
]

const defaultAppointments = [
  { id: 'LK-260601-001', date: '2026-06-01', time: '08:00', endTime: '08:45', patient: 'Trần Thị Mai', patientId: 'BN-00128', initials: 'TM', phone: '0901 234 567', age: 42, doctor: 'BS. Nguyễn Văn Minh', doctorInitials: 'NM', spec: 'Nội tổng quát', clinic: clinics[1], room: 'Phòng 102', type: 'Khám trực tiếp', status: 'Đang khám', payment: 'Đã thanh toán', reason: 'Sốt và ho kéo dài', symptoms: 'Ho khan, sốt nhẹ, đau họng', note: 'Theo dõi thân nhiệt và hô hấp.' },
  { id: 'LK-260601-002', date: '2026-06-01', time: '09:30', endTime: '10:00', patient: 'Lê Văn Hùng', patientId: 'BN-00145', initials: 'LH', phone: '0908 222 118', age: 55, doctor: 'BS. Trần Thị Hoa', doctorInitials: 'TH', spec: 'Tim mạch', clinic: clinics[2], room: 'Phòng 201', type: 'Tái khám', status: 'Chờ xác nhận', payment: 'Chờ thanh toán', reason: 'Tái khám huyết áp', symptoms: 'Đau tức ngực nhẹ khi vận động', note: 'Mang theo kết quả điện tim gần nhất.' },
  { id: 'LK-260601-003', date: '2026-06-01', time: '10:15', endTime: '11:00', patient: 'Phạm Quang Minh', patientId: 'BN-00176', initials: 'PM', phone: '0917 445 882', age: 29, doctor: 'BS. Lê Hoàng Anh', doctorInitials: 'LA', spec: 'Răng Hàm Mặt', clinic: clinics[3], room: 'Phòng 305', type: 'Khám trực tiếp', status: 'Đã xác nhận', payment: 'Đã thanh toán', reason: 'Đau răng hàm', symptoms: 'Ê buốt khi ăn đồ lạnh', note: 'Kiểm tra răng số 6.' },
  { id: 'LK-260601-004', date: '2026-06-01', time: '14:00', endTime: '14:30', patient: 'Nguyễn Thị Lan', patientId: 'BN-00194', initials: 'NL', phone: '0934 118 965', age: 36, doctor: 'BS. Phạm Minh Tuấn', doctorInitials: 'PT', spec: 'Nội tổng quát', clinic: clinics[1], room: 'Phòng 108', type: 'Tư vấn online', status: 'Đã hủy', payment: 'Hoàn tiền', reason: 'Đau vai gáy', symptoms: 'Mỏi cổ, đau vai', note: 'Bệnh nhân xin hủy trước giờ khám.' },
  { id: 'LK-260601-005', date: '2026-06-01', time: '15:30', endTime: '16:00', patient: 'Đỗ Minh Anh', patientId: 'BN-00212', initials: 'ĐA', phone: '0987 611 220', age: 31, doctor: 'BS. Nguyễn Văn Minh', doctorInitials: 'NM', spec: 'Nội tổng quát', clinic: clinics[1], room: 'Phòng 102', type: 'Khám trực tiếp', status: 'Hoàn thành', payment: 'Đã thanh toán', reason: 'Khám sức khỏe định kỳ', symptoms: 'Không có triệu chứng đặc biệt', note: 'Hẹn tái khám sau 6 tháng.' },
  { id: 'LK-260602-006', date: '2026-06-02', time: '08:30', endTime: '09:00', patient: 'Vũ Hải Nam', patientId: 'BN-00220', initials: 'VN', phone: '0935 221 898', age: 48, doctor: 'BS. Trần Thị Hoa', doctorInitials: 'TH', spec: 'Tim mạch', clinic: clinics[2], room: 'Phòng 201', type: 'Khám trực tiếp', status: 'Đã xác nhận', payment: 'Đã thanh toán', reason: 'Theo dõi tim mạch', symptoms: 'Mệt khi vận động', note: 'Đo điện tim trước khi khám.' },
]

const defaultRota = [
  { id: 'TR-001', doctor: 'BS. Nguyễn Văn Minh', initials: 'NM', spec: 'Nội tổng quát', clinic: clinics[1], morning: ['08:00 - 12:00', 'Phòng 102', '6/10', 'Còn slot'], afternoon: ['13:30 - 17:30', 'Phòng 102', '8/10', 'Đang trực'], evening: ['Nghỉ', '', '', 'Nghỉ'] },
  { id: 'TR-002', doctor: 'BS. Trần Thị Hoa', initials: 'TH', spec: 'Tim mạch', clinic: clinics[2], morning: ['Nghỉ', '', '', 'Nghỉ'], afternoon: ['13:30 - 17:30', 'Phòng 201', '10/10', 'Đầy lịch'], evening: ['18:00 - 21:00', 'Online', '4/6', 'Còn slot'] },
  { id: 'TR-003', doctor: 'BS. Lê Hoàng Anh', initials: 'LA', spec: 'Răng Hàm Mặt', clinic: clinics[3], morning: ['08:00 - 12:00', 'Phòng 305', '5/8', 'Còn slot'], afternoon: ['Nghỉ phép', '', '', 'Nghỉ phép'], evening: ['Nghỉ', '', '', 'Nghỉ'] },
  { id: 'TR-004', doctor: 'BS. Phạm Minh Tuấn', initials: 'PT', spec: 'Nội tổng quát', clinic: clinics[1], morning: ['08:00 - 12:00', 'Phòng 108', '8/8', 'Đầy lịch'], afternoon: ['13:30 - 17:30', 'Phòng 108', '3/8', 'Còn slot'], evening: ['Nghỉ', '', '', 'Nghỉ'] },
]

const emptyAppointment = { patient: '', spec: 'Nội tổng quát', doctor: doctors[1], clinic: clinics[1], room: rooms[0], date: '2026-06-01', time: availableSlots[0], reason: '', symptoms: '', type: 'Khám trực tiếp', note: '' }
const emptyDuty = { doctor: doctors[1], clinic: clinics[1], room: rooms[0], spec: 'Nội tổng quát', date: '2026-06-01', shift: 'Ca sáng 08:00 - 12:00', customStart: '08:00', customEnd: '12:00', slots: '8', duration: '30 phút', method: 'Khám trực tiếp', repeat: 'Không lặp', note: '' }

function statusClass(status) {
  return `is-${status.toLowerCase().replaceAll(' ', '-')}`
}

function typeClass(type) {
  if (type === 'Tư vấn online') return 'is-online'
  if (type === 'Tái khám') return 'is-follow-up'
  return 'is-direct'
}

function Modal({ children, onClose, wide = false }) {
  return <div className="modal-backdrop admin-schedule-modal-backdrop" onMouseDown={onClose}><section className={`admin-schedule-modal ${wide ? 'is-wide' : ''}`} onMouseDown={(event) => event.stopPropagation()}>{children}</section></div>
}

export function AdminSchedule({ showModal = false }) {
  const location = useLocation()
  const initialDoctor = location.state?.doctorFilter || doctors[0]

  const [appointments, setAppointments] = useState(defaultAppointments)
  const [rota, setRota] = useState(defaultRota)
  const [view, setView] = useState('table')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [date, setDate] = useState('2026-06-01')
  const [clinic, setClinic] = useState(clinics[0])
  const [spec, setSpec] = useState(specialties[0])
  const [doctor, setDoctor] = useState(initialDoctor)
  const [status, setStatus] = useState(statuses[0])
  const [query, setQuery] = useState('')
  const [openActions, setOpenActions] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [appointmentOpen, setAppointmentOpen] = useState(showModal)
  const [dutyOpen, setDutyOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment)
  const [dutyForm, setDutyForm] = useState(emptyDuty)
  const [toast, setToast] = useState('')
  const [confirmCancelAppointment, setConfirmCancelAppointment] = useState(null)

  const selectDoctorsList = useMemo(() => {
    if (initialDoctor && !doctors.includes(initialDoctor)) {
      return [...doctors, initialDoctor]
    }
    return doctors
  }, [initialDoctor])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2500)
  }

  const filteredAppointments = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return appointments.filter((item) => (
      (!date || item.date === date)
      && (clinic === clinics[0] || item.clinic === clinic)
      && (spec === specialties[0] || item.spec === spec)
      && (doctor === doctors[0] || item.doctor === doctor)
      && (status === statuses[0] || item.status === status)
      && (!normalized || `${item.patient} ${item.id}`.toLowerCase().includes(normalized))
    ))
  }, [appointments, clinic, date, doctor, query, spec, status])

  const pendingAppointments = filteredAppointments.filter((item) => item.status === 'Chờ xác nhận').length
  const kpis = [
    ['Ca hôm nay', filteredAppointments.length, '+12 so với hôm qua', CalendarDays, 'teal'],
    ['Đã xác nhận', filteredAppointments.filter((item) => item.status === 'Đã xác nhận').length, '67% đã xác nhận', BadgeCheck, 'blue'],
    ['Đang khám', filteredAppointments.filter((item) => item.status === 'Đang khám').length, 'Theo dõi realtime', Activity, 'violet'],
    ['Đã hủy', filteredAppointments.filter((item) => item.status === 'Đã hủy').length, 'Giảm 8% tuần này', XCircle, 'red'],
  ]

  const resetFilters = () => {
    setDate('2026-06-01')
    setClinic(clinics[0])
    setSpec(specialties[0])
    setDoctor(doctors[0])
    setStatus(statuses[0])
    setQuery('')
  }

  const updateAppointmentStatus = (item, nextStatus) => {
    if (nextStatus === 'Đã hủy') {
      setConfirmCancelAppointment(item)
      return
    }
    setAppointments((current) => current.map((appointment) => appointment.id === item.id ? { ...appointment, status: nextStatus } : appointment))
    setSelectedAppointment((current) => current?.id === item.id ? { ...current, status: nextStatus } : current)
    setOpenActions(null)
    notify(`Đã cập nhật ${item.id}: ${nextStatus}`)
  }

  const handleConfirmCancel = () => {
    if (!confirmCancelAppointment) return
    const item = confirmCancelAppointment
    setAppointments((current) => current.map((appointment) => appointment.id === item.id ? { ...appointment, status: 'Đã hủy' } : appointment))
    setSelectedAppointment((current) => current?.id === item.id ? { ...current, status: 'Đã hủy' } : current)
    setOpenActions(null)
    setConfirmCancelAppointment(null)
    notify(`Đã hủy lịch khám ${item.id}`)
  }

  const addAppointment = (event) => {
    event.preventDefault()
    const nextNumber = appointments.length + 1
    const next = {
      ...appointmentForm,
      id: `LK-260601-${String(nextNumber).padStart(3, '0')}`,
      endTime: appointmentForm.time === '08:00' ? '08:30' : appointmentForm.time,
      patientId: `BN-${String(250 + nextNumber).padStart(5, '0')}`,
      initials: appointmentForm.patient.split(' ').slice(-2).map((word) => word[0]).join('').toUpperCase(),
      doctorInitials: appointmentForm.doctor.split(' ').slice(-2).map((word) => word[0]).join('').toUpperCase(),
      phone: 'Chưa cập nhật',
      age: '--',
      status: 'Chờ xác nhận',
      payment: 'Chờ thanh toán',
    }
    setAppointments((current) => [next, ...current])
    setAppointmentForm(emptyAppointment)
    setAppointmentOpen(false)
    notify('Đã thêm lịch khám mới')
  }

  const addDuty = (event, autoCreate = false) => {
    event.preventDefault()
    const isCustomShift = dutyForm.shift === 'Tùy chỉnh giờ'
    const shiftTime = isCustomShift ? `${dutyForm.customStart} - ${dutyForm.customEnd}` : dutyForm.shift.replace('Ca sáng ', '').replace('Ca chiều ', '').replace('Ca tối ', '')
    const shiftHour = Number((isCustomShift ? dutyForm.customStart : shiftTime).slice(0, 2))
    const shiftKey = shiftHour < 12 ? 'morning' : shiftHour < 18 ? 'afternoon' : 'evening'
    const conflict = rota.some((item) => item.doctor === dutyForm.doctor && item[shiftKey][0] !== 'Nghỉ' && item[shiftKey][0] !== 'Nghỉ phép')
    if (conflict) {
      notify('Cảnh báo: bác sĩ đã có lịch trong ca này')
      return
    }
    const roomConflict = dutyForm.room !== 'Online' && rota.some((item) => item[shiftKey][1] === dutyForm.room)
    if (roomConflict) {
      notify('Cảnh báo: phòng khám đã được phân công trong ca này')
      return
    }
    setRota((current) => {
      const existing = current.find((item) => item.doctor === dutyForm.doctor)
      if (existing) return current.map((item) => item.doctor === dutyForm.doctor ? { ...item, [shiftKey]: [shiftTime, dutyForm.room, `0/${dutyForm.slots}`, 'Còn slot'] } : item)
      return [...current, { id: `TR-${String(current.length + 1).padStart(3, '0')}`, doctor: dutyForm.doctor, initials: dutyForm.doctor.split(' ').slice(-2).map((word) => word[0]).join(''), spec: dutyForm.spec, clinic: dutyForm.clinic, morning: ['Nghỉ', '', '', 'Nghỉ'], afternoon: ['Nghỉ', '', '', 'Nghỉ'], evening: ['Nghỉ', '', '', 'Nghỉ'], [shiftKey]: [shiftTime, dutyForm.room, `0/${dutyForm.slots}`, 'Còn slot'] }]
    })
    setDutyForm(emptyDuty)
    setDutyOpen(false)
    notify(autoCreate ? 'Đã lưu lịch trực và tạo slot khám tự động' : 'Đã lưu lịch trực bác sĩ')
  }

  return (
    <AppShell role="admin">
      <TopBar title="Quản trị hệ thống" subtitle="Điều phối vận hành" />
      <main className="content-wide admin-clinic-page admin-schedule-page">
        <section className="admin-clinic-page-head">
          <div>
            <p className="admin-clinic-breadcrumb">Admin <span>/</span> Quản lý lịch khám</p>
            {/* <span className="admin-clinic-eyebrow"><CalendarDays size={15} /> ĐIỀU PHỐI CA KHÁM</span> */}
            <h1 style={{ whiteSpace: 'nowrap' }}>Quản lý lịch khám & lịch trực</h1>
            <p>Sắp xếp ca khám, phân công bác sĩ, phòng khám và theo dõi vận hành trong ngày.</p>
          </div>
          <div className="admin-clinic-head-actions admin-schedule-head-actions">
            <span className="admin-schedule-pending-badge">
              <Clock3 size={15} /> Đang chờ xử lý: <strong>{pendingAppointments}</strong>
            </span>
            <Button variant="outline" onClick={() => notify('Đã xuất lịch vận hành')}><Download size={17} /> Xuất lịch</Button>
            <Button variant="outline" onClick={() => notify('Đồng bộ lịch thành công')}><RefreshCw size={17} /> Đồng bộ lịch</Button>
            <Button variant="outline" onClick={() => setDutyOpen(true)}><Stethoscope size={17} /> Tạo lịch trực bác sĩ</Button>
            <Button onClick={() => setAppointmentOpen(true)}><CalendarPlus size={17} /> Thêm lịch khám</Button>
          </div>
        </section>

        <section className="admin-schedule-kpi-grid">
          {kpis.map(([label, value, trend, Icon, tone]) => <article className={`admin-schedule-kpi is-${tone}`} key={label}><span>{createElement(Icon, { size: 21 })}</span><p>{label}</p><strong>{value}</strong><small>{trend}</small></article>)}
        </section>

        <section className={`admin-schedule-toolbar ${filtersOpen ? 'is-open' : ''}`}>
          <div className="admin-schedule-toolbar-head">
            <div><Filter size={19} /><b>Bộ lọc lịch khám</b></div>
            <button type="button" onClick={() => setFiltersOpen((value) => !value)}><Filter size={16} /> Bộ lọc</button>
          </div>
          <div className="admin-schedule-filter-grid">
            <label><span>Chọn ngày</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label><span>Cơ sở</span><select value={clinic} onChange={(event) => setClinic(event.target.value)}>{clinics.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Chuyên khoa</span><select value={spec} onChange={(event) => setSpec(event.target.value)}>{specialties.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Bác sĩ</span><select value={doctor} onChange={(event) => setDoctor(event.target.value)}>{selectDoctorsList.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="admin-schedule-search"><span>Tìm kiếm</span><div><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bệnh nhân / mã lịch khám" /></div></label>
          </div>
          <div className="admin-schedule-filter-actions">
            <button type="button" onClick={resetFilters}><RotateCcw size={15} /> Reset bộ lọc</button>
            <button type="button" onClick={() => setAdvancedOpen((value) => !value)}><Filter size={15} /> Lọc nâng cao</button>
          </div>
          {advancedOpen && <div className="admin-schedule-advanced"><span><input type="checkbox" /> Chỉ hiển thị ca chưa thanh toán</span><span><input type="checkbox" /> Ca cần điều phối phòng</span><span><input type="checkbox" /> Bác sĩ sắp đầy lịch</span></div>}
        </section>

        <section className="admin-schedule-view-bar">
          <div>
            <h2>Lịch vận hành ngày 01/06/2026</h2>
            <p>{filteredAppointments.length} ca phù hợp với bộ lọc hiện tại.</p>
          </div>
          <div role="tablist">{[['table', 'Bảng'], ['day', 'Ngày'], ['week', 'Tuần'], ['rota', 'Lịch trực']].map(([key, label]) => <button className={view === key ? 'is-active' : ''} key={key} onClick={() => setView(key)} role="tab" type="button">{label}</button>)}</div>
        </section>

        {view === 'table' && <ScheduleTable appointments={filteredAppointments} onAction={setOpenActions} onStatus={updateAppointmentStatus} onView={setSelectedAppointment} openActions={openActions} />}
        {view === 'day' && <DayTimeline appointments={filteredAppointments} onView={setSelectedAppointment} />}
        {view === 'week' && <WeekCalendar appointments={appointments} onSelectDay={(nextDate) => { setDate(nextDate); setView('day') }} />}
        {view === 'rota' && <RotaBoard rota={rota} />}
      </main>

      {appointmentOpen && <AppointmentModal form={appointmentForm} onChange={setAppointmentForm} onClose={() => setAppointmentOpen(false)} onSubmit={addAppointment} />}
      {dutyOpen && <DutyModal form={dutyForm} onChange={setDutyForm} onClose={() => setDutyOpen(false)} onSubmit={addDuty} />}
      {selectedAppointment && <AppointmentDrawer appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} onStatus={updateAppointmentStatus} />}

      {confirmCancelAppointment && (
        <div className="modal-backdrop" onMouseDown={() => setConfirmCancelAppointment(null)}>
          <div className="modal admin-doctor-delete-modal p-6 text-center" onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
            <div className="admin-doctor-delete-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><XCircle size={26} /></div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px' }}>Hủy lịch khám?</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn hủy lịch khám <b>{confirmCancelAppointment.id}</b> của bệnh nhân <b>{confirmCancelAppointment.patient}</b> không?
            </p>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="outline" onClick={() => setConfirmCancelAppointment(null)}>Hủy</Button>
              <Button onClick={handleConfirmCancel} style={{ background: '#ef4444', color: '#fff', border: 'none' }}>Xác nhận hủy</Button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}

function ScheduleTable({ appointments, onAction, onStatus, onView, openActions }) {
  return <section className="admin-schedule-table-wrap"><table><thead><tr><th>Thời gian</th><th>Bệnh nhân</th><th>Bác sĩ</th><th>Chuyên khoa</th><th>Cơ sở / Phòng</th><th>Loại khám</th><th>Trạng thái</th><th>Thanh toán</th><th>Thao tác</th></tr></thead><tbody>{appointments.map((item) => <tr key={item.id}>
    <td><b>{item.time}</b><small>{item.endTime}</small></td>
    <td><div className="admin-schedule-person"><span>{item.initials}</span><div><b>{item.patient}</b><small>{item.id}</small></div></div></td>
    <td><div className="admin-schedule-doctor"><span>{item.doctorInitials}</span><b>{item.doctor}</b></div></td>
    <td><span className="admin-schedule-spec">{item.spec}</span></td>
    <td><b>{item.clinic}</b><small>{item.room}</small></td>
    <td><span className={`admin-schedule-type ${typeClass(item.type)}`}>{item.type}</span></td>
    <td><span className={`admin-schedule-status ${statusClass(item.status)}`}>{item.status}</span></td>
    <td><span className="admin-schedule-payment">{item.payment}</span></td>
    <td className="admin-schedule-action-cell"><button aria-label={`Mở thao tác ${item.id}`} className="admin-schedule-more" onClick={() => onAction(openActions === item.id ? null : item.id)} type="button"><MoreHorizontal size={18} /></button>{openActions === item.id && <div className="admin-schedule-action-menu"><button onClick={() => onView(item)} type="button"><Eye size={15} /> Xem chi tiết</button><button type="button"><History size={15} /> Sửa lịch</button><button type="button"><Users size={15} /> Đổi bác sĩ</button><button type="button"><MapPin size={15} /> Đổi phòng</button>{item.status === 'Chờ xác nhận' && <button onClick={() => onStatus(item, 'Đã xác nhận')} type="button"><BadgeCheck size={15} /> Xác nhận</button>}<button className="is-danger" onClick={() => onStatus(item, 'Đã hủy')} type="button"><XCircle size={15} /> Hủy lịch</button></div>}</td>
  </tr>)}</tbody></table></section>
}

function DayTimeline({ appointments, onView }) {
  return <section className="admin-schedule-day"><aside>{hours.map((hour) => <span key={hour}>{hour}</span>)}</aside><div>{hours.map((hour) => <div className="admin-schedule-hour" key={hour}>{appointments.filter((item) => item.time.startsWith(hour.slice(0, 2))).map((item) => <button className={`admin-schedule-time-block ${statusClass(item.status)}`} key={item.id} onClick={() => onView(item)} type="button"><b>{item.time} · {item.patient}</b><small>{item.doctor}</small><span>{item.room} · {item.status}</span></button>)}</div>)}</div></section>
}

function WeekCalendar({ appointments, onSelectDay }) {
  return <section className="admin-schedule-week">{weekDays.map(([label, display], index) => {
    const nextDate = `2026-06-${String(index + 1).padStart(2, '0')}`
    const dayItems = appointments.filter((item) => item.date === nextDate)
    return <button key={nextDate} onClick={() => onSelectDay(nextDate)} type="button"><header><b>{label}</b><span>{display}</span></header><strong>{dayItems.length} ca khám</strong>{dayItems.slice(0, 3).map((item) => <small className={statusClass(item.status)} key={item.id}>{item.time} · {item.patient}</small>)}<em>{dayItems.length ? 'Xem lịch trong ngày' : 'Chưa có lịch'}</em></button>
  })}</section>
}

function RotaBoard({ rota }) {
  return <section className="admin-schedule-rota"><div className="admin-schedule-rota-head"><b>Bác sĩ phụ trách</b><b>Ca sáng</b><b>Ca chiều</b><b>Ca tối</b></div>{rota.map((item) => <div className="admin-schedule-rota-row" key={item.id}><div className="admin-schedule-rota-person"><span>{item.initials}</span><div><b>{item.doctor}</b><small>{item.spec} · {item.clinic}</small></div></div>{[item.morning, item.afternoon, item.evening].map(([time, room, booked, state], index) => <article className={`admin-schedule-duty-cell ${statusClass(state)}`} key={`${item.id}-${index}`}><b>{time}</b>{room && <small>{room}</small>}{booked && <span>{booked} slot đã đặt</span>}<em>{state}</em></article>)}</div>)}</section>
}

function AppointmentModal({ form, onChange, onClose, onSubmit }) {
  return <Modal onClose={onClose} wide><form onSubmit={onSubmit}><div className="admin-schedule-modal-head"><div><span><CalendarPlus size={15} /> LỊCH KHÁM MỚI</span><h2>Thêm lịch khám</h2><p>Điều phối bệnh nhân vào slot còn trống trong lịch trực của bác sĩ.</p></div><button aria-label="Đóng form lịch khám" onClick={onClose} type="button"><X /></button></div><div className="admin-schedule-form-grid">
    <label><span>Bệnh nhân *</span><input required value={form.patient} onChange={(event) => onChange({ ...form, patient: event.target.value })} placeholder="Nhập tên bệnh nhân" /></label>
    <label><span>Chuyên khoa</span><select value={form.spec} onChange={(event) => onChange({ ...form, spec: event.target.value })}>{specialties.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Bác sĩ</span><select value={form.doctor} onChange={(event) => onChange({ ...form, doctor: event.target.value })}>{doctors.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Cơ sở</span><select value={form.clinic} onChange={(event) => onChange({ ...form, clinic: event.target.value })}>{clinics.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Phòng</span><select value={form.room} onChange={(event) => onChange({ ...form, room: event.target.value })}>{rooms.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Ngày khám</span><input type="date" value={form.date} onChange={(event) => onChange({ ...form, date: event.target.value })} /></label>
    <label><span>Slot còn trống</span><select value={form.time} onChange={(event) => onChange({ ...form, time: event.target.value })}>{availableSlots.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Loại khám</span><select value={form.type} onChange={(event) => onChange({ ...form, type: event.target.value })}><option>Khám trực tiếp</option><option>Tư vấn online</option><option>Tái khám</option></select></label>
    <label className="is-wide"><span>Lý do khám</span><input value={form.reason} onChange={(event) => onChange({ ...form, reason: event.target.value })} placeholder="Mô tả ngắn lý do khám" /></label>
    <label className="is-wide"><span>Triệu chứng</span><textarea value={form.symptoms} onChange={(event) => onChange({ ...form, symptoms: event.target.value })} placeholder="Triệu chứng bệnh nhân đang gặp phải" /></label>
    <label className="is-wide"><span>Ghi chú nội bộ</span><textarea value={form.note} onChange={(event) => onChange({ ...form, note: event.target.value })} placeholder="Thông tin hỗ trợ điều phối" /></label>
  </div><div className="admin-schedule-form-note"><ShieldAlert size={17} /><span>Slot hiển thị được lấy từ lịch trực hiện tại. Hệ thống sẽ cảnh báo nếu bác sĩ chưa có lịch trực phù hợp.</span></div><div className="admin-schedule-modal-actions"><Button variant="outline" onClick={onClose} type="button">Hủy</Button><Button type="submit"><CalendarPlus size={17} /> Lưu lịch khám</Button></div></form></Modal>
}

function DutyModal({ form, onChange, onClose, onSubmit }) {
  return <Modal onClose={onClose} wide><form onSubmit={(event) => onSubmit(event, false)}><div className="admin-schedule-modal-head"><div><span><Stethoscope size={15} /> PHÂN CÔNG NHÂN SỰ</span><h2>Tạo lịch trực bác sĩ</h2><p>Thiết lập ca trực, phòng phụ trách và tự động mở slot nhận lịch khám.</p></div><button aria-label="Đóng form lịch trực" onClick={onClose} type="button"><X /></button></div><div className="admin-schedule-form-grid">
    <label><span>Bác sĩ</span><select value={form.doctor} onChange={(event) => onChange({ ...form, doctor: event.target.value })}>{doctors.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Chuyên khoa</span><select value={form.spec} onChange={(event) => onChange({ ...form, spec: event.target.value })}>{specialties.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Cơ sở</span><select value={form.clinic} onChange={(event) => onChange({ ...form, clinic: event.target.value })}>{clinics.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Phòng</span><select value={form.room} onChange={(event) => onChange({ ...form, room: event.target.value })}>{rooms.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Ngày trực</span><input type="date" value={form.date} onChange={(event) => onChange({ ...form, date: event.target.value })} /></label>
    <label><span>Ca trực</span><select value={form.shift} onChange={(event) => onChange({ ...form, shift: event.target.value })}><option>Ca sáng 08:00 - 12:00</option><option>Ca chiều 13:30 - 17:30</option><option>Ca tối 18:00 - 21:00</option><option>Tùy chỉnh giờ</option></select></label>
    {form.shift === 'Tùy chỉnh giờ' && <><label><span>Giờ bắt đầu</span><input type="time" value={form.customStart} onChange={(event) => onChange({ ...form, customStart: event.target.value })} required /></label><label><span>Giờ kết thúc</span><input type="time" value={form.customEnd} onChange={(event) => onChange({ ...form, customEnd: event.target.value })} required /></label></>}
    <label><span>Số lượng slot</span><input min="1" type="number" value={form.slots} onChange={(event) => onChange({ ...form, slots: event.target.value })} /></label>
    <label><span>Thời lượng mỗi ca</span><select value={form.duration} onChange={(event) => onChange({ ...form, duration: event.target.value })}><option>15 phút</option><option>30 phút</option><option>45 phút</option><option>60 phút</option></select></label>
    <label><span>Hình thức</span><select value={form.method} onChange={(event) => onChange({ ...form, method: event.target.value })}><option>Khám trực tiếp</option><option>Tư vấn online</option><option>Cả hai</option></select></label>
    <label><span>Lặp lại</span><select value={form.repeat} onChange={(event) => onChange({ ...form, repeat: event.target.value })}><option>Không lặp</option><option>Hằng ngày</option><option>Hằng tuần</option><option>Theo thứ trong tuần</option></select></label>
    <label className="is-wide"><span>Ghi chú nội bộ</span><textarea value={form.note} onChange={(event) => onChange({ ...form, note: event.target.value })} placeholder="Ghi chú cho điều phối viên" /></label>
  </div><div className="admin-schedule-form-note"><ShieldAlert size={17} /><span>Hệ thống kiểm tra trùng bác sĩ và phòng trước khi lưu. Ca đã có lịch khám sẽ không thể ghi đè.</span></div><div className="admin-schedule-modal-actions"><Button variant="outline" onClick={onClose} type="button">Hủy</Button><Button variant="outline" onClick={(event) => onSubmit(event, false)} type="button">Lưu lịch trực</Button><Button onClick={(event) => onSubmit(event, true)} type="button"><Plus size={17} /> Lưu và tạo slot khám</Button></div></form></Modal>
}

function AppointmentDrawer({ appointment, onClose, onStatus }) {
  return <div className="modal-backdrop admin-schedule-drawer-backdrop" onMouseDown={onClose}><aside className="admin-schedule-drawer" onMouseDown={(event) => event.stopPropagation()}><header><div><span className={`admin-schedule-status ${statusClass(appointment.status)}`}>{appointment.status}</span><h2>Chi tiết ca khám</h2><p>{appointment.id}</p></div><button aria-label="Đóng chi tiết ca khám" onClick={onClose} type="button"><X /></button></header><section><h3>Thông tin bệnh nhân</h3><div className="admin-schedule-detail-grid"><span><small>Họ tên</small><b>{appointment.patient}</b></span><span><small>Mã bệnh nhân</small><b>{appointment.patientId}</b></span><span><small>Số điện thoại</small><b>{appointment.phone}</b></span><span><small>Tuổi</small><b>{appointment.age}</b></span></div></section><section><h3>Thông tin ca khám</h3><div className="admin-schedule-detail-grid"><span><small>Ngày giờ</small><b>{appointment.date} · {appointment.time}</b></span><span><small>Bác sĩ</small><b>{appointment.doctor}</b></span><span><small>Chuyên khoa</small><b>{appointment.spec}</b></span><span><small>Phòng</small><b>{appointment.room}</b></span><span className="is-wide"><small>Cơ sở</small><b>{appointment.clinic}</b></span><span><small>Loại khám</small><b>{appointment.type}</b></span></div></section><section><h3>Thông tin y tế</h3><div className="admin-schedule-medical"><span><small>Lý do khám</small><p>{appointment.reason}</p></span><span><small>Triệu chứng</small><p>{appointment.symptoms}</p></span><span><small>Ghi chú</small><p>{appointment.note}</p></span></div></section><footer>{appointment.status === 'Chờ xác nhận' && <Button onClick={() => onStatus(appointment, 'Đã xác nhận')}><BadgeCheck size={17} /> Xác nhận lịch</Button>}<Button variant="outline"><History size={17} /> Dời lịch</Button><Button variant="outline"><MapPin size={17} /> Đổi phòng</Button><Button className="admin-schedule-danger" onClick={() => onStatus(appointment, 'Đã hủy')}><XCircle size={17} /> Hủy lịch</Button></footer></aside></div>
}
