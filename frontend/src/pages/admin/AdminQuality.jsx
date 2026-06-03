import { createElement, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  FileText,
  MessageCircle,
  RefreshCw,
  Reply,
  Send,
  Star,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import { AppShell, TopBar } from '../../components/ui.jsx'

const clinics = ['Tất cả cơ sở y tế', 'Phòng khám Đa khoa Tâm An', 'Phòng khám Tim mạch An Bình', 'MedCare Family Clinic']
const specialties = ['Tất cả chuyên khoa', 'Nội tổng quát', 'Tim mạch', 'Nhi khoa', 'Da liễu']

const qualityStats = [
  { label: 'Điểm hài lòng', value: '4.8/5', delta: '+0.2', note: 'so với kỳ trước', icon: Star, tone: 'teal', trend: [35, 43, 39, 55, 62, 68, 74] },
  { label: 'Thời gian xử lý', value: '18 phút', delta: '-3 phút', note: 'nhanh hơn kỳ trước', icon: Clock3, tone: 'blue', trend: [72, 65, 68, 57, 53, 48, 42], trendDown: true },
  { label: 'Tỷ lệ hoàn tất', value: '92%', delta: '+4%', note: 'so với kỳ trước', icon: CheckCircle2, tone: 'green', trend: [45, 49, 58, 55, 67, 72, 79] },
  { label: 'Khiếu nại', value: '12', delta: '-18%', note: 'giảm so với kỳ trước', icon: AlertTriangle, tone: 'amber', trend: [74, 68, 61, 58, 47, 43, 36], trendDown: true },
]

const trendRanges = {
  '7 ngày': {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    rating: [4.52, 4.63, 4.59, 4.72, 4.68, 4.76, 4.8],
    completed: [84, 86, 88, 87, 90, 91, 92],
    duration: [24, 22, 23, 21, 20, 19, 18],
  },
  '30 ngày': {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Hiện tại'],
    rating: [4.48, 4.56, 4.65, 4.72, 4.8],
    completed: [82, 85, 87, 89, 92],
    duration: [26, 24, 22, 20, 18],
  },
  '90 ngày': {
    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
    rating: [4.31, 4.39, 4.48, 4.59, 4.7, 4.8],
    completed: [78, 80, 83, 86, 89, 92],
    duration: [29, 27, 25, 23, 21, 18],
  },
}

const ratingBreakdown = [
  { stars: 5, value: 92, color: '#0f766e' },
  { stars: 4, value: 78, color: '#22c55e' },
  { stars: 3, value: 42, color: '#eab308' },
  { stars: 2, value: 18, color: '#f97316' },
  { stars: 1, value: 4, color: '#ef4444' },
]

const reviews = [
  { id: 'PH-001', name: 'Nguyễn Minh Anh', avatar: 'MA', spec: 'Nội tổng quát', doctor: 'BS. Nguyễn Văn Minh', visitDate: '01/06/2026 · 08:30', date: 'Hôm nay, 09:45', daysAgo: 0, rating: 5, helpful: 12, status: 'Đã ghi nhận', text: 'Bác sĩ tư vấn kỹ, giải thích rõ ràng và nhiệt tình. Quy trình tiếp nhận nhanh hơn tôi mong đợi.', replies: [] },
  { id: 'PH-002', name: 'Trần Hoàng Nam', avatar: 'HN', spec: 'Nhi khoa', doctor: 'BS. Đỗ Gia Huy', visitDate: '31/05/2026 · 15:30', date: 'Hôm qua, 16:20', daysAgo: 1, rating: 5, helpful: 8, status: 'Đã phản hồi', text: 'Lịch khám đúng giờ, nhân viên hướng dẫn chu đáo. Bé nhà tôi cảm thấy rất thoải mái.', replies: ['Cảm ơn anh đã chia sẻ. MedConsult rất vui khi bé có trải nghiệm thoải mái tại phòng khám.'] },
  { id: 'PH-003', name: 'Lê Thu Hà', avatar: 'TH', spec: 'Tim mạch', doctor: 'BS. Trần Thị Hoa', visitDate: '28/05/2026 · 10:00', date: '28/05/2026', daysAgo: 4, rating: 4, helpful: 5, status: 'Cần theo dõi', text: 'Bác sĩ chuyên môn tốt và giải thích dễ hiểu. Cần cải thiện tốc độ phản hồi lúc cao điểm.', replies: [] },
]

const doctors = [
  { rank: 1, name: 'BS. Nguyễn Văn Minh', avatar: 'NM', spec: 'Nội tổng quát', rating: 4.9, reviews: '1.240' },
  { rank: 2, name: 'BS. Trần Thị Hoa', avatar: 'TH', spec: 'Tim mạch', rating: 4.8, reviews: '986' },
  { rank: 3, name: 'BS. Phạm Ngọc Lan', avatar: 'NL', spec: 'Da liễu', rating: 4.8, reviews: '814' },
  { rank: 4, name: 'BS. Lê Quốc Anh', avatar: 'QA', spec: 'Tai mũi họng', rating: 4.7, reviews: '760' },
  { rank: 5, name: 'BS. Đỗ Gia Huy', avatar: 'GH', spec: 'Nhi khoa', rating: 4.7, reviews: '692' },
]

const alerts = [
  { tone: 'danger', clinic: 'Tim mạch An Bình', detail: 'Điểm đánh giá giảm 12% trong 7 ngày gần đây.', time: '18 phút trước' },
  { tone: 'warning', clinic: 'Nội tổng quát', detail: 'Thời gian xử lý trung bình tăng 20% vào giờ cao điểm.', time: '45 phút trước' },
  { tone: 'success', clinic: 'Nhi khoa', detail: 'Hiệu suất ổn định, tỷ lệ hoàn tất đạt 96%.', time: '2 giờ trước' },
]

function MiniSparkline({ values }) {
  const points = values.map((value, index) => `${index * 20},${36 - value * .34}`).join(' ')
  return <svg className="quality-sparkline" viewBox="0 0 120 42" aria-hidden="true"><polyline points={points} /></svg>
}

function Stars({ value = 5, size = 13 }) {
  return <span className="quality-stars">{Array.from({ length: 5 }).map((_, index) => <Star fill={index < value ? 'currentColor' : 'none'} key={index} size={size} />)}</span>
}

export function AdminQuality() {
  const [range, setRange] = useState('30 ngày')
  const [clinic, setClinic] = useState(clinics[0])
  const [specialty, setSpecialty] = useState(specialties[0])
  const [notice, setNotice] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [reviewItems, setReviewItems] = useState(reviews)
  const [replyReview, setReplyReview] = useState(null)
  const [detailReview, setDetailReview] = useState(null)
  const [allReviewsOpen, setAllReviewsOpen] = useState(false)
  const [doctorReportOpen, setDoctorReportOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [reviewFilters, setReviewFilters] = useState({ stars: 'Tất cả số sao', specialty: 'Tất cả chuyên khoa', doctor: 'Tất cả bác sĩ', time: 'Tất cả thời gian' })

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  function refreshData() {
    setRefreshing(true)
    window.setTimeout(() => {
      setRefreshing(false)
      showNotice('Dữ liệu chất lượng đã được làm mới.')
    }, 650)
  }

  function markHelpful(review) {
    setReviewItems((items) => items.map((item) => item.id === review.id
      ? { ...item, helpful: Math.max(0, item.helpful + (item.isHelpful ? -1 : 1)), isHelpful: !item.isHelpful }
      : item))
    showNotice(review.isHelpful ? 'Đã thu hồi đánh dấu hữu ích' : 'Đã đánh dấu phản hồi là hữu ích')
  }

  function openReply(review) {
    setReplyReview(review)
    setReplyText('')
  }

  function openReviewDetail(review) {
    setDetailReview(review)
    showNotice('Đã mở chi tiết phản hồi')
  }

  function openAllReviews() {
    setAllReviewsOpen(true)
    showNotice('Đã mở danh sách toàn bộ phản hồi')
  }

  function openDoctorReport() {
    setDoctorReportOpen(true)
    showNotice('Đã mở báo cáo bác sĩ')
  }

  function sendReply(event) {
    event.preventDefault()
    if (!replyText.trim()) {
      showNotice('Vui lòng nhập nội dung phản hồi')
      return
    }
    setSubmittingReply(true)
    window.setTimeout(() => {
      setReviewItems((items) => items.map((item) => item.id === replyReview.id ? { ...item, status: 'Đã phản hồi', replies: [...item.replies, replyText.trim()] } : item))
      setSubmittingReply(false)
      setReplyReview(null)
      setReplyText('')
      showNotice('Đã gửi phản hồi')
    }, 650)
  }

  const filteredReviews = reviewItems.filter((review) => (
    (reviewFilters.stars === 'Tất cả số sao' || `${review.rating} sao` === reviewFilters.stars)
    && (reviewFilters.specialty === 'Tất cả chuyên khoa' || review.spec === reviewFilters.specialty)
    && (reviewFilters.doctor === 'Tất cả bác sĩ' || review.doctor === reviewFilters.doctor)
    && (reviewFilters.time === 'Tất cả thời gian' || review.daysAgo <= Number(reviewFilters.time.split(' ')[0]))
  ))

  return (
    <AppShell role="admin">
      <TopBar />
      <main className="content-wide quality-page">
        <header className="quality-page-head">
          <div>
            <p className="quality-breadcrumb">Admin <span>/</span> Báo cáo chất lượng</p>
            <h1>Báo cáo chất lượng ca khám</h1>
            <p>Theo dõi mức độ hài lòng, chất lượng phục vụ và hiệu suất khám chữa bệnh.</p>
          </div>
          <div className="quality-head-actions">
            <button onClick={() => showNotice('Đang chuẩn bị báo cáo PDF.')} type="button"><FileText size={16} /> Xuất PDF</button>
            <button onClick={() => showNotice('Đang chuẩn bị file Excel.')} type="button"><FileSpreadsheet size={16} /> Xuất Excel</button>
            <button className="is-primary" onClick={() => showNotice('Báo cáo mới đã được tạo.')} type="button"><Download size={16} /> Tạo báo cáo</button>
          </div>
        </header>

        {notice && <div className="quality-toast"><CheckCircle2 size={17} /> {notice}</div>}

        <section className="quality-filter-card">
          <div className="quality-filter-head"><div><Activity size={18} /><span>Bộ lọc báo cáo</span></div><small>Cập nhật gần nhất: Hôm nay, 10:45</small></div>
          <div className="quality-filter-grid">
            <label><span>Cơ sở y tế</span><select value={clinic} onChange={(event) => setClinic(event.target.value)}>{clinics.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Chuyên khoa</span><select value={specialty} onChange={(event) => setSpecialty(event.target.value)}>{specialties.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Khoảng thời gian</span><select value={range} onChange={(event) => setRange(event.target.value)}>{Object.keys(trendRanges).map((item) => <option key={item}>{item} gần đây</option>)}</select></label>
            <button className="quality-refresh-btn" disabled={refreshing} onClick={refreshData} type="button"><RefreshCw className={refreshing ? 'is-spinning' : ''} size={16} /> {refreshing ? 'Đang làm mới' : 'Làm mới dữ liệu'}</button>
          </div>
        </section>

        <section className="quality-kpi-grid">
          {qualityStats.map(({ delta, icon: Icon, label, note, tone, trend, trendDown, value }) => (
            <article className={`quality-kpi is-${tone}`} key={label}>
              <div className="quality-kpi-top"><span>{createElement(Icon, { size: 19 })}</span><MiniSparkline values={trend} /></div>
              <p>{label}</p>
              <strong>{value}</strong>
              <small>{trendDown ? <TrendingDown size={13} /> : <TrendingUp size={13} />} {delta} <em>{note}</em></small>
            </article>
          ))}
        </section>

        <QualityTrend range={range} setRange={setRange} />

        <section className="quality-middle-grid">
          <RatingAnalytics />
          <QualityAlerts />
        </section>

        <section className="quality-bottom-grid">
          <RecentReviews onAll={openAllReviews} onDetail={openReviewDetail} onHelpful={markHelpful} onReply={openReply} reviews={reviewItems} />
          <TopDoctors onReport={openDoctorReport} />
        </section>
      </main>
      {replyReview && <ReplyModal onClose={() => setReplyReview(null)} onSubmit={sendReply} review={replyReview} setText={setReplyText} submitting={submittingReply} text={replyText} />}
      {detailReview && <ReviewDetailDrawer onClose={() => setDetailReview(null)} review={reviewItems.find((item) => item.id === detailReview.id) ?? detailReview} />}
      {allReviewsOpen && <AllReviewsModal filters={reviewFilters} onClose={() => setAllReviewsOpen(false)} onFilters={setReviewFilters} reviews={filteredReviews} />}
      {doctorReportOpen && <DoctorReportModal onClose={() => setDoctorReportOpen(false)} reviews={reviewItems} />}
    </AppShell>
  )
}

function QualityTrend({ range, setRange }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const data = trendRanges[range]
  const width = 760
  const left = 44
  const right = 18
  const bottom = 186
  const chartHeight = 124
  const x = (index) => left + index * ((width - left - right) / (data.labels.length - 1))
  const yRating = (value) => bottom - ((value - 4) / 1) * chartHeight
  const yCompleted = (value) => bottom - ((value - 70) / 30) * chartHeight
  const yDuration = (value) => bottom - ((32 - value) / 20) * chartHeight
  const path = (values, y) => values.map((value, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(value)}`).join(' ')

  return (
    <section className="quality-chart-card">
      <header className="quality-card-head">
        <div><span>QUALITY ANALYTICS</span><h2>Xu hướng chất lượng</h2><p>So sánh mức độ hài lòng, tỷ lệ hoàn tất và thời gian xử lý.</p></div>
        <div className="quality-range-tabs">{Object.keys(trendRanges).map((item) => <button className={range === item ? 'is-active' : ''} key={item} onClick={() => { setActiveIndex(null); setRange(item) }} type="button">{item}</button>)}</div>
      </header>
      <div className="quality-chart-legend"><span><i className="is-teal" /> Điểm đánh giá</span><span><i className="is-blue" /> Tỷ lệ hoàn tất</span><span><i className="is-amber" /> Thời gian xử lý</span></div>
      <div className="quality-trend-chart">
        <svg viewBox="0 0 760 224" role="img" aria-label="Biểu đồ xu hướng chất lượng">
          {[4, 4.25, 4.5, 4.75, 5].map((value) => {
            const y = yRating(value)
            return <g className="quality-chart-grid" key={value}><line x1={left} x2={width - right} y1={y} y2={y} /><text x="36" y={y + 3}>{value.toFixed(1)}</text></g>
          })}
          <path className="quality-area" d={`${path(data.rating, yRating)} L ${x(data.rating.length - 1)} ${bottom} L ${x(0)} ${bottom} Z`} />
          <path className="quality-line is-teal" d={path(data.rating, yRating)} />
          <path className="quality-line is-blue" d={path(data.completed, yCompleted)} />
          <path className="quality-line is-amber" d={path(data.duration, yDuration)} />
          {data.labels.map((label, index) => (
            <g className={`quality-chart-point ${activeIndex === null || activeIndex === index ? 'is-active' : 'is-muted'}`} key={label} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
              <title>{`${label}: ${data.rating[index]}/5 · ${data.completed[index]}% hoàn tất · ${data.duration[index]} phút xử lý`}</title>
              <circle className="is-teal" cx={x(index)} cy={yRating(data.rating[index])} r={activeIndex === index ? '6' : '4'} />
              <circle className="is-blue" cx={x(index)} cy={yCompleted(data.completed[index])} r={activeIndex === index ? '6' : '4'} />
              <circle className="is-amber" cx={x(index)} cy={yDuration(data.duration[index])} r={activeIndex === index ? '6' : '4'} />
              <text className="quality-chart-x" textAnchor="middle" x={x(index)} y="212">{label}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}

function RatingAnalytics() {
  return (
    <section className="quality-rating-card">
      <header className="quality-card-head"><div><span>PATIENT SENTIMENT</span><h2>Phân bố đánh giá</h2><p>Tổng hợp 3.482 phản hồi đã xác thực.</p></div></header>
      <div className="quality-rating-body">
        <div className="quality-donut">
          <div><strong>4.8</strong><Stars value={5} size={11} /><small>Average Rating</small></div>
        </div>
        <div className="quality-rating-bars">
          {ratingBreakdown.map((item) => <div key={item.stars}><span>{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</span><i><b style={{ background: item.color, width: `${item.value}%` }} /></i><strong>{item.value}%</strong></div>)}
        </div>
      </div>
    </section>
  )
}

function QualityAlerts() {
  return (
    <section className="quality-alert-card">
      <header className="quality-card-head"><div><span>REAL-TIME MONITORING</span><h2>Cảnh báo chất lượng</h2><p>Các biến động cần quản trị viên theo dõi.</p></div><AlertTriangle size={21} /></header>
      <div className="quality-alert-list">
        {alerts.map((alert) => <article className={`is-${alert.tone}`} key={alert.clinic}><i /><div><h3>{alert.clinic}</h3><p>{alert.detail}</p><small>{alert.time}</small></div><button title="Xem chi tiết" type="button"><ArrowUpRight size={15} /></button></article>)}
      </div>
    </section>
  )
}

function RecentReviews({ onAll, onDetail, onHelpful, onReply, reviews }) {
  return (
    <section className="quality-review-section">
      <header className="quality-card-head"><div><span>PATIENT FEEDBACK</span><h2>Phản hồi gần đây</h2><p>Nhận xét mới nhất từ bệnh nhân sau khi hoàn tất ca khám.</p></div><button onClick={onAll} type="button">Xem tất cả <ArrowUpRight size={14} /></button></header>
      <div className="quality-review-list">
        {reviews.map((review) => <article key={review.id}><div className="quality-review-top"><span className="quality-avatar">{review.avatar}</span><div><h3>{review.name}</h3><p>{review.spec} · {review.date}</p></div><Stars value={review.rating} /></div><blockquote>“{review.text}”</blockquote>{review.replies.length > 0 && <div className="quality-admin-reply"><b>Phản hồi từ MedConsult</b><p>{review.replies.at(-1)}</p></div>}<footer><button className={review.isHelpful ? 'is-active' : ''} onClick={() => onHelpful(review)} type="button"><ThumbsUp fill={review.isHelpful ? 'currentColor' : 'none'} size={14} /> {review.isHelpful ? 'Đã hữu ích' : 'Hữu ích'} <small>{review.helpful}</small></button><button onClick={() => onReply(review)} type="button"><Reply size={14} /> Phản hồi</button><button onClick={() => onDetail(review)} type="button"><ArrowUpRight size={14} /> Chi tiết</button></footer></article>)}
      </div>
    </section>
  )
}

function TopDoctors({ onReport }) {
  return (
    <section className="quality-doctors-card">
      <header className="quality-card-head"><div><span>TOP PERFORMANCE</span><h2>Bác sĩ được đánh giá cao</h2><p>Xếp hạng dựa trên phản hồi đã xác thực.</p></div><Award size={22} /></header>
      <div className="quality-doctor-list">
        {doctors.map((doctor) => <article key={doctor.name}><strong>#{doctor.rank}</strong><span className="quality-avatar">{doctor.avatar}</span><div><h3>{doctor.name}</h3><p>{doctor.spec}</p></div><em><Star fill="currentColor" size={13} /> {doctor.rating}<small>{doctor.reviews} đánh giá</small></em></article>)}
      </div>
      <button className="quality-doctor-more" onClick={onReport} type="button"><MessageCircle size={15} /> Xem báo cáo bác sĩ</button>
    </section>
  )
}

function QualityModal({ children, onClose, wide = false }) {
  return <div className="modal-backdrop quality-modal-backdrop" onMouseDown={onClose}><section className={`quality-modal ${wide ? 'is-wide' : ''}`} onMouseDown={(event) => event.stopPropagation()}>{children}</section></div>
}

function ModalHeader({ eyebrow, onClose, subtitle, title }) {
  return <header className="quality-modal-head"><div><span>{eyebrow}</span><h2>{title}</h2><p>{subtitle}</p></div><button aria-label="Đóng modal" onClick={onClose} type="button"><X size={18} /></button></header>
}

function ReplyModal({ onClose, onSubmit, review, setText, submitting, text }) {
  return <QualityModal onClose={onClose}><form onSubmit={onSubmit}><ModalHeader eyebrow="PATIENT CARE" onClose={onClose} subtitle="Gửi lời cảm ơn hoặc giải đáp trực tiếp cho bệnh nhân." title="Phản hồi bệnh nhân" /><div className="quality-modal-review"><b>{review.name}</b><p>“{review.text}”</p></div><label className="quality-modal-field"><span>Nội dung phản hồi</span><textarea autoFocus onChange={(event) => setText(event.target.value)} placeholder="Nhập phản hồi của quản trị viên..." rows="5" value={text} /></label><footer className="quality-modal-actions"><button onClick={onClose} type="button">Hủy</button><button className="is-primary" disabled={submitting} type="submit"><Send size={15} /> {submitting ? 'Đang gửi' : 'Gửi phản hồi'}</button></footer></form></QualityModal>
}

function ReviewDetailDrawer({ onClose, review }) {
  return <div className="modal-backdrop quality-feedback-drawer-backdrop" onMouseDown={onClose}><aside className="quality-feedback-drawer" onMouseDown={(event) => event.stopPropagation()}><ModalHeader eyebrow={review.id} onClose={onClose} subtitle="Theo dõi đầy đủ nội dung và lịch sử xử lý đánh giá." title="Chi tiết phản hồi" /><div className="quality-feedback-profile"><span className="quality-avatar">{review.avatar}</span><div><h3>{review.name}</h3><p>{review.spec} · {review.doctor}</p></div><Stars value={review.rating} /></div><dl className="quality-feedback-meta"><div><dt>Ngày khám</dt><dd>{review.visitDate}</dd></div><div><dt>Trạng thái xử lý</dt><dd>{review.status}</dd></div></dl><section><h3>Nội dung đánh giá</h3><p>“{review.text}”</p></section><section><h3>Lịch sử phản hồi admin</h3>{review.replies.length ? review.replies.map((reply, index) => <div className="quality-reply-history" key={`${review.id}-${index}`}><b>MedConsult Admin</b><small>Đã gửi phản hồi</small><p>{reply}</p></div>) : <p className="quality-empty-note">Chưa có phản hồi từ quản trị viên.</p>}</section></aside></div>
}

function AllReviewsModal({ filters, onClose, onFilters, reviews }) {
  return <QualityModal onClose={onClose} wide><ModalHeader eyebrow="PATIENT FEEDBACK" onClose={onClose} subtitle="Lọc và theo dõi toàn bộ đánh giá đã xác thực từ bệnh nhân." title="Danh sách phản hồi" /><div className="quality-review-filter-grid"><select onChange={(event) => onFilters({ ...filters, stars: event.target.value })} value={filters.stars}>{['Tất cả số sao', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao'].map((item) => <option key={item}>{item}</option>)}</select><select onChange={(event) => onFilters({ ...filters, specialty: event.target.value })} value={filters.specialty}>{specialties.map((item) => <option key={item}>{item}</option>)}</select><select onChange={(event) => onFilters({ ...filters, doctor: event.target.value })} value={filters.doctor}>{['Tất cả bác sĩ', ...doctors.map((doctor) => doctor.name)].map((item) => <option key={item}>{item}</option>)}</select><select onChange={(event) => onFilters({ ...filters, time: event.target.value })} value={filters.time}>{['Tất cả thời gian', '7 ngày gần đây', '30 ngày gần đây', '90 ngày gần đây'].map((item) => <option key={item}>{item}</option>)}</select></div><div className="quality-all-reviews">{reviews.length ? reviews.map((review) => <article key={review.id}><div><b>{review.name}</b><small>{review.spec} · {review.doctor}</small></div><Stars value={review.rating} /><p>“{review.text}”</p></article>) : <p className="quality-empty-note">Không có phản hồi phù hợp với bộ lọc.</p>}</div></QualityModal>
}

function DoctorReportModal({ onClose, reviews }) {
  return <QualityModal onClose={onClose} wide><ModalHeader eyebrow="TOP PERFORMANCE" onClose={onClose} subtitle="Ranking bác sĩ dựa trên rating và phản hồi bệnh nhân đã xác thực." title="Báo cáo bác sĩ" /><div className="quality-doctor-report-list">{doctors.map((doctor) => <article key={doctor.name}><strong>#{doctor.rank}</strong><span className="quality-avatar">{doctor.avatar}</span><div><h3>{doctor.name}</h3><p>{doctor.spec}</p><small>Bình luận gần đây: {reviews.find((review) => review.doctor === doctor.name)?.text ?? 'Chưa có bình luận mới.'}</small></div><em><Star fill="currentColor" size={14} /> {doctor.rating}<small>{doctor.reviews} đánh giá</small></em></article>)}</div></QualityModal>
}
