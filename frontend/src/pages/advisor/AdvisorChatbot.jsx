import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { AppShell, Badge, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { advisorConversations } from '../../data/mock.js'

export function AdvisorChatbot() {
  const columns = [
    { key: 'index', label: 'STT', render: (_, index) => index + 1 },
    { key: 'question', label: 'CÂU HỎI NGƯỜI DÙNG', render: (row) => <div className="advisor-question"><span><MessageSquare size={15} /></span><b>{row.question}</b></div> },
    { key: 'answer', label: 'PHẢN HỒI CHATBOT', render: (row) => <span className="text-slate-500">{row.answer}</span> },
    { key: 'status', label: 'TRẠNG THÁI', render: (row) => <Badge tone={row.status === 'Hoàn thành' ? 'green' : 'yellow'}>{row.status}</Badge> },
    { key: 'action', label: 'THAO TÁC', render: (row) => <Link to={`/advisor/conversation/${row.id}`} className="mini-btn teal">Xem chi tiết</Link> },
  ]

  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-advisor">
        <PageHeader title="Danh sách hội thoại" />
        <Card className="p-0">
          <DataTable columns={columns} rows={advisorConversations} footer={false} />
          <div className="table-footer"><span>Hiển thị 5 trên 50 hội thoại</span><div className="pagination"><button>Trước</button><button className="active">1</button><button>2</button><button>Sau</button></div></div>
        </Card>
      </div>
    </AppShell>
  )
}
