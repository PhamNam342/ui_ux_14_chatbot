import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  History,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { AppShell, Button, Card, TopBar } from '../../components/ui.jsx'

const clinics = ['Phòng khám Đa khoa Tâm An', 'Phòng khám Tim mạch An Bình', 'MedCare Family Clinic']
const clinicDetails = [
  { name: clinics[0], address: '12 Võ Văn Tần, Quận 3,\u00a0TP.HCM', manager: 'BS. Lê Minh Tâm', color: 'teal' },
  { name: clinics[1], address: '81 Điện Biên Phủ, Bình Thạnh,\u00a0TP.HCM', manager: 'BS. Trần Thị Hoa', color: 'blue' },
  { name: clinics[2], address: '44 Nguyễn Thị Minh Khai, Quận 1,\u00a0TP.HCM', manager: 'Điều phối viên MedCare', color: 'violet' }
]

const serviceGroups = ['Khám lâm sàng', 'Chẩn đoán hình ảnh', 'Xét nghiệm', 'Thủ thuật y tế', 'Trị liệu & Phục hồi']

const initialServices = [
  { id: 'DV-ECG-01', name: 'Đo điện tâm đồ ECG', group: 'Chẩn đoán hình ảnh', clinic: clinics[0], price: 250000, status: 'Đang áp dụng', updated: '03/06/2026', description: 'Ghi nhận điện tim, hỗ trợ sàng lọc rối loạn nhịp và các dấu hiệu bất thường.' },
  { id: 'DV-KNTQ-01', name: 'Khám Nội tổng quát', group: 'Khám lâm sàng', clinic: clinics[0], price: 350000, status: 'Đang áp dụng', updated: '30/05/2026', description: 'Khám tổng quát, đánh giá triệu chứng và tư vấn kế hoạch điều trị phù hợp.' },
  { id: 'DV-SPN-02', name: 'Siêu âm tim Doppler', group: 'Chẩn đoán hình ảnh', clinic: clinics[0], price: 680000, status: 'Đang áp dụng', updated: '28/05/2026', description: 'Khảo sát cấu trúc tim và dòng chảy bằng siêu âm Doppler màu.' },
  { id: 'DV-DL-03', name: 'Khám và soi da chuyên sâu', group: 'Khám lâm sàng', clinic: clinics[1], price: 420000, status: 'Đang áp dụng', updated: '25/05/2026', description: 'Khám chuyên khoa da liễu kết hợp soi da để hỗ trợ đánh giá tổn thương.' },
  { id: 'DV-XQ-04', name: 'Chụp X-quang kỹ thuật số', group: 'Chẩn đoán hình ảnh', clinic: clinics[2], price: 290000, status: 'Ngừng áp dụng', updated: '20/05/2026', description: 'Chụp X-quang kỹ thuật số theo chỉ định chuyên môn của bác sĩ.' },
  { id: 'DV-TMH-01', name: 'Nội soi tai mũi họng', group: 'Thủ thuật y tế', clinic: clinics[1], price: 300000, status: 'Đang áp dụng', updated: '02/06/2026', description: 'Nội soi chẩn đoán các bệnh lý vùng tai, mũi, họng.' },
  { id: 'DV-LH-02', name: 'Xét nghiệm máu tổng quát', group: 'Xét nghiệm', clinic: clinics[2], price: 450000, status: 'Đang áp dụng', updated: '01/06/2026', description: 'Xét nghiệm sinh hóa máu đánh giá chức năng gan, thận, đường huyết.' }
]

const initialHistory = [
  { id: 'H-001', serviceId: 'DV-ECG-01', time: '03/06/2026 10:15', oldPrice: 220000, newPrice: 250000, admin: 'Lê Minh Tâm', note: 'Điều chỉnh định kỳ theo biểu giá cơ sở mới' },
  { id: 'H-002', serviceId: 'DV-TMH-01', time: '02/06/2026 09:30', oldPrice: 280000, newPrice: 300000, admin: 'Trần Thị Hoa', note: 'Cập nhật giá vật tư nội soi mới' },
  { id: 'H-003', serviceId: 'DV-LH-02', time: '01/06/2026 16:45', oldPrice: 400000, newPrice: 450000, admin: 'Hệ thống', note: 'Áp dụng biểu phí dịch vụ xét nghiệm tổng quát' }
]

const currency = (value) => `${Number(value).toLocaleString('vi-VN')}đ`

export function AdminServicePricing() {
  const [services, setServices] = useState(initialServices)
  const [historyItems, setHistoryItems] = useState(initialHistory)
  
  // Scoping Active Clinic state (defaults to clinics[0] to avoid empty landing state)
  const [selectedClinic, setSelectedClinic] = useState(clinics[0])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Localized Filtering States
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals & Drawers States
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  
  const [confirmToggleService, setConfirmToggleService] = useState(null)
  const [confirmDeleteService, setConfirmDeleteService] = useState(null)
  
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [detailTarget, setDetailTarget] = useState(null)
  
  const [toast, setToast] = useState('')

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2500)
  }

  // Handle Add/Edit service submit
  const handleSaveService = (formValues) => {
    const today = new Date()
    const dateString = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`

    if (editTarget) {
      const oldPrice = editTarget.price
      const newPrice = Number(formValues.price)
      if (oldPrice !== newPrice) {
        const timeString = `${dateString} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
        const newLog = {
          id: `H-${Date.now()}`,
          serviceId: editTarget.id,
          time: timeString,
          oldPrice,
          newPrice,
          admin: 'Quản lý cơ sở',
          note: 'Thay đổi giá khi chỉnh sửa dịch vụ'
        }
        setHistoryItems(prev => [newLog, ...prev])
      }
      setServices(prev => prev.map(s => s.id === editTarget.id ? { ...s, ...formValues, updated: dateString } : s))
      
      // Update detailTarget if currently opened in details drawer
      if (detailTarget && detailTarget.id === editTarget.id) {
        setDetailTarget(prev => ({ ...prev, ...formValues, updated: dateString }))
      }

      notify('Cập nhật thông tin dịch vụ thành công!')
    } else {
      if (services.some(s => s.id.toLowerCase() === formValues.id.trim().toLowerCase())) {
        alert('Mã dịch vụ đã tồn tại trong hệ thống!')
        return
      }
      const newService = {
        ...formValues,
        id: formValues.id.trim().toUpperCase(),
        updated: dateString
      }
      setServices(prev => [newService, ...prev])
      notify('Thêm dịch vụ mới thành công!')
    }
    setShowAddEditModal(false)
  }

  // Handle confirm toggle status
  const handleConfirmToggleStatus = () => {
    if (!confirmToggleService) return
    const nextStatus = confirmToggleService.status === 'Đang áp dụng' ? 'Ngừng áp dụng' : 'Đang áp dụng'
    setServices(prev => prev.map(s => s.id === confirmToggleService.id ? { ...s, status: nextStatus } : s))
    notify(nextStatus === 'Đang áp dụng' ? 'Kích hoạt lại dịch vụ thành công' : 'Đã ngừng áp dụng dịch vụ')
    
    // Also update detailTarget if currently opened in details drawer
    if (detailTarget && detailTarget.id === confirmToggleService.id) {
      setDetailTarget(prev => ({ ...prev, status: nextStatus }))
    }
    
    setConfirmToggleService(null)
  }

  // Handle delete service
  const handleDeleteService = (serviceId) => {
    setServices(prev => prev.filter(s => s.id !== serviceId))
    notify('Đã xóa dịch vụ thành công!')
    
    // Also close details drawer if the deleted service was open
    if (detailTarget && detailTarget.id === serviceId) {
      setShowDetailDrawer(false)
      setDetailTarget(null)
    }
    
    setConfirmDeleteService(null)
  }

  // Filtered lists scoped to selected clinic
  const clinicServices = useMemo(() => {
    return services.filter(s => s.clinic === selectedClinic)
  }, [services, selectedClinic])

  const filteredServices = useMemo(() => {
    return clinicServices.filter(s => {
      const matchSearch = searchQuery.trim() === '' || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'Tất cả trạng thái' || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [clinicServices, searchQuery, statusFilter])

  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('Tất cả trạng thái')
  }

  // Stats computed locally to active clinic
  const totalCount = clinicServices.length
  const activeCount = clinicServices.filter(s => s.status === 'Đang áp dụng').length
  const suspendedCount = clinicServices.filter(s => s.status === 'Ngừng áp dụng').length
  const updatesThisMonth = useMemo(() => {
    const currentMonthYear = '06/2026'
    const serviceIds = clinicServices.map(s => s.id)
    return historyItems.filter(h => serviceIds.includes(h.serviceId) && h.time.includes(currentMonthYear)).length
  }, [historyItems, clinicServices])

  // Get active clinic profile
  const activeClinicDetail = useMemo(() => {
    return clinicDetails.find(c => c.name === selectedClinic)
  }, [selectedClinic])

  return (
    <AppShell role="admin">
      <TopBar />
      <main className="content-wide admin-clinic-page px-6 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <p className="admin-clinic-breadcrumb">Admin <span>/</span> Quản lý phòng khám</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">Quản lý bảng giá dịch vụ</h1>
          <p className="text-sm text-slate-500 mt-1">Cấu hình biểu phí y khoa riêng biệt theo từng cơ sở y tế trong hệ thống.</p>
        </div>

        {/* Master-Detail Split Screen Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* LEFT PANEL: Facility Master Switcher */}
          <aside 
            className={`w-full ${sidebarCollapsed ? 'lg:w-16 p-2' : 'lg:w-80 p-4'} flex-none space-y-4 transition-all duration-300 bg-white border border-slate-200 rounded-2xl shadow-sm`}
            style={{ height: 'max-content' }}
          >
            <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center mb-2`}>
              {!sidebarCollapsed && <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cơ sở phòng khám</h2>}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center ${sidebarCollapsed ? '' : 'ml-auto'}`}
                title={sidebarCollapsed ? "Mở rộng cơ sở" : "Thu gọn cơ sở"}
                type="button"
                style={{ width: '28px', height: '28px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '6px' }}
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            {clinicDetails.map((clinic) => {
              const isActive = selectedClinic === clinic.name
              const facilityServices = services.filter(s => s.clinic === clinic.name)
              const activeFacServices = facilityServices.filter(s => s.status === 'Đang áp dụng')
              
              const initials = clinic.name === clinics[0] ? 'TA' : clinic.name === clinics[1] ? 'AB' : 'MC'
              const colorClass = clinic.color === 'blue' ? 'is-blue' : clinic.color === 'violet' ? 'is-violet' : ''

              if (sidebarCollapsed) {
                return (
                  <div
                    key={clinic.name}
                    onClick={() => { setSelectedClinic(clinic.name); resetFilters(); }}
                    className="cursor-pointer flex justify-center items-center w-full py-1.5"
                    title={`${clinic.name}\n${clinic.address}\nTổng: ${facilityServices.length} · Áp dụng: ${activeFacServices.length}`}
                  >
                    <div 
                      className={`admin-doctor-avatar ${colorClass} transition-all duration-200 hover:scale-110 flex items-center justify-center`}
                      style={{ 
                        width: '38px', 
                        height: '38px', 
                        fontSize: '13px',
                        borderRadius: '50%',
                        border: isActive ? '3px solid #0f766e' : '2px solid transparent',
                        boxShadow: isActive ? '0 0 0 2px rgba(15, 118, 110, 0.2)' : 'none',
                        transform: isActive ? 'scale(1.05)' : 'none'
                      }}
                    >
                      {initials}
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={clinic.name}
                  onClick={() => { setSelectedClinic(clinic.name); resetFilters(); }}
                  className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 hover:shadow-md ${
                    isActive 
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  style={isActive ? { borderLeft: '4px solid #0f766e' } : {}}
                >
                  <div className="flex items-start gap-3">
                    <div className={`admin-doctor-avatar ${colorClass} flex-none`} style={{ width: '38px', height: '38px', fontSize: '13px', borderRadius: '50%' }}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-sm font-bold truncate ${isActive ? 'text-teal-900' : 'text-slate-700'}`}>{clinic.name}</h3>
                      <p className="text-xxs text-slate-400 truncate mt-0.5">{clinic.address}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xxs text-slate-500 font-medium">
                        <span>Tổng: <b>{facilityServices.length}</b></span>
                        <span className="text-green-600">Áp dụng: <b>{activeFacServices.length}</b></span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </aside>

          {/* RIGHT DETAIL WORKSPACE: Active Clinic Services */}
          <section className="flex-1 min-w-0">
            {/* Scoped Clinic Sub-Header */}
            <div className="bg-white rounded-2xl border p-4 mb-6 flex flex-row justify-between items-center gap-4 shadow-sm">
              <div className="min-w-0">
                <span className="text-xxs font-bold text-teal-700 uppercase tracking-wider block">Đang xem bảng giá cơ sở:</span>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5 truncate">{selectedClinic}</h3>
                <p className="text-xxs text-slate-400 mt-0.5 truncate">
                  Quản lý: <b>{activeClinicDetail?.manager}</b> &bull; Địa chỉ: <b>{activeClinicDetail?.address}</b>
                </p>
              </div>
              <Button onClick={() => { setEditTarget(null); setShowAddEditModal(true) }} className="flex-none whitespace-nowrap">
                <Plus size={16} /> Thêm dịch vụ mới
              </Button>
            </div>

            {/* Local Stats */}
            <section className="admin-clinic-kpi-grid mb-6">
              <article className="admin-clinic-kpi is-teal">
                <span className="admin-clinic-kpi-icon"><DollarSign size={20} /></span>
                <p>Tổng dịch vụ</p>
                <strong>{totalCount}</strong>
              </article>
              <article className="admin-clinic-kpi is-green">
                <span className="admin-clinic-kpi-icon"><CheckCircle2 size={20} /></span>
                <p>Đang áp dụng</p>
                <strong>{activeCount}</strong>
              </article>
              <article className="admin-clinic-kpi is-red">
                <span className="admin-clinic-kpi-icon"><Power size={20} /></span>
                <p>Ngừng áp dụng</p>
                <strong>{suspendedCount}</strong>
              </article>
              <article className="admin-clinic-kpi is-blue">
                <span className="admin-clinic-kpi-icon"><History size={20} /></span>
                <p>Giá thay đổi</p>
                <strong>{updatesThisMonth}</strong>
              </article>
            </section>

            {/* Scoped Filters Toolbar */}
            <div className="admin-clinic-toolbar mb-6" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(15,23,42,0.02)' }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <label className="admin-filter-control admin-filter-search flex-1" style={{ minWidth: '240px' }}>
                    <div>
                      <Search size={17} />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên hoặc mã dịch vụ..."
                      />
                    </div>
                  </label>

                  <label className="admin-filter-control" style={{ width: '180px' }}>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Trạng thái">
                      <option>Tất cả trạng thái</option>
                      <option>Đang áp dụng</option>
                      <option>Ngừng áp dụng</option>
                    </select>
                  </label>
                </div>

                <button className="admin-reset-filter-btn" type="button" onClick={resetFilters}>
                  <RotateCcw size={15} /> Reset bộ lọc
                </button>
              </div>
            </div>

            {/* Services list table */}
            <div className="admin-doctor-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th className="whitespace-nowrap">Mã dịch vụ</th>
                    <th className="whitespace-nowrap">Tên dịch vụ</th>
                    <th className="whitespace-nowrap">Nhóm dịch vụ</th>
                    <th className="whitespace-nowrap">Cơ sở áp dụng</th>
                    <th className="whitespace-nowrap">Giá hiện tại</th>
                    <th className="whitespace-nowrap">Cập nhật gần nhất</th>
                    <th className="whitespace-nowrap">Trạng thái</th>
                    <th className="whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap">
                          <span className="admin-doctor-table-spec font-semibold">{item.id}</span>
                        </td>
                        <td>
                          <div className="admin-doctor-table-name">{item.name}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className="admin-doctor-table-spec">{item.group}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="admin-doctor-table-main-text">{item.clinic}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="admin-doctor-table-name" style={{ fontSize: '14px' }}>
                            {currency(item.price)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="admin-doctor-table-sub-text">{item.updated}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className={`admin-schedule-status ${item.status === 'Đang áp dụng' ? 'is-đã-xác-nhận' : 'is-đã-hủy'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              className="admin-schedule-more"
                              onClick={() => { setDetailTarget(item); setShowDetailDrawer(true); }}
                              title="Xem chi tiết"
                              type="button"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="admin-schedule-more"
                              onClick={() => { setEditTarget(item); setShowAddEditModal(true); }}
                              title="Chỉnh sửa thông tin"
                              type="button"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              className={`admin-schedule-more ${item.status === 'Đang áp dụng' ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                              onClick={() => setConfirmToggleService(item)}
                              title={item.status === 'Đang áp dụng' ? 'Ngừng áp dụng' : 'Kích hoạt lại'}
                              type="button"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Power size={15} />
                            </button>
                            <button
                              className="admin-schedule-more text-red-600 hover:bg-red-50"
                              onClick={() => setConfirmDeleteService(item)}
                              title="Xóa dịch vụ"
                              type="button"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        Không tìm thấy dịch vụ nào phù hợp trong cơ sở này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

      </main>

      {/* 4. Form thêm/chỉnh sửa dịch vụ Modal */}
      {showAddEditModal && (
        <AddEditServiceModal
          service={editTarget}
          defaultClinic={selectedClinic}
          onClose={() => setShowAddEditModal(false)}
          onSave={handleSaveService}
        />
      )}

      {/* Xác nhận ngừng áp dụng/kích hoạt lại dịch vụ Modal */}
      {confirmToggleService && (
        <div className="modal-backdrop" onMouseDown={() => setConfirmToggleService(null)}>
          <div className="modal admin-doctor-delete-modal p-6 text-center" onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
            <div className="admin-doctor-delete-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Power size={26} /></div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px' }}>
              {confirmToggleService.status === 'Đang áp dụng' ? 'Ngừng áp dụng dịch vụ?' : 'Kích hoạt lại dịch vụ?'}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn {confirmToggleService.status === 'Đang áp dụng' ? 'ngừng áp dụng' : 'kích hoạt lại'} dịch vụ <b>{confirmToggleService.name}</b> không?
            </p>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="outline" onClick={() => setConfirmToggleService(null)}>Hủy</Button>
              <Button onClick={handleConfirmToggleStatus} style={{ background: '#d97706', color: '#fff', border: 'none' }}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận xóa dịch vụ Modal */}
      {confirmDeleteService && (
        <div className="modal-backdrop" onMouseDown={() => setConfirmDeleteService(null)}>
          <div className="modal admin-doctor-delete-modal p-6 text-center" onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
            <div className="admin-doctor-delete-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><AlertTriangle size={26} /></div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px' }}>Xóa dịch vụ y tế?</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn xóa dịch vụ <b>{confirmDeleteService.name}</b> ({confirmDeleteService.id}) khỏi hệ thống? Thao tác này không thể hoàn tác.
            </p>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="outline" onClick={() => setConfirmDeleteService(null)}>Hủy</Button>
              <Button onClick={() => handleDeleteService(confirmDeleteService.id)} style={{ background: '#ef4444', color: '#fff', border: 'none' }}>Xóa dịch vụ</Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Màn hình: Chi tiết dịch vụ Drawer */}
      {showDetailDrawer && (
        <ServiceDetailDrawer
          service={detailTarget}
          history={historyItems.filter(h => h.serviceId === detailTarget?.id)}
          onClose={() => setShowDetailDrawer(false)}
        />
      )}

      {/* Toast Alert */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

    </AppShell>
  )
}

/* --- COMPONENTS DECLARED LOCALLY --- */

// 4. Form thêm/chỉnh sửa dịch vụ Modal Component
function AddEditServiceModal({ service, defaultClinic, onClose, onSave }) {
  const [id, setId] = useState(service ? service.id : '')
  const [name, setName] = useState(service ? service.name : '')
  const [description, setDescription] = useState(service ? service.description : '')
  const [group, setGroup] = useState(service ? service.group : serviceGroups[0])
  const [price, setPrice] = useState(service ? service.price : '')
  const [clinic, setClinic] = useState(service ? service.clinic : (defaultClinic || clinics[0]))
  const [status, setStatus] = useState(service ? service.status : 'Đang áp dụng')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Vui lòng nhập tên dịch vụ!')
      return
    }
    if (!service && !id.trim()) {
      alert('Vui lòng nhập mã dịch vụ!')
      return
    }
    if (price <= 0) {
      alert('Giá dịch vụ phải lớn hơn 0!')
      return
    }
    
    setShowConfirm(true)
  }

  const handleConfirmSave = () => {
    onSave({
      id: service ? service.id : id,
      name,
      description,
      group,
      price: Number(price),
      clinic,
      status
    })
    setShowConfirm(false)
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal p-6"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{service ? 'Chỉnh sửa thông tin dịch vụ' : 'Thêm dịch vụ y tế mới'}</h2>
            <p className="text-xs text-slate-400 mt-1">Cung cấp đầy đủ thông tin để lưu vào cơ sở dữ liệu y tế.</p>
          </div>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Mã dịch vụ *</span>
              <input
                disabled={!!service}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="VD: DV-XQ-01"
                className="w-full text-sm border rounded-lg p-2 bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed border-slate-200 outline-none focus:border-teal-500"
                required
              />
            </label>
            
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Tên dịch vụ *</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên dịch vụ"
                className="w-full text-sm border rounded-lg p-2 border-slate-200 outline-none focus:border-teal-500"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Nhóm dịch vụ</span>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full text-sm border rounded-lg p-2 border-slate-200 bg-white outline-none focus:border-teal-500"
              >
                {serviceGroups.map(g => <option key={g}>{g}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Cơ sở áp dụng</span>
              <select
                disabled={!!defaultClinic}
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                className="w-full text-sm border rounded-lg p-2 border-slate-200 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed outline-none focus:border-teal-500"
              >
                {clinics.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Giá hiện tại (VNĐ) *</span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="VD: 350000"
                className="w-full text-sm border rounded-lg p-2 border-slate-200 outline-none focus:border-teal-500"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Trạng thái áp dụng</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm border rounded-lg p-2 border-slate-200 bg-white outline-none focus:border-teal-500"
              >
                <option>Đang áp dụng</option>
                <option>Ngừng áp dụng</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Mô tả dịch vụ</span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết chức năng y tế của dịch vụ..."
              className="w-full text-sm border rounded-lg p-2 border-slate-200 outline-none focus:border-teal-500"
            />
          </label>

          <footer className="flex justify-end gap-2 border-t pt-4 mt-2">
            <Button variant="outline" type="button" onClick={onClose}>Hủy bỏ</Button>
            <Button type="submit">Lưu thông tin</Button>
          </footer>
        </form>
      </section>

      {showConfirm && (
        <div className="modal-backdrop" onMouseDown={() => setShowConfirm(false)} style={{ zIndex: 1100, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal admin-doctor-delete-modal p-6 text-center" onMouseDown={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '400px' }}>
            <div className="admin-doctor-delete-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><CheckCircle2 size={26} /></div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px' }}>Xác nhận lưu?</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn lưu thông tin dịch vụ này không?
            </p>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button variant="outline" type="button" onClick={() => setShowConfirm(false)}>Hủy</Button>
              <Button onClick={handleConfirmSave} type="button">Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



// 5. Chi tiết dịch vụ Drawer Component
function ServiceDetailDrawer({ service, history, onClose }) {
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        onMouseDown={(e) => e.stopPropagation()}
        className="drawer-content"
      >
        <header className="flex justify-between items-center p-6 border-b">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-1 rounded">{service.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${service.status === 'Đang áp dụng' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {service.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-2">{service.name}</h2>
          </div>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin chi tiết</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Nhóm dịch vụ:</span>
                <span className="text-slate-800 font-semibold">{service.group}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Cơ sở áp dụng:</span>
                <span className="text-slate-800 font-semibold text-right">{service.clinic}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Giá hiện tại:</span>
                <strong className="text-slate-900 text-base">{currency(service.price)}</strong>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Cập nhật cuối:</span>
                <span className="text-slate-800 font-medium">{service.updated}</span>
              </div>
              {service.description && (
                <div className="border-t border-slate-200 pt-3 mt-1">
                  <span className="text-slate-500 block mb-1">Mô tả chức năng:</span>
                  <p className="text-slate-600 text-xs leading-relaxed">{service.description}</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <History size={13} /> Lịch sử thay đổi giá
              </h3>
              <span className="text-xs text-slate-400">{history.length} bản ghi</span>
            </div>

            <div className="border rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b">
                    <th className="p-3 font-semibold">Thời gian</th>
                    <th className="p-3 font-semibold text-right">Giá cũ</th>
                    <th className="p-3 font-semibold text-right">Giá mới</th>
                    <th className="p-3 font-semibold">Cập nhật bởi</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? (
                    history.map((log) => (
                      <tr key={log.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="p-3">
                          <div>{log.time}</div>
                          {log.note && <div className="text-slate-400 text-xxs mt-0.5 italic">{log.note}</div>}
                        </td>
                        <td className="p-3 text-right text-slate-400 strike">{currency(log.oldPrice)}</td>
                        <td className="p-3 text-right text-slate-800 font-bold">{currency(log.newPrice)}</td>
                        <td className="p-3 text-slate-600">{log.admin}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400">
                        Chưa ghi nhận lần đổi giá nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
