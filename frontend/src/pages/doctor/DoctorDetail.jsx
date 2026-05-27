import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Calendar, Clock, MessageSquare, Mic, MicOff, MonitorUp, Phone, PhoneOff, Search, Star, User, Video, VideoOff } from 'lucide-react'
import { AppShell, Avatar, Badge, Button, Card, TopBar } from '../../components/ui.jsx'
import { cases, consultationHistory } from '../../data/mock.js'

export function DoctorDetail() {
  const { id } = useParams()
  const consultation = consultationHistory.find((item) => item.code === id)
  const currentCase = cases.find((item) => item.code === id) || cases[0]
  const detail = consultation || {
    code: currentCase.code,
    patient: currentCase.patient,
    initials: currentCase.initials,
    symptoms: currentCase.symptoms,
    time: 'Chưa hoàn tất tư vấn',
    rating: 0,
    diagnosis: 'Chưa có kết luận',
    feedback: [],
  }

  const statusColor = {
    'Đang chờ tư vấn': 'amber',
    'Đang tư vấn': 'blue',
    'Hoàn tất': 'green',
    'Mới': 'neutral',
  }

  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [screenOn, setScreenOn] = useState(false)
  const [inCall, setInCall] = useState(false)

  return (
    <AppShell role="doctor">
      <TopBar />
      <div className="content-wide">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/doctor/dashboard" className="mini-btn inline-flex items-center gap-1.5 mb-3">
              <ArrowLeft size={15} /> Quay lại danh sách
            </Link>
            <h1 className="text-2xl font-black text-slate-800">Chi tiết ca bệnh</h1>
            <p className="text-slate-500 text-sm mt-0.5">{detail.code} · {detail.patient}</p>
          </div>
          {/* <Link to="/doctor/consult">
            <Button className="shrink-0">Bắt đầu tư vấn</Button>
          </Link> */}
        </div>

        {/* Main grid: Left wide column + right sidebar */}
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* Symptoms card */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertCircle size={16} className="text-amber-500" />
                </div>
                <h2 className="section-title !mb-0">Triệu chứng ban đầu</h2>
              </div>
              <p className="leading-7 text-slate-600 text-sm">
                {detail.symptoms}. Không ghi nhận khó thở nghiêm trọng trong quá trình sàng lọc ban đầu.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone={levelTone(currentCase.level)}>{currentCase.level}</Badge>
                <Badge>Sốt</Badge>
                <Badge>Ho khan</Badge>
              </div>
            </Card>

            {/* Consultation conclusion */}
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Clock size={16} className="text-teal-600" />
                </div>
                <h2 className="section-title !mb-0">Kết luận tư vấn</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                    <Calendar size={12} /> Thời gian
                  </p>
                  <p className="font-semibold text-slate-700 text-sm">{detail.time}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                    <Star size={12} /> Đánh giá
                  </p>
                  <Stars value={detail.rating} />
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">Chẩn đoán</p>
                <p className="text-sm leading-7 text-slate-600">{detail.diagnosis}</p>
              </div>
            </Card>

            {/* Feedback */}
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MessageSquare size={16} className="text-blue-500" />
                </div>
                <h2 className="section-title !mb-0">Phản hồi bệnh nhân</h2>
              </div>
              {detail.feedback.length ? (
                <div className="space-y-4">
                  {detail.feedback.map((item) => (
                    <div className="feedback-comment" key={`${item.author}-${item.time}`}>
                      <Avatar>{item.author.split(' ').slice(-2).map((p) => p[0]).join('')}</Avatar>
                      <div>
                        <p><b>{item.author}</b><span>{item.time}</span></p>
                        <div>{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <MessageSquare size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">Chưa có phản hồi cho ca tư vấn này.</p>
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex flex-col gap-6">

            {/* Patient info card */}
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <User size={16} className="text-violet-500" />
                </div>
                <h2 className="section-title !mb-0">Thông tin bệnh nhân</h2>
              </div>

              {/* Patient identity */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
                <Avatar>{detail.initials}</Avatar>
                <div>
                  <p className="font-bold text-slate-800">{detail.patient}</p>
                  <p className="text-xs text-teal-600 font-mono">{detail.code}</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                <InfoRow label="Tuổi" value={`${currentCase.age} tuổi`} />
                <InfoRow label="Giới tính" value={currentCase.gender} />
                <InfoRow label="Số điện thoại" value={currentCase.phone} icon={<Phone size={13} />} />
                <div className="info-box">
                  <small>Trạng thái</small>
                  <Badge tone={statusColor[currentCase.status] || 'neutral'}>{currentCase.status}</Badge>
                </div>
              </div>
            </Card>

            {/* Quick action */}
            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-100">
              <h3 className="font-bold text-teal-700 mb-3 text-sm">Thao tác nhanh</h3>
              <div className="grid gap-2">
                <Link to="/doctor/consult">
                  <Button className="w-full">Vào phòng tư vấn</Button>
                </Link>
                {/* <button className="mini-btn w-full text-center">Xem lịch sử ca bệnh</button> */}
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Floating call control bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            background: 'rgba(30,35,45,0.92)',
            backdropFilter: 'blur(16px)',
            borderRadius: '999px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
          }}
        >
          {/* Search */}
          <CallBtn
            icon={<Search size={20} />}
            label="Tìm kiếm"
            onClick={() => { }}
          />

          {/* Mic toggle */}
          <CallBtn
            icon={micOn ? <Mic size={20} /> : <MicOff size={20} />}
            label={micOn ? 'Tắt mic' : 'Bật mic'}
            active={!micOn}
            onClick={() => setMicOn(v => !v)}
          />

          {/* End call - red */}
          <CallBtn
            icon={inCall ? <PhoneOff size={20} /> : <Phone size={20} />}
            label={inCall ? 'Kết thúc' : 'Gọi'}
            danger
            onClick={() => setInCall(v => !v)}
          />

          {/* Camera toggle */}
          <CallBtn
            icon={camOn ? <Video size={20} /> : <VideoOff size={20} />}
            label={camOn ? 'Tắt camera' : 'Bật camera'}
            active={!camOn}
            onClick={() => setCamOn(v => !v)}
          />

          {/* Screen share */}
          <CallBtn
            icon={<MonitorUp size={20} />}
            label="Chia sẻ màn hình"
            active={screenOn}
            onClick={() => setScreenOn(v => !v)}
          />
        </div>
      </div>
    </AppShell>
  )
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="info-box">
      <small>{label}</small>
      <b className="flex items-center gap-1">{icon}{value}</b>
    </div>
  )
}

function Stars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? 'text-amber-400' : 'text-slate-200'}>
          <Star size={15} fill="currentColor" />
        </span>
      ))}
      {value > 0 && <span className="text-sm font-bold text-slate-600 ml-1">{value}/5</span>}
    </div>
  )
}

function levelTone(level) {
  if (level === 'Cao') return 'red'
  if (level === 'Thấp') return 'green'
  return 'yellow'
}
