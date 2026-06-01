import { cases, consultationHistory, doctorSchedule, doctors } from './mock.js'

// Helper to initialize data in localStorage if not exists
export function initStore() {
  // Migration check: Reset old database seeds if they contain outdated mock values
  if (localStorage.getItem('med_cases') && localStorage.getItem('med_cases').includes('Nguyễn Văn Minh')) {
    localStorage.removeItem('med_cases')
    localStorage.removeItem('med_chats')
    localStorage.removeItem('med_histories')
    localStorage.removeItem('med_schedule')
  }

  if (!localStorage.getItem('med_cases')) {
    // Seed cases from mock
    // Make sure we have a rich set of cases with consistent fields
    const enrichedCases = [
      {
        code: 'CA250501-001',
        patient: 'Trần Thị Mai',
        initials: 'TM',
        age: 42,
        gender: 'Nữ',
        phone: '0901 234 567',
        status: 'Đang chờ tư vấn',
        level: 'Trung bình',
        symptoms: 'Sốt, đau đầu, ho',
        id: 'CA250501-001',
        time: '09:20 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '10 phút',
        chatbotSummary: {
          symptoms: ['Sốt', 'Đau đầu', 'Ho khan', 'Mệt mỏi'],
          duration: '2 ngày',
          severity: 'Trung bình',
          initialNote: 'Bệnh nhân có nhiệt độ sốt dao động 38.2 - 38.8 độ C, có ho khan từng cơn, chưa ghi nhận dấu hiệu co thắt ngực hay khó thở.'
        },
        allergies: 'Dị ứng hải sản vỏ cứng, thuốc kháng viêm Aspirin',
        currentMeds: 'Không dùng thuốc điều trị mãn tính',
        specialNotes: 'Cần theo dõi nhịp thở và khuyến nghị uống nhiều nước ấm.'
      },
      {
        code: 'CA250501-002',
        patient: 'Lê Văn Hùng',
        initials: 'LH',
        age: 55,
        gender: 'Nam',
        phone: '0908 222 118',
        status: 'Mới',
        level: 'Cao',
        symptoms: 'Đau ngực, khó thở',
        id: 'CA250501-002',
        time: '09:35 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '18 phút',
        chatbotSummary: {
          symptoms: ['Đau tức ngực trái', 'Khó thở khi gắng sức', 'Mệt mỏi'],
          duration: '1 ngày',
          severity: 'Cao',
          initialNote: 'Bệnh nhân nam, 55 tuổi, tiền sử cao huyết áp. Khai báo đau tức vùng ngực trái lan ra sau vai, cảm giác đè nén kèm khó thở nhẹ. Đề xuất kiểm tra tim mạch khẩn cấp.'
        },
        allergies: 'Không ghi nhận dị ứng thuốc',
        currentMeds: 'Đang duy trì thuốc huyết áp Amlodipine 5mg hàng ngày',
        specialNotes: 'Bệnh nhân lớn tuổi, tiền sử cao huyết áp, cần khuyên di chuyển đến cơ sở y tế nếu tình trạng đau ngực không thuyên giảm.'
      },
      {
        code: 'CA250501-003',
        patient: 'Phạm Quang Minh',
        initials: 'PM',
        age: 29,
        gender: 'Nam',
        phone: '0917 445 882',
        status: 'Đang tư vấn',
        level: 'Thấp',
        symptoms: 'Đau bụng, buồn nôn',
        id: 'CA250501-003',
        time: '09:50 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '26 phút',
        chatbotSummary: {
          symptoms: ['Đau quặn bụng vùng thượng vị', 'Ợ chua', 'Buồn nôn'],
          duration: '3 ngày',
          severity: 'Thấp',
          initialNote: 'Đau âm ỉ thượng vị lan sang hạ sườn phải, tăng lên sau khi ăn đồ chua cay. Không sốt, không vàng da.'
        },
        allergies: 'Dị ứng kháng sinh nhóm Beta-lactam',
        currentMeds: 'Thỉnh thoảng uống cốm dạ dày Phosphalugel',
        specialNotes: 'Đau dạ dày mạn tính tăng sinh do stress công việc, hướng dẫn chế độ ăn thanh đạm.'
      },
      {
        code: 'CA250501-004',
        patient: 'Nguyễn Thị Lan',
        initials: 'NL',
        age: 36,
        gender: 'Nữ',
        phone: '0934 118 965',
        status: 'Hoàn tất',
        level: 'Trung bình',
        symptoms: 'Ho, đau họng',
        id: 'CA250501-004',
        time: '10:05 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '34 phút',
        chatbotSummary: {
          symptoms: ['Ho khan nhiều về đêm', 'Đau rát họng', 'Khản tiếng nhẹ'],
          duration: '5 ngày',
          severity: 'Trung bình',
          initialNote: 'Ho khan dai dẳng kèm ngứa cổ họng, đau họng khi nuốt. Không có sốt cao.'
        },
        allergies: 'Dị ứng thời tiết, bụi phấn hoa',
        currentMeds: 'Không sử dụng thuốc điều trị thường xuyên',
        specialNotes: 'Hạn chế uống nước đá lạnh, súc họng nước muối thường xuyên.'
      }
    ]
    localStorage.setItem('med_cases', JSON.stringify(enrichedCases))
  }

  if (!localStorage.getItem('med_chats')) {
    const initialChats = {
      'CA250501-001': [
        { id: 1, who: 'Bệnh nhân', initials: 'TM', time: '10:00', text: 'Chào bác sĩ, tôi bị sốt cao từ tối qua, người mệt mỏi rã rời, đau buốt đầu nữa.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '10:00', text: 'Bản tóm tắt triệu chứng đã được chuyển đến Bác sĩ chuyên khoa.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '10:02', text: 'Chào chị Mai, tôi đã nhận được thông tin. Hiện tại nhiệt độ cơ thể chị đo được là bao nhiêu? Chị có đo huyết áp không?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'TM', time: '10:03', text: 'Dạ tôi vừa đo là 38.6 độ C. Đầu đau giật từng cơn rất khó chịu bác sĩ ạ. Có ho khan nữa.' },
        { id: 5, who: 'Bác sĩ', initials: 'BS', time: '10:05', text: 'Chị có cảm thấy tức ngực hay khó thở khi ho không? Chị đã uống thuốc hạ sốt nào chưa?', mine: true },
        { id: 6, who: 'Bệnh nhân', initials: 'TM', time: '10:06', text: 'Dạ không khó thở, chỉ thấy đau họng thôi. Tôi có uống 1 viên sủi hạ sốt lúc sáng sớm nhưng giờ lại nóng lại.' }
      ],
      'CA250501-002': [
        { id: 1, who: 'Bệnh nhân', initials: 'LH', time: '08:15', text: 'Chào bác sĩ, từ sáng tới giờ tôi thấy ngực trái nặng trĩu, thi thoảng hơi nhói lên và hơi khó thở khi đi lại.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '08:15', text: 'Thông tin cảnh báo đỏ (Cao) đã được gửi trực tiếp đến Bác sĩ Alexander.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '08:17', text: 'Chào anh Hùng, tình trạng đau ngực có lan ra vai hay cánh tay trái không anh? Anh có cảm giác vã mồ hôi hay chóng mặt không?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'LH', time: '08:18', text: 'Dạ có nhói ra sau bả vai trái bác sĩ ạ. Người hơi mệt nhưng chưa bị chóng mặt. Huyết áp đo lúc nãy là 145/90 mmHg.' },
        { id: 5, who: 'Bác sĩ', initials: 'BS', time: '08:20', text: 'Anh hãy ngồi nghỉ ngơi hoàn toàn tại chỗ kín gió, không đi lại vận động. Anh đã uống viên thuốc huyết áp định kỳ của ngày hôm nay chưa?', mine: true },
        { id: 6, who: 'Bệnh nhân', initials: 'LH', time: '08:21', text: 'Tôi đã uống thuốc huyết áp lúc 7h sáng rồi. Giờ đang nằm nghỉ trên ghế.' }
      ],
      'CA250501-003': [
        { id: 1, who: 'Bệnh nhân', initials: 'PM', time: '11:20', text: 'Chào bác sĩ, mấy ngày nay bụng em cứ đau âm ỉ vùng trên rốn, ợ chua nhiều và hơi buồn nôn sau khi ăn.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '11:20', text: 'Tóm tắt thông tin sàng lọc trào ngược dạ dày đã được gửi tới Bác sĩ.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '11:22', text: 'Chào Minh, em đau nhiều hơn khi đói hay sau khi ăn no? Có kèm theo đi ngoài phân đen hay triệu chứng bất thường nào khác không?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'PM', time: '11:24', text: 'Dạ ăn no vào là đau tức khó chịu lắm ạ, đi ngoài thì bình thường không có phân đen bác sĩ ạ. Do đợt này em thức đêm làm dự án nhiều.' },
        { id: 5, who: 'Bác sĩ', initials: 'BS', time: '11:26', text: 'Tình trạng này khả năng cao là kích ứng dạ dày cấp do căng thẳng và ăn uống không điều độ. Em cần điều chỉnh giờ giấc sinh hoạt và tạm tránh cà phê, đồ chua cay nhé.', mine: true }
      ],
      'CA250501-004': [
        { id: 1, who: 'Bệnh nhân', initials: 'NL', time: '14:30', text: 'Bác sĩ ơi tôi bị ho ngứa họng liên tục 5 ngày nay rồi, rát họng nuốt nước bọt cũng thấy đau.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '14:30', text: 'Bản tóm tắt triệu chứng viêm đường hô hấp đã được gửi đến Bác sĩ.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '14:32', text: 'Chào chị Lan, chị có bị ngạt mũi, chảy mũi hay có sốt không? Ho có đờm xanh vàng gì không chị?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'NL', time: '14:33', text: 'Dạ không chảy mũi, không sốt ạ. Ho khan hoàn toàn nhưng ho nhiều về đêm làm tôi mất ngủ.' },
        { id: 5, who: 'Bác sĩ', initials: 'BS', time: '14:35', text: 'Chị đã dùng siro hay ngậm viên gì chưa? Họng chị có sưng hạch ở dưới cổ không?', mine: true },
        { id: 6, who: 'Bệnh nhân', initials: 'NL', time: '14:36', text: 'Tôi có ngậm kẹo bạc hà nhưng không ăn thua. Chưa thấy sưng hạch cổ bác sĩ ạ.' }
      ]
    }
    localStorage.setItem('med_chats', JSON.stringify(initialChats))
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
