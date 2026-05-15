import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { AppShell, Badge, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { advisorConversations } from '../../data/mock.js'

export function AdvisorChatbot() {
  const [filter, setFilter] = useState('Tất cả')

  const columns = [
    { key: 'index', label: 'STT', render: (_, index) => index + 1 },
    { key: 'question', label: 'CÂU HỎI NGƯỜI DÙNG', render: (row) => <div className="advisor-question"><span><MessageSquare size={15} /></span><b>{row.question}</b></div> },
    { key: 'answer', label: 'PHẢN HỒI CHATBOT', render: (row) => <span className="text-slate-500">{row.answer}</span> },
    { key: 'status', label: 'TRẠNG THÁI', render: (row) => <Badge tone={row.status === 'Hoàn thành' ? 'green' : 'yellow'}>{row.status}</Badge> },
    { key: 'action', label: 'THAO TÁC', render: (row) => <Link to={`/advisor/conversation/${row.id}`} className="mini-btn teal">Xem chi tiết</Link> },
  ]

  const filteredRows = filter === 'Tất cả' 
    ? advisorConversations 
    : advisorConversations.filter(row => row.status === filter)

  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-advisor">
        <PageHeader title="Danh sách hội thoại" />
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="segmented">
            <button className={filter === 'Tất cả' ? 'active' : ''} onClick={() => setFilter('Tất cả')}>Tất cả</button>
            <button className={filter === 'Hoàn thành' ? 'active' : ''} onClick={() => setFilter('Hoàn thành')}>Hoàn thành</button>
            <button className={filter === 'Chưa kiểm tra' ? 'active' : ''} onClick={() => setFilter('Chưa kiểm tra')}>Chưa kiểm tra</button>
          </div>
          <div className="text-sm text-slate-500 font-medium">Tổng cộng: {filteredRows.length} hội thoại</div>
        </div>
        <Card className="p-0">
          <DataTable columns={columns} rows={filteredRows} footer={false} />
          <div className="table-footer"><span>Hiển thị {filteredRows.length} trên {advisorConversations.length} hội thoại</span><div className="pagination"><button>Trước</button><button className="active">1</button><button>2</button><button>Sau</button></div></div>
        </Card>
      </div>
    </AppShell>
  )
}
