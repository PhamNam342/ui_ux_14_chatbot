import { cases, consultationHistory, doctorSchedule, doctors } from './mock.js'

// Helper to initialize data in localStorage if not exists
export function initStore() {
  // Migration check: Reset old database seeds if they contain outdated mock values or under-seeded histories
  const storedHistories = localStorage.getItem('med_histories')
  const needsReset = !localStorage.getItem('med_cases') || 
                     (localStorage.getItem('med_cases') && !localStorage.getItem('med_cases').includes('Nguyễn Văn An')) ||
                     !storedHistories ||
                     (storedHistories && JSON.parse(storedHistories).length < 10)
  
  if (needsReset) {
    localStorage.removeItem('med_cases')
    localStorage.removeItem('med_chats')
    localStorage.removeItem('med_histories')
    localStorage.removeItem('med_schedule')
    localStorage.removeItem('med_profile')
    localStorage.removeItem('med_leaves')
    localStorage.removeItem('med_notifications')
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
      },
      {
        code: 'CA250602-005',
        patient: 'Nguyễn Văn An',
        initials: 'VA',
        age: 45,
        gender: 'Nam',
        phone: '0988 777 666',
        status: 'Mới',
        level: 'Cao',
        symptoms: 'Đau đầu dữ dội, chóng mặt, buồn nôn',
        id: 'CA250602-005',
        time: '14:05 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '5 phút',
        chatbotSummary: {
          symptoms: ['Đau đầu vùng thái dương', 'Chóng mặt đột ngột', 'Buồn nôn nhẹ'],
          duration: '1 ngày',
          severity: 'Cao',
          initialNote: 'Bệnh nhân nam, 45 tuổi, đau đầu dữ dội vùng thái dương bên trái từ sáng nay, kèm cảm giác chóng mặt quay cuồng khi đứng dậy và buồn nôn nhẹ. Tiền sử huyết áp bình thường.'
        },
        allergies: 'Không ghi nhận dị ứng',
        currentMeds: 'Không sử dụng thuốc thường xuyên',
        specialNotes: 'Cần kiểm tra huyết áp và nhịp tim tức thì.'
      },
      {
        code: 'CA250602-006',
        patient: 'Hoàng Thị Vy',
        initials: 'HV',
        age: 24,
        gender: 'Nữ',
        phone: '0977 123 321',
        status: 'Đang chờ tư vấn',
        level: 'Thấp',
        symptoms: 'Đau mỏi vai gáy, tê bì tay chân',
        id: 'CA250602-006',
        time: '13:50 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '20 phút',
        chatbotSummary: {
          symptoms: ['Đau vai gáy', 'Tê đầu ngón tay', 'Mỏi cổ'],
          duration: '1 tuần',
          severity: 'Thấp',
          initialNote: 'Bệnh nhân nữ, nhân viên văn phòng, ngồi làm việc máy tính nhiều. Đau âm ỉ vùng cổ vai gáy lan xuống bả vai, thỉnh thoảng tê nhẹ các đầu ngón tay.'
        },
        allergies: 'Dị ứng phấn hoa',
        currentMeds: 'Uống vitamin tổng hợp',
        specialNotes: 'Hướng dẫn tập các bài vận động cổ vai gáy nhẹ nhàng tại chỗ.'
      },
      {
        code: 'CA250602-007',
        patient: 'Vũ Lâm Phong',
        initials: 'LP',
        age: 31,
        gender: 'Nam',
        phone: '0912 345 678',
        status: 'Mới',
        level: 'Cao',
        symptoms: 'Sốt cao đột ngột, rét run, đau mỏi toàn thân',
        id: 'CA250602-007',
        time: '14:15 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '2 phút',
        chatbotSummary: {
          symptoms: ['Sốt cao 39.5°C', 'Rét run từng cơn', 'Đau cơ', 'Mệt lả'],
          duration: '6 giờ',
          severity: 'Cao',
          initialNote: 'Bệnh nhân sốt cao đột ngột từ trưa nay kèm rét run. Đã uống 1 viên Paracetamol 500mg nhưng chưa hạ sốt nhiều.'
        },
        allergies: 'Dị ứng thuốc Penicillin',
        currentMeds: 'Không',
        specialNotes: 'Khuyến nghị chườm ấm, theo dõi sát nhiệt độ cơ thể, uống nhiều nước điện giải.'
      },
      {
        code: 'CA250602-008',
        patient: 'Bùi Minh Tuấn',
        initials: 'MT',
        age: 50,
        gender: 'Nam',
        phone: '0903 888 999',
        status: 'Đang chờ tư vấn',
        level: 'Trung bình',
        symptoms: 'Ho khan, tức ngực nhẹ kéo dài',
        id: 'CA250602-008',
        time: '13:30 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '40 phút',
        chatbotSummary: {
          symptoms: ['Ho khan nhiều', 'Tức ngực nhẹ', 'Hụt hơi khi nói nhanh'],
          duration: '3 tuần',
          severity: 'Trung bình',
          initialNote: 'Bệnh nhân có tiền sử hút thuốc lá nhiều năm. Ho khan kéo dài gần 1 tháng, thỉnh thoảng có cảm giác nghẹn tức ngực nhẹ.'
        },
        allergies: 'Không dị ứng',
        currentMeds: 'Không',
        specialNotes: 'Cần khai thác kỹ thói quen hút thuốc lá và tư vấn chụp X-quang phổi.'
      },
      {
        code: 'CA250602-009',
        patient: 'Trịnh Khánh Vy',
        initials: 'KV',
        age: 28,
        gender: 'Nữ',
        phone: '0938 444 555',
        status: 'Đang chờ tư vấn',
        level: 'Thấp',
        symptoms: 'Dị ứng, nổi mẩn ngứa vùng cổ và ngực',
        id: 'CA250602-009',
        time: '13:20 Hôm nay',
        doctor: 'Dr. Alexander',
        waitingTime: '50 phút',
        chatbotSummary: {
          symptoms: ['Nổi mề đay ngứa', 'Mẩn đỏ cổ và ngực', 'Không khó thở'],
          duration: '2 giờ',
          severity: 'Thấp',
          initialNote: 'Xuất hiện mẩn đỏ ngứa sau khi ăn cơm trưa có món tôm. Không ghi nhận triệu chứng khó thở, không sưng phù mặt hay môi.'
        },
        allergies: 'Nghi ngờ dị ứng tôm',
        currentMeds: 'Không',
        specialNotes: 'Dặn bệnh nhân không gãi, theo dõi các dấu hiệu phù nề đường thở như nghẹn họng.'
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
      ],
      'CA250602-005': [
        { id: 1, who: 'Bệnh nhân', initials: 'VA', time: '14:05', text: 'Chào bác sĩ, tôi bị đau đầu dữ dội từ sáng tới giờ, đứng dậy là chóng mặt quay cuồng muốn ngã.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '14:05', text: 'Thông tin triệu chứng đã được ghi nhận và ưu tiên xử lý.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '14:07', text: 'Chào anh An, anh đau nhiều ở vùng nào của đầu? Có cảm giác buồn nôn hay mắt nhìn mờ đi không?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'VA', time: '14:08', text: 'Dạ đau nhiều bên thái dương trái bác sĩ ạ, hơi buồn nôn một chút. Mắt thì nhìn vẫn bình thường.' }
      ],
      'CA250602-006': [
        { id: 1, who: 'Bệnh nhân', initials: 'HV', time: '13:50', text: 'Bác sĩ ơi em làm văn phòng suốt ngày đau nhức mỏi cổ vai gáy quá, mấy hôm nay còn tê tê đầu ngón tay.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '13:50', text: 'Triệu chứng cổ vai gáy đã được gửi tới bác sĩ.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '13:52', text: 'Chào Vy, em bị tê ngón tay ở cả hai bàn tay hay chỉ một bên? Khi xoay cổ có nghe tiếng lục cục hay đau nhói không?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'HV', time: '13:53', text: 'Dạ chủ yếu là tay phải cầm chuột thôi bác sĩ. Xoay cổ thì đau mỏi âm ỉ chứ không nhói lắm.' }
      ],
      'CA250602-007': [
        { id: 1, who: 'Bệnh nhân', initials: 'LP', time: '14:15', text: 'Chào bác sĩ, tôi bị sốt cao quá, đo nhiệt kế lúc nãy lên tới 39.5 độ C, người lạnh run hết cả lên.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '14:15', text: 'Cảnh báo sốt cao khẩn cấp đã được gửi tới Bác sĩ.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '14:16', text: 'Chào Phong, tôi đã thấy thông tin. Anh hãy uống ngay một viên hạ sốt Paracetamol và lau người bằng nước ấm nhé. Có kèm ho hay đau bụng không?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'LP', time: '14:17', text: 'Dạ tôi uống thuốc lúc trưa rồi mà chưa thấy hạ nhiều. Không đau bụng, chỉ đau mỏi cơ khớp thôi bác sĩ.' }
      ],
      'CA250602-008': [
        { id: 1, who: 'Bệnh nhân', initials: 'MT', time: '13:30', text: 'Chào bác sĩ, tôi bị ho khan kéo dài mấy tuần nay rồi, ngực cứ âm ỉ tức nhẹ, đi bộ nhanh là thấy hụt hơi.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '13:30', text: 'Triệu chứng ho kéo dài đã được chuyển đến bác sĩ chuyên khoa.', system: true }
      ],
      'CA250602-009': [
        { id: 1, who: 'Bệnh nhân', initials: 'KV', time: '13:20', text: 'Chào bác sĩ, trưa nay tôi có ăn cơm với tôm, sau đó khoảng 1 tiếng thì cổ với ngực nổi đầy mẩn đỏ ngứa ngáy quá.' },
        { id: 2, who: 'Trợ lý AI', initials: 'AI', time: '13:20', text: 'Tóm tắt triệu chứng dị ứng thức ăn đã được chuyển đi.', system: true },
        { id: 3, who: 'Bác sĩ', initials: 'BS', time: '13:22', text: 'Chào chị Vy, chị có thấy ngứa họng, khó thở hay sưng môi mặt gì không? Trước đây chị đã từng bị dị ứng tôm chưa?', mine: true },
        { id: 4, who: 'Bệnh nhân', initials: 'KV', time: '13:23', text: 'Dạ không khó thở, mặt cũng bình thường bác sĩ. Hồi nhỏ tôi ăn tôm thỉnh thoảng hơi ngứa nhẹ thôi chứ chưa nổi nhiều thế này.' }
      ],
      'CA250602-101': [
        { id: 1, who: 'Bệnh nhân', initials: 'TM', time: '09:00', text: 'Chào bác sĩ, mấy hôm nay tôi bị ho khan và sốt nhẹ.' },
        { id: 2, who: 'Bác sĩ', initials: 'BS', time: '09:02', text: 'Chào chị Mai, chị đã dùng thuốc hạ sốt nào chưa? Cổ họng có đau rát nhiều không?', mine: true },
        { id: 3, who: 'Bệnh nhân', initials: 'TM', time: '09:03', text: 'Dạ tôi chưa uống thuốc gì, họng hơi ngứa và rát.' }
      ],
      'CA250602-102': [
        { id: 1, who: 'Bệnh nhân', initials: 'PM', time: '10:15', text: 'Thưa bác sĩ, tôi hay bị ợ chua và đau âm ỉ vùng thượng vị sau khi ăn.' },
        { id: 2, who: 'Bác sĩ', initials: 'BS', time: '10:17', text: 'Chào anh Minh, triệu chứng này kéo dài bao lâu rồi? Anh có ăn đồ cay nóng hay căng thẳng nhiều không?', mine: true },
        { id: 3, who: 'Bệnh nhân', initials: 'PM', time: '10:18', text: 'Dạ đợt này công việc áp lực nên tôi hay thức khuya và uống cà phê nhiều.' }
      ],
      'CA250602-103': [
        { id: 1, who: 'Bệnh nhân', initials: 'VA', time: '11:00', text: 'Tôi bị đau đầu dữ dội vùng thái dương trái từ sáng tới giờ, đứng dậy là chóng mặt quay cuồng.' },
        { id: 2, who: 'Bác sĩ', initials: 'BS', time: '11:02', text: 'Chào anh An, anh có cảm giác buồn nôn hay mắt nhìn mờ đi không? Hãy nằm nghỉ ngơi hoàn toàn nhé.', mine: true },
        { id: 3, who: 'Bệnh nhân', initials: 'VA', time: '11:03', text: 'Dạ hơi buồn nôn nhẹ thôi bác sĩ. Mắt vẫn nhìn rõ.' }
      ],
      'CA250602-104': [
        { id: 1, who: 'Bệnh nhân', initials: 'HV', time: '14:20', text: 'Em bị đau nhức mỏi vùng cổ vai gáy quá bác sĩ ạ, lan xuống bả vai tê cả ngón tay.' },
        { id: 2, who: 'Bác sĩ', initials: 'BS', time: '14:22', text: 'Chào Vy, em làm văn phòng ngồi máy tính nhiều đúng không? Tê ngón tay có xảy ra thường xuyên không?', mine: true },
        { id: 3, who: 'Bệnh nhân', initials: 'HV', time: '14:23', text: 'Dạ em ngồi máy tính 8 tiếng/ngày. Tê ngón tay thỉnh thoảng mới bị khi gõ phím lâu.' }
      ],
      'CA250602-105': [
        { id: 1, who: 'Bệnh nhân', initials: 'LP', time: '15:10', text: 'Chào bác sĩ, tôi bị sốt cao đột ngột kèm rét run từ trưa nay.' },
        { id: 2, who: 'Bác sĩ', initials: 'BS', time: '15:12', text: 'Chào anh Phong, nhiệt độ cơ thể hiện tại là bao nhiêu? Hãy uống ngay 1 viên Paracetamol hạ sốt.', mine: true },
        { id: 3, who: 'Bệnh nhân', initials: 'LP', time: '15:13', text: 'Dạ tôi đo là 39.2 độ C, đã uống thuốc và đang chườm ấm.' }
      ],
      'CA250602-106': [
        { id: 1, who: 'Bệnh nhân', initials: 'MT', time: '16:00', text: 'Chào bác sĩ, tôi ho khan kéo dài hơn 3 tuần nay rồi, đi bộ nhanh là thấy hụt hơi.' },
        { id: 2, who: 'Bác sĩ', initials: 'BS', time: '16:03', text: 'Chào anh Tuấn, anh có hút thuốc lá nhiều năm không? Có kèm tức ngực hay khò khè không?', mine: true },
        { id: 3, who: 'Bệnh nhân', initials: 'MT', time: '16:04', text: 'Dạ tôi hút thuốc lá 15 năm rồi, thỉnh thoảng có nặng ngực nhẹ khi ho.' }
      ],
      'CA250602-107': [
        { id: 1, who: 'Bệnh nhân', initials: 'KV', time: '16:30', text: 'Tôi bị nổi đầy mẩn đỏ ngứa ngáy khắp cổ và ngực sau khi ăn cơm trưa có tôm.' },
        { id: 2, who: 'Bác sĩ', initials: 'BS', time: '16:32', text: 'Chào chị Vy, chị có bị ngứa họng, khó thở hay sưng phù môi mắt gì không?', mine: true },
        { id: 3, who: 'Bệnh nhân', initials: 'KV', time: '16:33', text: 'Dạ không khó thở, mắt môi bình thường chỉ bị ngứa da thôi.' }
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
      },
      {
        id: 'HS-004',
        code: 'CA250602-101',
        patient: 'Trần Thị Mai',
        age: 42,
        gender: 'Nữ',
        phone: '0901 234 567',
        date: '02/06/2026',
        time: '09:00',
        clinic: 'MedConsult Online',
        diagnosis: 'Cảm cúm mùa',
        prescription: [
          { name: 'Paracetamol 500mg', dose: '1 viên/lần, ngày 3 lần', note: 'Uống sau ăn khi sốt trên 38.5 độ' },
          { name: 'Vitamin C 500mg', dose: '1 viên/ngày', note: 'Uống sau ăn sáng' }
        ],
        rating: 5,
        symptoms: 'Sốt nhẹ, mệt mỏi, ho khan',
        note: 'Triệu chứng cảm cúm nhẹ, không khó thở. Khuyên uống nhiều nước ấm và bù oresol.',
        comment: 'Bác sĩ phản hồi nhanh, giải thích dễ hiểu.',
        actionPath: 'Theo dõi tại nhà'
      },
      {
        id: 'HS-005',
        code: 'CA250602-102',
        patient: 'Phạm Quang Minh',
        age: 29,
        gender: 'Nam',
        phone: '0917 445 882',
        date: '01/06/2026',
        time: '10:15',
        clinic: 'MedConsult Online',
        diagnosis: 'Trào ngược dạ dày thực quản (GERD)',
        prescription: [
          { name: 'Esomeprazole 20mg', dose: '1 viên/ngày', note: 'Uống trước ăn sáng 30 phút' },
          { name: 'Phosphalugel', dose: '1 gói/lần, ngày 2 lần', note: 'Uống khi đau hoặc sau ăn 2 tiếng' }
        ],
        rating: 5,
        symptoms: 'Ợ chua, đau thượng vị',
        note: 'Đau thượng vị cấp tính do stress và ăn uống không điều độ. Tránh thức khuya và hạn chế cà phê.',
        comment: 'Lời khuyên sinh hoạt rất hữu ích, triệu chứng giảm rõ rệt.',
        actionPath: 'Theo dõi tại nhà'
      },
      {
        id: 'HS-006',
        code: 'CA250602-103',
        patient: 'Nguyễn Văn An',
        age: 45,
        gender: 'Nam',
        phone: '0988 777 666',
        date: '30/05/2026',
        time: '11:00',
        clinic: 'MedConsult Online',
        diagnosis: 'Đau đầu vận mạch',
        prescription: [
          { name: 'Paracetamol 500mg', dose: '1 viên/lần khi đau', note: 'Khoảng cách tối thiểu 4-6 tiếng' },
          { name: 'Magne B6', dose: '1 viên/lần, ngày 2 lần', note: 'Uống sau ăn' }
        ],
        rating: 4,
        symptoms: 'Đau đầu thái dương, chóng mặt',
        note: 'Đau đầu dữ dội do co thắt mạch máu. Khuyên nằm nghỉ ngơi ở không gian tối và yên tĩnh.',
        comment: 'Bác sĩ dặn dò rất kỹ về tư thế nghỉ ngơi.',
        actionPath: 'Theo dõi tại nhà'
      },
      {
        id: 'HS-007',
        code: 'CA250602-104',
        patient: 'Hoàng Thị Vy',
        age: 24,
        gender: 'Nữ',
        phone: '0977 123 321',
        date: '28/05/2026',
        time: '14:20',
        clinic: 'MedConsult Online',
        diagnosis: 'Hội chứng cổ vai gáy cấp',
        prescription: [
          { name: 'Meloxicam 7.5mg', dose: '1 viên/ngày', note: 'Uống sau ăn no' },
          { name: 'Eperisone 50mg', dose: '1 viên/lần, ngày 2 lần', note: 'Uống sau ăn' }
        ],
        rating: 5,
        symptoms: 'Đau cổ vai gáy, tê ngón tay',
        note: 'Căng cơ vùng vai cổ do ngồi làm việc máy tính sai tư thế. Hướng dẫn các bài tập kéo giãn cơ nhẹ.',
        comment: 'Bài tập bác sĩ hướng dẫn hiệu quả tức thì.',
        actionPath: 'Tái khám sau 2 tuần'
      },
      {
        id: 'HS-008',
        code: 'CA250602-105',
        patient: 'Vũ Lâm Phong',
        age: 31,
        gender: 'Nam',
        phone: '0912 345 678',
        date: '24/05/2026',
        time: '15:10',
        clinic: 'MedConsult Online',
        diagnosis: 'Sốt siêu vi',
        prescription: [
          { name: 'Paracetamol 500mg', dose: '1 viên/lần, ngày 3 lần', note: 'Uống sau ăn khi sốt trên 38.5' },
          { name: 'Oresol 245', dose: '1 gói/ngày', note: 'Pha với 200ml nước đun sôi để nguội, uống rải rác' }
        ],
        rating: 5,
        symptoms: 'Sốt cao đột ngột, rét run',
        note: 'Sốt siêu vi gây mất nước điện giải. Theo dõi sát thân nhiệt, lau ấm liên tục.',
        comment: 'Nhờ bác sĩ nhắc bù nước kịp thời nên tôi mau khỏe.',
        actionPath: 'Theo dõi tại nhà'
      },
      {
        id: 'HS-009',
        code: 'CA250602-106',
        patient: 'Bùi Minh Tuấn',
        age: 50,
        gender: 'Nam',
        phone: '0903 888 999',
        date: '20/05/2026',
        time: '16:00',
        clinic: 'Phòng khám Đa khoa Tâm An',
        diagnosis: 'Viêm phế quản mạn tính đợt cấp',
        prescription: [
          { name: 'Acetylcysteine 200mg', dose: '1 gói/lần, ngày 3 lần', note: 'Uống sau ăn' },
          { name: 'Salbutamol xịt', dose: '1-2 nhát khi khó thở', note: 'Tối đa không quá 8 nhát/ngày' }
        ],
        rating: 4,
        symptoms: 'Ho kéo dài, tức ngực, hụt hơi',
        note: 'Ho dai dẳng kèm co thắt phế quản nhẹ. Khuyên cai thuốc lá khẩn cấp và đi chụp X-quang phổi.',
        comment: 'Bác sĩ cảnh báo rất nghiêm túc về tác hại của thuốc lá.',
        actionPath: 'Đến phòng khám'
      },
      {
        id: 'HS-010',
        code: 'CA250602-107',
        patient: 'Trịnh Khánh Vy',
        age: 28,
        gender: 'Nữ',
        phone: '0938 444 555',
        date: '15/05/2026',
        time: '16:30',
        clinic: 'MedConsult Online',
        diagnosis: 'Mề đay dị ứng do thức ăn',
        prescription: [
          { name: 'Loratadine 10mg', dose: '1 viên/ngày', note: 'Uống tối trước khi đi ngủ' }
        ],
        rating: 5,
        symptoms: 'Nổi mẩn ngứa da sau ăn hải sản',
        note: 'Dị ứng cấp tính thể nhẹ sau khi ăn tôm. Kiêng gãi mạnh, kiêng ăn hải sản trong vòng 1 tuần.',
        comment: 'Uống thuốc xong tối ngủ ngon, không bị ngứa nữa.',
        actionPath: 'Theo dõi tại nhà'
      }
    ]
    localStorage.setItem('med_histories', JSON.stringify(initialHistories))
  }

  const existingSchedule = localStorage.getItem('med_schedule')
  let parseSchedule = []
  if (existingSchedule) {
    try {
      parseSchedule = JSON.parse(existingSchedule)
    } catch (e) {}
  }

  const hasOldMockDates = !existingSchedule || parseSchedule.length < 10 || parseSchedule.some(item => item.date && (item.date.endsWith('/05') || item.date === '19/05' || item.id === 'SCH-100'))

  if (hasOldMockDates) {
    // Seed schedules with dynamic dates relative to today
    const relativeSchedules = [
      { offset: 0, timeSlot: '08:00 - 08:30', patientName: 'Nguyễn Văn Minh', type: 'Khám trực tiếp', room: 'Phòng 201', priority: 'Trung bình', status: 'Đã xác nhận', symptoms: 'Đau đầu, chóng mặt nhẹ' },
      { offset: 0, timeSlot: '10:30 - 11:00', patientName: 'Trần Thị Mai', type: 'Tư vấn trực tuyến', room: 'Online', priority: 'Cao', status: 'Đã xác nhận', symptoms: 'Sốt cao 38.5 độ, ho khan' },
      { offset: 0, timeSlot: '14:00 - 14:30', patientName: 'Lê Hoàng Nam', type: 'Tư vấn trực tuyến', room: 'Online', priority: 'Thấp', status: 'Chờ xác nhận', symptoms: 'Ngứa da, nổi mẩn nhẹ' },
      { offset: 1, timeSlot: '09:00 - 09:30', patientName: 'Phạm Minh Đức', type: 'Khám trực tiếp', room: 'Phòng 105', priority: 'Trung bình', status: 'Đã xác nhận', symptoms: 'Đau mỏi khớp gối khi vận động' },
      { offset: 1, timeSlot: '15:30 - 16:00', patientName: 'Vũ Hoàng Yến', type: 'Tư vấn trực tuyến', room: 'Online', priority: 'Cao', status: 'Đã xác nhận', symptoms: 'Đau tức ngực nhẹ sau khi chạy bộ' },
      { offset: 2, timeSlot: '08:30 - 09:00', patientName: 'Đỗ Gia Huy', type: 'Khám trực tiếp', room: 'Phòng 201', priority: 'Thấp', status: 'Đã xác nhận', symptoms: 'Nghẹt mũi, chảy nước mũi' },
      { offset: -1, timeSlot: '10:00 - 10:30', patientName: 'Ngô Quốc Anh', type: 'Khám trực tiếp', room: 'Phòng 203', priority: 'Trung bình', status: 'Đã xác nhận', symptoms: 'Đau bụng âm ỉ vùng thượng vị' },
      { offset: -1, timeSlot: '16:30 - 17:00', patientName: 'Nguyễn Thị Lan', type: 'Tư vấn trực tuyến', room: 'Online', priority: 'Thấp', status: 'Đã xác nhận', symptoms: 'Tư vấn chế độ dinh dưỡng giảm cân' },
      { offset: -2, timeSlot: '09:30 - 10:00', patientName: 'Hoàng Văn Bình', type: 'Khám trực tiếp', room: 'Phòng 102', priority: 'Cao', status: 'Đã xác nhận', symptoms: 'Tê bì tay chân kéo dài' },
      { offset: 3, timeSlot: '11:00 - 11:30', patientName: 'Bùi Thị Dung', type: 'Tư vấn trực tuyến', room: 'Online', priority: 'Trung bình', status: 'Chờ xác nhận', symptoms: 'Ù tai, đau họng nhẹ' }
    ]

    const initialSchedule = relativeSchedules.map((item, idx) => {
      const d = new Date()
      d.setDate(d.getDate() + item.offset)
      const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
      
      const weekdays = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
      const dayLabel = weekdays[d.getDay()]
      
      return {
        id: `SCH-${101 + idx}`,
        date: dateStr,
        day: dayLabel,
        patientName: item.patientName,
        type: item.type,
        room: item.room,
        priority: item.priority,
        status: item.status,
        timeSlot: item.timeSlot,
        symptoms: item.symptoms
      }
    })
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
  if (resultData.actionPath.includes('Tái khám') && resultData.reExamDate) {
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
