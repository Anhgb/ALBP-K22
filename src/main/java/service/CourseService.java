package service;

import dao.CourseDAO;
import entity.Course;

import java.util.List;

/**
 * ============================================================
 * CLASS: CourseService.java
 * LAYER: Service (Business Logic) - Phần nâng cao
 * MÔ TẢ: Xử lý business logic cho Course entity
 * ============================================================
 */
public class CourseService {

    private final CourseDAO courseDAO;

    /**
     * Constructor Dependency Injection
     */
    public CourseService(CourseDAO courseDAO) {
        this.courseDAO = courseDAO;
    }

    /**
     * Thêm khóa học mới
     */
    public void addCourse(String name, int credits, String instructor, int departmentId)
            throws Exception {

        if (name == null || name.trim().isEmpty()) {
            System.out.println("❌ Tên khóa học không được để trống!");
            return;
        }

        Course course = new Course(name, credits, instructor, departmentId);
        courseDAO.save(course);
    }

    /**
     * Hiển thị tất cả khóa học
     */
    public void displayAllCourses() throws Exception {
        List<Course> courses = courseDAO.findAll();

        if (courses.isEmpty()) {
            System.out.println("📭 Danh sách khóa học trống!");
            return;
        }

        System.out.println("\n📘 === Danh Sách Khóa Học (" + courses.size() + ") ===");
        System.out.println("─".repeat(70));
        for (Course c : courses) {
            System.out.printf("  [%d] %-25s | Tín chỉ: %d | Giảng viên: %s%n",
                c.getId(), c.getName(), c.getCredits(), c.getInstructor());
        }
        System.out.println("─".repeat(70));
    }

    /**
     * Tìm kiếm khóa học theo tên
     */
    public void searchCourse(String name) throws Exception {
        List<Course> results = courseDAO.findByName(name);

        if (results.isEmpty()) {
            System.out.println("🔍 Không tìm thấy khóa học có tên chứa: '" + name + "'");
            return;
        }

        System.out.println("\n🔍 === Kết Quả Tìm Kiếm Khóa Học '" + name + "' ===");
        results.forEach(System.out::println);
    }

    /**
     * Xóa khóa học theo ID
     */
    public void removeCourse(int id) throws Exception {
        Course existing = courseDAO.findById(id);
        if (existing == null) {
            System.out.println("❌ Không tìm thấy khóa học với ID: " + id);
            return;
        }
        courseDAO.delete(id);
    }
}
