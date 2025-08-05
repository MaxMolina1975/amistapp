import { db } from './database.js';
import fs from 'fs';
import path from 'path';

console.log('🔍 Verificando estado del proyecto para despliegue...\n');

let allChecks = true;

// 1. Verificar base de datos
console.log('📊 Verificando base de datos...');
try {
  const adminUser = db.prepare('SELECT * FROM users WHERE role = ? LIMIT 1').get('admin');
  if (adminUser) {
    console.log('✅ Usuario administrador encontrado:', adminUser.email);
  } else {
    console.log('❌ No se encontró usuario administrador');
    allChecks = false;
  }
  
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log(`✅ Total de usuarios en la base de datos: ${userCount.count}`);
} catch (error) {
  console.log('❌ Error al verificar base de datos:', error.message);
  allChecks = false;
}

// 2. Verificar archivos de configuración
console.log('\n⚙️ Verificando archivos de configuración...');

const configFiles = [
  '../.env.production',
  '../package.json',
  '../vite.config.ts',
  '../src/config.ts',
  './package.json'
];

configFiles.forEach(file => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} no encontrado`);
    allChecks = false;
  }
});

// 3. Verificar archivos Docker
console.log('\n🐳 Verificando archivos Docker...');
const dockerFiles = [
  '../Dockerfile.client',
  '../Dockerfile.server',
  '../docker-compose.yml'
];

dockerFiles.forEach(file => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} no encontrado`);
    allChecks = false;
  }
});

// 4. Verificar estructura de directorios
console.log('\n📁 Verificando estructura de directorios...');
const requiredDirs = [
  '../src',
  '../public',
  './routes',
  './controllers',
  './middleware'
];

requiredDirs.forEach(dir => {
  const dirPath = path.resolve(dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} existe`);
  } else {
    console.log(`❌ ${dir} no encontrado`);
    allChecks = false;
  }
});

// 5. Verificar variables de entorno
console.log('\n🔐 Verificando variables de entorno...');
const requiredEnvVars = ['PORT', 'JWT_SECRET'];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} configurado`);
  } else {
    console.log(`❌ ${envVar} no configurado`);
    allChecks = false;
  }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allChecks) {
  console.log('🎉 ¡PROYECTO LISTO PARA DESPLIEGUE!');
  console.log('✅ Todas las verificaciones pasaron exitosamente');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Ejecutar: npm run build');
  console.log('2. Subir archivos al servidor');
  console.log('3. Configurar servidor web (Nginx/Apache)');
  console.log('4. Configurar SSL/HTTPS');
  console.log('5. Iniciar servidor backend');
} else {
  console.log('❌ PROYECTO NO LISTO PARA DESPLIEGUE');
  console.log('⚠️ Hay problemas que deben resolverse antes del despliegue');
  process.exit(1);
}
console.log('='.repeat(50));