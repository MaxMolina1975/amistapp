import { db } from './index';

export const studentAPI = {
    getAll() {
        return db.prepare('SELECT * FROM students').all();
    },

    getById(id: number) {
        return db.prepare('SELECT * FROM students WHERE user_id = ?').get(id);
    },

    getByCourse(courseId: number) {
        return db.prepare('SELECT * FROM students WHERE course_id = ?').all(courseId);
    },

    getFullProfile(userId: number) {
        const student = db.prepare(`
            SELECT 
                s.*,
                u.name as student_name,
                u.email as student_email,
                c.code as course_code,
                c.name as course_name,
                c.grade as course_grade,
                c.school as school
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.user_id = ?
        `).get(userId);

        if (!student) return null;

        const teachers = student.course_id ? db.prepare(`
            SELECT 
                u.name as teacher_name,
                u.email as teacher_email,
                ct.subject
            FROM course_teachers ct
            JOIN users u ON ct.teacher_id = u.id
            WHERE ct.course_id = ?
        `).all(student.course_id) : [];

        return {
            ...student,
            teachers
        };
    },

    async joinCourseByCode(studentId: number, courseCode: string) {
        const course = db.prepare('SELECT id FROM courses WHERE code = ?').get(courseCode);
        
        if (!course) {
            throw new Error('Código de curso no válido');
        }

        return db.prepare(`
            UPDATE students
            SET course_id = ?
            WHERE user_id = ?
        `).run(course.id, studentId);
    },

    update(id: number, data: Partial<{ school: string; grade: string }>) {
        const { school, grade } = data;
        return db.prepare(`
            UPDATE students
            SET school = COALESCE(?, school),
                grade = COALESCE(?, grade)
            WHERE user_id = ?
        `).run(school, grade, id);
    }
};

export const teacherAPI = {
    getAll() {
        return db.prepare('SELECT * FROM teachers').all();
    },

    getById(id: number) {
        return db.prepare('SELECT * FROM teachers WHERE user_id = ?').get(id);
    },

    getTeacherCourses(teacherId: number) {
        const courses = db.prepare(`
            SELECT DISTINCT
                c.*,
                (
                    SELECT COUNT(*)
                    FROM students s
                    WHERE s.course_id = c.id
                ) as student_count
            FROM courses c
            JOIN course_teachers ct ON c.id = ct.course_id
            WHERE ct.teacher_id = ?
        `).all(teacherId);

        return courses;
    },

    assignToCourse(teacherId: number, courseId: number, subject: string) {
        return db.prepare(`
            INSERT INTO course_teachers (course_id, teacher_id, subject)
            VALUES (?, ?, ?)
        `).run(courseId, teacherId, subject);
    },

    update(id: number, data: Partial<{ school: string; subjects: string[] }>) {
        const { school, subjects } = data;
        return db.prepare(`
            UPDATE teachers
            SET school = COALESCE(?, school),
                subjects = COALESCE(?, subjects)
            WHERE user_id = ?
        `).run(school, subjects ? JSON.stringify(subjects) : null, id);
    }
};

export const courseAPI = {
    create(data: { 
        name: string; 
        grade: string; 
        school: string; 
        teacherId: number;
        code?: string;
    }) {
        const code = data.code || this.generateCourseCode(data.school, data.grade);
        
        return db.prepare(`
            INSERT INTO courses (name, grade, school, teacher_id, code)
            VALUES (?, ?, ?, ?, ?)
        `).run(data.name, data.grade, data.school, data.teacherId, code);
    },

    generateCourseCode(school: string, grade: string): string {
        const schoolCode = school.substring(0, 3).toUpperCase();
        const gradeCode = grade.replace(/[^0-9]/g, '');
        const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${schoolCode}${gradeCode}${randomPart}`;
    },

    getAll() {
        return db.prepare('SELECT * FROM courses').all();
    },

    getById(id: number) {
        const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
        
        if (!course) return null;

        const teachers = db.prepare(`
            SELECT 
                u.name as teacher_name,
                u.email as teacher_email,
                ct.subject
            FROM course_teachers ct
            JOIN users u ON ct.teacher_id = u.id
            WHERE ct.course_id = ?
        `).all(id);

        return {
            ...course,
            teachers
        };
    },

    getByCode(code: string) {
        return db.prepare('SELECT * FROM courses WHERE code = ?').get(code);
    },

    update(id: number, data: Partial<{ name: string; grade: string; school: string }>) {
        const { name, grade, school } = data;
        return db.prepare(`
            UPDATE courses
            SET name = COALESCE(?, name),
                grade = COALESCE(?, grade),
                school = COALESCE(?, school),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(name, grade, school, id);
    },

    addStudent(courseId: number, studentId: number) {
        return db.prepare(`
            UPDATE students
            SET course_id = ?
            WHERE user_id = ?
        `).run(courseId, studentId);
    },

    removeStudent(studentId: number) {
        return db.prepare(`
            UPDATE students
            SET course_id = NULL
            WHERE user_id = ?
        `).run(studentId);
    }
};

export const tutorAPI = {
    getAll() {
        return db.prepare('SELECT * FROM tutors').all();
    },

    getById(id: number) {
        return db.prepare('SELECT * FROM tutors WHERE user_id = ?').get(id);
    },

    getStudents(tutorId: number) {
        return db.prepare(`
            SELECT s.*, u.name, u.email
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.tutor_id = ?
        `).all(tutorId);
    },

    addStudent(tutorId: number, studentId: number) {
        return db.prepare(`
            UPDATE students
            SET tutor_id = ?
            WHERE user_id = ?
        `).run(tutorId, studentId);
    }
};
