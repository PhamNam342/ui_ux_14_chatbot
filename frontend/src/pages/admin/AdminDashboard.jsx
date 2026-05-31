import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  BriefcaseMedical,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  Filter,
  History,
  LayoutGrid,
  List,
  PauseCircle,
  Plus,
  RefreshCw,
  Search,
  Star,
  Stethoscope,
  UserRoundCheck,
  Users,
  X,
} from 'lucide-react'
import { AppShell, Button, TopBar } from '../../components/ui.jsx'
import { adminClinics, adminDoctors, adminSpecialties, adminStatuses } from './adminDoctorsData.js'

const emptyDoctor = {
  name: '',
  email: '',
  phone: '',
  cccd: '',
  spec: 'Nội tổng quát',
  clinic: 'Phòng khám Đa khoa Tâm An',
  status: 'Đang làm việc',
  experience: '5',
}

const deletedDoctorsKey = 'medconsult-admin-deleted-doctors'

function getAvailableDoctors() {
  try {
    const deletedDoctorIds = JSON.parse(window.localStorage.getItem(deletedDoctorsKey) || '[]')

    return adminDoctors.filter((doctor) => !deletedDoctorIds.includes(doctor.id))
  } catch {
    return adminDoctors
  }
}

function statusClass(status) {
  return `is-${status.toLowerCase().replaceAll(' ', '-')}`
}

export function AdminDashboard() {
  const [doctorList, setDoctorList] = useState(getAvailableDoctors)
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState(adminSpecialties[0])
  const [clinic, setClinic] = useState(adminClinics[0])
  const [status, setStatus] = useState(adminStatuses[0])
  const [sort, setSort] = useState('Mới cập nhật')
  const [view, setView] = useState('table')
  const [showAdd, setShowAdd] = useState(false)
  const [editingDoctorId, setEditingDoctorId] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [newDoctor, setNewDoctor] = useState(emptyDoctor)
  const [toast, setToast] = useState('')
  const [syncing, setSyncing] = useState(false)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2500)
  }

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const result = doctorList.filter((doctor) => {
      const matchesQuery = !normalizedQuery
        || [doctor.name, doctor.email, doctor.phone, doctor.cccd].some((value) => value?.toLowerCase().includes(normalizedQuery))
      const matchesSpecialty = specialty === adminSpecialties[0] || doctor.spec === specialty
      const matchesClinic = clinic === adminClinics[0] || doctor.clinic === clinic
      const matchesStatus = status === adminStatuses[0] || doctor.status === status
      return matchesQuery && matchesSpecialty && matchesClinic && matchesStatus
    })

    return [...result].sort((a, b) => {
      if (sort === 'Tên A-Z') return a.name.localeCompare(b.name, 'vi')
      if (sort === 'Nhiều lịch khám nhất') return b.today - a.today
      if (sort === 'Đánh giá cao nhất') return b.rating - a.rating
      return b.updatedRank - a.updatedRank
    })
  }, [clinic, doctorList, query, sort, specialty, status])

  const specialtiesCount = new Set(doctorList.map((doctor) => doctor.spec)).size
  const todaySchedules = doctorList.reduce((total, doctor) => total + doctor.today, 0)
  const workingDoctors = doctorList.filter((doctor) => ['Đang làm việc', 'Đang khám'].includes(doctor.status)).length

  const resetFilters = () => {
    setQuery('')
    setSpecialty(adminSpecialties[0])
    setClinic(adminClinics[0])
    setStatus(adminStatuses[0])
    setSort('Mới cập nhật')
  }

  const syncDoctors = () => {
    setSyncing(true)
    window.setTimeout(() => {
      setSyncing(false)
      notify('Đã đồng bộ dữ liệu bác sĩ')
    }, 700)
  }

  const closeDoctorModal = () => {
    setShowAdd(false)
    setEditingDoctorId(null)
    setNewDoctor(emptyDoctor)
  }

  const openAddDoctor = () => {
    setEditingDoctorId(null)
    setNewDoctor(emptyDoctor)
    setShowAdd(true)
  }

  const openEditDoctor = (doctor) => {
    setEditingDoctorId(doctor.id)
    setNewDoctor({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      cccd: doctor.cccd,
      spec: doctor.spec,
      clinic: doctor.clinic,
      status: doctor.status,
      experience: doctor.experience,
    })
    setShowAdd(true)
  }

  const saveDoctor = (event) => {
    event.preventDefault()
    if (editingDoctorId) {
      setDoctorList((current) => current.map((doctor) => doctor.id === editingDoctorId ? {
        ...doctor,
        ...newDoctor,
        initials: newDoctor.name.split(' ').slice(-2).map((word) => word[0]).join('').toUpperCase(),
        updated: 'Vừa cập nhật',
        updatedRank: Date.now(),
      } : doctor))
      closeDoctorModal()
      notify('Đã cập nhật hồ sơ bác sĩ')
      return
    }
    const nextId = `D-${String(doctorList.length + 1).padStart(3, '0')}`
    const initials = newDoctor.name.split(' ').slice(-2).map((word) => word[0]).join('').toUpperCase()
    setDoctorList((current) => [{
      ...newDoctor,
      id: nextId,
      initials,
      color: 'mint',
      clinicRoom: 'Chưa phân phòng',
      rating: 5,
      reviews: 0,
      today: 0,
      consultations: 0,
      satisfaction: 100,
      monthCases: 0,
      skills: [newDoctor.spec],
      updated: 'Vừa cập nhật',
      updatedRank: Date.now(),
    }, ...current])
    closeDoctorModal()
    notify('Đã thêm bác sĩ mới')
  }

  const toggleSuspend = (doctor) => {
    const nextStatus = doctor.status === 'Tạm ngưng' ? 'Đang làm việc' : 'Tạm ngưng'
    setDoctorList((current) => current.map((item) => item.id === doctor.id ? { ...item, status: nextStatus } : item))
    notify(nextStatus === 'Tạm ngưng' ? 'Đã tạm ngưng tài khoản bác sĩ' : 'Đã kích hoạt lại tài khoản')
  }

  return (
    <AppShell role="admin">
      <TopBar title="Quản trị hệ thống" subtitle="Nhân sự y tế" />
      <main className="content-wide admin-clinic-page admin-doctor-page">
        <section className="admin-clinic-page-head">
          <div>
            <p className="admin-clinic-breadcrumb">Admin <span>/</span> Quản lý bác sĩ</p>
            {/* <span className="admin-clinic-eyebrow"><Stethoscope size={15} /> NHÂN SỰ Y TẾ</span> */}
            <h1>Quản lý bác sĩ</h1>
            <p>Theo dõi hồ sơ chuyên môn, lịch làm việc và phân công phòng khám.</p>
          </div>
          <div className="admin-clinic-head-actions">
            <Button variant="outline" onClick={() => notify('Đã xuất danh sách bác sĩ')}><Download size={17} /> Xuất danh sách</Button>
            <Button variant="outline" onClick={syncDoctors}><RefreshCw className={syncing ? 'is-spinning' : ''} size={17} /> Đồng bộ dữ liệu</Button>
            <Button onClick={openAddDoctor}><Plus size={18} /> Thêm bác sĩ mới</Button>
          </div>
        </section>

        <section className="admin-clinic-kpi-grid">
          <article className="admin-clinic-kpi is-teal">
            <span className="admin-clinic-kpi-icon"><Users /></span>
            <p>Tổng bác sĩ</p><strong>{doctorList.length}</strong><small><CheckCircle2 size={14} /> +4 bác sĩ mới</small>
          </article>
          <article className="admin-clinic-kpi is-blue">
            <span className="admin-clinic-kpi-icon"><UserRoundCheck /></span>
            <p>Đang làm việc</p><strong>{workingDoctors}</strong><small><Activity size={14} /> 92% đang hoạt động</small>
          </article>
          <article className="admin-clinic-kpi is-violet">
            <span className="admin-clinic-kpi-icon"><BriefcaseMedical /></span>
            <p>Chuyên khoa</p><strong>{specialtiesCount}</strong><small><Stethoscope size={14} /> 8 chuyên khoa</small>
          </article>
          <article className="admin-clinic-kpi is-amber">
            <span className="admin-clinic-kpi-icon"><CalendarCheck2 /></span>
            <p>Lịch khám hôm nay</p><strong>{todaySchedules}</strong><small><History size={14} /> 26 ca hôm nay</small>
          </article>
        </section>

        <section className={`admin-doctor-toolbar ${filtersOpen ? 'is-open' : ''}`}>
          <div className="admin-doctor-toolbar-head">
            <label className="admin-doctor-search">
              <Search size={19} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, số CCCD, số điện thoại..." />
            </label>
            <button className="admin-doctor-filter-toggle" type="button" onClick={() => setFiltersOpen((value) => !value)}><Filter size={18} /> Bộ lọc</button>
          </div>
          <div className="admin-doctor-filter-row">
            <select aria-label="Lọc chuyên khoa" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
              {adminSpecialties.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Lọc phòng khám" value={clinic} onChange={(event) => setClinic(event.target.value)}>
              {adminClinics.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Lọc trạng thái" value={status} onChange={(event) => setStatus(event.target.value)}>
              {adminStatuses.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Sắp xếp bác sĩ" value={sort} onChange={(event) => setSort(event.target.value)}>
              {['Mới cập nhật', 'Tên A-Z', 'Nhiều lịch khám nhất', 'Đánh giá cao nhất'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <button className="admin-doctor-reset" type="button" onClick={resetFilters}><X size={16} /> Reset bộ lọc</button>
          </div>
        </section>

        <section className="admin-doctor-result-head">
          <div><h2>Danh sách bác sĩ</h2><p>{filteredDoctors.length} hồ sơ phù hợp với bộ lọc hiện tại.</p></div>
          <div className="admin-doctor-view-toggle">
            <button className={view === 'table' ? 'is-active' : ''} type="button" onClick={() => setView('table')}><List size={17} /> Dạng bảng</button>
            <button className={view === 'card' ? 'is-active' : ''} type="button" onClick={() => setView('card')}><LayoutGrid size={17} /> Dạng card</button>
          </div>
        </section>

        {filteredDoctors.length === 0 ? (
          <section className="admin-doctor-empty"><Stethoscope size={42} /><h3>Không tìm thấy bác sĩ</h3><p>Thử điều chỉnh bộ lọc hoặc thêm hồ sơ bác sĩ mới.</p><Button onClick={openAddDoctor}><Plus size={18} /> Thêm bác sĩ mới</Button></section>
        ) : view === 'table' ? (
          <section className="admin-doctor-table-wrap">
            <table>
              <thead><tr><th>Bác sĩ</th><th>Chuyên khoa</th><th>Phòng khám</th><th>Lịch hôm nay</th><th>Đánh giá</th><th>Trạng thái</th><th>Cập nhật</th><th>Thao tác</th></tr></thead>
              <tbody>{filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td><div className="admin-doctor-person"><span className={`admin-doctor-avatar is-${doctor.color}`}>{doctor.initials}</span><span><b>BS. {doctor.name}</b><small>{doctor.email}<br />{doctor.phone}</small></span></div></td>
                  <td><span className="admin-doctor-spec">{doctor.spec}</span></td>
                  <td><b>{doctor.clinic}</b><small>{doctor.clinicRoom}</small></td>
                  <td><b>{doctor.today} ca</b><small>Lịch đã xác nhận</small></td>
                  <td><span className="admin-doctor-rating"><Star size={15} /> {doctor.rating}</span><small>{doctor.reviews} đánh giá</small></td>
                  <td><span className={`admin-doctor-status ${statusClass(doctor.status)}`}>{doctor.status}</span></td>
                  <td><small>{doctor.updated}</small></td>
                  <td><div className="admin-doctor-row-actions">
                    <Link aria-label={`Xem chi tiết ${doctor.name}`} to={`/admin/doctors/${doctor.id}`}><Eye size={17} /></Link>
                    <button aria-label={`Chỉnh sửa ${doctor.name}`} type="button" onClick={() => openEditDoctor(doctor)}><Edit3 size={17} /></button>
                    <button aria-label={`Phân lịch ${doctor.name}`} type="button" onClick={() => notify(`Đã mở lịch BS. ${doctor.name}`)}><CalendarCheck2 size={17} /></button>
                    <button aria-label={`${doctor.status === 'Tạm ngưng' ? 'Kích hoạt' : 'Tạm ngưng'} ${doctor.name}`} type="button" onClick={() => toggleSuspend(doctor)}><PauseCircle size={17} /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </section>
        ) : (
          <section className="admin-doctor-card-grid">{filteredDoctors.map((doctor) => (
            <article className="admin-doctor-card" key={doctor.id}>
              <div className="admin-doctor-card-top">
                <span className={`admin-doctor-avatar is-large is-${doctor.color}`}>{doctor.initials}</span>
                <span className={`admin-doctor-status ${statusClass(doctor.status)}`}>{doctor.status}</span>
              </div>
              <h3>BS. {doctor.name}</h3><p className="admin-doctor-card-spec">{doctor.spec}</p>
              <p className="admin-doctor-card-clinic"><Building2 size={16} /> {doctor.clinic}</p>
              <div className="admin-doctor-card-metrics">
                <span><b>{doctor.experience}</b><small>Năm kinh nghiệm</small></span>
                <span><b><Star size={14} /> {doctor.rating}</b><small>{doctor.reviews} đánh giá</small></span>
                <span><b>{doctor.today}</b><small>Ca hôm nay</small></span>
              </div>
              <div className="admin-doctor-skill-list">{doctor.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <div className="admin-doctor-card-actions">
                <Link className="btn btn-primary" to={`/admin/doctors/${doctor.id}`}><Eye size={17} /> Xem hồ sơ</Link>
                <button className="btn btn-outline" type="button" onClick={() => notify(`Đã mở lịch BS. ${doctor.name}`)}><CalendarCheck2 size={17} /> Phân lịch</button>
                <button className="admin-doctor-card-edit" aria-label={`Chỉnh sửa ${doctor.name}`} type="button" onClick={() => openEditDoctor(doctor)}><Edit3 size={17} /></button>
              </div>
            </article>
          ))}</section>
        )}
      </main>

      {showAdd && <div className="modal-backdrop" onMouseDown={closeDoctorModal}>
        <form className="modal admin-doctor-add-modal" onSubmit={saveDoctor} onMouseDown={(event) => event.stopPropagation()}>
          <div className="modal-head"><div><span className="admin-clinic-eyebrow">{editingDoctorId ? <Edit3 size={14} /> : <Plus size={14} />} {editingDoctorId ? 'CẬP NHẬT HỒ SƠ' : 'HỒ SƠ MỚI'}</span><h2>{editingDoctorId ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}</h2><p>{editingDoctorId ? 'Cập nhật thông tin nhân sự, chuyên khoa và phân công phòng khám.' : 'Khởi tạo hồ sơ nhân sự và phân công phòng khám ban đầu.'}</p></div><button type="button" onClick={closeDoctorModal}>×</button></div>
          <div className="admin-doctor-form-grid">
            <label><span>Họ tên bác sĩ *</span><input required value={newDoctor.name} onChange={(event) => setNewDoctor({ ...newDoctor, name: event.target.value })} placeholder="Nguyễn Văn Minh" /></label>
            <label><span>Email *</span><input required type="email" value={newDoctor.email} onChange={(event) => setNewDoctor({ ...newDoctor, email: event.target.value })} placeholder="doctor@medconsult.vn" /></label>
            <label><span>Số điện thoại *</span><input required value={newDoctor.phone} onChange={(event) => setNewDoctor({ ...newDoctor, phone: event.target.value })} placeholder="0908 123 456" /></label>
            <label><span>Số CCCD *</span><input required value={newDoctor.cccd} onChange={(event) => setNewDoctor({ ...newDoctor, cccd: event.target.value })} placeholder="001086123456" /></label>
            <label><span>Chuyên khoa</span><select value={newDoctor.spec} onChange={(event) => setNewDoctor({ ...newDoctor, spec: event.target.value })}>{adminSpecialties.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Phòng khám</span><select value={newDoctor.clinic} onChange={(event) => setNewDoctor({ ...newDoctor, clinic: event.target.value })}>{adminClinics.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Trạng thái</span><select value={newDoctor.status} onChange={(event) => setNewDoctor({ ...newDoctor, status: event.target.value })}>{adminStatuses.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Số năm kinh nghiệm</span><input min="0" type="number" value={newDoctor.experience} onChange={(event) => setNewDoctor({ ...newDoctor, experience: event.target.value })} /></label>
          </div>
          <div className="modal-actions"><Button variant="outline" type="button" onClick={closeDoctorModal}>Hủy</Button><Button type="submit">{editingDoctorId ? <Edit3 size={17} /> : <Plus size={17} />} {editingDoctorId ? 'Lưu thay đổi' : 'Thêm bác sĩ'}</Button></div>
        </form>
      </div>}
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </AppShell>
  )
}
