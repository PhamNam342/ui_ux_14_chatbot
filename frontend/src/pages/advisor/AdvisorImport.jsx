import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, FilePenLine, Upload } from 'lucide-react'
import { AppShell, Badge, Button, Card, DataTable, PageHeader, TopBar } from '../../components/ui.jsx'
import { medicalData } from '../../data/mock.js'

export function AdvisorImport() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState(false)
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'symptom', label: 'TRIỆU CHỨNG', render: (row) => <b>{row.symptom}</b> },
    { key: 'diagnosis', label: 'CHẨN ĐOÁN' },
    { key: 'level', label: 'MỨC ĐỘ', render: (row) => <Badge tone={row.level === 'Nghiêm trọng' ? 'red' : row.level === 'Nhẹ' ? 'blue' : 'yellow'}>{row.level}</Badge> },
    { key: 'action', label: 'HƯỚNG XỬ LÝ' },
  ]

  if (preview) {
    return (
      <AppShell role="advisor">
        <TopBar />
        <div className="content-advisor">
          <Card className="advisor-preview-panel p-0">
            <div className="advisor-preview-head">
              <div><h1><FilePenLine size={24} /> Preview dữ liệu</h1><p>Xem lại dữ liệu từ tệp CSV của bạn trước khi xác nhận lưu vào hệ thống.</p></div>
              <Badge tone="green"><CheckCircle2 size={13} /> Đã tải lên: data_import_01.csv</Badge>
            </div>
            <div className="p-6"><DataTable columns={columns} rows={medicalData.slice(0, 5)} footer={false} /></div>
            <div className="advisor-preview-foot">
              <span><FilePenLine size={18} /> Vui lòng kiểm tra kỹ trước khi hoàn tất.</span>
              <div className="flex gap-3"><Button variant="ghost" onClick={() => setPreview(false)}>Hủy</Button><Button onClick={() => navigate('/advisor/data')}><Upload size={16} /> Xác nhận</Button></div>
            </div>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-form">
        <PageHeader title="Upload CSV" />
        <Card className="advisor-upload-card">
          <div className="advisor-dropzone">
            <Upload size={58} />
            <p>Kéo thả file CSV vào đây hoặc <button onClick={() => setPreview(true)}>chọn từ máy tính</button></p>
            <small>Dung lượng tối đa: 20MB</small>
          </div>
          <div className="advisor-csv-note">
            <b>Định dạng CSV yêu cầu:</b>
            <p>Triệu chứng, Chẩn đoán, Mức độ nghiêm trọng, Hướng xử lý</p>
            <small>Hỗ trợ định dạng .csv</small>
          </div>
          <div className="mt-8 flex justify-end gap-3"><Link to="/advisor/input"><Button variant="ghost">Hủy</Button></Link><Button onClick={() => setPreview(true)}>Xác nhận</Button></div>
        </Card>
      </div>
    </AppShell>
  )
}
