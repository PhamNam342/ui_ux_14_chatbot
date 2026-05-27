import { useMemo, useState } from 'react'
import { Building2, MapPin, Plus, Star, Stethoscope, Users } from 'lucide-react'
import { AppShell, Badge, Button, Card, DataTable, PageHeader, SearchBar, StatCard, TopBar } from '../../components/ui.jsx'

const clinics = [
  {
    id: 'PK-001',
    name: 'Phòng khám Đa khoa Tâm An',
    address: '12 Võ Văn Tần, Quận 3, TP.HCM',
    doctors: 18,
    rooms: 12,
    rating: 4.8,
    reviews: 1240,
    specialties: ['Nội tổng quát', 'Nhi khoa', 'Da liễu'],
    status: 'Đang hoạt động',
  },
  {
    id: 'PK-002',
    name: 'Phòng khám Tim mạch An Bình',
    address: '81 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    doctors: 11,
    rooms: 8,
    rating: 4.9,
    reviews: 860,
    specialties: ['Tim mạch', 'Nội tổng quát'],
    status: 'Đang hoạt động',
  },
  {
    id: 'PK-003',
    name: 'MedCare Family Clinic',
    address: '44 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    doctors: 9,
    rooms: 6,
    rating: 4.6,
    reviews: 540,
    specialties: ['Nhi khoa', 'Gia đình', 'Dinh dưỡng'],
    status: 'Bảo trì nhẹ',
  },
]

export function AdminClinics() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tất cả trạng thái')

  const filteredClinics = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return clinics.filter((clinic) => {
      const matchesQuery = !normalized || clinic.name.toLowerCase().includes(normalized) || clinic.address.toLowerCase().includes(normalized)
      const matchesStatus = status === 'Tất cả trạng thái' || clinic.status === status
      return matchesQuery && matchesStatus
    })
  }, [query, status])

  const totalDoctors = clinics.reduce((sum, clinic) => sum + clinic.doctors, 0)
  const totalRooms = clinics.reduce((sum, clinic) => sum + clinic.rooms, 0)
  const avgRating = (clinics.reduce((sum, clinic) => sum + clinic.rating, 0) / clinics.length).toFixed(1)

  const columns = [
    { key: 'name', label: 'Phòng khám', render: (row) => <div><b>{row.name}</b><p className="mt-1 text-sm text-slate-500">{row.id}</p></div> },
    { key: 'address', label: 'Địa chỉ' },
    { key: 'doctors', label: 'Số bác sĩ', render: (row) => `${row.doctors} bác sĩ` },
    { key: 'rooms', label: 'Phòng khám', render: (row) => `${row.rooms} phòng` },
    { key: 'rating', label: 'Đánh giá', render: (row) => <span className="star-rating"><Star size={15} fill="currentColor" /> {row.rating} ({row.reviews})</span> },
    { key: 'status', label: 'Trạng thái', render: (row) => <Badge tone={row.status === 'Đang hoạt động' ? 'green' : 'yellow'}>{row.status}</Badge> },
  ]

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Quản lý các phòng khám"
          subtitle="Theo dõi thông tin vận hành, địa chỉ, bác sĩ và đánh giá của từng phòng khám."
          action={<Button><Plus size={18} /> Thêm phòng khám</Button>}
        />

        <div className="grid gap-5 lg:grid-cols-4">
          <StatCard label="Tổng phòng khám" value={clinics.length} icon={<Building2 size={20} />} />
          <StatCard label="Tổng bác sĩ" value={totalDoctors} tone="blue" icon={<Users size={20} />} />
          <StatCard label="Tổng phòng" value={totalRooms} tone="amber" icon={<Stethoscope size={20} />} />
          <StatCard label="Đánh giá TB" value={avgRating} tone="violet" icon={<Star size={20} />} />
        </div>

        <Card className="mt-7">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div>
              <label className="field-label">Tìm kiếm</label>
              <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên phòng khám hoặc địa chỉ..." />
            </div>
            <div>
              <label className="field-label">Trạng thái</label>
              <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>Tất cả trạng thái</option>
                <option>Đang hoạt động</option>
                <option>Bảo trì nhẹ</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="clinic-grid mt-7">
          {filteredClinics.map((clinic) => (
            <Card className="clinic-admin-card" key={clinic.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2>{clinic.name}</h2>
                  <p><MapPin size={15} /> {clinic.address}</p>
                </div>
                <Badge tone={clinic.status === 'Đang hoạt động' ? 'green' : 'yellow'}>{clinic.status}</Badge>
              </div>
              <div className="clinic-admin-metrics">
                <span><Users size={16} /> <b>{clinic.doctors}</b><small>bác sĩ</small></span>
                <span><Building2 size={16} /> <b>{clinic.rooms}</b><small>phòng</small></span>
                <span><Star size={16} fill="currentColor" /> <b>{clinic.rating}</b><small>{clinic.reviews} đánh giá</small></span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {clinic.specialties.map((item) => <Badge key={item}>{item}</Badge>)}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-7">
          <DataTable columns={columns} rows={filteredClinics} footer={false} />
        </div>
      </div>
    </AppShell>
  )
}
