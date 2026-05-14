import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bot, RefreshCw, User } from 'lucide-react'
import { AppShell, Badge, Button, Card, TopBar } from '../../components/ui.jsx'
import { advisorConversations } from '../../data/mock.js'

export function AdvisorConversation() {
  const navigate = useNavigate()
  const { id } = useParams()
  const conversation = advisorConversations.find((item) => item.id === id) || advisorConversations[0]

  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-advisor">
        <div className="advisor-recheck-title">
          <Link to="/advisor/chatbot" className="icon-btn"><ArrowLeft size={18} /></Link>
          <h1>Kiểm tra lại phản hồi</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <Card className="p-0">
            <div className="chat-head"><b><RefreshCw size={18} /> Phản hồi mới của chatbot</b></div>
            <div className="advisor-recheck-body">
              <div className="advisor-recheck-message">
                <span><User size={18} /></span>
                <div><small>Người dùng</small><p>{conversation.question}</p></div>
              </div>
              <div className="advisor-recheck-message bot">
                <span><Bot size={18} /></span>
                <div><b>Chatbot Medical AI</b><p>Dựa trên dữ liệu vừa cập nhật, phản hồi đã được mở rộng và an toàn hơn. {conversation.answer} Nếu triệu chứng nặng lên hoặc kéo dài, người dùng nên đến cơ sở y tế gần nhất để được kiểm tra.</p></div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Dữ liệu đã cập nhật</h2>
            <div className="mt-5 space-y-5">
              <Info label="Triệu chứng" value="Đau thượng vị, khó tiêu" />
              <Info label="Chẩn đoán" value="Viêm dạ dày cấp tính" />
              <Info label="Mức độ" value={<Badge tone="yellow">Trung bình</Badge>} />
              <Info label="Hướng xử lý" value="Dùng thuốc kháng acid, theo dõi" />
            </div>
            <Button className="mt-6 w-full justify-center" onClick={() => navigate('/advisor/chatbot')}>Xác nhận</Button>
            <Button variant="ghost" className="mt-3 w-full justify-center" onClick={() => navigate('/advisor/data?returnTo=recheck')}>Chỉnh sửa lại</Button>
          </Card>
        </div>

        <Card className="advisor-note"><b>Lưu ý:</b> Phản hồi trên được tạo dựa trên dữ liệu vừa cập nhật. Hãy kiểm tra xem phản hồi có chính xác hơn so với trước đây không.</Card>
      </div>
    </AppShell>
  )
}

function Info({ label, value }) {
  return <div><p className="text-sm text-slate-500">{label}</p><b>{value}</b></div>
}
