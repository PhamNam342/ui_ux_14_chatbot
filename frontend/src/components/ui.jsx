import { NavLink, useNavigate } from 'react-router-dom'
import { forwardRef, useState } from 'react'
import {
  CircleUserRound,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  FileBarChart,
  Hospital,
  LayoutDashboard,
  MapPinned,
  NotebookPen,
  LogOut,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Wallet,
  ReceiptText,
  Users,
  Video,
  HeartPulse,
  Pill,
  AlarmClockCheck,
  Clock,
  CalendarOff,
} from 'lucide-react'
import { patientUser } from '../data/mock.js'

function clsx(...values) {
  return values.flat().filter(Boolean).join(' ')
}

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center border border-slate-300 bg-white text-teal-600 shadow-sm">
        <Plus size={18} strokeWidth={3} />
      </div>
      <div>
        <div className="text-lg font-black leading-5 text-teal-600">MedConsult</div>
        <div className="text-xs text-slate-500" style={{ whiteSpace: 'nowrap' }}>Hệ thống tư vấn y tế</div>
      </div>
    </div>
  )
}

export function Sidebar({ items, legacy = false, collapsed = false, onToggle, showLogout = true }) {
  const navigate = useNavigate()

  return (
    <aside className={clsx('sidebar', legacy && 'sidebar-legacy', collapsed && 'sidebar-collapsed')}>
      <div className="sidebar-brand">
        {!collapsed && <Logo />}
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <nav className="mt-10 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {showLogout && (
        <button className="sidebar-logout" onClick={() => navigate('/')} title="Đăng xuất">
          <LogOut size={18} />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      )}
    </aside>
  )
}

export function TopBar({ legacy = false }) {
  const navigate = useNavigate()
  const path = window.location.pathname
  const isAdmin = path.startsWith('/admin')
  const isAdvisor = path.startsWith('/advisor')
  const isPatient = path.startsWith('/patient')
  const profile = isAdmin
    ? { name: 'Admin', subtitle: 'Quản trị hệ thống', initials: 'A', email: 'admin@medconsult.vn' }
    : isAdvisor
      ? { name: 'Chuyên gia dữ liệu', subtitle: 'Cố vấn y khoa', initials: 'CG', email: 'advisor@medconsult.vn' }
      : isPatient
        ? {
            name: patientUser.name,
            subtitle: 'Bệnh nhân',
            initials: patientUser.name
              .split(' ')
              .slice(-2)
              .map((part) => part[0])
              .join('')
              .toUpperCase(),
            email: patientUser.email,
          }
        : { name: 'BS. Nguyễn Văn An', subtitle: 'Bác sĩ tư vấn', initials: 'VA', email: 'an.nguyen@medconsult.vn' }
  const [open, setOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [notifications, setNotifications] = useState([
    { id: 'NT-01', title: 'Lịch tư vấn mới đã được xác nhận', detail: 'Bác sĩ sẽ tiếp nhận cuộc gọi lúc 14:00 hôm nay.', time: '5 phút trước', unread: true, icon: <Video size={16} /> },
    { id: 'NT-02', title: 'Hồ sơ bệnh án vừa được cập nhật', detail: 'Kết quả khám gần nhất đã được bổ sung vào hồ sơ.', time: '45 phút trước', unread: true, icon: <NotebookPen size={16} /> },
    { id: 'NT-03', title: 'Nhắc lịch tái khám định kỳ', detail: 'Bạn có lịch tái khám vào ngày 22/05/2026.', time: '2 giờ trước', unread: false, icon: <CalendarDays size={16} /> },
  ])
  const unreadCount = notifications.filter((item) => item.unread).length
  const patientProfileItems = [
    { label: 'Cài đặt & Hồ sơ', to: '/patient/settings', icon: <Settings size={17} /> },
    { label: 'Lịch khám', to: '/patient/appointments', icon: <CalendarDays size={17} /> },
    { label: 'Hóa đơn', to: '/patient/billing', icon: <Wallet size={17} /> },
    { label: 'Lịch sử khám bệnh', to: '/patient/history', icon: <ClipboardList size={17} /> },
  ]

  function openProfileMenu() {
    setOpen((value) => !value)
    setNotifyOpen(false)
  }

  function openNotificationMenu() {
    setNotifyOpen((value) => !value)
    setOpen(false)
  }

  function logout() {
    setToast('Đăng xuất thành công')
    window.setTimeout(() => navigate('/'), 700)
  }

  return (
    <header className={clsx('topbar', legacy && 'legacy-topbar')}>
      <div className="topbar-context">
        <span className="topbar-context-icon"><CircleUserRound size={18} /></span>
        <span>
          <b>{profile.subtitle}</b>
          <small>Không gian làm việc MedConsult</small>
        </span>
      </div>
      <div className="topbar-actions topbar-action-cluster">
      <button className="icon-btn topbar-search-btn" title="Tìm kiếm"><Search size={17} /></button>
      <div className="relative">
        <button className={`icon-btn notification-trigger ${unreadCount ? 'has-unread' : ''}`} onClick={openNotificationMenu} title="Thông báo">
          <Bell size={19} />
          {unreadCount > 0 && <span className="notify-badge">{unreadCount}</span>}
        </button>
        {notifyOpen && (
          <div className="notify-menu">
            <div className="notify-menu-head">
              <div><h3>Thông báo</h3><p>{unreadCount ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã xem tất cả thông báo'}</p></div>
              {unreadCount > 0 && <button onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))}>Đánh dấu tất cả đã đọc</button>}
            </div>
            <div className="notify-list">
              {notifications.map((item) => (
                <button key={item.id} className={`notify-item ${item.unread ? 'unread' : ''}`} onClick={() => setNotifications((items) => items.map((current) => current.id === item.id ? { ...current, unread: false } : current))}>
                  <span className="notify-dot">{item.icon}</span>
                  <span><b>{item.title}</b><small>{item.detail}</small><time>{item.time}</time></span>
                  {item.unread && <i />}
                </button>
              ))}
            </div>
            <button className="notify-menu-footer">Xem tất cả thông báo <ChevronRight size={15} /></button>
          </div>
        )}
      </div>
      <div className="relative">
      <button className="pill-avatar" onClick={openProfileMenu}>
        <span className="avatar-ring">{profile.initials}</span>
        <span className="text-left">
          <b>{profile.name}</b>
          <small>{isAdmin ? 'Đang hoạt động' : 'Sẵn sàng'}</small>
        </span>
      </button>
      {open && (
        <div className="profile-menu">
          <div className="profile-menu-head">
            <span className="avatar-ring">{profile.initials}</span>
            <div><h3>{profile.name}</h3><p>{profile.subtitle}</p><small>{profile.email}</small></div>
          </div>
          {isPatient ? (
            <div className="profile-menu-links">
              {patientProfileItems.map((item) => <button key={item.label} onClick={() => { setOpen(false); navigate(item.to) }}><span>{item.icon}</span>{item.label}<ChevronRight size={14} /></button>)}
            </div>
          ) : path.startsWith('/doctor') ? (
            <div className="profile-menu-links">
              <button onClick={() => { setOpen(false); navigate('/doctor/profile') }}>
                <span><Settings size={17} /></span>
                Hồ sơ cá nhân
                <ChevronRight size={14} />
              </button>
              <button onClick={() => { setOpen(false); navigate('/doctor/leave') }}>
                <span><CalendarOff size={17} /></span>
                Đăng ký nghỉ phép
                <ChevronRight size={14} />
              </button>
            </div>
          ) : !isAdmin && (
            <div className="profile-menu-links">
              <button onClick={() => { setOpen(false); navigate(path.split('/').slice(0, 2).join('/') + '/settings') }}>
                <span><Settings size={17} /></span>
                Cài đặt
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          <div className="profile-menu-logout">
            <button onClick={logout}><LogOut size={17} /> Đăng xuất</button>
          </div>
        </div>
      )}
      </div>
      {toast && <div className="toast toast-red"><CheckCircle2 size={18} /> {toast}</div>}
      </div>
    </header>
  )
}

export function AppShell({ role, children, legacy = false }) {
  const [collapsed, setCollapsed] = useState(false)
  const items = {
    admin: [
      { to: '/admin', label: 'Quản lý các phòng khám', icon: <Hospital size={18} />, end: true },
      { to: '/admin/doctors', label: 'Quản lí bác sĩ', icon: <Users size={18} /> },
      { to: '/admin/schedule', label: 'Quản lí ca khám', icon: <CalendarDays size={18} /> },
      { to: '/admin/service-pricing', label: 'Bảng giá theo cơ sở', icon: <ReceiptText size={18} /> },
      { to: '/admin/revenue', label: 'Báo cáo doanh thu', icon: <BarChart3 size={18} /> },
      { to: '/admin/quality', label: 'Báo cáo ca khám', icon: <FileBarChart size={18} /> },
    ],
    doctor: [
      { to: '/doctor', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
      { to: '/doctor/consult', label: 'Tư vấn', icon: <Video size={18} /> },
      { to: '/doctor/schedule', label: 'Lịch khám', icon: <CalendarDays size={18} /> },
      { to: '/doctor/patients', label: 'Bệnh nhân', icon: <Users size={18} /> },
      { to: '/doctor/history', label: 'Hồ sơ khám bệnh', icon: <ClipboardList size={18} /> },
    ],
    advisor: [
      { to: '/advisor/data', label: 'Danh sách dữ liệu', icon: <Database size={18} /> },
      { to: '/advisor/input', label: 'Nhập dữ liệu', icon: <ClipboardList size={18} /> },
      { to: '/advisor/chatbot', label: 'Kiểm thử chatbot', icon: <Bot size={18} /> },
      { to: '/advisor/settings', label: 'Cài đặt', icon: <Settings size={18} /> },
    ],
    patient: [
      { to: '/patient', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
      { to: '/patient/chat', label: 'Chat tư vấn', icon: <Bot size={18} /> },
      { to: '/patient/consult', label: 'Tư vấn trực tuyến', icon: <Video size={18} /> },
      { to: '/patient/booking', label: 'Đặt lịch khám', icon: <MapPinned size={18} /> },
      { to: '/patient/services', label: 'Bảng giá dịch vụ', icon: <ReceiptText size={18} /> },
      { to: '/patient/records', label: 'Hồ sơ bệnh án', icon: <NotebookPen size={18} /> },
    ],
  }

  return (
    <div className={clsx('min-h-screen bg-slate-50 text-slate-900', collapsed && 'shell-collapsed', `shell-${role}`)}>
      <Sidebar items={items[role]} legacy={legacy} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-header mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow && <span className="page-header-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p className="mt-2 text-base text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button className={clsx('btn', `btn-${variant}`, className)} {...props}>
      {children}
    </button>
  )
}

export const Card = forwardRef(function Card({ children, className, ...props }, ref) {
  return <section ref={ref} className={clsx('card', className)} {...props}>{children}</section>
})

export function StatCard({ label, value, tone = 'teal', delta, icon = '+' }) {
  return (
    <Card className={clsx('stat-card', `stat-tone-${tone}`)}>
      <div className={clsx('stat-icon', `tone-${tone}`)}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <strong className="mt-1 block text-3xl font-extrabold text-slate-800">{value}</strong>
        {delta && <span className={clsx('mt-3 inline-block text-xs font-bold', delta.includes('-') ? 'text-rose-500' : 'text-teal-600')}>{delta}</span>}
      </div>
    </Card>
  )
}

export function SearchBar({ placeholder = 'Tìm kiếm...', value, onChange }) {
  return (
    <label className="search">
      <Search size={17} />
      <input placeholder={placeholder} value={value} onChange={onChange} />
    </label>
  )
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={clsx('badge', `badge-${tone}`)}>{children}</span>
}

export function Avatar({ children, tone = 'mint' }) {
  return <span className={clsx('avatar', `avatar-${tone}`)}>{children}</span>
}

export function DataTable({ columns, rows, footer = true }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || row.code || index}>
                {columns.map((column) => {
                  const value = column.render ? column.render(row, index) : row[column.key]
                  return <td key={column.key}>{value}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="table-footer">
          <span>Hiển thị 1-4 trong tổng số 32 kết quả</span>
          <div className="pagination"><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div>
        </div>
      )}
    </Card>
  )
}
