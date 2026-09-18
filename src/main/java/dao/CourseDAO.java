package dao;

import entity.Course;
import java.util.List;

/**
 * ============================================================
 * INTERFACE: CourseDAO.java
 * LAYER: DAO - Course Entity (Phần nâng cao)
 * MÔ TẢ: Định nghĩa hợp đồng cho tất cả implementation
 *         truy cập dữ liệu Course
 *
 * OOP áp dụng:
 *   - Trừu tượng hóa (Abstraction)
 * ============================================================
 */
public interface CourseDAO {

    void save(Course course) throws Exception;

    Course findById(int id) throws Exception;

    List<Course> findAll() throws Exception;

    List<Course> findByName(String name) throws Exception;

    List<Course> findByDepartment(int departmentId) throws Exception;

    void update(Course course) throws Exception;

    void delete(int id) throws Exception;
}
