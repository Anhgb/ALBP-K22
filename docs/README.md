# 📚 SMASHMATCH — BỘ TÀI LIỆU TOÀN DIỆN DỰ ÁN (DOCUMENTATION INDEX)
**Hệ Thống Đặt Sân Cầu Lông Trực Tuyến & Sàn Ghép Kèo Thể Thao Thông Minh**
*Khóa học / Dự án:* Đồ án Tốt nghiệp & Chuyên đề K22 AIBP | *Cập nhật:* 2026-10-16

---

## 📌 DANH SÁCH CÁC TẬP TÀI LIỆU CHÍNH THỨC

Bộ tài liệu này được biên soạn đầy đủ, chi tiết theo tiêu chuẩn công nghiệp phần mềm nhằm phục vụ việc phát triển, kiểm thử và hướng dẫn AI (Copilot, Gemini, Claude, Cursor) thực thi mã nguồn chính xác:

| Tập tài liệu | Tên file | Mục đích & Nội dung cốt lõi |
| :--- | :--- | :--- |
| **Tập 1** | [01_TAI_LIEU_NGHIEP_VU.md](file:///d:/AIBP_K22/DOAN/docs/01_TAI_LIEU_NGHIEP_VU.md) | **Tài liệu Đặc tả Nghiệp vụ (BRD & SRS):** Tổng quan dự án, các tác nhân (Actors), 6 phân hệ chức năng, 8 quy tắc nghiệp vụ bắt buộc (BR), sơ đồ luồng Concurrency Booking và Ghép kèo tự động đóng, ma trận phân quyền RACI. |
| **Tập 2** | [02_TAI_LIEU_GIAO_DIEN_AI_THUC_THI.md](file:///d:/AIBP_K22/DOAN/docs/02_TAI_LIEU_GIAO_DIEN_AI_THUC_THI.md) | **Tài liệu Giao diện & Kịch bản AI Thực thi (UI/UX Spec):** Hệ thống Design System (Emerald sport theme, Dark/Light mode), đặc tả wireframe ma trận lịch sân (Court Schedule Grid), bộ đếm ngược 10 phút, bảng ghép kèo, và bộ prompt mẫu chuẩn Prompt Engineering để AI lập trình UI. |
| **Tập 3** | [03_TAI_LIEU_KY_THUAT_AI_FRONTEND.md](file:///d:/AIBP_K22/DOAN/docs/03_TAI_LIEU_KY_THUAT_AI_FRONTEND.md) | **Tài liệu Kỹ thuật Phía Frontend:** Kiến trúc React 18 SPA + Vite + TailwindCSS, tổ chức thư mục, quản lý Client State (Zustand) & Server State (TanStack Query v5), Axios Interceptors, kỹ thuật xử lý tranh chấp 409 Conflict, Custom Hooks và quy chuẩn code AI. |
| **Tập 4** | [04_TAI_LIEU_KY_THUAT_AI_ADMIN.md](file:///d:/AIBP_K22/DOAN/docs/04_TAI_LIEU_KY_THUAT_AI_ADMIN.md) | **Tài liệu Kỹ thuật Phía Admin & Chủ Sân (Backend Architecture):** Kiến trúc Laravel 11.x, phân quyền RBAC (Admin vs Owner), kỹ thuật khóa bi quan `lockForUpdate()`, lệnh Artisan tự giải phóng slot quá hạn 10 phút, Service sinh lịch hàng loạt, cơ chế quét QR Check-in và API contracts. |

---

## 🚀 TỔNG HỢP CÁC LỆNH CHẠY HỆ THỐNG

### Khởi động Backend (Laravel 11 API)
```bash
cd d:\AIBP_K22\DOAN
php artisan migrate --seed
php artisan serve
```
*API Base URL:* `http://127.0.0.1:8000/api/v1`

### Khởi động Frontend (React 18 + Vite)
```bash
cd d:\AIBP_K22\DOAN\frontend
npm run dev
```
*Giao diện người dùng:* `http://localhost:5173`

### Khởi động Tiến trình ngầm Giải phóng Slot hết hạn 10 phút
```bash
cd d:\AIBP_K22\DOAN
php artisan bookings:release-expired
```
