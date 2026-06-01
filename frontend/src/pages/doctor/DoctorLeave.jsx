import { useState, useEffect } from 'react'
import {
  CheckCircle2, Calendar, ClipboardList, Plus, Trash2,
  CalendarOff, Clock, AlertCircle, X,
} from 'lucide-react'
import { AppShell, TopBar } from '../../components/ui.jsx'
import { getStoredLeaves, saveStoredLeaves } from '../../data/doctorStore.js'

function statusStyle(s) {
  if (s === 'Đã duyệt')  return 'bg-teal-100  text-teal-700  border-teal-200'
  if (s === 'Từ chối')   return 'bg-rose-100  text-rose-700  border-rose-200'
  return 'bg-amber-100 text-amber-700 border-amber-200'
}

export function DoctorLeave() {
  const [leaves, setLeaves]       = useState([])
  const [leaveStart, setLeaveStart] = useState('')
  const [leaveEnd, setLeaveEnd]   = useState('')
  const [leaveReason, setLeaveReason] = useState('')
  const [toast, setToast]         = useState('')
  const [cancelId, setCancelId]   = useState(null)  // confirm modal

  useEffect(() => { setLeaves(getStoredLeaves()) }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!leaveStart || !leaveEnd || !leaveReason) {
      alert('Vui lòng điền đầy đủ ngày và lý do nghỉ.')
      return
    }
    if (leaveEnd < leaveStart) {
      alert('Ngày kết thúc phải sau ngày bắt đầu.')
      return
    }
    const newReq = {
      id: `LV-${100 + leaves.length + 1}`,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
      status: 'Chờ duyệt',
    }
    const updated = [newReq, ...leaves]
    setLeaves(updated)
    saveStoredLeaves(updated)
    setLeaveStart(''); setLeaveEnd(''); setLeaveReason('')
    showToast('Đã gửi đơn đăng ký nghỉ phép thành công!')
  }

  const handleCancel = (id) => {
    const updated = leaves.filter(l => l.id !== id)
    setLeaves(updated)
    saveStoredLeaves(updated)
    setCancelId(null)
    showToast('Đã hủy đơn nghỉ phép.')
  }

  const formatDate = (d) => d ? d.split('-').reverse().join('/') : '—'
  const daysBetween = (s, e) => {
    if (!s || !e) return 0
    return Math.max(1, Math.ceil((new Date(e) - new Date(s)) / 86400000) + 1)
  }

  const pending  = leaves.filter(l => l.status === 'Chờ duyệt').length
  const approved = leaves.filter(l => l.status === 'Đã duyệt').length
  const totalDays = leaves.filter(l => l.status === 'Đã duyệt')
    .reduce((acc, l) => acc + daysBetween(l.startDate, l.endDate), 0)

  return (
    <AppShell role="doctor">
      <TopBar />

      <div className="px-6 pb-8 max-w-5xl space-y-6">

        {/* Page header */}
        <div className="pt-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarOff size={24} className="text-teal-600" />
            Đăng ký nghỉ phép
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Nộp đơn, theo dõi và quản lý các yêu cầu nghỉ phép</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Đơn chờ duyệt',   value: pending,    color: 'amber' },
            { label: 'Đã được duyệt',    value: approved,   color: 'teal' },
            { label: 'Ngày nghỉ đã dùng', value: totalDays, color: 'sky', unit: 'ngày' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className={`text-3xl font-extrabold ${
                s.color === 'amber' ? 'text-amber-500' :
                s.color === 'sky'   ? 'text-sky-600'   : 'text-teal-600'
              }`}>
                {s.value}{s.unit ? <span className="text-base ml-1 font-semibold">{s.unit}</span> : ''}
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

          {/* Left: Submit form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Plus size={18} className="text-teal-600" />
              Nộp đơn nghỉ phép mới
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label text-xs">Từ ngày</label>
                <input
                  type="date"
                  className="input"
                  value={leaveStart}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setLeaveStart(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label text-xs">Đến ngày</label>
                <input
                  type="date"
                  className="input"
                  value={leaveEnd}
                  min={leaveStart || new Date().toISOString().split('T')[0]}
                  onChange={e => setLeaveEnd(e.target.value)}
                />
              </div>

              {leaveStart && leaveEnd && leaveEnd >= leaveStart && (
                <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5 text-xs text-teal-800 flex items-center gap-2">
                  <Clock size={13} className="text-teal-600" />
                  Thời gian nghỉ: <b>{daysBetween(leaveStart, leaveEnd)} ngày</b>
                  &nbsp;({formatDate(leaveStart)} – {formatDate(leaveEnd)})
                </div>
              )}

              <div>
                <label className="field-label text-xs">Lý do nghỉ phép</label>
                <input
                  type="text"
                  className="input"
                  placeholder="VD: Nghỉ phép cá nhân, Đột xuất gia đình..."
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Gửi yêu cầu nghỉ phép
              </button>
            </form>
          </div>

          {/* Right: History */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList size={18} className="text-teal-600" />
                Lịch sử đơn nghỉ phép
              </h3>
              <span className="text-xs text-slate-400">{leaves.length} đơn</span>
            </div>

            {leaves.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {leaves.map(req => (
                  <div key={req.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                    {/* Date block */}
                    <div className="bg-slate-100 rounded-xl px-3 py-2 text-center shrink-0 min-w-[64px]">
                      <div className="text-base font-extrabold text-slate-800">
                        {req.startDate.split('-')[2]}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">
                        Tháng {req.startDate.split('-')[1]}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-800">{req.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">
                          {formatDate(req.startDate)} → {formatDate(req.endDate)}
                        </span>
                        <span className="ml-2 text-slate-400">({daysBetween(req.startDate, req.endDate)} ngày)</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{req.reason}</p>
                    </div>

                    {/* Cancel */}
                    {req.status === 'Chờ duyệt' && (
                      <button
                        onClick={() => setCancelId(req.id)}
                        title="Hủy đơn"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <CalendarOff size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-medium">Chưa có đơn nghỉ phép nào</p>
                <p className="text-xs mt-1">Sử dụng form bên trái để nộp đơn mới</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm cancel modal */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-rose-600" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Xác nhận hủy đơn</h4>
                <p className="text-xs text-slate-500 mt-0.5">Đơn nghỉ phép sẽ bị xóa khỏi hệ thống.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                onClick={() => handleCancel(cancelId)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast toast-green">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}
    </AppShell>
  )
}
