import { useState } from 'react'
import { CalendarDays, CalendarPlus, CheckCircle2, List } from 'lucide-react'
import { AppShell, Badge, Button, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { scheduleRows } from '../../data/mock.js'

const clinics = ['Tất cả phòng khám', 'Phòng khám Đa khoa Tâm An', 'Phòng khám Tim mạch An Bình', 'MedCare Family Clinic']

function statusTone(status) {
  if (status === 'Đang tiến hành') return 'blue'
  if (status === 'Hủy') return 'red'
  return 'yellow'
}

function statusClass(status) {
  if (status === 'Đang tiến hành') return 'status-card status-blue'
  if (status === 'Hủy') return 'status-card status-red'
  return 'status-card status-yellow'
}

export function AdminSchedule({ showModal = false }) {
  const [open, setOpen] = useState(showModal)
  const [clinic, setClinic] = useState('Tất cả phòng khám')
  const [spec, setSpec] = useState('Tất cả chuyên khoa')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'calendar'
  
  // Add modal state
  const [addFacility, setAddFacility] = useState('Phòng khám Đa khoa Tâm An')
  const [toast, setToast] = useState('')

  const roomsMap = {
    'Phòng khám Đa khoa Tâm An': ['Phòng 102', 'Phòng 103', 'Phòng 108'],
    'Phòng khám Tim mạch An Bình': ['Phòng 201', 'Phòng 205'],
    'MedCare Family Clinic': ['Phòng 301', 'Phòng 305'],
  }
  const addRooms = roomsMap[addFacility] || []

  const rows = scheduleRows.map((row, index) => ({ ...row, clinic: clinics[(index % 3) + 1] }))
  const filteredRows = rows.filter((row) => {
    if (clinic !== 'Tất cả phòng khám' && row.clinic !== clinic) return false
    return true
  })
  const columns = [
    { key: 'time', label: 'Thời gian', render: (r) => `${r.time} - ${r.endTime}` },
    { key: 'doctor', label: 'Bác sĩ' },
    { key: 'clinic', label: 'Phòng khám' },
    { key: 'room', label: 'Phòng' },
    { key: 'patient', label: 'Bệnh nhân' },
    { key: 'status', label: 'Trạng thái', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
    { key: 'action', label: 'Thao tác', render: () => <button className="mini-btn">Sửa</button> },
  ]
  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader 
          title="Quản lí ca khám" 
          subtitle="Sắp xếp lịch khám và điều phối phòng theo từng phòng khám" 
          action={
            <div className="flex gap-3 items-center">
              <div className="segmented">
                <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}><List size={16} className="inline mr-1"/> Bảng</button>
                <button className={viewMode === 'calendar' ? 'active' : ''} onClick={() => setViewMode('calendar')}><CalendarDays size={16} className="inline mr-1"/> Lịch</button>
              </div>
              <Button onClick={() => setOpen(true)}><CalendarPlus size={18} /> Thêm lịch khám</Button>
            </div>
          } 
        />
        <Card className="mb-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Cơ sở / Phòng khám</span>
              <select className="input" value={clinic} onChange={(event) => setClinic(event.target.value)}>
                {clinics.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Chuyên khoa</span>
              <select className="input" value={spec} onChange={(event) => setSpec(event.target.value)}>
                <option>Tất cả chuyên khoa</option>
                <option>Nội tổng quát</option>
                <option>Tim mạch</option>
                <option>Nhi khoa</option>
              </select>
            </label>
          </div>
        </Card>
        <div className="grid gap-5 md:grid-cols-3"><Stat label="Ca hôm nay" value="142" /><Stat label="Đã xác nhận" value="96" /><Stat label="Đang chờ" value="18" /></div>
        
        {viewMode === 'calendar' ? (
          <Card className="mt-7">
            <h2 className="section-title">Lịch khám trong ngày</h2>
            <div className="admin-calendar">
              {filteredRows.map((item) => (
                <div className={statusClass(item.status)} key={`${item.time}-${item.patient}`}>
                  <time>{item.time}</time>
                  <div>
                    <b>{item.patient}</b>
                    <p>{item.doctor} · {item.clinic} · {item.room}</p>
                    <small>Kết thúc lúc {item.endTime}</small>
                  </div>
                  <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="mt-7"><DataTable columns={columns} rows={filteredRows} /></div>
        )}
      </div>
      {open && (
        <div className="modal-backdrop">
          <Card className="modal max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black">Thêm lịch khám mới</h2>
            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="field-label">Cơ sở / Bệnh viện</span>
                <select className="input" value={addFacility} onChange={e => setAddFacility(e.target.value)}>
                  {clinics.slice(1).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Phòng khám</span>
                  <select className="input">
                    {addRooms.map(r => <option key={r}>{r}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="field-label">Bác sĩ phụ trách</span>
                  <select className="input">
                    <option>BS. Nguyễn Văn Minh</option>
                    <option>BS. Trần Thị Hoa</option>
                    <option>BS. Lê Quốc An</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="field-label">Tên bệnh nhân</span>
                <input className="input" placeholder="Tên bệnh nhân" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Ngày khám</span>
                  <input className="input" type="date" />
                </label>
                <label className="block">
                  <span className="field-label">Giờ bắt đầu</span>
                  <input className="input" type="time" />
                </label>
              </div>

              <label className="block">
                <span className="field-label">Ghi chú thêm</span>
                <textarea className="input min-h-[80px]" placeholder="Ghi chú về tình trạng, lịch sử bệnh..." />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>Hủy</Button>
              <Button onClick={() => {
                setToast('Đã thêm lịch khám thành công')
                window.setTimeout(() => setToast(''), 2200)
                setOpen(false)
              }}>Lưu lịch</Button>
            </div>
          </Card>
        </div>
      )}
      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}

function Stat({ label, value }) {
  return <Card><p className="text-sm text-slate-500">{label}</p><strong className="mt-2 block text-3xl font-black">{value}</strong></Card>
}
