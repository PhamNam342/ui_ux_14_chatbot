import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarClock, Clock3, ImagePlus, LoaderCircle, Mic, MicOff, Paperclip, PhoneOff, ScreenShare, Send, ShieldCheck, Video, VideoOff, X } from 'lucide-react'
import { AppShell, Button, Card, TopBar } from '../../components/ui.jsx'
import { patientConsultations } from '../../data/mock.js'

const extraConsultations = [
  { id: 'consult-006', doctor: 'BS. Lê Quốc Bảo', initials: 'LB', spec: 'Tim mạch', symptoms: 'Tôi đã nhận kết quả ECG của bạn.', time: 'Hôm qua', status: 'Đang tiếp nhận' },
  { id: 'consult-007', doctor: 'BS. Đỗ Gia Huy', initials: 'GH', spec: 'Hô hấp', symptoms: 'Bạn còn ho nhiều về đêm không?', time: '24/05', status: 'Đã hoàn thành' },
  { id: 'consult-008', doctor: 'BS. Nguyễn Văn An', initials: 'VA', spec: 'Nội tổng quát', symptoms: 'Đơn thuốc của bạn đã sẵn sàng. Hãy chú ý lịch tái khám nhé.', time: '08:45 Hôm nay', status: 'Đang tiếp nhận' },
  { id: 'consult-009', doctor: 'BS. Vũ Thanh Lam', initials: 'TL', spec: 'Tiêu hóa', symptoms: 'Bạn nên tránh dùng đồ chua và cay nóng trong tuần này.', time: '14:20 Hôm nay', status: 'Đang tiếp nhận' },
  { id: 'consult-010', doctor: 'BS. Ngô Văn Sơn', initials: 'VS', spec: 'Thần kinh', symptoms: 'Tình trạng đau đầu của bạn đã thuyên giảm chưa?', time: 'Hôm qua', status: 'Đã hoàn thành' },
  { id: 'consult-011', doctor: 'BS. Phan Minh Đức', initials: 'MĐ', spec: 'Tai mũi họng', symptoms: 'Dùng dung dịch xịt mũi ngày 2 lần sau khi vệ sinh.', time: '22/05', status: 'Đã hoàn thành' },
  { id: 'consult-012', doctor: 'BS. Lê Quốc An', initials: 'QA', spec: 'Nhi khoa', symptoms: 'Bé đã ăn ngoan và ngủ sâu hơn chưa chị?', time: '20/05', status: 'Đã hoàn thành' },
]

const chatHistories = {
  'consult-001': [
    { id: 'm1', from: 'doctor', time: '09:12', text: 'Chào chị Mai, tôi đã nhận được thông tin về tình trạng đau đầu và chóng mặt của chị. Chị có đo huyết áp gần đây không?' },
    { id: 'm2', from: 'user', time: '09:14', text: 'Chào bác sĩ Hoa. Sáng nay tôi đo là 135/85 mmHg ạ.' },
    { id: 'm3', from: 'doctor', time: '09:16', text: 'Huyết áp hơi cao nhẹ. Chị chú ý nghỉ ngơi, tránh làm việc quá sức và theo dõi thêm. Nếu tiếp tục tăng hoặc chóng mặt dữ dội, hãy báo lại cho tôi ngay nhé.' }
  ],
  'consult-005': [
    { id: 'm1', from: 'doctor', time: '14:02', text: 'Chào bạn, kết quả xét nghiệm viêm họng của bạn bình thường, chủ yếu là do cảm cúm siêu vi.' },
    { id: 'm2', from: 'user', time: '14:05', text: 'Dạ vâng, cảm ơn bác sĩ Minh. Hiện tại tôi hết sốt rồi nhưng vẫn còn ho khan.' },
    { id: 'm3', from: 'doctor', time: '14:08', text: 'Bạn tiếp tục uống nhiều nước ấm, súc họng bằng nước muối sinh lý nhé. Đơn thuốc ho thảo dược uống thêm 3 ngày nữa sẽ khỏi hẳn.' }
  ],
  'consult-006': [
    { id: 'm1', from: 'doctor', time: '10:30', text: 'Chào chị, tôi đã nhận được file điện tâm đồ (ECG) chị gửi. Nhịp xoang bình thường, không có dấu hiệu thiếu máu cơ tim.' },
    { id: 'm2', from: 'user', time: '10:32', text: 'Thế thì tốt quá bác sĩ Bảo ơi, mấy hôm nay cứ lo lắng mãi thôi.' },
    { id: 'm3', from: 'doctor', time: '10:35', text: 'Đúng vậy, chị yên tâm nhé. Tình trạng nặng ngực nhẹ chủ yếu do lo âu và thiếu ngủ. Hãy cố gắng ngủ đủ giấc.' }
  ],
  'consult-007': [
    { id: 'm1', from: 'doctor', time: '08:15', text: 'Chào bạn, bạn còn ho nhiều về đêm không?' },
    { id: 'm2', from: 'user', time: '08:18', text: 'Dạ chào bác sĩ Huy, đêm qua tôi chỉ ho 1-2 cơn nhẹ thôi, đỡ hơn nhiều rồi ạ.' },
    { id: 'm3', from: 'doctor', time: '08:20', text: 'Rất tốt. Cứ duy trì uống thuốc đúng giờ và giữ ấm cổ họng nhé. Chúc bạn mau khỏe!' }
  ],
  'consult-008': [
    { id: 'm1', from: 'doctor', time: '09:00', text: 'Chào chị Mai, tôi là bác sĩ Nguyễn Văn An. Tôi đã kê đơn thuốc cảm cúm cho chị rồi.' },
    { id: 'm2', from: 'user', time: '09:03', text: 'Dạ em cảm ơn bác sĩ An nhiều ạ. Em thấy đỡ mệt hẳn.' },
    { id: 'm3', from: 'doctor', time: '09:05', text: 'Tốt lắm. Hãy nghỉ ngơi đầy đủ, nếu hết thuốc mà vẫn còn triệu chứng thì nhớ đặt lịch hẹn tái khám trực tuyến nhé.' }
  ],
  'consult-009': [
    { id: 'm1', from: 'doctor', time: '11:20', text: 'Chào bạn, tình trạng trào ngược dạ dày (GERD) thế nào rồi?' },
    { id: 'm2', from: 'user', time: '11:22', text: 'Dạ chào bác sĩ Lam. Tôi đỡ ợ chua nhiều rồi, nhưng sáng ngủ dậy vẫn hơi đắng miệng.' },
    { id: 'm3', from: 'doctor', time: '11:25', text: 'Đắng miệng là do dịch mật trào ngược ban đêm. Bạn chú ý không ăn tối quá muộn (trước khi ngủ 3 tiếng) và kê cao gối khi nằm nhé.' }
  ],
  'consult-010': [
    { id: 'm1', from: 'doctor', time: '15:10', text: 'Chào anh, cơn đau đầu vận mạch của anh hôm nay thế nào rồi?' },
    { id: 'm2', from: 'user', time: '15:12', text: 'Chào bác sĩ Sơn. Tôi uống thuốc đều nên hôm nay đầu óc nhẹ nhàng hẳn, không còn đau nhói nữa.' },
    { id: 'm3', from: 'doctor', time: '15:15', text: 'Tốt quá. Anh nhớ duy trì giảm tải công việc, không làm việc quá giờ hay căng thẳng quá mức nhé.' }
  ],
  'consult-011': [
    { id: 'm1', from: 'doctor', time: '16:00', text: 'Chào bạn, dùng dung dịch xịt mũi ngày 2 lần sau khi vệ sinh bằng nước muối sinh lý nhé.' },
    { id: 'm2', from: 'user', time: '16:03', text: 'Dạ vâng bác sĩ Đức. Xịt cái này xong mũi thông thoáng hẳn, hết nghẹt.' },
    { id: 'm3', from: 'doctor', time: '16:05', text: 'Đúng vậy, thuốc giúp giảm phù nề niêm mạc. Tuy nhiên chỉ nên xịt tối đa 5-7 ngày để tránh lờn thuốc nhé.' }
  ],
  'consult-012': [
    { id: 'm1', from: 'doctor', time: '17:30', text: 'Chào chị, bé nhà mình hết sốt hẳn chưa ạ? Bé đã ăn ngoan và ngủ sâu hơn chưa?' },
    { id: 'm2', from: 'user', time: '17:32', text: 'Chào bác sĩ An nhi khoa. Bé hết sốt từ chiều qua rồi, ăn cháo được nửa bát và ngủ ngon giấc không quấy khóc nữa.' },
    { id: 'm3', from: 'doctor', time: '17:35', text: 'Tuyệt vời. Chị tiếp tục cho bé uống nhiều nước hoặc sữa sữa, theo dõi thêm da bé xem có nổi ban gì không nhé. Cần gì cứ nhắn tôi.' }
  ]
}

const defaultMessages = [
  { id: 'message-01', from: 'doctor', time: '09:12', text: 'Chào bạn, tôi đã xem thông tin sức khỏe gần đây. Hôm nay bạn cảm thấy thế nào?' },
  { id: 'message-02', from: 'user', time: '09:14', text: 'Tôi vẫn hơi chóng mặt khi đứng lên nhanh, nhưng đã đỡ hơn hôm qua.' },
  { id: 'message-03', from: 'doctor', time: '09:16', text: 'Bạn nên tiếp tục theo dõi huyết áp sáng và tối. Nếu có đau ngực hoặc khó thở, hãy đến cơ sở y tế gần nhất.' },
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
    if (id) {
      setMessages(chatHistories[id] || defaultMessages)
    }
  }, [id])

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
