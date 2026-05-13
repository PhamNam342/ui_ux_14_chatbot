import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell, Avatar, Badge, Button, Card, DataTable, SearchBar, StatCard, TopBar } from '../../components/ui.jsx'
import { cases } from '../../data/mock.js'

const statusTabs = ['Tất cả', 'Mới', 'Đang chờ tư vấn', 'Đang tư vấn', 'Hoàn tất']

export function DoctorDashboard() {
  const [status, setStatus] = useState('Tất cả')
  const [level, setLevel] = useState('Tất cả mức độ')
  const [query, setQuery] = useState('')

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return cases.filter((item) => {
      const matchesStatus = status === 'Tất cả' || item.status === status
      const matchesLevel = level === 'Tất cả mức độ' || item.level === level
      const matchesQuery =
        !normalizedQuery ||
        item.patient.toLowerCase().includes(normalizedQuery) ||
        item.code.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesLevel && matchesQuery
    })
  }, [level, query, status])

  const columns = [
    { key: 'code', label: 'MÃ CA', render: (r) => <span className="font-bold text-teal-600">{r.code}</span> },
    { key: 'patient', label: 'BỆNH NHÂN', render: (r) => <div className="flex items-center gap-3"><Avatar>{r.initials}</Avatar><b>{r.patient}</b></div> },
    { key: 'age', label: 'TUỔI' },
    { key: 'status', label: 'TRẠNG THÁI', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
    { key: 'level', label: 'MỨC ĐỘ', render: (r) => <Badge tone={levelTone(r.level)}>{r.level}</Badge> },
    { key: 'symptoms', label: 'TRIỆU CHỨNG' },
    { key: 'action', label: 'HÀNH ĐỘNG', render: (r) => <Link className="mini-btn teal" to={`/doctor/cases/${r.code}`}>Xem ca</Link> },
  ]

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <div className="mb-7">
          <h1 className="text-3xl font-black">Dashboard bác sĩ</h1>
          <p className="mt-1 text-slate-500">Chào buổi sáng, Bác sĩ.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <StatCard label="Ca mới hôm nay" value="32" delta="+12% so với hôm qua" />
          <StatCard label="Đang chờ tư vấn" value="18" tone="amber" delta="Thời gian chờ TB: 15p" />
          <StatCard label="Đã tư vấn hôm nay" value="126" tone="blue" delta="Hoàn thành 85% mục tiêu" />
        </div>

        <Card className="mt-7">
          <div className="tabs">
            {statusTabs.map((item) => (
              <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_240px]">
            <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Lọc theo tên bệnh nhân hoặc mã ca..." />
            <select className="input" value={level} onChange={(event) => setLevel(event.target.value)}>
              <option>Tất cả mức độ</option>
              <option>Thấp</option>
              <option>Trung bình</option>
              <option>Cao</option>
            </select>
          </div>
        </Card>

        <div className="mt-7">
          <DataTable columns={columns} rows={filteredCases} footer={false} />
          <div className="table-footer">
            <span>Hiển thị {filteredCases.length} trong tổng số {cases.length} kết quả</span>
            <div className="pagination"><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function levelTone(level) {
  if (level === 'Cao') return 'red'
  if (level === 'Thấp') return 'green'
  return 'yellow'
}

function statusTone(status) {
  if (status === 'Hoàn tất') return 'green'
  if (status === 'Đang tư vấn') return 'blue'
  if (status === 'Đang chờ tư vấn') return 'yellow'
  return 'neutral'
}
