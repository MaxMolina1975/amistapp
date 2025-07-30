# Credenciales de Administrador para AmistApp

## Información de Acceso

Se han creado las siguientes credenciales de administrador para acceder al panel de administración:

- **Email**: admin@amistapp.com
- **Contraseña**: Admin@2023
- **Rol**: admin

## Instrucciones de Uso

1. Inicia la aplicación con `npm run dev`
2. Accede a http://localhost:5175/login
3. Introduce las credenciales proporcionadas arriba
4. Serás redirigido al panel de administración

## Notas Importantes

- Estas credenciales son para desarrollo y pruebas iniciales
- Por seguridad, deberías cambiar estas credenciales en un entorno de producción
- Las credenciales están configuradas en `src/config/adminCredentials.js`
- Se ha implementado un servicio de autenticación simulado en `src/services/mockAuthService.js` para permitir el inicio de sesión sin un backend real

## Configuración Técnica

Para que las credenciales funcionen correctamente, asegúrate de inicializar el servicio de autenticación simulado añadiendo la siguiente línea en el archivo `src/main.jsx`:

```javascript
import { initMockAuthService } from './services/mockAuthService';

// Inicializar el servicio de autenticación simulado
initMockAuthService();
```

Esto permitirá que las credenciales funcionen correctamente durante el desarrollo.