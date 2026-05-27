import { useMemo, useState } from 'react'
import { Eye, Star } from 'lucide-react'
import { AppShell, Button, Card, DataTable, PageHeader, SearchBar, TopBar } from '../../components/ui.jsx'

const histories = [
  {
    id: 'CA250501-001',
    patient: 'Trần Thị Mai',
    date: '18/05/2026',
    time: '10:00',
    clinic: 'MedConsult Online',
    diagnosis: 'Viêm họng cấp',
    prescription: 'Paracetamol 500mg, siro ho thảo dược',
    rating: 5,
    note: 'Sốt 38.5°C, ho khan, đau họng. Theo dõi thêm 3 ngày.',
    comment: 'Bác sĩ tư vấn rõ ràng, sau 2 ngày dùng thuốc triệu chứng giảm nhiều.',
  },
  {
    id: 'CA250421-014',
    patient: 'Lê Văn Hùng',
    date: '21/04/2026',
    time: '14:30',
    clinic: 'Phòng khám Tim mạch An Bình',
    diagnosis: 'Theo dõi tim mạch',
    prescription: 'Aspirin 81mg, kiểm tra huyết áp hằng ngày',
    rating: 4,
    note: 'Đau ngực nhẹ khi vận động, hẹn tái khám sau 2 tuần.',
    comment: 'Thời gian chờ hơi lâu nhưng phần giải thích bệnh rất chi tiết.',
  },
  {
    id: 'CA250403-008',
    patient: 'Nguyễn Thị Lan',
    date: '03/04/2026',
    time: '09:15',
    clinic: 'Phòng khám Đa khoa Tâm An',
    diagnosis: 'Viêm dạ dày',
    prescription: 'Omeprazole 20mg, điều chỉnh chế độ ăn',
    rating: 5,
    note: 'Đau thượng vị, ợ chua sau ăn.',
    comment: 'Đơn thuốc dễ hiểu, bác sĩ nhắc kỹ các món cần tránh.',
  },
]

export function DoctorHistory() {
  const [patient, setPatient] = useState('')
  const [time, setTime] = useState('Tất cả thời gian')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const normalized = patient.trim().toLowerCase()
    return histories.filter((item) => {
      const matchesPatient = !normalized || item.patient.toLowerCase().includes(normalized)
      const matchesTime = time === 'Tất cả thời gian' || item.date.endsWith(time)
      return matchesPatient && matchesTime
    })
  }, [patient, time])

  const columns = [
    { key: 'id', label: 'Mã ca' },
    { key: 'patient', label: 'Tên bệnh nhân' },
    { key: 'date', label: 'Thời gian', render: (row) => `${row.date} · ${row.time}` },
    { key: 'clinic', label: 'Phòng khám' },
    { key: 'diagnosis', label: 'Chẩn đoán' },
    { key: 'rating', label: 'Đánh giá', render: (row) => <StarRating value={row.rating} /> },
    { key: 'action', label: 'Chi tiết', render: (row) => <Button variant="outline" className="h-9 min-h-9 px-3" onClick={() => setSelected(row)}><Eye size={15} /> Hiển thị</Button> },
  ]

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Lịch sử khám bệnh" subtitle="Tra cứu các ca đã tư vấn theo tên bệnh nhân và thời gian." />
        <Card className="mb-7">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div>
              <label className="field-label">Tên bệnh nhân</label>
              <SearchBar value={patient} onChange={(event) => setPatient(event.target.value)} placeholder="Nhập tên bệnh nhân..." />
            </div>
            <div>
              <label className="field-label">Thời gian</label>
              <select className="input" value={time} onChange={(event) => setTime(event.target.value)}>
                <option>Tất cả thời gian</option>
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
          </div>
        </Card>
        <DataTable columns={columns} rows={filtered} footer={false} />
      </div>

      {selected && (
        <div className="modal-backdrop">
          <Card className="modal">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">Chi tiết ca bệnh</h2>
                <p className="mt-2 text-slate-500">{selected.id} · {selected.date} {selected.time}</p>
              </div>
              <StarRating value={selected.rating} />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info label="Thông tin bệnh nhân" value={`${selected.patient} · ${selected.clinic}`} />
              <Info label="Chẩn đoán" value={selected.diagnosis} />
              <Info label="Kê thuốc" value={selected.prescription} />
              <Info label="Ghi chú ca bệnh" value={selected.note} />
              <Info label="Phản hồi của bệnh nhân" value={selected.comment} wide />
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={() => setSelected(null)}>Đóng</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}

function StarRating({ value }) {
  return (
    <span className="star-rating" aria-label={`${value} sao`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={15} fill={index < value ? 'currentColor' : 'none'} />
      ))}
    </span>
  )
}

function Info({ label, value, wide = false }) {
  return <div className={`info-box ${wide ? 'md:col-span-2' : ''}`}><small>{label}</small><b>{value}</b></div>
}
