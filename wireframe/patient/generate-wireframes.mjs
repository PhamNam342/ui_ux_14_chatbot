import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = dirname(fileURLToPath(import.meta.url))
mkdirSync(outDir, { recursive: true })

const W = 1440
const H = 1024
const sidebarW = 236
const topbarH = 72
const contentX = 276
const contentW = 1124

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])
const group = (id, body) => `<g id="${esc(id)}">${body}</g>`
const rect = (x, y, w, h, options = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${options.r ?? 8}" fill="${options.fill ?? '#ffffff'}" stroke="${options.stroke ?? '#cbd5e1'}" stroke-width="${options.sw ?? 1.3}"/>`
const line = (x1, y1, x2, y2, options = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${options.stroke ?? '#94a3b8'}" stroke-width="${options.sw ?? 1.2}" stroke-linecap="round"/>`
const circle = (cx, cy, r, options = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${options.fill ?? '#ffffff'}" stroke="${options.stroke ?? '#94a3b8'}" stroke-width="${options.sw ?? 1.2}"/>`
const text = (x, y, value, options = {}) => `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${options.size ?? 13}" font-weight="${options.weight ?? 400}" fill="${options.fill ?? '#334155'}"${options.anchor ? ` text-anchor="${options.anchor}"` : ''}>${esc(value)}</text>`
const pill = (x, y, value, options = {}) => {
  const width = options.w ?? Math.max(58, value.length * 7 + 22)
  return `${rect(x, y, width, options.h ?? 26, { r: 13, fill: options.fill ?? '#f8fafc', stroke: options.stroke ?? '#cbd5e1' })}${text(x + width / 2, y + 18, value, { size: 11, weight: 700, fill: options.color ?? '#475569', anchor: 'middle' })}`
}
const button = (x, y, w, label, options = {}) => `${rect(x, y, w, options.h ?? 36, { r: 6, fill: options.fill ?? '#e2e8f0', stroke: options.stroke ?? '#94a3b8' })}${text(x + w / 2, y + 23, label, { size: 12, weight: 700, anchor: 'middle', fill: options.color ?? '#334155' })}`
const input = (x, y, w, label, options = {}) => `${rect(x, y, w, options.h ?? 38, { r: 6, fill: '#ffffff', stroke: '#cbd5e1' })}${text(x + 13, y + 24, label, { size: 12, fill: '#94a3b8' })}`
const card = (x, y, w, h, title = '', options = {}) => `${rect(x, y, w, h, { r: options.r ?? 10, fill: options.fill ?? '#ffffff', stroke: options.stroke ?? '#cbd5e1' })}${title ? text(x + 18, y + 28, title, { size: 15, weight: 700 }) : ''}`
const divider = (x, y, w) => line(x, y, x + w, y, { stroke: '#e2e8f0' })
const placeholder = (x, y, w, lines = 2) => Array.from({ length: lines }, (_, index) => rect(x, y + index * 12, index === lines - 1 ? w * 0.72 : w, 5, { r: 2, fill: '#e2e8f0', stroke: '#e2e8f0' })).join('')

const navItems = [
  ['01', 'Dashboard'],
  ['02', 'Chat tư vấn'],
  ['03', 'Tư vấn trực tuyến'],
  ['04', 'Đặt lịch khám'],
  ['05', 'Bảng giá dịch vụ'],
  ['06', 'Hồ sơ bệnh án'],
]

function shell(active, content, title = '') {
  const nav = navItems.map(([index, label], i) => {
    const y = 150 + i * 52
    const isActive = label === active
    return `${isActive ? rect(18, y - 25, 200, 40, { r: 7, fill: '#e2e8f0', stroke: '#94a3b8' }) : ''}${circle(39, y - 5, 9, { fill: isActive ? '#94a3b8' : '#ffffff' })}${text(60, y, label, { size: 13, weight: isActive ? 700 : 400 })}`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <title>${esc(title || active)}</title>
  <rect width="${W}" height="${H}" fill="#f8fafc"/>
  ${group('Sidebar', `${rect(0, 0, sidebarW, H, { r: 0, fill: '#ffffff', stroke: '#cbd5e1' })}
    ${rect(20, 24, 36, 36, { r: 6, fill: '#e2e8f0', stroke: '#94a3b8' })}
    ${text(68, 43, 'MedConsult', { size: 17, weight: 700 })}
    ${text(68, 57, 'Hệ thống tư vấn y tế', { size: 10, fill: '#64748b' })}
    ${text(22, 110, 'BỆNH NHÂN', { size: 10, weight: 700, fill: '#94a3b8' })}
    ${nav}
    ${line(20, 944, 216, 944, { stroke: '#e2e8f0' })}
    ${text(28, 978, 'Đăng xuất', { size: 13, weight: 700 })}`)}
  ${group('Topbar', `${rect(sidebarW, 0, W - sidebarW, topbarH, { r: 0, fill: '#ffffff', stroke: '#cbd5e1' })}
    ${text(contentX, 31, 'Bệnh nhân', { size: 13, weight: 700 })}
    ${text(contentX, 48, 'Không gian làm việc MedConsult', { size: 10, fill: '#94a3b8' })}
    ${circle(1262, 36, 16)}${text(1262, 41, '○', { size: 15, anchor: 'middle' })}
    ${circle(1310, 36, 18, { fill: '#e2e8f0' })}${text(1310, 41, 'TM', { size: 10, weight: 700, anchor: 'middle' })}
    ${text(1340, 32, 'Trần Thị Mai', { size: 12, weight: 700 })}${text(1340, 48, 'Sẵn sàng', { size: 10, fill: '#94a3b8' })}`)}
  ${group('Content', content)}
</svg>`
}

function pageHeader(eyebrow, title, subtitle) {
  return `${eyebrow ? text(contentX, 116, eyebrow.toUpperCase(), { size: 10, weight: 700, fill: '#64748b' }) : ''}
    ${text(contentX, 146, title, { size: 26, weight: 700, fill: '#0f172a' })}
    ${text(contentX, 170, subtitle, { size: 12, fill: '#64748b' })}`
}

function stat(x, y, label, value, note) {
  return `${card(x, y, 356, 112)}${circle(x + 38, y + 38, 18, { fill: '#e2e8f0' })}${text(x + 68, y + 34, label, { size: 12, fill: '#64748b' })}${text(x + 68, y + 64, value, { size: 27, weight: 700 })}${text(x + 18, y + 94, note, { size: 11, fill: '#64748b' })}`
}

function listRow(x, y, w, title, meta, badge = '') {
  return `${rect(x, y, w, 66, { r: 7, fill: '#f8fafc', stroke: '#e2e8f0' })}${circle(x + 28, y + 33, 15, { fill: '#e2e8f0' })}${text(x + 54, y + 26, title, { size: 13, weight: 700 })}${text(x + 54, y + 47, meta, { size: 11, fill: '#64748b' })}${badge ? pill(x + w - 106, y + 20, badge, { w: 90 }) : ''}`
}

function dashboard() {
  let body = pageHeader('Tổng quan sức khỏe', 'Dashboard bệnh nhân', 'Theo dõi lịch hẹn, các ca khám gần đây và nhắc nhở điều trị.')
  body += stat(276, 204, 'Ca khám lịch hẹn', '02', '1 lịch trong ngày mai')
  body += stat(660, 204, 'Đã khám xong', '05', 'Đã hoàn tất 1 phiên tuần này')
  body += stat(1044, 204, 'Nhắc tái khám', '03', 'Còn 2 nhắc trong tháng')
  body += card(276, 344, 548, 234, 'Chỉ số sức khỏe')
  body += listRow(294, 388, 512, 'Nhịp tim', '72 bpm · Bình thường', 'Hôm nay')
  body += listRow(294, 466, 512, 'Cân nặng', '63.5 kg · Ổn định', '1 tháng')
  body += card(844, 344, 556, 234, 'Thông tin y tế')
  body += listRow(862, 388, 520, 'Lịch sử bệnh', 'Viêm họng cấp · Theo dõi tim mạch')
  body += listRow(862, 466, 520, 'Dị ứng', 'Không có dị ứng thuốc được ghi nhận')
  body += card(276, 598, 672, 198, 'Ca khám lịch hẹn')
  body += listRow(294, 642, 636, '09:00 · Phòng khám Đa khoa Tâm An', 'BS. Nguyễn Văn Minh · Khám trực tiếp', '22/05')
  body += listRow(294, 716, 636, '14:00 · Phòng khám Tim mạch An Bình', 'BS. Trần Thị Hoa · Tư vấn trực tuyến', '23/05')
  body += card(968, 598, 432, 198, 'Nhắc nhở điều trị')
  body += placeholder(986, 646, 380, 2) + placeholder(986, 696, 380, 2) + placeholder(986, 746, 380, 2)
  return shell('Dashboard', body, 'Patient - Dashboard')
}

function chatbot() {
  let body = `${text(contentX, 120, 'Chat tư vấn', { size: 26, weight: 700 })}${text(contentX, 144, 'Khảo sát triệu chứng ban đầu cùng trợ lý MedConsult.', { size: 12, fill: '#64748b' })}`
  body += card(276, 174, 1124, 790)
  body += `${rect(276, 174, 1124, 64, { r: 10, fill: '#f8fafc', stroke: '#cbd5e1' })}${circle(310, 206, 17, { fill: '#e2e8f0' })}${text(340, 201, 'Trợ lý MedConsult', { size: 14, weight: 700 })}${text(340, 220, '● Đang hoạt động · Miễn phí', { size: 11, fill: '#64748b' })}`
  body += `${rect(294, 256, 560, 62, { r: 14, fill: '#f1f5f9', stroke: '#cbd5e1' })}${text(314, 282, 'Xin chào, tôi là trợ lý sức khỏe MedConsult.', { size: 13 })}${text(314, 301, 'Hôm nay bạn đang gặp vấn đề gì?', { size: 13 })}`
  const chips = ['Sốt / Ớn lạnh', 'Đau đầu / Chóng mặt', 'Ho / Sổ mũi', 'Đau bụng', 'Đau ngực / Khó thở', 'Vấn đề khác']
  body += chips.map((label, index) => pill(304 + (index % 3) * 168, 336 + Math.floor(index / 3) * 38, label, { w: 154 })).join('')
  body += `${rect(792, 438, 572, 54, { r: 14, fill: '#e2e8f0', stroke: '#94a3b8' })}${text(812, 470, 'Tôi đau đầu và hơi chóng mặt từ sáng nay.', { size: 13 })}`
  body += `${rect(294, 526, 646, 72, { r: 14, fill: '#f1f5f9', stroke: '#cbd5e1' })}${text(314, 554, 'Tôi đã ghi nhận. Triệu chứng của bạn ở mức độ nào?', { size: 13 })}${text(314, 578, 'Bạn có thể chọn câu trả lời nhanh bên dưới.', { size: 12, fill: '#64748b' })}`
  body += ['Nhẹ', 'Vừa', 'Nặng'].map((label, index) => pill(304 + index * 92, 618, label, { w: 78 })).join('')
  body += `${rect(294, 724, 1088, 42, { r: 6, fill: '#f8fafc', stroke: '#e2e8f0' })}${text(310, 750, 'Thông tin được mã hóa và chỉ chuyển cho bác sĩ khi bạn đồng ý.', { size: 11, fill: '#64748b' })}`
  body += input(352, 838, 920, 'Ví dụ: Tôi đau đầu từ sáng nay...', { h: 48 }) + button(1290, 838, 74, 'Gửi', { h: 48 })
  body += button(294, 838, 42, '+', { h: 48 })
  return shell('Chat tư vấn', body, 'Patient - Chatbot')
}

function consultations() {
  let body = `${rect(276, 104, 1124, 146, { r: 12, fill: '#f1f5f9', stroke: '#cbd5e1' })}${text(304, 136, 'TƯ VẤN BẢO MẬT CÙNG BÁC SĨ MEDCONSULT', { size: 10, weight: 700 })}${text(304, 178, 'Tư vấn trực tuyến', { size: 28, weight: 700 })}${text(304, 208, 'Chọn một cuộc trò chuyện để tiếp tục trao đổi với bác sĩ.', { size: 13, fill: '#64748b' })}${button(1190, 156, 178, 'Bắt đầu tư vấn mới')}`
  body += input(276, 274, 510, 'Tìm bác sĩ hoặc cuộc trò chuyện...')
  body += button(978, 274, 132, 'Đang tiếp nhận') + button(1118, 274, 120, 'Đã hoàn thành', { fill: '#ffffff' }) + button(1246, 274, 84, 'Tất cả', { fill: '#ffffff' })
  body += stat(276, 342, 'Cuộc trò chuyện hiển thị', '03', 'Các phiên đang lọc')
  body += stat(660, 342, 'Bác sĩ đang online', '12', 'Sẵn sàng tiếp nhận')
  body += stat(1044, 342, 'Thời gian phản hồi', '~ 5 phút', 'Ước tính hiện tại')
  const doctors = [['BS. Trần Thị Hoa', 'Tim mạch', 'Đau đầu và chóng mặt, cần bác sĩ đánh giá thêm.'], ['BS. Lê Quốc Bảo', 'Tim mạch', 'Tôi đã nhận kết quả ECG của bạn.'], ['BS. Đỗ Gia Huy', 'Hô hấp', 'Bạn còn ho nhiều về đêm không?']]
  body += doctors.map(([name, spec, message], i) => `${card(276 + i * 384, 486, 356, 212)}${circle(316 + i * 384, 532, 24, { fill: '#e2e8f0' })}${text(354 + i * 384, 526, name, { size: 14, weight: 700 })}${text(354 + i * 384, 546, spec, { size: 11, fill: '#64748b' })}${pill(496 + i * 384, 514, 'Đang tiếp nhận', { w: 116 })}${divider(294 + i * 384, 572, 320)}${text(300 + i * 384, 606, message, { size: 11 })}${divider(294 + i * 384, 636, 320)}${text(300 + i * 384, 670, '● Đang online', { size: 11, fill: '#64748b' })}${text(596 + i * 384, 670, '›', { size: 18, weight: 700 })}`).join('')
  return shell('Tư vấn trực tuyến', body, 'Patient - Online Consultations')
}

function consultationChat() {
  let body = card(276, 104, 1124, 860)
  body += `${rect(276, 104, 1124, 70, { r: 10, fill: '#f8fafc', stroke: '#cbd5e1' })}${circle(316, 139, 21, { fill: '#e2e8f0' })}${text(352, 134, 'BS. Trần Thị Hoa', { size: 14, weight: 700 })}${text(352, 154, 'Tim mạch · ● Đang online', { size: 11, fill: '#64748b' })}${button(1286, 121, 78, 'Video')}`
  body += `${rect(304, 214, 562, 66, { r: 14, fill: '#f1f5f9', stroke: '#cbd5e1' })}${text(324, 242, 'Chào bạn, tôi đã nhận thông tin từ chatbot.', { size: 13 })}${text(324, 263, 'Bạn mô tả thêm tình trạng chóng mặt giúp tôi nhé.', { size: 13 })}`
  body += `${rect(840, 318, 532, 58, { r: 14, fill: '#e2e8f0', stroke: '#94a3b8' })}${text(860, 352, 'Tôi chóng mặt nhẹ khi đứng lên và hơi đau đầu.', { size: 13 })}`
  body += `${rect(304, 416, 620, 78, { r: 14, fill: '#f1f5f9', stroke: '#cbd5e1' })}${text(324, 446, 'Bạn vui lòng đo huyết áp nếu có thiết bị.', { size: 13 })}${text(324, 468, 'Nếu đau đầu tăng mạnh, hãy báo ngay cho tôi.', { size: 13 })}`
  body += `${rect(304, 534, 1068, 102, { r: 8, fill: '#f8fafc', stroke: '#cbd5e1' })}${text(324, 564, 'Tóm tắt phiên tư vấn', { size: 13, weight: 700 })}${placeholder(324, 584, 980, 3)}`
  body += `${text(304, 804, 'Thông tin hội thoại được bảo mật.', { size: 11, fill: '#64748b' })}${button(304, 842, 42, '+', { h: 48 })}${input(362, 842, 902, 'Nhập tin nhắn cho bác sĩ...', { h: 48 })}${button(1280, 842, 84, 'Gửi', { h: 48 })}`
  return shell('Tư vấn trực tuyến', body, 'Patient - Consultation Chat')
}

function booking() {
  let body = pageHeader('', 'Đặt lịch khám', 'Chọn cơ sở, chuyên khoa và thời gian phù hợp. Hệ thống sẽ hướng dẫn bạn từng bước.')
  const steps = ['1  Bệnh viện', '2  Chuyên khoa', '3  Bác sĩ', '4  Lịch khám', '5  Xác nhận']
  body += steps.map((label, index) => `${circle(322 + index * 244, 220, 16, { fill: index === 0 ? '#94a3b8' : '#ffffff' })}${text(346 + index * 244, 225, label, { size: 12, weight: index === 0 ? 700 : 400 })}${index < 4 ? line(438 + index * 244, 220, 538 + index * 244, 220, { stroke: '#cbd5e1' }) : ''}`).join('')
  body += card(276, 264, 758, 650, '1. Chọn bệnh viện hoặc phòng khám')
  body += `${text(294, 316, 'Chọn trực tiếp từ bản đồ hoặc danh sách cơ sở gần bạn.', { size: 12, fill: '#64748b' })}${rect(294, 344, 722, 216, { r: 8, fill: '#f1f5f9', stroke: '#cbd5e1' })}${text(655, 446, 'BẢN ĐỒ PHÒNG KHÁM', { size: 16, weight: 700, fill: '#94a3b8', anchor: 'middle' })}`
  body += circle(744, 398, 13, { fill: '#cbd5e1' }) + circle(842, 470, 13, { fill: '#cbd5e1' }) + circle(556, 496, 13, { fill: '#cbd5e1' })
  body += listRow(294, 584, 722, 'Phòng khám Đa khoa Tâm An', '12 Võ Văn Tần, Quận 3 · 1.2 km', 'Chọn')
  body += listRow(294, 660, 722, 'Phòng khám Tim mạch An Bình', '81 Điện Biên Phủ, Bình Thạnh · 2.4 km', 'Chọn')
  body += listRow(294, 736, 722, 'MedCare Family Clinic', '44 Nguyễn Thị Minh Khai, Quận 1 · 3.1 km', 'Chọn')
  body += card(1054, 264, 346, 340, 'Tóm tắt lịch khám')
  body += `${text(1074, 318, 'Cơ sở khám', { size: 11, fill: '#64748b' })}${placeholder(1074, 334, 280, 2)}${text(1074, 390, 'Chuyên khoa và bác sĩ', { size: 11, fill: '#64748b' })}${placeholder(1074, 406, 280, 2)}${text(1074, 462, 'Thời gian', { size: 11, fill: '#64748b' })}${placeholder(1074, 478, 280, 2)}${button(1074, 542, 306, 'Tiếp tục', { fill: '#f1f5f9' })}`
  return shell('Đặt lịch khám', body, 'Patient - Booking')
}

function services() {
  let body = `${rect(276, 104, 1124, 132, { r: 12, fill: '#f1f5f9', stroke: '#cbd5e1' })}${text(304, 136, 'MINH BẠCH CHI PHÍ, AN TÂM CHĂM SÓC', { size: 10, weight: 700 })}${text(304, 178, 'Bảng giá dịch vụ', { size: 28, weight: 700 })}${text(304, 208, 'Tra cứu nhanh chi phí khám, xét nghiệm và gói chăm sóc sức khỏe.', { size: 13, fill: '#64748b' })}`
  body += stat(276, 260, 'Tổng số dịch vụ', '08', 'Danh mục hiện có') + stat(660, 260, 'Số chuyên khoa', '04', 'Đang hỗ trợ') + stat(1044, 260, 'Dịch vụ hỗ trợ BHYT', '05', 'Có thể áp dụng')
  body += card(276, 396, 1124, 154)
  body += input(294, 416, 1088, 'Tìm dịch vụ khám, xét nghiệm hoặc gói chăm sóc...')
  body += ['Tất cả', 'Tổng quát', 'Tim mạch', 'Xét nghiệm', 'Tiêm chủng'].map((label, index) => pill(294 + index * 124, 470, label, { w: 110 })).join('')
  body += input(294, 512, 230, 'Tất cả loại dịch vụ', { h: 30 }) + input(540, 512, 230, 'Mọi mức giá', { h: 30 }) + pill(790, 514, 'Chỉ dịch vụ hỗ trợ BHYT', { w: 194 })
  body += text(276, 598, 'Tất cả dịch vụ y tế', { size: 18, weight: 700 })
  const services = ['Khám sức khỏe tổng quát', 'Gói kiểm tra tim mạch', 'Xét nghiệm máu cơ bản', 'Tư vấn dinh dưỡng', 'Tiêm vaccine cúm mùa', 'Tư vấn sức khỏe trực tuyến']
  body += services.map((label, i) => {
    const x = 276 + (i % 3) * 384
    const y = 624 + Math.floor(i / 3) * 168
    return `${card(x, y, 356, 144)}${pill(x + 18, y + 18, i % 2 ? 'Tim mạch' : 'Tổng quát', { w: 82 })}${text(x + 18, y + 76, label, { size: 14, weight: 700 })}${text(x + 18, y + 102, 'Từ 320.000đ', { size: 12, weight: 700 })}${button(x + 224, y + 94, 114, 'Đặt lịch')}`
  }).join('')
  return shell('Bảng giá dịch vụ', body, 'Patient - Services')
}

function records() {
  let body = pageHeader('Hồ sơ sức khỏe', 'Hồ sơ bệnh án', 'Theo dõi toàn diện sức khỏe, chẩn đoán và hành trình điều trị của bạn.')
  ;['Tổng số lần khám|12', 'Chẩn đoán đã phát hiện|03', 'Đơn thuốc gần nhất|18/05', 'Lần khám gần nhất|18/05'].forEach((item, index) => {
    const [label, value] = item.split('|')
    body += `${card(276 + index * 288, 204, 260, 92)}${text(294 + index * 288, 236, label, { size: 11, fill: '#64748b' })}${text(294 + index * 288, 274, value, { size: 24, weight: 700 })}`
  })
  body += card(276, 320, 1124, 218, 'Chỉ số sức khỏe hiện tại')
  ;['Nhịp tim|72 bpm', 'SpO2|98%', 'Huyết áp|118/78', 'BMI|22.4', 'Nhiệt độ|36.7°C'].forEach((item, index) => {
    const [label, value] = item.split('|')
    const x = 294 + index * 216
    body += `${rect(x, 370, 198, 142, { r: 8, fill: '#f8fafc', stroke: '#e2e8f0' })}${text(x + 14, 400, label, { size: 12, weight: 700 })}${text(x + 14, 432, value, { size: 20, weight: 700 })}${placeholder(x + 14, 460, 168, 3)}`
  })
  body += card(276, 562, 548, 178, 'Tần suất khám theo tháng')
  body += [44, 72, 52, 96, 64, 108].map((height, i) => rect(326 + i * 70, 708 - height, 24, height, { r: 3, fill: '#cbd5e1', stroke: '#94a3b8' })).join('')
  body += card(844, 562, 556, 178, 'Diễn biến chẩn đoán')
  body += `<polyline points="884,704 970,680 1056,682 1142,644 1228,620 1314,622" fill="none" stroke="#94a3b8" stroke-width="3"/>`
  body += card(276, 764, 1124, 190, 'Bệnh và chẩn đoán đã phát hiện')
  body += listRow(294, 808, 1088, 'Viêm họng cấp', '18/05/2026 · BS. Nguyễn Văn Minh', 'Đang điều trị')
  body += listRow(294, 882, 1088, 'Theo dõi tim mạch', '05/04/2026 · BS. Trần Thị Hoa', 'Theo dõi')
  return shell('Hồ sơ bệnh án', body, 'Patient - Medical Records')
}

function appointments() {
  let body = pageHeader('', 'Lịch khám', 'Theo dõi lịch hẹn theo tháng và chọn ngày để xem thông tin chi tiết.')
  body += card(276, 204, 746, 660)
  body += `${button(300, 228, 40, '‹')}${text(630, 253, 'Tháng 5, 2026', { size: 18, weight: 700, anchor: 'middle' })}${button(930, 228, 40, '›')}${button(806, 228, 62, 'Tuần', { fill: '#ffffff' })}${button(876, 228, 76, 'Tháng')}`
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  body += days.map((day, i) => text(340 + i * 96, 304, day, { size: 12, weight: 700, anchor: 'middle' })).join('')
  for (let i = 0; i < 35; i++) {
    const x = 300 + (i % 7) * 96
    const y = 326 + Math.floor(i / 7) * 82
    body += `${rect(x, y, 88, 72, { r: 5, fill: i === 18 ? '#e2e8f0' : '#ffffff', stroke: '#e2e8f0' })}${text(x + 14, y + 22, String(i + 1), { size: 12, weight: i === 18 ? 700 : 400 })}${[6, 13, 18, 20, 28].includes(i) ? circle(x + 16, y + 50, 4, { fill: '#94a3b8' }) : ''}`
  }
  body += card(1042, 204, 358, 380, 'Lịch hẹn khám')
  body += `${text(1060, 254, '22/05/2026', { size: 12, fill: '#64748b' })}${listRow(1060, 284, 322, 'Khám trực tiếp', '09:00 · BS. Nguyễn Văn Minh', 'Đã đặt')}${placeholder(1078, 360, 270, 2)}`
  body += card(1042, 606, 358, 160, 'Chú thích')
  body += `${circle(1066, 654, 5, { fill: '#94a3b8' })}${text(1082, 658, 'Ca sáng · 08:00 - 12:00', { size: 11 })}${circle(1066, 688, 5, { fill: '#cbd5e1' })}${text(1082, 692, 'Ca chiều · 13:00 - 17:00', { size: 11 })}${circle(1066, 722, 5, { fill: '#e2e8f0' })}${text(1082, 726, 'Ca tối · 18:00 - 06:00', { size: 11 })}`
  return shell('', body, 'Patient - Appointments')
}

function billing() {
  let body = pageHeader('', 'Hóa đơn', 'Theo dõi lịch sử thanh toán và lọc nhanh theo trạng thái hoặc loại khám.')
  body += card(276, 204, 1124, 688)
  body += input(300, 228, 522, 'Tất cả trạng thái') + input(846, 228, 522, 'Tất cả loại khám')
  const rows = [
    ['Khám tim mạch tổng quát', '23/05/2026 · Khám trực tiếp', '450.000đ', 'Đã thanh toán'],
    ['Tư vấn triệu chứng sốt, ho', '18/05/2026 · Tư vấn trực tuyến', '180.000đ', 'Đã thanh toán'],
    ['Khám nội tổng quát', '30/05/2026 · Khám trực tiếp', '320.000đ', 'Chưa thanh toán'],
    ['Tái khám trực tuyến', '02/06/2026 · Tư vấn trực tuyến', '150.000đ', 'Chưa thanh toán'],
  ]
  body += rows.map(([title, meta, price, status], index) => {
    const y = 302 + index * 118
    return `${rect(300, y, 1068, 92, { r: 8, fill: '#f8fafc', stroke: '#e2e8f0' })}${text(324, y + 30, title, { size: 14, weight: 700 })}${text(324, y + 54, meta, { size: 12, fill: '#64748b' })}${text(324, y + 74, `Mã hóa đơn: INV-250${index + 1}`, { size: 10, fill: '#94a3b8' })}${text(1338, y + 32, price, { size: 15, weight: 700, anchor: 'end' })}${pill(1232, y + 50, status, { w: 118 })}`
  }).join('')
  return shell('', body, 'Patient - Billing')
}

function history() {
  let body = pageHeader('Hồ sơ sức khỏe', 'Lịch sử khám bệnh', 'Tra cứu hồ sơ khám, kết quả điều trị và đặt lịch tái khám khi cần.')
  body += card(276, 204, 1124, 118)
  body += ['Tất cả', 'Khám bệnh', 'Tư vấn trực tuyến', 'Tái khám'].map((label, index) => button(300 + index * 136, 224, 122, label, { fill: index ? '#ffffff' : '#e2e8f0' })).join('')
  body += input(300, 274, 510, 'Tìm theo bác sĩ hoặc mã hồ sơ...', { h: 32 }) + input(832, 274, 250, 'Chọn ngày khám', { h: 32 })
  const visits = [
    ['Tư vấn trực tuyến', 'Viêm họng cấp', 'BS. Nguyễn Văn Minh · 18/05/2026 · 09:30', 'Hoàn thành'],
    ['Khám bệnh', 'Theo dõi tim mạch định kỳ', 'BS. Trần Thị Hoa · 05/04/2026 · 14:00', 'Đang điều trị'],
    ['Tái khám', 'Viêm dạ dày đã cải thiện', 'BS. Vũ Thanh Lam · 12/01/2026 · 10:15', 'Đã đóng hồ sơ'],
  ]
  body += visits.map(([type, title, meta, status], index) => {
    const y = 350 + index * 154
    return `${card(276, y, 1124, 128)}${circle(314, y + 46, 20, { fill: '#e2e8f0' })}${pill(352, y + 20, type, { w: 136 })}${text(352, y + 70, title, { size: 16, weight: 700 })}${text(352, y + 96, meta, { size: 12, fill: '#64748b' })}${pill(1232, y + 22, status, { w: 132 })}${button(1232, y + 72, 132, 'Xem chi tiết', { fill: '#ffffff' })}`
  }).join('')
  return shell('', body, 'Patient - History')
}

function settings() {
  let body = pageHeader('Thông tin cá nhân', 'Quản lý tài khoản', 'Cập nhật hồ sơ, thông tin liên hệ và bảo mật tài khoản MedConsult.')
  body += card(276, 204, 276, 332)
  body += `${circle(414, 270, 42, { fill: '#e2e8f0' })}${text(414, 276, 'TM', { size: 16, weight: 700, anchor: 'middle' })}${text(414, 342, 'Trần Thị Mai', { size: 16, weight: 700, anchor: 'middle' })}${text(414, 365, 'Bệnh nhân MedConsult', { size: 11, fill: '#64748b', anchor: 'middle' })}${divider(296, 392, 236)}${text(304, 426, 'tranthimai@example.com', { size: 11 })}${text(304, 454, '0901 234 567', { size: 11 })}${text(304, 482, 'Quận 3, TP.HCM', { size: 11 })}`
  body += card(574, 204, 826, 238, 'Thông tin cá nhân')
  body += `${button(1212, 222, 164, 'Chỉnh sửa thông tin')}${text(594, 260, 'Cập nhật thông tin cơ bản để nhận tư vấn phù hợp hơn.', { size: 12, fill: '#64748b' })}${input(594, 294, 374, 'Họ và tên: Trần Thị Mai')}${input(988, 294, 374, 'Tuổi: 42')}${input(594, 350, 374, 'Ngày sinh: 14/08/1984')}${input(988, 350, 374, 'Giới tính: Nữ')}`
  body += card(574, 462, 826, 156, 'Liên hệ')
  body += input(594, 514, 374, 'Số điện thoại: 0901 234 567') + input(988, 514, 374, 'Email: tranthimai@example.com')
  body += card(574, 638, 826, 140, 'Bảo mật tài khoản')
  body += `${text(594, 688, 'Mật khẩu đăng nhập', { size: 13, weight: 700 })}${text(594, 712, 'Thay đổi mật khẩu định kỳ để tăng mức độ bảo mật.', { size: 11, fill: '#64748b' })}${button(1206, 680, 156, 'Đổi mật khẩu', { fill: '#ffffff' })}`
  body += card(574, 798, 826, 150, 'Thông báo')
  body += `${text(594, 852, 'Nhắc lịch khám', { size: 13, weight: 700 })}${text(594, 874, 'Nhận nhắc nhở trước lịch khám và tư vấn.', { size: 11, fill: '#64748b' })}${pill(1272, 840, 'Bật', { w: 72 })}${divider(594, 896, 768)}${text(594, 928, 'Cập nhật hồ sơ sức khỏe', { size: 13, weight: 700 })}${pill(1272, 912, 'Bật', { w: 72 })}`
  return shell('', body, 'Patient - Settings')
}

const files = {
  '01-dashboard.svg': dashboard(),
  '02-chatbot.svg': chatbot(),
  '03-online-consultations.svg': consultations(),
  '04-consultation-chat.svg': consultationChat(),
  '05-booking.svg': booking(),
  '06-services.svg': services(),
  '07-medical-records.svg': records(),
  '08-appointments.svg': appointments(),
  '09-billing.svg': billing(),
  '10-history.svg': history(),
  '11-settings.svg': settings(),
}

for (const [filename, svg] of Object.entries(files)) {
  writeFileSync(join(outDir, filename), svg)
}

console.log(`Generated ${Object.keys(files).length} patient wireframes in ${outDir}`)
