import { Link } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { AppShell, Button, Card, DataTable, PageHeader } from '../../components/ui.jsx'
import { medicalData } from '../../data/mock.js'

export function AdvisorImport() {
  const columns = [
    { key: 'symptom', label: 'Triệu chứng' },
    { key: 'diagnosis', label: 'Chẩn đoán' },
    { key: 'level', label: 'Mức độ' },
    { key: 'action', label: 'Hướng xử lý' },
  ]
  return (
    <AppShell role="advisor">
      <div className="content-advisor">
        <PageHeader title="Nhập dữ liệu tu CSV" subtitle="Tải tệp lên, xem trước dữ liệu và xác nhận trước khi lưu vào hệ thống." />
        <Card className="mb-7 border-dashed text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-600"><Upload size={28} /></div>
          <h2 className="mt-4 text-xl font-black">Kéo thả file CSV vào đây</h2>
          <p className="mt-2 text-slate-500">Hỗ trợ .csv tối đa 10MB</p>
          <Button className="mt-5">Chọn tệp</Button>
        </Card>
        <DataTable columns={columns} rows={medicalData.slice(0, 4)} footer={false} />
        <div className="mt-6 flex justify-end gap-3"><Link to="/advisor/input"><Button variant="ghost">Quay lại</Button></Link><Button>Nhập 4 bản ghi</Button></div>
      </div>
    </AppShell>
  )
}
