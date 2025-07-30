import Database from 'better-sqlite3';
import path from 'path';

// Crear la conexión a la base de datos
const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// Configurar la base de datos para modo desarrollo
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Crear las tablas necesarias
db.exec(`
    -- Tabla de usuarios
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'tutor')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla de cursos
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        school TEXT NOT NULL,
        teacher_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id)
    );

    -- Tabla de profesores
    CREATE TABLE IF NOT EXISTS teachers (
        user_id INTEGER PRIMARY KEY,
        school TEXT NOT NULL,
        subjects TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tabla de estudiantes
    CREATE TABLE IF NOT EXISTS students (
        user_id INTEGER PRIMARY KEY,
        school TEXT NOT NULL,
        grade TEXT NOT NULL,
        course_id INTEGER,
        tutor_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (tutor_id) REFERENCES users(id)
    );

    -- Tabla de tutores
    CREATE TABLE IF NOT EXISTS tutors (
        user_id INTEGER PRIMARY KEY,
        relationship TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tabla de profesores asignados a cursos (para múltiples profesores por curso)
    CREATE TABLE IF NOT EXISTS course_teachers (
        course_id INTEGER,
        teacher_id INTEGER,
        subject TEXT NOT NULL,
        PRIMARY KEY (course_id, teacher_id, subject),
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);

export { db };
