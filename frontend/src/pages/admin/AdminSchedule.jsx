import { useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { AppShell, Badge, Button, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { scheduleRows } from '../../data/mock.js'

export function AdminSchedule({ showModal = false }) {
  const [open, setOpen] = useState(showModal)
  const columns = [
    { key: 'time', label: 'Thời gian' },
    { key: 'doctor', label: 'Bác sĩ' },
    { key: 'room', label: 'Phòng' },
    { key: 'patient', label: 'Bệnh nhân' },
    { key: 'status', label: 'Trạng thái', render: (r) => <Badge tone={r.status === 'Đang khám' ? 'blue' : 'green'}>{r.status}</Badge> },
    { key: 'action', label: 'Thao tác', render: () => <button className="mini-btn">Sửa</button> },
  ]
  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Quản lí ca khám" subtitle="Sắp xếp lịch khám và điều phối phòng trong ngày" action={<Button onClick={() => setOpen(true)}><CalendarPlus size={18} /> Thêm lịch khám</Button>} />
        <div className="grid gap-5 md:grid-cols-3"><Stat label="Ca hôm nay" value="142" /><Stat label="Đã xác nhận" value="96" /><Stat label="Đang chờ" value="18" /></div>
        <Card className="mt-7">
          <h2 className="section-title">Lịch khám trong ngày</h2>
          <div className="admin-calendar">
            {scheduleRows.map((item) => (
              <div className="admin-calendar-event" key={`${item.time}-${item.patient}`}>
                <time>{item.time}</time>
                <div><b>{item.patient}</b><p>{item.doctor} · {item.room}</p></div>
                <Badge tone={item.status === 'Đang khám' ? 'blue' : 'green'}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <div className="mt-7"><DataTable columns={columns} rows={scheduleRows} /></div>
      </div>
      {open && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Thêm lịch khám mới</h2>
            <div className="mt-6 grid gap-4">
              <input className="input" placeholder="Tên bệnh nhân" />
              <select className="input"><option>BS. Nguyễn Văn Minh</option><option>BS. Trần Thị Hoa</option><option>BS. Tim Mạch - Lê Quốc An</option></select>
              <div className="grid gap-4 sm:grid-cols-2"><input className="input" type="date" /><input className="input" type="time" /></div>
              <select className="input"><option>Phòng 102</option><option>Phòng 201</option><option>Online</option></select>
              <textarea className="input min-h-28" placeholder="Ghi chú" />
            </div>
            <div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={() => setOpen(false)}>Hủy</Button><Button onClick={() => setOpen(false)}>Lưu lịch</Button></div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}

function Stat({ label, value }) {
  return <Card><p className="text-sm text-slate-500">{label}</p><strong className="mt-2 block text-3xl font-black">{value}</strong></Card>
}
