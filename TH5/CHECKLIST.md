# ✅ Checklist - Dự Án Todo List

## Yêu Cầu Chức Năng

### Chức Năng Cơ Bản
- [ ] Hiển thị danh sách công việc từ state
- [ ] Thêm công việc mới từ input
- [ ] Xóa công việc từ danh sách
- [ ] Checkbox để đánh dấu hoàn thành
- [ ] Công việc hoàn thành hiển thị kiểu gạch ngang
- [ ] Hiển thị thông báo trống khi không có công việc
- [ ] Mỗi công việc có ID duy nhất

### Bộ Lọc & Tìm Kiếm
- [ ] 3 nút lọc: Tất Cả, Chưa Hoàn Thành, Đã Hoàn Thành
- [ ] Nút lọc hiện tại được highlight
- [ ] Thanh tìm kiếm lọc công việc theo từ khóa
- [ ] Tìm kiếm không phân biệt chữ hoa/thường
- [ ] Bộ lọc và tìm kiếm kết hợp hoạt động đúng
- [ ] Hiển thị "Không tìm thấy" khi tìm kiếm không có kết quả

### Thống Kê & Trạng Thái
- [ ] Hiển thị tổng số công việc
- [ ] Hiển thị số công việc đã hoàn thành
- [ ] Hiển thị số công việc chưa hoàn thành
- [ ] Thống kê cập nhật động

### LocalStorage
- [ ] Lưu dữ liệu vào localStorage khi thêm/xóa/cập nhật
- [ ] Tải dữ liệu từ localStorage khi component mount
- [ ] Nút "Xóa Tất Cả" với xác nhận
- [ ] Dữ liệu persist khi refresh trang

---

## Yêu Cầu Kỹ Thuật

### React & JavaScript
- [ ] Sử dụng functional components với hooks
- [ ] useState cho state management
- [ ] useEffect cho side effects (localStorage)
- [ ] PropTypes validation cho tất cả components
- [ ] Mã clean, dễ đọc
- [ ] Không có console errors

### Component Structure
- [ ] App.jsx component chính
- [ ] TodoList.jsx component
- [ ] TodoItem.jsx component
- [ ] FilterBar.jsx component
- [ ] Stats.jsx component
- [ ] SearchBar.jsx component (hoặc tích hợp)
- [ ] Các components được tách hợp lý

### Props & State
- [ ] Props được truyền đúng
- [ ] State được nâng lên component cha phù hợp
- [ ] Không prop drilling quá mức
- [ ] Callback functions hoạt động chính xác

---

## Yêu Cầu Giao Diện & CSS

### Thiết Kế
- [ ] Giao diện trông chuyên nghiệp
- [ ] Màu sắc nhất quán
- [ ] Typography rõ ràng (font size, weight)
- [ ] Spacing nhất quán
- [ ] Không có lỗi hiển thị

### Focus & Hover States
- [ ] Tất cả button có focus style rõ ràng
- [ ] Input có focus style (border + box-shadow)
- [ ] Hover effects mượt mà
- [ ] Transition smooth (0.2s)

### Responsive Design
- [ ] Kiểm tra trên mobile (320px)
- [ ] Kiểm tra trên tablet (768px)
- [ ] Kiểm tra trên desktop (1920px)
- [ ] Không có horizontal scroll không mong muốn
- [ ] Touch targets ≥ 44x44px
- [ ] Font readable trên tất cả devices
- [ ] Layout tự điều chỉnh hợp lý

### Dark Mode (Optional)
- [ ] Dark mode toggle (nếu implement)
- [ ] Kiểu dáng hợp lý ở dark mode
- [ ] Tương phản màu đủ ở dark mode

---

## Yêu Cầu Khả Năng Truy Cập (Accessibility)

### Labels & Input
- [ ] Tất cả input có `<label>` rõ ràng
- [ ] Label liên kết đúng với input (`htmlFor` & `id`)
- [ ] Placeholder không thay thế cho label
- [ ] Input có tên hữu ích cho screen reader

### ARIA Attributes
- [ ] Input có `aria-invalid` khi có lỗi
- [ ] Input có `aria-describedby` liên kết error message
- [ ] Button có `aria-label` hữu ích (ví dụ: "Xóa công việc: [text]")
- [ ] Checkbox có `aria-label` hoặc `aria-describedby`
- [ ] Error messages có `role="alert"`
- [ ] Todo list có `role="list"` và `aria-label`

### Keyboard Navigation
- [ ] Tab di chuyển qua tất cả phần tử tương tác
- [ ] Shift+Tab di chuyển ngược lại
- [ ] Enter kích hoạt button/submit
- [ ] Space bật/tắt checkbox
- [ ] Escape đóng dialog (nếu có)
- [ ] Thứ tự Tab hợp lý (từ trên xuống dưới, trái sang phải)

### Visual Accessibility
- [ ] Focus indicator rõ ràng (outline hoặc box-shadow)
- [ ] Độ tương phản ≥ 4.5:1 cho văn bản bình thường
- [ ] Không dựa solely vào màu sắc để truyền tải thông tin
- [ ] Icon/symbol có giải thích (alt text hoặc label)

### Screen Reader Support
- [ ] Semantic HTML: `<button>`, `<label>`, `<form>`, `<ul>`, `<li>`
- [ ] Không dùng `<div>` thay thế cho `<button>`
- [ ] Heading hierarchy đúng (nếu có)
- [ ] List markup đúng (`<ul>`, `<ol>`, `<li>`)
- [ ] Error messages đọc được cho screen reader

---

## Validation & Error Handling

### Input Validation
- [ ] Input trống được reject
- [ ] Thông báo lỗi hiển thị khi validation fail
- [ ] Thông báo lỗi được xóa khi input hợp lệ
- [ ] Enter/Space không gửi form nếu invalid

### Edge Cases
- [ ] Thêm công việc khi danh sách trống
- [ ] Xóa công việc cuối cùng
- [ ] Tìm kiếm với danh sách trống
- [ ] Lọc với kết quả trống
- [ ] localStorage đầy (try-catch)
- [ ] JSON.parse lỗi (try-catch)

---

## Testing & Debugging

### Manual Testing
- [ ] Test trên tất cả tính năng
- [ ] Test bằng bàn phím
- [ ] Test refresh trang
- [ ] Test localStorage clear browser data
- [ ] Test trên multiple browsers

### Accessibility Testing
- [ ] Chạy qua WAVE (https://wave.webaim.org/)
- [ ] Chạy qua axe DevTools
- [ ] Test với screen reader (NVDA, JAWS, VoiceOver)
- [ ] WebAIM Contrast Checker for colors
- [ ] Test zoom to 200%

### Performance Testing
- [ ] Chạy Lighthouse
- [ ] Kiểm tra Performance score
- [ ] Kiểm tra Accessibility score ≥ 90
- [ ] Không có unused code/imports

---

## Documentation & Submission

### Code Comments
- [ ] Comment cho các hàm phức tạp
- [ ] Comment cho component imports
- [ ] Giải thích logic không obvious

### README.md
- [ ] Mô tả dự án
- [ ] Hướng dẫn cài đặt
- [ ] Danh sách tính năng
- [ ] Cấu trúc dự án
- [ ] Công nghệ sử dụng
- [ ] Hướng dẫn sử dụng

### Báo Cáo Phản Ánh (500-800 từ)
- [ ] Quá trình qua 4 lần lặp lại
- [ ] Những gì học được từ AI
- [ ] Hạn chế AI gặp phải
- [ ] Cách phát hiện/khắc phục accessibility issues
- [ ] Khó khăn responsive design
- [ ] Đánh giá chung

### File Submission
- [ ] Tất cả source files (.jsx, .css)
- [ ] package.json
- [ ] README.md
- [ ] Báo cáo phản ánh
- [ ] Checklist này (đánh dấu completed)
- [ ] Organized in folder/zip
- [ ] Tên file đúng format: LastName_FirstName_TodoApp.zip

---

## Lần Lặp 1: Xây Dựng Giàn Giáo
**Status:** [ ] Chưa bắt đầu | [ ] Đang làm | [ ] Hoàn thành

- [ ] Component TodoList render đúng
- [ ] Checkbox hoạt động
- [ ] Nút Delete hoạt động
- [ ] PropTypes định nghĩa
- [ ] CSS cơ bản

**Ghi Chú:**
```
[Thêm ghi chú về lần lặp này]
```

---

## Lần Lặp 2: Thêm Tương Tác
**Status:** [ ] Chưa bắt đầu | [ ] Đang làm | [ ] Hoàn thành

- [ ] Thêm công việc mới hoạt động
- [ ] 3 nút lọc hoạt động
- [ ] Thanh tìm kiếm hoạt động
- [ ] Bộ lọc + tìm kiếm kết hợp đúng
- [ ] Thống kê hiển thị chính xác
- [ ] Trạng thái trống hiển thị
- [ ] Input validation hoạt động

**Ghi Chú:**
```
[Thêm ghi chú về lần lặp này]
```

---

## Lần Lặp 3: Kiểu Dáng
**Status:** [ ] Chưa bắt đầu | [ ] Đang làm | [ ] Hoàn thành

- [ ] Giao diện đẹp mắt
- [ ] Focus styles rõ ràng
- [ ] Hover effects mượt
- [ ] Responsive mobile (320px)
- [ ] Responsive tablet (768px)
- [ ] Responsive desktop (1920px)
- [ ] Không horizontal scroll
- [ ] CSS organized/clean

**Ghi Chú:**
```
[Thêm ghi chú về lần lặp này]
```

---

## Lần Lặp 4: Đánh Bóng & LocalStorage
**Status:** [ ] Chưa bắt đầu | [ ] Đang làm | [ ] Hoàn thành

- [ ] LocalStorage save hoạt động
- [ ] LocalStorage load hoạt động
- [ ] Tất cả input có label
- [ ] ARIA attributes đầy đủ
- [ ] Keyboard navigation hoạt động
- [ ] Error handling đúng
- [ ] Xóa tất cả có xác nhận
- [ ] Không có console errors

**Ghi Chú:**
```
[Thêm ghi chú về lần lặp này]
```

---

## Điểm Số Tự Đánh Giá

| Tiêu Chí | Điểm | Ghi Chú |
|---|---|---|
| Chức Năng (40%) | __/40 | |
| Mã Code (30%) | __/30 | |
| Giao Diện (20%) | __/20 | |
| Khả Năng Truy Cập (10%) | __/10 | |
| **TỔNG** | **__/100** | |

---

## Người Dùng Cuối Test (Friends/Family)

Yêu cầu 1-2 người khác test ứng dụng:

**Tester 1:** [Tên]
- [ ] Có thể thêm công việc?
- [ ] Có thể hoàn thành công việc?
- [ ] Có thể xóa công việc?
- [ ] Bộ lọc hoạt động?
- [ ] Tìm kiếm hoạt động?
- [ ] Giao diện dễ sử dụng?
- [ ] Ghi chú: ___________

**Tester 2:** [Tên]
- [ ] Có thể thêm công việc?
- [ ] Có thể hoàn thành công việc?
- [ ] Có thể xóa công việc?
- [ ] Bộ lọc hoạt động?
- [ ] Tìm kiếm hoạt động?
- [ ] Giao diện dễ sử dụng?
- [ ] Ghi chú: ___________

---

## Notes & Lessons Learned

```
[Ghi lại những học được, những challenges, solutions]
```

---

**Ngày hoàn thành:** ___________
**Tên sinh viên:** ___________
**Lớp:** ___________
