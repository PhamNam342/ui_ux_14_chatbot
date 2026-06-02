import { useState, useEffect, useMemo } from 'react'
import { Search, Calendar, Star, Eye, Pill, ClipboardList, Info, MessageSquare, AlertTriangle, ArrowRight, User, X } from 'lucide-react'
import { AppShell, Badge, Card, TopBar, PageHeader, Button } from '../../components/ui.jsx'
import { getStoredHistories } from '../../data/doctorStore.js'

export function DoctorHistory() {
  const [histories, setHistories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [detailTab, setDetailTab] = useState('medical')
  
  // Storage load
  useEffect(() => {
    setHistories(getStoredHistories())

    const handleStorage = () => {
      setHistories(getStoredHistories())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Filter histories based on search query & date range
  const filteredHistories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    
    let start = startDate ? new Date(startDate) : null
    if (start) start.setHours(0, 0, 0, 0)
    
    let end = endDate ? new Date(endDate) : null
    if (end) end.setHours(23, 59, 59, 999)

    return histories.filter(item => {
      const matchesSearch = 
        !query || 
        item.patient.toLowerCase().includes(query) || 
        item.diagnosis.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)

      let matchesDate = true
      if (item.date) {
        const [day, month, year] = item.date.split('/').map(Number)
        const recordDate = new Date(year, month - 1, day)
        if (start && recordDate < start) matchesDate = false
        if (end && recordDate > end) matchesDate = false
      }

      return matchesSearch && matchesDate
    })
  }, [histories, searchQuery, startDate, endDate])

  // Get active chat logs for selected record
  const selectedRecordChatLogs = useMemo(() => {
    if (!selectedRecord) return []
    const allChats = JSON.parse(localStorage.getItem('med_chats') || '{}')
    return allChats[selectedRecord.code] || []
  }, [selectedRecord])

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        
        {/* Header */}
        <PageHeader 
          title="Quản lý hồ sơ khám"
          subtitle="Kho lưu trữ tra cứu toàn bộ hồ sơ khám bệnh, kết quả chẩn đoán và đơn thuốc đã phát hành."
        />

        {/* Filters Panel */}
        <Card className="mb-7 !p-5">
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr] items-end">
            <div>
              <label className="field-label text-xs">Tìm kiếm hồ sơ</label>
              <label className="search !min-h-[40px] !h-[40px]">
                <Search size={16} />
                <input 
                  placeholder="Nhập tên bệnh nhân, chẩn đoán, mã ca..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </label>
            </div>
            
            <div>
              <label className="field-label text-xs">Từ ngày</label>
              <input 
                type="date"
                className="input !h-[40px]" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label text-xs">Đến ngày</label>
              <input 
                type="date"
                className="input !h-[40px]" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Data Table */}
        <Card className="overflow-hidden p-0 border border-slate-200">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã hồ sơ</th>
                  <th>Bệnh nhân</th>
                  <th>Ngày khám</th>
                  <th>Chẩn đoán chính</th>
                  <th>Hướng xử lý</th>
                  <th>Đánh giá</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistories.length > 0 ? (
                  filteredHistories.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="font-bold text-teal-600">{row.code}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <b className="text-slate-800">{row.patient}</b>
                          <span className="text-xs text-slate-400">({row.gender} • {row.age}T)</span>
                        </div>
                      </td>
                      <td className="text-slate-500 font-medium">{row.date} · {row.time}</td>
                      <td className="font-semibold text-slate-700">{row.diagnosis}</td>
                      <td>
                        <Badge tone={
                          row.actionPath === 'Tái khám' ? 'yellow' : 
                          row.actionPath.includes('phòng khám') ? 'blue' : 
                          row.actionPath === 'Chuyển tuyến' ? 'red' : 'green'
                        }>
                          {row.actionPath}
                        </Badge>
                      </td>
                      <td>
                        <span className="text-amber-500 font-bold" aria-label={`${row.rating} sao`}>
                          {'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}
                        </span>
                      </td>
                      <td className="text-right">
                        <button 
                          onClick={() => { setSelectedRecord(row); setDetailTab('medical'); }}
                          className="mini-btn teal cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye size={13} />
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                      Không tìm thấy kết quả hồ sơ bệnh án nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="table-footer border-t border-slate-100 bg-slate-50/30">
            <span>Hiển thị {filteredHistories.length} trong tổng số {histories.length} kết quả</span>
            <div className="pagination">
              <button className="cursor-pointer">‹</button>
              <button className="active cursor-pointer">1</button>
              <button className="cursor-pointer">›</button>
            </div>
          </div>
        </Card>
      </div>

      {/* Record detail Overlay Panel (Slide-in right overlay, identical to patient details UI) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto animate-in fade-in duration-200"
            onClick={() => setSelectedRecord(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-[480px] bg-white shadow-2xl pointer-events-auto flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-250">

            {/* Panel header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-xl">
                    {selectedRecord.patient.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">{selectedRecord.patient}</h2>
                    <p className="text-teal-100 text-sm mt-0.5">{selectedRecord.gender} • {selectedRecord.age} tuổi</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/60 text-white">
                      Mã HS: {selectedRecord.code}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => alert(`Đang in bệnh án mã: ${selectedRecord.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-teal-700 text-xs font-bold hover:bg-teal-50 transition-colors cursor-pointer"
                >
                  In hồ sơ bệnh án
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {[
                { id: 'medical', label: 'Chẩn đoán', icon: <ClipboardList size={14} /> },
                { id: 'patient', label: 'Bệnh nhân', icon: <User size={14} /> },
                { id: 'chat', label: 'Hội thoại', icon: <MessageSquare size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold border-b-2 transition-all cursor-pointer ${
                    detailTab === tab.id
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

              {/* ── TAB: Chẩn đoán ── */}
              {detailTab === 'medical' && (
                <>
                  {/* Medical Diagnosis & Notes */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Kết quả chẩn đoán chuyên khoa</span>
                    <div className="text-sm font-bold text-teal-800">
                      {selectedRecord.diagnosis}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-2">
                      {selectedRecord.note}
                    </p>
                  </div>

                  {/* Prescriptions */}
                  {selectedRecord.prescription && selectedRecord.prescription.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1 mb-2">
                        <Pill size={13} className="text-teal-600" />
                        Đơn thuốc được kê
                      </span>
                      <div className="space-y-2">
                        {selectedRecord.prescription.map((med, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-150 text-xs">
                            <div>
                              <b className="text-slate-800">{med.name}</b>
                              <span className="text-slate-500 block mt-0.5">Liều lượng: {med.dose}</span>
                            </div>
                            <Badge tone="neutral">{med.note}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Re-examination & Follow-up notes */}
                  {selectedRecord.actionPath === 'Tái khám' && selectedRecord.reExamDate && (
                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex gap-2.5">
                      <Calendar size={16} className="text-teal-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-teal-800 font-bold uppercase block">Lịch hẹn tái khám đã xếp</span>
                        <b className="text-xs text-teal-900 block mt-1">
                          Hẹn tái khám vào ngày: {selectedRecord.reExamDate.split('-').reverse().join('/')}
                        </b>
                        {selectedRecord.reExamNote && (
                          <p className="text-xs text-teal-700 mt-1 leading-normal italic">
                            "Lưu ý: {selectedRecord.reExamNote}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── TAB: Bệnh nhân ── */}
              {detailTab === 'patient' && (
                <>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Thông tin liên lạc</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <User size={14} className="text-teal-500 shrink-0" />
                      <b className="text-slate-800">{selectedRecord.patient}</b>
                      <span className="text-xs text-slate-500">({selectedRecord.gender} • {selectedRecord.age} tuổi)</span>
                    </div>
                    <div className="text-xs text-slate-500">SĐT liên hệ: {selectedRecord.phone}</div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Thời gian tư vấn</span>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar size={14} className="text-teal-600" />
                      {selectedRecord.date} lúc {selectedRecord.time}
                    </div>
                    <div className="text-xs text-slate-400">Địa điểm: {selectedRecord.clinic}</div>
                  </div>

                  {selectedRecord.symptoms && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex gap-2 items-start">
                      <Info size={16} className="text-teal-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Triệu chứng ban đầu (Chatbot thu thập)</span>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedRecord.symptoms}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── TAB: Hội thoại ── */}
              {detailTab === 'chat' && (
                <>
                  {selectedRecordChatLogs.length > 0 ? (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
                        Hội thoại chẩn đoán trong phiên
                      </span>
                      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4 max-h-[380px] overflow-y-auto space-y-3.5">
                        {selectedRecordChatLogs.map((msg, idx) => (
                          <div key={idx} className={`flex flex-col ${msg.mine ? 'items-end' : 'items-start'}`}>
                            <span className="text-[9px] text-slate-500 block mb-0.5">{msg.who} • {msg.time}</span>
                            <div className={`p-2.5 rounded-xl text-xs max-w-[80%] ${
                              msg.mine 
                                ? 'bg-teal-600 text-white rounded-tr-none' 
                                : 'bg-slate-800 text-slate-200 rounded-tl-none'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-slate-400">
                      <MessageSquare size={36} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-sm">Không có cuộc hội thoại nào</p>
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
