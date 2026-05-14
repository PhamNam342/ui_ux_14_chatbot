import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mic, MicOff, PhoneOff, Search, Send, Video, VideoOff } from 'lucide-react'
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
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)

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
            <div className="doctor-cam">{cameraOn ? 'Bạn (Bác sĩ)' : 'Camera tắt'}</div>
            <div className="call-controls">
              <button aria-label="Tìm kiếm"><Search size={19} /></button>
              <button aria-label={micOn ? 'Tắt mic' : 'Bật mic'} className={!micOn ? 'off' : ''} onClick={() => setMicOn((value) => !value)}>{micOn ? <Mic size={19} /> : <MicOff size={19} />}</button>
              <button aria-label="Kết thúc tư vấn" className="danger" onClick={() => navigate('/doctor/medicine')}><PhoneOff size={19} /></button>
              <button aria-label={cameraOn ? 'Tắt camera' : 'Bật camera'} className={!cameraOn ? 'off' : ''} onClick={() => setCameraOn((value) => !value)}>{cameraOn ? <Video size={19} /> : <VideoOff size={19} />}</button>
            </div>
          </div>

          <Card className="p-0">
            <div className="chat-head"><b>Tin nhắn</b><Badge>{messages.length} tin nhắn</Badge></div>
            <div className="chat-body consult-chat-body">
              {messages.map((message) => (
                <Message key={message.id} {...message} />
              ))}
            </div>
            <form className="chat-input" onSubmit={sendMessage}>
              <button type="button">+</button>
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Nhập tin nhắn..." />
              <Button type="submit"><Send size={16} /></Button>
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
              <Avatar>TM</Avatar>
              <div>
                <h3>Trần Thị Mai</h3>
                <p>CA250501-001</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Info label="Tuổi" value="42" />
                <Info label="Giới tính" value="Nữ" />
              </div>
              <Info label="Số điện thoại" value="0901 234 567" />
            </div>
            <div className="mt-5">
              <Badge tone="yellow">Trung bình</Badge>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li>Sốt 38.5°C</li>
                <li>Ho khan, đau họng</li>
                <li>Đau đầu, mệt mỏi</li>
              </ul>
            </div>
            <Link to="/doctor/cases/CA250501-001"><Button variant="outline" className="mt-5 w-full justify-center">Xem chi tiết ca bệnh</Button></Link>
          </Card>

          <Card className="consult-end-card">
            <Button className="w-full justify-center" onClick={() => navigate('/doctor/medicine')}>
              <PhoneOff size={16} />
              Kết thúc tư vấn và nhập kết luận
            </Button>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

function Info({ label, value }) {
  return <div className="info-box"><small>{label}</small><b>{value}</b></div>
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
