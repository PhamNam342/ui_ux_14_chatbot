import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Accessibility, AlertTriangle, ArrowRight, Bot, Clock3, ImagePlus, LockKeyhole, Mic, MicOff, Send, ShieldCheck, Stethoscope, UserRoundCheck, Volume2 } from 'lucide-react'
import { AppShell, Button, Card, TopBar } from '../../components/ui.jsx'

const symptoms = ['Sốt / Ớn lạnh', 'Đau đầu / Chóng mặt', 'Ho / Sổ mũi', 'Đau bụng', 'Đau ngực / Khó thở', 'Mệt mỏi', 'Vấn đề khác']
const painAreas = ['Đầu', 'Ngực', 'Bụng', 'Lưng', 'Tay', 'Chân']

const initialMessages = [
  {
    from: 'bot',
    text: 'Xin chào, tôi là trợ lý sức khỏe MedConsult. Tôi hỗ trợ khảo sát triệu chứng ban đầu để bạn nhận được hướng dẫn phù hợp.',
  },
  {
    from: 'bot',
    text: 'Thông tin bạn chia sẻ được bảo mật và mã hóa. Chatbot không thay thế chẩn đoán của bác sĩ. Hôm nay bạn đang gặp vấn đề gì?',
    suggestions: symptoms,
  },
]

export function PatientChatbot() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [attachment, setAttachment] = useState('')
  const [listening, setListening] = useState(false)
  const [showBodyMap, setShowBodyMap] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [typing, setTyping] = useState(false)
  const chatBodyRef = useRef(null)

  useEffect(() => {
    const body = chatBodyRef.current
    if (!body) return
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, showBodyMap, showTransfer])

  function readText(text) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
  }

  function addBot(text, suggestions = []) {
    setTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { from: 'bot', text, suggestions }])
      setTyping(false)
    }, 650)
  }

  function chooseSymptom(symptom) {
    setMessages((current) => [...current, { from: 'user', text: symptom }])
    if (symptom.toLowerCase().includes('đau')) {
      setShowBodyMap(true)
      addBot('Bạn đang đau ở vị trí nào? Nếu khó mô tả, hãy chạm vào vùng tương ứng trên hình cơ thể bên dưới.')
      return
    }
    addBot('Bạn đã gặp triệu chứng này bao lâu? Triệu chứng đang nhẹ, vừa hay nặng?', ['Mới hôm nay', '1 - 3 ngày', 'Trên 3 ngày', 'Không nhớ rõ'])
  }

  function choosePainArea(area) {
    setShowBodyMap(false)
    setMessages((current) => [...current, { from: 'user', text: `Tôi đau vùng ${area.toLowerCase()}.` }])
    addBot(`Tôi đã ghi nhận đau vùng ${area.toLowerCase()}. Cơn đau có tăng khi vận động hoặc kèm khó thở, chóng mặt không?`, ['Không', 'Có, khi vận động', 'Có kèm chóng mặt', 'Có kèm khó thở'])
    if (area === 'Ngực' || area === 'Đầu') setShowTransfer(true)
  }

  function chooseQuickReply(reply) {
    if (symptoms.includes(reply)) {
      chooseSymptom(reply)
      return
    }
    setMessages((current) => [...current, { from: 'user', text: reply }])
    if (['Mới hôm nay', '1 - 3 ngày', 'Trên 3 ngày', 'Không nhớ rõ'].includes(reply)) {
      addBot('Mức độ triệu chứng hiện tại của bạn như thế nào?', ['Nhẹ', 'Vừa', 'Nặng'])
      return
    }
    addBot('Cảm ơn bạn, tôi đã ghi nhận. Nếu triệu chứng tăng lên hoặc có dấu hiệu bất thường, bạn nên chuyển sang tư vấn trực tuyến với bác sĩ.')
  }

  function sendMessage() {
    if (!input.trim() && !attachment) return
    const text = input.trim() || `Đã gửi hình ảnh: ${attachment}`
    setMessages((current) => [...current, { from: 'user', text }])
    setInput('')
    setAttachment('')
    if (text.toLowerCase().includes('đau')) {
      setShowBodyMap(true)
      addBot('Bạn có thể chọn vị trí đau trên hình bên dưới để tôi ghi nhận chính xác hơn.')
    } else {
      addBot('Cảm ơn bạn. Bạn vui lòng cho biết triệu chứng bắt đầu từ khi nào và mức độ hiện tại.', ['Mới hôm nay', '1 - 3 ngày', 'Trên 3 ngày', 'Không nhớ rõ'])
    }
  }

  function transferToDoctor() {
    localStorage.setItem('medconsult-doctor-request', 'active')
    navigate('/patient/consult')
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide patient-chat-page">
        <div className="patient-chat-layout">
          <Card className="chatbot-shell p-0">
            <div className="chatbot-head">
              <span className="chatbot-avatar"><Bot size={21} /></span>
              <div>
                <b>Trợ lý MedConsult</b>
                <div className="chatbot-head-meta">
                  <small><i /> Đang hoạt động · Miễn phí</small>
                  <span className="chatbot-disclaimer">Không thay thế bác sĩ · Cấp cứu: gọi 115</span>
                </div>
              </div>
            </div>
            <div className="chat-body consult-chat-body" ref={chatBodyRef}>
              {messages.map((message, index) => (
                <div key={`${message.text}-${index}`} className={`message ${message.from === 'user' ? 'mine' : 'with-suggestions'}`}>
                  <div className={`bubble ${message.from === 'bot' ? 'bot' : ''}`}>
                    <div>{message.text}</div>
                    {message.from === 'bot' && <button className="read-answer" onClick={() => readText(message.text)}><Volume2 size={15} /> Đọc câu trả lời</button>}
                  </div>
                  {message.from === 'bot' && message.suggestions?.length > 0 && (
                    <div className="message-suggestions">
                      {message.suggestions.map((reply) => <button key={reply} className="symptom-chip" onClick={() => chooseQuickReply(reply)}>{reply}</button>)}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="message chatbot-typing">
                  <span className="chatbot-avatar"><Bot size={17} /></span>
                  <div>
                    <small>Trợ lý MedConsult đang nhập</small>
                    <div className="typing-dots"><i /><i /><i /></div>
                  </div>
                </div>
              )}
              {showBodyMap && (
                <div className="body-picker">
                  <div className="body-picker-figure">
                    <Accessibility size={142} strokeWidth={1.15} />
                    <span className="body-point head">Đầu</span>
                    <span className="body-point chest">Ngực</span>
                    <span className="body-point belly">Bụng</span>
                    <span className="body-point legs">Chân</span>
                  </div>
                  <div>
                    <b>Chọn vị trí đau</b>
                    <p>Chạm vào vùng gần đúng nhất. Bạn có thể bổ sung mô tả sau.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {painAreas.map((area) => <button key={area} className="symptom-chip" onClick={() => choosePainArea(area)}>{area}</button>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {showTransfer && (
              <div className="chat-transfer">
                <div className="chat-transfer-main">
                  <div className="chat-transfer-heading">
                    <span className="chat-transfer-icon"><AlertTriangle size={22} /></span>
                    <div>
                      <div className="chat-transfer-title-row">
                        <h3>Khuyến nghị từ MedConsult AI</h3>
                        <span className="chat-transfer-badge">Cần bác sĩ đánh giá</span>
                      </div>
                      <p>Triệu chứng hiện tại có dấu hiệu cần được bác sĩ đánh giá sớm.</p>
                    </div>
                  </div>
                  <p className="chat-transfer-description">Để đảm bảo an toàn và nhận được tư vấn chính xác hơn, hệ thống khuyến nghị kết nối với bác sĩ chuyên môn.</p>
                  <div className="chat-transfer-support">
                    <span><Clock3 size={16} /> Ước tính kết nối: 1 - 3 phút</span>
                    <span><ShieldCheck size={16} /> Thông tin được mã hóa và bảo mật</span>
                    <span><UserRoundCheck size={16} /> Bác sĩ tiếp nhận toàn bộ lịch sử hội thoại</span>
                  </div>
                </div>
                <div className="chat-transfer-action">
                  <span><Stethoscope size={17} /> Bác sĩ MedConsult đang sẵn sàng</span>
                  <Button className="chat-transfer-cta" onClick={transferToDoctor}><Stethoscope size={18} /> Chuyển sang bác sĩ ngay <ArrowRight size={17} /></Button>
                </div>
              </div>
            )}
            {attachment && <div className="chat-attachment">Đã chọn ảnh: {attachment}</div>}
            <div className="chat-input-guide">
              <LockKeyhole size={15} />
              <span><b>Lưu ý:</b> thông tin được mã hóa và chỉ chuyển cho bác sĩ khi bạn đồng ý. <i>·</i> <b>Gợi ý:</b> mô tả triệu chứng, vị trí đau và thời gian bắt đầu.</span>
            </div>
            <div className="chat-input">
              <label className="mini-btn cursor-pointer" title="Gửi ảnh">
                <ImagePlus size={18} />
                <input hidden type="file" accept="image/*" onChange={(event) => setAttachment(event.target.files?.[0]?.name || '')} />
              </label>
              <button className={`mini-btn ${listening ? 'teal' : ''}`} onClick={() => {
                setListening((value) => !value)
                setInput('Tôi đau đầu và hơi chóng mặt từ sáng nay.')
              }} title="Nhập bằng giọng nói">
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ví dụ: Tôi đau đầu từ sáng nay..." />
              <Button onClick={sendMessage} title="Gửi"><Send size={17} /></Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
