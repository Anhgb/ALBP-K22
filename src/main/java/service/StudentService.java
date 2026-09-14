package service;

import dao.StudentDAO;
import entity.Student;

import java.util.List;

/**
 * ============================================================
 * CLASS: StudentService.java
 * LAYER: Service (Business Logic)
 * MÔ TẢ: Xử lý toàn bộ business logic liên quan đến sinh viên.
 *         KHÔNG trực tiếp tương tác với database - ủy quyền
 *         cho StudentDAO.
 *
 * OOP áp dụng:
 *   - Đóng gói (Encapsulation): logic tập trung trong class này
 *   - Dependency Injection: nhận DAO qua constructor
 *
 * Nguyên tắc SOLID:
 *   - SRP: chỉ xử lý business logic, không lo database
 *   - DIP: phụ thuộc vào StudentDAO (interface), không phải
 *           MySQLStudentDAO (implementation)
 *
 * Lợi ích Dependency Injection:
 *   - Dễ thay đổi: new StudentService(mysqlDAO) hoặc
 *                   new StudentService(mockDAO) đều hoạt động
 *   - Dễ test: dùng MockStudentDAO trong unit tests
 * ============================================================
 */
public class StudentService {

    // ========== FIELDS ==========

    /**
     * Phụ thuộc vào INTERFACE, không phải implementation cụ thể
     * → Nguyên tắc DIP (Dependency Inversion Principle)
     */
    private final StudentDAO studentDAO;

    // ========== CONSTRUCTOR (Dependency Injection) ==========

    /**
     * Constructor nhận StudentDAO qua Dependency Injection
     * @param studentDAO có thể là MySQLStudentDAO hoặc MockStudentDAO
     */
    public StudentService(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    // ========== BUSINESS LOGIC METHODS ==========

    /**
     * Đăng ký (tạo mới) một sinh viên
     * - Validate dữ liệu đầu vào
     * - Tạo object Student
     * - Lưu vào datasource qua DAO
     *
     * @param name           tên sinh viên
     * @param email          email sinh viên
     * @param gpa            điểm GPA
     * @param enrollmentDate ngày nhập học (định dạng yyyy-MM-dd)
     * @throws Exception nếu lỗi xảy ra
     */
    public void registerStudent(String name, String email, double gpa, String enrollmentDate)
            throws Exception {

        // --- BƯỚC 1: Validate đầu vào ---
        if (name == null || name.trim().isEmpty()) {
            System.out.println("❌ Tên sinh viên không được để trống!");
            return;
        }
        if (email == null || !email.contains("@")) {
            System.out.println("❌ Email không hợp lệ!");
            return;
        }
        if (enrollmentDate == null || enrollmentDate.trim().isEmpty()) {
            System.out.println("❌ Ngày nhập học không được để trống!");
            return;
        }

        // --- BƯỚC 2: Tạo Student object (Encapsulation với validation) ---
        Student student = new Student(name, email, gpa, enrollmentDate);

        // --- BƯỚC 3: Lưu vào datasource qua DAO ---
        studentDAO.save(student);
    }

    /**
     * Hiển thị tất cả sinh viên
     * @throws Exception nếu lỗi xảy ra
     */
    public void displayAllStudents() throws Exception {
        List<Student> students = studentDAO.findAll();

        if (students.isEmpty()) {
            System.out.println("📭 Danh sách sinh viên trống!");
            return;
        }

        System.out.println("\n📚 === Danh Sách Tất Cả Sinh Viên (" + students.size() + ") ===");
        System.out.println("─".repeat(80));
        for (Student s : students) {
            System.out.printf("  [%d] %-25s | %-30s | GPA: %.2f | Ngày nhập: %s%n",
                s.getId(), s.getName(), s.getEmail(), s.getGpa(), s.getEnrollmentDate());
        }
        System.out.println("─".repeat(80));
    }

    /**
     * Tìm kiếm sinh viên theo tên
     * @param name từ khóa tên cần tìm
     * @throws Exception nếu lỗi xảy ra
     */
    public void searchStudent(String name) throws Exception {
        if (name == null || name.trim().isEmpty()) {
            System.out.println("❌ Vui lòng nhập từ khóa tìm kiếm!");
            return;
        }

        List<Student> results = studentDAO.findByName(name);

        if (results.isEmpty()) {
            System.out.println("🔍 Không tìm thấy sinh viên nào có tên chứa: '" + name + "'");
            return;
        }

        System.out.println("\n🔍 === Kết Quả Tìm Kiếm Cho '" + name + "' (" + results.size() + " kết quả) ===");
        results.forEach(System.out::println);
    }

    /**
     * Hiển thị danh sách sinh viên xuất sắc (GPA >= ngưỡng)
     * @param minGPA ngưỡng GPA tối thiểu
     * @throws Exception nếu lỗi xảy ra
     */
    public void promoteHighPerformers(double minGPA) throws Exception {
        List<Student> topStudents = studentDAO.findStudentsWithHighGPA(minGPA);

        if (topStudents.isEmpty()) {
            System.out.println("📭 Không có sinh viên nào có GPA >= " + minGPA);
            return;
        }

        System.out.println("\n🌟 === Sinh Viên Xuất Sắc (GPA >= " + minGPA + ") ===");
        topStudents.forEach(s ->
            System.out.printf("  ⭐ %-25s | GPA: %.2f%n", s.getName(), s.getGpa())
        );
    }

    /**
     * Cập nhật thông tin sinh viên theo ID
     * @param id             ID sinh viên cần cập nhật
     * @param newName        tên mới
     * @param newEmail       email mới
     * @param newGpa         GPA mới
     * @param newEnrollDate  ngày nhập học mới
     * @throws Exception nếu lỗi xảy ra
     */
    public void updateStudent(int id, String newName, String newEmail,
                              double newGpa, String newEnrollDate) throws Exception {
        // Kiểm tra sinh viên tồn tại
        Student existing = studentDAO.findById(id);
        if (existing == null) {
            System.out.println("❌ Không tìm thấy sinh viên với ID: " + id);
            return;
        }

        // Cập nhật thông tin
        existing.setName(newName);
        existing.setEmail(newEmail);
        existing.setGpa(newGpa);
        existing.setEnrollmentDate(newEnrollDate);

        studentDAO.update(existing);
    }

    /**
     * Xóa sinh viên theo ID
     * @param id ID sinh viên cần xóa
     * @throws Exception nếu lỗi xảy ra
     */
    public void removeStudent(int id) throws Exception {
        Student existing = studentDAO.findById(id);
        if (existing == null) {
            System.out.println("❌ Không tìm thấy sinh viên với ID: " + id);
            return;
        }
        studentDAO.delete(id);
    }

    /**
     * Hiển thị thống kê về sinh viên
     * @throws Exception nếu lỗi xảy ra
     */
    public void getStudentStats() throws Exception {
        List<Student> students = studentDAO.findAll();

        if (students.isEmpty()) {
            System.out.println("📊 Không có dữ liệu để thống kê!");
            return;
        }

        double avgGPA = students.stream()
                .mapToDouble(Student::getGpa)
                .average()
                .orElse(0.0);

        double maxGPA = students.stream()
                .mapToDouble(Student::getGpa)
                .max()
                .orElse(0.0);

        double minGPA = students.stream()
                .mapToDouble(Student::getGpa)
                .min()
                .orElse(0.0);

        long excellentCount = students.stream()
                .filter(s -> s.getGpa() >= 3.5)
                .count();

        System.out.println("\n📊 === Thống Kê Sinh Viên ===");
        System.out.println("  Tổng số sinh viên  : " + students.size());
        System.out.printf ("  GPA trung bình     : %.2f%n", avgGPA);
        System.out.printf ("  GPA cao nhất       : %.2f%n", maxGPA);
        System.out.printf ("  GPA thấp nhất      : %.2f%n", minGPA);
        System.out.println("  Sinh viên xuất sắc : " + excellentCount
                + " (GPA >= 3.5)");
    }
}
