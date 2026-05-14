export const doctors = [
  { id: 'D-001', name: 'Nguyễn Văn Minh', dob: '15/08/1982', hometown: 'Hà Nội', identity: '001082004512', spec: 'Nội tổng quát', room: 'Phòng 102', phone: '0908 123 456', initials: 'NM', color: 'mint' },
  { id: 'D-002', name: 'Trần Thị Hoa', dob: '22/11/1986', hometown: 'Hải Phòng', identity: '031086009876', spec: 'Tim mạch', room: 'Phòng 201', phone: '0912 987 654', initials: 'TH', color: 'blue' },
  { id: 'D-003', name: 'Lê Hoàng Anh', dob: '04/03/1990', hometown: 'Đà Nẵng', identity: '048090001122', spec: 'Răng Hàm Mặt', room: 'Phòng 305', phone: '0933 111 222', initials: 'LA', color: 'violet' },
  { id: 'D-004', name: 'Phạm Minh Tuấn', dob: '19/06/1984', hometown: 'Cần Thơ', identity: '092084007654', spec: 'Chỉnh hình', room: 'Phòng 108', phone: '0977 444 555', initials: 'PT', color: 'amber' },
]

export const clinicRooms = [
  { id: 'PK-01', name: 'Nội khoa A', address: '123 Lê Lợi, Quận 1, TP.HCM', phone: '028 3824 1111', specialty: 'Nội tổng quát', doctors: 8 },
  { id: 'PK-02', name: 'Nhi khoa 1', address: '45 Nguyễn Huệ, Quận 1, TP.HCM', phone: '028 3824 2222', specialty: 'Nhi khoa', doctors: 5 },
  { id: 'PK-03', name: 'Sản phụ khoa B', address: '789 CMT8, Quận 10, TP.HCM', phone: '028 3824 3333', specialty: 'Sản phụ khoa', doctors: 12 },
  { id: 'PK-04', name: 'Da liễu tổng hợp', address: '12 Phan Xích Long, Phú Nhuận, TP.HCM', phone: '028 3824 4444', specialty: 'Da liễu', doctors: 4 },
]

export const cases = [
  { code: 'CA250501-001', patient: 'Trần Thị Mai', initials: 'TM', age: 42, gender: 'Nữ', phone: '0901 234 567', status: 'Đang chờ tư vấn', level: 'Trung bình', symptoms: 'Sốt, đau đầu, ho' },
  { code: 'CA250501-002', patient: 'Lê Văn Hùng', initials: 'LH', age: 55, gender: 'Nam', phone: '0908 222 118', status: 'Mới', level: 'Cao', symptoms: 'Đau ngực, khó thở' },
  { code: 'CA250501-003', patient: 'Phạm Quang Minh', initials: 'PM', age: 29, gender: 'Nam', phone: '0917 445 882', status: 'Đang tư vấn', level: 'Thấp', symptoms: 'Đau bụng, buồn nôn' },
  { code: 'CA250501-004', patient: 'Nguyễn Thị Lan', initials: 'NL', age: 36, gender: 'Nữ', phone: '0934 118 965', status: 'Hoàn tất', level: 'Trung bình', symptoms: 'Ho, đau họng' },
]

export const consultationHistory = [
  {
    code: 'CA250501-001',
    patient: 'Trần Thị Mai',
    initials: 'TM',
    symptoms: 'Sốt 38.5°C, ho khan, đau họng',
    time: '13/05/2026 10:00',
    rating: 5,
    diagnosis: 'Viêm họng cấp kèm sốt nhẹ',
    feedback: [
      { author: 'Trần Thị Mai', time: '10:42', text: 'Bác sĩ tư vấn rõ ràng, hướng dẫn dùng thuốc dễ hiểu.' },
      { author: 'Điều phối viên', time: '10:45', text: 'Ca tư vấn hoàn tất đúng quy trình, bệnh nhân đã nhận kết luận.' },
    ],
  },
  {
    code: 'CA250501-002',
    patient: 'Lê Văn Hùng',
    initials: 'LH',
    symptoms: 'Đau ngực, khó thở khi vận động',
    time: '13/05/2026 09:15',
    rating: 4,
    diagnosis: 'Theo dõi tim mạch, khuyến nghị khám trực tiếp',
    feedback: [
      { author: 'Lê Văn Hùng', time: '09:58', text: 'Tư vấn nhanh, mong có thêm hướng dẫn chuẩn bị xét nghiệm.' },
    ],
  },
  {
    code: 'CA250501-003',
    patient: 'Phạm Quang Minh',
    initials: 'PM',
    symptoms: 'Đau bụng, buồn nôn',
    time: '12/05/2026 15:30',
    rating: 5,
    diagnosis: 'Rối loạn tiêu hoá nhẹ',
    feedback: [
      { author: 'Phạm Quang Minh', time: '16:05', text: 'Phần dặn dò sau tư vấn rất chi tiết.' },
    ],
  },
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

export const advisorConversations = [
  { id: 'CV-001', question: 'Tôi cảm thấy đau họng', answer: 'Bạn có thể bị viêm họng nhẹ. Hãy súc miệng bằng nước muối và theo dõi thêm.', status: 'Hoàn thành' },
  { id: 'CV-002', question: 'Triệu chứng của sốt xuất huyết', answer: 'Sốt cao đột ngột, đau đầu dữ dội, phát ban và đau cơ khớp...', status: 'Hoàn thành' },
  { id: 'CV-003', question: 'Làm sao để giảm cân an toàn?', answer: 'Kết hợp chế độ ăn uống cân bằng giàu chất xơ và tập thể dục thường xuyên.', status: 'Chưa kiểm tra' },
  { id: 'CV-004', question: 'Tôi bị đau dạ dày', answer: 'Hạn chế đồ cay nóng, rượu bia và nên đi nội soi nếu cơn đau kéo dài.', status: 'Hoàn thành' },
  { id: 'CV-005', question: 'Uống thuốc nào để hết cảm?', answer: 'Có thể dùng Paracetamol nhưng cần tuân theo chỉ dẫn của dược sĩ.', status: 'Hoàn thành' },
]

export const scheduleRows = [
  { time: '08:00', endTime: '08:45', doctor: 'BS. Nguyễn Văn Minh', room: 'Phòng 102', patient: 'Trần Thị Mai', status: 'Đang tiến hành' },
  { time: '09:30', endTime: '10:00', doctor: 'BS. Trần Thị Hoa', room: 'Phòng 201', patient: 'Lê Văn Hùng', status: 'Chờ' },
  { time: '10:15', endTime: '11:00', doctor: 'BS. Lê Hoàng Anh', room: 'Phòng 305', patient: 'Phạm Quang Minh', status: 'Huỷ' },
  { time: '14:00', endTime: '14:40', doctor: 'BS. Phạm Minh Tuấn', room: 'Phòng 108', patient: 'Nguyễn Thị Lan', status: 'Đang tiến hành' },
]

export const doctorSchedule = [
  { day: 'Thứ 2', date: '13/05', shift: 'Sáng', time: '08:00 - 12:00', room: 'Phòng 201', type: 'Khám trực tiếp', patients: 12, status: 'Đang tiến hành' },
  { day: 'Thứ 3', date: '14/05', shift: 'Chiều', time: '13:30 - 17:30', room: 'Online', type: 'Tư vấn trực tuyến', patients: 8, status: 'Đang tiến hành' },
  { day: 'Thứ 4', date: '15/05', shift: 'Sáng', time: '08:00 - 12:00', room: 'Phòng 203', type: 'Khám trực tiếp', patients: 10, status: 'Đang tiến hành' },
  { day: 'Thứ 5', date: '16/05', shift: 'Tối', time: '18:00 - 21:00', room: 'Online', type: 'Tư vấn trực tuyến', patients: 6, status: 'Chờ' },
  { day: 'Thứ 6', date: '17/05', shift: 'Chiều', time: '13:30 - 17:30', room: 'Phòng 201', type: 'Khám trực tiếp', patients: 9, status: 'Đang tiến hành' },
  { day: 'Thứ 7', date: '18/05', shift: 'Sáng', time: '07:00 - 10:00', room: 'Phòng 105', type: 'Khám trực tiếp', patients: 7, status: 'Chờ' },
  { day: 'Chủ nhật', date: '19/05', shift: 'Tối', time: '20:00 - 23:00', room: 'Online', type: 'Tư vấn trực tuyến', patients: 5, status: 'Huỷ' },
]
