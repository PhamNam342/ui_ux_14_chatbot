import { useState, useEffect, useMemo } from 'react'
import { Search, Calendar, Star, Eye, Pill, ClipboardList, Info, MessageSquare, AlertTriangle, ArrowRight, User, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { AppShell, Badge, Card, TopBar, PageHeader, Button } from '../../components/ui.jsx'
import { getStoredHistories } from '../../data/doctorStore.js'

export function DoctorHistory() {
  const [histories, setHistories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [detailTab, setDetailTab] = useState('medical')
  const [filterAction, setFilterAction] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('date-desc')
  
  // Storage load
  useEffect(() => {
    setHistories(getStoredHistories())

    const handleStorage = () => {
      setHistories(getStoredHistories())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Filter histories based on search query, date range, action, and sorting
  const filteredHistories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    
    let start = startDate ? new Date(startDate) : null
    if (start) start.setHours(0, 0, 0, 0)
    
    let end = endDate ? new Date(endDate) : null
    if (end) end.setHours(23, 59, 59, 999)

    // 1. Filtering
    let list = histories.filter(item => {
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

      let matchesAction = true
      if (filterAction !== 'Tất cả') {
        if (filterAction === 'Tái khám') {
          matchesAction = item.actionPath.includes('Tái khám')
        } else if (filterAction === 'Chuyển tuyến') {
          matchesAction = item.actionPath.includes('Chuyển tuyến')
        } else if (filterAction === 'Theo dõi tại nhà') {
          matchesAction = item.actionPath.includes('Theo dõi tại nhà')
        }
      }

      return matchesSearch && matchesDate && matchesAction
    })

    // 2. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy.startsWith('date')) {
        const [d1, m1, y1] = a.date.split('/').map(Number)
        const [h1, min1] = (a.time || '00:00').split(':').map(Number)
        const dateA = new Date(y1, m1 - 1, d1, h1, min1)

        const [d2, m2, y2] = b.date.split('/').map(Number)
        const [h2, min2] = (b.time || '00:00').split(':').map(Number)
        const dateB = new Date(y2, m2 - 1, d2, h2, min2)

        return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB
      }
      if (sortBy === 'name-asc') {
        return a.patient.localeCompare(b.patient, 'vi')
      }
      if (sortBy === 'diag-asc') {
        return a.diagnosis.localeCompare(b.diagnosis, 'vi')
      }
      return 0
    })

    return list
  }, [histories, searchQuery, startDate, endDate, filterAction, sortBy])

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
        <Card className="mb-5 !p-3 flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <label className="search flex-1 min-w-[200px] !min-h-[38px] !h-[38px] !rounded-lg !py-0 !px-3">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input 
              placeholder="Tìm theo tên bệnh nhân, chẩn đoán, mã ca..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ fontSize: '12px' }}
            />
          </label>

          {/* Hướng xử lý filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-500 font-semibold whitespace-nowrap" style={{ fontSize: '12px' }}>Hướng xử lý:</span>
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all rounded-lg font-semibold"
              style={{ fontSize: '12px', height: '38px', padding: '0 12px', minWidth: '130px' }}
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Theo dõi tại nhà">Theo dõi tại nhà</option>
              <option value="Tái khám">Tái khám</option>
              <option value="Chuyển tuyến">Chuyển tuyến</option>
            </select>
          </div>

          {/* Date Range filters */}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-500 font-semibold whitespace-nowrap" style={{ fontSize: '12px' }}>Từ:</span>
            <input 
              type="date"
              className="border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all rounded-lg" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ fontSize: '12px', height: '38px', padding: '0 10px' }}
            />
            <span className="text-slate-500 font-semibold whitespace-nowrap" style={{ fontSize: '12px' }}>Đến:</span>
            <input 
              type="date"
              className="border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all rounded-lg" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ fontSize: '12px', height: '38px', padding: '0 10px' }}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 sm:ml-auto">
            <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-500 font-semibold whitespace-nowrap" style={{ fontSize: '12px' }}>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all rounded-lg font-semibold"
              style={{ fontSize: '12px', height: '38px', padding: '0 12px', minWidth: '135px' }}
            >
              <option value="date-desc">Mới nhất</option>
              <option value="date-asc">Cũ nhất</option>
              <option value="name-asc">Bệnh nhân A-Z</option>
              <option value="diag-asc">Chẩn đoán A-Z</option>
            </select>
          </div>
        </Card>


        {/* Data Table */}
        <Card className="overflow-hidden p-0 border border-slate-200">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Mã hồ sơ</th>
                  <th className="whitespace-nowrap">Bệnh nhân</th>
                  <th className="whitespace-nowrap">Ngày khám</th>
                  <th className="whitespace-nowrap">Chẩn đoán chính</th>
                  <th className="whitespace-nowrap">Hướng xử lý</th>
                  <th className="text-center whitespace-nowrap">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistories.length > 0 ? (
                  filteredHistories.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="font-bold text-teal-600 whitespace-nowrap">{row.code}</td>
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <b className="text-slate-800">{row.patient}</b>
                          <span className="text-xs text-slate-400">({row.gender} • {row.age}T)</span>
                        </div>
                      </td>
                      <td className="text-slate-500 font-medium whitespace-nowrap">{row.date} · {row.time}</td>
                      <td className="font-semibold text-slate-700 whitespace-nowrap truncate max-w-[200px]" title={row.diagnosis}>{row.diagnosis}</td>
                      <td className="whitespace-nowrap">
                        <Badge tone={
                          row.actionPath.includes('Tái khám') ? 'yellow' : 
                          row.actionPath.includes('phòng khám') ? 'blue' : 
                          row.actionPath.includes('Chuyển tuyến') ? 'red' : 'green'
                        }>
                          {row.actionPath}
                        </Badge>
                      </td>
                      <td className="text-center whitespace-nowrap">
                        <button 
                          onClick={() => { setSelectedRecord(row); setDetailTab('medical'); }}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-teal-600 hover:border-teal-300 cursor-pointer inline-flex items-center justify-center transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
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
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/60 text-white">
                        Mã HS: {selectedRecord.code}
                      </span>
                      <span className="text-amber-400 font-extrabold text-xs flex items-center" title={`${selectedRecord.rating} sao`}>
                        {'★'.repeat(selectedRecord.rating)}{'☆'.repeat(5 - selectedRecord.rating)}
                      </span>
                    </div>
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
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-bold border-b-2 transition-all cursor-pointer ${
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
            <div className={`flex-1 min-h-0 p-5 ${detailTab === 'chat' ? 'flex flex-col' : 'overflow-y-auto space-y-4'}`}>

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
                  {selectedRecord.actionPath.includes('Tái khám') && selectedRecord.reExamDate && (
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
                <div className="flex-1 flex flex-col min-h-0">
                  {selectedRecordChatLogs.length > 0 ? (
                    <div className="flex-1 flex flex-col min-h-0">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2 shrink-0">
                        Hội thoại chẩn đoán trong phiên
                      </span>
                      <div className="flex-1 bg-slate-900 text-white rounded-xl border border-slate-800 p-4 overflow-y-auto space-y-3.5 min-h-0">
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
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-400">
                      <MessageSquare size={36} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-sm">Không có cuộc hội thoại nào</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
