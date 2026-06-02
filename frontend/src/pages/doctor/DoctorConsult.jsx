import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { 
  Video, MessageSquare, Mic, MicOff, VideoOff, PhoneOff, ScreenShare, 
  Send, Plus, Paperclip, ClipboardCheck, ArrowLeft, HeartPulse, AlertTriangle, 
  Pill, Clock, Calendar, CheckCircle2, ChevronRight, User, Info, Phone, Trash2,
  PanelLeftClose, PanelLeftOpen, Stethoscope
} from 'lucide-react'
import { AppShell, Avatar, Badge, Button, Card, TopBar } from '../../components/ui.jsx'
import { 
  getStoredCases, saveStoredCases, getStoredHistories, 
  completeConsultation, startConsultation 
} from '../../data/doctorStore.js'

export function DoctorConsult() {
  const navigate = useNavigate()
  const { id } = useParams() // Optional parameter from route /doctor/consult/chat/:id

  // Storage states
  const [cases, setCases] = useState([])
  const [activeTab, setActiveTab] = useState('Đang tư vấn') // 'Đang chờ', 'Đang tư vấn', 'Đã hoàn thành'
  const [selectedCaseCode, setSelectedCaseCode] = useState(id || '')
  
  // Workspace UI states
  const [chatMessages, setChatMessages] = useState([])
  const [draftMessage, setDraftMessage] = useState('')
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [isEndingConsult, setIsEndingConsult] = useState(false)
  const [isQueueCollapsed, setIsQueueCollapsed] = useState(false)
  
  // Call controls states
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [screenShared, setScreenShared] = useState(false)

  // Medical Record Form states
  const [diagnosis, setDiagnosis] = useState('')
  const [condition, setCondition] = useState('')
  const [conclusion, setConclusion] = useState('')
  const [actionPath, setActionPath] = useState('Theo dõi tại nhà')
  const [patientNote, setPatientNote] = useState('')
  const [reExamDate, setReExamDate] = useState('')
  const [reExamNote, setReExamNote] = useState('')
  const [prescriptions, setPrescriptions] = useState([
    { name: 'Paracetamol 500mg', dose: '1 viên/lần, ngày 3 lần', note: 'Uống sau ăn khi sốt trên 38.5°C' }
  ])

  // Scroll ref for chat
  const chatEndRef = useRef(null)

  // Load cases and set active selections
  useEffect(() => {
    const list = getStoredCases() || []
    setCases(list)

    if (id) {
      const activeCase = list.find(c => c.code === id)
      if (activeCase) {
        setSelectedCaseCode(id)
        // Set matching tab
        if (activeCase.status === 'Đang tư vấn') {
          setActiveTab('Đang tư vấn')
        } else if (activeCase.status === 'Hoàn tất') {
          setActiveTab('Đã hoàn thành')
        } else {
          setActiveTab('Đang chờ')
        }
      }
    } else {
      // Auto select first case in current tab if any
      const tabCases = list.filter(c => getTabForStatus(c.status) === activeTab)
      if (tabCases.length > 0) {
        setSelectedCaseCode(tabCases[0].code)
      } else {
        setSelectedCaseCode('')
      }
    }

    // Listen to storage events
    const handleStorage = () => {
      setCases(getStoredCases())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [id])

  // Map state based on selected tab changes
  useEffect(() => {
    if (!id) {
      const tabCases = (cases || []).filter(c => getTabForStatus(c.status) === activeTab)
      if (tabCases.length > 0 && !tabCases.find(c => c.code === selectedCaseCode)) {
        setSelectedCaseCode(tabCases[0].code)
      } else if (tabCases.length === 0) {
        setSelectedCaseCode('')
      }
    }
  }, [activeTab, cases, id, selectedCaseCode])

  // Load chat messages when selected case changes
  useEffect(() => {
    if (selectedCaseCode) {
      const stored = JSON.parse(localStorage.getItem('med_chats') || '{}')
      if (!stored[selectedCaseCode]) {
        // Initial mock seeding
        const matched = cases.find(c => c.code === selectedCaseCode)
        stored[selectedCaseCode] = [
          { id: 1, who: 'Bệnh nhân', initials: matched?.initials || 'BN', time: '10:02', text: `Chào bác sĩ, tôi bị triệu chứng ${matched?.symptoms || 'khó chịu'} từ hôm qua.` },
          { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '10:02', text: `Chào anh/chị, bản tóm tắt triệu chứng y khoa đã được chuyển đến Bác sĩ Alexander.`, system: true },
          { id: 3, who: 'Bác sĩ', initials: 'BS', time: '10:03', text: `Chào anh/chị, tôi đã xem qua các triệu chứng sơ bộ. Anh/chị có thể cung cấp thêm thông tin về nhiệt độ cơ thể hiện tại không?`, mine: true }
        ]
        localStorage.setItem('med_chats', JSON.stringify(stored))
      }
      setChatMessages(stored[selectedCaseCode])
      setIsVideoCall(false)
      setIsEndingConsult(false)
    } else {
      setChatMessages([])
    }
  }, [selectedCaseCode, cases])

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isVideoCall, isEndingConsult])

  // Filter cases for the current tab view
  const currentTabCases = useMemo(() => {
    return cases.filter(c => getTabForStatus(c.status) === activeTab)
  }, [cases, activeTab])

  // Find currently active case details
  const activeCase = useMemo(() => {
    return cases.find(c => c.code === selectedCaseCode)
  }, [cases, selectedCaseCode])

  // Helper mapping case status to left-column tabs
  function getTabForStatus(status) {
    if (status === 'Hoàn tất') return 'Đã hoàn thành'
    if (status === 'Đang tư vấn') return 'Đang tư vấn'
    return 'Đang chờ' // 'Mới', 'Đang chờ tư vấn'
  }

  // Handle case selection
  const handleSelectCase = (code) => {
    setSelectedCaseCode(code)
    navigate(`/doctor/consult/chat/${code}`)
  }

  // Handle accepting a waiting patient
  const handleAcceptPatient = (code) => {
    startConsultation(code)
    // Update local state list
    const updated = cases.map(c => c.code === code ? { ...c, status: 'Đang tư vấn' } : c)
    setCases(updated)
    setActiveTab('Đang tư vấn')
    setSelectedCaseCode(code)
    navigate(`/doctor/consult/chat/${code}`)
  }

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!draftMessage.trim() || !selectedCaseCode) return

    const newMessage = {
      id: Date.now(),
      who: 'Bác sĩ',
      initials: 'BS',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: draftMessage.trim(),
      mine: true
    }

    const updatedMessages = [...chatMessages, newMessage]
    setChatMessages(updatedMessages)
    setDraftMessage('')

    // Save back to localStorage
    const stored = JSON.parse(localStorage.getItem('med_chats') || '{}')
    stored[selectedCaseCode] = updatedMessages
    localStorage.setItem('med_chats', JSON.stringify(stored))

    // Optional automated patient reply
    setTimeout(() => {
      const patientReply = {
        id: Date.now() + 1,
        who: 'Bệnh nhân',
        initials: activeCase?.initials || 'BN',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        text: 'Tôi đã nghe rõ bác sĩ dặn dò.'
      }
      const withReply = [...updatedMessages, patientReply]
      setChatMessages(withReply)
      stored[selectedCaseCode] = withReply
      localStorage.setItem('med_chats', JSON.stringify(stored))
    }, 1500)
  }

  // Prescription list actions
  const handleAddMedicine = () => {
    setPrescriptions([...prescriptions, { name: '', dose: '', note: '' }])
  }

  const handleUpdateMedicine = (idx, field, value) => {
    const updated = prescriptions.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    setPrescriptions(updated)
  }

  const handleRemoveMedicine = (idx) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx))
  }

  // Save consultation summary
  const handleSaveMedicalRecord = () => {
    if (!diagnosis.trim()) {
      alert('Vui lòng điền Chẩn đoán sơ bộ trước khi hoàn tất.')
      return
    }

    const payload = {
      diagnosis,
      note: `Tình trạng: ${condition}. Kết luận: ${conclusion}. Ghi chú dặn dò: ${patientNote}`,
      actionPath,
      prescription: prescriptions.filter(p => p.name.trim() !== ''),
      reExamDate: actionPath === 'Tái khám' ? reExamDate : '',
      reExamNote: actionPath === 'Tái khám' ? reExamNote : ''
    }

    completeConsultation(selectedCaseCode, payload)
    
    // Refresh local lists
    setCases(getStoredCases())
    setActiveTab('Đã hoàn thành')
    setIsEndingConsult(false)
    
    // Clear forms
    setDiagnosis('')
    setCondition('')
    setConclusion('')
    setPatientNote('')
    setReExamDate('')
    setReExamNote('')
    setPrescriptions([{ name: 'Paracetamol 500mg', dose: '1 viên/lần, ngày 3 lần', note: 'Uống sau ăn khi sốt trên 38.5°C' }])

    alert('Đã lưu hồ sơ bệnh án thành công và gửi kết quả cho bệnh nhân!')
    navigate('/doctor/consult')
  }

  return (
    <AppShell role="doctor">
      <TopBar />
      
      {/* 3-Column Workspace Wrapper */}
      <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-140px)] overflow-hidden">
        
        {/* Column 1 (Left): Patient Queue Directory */}
        <div className={`w-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${
          isQueueCollapsed ? 'lg:w-[72px]' : 'lg:w-[300px]'
        }`}>
          
          {/* Header & Tabs */}
          {isQueueCollapsed ? (
            <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex flex-col items-center">
              <button 
                onClick={() => setIsQueueCollapsed(false)} 
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 cursor-pointer flex items-center justify-center"
                title="Mở rộng danh sách"
              >
                <PanelLeftOpen size={16} />
              </button>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Danh sách tư vấn</h3>
                <button 
                  onClick={() => setIsQueueCollapsed(true)} 
                  className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center"
                  title="Thu gọn danh sách"
                >
                  <PanelLeftClose size={15} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                {['Đang chờ', 'Đang tư vấn', 'Đã hoàn thành'].map(tab => (
                  <button
                    key={tab}
                    className={`text-center py-1.5 px-1 rounded-md font-bold leading-tight transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'bg-white text-teal-700 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    style={{ fontSize: '10px' }}
                    onClick={() => {
                      setActiveTab(tab)
                      // Always reload fresh from store to avoid stale state when on /chat/:id
                      const freshCases = getStoredCases() || []
                      setCases(freshCases)
                      const tabCases = freshCases.filter(c => getTabForStatus(c.status) === tab)
                      if (tabCases.length > 0) {
                        setSelectedCaseCode(tabCases[0].code)
                        navigate(`/doctor/consult/chat/${tabCases[0].code}`)
                      } else {
                        setSelectedCaseCode('')
                        navigate('/doctor/consult')
                      }
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable Patient List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {currentTabCases.length > 0 ? (
              currentTabCases.map((item) => {
                const isSelected = selectedCaseCode === item.code
                return isQueueCollapsed ? (
                  <div
                    key={item.code}
                    onClick={() => handleSelectCase(item.code)}
                    className={`py-4 flex justify-center cursor-pointer hover:bg-slate-50/50 transition-colors relative ${
                      isSelected ? 'bg-teal-50/30 border-l-4 border-teal-600' : ''
                    }`}
                    title={`${item.patient} (${item.code})`}
                  >
                    <Avatar tone={item.level === 'Cao' ? 'rose' : item.level === 'Trung bình' ? 'amber' : 'mint'}>
                      {item.initials}
                    </Avatar>
                  </div>
                ) : (
                  <div
                    key={item.code}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors ${
                      isSelected ? 'bg-teal-50/30 border-l-4 border-teal-600' : ''
                    }`}
                    onClick={() => handleSelectCase(item.code)}
                  >
                    <Avatar tone={item.level === 'Cao' ? 'rose' : item.level === 'Trung bình' ? 'amber' : 'mint'}>
                      {item.initials}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{item.patient}</h4>
                        <Badge tone={item.level === 'Cao' ? 'red' : item.level === 'Trung bình' ? 'yellow' : 'green'}>
                          {item.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1">{item.symptoms}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span className="flex items-center gap-0.5"><Clock size={10} /> Chờ: {item.waitingTime}</span>
                        <span>{item.code.startsWith('CA') ? 'Chat' : 'Video'}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs mt-10">
                {isQueueCollapsed ? 'Trống' : 'Không có bệnh nhân nào trong mục này'}
              </div>
            )}
          </div>
        </div>

        {/* Column 2 (Center): Chat / Video feeds / Medical Record Form */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden min-w-0">
          
          {activeCase ? (
            <>
              {/* Header */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <Avatar tone={activeCase.level === 'Cao' ? 'rose' : activeCase.level === 'Trung bình' ? 'amber' : 'mint'}>
                    {activeCase.initials}
                  </Avatar>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">{activeCase.patient}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeCase.gender} • {activeCase.age} tuổi • Mã số: {activeCase.code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeCase.status !== 'Hoàn tất' && (
                    <>
                      {activeCase.status === 'Đang tư vấn' ? (
                        <>
                          {!isEndingConsult && (
                            <button
                              onClick={() => setIsVideoCall(v => !v)}
                              className={`btn btn-compact cursor-pointer ${
                                isVideoCall ? 'btn-dark' : 'btn-outline'
                              }`}
                            >
                              <Video size={15} />
                              {isVideoCall ? 'Trở lại Chat' : 'Bắt đầu gọi video'}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsEndingConsult(v => !v)
                              setIsVideoCall(false)
                            }}
                            className={`btn btn-compact cursor-pointer ${
                              isEndingConsult ? 'btn-ghost' : 'btn-danger'
                            }`}
                          >
                            <ClipboardCheck size={15} />
                            {isEndingConsult ? 'Xem hội thoại' : 'Kết thúc & Kê đơn'}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAcceptPatient(activeCase.code)}
                          className="btn btn-primary btn-compact cursor-pointer"
                        >
                          <Stethoscope size={15} />
                          Tiếp nhận ca bệnh
                        </button>
                      )}
                    </>
                  )}
                  {activeCase.status === 'Hoàn tất' && (
                    <Badge tone="green">Đã hoàn tất khám</Badge>
                  )}
                </div>
              </div>

              {/* Workspace Main Body (Conditional Render: Chat, Video or Diagnostic Form) */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-50/20">
                
                {/* 1. Diagnostic Form View */}
                {isEndingConsult ? (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="border-b border-slate-100 pb-3 mb-2">
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <ClipboardCheck size={18} className="text-teal-600" />
                        Ghi nhận kết quả khám & Đơn thuốc
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Vui lòng điền đầy đủ chẩn đoán trước khi đóng phiên tư vấn.</p>
                    </div>

                    {/* Diagnosis */}
                    <div>
                      <label className="field-label">Chẩn đoán sơ bộ <span className="text-rose-500">*</span></label>
                      <input 
                        className="input" 
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                        placeholder="Ví dụ: Viêm họng cấp, Cảm cúm mùa..."
                      />
                    </div>

                    {/* Condition details */}
                    <div>
                      <label className="field-label">Chi tiết tình trạng hiện tại</label>
                      <textarea 
                        className="input min-h-20" 
                        value={condition}
                        onChange={e => setCondition(e.target.value)}
                        placeholder="Sốt nhẹ, ho khan kèm rát họng kéo dài, chưa thấy rale phổi..."
                      />
                    </div>

                    {/* Conclusion & Guidelines */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label">Kết luận y tế</label>
                        <textarea 
                          className="input min-h-20" 
                          value={conclusion}
                          onChange={e => setConclusion(e.target.value)}
                          placeholder="Viêm đường hô hấp trên thể nhẹ..."
                        />
                      </div>
                      <div>
                        <label className="field-label">Dặn dò & Hướng xử lý gửi bệnh nhân</label>
                        <textarea 
                          className="input min-h-20" 
                          value={patientNote}
                          onChange={e => setPatientNote(e.target.value)}
                          placeholder="Nghỉ ngơi, uống nhiều nước ấm, súc họng muối sinh lý..."
                        />
                      </div>
                    </div>

                    {/* Prescriptions Block */}
                    <div className="border-t border-slate-100 pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Pill size={16} className="text-teal-600" />
                          Kê đơn thuốc điều trị
                        </h4>
                        <button 
                          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
                          onClick={handleAddMedicine}
                        >
                          + Thêm thuốc
                        </button>
                      </div>

                      <div className="space-y-3">
                        {prescriptions.map((med, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              className="input flex-1 !h-9 text-xs" 
                              value={med.name}
                              placeholder="Tên thuốc / biệt dược"
                              onChange={e => handleUpdateMedicine(idx, 'name', e.target.value)}
                            />
                            <input 
                              className="input flex-1 !h-9 text-xs" 
                              value={med.dose}
                              placeholder="Liều dùng (ví dụ: ngày 2 lần, mỗi lần 1 viên)"
                              onChange={e => handleUpdateMedicine(idx, 'dose', e.target.value)}
                            />
                            <input 
                              className="input flex-1 !h-9 text-xs" 
                              value={med.note}
                              placeholder="Lưu ý cách uống"
                              onChange={e => handleUpdateMedicine(idx, 'note', e.target.value)}
                            />
                            <button 
                              onClick={() => handleRemoveMedicine(idx)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Path Selection */}
                    <div className="border-t border-slate-100 pt-5">
                      <label className="field-label">Hướng điều trị tiếp theo</label>
                      <select 
                        className="input" 
                        value={actionPath}
                        onChange={e => setActionPath(e.target.value)}
                      >
                        <option value="Theo dõi tại nhà">Theo dõi sức khỏe tại nhà</option>
                        <option value="Tái khám">Hẹn tái khám (trực tuyến / trực tiếp)</option>
                        <option value="Đến phòng khám">Yêu cầu di chuyển đến phòng khám gần nhất</option>
                        <option value="Chuyển tuyến">Đề xuất chuyển tuyến chuyên khoa sâu</option>
                      </select>

                      {actionPath === 'Tái khám' && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 p-4 bg-teal-50/50 rounded-xl border border-teal-100/50">
                          <div>
                            <label className="field-label text-xs">Ngày hẹn tái khám</label>
                            <input 
                              type="date" 
                              className="input text-xs" 
                              value={reExamDate}
                              onChange={e => setReExamDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="field-label text-xs">Ghi chú tái khám</label>
                            <input 
                              type="text" 
                              className="input text-xs"
                              value={reExamNote}
                              placeholder="Ví dụ: Đánh giá lại họng và nhịp sốt..."
                              onChange={e => setReExamNote(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Actions */}
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                      <Button variant="ghost" onClick={() => setIsEndingConsult(false)}>
                        Quay lại
                      </Button>
                      <Button variant="primary" onClick={handleSaveMedicalRecord}>
                        Lưu hồ sơ khám & Hoàn tất
                      </Button>
                    </div>
                  </div>
                ) : isVideoCall ? (
                  
                  /* 2. Video Call View */
                  <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-end">
                    
                    {/* Patient Main feed */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                      {camOn ? (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <span className="text-white text-sm font-bold opacity-80 flex flex-col items-center gap-2">
                            <span className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold">
                              {activeCase.initials}
                            </span>
                            Luồng hình ảnh Bệnh nhân: {activeCase.patient}
                          </span>
                        </div>
                      ) : (
                        <div className="text-slate-500 flex flex-col items-center gap-2">
                          <VideoOff size={32} />
                          <span>Bệnh nhân đã tắt camera</span>
                        </div>
                      )}
                    </div>

                    {/* Doctor PIP feed */}
                    <div className="absolute top-4 right-4 w-36 aspect-video bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                      <span className="text-white/60 text-[10px] font-bold">
                        {camOn ? 'Bạn (Đang phát)' : 'Camera tắt'}
                      </span>
                    </div>

                    {/* floating call details top-left */}
                    <div className="absolute top-4 left-4 p-2 bg-slate-900/60 backdrop-blur-md rounded-lg text-white text-xs font-bold">
                      Cuộc gọi tư vấn trực tuyến (HD)
                    </div>

                    {/* Control HUD Bar */}
                    <div className="relative z-10 w-full p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-center gap-4">
                      
                      {/* Audio mic button */}
                      <button 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer ${
                          micOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-500'
                        }`}
                        onClick={() => setMicOn(!micOn)}
                        title={micOn ? 'Tắt Mic' : 'Bật Mic'}
                      >
                        {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                      </button>

                      {/* Video Camera button */}
                      <button 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer ${
                          camOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-500'
                        }`}
                        onClick={() => setCamOn(!camOn)}
                        title={camOn ? 'Tắt Camera' : 'Bật Camera'}
                      >
                        {camOn ? <Video size={18} /> : <VideoOff size={18} />}
                      </button>

                      {/* Screen share button */}
                      <button 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer ${
                          screenShared ? 'bg-teal-600 hover:bg-teal-500' : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                        onClick={() => setScreenShared(!screenShared)}
                        title={screenShared ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}
                      >
                        <ScreenShare size={18} />
                      </button>

                      {/* Hang up call */}
                      <button 
                        className="w-12 h-12 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setIsVideoCall(false)
                          setIsEndingConsult(true) // Automatically prompt prescription
                        }}
                        title="Kết thúc cuộc gọi & ghi chẩn đoán"
                      >
                        <PhoneOff size={20} />
                      </button>
                    </div>

                  </div>
                ) : (
                  
                  /* 3. Standard Chat View */
                  <div className="flex flex-col h-full gap-4">
                    {/* Chat Messages list */}
                    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={msg.id || index} 
                          className={`flex items-start gap-3 ${msg.mine ? 'justify-end' : ''}`}
                        >
                          {!msg.mine && !msg.system && (
                            <Avatar tone={activeCase.level === 'Cao' ? 'rose' : 'mint'}>
                              {msg.initials}
                            </Avatar>
                          )}
                          
                          {msg.system ? (
                            <div className="mx-auto my-2 text-center max-w-sm">
                              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-semibold rounded-full border border-slate-200">
                                {msg.text}
                              </span>
                            </div>
                          ) : (
                            <div className={`max-w-[70%] ${msg.mine ? 'text-right' : ''}`}>
                              <span className="text-[10px] text-slate-400 block mb-1">
                                {msg.who} • {msg.time}
                              </span>
                              <div 
                                className={`p-3 rounded-2xl text-sm leading-relaxed inline-block text-left ${
                                  msg.mine 
                                    ? 'bg-teal-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          )}

                          {msg.mine && (
                            <Avatar tone="mint">
                              BS
                            </Avatar>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat inputs footer */}
                    {activeCase.status !== 'Hoàn tất' && (
                      <form 
                        className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl"
                        onSubmit={handleSendMessage}
                      >
                        <button 
                          type="button" 
                          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                          title="Đính kèm tài liệu"
                          onClick={() => alert('Chọn tệp đính kèm: Phiếu kết quả xét nghiệm, ảnh triệu chứng...')}
                        >
                          <Paperclip size={18} />
                        </button>
                        <input
                          className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-800 px-2"
                          placeholder="Nhập tin nhắn tư vấn y tế..."
                          value={draftMessage}
                          onChange={e => setDraftMessage(e.target.value)}
                        />
                        <button 
                          type="submit"
                          className="btn btn-primary btn-compact !min-h-[36px] cursor-pointer shrink-0"
                        >
                          <Send size={15} />
                          Gửi
                        </button>
                      </form>
                    )}
                  </div>
                )}

              </div>
            </>
          ) : (
            /* Selected Case Placeholder Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Không gian tư vấn lâm sàng</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-sm leading-relaxed">
                Vui lòng chọn một ca bệnh từ danh sách chờ hoặc tư vấn bên trái để bắt đầu trò chuyện trực tuyến và ghi nhận chẩn đoán y khoa.
              </p>
            </div>
          )}

        </div>

        {/* Column 3 (Right): Decision Support Panel */}
        {activeCase && (
          <div className="w-full lg:w-[320px] bg-white border border-slate-200 rounded-xl overflow-y-auto p-5 space-y-5 shrink-0">
            <h3 className="text-xl font-extrabold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Info size={20} className="text-teal-600" />
              Thông tin bệnh nhân
            </h3>

            {/* Basic metadata */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Thông tin cơ bản</span>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mã ca bệnh</span>
                  <b className="text-slate-800">{activeCase.code}</b>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-500">Họ tên bệnh nhân</span>
                  <b className="text-teal-700">{activeCase.patient}</b>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-500">Điện thoại</span>
                  <b className="text-slate-800">{activeCase.phone}</b>
                </div>
              </div>
            </div>

            {/* Chatbot Screening Summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block flex items-center gap-1">
                <HeartPulse size={12} className="text-teal-600" />
                Tóm tắt từ Chatbot AI
              </span>
              
              <div className="mt-3 space-y-2.5">
                <div>
                  <small className="text-[10px] text-slate-400 block">Triệu chứng khai báo:</small>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeCase.chatbotSummary?.symptoms?.map(s => (
                      <span key={s} className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <small className="text-[10px] text-slate-400 block">Khởi phát:</small>
                    <b className="text-slate-800">{activeCase.chatbotSummary?.duration || '3 ngày'}</b>
                  </div>
                  <div>
                    <small className="text-[10px] text-slate-400 block">Đánh giá nguy cơ:</small>
                    <b className="text-rose-600">{activeCase.chatbotSummary?.severity || 'Trung bình'}</b>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-2 text-[11px] text-slate-600 leading- relaxed italic">
                  "{activeCase.chatbotSummary?.initialNote}"
                </div>
              </div>
            </div>

            {/* Allergy and Current Medications */}
            <div className="space-y-3">
              <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 flex gap-2">
                <AlertTriangle size={15} className="text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-700 block">Dị ứng đã khai báo</span>
                  <p className="text-xs text-rose-800 mt-1 font-semibold leading-relaxed">
                    {activeCase.allergies}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/30 p-3 rounded-xl border border-amber-100/50 flex gap-2">
                <Pill size={15} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Thuốc đang sử dụng</span>
                  <p className="text-xs text-amber-800 mt-1 font-semibold leading-relaxed">
                    {activeCase.currentMeds}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical History (3 Recent Visits) */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">3 ca khám gần nhất</span>
              <div className="space-y-3.5 relative border-l border-slate-100 pl-4 ml-2.5">
                {[
                  { date: '15/05/2026', issue: 'Cảm cúm mùa', clinic: 'Tâm An Clinic' },
                  { date: '10/04/2026', issue: 'Viêm họng đỏ', clinic: 'An Bình Cardiology' },
                  { date: '20/02/2026', issue: 'Dị ứng thời tiết', clinic: 'Online Consultation' }
                ].map((visit, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-slate-300" />
                    <span className="text-[10px] text-slate-400 block">{visit.date}</span>
                    <b className="text-slate-700 block mt-0.5">{visit.issue}</b>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{visit.clinic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Doctor's Notes */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lưu ý đặc biệt</span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeCase.specialNotes}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
