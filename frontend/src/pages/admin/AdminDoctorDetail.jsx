import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, PencilLine, Trash2 } from 'lucide-react'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { doctors } from '../../data/mock.js'

export function AdminDoctorDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const doctor = useMemo(() => doctors.find((item) => item.id === id) || doctors[0], [id])
  const [form, setForm] = useState({
    name: doctor.name,
    dob: doctor.dob,
    hometown: doctor.hometown,
    cccd: doctor.cccd,
    spec: doctor.spec,
    phone: doctor.phone,
    room: doctor.room,
  })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast] = useState('')

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function saveProfile() {
    setToast('Đã cập nhật thông tin bác sĩ')
    window.setTimeout(() => setToast(''), 2200)
  }

  function deleteDoctor() {
    setConfirmDelete(false)
    setToast('Đã xoá bác sĩ khỏi danh sách')
    window.setTimeout(() => {
      navigate('/admin/doctors')
    }, 900)
  }

  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <div className="mb-5">
          <button className="mini-btn inline-flex items-center gap-2" onClick={() => navigate('/admin/doctors')}>
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>

        <PageHeader title="Chi tiết bác sĩ" subtitle="Cập nhật hồ sơ chuyên môn và quản lý nhân sự y tế." />

        <div className="grid gap-7 xl:grid-cols-[340px_1fr]">
          <Card className="text-center">
            <div className="mx-auto flex w-full max-w-[220px] flex-col items-center">
              <div className="grid h-36 w-36 place-items-center rounded-full bg-teal-100 text-5xl font-black text-teal-700">
                {doctor.initials}
              </div>
              <h2 className="mt-5 text-3xl font-black">{form.name}</h2>
              <p className="mt-2 text-slate-500">{form.spec}</p>
              <Badge tone="green">Đang làm việc</Badge>
            </div>
            <div className="mt-8 grid gap-4 text-left">
              <div className="info-box">
                <small>Phòng khám</small>
                <b>{form.room}</b>
              </div>
              <div className="info-box">
                <small>Số điện thoại</small>
                <b>{form.phone}</b>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="section-title">Sửa thông tin bác sĩ</h2>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={saveProfile}><PencilLine size={16} /> Lưu chỉnh sửa</Button>
                <Button variant="dark" className="bg-rose-500" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Xoá bác sĩ</Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Họ tên</span>
                <input className="input" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
              </label>
              <label className="block">
                <span className="field-label">Ngày sinh</span>
                <input className="input" type="date" value={form.dob} onChange={(event) => updateField('dob', event.target.value)} />
              </label>
              <label className="block">
                <span className="field-label">Quê quán</span>
                <input className="input" value={form.hometown} onChange={(event) => updateField('hometown', event.target.value)} />
              </label>
              <label className="block">
                <span className="field-label">Số CCCD</span>
                <input className="input" value={form.cccd} onChange={(event) => updateField('cccd', event.target.value)} />
              </label>
              <label className="block">
                <span className="field-label">Chuyên khoa</span>
                <input className="input" value={form.spec} onChange={(event) => updateField('spec', event.target.value)} />
              </label>
              <label className="block">
                <span className="field-label">Số điện thoại</span>
                <input className="input" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                <span className="field-label">Phòng khám</span>
                <input className="input" value={form.room} onChange={(event) => updateField('room', event.target.value)} />
              </label>
            </div>
          </Card>
        </div>
      </div>

      {confirmDelete && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Xác nhận xoá bác sĩ</h2>
            <p className="mt-3 text-slate-500">Bạn có chắc muốn xoá bác sĩ này khỏi hệ thống? Thao tác này chỉ là mô phỏng trên giao diện frontend.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Huỷ</Button>
              <Button className="bg-rose-500 hover:bg-rose-600" onClick={deleteDoctor}>Xoá bác sĩ</Button>
            </div>
          </Card>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}
