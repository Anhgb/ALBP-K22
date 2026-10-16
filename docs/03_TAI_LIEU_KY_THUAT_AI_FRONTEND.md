# 💻 SMASHMATCH — TÀI LIỆU KỸ THUẬT PHÍA FRONTEND (FRONTEND TECHNICAL ARCHITECTURE & AI IMPLEMENTATION)
**Hệ Thống Đặt Sân Cầu Lông Trực Tuyến & Ghép Kèo Thể Thao Thông Minh**
*Phiên bản:* 1.0.0 | *Công nghệ:* React 18 + Vite + TailwindCSS + TanStack Query v5 + Zustand | *Ngày cập nhật:* 2026-10-16

---

## 1. TỔNG QUAN KIẾN TRÚC FRONTEND (SPA ARCHITECTURE)

Hệ thống frontend của SmashMatch được xây dựng theo mô hình **Single Page Application (SPA)** hiện đại, tách biệt hoàn toàn với Backend API. 

### 1.1. Bảng công nghệ chính (Tech Stack)
* **Core:** React 18.3+ (Sử dụng Functional Components & Hooks chuẩn mực).
* **Build Tool:** Vite 5.x (Tối ưu Hot Module Replacement, build nhanh, bundle siêu nhẹ).
* **Styling:** Tailwind CSS 3.4+ với cấu hình tùy chỉnh màu thể thao và Dark/Light mode (`class` strategy).
* **Server State & Data Fetching:** TanStack Query v5 (`@tanstack/react-query`) kết hợp Axios cho cơ chế caching, deduplication và tự động refetch ma trận lịch sân.
* **Client / UI State:** Zustand 5.x (Quản lý Auth Token, Theme Dark/Light, Bản nháp đặt sân).
* **Routing:** React Router DOM v6.26+ với hệ thống Route lồng ghép (Nested Routes) và Route bảo vệ (Protected Routes).
* **Icons & UI Utilities:** `lucide-react`, `clsx`, `tailwind-merge`.

---

## 2. CẤU TRÚC THƯ MỤC CHUẨN MỰC (DIRECTORY STRUCTURE)

Dự án tuân thủ cấu trúc phân tầng rõ ràng (Layered Folder Convention), AI khi tạo file mới bắt buộc đặt đúng vị trí:

```
frontend/src/
├── api/                       # Lớp giao tiếp mạng (Network Layer)
│   ├── axios.js               # Cấu hình Axios Instance & Interceptors (Bearer Token, 401 Handler)
│   ├── authApi.js             # API đăng ký, đăng nhập, lấy thông tin cá nhân
│   ├── courtApi.js            # API danh sách sân, chi tiết sân, ma trận lịch slot
│   ├── bookingApi.js          # API đặt sân, thanh toán webhook, lịch sử đơn
│   ├── matchApi.js            # API sàn ghép kèo, xin gia nhập, duyệt thành viên
│   └── reviewApi.js           # API gửi và xem đánh giá
├── components/                # Reusable UI Components
│   ├── Navbar.jsx             # Thanh điều hướng trên cùng, logo, profile popover
│   ├── Footer.jsx             # Chân trang, thông tin liên hệ, bản quyền
│   ├── CourtCard.jsx          # Thẻ hiển thị thông tin sân trên trang danh sách
│   ├── CourtSchedule.jsx      # Ma trận lưới khung giờ, trạng thái màu sắc, floating bar
│   ├── MatchCard.jsx          # Thẻ hiển thị bài đăng ghép kèo, badge trình độ
│   ├── MatchRequestModal.jsx  # Modal xin vào kèo và nhập lời nhắn
│   ├── PaymentModal.jsx       # Modal đếm ngược 10 phút, mã QR VietQR/MoMo
│   ├── CheckinQrModal.jsx     # Modal hiển thị mã QR Check-in và mã 8 ký tự
│   └── ProtectedRoute.jsx     # Component kiểm tra quyền truy cập yêu cầu đăng nhập
├── hooks/                     # Custom Hooks đóng gói nghiệp vụ & Data Fetching
│   ├── useAuth.js             # Hook thao tác đăng nhập, đăng xuất, quyền hạn
│   ├── useCourtSlots.js       # Hook polling ma trận slot thời gian thực
│   ├── useBookingTimer.js     # Hook đếm ngược 10 phút giữ chỗ có lưu timestamp
│   └── useMatchmaking.js      # Hook danh sách kèo, bộ lọc và mutation duyệt kèo
├── pages/                     # Màn hình chính (Routes Views)
│   ├── Home.jsx               # Trang chủ giới thiệu & tìm kiếm nhanh
│   ├── CourtList.jsx          # Trang danh sách sân & bộ lọc đa tiêu chí
│   ├── CourtDetail.jsx        # Trang chi tiết sân & tích hợp CourtSchedule
│   ├── MatchmakingBoard.jsx   # Bảng tin ghép kèo Kanban / Card Grid
│   ├── MyBookings.jsx         # Quản lý đơn đặt sân & vé check-in của tôi
│   ├── Login.jsx              # Trang đăng nhập
│   └── Register.jsx           # Trang đăng ký thành viên
├── store/                     # Quản lý Client State bằng Zustand
│   ├── authStore.js           # Lưu token, user info, trạng thái đăng nhập
│   ├── themeStore.js          # Lưu chế độ sáng/tối (Dark/Light mode)
│   └── bookingDraftStore.js   # Lưu slot đang chọn tạm thời và id booking pending
├── utils/                     # Hàm tiện ích (Helpers & Formatters)
│   ├── formatCurrency.js      # Định dạng số tiền VNĐ (VD: 80.000 đ)
│   ├── formatDate.js          # Format ngày giờ chuẩn Việt Nam (DD/MM/YYYY)
│   └── levelBadgeHelper.js    # Trả về màu sắc Tailwind theo trình độ cầu lông
├── App.jsx                    # Cấu hình Route chính của ứng dụng
├── index.css                  # Cấu hình Tailwind directives & custom scrollbars
└── main.jsx                   # Entry point, bọc QueryClientProvider & BrowserRouter
```

---

## 3. CHIẾN LƯỢC QUẢN LÝ STATE (STATE MANAGEMENT STRATEGY)

SmashMatch phân định rạch ròi giữa **Server State** và **Client State**:

```mermaid
graph TD
    subgraph Client State [Zustand Store]
        A[authStore: Token & Profile]
        B[themeStore: Light / Dark Mode]
        C[bookingDraftStore: Draft Slot & Timer]
    end

    subgraph Server State [TanStack Query v5]
        D[Courts & Details Cache]
        E[Real-time Slot Matrix Cache]
        F[Matchmaking Posts Cache]
        G[User Bookings & QR Cache]
    end

    subgraph UI Components
        H[CourtSchedule.jsx]
        I[MatchmakingBoard.jsx]
        J[MyBookings.jsx]
    end

    A --> UI Components
    B --> UI Components
    C --> H
    E --> H
    F --> I
    G --> J
```

### 3.1. Client State bằng Zustand
#### `themeStore.js`
Quản lý chế độ Dark/Light, đồng bộ với class `dark` trên thẻ `<html>` và lưu trữ vào `localStorage`:
```javascript
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDark: true,
  initTheme: () => {
    const saved = localStorage.getItem('smashmatch_theme');
    const isDark = saved ? saved === 'dark' : true; // Mặc định Dark mode thể thao
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDark });
  },
  toggleTheme: () => {
    set((state) => {
      const next = !state.isDark;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('smashmatch_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('smashmatch_theme', 'light');
      }
      return { isDark: next };
    });
  },
}));
```

#### `authStore.js`
Lưu token Sanctum, tự động thiết lập Header cho Axios khi ứng dụng khởi chạy:
```javascript
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('smashmatch_user') || 'null'),
  token: localStorage.getItem('smashmatch_token') || null,
  isAuthenticated: !!localStorage.getItem('smashmatch_token'),

  setAuth: (user, token) => {
    localStorage.setItem('smashmatch_user', JSON.stringify(user));
    localStorage.setItem('smashmatch_token', token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('smashmatch_user');
    localStorage.removeItem('smashmatch_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
```

---

### 3.2. Server State bằng TanStack Query v5
Hệ thống sử dụng TanStack Query v5 với chuẩn Query Key dạng tuple:
* Lấy danh sách sân: `['courts', { search, area }]`
* Chi tiết sân: `['courts', courtId]`
* **Ma trận lịch khung giờ (Slots):** `['courts', courtId, 'slots', selectedDate]`
  * Cấu hình quan trọng:
    * `staleTime: 5000` (5 giây coi là cũ).
    * `refetchInterval: 15000` (15 giây tự động refetch trong nền để phát hiện slot vừa có người đặt).
    * `refetchOnWindowFocus: true` (Khi người dùng quay lại tab trình duyệt, tự động cập nhật ngay).
* Danh sách kèo mở: `['matches', { level }]`

---

## 4. TÍCH HỢP AXIOS & BẢO MẬT GIAO TIẾP (API INTERCEPTORS)

Tệp `src/api/axios.js` thiết lập hai Interceptors bảo đảm tính an toàn và trải nghiệm người dùng không bị gián đoạn:

```javascript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Tự động đính kèm Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi tập trung & Token hết hạn (401)
apiClient.interceptors.response.use(
  (response) => response.data, // Trả trực tiếp data payload
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> Xóa Auth & điều hướng về Login
      useAuthStore.getState().clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
```

---

## 5. XỬ LÝ ĐỒNG THỜI & GIỮ CHỖ 10 PHÚT PHÍA FRONTEND (CONCURRENCY UX)

### 5.1. Xử lý xung đột Double-Booking (HTTP 409 Conflict)
Khi 2 người dùng (User A và User B) cùng bấm đặt 1 slot vào cùng một tích tắc:
1. User A đến trước -> Server trả mã `201 Created` kèm thông tin booking. Frontend mở `PaymentModal` với đồng hồ 10:00.
2. User B đến sau (bị chậm vài mili-giây) -> Server bắt bằng `lockForUpdate()` và trả về `HTTP 409 Conflict` với body:
   `{ "status": false, "message": "Khung giờ này vừa có người giữ chỗ. Vui lòng chọn khung giờ khác!" }`
3. **Hành vi bắt buộc của Frontend:**
   * Không làm crash ứng dụng.
   * Kích hoạt ngay thông báo lỗi nổi bật dạng Banner Toast màu đỏ/cam.
   * Gọi ngay `queryClient.invalidateQueries({ queryKey: ['courts', courtId, 'slots', date] })` để tự động đổi màu ô đó từ Xanh sang Vàng (`pending`).
   * Gợi ý người dùng chọn khung giờ kế bên.

### 5.2. Hook Đếm Ngược 10 Phút Giữ Chỗ (`useBookingTimer.js`)
Để tránh việc người dùng F5 (reload trang) làm mất thời gian đếm ngược hoặc gian lận gia hạn, Frontend tính toán dựa trên **Epoch Timestamp kết thúc**:

```javascript
import { useState, useEffect } from 'react';

export function useBookingTimer(expiresAtTimestamp, onExpire) {
  const calculateRemaining = () => {
    const diff = Math.max(0, Math.floor((expiresAtTimestamp - Date.now()) / 1000));
    return diff;
  };

  const [remainingSeconds, setRemainingSeconds] = useState(calculateRemaining);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAtTimestamp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const percentage = Math.min(100, (remainingSeconds / 600) * 100);

  return { remainingSeconds, formattedTime, percentage, isExpired: remainingSeconds <= 0 };
}
```

---

## 6. HƯỚNG DẪN AI CODING PHÍA FRONTEND (AI CODING RULES)

Khi yêu cầu AI viết hoặc sửa mã nguồn React cho SmashMatch, AI phải tuân thủ nghiêm ngặt 6 nguyên tắc sau:
1. **Tuyệt đối không dùng thư viện UI nặng nề (như Ant Design, MUI):** Toàn bộ giao diện viết bằng Vanilla Tailwind CSS kết hợp với Icon `lucide-react`.
2. **Luôn xử lý 3 trạng thái của dữ liệu:** `isLoading` (Skeleton Shimmer), `isError` (Hộp cảnh báo có nút Retry), và `isEmpty` (Hình minh họa rỗng + thông điệp thân thiện).
3. **Phân tách Presentational & Container Component:** Không viết logic API trực tiếp trong thẻ JSX; luôn tách các hàm mutation hoặc query thành custom hooks hoặc gọi qua TanStack Query.
4. **Chuẩn hóa giá trị tiền tệ & thời gian:** Bắt buộc dùng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` để hiển thị giá tiền, không in số thô như `80000`.
5. **Khả năng tương thích di động (Mobile Responsive):** Tất cả bảng ma trận lịch và danh sách kèo phải hiển thị mượt mà trên màn hình điện thoại (cuộn ngang hoặc xếp chồng card), không để vỡ khung hình.
6. **Không hardcode URL API:** Mọi endpoint API đều phải gọi qua biến môi trường `import.meta.env.VITE_API_URL` thông qua instance Axios tại `src/api/axios.js`.
