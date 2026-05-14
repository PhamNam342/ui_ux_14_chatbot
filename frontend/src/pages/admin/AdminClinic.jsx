import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Pencil, Plus } from 'lucide-react'
import { AppShell, Badge, Button, Card, DataTable, PageHeader, SearchBar, TopBar } from '../../components/ui.jsx'
import { clinicRooms } from '../../data/mock.js'

const specialties = ['Tất cả chuyên khoa', 'Nội tổng quát', 'Nhi khoa', 'Sản phụ khoa', 'Da liễu']

export function AdminClinic() {
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('Tất cả chuyên khoa')
  const [room, setRoom] = useState('Tất cả phòng khám')

  const rooms = useMemo(() => ['Tất cả phòng khám', ...clinicRooms.map((item) => item.name)], [])
  const filteredRooms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return clinicRooms.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.address.toLowerCase().includes(normalizedQuery)
      const matchesSpecialty = specialty === 'Tất cả chuyên khoa' || item.specialty === specialty
      const matchesRoom = room === 'Tất cả phòng khám' || item.name === room
      return matchesQuery && matchesSpecialty && matchesRoom
    })
  }, [query, room, specialty])

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <b>{row.id}</b> },
    { key: 'name', label: 'Tên phòng khám ↑↓', render: (row) => <b>{row.name}</b> },
    { key: 'address', label: 'Địa chỉ ↑↓' },
    { key: 'phone', label: 'Số điện thoại ↑↓' },
    { key: 'doctors', label: 'Bác sĩ', render: (row) => <Badge tone="blue">{row.doctors} Bác sĩ</Badge> },
    {
      key: 'action',
      label: 'Hành động',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/clinics/${row.id}`} className="mini-btn teal"><Eye size={14} /> Chi tiết</Link>
          <Link to={`/admin/clinics/${row.id}/edit`} className="mini-btn filled"><Pencil size={14} /> Chỉnh sửa</Link>
        </div>
      ),
    },
  ]

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Danh sách phòng khám"
          subtitle="Quản lý và điều phối các phòng khám trong hệ thống"
          action={<Link to="/admin/clinics/new"><Button><Plus size={18} /> Thêm mới</Button></Link>}
        />

        <Card className="mb-7 soft-panel">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
            <div>
              <label className="field-label">Tìm kiếm</label>
              <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên phòng khám, địa chỉ..." />
            </div>
            <div>
              <label className="field-label">Chuyên khoa</label>
              <select className="input" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
                {specialties.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Phòng khám</label>
              <select className="input" value={room} onChange={(event) => setRoom(event.target.value)}>
                {rooms.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>
        </Card>

        <div className="clinic-table-wrap">
          <DataTable columns={columns} rows={filteredRooms} footer={false} />
        </div>
        <div className="table-footer">
          <span>Hiển thị 1 - {filteredRooms.length} của 24 phòng khám</span>
          <div className="pagination"><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div>
        </div>
      </div>
    </AppShell>
  )
}
