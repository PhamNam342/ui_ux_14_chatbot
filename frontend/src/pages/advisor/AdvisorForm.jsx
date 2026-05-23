import { Link } from 'react-router-dom'
import { Check, Upload } from 'lucide-react'
import { AppShell, Button, Card, PageHeader } from '../../components/ui.jsx'

export function AdvisorForm() {
  return (
    <AppShell role="advisor">
      <div className="content-form">
        <PageHeader title="Nhập dữ liệu y khoa" subtitle="Vui lòng điền đầy đủ các thông tin chuyên môn để huấn luyện mô hình chẩn đoán." />
        <Card>
          <div className="grid gap-7">
            <Field label="Triệu chứng *"><textarea className="input min-h-32" placeholder="Mô tả các triệu chứng lâm sàng của bệnh nhân..." /></Field>
            <Field label="Chẩn đoán *"><textarea className="input min-h-32" placeholder="Kết luận chẩn đoán dựa trên các triệu chứng trên..." /></Field>
            <div className="grid gap-6 md:grid-cols-2"><Field label="Mức độ nghiêm trọng *"><select className="input"><option>Chọn mức độ...</option></select></Field><Field label="Hướng xử lý *"><select className="input"><option>Chọn hướng xử lý...</option></select></Field></div>
            <Field label="Ghi chú (tuy chon)"><textarea className="input min-h-24" placeholder="Các lưu ý đặc biệt khác..." /></Field>
          </div>
          <div className="mt-8 flex gap-3 border-t border-slate-200 pt-6"><Button><Check size={17} /> Lưu dữ liệu</Button><Link to="/advisor/data"><Button variant="ghost">Hủy</Button></Link><Link to="/advisor/import"><Button variant="outline"><Upload size={17} /> Nhập CSV</Button></Link></div>
        </Card>
      </div>
    </AppShell>
  )
}

function Field({ label, children }) {
  return <label className="block"><span className="field-label">{label}</span>{children}</label>
}
