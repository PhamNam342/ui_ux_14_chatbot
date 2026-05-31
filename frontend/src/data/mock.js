export const doctors = [
  { id: 'D-001', name: 'Nguyễn Văn Minh', dob: '1986-03-14', hometown: 'Hà Nội', cccd: '001086123456', spec: 'Nội tổng quát', room: 'Phòng 102', phone: '0908 123 456', initials: 'NM', color: 'mint' },
  { id: 'D-002', name: 'Trần Thị Hoa', dob: '1988-11-02', hometown: 'Đà Nẵng', cccd: '048188223456', spec: 'Tim mạch', room: 'Phòng 201', phone: '0912 987 654', initials: 'TH', color: 'blue' },
  { id: 'D-003', name: 'Lê Hoàng Anh', dob: '1990-06-21', hometown: 'Huế', cccd: '046190323456', spec: 'Răng Hàm Mặt', room: 'Phòng 305', phone: '0933 111 222', initials: 'LA', color: 'violet' },
  { id: 'D-004', name: 'Phạm Minh Tuấn', dob: '1984-08-18', hometown: 'Cần Thơ', cccd: '092084423456', spec: 'Chỉnh hình', room: 'Phòng 108', phone: '0977 444 555', initials: 'PT', color: 'amber' },
]

export const cases = [
  { code: 'CA250501-001', patient: 'Trần Thị Mai', initials: 'TM', age: 42, gender: 'Nữ', phone: '0901 234 567', status: 'Đang chờ tư vấn', level: 'Trung bình', symptoms: 'Sốt, đau đầu, ho' },
  { code: 'CA250501-002', patient: 'Lê Văn Hùng', initials: 'LH', age: 55, gender: 'Nam', phone: '0908 222 118', status: 'Mới', level: 'Cao', symptoms: 'Đau ngực, khó thở' },
  { code: 'CA250501-003', patient: 'Phạm Quang Minh', initials: 'PM', age: 29, gender: 'Nam', phone: '0917 445 882', status: 'Đang tư vấn', level: 'Thấp', symptoms: 'Đau bụng, buồn nôn' },
  { code: 'CA250501-004', patient: 'Nguyễn Thị Lan', initials: 'NL', age: 36, gender: 'Nữ', phone: '0934 118 965', status: 'Hoàn tất', level: 'Trung bình', symptoms: 'Ho, đau họng' },
]

export const medicalData = [
  { id: '01', symptom: 'Ho khan, sốt nhẹ, đau họng kéo dài', diagnosis: 'Viêm họng cấp', level: 'Trung bình', action: 'Kê đơn kháng sinh nhẹ và nghỉ ngơi' },
  { id: '02', symptom: 'Đau tức ngực trái, khó thở khi vận động', diagnosis: 'Theo dõi tim mạch', level: 'Nghiêm trọng', action: 'Chụp ECG và xét nghiệm máu khẩn cấp' },
  { id: '03', symptom: 'Nổi mẩn đỏ vùng cánh tay, ngứa ngáy', diagnosis: 'Dị ứng thời tiết', level: 'Nhẹ', action: 'Bôi kem ngoài da và uống thuốc kháng Histamin' },
  { id: '04', symptom: 'Mệt mỏi kéo dài, sụt cân không rõ nguyên nhân', diagnosis: 'Kiểm tra tổng quát', level: 'Trung bình', action: 'Lấy mẫu xét nghiệm đường huyết và tuyến giáp' },
  { id: '05', symptom: 'Đau bụng vùng thượng vị, ợ chua', diagnosis: 'Viêm loét dạ dày', level: 'Trung bình', action: 'Nội soi dạ dày và điều chỉnh chế độ ăn' },
  { id: '06', symptom: 'Mắt đỏ, cộm, chảy nước mắt', diagnosis: 'Viêm kết mạc', level: 'Nhẹ', action: 'Nhỏ thuốc sát khuẩn và bảo vệ mắt' },
  { id: '07', symptom: 'Đau đầu dữ dội, hoa mắt, chóng mặt', diagnosis: 'Tăng huyết áp', level: 'Nghiêm trọng', action: 'Đo huyết áp liên tục và dùng thuốc hạ áp' },
]

export const scheduleRows = [
  { time: '08:00', endTime: '08:45', doctor: 'BS. Nguyễn Văn Minh', room: 'Phòng 102', patient: 'Trần Thị Mai', status: 'Đang tiến hành' },
  { time: '09:30', endTime: '10:00', doctor: 'BS. Trần Thị Hoa', room: 'Phòng 201', patient: 'Lê Văn Hùng', status: 'Chờ' },
  { time: '10:15', endTime: '11:00', doctor: 'BS. Lê Hoàng Anh', room: 'Phòng 305', patient: 'Phạm Quang Minh', status: 'Đang tiến hành' },
  { time: '14:00', endTime: '14:30', doctor: 'BS. Phạm Minh Tuấn', room: 'Phòng 108', patient: 'Nguyễn Thị Lan', status: 'Hủy' },
]

export const doctorSchedule = [
  { day: 'Thứ 2', date: '19/05', shift: 'Sáng', time: '08:00 - 12:00', startHour: 8, endHour: 12, room: 'Phòng 201', type: 'Khám trực tiếp', patients: 12, status: 'Đã xác nhận' },
  { day: 'Thứ 3', date: '20/05', shift: 'Chiều', time: '13:30 - 17:30', startHour: 13, endHour: 17, room: 'Online', type: 'Tư vấn trực tuyến', patients: 8, status: 'Đã xác nhận' },
  { day: 'Thứ 4', date: '21/05', shift: 'Sáng', time: '08:00 - 12:00', startHour: 8, endHour: 12, room: 'Phòng 203', type: 'Khám trực tiếp', patients: 10, status: 'Đã xác nhận' },
  { day: 'Thứ 5', date: '22/05', shift: 'Tối', time: '18:00 - 21:00', startHour: 18, endHour: 21, room: 'Online', type: 'Tư vấn trực tuyến', patients: 6, status: 'Dự kiến' },
  { day: 'Thứ 6', date: '23/05', shift: 'Chiều', time: '13:30 - 17:30', startHour: 13, endHour: 17, room: 'Phòng 201', type: 'Khám trực tiếp', patients: 9, status: 'Đã xác nhận' },
  { day: 'Thứ 7', date: '24/05', shift: 'Sáng', time: '09:00 - 12:00', startHour: 9, endHour: 12, room: 'Phòng 105', type: 'Khám trực tiếp', patients: 7, status: 'Đã xác nhận' },
  { day: 'CN', date: '25/05', shift: 'Tối', time: '19:00 - 22:00', startHour: 19, endHour: 22, room: 'Online', type: 'Tư vấn trực tuyến', patients: 5, status: 'Dự kiến' },
]

export const patientUser = {
  username: 'benhnhan01',
  password: '123456',
  name: 'Trần Thị Mai',
  age: 42,
  gender: 'Nữ',
  phone: '0901 234 567',
  role: 'Bệnh nhân',
  avatar: '',
  email: 'tranthimai@example.com',
  location: 'Quận 3, TP.HCM',
}

export const clinics = [
  { id: 'C-01', name: 'Phòng khám Đa khoa Tâm An', rating: 4.8, distance: '1.2 km', specialty: 'Nội tổng quát', address: '12 Võ Văn Tần, Quận 3', coords: { x: 62, y: 28 } },
  { id: 'C-02', name: 'Phòng khám Tim mạch An Bình', rating: 4.9, distance: '2.4 km', specialty: 'Tim mạch', address: '81 Điện Biên Phủ, Bình Thạnh', coords: { x: 76, y: 44 } },
  { id: 'C-03', name: 'MedCare Family Clinic', rating: 4.6, distance: '3.1 km', specialty: 'Nhi khoa', address: '44 Nguyễn Thị Minh Khai, Quận 1', coords: { x: 48, y: 56 } },
]

export const doctorAvailability = [
  { id: 'AV-01', clinicId: 'C-01', doctor: 'BS. Nguyễn Văn Minh', spec: 'Nội tổng quát', slot: '09:00', day: 'Hôm nay', free: true, rating: 4.9, exp: '12 năm', about: 'Chuyên điều trị bệnh nội khoa và tư vấn điều trị dài hạn.', slots: ['09:00', '10:30', '15:00'] },
  { id: 'AV-02', clinicId: 'C-01', doctor: 'BS. Vũ Thanh Lam', spec: 'Tiêu hóa', slot: '13:30', day: 'Ngày mai', free: true, rating: 4.8, exp: '9 năm', about: 'Theo dõi sức khoẻ tổng quát, tiêu hoá và hô hấp.', slots: ['13:30', '14:00', '16:30'] },
  { id: 'AV-06', clinicId: 'C-01', doctor: 'BS. Đỗ Gia Huy', spec: 'Hô hấp', slot: '08:00', day: 'Hôm nay', free: true, rating: 4.7, exp: '8 năm', about: 'Chuyên tư vấn bệnh hô hấp và dị ứng theo mùa.', slots: ['08:00', '09:00', '16:30'] },
  { id: 'AV-03', clinicId: 'C-02', doctor: 'BS. Trần Thị Hoa', spec: 'Tim mạch', slot: '14:00', day: 'Ngày mai', free: true, rating: 5.0, exp: '15 năm', about: 'Khám chuyên sâu bệnh lý tim mạch và theo dõi huyết áp.', slots: ['14:00', '15:30', '16:00'] },
  { id: 'AV-04', clinicId: 'C-02', doctor: 'BS. Lê Quốc Bảo', spec: 'Tim mạch', slot: '18:00', day: 'Thứ 6', free: true, rating: 4.7, exp: '11 năm', about: 'Tư vấn tim mạch từ xa và đọc kết quả cận lâm sàng.', slots: ['18:00', '19:00'] },
  { id: 'AV-07', clinicId: 'C-02', doctor: 'BS. Ngô Văn Sơn', spec: 'Thần kinh', slot: '10:30', day: 'Hôm nay', free: true, rating: 4.8, exp: '13 năm', about: 'Khám đau đầu, chóng mặt, rối loạn giấc ngủ.', slots: ['10:30', '13:30', '15:00'] },
  { id: 'AV-05', clinicId: 'C-03', doctor: 'BS. Lê Quốc An', spec: 'Nhi khoa', slot: '08:30', day: 'Thứ 6', free: true, rating: 4.8, exp: '10 năm', about: 'Khám nhi khoa tổng quát và theo dõi tăng trưởng cho trẻ.', slots: ['08:30', '09:30', '10:30'] },
  { id: 'AV-08', clinicId: 'C-03', doctor: 'BS. Phan Minh Đức', spec: 'Tai mũi họng', slot: '15:00', day: 'Ngày mai', free: true, rating: 4.6, exp: '7 năm', about: 'Tư vấn viêm mũi dị ứng và bệnh lý tai mũi họng thường gặp.', slots: ['15:00', '16:30', '18:00'] },
]

export const patientBills = [
  { id: 'INV-2505-001', date: '2026-05-23', type: 'Khám trực tiếp', item: 'Khám tim mạch tổng quát', amount: 450000, status: 'Đã thanh toán', method: 'Thẻ ngân hàng' },
  { id: 'INV-2505-002', date: '2026-05-18', type: 'Tư vấn trực tuyến', item: 'Tư vấn triệu chứng sốt, ho', amount: 180000, status: 'Đã thanh toán', method: 'Ví điện tử' },
  { id: 'INV-2505-003', date: '2026-05-30', type: 'Khám trực tiếp', item: 'Khám nội tổng quát', amount: 320000, status: 'Chưa thanh toán', method: 'Thanh toán tại quầy' },
  { id: 'INV-2506-001', date: '2026-06-02', type: 'Tư vấn trực tuyến', item: 'Tái khám trực tuyến', amount: 150000, status: 'Chưa thanh toán', method: 'Chờ xác nhận' },
]

export const patientHistory = [
  {
    id: 'VH-01',
    type: 'Tư vấn trực tuyến',
    date: '18/05/2026',
    doctor: 'BS. Nguyễn Văn Minh',
    diagnosis: 'Viêm họng cấp',
    prescription: 'Paracetamol 500mg, Siro ho thảo dược',
    reminders: 'Tái khám sau 3 ngày nếu còn sốt',
    note: 'Giữ ấm cổ họng, uống nhiều nước',
    clinic: 'MedConsult Online',
    summary: 'Tư vấn triệu chứng sốt, ho khan và đau họng kéo dài.',
  },
  {
    id: 'VH-02',
    type: 'Khám bệnh',
    date: '05/04/2026',
    doctor: 'BS. Trần Thị Hoa',
    diagnosis: 'Theo dõi tim mạch định kỳ',
    prescription: 'Aspirin 81mg',
    reminders: 'Đo huyết áp mỗi sáng',
    note: 'Hạn chế đồ uống có caffein',
    clinic: 'Phòng khám Tim mạch An Bình',
    summary: 'Khám định kỳ theo dõi tim mạch và đánh giá huyết áp.',
  },
]

export const patientMedicalRecords = [
  { month: '05/2026', issue: 'Viêm họng cấp', detail: 'Sốt, ho khan, đau họng kéo dài', history: 'Không dị ứng thuốc' },
  { month: '04/2026', issue: 'Theo dõi tim mạch', detail: 'Đau ngực nhẹ khi vận động', history: 'Tiền sử huyết áp cao nhẹ' },
  { month: '01/2026', issue: 'Viêm dạ dày', detail: 'Đau bụng thượng vị, ợ chua', history: 'Tiền sử viêm dạ dày tái phát' },
]

export const consultationHistory = [
  {
    code: 'CA250501-004',
    patient: 'Nguyễn Thị Lan',
    initials: 'NL',
    symptoms: 'Ho, đau họng',
    time: '25/05/2026 09:30',
    rating: 5,
    diagnosis: 'Viêm họng cấp, kê đơn thuốc ho thảo dược.',
    feedback: [
      { author: 'Nguyễn Thị Lan', time: '10:00', text: 'Bác sĩ tư vấn rất nhiệt tình và chu đáo!' }
    ]
  }
]

export const advisorConversations = [
  {
    id: 'conv-01',
    question: 'Tôi bị đau thượng vị âm ỉ kèm theo ợ chua nhiều lần trong ngày, có cần đi khám không?',
    answer: 'Có thể bạn đang gặp tình trạng viêm loét dạ dày tá tràng hoặc trào ngược dạ dày thực quản. Hãy điều chỉnh chế độ ăn uống, tránh đồ cay nóng và chua. Nếu triệu chứng dai dẳng, nên đi khám bác sĩ.',
    status: 'Hoàn thành'
  },
  {
    id: 'conv-02',
    question: 'Bé nhà tôi bị sốt 38.5 độ kèm phát ban nhẹ ở tay chân, xử lý thế nào?',
    answer: 'Trẻ có thể bị sốt virus hoặc tay chân miệng. Hãy theo dõi sát sao, lau ấm và dùng hạ sốt hạ nhiệt nếu cần. Hãy đưa bé đến bác sĩ nhi khoa khám ngay nếu có dấu hiệu mệt lả.',
    status: 'Chưa kiểm tra'
  }
]

export const doctorConsultations = [
  {
    id: 'consult-001',
    patient: 'Trần Thị Mai',
    initials: 'TM',
    age: 42,
    phone: '0901 234 567',
    symptoms: 'Sốt, đau đầu, ho',
    level: 'Trung bình',
    time: '09:12 27-05',
    doctor: 'Nguyễn Văn A',
    status: 'Đang tư vấn'
  },
  {
    id: 'consult-002',
    patient: 'Phạm Quang Minh',
    initials: 'PM',
    age: 29,
    phone: '0917 445 882',
    symptoms: 'Đau bụng, buồn nôn',
    level: 'Thấp',
    time: '10:45 27-05',
    doctor: 'Trần Thị B',
    status: 'Đang tư vấn'
  },
  {
    id: 'consult-003',
    patient: 'Lê Văn Hùng',
    initials: 'LH',
    age: 55,
    phone: '0908 222 118',
    symptoms: 'Đau ngực, khó thở',
    level: 'Cao',
    time: '14:20 26-05',
    doctor: 'Lê Hoàng C',
    status: 'Đã hoàn thành'
  },
  {
    id: 'consult-004',
    patient: 'Nguyễn Thị Lan',
    initials: 'NL',
    age: 36,
    phone: '0934 118 965',
    symptoms: 'Ho, đau họng',
    level: 'Trung bình',
    time: '11:00 23-05',
    doctor: 'Phạm Minh D',
    status: 'Đã hoàn thành'
  }
]

export const patientConsultations = [
  {
    id: 'consult-001',
    doctor: 'BS. Trần Thị Hoa',
    initials: 'TH',
    spec: 'Tim mạch',
    symptoms: 'Đau đầu và chóng mặt, cần bác sĩ đánh giá thêm.',
    time: '09:12 hôm nay',
    status: 'Đang tiếp nhận',
  },
  {
    id: 'consult-005',
    doctor: 'BS. Nguyễn Văn Minh',
    initials: 'NM',
    spec: 'Nội tổng quát',
    symptoms: 'Tư vấn sốt, ho khan và đau họng.',
    time: '18/05/2026',
    status: 'Đã hoàn thành',
  },
]
