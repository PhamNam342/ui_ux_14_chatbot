import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Pencil, RefreshCw, Trash2 } from 'lucide-react'
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
          <Card className="modal" style={{ maxWidth: '600px' }}>
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-900">Chỉnh sửa dữ liệu y khoa</h2>
              <p className="text-sm text-slate-500">Vui lòng cập nhật chính xác các thông tin chuyên môn.</p>
            </div>
            <form className="grid gap-6" onSubmit={saveEdit}>
              <label className="block">
                <span className="field-label">Triệu chứng lâm sàng *</span>
                <textarea className="input min-h-24" defaultValue={editing.symptom} placeholder="Mô tả các triệu chứng..." />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Chẩn đoán dự kiến *</span>
                  <input className="input" defaultValue={editing.diagnosis} placeholder="Tên bệnh lý..." />
                </label>
                <label className="block">
                  <span className="field-label">Mức độ nghiêm trọng *</span>
                  <select className="input" defaultValue={editing.level}>
                    <option value="">Chọn mức độ...</option>
                    <option>Nhẹ</option>
                    <option>Trung bình</option>
                    <option>Nghiêm trọng</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="field-label">Hướng xử lý đề xuất *</span>
                <textarea className="input min-h-24" defaultValue={editing.action} placeholder="Các bước xử lý..." />
              </label>

              <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-6">
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Hủy bỏ</Button>
                <Button type="submit">Lưu thay đổi</Button>
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

      {searchParams.get('returnTo') === 'recheck' && (
        <div className="toast" style={{ top: 'auto', bottom: '24px', gap: '16px', minWidth: '420px' }}>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-100 text-teal-600">
            <RefreshCw size={20} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-black text-slate-900">Đang trong chế độ chỉnh sửa</div>
            <div className="text-xs font-medium text-slate-500">Cập nhật dữ liệu xong hãy bấm nút để xem lại phản hồi.</div>
          </div>
          <button className="mini-btn filled" onClick={() => navigate(`/advisor/conversation/${searchParams.get('id') || 'CV-001'}?mode=recheck`)}>Kiểm tra lại</button>
        </div>
      )}
    </AppShell>
  )
}
