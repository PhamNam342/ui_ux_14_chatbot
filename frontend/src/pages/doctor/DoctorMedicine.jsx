import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Pill, Clipboard, Calendar, FileText, Plus, Trash2, ArrowLeft, HeartPulse, User } from 'lucide-react'
import { AppShell, Badge, Button, Card, TopBar, PageHeader } from '../../components/ui.jsx'
import { getStoredCases, saveStoredCases, getStoredHistories, completeConsultation } from '../../data/doctorStore.js'

export function DoctorMedicine() {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [selectedCaseCode, setSelectedCaseCode] = useState('')
  const [toast, setToast] = useState('')

  // Form states
  const [diagnosis, setDiagnosis] = useState('')
  const [condition, setCondition] = useState('')
  const [conclusion, setConclusion] = useState('')
  const [actionPath, setActionPath] = useState('Theo dõi tại nhà')
  const [patientNote, setPatientNote] = useState('')
  const [reExamDate, setReExamDate] = useState('')
  const [reExamNote, setReExamNote] = useState('')
  const [medicines, setMedicines] = useState([
    { name: 'Paracetamol 500mg', dose: '1 viên/lần, ngày 3 lần', note: 'Uống sau ăn' },
    { name: 'Siro ho thảo dược', dose: '10ml/lần, ngày 2 lần', note: 'Uống sáng và tối' }
  ])

  // Load cases on mount
  useEffect(() => {
    const list = getStoredCases()
    setCases(list)
    // Select first case that is not completed
    const active = list.find(c => c.status !== 'Hoàn tất')
    if (active) {
      setSelectedCaseCode(active.code)
    } else if (list.length > 0) {
      setSelectedCaseCode(list[0].code)
    }
  }, [])

  // Update form fields when active case changes
  const activeCase = useMemo(() => {
    const matched = cases.find(c => c.code === selectedCaseCode)
    if (matched) {
      // Auto seed symptoms if not filled
      setCondition(`Bệnh nhân có biểu hiện: ${matched.symptoms}`)
      setDiagnosis(matched.status === 'Hoàn tất' ? 'Viêm họng cấp' : '')
    }
    return matched
  }, [cases, selectedCaseCode])

  // Medicine list modifiers
  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dose: '', note: '' }])
  }

  const handleUpdateMedicine = (index, field, value) => {
    const updated = medicines.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    )
    setMedicines(updated)
  }

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  // Submit complete case
  const handleCompleteCase = () => {
    if (!selectedCaseCode) return
    if (!diagnosis.trim()) {
      alert('Vui lòng điền Chẩn đoán sơ bộ.')
      return
    }

    const payload = {
      diagnosis,
      note: `Tình trạng: ${condition}. Kết luận: ${conclusion}. Dặn dò: ${patientNote}`,
      actionPath,
      prescription: medicines.filter(m => m.name.trim() !== ''),
      reExamDate: actionPath === 'Tái khám' ? reExamDate : '',
      reExamNote: actionPath === 'Tái khám' ? reExamNote : ''
    }

    completeConsultation(selectedCaseCode, payload)
    setToast('Đã hoàn thành lưu bệnh án và gửi đơn thuốc!')
    
    // Refresh cases list
    setCases(getStoredCases())

    setTimeout(() => {
      setToast('')
      navigate('/doctor')
    }, 1200)
  }

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        
        {/* Header navigation */}
        <div className="mb-7">
          <Link to="/doctor" className="mini-btn mb-4 inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Quay lại Dashboard
          </Link>
          <PageHeader 
            title="Kết luận tư vấn & Kê đơn" 
            subtitle="Ghi nhận hồ sơ bệnh lý, đơn thuốc điều trị và hướng xử lý chăm sóc sau tư vấn."
          />
        </div>

        {/* Form Grid */}
        <div className="grid gap-7 lg:grid-cols-[320px_1fr]">
          
          {/* Left panel: Case selection & Summary */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Chọn ca cần xử lý</h3>
              <div className="space-y-2">
                <label className="field-label text-xs">Ca bệnh đang điều trị</label>
                <select 
                  className="input text-sm" 
                  value={selectedCaseCode} 
                  onChange={e => setSelectedCaseCode(e.target.value)}
                >
                  {cases.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.patient} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {activeCase && (
                <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Thông tin bệnh nhân</span>
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Họ và tên:</span>
                        <b className="text-slate-800">{activeCase.patient}</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Giới tính / Tuổi:</span>
                        <b className="text-slate-800">{activeCase.gender} • {activeCase.age} tuổi</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Điện thoại:</span>
                        <b className="text-slate-800">{activeCase.phone}</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Trạng thái hiện tại:</span>
                        <Badge tone={activeCase.status === 'Hoàn tất' ? 'green' : activeCase.status === 'Đang tư vấn' ? 'blue' : 'yellow'}>
                          {activeCase.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Triệu chứng ban đầu</span>
                    <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 border border-slate-100">
                      {activeCase.symptoms}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* AI Assistant context summary card */}
            {activeCase && (
              <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-100/50">
                <h4 className="text-xs font-bold text-teal-800 flex items-center gap-1.5 uppercase">
                  <HeartPulse size={14} className="text-teal-600" />
                  Sàng lọc Chatbot AI
                </h4>
                <p className="mt-2 text-xs text-slate-600 leading-5">
                  Đánh giá nguy cơ ban đầu: <b className="text-teal-700">{activeCase.chatbotSummary?.severity || 'Trung bình'}</b>.
                  Thời gian kéo dài: <b>{activeCase.chatbotSummary?.duration || '3 ngày'}</b>.
                </p>
                <div className="mt-3 p-2 bg-white rounded border border-teal-100 text-[10px] text-slate-500 leading-normal italic">
                  "{activeCase.chatbotSummary?.initialNote || 'Bệnh nhân tự khai báo triệu chứng qua chatbot.'}"
                </div>
              </Card>
            )}
          </div>

          {/* Right panel: Editor Forms */}
          <div className="space-y-6">
            
            {/* Diagnosis & Status */}
            <Card className="!p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText size={18} className="text-teal-600" />
                Đánh giá bệnh lý & Chẩn đoán
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Chẩn đoán sơ bộ <span className="text-rose-500">*</span></label>
                  <input 
                    className="input" 
                    value={diagnosis} 
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="Nhập chẩn đoán lâm sàng..."
                  />
                </div>
                <div>
                  <label className="field-label">Kết luận tổng quát</label>
                  <input 
                    className="input" 
                    value={conclusion}
                    onChange={e => setConclusion(e.target.value)}
                    placeholder="Đề xuất chuẩn kết luận..."
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Chi tiết tình trạng lâm sàng</label>
                <textarea 
                  className="input min-h-20" 
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  placeholder="Mô tả cụ thể thể trạng bệnh nhân..."
                />
              </div>
            </Card>

            {/* Prescriptions */}
            <Card className="!p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Pill size={18} className="text-teal-600" />
                  Đơn thuốc kê chi tiết
                </h3>
                <button 
                  onClick={handleAddMedicine}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
                >
                  + Thêm thuốc
                </button>
              </div>

              {/* Table Editor */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="py-2.5">Tên thuốc</th>
                      <th className="py-2.5 px-2">Liều lượng</th>
                      <th className="py-2.5">Lưu ý / Hướng dẫn</th>
                      <th className="py-2.5 text-center w-12">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, idx) => (
                      <tr key={idx} className="border-b border-slate-50 last:border-0">
                        <td className="py-2">
                          <input 
                            className="input !h-9 text-xs" 
                            value={med.name} 
                            placeholder="Tên thuốc / hoạt chất"
                            onChange={e => handleUpdateMedicine(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input 
                            className="input !h-9 text-xs" 
                            value={med.dose} 
                            placeholder="Ví dụ: Ngày uống 2 viên"
                            onChange={e => handleUpdateMedicine(idx, 'dose', e.target.value)}
                          />
                        </td>
                        <td className="py-2">
                          <input 
                            className="input !h-9 text-xs" 
                            value={med.note} 
                            placeholder="Ví dụ: Sau bữa ăn"
                            onChange={e => handleUpdateMedicine(idx, 'note', e.target.value)}
                          />
                        </td>
                        <td className="py-2 text-center">
                          <button 
                            onClick={() => handleRemoveMedicine(idx)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Advice and Follow-up appointments */}
            <Card className="!p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Clipboard size={18} className="text-teal-600" />
                Hướng dẫn chăm sóc & Hẹn tái khám
              </h3>

              <div>
                <label className="field-label">Lời khuyên chăm sóc sức khỏe</label>
                <textarea 
                  className="input min-h-20"
                  value={patientNote}
                  onChange={e => setPatientNote(e.target.value)}
                  placeholder="Ghi chú dặn dò bệnh nhân về ăn uống, nghỉ ngơi, sinh hoạt..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Hướng điều trị tiếp theo</label>
                  <select 
                    className="input" 
                    value={actionPath}
                    onChange={e => setActionPath(e.target.value)}
                  >
                    <option value="Theo dõi tại nhà">Theo dõi sức khỏe tại nhà</option>
                    <option value="Tái khám">Hẹn tái khám định kỳ</option>
                    <option value="Đến phòng khám">Yêu cầu di chuyển đến phòng khám</option>
                    <option value="Chuyển tuyến">Đề xuất chuyển tuyến chuyên khoa</option>
                  </select>
                </div>

                {actionPath === 'Tái khám' && (
                  <div>
                    <label className="field-label">Ngày hẹn tái khám</label>
                    <input 
                      type="date" 
                      className="input" 
                      value={reExamDate}
                      onChange={e => setReExamDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {actionPath === 'Tái khám' && (
                <div>
                  <label className="field-label">Ghi chú tái khám chi tiết</label>
                  <input 
                    type="text" 
                    className="input"
                    value={reExamNote}
                    onChange={e => setReExamNote(e.target.value)}
                    placeholder="Nội dung cần kiểm tra lại..."
                  />
                </div>
              )}
            </Card>

            {/* Form actions */}
            <div className="flex justify-end gap-3.5">
              <Button variant="ghost" onClick={() => navigate('/doctor')}>
                Hủy bỏ
              </Button>
              <Button variant="outline" onClick={() => {
                alert('Đã lưu bản nháp kết luận!')
              }}>
                Lưu tạm nháp
              </Button>
              <Button variant="primary" onClick={handleCompleteCase}>
                Hoàn tất & Gửi kết quả
              </Button>
            </div>

          </div>

        </div>
      </div>

      {toast && <div className="toast toast-green"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}
