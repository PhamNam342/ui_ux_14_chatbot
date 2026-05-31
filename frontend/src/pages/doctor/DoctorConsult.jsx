import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { AppShell, Badge, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { doctorConsultations } from '../../data/mock.js'

export function DoctorConsult() {
  const ongoingConsults = doctorConsultations.filter(c => c.status === 'Đang tư vấn')
  const completedConsults = doctorConsultations.filter(c => c.status === 'Đã hoàn thành')

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-doctor">
        <PageHeader title="Tư vấn trực tuyến" />
        
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="font-bold text-teal-700">{consult.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">{consult.patient}</h3>
              <Badge tone={consult.level === 'Cao' ? 'red' : consult.level === 'Trung bình' ? 'yellow' : 'green'}>
                {consult.level}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <MessageSquare size={14} />
              {consult.symptoms}
            </p>
            <p className="text-xs text-gray-500">
              {consult.age} tuổi • {consult.phone} • {consult.time}
            </p>
          </div>
        </div>
        <Link to={`/doctor/consult/chat/${consult.id}`} className="mini-btn teal whitespace-nowrap">
          Bắt đầu chat
        </Link>
      </div>
    </Card>
  )
}
