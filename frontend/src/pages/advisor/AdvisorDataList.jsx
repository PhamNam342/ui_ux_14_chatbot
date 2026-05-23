import { Link } from 'react-router-dom'
import { Pencil, Plus } from 'lucide-react'
import { AppShell, Badge, Button, DataTable, PageHeader, SearchBar } from '../../components/ui.jsx'
import { medicalData } from '../../data/mock.js'

export function AdvisorDataList() {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'symptom', label: 'TRIỆU CHỨNG' },
    { key: 'diagnosis', label: 'CHẨN ĐOÁN' },
    { key: 'level', label: 'MỨC ĐỘ', render: (r) => <Badge tone={r.level === 'Nghiêm trọng' ? 'red' : r.level === 'Nhẹ' ? 'green' : 'yellow'}>{r.level}</Badge> },
    { key: 'actionText', label: 'HƯỚNG XỬ LÝ', render: (r) => <span className="text-slate-500">{r.action}</span> },
    { key: 'action', label: 'THAO TÁC', render: () => <button className="mini-btn inline-flex items-center gap-2"><Pencil size={14} /> Sửa</button> },
  ]
  return (
    <AppShell role="advisor">
      <div className="content-advisor">
        <PageHeader title="Danh sách dữ liệu y khoa" action={<Link to="/advisor/input"><Button><Plus size={17} /> Nhập dữ liệu mới</Button></Link>} />
        <div className="mb-6"><SearchBar placeholder="Tìm kiếm theo triệu chứng hoặc chẩn đoán..." /></div>
        <DataTable columns={columns} rows={medicalData} footer={false} />
        <div className="table-footer"><span>Hiển thị 7/100 bản ghi</span><div className="pagination"><button>Trước</button><button className="active">1</button><button>2</button><button>3</button><button>Sau</button></div></div>
      </div>
    </AppShell>
  )
}
