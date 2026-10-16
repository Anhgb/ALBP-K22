# 🎨 SMASHMATCH — TÀI LIỆU GIAO DIỆN & KỊCH BẢN AI THỰC THI (UI/UX SPEC & AI PROMPTING GUIDE)
**Hệ Thống Đặt Sân Cầu Lông Trực Tuyến & Mạng Xã Hội Ghép Kèo Thể Thao**
*Phiên bản:* 1.0.0 | *Dành cho:* Kỹ sư Frontend, AI Pair-Programmer | *Ngày cập nhật:* 2026-10-16

---

## 1. MỤC TIÊU & ĐỊNH HƯỚNG THIẾT KẾ (DESIGN SYSTEM)

Tài liệu này cung cấp đặc tả chi tiết về hệ thống giao diện, nguyên tắc tương tác và các mẫu **Prompt kỹ thuật** để AI (Copilot, Gemini, Claude, Cursor) có thể đọc và sinh ra mã nguồn giao diện React + Tailwind CSS chuẩn xác 100%, không bị lệch thẩm mỹ, không thiếu trạng thái (Loading/Empty/Error/Optimistic).

### 1.1. Bảng màu chủ đạo (Color Palette)
Hệ thống sử dụng phong cách thể thao hiện đại, tràn đầy năng lượng (Energetic Badminton Dynamic) với chế độ nền kép Light/Dark tự nhiên:

* **Primary (Màu nhận diện thương hiệu):** `Emerald` (Màu mặt thảm cầu lông tiêu chuẩn BWF & biểu tượng năng lượng tươi mới).
  * `emerald-500` (`#10B981`): Nút hành động chính (Primary CTA), biểu tượng active, viền highlight.
  * `emerald-400`: Trạng thái hover, glow effect trong chế độ Dark mode.
  * `emerald-600` / `emerald-700`: Nhấn mạnh văn bản trong Light mode.
* **Secondary / Accent (Cảnh báo & Khung giờ vàng):**
  * `amber-500` / `amber-400`: Trạng thái chờ thanh toán (`pending`), cảnh báo sắp hết giờ, cờ đánh dấu khung giờ cao điểm (Peak-hour).
  * `rose-500` / `rose-600`: Trạng thái đã đặt (`booked`), nút hủy, báo lỗi xung đột lịch.
  * `sky-500` / `indigo-500`: Huy hiệu trình độ người chơi, thẻ ghép kèo.
* **Neutrals & Backgrounds (Nền & Bề mặt):**
  * **Dark Mode:** `bg-slate-950` (nền trang), `bg-slate-900` (thẻ card / modal), `border-slate-800`, chữ `text-slate-100` / `text-slate-400`.
  * **Light Mode:** `bg-slate-50` (nền trang), `bg-white` (thẻ card / modal), `border-slate-200`, chữ `text-slate-900` / `text-slate-600`.

### 1.2. Typography & Iconography
* **Font chữ:** `Inter`, `Outfit` hoặc `system-ui`, hỗ trợ hoàn hảo tiếng Việt có dấu.
* **Icon Library:** `lucide-react` (tương thích cao, tối ưu kích thước bundle).
  * Lịch & Giờ: `<Calendar />`, `<Clock />`, `<Timer />`
  * Địa điểm & Sân: `<MapPin />`, `<Activity />`, `<Sparkles />`
  * Người dùng & Ghép kèo: `<Users />`, `<UserPlus />`, `<ShieldCheck />`, `<Award />`
  * Trạng thái & Vé: `<CheckCircle />`, `<AlertCircle />`, `<QrCode />`, `<Lock />`

---

## 2. ĐẶC TẢ CHI TIẾT CÁC MÀN HÌNH CHÍNH (SCREEN SPECS)

### 2.1. Layout Chung: Header, Navigation & Theme Toggle
* **Vị trí:** Đỉnh trang (Sticky Top với hiệu ứng `backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800`).
* **Các thành phần:**
  * **Logo:** Biểu tượng quả cầu lông `<span className="text-2xl">🏸</span>` + Tên thương hiệu **SmashMatch** (Font chữ đậm, hiệu ứng chuyển màu `from-emerald-500 to-teal-400`).
  * **Navigation Links:**
    * Trang chủ (`/`)
    * Danh sách sân (`/courts`)
    * Sàn ghép kèo (`/matches`) — Kèm nhãn badge nhỏ `Hot`
    * Đơn của tôi (`/my-bookings`) — Chỉ hiển thị khi đã đăng nhập
  * **Action Controls:**
    * Nút chuyển đổi Dark/Light mode (Lưu vào `localStorage` qua Zustand).
    * Khu vực User Profile: Nếu chưa đăng nhập hiện nút `Đăng nhập` / `Đăng ký`. Nếu đã đăng nhập hiện Avatar, Tên, Điểm uy tín `⭐ 5.0` và Menu xổ xuống (Đổi mật khẩu, Lịch sử, Đăng xuất).

---

### 2.2. Màn hình 1: Trang Chủ (Home Page)
* **Hero Section:**
  * Tiêu đề giật gáp: *"Đặt Sân Tức Thì — Ghép Kèo Cầu Lông Chuẩn Trình Độ"*.
  * Mô tả phụ: *"Không còn nỗi lo thiếu người đánh đôi hay trùng lịch sân. Trải nghiệm công nghệ giữ slot thông minh 10 phút chống xung đột."*
  * Hộp tìm kiếm nhanh (Quick Search Box): Chọn ngày chơi, chọn khu vực (Huế / Đà Nẵng / Hà Nội / TP.HCM), nút CTA *"Tìm Sân Ngay"*.
* **Feature Highlights (3 Cột nổi bật):**
  1. *Lưới lịch thời gian thực (Real-time Grid):* Cập nhật trạng thái từng phút, chống đặt trùng tuyệt đối.
  2. *Sàn ghép kèo đa cấp độ (Smart Matchmaking):* Tìm kiếm đồng đội vừa tay từ mới chơi đến chuyên nghiệp.
  3. *Vé điện tử QR Code (Zero-paper Check-in):* Quét mã tại quầy nhận sân trong 3 giây.
* **Featured Courts Slider:** 4 cụm sân nổi tiếng nhất có điểm đánh giá cao kèm mức giá chỉ từ 60.000đ/giờ.
* **Live Match Feed (Kèo đang tuyển gấp):** 3 bài đăng ghép kèo mới nhất có nút *"Xin vào kèo"* tức thì.

---

### 2.3. Màn hình 2: Danh Sách Sân & Tìm Kiếm (Court List & Filter)
* **Thanh công cụ lọc (Filter Bar):**
  * Ô tìm kiếm từ khóa theo tên sân hoặc tên đường.
  * Bộ lọc khu vực (Dropdown Quận/Huyện).
  * Bộ lọc mức giá (Dưới 70k, 70k - 100k, Trên 100k).
  * Checkbox tiện ích: Có máy lạnh, Thảm chuẩn BWF, Có bãi đỗ ô tô, Cho thuê vợt.
* **Lưới danh sách sân (Court Cards Grid):**
  * Mỗi thẻ sân gồm: Ảnh đại diện sân (tỉ lệ 16:9), Huy hiệu `Hoạt động`, Tên sân (Hương Giang, Xuân Phú, VTC...), Địa chỉ có icon `<MapPin />`, Đánh giá sao (VD: `⭐ 4.9 (128 đánh giá)`), Giá khởi điểm từ...
  * Nút CTA: *"Xem lịch đặt sân"* (Dẫn đến `/courts/:courtId`).

---

### 2.4. Màn hình 3: Chi Tiết Sân & Ma Trận Khung Giờ (Court Detail & Slot Grid)
Đây là màn hình cốt lõi nhất của ứng dụng, đòi hỏi AI phải dựng giao diện cực kỳ chuẩn xác:

```
+-----------------------------------------------------------------------------------+
|  [<= Quay lại]   Sân Cầu Lông Hương Giang (Huế)          ⭐ 4.9 (86 đánh giá)      |
|  Địa chỉ: 12 Nguyễn Huệ, TP. Huế  •  Tiện ích: Thảm PVC, Đèn LED, Quầy nước       |
+-----------------------------------------------------------------------------------+
|  Chọn ngày thi đấu:                                                               |
|  [ Hôm nay (16/10) ]   [ Ngày mai (17/10) ]   [ T7 (18/10) ]   [ CN (19/10) ]     |
+-----------------------------------------------------------------------------------+
|  Chú thích màu sắc:                                                               |
|  [■] Còn trống (Xanh lá)   [■] Đang giữ chỗ 10p (Cam)   [■] Đã đặt (Xám đỏ)      |
+-----------------------------------------------------------------------------------+
|  Khung giờ       | Sân 1 (Thảm Xanh)     | Sân 2 (Thảm Xanh)     | Sân 3 (Thảm Cam)   |
|------------------+-----------------------+-----------------------+--------------------|
|  06:00 - 07:00   | [ 60.000đ - Trống ]   | [ 60.000đ - Trống ]   | [ ĐÃ ĐẶT ]         |
|  07:00 - 08:00   | [ 60.000đ - Trống ]   | [ ĐANG GIỮ CHỖ 08:24] | [ 60.000đ - Trống ]|
|  ...             |                       |                       |                    |
|  17:00 - 18:00   | [ 90.000đ - GIỜ VÀNG] | [ ĐÃ ĐẶT ]            | [ ĐÃ ĐẶT ]         |
|  18:00 - 19:00   | [ ĐÃ ĐẶT ]            | [ 90.000đ - GIỜ VÀNG] | [ 90.000đ - Trống ]|
+-----------------------------------------------------------------------------------+
|  [FLOATING BAR ĐÁY MÀN HÌNH KHI ĐÃ CHỌN 1 KHUNG GIỜ]                              |
|  Đã chọn: Sân 1 (17:00 - 18:00) • Giá: 90.000 VNĐ                                 |
|  [Hủy chọn]                        [ TIẾN HÀNH GIỮ CHỖ & THANH TOÁN (10 PHÚT) -> ]|
+-----------------------------------------------------------------------------------+
```

#### Quy tắc hiển thị trạng thái nút Slot:
1. **Trạng thái `available` (Còn trống):**
   * Nền `bg-emerald-50 dark:bg-emerald-950/40`, viền `border-emerald-300 dark:border-emerald-700/60`, chữ `text-emerald-700 dark:text-emerald-400`.
   * Hiển thị giá tiền dạng định dạng VNĐ (VD: `70.000đ`).
   * Hiệu ứng hover: Phóng to nhẹ `hover:scale-[1.02] hover:bg-emerald-100 dark:hover:bg-emerald-900/50`.
2. **Trạng thái `pending` (Đang giữ chỗ):**
   * Nền `bg-amber-50 dark:bg-amber-950/30`, viền `border-amber-300 dark:border-amber-800`, chữ `text-amber-700 dark:text-amber-400`.
   * Hiển thị icon đồng hồ xoay nhẹ kèm chữ `"Đang giữ..."`. Không cho phép click đặt đè.
3. **Trạng thái `booked` (Đã thanh toán):**
   * Nền `bg-slate-100 dark:bg-slate-900`, viền `border-slate-200 dark:border-slate-800`, chữ `text-slate-400 dark:text-slate-600`.
   * Con trỏ chuột `cursor-not-allowed`, vô hiệu hóa tương tác (disabled).
4. **Trạng thái `selected` (Đang được chọn):**
   * Nền `bg-emerald-600 text-white font-bold`, đổ bóng phát sáng `shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400`.

---

### 2.5. Màn hình 4: Modal Giữ Chỗ & Thanh Toán QR (Payment Modal)
* **Kích thước:** Modal trung tâm (Center Modal, `max-w-md`), hiệu ứng mờ hậu cảnh (`backdrop-blur-sm`).
* **Header:** Tiêu đề *"Thanh Toán Giữ Chỗ Sân"*, nút đóng `X`.
* **Đồng hồ đếm ngược (Countdown Timer Bar):**
  * Hiển thị thời gian còn lại: `09:59` với icon `<Timer className="animate-spin" />`.
  * Thanh tiến trình (Progress bar) màu vàng cam rút ngắn dần từ 100% về 0% trong đúng 600 giây.
  * Cảnh báo: *"Vui lòng hoàn tất thanh toán trước khi hết giờ để không bị mất lượt đặt!"*
* **Khu vực hiển thị mã QR:**
  * Ảnh mã QR động (VietQR / MoMo format) mã hóa thông tin: Số tài khoản, Ngân hàng, Số tiền, Nội dung chuyển khoản là `checkin_code` (VD: `SMASH 88291A`).
* **Nút hành động:**
  * Nút *"Tôi đã chuyển khoản thành công"* (Kích hoạt kiểm tra webhook giả lập).
  * Nút *"Hủy giao dịch"*.

---

### 2.6. Màn hình 5: Sàn Ghép Kèo Cầu Lông (Matchmaking Board)
* **Header & Bộ lọc:**
  * Tabs phân loại: `Tất cả kèo`, `Kèo mở (Đang tuyển)`, `Kèo của tôi đã tạo`, `Kèo tôi xin tham gia`.
  * Bộ lọc Trình độ: `Mới chơi / Yếu`, `Trung bình -`, `Trung bình +`, `Khá`, `Bán chuyên`.
  * Nút tạo bài đăng nổi bật: `[ + Đăng Kèo Tìm Bạn Chơi ]`.
* **Thẻ Kèo (Match Card):**
  * **Header thẻ:** Avatar người đăng, Tên người đăng, Huy hiệu sao uy tín (`⭐ 4.9 • 32 trận`), thời gian đăng tin (VD: `15 phút trước`).
  * **Badge trình độ:**
    * Yếu: `bg-teal-500/10 text-teal-400 border border-teal-500/30`
    * Trung bình: `bg-blue-500/10 text-blue-400 border border-blue-500/30`
    * Khá/Chuyên: `bg-purple-500/10 text-purple-400 border border-purple-500/30`
  * **Thông tin trận đấu:**
    * Vị trí sân: `<MapPin /> Sân Cầu Lông Xuân Phú, Huế`
    * Thời gian: `<Calendar /> Thứ 7, 18/10 • 18:00 - 20:00`
    * Chi phí chia sẻ: `<DollarSign /> ~35.000 VNĐ / người`
    * Số vị trí tuyển: `Đang cần: 1/2 người`
  * **Ghi chú của chủ kèo:** Hộp văn bản nổi bật với các thông tin thực tế: *"Đang thiếu 1 tay đánh đôi nam nữ hoặc đôi nam. Đã có sẵn 2 hộp cầu Ba Sao và có vợt Kumpoo K520 Pro cho mượn nếu chưa có vợt."*
  * **Nút tương tác:**
    * Nếu là khách/người chơi khác: Nút `Xin Vào Kèo (Gửi yêu cầu)`. Sau khi bấm, nút chuyển sang `Đã Gửi Yêu Cầu (Chờ duyệt)`.
    * Nếu là chủ kèo: Nút `Xem Ứng Viên (2 người đang chờ)` -> Mở danh sách ứng viên để bấm `Duyệt` hoặc `Từ chối`.

---

### 2.7. Màn hình 6: Quản Lý Đơn Đặt & Vé Check-in (My Bookings)
* Danh sách các đơn đặt phân theo tab: `Sắp tới` và `Lịch sử`.
* Mỗi thẻ đơn hiển thị: Tên sân, Số sân con, Ngày giờ thi đấu, Số tiền đã thanh toán, Trạng thái `ĐÃ THANH TOÁN`.
* Nút CTA chính: **`Xem Mã Check-in QR`**:
  * Khi bấm mở Popup mã QR kích thước lớn kèm chuỗi mã `checkin_code: ABC789XYZ`.
  * Ghi chú hướng dẫn: *"Đưa mã này cho nhân viên quầy lễ tân để đối soát nhận sân."*

---

## 3. BỘ PROMPT KỸ THUẬT MẪU ĐỂ AI THỰC THI (AI PROMPTING TEMPLATES)

Các prompt dưới đây được thiết kế sẵn theo chuẩn Prompt Engineering (Role - Context - Specifications - Constraints - Output) để bạn copy trực tiếp giao cho AI lập trình.

### 3.1. Prompt 1: Sinh Component Lưới Lịch Sân (CourtSchedule.jsx)
```markdown
Bạn là Senior React Frontend Engineer. Hãy viết component `src/components/CourtSchedule.jsx` cho dự án SmashMatch bằng React 18, Tailwind CSS và TanStack Query v5.

YÊU CẦU KỸ THUẬT:
1. Nhận vào props: `courtId`, `courtName`, `onBookingSuccess`.
2. Có thanh chọn ngày (Date Selector) gồm 7 ngày tới, cho phép chuyển đổi ngày và tự động refetch dữ liệu slots của ngày đó từ endpoint `GET /api/v1/courts/:courtId/slots?date=YYYY-MM-DD`.
3. Nhóm các slots theo sân con (sân 1, sân 2, sân 3...) và hiển thị dạng bảng ma trận các ca giờ từ 06:00 đến 22:00.
4. Xử lý đúng 4 trạng thái trực quan:
   - 'available': nút màu emerald, hiển thị giá tiền định dạng VNĐ.
   - 'pending': màu amber, có icon Timer và nhãn "Đang giữ...". Vô hiệu hóa click.
   - 'booked': màu xám, nhãn "Đã đặt", cursor-not-allowed.
   - 'selected': viền sáng ring-2 ring-emerald-400 khi người dùng click vào 1 slot available.
5. Khi người dùng chọn 1 slot, hiện thanh Floating Bar ở đáy màn hình tóm tắt thông tin và nút "Xác Nhận Giữ Chỗ (10 Phút)".
6. Khi bấm nút Xác nhận, gọi mutation `POST /api/v1/bookings` với body `{ court_slot_id: selectedSlot.id }`.
7. Nếu thành công: hiển thị Modal Thanh Toán QR kèm bộ đếm ngược 10:00 (600 giây).
8. Nếu gặp lỗi 409 Conflict: hiển thị Toast thông báo "Khung giờ này vừa có người giữ chỗ, vui lòng chọn giờ khác!" và kích hoạt queryClient.invalidateQueries() để tải lại lịch mới nhất.
9. Đảm bảo hỗ trợ hoàn hảo cả Dark Mode và Light Mode với Tailwind CSS.
```

### 3.2. Prompt 2: Sinh Component Bảng Ghép Kèo (MatchmakingBoard.jsx)
```markdown
Bạn là Senior React Frontend Engineer. Hãy hoàn thiện component `src/pages/MatchmakingBoard.jsx` cho dự án SmashMatch.

YÊU CẦU:
1. Tích hợp TanStack Query gọi `GET /api/v1/matches` để lấy danh sách bài đăng ghép kèo có trạng thái 'open'.
2. Header có bộ lọc chọn cấp độ (`level_required`): Tất cả, Yếu, Trung bình, Khá, Bán chuyên; ô tìm kiếm theo tên sân hoặc ghi chú; và nút "+ Đăng Tin Tìm Bạn".
3. Render danh sách dưới dạng lưới Responsive (1 cột trên mobile, 2 cột trên tablet, 3 cột trên desktop).
4. Mỗi Card bài đăng hiển thị:
   - Tên chủ kèo + Avatar + Rating score (sao vàng).
   - Badge cấp độ có màu sắc tương ứng.
   - Vị trí sân và thời gian trận đấu (nếu có booking kèm theo).
   - Chi phí dự kiến / người.
   - Số vị trí còn trống (`slots_needed`).
   - Ghi chú dụng cụ (ví dụ: vợt mượn, loại quả cầu lông).
   - Nút "Xin Vào Kèo": Gọi `POST /api/v1/matches/:id/requests`. Hiển thị trạng thái loading khi đang gửi và chuyển sang "Đã gửi yêu cầu" khi thành công.
5. Có Modal "Đăng Kèo Mới": Cho phép người dùng nhập cấp độ, số người cần tuyển (1-4), chi phí ước tính, ghi chú và tùy chọn gắn mã đơn đặt sân hiện có của người dùng.
6. Giao diện thể thao hiện đại, phong cách Tailwind CSS, dark mode đầy đủ, xử lý skeleton loading khi dữ liệu đang tải.
```

### 3.3. Prompt 3: Sinh Modal Mã QR Check-in (CheckinQrModal.jsx)
```markdown
Hãy viết component `src/components/CheckinQrModal.jsx` hiển thị mã vé Check-in cho người chơi tại sân:
- Nhận props: `isOpen`, `onClose`, `booking` (gồm: courtName, playDate, startTime, endTime, checkinCode, courtSlotName).
- Sử dụng thư viện `qrcode.react` (hoặc render SVG/Canvas chuẩn) để sinh mã QR từ chuỗi JSON:
  `{ code: booking.checkinCode, bookingId: booking.id, timestamp: Date.now() }`.
- Hiển thị to rõ ràng chuỗi mã 8 ký tự `checkinCode` (Font Monospace, cỡ chữ lớn, có nút Copy mã nhanh kèm toast báo "Đã sao chép").
- Có hiệu ứng viền phát sáng thể thao emerald-500, hướng dẫn người dùng đưa mã cho quản lý sân quét khi đến nhận sân.
```
