import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { AppShell, Badge, Button, Card, DataTable, PageHeader, SearchBar, TopBar } from '../../components/ui.jsx'
import { medicalData } from '../../data/mock.js'

export function AdvisorDataList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState('')

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  function saveEdit(event) {
    event.preventDefault()
    setEditing(null)
    showToast('Đã cập nhật dữ liệu triệu chứng')
    if (searchParams.get('returnTo') === 'recheck') {
      window.setTimeout(() => navigate('/advisor/conversation/CV-001'), 700)
    }
  }

  function confirmDelete() {
    setDeleting(null)
    showToast('Đã xoá dữ liệu triệu chứng')
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'symptom', label: 'TRIỆU CHỨNG' },
    { key: 'diagnosis', label: 'CHẨN ĐOÁN' },
    { key: 'level', label: 'MỨC ĐỘ', render: (r) => <Badge tone={r.level === 'Nghiêm trọng' ? 'red' : r.level === 'Nhẹ' ? 'green' : 'yellow'}>{r.level}</Badge> },
    { key: 'actionText', label: 'HƯỚNG XỬ LÝ', render: (r) => <span className="text-slate-500">{r.action}</span> },
    {
      key: 'action',
      label: 'THAO TÁC',
      render: (row) => (
        <div className="flex gap-2">
          <button className="mini-btn teal" onClick={() => setEditing(row)}><Pencil size={14} /> Sửa</button>
          <button className="mini-btn danger-soft" onClick={() => setDeleting(row)}><Trash2 size={14} /> Xoá</button>
        </div>
      ),
    },
  ]
  return (
    <AppShell role="advisor">
      <TopBar />
      <div className="content-advisor">
        <PageHeader title="Danh sách dữ liệu y khoa" action={<Link to="/advisor/input"><Button>+ Nhập dữ liệu mới</Button></Link>} />
        <div className="mb-6"><SearchBar placeholder="Tìm kiếm theo triệu chứng hoặc chẩn đoán..." /></div>
        <DataTable columns={columns} rows={medicalData} footer={false} />
        <div className="table-footer"><span>Hiển thị 7/100 bản ghi</span><div className="pagination"><button>Trước</button><button className="active">1</button><button>2</button><button>3</button><button>Sau</button></div></div>
      </div>

      {editing && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Chỉnh sửa dữ liệu</h2>
            <form className="mt-6 grid gap-4" onSubmit={saveEdit}>
              <textarea className="input min-h-28" defaultValue={editing.symptom} />
              <textarea className="input min-h-24" defaultValue={editing.diagnosis} />
              <div className="grid gap-4 sm:grid-cols-2">
                <select className="input" defaultValue={editing.level}><option>Nhẹ</option><option>Trung bình</option><option>Nghiêm trọng</option></select>
                <input className="input" defaultValue={editing.action} />
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Hủy</Button>
                <Button type="submit">Lưu chỉnh sửa</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {deleting && (
        <div className="modal-backdrop">
          <Card className="modal">
            <h2 className="text-2xl font-black">Xác nhận xoá dữ liệu</h2>
            <p className="mt-3 text-slate-500">Bạn có chắc muốn xoá triệu chứng “{deleting.symptom}” khỏi bộ dữ liệu?</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleting(null)}>Hủy</Button>
              <Button variant="danger" onClick={confirmDelete}>Đồng ý xoá</Button>
            </div>
          </Card>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}
