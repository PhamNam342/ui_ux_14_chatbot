import { Link } from 'react-router-dom'
import { AppShell, Badge, Button, Card, PageHeader } from '../../components/ui.jsx'

export function AdvisorChatbot() {
  return (
    <AppShell role="advisor">
      <div className="content-advisor">
        <PageHeader title="Kiểm thử chatbot" subtitle="Nhập hội thoại mẫu và đánh giá câu trả lời chẩn đoán của chatbot." />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="p-0"><div className="chat-head"><b>Hội thoại kiểm thử</b><Badge tone="green">Đang hoạt động</Badge></div><div className="chat-body min-h-[420px]"><div className="bubble">Tôi bị đau họng và sốt nhẹ 2 ngày nay.</div><div className="bubble bot">Theo triệu chứng, bạn có thể đang bị viêm họng cấp mức độ trung bình. Nên nghỉ ngơi, uống nước ấm và theo dõi nhiệt độ.</div></div><div className="chat-input"><input placeholder="Nhập câu hỏi kiểm thử..." /><Button>Gửi</Button></div></Card>
          <Card><h2 className="section-title">Kết quả đánh giá</h2><div className="mt-5 space-y-4"><Score label="Độ chính xác" value="92%" /><Score label="Độ an toàn" value="98%" /><Score label="Phù hợp dữ liệu" value="87%" /></div><Link to="/advisor/conversation"><Button className="mt-6 w-full justify-center">Xem chi tiết hội thoại</Button></Link></Card>
        </div>
      </div>
    </AppShell>
  )
}

function Score({ label, value }) {
  return <div><div className="mb-2 flex justify-between text-sm"><b>{label}</b><span>{value}</span></div><div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-teal-500" style={{ width: value }} /></div></div>
}
