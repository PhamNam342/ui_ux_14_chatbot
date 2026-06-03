import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircleMore, Search, ShieldCheck, Video } from 'lucide-react'
import { AppShell, Badge, Button, Card, TopBar } from '../../components/ui.jsx'
import { patientConsultations } from '../../data/mock.js'

const conversations = [
  ...patientConsultations,
  { id: 'consult-006', doctor: 'BS. Lê Quốc Bảo', initials: 'LB', spec: 'Tim mạch', symptoms: 'Tôi đã nhận kết quả ECG của bạn.', time: 'Hôm qua', status: 'Đang tiếp nhận' },
  { id: 'consult-007', doctor: 'BS. Đỗ Gia Huy', initials: 'GH', spec: 'Hô hấp', symptoms: 'Bạn còn ho nhiều về đêm không?', time: '24/05', status: 'Đã hoàn thành' },
  { id: 'consult-008', doctor: 'BS. Nguyễn Văn An', initials: 'VA', spec: 'Nội tổng quát', symptoms: 'Đơn thuốc của bạn đã sẵn sàng. Hãy chú ý lịch tái khám nhé.', time: '08:45 Hôm nay', status: 'Đang tiếp nhận' },
  { id: 'consult-009', doctor: 'BS. Vũ Thanh Lam', initials: 'TL', spec: 'Tiêu hóa', symptoms: 'Bạn nên tránh dùng đồ chua và cay nóng trong tuần này.', time: '14:20 Hôm nay', status: 'Đang tiếp nhận' },
  { id: 'consult-010', doctor: 'BS. Ngô Văn Sơn', initials: 'VS', spec: 'Thần kinh', symptoms: 'Tình trạng đau đầu của bạn đã thuyên giảm chưa?', time: 'Hôm qua', status: 'Đã hoàn thành' },
  { id: 'consult-011', doctor: 'BS. Phan Minh Đức', initials: 'MĐ', spec: 'Tai mũi họng', symptoms: 'Dùng dung dịch xịt mũi ngày 2 lần sau khi vệ sinh.', time: '22/05', status: 'Đã hoàn thành' },
  { id: 'consult-012', doctor: 'BS. Lê Quốc An', initials: 'QA', spec: 'Nhi khoa', symptoms: 'Bé đã ăn ngoan và ngủ sâu hơn chưa chị?', time: '20/05', status: 'Đã hoàn thành' },
]

export function PatientConsult() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('Đang tiếp nhận')

  const filtered = conversations.filter((item) =>
    item.doctor.toLowerCase().includes(search.toLowerCase())
    && (tab === 'Tất cả' || item.status === tab)
  )

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide consult-list-page">
        <div className="consult-list-hero app-page-hero">
          <div>
            <span><ShieldCheck size={17} /> Tư vấn bảo mật cùng bác sĩ MedConsult</span>
            <h1>Tư vấn trực tuyến</h1>
            <p>Chọn một cuộc trò chuyện để tiếp tục trao đổi với bác sĩ và theo dõi hướng dẫn điều trị.</p>
          </div>
          <Button><Video size={17} /> Bắt đầu tư vấn mới</Button>
        </div>

        <section className="consult-list-toolbar">
          <label className="consult-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm bác sĩ hoặc cuộc trò chuyện..." /></label>
          <div className="consult-list-tabs">
            {['Đang tiếp nhận', 'Đã hoàn thành', 'Tất cả'].map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}
          </div>
        </section>

        <div className="consult-card-grid">
          {filtered.map((item, index) => (
            <Link key={item.id} to={`/patient/consult/chat/${item.id}`} className="consult-thread-card">
              <div className="consult-thread-top">
                <span className="consult-doctor-avatar large">{item.initials}<i className={item.status === 'Đang tiếp nhận' ? 'online' : ''} /></span>
                <div><h2>{item.doctor}</h2><p>{item.spec}</p></div>
                <Badge tone={item.status === 'Đang tiếp nhận' ? 'green' : 'blue'}>{item.status}</Badge>
              </div>
              <div className="consult-thread-message"><MessageCircleMore size={15} /><p>{item.symptoms}</p></div>
              <footer><span className={item.status === 'Đang tiếp nhận' ? 'online' : ''}>{item.status === 'Đang tiếp nhận' ? 'Đang online' : 'Đã offline'}</span><time>{item.time}</time>{index < 2 && <em>{index + 1}</em>}</footer>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
