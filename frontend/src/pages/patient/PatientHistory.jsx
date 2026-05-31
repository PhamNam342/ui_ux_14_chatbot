import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronRight, Download, FileText, FlaskConical, Printer, Search, Star, Stethoscope, X } from 'lucide-react'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { patientHistory } from '../../data/mock.js'

const historyItems = [
  { ...patientHistory[0], time: '09:30', spec: 'Nội tổng quát', status: 'Hoàn thành', symptoms: 'Sốt nhẹ, ho khan và đau họng kéo dài 3 ngày.', tests: 'Không chỉ định xét nghiệm.', files: ['Đơn thuốc điện tử VH-01.pdf'] },
  { ...patientHistory[1], time: '14:00', spec: 'Tim mạch', status: 'Đang điều trị', symptoms: 'Đau ngực nhẹ khi vận động, cần theo dõi huyết áp.', tests: 'ECG: nhịp xoang đều. Huyết áp: 128/82 mmHg.', files: ['Kết quả ECG VH-02.pdf', 'Phiếu khám tim mạch.pdf'] },
  { id: 'VH-03', type: 'Tái khám', date: '12/01/2026', time: '10:15', doctor: 'BS. Vũ Thanh Lam', clinic: 'Phòng khám Đa khoa Tâm An', spec: 'Tiêu hóa', status: 'Đã đóng hồ sơ', summary: 'Tái khám viêm dạ dày sau 4 tuần điều trị.', symptoms: 'Đau thượng vị giảm, không còn ợ chua về đêm.', diagnosis: 'Viêm dạ dày đã cải thiện', prescription: 'Omeprazole 20mg', reminders: 'Duy trì chế độ ăn lành mạnh', note: 'Có thể ngưng thuốc sau 7 ngày nếu ổn định.', tests: 'Không chỉ định thêm.', files: ['Tóm tắt tái khám VH-03.pdf'] },
]

export function PatientHistory() {
  const navigate = useNavigate()
  const [type, setType] = useState('Tất cả')
  const [query, setQuery] = useState('')
  const [date, setDate] = useState('')
  const [selected, setSelected] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [toast, setToast] = useState('')

  const items = useMemo(() => historyItems.filter((item) => {
    const keyword = query.trim().toLowerCase()
    return (type === 'Tất cả' || item.type === type)
      && (!keyword || `${item.doctor} ${item.id}`.toLowerCase().includes(keyword))
      && (!date || item.date.split('/').reverse().join('-') === date)
  }), [date, query, type])

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  function downloadPdf() {
    const blob = new Blob([`MEDCONSULT\nHo so: ${selected.id}\nBac si: ${selected.doctor}\nChan doan: ${selected.diagnosis}`], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selected.id}-ho-so-kham.pdf`
    link.click()
    URL.revokeObjectURL(url)
    notify('Đã tải PDF hồ sơ khám')
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide history-page">
        <div className="app-breadcrumb"><span>Trang chủ</span><ChevronRight size={14} /><span>Hồ sơ bệnh án</span><ChevronRight size={14} /><b>Lịch sử khám</b></div>
        <PageHeader eyebrow="Hồ sơ sức khỏe" title="Lịch sử khám bệnh" subtitle="Tra cứu hồ sơ khám, kết quả điều trị và đặt lịch tái khám khi cần." />

        <Card className="history-filter-card">
          <div className="history-tabs">{['Tất cả', 'Khám bệnh', 'Tư vấn trực tuyến', 'Tái khám'].map((item) => <button key={item} className={type === item ? 'active' : ''} onClick={() => setType(item)}>{item}</button>)}</div>
          <div className="history-filter-row">
            <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo bác sĩ hoặc mã hồ sơ..." /></label>
            <label><CalendarDays size={17} /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          </div>
        </Card>

        <div className="history-card-list">
          {items.map((item) => (
            <Card className={`history-visit-card visit-${item.type === 'Tư vấn trực tuyến' ? 'online' : item.type === 'Tái khám' ? 'followup' : 'clinic'}`} key={item.id}>
              <div className="history-visit-icon"><Stethoscope size={20} /></div>
              <div className="history-visit-main">
                <div><Badge tone={item.type === 'Tư vấn trực tuyến' ? 'blue' : 'green'}>{item.type}</Badge><h2>{item.diagnosis}</h2></div>
                <p>{item.summary}</p>
                <div className="history-visit-meta"><span>{item.doctor}</span><span>{item.spec}</span><span>{item.date} · {item.time}</span><span>Mã hồ sơ: <b>{item.id}</b></span></div>
              </div>
              <div className="history-visit-action"><Badge tone={item.status === 'Đang điều trị' ? 'yellow' : 'green'}>{item.status}</Badge><Button variant="outline" onClick={() => setSelected(item)}>Xem chi tiết</Button></div>
            </Card>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop">
          <Card className="history-detail-modal">
            <button className="dialog-close" onClick={() => setSelected(null)}><X size={18} /></button>
            <div className="history-detail-head"><div><span>Hồ sơ khám {selected.id}</span><h2>{selected.diagnosis}</h2><p>{selected.clinic}</p></div><Badge tone="green">{selected.status}</Badge></div>
            <div className="history-detail-grid">
              <Info label="Ngày khám" value={`${selected.date} · ${selected.time}`} />
              <Info label="Bác sĩ" value={selected.doctor} />
              <Info label="Chuyên khoa" value={selected.spec} />
              <Info label="Loại khám" value={selected.type} />
              <Info wide label="Triệu chứng" value={selected.symptoms} />
              <Info wide label="Chẩn đoán" value={selected.diagnosis} />
              <Info wide label="Đơn thuốc" value={selected.prescription} />
              <Info wide label="Kết quả xét nghiệm" value={selected.tests} />
              <Info wide label="Ghi chú bác sĩ" value={selected.note} />
            </div>
            <div className="history-files"><h3><FileText size={17} /> File đính kèm</h3>{selected.files.map((file) => <span key={file}><FlaskConical size={15} /> {file}</span>)}</div>
            <div className="history-review"><h3>Đánh giá buổi khám</h3><div>{[1, 2, 3, 4, 5].map((star) => <button key={star} className={`rating-star ${star <= rating ? 'active' : ''}`} onClick={() => setRating(star)}>★</button>)}</div><textarea className="input" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Chia sẻ trải nghiệm của bạn..." /><Button variant="outline" onClick={() => notify('Đã lưu đánh giá của bạn')}>Lưu đánh giá</Button></div>
            <div className="history-detail-actions"><Button variant="outline" onClick={downloadPdf}><Download size={16} /> Tải PDF</Button><Button variant="outline" onClick={() => window.print()}><Printer size={16} /> In hồ sơ</Button><Button onClick={() => navigate('/patient/booking')}><CalendarDays size={16} /> Đặt lịch tái khám</Button></div>
          </Card>
        </div>
      )}
      {toast && <div className="toast"><span>✓</span> {toast}</div>}
    </AppShell>
  )
}

function Info({ label, value, wide = false }) {
  return <div className={`history-detail-info ${wide ? 'wide' : ''}`}><small>{label}</small><p>{value}</p></div>
}
