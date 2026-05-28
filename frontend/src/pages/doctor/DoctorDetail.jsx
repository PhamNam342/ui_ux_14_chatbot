import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, FileText, HeartPulse, Phone, Stethoscope, UserRound } from 'lucide-react'
import { AppShell, Avatar, Badge, Button, Card, TopBar } from '../../components/ui.jsx'
import { cases, consultationHistory } from '../../data/mock.js'

export function DoctorDetail() {
  const { id } = useParams()
  const currentCase = cases.find((item) => item.code === id) || cases[0]
  const consultation = consultationHistory.find((item) => item.code === id)

  const record = {
    code: currentCase.code,
    patient: currentCase.patient,
    initials: currentCase.initials,
    symptoms: currentCase.symptoms,
    diagnosis: consultation?.diagnosis || 'Chưa có chẩn đoán chính thức. Cần tư vấn trực tuyến để bác sĩ đánh giá thêm.',
    time: consultation?.time || 'Chưa bắt đầu tư vấn',
    feedback: consultation?.feedback || [],
    medicalHistory: currentCase.level === 'Cao' ? 'Theo dõi tim mạch, cần kiểm tra huyết áp và ECG nếu đau ngực kéo dài.' : 'Không ghi nhận tiền sử dị ứng thuốc trong dữ liệu hiện tại.',
    initialNote: 'Bệnh nhân khai báo triệu chứng ban đầu qua hệ thống sàng lọc. Thông tin cần được xác nhận lại trong buổi tư vấn.',
  }

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link to="/doctor" className="mini-btn mb-4 inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Quay lại danh sách
            </Link>
            <h1 className="text-3xl font-black text-slate-900">Chi tiết bệnh án</h1>
            <p className="mt-2 text-slate-500">{record.code} · {record.patient}</p>
          </div>
          <Link to={`/doctor/consult?case=${record.code}`}>
            <Button><Stethoscope size={17} /> Tư vấn</Button>
          </Link>
        </div>

        <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
          <div className="space-y-7">
            <Card>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-600">
                  <FileText size={18} />
                </span>
                <h2 className="section-title !mb-0">Thông tin bệnh án</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info label="Mã ca" value={record.code} />
                <Info label="Thời gian" value={record.time} icon={<CalendarDays size={14} />} />
                <Info label="Triệu chứng ban đầu" value={record.symptoms} wide />
                <Info label="Ghi chú sàng lọc" value={record.initialNote} wide />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-500">
                  <HeartPulse size={18} />
                </span>
                <h2 className="section-title !mb-0">Đánh giá y khoa</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info label="Mức độ" value={currentCase.level} />
                <Info label="Trạng thái" value={currentCase.status} />
                <Info label="Tiền sử / lưu ý" value={record.medicalHistory} wide />
                <Info label="Chẩn đoán hiện tại" value={record.diagnosis} wide />
              </div>
            </Card>

            <Card>
              <h2 className="section-title">Phản hồi sau tư vấn</h2>
              {record.feedback.length ? (
                <div className="mt-5 space-y-4">
                  {record.feedback.map((item) => (
                    <div className="feedback-comment" key={`${item.author}-${item.time}`}>
                      <Avatar>{item.author.split(' ').slice(-2).map((part) => part[0]).join('')}</Avatar>
                      <div>
                        <p><b>{item.author}</b><span>{item.time}</span></p>
                        <div>{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-400">
                  Chưa có phản hồi vì ca này chưa hoàn tất tư vấn.
                </div>
              )}
            </Card>
          </div>

          <aside className="space-y-7">
            <Card>
              <div className="flex items-center gap-3">
                <Avatar>{record.initials}</Avatar>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{record.patient}</h2>
                  <p className="text-sm text-teal-600">{record.code}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Info label="Tuổi" value={`${currentCase.age} tuổi`} />
                <Info label="Giới tính" value={currentCase.gender} />
                <Info label="Số điện thoại" value={currentCase.phone} icon={<Phone size={14} />} />
                <div className="info-box">
                  <small>Trạng thái</small>
                  <Badge tone={statusTone(currentCase.status)}>{currentCase.status}</Badge>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-100">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-teal-600">
                  <UserRound size={18} />
                </span>
                <div>
                  <h3 className="font-black text-teal-800">Sẵn sàng tư vấn</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Bác sĩ có thể kiểm tra bệnh án trước, sau đó vào phòng tư vấn để trao đổi trực tiếp với bệnh nhân.</p>
                </div>
              </div>
              <Link to={`/doctor/consult?case=${record.code}`}>
                <Button className="mt-5 w-full justify-center"><Stethoscope size={17} /> Tư vấn</Button>
              </Link>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

function Info({ label, value, icon, wide = false }) {
  return (
    <div className={`info-box ${wide ? 'md:col-span-2' : ''}`}>
      <small>{label}</small>
      <b className="flex items-center gap-1">{icon}{value}</b>
    </div>
  )
}

function statusTone(status) {
  if (status === 'Hoàn tất') return 'green'
  if (status === 'Đang tư vấn') return 'blue'
  if (status === 'Đang chờ tư vấn') return 'yellow'
  return 'neutral'
}
