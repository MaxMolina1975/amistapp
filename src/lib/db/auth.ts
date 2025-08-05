import { db } from './index';
import bcrypt from 'bcryptjs';

interface UserData {
    email: string;
    password: string;
    name: string;
    role: 'student' | 'teacher' | 'tutor';
}

interface StudentData extends UserData {
    school: string;
    grade: string;
}

interface TeacherData extends UserData {
    school: string;
    subjects: string[];
}

interface TutorData extends UserData {
    relationship: string;
}

export const auth = {
    // Registro de usuarios
    async registerStudent(data: StudentData) {
        const { email, password, name, school, grade } = data;
        const passwordHash = await bcrypt.hash(password, 10);

        db.transaction(() => {
            // Insertar usuario
            const userResult = db.prepare(`
                INSERT INTO users (email, password_hash, name, role)
                VALUES (?, ?, ?, 'student')
            `).run(email, passwordHash, name);

            // Insertar datos de estudiante
            db.prepare(`
                INSERT INTO students (user_id, school, grade)
                VALUES (?, ?, ?)
            `).run(userResult.lastInsertRowid, school, grade);
        })();

        return { success: true };
    },

    async registerTeacher(data: TeacherData) {
        const { email, password, name, school, subjects } = data;
        const passwordHash = await bcrypt.hash(password, 10);

        db.transaction(() => {
            // Insertar usuario
            const userResult = db.prepare(`
                INSERT INTO users (email, password_hash, name, role)
                VALUES (?, ?, ?, 'teacher')
            `).run(email, passwordHash, name);

            // Insertar datos de profesor
            db.prepare(`
                INSERT INTO teachers (user_id, school, subjects)
                VALUES (?, ?, ?)
            `).run(userResult.lastInsertRowid, school, JSON.stringify(subjects));
        })();

        return { success: true };
    },

    async registerTutor(data: TutorData) {
        const { email, password, name, relationship } = data;
        const passwordHash = await bcrypt.hash(password, 10);

        db.transaction(() => {
            // Insertar usuario
            const userResult = db.prepare(`
                INSERT INTO users (email, password_hash, name, role)
                VALUES (?, ?, ?, 'tutor')
            `).run(email, passwordHash, name);

            // Insertar datos de tutor
            db.prepare(`
                INSERT INTO tutors (user_id, relationship)
                VALUES (?, ?)
            `).run(userResult.lastInsertRowid, relationship);
        })();

        return { success: true };
    },

    // Inicio de sesión
    async signIn(email: string, password: string) {
        const user = db.prepare(`
            SELECT id, email, password_hash, name, role
            FROM users
            WHERE email = ?
        `).get(email);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            throw new Error('Contraseña incorrecta');
        }

        // No incluir el hash de la contraseña en la respuesta
        const { password_hash, ...userData } = user;
        return userData;
    },

    // Obtener datos del usuario
    getUserById(id: number) {
        const user = db.prepare(`
            SELECT id, email, name, role
            FROM users
            WHERE id = ?
        `).get(id);

        if (!user) {
            return null;
        }

        return user;
    }
};
