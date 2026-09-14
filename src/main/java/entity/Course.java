package entity;

/**
 * ============================================================
 * CLASS: Course.java
 * LAYER: Entity (Model) - Entity bổ sung (Phần nâng cao)
 * MÔ TẢ: Đại diện cho một khóa học trong hệ thống
 *
 * OOP áp dụng:
 *   - Đóng gói (Encapsulation): fields private, truy cập qua getter/setter
 *   - Validation trong setter để đảm bảo dữ liệu hợp lệ
 * ============================================================
 */
public class Course {

    // ========== FIELDS (private - Đóng gói) ==========
    private int id;
    private String name;
    private int credits;
    private String instructor;
    private int departmentId;

    // ========== CONSTRUCTORS ==========

    /** Constructor mặc định */
    public Course() {}

    /**
     * Constructor với tham số đầy đủ
     */
    public Course(String name, int credits, String instructor, int departmentId) {
        setName(name);
        setCredits(credits);
        this.instructor = instructor;
        this.departmentId = departmentId;
    }

    // ========== GETTERS & SETTERS ==========

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    /**
     * Setter với validation - tên khóa học không được rỗng
     */
    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("❌ Tên khóa học không được để trống!");
        }
        this.name = name.trim();
    }

    public int getCredits() {
        return credits;
    }

    /**
     * Setter với validation - số tín chỉ phải từ 1 đến 10
     */
    public void setCredits(int credits) {
        if (credits < 1 || credits > 10) {
            throw new IllegalArgumentException(
                "❌ Số tín chỉ không hợp lệ: " + credits + " (phải trong khoảng 1 - 10)"
            );
        }
        this.credits = credits;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    // ========== METHODS ==========

    @Override
    public String toString() {
        return String.format(
            "Course{id=%d, name='%s', credits=%d, instructor='%s', departmentId=%d}",
            id, name, credits, instructor, departmentId
        );
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Course)) return false;
        Course other = (Course) obj;
        return this.id == other.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}
