import { cases, consultationHistory, doctorSchedule, doctors } from './mock.js'

// Helper to initialize data in localStorage if not exists
export function initStore() {
  if (!localStorage.getItem('med_cases')) {
    // Seed cases from mock
    // Make sure we have a rich set of cases with consistent fields
    const enrichedCases = cases.map((item, idx) => ({
      ...item,
      // Map to consultation format if needed
      id: item.code,
      time: item.time || `09:${20 + idx * 15} Hôm nay`,
      doctor: 'Nguyễn Văn Minh',
      waitingTime: `${10 + idx * 8} phút`,
      // Add chatbot details
      chatbotSummary: {
        symptoms: item.symptoms ? item.symptoms.split(', ') : ['Sốt', 'Ho'],
        duration: '3 ngày',
        severity: item.level || 'Trung bình',
        initialNote: 'Bệnh nhân có triệu chứng ban đầu qua sàng lọc tự động.'
      },
      allergies: idx % 2 === 0 ? 'Dị ứng phấn hoa, kháng sinh Penicillin' : 'Không có dị ứng nào được ghi nhận',
      currentMeds: idx % 2 === 0 ? 'Paracetamol 500mg khi sốt' : 'Không dùng thuốc điều trị thường xuyên',
      specialNotes: idx === 1 ? 'Tiền sử huyết áp cao gia đình, cần đo nhịp tim cẩn thận.' : 'Theo dõi triệu chứng thông thường.'
    }))
    localStorage.setItem('med_cases', JSON.stringify(enrichedCases))
  }

  if (!localStorage.getItem('med_histories')) {
    // Seed histories from mock
    const initialHistories = [
      {
        id: 'HS-001',
        code: 'CA250501-004',
        patient: 'Nguyễn Thị Lan',
        age: 36,
        gender: 'Nữ',
        phone: '0934 118 965',
        date: '25/05/2026',
        time: '09:30',
        clinic: 'MedConsult Online',
        diagnosis: 'Viêm họng cấp',
        prescription: [
          { name: 'Paracetamol 500mg', dose: '1 viên/lần, ngày 3 lần', note: 'Uống sau ăn' },
          { name: 'Siro ho thảo dược', dose: '10ml/lần, ngày 2 lần', note: 'Uống sáng và tối' }
        ],
        rating: 5,
        symptoms: 'Ho, đau họng',
        note: 'Sốt nhẹ, ho khan, sưng họng đỏ. Nghỉ ngơi và uống nhiều nước ấm.',
        comment: 'Bác sĩ tư vấn nhiệt tình và chu đáo!',
        actionPath: 'Theo dõi tại nhà'
      },
      {
        id: 'HS-002',
        code: 'CA250421-014',
        patient: 'Lê Văn Hùng',
        age: 55,
        gender: 'Nam',
        phone: '0908 222 118',
        date: '21/04/2026',
        time: '14:30',
        clinic: 'Phòng khám Tim mạch An Bình',
        diagnosis: 'Theo dõi tim mạch định kỳ',
        prescription: [
          { name: 'Aspirin 81mg', dose: '1 viên/ngày', note: 'Uống sau ăn sáng' }
        ],
        rating: 4,
        symptoms: 'Đau ngực nhẹ khi vận động',
        note: 'Đau ngực nhẹ khi vận động gắng sức, đo huyết áp mỗi sáng.',
        comment: 'Thời gian chờ hơi lâu nhưng phần giải thích bệnh rất chi tiết.',
        actionPath: 'Tái khám sau 2 tuần'
      },
      {
        id: 'HS-003',
        code: 'CA250403-008',
        patient: 'Nguyễn Thị Lan',
        age: 36,
        gender: 'Nữ',
        phone: '0934 118 965',
        date: '03/04/2026',
        time: '09:15',
        clinic: 'Phòng khám Đa khoa Tâm An',
        diagnosis: 'Viêm dạ dày',
        prescription: [
          { name: 'Omeprazole 20mg', dose: '1 viên/lần, ngày 1 lần', note: 'Uống trước ăn sáng 30 phút' }
        ],
        rating: 5,
        symptoms: 'Đau thượng vị, ợ chua',
        note: 'Đau âm ỉ vùng thượng vị, ợ chua nhiều sau ăn. Hạn chế ăn đồ cay nóng.',
        comment: 'Đơn thuốc dễ hiểu, bác sĩ nhắc kỹ các món cần tránh.',
        actionPath: 'Theo dõi tại nhà'
      }
    ]
    localStorage.setItem('med_histories', JSON.stringify(initialHistories))
  }

  if (!localStorage.getItem('med_schedule')) {
    // Seed schedules from mock
    // We add more schedule details to accommodate Day, Week, Month views
    const initialSchedule = doctorSchedule.map((item, idx) => ({
      ...item,
      id: `SCH-${100 + idx}`,
      patientName: idx % 2 === 0 ? 'Nguyễn Văn A' : 'Trần Thị B',
      symptoms: idx % 2 === 0 ? 'Ho khan, sốt nhẹ' : 'Đau mỏi vai gáy',
      priority: idx % 3 === 0 ? 'Cao' : idx % 3 === 1 ? 'Trung bình' : 'Thấp',
      timeSlot: item.time,
      status: item.status || 'Đã xác nhận'
    }))
    localStorage.setItem('med_schedule', JSON.stringify(initialSchedule))
  }

  if (!localStorage.getItem('med_profile')) {
    // Seed doctor profile from mock
    const initialProfile = {
      name: 'Dr. Alexander',
      email: 'alexander@medconsult.vn',
      phone: '0909 555 221',
      spec: 'Nội tổng quát',
      degree: 'Thạc sĩ, Bác sĩ Chuyên khoa I',
      certificate: 'CCHN-008249/BYT',
      exp: '12 năm kinh nghiệm',
      avatar: '',
      clinic: 'Phòng khám Đa khoa Tâm An'
    }
    localStorage.setItem('med_profile', JSON.stringify(initialProfile))
  }

  if (!localStorage.getItem('med_leaves')) {
    // Seed leaves registration
    const initialLeaves = [
      { id: 'LV-001', startDate: '2026-06-15', endDate: '2026-06-16', reason: 'Nghỉ phép thường niên', status: 'Đã duyệt' },
      { id: 'LV-002', startDate: '2026-06-28', endDate: '2026-06-28', reason: 'Tham gia hội thảo y khoa', status: 'Chờ duyệt' }
    ]
    localStorage.setItem('med_leaves', JSON.stringify(initialLeaves))
  }

  if (!localStorage.getItem('med_notifications')) {
    const initialNotifications = [
      { id: 'NT-1', title: 'Có ca tư vấn mới đang chờ', detail: 'Bệnh nhân Trần Thị Mai đang chờ tư vấn trực tuyến (Sốt, ho).', time: 'Vừa xong', unread: true },
      { id: 'NT-2', title: 'Hẹn tái khám hôm nay', detail: 'Bệnh nhân Lê Văn Hùng có lịch tái khám theo dõi tim mạch.', time: '10 phút trước', unread: true },
      { id: 'NT-3', title: 'Lịch khám mới được xác nhận', detail: 'Hệ thống đã tự động xếp lịch khám trực tiếp lúc 14:00 hôm nay.', time: '1 giờ trước', unread: false }
    ]
    localStorage.setItem('med_notifications', JSON.stringify(initialNotifications))
  }
}

// Getters and setters
export function getStoredCases() {
  initStore()
  return JSON.parse(localStorage.getItem('med_cases'))
}

export function saveStoredCases(data) {
  localStorage.setItem('med_cases', JSON.stringify(data))
  // Dispatches a storage event for updates in other tabs
  window.dispatchEvent(new Event('storage'))
}

export function getStoredHistories() {
  initStore()
  return JSON.parse(localStorage.getItem('med_histories'))
}

export function saveStoredHistories(data) {
  localStorage.setItem('med_histories', JSON.stringify(data))
  window.dispatchEvent(new Event('storage'))
}

export function getStoredSchedule() {
  initStore()
  return JSON.parse(localStorage.getItem('med_schedule'))
}

export function saveStoredSchedule(data) {
  localStorage.setItem('med_schedule', JSON.stringify(data))
  window.dispatchEvent(new Event('storage'))
}

export function getStoredProfile() {
  initStore()
  return JSON.parse(localStorage.getItem('med_profile'))
}

export function saveStoredProfile(data) {
  localStorage.setItem('med_profile', JSON.stringify(data))
  window.dispatchEvent(new Event('storage'))
}

export function getStoredLeaves() {
  initStore()
  return JSON.parse(localStorage.getItem('med_leaves'))
}

export function saveStoredLeaves(data) {
  localStorage.setItem('med_leaves', JSON.stringify(data))
  window.dispatchEvent(new Event('storage'))
}

export function getStoredNotifications() {
  initStore()
  return JSON.parse(localStorage.getItem('med_notifications'))
}

export function saveStoredNotifications(data) {
  localStorage.setItem('med_notifications', JSON.stringify(data))
  window.dispatchEvent(new Event('storage'))
}

// State transition helpers
export function startConsultation(code) {
  const cases = getStoredCases()
  const updated = cases.map(c => {
    if (c.code === code) {
      return { ...c, status: 'Đang tư vấn' }
    }
    return c
  })
  saveStoredCases(updated)
}

export function completeConsultation(code, resultData) {
  const cases = getStoredCases()
  let patientName = ''
  let age = 30
  let gender = 'Nam'
  let phone = ''
  let symptoms = ''

  const updatedCases = cases.map(c => {
    if (c.code === code) {
      patientName = c.patient
      age = c.age
      gender = c.gender
      phone = c.phone
      symptoms = c.symptoms
      return { ...c, status: 'Hoàn tất' }
    }
    return c
  })
  saveStoredCases(updatedCases)

  // Add history record
  const histories = getStoredHistories()
  const newHistory = {
    id: `HS-${100 + histories.length + 1}`,
    code,
    patient: patientName,
    age,
    gender,
    phone,
    date: new Date().toLocaleDateString('vi-VN'),
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    clinic: 'MedConsult Online',
    diagnosis: resultData.diagnosis,
    prescription: resultData.prescription || [],
    rating: 5,
    symptoms,
    note: resultData.note || '',
    comment: 'Bác sĩ tư vấn tận tình, kê đơn rõ ràng.',
    actionPath: resultData.actionPath,
    reExamDate: resultData.reExamDate || '',
    reExamNote: resultData.reExamNote || ''
  }
  histories.unshift(newHistory) // Put newest on top
  saveStoredHistories(histories)

  // If re-examination is set, add to schedule
  if (resultData.actionPath === 'Tái khám' && resultData.reExamDate) {
    const schedules = getStoredSchedule()
    const newSched = {
      id: `SCH-${Date.now()}`,
      day: 'Tái khám',
      date: resultData.reExamDate.split('-').reverse().slice(0, 2).join('/'), // format DD/MM
      shift: 'Theo hẹn',
      timeSlot: '09:00 - 09:30',
      startHour: 9,
      endHour: 10,
      room: 'Online',
      type: 'Tái khám trực tuyến',
      patients: 1,
      patientName,
      symptoms: `Tái khám: ${resultData.diagnosis}`,
      priority: 'Trung bình',
      status: 'Đã xác nhận',
      fullDateString: resultData.reExamDate
    }
    schedules.push(newSched)
    saveStoredSchedule(schedules)
  }
}
