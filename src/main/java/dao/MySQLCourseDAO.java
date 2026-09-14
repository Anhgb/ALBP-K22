package dao;

import entity.Course;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================
 * CLASS: MySQLCourseDAO.java
 * LAYER: DAO - Course MySQL Implementation (Phần nâng cao)
 * MÔ TẢ: Triển khai CourseDAO sử dụng MySQL qua JDBC
 * ============================================================
 */
public class MySQLCourseDAO implements CourseDAO {

    // ========== FIELDS ==========
    private final String url;
    private final String user;
    private final String password;

    // ========== CONSTRUCTOR ==========
    public MySQLCourseDAO(String url, String user, String password) {
        this.url = url;
        this.user = user;
        this.password = password;
    }

    // ========== PRIVATE HELPER ==========
    private Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("❌ MySQL Driver không tìm thấy!", e);
        }
        return DriverManager.getConnection(url, user, password);
    }

    private Course mapResultSetToCourse(ResultSet rs) throws SQLException {
        Course course = new Course();
        course.setId(rs.getInt("id"));
        course.setName(rs.getString("name"));
        course.setCredits(rs.getInt("credits"));
        course.setInstructor(rs.getString("instructor"));
        course.setDepartmentId(rs.getInt("department_id"));
        return course;
    }

    // ========== IMPLEMENT CourseDAO ==========

    @Override
    public void save(Course course) throws Exception {
        String sql = "INSERT INTO courses (name, credits, instructor, department_id) VALUES (?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, course.getName());
            stmt.setInt(2, course.getCredits());
            stmt.setString(3, course.getInstructor());
            stmt.setInt(4, course.getDepartmentId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        course.setId(keys.getInt(1));
                    }
                }
                System.out.println("✅ Lưu khóa học thành công: " + course.getName());
            }
        }
    }

    @Override
    public Course findById(int id) throws Exception {
        String sql = "SELECT * FROM courses WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapResultSetToCourse(rs);
            }
        }
        return null;
    }

    @Override
    public List<Course> findAll() throws Exception {
        List<Course> courses = new ArrayList<>();
        String sql = "SELECT * FROM courses ORDER BY id";

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                courses.add(mapResultSetToCourse(rs));
            }
        }
        return courses;
    }

    @Override
    public List<Course> findByName(String name) throws Exception {
        List<Course> courses = new ArrayList<>();
        String sql = "SELECT * FROM courses WHERE name LIKE ? ORDER BY name";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, "%" + name + "%");
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    courses.add(mapResultSetToCourse(rs));
                }
            }
        }
        return courses;
    }

    @Override
    public List<Course> findByDepartment(int departmentId) throws Exception {
        List<Course> courses = new ArrayList<>();
        String sql = "SELECT * FROM courses WHERE department_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, departmentId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    courses.add(mapResultSetToCourse(rs));
                }
            }
        }
        return courses;
    }

    @Override
    public void update(Course course) throws Exception {
        String sql = "UPDATE courses SET name = ?, credits = ?, instructor = ?, department_id = ? WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, course.getName());
            stmt.setInt(2, course.getCredits());
            stmt.setString(3, course.getInstructor());
            stmt.setInt(4, course.getDepartmentId());
            stmt.setInt(5, course.getId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("✅ Cập nhật khóa học thành công: " + course.getName());
            } else {
                System.out.println("⚠️  Không tìm thấy khóa học ID: " + course.getId());
            }
        }
    }

    @Override
    public void delete(int id) throws Exception {
        String sql = "DELETE FROM courses WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            int rowsAffected = stmt.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("✅ Xóa khóa học thành công (ID: " + id + ")");
            } else {
                System.out.println("⚠️  Không tìm thấy khóa học ID: " + id);
            }
        }
    }
}
