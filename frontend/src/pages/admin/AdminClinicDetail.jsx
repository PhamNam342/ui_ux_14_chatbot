import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, Pencil, Phone, Save, Stethoscope, Users } from 'lucide-react'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { clinicRooms } from '../../data/mock.js'

function findClinic(id) {
  return clinicRooms.find((item) => item.id === id) || clinicRooms[0]
}

export function AdminClinicDetail() {
  const { id } = useParams()
  const clinic = findClinic(id)

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <Link to="/admin" className="inline-flex mb-5"><Button variant="ghost"><ArrowLeft size={16} /> Quay lại</Button></Link>
        <PageHeader
          title={clinic.name}
          subtitle="Thông tin chi tiết phòng khám và nhân sự phụ trách"
          action={<Link to={`/admin/clinics/${clinic.id}/edit`}><Button variant="outline"><Pencil size={16} /> Chỉnh sửa</Button></Link>}
        />

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card>
            <div className="clinic-detail-card">
              <span><Building2 size={34} /></span>
              <h2>{clinic.name}</h2>
              <p>{clinic.specialty}</p>
              <Badge tone="green">Đang hoạt động</Badge>
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Thông tin phòng khám</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info icon={<Building2 size={18} />} label="Mã phòng khám" value={clinic.id} />
              <Info icon={<Stethoscope size={18} />} label="Chuyên khoa" value={clinic.specialty} />
              <Info icon={<Phone size={18} />} label="Số điện thoại" value={clinic.phone} />
              <Info icon={<Users size={18} />} label="Số bác sĩ" value={`${clinic.doctors} bác sĩ`} />
              <Info wide icon={<MapPin size={18} />} label="Địa chỉ" value={clinic.address} />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

export function AdminClinicForm({ mode = 'create' }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const clinic = mode === 'edit' ? findClinic(id) : null
  const isEdit = mode === 'edit'

  function submitForm(event) {
    event.preventDefault()
    navigate('/admin')
  }

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <Link to="/admin" className="inline-flex mb-5"><Button variant="ghost"><ArrowLeft size={16} /> Quay lại</Button></Link>
        <PageHeader
          title={isEdit ? 'Chỉnh sửa phòng khám' : 'Thêm phòng khám mới'}
          subtitle={isEdit ? 'Cập nhật thông tin điều phối phòng khám' : 'Tạo hồ sơ phòng khám mới trong hệ thống'}
        />

        <Card>
          <form className="clinic-form" onSubmit={submitForm}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Mã phòng khám</span>
                <input className="input" defaultValue={clinic?.id || 'PK-05'} />
              </label>
              <label>
                <span className="field-label">Tên phòng khám</span>
                <input className="input" defaultValue={clinic?.name || ''} placeholder="Nhập tên phòng khám" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Chuyên khoa</span>
                <select className="input" defaultValue={clinic?.specialty || 'Nội tổng quát'}>
                  <option>Nội tổng quát</option>
                  <option>Nhi khoa</option>
                  <option>Sản phụ khoa</option>
                  <option>Da liễu</option>
                </select>
              </label>
              <label>
                <span className="field-label">Số điện thoại</span>
                <input className="input" defaultValue={clinic?.phone || ''} placeholder="028 3824 5555" />
              </label>
            </div>
            <label>
              <span className="field-label">Địa chỉ</span>
              <input className="input" defaultValue={clinic?.address || ''} placeholder="Nhập địa chỉ phòng khám" />
            </label>
            <label>
              <span className="field-label">Số bác sĩ phụ trách</span>
              <input className="input" type="number" min="0" defaultValue={clinic?.doctors || 0} />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <Link to="/admin"><Button type="button" variant="ghost">Hủy</Button></Link>
              <Button type="submit"><Save size={16} /> {isEdit ? 'Lưu thay đổi' : 'Tạo phòng khám'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  )
}

function Info({ icon, label, value, wide = false }) {
  return (
    <div className={`info-box clinic-info ${wide ? 'sm:col-span-2' : ''}`}>
      <small>{icon}{label}</small>
      <b>{value}</b>
    </div>
  )
}
