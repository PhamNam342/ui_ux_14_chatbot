import { useState } from 'react'
import { AppShell, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { patientMedicalRecords } from '../../data/mock.js'

export function PatientRecords() {
  const [metric, setMetric] = useState('heart_rate')

  const chartData = {
    heart_rate: [72, 75, 80, 78, 85, 76],
    spo2: [98, 97, 96, 98, 95, 99],
    illness: [1, 0, 2, 0, 1, 0]
  }

  const trend = chartData[metric]
  const max = Math.max(...trend)
  const min = Math.min(...trend)
  const range = max === min ? 1 : max - min

  const points = trend
    .map((value, idx) => {
      const x = 20 + idx * 70
      const y = 160 - ((value - min) / range) * 120
      return `${x},${y}`
    })
    .join(' ')

  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Hồ sơ bệnh án" subtitle="Lưu lại các tình trạng bệnh, phát hiện theo tháng năm và tiền sử điều trị." />

        <div className="grid gap-7 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="section-title">Biểu đồ theo dõi theo tháng</h2>
              <select 
                className="input"
                style={{ width: 'auto', minHeight: '36px', fontSize: '13px', padding: '0 32px 0 12px' }}
                value={metric}
                onChange={e => setMetric(e.target.value)}
              >
                <option value="heart_rate">Nhịp tim</option>
                <option value="spo2">SpO2</option>
                <option value="illness">Số lần đổ bệnh</option>
              </select>
            </div>
            <div className="mt-6 p-4 w-full">
              <svg viewBox="0 0 400 210" className="w-full h-56">
                <defs>
                  <linearGradient id="recordArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                
                {[0, 1, 2, 3].map((i) => (
                  <line 
                    key={`grid-${i}`}
                    x1="20" y1={40 + i * 40} x2="370" y2={40 + i * 40} 
                    stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="2"
                  />
                ))}

                <polyline points={points} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                <polygon points={`${points} 370,190 20,190`} fill="url(#recordArea)" />
                {trend.map((value, idx) => {
                  const x = 20 + idx * 70
                  const y = 160 - ((value - min) / range) * 120
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="6" fill="#10b981" />
                      <text x={x} y={y - 12} textAnchor="middle" className="fill-emerald-700 text-[12px] font-bold">
                        {value}
                      </text>
                      <text x={x} y="205" textAnchor="middle" className="fill-slate-500 text-[10px] font-bold">
                        {['01', '02', '03', '04', '05', '06'][idx]}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </Card>

          <Card>
            <h2 className="section-title">Tổng quan sức khoẻ</h2>
            <div className="mt-5 space-y-4">
              <div className="info-box"><small>Nhóm bệnh theo dõi</small><b>Hô hấp, tim mạch, tiêu hoá</b></div>
              <div className="info-box"><small>Lần cập nhật gần nhất</small><b>18/05/2026</b></div>
              <div className="info-box"><small>Khuyến nghị</small><b>Duy trì theo dõi định kỳ và tái khám đúng lịch.</b></div>
            </div>
          </Card>
        </div>

        <div className="mt-7 space-y-5">
          {patientMedicalRecords.map((item) => (
            <Card key={item.month}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div><h2 className="section-title">{item.issue}</h2><p className="mt-2 text-slate-500">{item.month}</p></div>
                <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">Tiền sử: {item.history}</div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">{item.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
