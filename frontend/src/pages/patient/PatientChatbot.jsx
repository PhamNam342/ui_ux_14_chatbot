import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Bot, CalendarDays, ImagePlus, LockKeyhole, MapPin, Mic, MicOff, Send, Stethoscope, Volume2, Clock, ShieldCheck, Video } from 'lucide-react'
import { AppShell, Button, Card, TopBar } from '../../components/ui.jsx'

const symptoms = ['Sốt / Ớn lạnh', 'Đau đầu / Chóng mặt', 'Ho / Sổ mũi', 'Đau bụng', 'Đau ngực / Khó thở', 'Mệt mỏi', 'Tê yếu tay chân', 'Da nổi mẩn / ngứa', 'Vấn đề khác']
const otherIssues = ['Mất ngủ kéo dài', 'Buồn nôn / nôn', 'Tiểu buốt', 'Chấn thương nhẹ', 'Căng thẳng / lo âu', 'Cần kiểm tra sức khỏe tổng quát']
const painAreas = [
  { id: 'head', label: 'Đầu', note: 'Đau đầu, chóng mặt, buồn nôn, nhìn mờ', level: 'urgent', specialty: 'Thần kinh', clinic: 'Phòng khám Đa khoa Tâm An', position: 'head' },
  { id: 'throat', label: 'Cổ / Họng', note: 'Đau họng, ho, khó nuốt, sốt', level: 'routine', specialty: 'Tai Mũi Họng', clinic: 'MedCare Family Clinic', position: 'throat' },
  { id: 'chest', label: 'Ngực', note: 'Đau tức ngực, khó thở, hồi hộp', level: 'urgent', specialty: 'Tim mạch', clinic: 'Phòng khám Tim mạch An Bình', position: 'chest' },
  { id: 'belly', label: 'Bụng', note: 'Đau bụng, buồn nôn, rối loạn tiêu hóa', level: 'watch', specialty: 'Tiêu hóa', clinic: 'Phòng khám Đa khoa Tâm An', position: 'belly' },
  { id: 'back', label: 'Lưng', note: 'Đau lưng, đau lan xuống chân, mỏi cơ', level: 'routine', specialty: 'Cơ xương khớp', clinic: 'Phòng khám Đa khoa Tâm An', position: 'back' },
  { id: 'arm', label: 'Tay', note: 'Đau, tê, yếu tay hoặc sau chấn thương', level: 'watch', specialty: 'Cơ xương khớp', clinic: 'MedCare Family Clinic', position: 'arm' },
  { id: 'leg', label: 'Chân', note: 'Đau, sưng, tê hoặc khó đi lại', level: 'watch', specialty: 'Cơ xương khớp', clinic: 'MedCare Family Clinic', position: 'leg' },
]

const symptomRecommendations = {
  'Sốt / Ớn lạnh': { level: 'watch', specialty: 'Nội tổng quát', clinic: 'Phòng khám Đa khoa Tâm An', reason: 'Theo dõi sốt, dấu hiệu nhiễm trùng và tình trạng mất nước.' },
  'Ho / Sổ mũi': { level: 'routine', specialty: 'Tai Mũi Họng', clinic: 'MedCare Family Clinic', reason: 'Phù hợp kiểm tra hô hấp trên, viêm họng, viêm mũi xoang.' },
  'Đau bụng': { level: 'watch', specialty: 'Tiêu hóa', clinic: 'Phòng khám Đa khoa Tâm An', reason: 'Cần đánh giá vị trí đau, tiêu hóa và dấu hiệu cấp tính.' },
  'Đau ngực / Khó thở': { level: 'urgent', specialty: 'Tim mạch', clinic: 'Phòng khám Tim mạch An Bình', reason: 'Đau ngực hoặc khó thở cần bác sĩ đánh giá sớm.' },
  'Mệt mỏi': { level: 'routine', specialty: 'Nội tổng quát', clinic: 'Phòng khám Đa khoa Tâm An', reason: 'Có thể cần khám tổng quát và xét nghiệm cơ bản.' },
  'Tê yếu tay chân': { level: 'urgent', specialty: 'Thần kinh', clinic: 'Phòng khám Đa khoa Tâm An', reason: 'Tê yếu đột ngột cần được phân loại nguy cơ thần kinh.' },
  'Da nổi mẩn / ngứa': { level: 'routine', specialty: 'Da liễu', clinic: 'MedCare Family Clinic', reason: 'Phù hợp khám da liễu, dị ứng hoặc viêm da.' },
}

const levelMeta = {
  urgent: { label: 'Cần tư vấn bác sĩ sớm', tone: 'is-urgent', description: 'Triệu chứng có thể liên quan nguy cơ cao. Nếu đau dữ dội, khó thở, yếu liệt, ngất hoặc đau ngực kéo dài, hãy gọi 115 hoặc đến cấp cứu.', action: 'Ưu tiên tư vấn bác sĩ ngay để được phân loại nguy cơ. Nếu triệu chứng dữ dội hoặc kéo dài, hãy đến cấp cứu.' },
  watch: { label: 'Nên đặt lịch khám', tone: 'is-watch', description: 'Triệu chứng cần được bác sĩ kiểm tra để xác định nguyên nhân và hướng xử trí phù hợp.', action: 'Nên đặt lịch khám đúng chuyên khoa trong thời gian gần, đồng thời theo dõi dấu hiệu tăng nặng.' },
  routine: { label: 'Theo dõi và đặt lịch khi cần', tone: 'is-routine', description: 'Bạn có thể tiếp tục theo dõi. Nếu kéo dài hoặc nặng hơn, nên đặt lịch khám đúng chuyên khoa.', action: 'Theo dõi tại nhà, nghỉ ngơi và đặt lịch nếu triệu chứng không cải thiện hoặc xuất hiện dấu hiệu bất thường.' },
}
const durationReplies = ['Mới hôm nay', '1 - 3 ngày', 'Trên 3 ngày', 'Không nhớ rõ']
const severityReplies = ['Nhẹ', 'Vừa', 'Nặng', 'Có khó thở / đau ngực', 'Có tê yếu / ngất']
const urgentReplies = ['Nặng', 'Có kèm khó thở', 'Có kèm chóng mặt', 'Có khó thở / đau ngực', 'Có tê yếu / ngất']

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
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [input, setInput] = useState('')
  const [attachment, setAttachment] = useState('')
  const [listening, setListening] = useState(false)
  const [showBodyMap, setShowBodyMap] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [pendingAssessment, setPendingAssessment] = useState(null)
  const [pendingDuration, setPendingDuration] = useState('')
  const [typing, setTyping] = useState(false)
  const chatBodyRef = useRef(null)

  useEffect(() => {
    const body = chatBodyRef.current
    if (!body) return
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, showBodyMap, assessment])

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
      setAssessment(null)
      setPendingAssessment(null)
      addBot('Bạn đang đau chủ yếu ở vùng nào? Bạn có thể chọn nhanh bên dưới hoặc nhập mô tả riêng nếu không đúng các lựa chọn có sẵn.')
      return
    }
    if (symptom === 'Vấn đề khác') {
      addBot('Bạn có thể chọn nhóm vấn đề gần đúng nhất bên dưới hoặc mô tả thêm trong ô nhập.', otherIssues)
      return
    }
    const recommendation = symptomRecommendations[symptom]
    if (recommendation) {
      beginAssessmentFlow({
        title: symptom,
        ...recommendation,
      })
      return
    }
    addBot('Bạn đã gặp triệu chứng này bao lâu? Triệu chứng đang nhẹ, vừa hay nặng?', ['Mới hôm nay', '1 - 3 ngày', 'Trên 3 ngày', 'Không nhớ rõ'])
  }

  function choosePainArea(area) {
    const selectedArea = typeof area === 'string' ? painAreas.find((item) => item.label === area) : area
    if (!selectedArea) {
      setShowBodyMap(false)
      setMessages((current) => [...current, { from: 'user', text: 'Vị trí khác' }])
      setPendingAssessment({
        title: 'Đau ở vị trí khác',
        level: 'routine',
        specialty: 'Nội tổng quát',
        clinic: 'Phòng khám Đa khoa Tâm An',
        reason: 'Vị trí đau do bệnh nhân tự mô tả cần được hỏi thêm để phân loại.',
      })
      addBot('Bạn mô tả rõ hơn vị trí đau, cảm giác đau và có lan sang vùng nào không. Sau đó tôi sẽ hỏi thêm để phân loại mức độ.')
      return
    }
    setShowBodyMap(false)
    setMessages((current) => [...current, { from: 'user', text: `Tôi đau vùng ${selectedArea.label.toLowerCase()}.` }])
    beginAssessmentFlow({
      title: `Đau vùng ${selectedArea.label.toLowerCase()}`,
      level: selectedArea.level,
      specialty: selectedArea.specialty,
      clinic: selectedArea.clinic,
      reason: selectedArea.note,
    })
  }

  function chooseQuickReply(reply) {
    if (symptoms.includes(reply)) {
      chooseSymptom(reply)
      return
    }
    if (otherIssues.includes(reply)) {
      setMessages((current) => [...current, { from: 'user', text: reply }])
      const recommendation = reply === 'Căng thẳng / lo âu'
        ? { level: 'routine', specialty: 'Tâm lý / Nội tổng quát', clinic: 'MedCare Family Clinic', reason: 'Bác sĩ có thể đánh giá stress, giấc ngủ và triệu chứng cơ thể đi kèm.' }
        : reply === 'Tiểu buốt'
          ? { level: 'watch', specialty: 'Tiết niệu', clinic: 'Phòng khám Đa khoa Tâm An', reason: 'Cần kiểm tra nhiễm khuẩn tiết niệu hoặc viêm đường tiểu.' }
          : { level: 'routine', specialty: 'Nội tổng quát', clinic: 'Phòng khám Đa khoa Tâm An', reason: 'Khám tổng quát giúp định hướng nguyên nhân ban đầu.' }
      beginAssessmentFlow({ title: reply, ...recommendation })
      return
    }
    if (reply === 'Tư vấn bác sĩ') {
      setMessages((current) => [...current, { from: 'user', text: reply }])
      transferToDoctor()
      return
    }
    if (reply === 'Đặt lịch khám') {
      setMessages((current) => [...current, { from: 'user', text: reply }])
      goToBooking()
      return
    }
    if (reply === 'Tôi muốn mô tả thêm') {
      setMessages((current) => [...current, { from: 'user', text: reply }])
      addBot('Bạn có thể mô tả thêm: vị trí đau, thời điểm bắt đầu, mức độ đau và các dấu hiệu đi kèm như sốt, khó thở, chóng mặt hoặc tê yếu.')
      return
    }
    if (pendingAssessment && durationReplies.includes(reply)) {
      setMessages((current) => [...current, { from: 'user', text: reply }])
      setPendingDuration(reply)
      addBot('Mức độ hiện tại thế nào? Có dấu hiệu nguy hiểm như khó thở, đau ngực, tê yếu hoặc ngất không?', severityReplies)
      return
    }
    if (pendingAssessment && severityReplies.includes(reply)) {
      setMessages((current) => [...current, { from: 'user', text: reply }])
      const hasDangerSign = urgentReplies.includes(reply)
      const nextLevel = hasDangerSign ? 'urgent' : reply === 'Vừa' && pendingAssessment.level === 'routine' ? 'watch' : pendingAssessment.level
      showRecommendation({
        ...pendingAssessment,
        level: nextLevel,
        reason: `${pendingAssessment.reason} Thời gian: ${pendingDuration || 'chưa rõ'}. Mức độ/dấu hiệu: ${reply}.`,
      })
      setPendingAssessment(null)
      setPendingDuration('')
      return
    }
    setMessages((current) => [...current, { from: 'user', text: reply }])
    if (durationReplies.includes(reply)) {
      addBot('Mức độ triệu chứng hiện tại của bạn như thế nào?', severityReplies)
      return
    }
    if (urgentReplies.includes(reply)) {
      showRecommendation({
        title: 'Triệu chứng cần đánh giá sớm',
        level: 'urgent',
        specialty: 'Nội tổng quát',
        clinic: 'Phòng khám Đa khoa Tâm An',
        reason: 'Có dấu hiệu đi kèm cần bác sĩ phân loại nguy cơ và tư vấn sớm.',
      })
      return
    }
    addBot('Cảm ơn bạn, tôi đã ghi nhận. Nếu triệu chứng tăng lên hoặc có dấu hiệu bất thường, bạn nên chuyển sang tư vấn trực tuyến với bác sĩ.')
  }

  function beginAssessmentFlow(nextAssessment) {
    setAssessment(null)
    setPendingAssessment(nextAssessment)
    setPendingDuration('')
    addBot('Tôi cần hỏi thêm một chút để phân loại chính xác hơn. Triệu chứng bắt đầu từ khi nào?', durationReplies)
  }

  function showRecommendation(nextAssessment) {
    const meta = levelMeta[nextAssessment.level] ?? levelMeta.routine
    setAssessment({ ...nextAssessment, meta })
    addBot(`${meta.label}: ${meta.description}`, ['Tư vấn bác sĩ', 'Đặt lịch khám', 'Tôi muốn mô tả thêm'])
  }

  function sendMessage() {
    if (!input.trim() && !attachment) return
    const text = input.trim() || `Đã gửi hình ảnh: ${attachment}`
    setMessages((current) => [...current, { from: 'user', text }])
    setInput('')
    setAttachment('')
    if (pendingAssessment) {
      addBot('Tôi đã ghi nhận mô tả thêm. Triệu chứng bắt đầu từ khi nào?', durationReplies)
      return
    }
    if (text.toLowerCase().includes('đau')) {
      setShowBodyMap(true)
      setAssessment(null)
      setPendingAssessment(null)
      addBot('Bạn có thể chọn vùng đau gần đúng bên dưới hoặc tiếp tục nhập mô tả nếu vị trí không có trong danh sách.')
    } else {
      setPendingAssessment({
        title: text,
        level: 'routine',
        specialty: 'Nội tổng quát',
        clinic: 'Phòng khám Đa khoa Tâm An',
        reason: 'Triệu chứng do bệnh nhân tự mô tả cần được hỏi thêm để phân loại.',
      })
      addBot('Cảm ơn bạn. Bạn vui lòng cho biết triệu chứng bắt đầu từ khi nào?', durationReplies)
    }
  }

  function transferToDoctor() {
    setShowPriceModal(true)
  }

  function confirmTransfer() {
    setShowPriceModal(false)
    localStorage.setItem('medconsult-doctor-request', 'active')
    navigate('/patient/consult')
  }

  const getSpecialtyAndPrice = () => {
    const spec = assessment?.specialty || pendingAssessment?.specialty || 'Nội tổng quát'
    const prices = {
      'Tim mạch': '350.000đ',
      'Thần kinh': '300.000đ',
      'Nhi khoa': '220.000đ',
      'Tiêu hóa': '250.000đ',
      'Tai Mũi Họng': '220.000đ',
      'Hô hấp': '250.000đ',
      'Cơ xương khớp': '280.000đ',
      'Da liễu': '240.000đ',
      'Nội tổng quát': '200.000đ',
    }
    return {
      specialty: spec,
      price: prices[spec] || '200.000đ'
    }
  }

  function goToBooking() {
    let bookingSuggestion = null
    if (assessment) {
      bookingSuggestion = {
        specialty: assessment.specialty,
        clinic: assessment.clinic,
        reason: assessment.title,
      }
      localStorage.setItem('medconsult-booking-suggestion', JSON.stringify(bookingSuggestion))
    }
    navigate('/patient/booking', { state: { bookingSuggestion } })
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
                  <div>
                    <b>Chọn vùng đau gần đúng</b>
                    <p>Nếu không có lựa chọn phù hợp, hãy chọn “Vị trí khác” hoặc nhập mô tả chi tiết vào ô chat.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {painAreas.map((area) => <button key={area.id} className="symptom-chip" onClick={() => choosePainArea(area)}>{area.label}</button>)}
                      <button className="symptom-chip" onClick={() => choosePainArea('other')}>Vị trí khác</button>
                    </div>
                  </div>
                </div>
              )}
              {assessment && (
                <div className={`chat-assessment ${assessment.meta.tone}`}>
                  <div className="chat-assessment-head">
                    <span><AlertTriangle size={18} /></span>
                    <div>
                      <small>Đánh giá sơ bộ</small>
                      <h3>{assessment.meta.label}</h3>
                    </div>
                  </div>
                  <p>{assessment.meta.description}</p>
                  <div className="chat-assessment-grid">
                    <span>
                      <Stethoscope size={16} />
                      <small>Chuyên khoa gợi ý</small>
                      <b>{assessment.specialty}</b>
                    </span>
                    <span>
                      <MapPin size={16} />
                      <small>Cơ sở phù hợp</small>
                      <b>{assessment.clinic}</b>
                    </span>
                    <span>
                      <CalendarDays size={16} />
                      <small>Lý do</small>
                      <b>{assessment.reason}</b>
                    </span>
                    <span>
                      <AlertTriangle size={16} />
                      <small>Hướng xử trí</small>
                      <b>{assessment.meta.action}</b>
                    </span>
                  </div>
                  <div className="chat-assessment-actions">
                    <Button onClick={transferToDoctor}><Stethoscope size={17} /> Tư vấn bác sĩ</Button>
                    <Button variant="outline" onClick={goToBooking}><CalendarDays size={17} /> Đặt lịch khám</Button>
                  </div>
                </div>
              )}
            </div>
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

      {showPriceModal && (
        <div className="modal-backdrop" style={{ zIndex: 160 }} onClick={() => setShowPriceModal(false)}>
          <Card className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', height: '48px', width: '48px', placeItems: 'center', borderRadius: '50%', background: '#f0fdfa', color: '#0d9488' }}>
                <Stethoscope size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Báo giá Tư vấn Bác sĩ</h2>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Tư vấn trực tuyến 1-1 bảo mật</p>
              </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#334155' }}>
              <div style={{ borderRadius: '12px', background: '#f8fafc', padding: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Chuyên khoa:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>{getSpecialtyAndPrice().specialty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Phí tư vấn từ xa:</span>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#0f766e' }}>{getSpecialtyAndPrice().price}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><Clock size={14} style={{ color: '#94a3b8' }} /> Bác sĩ phản hồi trong vòng ~5 phút</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><Video size={14} style={{ color: '#94a3b8' }} /> Cuộc gọi Video & Chat trực tuyến (20-30 phút)</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><ShieldCheck size={14} style={{ color: '#94a3b8' }} /> Hồ sơ tư vấn được bảo mật & mã hóa y tế</p>
              </div>

              <div style={{ borderRadius: '8px', background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', fontSize: '12px', color: '#b45309', lineHeight: '1.5' }}>
                <strong>Lưu ý:</strong> Bằng cách nhấn "Chấp nhận", bạn đồng ý chuyển tiếp thông tin triệu chứng hiện tại để kết nối với bác sĩ tư vấn của hệ thống.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button variant="outline" style={{ flex: 1, minHeight: '40px', justifyContent: 'center' }} onClick={() => setShowPriceModal(false)}>Hủy bỏ</Button>
              <Button style={{ flex: 1, minHeight: '40px', justifyContent: 'center' }} onClick={confirmTransfer}>Chấp nhận & Tiếp tục</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
