-- Eliminar usuarios de prueba y datos relacionados
DELETE FROM students WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%.test@%' OR email LIKE '%demo%'
);

DELETE FROM teachers WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%.test@%' OR email LIKE '%demo%'
);

DELETE FROM tutors WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%.test@%' OR email LIKE '%demo%'
);

DELETE FROM users WHERE email LIKE '%.test@%' OR email LIKE '%demo%';

-- Resetear secuencias si es necesario
DELETE FROM sqlite_sequence WHERE name IN ('users', 'students', 'teachers', 'tutors');

VACUUM;