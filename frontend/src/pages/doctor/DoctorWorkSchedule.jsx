import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Sun, Cloud, Moon, CalendarDays, Info } from 'lucide-react'
import { AppShell, TopBar } from '../../components/ui.jsx'

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']

const SHIFTS = [
  { key: 'morning',   label: 'Sáng',  time: '08:00 – 12:00', icon: Sun,   color: 'amber' },
  { key: 'afternoon', label: 'Chiều', time: '13:30 – 17:30', icon: Cloud, color: 'sky' },
  { key: 'evening',   label: 'Tối',   time: '18:00 – 21:00', icon: Moon,  color: 'violet' },
]

const DEFAULT_DAYS = {
  'Thứ 2': { morning: true,  afternoon: true,  evening: false },
  'Thứ 3': { morning: false, afternoon: true,  evening: true  },
  'Thứ 4': { morning: true,  afternoon: true,  evening: false },
  'Thứ 5': { morning: true,  afternoon: false, evening: true  },
  'Thứ 6': { morning: false, afternoon: true,  evening: false },
  'Thứ 7': { morning: true,  afternoon: false, evening: false },
  'CN':    { morning: false, afternoon: false, evening: false },
}

function shiftColor(color, active) {
  const map = {
    amber:  { on: 'bg-amber-500',  off: 'bg-slate-200', pill: 'bg-amber-50  text-amber-700  border-amber-200'  },
    sky:    { on: 'bg-sky-500',    off: 'bg-slate-200', pill: 'bg-sky-50    text-sky-700    border-sky-200'    },
    violet: { on: 'bg-violet-500', off: 'bg-slate-200', pill: 'bg-violet-50 text-violet-700 border-violet-200' },
  }
  return active ? map[color].on : map[color].off
}

export function DoctorWorkSchedule() {
  const [workDays, setWorkDays] = useState(() => {
    try {
      const saved = localStorage.getItem('med_doctor_shifts')
      return saved ? JSON.parse(saved) : DEFAULT_DAYS
    } catch {
      return DEFAULT_DAYS
    }
  })
  const [toast, setToast] = useState('')

  const toggle = (day, shift) =>
    setWorkDays(prev => ({ ...prev, [day]: { ...prev[day], [shift]: !prev[day][shift] } }))

  const handleSave = () => {
    localStorage.setItem('med_doctor_shifts', JSON.stringify(workDays))
    setToast('Đã lưu lịch ca trực thành công!')
    setTimeout(() => setToast(''), 2500)
  }

  // Derived stats
  const totalShifts = Object.values(workDays).reduce((acc, day) =>
    acc + Object.values(day).filter(Boolean).length, 0)
  const workingDays = Object.values(workDays).filter(d => Object.values(d).some(Boolean)).length

  return (
    <AppShell role="doctor">
      <TopBar />

      <div className="px-6 pb-8 max-w-5xl space-y-6">

        {/* Page header */}
        <div className="pt-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarDays size={24} className="text-teal-600" />
            Lịch làm việc
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Thiết lập ngày trực và ca khám theo tuần để bệnh nhân đặt lịch</p>
        </div>

        {/* Stat summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Ngày làm việc/tuần', value: workingDays, unit: 'ngày', color: 'teal' },
            { label: 'Tổng ca khám/tuần',  value: totalShifts, unit: 'ca',   color: 'sky' },
            { label: 'Đánh giá bác sĩ',    value: '4.9 ★',   unit: '',     color: 'amber' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className={`text-3xl font-extrabold ${
                s.color === 'teal' ? 'text-teal-600' :
                s.color === 'sky' ? 'text-sky-600' : 'text-amber-500'
              }`}>
                {s.value}<span className="text-base ml-1 font-semibold">{s.unit}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2.5 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-xs text-teal-800">
          <Info size={15} className="text-teal-600 shrink-0 mt-0.5" />
          <span>Bấm vào ô ca trực để bật/tắt. Màu tô = ca đang đăng ký. Người bệnh chỉ thấy những ca đã bật khi đặt lịch khám.</span>
        </div>

        {/* Main schedule grid */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {/* Shift legend header */}
          <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/50">
            <div className="px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Ngày</div>
            {SHIFTS.map(s => {
              const Icon = s.icon
              return (
                <div key={s.key} className="px-3 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Icon size={14} className={
                      s.color === 'amber' ? 'text-amber-500' :
                      s.color === 'sky' ? 'text-sky-500' : 'text-violet-500'
                    } />
                    <span className="text-xs font-extrabold text-slate-700">Ca {s.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.time}</div>
                </div>
              )
            })}
          </div>

          {/* Day rows */}
          {DAYS.map((day, idx) => {
            const anyActive = Object.values(workDays[day] || {}).some(Boolean)
            return (
              <div
                key={day}
                className={`grid grid-cols-4 border-b border-slate-100 last:border-0 transition-colors ${
                  anyActive ? 'bg-white' : 'bg-slate-50/30'
                } hover:bg-teal-50/10`}
              >
                {/* Day label */}
                <div className="px-5 py-4 flex items-center gap-2">
                  <span className={`text-sm font-extrabold ${anyActive ? 'text-slate-800' : 'text-slate-400'}`}>
                    {day}
                  </span>
                  {day === 'CN' && <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-semibold">Nghỉ</span>}
                </div>

                {/* Shift toggle cells */}
                {SHIFTS.map(s => {
                  const active = workDays[day]?.[s.key] ?? false
                  return (
                    <div key={s.key} className="px-3 py-4 flex justify-center items-center">
                      <button
                        onClick={() => toggle(day, s.key)}
                        title={`${day} – Ca ${s.label}: ${active ? 'Tắt ca này' : 'Bật ca này'}`}
                        className={`relative w-12 h-6 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
                          shiftColor(s.color, active)
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                          active ? 'right-0.5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Lưu lịch làm việc
          </button>
        </div>
      </div>

      {toast && (
        <div className="toast toast-green">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}
    </AppShell>
  )
}
