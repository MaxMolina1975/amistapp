import { db } from './database.js';

console.log('Limpiando datos de prueba de la base de datos...');

try {
  // Eliminar usuarios de prueba
  const deleteUsers = db.prepare('DELETE FROM users WHERE email LIKE ?');
  const deletedUsers = deleteUsers.run('%.test@%');
  console.log(`Eliminados ${deletedUsers.changes} usuarios de prueba`);

  // Eliminar estudiantes de prueba
  const deleteStudents = db.prepare('DELETE FROM students WHERE user_id NOT IN (SELECT id FROM users)');
  const deletedStudents = deleteStudents.run();
  console.log(`Eliminados ${deletedStudents.changes} estudiantes huérfanos`);

  // Eliminar profesores de prueba
  const deleteTeachers = db.prepare('DELETE FROM teachers WHERE user_id NOT IN (SELECT id FROM users)');
  const deletedTeachers = deleteTeachers.run();
  console.log(`Eliminados ${deletedTeachers.changes} profesores huérfanos`);

  // Eliminar tutores de prueba
  const deleteTutors = db.prepare('DELETE FROM tutors WHERE user_id NOT IN (SELECT id FROM users)');
  const deletedTutors = deleteTutors.run();
  console.log(`Eliminados ${deletedTutors.changes} tutores huérfanos`);

  console.log('✅ Limpieza de datos de prueba completada');
} catch (error) {
  console.error('❌ Error durante la limpieza:', error);
  process.exit(1);
}