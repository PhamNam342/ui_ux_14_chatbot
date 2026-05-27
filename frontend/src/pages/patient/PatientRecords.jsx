import { AppShell, Card, PageHeader, TopBar } from '../../components/ui.jsx'
import { patientMedicalRecords } from '../../data/mock.js'

export function PatientRecords() {
  return (
    <AppShell role="patient">
      <TopBar />
      <div className="content-wide">
        <PageHeader title="Hồ sơ bệnh án" subtitle="Lưu lại các tình trạng bệnh, phát hiện theo tháng năm và tiền sử điều trị." />

        <div className="grid gap-7 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <h2 className="section-title">Biểu đồ theo dõi theo tháng</h2>
            <div className="record-chart mt-6">
              {[42, 58, 36, 64, 48, 54].map((value, index) => (
                <div key={index} className="record-bar">
                  <span style={{ height: `${value}%` }} />
                  <small>{['01', '02', '03', '04', '05', '06'][index]}</small>
                </div>
              ))}
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
