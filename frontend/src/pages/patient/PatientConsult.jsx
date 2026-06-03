import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircleMore, Search, ShieldCheck, Stethoscope, UsersRound } from 'lucide-react'
import { AppShell, Badge, Card, TopBar } from '../../components/ui.jsx'
import { patientConsultations } from '../../data/mock.js'

const conversations = [
  ...patientConsultations,
  { id: 'consult-006', doctor: 'BS. Lê Quốc Bảo', initials: 'LB', spec: 'Tim mạch', symptoms: 'Tôi đã nhận kết quả ECG của bạn.', time: 'Hôm qua', status: 'Đang tiếp nhận' },
  { id: 'consult-007', doctor: 'BS. Đỗ Gia Huy', initials: 'GH', spec: 'Hô hấp', symptoms: 'Bạn còn ho nhiều về đêm không?', time: '24/05', status: 'Đã hoàn thành' },
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
        </div>

        <section className="consult-list-toolbar">
          <label className="consult-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm bác sĩ hoặc cuộc trò chuyện..." /></label>
          <div className="consult-list-tabs">
            {['Đang tiếp nhận', 'Đã hoàn thành', 'Tất cả'].map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}
          </div>
        </section>

        <div className="consult-list-summary">
          <Card><span><MessageCircleMore size={17} /></span><div><b>{filtered.length}</b><small>Cuộc trò chuyện hiển thị</small></div></Card>
          <Card><span><UsersRound size={17} /></span><div><b>12</b><small>Bác sĩ đang online</small></div></Card>
          <Card><span><Stethoscope size={17} /></span><div><b>~ 5 phút</b><small>Thời gian phản hồi</small></div></Card>
        </div>

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
