import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  HeartPulse,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Clock,
  ShieldCheck,
  Video,
} from 'lucide-react'
import { Button, Card } from './ui.jsx'

const quickActions = [
  'Sốt / Ớn lạnh',
  'Đau đầu / Chóng mặt',
  'Ho / Sổ mũi',
  'Đau bụng',
  'Đau ngực / Khó thở',
  'Mệt mỏi',
  'Vấn đề khác',
]

const followUpOptions = ['Nhẹ, vẫn sinh hoạt được', 'Kéo dài hoặc tăng dần', 'Đau nhiều / khó chịu rõ', 'Có dấu hiệu bất thường']

const recommendations = {
  cardiac: {
    specialty: 'Tim mạch',
    clinic: 'Phòng khám Tim mạch An Bình',
    address: '81 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    eta: 'Khoảng 2,4 km · 8 phút di chuyển',
    reason: 'Phù hợp với triệu chứng đau ngực / khó thở.',
  },
  neurology: {
    specialty: 'Thần kinh',
    clinic: 'Phòng khám Đa khoa Tâm An',
    address: '12 Võ Văn Tần, Quận 3, TP.HCM',
    eta: 'Khoảng 1,2 km · 5 phút di chuyển',
    reason: 'Có bác sĩ phù hợp để đánh giá đau đầu hoặc chóng mặt kéo dài.',
  },
  general: {
    specialty: 'Nội tổng quát',
    clinic: 'MedCare Family Clinic',
    address: '44 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    eta: 'Khoảng 3,1 km · 10 phút di chuyển',
    reason: 'Phù hợp để đánh giá triệu chứng ban đầu và điều phối chuyên khoa.',
  },
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
}

function assessSymptoms(value) {
  const text = normalizeText(value)
  const emergency = [
    'ngat',
    'bat tinh',
    'kho tho du doi',
    'khong tho duoc',
    'dau nguc du doi',
    'co giat',
    'tim tai',
    'liet',
  ].some((keyword) => text.includes(keyword))

  if (emergency) return { level: 'Khẩn cấp', tone: 'emergency', recommendation: recommendations.cardiac }

  const cardiac = text.includes('dau nguc') || text.includes('kho tho')
  if (cardiac) return { level: 'Nên khám sớm', tone: 'serious', recommendation: recommendations.cardiac }

  const neurology = text.includes('dau dau') || text.includes('chong mat')
  const needsMonitoring = ['keo dai', 'tang dan', 'dau nhieu', 'bat thuong', 'tren 3 ngay'].some((keyword) => text.includes(keyword))
  if (neurology && needsMonitoring) return { level: 'Nên khám sớm', tone: 'serious', recommendation: recommendations.neurology }
  if (needsMonitoring || text.includes('sot') || text.includes('met moi')) {
    return { level: 'Cần theo dõi', tone: 'watch', recommendation: recommendations.general }
  }
  return { level: 'Nhẹ', tone: 'mild', recommendation: recommendations.general }
}

const initialMessages = [
  {
    from: 'bot',
    text: 'Xin chào, tôi là trợ lý sức khỏe MedConsult. Hôm nay bạn đang gặp vấn đề gì?',
  },
]

export function LandingHealthChat({ onBookAppointment, onViewClinic }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [fabReady, setFabReady] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [selectedSymptom, setSelectedSymptom] = useState('')
  const [assessment, setAssessment] = useState(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const chatBodyRef = useRef(null)

  const getSpecialtyAndPrice = () => {
    const spec = assessment?.recommendation?.specialty || 'Nội tổng quát'
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

  function confirmTransfer() {
    setShowPriceModal(false)
    localStorage.setItem('medconsult-doctor-request', 'active')
    navigate('/login/patient')
  }
  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const fabTimerRef = useRef(null)
  const focusInput = useCallback((node) => {
    inputRef.current = node
    node?.focus()
  }, [])

  useEffect(() => {
    fabTimerRef.current = window.setTimeout(() => setFabReady(true), 1000)
    return () => {
      window.clearTimeout(timerRef.current)
      window.clearTimeout(fabTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const body = chatBodyRef.current
    if (body) body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, assessment])

  function addBot(text, nextAssessment = null) {
    setTyping(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, { from: 'bot', text }])
      setAssessment(nextAssessment)
      setTyping(false)
    }, 520)
  }

  function chooseSymptom(symptom) {
    if (typing) return
    setSelectedSymptom(symptom)
    setAssessment(null)
    setMessages((current) => [...current, { from: 'user', text: symptom }])
    addBot('Tôi đã ghi nhận. Bạn mô tả thêm mức độ, thời gian kéo dài hoặc triệu chứng đi kèm nhé.')
  }

  function submitMessage(value = input) {
    const text = value.trim()
    if (!text || typing) return
    const nextAssessment = assessSymptoms(`${selectedSymptom} ${text}`)
    setInput('')
    setMessages((current) => [...current, { from: 'user', text }])
    addBot(
      nextAssessment.tone === 'emergency'
        ? 'Dựa trên mô tả của bạn, ưu tiên hiện tại là liên hệ cấp cứu hoặc đến cơ sở y tế gần nhất.'
        : `Tôi đã phân loại sơ bộ ở mức “${nextAssessment.level}”. Bạn có thể xem khuyến nghị phù hợp bên dưới.`,
      nextAssessment,
    )
  }

  function continueConsultation() {
    setAssessment(null)
    addBot('Bạn có thể cho tôi biết triệu chứng bắt đầu từ khi nào và có thay đổi khi nghỉ ngơi hoặc vận động không?')
  }

  function bookAppointment() {
    onBookAppointment(assessment?.recommendation || recommendations.general)
    setOpen(false)
  }

  function openChat() {
    setHasOpened(true)
    setOpen(true)
  }

  const recommendation = assessment?.recommendation

  return (
    <div className="landing-health-chat">
      {open ? (
        <section className="landing-chat-panel" aria-label="Chatbox AI tư vấn sức khỏe">
          <header className="landing-chat-header">
            <span className="landing-chat-avatar"><Bot size={21} /></span>
            <div>
              <h2>Trợ lý MedConsult</h2>
              <p><i /> Đang hoạt động</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Thu nhỏ chatbox"><ChevronDown size={20} /></button>
          </header>

          <div className="landing-chat-warning">
            <ShieldAlert size={16} />
            <span>Chatbot hỗ trợ khảo sát ban đầu, không thay thế bác sĩ. Cấp cứu: gọi 115.</span>
          </div>

          <div className="landing-chat-body" ref={chatBodyRef}>
            {messages.map((message, index) => (
              <div className={`landing-chat-message ${message.from === 'user' ? 'mine' : ''}`} key={`${message.text}-${index}`}>
                <div>{message.text}</div>
              </div>
            ))}

            {!selectedSymptom && (
              <div className="landing-chat-quick-actions">
                {quickActions.map((action) => <button type="button" key={action} onClick={() => chooseSymptom(action)}>{action}</button>)}
              </div>
            )}

            {selectedSymptom && !assessment && !typing && (
              <div className="landing-chat-quick-actions is-follow-up">
                {followUpOptions.map((option) => <button type="button" key={option} onClick={() => submitMessage(option)}>{option}</button>)}
              </div>
            )}

            {typing && (
              <div className="landing-chat-typing">
                <span><i /><i /><i /></span>
                Trợ lý đang phân tích...
              </div>
            )}

            {assessment?.tone === 'emergency' && (
              <article className="landing-chat-emergency">
                <div><AlertTriangle size={20} /><strong>Khẩn cấp</strong></div>
                <p>Triệu chứng có thể nghiêm trọng. Vui lòng gọi cấp cứu 115 hoặc đến cơ sở y tế gần nhất ngay.</p>
                <div>
                  <a href="tel:115"><Phone size={16} /> Gọi 115</a>
                  <button type="button" onClick={() => onViewClinic(recommendation)}><Navigation size={16} /> Tìm cơ sở gần nhất</button>
                </div>
              </article>
            )}

            {assessment && assessment.tone !== 'emergency' && (
              <>
                <div className={`landing-chat-level is-${assessment.tone}`}>
                  <HeartPulse size={16} />
                  Mức độ sơ bộ: <strong>{assessment.level}</strong>
                </div>

                {assessment.tone === 'serious' && (
                  <article className="landing-chat-recommendation">
                    <div className="landing-chat-recommendation-head">
                      <span><AlertTriangle size={19} /></span>
                      <div>
                        <strong>Khuyến nghị khám sớm</strong>
                        <p>Triệu chứng của bạn có dấu hiệu cần được bác sĩ đánh giá sớm.</p>
                      </div>
                    </div>
                    <dl>
                      <div><dt>Chuyên khoa gợi ý</dt><dd>{recommendation.specialty}</dd></div>
                      <div><dt>Cơ sở gợi ý</dt><dd>{recommendation.clinic}</dd></div>
                      <div><dt>Địa chỉ</dt><dd>{recommendation.address}</dd></div>
                      <div><dt>Thời gian dự kiến</dt><dd>{recommendation.eta}</dd></div>
                      <div><dt>Lý do</dt><dd>{recommendation.reason}</dd></div>
                    </dl>
                    <button className="landing-chat-clinic-detail" type="button" onClick={() => onViewClinic(recommendation)}>
                      <Building2 size={15} /> Xem chi tiết cơ sở <ExternalLink size={14} />
                    </button>
                  </article>
                )}

                <article className="landing-chat-booking-prompt">
                  <div><Sparkles size={16} /> Bạn muốn kết nối tư vấn với bác sĩ hay đặt lịch khám tại phòng khám?</div>
                  <button type="button" onClick={() => setShowPriceModal(true)}><Stethoscope size={15} /> Tư vấn bác sĩ ngay <ArrowRight size={15} /></button>
                  <button type="button" onClick={bookAppointment}><CalendarDays size={15} /> Đặt lịch khám tại cơ sở <ArrowRight size={15} /></button>
                  <button type="button" onClick={continueConsultation} style={{ border: 'none', background: 'transparent', color: '#4b5563', textDecoration: 'underline', cursor: 'pointer', minHeight: 'auto', padding: '4px', marginTop: '4px' }}>Tiếp tục tư vấn AI</button>
                </article>
              </>
            )}
          </div>

          <form className="landing-chat-input" onSubmit={(event) => { event.preventDefault(); submitMessage() }}>
            <input ref={focusInput} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Mô tả triệu chứng của bạn..." />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Gửi tin nhắn">
              <Send size={17} />
            </button>
          </form>
        </section>
      ) : fabReady ? (
        <button className="landing-chat-fab" type="button" onClick={openChat} aria-label="Mở chatbox tư vấn sức khỏe">
          <MessageCircle className="landing-chat-fab-icon" size={25} />
          <span>Tư vấn AI</span>
          {!hasOpened && <i className="landing-chat-notification" aria-label="Có hỗ trợ mới" />}
        </button>
      ) : null}

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
                <strong>Lưu ý:</strong> Bằng cách nhấn "Chấp nhận", bạn đồng ý chuyển tiếp thông tin triệu chứng hiện tại để kết nối với bác sĩ. Bạn cần đăng nhập để tiếp tục.
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
    </div>
  )
}
