import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Check, X, CalendarClock, ChevronLeft, ChevronRight, Stethoscope, Info } from 'lucide-react'
import { AppShell, Badge, Card, TopBar, Button, PageHeader } from '../../components/ui.jsx'
import { getStoredSchedule, saveStoredSchedule, getStoredCases } from '../../data/doctorStore.js'

export function DoctorSchedule() {
  const navigate = useNavigate()
  const [schedule, setSchedule] = useState([])
  const [casesList, setCasesList] = useState([])
  const [viewTab, setViewTab] = useState('month') // 'day', 'week', 'month'
  
  // Date states
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 4, 1)) // May 2026 as reference from image
  const [selectedDayNumber, setSelectedDayNumber] = useState(7) // default selected day: May 7, 2026
  const [selectedAppt, setSelectedAppt] = useState(null)
  
  // Reschedule form states
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [newDateVal, setNewDateVal] = useState('')
  const [newTimeVal, setNewTimeVal] = useState('09:00 - 09:30')

  // Load schedule data
  useEffect(() => {
    setSchedule(getStoredSchedule())
    setCasesList(getStoredCases())

    const handleStorage = () => {
      setSchedule(getStoredSchedule())
      setCasesList(getStoredCases())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Filter schedules for the selected day in Month View
  const selectedDaySchedules = useMemo(() => {
    const formattedDayStr = `${String(selectedDayNumber).padStart(2, '0')}/05` // E.g., '07/05'
    return schedule.filter(item => item.date === formattedDayStr)
  }, [schedule, selectedDayNumber])

  // All schedules for today (Day tab)
  const dayTabSchedules = useMemo(() => {
    return schedule.filter(item => item.date === '07/05' || item.day === 'Thứ 5')
  }, [schedule])

  // Week schedules
  const weekTabSchedules = useMemo(() => {
    return schedule
  }, [schedule])

  // Quick Action functions
  const handleConfirmSchedule = (id) => {
    const updated = schedule.map(item => item.id === id ? { ...item, status: 'Đã xác nhận' } : item)
    setSchedule(updated)
    saveStoredSchedule(updated)
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: 'Đã xác nhận' })
    }
  }

  const handleCancelSchedule = (id) => {
    const updated = schedule.map(item => item.id === id ? { ...item, status: 'Hủy' } : item)
    setSchedule(updated)
    saveStoredSchedule(updated)
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: 'Hủy' })
    }
  }

  const handleSaveReschedule = (id) => {
    if (!newDateVal) {
      alert('Vui lòng chọn ngày mới.')
      return
    }

    const parsedDate = new Date(newDateVal)
    const formattedDate = `${String(parsedDate.getDate()).padStart(2, '0')}/${String(parsedDate.getMonth() + 1).padStart(2, '0')}`
    const dayLabel = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][parsedDate.getDay()]

    const updated = schedule.map(item => {
      if (item.id === id) {
        return {
          ...item,
          date: formattedDate,
          day: dayLabel,
          timeSlot: newTimeVal,
          status: 'Đã xác nhận' // reset status to confirmed
        }
      }
      return item
    })

    setSchedule(updated)
    saveStoredSchedule(updated)
    setIsRescheduling(false)
    setSelectedAppt(null)
    alert('Đã dời lịch khám thành công!')
  }

  const handleStartConsult = (patientName) => {
    // Find case code for patient
    const matched = casesList.find(c => c.patient === patientName)
    if (matched) {
      navigate(`/doctor/consult/chat/${matched.code}`)
    } else {
      navigate('/doctor/consult')
    }
  }

  // Month grid generator for reference month (May 2026)
  // May 1st 2026 is Friday (5).
  // Days in May = 31.
  const daysInMonthGrid = useMemo(() => {
    const grid = []
    const prevMonthDays = [27, 28, 29, 30] // April tail days
    const totalDays = 31
    const nextMonthDays = [1, 2, 3, 4, 5, 6, 7] // June head days

    // April tail days
    prevMonthDays.forEach(day => {
      grid.push({ day, isCurrentMonth: false, fullDateStr: `${day}/04` })
    })

    // May days
    for (let day = 1; day <= totalDays; day++) {
      grid.push({ day, isCurrentMonth: true, fullDateStr: `${String(day).padStart(2, '0')}/05` })
    }

    // June head days
    nextMonthDays.forEach(day => {
      grid.push({ day, isCurrentMonth: false, fullDateStr: `${String(day).padStart(2, '0')}/06` })
    })

    // Return chunks of 7 (weekly structure)
    const weeks = []
    for (let i = 0; i < grid.length; i += 7) {
      weeks.push(grid.slice(i, i + 7))
    }
    return weeks
  }, [])

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        
        {/* Header Section with Toggle tabs */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <PageHeader 
            title="Lịch hẹn khám bệnh" 
            subtitle="Xem và quản lý các lịch hẹn trực tiếp hoặc tư vấn trực tuyến."
          />
          <div className="segmented shrink-0">
            <button 
              className={viewTab === 'day' ? 'active' : ''} 
              onClick={() => setViewTab('day')}
            >
              Ngày
            </button>
            <button 
              className={viewTab === 'week' ? 'active' : ''} 
              onClick={() => setViewTab('week')}
            >
              Tuần
            </button>
            <button 
              className={viewTab === 'month' ? 'active' : ''} 
              onClick={() => setViewTab('month')}
            >
              Tháng
            </button>
          </div>
        </div>

        {/* View Layouts */}
        {viewTab === 'month' && (
          <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
            
            {/* Month Calendar Grid (Consistent with Reference Image) */}
            <Card className="!p-6">
              {/* Calendar Navigator Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h3 className="text-base font-extrabold text-slate-800">
                    Tháng 5, 2026
                  </h3>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedDayNumber(7)} // today mark: May 7
                  className="px-3.5 py-1.5 rounded-full border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-xs font-bold text-teal-700 cursor-pointer"
                >
                  Hôm nay
                </button>
              </div>

              {/* Day Name labels (T2 to CN) */}
              <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2 py-2 border-b border-slate-100">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>

              {/* Calendar Grid cells */}
              <div className="grid grid-rows-5 gap-y-2">
                {daysInMonthGrid.map((week, weekIdx) => (
                  <div key={weekIdx} className="grid grid-cols-7 gap-1">
                    {week.map((cell, cellIdx) => {
                      const isSelected = cell.isCurrentMonth && cell.day === selectedDayNumber
                      
                      // Check if day has schedule events
                      const dayEvents = schedule.filter(item => item.date === cell.fullDateStr)
                      const hasHighPriority = dayEvents.some(e => e.priority === 'Cao')
                      const hasMediumPriority = dayEvents.some(e => e.priority === 'Trung bình')
                      const hasLowPriority = dayEvents.some(e => e.priority === 'Thấp')

                      return (
                        <div
                          key={cellIdx}
                          onClick={() => {
                            if (cell.isCurrentMonth) setSelectedDayNumber(cell.day)
                          }}
                          className={`min-h-16 p-2 rounded-lg border flex flex-col justify-between transition-all cursor-pointer relative ${
                            cell.isCurrentMonth 
                              ? 'bg-white hover:bg-slate-50/50 border-slate-100' 
                              : 'bg-slate-50/50 border-transparent text-slate-300 pointer-events-none'
                          } ${
                            isSelected ? '!border-teal-600 !bg-teal-50/20 shadow-sm' : ''
                          }`}
                        >
                          <span className={`text-xs font-bold ${
                            isSelected ? 'text-teal-700 font-black' : 'text-slate-800'
                          }`}>
                            {cell.day}
                          </span>

                          {/* Dots representation matching patient reference calendar */}
                          {dayEvents.length > 0 && cell.isCurrentMonth && (
                            <div className="flex items-center gap-1 mt-1">
                              {hasHighPriority && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Độ ưu tiên: Cao" />}
                              {hasMediumPriority && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Độ ưu tiên: Trung bình" />}
                              {hasLowPriority && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" title="Độ ưu tiên: Thấp" />}
                              {dayEvents.length > 1 && (
                                <span className="text-[9px] font-bold text-slate-400 ml-auto">{dayEvents.length}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legend indicator */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4 justify-center">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Ưu tiên Cao</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Ưu tiên Trung bình</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Ưu tiên Thấp</span>
              </div>
            </Card>

            {/* Selected day's appointment list */}
            <Card className="!p-6 flex flex-col h-[520px]">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={18} className="text-teal-600" />
                  Hẹn khám ngày {selectedDayNumber}/05/2026
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Có {selectedDaySchedules.length} lịch hẹn khám được ghi nhận.</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5">
                {selectedDaySchedules.length > 0 ? (
                  selectedDaySchedules.map((appt) => (
                    <div 
                      key={appt.id} 
                      onClick={() => {
                        setSelectedAppt(appt)
                        setIsRescheduling(false)
                      }}
                      className={`p-3.5 rounded-xl border bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all cursor-pointer ${
                        selectedAppt?.id === appt.id ? 'border-teal-500 bg-white ring-2 ring-teal-500/10' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {appt.timeSlot}
                        </span>
                        <Badge tone={appt.status === 'Đã xác nhận' ? 'green' : appt.status === 'Hủy' ? 'red' : 'yellow'}>
                          {appt.status}
                        </Badge>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-800">{appt.patientName}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin size={12} /> Format: {appt.type} ({appt.room})
                      </p>
                      
                      <div className="mt-2.5 flex items-center justify-between text-xs border-t border-slate-100/60 pt-2 text-slate-400">
                        <span>Độ ưu tiên: <b className="text-slate-600">{appt.priority}</b></span>
                        <span className="text-teal-600 font-bold hover:underline">Chi tiết →</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                    <Calendar size={32} className="opacity-40 mb-2" />
                    <p className="text-sm">Bác sĩ không có lịch trực hay hẹn tư vấn nào vào ngày này.</p>
                  </div>
                )}
              </div>
            </Card>

          </div>
        )}

        {viewTab === 'day' && (
          <div className="space-y-4 max-w-4xl">
            <Card className="!p-6">
              <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Danh sách lịch hẹn trong ngày</h3>
              <div className="divide-y divide-slate-100">
                {dayTabSchedules.map((appt) => (
                  <div key={appt.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg self-start">
                        {appt.timeSlot}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-800">{appt.patientName}</h4>
                        <p className="text-xs text-slate-500 mt-1">{appt.type} · {appt.room} • Lịch trình: {appt.day}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge tone={appt.priority === 'Cao' ? 'red' : appt.priority === 'Trung bình' ? 'yellow' : 'green'}>
                        Ưu tiên: {appt.priority}
                      </Badge>
                      <Button variant="ghost" className="btn-compact" onClick={() => setSelectedAppt(appt)}>
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {viewTab === 'week' && (
          <Card className="!p-6 overflow-hidden">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Tổng quan lịch trình tuần</h3>
            <div className="grid grid-cols-7 gap-3 text-center min-w-[700px]">
              {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day, idx) => {
                const dayAppts = weekTabSchedules.filter(item => item.day === day)
                return (
                  <div key={day} className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[180px]">
                    <span className="text-xs font-black text-slate-800 block border-b border-slate-200 pb-1.5 mb-2">{day}</span>
                    <div className="space-y-2">
                      {dayAppts.map(appt => (
                        <div key={appt.id} className="bg-white p-2 rounded-lg border border-slate-200/60 text-left text-[11px] shadow-sm">
                          <b className="text-slate-800 block truncate">{appt.patientName}</b>
                          <span className="text-teal-700 block mt-0.5 font-bold">{appt.timeSlot}</span>
                          <span className="text-slate-400 block truncate mt-0.5">{appt.room}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

      </div>

      {/* Appointment Detail Sidebar/Drawer Panel */}
      {selectedAppt && (
        <div className="modal-backdrop">
          <Card className="modal max-w-lg animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Chi tiết cuộc hẹn khám</h3>
                <span className="text-xs text-slate-400 block mt-0.5">Mã số cuộc hẹn: {selectedAppt.id}</span>
              </div>
              <button 
                onClick={() => setSelectedAppt(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-normal leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {isRescheduling ? (
              /* Reschedule form panel */
              <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  <CalendarClock size={16} className="text-teal-600" />
                  Dời ngày giờ cuộc hẹn mới
                </h4>
                
                <div>
                  <label className="field-label text-xs">Chọn ngày khám mới</label>
                  <input 
                    type="date" 
                    className="input text-xs" 
                    value={newDateVal}
                    onChange={e => setNewDateVal(e.target.value)}
                  />
                </div>

                <div>
                  <label className="field-label text-xs">Chọn ca / khung giờ mới</label>
                  <select 
                    className="input text-xs"
                    value={newTimeVal}
                    onChange={e => setNewTimeVal(e.target.value)}
                  >
                    <option value="08:00 - 08:30">08:00 - 08:30 (Sáng)</option>
                    <option value="09:00 - 09:30">09:00 - 09:30 (Sáng)</option>
                    <option value="10:30 - 11:00">10:30 - 11:00 (Sáng)</option>
                    <option value="14:00 - 14:30">14:00 - 14:30 (Chiều)</option>
                    <option value="15:30 - 16:00">15:30 - 16:00 (Chiều)</option>
                    <option value="18:30 - 19:00">18:30 - 19:00 (Tối)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <Button variant="ghost" className="btn-compact" onClick={() => setIsRescheduling(false)}>
                    Hủy bỏ
                  </Button>
                  <Button variant="primary" className="btn-compact" onClick={() => handleSaveReschedule(selectedAppt.id)}>
                    Cập nhật lịch mới
                  </Button>
                </div>
              </div>
            ) : (
              /* General Details view */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Bệnh nhân</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 block">{selectedAppt.patientName}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Trạng thái đặt</span>
                    <div className="mt-1">
                      <Badge tone={selectedAppt.status === 'Đã xác nhận' ? 'green' : selectedAppt.status === 'Hủy' ? 'red' : 'yellow'}>
                        {selectedAppt.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Khung giờ lịch đặt</span>
                  <span className="text-sm font-bold text-teal-700 mt-1 block flex items-center gap-1">
                    <Clock size={14} /> {selectedAppt.timeSlot} ({selectedAppt.day} ngày {selectedAppt.date}/2026)
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Hình thức & Phòng khám</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block flex items-center gap-1">
                    <MapPin size={14} /> {selectedAppt.type} · {selectedAppt.room}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Sàng lọc chatbot AI</span>
                  <div className="mt-2 text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200 flex gap-2 items-start">
                    <Info size={15} className="text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <b>Lý do khám:</b> {selectedAppt.symptoms}
                    </span>
                  </div>
                </div>

                {/* Operations Actions bar */}
                <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2.5 justify-end">
                  <Button variant="ghost" onClick={() => setSelectedAppt(null)}>
                    Đóng
                  </Button>
                  
                  {selectedAppt.status !== 'Hủy' && (
                    <>
                      <button 
                        onClick={() => handleCancelSchedule(selectedAppt.id)}
                        className="btn btn-danger btn-compact cursor-pointer"
                      >
                        <X size={14} /> Hủy lịch
                      </button>
                      <button 
                        onClick={() => setIsRescheduling(true)}
                        className="btn btn-outline btn-compact cursor-pointer"
                      >
                        <CalendarClock size={14} /> Dời lịch
                      </button>
                    </>
                  )}

                  {selectedAppt.status === 'Chờ' && (
                    <button 
                      onClick={() => handleConfirmSchedule(selectedAppt.id)}
                      className="btn btn-primary btn-compact cursor-pointer"
                    >
                      <Check size={14} /> Xác nhận lịch
                    </button>
                  )}

                  {(selectedAppt.room === 'Online' || selectedAppt.type.includes('trực tuyến')) && selectedAppt.status !== 'Hủy' && (
                    <button 
                      onClick={() => {
                        setSelectedAppt(null)
                        handleStartConsult(selectedAppt.patientName)
                      }}
                      className="btn btn-primary btn-compact cursor-pointer"
                    >
                      <Stethoscope size={14} /> Bắt đầu tư vấn
                    </button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </AppShell>
  )
}
