import { useState } from 'react'
import { Mic, Paperclip, PhoneOff, Send, Search, Video } from 'lucide-react'
import { AppShell, Badge, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'

export function PatientConsult() {
  const [mode, setMode] = useState('chatbot')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào, bạn đang gặp triệu chứng gì hôm nay?', time: '09:00' },
  ])
  const [attachments, setAttachments] = useState([])
  const [danger, setDanger] = useState(false)
  const [doctorMessages, setDoctorMessages] = useState([
    { from: 'doctor', text: 'Chào bạn, tôi là BS. Trần Thị Hoa. Bạn mô tả rõ hơn triệu chứng nhé.', time: '09:12' },
  ])
  const [doctorInput, setDoctorInput] = useState('')

  function sendChatbotMessage() {
    if (!input.trim() && attachments.length === 0) return
    const userText = input.trim() || 'Tôi gửi kèm hình ảnh mô tả triệu chứng.'
    const next = [...messages, { from: 'user', text: userText, time: '09:03' }]
    const normalized = userText.toLowerCase()
    if (normalized.includes('đau đầu')) {
      next.push({
        from: 'bot',
        text: 'Cảnh báo: đau đầu kéo dài hoặc dữ dội có thể là dấu hiệu nguy hiểm. Bạn có muốn chuyển sang tư vấn với bác sĩ ngay không?',
        time: '09:04',
      })
      setDanger(true)
    } else {
      next.push({
        from: 'bot',
        text: 'Tôi đã ghi nhận triệu chứng. Bạn vui lòng theo dõi thêm thân nhiệt và mức độ đau trong 24 giờ tới.',
        time: '09:04',
      })
    }
    setMessages(next)
    setInput('')
    setAttachments([])
  }

  function sendDoctorMessage() {
    if (!doctorInput.trim()) return
    setDoctorMessages((current) => [...current, { from: 'user', text: doctorInput, time: '09:14' }])
    setDoctorInput('')
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Tư vấn trực tuyến" subtitle="Chọn chatbot để hỏi nhanh hoặc chuyển sang tư vấn trực tiếp với bác sĩ." />
        <div className="segmented mb-7">
          <button className={mode === 'chatbot' ? 'active' : ''} onClick={() => setMode('chatbot')}>Chatbot</button>
          <button className={mode === 'doctor' ? 'active' : ''} onClick={() => setMode('doctor')}>Bác sĩ</button>
        </div>
        {mode === 'chatbot' ? (
          <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
            <Card className="p-0">
              <div className="chat-head"><b>MedConsult AI</b><Badge tone="green">Đang hoạt động</Badge></div>
              <div className="chat-body consult-chat-body">
                {messages.map((message, index) => (
                  <div key={`${message.time}-${index}`} className={`message ${message.from === 'user' ? 'mine' : ''}`}>
                    <div className={`bubble ${message.from === 'bot' ? 'bot' : ''}`}>
                      <p>{message.from === 'bot' ? 'MedConsult AI' : 'Bạn'} · {message.time}</p>
                      <div>{message.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <label className="mini-btn cursor-pointer">
                  <Paperclip size={16} />
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      setAttachments([file.name])
                    }}
                  />
                </label>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Nhập triệu chứng, ví dụ: tôi đau đầu..." />
                <Button onClick={sendChatbotMessage}><Send size={17} /> Gửi</Button>
              </div>
              {attachments.length > 0 && <div className="px-4 pb-4 text-sm font-semibold text-slate-500">Đã đính kèm: {attachments.join(', ')}</div>}
            </Card>
            <Card>
              <h2 className="section-title">Gợi ý hướng xử lý</h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">Nếu chatbot nhận thấy dấu hiệu nguy hiểm, hệ thống sẽ đề nghị chuyển sang bác sĩ ngay để được tư vấn trực tiếp.</p>
              <Button className="mt-6 w-full justify-center" onClick={() => setInput('Tôi đau đầu dữ dội và choáng váng.')}>Mô phỏng ca nghiêm trọng</Button>
              {danger && <Button variant="dark" className="mt-3 w-full justify-center" onClick={() => setMode('doctor')}>Đồng ý chuyển sang bác sĩ</Button>}
            </Card>
          </div>
        ) : (
          <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
            <Card>
              <h2 className="section-title">Tư vấn với bác sĩ</h2>
              <div className="mt-5 video-card">
                <div className="patient-chip"><span /> Phiên đang kết nối</div>
                <div className="doctor-cam">BS. Trần Thị Hoa</div>
                <div className="call-controls"><button aria-label="Tìm kiếm"><Search size={18} /></button><button aria-label="Mic"><Mic size={18} /></button><button className="danger" aria-label="Kết thúc"><PhoneOff size={18} /></button><button aria-label="Camera"><Video size={18} /></button></div>
              </div>
              <div className="mt-6 consult-chat-body">
                {doctorMessages.map((message, index) => (
                  <div key={`${message.time}-${index}`} className={`message ${message.from === 'user' ? 'mine' : ''}`}>
                    <div className={`bubble ${message.from === 'doctor' ? 'bot' : ''}`}>
                      <p>{message.from === 'doctor' ? 'Bác sĩ' : 'Bạn'} · {message.time}</p>
                      <div>{message.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <label className="mini-btn cursor-pointer">
                  <Paperclip size={16} />
                  <input hidden type="file" accept="image/*" />
                </label>
                <input value={doctorInput} onChange={(event) => setDoctorInput(event.target.value)} placeholder="Nhập tin nhắn cho bác sĩ..." />
                <Button onClick={sendDoctorMessage}><Send size={17} /> Gửi</Button>
              </div>
            </Card>
            <Card>
              <h2 className="section-title">Thông tin buổi tư vấn</h2>
              <div className="mt-5 space-y-4">
                <div className="info-box"><small>Bác sĩ</small><b>BS. Trần Thị Hoa</b></div>
                <div className="info-box"><small>Chuyên khoa</small><b>Tim mạch</b></div>
                <div className="info-box"><small>Ghi chú</small><b>Ưu tiên mô tả đầy đủ thời gian đau và cường độ triệu chứng.</b></div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  )
}
