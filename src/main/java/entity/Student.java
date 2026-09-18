package entity;

/**
 * ============================================================
 * CLASS: Student.java
 * LAYER: Entity (Model)
 * Mo ta: Dai dien cho mot sinh vien trong he thong
 *
 * OOP ap dung:
 *   - Dong goi (Encapsulation): fields private, truy cap qua getter/setter
 *   - Validation trong setter de dam bao du lieu hop le
 * ============================================================
 */
public class Student {

    // ========== FIELDS (private - Dong goi) ==========
    private int id;
    private String name;
    private String email;
    private double gpa;
    private String enrollmentDate;

    // ========== CONSTRUCTORS ==========

    /** Constructor mac dinh */
    public Student() {}

    /**
     * Constructor voi tham so day du (khong bao gom id - do DB tu sinh)
     */
    public Student(String name, String email, double gpa, String enrollmentDate) {
        setName(name);
        setEmail(email);
        setGpa(gpa);
        this.enrollmentDate = enrollmentDate;
    }

    // ========== GETTERS & SETTERS ==========

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Ten sinh vien khong duoc de trong!");
        }
        this.name = name.trim();
    }

    public String getEmail() { return email; }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email khong hop le: " + email);
        }
        this.email = email.trim();
    }

    public double getGpa() { return gpa; }

    public void setGpa(double gpa) {
        if (gpa < 0.0 || gpa > 4.0) {
            throw new IllegalArgumentException(
                "GPA khong hop le: " + gpa + " (phai trong khoang 0.0 - 4.0)"
            );
        }
        this.gpa = gpa;
    }

    public String getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(String enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    @Override
    public String toString() {
        return String.format(
            "Student{id=%d, name='%s', email='%s', gpa=%.2f, enrollmentDate='%s'}",
            id, name, email, gpa, enrollmentDate
        );
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Student)) return false;
        Student other = (Student) obj;
        return this.id == other.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}
