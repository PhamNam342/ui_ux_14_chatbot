import { Link } from 'react-router-dom'
import { AppShell, Badge, Button, Card, PageHeader } from '../../components/ui.jsx'

export function AdvisorConversation() {
  return (
    <AppShell role="advisor">
      <div className="content-advisor">
        <PageHeader title="Chi tiết hội thoại" subtitle="Phân tích từng lượt hỏi đáp và đối chiếu với dữ liệu y khoa." action={<Link to="/advisor/chatbot"><Button variant="ghost">Quay lại</Button></Link>} />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card className="p-0"><div className="chat-head"><b>Hội thoại #CV-0921</b><Badge tone="yellow">Cần kiểm tra lại</Badge></div><div className="chat-body min-h-[520px]"><div className="bubble">Đau ngực trái khi vận động và khó thở.</div><div className="bubble bot">Đây là dấu hiệu cần theo dõi tim mạch. Bạn nên đến cơ sở y tế để chụp ECG và xét nghiệm máu.</div><div className="bubble">Tôi có cần gọi cấp cứu không?</div><div className="bubble bot">Nếu đau ngực dữ dội, khó thở tăng hoặc choáng váng, hãy gọi cấp cứu ngay.</div></div></Card>
          <Card><h2 className="section-title">Recheck</h2><p className="mt-3 leading-7 text-slate-500">Câu trả lời phù hợp với dữ liệu nghiêm trọng, có cảnh báo chuyển tuyến rõ ràng.</p><div className="mt-5 space-y-3"><Badge tone="green">Đúng chẩn đoán</Badge><Badge tone="green">Đúng mức độ</Badge><Badge tone="yellow">Cần bổ sung cảnh báo</Badge></div><Button className="mt-6 w-full justify-center">Lưu đánh giá</Button></Card>
        </div>
      </div>
    </AppShell>
  )
}
