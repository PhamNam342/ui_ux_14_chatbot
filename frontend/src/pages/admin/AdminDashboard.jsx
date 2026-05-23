import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Plus } from 'lucide-react'
import { AppShell, Avatar, Badge, Button, Card, DataTable, PageHeader, SearchBar, StatCard, TopBar } from '../../components/ui.jsx'
import { doctors as initialDoctors } from '../../data/mock.js'

const specialties = ['Tất cả chuyên khoa', 'Nội tổng quát', 'Tim mạch', 'Nhi khoa', 'Răng Hàm Mặt', 'Chỉnh hình']
const clinics = ['Tất cả phòng khám', 'Phòng khám Đa khoa Tâm An', 'Phòng khám Tim mạch An Bình', 'MedCare Family Clinic']

export function AdminDashboard() {
  const [doctors, setDoctors] = useState(initialDoctors)
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('Tất cả chuyên khoa')
  const [clinic, setClinic] = useState('Tất cả phòng khám')
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return doctors.filter((doctor) => {
      const matchesQuery =
        !normalizedQuery ||
        doctor.name.toLowerCase().includes(normalizedQuery) ||
        doctor.id.toLowerCase().includes(normalizedQuery) ||
        doctor.cccd.includes(normalizedQuery)
      const matchesSpecialty = specialty === 'Tất cả chuyên khoa' || doctor.spec === specialty
      const doctorClinic = doctor.clinic || clinics[(Number(doctor.id.split('-')[1]) % 3) + 1]
      const matchesClinic = clinic === 'Tất cả phòng khám' || doctorClinic === clinic
      return matchesQuery && matchesSpecialty && matchesClinic
    })
  }, [doctors, query, clinic, specialty])

  function saveDoctor(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name') || 'Bác sĩ mới'
    const spec = form.get('spec') || 'Tim mạch'
    const initials = String(name).split(' ').slice(-2).map((part) => part[0]).join('').toUpperCase()
    setDoctors((current) => [
      ...current,
      {
        id: `D-${String(current.length + 1).padStart(3, '0')}`,
        name,
        dob: form.get('dob') || '1990-01-01',
        hometown: form.get('hometown') || 'TP.HCM',
        cccd: form.get('identity') || '000000000000',
        spec,
        clinic: form.get('clinic') || 'Phòng khám Đa khoa Tâm An',
        room: form.get('room') || 'Phòng 102',
        phone: form.get('phone') || '0900 000 000',
        initials,
        color: 'mint',
      },
    ])
    setOpen(false)
    setToast('Thêm bác sĩ thành công')
    window.setTimeout(() => setToast(''), 2600)
  }

  const columns = [
    { key: 'name', label: 'Tên bác sĩ', render: (row) => <div className="flex items-center gap-3"><Avatar tone={row.color}>{row.initials}</Avatar><b>{row.name}</b></div> },
    { key: 'dob', label: 'Ngày sinh', render: (row) => row.dob.split('-').reverse().join('/') },
    { key: 'hometown', label: 'Quê quán' },
    { key: 'cccd', label: 'Số CCCD' },
    { key: 'spec', label: 'Chuyên khoa', render: (row) => <Badge>{row.spec}</Badge> },
    { key: 'clinic', label: 'Phòng khám', render: (row) => row.clinic || clinics[(Number(row.id.split('-')[1]) % 3) + 1] },
    { key: 'action', label: 'Thao tác', render: (row) => <Link to={`/admin/doctors/${row.id}`} className="mini-btn">Chi tiết</Link> },
  ]

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Danh sách bác sĩ"
          subtitle="Quản lý và điều chỉnh thông tin nhân sự y tế theo từng phòng khám"
          action={<Button onClick={() => setOpen(true)}><Plus size={18} /> Thêm bác sĩ mới</Button>}
        />
        <Card className="mb-7">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div><label className="field-label">Tìm kiếm</label><SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên bác sĩ hoặc số CCCD..." /></div>
            <div><label className="field-label">Chuyên khoa</label><select className="input" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>{specialties.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div><label className="field-label">Phòng khám</label><select className="input" value={clinic} onChange={(event) => setClinic(event.target.value)}>{clinics.map((item) => <option key={item}>{item}</option>)}</select></div>
          </div>
        </Card>
        <DataTable columns={columns} rows={filteredDoctors} footer={false} />
        <div className="table-footer"><span>Hiển thị {filteredDoctors.length} trong tổng số {doctors.length} bác sĩ</span></div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <StatCard label="Tổng bác sĩ" value={doctors.length} icon={<CheckCircle2 size={20} />} />
          <StatCard label="Đang làm việc" value="18" tone="blue" icon={<CheckCircle2 size={20} />} />
          <StatCard label="Lịch hôm nay" value="142" tone="violet" icon={<CheckCircle2 size={20} />} />
        </div>
      </div>

      {open && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Thêm bác sĩ mới</h2>
            <form className="mt-6 grid gap-4" onSubmit={saveDoctor}>
              <input className="input" name="name" placeholder="Họ và tên bác sĩ" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" name="dob" type="date" required />
                <input className="input" name="identity" placeholder="Số căn cước" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" name="hometown" placeholder="Quê quán" required />
                <input className="input" name="phone" placeholder="Số điện thoại" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <select className="input" name="spec">{specialties.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
                <select className="input" name="clinic">{clinics.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
              </div>
              <div className="mt-2 flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit">Lưu bác sĩ</Button></div>
            </form>
          </Card>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}
