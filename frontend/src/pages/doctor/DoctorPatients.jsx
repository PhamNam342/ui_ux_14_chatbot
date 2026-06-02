import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Users, User, Phone, HeartPulse, AlertTriangle,
  ClipboardList, MessageSquare, Calendar, ChevronRight,
  X, Pill, FileText, Stethoscope, SlidersHorizontal,
  ArrowUpDown, MapPin, Mail, ShieldAlert, Clock, Video,
  CheckCircle2, TrendingUp,
} from 'lucide-react'
import { AppShell, TopBar } from '../../components/ui.jsx'
import { getStoredCases, getStoredHistories } from '../../data/doctorStore.js'

// ─── helpers ────────────────────────────────────────────────────────────────
function levelColor(level) {
  if (level === 'Cao') return { pill: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500', ring: 'bg-rose-100 text-rose-700' }
  if (level === 'Trung bình') return { pill: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', ring: 'bg-amber-100 text-amber-700' }
  return { pill: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500', ring: 'bg-teal-50 text-teal-700' }
}

function Avatar({ initials, level, size = 'md' }) {
  const sizes = { sm: 'w-9 h-9 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' }
  const { ring } = levelColor(level)
  return (
    <div className={`${sizes[size]} ${ring} rounded-full flex items-center justify-center font-black shrink-0`}>
      {initials}
    </div>
  )
}

// ─── main component ──────────────────────────────────────────────────────────
export function DoctorPatients() {
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [histories, setHistories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name') // 'name' | 'visits' | 'level'
  const [filterLevel, setFilterLevel] = useState('Tất cả')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [detailTab, setDetailTab] = useState('info')

  useEffect(() => {
    const c = getStoredCases() || []
    const h = getStoredHistories() || []
    setCases(c)
    setHistories(h)
    const handleStorage = () => {
      setCases(getStoredCases() || [])
      setHistories(getStoredHistories() || [])
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Deduplicate patients from cases
  const patients = useMemo(() => {
    const map = new Map()
    cases.forEach(c => {
      if (!map.has(c.patient)) {
        const patientHistories = histories.filter(h => h.patient === c.patient)
        const lastHistory = patientHistories[0]
        map.set(c.patient, {
          name: c.patient,
          initials: c.initials,
          age: c.age,
          gender: c.gender,
          phone: c.phone,
          allergies: c.allergies,
          currentMeds: c.currentMeds,
          specialNotes: c.specialNotes,
          level: c.level,
          code: c.code,
          totalVisits: patientHistories.length + (c.status !== 'Hoàn tất' ? 1 : 0),
          lastVisit: lastHistory?.date || c.time?.split(' ')[0] || '—',
          lastDiagnosis: lastHistory?.diagnosis || '—',
          activeCase: c.status !== 'Hoàn tất' ? c : null,
          histories: patientHistories,
        })
      }
    })
    return Array.from(map.values())
  }, [cases, histories])

  // Filter + sort
  const displayed = useMemo(() => {
    let list = patients
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.code.toLowerCase().includes(q)
      )
    }
    if (filterLevel !== 'Tất cả') {
      list = list.filter(p => p.level === filterLevel)
    }
    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'vi')
      if (sortBy === 'visits') return b.totalVisits - a.totalVisits
      if (sortBy === 'level') {
        const order = { Cao: 0, 'Trung bình': 1, Thấp: 2 }
        return (order[a.level] ?? 3) - (order[b.level] ?? 3)
      }
      return 0
    })
    return list
  }, [patients, searchQuery, filterLevel, sortBy])

  // Stats
  const stats = useMemo(() => ({
    total: patients.length,
    active: patients.filter(p => p.activeCase).length,
    high: patients.filter(p => p.level === 'Cao').length,
    totalVisits: histories.length,
  }), [patients, histories])

  const selPatient = selectedPatient
    ? patients.find(p => p.name === selectedPatient)
    : null
  const selHistories = selPatient
    ? histories.filter(h => h.patient === selPatient.name)
    : []

  return (
    <AppShell role="doctor">
      <TopBar />

      <div className="px-6 pb-6 space-y-5">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users size={24} className="text-teal-600" />
              Bệnh nhân
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Kho dữ liệu bệnh nhân — tra cứu, xem hồ sơ và lịch sử khám</p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Tổng bệnh nhân', value: stats.total, icon: <Users size={18} />, color: 'teal' },
            { label: 'Đang điều trị', value: stats.active, icon: <HeartPulse size={18} />, color: 'sky' },
            { label: 'Mức độ cao', value: stats.high, icon: <AlertTriangle size={18} />, color: 'rose' },
            { label: 'Lượt khám ghi nhận', value: stats.totalVisits, icon: <TrendingUp size={18} />, color: 'violet' },
          ].map(s => (
            <div
              key={s.label}
              className={`bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                ${s.color === 'teal' ? 'bg-teal-50 text-teal-600' : ''}
                ${s.color === 'sky' ? 'bg-sky-50 text-sky-600' : ''}
                ${s.color === 'rose' ? 'bg-rose-50 text-rose-600' : ''}
                ${s.color === 'violet' ? 'bg-violet-50 text-violet-600' : ''}
              `}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search & Filter bar ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
          {/* Search input */}
          <label className="search flex-1 min-w-[200px] !min-h-[40px]">
            <Search size={15} />
            <input
              placeholder="Tìm theo tên, SĐT, mã ca..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </label>

          {/* Level filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={15} className="text-slate-400" />
            <span className="text-[11px] text-slate-500 font-medium">Mức độ:</span>
            {['Tất cả', 'Cao', 'Trung bình', 'Thấp'].map(lv => (
              <button
                key={lv}
                onClick={() => setFilterLevel(lv)}
                className={`px-3 py-1.5 text-[11px] rounded-lg font-semibold border transition-all cursor-pointer ${
                  filterLevel === lv
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="name">Tên A–Z</option>
              <option value="visits">Nhiều lượt khám nhất</option>
              <option value="level">Mức độ ưu tiên</option>
            </select>
          </div>
        </div>

        {/* ── Patient grid ── */}
        {displayed.length > 0 ? (
          <div className={`grid gap-4 ${selPatient ? 'lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
            {displayed.map(p => {
              const col = levelColor(p.level)
              const isSelected = selectedPatient === p.name
              return (
                <div
                  key={p.name}
                  onClick={() => { setSelectedPatient(p.name); setDetailTab('info') }}
                  className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md hover:border-teal-200 group ${
                    isSelected ? 'border-teal-500 shadow-md ring-1 ring-teal-200' : 'border-slate-200'
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar initials={p.initials} level={p.level} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 truncate text-base">{p.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${col.pill}`}>
                          {p.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{p.gender} • {p.age} tuổi</p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-slate-300 group-hover:text-teal-500 transition-colors shrink-0 mt-1 ${isSelected ? 'text-teal-500' : ''}`}
                    />
                  </div>

                  {/* Meta info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      {p.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Stethoscope size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">Lần khám cuối: {p.lastDiagnosis}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">{p.lastVisit}</span>
                    <div className="flex items-center gap-2">
                      {p.activeCase && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                          Đang hoạt động
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {p.totalVisits} lần khám
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl py-20 text-center">
            <Users size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Không tìm thấy bệnh nhân nào</p>
            <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>

      {/* ── Detail panel (slide-in overlay) ── */}
      {selPatient && (
        <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => setSelectedPatient(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-[480px] bg-white shadow-2xl pointer-events-auto flex flex-col h-full overflow-hidden">

            {/* Panel header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-xl">
                    {selPatient.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">{selPatient.name}</h2>
                    <p className="text-teal-100 text-sm mt-0.5">{selPatient.gender} • {selPatient.age} tuổi</p>
                    <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selPatient.level === 'Cao' ? 'bg-rose-500/80 text-white' :
                      selPatient.level === 'Trung bình' ? 'bg-amber-400/80 text-white' :
                      'bg-teal-500/60 text-white'
                    }`}>
                      Mức độ: {selPatient.level}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-4">
                {selPatient.activeCase && (
                  <button
                    onClick={() => navigate(`/doctor/consult/chat/${selPatient.activeCase.code}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-teal-700 text-xs font-bold hover:bg-teal-50 transition-colors cursor-pointer"
                  >
                    <Video size={13} />
                    Vào phòng tư vấn
                  </button>
                )}
                <button
                  onClick={() => navigate(`/doctor/history`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <FileText size={13} />
                  Xem hồ sơ khám
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {[
                { id: 'info', label: 'Thông tin', icon: <User size={14} /> },
                { id: 'history', label: 'Lịch sử khám', icon: <ClipboardList size={14} /> },
                { id: 'consults', label: 'Tư vấn', icon: <MessageSquare size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-bold border-b-2 transition-all cursor-pointer ${
                    detailTab === tab.id
                      ? 'border-teal-600 text-teal-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* ── TAB: Thông tin cá nhân ── */}
              {detailTab === 'info' && (
                <>
                  {/* Contact */}
                  <section className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Liên hệ</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone size={14} className="text-teal-500 shrink-0" />
                      {selPatient.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <FileText size={14} className="text-teal-500 shrink-0" />
                      Mã ca: {selPatient.code}
                    </div>
                  </section>

                  {/* Allergies */}
                  {selPatient.allergies && (
                    <section className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider mb-2">
                        <ShieldAlert size={13} />
                        Dị ứng
                      </h4>
                      <p className="text-sm text-rose-700">{selPatient.allergies}</p>
                    </section>
                  )}

                  {/* Current meds */}
                  {selPatient.currentMeds && (
                    <section className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-700 uppercase tracking-wider mb-2">
                        <Pill size={13} />
                        Thuốc đang sử dụng
                      </h4>
                      <p className="text-sm text-amber-800">{selPatient.currentMeds}</p>
                    </section>
                  )}

                  {/* Special notes */}
                  {selPatient.specialNotes && (
                    <section className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-700 uppercase tracking-wider mb-2">
                        <AlertTriangle size={13} />
                        Ghi chú đặc biệt
                      </h4>
                      <p className="text-sm text-sky-800">{selPatient.specialNotes}</p>
                    </section>
                  )}

                  {/* Active case */}
                  {selPatient.activeCase && (
                    <section className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                      <h4 className="flex items-center gap-1.5 text-[11px] font-extrabold text-teal-700 uppercase tracking-wider mb-2">
                        <HeartPulse size={13} />
                        Ca tư vấn đang mở
                      </h4>
                      <p className="text-sm text-teal-800 font-semibold">{selPatient.activeCase.symptoms}</p>
                      <p className="text-xs text-teal-600 mt-1">Trạng thái: {selPatient.activeCase.status}</p>
                    </section>
                  )}
                </>
              )}

              {/* ── TAB: Lịch sử khám ── */}
              {detailTab === 'history' && (
                <>
                  {selHistories.length > 0 ? selHistories.map(h => (
                    <div key={h.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-teal-600" />
                          <span className="text-xs font-bold text-slate-700">{h.date}</span>
                          {h.time && <span className="text-xs text-slate-400">• {h.time}</span>}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          h.rating >= 5 ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          ★ {h.rating}/5
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Chẩn đoán</span>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">{h.diagnosis}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Triệu chứng</span>
                          <p className="text-xs text-slate-600 mt-0.5">{h.symptoms}</p>
                        </div>
                        {h.note && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Ghi chú bác sĩ</span>
                            <p className="text-xs text-slate-600 mt-0.5">{h.note}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Hướng xử lý</span>
                          <p className="text-xs font-semibold text-teal-700 mt-0.5">{h.actionPath}</p>
                        </div>
                        {h.prescription?.length > 0 && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Đơn thuốc</span>
                            <ul className="mt-1 space-y-1">
                              {h.prescription.map((rx, i) => (
                                <li key={i} className="text-xs text-slate-700 flex gap-1.5">
                                  <Pill size={11} className="text-violet-500 shrink-0 mt-0.5" />
                                  <span><b>{rx.name}</b> — {rx.dose}{rx.note ? ` (${rx.note})` : ''}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {h.reExamDate && (
                          <div className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-1.5">
                            <Clock size={11} />
                            Tái khám: {h.reExamDate}
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="py-16 text-center text-slate-400">
                      <ClipboardList size={36} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-sm">Chưa có lịch sử khám nào được ghi nhận</p>
                    </div>
                  )}
                </>
              )}

              {/* ── TAB: Tư vấn ── */}
              {detailTab === 'consults' && (
                <>
                  {cases.filter(c => c.patient === selPatient.name).map(c => (
                    <div key={c.code} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={13} className="text-teal-600" />
                          <span className="text-xs font-bold text-slate-700">{c.time}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'Hoàn tất' ? 'bg-teal-100 text-teal-700' :
                          c.status === 'Đang tư vấn' ? 'bg-sky-100 text-sky-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-sm text-slate-700">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Triệu chứng</span>
                          {c.symptoms}
                        </div>
                        <div className="text-xs text-slate-500">Mã ca: {c.code}</div>
                        {c.status !== 'Hoàn tất' && (
                          <button
                            onClick={() => navigate(`/doctor/consult/chat/${c.code}`)}
                            className="mt-1 flex items-center gap-1.5 text-xs text-teal-700 font-bold hover:underline cursor-pointer"
                          >
                            <Video size={12} />
                            Vào phòng tư vấn
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {cases.filter(c => c.patient === selPatient.name).length === 0 && (
                    <div className="py-16 text-center text-slate-400">
                      <MessageSquare size={36} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-sm">Không có ca tư vấn nào</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
