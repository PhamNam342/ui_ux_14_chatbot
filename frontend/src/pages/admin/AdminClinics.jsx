import { createElement, useMemo, useState } from 'react'
import {
  Activity,
  BedDouble,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Download,
  Edit3,
  Filter,
  Mail,
  MapPin,
  PauseCircle,
  Phone,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
  Stethoscope,
  Users,
  X,
} from 'lucide-react'
import clinicImage from '../../assets/medical-ai-hero.png'
import { AppShell, Button, TopBar } from '../../components/ui.jsx'

const detailTabs = [
  ['overview', 'Tổng quan'],
  ['doctors', 'Bác sĩ'],
  ['rooms', 'Phòng khám'],
  ['reviews', 'Đánh giá'],
  ['activity', 'Lịch sử hoạt động'],
]

const initialClinics = [
  {
    id: 'PK-001',
    name: 'Phòng khám Đa khoa Tâm An',
    address: '12 Võ Văn Tần, Quận 3, TP.HCM',
    district: 'Quận 3',
    distance: '1.2 km',
    doctors: 18,
    rooms: 12,
    rating: 4.8,
    reviews: 1240,
    specialties: ['Nội tổng quát', 'Nhi khoa', 'Da liễu'],
    status: 'Đang hoạt động',
    openHours: '07:00 - 20:00',
    bookingsToday: 86,
    occupancy: 82,
    updated: '15 phút trước',
    updatedRank: 3,
    hotline: '028 3930 6688',
    email: 'taman@medconsult.vn',
    description: 'Cơ sở đa khoa trung tâm với đội ngũ bác sĩ giàu kinh nghiệm, quy trình khám nhanh và đầy đủ chuyên khoa thiết yếu.',
    imagePosition: '68% center',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'],
    doctorsList: [
      { initials: 'NM', name: 'BS. Nguyễn Văn Minh', specialty: 'Nội tổng quát', schedule: '08:00 - 12:00', status: 'Đang trực tuyến' },
      { initials: 'TH', name: 'BS. Trần Thị Hoa', specialty: 'Nhi khoa', schedule: '13:00 - 17:00', status: 'Ngoại tuyến' },
      { initials: 'NL', name: 'BS. Phạm Ngọc Lan', specialty: 'Da liễu', schedule: '08:30 - 16:30', status: 'Đang trực tuyến' },
    ],
    roomsList: [
      { name: 'Phòng 101', type: 'Khám tổng quát', status: 'Đang sử dụng', history: '12 lượt khám hôm nay' },
      { name: 'Phòng 204', type: 'Nhi khoa', status: 'Còn trống', history: '08 lượt khám hôm nay' },
      { name: 'Phòng 305', type: 'Da liễu', status: 'Đang vệ sinh', history: '06 lượt khám hôm nay' },
    ],
    reviewList: [
      { initials: 'MA', name: 'Minh Anh', time: '2 ngày trước', rating: 5, text: 'Không gian sạch sẽ, nhân viên hướng dẫn tận tình và thời gian chờ khá nhanh.' },
      { initials: 'QT', name: 'Quốc Tuấn', time: '5 ngày trước', rating: 4, text: 'Bác sĩ tư vấn kỹ. Khu vực tiếp nhận có tổ chức và dễ tìm.' },
    ],
    history: [
      { time: 'Hôm nay, 09:15', title: 'Cập nhật thông tin vận hành', detail: 'Admin điều chỉnh giờ mở cửa cuối tuần.' },
      { time: 'Hôm qua, 16:40', title: 'Thêm bác sĩ mới', detail: 'BS. Phạm Ngọc Lan được thêm vào chuyên khoa Da liễu.' },
      { time: '20/05/2026', title: 'Bảo trì thiết bị', detail: 'Hoàn tất kiểm tra định kỳ phòng 305.' },
    ],
  },
  {
    id: 'PK-002',
    name: 'Phòng khám Tim mạch An Bình',
    address: '81 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    district: 'Bình Thạnh',
    distance: '2.4 km',
    doctors: 11,
    rooms: 8,
    rating: 4.9,
    reviews: 860,
    specialties: ['Tim mạch', 'Nội tổng quát'],
    status: 'Đang hoạt động',
    openHours: '07:30 - 19:00',
    bookingsToday: 64,
    occupancy: 74,
    updated: '35 phút trước',
    updatedRank: 2,
    hotline: '028 3512 8899',
    email: 'anbinh@medconsult.vn',
    description: 'Phòng khám chuyên sâu tim mạch, nội khoa với hệ thống thiết bị chẩn đoán hiện đại và quy trình theo dõi liên tục.',
    imagePosition: '52% center',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1504813184591-015578574df5?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=600&q=80'],
    doctorsList: [
      { initials: 'BH', name: 'BS. Lê Bảo Huy', specialty: 'Tim mạch', schedule: '07:30 - 12:00', status: 'Đang trực tuyến' },
      { initials: 'HT', name: 'BS. Nguyễn Hoài Thương', specialty: 'Nội tổng quát', schedule: '13:00 - 18:30', status: 'Ngoại tuyến' },
    ],
    roomsList: [
      { name: 'Phòng TM-01', type: 'Điện tim', status: 'Đang sử dụng', history: '10 lượt khám hôm nay' },
      { name: 'Phòng SA-02', type: 'Siêu âm tim', status: 'Còn trống', history: '07 lượt khám hôm nay' },
    ],
    reviewList: [
      { initials: 'HL', name: 'Hà Linh', time: '1 ngày trước', rating: 5, text: 'Bác sĩ tim mạch rất tận tâm, giải thích kết quả rõ ràng và dễ hiểu.' },
      { initials: 'VN', name: 'Văn Nam', time: '1 tuần trước', rating: 5, text: 'Thiết bị tốt và quy trình nhanh. Tôi sẽ tiếp tục tái khám tại đây.' },
    ],
    history: [
      { time: 'Hôm nay, 08:30', title: 'Đồng bộ lịch khám', detail: '64 lịch hẹn được cập nhật từ hệ thống đặt lịch.' },
      { time: '25/05/2026', title: 'Thêm phòng chức năng', detail: 'Phòng siêu âm tim SA-02 được đưa vào vận hành.' },
    ],
  },
  {
    id: 'PK-003',
    name: 'MedCare Family Clinic',
    address: '44 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    district: 'Quận 1',
    distance: '3.1 km',
    doctors: 9,
    rooms: 6,
    rating: 4.6,
    reviews: 540,
    specialties: ['Nhi khoa', 'Gia đình', 'Dinh dưỡng'],
    status: 'Bảo trì nhẹ',
    openHours: '08:00 - 18:00',
    bookingsToday: 38,
    occupancy: 61,
    updated: '1 giờ trước',
    updatedRank: 1,
    hotline: '028 3822 5678',
    email: 'family@medconsult.vn',
    description: 'Phòng khám gia đình thân thiện, tập trung chăm sóc sức khỏe định kỳ, dinh dưỡng và nhi khoa.',
    imagePosition: '80% center',
    image: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80'],
    doctorsList: [
      { initials: 'QA', name: 'BS. Đỗ Quốc Anh', specialty: 'Y học gia đình', schedule: '08:00 - 16:00', status: 'Đang trực tuyến' },
      { initials: 'HL', name: 'BS. Vũ Hoàng Lan', specialty: 'Dinh dưỡng', schedule: '09:00 - 17:00', status: 'Ngoại tuyến' },
    ],
    roomsList: [
      { name: 'Phòng GD-01', type: 'Khám gia đình', status: 'Đang sử dụng', history: '09 lượt khám hôm nay' },
      { name: 'Phòng DD-02', type: 'Tư vấn dinh dưỡng', status: 'Bảo trì nhẹ', history: 'Bảo trì đến 14:00' },
    ],
    reviewList: [
      { initials: 'PT', name: 'Phương Thảo', time: '3 ngày trước', rating: 5, text: 'Phù hợp cho gia đình có trẻ nhỏ. Bác sĩ và điều dưỡng đều nhiệt tình.' },
      { initials: 'DK', name: 'Duy Khang', time: '2 tuần trước', rating: 4, text: 'Dịch vụ tốt, mong phòng khám sớm hoàn thiện khu vực đang bảo trì.' },
    ],
    history: [
      { time: 'Hôm nay, 07:45', title: 'Bảo trì nhẹ', detail: 'Phòng DD-02 tạm đóng để kiểm tra điều hòa.' },
      { time: '23/05/2026', title: 'Cập nhật chuyên khoa', detail: 'Bổ sung dịch vụ tư vấn dinh dưỡng gia đình.' },
    ],
  },
]

const emptyClinic = { name: '', address: '', district: 'Quận 1', phone: '', email: '', openHours: '07:00 - 20:00' }

function clinicStatusClass(status) {
  if (status === 'Đang hoạt động') return 'is-active'
  if (status === 'Bảo trì nhẹ') return 'is-maintenance'
  return 'is-paused'
}

function ClinicSkeleton() {
  return (
    <>
      <div className="admin-clinic-kpi-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="admin-clinic-kpi admin-clinic-skeleton" key={index} />
        ))}
      </div>
      <div className="admin-clinic-toolbar admin-clinic-toolbar-skeleton">
        <span className="admin-clinic-skeleton-line is-wide" />
        <span className="admin-clinic-skeleton-line" />
      </div>
      <div className="admin-clinic-management-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="admin-clinic-card-skeleton" key={index}>
            <span className="admin-clinic-skeleton-cover" />
            <span className="admin-clinic-skeleton-line is-title" />
            <span className="admin-clinic-skeleton-line is-wide" />
            <span className="admin-clinic-skeleton-line" />
          </div>
        ))}
      </div>
    </>
  )
}

function ClinicDetailDrawer({ clinic, tab, setTab, onClose }) {
  return (
    <div className="modal-backdrop admin-clinic-detail-backdrop" onClick={onClose}>
      <aside className="admin-clinic-detail-drawer" onClick={(event) => event.stopPropagation()}>
        <header className="admin-clinic-detail-head">
          <div>
            <span className={`admin-clinic-status ${clinicStatusClass(clinic.status)}`}>{clinic.status}</span>
            <h2>{clinic.name}</h2>
            <p><MapPin size={16} /> {clinic.address}</p>
          </div>
          <button aria-label="Đóng chi tiết phòng khám" className="admin-clinic-icon-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </header>

        <div className="admin-clinic-detail-tabs" role="tablist">
          {detailTabs.map(([key, label]) => (
            <button
              className={tab === key ? 'is-active' : ''}
              key={key}
              onClick={() => setTab(key)}
              role="tab"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="admin-clinic-detail-body">
          {tab === 'overview' && (
            <div className="admin-clinic-overview">
              <div className="admin-clinic-gallery">
                <img alt={`Không gian ${clinic.name}`} src={clinic.gallery?.[0] || clinicImage} />
                <img alt={`Khu vực tiếp nhận ${clinic.name}`} src={clinic.gallery?.[1] || clinicImage} />
                <img alt={`Phòng khám ${clinic.name}`} src={clinic.gallery?.[2] || clinicImage} />
              </div>
              <section className="admin-clinic-detail-section">
                <h3>Thông tin cơ sở</h3>
                <div className="admin-clinic-contact-grid">
                  <span><Phone size={17} /> {clinic.hotline}</span>
                  <span><Mail size={17} /> {clinic.email}</span>
                  <span><Clock3 size={17} /> {clinic.openHours}</span>
                  <span><MapPin size={17} /> Cách vị trí hiện tại {clinic.distance}</span>
                </div>
                <p>{clinic.description}</p>
              </section>
              <section className="admin-clinic-detail-section">
                <h3>Chuyên khoa đang phục vụ</h3>
                <div className="admin-clinic-tags">
                  {clinic.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
                </div>
              </section>
              <section className="admin-clinic-detail-section">
                <h3>Vận hành hôm nay</h3>
                <div className="admin-clinic-detail-stats">
                  <div><Users size={19} /><strong>{clinic.doctors}</strong><span>Bác sĩ</span></div>
                  <div><BedDouble size={19} /><strong>{clinic.rooms}</strong><span>Phòng khám</span></div>
                  <div><CalendarCheck2 size={19} /><strong>{clinic.bookingsToday}</strong><span>Lượt đặt lịch</span></div>
                  <div><Activity size={19} /><strong>{clinic.occupancy}%</strong><span>Lấp đầy phòng</span></div>
                </div>
              </section>
            </div>
          )}

          {tab === 'doctors' && (
            <section className="admin-clinic-detail-section">
              <h3>Đội ngũ bác sĩ</h3>
              <div className="admin-clinic-list">
                {clinic.doctorsList.map((doctor) => (
                  <article className="admin-clinic-list-card" key={doctor.name}>
                    <span className="admin-clinic-avatar">{doctor.initials}</span>
                    <div>
                      <h4>{doctor.name}</h4>
                      <p>{doctor.specialty} · {doctor.schedule}</p>
                    </div>
                    <span className={`admin-clinic-online ${doctor.status === 'Đang trực tuyến' ? 'is-online' : ''}`}>{doctor.status}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {tab === 'rooms' && (
            <section className="admin-clinic-detail-section">
              <h3>Danh sách phòng khám</h3>
              <div className="admin-clinic-list">
                {clinic.roomsList.map((room) => (
                  <article className="admin-clinic-list-card" key={room.name}>
                    <span className="admin-clinic-room-icon"><BedDouble size={20} /></span>
                    <div>
                      <h4>{room.name}</h4>
                      <p>{room.type} · {room.history}</p>
                    </div>
                    <span className={`admin-clinic-room-status ${room.status === 'Còn trống' ? 'is-free' : ''}`}>{room.status}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {tab === 'reviews' && (
            <div className="admin-clinic-review-layout">
              <section className="admin-clinic-detail-section admin-clinic-rating-summary">
                <div><strong>{clinic.rating}</strong><span>/ 5</span></div>
                <p><Star fill="currentColor" size={18} /> {clinic.reviews.toLocaleString('vi-VN')} lượt đánh giá</p>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div className="admin-clinic-rating-row" key={star}>
                    <span>{star} sao</span>
                    <i><b style={{ width: `${star === 5 ? 72 : star === 4 ? 20 : 4}%` }} /></i>
                  </div>
                ))}
              </section>
              <section className="admin-clinic-detail-section">
                <div className="admin-clinic-review-head">
                  <h3>Nhận xét gần đây</h3>
                  <select aria-label="Sắp xếp đánh giá">
                    <option>Mới nhất</option>
                    <option>Đánh giá cao nhất</option>
                  </select>
                </div>
                <div className="admin-clinic-list">
                  {clinic.reviewList.map((review) => (
                    <article className="admin-clinic-review-card" key={`${review.name}-${review.time}`}>
                      <span className="admin-clinic-avatar">{review.initials}</span>
                      <div>
                        <h4>{review.name} <small>{review.time}</small></h4>
                        <p className="admin-clinic-stars">{Array.from({ length: review.rating }, () => '★').join('')}</p>
                        <p>{review.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {tab === 'activity' && (
            <section className="admin-clinic-detail-section">
              <h3>Lịch sử hoạt động</h3>
              <div className="admin-clinic-activity-list">
                {clinic.history.map((item) => (
                  <article key={`${item.time}-${item.title}`}>
                    <span />
                    <div>
                      <small>{item.time}</small>
                      <h4>{item.title}</h4>
                      <p>{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}

export function AdminClinics() {
  const [clinicItems, setClinicItems] = useState(initialClinics)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tất cả trạng thái')
  const [specialty, setSpecialty] = useState('Tất cả chuyên khoa')
  const [district, setDistrict] = useState('Tất cả khu vực')
  const [sort, setSort] = useState('Mới cập nhật')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [detailTab, setDetailTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingClinicId, setEditingClinicId] = useState(null)
  const [toast, setToast] = useState('')
  const [newClinic, setNewClinic] = useState(emptyClinic)
  const [toggleConfirmClinic, setToggleConfirmClinic] = useState(null)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const filteredClinics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return clinicItems
      .filter((clinic) => !normalizedQuery || `${clinic.name} ${clinic.address}`.toLowerCase().includes(normalizedQuery))
      .filter((clinic) => status === 'Tất cả trạng thái' || clinic.status === status)
      .filter((clinic) => specialty === 'Tất cả chuyên khoa' || clinic.specialties.includes(specialty))
      .filter((clinic) => district === 'Tất cả khu vực' || clinic.district === district)
      .sort((first, second) => {
        if (sort === 'Đánh giá cao nhất') return second.rating - first.rating
        if (sort === 'Nhiều bác sĩ nhất') return second.doctors - first.doctors
        return second.updatedRank - first.updatedRank
      })
  }, [clinicItems, district, query, sort, specialty, status])

  const totals = useMemo(() => ({
    clinics: clinicItems.length,
    doctors: clinicItems.reduce((sum, clinic) => sum + clinic.doctors, 0),
    rooms: clinicItems.reduce((sum, clinic) => sum + clinic.rooms, 0),
    rating: (clinicItems.reduce((sum, clinic) => sum + clinic.rating, 0) / clinicItems.length).toFixed(1),
  }), [clinicItems])

  const kpis = [
    { icon: Building2, label: 'Tổng phòng khám', value: totals.clinics, trend: '+2 trong tháng này', tone: 'teal' },
    { icon: Users, label: 'Tổng bác sĩ', value: totals.doctors, trend: '+6 bác sĩ mới', tone: 'blue' },
    { icon: BedDouble, label: 'Tổng phòng', value: totals.rooms, trend: '92% đang hoạt động', tone: 'violet' },
    { icon: Star, label: 'Đánh giá trung bình', value: totals.rating, trend: '+0.2 so với tháng trước', tone: 'amber' },
  ]

  const resetFilters = () => {
    setQuery('')
    setStatus('Tất cả trạng thái')
    setSpecialty('Tất cả chuyên khoa')
    setDistrict('Tất cả khu vực')
    setSort('Mới cập nhật')
  }

  const syncData = () => {
    setIsLoading(true)
    notify('Đang đồng bộ dữ liệu phòng khám...')
    window.setTimeout(() => {
      setIsLoading(false)
      notify('Đồng bộ dữ liệu thành công')
    }, 950)
  }

  const openClinicDetail = (clinic) => {
    setSelectedClinic(clinic)
    setDetailTab('overview')
  }

  const toggleClinic = (clinic) => {
    setToggleConfirmClinic(clinic)
  }

  const handleToggleClinic = () => {
    if (!toggleConfirmClinic) return
    const clinic = toggleConfirmClinic
    const nextStatus = clinic.status === 'Tạm ngưng' ? 'Đang hoạt động' : 'Tạm ngưng'
    setClinicItems((items) => items.map((item) => item.id === clinic.id ? { ...item, status: nextStatus } : item))
    setToggleConfirmClinic(null)
    notify(`${clinic.name}: ${nextStatus}`)
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setEditingClinicId(null)
    setNewClinic(emptyClinic)
  }

  const openAddClinic = () => {
    setEditingClinicId(null)
    setNewClinic(emptyClinic)
    setShowAddModal(true)
  }

  const openEditClinic = (clinic) => {
    setEditingClinicId(clinic.id)
    setNewClinic({
      name: clinic.name,
      address: clinic.address,
      district: clinic.district,
      phone: clinic.hotline === 'Chưa cập nhật' ? '' : clinic.hotline,
      email: clinic.email === 'Chưa cập nhật' ? '' : clinic.email,
      openHours: clinic.openHours,
    })
    setShowAddModal(true)
  }

  const saveClinic = (event) => {
    event.preventDefault()
    if (!newClinic.name.trim() || !newClinic.address.trim()) {
      notify('Vui lòng nhập tên và địa chỉ phòng khám')
      return
    }
    if (editingClinicId) {
      setClinicItems((items) => items.map((item) => item.id === editingClinicId ? {
        ...item,
        name: newClinic.name.trim(),
        address: newClinic.address.trim(),
        district: newClinic.district,
        hotline: newClinic.phone || 'Chưa cập nhật',
        email: newClinic.email || 'Chưa cập nhật',
        openHours: newClinic.openHours,
        updated: 'Vừa cập nhật',
        updatedRank: Date.now(),
      } : item))
      closeAddModal()
      notify('Đã cập nhật thông tin phòng khám')
      return
    }
    const nextNumber = Math.max(0, ...clinicItems.map((clinic) => Number(clinic.id.replace('PK-', '')) || 0)) + 1
    const id = `PK-${String(nextNumber).padStart(3, '0')}`
    setClinicItems((items) => [...items, {
      ...initialClinics[2],
      id,
      name: newClinic.name.trim(),
      address: newClinic.address.trim(),
      district: newClinic.district,
      hotline: newClinic.phone || 'Chưa cập nhật',
      email: newClinic.email || 'Chưa cập nhật',
      openHours: newClinic.openHours,
      doctors: 0,
      rooms: 0,
      reviews: 0,
      rating: 5,
      bookingsToday: 0,
      occupancy: 0,
      specialties: ['Đang cập nhật'],
      status: 'Tạm ngưng',
      updated: 'Vừa tạo',
      updatedRank: clinicItems.length + 1,
    }])
    closeAddModal()
    notify('Đã thêm phòng khám mới')
  }

  return (
    <AppShell role="admin">
      <TopBar />
      <main className="content-wide admin-clinic-page">
        <section className="admin-clinic-page-head">
          <div>
            <p className="admin-clinic-breadcrumb">Admin <span>/</span> Quản lý phòng khám</p>
            <h1>Quản lý phòng khám</h1>
            <p>Theo dõi cơ sở, hiệu suất vận hành và các tác vụ quản trị tại một nơi.</p>
          </div>
          <div className="admin-clinic-head-actions">
            <button className="admin-soft-btn" onClick={() => notify('Báo cáo đang được chuẩn bị để tải xuống')} type="button">
              <Download size={18} /> Xuất báo cáo
            </button>
            <button className="admin-soft-btn" disabled={isLoading} onClick={syncData} type="button">
              <RefreshCw className={isLoading ? 'is-spinning' : ''} size={18} /> {isLoading ? 'Đang đồng bộ' : 'Đồng bộ dữ liệu'}
            </button>
            <button className="admin-primary-btn" onClick={openAddClinic} type="button">
              <Plus size={19} /> Thêm phòng khám
            </button>
          </div>
        </section>

        {isLoading ? <ClinicSkeleton /> : (
          <>
            <section className="admin-clinic-kpi-grid">
              {kpis.map(({ icon: Icon, label, value, trend, tone }) => (
                <article className={`admin-clinic-kpi is-${tone}`} key={label}>
                  <span className="admin-clinic-kpi-icon">{createElement(Icon, { size: 20 })}</span>
                  <p>{label}</p>
                  <strong>{value}</strong>
                  <small><Activity size={14} /> {trend}</small>
                </article>
              ))}
            </section>

            <section className={`admin-clinic-toolbar ${filtersOpen ? 'is-open' : ''}`}>
              <div className="admin-clinic-toolbar-head">
                <button className="admin-mobile-filter-toggle" onClick={() => setFiltersOpen((open) => !open)} type="button">
                  <Filter size={17} /> {filtersOpen ? 'Thu gọn' : 'Mở bộ lọc'}
                </button>
              </div>
              <div className="admin-clinic-toolbar-grid">
                <label className="admin-filter-control admin-filter-search">
                  <div><Search size={18} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Tên hoặc địa chỉ phòng khám" value={query} /></div>
                </label>
                <label className="admin-filter-control">
                  <select onChange={(event) => setStatus(event.target.value)} value={status}>
                    <option>Tất cả trạng thái</option>
                    <option>Đang hoạt động</option>
                    <option>Bảo trì nhẹ</option>
                    <option>Tạm ngưng</option>
                  </select>
                </label>
                <label className="admin-filter-control">
                  <select onChange={(event) => setSpecialty(event.target.value)} value={specialty}>
                    <option>Tất cả chuyên khoa</option>
                    <option>Nội tổng quát</option>
                    <option>Tim mạch</option>
                    <option>Nhi khoa</option>
                    <option>Da liễu</option>
                    <option>Dinh dưỡng</option>
                  </select>
                </label>
                <label className="admin-filter-control">
                  <select onChange={(event) => setDistrict(event.target.value)} value={district}>
                    <option>Tất cả khu vực</option>
                    <option>Quận 1</option>
                    <option>Quận 3</option>
                    <option>Bình Thạnh</option>
                  </select>
                </label>
                <label className="admin-filter-control">
                  <select onChange={(event) => setSort(event.target.value)} value={sort}>
                    <option>Mới cập nhật</option>
                    <option>Đánh giá cao nhất</option>
                    <option>Nhiều bác sĩ nhất</option>
                  </select>
                </label>
                <button className="admin-reset-filter-btn" onClick={resetFilters} type="button">Reset bộ lọc</button>
              </div>
            </section>

            {filteredClinics.length > 0 ? (
              <section className="admin-clinic-management-grid">
                {filteredClinics.map((clinic) => (
                  <article className="admin-clinic-management-card" key={clinic.id}>
                    <div className="admin-clinic-cover">
                      <img alt={clinic.name} src={clinic.image || clinicImage} />
                      <span className={`admin-clinic-status ${clinicStatusClass(clinic.status)}`}>{clinic.status}</span>
                      <span className="admin-clinic-id">{clinic.id}</span>
                    </div>
                    <div className="admin-clinic-card-body">
                      <div className="admin-clinic-card-title">
                        <h2>{clinic.name}</h2>
                        <span><Star fill="currentColor" size={16} /> {clinic.rating} <small>({clinic.reviews.toLocaleString('vi-VN')})</small></span>
                      </div>
                      <p className="admin-clinic-card-address"><MapPin size={15} /> <span>{clinic.address}</span></p>
                      <div className="admin-clinic-mini-stats">
                        <div><Users size={17} /><strong>{clinic.doctors}</strong><span>Bác sĩ</span></div>
                        <div><BedDouble size={17} /><strong>{clinic.rooms}</strong><span>Phòng</span></div>
                        <div><CalendarCheck2 size={17} /><strong>{clinic.bookingsToday}</strong><span>Lịch hôm nay</span></div>
                      </div>
                      <div className="admin-clinic-tags">
                        {clinic.specialties.map((item) => <span key={item}>{item}</span>)}
                      </div>
                      <div className="admin-clinic-operations">
                        <p><Clock3 size={16} /><span>Giờ mở cửa</span><strong>{clinic.openHours}</strong></p>
                        <div>
                          <p><Activity size={16} /><span>Tỷ lệ lấp đầy phòng</span><strong>{clinic.occupancy}%</strong></p>
                          <i><b style={{ width: `${clinic.occupancy}%` }} /></i>
                        </div>
                      </div>
                      <div className="admin-clinic-card-actions">
                        <button className="is-primary" onClick={() => openClinicDetail(clinic)} type="button">Xem chi tiết</button>
                        <button onClick={() => openEditClinic(clinic)} type="button"><Edit3 size={15} /> Chỉnh sửa</button>
                        <button className={clinic.status === 'Tạm ngưng' ? 'is-activate' : 'is-pause'} onClick={() => toggleClinic(clinic)} type="button">
                          {clinic.status === 'Tạm ngưng' ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
                          {clinic.status === 'Tạm ngưng' ? 'Kích hoạt' : 'Tạm ngưng'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ) : (
              <section className="admin-clinic-empty">
                <span><Building2 size={42} /></span>
                <h2>Chưa có phòng khám nào</h2>
                <p>Thử thay đổi bộ lọc hoặc tạo cơ sở đầu tiên để bắt đầu quản lý.</p>
                <button className="admin-primary-btn" onClick={openAddClinic} type="button"><Plus size={18} /> Thêm phòng khám đầu tiên</button>
              </section>
            )}
          </>
        )}
      </main>

      {selectedClinic && (
        <ClinicDetailDrawer clinic={selectedClinic} onClose={() => setSelectedClinic(null)} setTab={setDetailTab} tab={detailTab} />
      )}

      {showAddModal && (
        <div className="modal-backdrop" onClick={closeAddModal}>
          <div className="modal admin-clinic-add-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-clinic-add-head">
              <div>
                <span>{editingClinicId ? 'Cập nhật cơ sở' : 'Thiết lập cơ sở mới'}</span>
                <h3>{editingClinicId ? 'Chỉnh sửa phòng khám' : 'Thêm phòng khám'}</h3>
                <p>{editingClinicId ? 'Điều chỉnh thông tin vận hành và liên hệ của cơ sở.' : 'Nhập thông tin cơ bản. Bạn có thể bổ sung bác sĩ và phòng khám sau.'}</p>
              </div>
              <button aria-label="Đóng form thêm phòng khám" className="admin-clinic-icon-btn" onClick={closeAddModal} type="button"><X size={19} /></button>
            </div>
            <form onSubmit={saveClinic}>
              <div className="admin-clinic-add-grid">
                <label><span>Tên phòng khám *</span><input onChange={(event) => setNewClinic({ ...newClinic, name: event.target.value })} placeholder="VD: Phòng khám Đa khoa..." required value={newClinic.name} /></label>
                <label><span>Khu vực *</span><select onChange={(event) => setNewClinic({ ...newClinic, district: event.target.value })} value={newClinic.district}><option>Quận 1</option><option>Quận 3</option><option>Bình Thạnh</option><option>Thủ Đức</option></select></label>
                <label className="admin-clinic-add-wide"><span>Địa chỉ *</span><input onChange={(event) => setNewClinic({ ...newClinic, address: event.target.value })} placeholder="Số nhà, đường, quận/huyện" required value={newClinic.address} /></label>
                <label><span>Số điện thoại</span><input onChange={(event) => setNewClinic({ ...newClinic, phone: event.target.value })} placeholder="028..." value={newClinic.phone} /></label>
                <label><span>Email</span><input onChange={(event) => setNewClinic({ ...newClinic, email: event.target.value })} placeholder="clinic@medconsult.vn" type="email" value={newClinic.email} /></label>
                <label className="admin-clinic-add-wide"><span>Giờ mở cửa</span><select onChange={(event) => setNewClinic({ ...newClinic, openHours: event.target.value })} value={newClinic.openHours}><option>07:00 - 20:00</option><option>07:30 - 19:00</option><option>08:00 - 18:00</option><option>Hoạt động 24/7</option></select></label>
              </div>
              <div className="modal-actions">
                <Button onClick={closeAddModal} type="button" variant="secondary">Hủy</Button>
                <Button type="submit">{editingClinicId ? <Edit3 size={17} /> : <Plus size={17} />} {editingClinicId ? 'Lưu thay đổi' : 'Thêm phòng khám'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toggleConfirmClinic && (
        <div className="modal-backdrop" onMouseDown={() => setToggleConfirmClinic(null)}>
          <div className="modal admin-doctor-delete-modal p-6 text-center" onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
            <div className="admin-doctor-delete-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><PauseCircle size={26} /></div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px' }}>
              {toggleConfirmClinic.status === 'Tạm ngưng' ? 'Kích hoạt phòng khám?' : 'Tạm ngưng phòng khám?'}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của <b>{toggleConfirmClinic.name}</b> không?
            </p>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="outline" onClick={() => setToggleConfirmClinic(null)}>Hủy</Button>
              <Button onClick={handleToggleClinic}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}
