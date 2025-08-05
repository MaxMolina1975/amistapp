import { db } from './database.js';

async function inspectDatabase() {
  try {
    console.log('Conectando a la base de datos SQLite...');
    
    // Obtener la lista de tablas
    const tables = await db.allAsync("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tablas en la base de datos:', tables.map(t => t.name));
    
    // Inspeccionar la estructura de cada tabla
    for (const table of tables) {
      const tableName = table.name;
      if (tableName !== 'sqlite_sequence') {
        console.log(`\n📋 Estructura de la tabla '${tableName}':`);
        const columns = await db.allAsync(`PRAGMA table_info(${tableName})`);
        columns.forEach(col => {
          console.log(`  - ${col.name} (${col.type})${col.pk ? ' PRIMARY KEY' : ''}${col.notnull ? ' NOT NULL' : ''}`);
        });
        
        // Contar registros en la tabla
        const count = await db.getAsync(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`  Total registros: ${count.count}`);
      }
    }
    
    console.log('\nInspección de la base de datos completada');
  } catch (error) {
    console.error('Error al inspeccionar la base de datos:', error);
  }
}

inspectDatabase();
