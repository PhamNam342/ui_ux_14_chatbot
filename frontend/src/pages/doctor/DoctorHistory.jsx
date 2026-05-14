import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell, Avatar, Card, DataTable, PageHeader, SearchBar, TopBar } from '../../components/ui.jsx'
import { consultationHistory } from '../../data/mock.js'

export function DoctorHistory() {
  const [query, setQuery] = useState('')

  const filteredHistory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return consultationHistory
    return consultationHistory.filter((item) => (
      item.code.toLowerCase().includes(normalizedQuery) ||
      item.patient.toLowerCase().includes(normalizedQuery) ||
      item.symptoms.toLowerCase().includes(normalizedQuery)
    ))
  }, [query])

  const columns = [
    { key: 'code', label: 'MÃ TƯ VẤN', render: (row) => <span className="font-bold text-teal-600">{row.code}</span> },
    { key: 'patient', label: 'TÊN BỆNH NHÂN', render: (row) => <div className="flex items-center gap-3"><Avatar>{row.initials}</Avatar><b>{row.patient}</b></div> },
    { key: 'symptoms', label: 'TRIỆU CHỨNG' },
    { key: 'time', label: 'THỜI GIAN' },
    { key: 'rating', label: 'ĐÁNH GIÁ', render: (row) => <Stars value={row.rating} /> },
    { key: 'action', label: 'CHI TIẾT', render: (row) => <Link className="mini-btn teal" to={`/doctor/cases/${row.code}`}>Chi tiết</Link> },
  ]

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <PageHeader
          title="Lịch sử tư vấn"
          subtitle="Theo dõi các ca tư vấn đã hoàn tất của bác sĩ"
        />

        <Card className="mb-7">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã, bệnh nhân hoặc triệu chứng..." />
            <select className="input" defaultValue="Tất cả đánh giá">
              <option>Tất cả đánh giá</option>
              <option>5 sao</option>
              <option>4 sao</option>
              <option>Dưới 4 sao</option>
            </select>
          </div>
        </Card>

        <DataTable columns={columns} rows={filteredHistory} footer={false} />
        <div className="table-footer">
          <span>Hiển thị {filteredHistory.length} trong tổng số {consultationHistory.length} ca tư vấn</span>
        </div>
      </div>
    </AppShell>
  )
}

function Stars({ value }) {
  return (
    <span className="review-stars" aria-label={`${value} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, index) => <span key={index}>{index < value ? '★' : '☆'}</span>)}
    </span>
  )
}
