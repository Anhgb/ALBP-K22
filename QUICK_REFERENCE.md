# ⚡ QUICK REFERENCE - DAO Pattern

## 🎯 Mục Đích Nhanh

| Khái Niệm | Ý Nghĩa | Ví Dụ |
|-----------|---------|-------|
| **DAO** | Tách biệt truy cập dữ liệu khỏi logic nghiệp vụ | StudentDAO interface |
| **Entity** | Đại diện cho một object nghiệp vụ | Student.java |
| **Interface** | Hợp đồng, định nghĩa các phương thức | StudentDAO.java |
| **Implementation** | Triển khai cụ thể | MySQLStudentDAO.java |
| **Service** | Layer xử lý business logic | StudentService.java |
| **Mock** | Object giả cho testing | MockStudentDAO.java |

---

## 📋 Checklist - Các File Cần Tạo

- [ ] `Student.java` (Entity)
- [ ] `StudentDAO.java` (Interface)
- [ ] `MySQLStudentDAO.java` (MySQL Implementation)
- [ ] `MockStudentDAO.java` (Mock Implementation)
- [ ] `StudentService.java` (Business Logic)
- [ ] `Main.java` (Application Entry Point)
- [ ] `StudentServiceTest.java` (Unit Tests)
- [ ] `database.sql` (Database Schema)
- [ ] `pom.xml` (Maven Configuration)
- [ ] `README.md` (Documentation)

---

## 🔧 Các Bước Triển Khai

### Bước 1: Tạo Entity (Model)
```java
public class Student {
    private int id;
    private String name;
    private String email;
    private double gpa;
    
    // Getters, Setters, Validation
    public void setGpa(double gpa) {
        if (gpa < 0 || gpa > 4.0) throw new IllegalArgumentException();
        this.gpa = gpa;
    }
}
```

### Bước 2: Tạo DAO Interface
```java
public interface StudentDAO {
    void save(Student student) throws Exception;
    Student findById(int id) throws Exception;
    List<Student> findAll() throws Exception;
    // ... other methods
}
```

### Bước 3: Triển Khai MySQL DAO
```java
public class MySQLStudentDAO implements StudentDAO {
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }
    
    @Override
    public void save(Student student) throws Exception {
        // SQL: INSERT
    }
    // ... implement other methods
}
```

### Bước 4: Triển Khai Mock DAO
```java
public class MockStudentDAO implements StudentDAO {
    private List<Student> students = new ArrayList<>();
    
    @Override
    public void save(Student student) throws Exception {
        students.add(student);
    }
    // ... implement other methods
}
```

### Bước 5: Tạo Service Layer
```java
public class StudentService {
    private StudentDAO studentDAO;
    
    // Dependency Injection!
    public StudentService(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }
    
    public void registerStudent(String name, String email, double gpa, String date) {
        Student s = new Student(name, email, gpa, date);
        studentDAO.save(s);
    }
}
```

### Bước 6: Tạo Main & Test
```java
// Main.java
public static void main(String[] args) {
    StudentDAO dao = new MySQLStudentDAO(...);
    StudentService service = new StudentService(dao);
    service.displayAllStudents();
}

// StudentServiceTest.java
@Test
public void testRegister() throws Exception {
    StudentDAO mockDAO = new MockStudentDAO();
    StudentService service = new StudentService(mockDAO);
    service.registerStudent("A", "a@test.com", 3.5, "2024-01-01");
    assertEquals(1, mockDAO.findAll().size());
}
```

---

## 🐛 Lỗi Thường Gặp & Giải Pháp

| Lỗi | Giải Pháp |
|-----|----------|
| `ClassNotFoundException: com.mysql.cj.jdbc.Driver` | Thêm MySQL JAR vào `pom.xml` |
| `Connection refused` | MySQL chưa chạy, start MySQL |
| `Access denied for user 'root'` | Sai password, kiểm tra MySQLStudentDAO.java |
| `Table doesn't exist` | Chạy `database.sql` |
| `Null pointer exception` | Kiểm tra Entity null trước khi dùng |
| `PreparedStatement error` | Kiểm tra tham số SQL có khớp không |

---

## 🎓 Áp Dụng Nguyên Tắc SOLID

| Nguyên Tắc | Áp Dụng Như Thế Nào |
|-----------|-------------------|
| **S**RP | Student, MySQLStudentDAO, StudentService mỗi class một trách nhiệm |
| **O**CP | Có thể thêm PostgreSQLStudentDAO mà không thay code cũ |
| **L**SP | MockStudentDAO thay MySQLStudentDAO mà không lỗi |
| **I**SP | StudentDAO chỉ có phương thức Student, không ép implement khác |
| **D**IP | StudentService depends on StudentDAO (interface), không MySQLStudentDAO |

---

## 🔄 Flow Xử Lý Request

```
Main Application
      │
      ▼
StudentService.registerStudent(...)
      │
      ├─ Validate dữ liệu
      ├─ Tạo Student object
      │
      ▼
studentDAO.save(student)
      │
      ├─ Nếu MySQLStudentDAO → INSERT vào MySQL
      └─ Nếu MockStudentDAO → Thêm vào List memory

      │
      ▼
Hoàn thành ✅
```

---

## 💾 SQL Quick Commands

```sql
-- Tạo Database
CREATE DATABASE student_management;
USE student_management;

-- Tạo Table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    gpa DECIMAL(3,2),
    enrollment_date DATE
);

-- Chèn dữ liệu
INSERT INTO students VALUES (NULL, 'Nguyễn A', 'a@test.com', 3.5, '2024-01-01');

-- Lấy dữ liệu
SELECT * FROM students WHERE gpa >= 3.5 ORDER BY gpa DESC;

-- Cập nhật
UPDATE students SET gpa = 3.8 WHERE id = 1;

-- Xóa
DELETE FROM students WHERE id = 1;
```

---

## 📝 Cấu Trúc Cơ Bản Của Một DAO Method

```java
// Template cho tất cả CRUD operations

// CREATE
@Override
public void save(Student student) throws Exception {
    String sql = "INSERT INTO students (name, email, gpa) VALUES (?, ?, ?)";
    
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
        
        // 1. Set parameters
        stmt.setString(1, student.getName());
        stmt.setString(2, student.getEmail());
        stmt.setDouble(3, student.getGpa());
        
        // 2. Execute
        stmt.executeUpdate();
    }
}

// READ
@Override
public Student findById(int id) throws Exception {
    String sql = "SELECT * FROM students WHERE id = ?";
    
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
        
        // 1. Set parameters
        stmt.setInt(1, id);
        
        // 2. Execute query
        ResultSet rs = stmt.executeQuery();
        
        // 3. Process results
        if (rs.next()) {
            return mapResultSetToStudent(rs);
        }
    }
    return null;
}

// UPDATE
@Override
public void update(Student student) throws Exception {
    String sql = "UPDATE students SET name = ?, email = ?, gpa = ? WHERE id = ?";
    
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
        
        stmt.setString(1, student.getName());
        stmt.setString(2, student.getEmail());
        stmt.setDouble(3, student.getGpa());
        stmt.setInt(4, student.getId());
        
        stmt.executeUpdate();
    }
}

// DELETE
@Override
public void delete(int id) throws Exception {
    String sql = "DELETE FROM students WHERE id = ?";
    
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
        
        stmt.setInt(1, id);
        stmt.executeUpdate();
    }
}

// Helper method: Map ResultSet to Student
private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
    Student student = new Student();
    student.setId(rs.getInt("id"));
    student.setName(rs.getString("name"));
    student.setEmail(rs.getString("email"));
    student.setGpa(rs.getDouble("gpa"));
    return student;
}
```

---

## 🧪 Unit Test Template

```java
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

public class StudentServiceTest {
    
    private StudentDAO dao;
    private StudentService service;
    
    @Before  // Chạy trước mỗi test
    public void setUp() {
        dao = new MockStudentDAO();
        service = new StudentService(dao);
    }
    
    @Test
    public void testCreateStudent() throws Exception {
        // Arrange (Chuẩn bị)
        int initialSize = dao.findAll().size();
        
        // Act (Thực hiện)
        service.registerStudent("Test", "test@test.com", 3.5, "2024-01-01");
        
        // Assert (Kiểm tra)
        assertEquals(initialSize + 1, dao.findAll().size());
    }
    
    @Test
    public void testReadStudent() throws Exception {
        Student student = dao.findById(1);
        assertNotNull(student);
    }
    
    @Test
    public void testUpdateStudent() throws Exception {
        Student student = dao.findById(1);
        student.setName("Updated Name");
        dao.update(student);
        
        Student updated = dao.findById(1);
        assertEquals("Updated Name", updated.getName());
    }
    
    @Test
    public void testDeleteStudent() throws Exception {
        int initialSize = dao.findAll().size();
        dao.delete(1);
        assertEquals(initialSize - 1, dao.findAll().size());
    }
    
    @Test(expected = IllegalArgumentException.class)
    public void testInvalidGPA() {
        Student student = new Student();
        student.setGpa(5.0);  // Should throw exception
    }
}
```

---

## 📊 Dependency Injection Pattern

### ❌ SAI - Hard Dependency
```java
public class StudentService {
    private StudentDAO studentDAO;
    
    public StudentService() {
        // BAD: Tạo dependency cứng
        this.studentDAO = new MySQLStudentDAO(...);
    }
}
```

### ✅ ĐÚNG - Dependency Injection
```java
public class StudentService {
    private StudentDAO studentDAO;
    
    // GOOD: Nhận dependency từ bên ngoài
    public StudentService(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }
}

// Usage
StudentService service1 = new StudentService(new MySQLStudentDAO(...));
StudentService service2 = new StudentService(new MockStudentDAO());
```

---

## 🚀 Chạy Project - Commands Nhanh

```bash
# Clone project
cd your_project

# Cài Maven dependencies
mvn clean install

# Compile
mvn compile

# Run tests
mvn test

# Run main application
mvn exec:java -Dexec.mainClass="Main"

# Generate JAR
mvn package

# Run JAR
java -jar target/student-dao-pattern-1.0.0.jar
```

---

## 📱 Maven Dependencies Cần Thiết

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```

---

## 🎯 Tiêu Chí Đánh Giá Nhanh

| Tiêu Chí | ✅ Hoàn Thành |
|---------|--------------|
| Entity class với validation | ☐ |
| DAO Interface | ☐ |
| MySQLStudentDAO | ☐ |
| MockStudentDAO | ☐ |
| Service Layer | ☐ |
| Main Application | ☐ |
| Unit Tests (≥5) | ☐ |
| Database Script | ☐ |
| README Documentation | ☐ |
| Áp dụng SOLID | ☐ |
| Dependency Injection | ☐ |
| Entity bổ sung | ☐ |

---

## 💡 Tips & Tricks

- **PreparedStatement** thay vì String concatenation (bảo vệ SQL injection)
- **Try-with-resources** tự động đóng connection
- **ResultSet mapping** nên tách thành helper method
- **Exception handling** cần rõ ràng (catch specific exceptions)
- **Logging** hữu ích khi debug
- **Mock DAO** phải hoạt động giống MySQL DAO (behavior)

---

## 🔗 Liên Kết Nhanh

- [MySQL JDBC Driver](https://dev.mysql.com/doc/connector-j/en/)
- [JUnit 4 Documentation](https://junit.org/junit4/)
- [JDBC Best Practices](https://docs.oracle.com/javase/tutorial/jdbc/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)

---

**Chúc bạn hoàn thành bài tập! 🚀**
