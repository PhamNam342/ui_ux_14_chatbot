import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Check, X, CalendarClock, ChevronLeft, ChevronRight, Stethoscope, Info, CalendarOff } from 'lucide-react'
import { AppShell, Badge, Card, TopBar, Button, PageHeader } from '../../components/ui.jsx'
import { getStoredSchedule, saveStoredSchedule, getStoredCases } from '../../data/doctorStore.js'

export function DoctorSchedule() {
  const navigate = useNavigate()
  const [schedule, setSchedule] = useState(() => getStoredSchedule())
  const [casesList, setCasesList] = useState(() => getStoredCases())
  const [viewTab, setViewTab] = useState('month') // 'day', 'week', 'month'
  
  // Date states
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => new Date().getDate())
  const [selectedAppt, setSelectedAppt] = useState(null)
  
  // Custom date picker states
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [pickerMonthDate, setPickerMonthDate] = useState(() => new Date())
  
  // Reschedule form states
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [newDateVal, setNewDateVal] = useState('')
  const [cancelTargetAppt, setCancelTargetAppt] = useState(null)
  const [newTimeVal, setNewTimeVal] = useState('09:00 - 09:30')

  // Load schedule data
  useEffect(() => {
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

  // Day/Week navigation helpers
  const handlePrevDay = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1))
  }

  const handleNextDay = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1))
  }

  const handlePrevWeek = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7))
  }

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7))
  }

  const handleGoToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDayNumber(today.getDate())
  }

  // Week range helper (Monday - Sunday)
  const getWeekRange = useCallback((date) => {
    const current = new Date(date)
    const day = current.getDay()
    const distanceToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(current)
    monday.setDate(current.getDate() + distanceToMonday)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    return { monday, sunday }
  }, [])

  // Parse DD/MM string to Date object
  const parseScheduleDate = useCallback((dateStr) => {
    if (!dateStr) return new Date()
    const [d, m] = dateStr.split('/').map(Number)
    const year = currentDate.getFullYear()
    return new Date(year, m - 1, d)
  }, [currentDate])

  // Format Date object to YYYY-MM-DD
  const getYYYYMMDD = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Filter schedules for the selected day in Month View
  const selectedDaySchedules = useMemo(() => {
    const formattedDayStr = `${String(selectedDayNumber).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}` // E.g., '07/05'
    return schedule.filter(item => item.date === formattedDayStr)
  }, [schedule, selectedDayNumber, currentDate])

  // All schedules for active day (Day tab)
  const dayTabSchedules = useMemo(() => {
    const formattedDayStr = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    return schedule.filter(item => item.date === formattedDayStr)
  }, [schedule, currentDate])

  // Week schedules
  const weekTabSchedules = useMemo(() => {
    const { monday, sunday } = getWeekRange(currentDate)
    const start = new Date(monday)
    start.setHours(0, 0, 0, 0)
    const end = new Date(sunday)
    end.setHours(23, 59, 59, 999)

    return schedule.filter(item => {
      if (!item.date) return false
      const itemDate = parseScheduleDate(item.date)
      itemDate.setHours(0, 0, 0, 0)
      return itemDate >= start && itemDate <= end
    })
  }, [schedule, currentDate, getWeekRange, parseScheduleDate])

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
    const matched = schedule.find(item => item.id === id)
    if (matched) {
      setCancelTargetAppt(matched)
    }
  }

  const confirmCancelSchedule = () => {
    if (!cancelTargetAppt) return
    const id = cancelTargetAppt.id
    const updated = schedule.map(item => item.id === id ? { ...item, status: 'Hủy' } : item)
    setSchedule(updated)
    saveStoredSchedule(updated)
    if (selectedAppt && selectedAppt.id === id) {
      setSelectedAppt({ ...selectedAppt, status: 'Hủy' })
    }
    setCancelTargetAppt(null)
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

  // Helper to generate monthly grid
  const getDaysInMonthGrid = (targetDate) => {
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth() // 0-11
    
    // First day of current month
    const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sun, 1 = Mon, ...
    // Offset for Monday start
    const offset = (firstDayIndex + 6) % 7
    
    const grid = []
    
    // Previous month details
    const prevMonthDate = new Date(year, month, 0)
    const daysInPrevMonth = prevMonthDate.getDate()
    const prevMonth = prevMonthDate.getMonth()
    
    // Add previous month tail days
    for (let i = offset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      grid.push({
        day: d,
        isCurrentMonth: false,
        fullDateStr: `${String(d).padStart(2, '0')}/${String(prevMonth + 1).padStart(2, '0')}`,
        dateObj: new Date(year, prevMonth, d)
      })
    }
    
    // Current month days
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      grid.push({
        day,
        isCurrentMonth: true,
        fullDateStr: `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`,
        dateObj: new Date(year, month, day)
      })
    }
    
    // Next month head days
    const totalCells = grid.length > 35 ? 42 : 35
    const nextMonthDaysCount = totalCells - grid.length
    const nextMonthDate = new Date(year, month + 1, 1)
    const nextMonth = nextMonthDate.getMonth()
    
    for (let day = 1; day <= nextMonthDaysCount; day++) {
      grid.push({
        day: day,
        isCurrentMonth: false,
        fullDateStr: `${String(day).padStart(2, '0')}/${String(nextMonth + 1).padStart(2, '0')}`,
        dateObj: new Date(year, nextMonth, day)
      })
    }
    
    // Return chunks of 7 (weekly structure)
    const weeks = []
    for (let i = 0; i < grid.length; i += 7) {
      weeks.push(grid.slice(i, i + 7))
    }
    return weeks
  }

  const daysInMonthGrid = useMemo(() => {
    return getDaysInMonthGrid(currentDate)
  }, [currentDate])

  const openDatePicker = (e) => {
    e.stopPropagation()
    setPickerMonthDate(new Date(currentDate))
    setIsPickerOpen(true)
  }

  const renderDatePicker = () => {
    if (!isPickerOpen) return null

    const pickerWeeks = getDaysInMonthGrid(pickerMonthDate)
    const pickerMonth = pickerMonthDate.getMonth()
    const pickerYear = pickerMonthDate.getFullYear()

    const handlePrevPickerMonth = (e) => {
      e.stopPropagation()
      setPickerMonthDate(new Date(pickerYear, pickerMonth - 1, 1))
    }

    const handleNextPickerMonth = (e) => {
      e.stopPropagation()
      setPickerMonthDate(new Date(pickerYear, pickerMonth + 1, 1))
    }

    const handleSelectDate = (dateObj, e) => {
      e.stopPropagation()
      setCurrentDate(dateObj)
      setSelectedDayNumber(dateObj.getDate())
      setIsPickerOpen(false)
    }

    return (
      <>
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default" 
          onClick={(e) => {
            e.stopPropagation()
            setIsPickerOpen(false)
          }}
        />
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 z-50 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-4 w-[280px] pointer-events-auto cursor-default animate-in fade-in slide-in-from-top-2 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Picker Header */}
          <div className="flex items-center justify-between mb-3">
            <button 
              type="button"
              onClick={handlePrevPickerMonth}
              className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-600 transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs font-black text-slate-800">
              Tháng {pickerMonth + 1}, {pickerYear}
            </span>
            <button 
              type="button"
              onClick={handleNextPickerMonth}
              className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-600 transition-colors flex items-center justify-center"
            >
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Day Names Row */}
          <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 mb-1 py-1 border-b border-slate-100">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>CN</span>
          </div>

          {/* Calendar Cells Grid */}
          <div className="grid grid-cols-7 gap-1 mt-1">
            {pickerWeeks.flatMap(week => week).map((cell, idx) => {
              const isSelected = getYYYYMMDD(cell.dateObj) === getYYYYMMDD(currentDate)
              const isToday = getYYYYMMDD(cell.dateObj) === getYYYYMMDD(new Date())

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    if (cell.isCurrentMonth) {
                      handleSelectDate(cell.dateObj, e)
                    }
                  }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                    cell.isCurrentMonth 
                      ? isSelected 
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20' 
                        : isToday
                          ? 'border border-teal-500 text-teal-700 bg-teal-50/30 hover:bg-teal-50'
                          : 'text-slate-800 hover:bg-slate-100'
                      : 'text-slate-300 bg-slate-50/20 opacity-30 pointer-events-none'
                  }`}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>
        </div>
      </>
    )
  }

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
                    className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div 
                    onClick={openDatePicker}
                    className="relative h-11 px-5 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-800 transition-colors font-bold text-sm sm:text-base"
                  >
                    Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
                    {renderDatePicker()}
                  </div>
                  <button 
                    onClick={handleNextMonth}
                    className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    const today = new Date()
                    setCurrentDate(today)
                    setSelectedDayNumber(today.getDate())
                  }}
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
              <div className="flex flex-col gap-y-2">
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
            <Card className="!p-6 flex flex-col h-full">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={18} className="text-teal-600" />
                  Hẹn khám ngày {selectedDayNumber}/{String(currentDate.getMonth() + 1).padStart(2, '0')}/{currentDate.getFullYear()}
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
          <div className="space-y-4">
            {/* Day navigator */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <button 
                  onClick={handlePrevDay}
                  className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div 
                  onClick={openDatePicker}
                  className="relative h-11 min-w-[260px] px-5 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-800 transition-colors font-bold text-sm sm:text-base"
                >
                  {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {renderDatePicker()}
                </div>
                <button 
                  onClick={handleNextDay}
                  className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <button 
                onClick={handleGoToToday}
                className="px-3.5 py-1.5 rounded-full border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-xs font-bold text-teal-700 cursor-pointer"
              >
                Hôm nay
              </button>
            </div>

            <Card className="!p-6">
              <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Danh sách lịch hẹn trong ngày</h3>
              <div className="divide-y divide-slate-100">
                {dayTabSchedules.length > 0 ? (
                  dayTabSchedules.map((appt) => (
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

        {viewTab === 'week' && (
          <div className="space-y-4">
            {/* Week navigator */}
            <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevWeek}
                  className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div 
                  onClick={openDatePicker}
                  className="relative h-11 px-5 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-800 transition-colors font-bold text-sm sm:text-base"
                >
                  {(() => {
                    const { monday, sunday } = getWeekRange(currentDate)
                    return `Tuần: ${monday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${sunday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                  })()}
                  {renderDatePicker()}
                </div>
                <button 
                  onClick={handleNextWeek}
                  className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <button 
                onClick={handleGoToToday}
                className="px-3.5 py-1.5 rounded-full border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-xs font-bold text-teal-700 cursor-pointer"
              >
                Hôm nay
              </button>
            </div>

            <Card className="!p-6 overflow-hidden">
              <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Tổng quan lịch trình tuần</h3>
              <div className="grid grid-cols-7 gap-3 text-center min-w-[700px]">
                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day, idx) => {
                  const { monday } = getWeekRange(currentDate)
                  const colDate = new Date(monday)
                  colDate.setDate(monday.getDate() + idx)
                  const colDateStr = `${String(colDate.getDate()).padStart(2, '0')}/${String(colDate.getMonth() + 1).padStart(2, '0')}`

                  // Filter by exact date matching the column
                  const dayAppts = weekTabSchedules.filter(item => item.date === colDateStr)

                  return (
                    <div key={day} className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[220px] flex flex-col">
                      <div className="border-b border-slate-200 pb-1.5 mb-2">
                        <span className="text-xs font-black text-slate-800 block">{day}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{colDateStr}</span>
                      </div>
                      <div className="space-y-2 flex-1 overflow-y-auto">
                        {dayAppts.length > 0 ? (
                          dayAppts.map(appt => (
                            <div 
                              key={appt.id} 
                              onClick={() => {
                                setSelectedAppt(appt)
                                setIsRescheduling(false)
                              }}
                              className="bg-white p-2 rounded-lg border border-slate-200/60 text-left text-[11px] shadow-sm hover:border-teal-400 hover:shadow transition-all cursor-pointer"
                            >
                              <b className="text-slate-800 block truncate">{appt.patientName}</b>
                              <span className="text-teal-700 block mt-0.5 font-bold">{appt.timeSlot}</span>
                              <span className="text-slate-400 block truncate mt-0.5">{appt.room}</span>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] text-slate-300 italic pt-6">
                            Trống
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
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

      {cancelTargetAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2.5 text-rose-600 mb-3">
              <CalendarOff size={22} />
              <h3 className="text-lg font-bold text-slate-800">Xác nhận hủy lịch khám</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn hủy lịch khám của bệnh nhân <strong>{cancelTargetAppt.patientName}</strong> vào lúc <strong>{cancelTargetAppt.timeSlot}</strong> không?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCancelTargetAppt(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Quay lại
              </button>
              <button
                onClick={confirmCancelSchedule}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
