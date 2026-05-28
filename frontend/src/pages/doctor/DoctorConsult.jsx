import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, Mic, MicOff, PhoneOff, Plus, Search, Send, Video, VideoOff } from 'lucide-react' // Đã bổ sung MicOff và VideoOff
import { AppShell, Avatar, Badge, Button, Card } from '../../components/ui.jsx'

const initialMessages = [
  { id: 1, who: 'Bệnh nhân', initials: 'TM', time: '10:02', text: 'Chào bác sĩ, tôi bị sốt và ho từ hôm qua.' },
  { id: 2, who: 'Bác sĩ', initials: 'BS', time: '10:03', text: 'Chị có thể cho tôi biết nhiệt độ sốt hiện tại là bao nhiêu không?', mine: true },
  { id: 3, who: 'Bệnh nhân', initials: 'TM', time: '10:04', text: 'Hiện tại là 38.5°C ạ.' },
]

export function DoctorConsult() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  // Khai báo state để quản lý trạng thái bật/tắt thiết bị
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

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
      <div className="consult-grid">
        <section className="space-y-5">
          <div className="video-card">
            <div className="patient-chip"><span /> Bệnh nhân: Trần Thị Mai</div>
            <div className="doctor-cam">Bạn (Bác sĩ)</div>

            {/* Cụm điều khiển cuộc gọi với logic xử lý bật/tắt mới */}
            <div className="call-controls">
              <button aria-label="Tìm kiếm"><Search size={18} /></button>

              {/* Nút bấm điều khiển Micro */}
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

              {/* Nút Kết thúc tư vấn */}
              <button className="danger" aria-label="Kết thúc tư vấn" onClick={() => navigate('/doctor/medicine')}>
                <PhoneOff size={18} />
              </button>

              {/* Nút bấm điều khiển Camera */}
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

          {/* Khung chat tin nhắn */}
          <Card className="p-0">
            <div className="chat-head"><b>Tin nhắn</b><Badge>{messages.length} tin nhắn</Badge></div>
            <div className="chat-body consult-chat-body">
              {messages.map((message) => (
                <Message key={message.id} {...message} />
              ))}
            </div>
            <form className="chat-input" onSubmit={sendMessage}>
              <button type="button"><Plus size={18} /></button>
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Nhập tin nhắn..." />
              <Button type="submit"><Send size={17} /> Gửi</Button>
            </form>
          </Card>
        </section>

        {/* Sidebar Thông tin bệnh nhân bên phải */}
        <aside className="space-y-5">
          <Card>
            <div className="flex justify-between gap-3">
              <h2 className="section-title">Thông tin bệnh nhân</h2>
              <Badge tone="green">ĐANG TƯ VẤN</Badge>
            </div>
            <div className="patient-summary">
              <Avatar>TM</Avatar>
              <div>
                <h3>Trần Thị Mai</h3>
                <p>CA250501-001</p>
              </div>
            </div>
            <div className="patient-meta-strip">
              <Info label="Tuổi" value="42" />
              <Info label="Giới tính" value="Nữ" />
              <Info label="SĐT" value="0901 234 567" />
            </div>
            <div className="symptom-panel">
              <div className="flex items-center justify-between gap-3">
                <h3>Triệu chứng chính</h3>
                <Badge tone="yellow">Trung bình</Badge>
              </div>
              <ul>
                <li>Sốt 38.5°C</li>
                <li>Ho khan, đau họng</li>
                <li>Đau đầu, mệt mỏi</li>
              </ul>
            </div>
            <Link to="/doctor/patients/CA250501-001">
              <Button variant="outline" className="mt-5 w-full justify-center">Xem chi tiết ca bệnh</Button>
            </Link>
          </Card>

          <Card>
            <Button variant="danger" className="w-full justify-center" onClick={() => navigate('/doctor/medicine')}>
              <Camera size={17} />
              Kết thúc tư vấn và nhập kết luận
            </Button>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

// Các sub-components dùng nội bộ trong trang
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
