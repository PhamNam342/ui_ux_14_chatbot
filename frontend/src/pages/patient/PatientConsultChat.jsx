import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarClock, Clock3, ImagePlus, LoaderCircle, Mic, MicOff, Paperclip, PhoneOff, ScreenShare, Send, ShieldCheck, Video, VideoOff, X } from 'lucide-react'
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
  const [videoPrompt, setVideoPrompt] = useState(null)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [sharingScreen, setSharingScreen] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)
  const [messages, setMessages] = useState([
    { id: 'message-01', from: 'doctor', time: '09:12', text: 'Chào bạn, tôi đã xem thông tin sức khỏe gần đây. Hôm nay bạn cảm thấy thế nào?' },
  ])
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [dropActive, setDropActive] = useState(false)
  const messageListRef = useRef(null)
  const documentInputRef = useRef(null)
  const sendingRef = useRef(false)

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const doctorOnline = consultation?.status === 'Đang tiếp nhận'

  useEffect(() => {
    if (!inCall) return undefined
    const timer = window.setInterval(() => setCallSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [inCall])

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
    handleDocument(event.target.files?.[0])
    event.target.value = ''
  }

  function toggleRecording() {
    setRecording((value) => !value)
  }

  function beginVideoCall() {
    setVideoPrompt(null)
    setCallSeconds(0)
    setMicOn(true)
    setCamOn(true)
    setSharingScreen(false)
    setInCall(true)
  }

  function endVideoCall() {
    setInCall(false)
    setSharingScreen(false)
  }

  function formatDuration(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  }

  function handleDocument(file) {
    if (!file) return
    setUploading(true)
    window.setTimeout(() => setUploading(false), 900)
  }

  function handleDrop(event) {
    event.preventDefault()
    setDropActive(false)
    handleDocument(event.dataTransfer.files?.[0])
  }

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide consult-detail-page">
        <button className="consult-back" onClick={() => navigate('/patient/consult')}><ArrowLeft size={17} /> Quay lại danh sách hội thoại</button>
        <Card
          className={`consult-chat-panel consult-detail-panel ${dropActive ? 'is-drop-active' : ''}`}
          onDragEnter={(event) => { event.preventDefault(); setDropActive(true) }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDropActive(false) }}
          onDrop={handleDrop}
        >
          {dropActive && <div className="consult-drop-zone"><Paperclip size={28} /> Thả tài liệu vào đây để đính kèm</div>}
            <div className="consult-chat-head">
              <span className="consult-doctor-avatar large">{consultation.initials}<i className={consultation.status === 'Đang tiếp nhận' ? 'online' : ''} /></span>
              <div className="consult-chat-doctor">
                <h2>{consultation.doctor}</h2>
                <p>{consultation.spec}</p>
                <div className="consult-doctor-badges">
                  <span className={consultation.status === 'Đang tiếp nhận' ? 'consult-online-status' : 'consult-online-status is-offline'}><i /> {consultation.status === 'Đang tiếp nhận' ? 'Đang trực tuyến' : 'Đã kết thúc tư vấn'}</span>
                  <span className="consult-response-badge" title="Bác sĩ thường phản hồi trong vòng 5 phút"><Clock3 size={12} /> ~ 5 phút</span>
                </div>
              </div>
              <button type="button" title="Gọi video" aria-label="Gọi video" onClick={() => setVideoPrompt(doctorOnline ? 'confirm' : 'offline')}><Video size={20} /></button>
            </div>
            <div className="consult-chat-trust"><ShieldCheck size={15} /> Nội dung tư vấn được bảo mật theo tiêu chuẩn y tế.</div>
            <div className="consult-message-list" ref={messageListRef}>
              <div className="consult-day-label">Hôm nay</div>
              {messages.map((message) => <article key={message.id} className={`consult-message ${message.from === 'user' ? 'mine' : ''}`}><div>{message.image && <img className="consult-message-image" src={message.image} alt={message.imageName || 'Ảnh đính kèm'} />}{message.text && <p>{message.text}</p>}<small>{message.time}</small></div></article>)}
            </div>
            <form className="consult-composer-wrap" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
              {image && <div className="consult-image-preview"><img src={image.url} alt="Xem trước ảnh đính kèm" /><span><b>{image.name}</b><small>Sẵn sàng gửi cùng tin nhắn</small></span><button type="button" title="Xóa ảnh" onClick={() => setImage(null)}><X size={15} /></button></div>}
              <div className="consult-composer">
                <button type="button" title="Đính kèm tài liệu" aria-label="Đính kèm tài liệu" onClick={() => documentInputRef.current?.click()}>{uploading ? <LoaderCircle className="spin" size={19} /> : <Paperclip size={19} />}</button>
                <input ref={documentInputRef} hidden type="file" onChange={uploadDocument} />
                <label title="Gửi ảnh" aria-label="Gửi ảnh"><ImagePlus size={19} /><input hidden type="file" accept="image/*" onChange={selectImage} /></label>
                <button className={recording ? 'is-recording' : ''} type="button" title={recording ? 'Dừng ghi âm' : 'Ghi âm'} aria-label={recording ? 'Dừng ghi âm' : 'Ghi âm'} onClick={toggleRecording}>{recording ? <MicOff size={19} /> : <Mic size={19} />}</button>
                <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); sendMessage() } }} placeholder="Nhập tin nhắn cho bác sĩ..." />
                <Button type="submit" title="Gửi tin nhắn"><Send size={17} /></Button>
              </div>
            </form>
        </Card>
      </div>
      {videoPrompt && (
        <div className="modal-backdrop consult-video-confirm-backdrop" onMouseDown={() => setVideoPrompt(null)}>
          <section className="consult-video-confirm" onMouseDown={(event) => event.stopPropagation()}>
            <button className="dialog-close" type="button" aria-label="Đóng" onClick={() => setVideoPrompt(null)}><X size={18} /></button>
            <span className="consult-video-confirm-icon"><Video size={25} /></span>
            {videoPrompt === 'confirm' ? (
              <>
                <h2>Bắt đầu cuộc gọi video?</h2>
                <p>Bạn có muốn bắt đầu cuộc gọi video với <b>{consultation.doctor}</b> không?</p>
                <div><Button variant="outline" type="button" onClick={() => setVideoPrompt(null)}>Hủy</Button><Button type="button" onClick={beginVideoCall}><Video size={18} /> Bắt đầu cuộc gọi</Button></div>
              </>
            ) : (
              <>
                <h2>Bác sĩ chưa trực tuyến</h2>
                <p>Bác sĩ hiện chưa sẵn sàng cho cuộc gọi video. Bạn có thể gửi tin nhắn hoặc đặt lịch hẹn video.</p>
                <div><Button variant="outline" type="button" onClick={() => setVideoPrompt(null)}>Gửi tin nhắn</Button><Button type="button" onClick={() => navigate('/patient/booking')}><CalendarClock size={18} /> Đặt lịch hẹn video</Button></div>
              </>
            )}
          </section>
        </div>
      )}
      {inCall && (
        <section className="consult-video-call" aria-label="Cuộc gọi video">
          <header>
            <div><span className="consult-video-live-dot" /><b>Đang kết nối an toàn</b><small>{formatDuration(callSeconds)}</small></div>
            <p>Cuộc gọi video với {consultation.doctor}</p>
          </header>
          <div className="consult-video-stage">
            <article className="consult-video-doctor-view">
              <span className="consult-doctor-avatar">{consultation.initials}</span>
              <div><b>{consultation.doctor}</b><small>{consultation.spec} · Đang trực tuyến</small></div>
            </article>
            <article className={`consult-video-patient-view ${camOn ? '' : 'is-camera-off'}`}>
              {camOn ? <Video size={42} /> : <VideoOff size={42} />}
              <b>Bạn (Bệnh nhân)</b>
              <small>{camOn ? 'Camera bệnh nhân đang bật' : 'Camera bệnh nhân đang tắt'}</small>
            </article>
            {sharingScreen && <div className="consult-screen-share-note"><ScreenShare size={17} /> Bạn đang chia sẻ màn hình</div>}
          </div>
          <footer className="consult-call-controls">
            <button className={micOn ? '' : 'is-off'} type="button" aria-label={micOn ? 'Tắt microphone' : 'Bật microphone'} onClick={() => setMicOn((value) => !value)}>{micOn ? <Mic size={22} /> : <MicOff size={22} />}<small>Microphone</small></button>
            <button className={camOn ? '' : 'is-off'} type="button" aria-label={camOn ? 'Tắt camera' : 'Bật camera'} onClick={() => setCamOn((value) => !value)}>{camOn ? <Video size={22} /> : <VideoOff size={22} />}<small>Camera</small></button>
            <button className={sharingScreen ? 'is-active' : ''} type="button" aria-label="Chia sẻ màn hình" onClick={() => setSharingScreen((value) => !value)}><ScreenShare size={22} /><small>Chia sẻ</small></button>
            <button className="is-danger" type="button" aria-label="Kết thúc cuộc gọi" onClick={endVideoCall}><PhoneOff size={22} /><small>Kết thúc</small></button>
          </footer>
        </section>
      )}
    </AppShell>
  )
}
