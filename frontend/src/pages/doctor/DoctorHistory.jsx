import { useState, useEffect, useMemo } from 'react'
import { Search, Calendar, Star, Eye, Pill, ClipboardList, Info, MessageSquare, AlertTriangle, ArrowRight, User } from 'lucide-react'
import { AppShell, Badge, Card, TopBar, PageHeader, Button } from '../../components/ui.jsx'
import { getStoredHistories } from '../../data/doctorStore.js'

export function DoctorHistory() {
  const [histories, setHistories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterYear, setFilterYear] = useState('Tất cả thời gian')
  const [selectedRecord, setSelectedRecord] = useState(null)
  
  // Storage load
  useEffect(() => {
    setHistories(getStoredHistories())

    const handleStorage = () => {
      setHistories(getStoredHistories())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Filter histories based on search query & date year
  const filteredHistories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return histories.filter(item => {
      const matchesSearch = 
        !query || 
        item.patient.toLowerCase().includes(query) || 
        item.diagnosis.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)

      const matchesYear = 
        filterYear === 'Tất cả thời gian' || 
        item.date.endsWith(filterYear)

      return matchesSearch && matchesYear
    })
  }, [histories, searchQuery, filterYear])

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
          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
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
              <label className="field-label text-xs">Lọc theo năm</label>
              <select 
                className="input !h-[40px]" 
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
              >
                <option value="Tất cả thời gian">Tất cả thời gian</option>
                <option value="2026">Năm 2026</option>
                <option value="2025">Năm 2025</option>
              </select>
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
                          onClick={() => setSelectedRecord(row)}
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

      {/* Record detail Overlay Modal */}
      {selectedRecord && (
        <div className="modal-backdrop">
          <Card className="modal max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Chi tiết hồ sơ bệnh án</h3>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Mã số: {selectedRecord.id} • Phiên tư vấn: {selectedRecord.code}
                </span>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-normal leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5">
              
              {/* Patient Profile */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bệnh nhân</span>
                  <div className="mt-2 flex items-center gap-2">
                    <User size={15} className="text-teal-600 shrink-0" />
                    <b className="text-slate-800 text-sm">{selectedRecord.patient}</b>
                    <span className="text-xs text-slate-500">({selectedRecord.gender} • {selectedRecord.age} tuổi)</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">SĐT liên hệ: {selectedRecord.phone}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Thời gian tư vấn</span>
                  <span className="text-sm font-bold text-slate-800 mt-2 block flex items-center gap-1">
                    <Calendar size={14} className="text-teal-600" />
                    {selectedRecord.date} lúc {selectedRecord.time}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">Địa điểm: {selectedRecord.clinic}</span>
                </div>
              </div>

              {/* Chatbot symptoms collected */}
              {selectedRecord.symptoms && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex gap-2 items-start">
                  <Info size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Triệu chứng ban đầu (Chatbot thu thập)</span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedRecord.symptoms}</p>
                  </div>
                </div>
              )}

              {/* Consultation Chat Transcript Log (Immersive!) */}
              {selectedRecordChatLogs.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2 flex items-center gap-1">
                    <MessageSquare size={13} className="text-teal-600" />
                    Hội thoại chẩn đoán trong phiên
                  </span>
                  <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4 max-h-48 overflow-y-auto space-y-3.5">
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
              )}

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
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4 gap-2">
              <Button variant="ghost" onClick={() => setSelectedRecord(null)}>
                Đóng hồ sơ
              </Button>
              <Button variant="primary" onClick={() => {
                alert(`Đang in bệnh án mã: ${selectedRecord.id}`)
              }}>
                In ấn kết quả
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
