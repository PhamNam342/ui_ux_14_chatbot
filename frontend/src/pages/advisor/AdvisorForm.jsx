import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FilePlus2, FileText, Info, Upload, CheckCircle2 } from 'lucide-react'
import { AppShell, Button, Card, PageHeader, TopBar } from '../../components/ui.jsx'

export function AdvisorForm() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-form">
        <PageHeader title="Chọn phương thức nhập dữ liệu" subtitle="Vui lòng chọn cách bạn muốn cung cấp thông tin y tế cho hệ thống." />
        <div className="advisor-input-options">
          <Link to="/advisor/input/form" className="advisor-input-option">
            <span><FileText size={34} /></span>
            <h2>Nhập bằng form</h2>
            <p>Nhập từng bản ghi dữ liệu thủ công</p>
          </Link>
          <Link to="/advisor/import" className="advisor-input-option">
            <span><Upload size={34} /></span>
            <h2>Upload CSV</h2>
            <p>Tải lên file CSV chứa nhiều bản ghi</p>
          </Link>
        </div>
        <Card className="advisor-help-card">
          <span><Info size={18} /></span>
          <div>
            <h3>Bạn cần hỗ trợ?</h3>
            <p>Xem tài liệu hướng dẫn hoặc liên hệ đội ngũ kỹ thuật để được hỗ trợ định dạng dữ liệu chuẩn y khoa.</p>
          </div>
          <Button variant="ghost" onClick={() => setShowHelp(true)}>Xem hướng dẫn</Button>
        </Card>
      </div>

      {showHelp && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Hướng dẫn nhập dữ liệu</h2>
            <div className="mt-4 space-y-4 text-slate-600">
              <p>Để đảm bảo chất lượng phản hồi của Chatbot, dữ liệu y khoa cần tuân thủ định dạng sau:</p>
              <ul className="list-inside list-disc space-y-2">
                <li><b>Triệu chứng:</b> Mô tả chi tiết các biểu hiện lâm sàng.</li>
                <li><b>Chẩn đoán:</b> Tên bệnh hoặc tình trạng y tế cụ thể.</li>
                <li><b>Mức độ:</b> Phân loại theo Nhẹ, Trung bình, hoặc Nghiêm trọng.</li>
                <li><b>Hướng xử lý:</b> Các bước sơ cứu hoặc điều trị ban đầu.</li>
              </ul>
              <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
                <b>Lưu ý:</b> Đối với file CSV, hãy đảm bảo các cột được sắp xếp đúng thứ tự như trên và sử dụng bảng mã UTF-8 để tránh lỗi font.
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setShowHelp(false)}>Đã hiểu</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}

export function AdvisorManualForm() {
  const navigate = useNavigate()
  const [toast, setToast] = useState('')

  function saveData(event) {
    event.preventDefault()
    setToast('Đã lưu dữ liệu y khoa thành công')
    window.setTimeout(() => navigate('/advisor/data'), 1800)
  }

  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-form">
        <PageHeader title="Nhập dữ liệu y khoa" subtitle="Vui lòng điền đầy đủ các thông tin chuyên môn để huấn luyện mô hình chẩn đoán." />
        <Card>
          <form onSubmit={saveData}>
            <div className="grid gap-7">
              <Field label="Triệu chứng *"><textarea className="input min-h-32" placeholder="Mô tả các triệu chứng lâm sàng của bệnh nhân..." /></Field>
              <Field label="Chẩn đoán *"><textarea className="input min-h-32" placeholder="Kết luận chẩn đoán dựa trên các triệu chứng trên..." /></Field>
              <div className="grid gap-6 md:grid-cols-2"><Field label="Mức độ nghiêm trọng *"><select className="input"><option>Chọn mức độ...</option><option>Nhẹ</option><option>Trung bình</option><option>Nghiêm trọng</option></select></Field><Field label="Hướng xử lý *"><select className="input"><option>Chọn hướng xử lý...</option><option>Theo dõi tại nhà</option><option>Khám chuyên khoa</option><option>Nhập viện cấp cứu</option></select></Field></div>
              <Field label="Ghi chú (tuỳ chọn)"><textarea className="input min-h-24" placeholder="Các lưu ý đặc biệt khác..." /></Field>
            </div>
            <div className="mt-8 flex gap-3 border-t border-slate-200 pt-6"><Button type="submit"><FilePlus2 size={16} /> Lưu dữ liệu</Button><Link to="/advisor/input"><Button type="button" variant="ghost">Hủy</Button></Link></div>
          </form>
        </Card>
      </div>

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}

function Field({ label, children }) {
  return <label className="block"><span className="field-label">{label}</span>{children}</label>
}
