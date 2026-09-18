package dao;

import entity.Student;
import java.util.List;

/**
 * ============================================================
 * INTERFACE: StudentDAO.java
 * LAYER: DAO (Data Access Object)
 * MÔ TẢ: Định nghĩa "hợp đồng" (contract) cho tất cả các
 *         implementation truy cập dữ liệu Student
 *
 * OOP áp dụng:
 *   - Trừu tượng hóa (Abstraction): ẩn chi tiết triển khai,
 *     chỉ công bố giao diện (API)
 *
 * Nguyên tắc SOLID:
 *   - DIP (Dependency Inversion): các layer trên phụ thuộc vào
 *     interface này, không phụ thuộc vào implementation cụ thể
 *   - ISP (Interface Segregation): interface chỉ chứa các
 *     phương thức liên quan đến Student
 *
 * Lợi ích:
 *   - Dễ thay đổi database (MySQL → MongoDB) mà không đổi code khác
 *   - Dễ testing với MockStudentDAO
 *   - Áp dụng Dependency Injection
 * ============================================================
 */
public interface StudentDAO {

    /**
     * Lưu một sinh viên mới vào datasource
     * @param student đối tượng sinh viên cần lưu
     * @throws Exception nếu có lỗi khi lưu
     */
    void save(Student student) throws Exception;

    /**
     * Tìm sinh viên theo ID
     * @param id ID của sinh viên
     * @return Student nếu tìm thấy, null nếu không tìm thấy
     * @throws Exception nếu có lỗi khi truy vấn
     */
    Student findById(int id) throws Exception;

    /**
     * Lấy danh sách tất cả sinh viên
     * @return List chứa tất cả sinh viên (có thể rỗng)
     * @throws Exception nếu có lỗi khi truy vấn
     */
    List<Student> findAll() throws Exception;

    /**
     * Tìm sinh viên theo tên (hỗ trợ tìm kiếm từng phần - LIKE)
     * @param name từ khóa tên cần tìm
     * @return List sinh viên có tên chứa từ khóa
     * @throws Exception nếu có lỗi khi truy vấn
     */
    List<Student> findByName(String name) throws Exception;

    /**
     * Cập nhật thông tin sinh viên
     * @param student sinh viên cần cập nhật (phải có id hợp lệ)
     * @throws Exception nếu có lỗi khi cập nhật
     */
    void update(Student student) throws Exception;

    /**
     * Xóa sinh viên theo ID
     * @param id ID của sinh viên cần xóa
     * @throws Exception nếu có lỗi khi xóa
     */
    void delete(int id) throws Exception;

    /**
     * Business logic: Tìm sinh viên có GPA từ ngưỡng trở lên
     * @param minGPA ngưỡng GPA tối thiểu
     * @return List sinh viên đáp ứng điều kiện, sắp xếp GPA giảm dần
     * @throws Exception nếu có lỗi khi truy vấn
     */
    List<Student> findStudentsWithHighGPA(double minGPA) throws Exception;
}
