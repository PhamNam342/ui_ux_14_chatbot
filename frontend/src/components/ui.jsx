import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  CircleUserRound,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Database,
  FileBarChart,
  Hospital,
  LayoutDashboard,
  MapPinned,
  NotebookPen,
  LogOut,
  MessageSquareText,
  Plus,
  Search,
  Settings,
  Users,
  Video,
} from 'lucide-react'

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
        <div className="text-xs text-slate-500">Hệ thống tư vấn y tế</div>
      </div>
    </div>
  )
}

export function Sidebar({ items, legacy = false }) {
  return (
    <aside className={clsx('sidebar', legacy && 'sidebar-legacy')}>
      <Logo />
      <nav className="mt-10 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export function TopBar({ legacy = false }) {
  const navigate = useNavigate()
  const path = window.location.pathname
  const isAdmin = path.startsWith('/admin')
  const isAdvisor = path.startsWith('/advisor')
  const profile = isAdmin
    ? { name: 'Admin', subtitle: 'Quản trị hệ thống', initials: 'A', email: 'admin@medconsult.vn' }
    : isAdvisor
      ? { name: 'Chuyên gia dữ liệu', subtitle: 'Cố vấn y khoa', initials: 'CG', email: 'advisor@medconsult.vn' }
      : { name: 'Dr. Alexander', subtitle: 'Bác sĩ tư vấn', initials: 'DA', email: 'alexander@medconsult.vn' }
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('profile')
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [toast, setToast] = useState('')
  const notifications = [
    'Có 1 lịch tư vấn mới lúc 14:00.',
    'Bệnh án của Trần Thị Mai vừa được cập nhật.',
    'Nhắc lịch tái khám ngày 22/05/2026.',
  ]

  return (
    <header className={clsx('topbar', legacy && 'legacy-topbar')}>
      <button className="icon-btn"><Search size={17} /></button>
      <div className="relative">
        <button className="icon-btn" onClick={() => setNotifyOpen((value) => !value)}><Bell size={17} /></button>
        {notifyOpen && (
          <div className="notify-menu">
            <h3>Thông báo</h3>
            {notifications.map((item, index) => (
              <div key={item} className="notify-item">
                <span className="notify-dot">{index + 1}</span>
                <div>{item}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
      <button className="pill-avatar" onClick={() => setOpen((value) => !value)}>
        <span className="avatar-ring">{profile.initials}</span>
        <span className="text-left">
          <b>{profile.name}</b>
          <small>{isAdmin ? 'Đang hoạt động' : 'Sẵn sàng'}</small>
        </span>
      </button>
      {open && (
        <div className="profile-menu">
          <div className="profile-menu-tabs">
            <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Thông tin</button>
            <button className={tab === 'logout' ? 'active' : ''} onClick={() => setTab('logout')}>Đăng xuất</button>
          </div>
          {tab === 'profile' ? (
            <div className="profile-menu-body">
              <div className="patient-summary mt-0">
                <span className="avatar-ring">{profile.initials}</span>
                <div>
                  <h3>{profile.name}</h3>
                  <p>{profile.subtitle}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-500">{profile.email}</p>
            </div>
          ) : (
            <div className="profile-menu-body">
              <p className="text-sm text-slate-500">Bạn có muốn đăng xuất khỏi phiên làm việc hiện tại?</p>
              <button className="btn btn-danger mt-4 w-full" onClick={() => {
                setToast('Đăng xuất thành công')
                window.setTimeout(() => navigate('/'), 700)
              }}><LogOut size={16} /> Đăng xuất</button>
            </div>
          )}
        </div>
      )}
      </div>
      {toast && <div className="toast toast-red"><CheckCircle2 size={18} /> {toast}</div>}
    </header>
  )
}

export function AppShell({ role, children, legacy = false }) {
  const items = {
    admin: [
      { to: '/admin', label: 'Quản lý các phòng khám', icon: <Hospital size={18} />, end: true },
      { to: '/admin/doctors', label: 'Quản lí bác sĩ', icon: <Users size={18} /> },
      { to: '/admin/schedule', label: 'Quản lí ca khám', icon: <CalendarDays size={18} /> },
      { to: '/admin/revenue', label: 'Báo cáo doanh thu', icon: <BarChart3 size={18} /> },
      { to: '/admin/quality', label: 'Báo cáo ca khám', icon: <FileBarChart size={18} /> },
    ],
    doctor: [
      { to: '/doctor', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
      { to: '/doctor/consult', label: 'Tư vấn trực tuyến', icon: <Video size={18} /> },
      { to: '/doctor/schedule', label: 'Lịch khám', icon: <CalendarDays size={18} /> },
      { to: '/doctor/history', label: 'Lịch sử khám bệnh', icon: <ClipboardList size={18} /> },
      { to: '/doctor/medicine', label: 'Kết luận tư vấn', icon: <MessageSquareText size={18} /> },
      { to: '/doctor/settings', label: 'Cài đặt', icon: <Settings size={18} /> },
    ],
    advisor: [
      { to: '/advisor/data', label: 'Danh sách dữ liệu', icon: <Database size={18} /> },
      { to: '/advisor/input', label: 'Nhập dữ liệu', icon: <ClipboardList size={18} /> },
      { to: '/advisor/chatbot', label: 'Kiểm thử chatbot', icon: <Bot size={18} /> },
      { to: '/advisor/settings', label: 'Cài đặt', icon: <Settings size={18} /> },
    ],
    patient: [
      { to: '/patient', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
      { to: '/patient/booking', label: 'Đặt lịch khám', icon: <MapPinned size={18} /> },
      { to: '/patient/consult', label: 'Tư vấn trực tuyến', icon: <Video size={18} /> },
      { to: '/patient/records', label: 'Hồ sơ bệnh án', icon: <NotebookPen size={18} /> },
      { to: '/patient/history', label: 'Lịch sử khám bệnh', icon: <ClipboardList size={18} /> },
      { to: '/patient/settings', label: 'Cài đặt', icon: <CircleUserRound size={18} /> },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar items={items[role]} legacy={legacy} />
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-normal text-slate-900">{title}</h1>
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

export function Card({ children, className }) {
  return <section className={clsx('card', className)}>{children}</section>
}

export function StatCard({ label, value, tone = 'teal', delta, icon = '+' }) {
  return (
    <Card className="stat-card">
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
