-- Desactivar las restricciones de clave foránea temporalmente
PRAGMA foreign_keys = OFF;

-- Limpiar todas las tablas principales
DELETE FROM reports;
DELETE FROM users;
DELETE FROM teachers;
DELETE FROM students;
DELETE FROM tutors;
DELETE FROM rewards;
DELETE FROM reward_redemptions;
DELETE FROM emotional_reports;
DELETE FROM activities;

-- Resetear los contadores de autoincremento
DELETE FROM sqlite_sequence WHERE name IN (
    'reports',
    'users',
    'teachers',
    'students',
    'tutors',
    'rewards',
    'reward_redemptions',
    'emotional_reports',
    'activities'
);

-- Reactivar las restricciones de clave foránea
PRAGMA foreign_keys = ON;

-- Insertar el usuario administrador por defecto
INSERT INTO users (email, password, role, name, status, created_at, updated_at)
VALUES ('admin@amistapp.cl', '$2b$10$ZKhm8OjYE3tS1ZL5T5pBx.Ss.q.E55xO5VM2XZ7xxG.gZ6W.qPXPy', 'admin', 'Administrador', 'active', DATETIME('now'), DATETIME('now'));

-- Optimizar la base de datos
VACUUM;