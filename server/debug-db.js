import { db } from './database.js';

console.log('Verificando estructura de la base de datos...');

try {
  // Verificar si la tabla users existe
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tablas en la base de datos:', tables.map(t => t.name));

  // Verificar cada tabla específicamente
  const requiredTables = ['users', 'reports', 'rewards', 'activities'];
  
  for (const tableName of requiredTables) {
    const tableExists = tables.some(t => t.name === tableName);
    console.log(`Tabla ${tableName}: ${tableExists ? 'EXISTE' : 'NO EXISTE'}`);
    
    if (tableExists) {
      try {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get();
        console.log(`  - Registros en ${tableName}: ${count.count}`);
      } catch (error) {
        console.log(`  - Error al contar registros en ${tableName}:`, error.message);
      }
    }
  }

  // Probar las consultas específicas de estadísticas
  console.log('\nProbando consultas de estadísticas...');
  
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    console.log('totalUsers:', totalUsers);
  } catch (error) {
    console.error('Error en totalUsers:', error.message);
  }

  try {
    const totalReports = db.prepare('SELECT COUNT(*) as count FROM reports').get();
    console.log('totalReports:', totalReports);
  } catch (error) {
    console.error('Error en totalReports:', error.message);
  }

  try {
    const totalRewards = db.prepare('SELECT COUNT(*) as count FROM rewards').get();
    console.log('totalRewards:', totalRewards);
  } catch (error) {
    console.error('Error en totalRewards:', error.message);
  }

  try {
    const totalActivities = db.prepare('SELECT COUNT(*) as count FROM activities').get();
    console.log('totalActivities:', totalActivities);
  } catch (error) {
    console.error('Error en totalActivities:', error.message);
  }

} catch (error) {
  console.error('Error:', error);
}