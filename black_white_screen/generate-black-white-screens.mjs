import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = dirname(fileURLToPath(import.meta.url))
mkdirSync(outDir, { recursive: true })

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

function shell(role, navItems, content) {
  const nav = navItems.map((item, i) => {
    const y = 158 + i * 56
    return `${rect(28, y - 28, 192, 42, { r: 6, fill: i === 0 ? '#f1f1f1' : '#fff' })}${circle(52, y - 7, 8)}${text(72, y - 2, item, { size: 13, weight: i === 0 ? 700 : 400 })}`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <title>${esc(role)} black white layout</title>
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

const files = [
  ['patient-layout.svg', patientScreen()],
  ['doctor-layout.svg', doctorScreen()],
  ['admin-layout.svg', adminScreen()],
]

for (const [name, svg] of files) {
  writeFileSync(join(outDir, name), svg)
}

console.log(`Generated ${files.length} black-white layout screens.`)
