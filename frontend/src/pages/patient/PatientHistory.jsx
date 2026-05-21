import { useState } from 'react'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { patientHistory } from '../../data/mock.js'

export function PatientHistory() {
  const [type, setType] = useState('Tất cả')
  const [selected, setSelected] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const items = patientHistory.filter((item) => type === 'Tất cả' || item.type === type)

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Lịch sử khám bệnh" subtitle="Chọn từng lần khám để xem chi tiết, sau đó mới đánh giá và nhập nhận xét." />
        <div className="segmented mb-7">
          <button className={type === 'Tất cả' ? 'active' : ''} onClick={() => setType('Tất cả')}>Tất cả</button>
          <button className={type === 'Tư vấn trực tuyến' ? 'active' : ''} onClick={() => setType('Tư vấn trực tuyến')}>Tư vấn trực tuyến</button>
          <button className={type === 'Khám bệnh' ? 'active' : ''} onClick={() => setType('Khám bệnh')}>Khám bệnh</button>
        </div>
        <div className="space-y-5">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="section-title">{item.type}</h2>
                  <p className="mt-2 text-slate-500">{item.date} · {item.doctor}</p>
                  <p className="mt-3 text-sm text-slate-500">{item.summary}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="green">{item.id}</Badge>
                  <Button variant="ghost" onClick={() => setSelected(item)}>Xem chi tiết</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop">
          <Card className="modal">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{selected.type}</h2>
                <p className="mt-2 text-slate-500">{selected.date} · {selected.doctor} · {selected.clinic}</p>
              </div>
              <Badge tone="green">{selected.id}</Badge>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info label="Chẩn đoán" value={selected.diagnosis} />
              <Info label="Phương thuốc" value={selected.prescription} />
              <Info label="Lời nhắn / nhắc nhở" value={selected.reminders} />
              <Info label="Kết luận bác sĩ" value={selected.note} />
            </div>
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-700">Đánh giá sau khám</p>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className={`rating-star ${star <= rating ? 'active' : ''}`} onClick={() => setRating(star)}>★</button>
                ))}
              </div>
              <textarea className="input mt-4 min-h-28" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Nhập đánh giá của bạn sau buổi khám..." />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelected(null)}>Đóng</Button>
              <Button onClick={() => setSelected(null)}>Lưu đánh giá</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}

function Info({ label, value }) {
  return <div className="rounded-lg bg-slate-50 p-4"><small className="block text-xs font-bold uppercase text-slate-400">{label}</small><p className="mt-2 text-sm font-semibold text-slate-700">{value}</p></div>
}
