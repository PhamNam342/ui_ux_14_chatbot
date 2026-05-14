import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { AppShell, Badge, Button, Card } from '../../components/ui.jsx'

const initialMedicines = [
  { name: 'Paracetamol 500mg', dose: '1 viên/lần, ngày 3 lần', note: 'Uống sau ăn' },
  { name: 'Siro ho thảo dược', dose: '10ml/lần, ngày 2 lần', note: 'Uống sáng và tối' },
]

export function DoctorMedicine() {
  const navigate = useNavigate()
  const [medicines, setMedicines] = useState(initialMedicines)
  const [toast, setToast] = useState('')

  function addMedicine() {
    setMedicines((current) => [
      ...current,
      { name: '', dose: '', note: '' },
    ])
  }

  function updateMedicine(index, field, value) {
    setMedicines((current) => current.map((medicine, medicineIndex) => (
      medicineIndex === index ? { ...medicine, [field]: value } : medicine
    )))
  }

  function completeCase() {
    setToast('Đã lưu ca bệnh và gửi kết quả')
    window.setTimeout(() => navigate('/doctor'), 900)
  }

  return (
    <AppShell role="doctor">
      <div className="content-wide">
        <div className="medicine-header">
          <Link to="/doctor/consult" className="icon-btn">‹</Link>
          <div>
            <h1>Kết luận tư vấn</h1>
            <p><Badge tone="green">CA250501-001</Badge> Bệnh nhân: Trần Thị Mai</p>
          </div>
        </div>

        <div className="medicine-grid">
          <aside className="space-y-5">
            <Card>
              <h2 className="section-title">Thông tin bệnh nhân</h2>
              <div className="mt-5 space-y-4">
                <InfoRow label="Tuổi / Giới tính" value="42 / Nữ" />
                <InfoRow label="Mức độ" value={<Badge tone="yellow">Trung bình</Badge>} />
                <div>
                  <p className="text-sm font-bold text-slate-500">Triệu chứng ban đầu:</p>
                  <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    Sốt 38.5°C, ho khan, đau họng, đau đầu và mệt mỏi.
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="section-title">Ghi chú nhanh</h2>
              <textarea className="input mt-5 min-h-36" placeholder="Nhập ghi chú cá nhân tại đây..." />
            </Card>
          </aside>

          <Card className="medicine-panel">
            <section>
              <h2 className="medicine-section-title"><span>♙</span> Chẩn đoán bệnh</h2>
              <label className="field-label mt-5">Chẩn đoán sơ bộ</label>
              <input className="input" defaultValue="Viêm họng cấp kèm sốt nhẹ" />
              <label className="field-label mt-5">Chi tiết tình trạng</label>
              <textarea className="input min-h-28" defaultValue="Bệnh nhân có biểu hiện sốt, ho khan và đau họng. Chưa ghi nhận dấu hiệu khó thở hoặc cảnh báo nguy hiểm." />
            </section>

            <section className="medicine-section">
              <div className="flex items-center justify-between gap-3">
                <h2 className="medicine-section-title"><span>♧</span> Đơn thuốc & Điều trị</h2>
                <button className="add-med-btn" onClick={addMedicine}>+ Thêm thuốc</button>
              </div>
              <div className="medicine-table">
                <div className="medicine-row medicine-row-head"><b>Tên thuốc</b><b>Liều lượng</b><b>Ghi chú</b><b /></div>
                {medicines.map((medicine, index) => (
                  <div className="medicine-row" key={`${medicine.name}-${index}`}>
                    <input className="medicine-input" value={medicine.name} placeholder="Tên thuốc" onChange={(event) => updateMedicine(index, 'name', event.target.value)} />
                    <input className="medicine-input" value={medicine.dose} placeholder="Liều lượng" onChange={(event) => updateMedicine(index, 'dose', event.target.value)} />
                    <input className="medicine-input" value={medicine.note} placeholder="Lưu ý" onChange={(event) => updateMedicine(index, 'note', event.target.value)} />
                    <button onClick={() => setMedicines((current) => current.filter((_, i) => i !== index))}>×</button>
                  </div>
                ))}
              </div>
            </section>

            <section className="medicine-section">
              <h2 className="medicine-section-title"><span>▣</span> Lời khuyên & Hẹn gặp</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_260px]">
                <label>
                  <span className="field-label">Lời khuyên bác sĩ</span>
                  <textarea className="input min-h-28" placeholder="Nhập lời khuyên cho bệnh nhân..." />
                </label>
                <label>
                  <span className="field-label">Hẹn tái khám</span>
                  <input className="input" type="date" defaultValue="2026-05-15" />
                  <label className="mt-4 flex items-center gap-2 text-sm text-slate-500"><input type="checkbox" /> Ưu tiên tái khám sớm</label>
                </label>
              </div>
            </section>

            <div className="medicine-actions">
              <Button variant="ghost">In kết luận</Button>
              <Button variant="outline">Lưu tạm</Button>
              <Button onClick={completeCase}>Hoàn tất & Gửi kết quả</Button>
            </div>
          </Card>
        </div>
      </div>
      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <b>{value}</b>
    </div>
  )
}
