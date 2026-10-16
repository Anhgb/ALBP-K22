// src/api/axios.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  MOCK_USERS,
  MOCK_COURTS,
  MOCK_MATCHES,
  MOCK_MY_BOOKINGS,
  generateMockSlots,
} from './mockData';

// ── Tạo axios instance ────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 8000,
});

// ── Request Interceptor: Gắn Bearer Token ─────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Mock API Router: Giả lập phản hồi khi Backend offline hoặc bật Mock ───────
const handleMockFallback = (config) => {
  const url = config.url ?? '';
  const method = (config.method ?? 'get').toLowerCase();

  console.warn(`[Mock API] Đang giả lập dữ liệu cho: ${method.toUpperCase()} ${url}`);

  // 1. Auth Login
  if (url.includes('/auth/login') && method === 'post') {
    const user = MOCK_USERS.find((u) => u.email === config.data?.email) || MOCK_USERS[3];
    return {
      data: {
        success: true,
        message: 'Đăng nhập giả lập thành công!',
        data: {
          token: 'mock-jwt-token-smashmatch-' + Date.now(),
          token_type: 'Bearer',
          user,
        },
      },
      status: 200,
    };
  }

  // 2. Auth Register
  if (url.includes('/auth/register') && method === 'post') {
    const body = config.data || {};
    return {
      data: {
        success: true,
        message: 'Đăng ký giả lập thành công!',
        data: {
          token: 'mock-jwt-token-smashmatch-' + Date.now(),
          token_type: 'Bearer',
          user: {
            id: Date.now(),
            name: body.name || 'Người chơi mới',
            email: body.email || 'newplayer@smashmatch.vn',
            role: body.role || 'player',
            rating_score: 5.0,
            matches_played: 0,
          },
        },
      },
      status: 201,
    };
  }

  // 3. Courts List
  if (url === '/courts' && method === 'get') {
    return {
      data: { success: true, data: MOCK_COURTS },
      status: 200,
    };
  }

  // 4. Court Slots
  const slotMatch = url.match(/\/courts\/(\d+)\/slots/);
  if (slotMatch && method === 'get') {
    const courtId = Number(slotMatch[1]);
    const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];
    const dateStr = config.params?.date || new Date().toISOString().split('T')[0];
    return {
      data: {
        success: true,
        data: {
          court_id: courtId,
          court_name: court.name,
          date: dateStr,
          slots: generateMockSlots(courtId, dateStr),
        },
      },
      status: 200,
    };
  }

  // 5. Single Court Detail
  const courtMatch = url.match(/\/courts\/(\d+)$/);
  if (courtMatch && method === 'get') {
    const courtId = Number(courtMatch[1]);
    const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];
    return {
      data: { success: true, data: court },
      status: 200,
    };
  }

  // 6. Matchmaking Posts
  if (url.startsWith('/matches') && method === 'get') {
    return {
      data: { success: true, data: MOCK_MATCHES },
      status: 200,
    };
  }

  // 7. Create Match
  if (url === '/matches' && method === 'post') {
    const body = config.data || {};
    const newMatch = {
      id: Date.now(),
      creator: useAuthStore.getState().user || MOCK_USERS[3],
      level_required: body.level_required || 'Trung bình',
      slots_needed: Number(body.slots_needed || 2),
      slots_remaining: Number(body.slots_needed || 2),
      estimated_cost_per_person: Number(body.estimated_cost_per_person || 40000),
      note: body.note || 'Tìm bạn giao lưu cầu lông tại Huế',
      status: 'open',
      requests_count: 0,
      requests: [],
      created_at: new Date().toISOString(),
    };
    return {
      data: {
        success: true,
        message: 'Tạo bài đăng ghép kèo giả lập thành công!',
        data: newMatch,
      },
      status: 201,
    };
  }

  // 8. Join Match
  if (url.match(/\/matches\/\d+\/requests/) && method === 'post') {
    return {
      data: {
        success: true,
        message: 'Gửi yêu cầu tham gia giả lập thành công!',
      },
      status: 201,
    };
  }

  // 9. My Bookings
  if (url === '/bookings' && method === 'get') {
    return {
      data: { success: true, data: MOCK_MY_BOOKINGS },
      status: 200,
    };
  }

  // 10. Book a Slot
  if (url === '/bookings' && method === 'post') {
    const code = 'SMASH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      data: {
        success: true,
        message: 'Đặt sân thành công (Chế độ giả lập)!',
        data: {
          id: Date.now(),
          checkin_code: code,
          total_price: 100000,
          payment_status: 'pending',
          created_at: new Date().toISOString(),
        },
      },
      status: 201,
    };
  }

  // 11. Mock Webhook Payment
  if (url.includes('/webhooks/payment') && method === 'post') {
    const body = config.data || {};
    const bId = body.booking_id;
    const code = body.checkin_code;

    const targetBooking = MOCK_MY_BOOKINGS.find(
      (b) => (bId && b.id === Number(bId)) || (code && b.checkin_code === code)
    );

    if (targetBooking) {
      targetBooking.payment_status = body.payment_status || 'paid';
      if (targetBooking.court_slot) {
        targetBooking.court_slot.status = 'booked';
      }
    }

    return {
      data: {
        success: true,
        message: 'Mô phỏng thanh toán Webhook thành công! Đã chuyển trạng thái sang PAID.',
        data: targetBooking,
      },
      status: 200,
    };
  }

  return null;
};

// ── Response Interceptor: Tự động fallback mock data khi Backend offline ──────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error');

    // Nếu Backend không phản hồi hoặc gặp lỗi mạng, tự động trả về Mock Data
    if (isNetworkError) {
      const mockRes = handleMockFallback(error.config);
      if (mockRes) {
        return Promise.resolve(mockRes);
      }
    }

    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login?expired=true';
    }

    return Promise.reject(error);
  },
);

export default apiClient;
