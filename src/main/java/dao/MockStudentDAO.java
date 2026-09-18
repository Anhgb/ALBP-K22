package dao;

import entity.Student;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ============================================================
 * CLASS: MockStudentDAO.java
 * LAYER: DAO - Mock Implementation (dùng cho Testing)
 * MÔ TẢ: Triển khai StudentDAO sử dụng bộ nhớ (in-memory List)
 *         thay vì database thực. Dùng để test StudentService
 *         mà không cần kết nối MySQL.
 *
 * OOP áp dụng:
 *   - Đa hình (Polymorphism): triển khai cùng interface StudentDAO
 *     nhưng hành vi khác với MySQLStudentDAO
 *   - Kế thừa (Inheritance - implements): triển khai StudentDAO
 *
 * Nguyên tắc SOLID:
 *   - LSP (Liskov Substitution): có thể thay MySQLStudentDAO
 *     bằng MockStudentDAO mà StudentService không bị lỗi
 *
 * Lợi ích:
 *   - Không cần MySQL khi chạy unit tests
 *   - Test nhanh hơn nhiều
 *   - Kiểm soát dữ liệu test dễ dàng
 * ============================================================
 */
public class MockStudentDAO implements StudentDAO {

    // ========== FIELDS ==========
    private final List<Student> students = new ArrayList<>();
    private int nextId = 1; // Giả lập AUTO_INCREMENT

    // ========== CONSTRUCTOR ==========

    /**
     * Constructor mặc định - khởi tạo danh sách rỗng
     */
    public MockStudentDAO() {}

    /**
     * Constructor tiện ích - khởi tạo với dữ liệu mẫu
     * @param seedData nếu true, thêm sẵn một số sinh viên mẫu
     */
    public MockStudentDAO(boolean seedData) {
        if (seedData) {
            try {
                save(new Student("Nguyễn Văn A", "a@test.com", 3.5, "2023-09-01"));
                save(new Student("Trần Thị B",   "b@test.com", 3.9, "2023-09-01"));
                save(new Student("Phạm Công C",  "c@test.com", 3.2, "2023-09-15"));
            } catch (Exception e) {
                System.err.println("Lỗi khi seed data: " + e.getMessage());
            }
        }
    }

    // ========== IMPLEMENT StudentDAO ==========

    /**
     * Thêm sinh viên vào List (giả lập INSERT)
     */
    @Override
    public void save(Student student) throws Exception {
        student.setId(nextId++);
        students.add(student);
        System.out.println("✅ [MOCK] Lưu sinh viên: " + student.getName()
            + " (ID: " + student.getId() + ")");
    }

    /**
     * Tìm sinh viên theo ID trong List
     */
    @Override
    public Student findById(int id) throws Exception {
        return students.stream()
                .filter(s -> s.getId() == id)
                .findFirst()
                .orElse(null);
    }

    /**
     * Trả về bản sao của List sinh viên
     */
    @Override
    public List<Student> findAll() throws Exception {
        return new ArrayList<>(students);
    }

    /**
     * Tìm sinh viên theo tên (không phân biệt hoa/thường)
     */
    @Override
    public List<Student> findByName(String name) throws Exception {
        return students.stream()
                .filter(s -> s.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật sinh viên trong List
     */
    @Override
    public void update(Student student) throws Exception {
        boolean found = false;
        for (Student s : students) {
            if (s.getId() == student.getId()) {
                s.setName(student.getName());
                s.setEmail(student.getEmail());
                s.setGpa(student.getGpa());
                s.setEnrollmentDate(student.getEnrollmentDate());
                found = true;
                break;
            }
        }
        if (found) {
            System.out.println("✅ [MOCK] Cập nhật sinh viên: " + student.getName());
        } else {
            System.out.println("⚠️  [MOCK] Không tìm thấy sinh viên ID: " + student.getId());
        }
    }

    /**
     * Xóa sinh viên khỏi List
     */
    @Override
    public void delete(int id) throws Exception {
        boolean removed = students.removeIf(s -> s.getId() == id);
        if (removed) {
            System.out.println("✅ [MOCK] Xóa sinh viên (ID: " + id + ")");
        } else {
            System.out.println("⚠️  [MOCK] Không tìm thấy sinh viên ID: " + id);
        }
    }

    /**
     * Lọc sinh viên có GPA >= ngưỡng, sắp xếp giảm dần
     */
    @Override
    public List<Student> findStudentsWithHighGPA(double minGPA) throws Exception {
        return students.stream()
                .filter(s -> s.getGpa() >= minGPA)
                .sorted((a, b) -> Double.compare(b.getGpa(), a.getGpa()))
                .collect(Collectors.toList());
    }

    // ========== HELPER (cho testing) ==========

    /**
     * Xóa toàn bộ dữ liệu (dùng trong @Before mỗi test)
     */
    public void clear() {
        students.clear();
        nextId = 1;
    }

    /**
     * Lấy số lượng sinh viên hiện có
     */
    public int size() {
        return students.size();
    }
}
