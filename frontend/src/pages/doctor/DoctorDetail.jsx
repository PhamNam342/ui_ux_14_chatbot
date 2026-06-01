import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { 
  Search, User, Phone, MapPin, HeartPulse, AlertTriangle, Pill, 
  Calendar, FileText, ChevronRight, MessageSquare, Video, Paperclip, 
  ArrowLeft, Download, ShieldAlert, Users, Stethoscope 
} from 'lucide-react'
import { AppShell, Badge, Card, TopBar, PageHeader, Button } from '../../components/ui.jsx'
import { getStoredCases, getStoredHistories } from '../../data/doctorStore.js'

export function DoctorDetail() {
  const navigate = useNavigate()
  const { id } = useParams() // Optional preselected patient ID
  
  // Storage lists
  const [cases, setCases] = useState([])
  const [histories, setHistories] = useState([])
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatientName, setSelectedPatientName] = useState('')
  const [detailTab, setDetailTab] = useState('medical') // 'medical', 'timeline', 'chats', 'docs'
  const [selectedHistoryChat, setSelectedHistoryChat] = useState(null)

  // Load storage data
  useEffect(() => {
    const caseData = getStoredCases()
    const historyData = getStoredHistories()
    setCases(caseData)
    setHistories(historyData)

    // Pre-select patient based on URL id
    if (id) {
      const matchedCase = caseData.find(c => c.code === id || c.patient === id)
      if (matchedCase) {
        setSelectedPatientName(matchedCase.patient)
      } else {
        // ID could be patient name directly
        const matchedByName = caseData.find(c => c.patient.toLowerCase() === id.toLowerCase())
        if (matchedByName) {
          setSelectedPatientName(matchedByName.patient)
        } else if (caseData.length > 0) {
          setSelectedPatientName(caseData[0].patient)
        }
      }
    } else if (caseData.length > 0) {
      setSelectedPatientName(caseData[0].patient)
    }

    const handleStorage = () => {
      setCases(getStoredCases())
      setHistories(getStoredHistories())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [id])

  // Extract distinct patients from cases list
  const patientsList = useMemo(() => {
    const patients = []
    const seen = new Set()
    
    cases.forEach(c => {
      if (!seen.has(c.patient)) {
        seen.add(c.patient)
        // Count total visits in histories
        const visitsCount = histories.filter(h => h.patient === c.patient).length
        patients.push({
          code: c.code,
          name: c.patient,
          initials: c.initials,
          age: c.age,
          gender: c.gender,
          phone: c.phone,
          visits: visitsCount || 1, // at least 1 for the current request
          allergies: c.allergies,
          currentMeds: c.currentMeds,
          specialNotes: c.specialNotes,
          level: c.level
        })
      }
    })
    return patients
  }, [cases, histories])

  // Filter patients by search query
  const filteredPatients = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return patientsList
    return patientsList.filter(p => 
      p.name.toLowerCase().includes(normalized) || 
      p.code.toLowerCase().includes(normalized) ||
      p.phone.includes(normalized)
    )
  }, [patientsList, searchQuery])

  // Find active patient details
  const activePatient = useMemo(() => {
    return patientsList.find(p => p.name === selectedPatientName) || patientsList[0]
  }, [patientsList, selectedPatientName])

  // Get histories related to the active patient
  const patientHistories = useMemo(() => {
    if (!activePatient) return []
    return histories.filter(h => h.patient === activePatient.name)
  }, [histories, activePatient])

  // Quick select patient
  const handleSelectPatient = (name) => {
    setSelectedPatientName(name)
    setSelectedHistoryChat(null)
  }

  // Predefined mock chat transcripts for history lookup
  const mockChatTranscripts = useMemo(() => {
    if (!activePatient) return []
    return [
      {
        id: 'chat-h1',
        date: '18/05/2026',
        type: 'Tư vấn trực tuyến',
        doctor: 'BS. Nguyễn Văn Minh',
        dialogs: [
          { who: 'Bệnh nhân', text: 'Tôi bị đau rát họng kèm sốt nhẹ 38 độ từ tối qua.' },
          { who: 'Bác sĩ', text: 'Chị có uống thuốc gì chưa? Có ho đờm hay ho khan không?' },
          { who: 'Bệnh nhân', text: 'Tôi mới uống Paracetamol hạ sốt. Có ho khan, không có đờm.' },
          { who: 'Bác sĩ', text: 'Chị súc họng nước muối ấm, uống siro ho thảo dược và theo dõi nhiệt độ tiếp nhé.' }
        ]
      },
      {
        id: 'chat-h2',
        date: '10/04/2026',
        type: 'Tái khám định kỳ',
        doctor: 'BS. Trần Thị Hoa',
        dialogs: [
          { who: 'Bác sĩ', text: 'Nhịp tim đo huyết áp sáng nay của anh thế nào?' },
          { who: 'Bệnh nhân', text: 'Huyết áp đo lúc sáng là 125/80 mmHg, nhịp tim 70 bpm thưa bác sĩ.' },
          { who: 'Bác sĩ', text: 'Chỉ số rất ổn định. Tiếp tục duy trì thuốc Aspirin đều đặn hàng ngày nhé.' }
        ]
      }
    ]
  }, [activePatient])

  return (
    <AppShell role="doctor">
      <TopBar />
      
      {/* 2-Column Lookup Layout */}
      <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-140px)] overflow-hidden">
        
        {/* Left Column: Search & Patient List Directory */}
        <div className="w-full lg:w-[320px] flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0">
          
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Tra cứu bệnh nhân</h3>
            <div className="relative">
              <label className="search !min-h-[38px] !h-[38px] !px-3">
                <Search size={15} />
                <input 
                  placeholder="Nhập tên, mã số, SĐT..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-xs"
                />
              </label>
            </div>
          </div>

          {/* List queue */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <div
                  key={p.name}
                  onClick={() => handleSelectPatient(p.name)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors ${
                    activePatient?.name === p.name ? 'bg-teal-50/30 border-l-4 border-teal-600' : ''
                  }`}
                >
                  <Avatar tone={p.level === 'Cao' ? 'rose' : p.level === 'Trung bình' ? 'amber' : 'mint'}>
                    {p.initials}
                  </Avatar>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{p.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{p.gender} • {p.age} tuổi • Mã: {p.code}</p>
                    
                    <div className="flex items-center justify-between mt-2.5 text-[10px] text-slate-400">
                      <span>SĐT: {p.phone}</span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                        {p.visits} lần khám
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs mt-10">
                Không tìm thấy bệnh nhân nào khớp kết quả
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Patient Profile & Details Tabs */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden min-w-0">
          {activePatient ? (
            <>
              {/* Profile Card Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar tone={activePatient.level === 'Cao' ? 'rose' : activePatient.level === 'Trung bình' ? 'amber' : 'mint'}>
                    {activePatient.initials}
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">{activePatient.name}</h2>
                    <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Mã bệnh nhân: <b>{activePatient.code}</b></span>
                      <span>Giới tính: <b>{activePatient.gender}</b></span>
                      <span>Tuổi: <b>{activePatient.age} tuổi</b></span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/doctor/consult/chat/${activePatient.code}`)}
                    className="btn btn-primary btn-compact cursor-pointer"
                  >
                    <Stethoscope size={14} />
                    Kích hoạt tư vấn ngay
                  </button>
                </div>
              </div>

              {/* Sub tabs navigation */}
              <div className="px-5 border-b border-slate-100 flex gap-4 overflow-x-auto bg-slate-50/10">
                {[
                  { key: 'medical', label: 'Thông tin cá nhân & Y tế' },
                  { key: 'timeline', label: 'Lịch sử khám & Timeline' },
                  { key: 'chats', label: 'Lịch sử hội thoại tư vấn' },
                  { key: 'docs', label: 'Tài liệu & Kết quả cận lâm sàng' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setDetailTab(tab.key)}
                    className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                      detailTab === tab.key 
                        ? 'border-teal-600 text-teal-700 font-extrabold' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents scrollable */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20">
                
                {/* Tab 1: Medical Info */}
                {detailTab === 'medical' && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Contacts Card */}
                      <Card className="space-y-3.5">
                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <User size={15} className="text-teal-600" />
                          Thông tin liên hệ
                        </h3>
                        <div className="space-y-2.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2"><Phone size={13} /> Số điện thoại: <b className="text-slate-800 ml-auto">{activePatient.phone}</b></div>
                          <div className="flex items-center gap-2"><MapPin size={13} /> Địa chỉ liên hệ: <b className="text-slate-800 ml-auto text-right">Quận 3, TP. Hồ Chí Minh</b></div>
                          <div className="flex items-center gap-2"><Calendar size={13} /> Ngày sinh: <b className="text-slate-800 ml-auto">14/03/1984</b></div>
                        </div>
                      </Card>

                      {/* Allergies & Medications */}
                      <Card className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <HeartPulse size={15} className="text-teal-600" />
                          Tình trạng dị ứng & Thuốc dùng
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg flex gap-2">
                            <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <small className="text-[10px] text-rose-700 font-bold block uppercase">Dị ứng</small>
                              <p className="text-xs text-rose-900 mt-0.5">{activePatient.allergies || 'Không ghi nhận dị ứng'}</p>
                            </div>
                          </div>
                          <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg flex gap-2">
                            <Pill size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <small className="text-[10px] text-amber-700 font-bold block uppercase">Thuốc đang sử dụng</small>
                              <p className="text-xs text-amber-900 mt-0.5">{activePatient.currentMeds || 'Không dùng thuốc cố định'}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Special Notes & Family Profile links */}
                    <Card className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <ShieldAlert size={15} className="text-teal-600" />
                        Ghi chú đặc biệt điều trị
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activePatient.specialNotes || 'Chưa có ghi chú đặc biệt cho bệnh nhân này.'}
                      </p>
                    </Card>

                    <Card className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <Users size={15} className="text-teal-600" />
                        Hồ sơ gia đình liên quan (Family profiles)
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {['Nguyễn Văn C (Con trai - 10T)', 'Trần Văn D (Bố đẻ - 68T)'].map(rel => (
                          <span key={rel} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg">
                            {rel}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Tab 2: Medical History Timeline */}
                {detailTab === 'timeline' && (
                  <div className="max-w-2xl">
                    <div className="relative border-l-2 border-slate-200 pl-6 space-y-7 ml-4 py-2">
                      {patientHistories.length > 0 ? (
                        patientHistories.map((h) => (
                          <div key={h.id} className="relative group">
                            {/* Circle dot indicators */}
                            <div className="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-teal-600" />
                            
                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                                <span className="text-xs text-slate-400 font-bold">{h.date} • {h.time}</span>
                                <Badge tone="teal">{h.clinic}</Badge>
                              </div>

                              <h4 className="text-sm font-black text-slate-800">Chẩn đoán: {h.diagnosis}</h4>
                              <p className="text-xs text-slate-500 mt-2 leading-relaxed italic">"{h.note}"</p>

                              {/* Prescribed medicines list in timeline card */}
                              {h.prescription && h.prescription.length > 0 && (
                                <div className="mt-3.5 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                                    <Pill size={11} className="text-teal-600" />
                                    Đơn thuốc kê:
                                  </span>
                                  <ul className="mt-1.5 space-y-1.5 text-xs text-slate-700">
                                    {h.prescription.map((med, idx) => (
                                      <li key={idx} className="flex justify-between border-b border-slate-100/50 pb-1 last:border-0">
                                        <span><b>{med.name}</b> • {med.dose}</span>
                                        <span className="text-[10px] text-slate-400">{med.note}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>Hướng xử lý: <b className="text-slate-700">{h.actionPath}</b></span>
                                <span>Đánh giá buổi khám: <b className="text-amber-500">{'★'.repeat(h.rating)}</b></span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center text-slate-400">
                          Chưa có lịch sử khám bệnh án nào được ghi nhận trước đây
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 3: Consultation Logs */}
                {detailTab === 'chats' && (
                  <div className="max-w-2xl space-y-5">
                    {selectedHistoryChat ? (
                      /* Chat transcript detail panel */
                      <div className="space-y-4">
                        <button 
                          onClick={() => setSelectedHistoryChat(null)}
                          className="mini-btn mb-2 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowLeft size={14} /> Quay lại danh sách hội thoại
                        </button>

                        <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                            <b className="text-xs">{selectedHistoryChat.type} • Ngày {selectedHistoryChat.date}</b>
                            <span className="text-[10px] text-slate-400">Phụ trách: {selectedHistoryChat.doctor}</span>
                          </div>

                          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                            {selectedHistoryChat.dialogs.map((d, idx) => (
                              <div key={idx} className={`flex flex-col ${d.who === 'Bác sĩ' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[9px] text-slate-400 block mb-1">{d.who}</span>
                                <div className={`p-2.5 rounded-xl text-xs max-w-[80%] ${
                                  d.who === 'Bác sĩ' 
                                    ? 'bg-teal-600 text-white rounded-tr-none' 
                                    : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                }`}>
                                  {d.text}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* List of historical chat sessions */
                      <div className="space-y-3">
                        {mockChatTranscripts.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => setSelectedHistoryChat(item)}
                            className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-sm cursor-pointer flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                                <MessageSquare size={16} />
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-slate-800">{item.type}</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                  Bác sĩ thực hiện: {item.doctor} • Ngày lập: {item.date}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-teal-600 flex items-center gap-0.5">
                              Xem tin nhắn <ChevronRight size={14} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: Attached Documents & Images */}
                {detailTab === 'docs' && (
                  <div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        { name: 'X-Quang Phổi thẳng.png', size: '3.4 MB', type: 'Hình ảnh triệu chứng' },
                        { name: 'Xét nghiệm máu tổng quát.pdf', size: '1.2 MB', type: 'Kết quả xét nghiệm' },
                        { name: 'Đơn thuốc cũ 15-05.pdf', size: '420 KB', type: 'Đơn thuốc cũ' }
                      ].map((doc, idx) => (
                        <Card key={idx} className="!p-4 hover:shadow transition-shadow">
                          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                            <FileText size={18} />
                          </div>
                          
                          <h4 className="text-xs font-bold text-slate-800 truncate" title={doc.name}>
                            {doc.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 block mt-1">{doc.type}</span>
                          
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span>{doc.size}</span>
                            <button 
                              onClick={() => alert(`Đang tải xuống tệp: ${doc.name}`)}
                              className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              <Download size={11} /> Tải về
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-400">
              <User size={32} className="opacity-40 mb-2" />
              <p className="text-sm">Vui lòng chọn một bệnh nhân từ danh sách bên trái để tra cứu hồ sơ điều trị.</p>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}
