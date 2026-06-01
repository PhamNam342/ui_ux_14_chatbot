import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  MapPin,
  Search,
  Star,
  Stethoscope,
  Users,
} from 'lucide-react'
import { AppShell, Button, Card, TopBar } from '../../components/ui.jsx'
import { adminClinics, adminDoctors } from './adminDoctorsData.js'

const mockAppointments = [
  { id: 'LK-260601-001', date: '2026-06-01', time: '08:00', endTime: '08:45', patient: 'Trần Thị Mai', initials: 'TM', phone: '0901 234 567', doctor: 'BS. Nguyễn Văn Minh', spec: 'Nội tổng quát', clinic: 'Phòng khám Đa khoa Tâm An', room: 'Phòng 102', type: 'Khám trực tiếp', status: 'Đang khám', payment: 'Đã thanh toán', reason: 'Sốt và ho kéo dài' },
  { id: 'LK-260601-002', date: '2026-06-01', time: '09:30', endTime: '10:00', patient: 'Lê Văn Hùng', initials: 'LH', phone: '0908 222 118', doctor: 'BS. Trần Thị Hoa', spec: 'Tim mạch', clinic: 'Phòng khám Tim mạch An Bình', room: 'Phòng 201', type: 'Tái khám', status: 'Chờ xác nhận', payment: 'Chờ thanh toán', reason: 'Tái khám huyết áp' },
  { id: 'LK-260601-003', date: '2026-06-01', time: '10:15', endTime: '11:00', patient: 'Phạm Quang Minh', initials: 'PM', phone: '0917 445 882', doctor: 'BS. Lê Hoàng Anh', spec: 'Răng Hàm Mặt', clinic: 'MedCare Family Clinic', room: 'Phòng 305', type: 'Khám trực tiếp', status: 'Đã xác nhận', payment: 'Đã thanh toán', reason: 'Đau răng hàm' },
  { id: 'LK-260601-004', date: '2026-06-01', time: '14:00', endTime: '14:30', patient: 'Nguyễn Thị Lan', initials: 'NL', phone: '0934 118 965', doctor: 'BS. Phạm Minh Tuấn', spec: 'Chỉnh hình', clinic: 'Phòng khám Đa khoa Tâm An', room: 'Phòng 108', type: 'Tư vấn online', status: 'Đã hủy', payment: 'Hoàn tiền', reason: 'Đau vai gáy' },
  { id: 'LK-260601-005', date: '2026-06-01', time: '15:30', endTime: '16:00', patient: 'Đỗ Minh Anh', initials: 'ĐA', phone: '0987 611 220', doctor: 'BS. Nguyễn Văn Minh', spec: 'Nội tổng quát', clinic: 'Phòng khám Đa khoa Tâm An', room: 'Phòng 102', type: 'Khám trực tiếp', status: 'Hoàn thành', payment: 'Đã thanh toán', reason: 'Khám sức khỏe định kỳ' },
  { id: 'LK-260602-006', date: '2026-06-02', time: '08:30', endTime: '09:00', patient: 'Vũ Hải Nam', initials: 'VN', phone: '0935 221 898', doctor: 'BS. Trần Thị Hoa', spec: 'Tim mạch', clinic: 'Phòng khám Tim mạch An Bình', room: 'Phòng 201', type: 'Khám trực tiếp', status: 'Đã xác nhận', payment: 'Đã thanh toán', reason: 'Theo dõi tim mạch' },
]

function statusClass(status) {
  return `is-${status.toLowerCase().replaceAll(' ', '-')}`
}

export function AdminDoctorSchedule() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = adminDoctors.find((item) => item.id === id) || adminDoctors[0]

  const [date, setDate] = useState('2026-06-01')
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái')
  const [query, setQuery] = useState('')

  const appointments = useMemo(() => {
    return mockAppointments.filter(
      (item) => item.doctor === `BS. ${doctor.name}`
    )
  }, [doctor])

  const filteredAppointments = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return appointments.filter((item) => (
      (!date || item.date === date)
      && (statusFilter === 'Tất cả trạng thái' || item.status === statusFilter)
      && (!normalized || `${item.patient} ${item.id}`.toLowerCase().includes(normalized))
    ))
  }, [appointments, date, statusFilter, query])

  return (
    <AppShell role="admin">
      <TopBar title="Quản trị hệ thống" subtitle="Lịch khám bác sĩ" />
      <main className="content-wide admin-clinic-page admin-schedule-page">
        <button className="admin-doctor-back" type="button" onClick={() => navigate('/admin/doctors')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', fontSize: '14px', fontWeight: '800', marginBottom: '20px', cursor: 'pointer' }}><ArrowLeft size={17} /> Quay lại danh sách</button>

        <section className="admin-clinic-page-head" style={{ marginBottom: '22px' }}>
          <div>
            <p className="admin-clinic-breadcrumb">Admin <span>/</span> Quản lý bác sĩ <span>/</span> Lịch khám</p>
            <h1 style={{ whiteSpace: 'nowrap' }}>Lịch khám chi tiết: BS. {doctor.name}</h1>
            <p>Điều phối lịch hẹn khám bệnh trực tiếp và trực tuyến của bác sĩ.</p>
          </div>
          <div className="admin-doctor-person" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '12px' }}>
            <span className={`admin-doctor-avatar is-${doctor.color}`} style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: '800', background: '#ecfdf5', color: '#0f766e', fontSize: '16px' }}>{doctor.initials}</span>
            <div style={{ marginLeft: '12px' }}>
              <b style={{ fontSize: '15px', color: '#1e293b' }}>BS. {doctor.name}</b>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{doctor.spec} · {doctor.clinic}</p>
            </div>
          </div>
        </section>

        <section className="admin-schedule-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '22px' }}>
          <article className="admin-schedule-kpi is-teal" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
            <span className="admin-clinic-kpi-icon" style={{ display: 'inline-flex', height: '42px', width: '42px', placeItems: 'center', borderRadius: '12px', background: '#ecfdf5', color: '#0f766e', justifyContent: 'center' }}><CalendarDays size={20} /></span>
            <p style={{ margin: '10px 0 5px', fontSize: '13px', color: '#64748b' }}>Tổng ca khám</p>
            <strong style={{ fontSize: '24px', fontWeight: '950', color: '#0f766e' }}>{appointments.length} ca</strong>
          </article>
          <article className="admin-schedule-kpi is-blue" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
            <span className="admin-clinic-kpi-icon" style={{ display: 'inline-flex', height: '42px', width: '42px', placeItems: 'center', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8', justifyContent: 'center' }}><CheckCircle2 size={20} /></span>
            <p style={{ margin: '10px 0 5px', fontSize: '13px', color: '#64748b' }}>Đã xác nhận</p>
            <strong style={{ fontSize: '24px', fontWeight: '950', color: '#1d4ed8' }}>{appointments.filter(item => item.status === 'Đã xác nhận' || item.status === 'Đang khám' || item.status === 'Hoàn thành').length} ca</strong>
          </article>
          <article className="admin-schedule-kpi is-violet" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
            <span className="admin-clinic-kpi-icon" style={{ display: 'inline-flex', height: '42px', width: '42px', placeItems: 'center', borderRadius: '12px', background: '#faf5ff', color: '#7e22ce', justifyContent: 'center' }}><Star size={20} /></span>
            <p style={{ margin: '10px 0 5px', fontSize: '13px', color: '#64748b' }}>Đánh giá trung bình</p>
            <strong style={{ fontSize: '24px', fontWeight: '950', color: '#7e22ce' }}>{doctor.rating} ★</strong>
          </article>
        </section>

        <section className="admin-schedule-toolbar is-open" style={{ padding: '18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '22px' }}>
          <div className="admin-schedule-filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}><span style={{ fontSize: '11px', fontWeight: '900', color: '#64748b' }}>Chọn ngày</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '9px', fontSize: '13px' }} /></label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}><span style={{ fontSize: '11px', fontWeight: '900', color: '#64748b' }}>Trạng thái</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '9px', fontSize: '13px' }}>
              {['Tất cả trạng thái', 'Chờ xác nhận', 'Đã xác nhận', 'Đang khám', 'Hoàn thành', 'Đã hủy'].map((item) => <option key={item}>{item}</option>)}
            </select></label>
            <label className="admin-schedule-search" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}><span style={{ fontSize: '11px', fontWeight: '900', color: '#64748b' }}>Tìm kiếm</span><div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}><Search size={17} style={{ position: 'absolute', left: '14px', color: '#94a3b8' }} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bệnh nhân / mã lịch khám" style={{ padding: '10px 14px 10px 40px', border: '1px solid #cbd5e1', borderRadius: '9px', fontSize: '13px', width: '100%' }} /></div></label>
          </div>
        </section>

        {filteredAppointments.length === 0 ? (
          <section className="admin-doctor-empty" style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed #cbd5e1', borderRadius: '16px', background: '#f8fafc' }}>
            <CalendarDays size={42} style={{ color: '#94a3b8', marginBottom: '14px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1e293b' }}>Không tìm thấy lịch khám</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '6px 0 0' }}>Bác sĩ chưa có ca hẹn nào phù hợp với bộ lọc đã chọn.</p>
          </section>
        ) : (
          <section className="admin-schedule-table-wrap" style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '14px 18px', fontWeight: '800' }}>Thời gian</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800' }}>Bệnh nhân</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800' }}>Cơ sở / Phòng</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800' }}>Loại khám</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800' }}>Trạng thái</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800' }}>Thanh toán</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800' }}>Lý do khám</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px' }}><b style={{ color: '#0f766e' }}>{item.time}</b><br /><small style={{ color: '#64748b' }}>{formatDate(item.date)}</small></td>
                    <td style={{ padding: '14px 18px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ display: 'flex', width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', fontWeight: '800', color: '#475569', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }}>{item.initials}</span><div><b>{item.patient}</b><br /><small style={{ color: '#64748b' }}>{item.id}</small></div></div></td>
                    <td style={{ padding: '14px 18px' }}><b>{item.clinic}</b><br /><small style={{ color: '#64748b' }}>{item.room}</small></td>
                    <td style={{ padding: '14px 18px' }}><span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', background: item.type === 'Tư vấn online' ? '#e0f2fe' : '#f0fdf4', color: item.type === 'Tư vấn online' ? '#0369a1' : '#15803d' }}>{item.type}</span></td>
                    <td style={{ padding: '14px 18px' }}><span className={`admin-schedule-status ${statusClass(item.status)}`}>{item.status}</span></td>
                    <td style={{ padding: '14px 18px' }}><span style={{ fontWeight: '800', color: '#475569' }}>{item.payment}</span></td>
                    <td style={{ padding: '14px 18px', color: '#64748b' }}>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </AppShell>
  )
}

function formatDate(dateISO) {
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString('vi-VN')
}
