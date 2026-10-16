// src/api/mockData.js
// Dữ liệu giả lập (Mock Data) toàn diện, phong phú cho hệ sinh thái SmashMatch 🏸

export const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin SmashMatch',
    email: 'admin@smashmatch.vn',
    role: 'admin',
    rating_score: 5.0,
    matches_played: 145,
    avatar: '🏸',
  },
  {
    id: 2,
    name: 'Trần Văn Phúc (Chủ Sân Hương Giang & Thuận Hóa)',
    email: 'owner1@smashmatch.vn',
    role: 'owner',
    rating_score: 4.9,
    matches_played: 92,
    avatar: '👨‍💼',
  },
  {
    id: 3,
    name: 'Nguyễn Thị Hương (Chủ Sân An Cựu Sport)',
    email: 'owner2@smashmatch.vn',
    role: 'owner',
    rating_score: 4.8,
    matches_played: 68,
    avatar: '👩‍💼',
  },
  {
    id: 4,
    name: 'Lê Minh Tuấn',
    email: 'player1@smashmatch.vn',
    role: 'player',
    rating_score: 5.0,
    matches_played: 36,
    avatar: '⚡',
  },
  {
    id: 5,
    name: 'Phạm Thị Lan',
    email: 'player2@smashmatch.vn',
    role: 'player',
    rating_score: 4.3,
    matches_played: 19,
    avatar: '🌸',
  },
  {
    id: 6,
    name: 'Hoàng Văn Đức',
    email: 'player3@smashmatch.vn',
    role: 'player',
    rating_score: 4.6,
    matches_played: 45,
    avatar: '🔥',
  },
  {
    id: 7,
    name: 'Trần Hữu Nghĩa (Tay vợt Bán chuyên)',
    email: 'player4@smashmatch.vn',
    role: 'player',
    rating_score: 4.9,
    matches_played: 78,
    avatar: '🏆',
  },
  {
    id: 8,
    name: 'Nguyễn Mai Phương',
    email: 'player5@smashmatch.vn',
    role: 'player',
    rating_score: 4.4,
    matches_played: 24,
    avatar: '🏸',
  },
];

export const MOCK_COURTS = [
  {
    id: 1,
    name: 'Sân Cầu Lông Hương Giang',
    address: '14 Lý Thường Kiệt, Phường Vĩnh Ninh, TP. Huế, Thừa Thiên Huế',
    description:
      'Sân cầu lông chất lượng cao nằm ngay trung tâm TP. Huế. Nền sân gỗ tổng hợp PVC chống trơn trượt, đèn LED 500 Lux chống chói. Có sẵn nước uống và dịch vụ cho mượn vợt Kumpoo K520 Pro, Yonex Astrox.',
    is_active: true,
    average_rating: 4.9,
    reviews_count: 28,
    total_courts: 4,
    facilities: ['Thảm PVC chống trượt', 'Đèn LED 500 Lux', 'Phòng thay đồ', 'Bãi đỗ ô tô', 'Wifi miễn phí'],
    owner: { id: 2, name: 'Trần Văn Phúc' },
  },
  {
    id: 2,
    name: 'CLB Cầu Lông Thuận Hóa',
    address: '56 Bà Triệu, Phường Phú Hòa, TP. Huế, Thừa Thiên Huế',
    description:
      'Câu lạc bộ cầu lông lớn nhất khu vực Phú Hòa, gồm 4 sân tiêu chuẩn BWF. Huấn luyện viên chuyên nghiệp hỗ trợ giao lưu. Hỗ trợ mượn vợt VS Titan 7 và cầu Yonex chất lượng.',
    is_active: true,
    average_rating: 4.7,
    reviews_count: 22,
    total_courts: 4,
    facilities: ['4 sân chuẩn BWF', 'HLV hướng dẫn', 'Căng tin giải khát', 'Máy căng vợt điện tử'],
    owner: { id: 2, name: 'Trần Văn Phúc' },
  },
  {
    id: 3,
    name: 'Nhà Thi Đấu An Cựu Sport',
    address: '88 Đinh Tiên Hoàng, Phường An Cựu, TP. Huế, Thừa Thiên Huế',
    description:
      'Khu thể thao tổng hợp An Cựu Sport - điểm đến quen thuộc của các tay vợt phong trào Cố đô Huế. Sân 3 ô, quạt trần công nghiệp thoáng khí, bãi giữ xe máy và ô tô rộng rãi.',
    is_active: true,
    average_rating: 4.8,
    reviews_count: 31,
    total_courts: 3,
    facilities: ['Hệ thống quạt đối lưu gió', 'Trà đá miễn phí', 'Tủ đồ khóa cá nhân', 'Bảo vệ 24/7'],
    owner: { id: 3, name: 'Nguyễn Thị Hương' },
  },
  {
    id: 4,
    name: 'Sân Cầu Lông Xuân Phú',
    address: '22 Hoàng Quốc Việt, Phường Xuân Phú, TP. Huế, Thừa Thiên Huế',
    description:
      'Sân mới khai trương với mặt thảm vân cát chống lật cổ chân cực êm. Phục vụ trà đá miễn phí, có phòng tắm nóng lạnh tiện nghi cho vận động viên sau buổi tập.',
    is_active: true,
    average_rating: 4.9,
    reviews_count: 16,
    total_courts: 3,
    facilities: ['Thảm vân cát cao cấp', 'Phòng tắm nóng lạnh', 'Bán phụ kiện cầu lông', 'Cho thuê giày'],
    owner: { id: 2, name: 'Trần Văn Phúc' },
  },
  {
    id: 5,
    name: 'Sân Cầu Lông Vĩ Dạ Sport',
    address: '102 Nguyễn Sinh Cung, Phường Vĩ Dạ, TP. Huế, Thừa Thiên Huế',
    description:
      'Không gian thể thao thoáng đãng gần cồn Hến ven sông Hương. 4 sân thảm Enlio nhập khẩu, trần cao 9m đạt chuẩn thi đấu giải phong trào.',
    is_active: true,
    average_rating: 4.8,
    reviews_count: 19,
    total_courts: 4,
    facilities: ['Thảm Enlio nhập khẩu', 'Trần cao 9m chuẩn', 'Căng tin nước dừa tươi', 'Không gian cây xanh'],
    owner: { id: 3, name: 'Nguyễn Thị Hương' },
  },
  {
    id: 6,
    name: 'CLB Cầu Lông Tây Lộc',
    address: '75 Lê Duẩn, Phường Tây Lộc, TP. Huế, Thừa Thiên Huế',
    description:
      'Gần cửa Thượng Tứ và Đại Nội Huế. Sân sàn gỗ Maple kết hợp thảm thi đấu chuẩn BWF, phong trào giao lưu sôi nổi từ sáng sớm tới đêm muộn.',
    is_active: true,
    average_rating: 4.7,
    reviews_count: 14,
    total_courts: 4,
    facilities: ['Sàn gỗ Maple giảm chấn', 'Gần Đại Nội Huế', 'Khu vực khán đài', 'Có hội nhóm sinh hoạt hàng tuần'],
    owner: { id: 2, name: 'Trần Văn Phúc' },
  },
];

// Danh sách 12 khung giờ chi tiết trong ngày (từ 05:30 sáng đến 23:45 đêm)
export const DAILY_TIME_TEMPLATES = [
  // ── Buổi sáng (05:30 - 11:30) ───────────────────────────────────────────────
  { start: '05:30:00', end: '07:00:00', price: 60000, label: 'Sáng sớm thể dục', session: 'morning' },
  { start: '07:00:00', end: '08:30:00', price: 70000, label: 'Sáng mát mẻ', session: 'morning' },
  { start: '08:30:00', end: '10:00:00', price: 70000, label: 'Sáng giữa buổi', session: 'morning' },
  { start: '10:00:00', end: '11:30:00', price: 60000, label: 'Trưa sớm (ưu đãi)', session: 'morning' },

  // ── Buổi chiều (12:30 - 18:30) ──────────────────────────────────────────────
  { start: '12:30:00', end: '14:00:00', price: 60000, label: 'Đầu giờ chiều', session: 'afternoon' },
  { start: '14:00:00', end: '15:30:00', price: 80000, label: 'Chiều sớm', session: 'afternoon' },
  { start: '15:30:00', end: '17:00:00', price: 90000, label: 'Chiều tập luyện', session: 'afternoon' },
  { start: '17:00:00', end: '18:30:00', price: 120000, label: 'Chiều tan tầm (Cao điểm)', session: 'afternoon' },

  // ── Buổi tối (18:30 - 23:45) ────────────────────────────────────────────────
  { start: '18:30:00', end: '20:00:00', price: 140000, label: 'Tối vàng (Cao điểm)', session: 'evening' },
  { start: '20:00:00', end: '21:30:00', price: 140000, label: 'Tối vàng (Giao lưu)', session: 'evening' },
  { start: '21:30:00', end: '22:45:00', price: 90000, label: 'Tối muộn', session: 'evening' },
  { start: '22:45:00', end: '23:45:00', price: 70000, label: 'Đêm muộn thể lực', session: 'evening' },
];

/**
 * Sinh danh sách 12 khung giờ cho bất kỳ ngày nào, với trạng thái chân thực
 * (có slot trống, slot đang giữ chỗ pending, slot đã đặt booked).
 */
export const generateMockSlots = (courtId, dateStr) => {
  // Chuyển dateStr (YYYY-MM-DD) thành số để sinh seed giả lập nhất quán
  const dateHash = dateStr.split('-').reduce((acc, part) => acc * 31 + parseInt(part, 10), 0);

  return DAILY_TIME_TEMPLATES.map((tmpl, index) => {
    // Tính toán trạng thái giả lập chân thực nhưng cố định cho từng ngày/sân
    const slotSeed = (dateHash + courtId * 17 + index * 11) % 100;

    let status = 'available';
    // Khung giờ vàng 17:00 - 21:30 có tỷ lệ đặt cao hơn
    const isPeakHour = tmpl.session === 'evening' || tmpl.start === '17:00:00';

    if (isPeakHour) {
      if (slotSeed < 45) {
        status = 'booked';
      } else if (slotSeed < 65) {
        status = 'pending';
      } else {
        status = 'available';
      }
    } else {
      if (slotSeed < 20) {
        status = 'booked';
      } else if (slotSeed < 32) {
        status = 'pending';
      } else {
        status = 'available';
      }
    }

    const slotId = courtId * 1000 + index * 10 + (dateHash % 7) + 1;

    return {
      id: slotId,
      court_id: courtId,
      play_date: dateStr,
      start_time: tmpl.start,
      end_time: tmpl.end,
      price: tmpl.price,
      label: tmpl.label,
      status: status,
      is_bookable: status === 'available',
    };
  });
};

export const MOCK_MATCHES = [
  {
    id: 1,
    user_id: 4,
    creator: {
      id: 4,
      name: 'Lê Minh Tuấn',
      email: 'player1@smashmatch.vn',
      role: 'player',
      rating_score: 5.0,
      matches_played: 36,
      avatar: '⚡',
    },
    booking_id: 1,
    booking: {
      id: 1,
      checkin_code: 'SMASH-HUE2026',
      total_price: 140000,
      payment_status: 'paid',
      court_slot: {
        id: 1009,
        play_date: new Date().toISOString().split('T')[0],
        start_time: '18:30:00',
        end_time: '20:00:00',
        status: 'booked',
        court: {
          id: 1,
          name: 'Sân Cầu Lông Hương Giang',
          address: '14 Lý Thường Kiệt, P. Vĩnh Ninh, TP. Huế',
        },
      },
    },
    level_required: 'Khá',
    slots_needed: 2,
    slots_accepted_count: 1,
    slots_remaining: 1,
    estimated_cost_per_person: 50000,
    note: 'Tối nay mình đã đặt sân Hương Giang khung 18:30-20:00. Đang thiếu 1 người nữa để đánh đôi nam-nữ hoặc đôi nam. Có sẵn vợt Kumpoo K520 Pro và VS Titan 7 cho mượn!',
    status: 'open',
    requests_count: 2,
    requests: [
      {
        id: 101,
        post_id: 1,
        requester_id: 5,
        requester: { id: 5, name: 'Phạm Thị Lan', rating_score: 4.3, matches_played: 19 },
        status: 'accepted',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 102,
        post_id: 1,
        requester_id: 6,
        requester: { id: 6, name: 'Hoàng Văn Đức', rating_score: 4.6, matches_played: 45 },
        status: 'pending',
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 2,
    user_id: 6,
    creator: {
      id: 6,
      name: 'Hoàng Văn Đức',
      email: 'player3@smashmatch.vn',
      role: 'player',
      rating_score: 4.6,
      matches_played: 45,
      avatar: '🔥',
    },
    booking_id: 2,
    booking: {
      id: 2,
      checkin_code: 'SMASH-THUANHOA',
      total_price: 120000,
      payment_status: 'paid',
      court_slot: {
        id: 2008,
        play_date: new Date().toISOString().split('T')[0],
        start_time: '17:00:00',
        end_time: '18:30:00',
        status: 'booked',
        court: {
          id: 2,
          name: 'CLB Cầu Lông Thuận Hóa',
          address: '56 Bà Triệu, P. Phú Hòa, TP. Huế',
        },
      },
    },
    level_required: 'Trung bình',
    slots_needed: 2,
    slots_accepted_count: 1,
    slots_remaining: 1,
    estimated_cost_per_person: 40000,
    note: 'Chiều nay tan làm cần thêm bạn đánh giao lưu vui vẻ, sân Thuận Hóa 17:00-18:30. Dùng cầu Yonex AS-05 xịn, có nước mát trà đá sẵn sàng.',
    status: 'open',
    requests_count: 1,
    requests: [
      {
        id: 103,
        post_id: 2,
        requester_id: 8,
        requester: { id: 8, name: 'Nguyễn Mai Phương', rating_score: 4.4, matches_played: 24 },
        status: 'accepted',
        created_at: new Date(Date.now() - 5400000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 3,
    user_id: 7,
    creator: {
      id: 7,
      name: 'Trần Hữu Nghĩa',
      email: 'player4@smashmatch.vn',
      role: 'player',
      rating_score: 4.9,
      matches_played: 78,
      avatar: '🏆',
    },
    booking_id: 3,
    booking: {
      id: 3,
      checkin_code: 'SMASH-ANCUU-PRO',
      total_price: 140000,
      payment_status: 'paid',
      court_slot: {
        id: 3010,
        play_date: new Date().toISOString().split('T')[0],
        start_time: '20:00:00',
        end_time: '21:30:00',
        status: 'booked',
        court: {
          id: 3,
          name: 'Nhà Thi Đấu An Cựu Sport',
          address: '88 Đinh Tiên Hoàng, P. An Cựu, TP. Huế',
        },
      },
    },
    level_required: 'Bán chuyên',
    slots_needed: 2,
    slots_accepted_count: 0,
    slots_remaining: 2,
    estimated_cost_per_person: 55000,
    note: 'Kèo cọ xát tốc độ cao, đập cầu tấn công đôi nam chuẩn bị cho giải phong trào Thừa Thiên Huế. Yêu cầu thể lực tốt và phản xạ nhanh.',
    status: 'open',
    requests_count: 0,
    requests: [],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 4,
    user_id: 5,
    creator: {
      id: 5,
      name: 'Phạm Thị Lan',
      email: 'player2@smashmatch.vn',
      role: 'player',
      rating_score: 4.3,
      matches_played: 19,
      avatar: '🌸',
    },
    booking_id: null,
    booking: null,
    level_required: 'Mới chơi',
    slots_needed: 3,
    slots_accepted_count: 0,
    slots_remaining: 3,
    estimated_cost_per_person: 30000,
    note: 'Nhóm mới tập chơi rủ các bạn cùng trình độ giao lưu cuối tuần. Chưa chốt sân, mọi người vào thảo luận rồi cùng đặt sân gần khu vực trung tâm nhé!',
    status: 'open',
    requests_count: 1,
    requests: [
      {
        id: 104,
        post_id: 4,
        requester_id: 4,
        requester: { id: 4, name: 'Lê Minh Tuấn', rating_score: 5.0, matches_played: 36 },
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 5,
    user_id: 8,
    creator: {
      id: 8,
      name: 'Nguyễn Mai Phương',
      email: 'player5@smashmatch.vn',
      role: 'player',
      rating_score: 4.4,
      matches_played: 24,
      avatar: '🏸',
    },
    booking_id: 4,
    booking: {
      id: 4,
      checkin_code: 'SMASH-VIDA-MORNING',
      total_price: 70000,
      payment_status: 'paid',
      court_slot: {
        id: 5002,
        play_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '07:00:00',
        end_time: '08:30:00',
        status: 'booked',
        court: {
          id: 5,
          name: 'Sân Cầu Lông Vĩ Dạ Sport',
          address: '102 Nguyễn Sinh Cung, P. Vĩ Dạ, TP. Huế',
        },
      },
    },
    level_required: 'Trung bình',
    slots_needed: 2,
    slots_accepted_count: 1,
    slots_remaining: 1,
    estimated_cost_per_person: 35000,
    note: 'Sáng mai đánh cầu đón bình minh ven sông Hương tại Vĩ Dạ Sport! Không khí trong lành, sau trận đi ăn bún bò và cafe giao lưu.',
    status: 'open',
    requests_count: 1,
    requests: [],
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 6,
    user_id: 4,
    creator: {
      id: 4,
      name: 'Lê Minh Tuấn',
      email: 'player1@smashmatch.vn',
      role: 'player',
      rating_score: 5.0,
      matches_played: 36,
      avatar: '⚡',
    },
    booking_id: null,
    booking: null,
    level_required: 'Khá',
    slots_needed: 2,
    slots_accepted_count: 0,
    slots_remaining: 2,
    estimated_cost_per_person: 45000,
    note: 'Tìm đồng đội đánh đôi tại CLB Tây Lộc cuối tuần này. Ai thuận tay trái đánh cặp là tuyệt vời nhất!',
    status: 'open',
    requests_count: 0,
    requests: [],
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
];

export const MOCK_MY_BOOKINGS = [
  {
    id: 1,
    checkin_code: 'SMASH-791A4B',
    total_price: 140000,
    payment_status: 'paid',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    court_slot: {
      id: 1009,
      play_date: new Date().toISOString().split('T')[0],
      start_time: '18:30:00',
      end_time: '20:00:00',
      status: 'booked',
      court: {
        id: 1,
        name: 'Sân Cầu Lông Hương Giang',
        address: '14 Lý Thường Kiệt, Phường Vĩnh Ninh, TP. Huế',
      },
    },
  },
  {
    id: 2,
    checkin_code: 'SMASH-ANCUU99',
    total_price: 70000,
    payment_status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    court_slot: {
      id: 3002,
      play_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      start_time: '07:00:00',
      end_time: '08:30:00',
      status: 'pending',
      court: {
        id: 3,
        name: 'Nhà Thi Đấu An Cựu Sport',
        address: '88 Đinh Tiên Hoàng, Phường An Cựu, TP. Huế',
      },
    },
  },
  {
    id: 3,
    checkin_code: 'SMASH-VIDA-NIGHT',
    total_price: 140000,
    payment_status: 'paid',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    court_slot: {
      id: 5010,
      play_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      start_time: '20:00:00',
      end_time: '21:30:00',
      status: 'booked',
      court: {
        id: 5,
        name: 'Sân Cầu Lông Vĩ Dạ Sport',
        address: '102 Nguyễn Sinh Cung, Phường Vĩ Dạ, TP. Huế',
      },
    },
  },
  {
    id: 4,
    checkin_code: 'SMASH-XUANPHU88',
    total_price: 90000,
    payment_status: 'paid',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    court_slot: {
      id: 4007,
      play_date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      start_time: '15:30:00',
      end_time: '17:00:00',
      status: 'booked',
      court: {
        id: 4,
        name: 'Sân Cầu Lông Xuân Phú',
        address: '22 Hoàng Quốc Việt, Phường Xuân Phú, TP. Huế',
      },
    },
  },
];
