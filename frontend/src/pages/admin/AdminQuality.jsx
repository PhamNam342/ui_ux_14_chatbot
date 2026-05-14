import { CalendarDays, Download, MessageCircle, Star, Timer, Undo2 } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'

const serviceScores = [
  { label: 'Tiếp đón', value: 4.9, color: '#b7e8dc' },
  { label: 'Bác sĩ chuyên khoa', value: 4.7, color: '#9edbcf' },
  { label: 'Xét nghiệm', value: 4.5, color: '#b7e8dc' },
  { label: 'Dược phẩm', value: 4.2, color: '#d1d5db' },
  { label: 'Cơ sở vật chất', value: 4.8, color: '#b7e8dc' },
]

const reviews = [
  { name: 'Nguyễn Văn An', spec: 'Nội tổng quát', time: '2 giờ trước', rating: 5, text: 'Bác sĩ rất tận tâm, giải thích kỹ càng tình trạng bệnh của tôi.' },
  { name: 'Trần Thị Bình', spec: 'Nhi khoa', time: '5 giờ trước', rating: 4, text: 'Dịch vụ tốt nhưng khu vực chờ hơi đông vào buổi sáng.' },
  { name: 'Lê Hoàng Cường', spec: 'Sản phụ khoa', time: '1 ngày trước', rating: 5, text: 'Quy trình làm thủ tục rất nhanh gọn, không phải chờ lâu.' },
]

export function AdminQuality() {
  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Báo cáo chất lượng khám bệnh"
          subtitle="Phân tích trải nghiệm bệnh nhân và hiệu quả điều trị"
          action={<div className="flex gap-3"><Button variant="ghost"><CalendarDays size={16} /> 01/10/2023 - 31/10/2023</Button><Button variant="dark"><Download size={16} /> Xuất báo cáo PDF</Button></div>}
        />

        <div className="grid gap-5 lg:grid-cols-4">
          <QualityMetric icon={<Star size={28} />} label="Chỉ số hài lòng (CSAT)" value="4.8/5.0" delta="+2.4% so với tháng trước" tone="green" />
          <QualityMetric icon={<Timer size={28} />} label="Thời gian chờ TB" value="12 phút" delta="-3 phút (Cải thiện)" tone="blue" />
          <QualityMetric icon={<Undo2 size={28} />} label="Tỷ lệ quay lại" value="86%" delta="+5.1% so với tháng trước" tone="violet" />
          <QualityMetric icon={<MessageCircle size={28} />} label="Phản hồi tiêu cực" value="12" delta="-4 (Giảm thiểu)" tone="amber" />
        </div>

        <Card className="mt-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h2 className="section-title">Chỉ số hài lòng theo dịch vụ</h2>
              <p className="text-sm text-slate-500">So sánh đánh giá giữa các dịch vụ chính</p>
            </div>
          </div>
          <div className="quality-bars">
            {serviceScores.map((item) => (
              <div className="quality-bar" key={item.label}>
                <div className="quality-bar-track"><span style={{ height: `${item.value * 20}%`, background: item.color }} /></div>
                <b>{item.label}</b>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-7 grid gap-7 lg:grid-cols-2">
          <Card>
            <h2 className="section-title">Độ tuổi bệnh nhân</h2>
            <div className="quality-age">
              <div className="donut quality-donut"><strong>3.4k+</strong></div>
              <div className="donut-legend">
                {['19-45 tuổi', '46-65 tuổi', '0-18 tuổi', 'Trên 65'].map((item, index) => (
                  <div key={item}><span style={{ background: ['#9edbcf', '#111827', '#b7e8dc', '#d1d5db'][index] }} /><b>{item}</b></div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">Nhận xét gần đây</h2>
              <button className="link-btn">Xem tất cả</button>
            </div>
            <div className="mt-5 space-y-5">
              {reviews.map((review) => (
                <div className="review-item" key={review.name}>
                  <span className="avatar avatar-violet">{review.name.split(' ').slice(-2).map((part) => part[0]).join('')}</span>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <b>{review.name}</b>
                      <span className="review-stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill={index < review.rating ? 'currentColor' : 'none'} />)}</span>
                    </div>
                    <p>{review.text}</p>
                    <small className="text-xs font-bold uppercase text-slate-400">{review.time} · {review.spec}</small>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function QualityMetric({ icon, label, value, delta, tone }) {
  return (
    <Card className="quality-metric">
      <div className={`quality-icon tone-${tone}`}>{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span className={`metric-delta tone-${tone}`}>{delta}</span>
    </Card>
  )
}
