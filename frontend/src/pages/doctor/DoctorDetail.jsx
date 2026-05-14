import { Link, useParams } from 'react-router-dom'
import { AppShell, Avatar, Badge, Button, Card, PageHeader } from '../../components/ui.jsx'
import { cases, consultationHistory } from '../../data/mock.js'

export function DoctorDetail() {
  const { id } = useParams()
  const consultation = consultationHistory.find((item) => item.code === id)
  const currentCase = cases.find((item) => item.code === id) || cases[0]
  const detail = consultation || {
    code: currentCase.code,
    patient: currentCase.patient,
    initials: currentCase.initials,
    symptoms: currentCase.symptoms,
    time: 'Chưa hoàn tất tư vấn',
    rating: 0,
    diagnosis: 'Chưa có kết luận',
    feedback: [],
  }

  return (
    <AppShell role="doctor">
      <div className="content-wide">
        <PageHeader title="Chi tiết ca bệnh" subtitle={`${detail.code} - ${detail.patient}`} action={<Link to="/doctor/consult"><Button>Bắt đầu tư vấn</Button></Link>} />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card>
            <h2 className="section-title">Triệu chứng ban đầu</h2>
            <p className="mt-4 leading-8 text-slate-600">
              {detail.symptoms}. Không ghi nhận khó thở nghiêm trọng trong quá trình sàng lọc ban đầu.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Badge tone={levelTone(currentCase.level)}>{currentCase.level}</Badge>
              <Badge>Sốt</Badge>
              <Badge>Ho khan</Badge>
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Thông tin nhanh</h2>
            <div className="patient-summary">
              <Avatar>{detail.initials}</Avatar>
              <div>
                <h3>{detail.patient}</h3>
                <p>{detail.code}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Info label="Tuổi" value={currentCase.age} />
                <Info label="Giới tính" value={currentCase.gender} />
              </div>
              <Info label="Số điện thoại" value={currentCase.phone} />
              <Info label="Trạng thái" value={currentCase.status} teal />
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card>
            <h2 className="section-title">Kết luận tư vấn</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Thời gian" value={detail.time} />
              <Info label="Đánh giá" value={<Stars value={detail.rating} />} />
            </div>
            <p className="mt-5 leading-8 text-slate-600">{detail.diagnosis}</p>
          </Card>

          <Card>
            <h2 className="section-title">Feedback</h2>
            <div className="feedback-list">
              {detail.feedback.length ? detail.feedback.map((item) => (
                <div className="feedback-comment" key={`${item.author}-${item.time}`}>
                  <Avatar>{item.author.split(' ').slice(-2).map((part) => part[0]).join('')}</Avatar>
                  <div>
                    <p><b>{item.author}</b><span>{item.time}</span></p>
                    <div>{item.text}</div>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500">Chưa có feedback cho ca tư vấn này.</p>}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function Info({ label, value, teal }) {
  return <div className="info-box"><small>{label}</small><b className={teal ? 'text-teal-600' : ''}>{value}</b></div>
}

function Stars({ value }) {
  return (
    <span className="review-stars" aria-label={`${value} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, index) => <span key={index}>{index < value ? '★' : '☆'}</span>)}
    </span>
  )
}

function levelTone(level) {
  if (level === 'Cao') return 'red'
  if (level === 'Thấp') return 'green'
  return 'yellow'
}
