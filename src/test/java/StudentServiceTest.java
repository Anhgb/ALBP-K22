import dao.MockStudentDAO;
import dao.StudentDAO;
import entity.Student;
import org.junit.Before;
import org.junit.Test;
import service.StudentService;

import java.util.List;

import static org.junit.Assert.*;

/**
 * ============================================================
 * CLASS: StudentServiceTest.java
 * LAYER: Test
 * MÔ TẢ: Unit Tests cho StudentService sử dụng MockStudentDAO
 *         (Không cần kết nối database thực)
 *
 * Áp dụng:
 *   - JUnit 4 (@Before, @Test, @Test(expected=...))
 *   - MockStudentDAO để test mà không cần DB
 *   - AAA Pattern: Arrange - Act - Assert
 *
 * Chạy: mvn test
 * ============================================================
 */
public class StudentServiceTest {

    // ========== FIELDS ==========
    private MockStudentDAO mockDAO;
    private StudentService service;

    /**
     * Chạy TRƯỚC MỖI test - reset trạng thái sạch
     * Đảm bảo mỗi test độc lập, không ảnh hưởng nhau
     */
    @Before
    public void setUp() {
        mockDAO = new MockStudentDAO(); // Danh sách rỗng
        service = new StudentService(mockDAO);
    }

    // ========== TEST 1: registerStudent ==========

    /**
     * Test: Đăng ký sinh viên mới → số lượng tăng thêm 1
     */
    @Test
    public void testRegisterStudent_success() throws Exception {
        // Arrange
        int sizeBefore = mockDAO.findAll().size();

        // Act
        service.registerStudent("Nguyễn Văn Test", "test@test.com", 3.5, "2024-01-01");

        // Assert
        int sizeAfter = mockDAO.findAll().size();
        assertEquals("Số sinh viên phải tăng thêm 1", sizeBefore + 1, sizeAfter);
    }

    /**
     * Test: Đăng ký nhiều sinh viên → số lượng đúng
     */
    @Test
    public void testRegisterStudent_multipleStudents() throws Exception {
        // Act
        service.registerStudent("SV 1", "sv1@test.com", 3.0, "2024-01-01");
        service.registerStudent("SV 2", "sv2@test.com", 3.5, "2024-01-01");
        service.registerStudent("SV 3", "sv3@test.com", 3.8, "2024-01-01");

        // Assert
        assertEquals("Phải có đúng 3 sinh viên", 3, mockDAO.findAll().size());
    }

    // ========== TEST 2: findById ==========

    /**
     * Test: Tìm sinh viên theo ID hợp lệ → trả về đúng sinh viên
     */
    @Test
    public void testFindById_found() throws Exception {
        // Arrange - thêm sinh viên và lấy ID
        service.registerStudent("Trần Thị B", "b@test.com", 3.8, "2023-09-01");
        List<Student> all = mockDAO.findAll();
        int existingId = all.get(0).getId();

        // Act
        Student found = mockDAO.findById(existingId);

        // Assert
        assertNotNull("Phải tìm thấy sinh viên", found);
        assertEquals("Tên phải khớp", "Trần Thị B", found.getName());
        assertEquals("Email phải khớp", "b@test.com", found.getEmail());
    }

    /**
     * Test: Tìm sinh viên với ID không tồn tại → trả về null
     */
    @Test
    public void testFindById_notFound() throws Exception {
        // Act
        Student result = mockDAO.findById(9999);

        // Assert
        assertNull("Phải trả về null khi không tìm thấy", result);
    }

    // ========== TEST 3: update ==========

    /**
     * Test: Cập nhật thông tin sinh viên → dữ liệu được cập nhật đúng
     */
    @Test
    public void testUpdateStudent_success() throws Exception {
        // Arrange - thêm và lấy sinh viên
        service.registerStudent("Phạm Văn Old", "old@test.com", 3.0, "2023-01-01");
        Student student = mockDAO.findAll().get(0);
        int id = student.getId();

        // Act - cập nhật
        service.updateStudent(id, "Phạm Văn New", "new@test.com", 3.9, "2024-06-01");

        // Assert - kiểm tra dữ liệu mới
        Student updated = mockDAO.findById(id);
        assertNotNull(updated);
        assertEquals("Tên mới phải đúng",  "Phạm Văn New",  updated.getName());
        assertEquals("Email mới phải đúng", "new@test.com",  updated.getEmail());
        assertEquals("GPA mới phải đúng",   3.9, updated.getGpa(), 0.001);
    }

    // ========== TEST 4: delete ==========

    /**
     * Test: Xóa sinh viên theo ID → số lượng giảm 1, không tìm thấy nữa
     */
    @Test
    public void testDeleteStudent_success() throws Exception {
        // Arrange - thêm 2 sinh viên
        service.registerStudent("SV A", "a@test.com", 3.5, "2024-01-01");
        service.registerStudent("SV B", "b@test.com", 3.7, "2024-01-01");
        int sizeBefore = mockDAO.findAll().size(); // = 2

        Student toDelete = mockDAO.findAll().get(0);
        int deleteId = toDelete.getId();

        // Act
        service.removeStudent(deleteId);

        // Assert
        assertEquals("Số sinh viên phải giảm 1", sizeBefore - 1, mockDAO.findAll().size());
        assertNull("Sinh viên đã xóa không được tìm thấy", mockDAO.findById(deleteId));
    }

    // ========== TEST 5: findStudentsWithHighGPA ==========

    /**
     * Test: Tìm sinh viên GPA cao → chỉ trả về sinh viên đủ điều kiện
     */
    @Test
    public void testFindStudentsWithHighGPA_onlyHighGPA() throws Exception {
        // Arrange - thêm sinh viên với GPA khác nhau
        service.registerStudent("SV GPA Cao",  "high@test.com",  3.8, "2024-01-01");
        service.registerStudent("SV GPA Thấp", "low@test.com",   2.5, "2024-01-01");
        service.registerStudent("SV GPA Vừa",  "mid@test.com",   3.5, "2024-01-01");

        // Act
        List<Student> topStudents = mockDAO.findStudentsWithHighGPA(3.5);

        // Assert
        assertEquals("Phải có đúng 2 sinh viên GPA >= 3.5", 2, topStudents.size());

        // Kiểm tra tất cả đều đủ điều kiện
        for (Student s : topStudents) {
            assertTrue("GPA phải >= 3.5: " + s.getName(), s.getGpa() >= 3.5);
        }
    }

    /**
     * Test: Tìm sinh viên GPA cao khi không ai đủ điều kiện → danh sách rỗng
     */
    @Test
    public void testFindStudentsWithHighGPA_noResult() throws Exception {
        // Arrange
        service.registerStudent("SV GPA Thấp", "low@test.com", 2.5, "2024-01-01");

        // Act
        List<Student> topStudents = mockDAO.findStudentsWithHighGPA(3.9);

        // Assert
        assertTrue("Danh sách phải rỗng", topStudents.isEmpty());
    }

    // ========== TEST 6: Validation - GPA ==========

    /**
     * Test: GPA > 4.0 → ném IllegalArgumentException
     */
    @Test(expected = IllegalArgumentException.class)
    public void testSetGpa_aboveMax_throwsException() {
        Student student = new Student();
        student.setGpa(4.1); // GPA > 4.0 → exception
    }

    /**
     * Test: GPA âm → ném IllegalArgumentException
     */
    @Test(expected = IllegalArgumentException.class)
    public void testSetGpa_negative_throwsException() {
        Student student = new Student();
        student.setGpa(-0.1); // GPA < 0 → exception
    }

    /**
     * Test: GPA hợp lệ (0.0 - 4.0) → không ném exception
     */
    @Test
    public void testSetGpa_validRange_noException() {
        Student student = new Student();
        // Không ném exception với các giá trị hợp lệ
        student.setGpa(0.0);
        student.setGpa(2.5);
        student.setGpa(4.0);
        assertEquals(4.0, student.getGpa(), 0.001);
    }

    // ========== TEST 7: Validation - Email ==========

    /**
     * Test: Email không có '@' → ném IllegalArgumentException
     */
    @Test(expected = IllegalArgumentException.class)
    public void testSetEmail_noAtSign_throwsException() {
        Student student = new Student();
        student.setEmail("invalid-email-no-at"); // Không có '@' → exception
    }

    /**
     * Test: Email hợp lệ → không ném exception
     */
    @Test
    public void testSetEmail_validEmail_noException() {
        Student student = new Student();
        student.setEmail("valid@university.edu");
        assertEquals("valid@university.edu", student.getEmail());
    }

    // ========== TEST 8: Validation - Name ==========

    /**
     * Test: Tên rỗng → ném IllegalArgumentException
     */
    @Test(expected = IllegalArgumentException.class)
    public void testSetName_emptyString_throwsException() {
        Student student = new Student();
        student.setName(""); // Tên rỗng → exception
    }

    /**
     * Test: Tên null → ném IllegalArgumentException
     */
    @Test(expected = IllegalArgumentException.class)
    public void testSetName_null_throwsException() {
        Student student = new Student();
        student.setName(null); // null → exception
    }

    // ========== TEST 9: findByName ==========

    /**
     * Test: Tìm theo tên → trả về đúng kết quả, không phân biệt hoa/thường
     */
    @Test
    public void testFindByName_caseInsensitive() throws Exception {
        // Arrange
        service.registerStudent("Nguyễn Văn A", "a@test.com", 3.5, "2024-01-01");
        service.registerStudent("Trần Thị B",   "b@test.com", 3.8, "2024-01-01");

        // Act - tìm với chữ thường
        List<Student> results = mockDAO.findByName("nguyễn");

        // Assert
        assertEquals("Phải tìm thấy 1 sinh viên", 1, results.size());
        assertTrue("Kết quả phải chứa 'Nguyễn'",
            results.get(0).getName().contains("Nguyễn"));
    }

    // ========== TEST 10: findAll ==========

    /**
     * Test: findAll với danh sách rỗng → trả về list rỗng (không null)
     */
    @Test
    public void testFindAll_emptyList_returnsEmptyNotNull() throws Exception {
        // Act
        List<Student> students = mockDAO.findAll();

        // Assert
        assertNotNull("Không được trả về null", students);
        assertTrue("Danh sách phải rỗng", students.isEmpty());
    }
}
