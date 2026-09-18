package dao;

import entity.Student;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================
 * CLASS: MySQLStudentDAO.java
 * LAYER: DAO (Data Access Object) - MySQL Implementation
 * MÔ TẢ: Triển khai StudentDAO sử dụng MySQL Database qua JDBC
 *
 * OOP áp dụng:
 *   - Kế thừa (Inheritance - implements): triển khai interface StudentDAO
 *   - Đa hình (Polymorphism): có thể thay thế bởi bất kỳ StudentDAO nào
 *
 * Nguyên tắc SOLID:
 *   - SRP (Single Responsibility): chỉ chịu trách nhiệm truy cập MySQL
 *   - OCP (Open/Closed): mở cho mở rộng, đóng cho sửa đổi
 *
 * Best Practices:
 *   - Sử dụng PreparedStatement để tránh SQL Injection
 *   - Try-with-resources để tự động đóng Connection/Statement
 * ============================================================
 */
public class MySQLStudentDAO implements StudentDAO {

    // ========== FIELDS ==========
    private final String url;
    private final String user;
    private final String password;

    // ========== CONSTRUCTOR ==========

    /**
     * Constructor nhận thông tin kết nối DB
     * @param url      JDBC URL, ví dụ: jdbc:mysql://localhost:3306/student_management
     * @param user     tên đăng nhập MySQL
     * @param password mật khẩu MySQL
     */
    public MySQLStudentDAO(String url, String user, String password) {
        this.url = url;
        this.user = user;
        this.password = password;
    }

    // ========== PRIVATE HELPER ==========

    /**
     * Thiết lập và trả về Connection đến MySQL
     * @return Connection đến database
     * @throws SQLException nếu không kết nối được
     */
    private Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("❌ MySQL Driver không tìm thấy! Hãy kiểm tra pom.xml", e);
        }
        return DriverManager.getConnection(url, user, password);
    }

    /**
     * Helper method: Map ResultSet row → Student object
     * (Tái sử dụng cho mọi query trả về Student)
     */
    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        Student student = new Student();
        student.setId(rs.getInt("id"));
        student.setName(rs.getString("name"));
        student.setEmail(rs.getString("email"));
        student.setGpa(rs.getDouble("gpa"));
        student.setEnrollmentDate(rs.getString("enrollment_date"));
        return student;
    }

    // ========== IMPLEMENT StudentDAO ==========

    /**
     * Lưu sinh viên mới vào MySQL (INSERT)
     */
    @Override
    public void save(Student student) throws Exception {
        String sql = "INSERT INTO students (name, email, gpa, enrollment_date) VALUES (?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, student.getName());
            stmt.setString(2, student.getEmail());
            stmt.setDouble(3, student.getGpa());
            stmt.setString(4, student.getEnrollmentDate());

            int rowsAffected = stmt.executeUpdate();

            if (rowsAffected > 0) {
                // Lấy ID tự sinh về cho object
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        student.setId(generatedKeys.getInt(1));
                    }
                }
                System.out.println("✅ Lưu sinh viên thành công: " + student.getName()
                    + " (ID: " + student.getId() + ")");
            }
        }
    }

    /**
     * Tìm sinh viên theo ID (SELECT WHERE id = ?)
     */
    @Override
    public Student findById(int id) throws Exception {
        String sql = "SELECT * FROM students WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToStudent(rs);
                }
            }
        }
        return null; // Không tìm thấy
    }

    /**
     * Lấy tất cả sinh viên (SELECT *)
     */
    @Override
    public List<Student> findAll() throws Exception {
        List<Student> students = new ArrayList<>();
        String sql = "SELECT * FROM students ORDER BY id";

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                students.add(mapResultSetToStudent(rs));
            }
        }
        return students;
    }

    /**
     * Tìm sinh viên theo tên (LIKE - tìm kiếm từng phần)
     */
    @Override
    public List<Student> findByName(String name) throws Exception {
        List<Student> students = new ArrayList<>();
        String sql = "SELECT * FROM students WHERE name LIKE ? ORDER BY name";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, "%" + name + "%");

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    students.add(mapResultSetToStudent(rs));
                }
            }
        }
        return students;
    }

    /**
     * Cập nhật thông tin sinh viên (UPDATE)
     */
    @Override
    public void update(Student student) throws Exception {
        String sql = "UPDATE students SET name = ?, email = ?, gpa = ?, enrollment_date = ? WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, student.getName());
            stmt.setString(2, student.getEmail());
            stmt.setDouble(3, student.getGpa());
            stmt.setString(4, student.getEnrollmentDate());
            stmt.setInt(5, student.getId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("✅ Cập nhật sinh viên thành công: " + student.getName());
            } else {
                System.out.println("⚠️  Không tìm thấy sinh viên với ID: " + student.getId());
            }
        }
    }

    /**
     * Xóa sinh viên theo ID (DELETE)
     */
    @Override
    public void delete(int id) throws Exception {
        String sql = "DELETE FROM students WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            int rowsAffected = stmt.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("✅ Xóa sinh viên thành công (ID: " + id + ")");
            } else {
                System.out.println("⚠️  Không tìm thấy sinh viên với ID: " + id);
            }
        }
    }

    /**
     * Tìm sinh viên có GPA cao (SELECT WHERE gpa >= ?)
     */
    @Override
    public List<Student> findStudentsWithHighGPA(double minGPA) throws Exception {
        List<Student> students = new ArrayList<>();
        String sql = "SELECT * FROM students WHERE gpa >= ? ORDER BY gpa DESC";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setDouble(1, minGPA);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    students.add(mapResultSetToStudent(rs));
                }
            }
        }
        return students;
    }
}
