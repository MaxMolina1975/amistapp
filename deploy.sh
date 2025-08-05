#!/bin/bash

# Script de despliegue para AmistApp
echo "🚀 Iniciando despliegue de AmistApp..."

# 1. Limpiar datos de prueba
echo "🧹 Limpiando datos de prueba..."
cd server && node clean-test-data.js

# 2. Instalar dependencias del servidor
echo "📦 Instalando dependencias del servidor..."
npm install

# 3. Volver al directorio raíz e instalar dependencias del cliente
echo "📦 Instalando dependencias del cliente..."
cd ..
npm install

# 4. Construir la aplicación
echo "🔨 Construyendo la aplicación..."
npm run build

# 5. Verificar que el build fue exitoso
if [ -d "dist" ]; then
    echo "✅ Build completado exitosamente"
else
    echo "❌ Error en el build"
    exit 1
fi

echo "🎉 Despliegue completado exitosamente!"
echo "📋 Próximos pasos:"
echo "   1. Subir los archivos al servidor"
echo "   2. Configurar el servidor web (Nginx/Apache)"
echo "   3. Configurar SSL/HTTPS"
echo "   4. Iniciar el servidor backend"