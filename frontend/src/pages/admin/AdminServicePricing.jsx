import { createElement, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  History,
  PauseCircle,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Tag,
  X,
} from 'lucide-react'
import { AppShell, Button, TopBar } from '../../components/ui.jsx'

const clinics = ['Phòng khám Đa khoa Tâm An', 'Phòng khám Tim mạch An Bình', 'MedCare Family Clinic']
const specialties = ['Tất cả chuyên khoa', 'Nội tổng quát', 'Tim mạch', 'Nhi khoa', 'Da liễu', 'Tai Mũi Họng', 'Chẩn đoán hình ảnh']
const statuses = ['Tất cả trạng thái', 'Đang áp dụng', 'Tạm ngưng', 'Chờ duyệt']
const priceRanges = ['Tất cả mức giá', 'Dưới 300.000đ', '300.000đ - 700.000đ', 'Trên 700.000đ']

const defaultServices = [
  { id: 'DV-ECG-01', name: 'Đo điện tâm đồ ECG', specialty: 'Tim mạch', clinic: clinics[0], price: 250000, status: 'Đang áp dụng', updated: '15 phút trước', duration: '20 phút', description: 'Ghi nhận điện tim, hỗ trợ sàng lọc rối loạn nhịp và các dấu hiệu bất thường.', usage: 428 },
  { id: 'DV-KNTQ-01', name: 'Khám Nội tổng quát', specialty: 'Nội tổng quát', clinic: clinics[0], price: 350000, status: 'Đang áp dụng', updated: '30 phút trước', duration: '30 phút', description: 'Khám tổng quát, đánh giá triệu chứng và tư vấn kế hoạch điều trị phù hợp.', usage: 1264 },
  { id: 'DV-SPN-02', name: 'Siêu âm tim Doppler', specialty: 'Tim mạch', clinic: clinics[0], price: 680000, status: 'Chờ duyệt', updated: '2 giờ trước', duration: '40 phút', description: 'Khảo sát cấu trúc tim và dòng chảy bằng siêu âm Doppler màu.', usage: 186 },
  { id: 'DV-DL-03', name: 'Khám và soi da chuyên sâu', specialty: 'Da liễu', clinic: clinics[0], price: 420000, status: 'Đang áp dụng', updated: 'Hôm qua', duration: '35 phút', description: 'Khám chuyên khoa da liễu kết hợp soi da để hỗ trợ đánh giá tổn thương.', usage: 306 },
  { id: 'DV-XQ-04', name: 'Chụp X-quang kỹ thuật số', specialty: 'Chẩn đoán hình ảnh', clinic: clinics[0], price: 290000, status: 'Tạm ngưng', updated: '2 ngày trước', duration: '25 phút', description: 'Chụp X-quang kỹ thuật số theo chỉ định chuyên môn của bác sĩ.', usage: 512 },
  { id: 'DV-TM-01', name: 'Khám chuyên khoa Tim mạch', specialty: 'Tim mạch', clinic: clinics[1], price: 450000, status: 'Đang áp dụng', updated: '10 phút trước', duration: '35 phút', description: 'Khám tim mạch với bác sĩ chuyên khoa và đọc kết quả cận lâm sàng.', usage: 748 },
  { id: 'DV-ECG-01', name: 'Đo điện tâm đồ ECG', specialty: 'Tim mạch', clinic: clinics[1], price: 280000, status: 'Đang áp dụng', updated: '1 giờ trước', duration: '20 phút', description: 'Ghi nhận điện tim và đánh giá các chỉ số cơ bản tại cơ sở An Bình.', usage: 582 },
  { id: 'DV-HA-05', name: 'Holter huyết áp 24 giờ', specialty: 'Tim mạch', clinic: clinics[1], price: 850000, status: 'Đang áp dụng', updated: 'Hôm qua', duration: '24 giờ', description: 'Theo dõi huyết áp liên tục trong 24 giờ bằng thiết bị Holter.', usage: 124 },
  { id: 'DV-NK-01', name: 'Khám Nhi khoa', specialty: 'Nhi khoa', clinic: clinics[2], price: 320000, status: 'Đang áp dụng', updated: '25 phút trước', duration: '30 phút', description: 'Khám và tư vấn sức khỏe trẻ em theo từng giai đoạn phát triển.', usage: 954 },
  { id: 'DV-TMH-02', name: 'Nội soi Tai Mũi Họng', specialty: 'Tai Mũi Họng', clinic: clinics[2], price: 390000, status: 'Đang áp dụng', updated: '3 giờ trước', duration: '30 phút', description: 'Nội soi hỗ trợ đánh giá các bất thường vùng tai, mũi và họng.', usage: 342 },
  { id: 'DV-DL-03', name: 'Khám da liễu cơ bản', specialty: 'Da liễu', clinic: clinics[2], price: 280000, status: 'Tạm ngưng', updated: '3 ngày trước', duration: '25 phút', description: 'Khám và tư vấn các vấn đề da liễu thường gặp.', usage: 218 },
]

const defaultHistory = [
  { id: 'LS-001', time: 'Hôm nay, 14:30', admin: 'Admin Nguyễn A', service: 'Đo điện tâm đồ ECG', oldPrice: 250000, newPrice: 280000, reason: 'Điều chỉnh theo bảng giá mới', clinic: clinics[1] },
  { id: 'LS-002', time: 'Hôm nay, 09:15', admin: 'Admin Trần H.', service: 'Khám Nội tổng quát', oldPrice: 320000, newPrice: 350000, reason: 'Cập nhật chi phí vận hành', clinic: clinics[0] },
  { id: 'LS-003', time: 'Hôm qua, 16:40', admin: 'Admin Nguyễn A', service: 'Khám Nhi khoa', oldPrice: 300000, newPrice: 320000, reason: 'Áp dụng bảng giá quý mới', clinic: clinics[2] },
]

const emptyService = { id: '', name: '', specialty: 'Nội tổng quát', clinic: clinics[0], price: '', duration: '30 phút', description: '', status: 'Đang áp dụng' }
const emptyBulk = { clinic: clinics[0], specialty: 'Tất cả chuyên khoa', type: 'Tăng theo %', value: '10', reason: '', date: '2026-06-01' }

const currency = (value) => `${Number(value).toLocaleString('vi-VN')}đ`
const percentage = (oldPrice, newPrice) => oldPrice ? ((Number(newPrice) - oldPrice) / oldPrice) * 100 : 0
const statusClass = (status) => `is-${status.toLowerCase().replaceAll(' ', '-')}`

function Modal({ children, onClose, wide = false }) {
  return <div className="modal-backdrop service-price-modal-backdrop" onMouseDown={onClose}><section className={`service-price-modal ${wide ? 'is-wide' : ''}`} onMouseDown={(event) => event.stopPropagation()}>{children}</section></div>
}

function ModalHeader({ title, subtitle, onClose }) {
  return <header className="service-price-modal-head"><div><span>MEDCONSULT PRICING</span><h2>{title}</h2><p>{subtitle}</p></div><button aria-label="Đóng" onClick={onClose} type="button"><X size={19} /></button></header>
}

export function AdminServicePricing() {
  const [services, setServices] = useState(defaultServices)
  const [historyItems, setHistoryItems] = useState(defaultHistory)
  const [clinic, setClinic] = useState(clinics[0])
  const [specialty, setSpecialty] = useState(specialties[0])
  const [status, setStatus] = useState(statuses[0])
  const [priceRange, setPriceRange] = useState(priceRanges[0])
  const [query, setQuery] = useState('')
  const [draftPrices, setDraftPrices] = useState({})
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState('')
  const [exporting, setExporting] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkForm, setBulkForm] = useState(emptyBulk)
  const [adding, setAdding] = useState(false)
  const [addForm, setAddForm] = useState(emptyService)
  const [selectedService, setSelectedService] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const visibleServices = useMemo(() => services.filter((item) => {
    const normalized = query.trim().toLowerCase()
    const inRange = priceRange === priceRanges[0]
      || (priceRange === priceRanges[1] && item.price < 300000)
      || (priceRange === priceRanges[2] && item.price >= 300000 && item.price <= 700000)
      || (priceRange === priceRanges[3] && item.price > 700000)
    return item.clinic === clinic
      && (specialty === specialties[0] || item.specialty === specialty)
      && (status === statuses[0] || item.status === status)
      && (!normalized || `${item.id} ${item.name}`.toLowerCase().includes(normalized))
      && inRange
  }), [clinic, priceRange, query, services, specialty, status])

  const clinicServices = services.filter((item) => item.clinic === clinic)
  const averagePrice = clinicServices.length ? Math.round(clinicServices.reduce((sum, item) => sum + item.price, 0) / clinicServices.length) : 0
  const kpis = [
    ['Tổng dịch vụ', clinicServices.length, 'Theo cơ sở đang chọn', ClipboardList, 'teal'],
    ['Đang áp dụng', clinicServices.filter((item) => item.status === 'Đang áp dụng').length, 'Có thể đặt lịch ngay', CheckCircle2, 'blue'],
    ['Tạm ngưng', clinicServices.filter((item) => item.status === 'Tạm ngưng').length, 'Cần kiểm tra vận hành', PauseCircle, 'amber'],
    ['Giá trung bình', currency(averagePrice), 'Cập nhật realtime', BarChart3, 'violet'],
  ]

  const makeKey = (item) => `${item.clinic}-${item.id}`
  const nextPrice = (item) => Number(draftPrices[makeKey(item)] ?? item.price)

  const resetFilters = () => {
    setSpecialty(specialties[0])
    setStatus(statuses[0])
    setPriceRange(priceRanges[0])
    setQuery('')
    notify('Đã bỏ bộ lọc phụ')
  }

  const addHistory = (item, oldPrice, newPrice, reason) => {
    setHistoryItems((current) => [{ id: `LS-${Date.now()}`, time: 'Vừa xong', admin: 'Admin hệ thống', service: item.name, oldPrice, newPrice, reason, clinic: item.clinic }, ...current])
  }

  const saveInlinePrice = (item) => {
    const key = makeKey(item)
    const value = nextPrice(item)
    if (!value || value <= 0) {
      notify('Giá dịch vụ phải lớn hơn 0')
      return
    }
    if (value === item.price) {
      setEditing(null)
      notify('Giá dịch vụ chưa thay đổi')
      return
    }
    setServices((current) => current.map((service) => makeKey(service) === key ? { ...service, price: value, updated: 'Vừa xong' } : service))
    addHistory(item, item.price, value, 'Cập nhật trực tiếp trong bảng giá')
    setEditing(null)
    notify('Cập nhật giá thành công')
  }

  const toggleService = (item) => {
    const nextStatus = item.status === 'Tạm ngưng' ? 'Đang áp dụng' : 'Tạm ngưng'
    setServices((current) => current.map((service) => makeKey(service) === makeKey(item) ? { ...service, status: nextStatus, updated: 'Vừa xong' } : service))
    notify(nextStatus === 'Tạm ngưng' ? 'Đã tạm ngưng dịch vụ' : 'Đã kích hoạt dịch vụ')
  }

  const calculateBulkPrice = (price) => {
    const value = Number(bulkForm.value) || 0
    if (bulkForm.type === 'Tăng theo %') return Math.round(price * (1 + value / 100))
    if (bulkForm.type === 'Giảm theo %') return Math.max(1, Math.round(price * (1 - value / 100)))
    if (bulkForm.type === 'Cộng thêm số tiền') return price + value
    return Math.max(1, value)
  }

  const bulkTargets = services.filter((item) => item.clinic === bulkForm.clinic && (bulkForm.specialty === specialties[0] || item.specialty === bulkForm.specialty))

  const saveBulk = () => {
    if (!bulkTargets.length) {
      notify('Không có dịch vụ phù hợp để cập nhật')
      return
    }
    if (!Number(bulkForm.value) || Number(bulkForm.value) <= 0) {
      notify('Vui lòng nhập giá trị cập nhật hợp lệ')
      return
    }
    bulkTargets.forEach((item) => addHistory(item, item.price, calculateBulkPrice(item.price), bulkForm.reason || 'Cập nhật giá hàng loạt'))
    setServices((current) => current.map((item) => item.clinic === bulkForm.clinic && (bulkForm.specialty === specialties[0] || item.specialty === bulkForm.specialty) ? { ...item, price: calculateBulkPrice(item.price), updated: 'Vừa xong' } : item))
    setBulkOpen(false)
    notify(`Đã cập nhật giá cho ${bulkTargets.length} dịch vụ`)
  }

  const addService = (event) => {
    event.preventDefault()
    if (!addForm.id.trim() || !addForm.name.trim()) {
      notify('Vui lòng nhập mã và tên dịch vụ')
      return
    }
    if (!Number(addForm.price) || Number(addForm.price) <= 0) {
      notify('Giá dịch vụ phải lớn hơn 0')
      return
    }
    if (services.some((item) => item.clinic === addForm.clinic && item.id.toLowerCase() === addForm.id.trim().toLowerCase())) {
      notify('Mã dịch vụ đã tồn tại trong cơ sở này')
      return
    }
    setServices((current) => [{ ...addForm, id: addForm.id.trim().toUpperCase(), name: addForm.name.trim(), price: Number(addForm.price), updated: 'Vừa xong', usage: 0 }, ...current])
    setClinic(addForm.clinic)
    setAddForm(emptyService)
    setAdding(false)
    notify('Đã thêm dịch vụ mới')
  }

  const exportPricing = () => {
    setExporting(true)
    window.setTimeout(() => {
      setExporting(false)
      notify(`Đã xuất bảng giá của ${clinic}`)
    }, 700)
  }

  return (
    <AppShell role="admin">
      <TopBar />
      <main className="content-wide admin-clinic-page service-price-page">
        <section className="admin-clinic-page-head">
          <div>
            <p className="admin-clinic-breadcrumb">Admin <span>/</span> Quản lý bảng giá</p>
            <h1>Bảng giá dịch vụ theo cơ sở</h1>
            <p>Quản lý giá khám, giá dịch vụ và trạng thái áp dụng tại từng cơ sở y tế.</p>
          </div>
          <div className="admin-clinic-head-actions">
            <Button disabled={exporting} onClick={exportPricing} variant="outline"><Download size={17} /> {exporting ? 'Đang xuất...' : 'Xuất bảng giá'}</Button>
            <Button onClick={() => setBulkOpen(true)} variant="outline"><RefreshCw size={17} /> Cập nhật giá hàng loạt</Button>
            <Button onClick={() => setAdding(true)}><Plus size={17} /> Thêm dịch vụ</Button>
          </div>
        </section>

        <section className={`service-price-toolbar ${filterOpen ? 'is-open' : ''}`}>
          <header><div><Filter size={18} /><b>Bộ lọc bảng giá</b></div><button onClick={() => setFilterOpen((value) => !value)} type="button"><Filter size={16} /> Bộ lọc</button></header>
          <div className="service-price-filter-grid">
            <label><span>Cơ sở y tế</span><select value={clinic} onChange={(event) => setClinic(event.target.value)}>{clinics.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Chuyên khoa</span><select value={specialty} onChange={(event) => setSpecialty(event.target.value)}>{specialties.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Khoảng giá</span><select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>{priceRanges.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="service-price-search"><span>Tìm dịch vụ</span><div><Search size={16} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Tên dịch vụ / mã dịch vụ" value={query} /></div></label>
          </div>
          <footer><button onClick={() => notify(`Đang hiển thị ${visibleServices.length} dịch vụ phù hợp`)} type="button"><Filter size={15} /> Áp dụng</button><button onClick={resetFilters} type="button"><RotateCcw size={15} /> Bỏ lọc</button></footer>
        </section>

        <section className="service-price-kpi-grid">
          {kpis.map(([label, value, trend, Icon, tone]) => <article className={`service-price-kpi is-${tone}`} key={label}><span>{createElement(Icon, { size: 19 })}</span><p>{label}</p><strong>{value}</strong><small>{trend}</small></article>)}
        </section>

        <section className="service-price-layout">
          <div className="service-price-table-panel">
            <header className="service-price-panel-head"><div><span><FileSpreadsheet size={18} /></span><div><h2>Danh sách dịch vụ</h2><p>{visibleServices.length} dịch vụ tại {clinic}</p></div></div><em>Cập nhật trực tiếp giá mới trong từng dòng</em></header>
            {visibleServices.length ? <ServiceTable draftPrices={draftPrices} editing={editing} nextPrice={nextPrice} onDraft={setDraftPrices} onEdit={setEditing} onHistory={setSelectedService} onSave={saveInlinePrice} onToggle={toggleService} services={visibleServices} /> : <EmptyState onAdd={() => setAdding(true)} />}
          </div>
          <PriceHistory history={historyItems.filter((item) => item.clinic === clinic).slice(0, 6)} onAll={() => notify('Đã hiển thị lịch sử mới nhất của cơ sở')} />
        </section>
      </main>

      {bulkOpen && <BulkModal calculate={calculateBulkPrice} form={bulkForm} onChange={setBulkForm} onClose={() => setBulkOpen(false)} onSave={saveBulk} targets={bulkTargets} />}
      {adding && <AddServiceModal form={addForm} onChange={setAddForm} onClose={() => setAdding(false)} onSubmit={addService} />}
      {selectedService && <ServiceDrawer history={historyItems.filter((item) => item.clinic === selectedService.clinic && item.service === selectedService.name)} onClose={() => setSelectedService(null)} service={services.find((item) => makeKey(item) === makeKey(selectedService)) ?? selectedService} />}
      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </AppShell>
  )
}

function ServiceTable({ services, draftPrices, editing, nextPrice, onDraft, onEdit, onHistory, onSave, onToggle }) {
  return <div className="service-price-table-wrap"><table><thead><tr><th>Mã dịch vụ</th><th>Tên dịch vụ</th><th>Chuyên khoa</th><th>Cơ sở áp dụng</th><th>Giá hiện tại</th><th>Giá mới</th><th>Trạng thái</th><th>Cập nhật</th><th>Thao tác</th></tr></thead><tbody>{services.map((item) => {
    const key = `${item.clinic}-${item.id}`
    const value = nextPrice(item)
    const delta = percentage(item.price, value)
    const changed = value !== item.price
    return <tr className={changed ? 'is-changing' : ''} key={key}>
      <td><span className="service-price-code">{item.id}</span></td>
      <td><b>{item.name}</b><small>{item.duration}</small></td>
      <td><span className={`service-price-spec is-${item.specialty.toLowerCase().replaceAll(' ', '-')}`}>{item.specialty}</span></td>
      <td><span>{item.clinic}</span></td>
      <td><b>{currency(item.price)}</b></td>
      <td><div className="service-price-edit"><input aria-label={`Giá mới ${item.name}`} min="1" onChange={(event) => onDraft((current) => ({ ...current, [key]: event.target.value }))} onFocus={() => onEdit(key)} type="number" value={draftPrices[key] ?? item.price} />{changed && <small className={Math.abs(delta) > 20 ? 'is-warning' : ''}>{Math.abs(delta) > 20 && <AlertTriangle size={12} />}{delta > 0 ? '+' : ''}{delta.toFixed(1)}%</small>}</div></td>
      <td><span className={`service-price-status ${statusClass(item.status)}`}>{item.status}</span></td>
      <td><small>{item.updated}</small></td>
      <td><div className="service-price-row-actions"><button className={editing === key ? 'is-active' : ''} onClick={() => onEdit(key)} title="Sửa giá" type="button"><Pencil size={14} /></button><button disabled={!changed} onClick={() => onSave(item)} title="Lưu giá" type="button"><Save size={14} /></button><button onClick={() => onToggle(item)} title={item.status === 'Tạm ngưng' ? 'Kích hoạt' : 'Tạm ngưng'} type="button"><PauseCircle size={14} /></button><button onClick={() => onHistory(item)} title="Xem lịch sử" type="button"><History size={14} /></button></div></td>
    </tr>
  })}</tbody></table></div>
}

function PriceHistory({ history, onAll }) {
  return <aside className="service-price-history"><header><div><History size={18} /><div><h2>Lịch sử thay đổi</h2><p>Cập nhật mới nhất</p></div></div><button onClick={onAll} type="button">Xem tất cả</button></header><div>{history.length ? history.map((item) => <article key={item.id}><time>{item.time} · {item.admin}</time><h3>{item.service}</h3><p><b>{currency(item.oldPrice)}</b><span>→</span><strong>{currency(item.newPrice)}</strong></p><small>{item.reason}</small></article>) : <p className="service-price-empty-note">Chưa có lịch sử thay đổi tại cơ sở này.</p>}</div></aside>
}

function BulkModal({ calculate, form, onChange, onClose, onSave, targets }) {
  return <Modal onClose={onClose} wide><ModalHeader onClose={onClose} subtitle="Điều chỉnh đồng thời nhiều dịch vụ và kiểm tra giá mới trước khi áp dụng." title="Cập nhật giá hàng loạt" /><div className="service-price-form-grid"><label><span>Cơ sở</span><select value={form.clinic} onChange={(event) => onChange({ ...form, clinic: event.target.value })}>{clinics.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Chuyên khoa</span><select value={form.specialty} onChange={(event) => onChange({ ...form, specialty: event.target.value })}>{specialties.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Kiểu cập nhật</span><select value={form.type} onChange={(event) => onChange({ ...form, type: event.target.value })}>{['Tăng theo %', 'Giảm theo %', 'Cộng thêm số tiền', 'Gán giá cố định'].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Giá trị</span><input min="1" onChange={(event) => onChange({ ...form, value: event.target.value })} type="number" value={form.value} /></label><label><span>Ngày bắt đầu</span><input onChange={(event) => onChange({ ...form, date: event.target.value })} type="date" value={form.date} /></label><label className="is-wide"><span>Lý do cập nhật</span><input onChange={(event) => onChange({ ...form, reason: event.target.value })} placeholder="VD: Điều chỉnh theo bảng giá quý mới" value={form.reason} /></label></div><div className="service-price-preview"><h3>Preview thay đổi · {targets.length} dịch vụ</h3><div><table><thead><tr><th>Dịch vụ</th><th>Giá cũ</th><th>Giá mới</th><th>Chênh lệch</th></tr></thead><tbody>{targets.slice(0, 5).map((item) => { const next = calculate(item.price); const delta = percentage(item.price, next); return <tr key={`${item.clinic}-${item.id}`}><td>{item.name}</td><td>{currency(item.price)}</td><td><b>{currency(next)}</b></td><td><span className={Math.abs(delta) > 20 ? 'is-warning' : ''}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}%</span></td></tr> })}</tbody></table></div></div><footer className="service-price-modal-actions"><button onClick={onClose} type="button">Hủy</button><button className="is-primary" onClick={onSave} type="button"><RefreshCw size={15} /> Xác nhận cập nhật</button></footer></Modal>
}

function AddServiceModal({ form, onChange, onClose, onSubmit }) {
  return <Modal onClose={onClose}><ModalHeader onClose={onClose} subtitle="Tạo dịch vụ và áp dụng bảng giá riêng cho cơ sở được chọn." title="Thêm dịch vụ mới" /><form onSubmit={onSubmit}><div className="service-price-form-grid"><label><span>Mã dịch vụ *</span><input onChange={(event) => onChange({ ...form, id: event.target.value })} placeholder="DV-NEW-01" value={form.id} /></label><label><span>Tên dịch vụ *</span><input onChange={(event) => onChange({ ...form, name: event.target.value })} placeholder="Tên dịch vụ" value={form.name} /></label><label><span>Chuyên khoa</span><select value={form.specialty} onChange={(event) => onChange({ ...form, specialty: event.target.value })}>{specialties.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Cơ sở áp dụng</span><select value={form.clinic} onChange={(event) => onChange({ ...form, clinic: event.target.value })}>{clinics.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Giá dịch vụ *</span><input min="1" onChange={(event) => onChange({ ...form, price: event.target.value })} placeholder="350000" type="number" value={form.price} /></label><label><span>Thời lượng ước tính</span><input onChange={(event) => onChange({ ...form, duration: event.target.value })} value={form.duration} /></label><label><span>Trạng thái</span><select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value })}>{statuses.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label className="is-wide"><span>Mô tả dịch vụ</span><textarea onChange={(event) => onChange({ ...form, description: event.target.value })} placeholder="Mô tả ngắn giúp admin nhận diện dịch vụ" value={form.description} /></label></div><footer className="service-price-modal-actions"><button onClick={onClose} type="button">Hủy</button><button className="is-primary" type="submit"><Save size={15} /> Lưu dịch vụ</button></footer></form></Modal>
}

function ServiceDrawer({ service, history, onClose }) {
  return <div className="modal-backdrop service-price-drawer-backdrop" onMouseDown={onClose}><aside className="service-price-drawer" onMouseDown={(event) => event.stopPropagation()}><ModalHeader onClose={onClose} subtitle="Thông tin vận hành và các lần cập nhật giá gần đây." title="Chi tiết dịch vụ" /><section className="service-price-drawer-hero"><div><span className="service-price-code">{service.id}</span><h3>{service.name}</h3><p>{service.description}</p></div><Tag size={25} /></section><dl className="service-price-detail-grid"><div><dt>Chuyên khoa</dt><dd>{service.specialty}</dd></div><div><dt>Cơ sở áp dụng</dt><dd>{service.clinic}</dd></div><div><dt>Giá hiện tại</dt><dd>{currency(service.price)}</dd></div><div><dt>Trạng thái</dt><dd><span className={`service-price-status ${statusClass(service.status)}`}>{service.status}</span></dd></div><div><dt>Lượt sử dụng</dt><dd>{service.usage.toLocaleString('vi-VN')} lượt</dd></div><div><dt>Doanh thu dịch vụ</dt><dd>{currency(service.usage * service.price)}</dd></div></dl><section className="service-price-drawer-history"><h3><History size={16} /> Lịch sử giá</h3>{history.length ? history.map((item) => <article key={item.id}><time>{item.time}</time><p><b>{currency(item.oldPrice)}</b><span>→</span><strong>{currency(item.newPrice)}</strong></p><small>{item.reason}</small></article>) : <p className="service-price-empty-note">Chưa có thay đổi giá được ghi nhận.</p>}</section></aside></div>
}

function EmptyState({ onAdd }) {
  return <div className="service-price-empty"><FileSpreadsheet size={32} /><h3>Không có dịch vụ phù hợp</h3><p>Thử thay đổi bộ lọc hoặc thêm dịch vụ mới cho cơ sở này.</p><Button onClick={onAdd}><Plus size={16} /> Thêm dịch vụ</Button></div>
}
