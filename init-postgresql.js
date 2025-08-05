#!/usr/bin/env node

/**
 * Script de inicialización completa para AmistApp con PostgreSQL
 * Este script configura todo el entorno de desarrollo con base de datos real
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd()) {
  try {
    log(`Ejecutando: ${command}`, colors.cyan);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error ejecutando: ${command}`, colors.red);
    log(error.message, colors.red);
    return false;
  }
}

async function main() {
  log('🚀 Inicializando AmistApp con PostgreSQL', colors.bright + colors.green);
  log('=' * 50, colors.green);
  
  // Paso 1: Verificar Docker
  log('\n📦 Paso 1: Verificando Docker...', colors.yellow);
  if (!execCommand('docker --version')) {
    log('❌ Docker no está instalado. Por favor instala Docker Desktop.', colors.red);
    process.exit(1);
  }
  
  // Paso 2: Iniciar servicios con Docker Compose
  log('\n🐳 Paso 2: Iniciando servicios con Docker Compose...', colors.yellow);
  if (!execCommand('docker-compose -f docker-compose.dev.yml up -d postgres')) {
    log('❌ Error iniciando PostgreSQL con Docker', colors.red);
    process.exit(1);
  }
  
  // Esperar a que PostgreSQL esté listo
  log('\n⏳ Esperando a que PostgreSQL esté listo...', colors.yellow);
  let retries = 30;
  while (retries > 0) {
    try {
      execSync('docker exec amistapp-postgres pg_isready -U postgres -d amistapp', { stdio: 'pipe' });
      log('✅ PostgreSQL está listo', colors.green);
      break;
    } catch {
      retries--;
      if (retries === 0) {
        log('❌ Timeout esperando PostgreSQL', colors.red);
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Paso 3: Instalar dependencias del backend
  log('\n📦 Paso 3: Instalando dependencias del backend...', colors.yellow);
  if (!execCommand('npm install', './backend')) {
    log('❌ Error instalando dependencias del backend', colors.red);
    process.exit(1);
  }
  
  // Paso 4: Inicializar base de datos
  log('\n🗄️ Paso 4: Inicializando base de datos...', colors.yellow);
  if (!execCommand('node src/database/seed-postgresql.js', './backend')) {
    log('❌ Error inicializando base de datos', colors.red);
    process.exit(1);
  }
  
  // Paso 5: Instalar dependencias del frontend
  log('\n📦 Paso 5: Instalando dependencias del frontend...', colors.yellow);
  if (!execCommand('npm install')) {
    log('❌ Error instalando dependencias del frontend', colors.red);
    process.exit(1);
  }
  
  // Paso 6: Mostrar información de configuración
  log('\n✅ ¡Inicialización completada!', colors.bright + colors.green);
  log('=' * 50, colors.green);
  log('\n📋 Información del entorno:', colors.bright);
  log('🔗 Backend API: http://localhost:3007', colors.cyan);
  log('🔗 Frontend: http://localhost:5173', colors.cyan);
  log('🗄️ PostgreSQL: localhost:5432', colors.cyan);
  log('📊 Base de datos: amistapp', colors.cyan);
  
  log('\n👥 Usuarios de prueba:', colors.bright);
  log('🔑 Admin: admin@amistapp.com / admin123', colors.magenta);
  log('👨‍🏫 Profesor: profesor@amistapp.com / teacher123', colors.magenta);
  log('👨‍🎓 Estudiante: estudiante@amistapp.com / student123', colors.magenta);
  log('👨‍👩‍👧‍👦 Tutor: tutor@amistapp.com / tutor123', colors.magenta);
  
  log('\n🚀 Comandos para iniciar:', colors.bright);
  log('Backend: cd backend && npm start', colors.cyan);
  log('Frontend: npm run dev', colors.cyan);
  log('Todo junto: docker-compose -f docker-compose.dev.yml up', colors.cyan);
  
  log('\n🛠️ Comandos útiles:', colors.bright);
  log('Ver logs PostgreSQL: docker logs amistapp-postgres', colors.cyan);
  log('Conectar a PostgreSQL: docker exec -it amistapp-postgres psql -U postgres -d amistapp', colors.cyan);
  log('Parar servicios: docker-compose -f docker-compose.dev.yml down', colors.cyan);
}

main().catch(error => {
  log(`❌ Error durante la inicialización: ${error.message}`, colors.red);
  process.exit(1);
});