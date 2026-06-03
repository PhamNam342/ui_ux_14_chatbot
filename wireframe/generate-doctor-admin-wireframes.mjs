import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const W = 1440
const H = 1024
const browserTop = 92
const sideW = 232
const contentX = 276
const contentW = 1108

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])
const rect = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 6}" fill="${o.fill ?? '#fff'}" stroke="${o.stroke ?? '#444'}" stroke-width="${o.sw ?? 2}"/>`
const line = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke ?? '#444'}" stroke-width="${o.sw ?? 2}" stroke-linecap="round"/>`
const circle = (cx, cy, r, o = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill ?? '#fff'}" stroke="${o.stroke ?? '#444'}" stroke-width="${o.sw ?? 2}"/>`
const text = (x, y, value, o = {}) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${o.size ?? 14}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? '#333'}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}>${esc(value)}</text>`
const button = (x, y, w, label, o = {}) => `${rect(x, y, w, o.h ?? 36, { r: 7, fill: o.fill ?? '#e8e8e8', stroke: '#555' })}${text(x + w / 2, y + (o.h ?? 36) / 2 + 5, label, { size: o.size ?? 13, weight: 700, anchor: 'middle' })}`
const input = (x, y, w, label, o = {}) => `${rect(x, y, w, o.h ?? 36, { r: 15, fill: '#fff', stroke: '#666' })}${text(x + 16, y + (o.h ?? 36) / 2 + 5, label, { size: 13, fill: '#777' })}`
const card = (x, y, w, h, title = '') => `${rect(x, y, w, h, { r: 8, fill: '#fff', stroke: '#555' })}${title ? text(x + 18, y + 30, title, { size: 17, weight: 700 }) : ''}`
const xBox = (x, y, w, h) => `${rect(x, y, w, h, { r: 0, fill: '#fff', stroke: '#444' })}${line(x + 6, y + 6, x + w - 6, y + h - 6)}${line(x + w - 6, y + 6, x + 6, y + h - 6)}`
const bars = (x, y, widths = [160, 120, 80]) => widths.map((w, i) => rect(x, y + i * 16, w, 8, { r: 1, fill: '#888', stroke: '#888', sw: 1 })).join('')
const pill = (x, y, label, w = 96) => `${rect(x, y, w, 26, { r: 13, fill: '#eee', stroke: '#666' })}${text(x + w / 2, y + 18, label, { size: 12, weight: 700, anchor: 'middle' })}`
const table = (x, y, w, rows, cols = [190, 240, 180, 180, 140]) => {
  const rowH = 54
  let out = rect(x, y, w, rowH * (rows + 1), { r: 5, fill: '#fff', stroke: '#555' })
  let cx = x
  cols.forEach((cw, i) => {
    out += text(cx + 14, y + 33, ['Tên', 'Thông tin', 'Trạng thái', 'Thời gian', 'Thao tác'][i] ?? 'Cột', { size: 12, weight: 700, fill: '#555' })
    if (i > 0) out += line(cx, y, cx, y + rowH * (rows + 1), { stroke: '#bbb', sw: 1 })
    cx += cw
  })
  for (let r = 1; r <= rows; r += 1) {
    const yy = y + r * rowH
    out += line(x, yy, x + w, yy, { stroke: '#ccc', sw: 1 })
    out += bars(x + 14, yy + 18, [120, 80])
    out += bars(x + cols[0] + 14, yy + 18, [180, 120])
    out += pill(x + cols[0] + cols[1] + 14, yy + 14, r % 2 ? 'Cao' : 'Ổn', 72)
    out += bars(x + cols[0] + cols[1] + cols[2] + 14, yy + 18, [90])
    out += button(x + w - 110, yy + 10, 82, 'Chi tiết', { h: 32 })
  }
  return out
}

function browserChrome(title, url) {
  return `${rect(16, 14, W - 32, H - 28, { r: 0, fill: '#fff', stroke: '#333', sw: 3 })}
  ${rect(22, 20, W - 44, 36, { r: 0, fill: '#cfcfcf', stroke: '#444' })}
  ${text(W / 2, 44, title, { size: 18, weight: 700, anchor: 'middle', fill: '#444' })}
  ${line(W - 54, 28, W - 34, 48, { sw: 3 })}${line(W - 34, 28, W - 54, 48, { sw: 3 })}
  ${rect(22, 60, W - 44, 56, { r: 0, fill: '#f4f4f4', stroke: '#444' })}
  ${button(34, 70, 48, '‹', { h: 36, size: 24 })}${button(86, 70, 48, '›', { h: 36, size: 24 })}${button(140, 70, 50, '↻', { h: 36, size: 20 })}
  ${input(204, 70, W - 244, url, { h: 36 })}`
}

function shell(role, active, navItems, content, title, url) {
  const nav = navItems.map((item, i) => {
    const y = 198 + i * 54
    return `${item === active ? rect(54, y - 30, 166, 40, { r: 6, fill: '#e5e5e5', stroke: '#555' }) : ''}${circle(76, y - 10, 9, { fill: item === active ? '#888' : '#fff' })}${text(96, y - 5, item, { size: 13, weight: item === active ? 700 : 400 })}`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <title>${esc(title)}</title>
  <rect width="${W}" height="${H}" fill="#f6f6f6"/>
  ${browserChrome(title, url)}
  ${rect(36, browserTop + 36, sideW, H - browserTop - 62, { r: 0, fill: '#e9e9e9', stroke: '#444' })}
  ${xBox(70, browserTop + 62, 150, 58)}
  ${text(70, browserTop + 146, role.toUpperCase(), { size: 13, weight: 700, fill: '#555' })}
  ${nav}
  ${text(58, 846, 'Ghi chú', { size: 16, weight: 700 })}${bars(58, 870, [160, 120, 148, 130])}
  ${rect(288, browserTop + 36, 1116, H - browserTop - 62, { r: 0, fill: '#fff', stroke: '#444' })}
  ${content}
  </svg>`
}

const doctorNav = ['Dashboard', 'Tư vấn', 'Lịch khám', 'Bệnh nhân', 'Hồ sơ khám']
const adminNav = ['Cơ sở', 'Bác sĩ', 'Ca khám', 'Bảng giá', 'Doanh thu', 'Chất lượng']

function doctorDashboard() {
  let c = `${input(contentX + 20, 148, 420, 'search patient / appointment...')}${button(1188, 148, 90, 'Noti.')}${button(1290, 148, 90, 'Sett.')}`
  c += `${text(contentX + 20, 220, 'Hôm nay tôi cần làm gì?', { size: 24, weight: 700 })}`
  ;['Ca đang chờ', 'Lịch hôm nay', 'Tư vấn online', 'Hồ sơ cần xem'].forEach((label, i) => {
    c += `${card(contentX + 20 + i * 260, 246, 238, 108)}${text(contentX + 40 + i * 260, 284, label, { size: 13, weight: 700 })}${text(contentX + 40 + i * 260, 326, ['7', '4', '3', '12'][i], { size: 30, weight: 700 })}`
  })
  c += card(contentX + 20, 386, 620, 438, 'Danh sách bệnh nhân đang chờ')
  c += table(contentX + 40, 442, 580, 5, [150, 170, 90, 90, 80])
  c += card(contentX + 676, 386, 390, 438, 'Lịch hẹn tiếp theo trong ngày')
  ;['08:00 - 08:30', '10:30 - 11:00', '14:00 - 14:30', '16:00 - 16:30'].forEach((time, i) => {
    c += `${line(contentX + 708, 448 + i * 82, contentX + 708, 510 + i * 82, { stroke: '#bbb' })}${circle(contentX + 708, 448 + i * 82, 8, { fill: '#888' })}${rect(contentX + 738, 426 + i * 82, 298, 64, { r: 6, fill: '#f7f7f7', stroke: '#aaa' })}${text(contentX + 754, 452 + i * 82, time, { size: 14, weight: 700 })}${bars(contentX + 754, 466 + i * 82, [160, 96])}`
  })
  return shell('Doctor', 'Dashboard', doctorNav, c, 'Doctor - Dashboard', 'https://medconsult.vn/doctor')
}

function doctorPatients() {
  let c = `${text(contentX + 20, 154, 'Bệnh nhân', { size: 24, weight: 700 })}${input(contentX + 20, 194, 540, 'Tìm theo tên, SĐT, mã ca...')}${input(contentX + 588, 194, 160, 'Mức độ')}${input(contentX + 770, 194, 180, 'Sắp xếp')}${button(contentX + 968, 194, 88, 'Reset')}`
  c += table(contentX + 20, 260, 1040, 8, [200, 260, 170, 190, 220])
  c += `${rect(1010, 260, 350, 486, { r: 8, fill: '#f7f7f7', stroke: '#666' })}${text(1032, 300, 'Panel hồ sơ bệnh nhân', { size: 18, weight: 700 })}${circle(1060, 350, 34, { fill: '#e5e5e5' })}${bars(1110, 334, [170, 118])}${button(1032, 400, 128, 'Vào tư vấn')}${button(1174, 400, 142, 'Hồ sơ khám')}${text(1032, 474, 'Thông tin cá nhân', { size: 15, weight: 700 })}${bars(1032, 500, [280, 220, 250, 190])}${text(1032, 604, 'Lịch sử khám', { size: 15, weight: 700 })}${bars(1032, 630, [280, 240, 200])}`
  return shell('Doctor', 'Bệnh nhân', doctorNav, c, 'Doctor - Patients', 'https://medconsult.vn/doctor/patients?patient=Tran%20Thi%20Mai')
}

function doctorSchedule() {
  let c = `${text(contentX + 20, 154, 'Lịch hẹn khám bệnh', { size: 24, weight: 700 })}${button(1114, 136, 78, 'Ngày')}${button(1204, 136, 78, 'Tuần')}${button(1294, 136, 78, 'Tháng')}`
  c += `${rect(contentX + 20, 202, 1060, 82, { r: 8, fill: '#f7f7f7', stroke: '#666' })}${button(contentX + 42, 224, 44, '‹')}${button(contentX + 102, 224, 240, 'Thứ Tư, 3/6/2026')}${button(contentX + 358, 224, 44, '›')}${button(1252, 224, 96, 'Hôm nay')}`
  c += card(contentX + 20, 316, 1060, 520, 'Danh sách lịch hẹn trong ngày')
  ;['08:00 - 08:30', '10:30 - 11:00', '14:00 - 14:30', '16:00 - 16:30'].forEach((time, i) => {
    const y = 372 + i * 96
    c += `${text(contentX + 60, y + 28, time, { size: 15, weight: 700 })}${bars(contentX + 220, y + 14, [210, 280])}${pill(contentX + 760, y + 12, i === 1 ? 'Ưu tiên: Cao' : 'Ưu tiên: TB', 132)}${button(contentX + 920, y + 6, 96, 'Chi tiết')}${line(contentX + 40, y + 72, contentX + 1040, y + 72, { stroke: '#ddd' })}`
  })
  return shell('Doctor', 'Lịch khám', doctorNav, c, 'Doctor - Schedule', 'https://medconsult.vn/doctor/schedule')
}

function doctorConsult() {
  let c = `${text(contentX + 20, 154, 'Phòng tư vấn trực tuyến', { size: 24, weight: 700 })}${button(1210, 136, 150, 'Kết thúc ca')}`
  c += `${rect(contentX + 20, 194, 680, 510, { r: 8, fill: '#f7f7f7', stroke: '#555' })}${text(contentX + 300, 450, 'VIDEO / CHAT AREA', { size: 24, weight: 700, fill: '#777', anchor: 'middle' })}${xBox(contentX + 530, 530, 132, 100)}`
  c += card(contentX + 724, 194, 356, 510, 'Thông tin bệnh nhân')
  c += `${circle(contentX + 758, 252, 28, { fill: '#e5e5e5' })}${bars(contentX + 802, 232, [180, 124])}${text(contentX + 744, 328, 'Tóm tắt chatbot', { size: 15, weight: 700 })}${bars(contentX + 744, 352, [290, 250, 260, 180])}${text(contentX + 744, 460, 'Chỉ định nhanh', { size: 15, weight: 700 })}${button(contentX + 744, 488, 112, 'Kê đơn')}${button(contentX + 868, 488, 132, 'Tái khám')}${button(contentX + 744, 540, 158, 'Lưu ghi chú')}`
  c += `${rect(contentX + 20, 730, 1060, 92, { r: 8, fill: '#fff', stroke: '#555' })}${input(contentX + 40, 752, 820, 'Nhập ghi chú / tin nhắn...')}${button(contentX + 884, 752, 86, 'Gửi')}${button(contentX + 984, 752, 74, 'File')}`
  return shell('Doctor', 'Tư vấn', doctorNav, c, 'Doctor - Consultation', 'https://medconsult.vn/doctor/consult')
}

function adminClinics() {
  let c = `${text(contentX + 20, 154, 'Quản lý các phòng khám', { size: 24, weight: 700 })}${button(1208, 136, 150, '+ Thêm cơ sở')}`
  c += `${input(contentX + 20, 194, 420, 'Tìm cơ sở...')}${input(contentX + 464, 194, 180, 'Trạng thái')}${input(contentX + 668, 194, 180, 'Khu vực')}${button(contentX + 870, 194, 90, 'Lọc')}${button(contentX + 972, 194, 90, 'Reset')}`
  ;['Tổng cơ sở', 'Đang hoạt động', 'Bác sĩ', 'Ca hôm nay'].forEach((label, i) => {
    c += `${card(contentX + 20 + i * 260, 252, 238, 98)}${text(contentX + 40 + i * 260, 286, label, { size: 13, weight: 700 })}${text(contentX + 40 + i * 260, 326, ['12', '10', '48', '126'][i], { size: 28, weight: 700 })}`
  })
  c += table(contentX + 20, 386, 1040, 7, [220, 280, 160, 180, 200])
  return shell('Admin', 'Cơ sở', adminNav, c, 'Admin - Facilities', 'https://medconsult.vn/admin')
}

function adminDoctors() {
  let c = `${text(contentX + 20, 154, 'Quản lý bác sĩ', { size: 24, weight: 700 })}${button(1210, 136, 150, '+ Thêm bác sĩ')}`
  c += `${input(contentX + 20, 194, 360, 'Tên / email / số điện thoại')}${input(contentX + 400, 194, 190, 'Chuyên khoa')}${input(contentX + 612, 194, 220, 'Cơ sở')}${input(contentX + 854, 194, 170, 'Trạng thái')}${button(1044, 194, 96, 'Reset')}`
  c += table(contentX + 20, 260, 1040, 8, [220, 220, 210, 160, 230])
  c += `${rect(1012, 300, 348, 420, { r: 8, fill: '#f7f7f7', stroke: '#666' })}${text(1034, 340, 'Drawer hồ sơ bác sĩ', { size: 18, weight: 700 })}${circle(1070, 392, 34, { fill: '#e5e5e5' })}${bars(1120, 374, [160, 110])}${button(1034, 450, 128, 'Chỉnh sửa')}${button(1176, 450, 142, 'Phân lịch')}${bars(1034, 520, [280, 220, 250, 190, 240])}`
  return shell('Admin', 'Bác sĩ', adminNav, c, 'Admin - Doctors', 'https://medconsult.vn/admin/doctors')
}

function adminPricing() {
  let c = `${text(contentX + 20, 154, 'Bảng giá riêng theo cơ sở', { size: 24, weight: 700 })}`
  c += `${rect(contentX + 20, 190, 1040, 112, { r: 8, fill: '#f7f7f7', stroke: '#666' })}${text(contentX + 42, 226, 'Đang xem bảng giá tại: Phòng khám Đa khoa Tâm An', { size: 18, weight: 700 })}${bars(contentX + 42, 252, [300])}${pill(contentX + 612, 222, 'Tổng dịch vụ: 5', 140)}${pill(contentX + 768, 222, 'Giá TB', 94)}${pill(contentX + 878, 222, 'Đang áp dụng', 130)}`
  c += `${input(contentX + 20, 330, 260, 'Cơ sở y tế')}${input(contentX + 300, 330, 190, 'Chuyên khoa')}${input(contentX + 510, 330, 160, 'Trạng thái')}${input(contentX + 690, 330, 230, 'Tìm kiếm dịch vụ')}${button(contentX + 940, 330, 82, 'Áp dụng')}${button(contentX + 1034, 330, 76, 'Bỏ lọc')}`
  c += table(contentX + 20, 400, 1040, 7, [150, 300, 150, 140, 300])
  return shell('Admin', 'Bảng giá', adminNav, c, 'Admin - Pricing', 'https://medconsult.vn/admin/service-pricing')
}

function adminRevenue() {
  let c = `${text(contentX + 20, 154, 'Báo cáo doanh thu', { size: 24, weight: 700 })}${button(1196, 136, 164, 'Xuất báo cáo')}`
  ;['Tổng doanh thu', 'Số lượt khám', 'Giá trị TB', 'Bệnh nhân mới'].forEach((label, i) => {
    c += `${card(contentX + 20 + i * 260, 194, 238, 92)}${text(contentX + 40 + i * 260, 226, label, { size: 13, weight: 700 })}${text(contentX + 40 + i * 260, 264, ['1.284 tỷ', '3,450', '372k', '412'][i], { size: 26, weight: 700 })}`
  })
  c += card(contentX + 20, 326, 620, 340, 'Doanh thu theo thời gian')
  c += `${button(contentX + 390, 356, 120, 'Tất cả cơ sở')}${[120, 160, 190, 220, 250, 270].map((h, i) => rect(contentX + 72 + i * 82, 626 - h, 34, h, { r: 6, fill: '#cfcfcf', stroke: '#888' })).join('')}${['T1/2025', 'T2/2025', 'T3/2025', 'T4/2025', 'T5/2025', 'T6/2025'].map((m, i) => text(contentX + 88 + i * 82, 644, m, { size: 10, anchor: 'middle' })).join('')}`
  c += card(contentX + 670, 326, 390, 340, 'Xu hướng tăng trưởng')
  c += `<polyline points="${contentX + 710},590 ${contentX + 770},560 ${contentX + 830},546 ${contentX + 890},520 ${contentX + 950},490 ${contentX + 1010},474" fill="none" stroke="#555" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map((i) => circle(contentX + 710 + i * 60, [590, 560, 546, 520, 490, 474][i], 7, { fill: '#fff' })).join('')}`
  c += card(contentX + 20, 700, 1040, 150, 'Doanh thu theo chuyên khoa') + bars(contentX + 50, 750, [920, 760, 640, 420])
  return shell('Admin', 'Doanh thu', adminNav, c, 'Admin - Revenue', 'https://medconsult.vn/admin/revenue')
}

function adminSchedule() {
  let c = `${text(contentX + 20, 154, 'Quản lý ca khám', { size: 24, weight: 700 })}${button(1210, 136, 150, '+ Tạo ca khám')}`
  c += `${input(contentX + 20, 194, 190, 'Ngày')}${input(contentX + 230, 194, 220, 'Cơ sở')}${input(contentX + 470, 194, 180, 'Bác sĩ')}${input(contentX + 670, 194, 170, 'Trạng thái')}${input(contentX + 860, 194, 220, 'Tìm bệnh nhân')}`
  c += table(contentX + 20, 260, 1040, 9, [200, 240, 180, 180, 240])
  return shell('Admin', 'Ca khám', adminNav, c, 'Admin - Schedule', 'https://medconsult.vn/admin/schedule')
}

const outputs = [
  ['doctor/01-dashboard.svg', doctorDashboard()],
  ['doctor/02-patients.svg', doctorPatients()],
  ['doctor/03-schedule.svg', doctorSchedule()],
  ['doctor/04-consultation.svg', doctorConsult()],
  ['admin/01-facilities.svg', adminClinics()],
  ['admin/02-doctors.svg', adminDoctors()],
  ['admin/03-schedule.svg', adminSchedule()],
  ['admin/04-pricing.svg', adminPricing()],
  ['admin/05-revenue.svg', adminRevenue()],
]

for (const [file, svg] of outputs) {
  const path = join('wireframe', file)
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, svg)
}

console.log(`Generated ${outputs.length} doctor/admin wireframes.`)
