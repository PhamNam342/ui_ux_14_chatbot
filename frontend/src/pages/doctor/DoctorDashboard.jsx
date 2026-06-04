import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, CheckCircle2, Video, MessageSquare, AlertCircle, ArrowRight, UserRound, Stethoscope, Bell, ChevronRight, ClipboardList, Info, User, Phone, AlertTriangle, Calendar, X, Pill, FileText, ShieldAlert, HeartPulse } from 'lucide-react'
import { AppShell, Avatar, Badge, Button, Card, TopBar, StatCard } from '../../components/ui.jsx'
import { getStoredCases, getStoredSchedule, getStoredNotifications, saveStoredNotifications, startConsultation, getStoredHistories } from '../../data/doctorStore.js'

export function DoctorDashboard() {
  const navigate = useNavigate()
  const [casesList, setCasesList] = useState([])
  const [scheduleList, setScheduleList] = useState([])
  const [notifications, setNotifications] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [historiesList, setHistoriesList] = useState([])
  const [selectedPatientName, setSelectedPatientName] = useState(null)
  const [detailTab, setDetailTab] = useState('info')

  // Load data on mount
  useEffect(() => {
    setCasesList(getStoredCases())
    setScheduleList(getStoredSchedule())
    setNotifications(getStoredNotifications())
    setHistoriesList(getStoredHistories())

    // Listen to changes in localStorage
    const handleStorageChange = () => {
      setCasesList(getStoredCases())
      setScheduleList(getStoredSchedule())
      setNotifications(getStoredNotifications())
      setHistoriesList(getStoredHistories())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Deduplicate patients from cases
  const patients = useMemo(() => {
    const map = new Map()
    casesList.forEach(c => {
      if (!map.has(c.patient)) {
        const patientHistories = historiesList.filter(h => h.patient === c.patient)
        const lastHistory = patientHistories[0]
        map.set(c.patient, {
          name: c.patient,
          initials: c.initials,
          age: c.age,
          gender: c.gender,
          phone: c.phone,
          allergies: c.allergies,
          currentMeds: c.currentMeds,
          specialNotes: c.specialNotes,
          level: c.level,
          code: c.code,
          totalVisits: patientHistories.length + (c.status !== 'Hoàn tất' ? 1 : 0),
          lastVisit: lastHistory?.date || c.time?.split(' ')[0] || '—',
          lastDiagnosis: lastHistory?.diagnosis || '—',
          activeCase: c.status !== 'Hoàn tất' ? c : null,
          histories: patientHistories,
        })
      }
    })
    return Array.from(map.values())
  }, [casesList, historiesList])

  const selPatient = selectedPatientName
    ? patients.find(p => p.name === selectedPatientName)
    : null
  const selHistories = selPatient
    ? historiesList.filter(h => h.patient === selPatient.name)
    : []

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

  // Filter and sort upcoming schedules (today and future) chronologically
  const upcomingSchedules = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return scheduleList.filter(event => {
      if (!event.date) return false
      const [d, m] = event.date.split('/').map(Number)
      const eventDate = new Date(today.getFullYear(), m - 1, d)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate >= today
    }).sort((a, b) => {
      const [da, ma] = a.date.split('/').map(Number)
      const [db, mb] = b.date.split('/').map(Number)
      const dateA = new Date(today.getFullYear(), ma - 1, da)
      const dateB = new Date(today.getFullYear(), mb - 1, db)
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime()
      }
      return a.timeSlot.localeCompare(b.timeSlot)
    })
  }, [scheduleList])

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
            <p className="mt-1 text-slate-500">Chào buổi sáng, Bác sĩ Nguyễn Văn An. Hãy xem qua danh sách các việc cần xử lý hôm nay.</p>
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
                  {pendingCases.slice(0, 3).map((item) => (
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
                        <button 
                          onClick={() => { setSelectedPatientName(item.patient); setDetailTab('info') }}
                          className="flex-1 text-center mini-btn hover:bg-slate-100 sm:flex-initial cursor-pointer"
                        >
                          Xem hồ sơ
                        </button>
                        <button 
                          onClick={() => handleStartConsult(item.code)} 
                          className="flex-1 text-center mini-btn teal cursor-pointer sm:flex-initial"
                        >
                          Bắt đầu tư vấn
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingCases.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-teal-50/40 p-4 border border-dashed border-teal-200 sm:flex-row">
                      <div className="text-sm font-semibold text-slate-700">
                        Còn <b className="text-teal-600 font-extrabold">{pendingCases.length - 3}</b> bệnh nhân khác đang xếp hàng chờ...
                      </div>
                      <Link 
                        to="/doctor/consult" 
                        className="btn btn-outline btn-compact text-xs flex items-center gap-1 font-bold shadow-none"
                      >
                        Xem tất cả <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
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
          </div>

          {/* Right Column: Notifications & Quick Actions */}
          <div className="space-y-7">

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
                {upcomingSchedules.slice(0, 4).map((event, idx) => (
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
      {/* ── Detail panel (slide-in overlay) ── */}
      {selPatient && (
        <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => setSelectedPatientName(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-[480px] bg-white shadow-2xl pointer-events-auto flex flex-col h-full overflow-hidden">

            {/* Panel header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-xl">
                    {selPatient.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">{selPatient.name}</h2>
                    <p className="text-teal-100 text-sm mt-0.5">{selPatient.gender} • {selPatient.age} tuổi</p>
                    <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${selPatient.level === 'Cao' ? 'bg-rose-500/80 text-white' :
                        selPatient.level === 'Trung bình' ? 'bg-amber-400/80 text-white' :
                          'bg-teal-500/60 text-white'
                      }`}>
                      Mức độ: {selPatient.level}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatientName(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-4">
                {selPatient.activeCase && (
                  <button
                    onClick={() => {
                      setSelectedPatientName(null)
                      navigate(`/doctor/consult/chat/${selPatient.activeCase.code}`)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-teal-700 text-xs font-bold hover:bg-teal-50 transition-colors cursor-pointer"
                  >
                    <Video size={13} />
                    Vào phòng tư vấn
                  </button>
                )}
                <button
                  onClick={() => setDetailTab('history')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <FileText size={13} />
                  Lịch sử khám bệnh
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {[
                { id: 'info', label: 'Thông tin', icon: <User size={14} /> },
                { id: 'history', label: 'Lịch sử khám', icon: <ClipboardList size={14} /> },
                { id: 'consults', label: 'Tư vấn', icon: <MessageSquare size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-bold border-b-2 transition-all cursor-pointer ${detailTab === tab.id
                      ? 'border-teal-600 text-teal-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* ── TAB: Thông tin cá nhân ── */}
              {detailTab === 'info' && (
                <>
                  {/* Contact */}
                  <section className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Liên hệ</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone size={14} className="text-teal-500 shrink-0" />
                      {selPatient.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <FileText size={14} className="text-teal-500 shrink-0" />
                      Mã ca: {selPatient.code}
                    </div>
                  </section>

                  {/* Allergies */}
                  {selPatient.allergies && (
                    <section className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider mb-2">
                        <ShieldAlert size={13} />
                        Dị ứng
                      </h4>
                      <p className="text-sm text-rose-700">{selPatient.allergies}</p>
                    </section>
                  )}

                  {/* Current meds */}
                  {selPatient.currentMeds && (
                    <section className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-700 uppercase tracking-wider mb-2">
                        <Pill size={13} />
                        Thuốc đang sử dụng
                      </h4>
                      <p className="text-sm text-amber-800">{selPatient.currentMeds}</p>
                    </section>
                  )}

                  {/* Special notes */}
                  {selPatient.specialNotes && (
                    <section className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-700 uppercase tracking-wider mb-2">
                        <AlertTriangle size={13} />
                        Ghi chú đặc biệt
                      </h4>
                      <p className="text-sm text-sky-800">{selPatient.specialNotes}</p>
                    </section>
                  )}

                  {/* Active case */}
                  {selPatient.activeCase && (
                    <section className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-teal-700 uppercase tracking-wider mb-2">
                        <HeartPulse size={13} />
                        Ca tư vấn đang mở
                      </h4>
                      <p className="text-sm text-teal-800 font-semibold">{selPatient.activeCase.symptoms}</p>
                      <p className="text-xs text-teal-600 mt-1">Trạng thái: {selPatient.activeCase.status}</p>
                    </section>
                  )}
                </>
              )}

              {/* ── TAB: Lịch sử khám ── */}
              {detailTab === 'history' && (
                <>
                  {selHistories.length > 0 ? selHistories.map(h => (
                    <div key={h.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-teal-600" />
                          <span className="text-xs font-bold text-slate-700">{h.date}</span>
                          {h.time && <span className="text-xs text-slate-400">• {h.time}</span>}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.rating >= 5 ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                          ★ {h.rating}/5
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Chẩn đoán</span>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">{h.diagnosis}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Triệu chứng</span>
                          <p className="text-xs text-slate-600 mt-0.5">{h.symptoms}</p>
                        </div>
                        {h.note && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Ghi chú bác sĩ</span>
                            <p className="text-xs text-slate-600 mt-0.5">{h.note}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Hướng xử lý</span>
                          <p className="text-xs font-semibold text-teal-700 mt-0.5">{h.actionPath}</p>
                        </div>
                        {h.prescription?.length > 0 && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Đơn thuốc</span>
                            <ul className="mt-1 space-y-1">
                              {h.prescription.map((rx, i) => (
                                <li key={i} className="text-xs text-slate-700 flex gap-1.5">
                                  <Pill size={11} className="text-violet-500 shrink-0 mt-0.5" />
                                  <span><b>{rx.name}</b> — {rx.dose}{rx.note ? ` (${rx.note})` : ''}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {h.reExamDate && (
                          <div className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-1.5">
                            <Clock size={11} />
                            Tái khám: {h.reExamDate}
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="py-16 text-center text-slate-400">
                      <ClipboardList size={36} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-sm">Chưa có lịch sử khám nào được ghi nhận</p>
                    </div>
                  )}
                </>
              )}

              {/* ── TAB: Tư vấn ── */}
              {detailTab === 'consults' && (
                <>
                  {casesList.filter(c => c.patient === selPatient.name).map(c => (
                    <div key={c.code} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={13} className="text-teal-600" />
                          <span className="text-xs font-bold text-slate-700">{c.time}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'Hoàn tất' ? 'bg-teal-100 text-teal-700' :
                            c.status === 'Đang tư vấn' ? 'bg-sky-100 text-sky-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-sm text-slate-700">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Triệu chứng</span>
                          {c.symptoms}
                        </div>
                        <div className="text-xs text-slate-500">Mã ca: {c.code}</div>
                        {c.status !== 'Hoàn tất' && (
                          <button
                            onClick={() => {
                              setSelectedPatientName(null)
                              navigate(`/doctor/consult/chat/${c.code}`)
                            }}
                            className="mt-1 flex items-center gap-1.5 text-xs text-teal-700 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0"
                          >
                            <Video size={12} />
                            Vào phòng tư vấn
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {casesList.filter(c => c.patient === selPatient.name).length === 0 && (
                    <div className="py-16 text-center text-slate-400">
                      <MessageSquare size={36} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-sm">Không có ca tư vấn nào</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
