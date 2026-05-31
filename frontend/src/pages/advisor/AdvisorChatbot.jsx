import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { AppShell, Badge, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { advisorConversations } from '../../data/mock.js'

export function AdvisorChatbot() {
  // Filter conversations into "Đang tư vấn" and "Đã hoàn thành"
  // For advisor, we'll treat "Chưa kiểm tra" as "Đang tư vấn"
  const ongoingConsults = advisorConversations.filter(c => c.status !== 'Hoàn thành')
  const completedConsults = advisorConversations.filter(c => c.status === 'Hoàn thành')

  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-advisor">
        <PageHeader title="Danh sách tư vấn" />
        
        {/* Đang tư vấn */}
        <div className="mb-8">
          <h2 className="section-title mb-4">Đang tư vấn ({ongoingConsults.length})</h2>
          {ongoingConsults.length > 0 ? (
            <div className="space-y-3">
              {ongoingConsults.map((consult) => (
                <ConsultationItem key={consult.id} consult={consult} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-slate-500">
              Không có cuộc tư vấn nào đang tiến hành
            </Card>
          )}
        </div>

        {/* Đã hoàn thành */}
        <div>
          <h2 className="section-title mb-4">Đã hoàn thành ({completedConsults.length})</h2>
          {completedConsults.length > 0 ? (
            <div className="space-y-3">
              {completedConsults.map((consult) => (
                <ConsultationItem key={consult.id} consult={consult} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-slate-500">
              Không có cuộc tư vấn nào đã hoàn thành
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}

function ConsultationItem({ consult }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare size={16} className="flex-shrink-0" />
              <span className="truncate">{consult.question}</span>
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {consult.answer}
            </p>
          </div>
          <Badge tone={consult.status === 'Hoàn thành' ? 'green' : 'yellow'} className="flex-shrink-0">
            {consult.status}
          </Badge>
        </div>
        <div className="flex items-center justify-end">
          <Link to={`/advisor/conversation/${consult.id}`} className="mini-btn teal">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </Card>
  )
}

