# 🔧 GUÍA DE VERIFICACIÓN DE API EN HOSTING

## 📋 CHECKLIST PARA VERIFICAR LA API EN EL SERVIDOR

### 🚀 PASO 1: VERIFICACIÓN INICIAL POST-DESPLIEGUE

#### 1.1 Verificar que el servidor esté ejecutándose:
```bash
# Conectarse al servidor hosting
ssh usuario@hostybee.com

# Verificar procesos Node.js
ps aux | grep node

# Verificar que el puerto 3007 esté en uso
netstat -tlnp | grep 3007
```

#### 1.2 Verificar logs del servidor:
```bash
# Ver logs en tiempo real
tail -f /var/log/amistapp/server.log

# O si usas PM2:
pm2 logs amistapp-api
```

### 🌐 PASO 2: PRUEBAS DE CONECTIVIDAD

#### 2.1 Health Check (Prueba más importante):
```bash
# Desde el servidor
curl http://localhost:3007/api/health

# Desde internet
curl https://hostybee.com:3007/api/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-XX..."
}
```

#### 2.2 Verificar CORS:
```bash
# Prueba con origen específico
curl -H "Origin: https://hostybee.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://hostybee.com:3007/api/health
```

### 🔐 PASO 3: PRUEBAS DE AUTENTICACIÓN

#### 3.1 Endpoint de login:
```bash
curl -X POST https://hostybee.com:3007/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@amistapp.com",
    "password": "admin123"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@amistapp.com",
    "role": "admin"
  }
}
```

#### 3.2 Verificar endpoint protegido:
```bash
# Usar el token obtenido del login
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     https://hostybee.com:3007/api/admin/users
```

### 📊 PASO 4: PRUEBAS DE ENDPOINTS PRINCIPALES

#### 4.1 Endpoints públicos:
```bash
# Health check
curl https://hostybee.com:3007/api/health

# Login
curl -X POST https://hostybee.com:3007/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amistapp.com","password":"admin123"}'
```

#### 4.2 Endpoints protegidos (requieren token):
```bash
# Obtener token primero
TOKEN=$(curl -s -X POST https://hostybee.com:3007/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amistapp.com","password":"admin123"}' | \
  jq -r '.token')

# Probar endpoints protegidos
curl -H "Authorization: Bearer $TOKEN" \
     https://hostybee.com:3007/api/admin/users

curl -H "Authorization: Bearer $TOKEN" \
     https://hostybee.com:3007/api/reports

curl -H "Authorization: Bearer $TOKEN" \
     https://hostybee.com:3007/api/teacher/students
```

### 🗄️ PASO 5: VERIFICACIÓN DE BASE DE DATOS

#### 5.1 Verificar conexión a la base de datos:
```bash
# El health check ya verifica la DB, pero puedes hacer pruebas adicionales
curl -H "Authorization: Bearer $TOKEN" \
     https://hostybee.com:3007/api/admin/users | jq '.'
```

#### 5.2 Verificar datos iniciales:
```bash
# Verificar que existe el usuario admin
curl -H "Authorization: Bearer $TOKEN" \
     https://hostybee.com:3007/api/admin/users | \
     jq '.[] | select(.email=="admin@amistapp.com")'
```

### 🌍 PASO 6: PRUEBAS DESDE EL FRONTEND

#### 6.1 Verificar desde la aplicación web:
1. Abrir `https://hostybee.com:31043/`
2. Intentar hacer login con: `admin@amistapp.com` / `admin123`
3. Verificar que el dashboard carga correctamente
4. Probar funcionalidades principales

#### 6.2 Verificar desde el panel admin:
1. Abrir `https://hostybee.com:31043/admin`
2. Hacer login como administrador
3. Verificar que se pueden ver usuarios, reportes, etc.

### 🔍 PASO 7: MONITOREO Y LOGS

#### 7.1 Configurar monitoreo:
```bash
# Crear script de monitoreo
cat > /usr/local/bin/check-amistapp-api.sh << 'EOF'
#!/bin/bash
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://hostybee.com:3007/api/health)
if [ $RESPONSE -eq 200 ]; then
    echo "$(date): API OK"
else
    echo "$(date): API ERROR - HTTP $RESPONSE"
    # Opcional: reiniciar servicio
    # pm2 restart amistapp-api
fi
EOF

chmod +x /usr/local/bin/check-amistapp-api.sh

# Agregar a crontab para verificar cada 5 minutos
echo "*/5 * * * * /usr/local/bin/check-amistapp-api.sh >> /var/log/amistapp-monitor.log" | crontab -
```

#### 7.2 Verificar logs de errores:
```bash
# Logs del servidor
tail -f /var/log/amistapp/error.log

# Logs de PM2 (si se usa)
pm2 logs amistapp-api --err

# Logs del sistema
journalctl -u amistapp -f
```

### ⚠️ PASO 8: SOLUCIÓN DE PROBLEMAS COMUNES

#### 8.1 Si el health check falla:
```bash
# Verificar que el servidor esté corriendo
ps aux | grep node

# Verificar puerto
netstat -tlnp | grep 3007

# Verificar logs
pm2 logs amistapp-api

# Reiniciar si es necesario
pm2 restart amistapp-api
```

#### 8.2 Si hay errores de CORS:
- Verificar que `hostybee.com` esté en la lista de orígenes permitidos
- Revisar el archivo `server/index.js` líneas 25-32

#### 8.3 Si hay errores de base de datos:
```bash
# Verificar permisos del archivo database.db
ls -la server/database.db

# Debe tener permisos de escritura para el usuario que ejecuta Node.js
chmod 664 server/database.db
```

### ✅ PASO 9: VERIFICACIÓN FINAL

#### Lista de verificación completa:
- [ ] Health check responde correctamente
- [ ] Login de administrador funciona
- [ ] Endpoints protegidos requieren autenticación
- [ ] CORS configurado correctamente
- [ ] Base de datos accesible
- [ ] Frontend puede conectarse a la API
- [ ] Panel admin funcional
- [ ] Logs sin errores críticos
- [ ] Monitoreo configurado

### 📞 CONTACTO Y SOPORTE

Si encuentras problemas durante la verificación:

1. **Revisar logs**: Siempre empezar por los logs del servidor
2. **Verificar configuración**: Comprobar variables de entorno
3. **Probar conectividad**: Usar curl para pruebas directas
4. **Reiniciar servicios**: Como último recurso

**La API está diseñada para ser robusta y auto-recuperarse de errores menores.**