import { useMemo, useState } from 'react'
import { Badge, Card, PageHeader, TopBar, AppShell } from '../../components/ui.jsx'
import { patientBills } from '../../data/mock.js'

function formatCurrency(value) {
  return value.toLocaleString('vi-VN')
}

export function PatientBilling() {
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [typeFilter, setTypeFilter] = useState('Tất cả')

  const filteredBills = useMemo(() => {
    return patientBills.filter((bill) => {
      const matchStatus = statusFilter === 'Tất cả' || bill.status === statusFilter
      const matchType = typeFilter === 'Tất cả' || bill.type === typeFilter
      return matchStatus && matchType
    })
  }, [statusFilter, typeFilter])

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Hóa đơn" subtitle="Theo dõi lịch sử thanh toán và lọc nhanh theo trạng thái hoặc loại khám." />

        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <select className="input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>Tất cả</option>
              <option>Đã thanh toán</option>
              <option>Chưa thanh toán</option>
            </select>
            <select className="input" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option>Tất cả</option>
              <option>Tư vấn trực tuyến</option>
              <option>Khám trực tiếp</option>
            </select>
          </div>

          <div className="mt-6 space-y-4">
            {filteredBills.map((bill) => (
              <div key={bill.id} className="doctor-list-card">
                <div>
                  <b>{bill.item}</b>
                  <p>{new Date(`${bill.date}T00:00:00`).toLocaleDateString('vi-VN')} · {bill.type}</p>
                  <p className="text-xs">Mã hóa đơn: {bill.id} · {bill.method}</p>
                </div>
                <div className="text-right">
                  <strong className="text-lg text-emerald-700">{formatCurrency(bill.amount)}đ</strong>
                  <div className="mt-2">
                    <Badge tone={bill.status === 'Đã thanh toán' ? 'green' : 'yellow'}>{bill.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBills.length === 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Không có hóa đơn phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

