import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Mic, MicOff, PhoneOff, Plus, Search, Send, Video, VideoOff } from 'lucide-react'
import { AppShell, Avatar, Badge, Button, Card } from '../../components/ui.jsx'
import { doctorConsultations } from '../../data/mock.js'

const initialMessages = [
  { id: 1, who: 'Bệnh nhân', initials: 'TM', time: '10:02', text: 'Chào bác sĩ, tôi bị sốt và ho từ hôm qua.' },
  { id: 2, who: 'Bác sĩ', initials: 'BS', time: '10:03', text: 'Chị có thể cho tôi biết nhiệt độ sốt hiện tại là bao nhiêu không?', mine: true },
  { id: 3, who: 'Bệnh nhân', initials: 'TM', time: '10:04', text: 'Hiện tại là 38.5°C ạ.' },
]

export function DoctorConsultChat() {
  const navigate = useNavigate()
  const { id } = useParams()
  const consultation = doctorConsultations.find(c => c.id === id)
  
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  if (!consultation) {
    return (
      <AppShell role="doctor">
        <div className="content-doctor p-6 text-center">
          <p className="text-gray-500">Không tìm thấy cuộc tư vấn</p>
          <Button onClick={() => navigate('/doctor/consult')} className="mt-4">Quay lại</Button>
        </div>
      </AppShell>
    )
  }

  function sendMessage(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        who: 'Bác sĩ',
        initials: 'BS',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        text,
        mine: true,
      },
    ])
    setDraft('')
  }

  return (
    <AppShell role="doctor">
      <div className="content-doctor p-6">
        <div className="mb-6 flex items-center gap-3">
          <button 
            onClick={() => navigate('/doctor/consult')}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{consultation.patient}</h1>
            <p className="text-sm text-gray-500">{consultation.symptoms} • {consultation.time}</p>
          </div>
        </div>

        <div className="consult-grid">
          <section className="space-y-5">
            <div className="video-card">
              <div className="patient-chip"><span /> Bệnh nhân: {consultation.patient}</div>
              <div className="doctor-cam">Bạn (Bác sĩ)</div>

              <div className="call-controls">
                <button aria-label="Tìm kiếm"><Search size={18} /></button>

                <button
                  aria-label="Mic"
                  onClick={() => setMicOn(v => !v)}
                  style={{
                    color: !micOn ? '#ef4444' : '',
                    backgroundColor: !micOn ? 'rgba(239, 68, 68, 0.2)' : ''
                  }}
                >
                  {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                <button className="danger" aria-label="Kết thúc tư vấn" onClick={() => navigate('/doctor/consult')}>
                  <PhoneOff size={18} />
                </button>

                <button
                  aria-label="Camera"
                  onClick={() => setCamOn(v => !v)}
                  style={{
                    color: !camOn ? '#ef4444' : '',
                    backgroundColor: !camOn ? 'rgba(239, 68, 68, 0.2)' : ''
                  }}
                >
                  {camOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
              </div>
            </div>

            <Card className="p-0 flex flex-col h-full">
              <div className="chat-head"><b>Tin nhắn</b><Badge>{messages.length} tin nhắn</Badge></div>
              <div className="chat-body consult-chat-body flex-1 overflow-y-auto">
                {messages.map((message) => (
                  <Message key={message.id} {...message} />
                ))}
              </div>
              <form className="chat-input border-t border-gray-200 mt-auto" onSubmit={sendMessage}>
                <button type="button"><Plus size={18} /></button>
                <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Nhập tin nhắn..." />
                <Button type="submit"><Send size={17} /> Gửi</Button>
              </form>
            </Card>
          </section>

          <aside className="space-y-5">
            <Card>
              <div className="flex justify-between gap-3">
                <h2 className="section-title">Thông tin bệnh nhân</h2>
                <Badge tone="green">ĐANG TƯ VẤN</Badge>
              </div>
              <div className="patient-summary">
                <Avatar>{consultation.initials}</Avatar>
                <div>
                  <h3>{consultation.patient}</h3>
                  <p>{consultation.id}</p>
                </div>
              </div>
              <div className="patient-meta-strip">
                <Info label="Tuổi" value={consultation.age.toString()} />
                <Info label="SĐT" value={consultation.phone} />
              </div>
              <div className="symptom-panel">
                <div className="flex items-center justify-between gap-3">
                  <h3>Triệu chứng chính</h3>
                  <Badge tone={consultation.level === 'Cao' ? 'red' : consultation.level === 'Trung bình' ? 'yellow' : 'green'}>
                    {consultation.level}
                  </Badge>
                </div>
                <ul>
                  {consultation.symptoms.split(',').map((symptom, idx) => (
                    <li key={idx}>{symptom.trim()}</li>
                  ))}
                </ul>
              </div>
              <Link to={`/doctor/patients/${consultation.id}`}>
                <Button variant="outline" className="mt-5 w-full justify-center">Xem chi tiết ca bệnh</Button>
              </Link>
            </Card>

            <Card>
              <Button variant="danger" className="w-full justify-center" onClick={() => navigate('/doctor/consult')}>
                <Camera size={17} />
                Kết thúc tư vấn
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

function Info({ label, value }) {
  return <div className="patient-meta"><small>{label}</small><span>{value}</span></div>
}

function Message({ text, who, time, initials, mine = false }) {
  return (
    <div className={`message ${mine ? 'mine' : ''}`}>
      {!mine && <Avatar>{initials}</Avatar>}
      <div>
        <p><b>{who}</b> <span>{time}</span></p>
        <div className="bubble">{text}</div>
      </div>
      {mine && <Avatar>{initials}</Avatar>}
    </div>
  )
}
