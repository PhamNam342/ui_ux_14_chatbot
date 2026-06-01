import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, CheckCircle2, Video, MessageSquare, AlertCircle, ArrowRight, UserRound, Stethoscope, Bell, ChevronRight, ClipboardList, Info } from 'lucide-react'
import { AppShell, Avatar, Badge, Button, Card, TopBar, StatCard } from '../../components/ui.jsx'
import { getStoredCases, getStoredSchedule, getStoredNotifications, saveStoredNotifications, startConsultation } from '../../data/doctorStore.js'

export function DoctorDashboard() {
  const navigate = useNavigate()
  const [casesList, setCasesList] = useState([])
  const [scheduleList, setScheduleList] = useState([])
  const [notifications, setNotifications] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Load data on mount
  useEffect(() => {
    setCasesList(getStoredCases())
    setScheduleList(getStoredSchedule())
    setNotifications(getStoredNotifications())

    // Listen to changes in localStorage
    const handleStorageChange = () => {
      setCasesList(getStoredCases())
      setScheduleList(getStoredSchedule())
      setNotifications(getStoredNotifications())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Filter cases that are pending (status: 'Mới' or 'Đang chờ tư vấn')
  const pendingCases = useMemo(() => {
    return casesList.filter(item => item.status === 'Mới' || item.status === 'Đang chờ tư vấn')
  }, [casesList])

  // Count metrics
  const stats = useMemo(() => {
    const pending = casesList.filter(item => item.status === 'Mới' || item.status === 'Đang chờ tư vấn').length
    const ongoing = casesList.filter(item => item.status === 'Đang tư vấn').length
    const completed = casesList.filter(item => item.status === 'Hoàn tất').length
    return { pending, ongoing, completed }
  }, [casesList])

  // Start consultation action
  const handleStartConsult = (code) => {
    startConsultation(code)
    navigate(`/doctor/consult/chat/${code}`)
  }

  // Dismiss notification
  const handleDismissNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    saveStoredNotifications(updated)
  }

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        {/* Welcome Section */}
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Bảng điều khiển bác sĩ</span>
            <h1 className="text-3xl font-black text-slate-900 mt-1">Hôm nay tôi cần làm gì?</h1>
            <p className="mt-1 text-slate-500">Chào buổi sáng, Bác sĩ Alexander. Hãy xem qua danh sách các việc cần xử lý hôm nay.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/doctor/consult" className="btn btn-primary">
              <Stethoscope size={18} />
              Vào phòng tư vấn
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            label="Yêu cầu đang chờ tiếp nhận" 
            value={stats.pending.toString()} 
            tone="amber" 
            delta="Bệnh nhân đang trực tuyến" 
            icon={<Clock size={20} />} 
          />
          <StatCard 
            label="Ca đang trong phiên tư vấn" 
            value={stats.ongoing.toString()} 
            tone="blue" 
            delta="Hỗ trợ chat/video trực tiếp" 
            icon={<Video size={20} />} 
          />
          <StatCard 
            label="Phiên đã hoàn thành hôm nay" 
            value={stats.completed.toString()} 
            tone="teal" 
            delta="Đã lưu hồ sơ bệnh án" 
            icon={<CheckCircle2 size={20} />} 
          />
        </div>

        {/* Main Workspace Layout */}
        <div className="mt-8 grid gap-7 lg:grid-cols-[1.6fr_1fr]">
          
          {/* Left Column: Waiting Queue */}
          <div className="space-y-7">
            <Card className="!p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    Danh sách bệnh nhân đang chờ ({pendingCases.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Tiếp nhận ngay để bắt đầu tư vấn trực tuyến cho bệnh nhân</p>
                </div>
                <Link to="/doctor/consult" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  Xem tất cả <ChevronRight size={14} />
                </Link>
              </div>

              {pendingCases.length > 0 ? (
                <div className="space-y-4">
                  {pendingCases.map((item) => (
                    <div 
                      key={item.code} 
                      className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-teal-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3.5">
                        <Avatar tone={item.level === 'Cao' ? 'rose' : item.level === 'Trung bình' ? 'amber' : 'mint'}>
                          {item.initials}
                        </Avatar>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                              {item.patient}
                            </h3>
                            <Badge tone={item.level === 'Cao' ? 'red' : item.level === 'Trung bình' ? 'yellow' : 'green'}>
                              Ưu tiên: {item.level}
                            </Badge>
                            <Badge tone="neutral">
                              {item.gender === 'Nam' ? 'Nam' : 'Nữ'} • {item.age} tuổi
                            </Badge>
                          </div>
                          
                          {/* Chatbot Symptoms Summary */}
                          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-500">AI Sàng lọc</span>
                            <span className="truncate max-w-[280px] sm:max-w-[360px]">{item.symptoms}</span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Clock size={12} /> Chờ: {item.waitingTime}</span>
                            <span className="flex items-center gap-1">
                              {item.code.startsWith('CA') ? <MessageSquare size={12} /> : <Video size={12} />} 
                              Hình thức: {item.code.startsWith('CA') ? 'Tư vấn trực tuyến' : 'Khám trực tiếp'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 shrink-0">
                        <Link 
                          to={`/doctor/patients/${item.code}`} 
                          className="flex-1 text-center mini-btn hover:bg-slate-100 sm:flex-initial"
                        >
                          Xem hồ sơ
                        </Link>
                        <button 
                          onClick={() => handleStartConsult(item.code)} 
                          className="flex-1 text-center mini-btn teal cursor-pointer sm:flex-initial"
                        >
                          Bắt đầu tư vấn
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-bold text-slate-800">Tuyệt vời! Không có bệnh nhân nào đang chờ</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">Tất cả yêu cầu khám bệnh trực tuyến đã được xử lý xong.</p>
                </div>
              )}
            </Card>

            {/* Upcoming Appointments Timeline */}
            <Card className="!p-6">
              <div className="border-b border-slate-100 pb-4 mb-5">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CalendarDays size={20} className="text-teal-600" />
                  Lịch hẹn tiếp theo trong ngày
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Lịch trình làm việc và các cuộc tư vấn đã lên lịch sẵn</p>
              </div>

              <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6 py-2">
                {scheduleList.slice(0, 4).map((event, idx) => (
                  <div key={event.id || idx} className="relative group">
                    {/* Circle Indicator on timeline */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white bg-teal-500 group-hover:scale-125 transition-transform" />
                    
                    <div 
                      className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow hover:border-slate-200 cursor-pointer"
                      onClick={() => setSelectedAppointment(event)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {event.timeSlot || '08:00 - 08:30'}
                        </span>
                        <Badge tone={event.priority === 'Cao' ? 'red' : event.priority === 'Trung bình' ? 'yellow' : 'green'}>
                          {event.priority || 'Trung bình'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <b className="text-slate-800 block">{event.patientName || 'Bệnh nhân chưa đặt tên'}</b>
                          <small className="text-slate-400 block mt-0.5">{event.type || 'Khám trực tuyến'} · {event.room || 'Phòng khám Online'}</small>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-teal-600 transition-colors flex items-center gap-1">
                          Chi tiết <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Notifications & Quick Actions */}
          <div className="space-y-7">
            {/* Important Notifications */}
            <Card className="!p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Bell size={18} className="text-amber-500" />
                  Thông báo quan trọng
                </h2>
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-3.5">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`relative p-3.5 rounded-xl border transition-all ${
                        notif.unread 
                          ? 'bg-amber-50/50 border-amber-100' 
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 text-amber-600 shrink-0">
                            <AlertCircle size={16} />
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-5">{notif.detail}</p>
                            <span className="text-[10px] text-slate-400 block mt-1.5">{notif.time}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDismissNotification(notif.id)}
                          className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 -mt-1 cursor-pointer"
                          title="Đóng thông báo"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-sm">
                  Không có thông báo mới nào
                </div>
              )}
            </Card>

            {/* Quick Link Actions */}
            <Card className="!p-6">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-teal-600" />
                Lối tắt thao tác
              </h2>
              <div className="grid gap-3">
                <Link to="/doctor/consult" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-teal-50/20 hover:border-teal-100 transition-colors">
                  <span className="text-sm font-semibold text-slate-700">Vào Phòng tư vấn 3 cột</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
                <Link to="/doctor/schedule" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-teal-50/20 hover:border-teal-100 transition-colors">
                  <span className="text-sm font-semibold text-slate-700">Xem Lịch trực chi tiết</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
                <Link to="/doctor/history" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-teal-50/20 hover:border-teal-100 transition-colors">
                  <span className="text-sm font-semibold text-slate-700">Tra cứu Lịch sử khám</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
                <Link to="/doctor/settings" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-teal-50/20 hover:border-teal-100 transition-colors">
                  <span className="text-sm font-semibold text-slate-700">Chỉnh sửa Lịch làm việc</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="modal-backdrop">
          <Card className="modal max-w-lg">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">Chi tiết lịch hẹn</h3>
                <span className="text-xs text-slate-400 mt-0.5">Mã lịch hẹn: {selectedAppointment.id || 'N/A'}</span>
              </div>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-normal leading-none cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">Bệnh nhân</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{selectedAppointment.patientName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">Thời gian hẹn</span>
                  <span className="text-sm font-bold text-teal-700 mt-1 block">{selectedAppointment.timeSlot}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">Hình thức tư vấn</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {selectedAppointment.type} ({selectedAppointment.room || 'Phòng khám Online'})
                </span>
              </div>

              {selectedAppointment.symptoms && (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">Triệu chứng & Lý do khám</span>
                  <span className="text-sm text-slate-700 mt-1 block leading-relaxed">{selectedAppointment.symptoms}</span>
                </div>
              )}

              <div className="p-3.5 bg-teal-50 border border-teal-100 rounded-lg flex gap-2.5 items-start">
                <Info size={16} className="text-teal-600 mt-0.5 shrink-0" />
                <p className="text-xs text-teal-800 leading-5">
                  Bác sĩ có thể bấm "Bắt đầu khám" để chuyển ngay tới không gian tư vấn 3 cột và kích hoạt phiên chẩn đoán.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button variant="ghost" onClick={() => setSelectedAppointment(null)}>
                Đóng
              </Button>
              {selectedAppointment.room === 'Online' || selectedAppointment.type.includes('trực tuyến') ? (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSelectedAppointment(null)
                    // Try to locate case code by matching patientName
                    const matchedCase = casesList.find(c => c.patient === selectedAppointment.patientName)
                    if (matchedCase) {
                      handleStartConsult(matchedCase.code)
                    } else {
                      // Redirect to consult general
                      navigate('/doctor/consult')
                    }
                  }}
                >
                  <Stethoscope size={16} />
                  Bắt đầu khám
                </Button>
              ) : (
                <Button variant="outline" onClick={() => {
                  alert('Vui lòng hướng dẫn bệnh nhân di chuyển vào phòng khám: ' + (selectedAppointment.room || 'Phòng 102'))
                  setSelectedAppointment(null)
                }}>
                  Tiếp đón tại quầy
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
