# 📝 Ứng Dụng Todo List

## Mô Tả Dự Án

Ứng dụng Todo List là một ứng dụng web đơn giản, được xây dựng bằng React, cho phép người dùng:
- Tạo, hoàn thành, và xóa các công việc hàng ngày
- Lọc công việc theo trạng thái (Tất Cả, Chưa Hoàn Thành, Đã Hoàn Thành)
- Tìm kiếm công việc bằng từ khóa
- Xem thống kê số lượng công việc
- Lưu dữ liệu tự động vào trình duyệt (localStorage)

**Mục Tiêu:** Thực hành phát triển frontend hỗ trợ AI, áp dụng React Hooks, quản lý state, khả năng truy cập, và thiết kế responsive.

---

## Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js 14+ và npm
- Trình soạn thảo mã (VS Code, WebStorm, v.v.)
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

### Các Bước Cài Đặt

1. **Tạo ứng dụng React mới:**
   ```bash
   npx create-react-app todo-app
   cd todo-app
   ```

2. **Cài đặt thư viện cần thiết:**
   ```bash
   npm install prop-types
   ```

3. **Sao chép các file:**
   - Sao chép nội dung `App_Template.jsx` vào file `src/App.jsx`
   - Sao chép nội dung `App_Template.css` vào file `src/App.css`

4. **Chạy ứng dụng:**
   ```bash
   npm start
   ```
   Ứng dụng sẽ mở ở `http://localhost:3000`

---

## Cấu Trúc Dự Án

```
todo-app/
├── src/
│   ├── App.jsx              # Component chính
│   ├── App.css              # Kiểu dáng
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── public/
│   └── index.html           # HTML template
├── package.json
└── README.md                # Tài liệu này
```

---

## Các Tính Năng Được Triển Khai

### Lần Lặp 1: Xây Dựng Giàn Giáo (Scaffolding)
- ✅ Hiển thị danh sách công việc từ mảng tĩnh
- ✅ Checkbox để đánh dấu hoàn thành
- ✅ Nút xóa công việc
- ✅ Kiểu gạch ngang cho công việc hoàn thành
- ✅ PropTypes validation

### Lần Lặp 2: Thêm Tương Tác (Interactivity)
- ✅ Input để thêm công việc mới
- ✅ 3 nút lọc (Tất Cả, Chưa Hoàn Thành, Đã Hoàn Thành)
- ✅ Thanh tìm kiếm để lọc theo từ khóa
- ✅ Hiển thị thống kê (tổng, hoàn thành, chưa hoàn thành)
- ✅ Thông báo trạng thái trống
- ✅ Input validation

### Lần Lặp 3: Kiểu Dáng (Styling)
- ✅ Giao diện đẹp mắt, chuyên nghiệp
- ✅ Màu sắc nhất quán (xanh dương #3b82f6, đỏ #ef4444, xám)
- ✅ Focus styles rõ ràng cho bàn phím
- ✅ Hover effects mượt mà
- ✅ Layout responsive (di động, máy tính bảng, máy tính để bàn)

### Lần Lặp 4: Đánh Bóng & LocalStorage (Polish)
- ✅ Lưu/tải từ localStorage
- ✅ Thuộc tính ARIA cho khả năng truy cập
- ✅ Label rõ ràng cho tất cả input
- ✅ Aria-label cho các nút
- ✅ Điều hướng bàn phím hoàn toàn (Tab, Enter, Escape)
- ✅ Xác nhận trước khi xóa tất cả
- ✅ Xử lý lỗi với try-catch

---

## Hướng Dẫn Sử Dụng

### Thêm Công Việc Mới
1. Gõ nội dung công việc vào input "Thêm Công Việc Mới"
2. Nhấp nút "Thêm" hoặc nhấn Enter
3. Công việc sẽ được thêm vào danh sách và lưu vào localStorage

### Đánh Dấu Hoàn Thành
- Nhấp vào checkbox bên cạnh công việc để đánh dấu hoàn thành
- Công việc hoàn thành sẽ hiển thị với gạch ngang

### Xóa Công Việc
- Nhấp nút "✕" bên phải công việc để xóa

### Lọc Công Việc
- Nhấp "Tất Cả" để xem tất cả công việc
- Nhấp "Chưa Hoàn Thành" để xem chỉ các công việc chưa hoàn thành
- Nhấp "Đã Hoàn Thành" để xem chỉ các công việc đã hoàn thành

### Tìm Kiếm
- Gõ từ khóa vào thanh "Tìm Kiếm" để tìm công việc
- Tìm kiếm sẽ kết hợp với bộ lọc đã chọn

### Xóa Tất Cả
- Nhấp nút "Xóa Tất Cả" ở cuối trang (chỉ hiển thị nếu có công việc)
- Xác nhận xóa bằng cách nhấp "OK" trong hộp thoại

---

## Công Nghệ Sử Dụng

- **React** 18+: Thư viện UI
- **React Hooks**: useState, useEffect
- **PropTypes**: Validation
- **CSS3**: Flexbox, Grid, Media Queries
- **LocalStorage API**: Lưu trữ dữ liệu
- **ARIA**: Web Accessibility

---

## Khả Năng Truy Cập

Ứng dụng được phát triển với ưu tiên khả năng truy cập:

- ✅ Tất cả input có label rõ ràng
- ✅ ARIA attributes: `aria-label`, `aria-invalid`, `aria-describedby`
- ✅ Focus styles rõ ràng (box-shadow xanh)
- ✅ Điều hướng Tab hoạt động đúng
- ✅ Thông báo lỗi được công bố cho trình đọc màn hình
- ✅ Semantc HTML: `<label>`, `<button>`, `<ul>`, `<li>`
- ✅ Đủ độ tương phản màu (WCAG AA)

### Test Bàn Phím
1. Nhấn Tab để di chuyển giữa các phần tử
2. Nhấn Shift+Tab để di chuyển ngược lại
3. Nhấn Enter để kích hoạt nút hoặc gửi form
4. Nhấn Space để bật/tắt checkbox

---

## Thiết Kế Responsive

Ứng dụng hoạt động tốt trên các kích thước màn hình khác nhau:

| Loại Thiết Bị | Chiều Rộng | Điều Chỉnh |
|---|---|---|
| Điện Thoại | < 480px | Padding nhỏ hơn, font nhỏ hơn |
| Máy Tính Bảng | 480px - 768px | Layout tối ưu |
| Máy Tính Để Bàn | > 768px | Container max-width 600px |

---

## Các Vấn Đề Gặp Phải & Cách Giải Quyết

### Vấn Đề 1: [Mô tả vấn đề]
**Nguyên Nhân:** [Giải thích]
**Giải Pháp:** [Cách fix]

### Vấn Đề 2: [Mô tả vấn đề]
**Nguyên Nhân:** [Giải thích]
**Giải Pháp:** [Cách fix]

*(Vui lòng thêm các vấn đề gặp phải trong quá trình phát triển)*

---

## Trợ Giúp AI & Quá Trình Phát Triển

### Cách AI Giúp Ích
- ✅ Tạo template component ban đầu
- ✅ Giải quyết lỗi React
- ✅ Cải thiện CSS responsive
- ✅ Thêm aria attributes
- ✅ Tối ưu hóa state management

### Giới Hạn Của AI
- ❌ Thiết kế trực quan (phải thử nghiệm và điều chỉnh thủ công)
- ❌ Sự tinh tế trong UX
- ❌ Hiểu rõ yêu cầu cụ thể lần đầu
- ❌ Khả năng truy cập tự động (phải kiểm tra thủ công)

### Kỹ Thuật Hiệu Quả Khi Làm Việc Với AI
1. Mô tả chi tiết các yêu cầu
2. Cung cấp ví dụ cụ thể
3. Đặt câu hỏi khi không hiểu
4. Yêu cầu giải thích mã
5. Thử nghiệm ngay sau khi nhận code
6. Phê bình xây dựng AI output

---

## Kiểm Tra Chất Lượng

### Unit Testing (Optional)
```bash
npm test
```

### Accessibility Testing
- Chạy qua [WAVE](https://wave.webaim.org/)
- Chạy qua [axe DevTools](https://www.deque.com/axe/devtools/)
- Test bằng bàn phím (Tab, Enter, Space, Escape)

### Performance Testing
- Mở Chrome DevTools → Lighthouse
- Kiểm tra Performance, Accessibility, Best Practices

---

## Mở Rộng & Cải Tiến Trong Tương Lai

Các tính năng có thể thêm vào:
- [ ] Dark mode toggle
- [ ] Due dates / Priority levels
- [ ] Categories/Tags
- [ ] Recurring todos
- [ ] Cloud sync (Firebase, etc.)
- [ ] Export to CSV
- [ ] Drag-and-drop reorder
- [ ] Keyboard shortcuts
- [ ] Notifications

---

## Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [MDN - HTML Form Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [LocalStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console trình duyệt (F12 → Console)
2. Đọc lại các prompt/instructions
3. Liên hệ giảng viên hoặc nhóm hỗ trợ

---

## Ghi Chú Của Tác Giả

[Thêm bất kỳ ghi chú cá nhân nào về dự án]

---

**Ngày Hoàn Thành:** [Ngày/Tháng/Năm]
**Tác Giả:** [Họ Tên Sinh Viên]
**Lớp:** [Tên Lớp]
**Trường:** [Tên Trường]
