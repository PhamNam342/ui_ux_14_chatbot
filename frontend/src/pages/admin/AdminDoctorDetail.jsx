import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { doctors } from '../../data/mock.js'

export function AdminDoctorDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toast, setToast] = useState('')
  const doctor = useMemo(() => doctors.find((item) => item.id === id) || doctors[0], [id])

  function handleDelete() {
    setConfirmOpen(false)
    setToast('Đã xoá bác sĩ')
    window.setTimeout(() => navigate('/admin/doctors'), 900)
  }

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <Link to="/admin/doctors" className="inline-flex mb-5"><Button variant="ghost">Quay lại</Button></Link>
        <PageHeader
          title="Chi tiết bác sĩ"
          subtitle="Hồ sơ chuyên môn, lịch làm việc và thông tin nhân sự"
          action={
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setEditOpen(true)}><Pencil size={16} /> Sửa thông tin</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}><Trash2 size={16} /> Xoá bác sĩ</Button>
            </div>
          }
        />
        <div className="grid gap-7 lg:grid-cols-[360px_1fr]">
          <Card><div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-teal-100 text-3xl font-black text-teal-700">{doctor.initials}</div><h2 className="mt-5 text-2xl font-black">{doctor.name}</h2><p className="text-slate-500">{doctor.spec}</p><Badge tone="green">Đang làm việc</Badge></div></Card>
          <Card>
            <h2 className="section-title">Thông tin bác sĩ</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoBox label="Ngày tháng năm sinh" value={doctor.dob} />
              <InfoBox label="Quê quán" value={doctor.hometown} />
              <InfoBox label="Số CCCD" value={doctor.identity} />
              <InfoBox label="Chuyên khoa" value={doctor.spec} />
              <InfoBox label="Số điện thoại" value={doctor.phone} />
              <InfoBox label="Phòng khám" value={doctor.room} />
            </div>
          </Card>
        </div>
      </div>
      {editOpen && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Sửa thông tin bác sĩ</h2>
            <div className="mt-6 grid gap-4">
              <input className="input" defaultValue={doctor.name} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" defaultValue={doctor.dob} />
                <input className="input" defaultValue={doctor.identity} />
              </div>
              <input className="input" defaultValue={doctor.hometown} />
              <input className="input" defaultValue={doctor.spec} />
            </div>
            <div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={() => setEditOpen(false)}>Hủy</Button><Button onClick={() => setEditOpen(false)}>Lưu thay đổi</Button></div>
          </Card>
        </div>
      )}
      {confirmOpen && (
        <div className="modal-backdrop">
          <Card className="modal confirm-modal">
            <h2 className="text-2xl font-black">Xác nhận xoá bác sĩ</h2>
            <p className="mt-3 text-slate-500">Bạn chắc chắn muốn xoá hồ sơ của {doctor.name}? Thao tác này cần xác nhận trước khi thực hiện.</p>
            <div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={() => setConfirmOpen(false)}>Hủy</Button><Button variant="danger" onClick={handleDelete}>Xoá</Button></div>
          </Card>
        </div>
      )}
      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}

function InfoBox({ label, value }) {
  return <div className="info-box"><small>{label}</small>{value}</div>
}
