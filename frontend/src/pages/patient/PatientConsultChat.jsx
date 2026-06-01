import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FilePlus2, ImagePlus, LoaderCircle, Paperclip, Send, ShieldCheck, Video, X, Mic, MicOff, PhoneOff, VideoOff } from 'lucide-react'
import { AppShell, Button, Card, TopBar } from '../../components/ui.jsx'
import { patientConsultations } from '../../data/mock.js'

const extraConsultations = [
  { id: 'consult-006', doctor: 'BS. Lê Quốc Bảo', initials: 'LB', spec: 'Tim mạch', symptoms: 'Tôi đã nhận kết quả ECG của bạn.', time: 'Hôm qua', status: 'Đang tiếp nhận' },
  { id: 'consult-007', doctor: 'BS. Đỗ Gia Huy', initials: 'GH', spec: 'Hô hấp', symptoms: 'Bạn còn ho nhiều về đêm không?', time: '24/05', status: 'Đã hoàn thành' },
]

export function PatientConsultChat() {
  const navigate = useNavigate()
  const { id } = useParams()
  const consultation = [...patientConsultations, ...extraConsultations].find((item) => item.id === id)
  const [inCall, setInCall] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [messages, setMessages] = useState([
    { id: 'message-01', from: 'doctor', time: '09:12', text: 'Chào bạn, tôi đã xem thông tin sức khỏe gần đây. Hôm nay bạn cảm thấy thế nào?' },
    { id: 'message-02', from: 'user', time: '09:14', text: 'Tôi vẫn hơi chóng mặt khi đứng lên nhanh, nhưng đã đỡ hơn hôm qua.' },
    { id: 'message-03', from: 'doctor', time: '09:16', text: 'Bạn nên tiếp tục theo dõi huyết áp sáng và tối. Nếu có đau ngực hoặc khó thở, hãy đến cơ sở y tế gần nhất.' },
  ])
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const messageListRef = useRef(null)
  const documentInputRef = useRef(null)
  const sendingRef = useRef(false)

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  if (!consultation) return null

  function sendMessage() {
    const text = input.trim()
    if ((!text && !image) || sendingRef.current) return
    sendingRef.current = true
    setMessages((current) => [...current, {
      id: `message-${Date.now()}`,
      from: 'user',
      text,
      image: image?.url,
      imageName: image?.name,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }])
    setInput('')
    setImage(null)
    window.setTimeout(() => { sendingRef.current = false }, 120)
  }

  function selectImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage({ name: file.name, url: reader.result })
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function uploadDocument(event) {
    if (!event.target.files?.[0]) return
    setUploading(true)
    window.setTimeout(() => setUploading(false), 900)
    event.target.value = ''
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide consult-detail-page">
        <button className="consult-back" onClick={() => navigate('/patient/consult')}><ArrowLeft size={17} /> Quay lại danh sách hội thoại</button>
        {inCall ? (
          <div className="consult-grid">
            <div className="video-card">
              <div className="patient-chip"><span /> Bác sĩ: {consultation.doctor}</div>
              <div className="doctor-cam">Bạn (Bệnh nhân)</div>

              <div className="call-controls">
                <button
                  type="button"
                  aria-label="Mic"
                  onClick={() => setMicOn((v) => !v)}
                  style={{
                    color: !micOn ? '#ef4444' : '',
                    backgroundColor: !micOn ? 'rgba(239, 68, 68, 0.2)' : '',
                  }}
                >
                  {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                <button className="danger" type="button" aria-label="Kết thúc cuộc gọi" onClick={() => setInCall(false)}>
                  <PhoneOff size={18} />
                </button>

                <button
                  type="button"
                  aria-label="Camera"
                  onClick={() => setCamOn((v) => !v)}
                  style={{
                    color: !camOn ? '#ef4444' : '',
                    backgroundColor: !camOn ? 'rgba(239, 68, 68, 0.2)' : '',
                  }}
                >
                  {camOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
              </div>
            </div>

            <Card className="consult-chat-panel p-0 flex flex-col h-full">
              <div className="consult-chat-head">
                <span className="consult-doctor-avatar large">{consultation.initials}<i className="online" /></span>
                <div><h2>{consultation.doctor}</h2><p>{consultation.spec} · <b>Cuộc gọi trực tuyến</b></p></div>
                <button type="button" className="text-red-500 font-bold" onClick={() => setInCall(false)}>Đóng video</button>
              </div>
              <div className="consult-message-list flex-1 overflow-y-auto" style={{ height: '360px' }}>
                {messages.map((message) => <article key={message.id} className={`consult-message ${message.from === 'user' ? 'mine' : ''}`}><div>{message.image && <img className="consult-message-image" src={message.image} alt={message.imageName || 'Ảnh đính kèm'} />}{message.text && <p>{message.text}</p>}<small>{message.time}</small></div></article>)}
              </div>
              <form className="consult-composer-wrap" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
                {image && <div className="consult-image-preview"><img src={image.url} alt="Xem trước ảnh đính kèm" /><span><b>{image.name}</b><small>Sẵn sàng gửi cùng tin nhắn</small></span><button type="button" title="Xóa ảnh" onClick={() => setImage(null)}><X size={15} /></button></div>}
                <div className="consult-composer">
                  <label title="Gửi ảnh" aria-label="Gửi ảnh"><ImagePlus size={19} /><input hidden type="file" accept="image/*" onChange={selectImage} /></label>
                  <label title="Gửi tài liệu xét nghiệm" aria-label="Gửi tài liệu xét nghiệm">{uploading ? <LoaderCircle className="spin" size={19} /> : <FilePlus2 size={19} />}<input ref={documentInputRef} hidden type="file" onChange={uploadDocument} /></label>
                  <button type="button" title="Đính kèm tài liệu" aria-label="Đính kèm tài liệu" onClick={() => documentInputRef.current?.click()}>{uploading ? <LoaderCircle className="spin" size={19} /> : <Paperclip size={19} />}</button>
                  <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Nhập tin nhắn..." />
                  <Button type="submit" title="Gửi tin nhắn"><Send size={17} /></Button>
                </div>
              </form>
            </Card>
          </div>
        ) : (
          <Card className="consult-chat-panel consult-detail-panel">
            <div className="consult-chat-head">
              <span className="consult-doctor-avatar large">{consultation.initials}<i className={consultation.status === 'Đang tiếp nhận' ? 'online' : ''} /></span>
              <div><h2>{consultation.doctor}</h2><p>{consultation.spec} · <b>{consultation.status === 'Đang tiếp nhận' ? 'Đang trực tuyến' : 'Đã kết thúc tư vấn'}</b></p><small>Thường phản hồi trong vòng 5 phút</small></div>
              <button type="button" title="Gọi video" onClick={() => setInCall(true)}><Video size={18} /></button>
            </div>
            <div className="consult-chat-trust"><ShieldCheck size={15} /> Nội dung tư vấn được bảo mật theo tiêu chuẩn y tế.</div>
            <div className="consult-message-list" ref={messageListRef}>
              <div className="consult-day-label">Hôm nay</div>
              {messages.map((message) => <article key={message.id} className={`consult-message ${message.from === 'user' ? 'mine' : ''}`}><div>{message.image && <img className="consult-message-image" src={message.image} alt={message.imageName || 'Ảnh đính kèm'} />}{message.text && <p>{message.text}</p>}<small>{message.time}</small></div></article>)}
            </div>
            <form className="consult-composer-wrap" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
              {image && <div className="consult-image-preview"><img src={image.url} alt="Xem trước ảnh đính kèm" /><span><b>{image.name}</b><small>Sẵn sàng gửi cùng tin nhắn</small></span><button type="button" title="Xóa ảnh" onClick={() => setImage(null)}><X size={15} /></button></div>}
              <div className="consult-composer">
                <label title="Gửi ảnh" aria-label="Gửi ảnh"><ImagePlus size={19} /><input hidden type="file" accept="image/*" onChange={selectImage} /></label>
                <label title="Gửi tài liệu xét nghiệm" aria-label="Gửi tài liệu xét nghiệm">{uploading ? <LoaderCircle className="spin" size={19} /> : <FilePlus2 size={19} />}<input ref={documentInputRef} hidden type="file" onChange={uploadDocument} /></label>
                <button type="button" title="Đính kèm tài liệu" aria-label="Đính kèm tài liệu" onClick={() => documentInputRef.current?.click()}>{uploading ? <LoaderCircle className="spin" size={19} /> : <Paperclip size={19} />}</button>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Nhập tin nhắn cho bác sĩ..." />
                <Button type="submit" title="Gửi tin nhắn"><Send size={17} /></Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
