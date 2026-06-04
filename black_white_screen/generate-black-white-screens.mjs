import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = dirname(fileURLToPath(import.meta.url))
mkdirSync(outDir, { recursive: true })
const patientDir = join(outDir, 'patient')
const doctorDir = join(outDir, 'doctor')
const adminDir = join(outDir, 'admin')
mkdirSync(patientDir, { recursive: true })
mkdirSync(doctorDir, { recursive: true })
mkdirSync(adminDir, { recursive: true })

const W = 1440
const H = 1024
const sidebarW = 248
const topbarH = 72
const mainX = 288
const mainY = 104
const mainW = 1096

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])
const rect = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 0}" fill="${o.fill ?? '#fff'}" stroke="${o.stroke ?? '#111'}" stroke-width="${o.sw ?? 2}"/>`
const line = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke ?? '#111'}" stroke-width="${o.sw ?? 2}" stroke-linecap="round"/>`
const circle = (cx, cy, r, o = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill ?? '#fff'}" stroke="${o.stroke ?? '#111'}" stroke-width="${o.sw ?? 2}"/>`
const text = (x, y, value, o = {}) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${o.size ?? 14}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? '#111'}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}>${esc(value)}</text>`
const xBox = (x, y, w, h) => `${rect(x, y, w, h)}${line(x + 8, y + 8, x + w - 8, y + h - 8)}${line(x + w - 8, y + 8, x + 8, y + h - 8)}`
const bars = (x, y, widths = [160, 120, 80], gap = 14) => widths.map((w, i) => rect(x, y + i * gap, w, 8, { fill: '#111', sw: 0 })).join('')
const button = (x, y, w, label) => `${rect(x, y, w, 36, { r: 6, fill: '#fff' })}${text(x + w / 2, y + 23, label, { size: 12, weight: 700, anchor: 'middle' })}`
const input = (x, y, w, label) => `${rect(x, y, w, 42, { r: 6, fill: '#fff' })}${text(x + 14, y + 27, label, { size: 12, fill: '#555' })}`
const card = (x, y, w, h, title = '') => `${rect(x, y, w, h, { r: 10, fill: '#fff' })}${title ? text(x + 18, y + 30, title, { size: 16, weight: 700 }) : ''}`
const pill = (x, y, w, label) => `${rect(x, y, w, 28, { r: 14, fill: '#fff' })}${text(x + w / 2, y + 19, label, { size: 11, weight: 700, anchor: 'middle' })}`

function table(x, y, w, h, rows = 5) {
  const rowH = Math.floor((h - 44) / rows)
  let out = rect(x, y, w, h, { r: 8 })
  out += rect(x, y, w, 44, { r: 8, fill: '#f7f7f7' })
  out += text(x + 18, y + 28, 'Table header', { size: 12, weight: 700 })
  for (let i = 0; i < rows; i += 1) {
    const yy = y + 44 + i * rowH
    out += line(x, yy, x + w, yy, { stroke: '#999', sw: 1 })
    out += circle(x + 28, yy + rowH / 2, 12)
    out += bars(x + 54, yy + 20, [160, 110], 15)
    out += bars(x + 280, yy + 20, [200, 140], 15)
    out += pill(x + w - 210, yy + 18, 86, 'Status')
    out += button(x + w - 110, yy + 14, 82, 'Action')
  }
  return out
}

function shell(role, navItems, content, options = {}) {
  const activeIndex = options.activeIndex ?? 0
  const nav = navItems.map((item, i) => {
    const y = 158 + i * 56
    return `${rect(28, y - 28, 192, 42, { r: 6, fill: i === activeIndex ? '#f1f1f1' : '#fff' })}${circle(52, y - 7, 8)}${text(72, y - 2, item, { size: 13, weight: i === activeIndex ? 700 : 400 })}`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <title>${esc(options.title ?? `${role} black white layout`)}</title>
  <rect width="${W}" height="${H}" fill="#fff"/>
  ${rect(0, 0, sidebarW, H, { r: 0 })}
  ${rect(sidebarW, 0, W - sidebarW, topbarH, { r: 0 })}
  ${xBox(28, 26, 54, 38)}
  ${text(96, 48, 'MedConsult', { size: 18, weight: 700 })}
  ${text(28, 112, role.toUpperCase(), { size: 12, weight: 700 })}
  ${nav}
  ${line(28, 920, 220, 920)}
  ${text(28, 956, 'Logout', { size: 13, weight: 700 })}
  ${input(288, 16, 460, 'Global search...')}
  ${button(1194, 18, 80, 'Noti.')}
  ${circle(1316, 37, 20)}
  ${bars(1348, 25, [62, 42], 14)}
  ${content}
  </svg>`
}

function statCards(labels) {
  return labels.map((label, i) => {
    const x = mainX + i * 274
    return `${card(x, 202, 252, 104)}${circle(x + 32, 242, 18)}${text(x + 64, 236, label, { size: 12, weight: 700 })}${rect(x + 64, 258, 82, 18, { fill: '#111', sw: 0 })}${rect(x + 18, 286, 150, 7, { fill: '#111', sw: 0 })}`
  }).join('')
}

function patientScreen() {
  let c = `${text(mainX, 140, 'Patient Dashboard / Booking Overview', { size: 28, weight: 700 })}${bars(mainX, 164, [420])}`
  c += statCards(['Upcoming', 'Records', 'Invoices', 'Messages'])
  c += card(mainX, 340, 666, 290, 'Appointment / Booking Flow')
  c += ['Clinic', 'Specialty', 'Doctor', 'Schedule', 'Confirm'].map((step, i) => `${circle(mainX + 58 + i * 122, 402, 18)}${text(mainX + 28 + i * 122, 442, step, { size: 11, anchor: 'middle' })}${i < 4 ? line(mainX + 76 + i * 122, 402, mainX + 162 + i * 122, 402, { stroke: '#555' }) : ''}`).join('')
  c += table(mainX + 24, 476, 618, 122, 2)
  c += card(mainX + 706, 340, 390, 290, 'Summary / Medical Snapshot')
  c += xBox(mainX + 734, 390, 132, 90) + bars(mainX + 892, 394, [150, 220, 180])
  c += bars(mainX + 734, 520, [300, 240, 280, 180])
  c += card(mainX, 662, 1096, 250, 'Patient Content Grid')
  c += table(mainX + 24, 714, 512, 160, 3)
  c += xBox(mainX + 574, 714, 222, 160)
  c += table(mainX + 836, 714, 236, 160, 3)
  return shell('Patient', ['Dashboard', 'Chatbot', 'Consultation', 'Booking', 'Services', 'Records'], c)
}

function doctorScreen() {
  let c = `${text(mainX, 140, 'Doctor Workspace', { size: 28, weight: 700 })}${bars(mainX, 164, [360])}`
  c += statCards(['Waiting', 'Today', 'Online', 'Records'])
  c += card(mainX, 340, 620, 350, 'Pending Patients')
  c += table(mainX + 24, 392, 572, 250, 4)
  c += card(mainX + 660, 340, 436, 350, 'Today Schedule')
  ;[0, 1, 2, 3].forEach((i) => {
    const y = 398 + i * 64
    c += circle(mainX + 694, y, 8)
    c += line(mainX + 694, y + 10, mainX + 694, y + 52, { stroke: '#777', sw: 1 })
    c += rect(mainX + 724, y - 22, 330, 48, { r: 8 })
    c += bars(mainX + 742, y - 8, [130, 210], 15)
  })
  c += card(mainX, 724, 1096, 188, 'Patient Detail / Consultation Drawer Layout')
  c += xBox(mainX + 24, 768, 270, 110)
  c += bars(mainX + 330, 774, [240, 300, 220, 180])
  c += button(mainX + 700, 790, 130, 'Start Consult')
  c += button(mainX + 850, 790, 130, 'View Record')
  return shell('Doctor', ['Dashboard', 'Consult', 'Schedule', 'Patients', 'Records'], c)
}

function adminScreen() {
  let c = `${text(mainX, 140, 'Admin Operations', { size: 28, weight: 700 })}${bars(mainX, 164, [320])}`
  c += statCards(['Facilities', 'Doctors', 'Visits', 'Revenue'])
  c += card(mainX, 340, 1096, 116, 'Primary Filters')
  c += input(mainX + 24, 382, 250, 'Facility')
  c += input(mainX + 292, 382, 190, 'Specialty')
  c += input(mainX + 500, 382, 170, 'Status')
  c += input(mainX + 688, 382, 240, 'Search')
  c += button(mainX + 946, 386, 72, 'Apply')
  c += button(mainX + 1030, 386, 56, 'Reset')
  c += card(mainX, 492, 740, 420, 'Main Data Table')
  c += table(mainX + 24, 544, 692, 320, 5)
  c += card(mainX + 772, 492, 324, 420, 'Detail / History Side Panel')
  c += xBox(mainX + 800, 546, 110, 78)
  c += bars(mainX + 936, 552, [120, 170])
  c += line(mainX + 800, 660, mainX + 1068, 660)
  c += bars(mainX + 800, 700, [240, 200, 220, 160])
  c += button(mainX + 800, 836, 118, 'Edit')
  c += button(mainX + 936, 836, 118, 'Save')
  return shell('Admin', ['Facilities', 'Doctors', 'Schedule', 'Pricing', 'Revenue', 'Quality'], c)
}

function header(title, subtitle = '') {
  return `${text(mainX, 134, title, { size: 28, weight: 700 })}${subtitle ? text(mainX, 162, subtitle, { size: 13, fill: '#555' }) : bars(mainX, 162, [360])}`
}

function filterRow(x, y, labels) {
  return labels.map((label, i) => input(x + i * 214, y, i === labels.length - 1 ? 252 : 190, label)).join('')
}

function metricStrip(labels) {
  return labels.map((label, i) => {
    const x = mainX + i * 274
    return `${card(x, 198, 252, 96)}${circle(x + 32, 238, 16)}${text(x + 62, 232, label, { size: 12, weight: 700 })}${rect(x + 62, 254, 74, 18, { fill: '#111', sw: 0 })}`
  }).join('')
}

function doctorDashboardScreen() {
  let c = header('Doctor Dashboard', 'Tổng quan ca khám, lịch làm việc và bệnh nhân cần xử lý.')
  c += metricStrip(['Ca đang chờ', 'Lịch hôm nay', 'Tư vấn online', 'Hồ sơ mới'])
  c += card(mainX, 328, 612, 380, 'Danh sách ca chờ')
  c += table(mainX + 24, 382, 564, 268, 4)
  c += card(mainX + 640, 328, 456, 380, 'Timeline lịch hôm nay')
  ;[0, 1, 2, 3, 4].forEach((i) => {
    const y = 386 + i * 58
    c += circle(mainX + 674, y, 8)
    c += line(mainX + 674, y + 12, mainX + 674, y + 46, { stroke: '#777', sw: 1 })
    c += rect(mainX + 704, y - 20, 340, 44, { r: 8 })
    c += bars(mainX + 722, y - 7, [126, 214], 14)
  })
  c += card(mainX, 742, 1096, 180, 'Hồ sơ bệnh nhân nổi bật')
  c += xBox(mainX + 24, 790, 180, 92)
  c += bars(mainX + 232, 794, [240, 320, 220, 180])
  c += button(mainX + 742, 810, 130, 'Mở tư vấn')
  c += button(mainX + 894, 810, 130, 'Xem hồ sơ')
  return shell('Doctor', ['Dashboard', 'Patients', 'Schedule', 'Consultation'], c, { activeIndex: 0, title: 'Doctor - Dashboard black white' })
}

function doctorPatientsScreen() {
  let c = header('Patients', 'Quản lý danh sách bệnh nhân, trạng thái ca khám và hồ sơ liên quan.')
  c += card(mainX, 194, 1096, 110, 'Bộ lọc bệnh nhân')
  c += filterRow(mainX + 24, 236, ['Tìm bệnh nhân...', 'Trạng thái', 'Chuyên khoa', 'Ngày khám'])
  c += card(mainX, 336, 720, 580, 'Danh sách bệnh nhân')
  c += table(mainX + 24, 390, 672, 468, 6)
  c += card(mainX + 752, 336, 344, 580, 'Chi tiết bệnh nhân')
  c += xBox(mainX + 782, 392, 112, 88)
  c += bars(mainX + 920, 402, [150, 210, 180])
  c += line(mainX + 782, 520, mainX + 1062, 520)
  c += bars(mainX + 782, 558, [250, 220, 260, 180], 24)
  c += button(mainX + 782, 818, 118, 'Tư vấn')
  c += button(mainX + 920, 818, 118, 'Bệnh án')
  return shell('Doctor', ['Dashboard', 'Patients', 'Schedule', 'Consultation'], c, { activeIndex: 1, title: 'Doctor - Patients black white' })
}

function doctorScheduleScreen() {
  let c = header('Schedule', 'Lịch làm việc theo tuần, ca khám và trạng thái phòng khám.')
  c += card(mainX, 194, 1096, 86, 'Điều hướng lịch')
  c += button(mainX + 24, 224, 42, '<') + button(mainX + 76, 224, 42, '>')
  c += text(mainX + 146, 248, 'Tuần 01 - 07/06/2026', { size: 16, weight: 700 })
  c += button(mainX + 910, 224, 80, 'Tuần') + button(mainX + 1006, 224, 70, 'Ngày')
  c += card(mainX, 314, 1096, 602, 'Lịch theo ngày')
  ;['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((day, i) => {
    const x = mainX + 24 + i * 150
    c += rect(x, 370, 132, 480, { r: 8 })
    c += text(x + 66, 400, day, { size: 14, weight: 700, anchor: 'middle' })
    ;[0, 1, 2].forEach((slot) => {
      c += rect(x + 14, 430 + slot * 118, 104, 78, { r: 7, fill: slot === 1 && i === 2 ? '#f1f1f1' : '#fff' })
      c += bars(x + 24, 454 + slot * 118, [64, 84], 16)
    })
  })
  return shell('Doctor', ['Dashboard', 'Patients', 'Schedule', 'Consultation'], c, { activeIndex: 2, title: 'Doctor - Schedule black white' })
}

function doctorConsultationScreen() {
  let c = header('Consultation', 'Không gian tư vấn trực tuyến và ghi nhận chẩn đoán.')
  c += card(mainX, 194, 336, 722, 'Ca tư vấn')
  c += table(mainX + 18, 244, 300, 628, 6)
  c += card(mainX + 368, 194, 698, 722, 'Khung chat tư vấn')
  c += `${rect(mainX + 390, 242, 654, 58, { r: 8, fill: '#f7f7f7' })}${circle(mainX + 422, 271, 18)}${bars(mainX + 454, 260, [160, 240], 15)}`
  c += rect(mainX + 410, 344, 360, 60, { r: 14 }) + bars(mainX + 430, 366, [210, 260], 15)
  c += rect(mainX + 678, 456, 344, 56, { r: 14, fill: '#f1f1f1' }) + bars(mainX + 700, 478, [220, 160], 15)
  c += rect(mainX + 410, 560, 420, 80, { r: 14 }) + bars(mainX + 430, 588, [260, 320, 190], 15)
  c += input(mainX + 410, 824, 474, 'Nhập tin nhắn...')
  c += button(mainX + 904, 824, 100, 'Gửi')
  c += card(mainX + 1090, 194, 4, 722)
  return shell('Doctor', ['Dashboard', 'Patients', 'Schedule', 'Consultation'], c, { activeIndex: 3, title: 'Doctor - Consultation black white' })
}

function adminFacilitiesScreen() {
  let c = header('Facilities', 'Quản lý cơ sở phòng khám, trạng thái vận hành và thông tin liên hệ.')
  c += metricStrip(['Cơ sở', 'Đang mở', 'Chuyên khoa', 'Đánh giá'])
  c += card(mainX, 328, 1096, 104, 'Bộ lọc cơ sở')
  c += filterRow(mainX + 24, 366, ['Tìm cơ sở...', 'Khu vực', 'Trạng thái', 'Chuyên khoa'])
  c += card(mainX, 466, 696, 450, 'Danh sách cơ sở')
  c += table(mainX + 24, 520, 648, 338, 5)
  c += card(mainX + 728, 466, 368, 450, 'Chi tiết cơ sở')
  c += xBox(mainX + 756, 522, 132, 92)
  c += bars(mainX + 914, 528, [150, 220, 170])
  c += bars(mainX + 756, 660, [292, 230, 260, 190], 24)
  c += button(mainX + 756, 838, 112, 'Sửa')
  c += button(mainX + 888, 838, 128, 'Xem bác sĩ')
  return shell('Admin', ['Facilities', 'Doctors', 'Schedule', 'Pricing', 'Revenue'], c, { activeIndex: 0, title: 'Admin - Facilities black white' })
}

function adminDoctorsScreen() {
  let c = header('Doctors', 'Quản lý hồ sơ bác sĩ, phân công cơ sở và trạng thái tiếp nhận.')
  c += card(mainX, 194, 1096, 112, 'Bộ lọc bác sĩ')
  c += filterRow(mainX + 24, 236, ['Tìm bác sĩ...', 'Cơ sở', 'Chuyên khoa', 'Trạng thái'])
  c += button(mainX + 954, 238, 112, 'Thêm mới')
  c += card(mainX, 338, 1096, 578, 'Bảng bác sĩ')
  c += table(mainX + 24, 392, 1048, 466, 6)
  return shell('Admin', ['Facilities', 'Doctors', 'Schedule', 'Pricing', 'Revenue'], c, { activeIndex: 1, title: 'Admin - Doctors black white' })
}

function adminScheduleScreen() {
  let c = header('Schedule', 'Điều phối lịch bác sĩ, phòng khám và ca trực theo cơ sở.')
  c += card(mainX, 194, 1096, 110, 'Bộ lọc lịch')
  c += filterRow(mainX + 24, 236, ['Cơ sở', 'Bác sĩ', 'Tuần', 'Loại ca'])
  c += card(mainX, 336, 708, 580, 'Lịch điều phối')
  ;[0, 1, 2, 3, 4].forEach((row) => {
    ;[0, 1, 2, 3].forEach((col) => {
      c += rect(mainX + 24 + col * 166, 392 + row * 96, 148, 76, { r: 7, fill: row === 1 && col === 2 ? '#f1f1f1' : '#fff' })
      c += bars(mainX + 38 + col * 166, 418 + row * 96, [72, 106], 15)
    })
  })
  c += card(mainX + 740, 336, 356, 580, 'Thêm / sửa ca trực')
  c += input(mainX + 764, 392, 308, 'Bác sĩ')
  c += input(mainX + 764, 454, 308, 'Cơ sở')
  c += input(mainX + 764, 516, 308, 'Ngày')
  c += input(mainX + 764, 578, 308, 'Giờ bắt đầu')
  c += input(mainX + 764, 640, 308, 'Giờ kết thúc')
  c += button(mainX + 764, 818, 140, 'Lưu lịch')
  return shell('Admin', ['Facilities', 'Doctors', 'Schedule', 'Pricing', 'Revenue'], c, { activeIndex: 2, title: 'Admin - Schedule black white' })
}

function adminPricingScreen() {
  let c = header('Pricing', 'Cấu hình bảng giá dịch vụ theo từng cơ sở và chuyên khoa.')
  c += card(mainX, 194, 292, 722, 'Cơ sở phòng khám')
  c += ['Tâm An', 'An Bình', 'MedCare'].map((label, i) => `${rect(mainX + 22, 246 + i * 76, 248, 56, { r: 8, fill: i === 0 ? '#f1f1f1' : '#fff' })}${circle(mainX + 48, 274 + i * 76, 12)}${text(mainX + 72, 280 + i * 76, label, { size: 13, weight: i === 0 ? 700 : 400 })}`).join('')
  c += card(mainX + 324, 194, 772, 722, 'Bảng giá dịch vụ')
  c += input(mainX + 348, 244, 420, 'Tìm dịch vụ...')
  c += button(mainX + 930, 246, 72, 'Thêm')
  c += table(mainX + 348, 308, 724, 550, 7)
  return shell('Admin', ['Facilities', 'Doctors', 'Schedule', 'Pricing', 'Revenue'], c, { activeIndex: 3, title: 'Admin - Pricing black white' })
}

function adminRevenueScreen() {
  let c = header('Revenue', 'Theo dõi doanh thu, lượt khám và phân tích chuyên khoa.')
  c += metricStrip(['Doanh thu', 'Lượt khám', 'Hóa đơn', 'Tăng trưởng'])
  c += card(mainX, 328, 668, 390, 'Biểu đồ doanh thu')
  c += [84, 128, 108, 174, 150, 212, 188, 236].map((h, i) => rect(mainX + 52 + i * 72, 660 - h, 34, h, { r: 3, fill: '#111', sw: 0 })).join('')
  c += card(mainX + 700, 328, 396, 390, 'Tỷ trọng chuyên khoa')
  c += circle(mainX + 898, 506, 96)
  c += circle(mainX + 898, 506, 48, { fill: '#fff' })
  c += bars(mainX + 752, 640, [260, 220, 180], 24)
  c += card(mainX, 750, 1096, 166, 'Danh sách giao dịch gần đây')
  c += table(mainX + 24, 800, 1048, 74, 2)
  return shell('Admin', ['Facilities', 'Doctors', 'Schedule', 'Pricing', 'Revenue'], c, { activeIndex: 4, title: 'Admin - Revenue black white' })
}

const patientNav = ['Dashboard', 'Chatbot', 'Online Consult', 'Consult Chat', 'Booking', 'Services', 'Records', 'Appointments', 'Billing', 'History', 'Settings', 'Booking Prefill']

function patientShell(title, subtitle, activeIndex, content) {
  const c = header(title, subtitle) + content
  return shell('Patient', patientNav, c, { activeIndex, title: `Patient - ${title} black white` })
}

function patientDashboardScreen() {
  let c = metricStrip(['Lịch hẹn', 'Đã khám', 'Nhắc tái khám', 'Tin nhắn'])
  c += card(mainX, 328, 540, 240, 'Chỉ số sức khỏe')
  c += table(mainX + 24, 382, 492, 130, 2)
  c += card(mainX + 572, 328, 524, 240, 'Thông tin y tế')
  c += table(mainX + 596, 382, 476, 130, 2)
  c += card(mainX, 604, 668, 270, 'Ca khám lịch hẹn')
  c += table(mainX + 24, 654, 620, 172, 3)
  c += card(mainX + 700, 604, 396, 270, 'Nhắc nhở điều trị')
  c += bars(mainX + 724, 662, [320, 270, 310, 230, 280], 28)
  return patientShell('Dashboard', 'Tổng quan lịch hẹn, hồ sơ và nhắc nhở điều trị.', 0, c)
}

function patientChatbotScreen() {
  let c = card(mainX, 194, 1096, 720, 'Trợ lý MedConsult')
  c += `${rect(mainX + 24, 246, 1048, 58, { r: 8, fill: '#f7f7f7' })}${circle(mainX + 54, 275, 18)}${bars(mainX + 86, 262, [160, 260], 16)}`
  c += rect(mainX + 52, 350, 548, 72, { r: 14 }) + bars(mainX + 72, 376, [320, 230], 16)
  ;['Sốt / Ớn lạnh', 'Đau đầu', 'Ho / Sổ mũi', 'Đau bụng', 'Đau ngực', 'Vấn đề khác'].forEach((label, i) => {
    c += pill(mainX + 72 + (i % 3) * 156, 452 + Math.floor(i / 3) * 42, 138, label)
  })
  c += rect(mainX + 610, 552, 334, 56, { r: 14, fill: '#f1f1f1' }) + bars(mainX + 630, 574, [220, 130], 15)
  c += rect(mainX + 52, 650, 610, 72, { r: 14 }) + bars(mainX + 72, 676, [340, 280], 16)
  c += input(mainX + 96, 838, 840, 'Nhập triệu chứng...')
  c += button(mainX + 958, 838, 92, 'Gửi')
  c += button(mainX + 52, 838, 36, '+')
  return patientShell('Chatbot', 'Khảo sát triệu chứng ban đầu cùng trợ lý y tế.', 1, c)
}

function patientOnlineConsultScreen() {
  let c = card(mainX, 194, 1096, 110, 'Bộ lọc tư vấn')
  c += input(mainX + 24, 236, 500, 'Tìm bác sĩ hoặc cuộc trò chuyện...')
  c += button(mainX + 780, 238, 130, 'Đang tiếp nhận') + button(mainX + 928, 238, 130, 'Hoàn thành')
  c += metricStrip(['Cuộc trò chuyện', 'Bác sĩ online', 'Phản hồi', 'Chờ xử lý'])
  ;[0, 1, 2].forEach((i) => {
    const x = mainX + i * 374
    c += card(x, 430, 346, 250, 'Phiên tư vấn')
    c += circle(x + 40, 486, 24)
    c += bars(x + 76, 474, [140, 200], 16)
    c += line(x + 24, 528, x + 322, 528)
    c += bars(x + 24, 566, [260, 220, 180], 22)
    c += button(x + 214, 626, 108, 'Mở chat')
  })
  return patientShell('Online Consult', 'Danh sách phiên tư vấn trực tuyến với bác sĩ.', 2, c)
}

function patientConsultChatScreen() {
  let c = card(mainX, 194, 1096, 722, 'Khung tư vấn với bác sĩ')
  c += `${rect(mainX + 24, 246, 1048, 60, { r: 8, fill: '#f7f7f7' })}${circle(mainX + 56, 276, 20)}${bars(mainX + 92, 264, [150, 230], 16)}${button(mainX + 946, 258, 80, 'Video')}`
  c += rect(mainX + 52, 356, 420, 64, { r: 14 }) + bars(mainX + 72, 382, [260, 310], 16)
  c += rect(mainX + 610, 468, 384, 58, { r: 14, fill: '#f1f1f1' }) + bars(mainX + 630, 490, [250, 170], 15)
  c += rect(mainX + 52, 586, 520, 86, { r: 14 }) + bars(mainX + 72, 616, [330, 410, 220], 16)
  c += card(mainX + 620, 586, 454, 126, 'Tóm tắt phiên')
  c += bars(mainX + 644, 646, [360, 300, 250], 18)
  c += input(mainX + 96, 838, 840, 'Nhập tin nhắn cho bác sĩ...')
  c += button(mainX + 958, 838, 92, 'Gửi')
  c += button(mainX + 52, 838, 36, '+')
  return patientShell('Consult Chat', 'Trao đổi trực tiếp với bác sĩ và nhận hướng dẫn.', 3, c)
}

function patientBookingScreen() {
  let c = card(mainX, 194, 1096, 90, 'Tiến trình đặt lịch')
  ;['Cơ sở', 'Chuyên khoa', 'Bác sĩ', 'Lịch khám', 'Xác nhận'].forEach((step, i) => {
    c += circle(mainX + 84 + i * 202, 240, 18)
    c += text(mainX + 84 + i * 202, 274, step, { size: 11, anchor: 'middle' })
    if (i < 4) c += line(mainX + 104 + i * 202, 240, mainX + 260 + i * 202, 240)
  })
  c += card(mainX, 322, 700, 594, 'Chọn bệnh viện hoặc phòng khám')
  c += xBox(mainX + 24, 376, 652, 188)
  c += table(mainX + 24, 598, 652, 248, 3)
  c += card(mainX + 732, 322, 364, 342, 'Tóm tắt đặt lịch')
  c += bars(mainX + 756, 382, [260, 220, 250, 180, 210], 30)
  c += button(mainX + 756, 596, 140, 'Tiếp tục')
  return patientShell('Booking', 'Chọn cơ sở, chuyên khoa, bác sĩ và thời gian khám.', 4, c)
}

function patientServicesScreen() {
  let c = metricStrip(['Dịch vụ', 'Chuyên khoa', 'Hỗ trợ BHYT', 'Gói khám'])
  c += card(mainX, 328, 1096, 118, 'Tìm kiếm dịch vụ')
  c += input(mainX + 24, 372, 620, 'Tìm dịch vụ khám, xét nghiệm...')
  c += button(mainX + 684, 374, 104, 'Tất cả') + button(mainX + 806, 374, 120, 'Tổng quát') + button(mainX + 944, 374, 112, 'Tim mạch')
  ;[0, 1, 2, 3, 4, 5].forEach((i) => {
    const x = mainX + (i % 3) * 374
    const y = 484 + Math.floor(i / 3) * 190
    c += card(x, y, 346, 154, 'Dịch vụ y tế')
    c += bars(x + 24, y + 72, [250, 190], 18)
    c += button(x + 216, y + 106, 104, 'Đặt lịch')
  })
  return patientShell('Services', 'Tra cứu bảng giá và dịch vụ y tế.', 5, c)
}

function patientRecordsScreen() {
  let c = metricStrip(['Lần khám', 'Chẩn đoán', 'Đơn thuốc', 'Tái khám'])
  c += card(mainX, 328, 1096, 200, 'Chỉ số sức khỏe')
  ;[0, 1, 2, 3, 4].forEach((i) => {
    const x = mainX + 24 + i * 210
    c += rect(x, 382, 184, 96, { r: 8 })
    c += circle(x + 26, 424, 16)
    c += bars(x + 52, 410, [96, 126], 16)
  })
  c += card(mainX, 560, 520, 300, 'Biểu đồ khám')
  c += [70, 110, 84, 140, 118, 164].map((h, i) => rect(mainX + 62 + i * 72, 804 - h, 30, h, { fill: '#111', sw: 0 })).join('')
  c += card(mainX + 552, 560, 544, 300, 'Bệnh và chẩn đoán')
  c += table(mainX + 576, 614, 496, 188, 3)
  return patientShell('Records', 'Theo dõi hồ sơ bệnh án và chỉ số sức khỏe.', 6, c)
}

function patientAppointmentsScreen() {
  let c = card(mainX, 194, 720, 720, 'Lịch khám theo tháng')
  ;['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((day, i) => text(mainX + 64 + i * 94, 260, day, { size: 12, weight: 700, anchor: 'middle' }))
  for (let i = 0; i < 35; i += 1) {
    const x = mainX + 24 + (i % 7) * 94
    const y = 286 + Math.floor(i / 7) * 100
    c += rect(x, y, 82, 84, { r: 6, fill: i === 18 ? '#f1f1f1' : '#fff' })
    c += text(x + 12, y + 24, String(i + 1), { size: 12 })
    if ([6, 13, 18, 20, 28].includes(i)) c += circle(x + 16, y + 58, 4, { fill: '#111' })
  }
  c += card(mainX + 752, 194, 344, 360, 'Lịch hẹn khám')
  c += table(mainX + 776, 248, 296, 198, 3)
  c += card(mainX + 752, 586, 344, 190, 'Chú thích')
  c += bars(mainX + 776, 644, [250, 230, 210], 28)
  return patientShell('Appointments', 'Theo dõi lịch hẹn khám theo tháng.', 7, c)
}

function patientBillingScreen() {
  let c = card(mainX, 194, 1096, 112, 'Bộ lọc hóa đơn')
  c += input(mainX + 24, 236, 340, 'Tất cả trạng thái')
  c += input(mainX + 388, 236, 340, 'Tất cả loại khám')
  c += input(mainX + 752, 236, 320, 'Tìm hóa đơn...')
  c += card(mainX, 340, 1096, 576, 'Danh sách hóa đơn')
  c += table(mainX + 24, 394, 1048, 458, 5)
  return patientShell('Billing', 'Quản lý hóa đơn và trạng thái thanh toán.', 8, c)
}

function patientHistoryScreen() {
  let c = card(mainX, 194, 1096, 112, 'Bộ lọc lịch sử khám')
  c += button(mainX + 24, 236, 96, 'Tất cả') + button(mainX + 138, 236, 110, 'Khám bệnh') + button(mainX + 266, 236, 150, 'Tư vấn online')
  c += input(mainX + 444, 236, 420, 'Tìm theo bác sĩ hoặc mã hồ sơ...')
  ;[0, 1, 2].forEach((i) => {
    const y = 346 + i * 178
    c += card(mainX, y, 1096, 136, 'Lần khám')
    c += circle(mainX + 42, y + 68, 22)
    c += bars(mainX + 82, y + 48, [240, 360, 280], 20)
    c += pill(mainX + 878, y + 32, 128, 'Trạng thái')
    c += button(mainX + 878, y + 82, 128, 'Xem chi tiết')
  })
  return patientShell('History', 'Tra cứu lịch sử khám và tư vấn.', 9, c)
}

function patientSettingsScreen() {
  let c = card(mainX, 194, 290, 342, 'Hồ sơ cá nhân')
  c += circle(mainX + 145, 274, 42)
  c += bars(mainX + 72, 344, [150, 210, 180], 28)
  c += card(mainX + 322, 194, 774, 230, 'Thông tin cá nhân')
  c += input(mainX + 346, 254, 344, 'Họ tên')
  c += input(mainX + 710, 254, 344, 'Tuổi')
  c += input(mainX + 346, 316, 344, 'Ngày sinh')
  c += input(mainX + 710, 316, 344, 'Giới tính')
  c += card(mainX + 322, 456, 774, 160, 'Liên hệ')
  c += input(mainX + 346, 516, 344, 'Số điện thoại')
  c += input(mainX + 710, 516, 344, 'Email')
  c += card(mainX + 322, 648, 774, 190, 'Bảo mật và thông báo')
  c += bars(mainX + 346, 706, [360, 280, 330], 30)
  c += button(mainX + 900, 700, 128, 'Đổi mật khẩu')
  return patientShell('Settings', 'Cập nhật hồ sơ, liên hệ và bảo mật.', 10, c)
}

function patientBookingPrefillScreen() {
  let c = card(mainX, 194, 1096, 84, 'Đã tự điền từ đánh giá sơ bộ')
  c += `${circle(mainX + 42, 236, 18)}${text(mainX + 76, 232, 'Cơ sở: Phòng khám Đa khoa Tâm An · Chuyên khoa: Nội tổng quát', { size: 13, weight: 700 })}${text(mainX + 76, 254, 'Bệnh nhân chỉ cần chọn bác sĩ và thời gian khám.', { size: 12, fill: '#555' })}`
  c += card(mainX, 314, 330, 184, '1. Cơ sở đã chọn')
  c += bars(mainX + 24, 374, [250, 210, 180], 22)
  c += card(mainX + 360, 314, 330, 184, '2. Chuyên khoa đã chọn')
  c += pill(mainX + 384, 374, 132, 'Nội tổng quát')
  c += pill(mainX + 532, 374, 92, 'Tiêu hóa')
  c += card(mainX + 720, 314, 376, 184, 'Tóm tắt')
  c += bars(mainX + 744, 374, [280, 230, 250], 22)
  c += card(mainX, 536, 520, 360, '3. Chọn bác sĩ')
  c += table(mainX + 24, 590, 472, 246, 3)
  c += card(mainX + 552, 536, 544, 360, '4. Chọn ngày và giờ')
  ;['Hôm nay', 'Ngày mai', 'Thứ 7', 'CN'].forEach((label, i) => {
    c += rect(mainX + 576 + i * 122, 594, 104, 78, { r: 8, fill: i === 1 ? '#f1f1f1' : '#fff' })
    c += text(mainX + 628 + i * 122, 626, label, { size: 11, weight: 700, anchor: 'middle' })
  })
  ;['09:00', '10:30', '15:00'].forEach((slot, i) => {
    c += pill(mainX + 576 + i * 112, 724, 92, slot)
  })
  c += button(mainX + 930, 820, 128, 'Xác nhận')
  return patientShell('Booking Prefill', 'Luồng đặt lịch sau chatbot với cơ sở và chuyên khoa điền sẵn.', 11, c)
}

const files = [
  ['patient-layout.svg', patientScreen()],
  ['doctor-layout.svg', doctorScreen()],
  ['admin-layout.svg', adminScreen()],
]

for (const [name, svg] of files) {
  writeFileSync(join(outDir, name), svg)
}

const doctorFiles = [
  ['01-dashboard.svg', doctorDashboardScreen()],
  ['02-patients.svg', doctorPatientsScreen()],
  ['03-schedule.svg', doctorScheduleScreen()],
  ['04-consultation.svg', doctorConsultationScreen()],
]

const adminFiles = [
  ['01-facilities.svg', adminFacilitiesScreen()],
  ['02-doctors.svg', adminDoctorsScreen()],
  ['03-schedule.svg', adminScheduleScreen()],
  ['04-pricing.svg', adminPricingScreen()],
  ['05-revenue.svg', adminRevenueScreen()],
]

const patientFiles = [
  ['01-dashboard.svg', patientDashboardScreen()],
  ['02-chatbot.svg', patientChatbotScreen()],
  ['03-online-consultations.svg', patientOnlineConsultScreen()],
  ['04-consultation-chat.svg', patientConsultChatScreen()],
  ['05-booking.svg', patientBookingScreen()],
  ['06-services.svg', patientServicesScreen()],
  ['07-medical-records.svg', patientRecordsScreen()],
  ['08-appointments.svg', patientAppointmentsScreen()],
  ['09-billing.svg', patientBillingScreen()],
  ['10-history.svg', patientHistoryScreen()],
  ['11-settings.svg', patientSettingsScreen()],
  ['12-booking-prefill.svg', patientBookingPrefillScreen()],
]

for (const [name, svg] of patientFiles) {
  writeFileSync(join(patientDir, name), svg)
}

for (const [name, svg] of doctorFiles) {
  writeFileSync(join(doctorDir, name), svg)
}

for (const [name, svg] of adminFiles) {
  writeFileSync(join(adminDir, name), svg)
}

console.log(`Generated ${files.length + patientFiles.length + doctorFiles.length + adminFiles.length} black-white layout screens.`)
