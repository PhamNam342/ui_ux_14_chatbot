import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FilePlus2, ImagePlus, LoaderCircle, Paperclip, Send, ShieldCheck, Video, X, Mic, MicOff, PhoneOff, VideoOff } from 'lucide-react'
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
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
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
