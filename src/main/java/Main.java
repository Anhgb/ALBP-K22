import dao.MockStudentDAO;
import dao.MySQLStudentDAO;
import dao.StudentDAO;
import entity.Student;
import service.StudentService;
import util.FakerDataGenerator;

import java.io.PrintStream;
import java.util.List;


/**
 * ============================================================
 * CLASS: Main.java
 * LAYER: Application Entry Point
 * MÔ TẢ: Điểm khởi đầu ứng dụng, demo DAO Pattern
 *
 * OOP áp dụng:
 *   - Dependency Injection: chọn DAO và inject vào Service
 *   - Đa hình: cùng StudentService, khác DAO implementation
 *
 * HƯỚNG DẪN CHẠY:
 *   1. Đảm bảo MySQL đang chạy (cho OPTION 1)
 *   2. Cập nhật DB_PASSWORD bên dưới
 *   3. Đã chạy database.sql để tạo bảng và dữ liệu mẫu
 *   4. mvn compile && mvn exec:java -Dexec.mainClass="Main"
 * ============================================================
 */
public class Main {

    // ========== CẤU HÌNH DATABASE ==========
    // ⚠️  Thay thế bằng thông tin MySQL của bạn!
    private static final String DB_URL      = "jdbc:mysql://localhost:3306/student_management?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER     = "root";
    private static final String DB_PASSWORD = ""; // XAMPP mặc định không có mật khẩu

    // ========== MAIN ==========
    public static void main(String[] args) throws Exception {

        // Fix hiển thị tiếng Việt trên Windows (cmd / PowerShell / NetBeans)
        System.setOut(new PrintStream(System.out, true, "UTF-8"));
        System.setErr(new PrintStream(System.err, true, "UTF-8"));

        System.out.println("╬══════════════════════════════════════════════════════════╬");
        System.out.println("║           DEMO DAO PATTERN - QUẢN LÝ SINH VIÊN           ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");

        // ─────────────────────────────────────────────────────
        // OPTION 1: MOCK DAO (không cần database - chạy ngay)
        // ─────────────────────────────────────────────────────
        System.out.println("\n\n🧪 ======= DEMO VỚI MOCK DAO (Testing Mode) =======");
        demoWithMockDAO();

        // ─────────────────────────────────────────────────────
        // OPTION 2: MySQL DAO (cần MySQL đang chạy)
        // ─────────────────────────────────────────────────────
        System.out.println("\n\n🗄️  ======= DEMO VỚI MYSQL DAO (Production Mode) =======");
        demoWithMySQLDAO();

        // ─────────────────────────────────────────────────────
        // OPTION 3: FAKER DATA (sinh dữ liệu ngẫu nhiên tự động)
        // ─────────────────────────────────────────────────────
        System.out.println("\n\n🎲 ======= DEMO VỚI JAVAFAKER (Auto-generated Data) =======");
        demoWithFaker();
    }


    /**
     * Demo với JavaFaker - tự động sinh dữ liệu Student ngẫu nhiên
     * và thêm vào MockDAO để kiểm thử.
     */
    private static void demoWithFaker() {
        try {
            // ===== KHỞI TẠO FAKER GENERATOR =====
            FakerDataGenerator gen = new FakerDataGenerator();

            // ===== TẠO DAO TRỐNG & SERVICE =====
            StudentDAO dao     = new MockStudentDAO(false); // false = bắt đầu trống
            StudentService service = new StudentService(dao);

            System.out.println("\n📦 Sinh 5 sinh viên ngẫu nhiên bằng JavaFaker...");
            List<Student> fakeStudents = gen.randomStudents(5);

            // Thêm từng sinh viên vào DAO
            for (Student s : fakeStudents) {
                service.registerStudent(s.getName(), s.getEmail(), s.getGpa(), s.getEnrollmentDate());
            }

            // Hiển thị danh sách vừa tạo
            service.displayAllStudents();

            // Thống kê
            service.getStudentStats();

            // Sinh viên xuất sắc (GPA > 2.5)
            service.promoteHighPerformers(2.5);

        } catch (Exception e) {
            System.err.println("❌ Lỗi trong Faker Demo: " + e.getMessage());
            e.printStackTrace();
        }
    }


    private static void demoWithMockDAO() {
        try {
            // ===== TẠO DAO & SERVICE (Dependency Injection) =====
            // Đây là Mock DAO - lưu dữ liệu trong memory
            StudentDAO mockDAO = new MockStudentDAO(true); // true = có dữ liệu mẫu
            StudentService service = new StudentService(mockDAO);

            // ===== HIỂN THỊ DANH SÁCH =====
            service.displayAllStudents();

            // ===== THÊM SINH VIÊN =====
            System.out.println("\n--- Thêm sinh viên mới ---");
            service.registerStudent("Lê Văn F", "f@test.com", 3.7, "2024-01-01");
            service.registerStudent("Vũ Thị G", "g@test.com", 2.9, "2024-02-01");

            // ===== TÌM KIẾM =====
            System.out.println("\n--- Tìm kiếm sinh viên ---");
            service.searchStudent("Nguyễn");

            // ===== SINH VIÊN XUẤT SẮC =====
            service.promoteHighPerformers(3.5);

            // ===== CẬP NHẬT =====
            System.out.println("\n--- Cập nhật sinh viên ID=1 ---");
            service.updateStudent(1, "Nguyễn Văn An", "an@test.com", 3.8, "2023-09-01");

            // ===== XÓA =====
            System.out.println("\n--- Xóa sinh viên ID=2 ---");
            service.removeStudent(2);

            // ===== THỐNG KÊ =====
            service.getStudentStats();

            // ===== HIỂN THỊ SAU KHI THAO TÁC =====
            service.displayAllStudents();

        } catch (Exception e) {
            System.err.println("❌ Lỗi trong Mock Demo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Demo với MySQLStudentDAO - kết nối database thực
     * Yêu cầu: MySQL đang chạy + database.sql đã được chạy
     */
    private static void demoWithMySQLDAO() {
        try {
            // ===== TẠO DAO & SERVICE (Dependency Injection) =====
            // Đây là MySQL DAO - lưu vào database thực
            StudentDAO mysqlDAO = new MySQLStudentDAO(DB_URL, DB_USER, DB_PASSWORD);
            StudentService service = new StudentService(mysqlDAO);

            // ===== HIỂN THỊ DANH SÁCH =====
            service.displayAllStudents();

            // ===== TÌM KIẾM =====
            System.out.println("\n--- Tìm kiếm sinh viên tên 'Nguyễn' ---");
            service.searchStudent("Nguyễn");

            // ===== SINH VIÊN XUẤT SẮC =====
            service.promoteHighPerformers(3.5);

            // ===== THỐNG KÊ =====
            service.getStudentStats();

            // ===== THÊM SINH VIÊN MỚI (email ngẫu nhiên để tránh trùng) =====
            System.out.println("\n--- Thêm sinh viên mới vào MySQL ---");
            FakerDataGenerator gen = new FakerDataGenerator();
            entity.Student fake = gen.randomStudent();
            service.registerStudent(
                fake.getName(),
                fake.getEmail(),
                fake.getGpa(),
                fake.getEnrollmentDate()
            );

            // ===== HIỂN THỊ SAU KHI THÊM =====
            service.displayAllStudents();

        } catch (Exception e) {
            System.err.println("❌ Lỗi kết nối MySQL: " + e.getMessage());
            System.err.println("💡 Hãy kiểm tra:");
            System.err.println("   1. MySQL đang chạy?");
            System.err.println("   2. DB_PASSWORD đúng chưa?");
            System.err.println("   3. Đã chạy database.sql chưa?");
        }
    }
}
