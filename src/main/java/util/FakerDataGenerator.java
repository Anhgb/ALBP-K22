package util;

import com.github.javafaker.Faker;
import entity.Course;
import entity.Student;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

/**
 * ============================================================
 * CLASS: FakerDataGenerator.java
 * LAYER: Utility
 * MÔ TẢ: Sinh dữ liệu giả lập (fake data) sử dụng JavaFaker
 *
 * Mục đích:
 *   - Tạo dữ liệu mẫu để test / demo nhanh
 *   - Không cần nhập tay từng đối tượng Student / Course
 *
 * Cách dùng:
 *   FakerDataGenerator gen = new FakerDataGenerator();
 *   Student s = gen.randomStudent();
 *   List<Student> list = gen.randomStudents(10);
 * ============================================================
 */
public class FakerDataGenerator {

    // ========== FIELDS ==========
    private final Faker faker;
    private final Random random;

    // Danh sách tên môn học phổ biến tại Việt Nam
    private static final String[] SUBJECT_NAMES = {
        "Lập trình Java", "Cơ sở dữ liệu", "Cấu trúc dữ liệu & Giải thuật",
        "Mạng máy tính", "Hệ điều hành", "Kỹ thuật phần mềm",
        "Trí tuệ nhân tạo", "Học máy", "An toàn thông tin",
        "Phát triển Web", "Lập trình Python", "Toán rời rạc",
        "Xác suất thống kê", "Phân tích thiết kế hệ thống", "Cloud Computing"
    };

    // Danh sách tên khoa / bộ môn
    private static final String[] DEPARTMENTS = {
        "Khoa CNTT", "Khoa Điện tử", "Khoa Cơ khí",
        "Khoa Kinh tế", "Khoa Ngoại ngữ"
    };

    // ========== CONSTRUCTORS ==========

    /** Mặc định: dùng locale tiếng Anh */
    public FakerDataGenerator() {
        this.faker  = new Faker(new Locale("en-US"));
        this.random = new Random();
    }

    /** Tuỳ chọn locale */
    public FakerDataGenerator(Locale locale) {
        this.faker  = new Faker(locale);
        this.random = new Random();
    }

    // ========== SINH MỘT STUDENT ==========

    /**
     * Tạo một Student với dữ liệu ngẫu nhiên.
     * GPA trong khoảng 0.0 – 4.0, enrollmentDate trong 5 năm gần đây.
     */
    public Student randomStudent() {
        String name          = faker.name().fullName();
        String email         = faker.internet().emailAddress();
        double gpa           = Math.round((random.nextDouble() * 4.0) * 100.0) / 100.0;
        String enrollmentDate = randomDateBetween(
            LocalDate.now().minusYears(5), LocalDate.now()
        );
        return new Student(name, email, gpa, enrollmentDate);
    }

    /**
     * Tạo danh sách n Student ngẫu nhiên.
     *
     * @param n số lượng sinh viên cần tạo
     */
    public List<Student> randomStudents(int n) {
        List<Student> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(randomStudent());
        }
        return list;
    }

    // ========== SINH MỘT COURSE ==========

    /**
     * Tạo một Course với dữ liệu ngẫu nhiên.
     * Credits trong khoảng 1 – 5 (phổ biến trong chương trình ĐH).
     */
    public Course randomCourse() {
        String name       = SUBJECT_NAMES[random.nextInt(SUBJECT_NAMES.length)];
        int    credits    = random.nextInt(5) + 1;   // 1 → 5
        String instructor = "GV. " + faker.name().fullName();
        int    deptId     = random.nextInt(DEPARTMENTS.length) + 1;
        return new Course(name, credits, instructor, deptId);
    }

    /**
     * Tạo danh sách n Course ngẫu nhiên.
     *
     * @param n số lượng khóa học cần tạo
     */
    public List<Course> randomCourses(int n) {
        List<Course> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(randomCourse());
        }
        return list;
    }

    // ========== CÁC PHƯƠNG THỨC SINH GIÁ TRỊ ĐƠN LẺ ==========

    /** Trả về một địa chỉ email ngẫu nhiên */
    public String randomEmail() {
        return faker.internet().emailAddress();
    }

    /** Trả về một số điện thoại ngẫu nhiên (định dạng US) */
    public String randomPhone() {
        return faker.phoneNumber().cellPhone();
    }

    /** Trả về một địa chỉ ngẫu nhiên */
    public String randomAddress() {
        return faker.address().fullAddress();
    }

    /** Trả về một câu lorem ipsum ngẫu nhiên */
    public String randomSentence() {
        return faker.lorem().sentence();
    }

    /** Trả về một số nguyên ngẫu nhiên trong [min, max] */
    public int randomInt(int min, int max) {
        return faker.number().numberBetween(min, max);
    }

    /** Trả về một số thực ngẫu nhiên trong [min, max] làm tròn 2 chữ số */
    public double randomDouble(double min, double max) {
        double value = min + (max - min) * random.nextDouble();
        return Math.round(value * 100.0) / 100.0;
    }

    // ========== HELPER METHODS ==========

    /**
     * Sinh ngày ngẫu nhiên trong khoảng [from, to] theo định dạng yyyy-MM-dd.
     */
    private String randomDateBetween(LocalDate from, LocalDate to) {
        long fromEpoch = from.toEpochDay();
        long toEpoch   = to.toEpochDay();
        long randomDay = fromEpoch + (long)(random.nextDouble() * (toEpoch - fromEpoch));
        return LocalDate.ofEpochDay(randomDay)
                        .format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    // ========== DEMO MAIN (kiểm tra nhanh) ==========

    public static void main(String[] args) {
        FakerDataGenerator gen = new FakerDataGenerator();

        System.out.println("╔══════════════════════════════════════════════╗");
        System.out.println("║         DEMO JAVA FAKER DATA GENERATOR       ║");
        System.out.println("╚══════════════════════════════════════════════╝");

        // --- Sinh 1 Student ---
        System.out.println("\n📌 1 Sinh viên ngẫu nhiên:");
        Student s = gen.randomStudent();
        System.out.println("   " + s);

        // --- Sinh 5 Students ---
        System.out.println("\n📋 5 Sinh viên ngẫu nhiên:");
        List<Student> students = gen.randomStudents(5);
        students.forEach(sv -> System.out.println("   " + sv));

        // --- Sinh 1 Course ---
        System.out.println("\n📌 1 Khóa học ngẫu nhiên:");
        Course c = gen.randomCourse();
        System.out.println("   " + c);

        // --- Sinh 3 Courses ---
        System.out.println("\n📋 3 Khóa học ngẫu nhiên:");
        List<Course> courses = gen.randomCourses(3);
        courses.forEach(course -> System.out.println("   " + course));

        // --- Một số giá trị đơn lẻ ---
        System.out.println("\n🔤 Các giá trị đơn lẻ:");
        System.out.println("   Email   : " + gen.randomEmail());
        System.out.println("   Phone   : " + gen.randomPhone());
        System.out.println("   Address : " + gen.randomAddress());
        System.out.println("   Sentence: " + gen.randomSentence());
        System.out.println("   Int(1-100): " + gen.randomInt(1, 100));
        System.out.println("   GPA     : " + gen.randomDouble(0.0, 4.0));
    }
}
