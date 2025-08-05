const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE API PARA HOSTING\n');

let allChecksPass = true;

// Función para verificar archivos
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${exists ? 'Existe' : 'No encontrado'}`);
  if (!exists) allChecksPass = false;
  return exists;
}

// Función para verificar contenido de archivo
function checkFileContent(filePath, searchText, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const found = content.includes(searchText);
    console.log(`${found ? '✅' : '❌'} ${description}: ${found ? 'Configurado' : 'No encontrado'}`);
    if (!found) allChecksPass = false;
    return found;
  } catch (error) {
    console.log(`❌ ${description}: Error al leer archivo`);
    allChecksPass = false;
    return false;
  }
}

console.log('📁 VERIFICANDO ESTRUCTURA DE ARCHIVOS:');
console.log('─'.repeat(50));

// Verificar archivos principales del servidor
checkFile(path.join(__dirname, 'server', 'index.js'), 'Servidor principal (index.js)');
checkFile(path.join(__dirname, 'server', 'server.js'), 'Servidor alternativo (server.js)');
checkFile(path.join(__dirname, 'server', '.env'), 'Variables de entorno del servidor');
checkFile(path.join(__dirname, '.env.production'), 'Variables de entorno de producción');

// Verificar rutas de la API
const routesDir = path.join(__dirname, 'server', 'routes');
console.log('\n📡 VERIFICANDO RUTAS DE LA API:');
console.log('─'.repeat(50));

const requiredRoutes = ['auth.js', 'admin.js', 'teacher.js', 'tutor.js', 'reports.js', 'rewards.js'];
requiredRoutes.forEach(route => {
  checkFile(path.join(routesDir, route), `Ruta ${route}`);
});

// Verificar middleware
console.log('\n🛡️ VERIFICANDO MIDDLEWARE:');
console.log('─'.repeat(50));
checkFile(path.join(__dirname, 'server', 'middleware', 'auth.js'), 'Middleware de autenticación');

// Verificar base de datos
console.log('\n🗄️ VERIFICANDO BASE DE DATOS:');
console.log('─'.repeat(50));
checkFile(path.join(__dirname, 'server', 'database.js'), 'Configuración de base de datos');
checkFile(path.join(__dirname, 'server', 'database.db'), 'Archivo de base de datos SQLite');

// Verificar configuraciones específicas para hosting
console.log('\n⚙️ VERIFICANDO CONFIGURACIONES DE HOSTING:');
console.log('─'.repeat(50));

// Verificar CORS en index.js
checkFileContent(
  path.join(__dirname, 'server', 'index.js'),
  'hostybee.com',
  'CORS configurado para hostybee.com'
);

// Verificar URL de API en .env.production
checkFileContent(
  path.join(__dirname, '.env.production'),
  'VITE_API_URL=https://hostybee.com:3007/api',
  'URL de API de producción configurada'
);

// Verificar configuración dinámica en config.ts
checkFileContent(
  path.join(__dirname, 'src', 'config.ts'),
  'hostybee.com',
  'Configuración dinámica para hostybee.com'
);

// Verificar endpoint de health check
checkFileContent(
  path.join(__dirname, 'server', 'index.js'),
  '/api/health',
  'Endpoint de health check configurado'
);

// Verificar variables de entorno
console.log('\n🔐 VERIFICANDO VARIABLES DE ENTORNO:');
console.log('─'.repeat(50));

try {
  const envContent = fs.readFileSync(path.join(__dirname, 'server', '.env'), 'utf8');
  const hasPort = envContent.includes('PORT=');
  const hasJwtSecret = envContent.includes('JWT_SECRET=');
  
  console.log(`${hasPort ? '✅' : '❌'} PORT configurado: ${hasPort ? 'Sí' : 'No'}`);
  console.log(`${hasJwtSecret ? '✅' : '❌'} JWT_SECRET configurado: ${hasJwtSecret ? 'Sí' : 'No'}`);
  
  if (!hasPort || !hasJwtSecret) allChecksPass = false;
} catch (error) {
  console.log('❌ Error al verificar variables de entorno');
  allChecksPass = false;
}

// Verificar build de producción
console.log('\n🏗️ VERIFICANDO BUILD DE PRODUCCIÓN:');
console.log('─'.repeat(50));
checkFile(path.join(__dirname, 'dist'), 'Directorio dist (build de producción)');
checkFile(path.join(__dirname, 'dist', 'index.html'), 'Archivo index.html en dist');

// Verificar archivos Docker
console.log('\n🐳 VERIFICANDO ARCHIVOS DOCKER:');
console.log('─'.repeat(50));
checkFile(path.join(__dirname, 'docker-compose.yml'), 'Docker Compose');
checkFile(path.join(__dirname, 'Dockerfile.client'), 'Dockerfile para cliente');
checkFile(path.join(__dirname, 'Dockerfile.server'), 'Dockerfile para servidor');

// Verificar scripts de despliegue
console.log('\n🚀 VERIFICANDO SCRIPTS DE DESPLIEGUE:');
console.log('─'.repeat(50));
checkFile(path.join(__dirname, 'deploy.sh'), 'Script de despliegue');
checkFile(path.join(__dirname, 'server', 'clean-test-data.js'), 'Script de limpieza de datos de prueba');

// Resultado final
console.log('\n' + '='.repeat(60));
if (allChecksPass) {
  console.log('🎉 ¡VERIFICACIÓN EXITOSA!');
  console.log('✅ La API está lista para ser desplegada en el hosting');
  console.log('\n📋 PRÓXIMOS PASOS PARA EL HOSTING:');
  console.log('1. Subir todos los archivos al servidor');
  console.log('2. Instalar dependencias: npm install');
  console.log('3. Configurar variables de entorno en el servidor');
  console.log('4. Iniciar el servidor: npm start o node server/index.js');
  console.log('5. Configurar proxy reverso (Nginx/Apache) si es necesario');
  console.log('6. Verificar que el puerto 3007 esté abierto');
  console.log('7. Probar el endpoint: https://hostybee.com:3007/api/health');
} else {
  console.log('❌ VERIFICACIÓN FALLIDA');
  console.log('⚠️ Hay problemas que deben resolverse antes del despliegue');
  console.log('Por favor, revisa los elementos marcados con ❌');
}
console.log('='.repeat(60));

// Información adicional sobre la configuración
console.log('\n📊 INFORMACIÓN DE CONFIGURACIÓN:');
console.log('─'.repeat(50));
console.log('🌐 URL de producción: https://hostybee.com:3007/api');
console.log('🔌 Puerto del servidor: 3007');
console.log('🗄️ Base de datos: SQLite (database.db)');
console.log('🔐 Autenticación: JWT');
console.log('🌍 CORS: Configurado para hostybee.com');
console.log('📱 Frontend: Vite + React');
console.log('🖥️ Backend: Node.js + Express');