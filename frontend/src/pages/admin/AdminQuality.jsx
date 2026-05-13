import { Star } from 'lucide-react'
import { AppShell, Badge, Card, PageHeader, TopBar } from '../../components/ui.jsx'

const reviews = [
  { name: 'Minh Anh', avatar: 'MA', spec: 'Nội tổng quát', rating: 5, text: 'Bác sĩ tư vấn kỹ, thao tác nhanh gọn.' },
  { name: 'Hoàng Nam', avatar: 'HN', spec: 'Nhi khoa', rating: 5, text: 'Lịch khám đúng giờ và thông tin rõ ràng.' },
  { name: 'Thu Hà', avatar: 'TH', spec: 'Tim mạch', rating: 3, text: 'Cần cải thiện tốc độ phản hồi lúc cao điểm.' },
]

const progress = [
  { label: '5 sao', value: 92, color: '#08ad8c' },
  { label: '4 sao', value: 78, color: '#22c55e' },
  { label: '3 sao', value: 42, color: '#f59e0b' },
  { label: '2 sao', value: 18, color: '#ef4444' },
]

export function AdminQuality() {
  return (
    <AppShell role="admin">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Báo cáo chất lượng ca khám" subtitle="Theo dõi mức độ hài lòng, thời gian xử lý và xu hướng hoạt động" />
        <Card className="mb-7">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="field-label">Lọc theo khoa</label><select className="input"><option>Tất cả chuyên khoa</option><option>Tim mạch</option><option>Nhi khoa</option><option>Nội tổng quát</option></select></div>
            <div><label className="field-label">Lọc theo thời gian</label><select className="input"><option>7 ngày gần đây</option><option>30 ngày gần đây</option><option>Quý này</option></select></div>
          </div>
        </Card>
        <div className="grid gap-5 md:grid-cols-3">
          <Card><p className="text-slate-500">Điểm hài lòng</p><strong className="text-4xl font-black">4.8/5</strong></Card>
          <Card><p className="text-slate-500">Thời gian TB</p><strong className="text-4xl font-black">18p</strong></Card>
          <Card><p className="text-slate-500">Ca hoàn tất</p><strong className="text-4xl font-black">92%</strong></Card>
        </div>
        <Card className="mt-7">
          <h2 className="section-title">Phân bố đánh giá</h2>
          <div className="mt-6 space-y-4">
            {progress.map((item) => (
              <div key={item.label} className="rating-progress">
                <span><Star size={16} fill="currentColor" /> {item.label}</span>
                <div><i style={{ width: `${item.value}%`, background: item.color }} /></div>
                <Badge>{item.value}%</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="mt-7">
          <h2 className="section-title">Nhận xét gần đây</h2>
          <div className="mt-5 space-y-4">
            {reviews.map((review) => (
              <div className="review-item" key={review.name}>
                <span className="avatar">{review.avatar}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-3"><b>{review.name}</b><Badge>{review.spec}</Badge><span className="review-stars">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</span></div>
                  <p>{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
