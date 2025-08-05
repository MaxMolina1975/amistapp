# Arquitectura del Sistema AmistApp

## Descripción General
La arquitectura del sistema AmistApp está diseñada para conectar tres componentes principales:
1. Aplicación Cliente (App)
2. Base de Datos Centralizada
3. Panel de Administrador (Dashboard)

## Componentes Principales

### 1. Aplicación Cliente (App)
- **Frontend**: React/Next.js
- **Características**:
  - Interfaz de usuario para estudiantes, profesores y tutores
  - Gestión de reportes y recompensas
  - Sistema de notificaciones
  - Autenticación de usuarios

### 2. Base de Datos Centralizada
- **Tecnología**: MySQL
- **Características**:
  - Única fuente de datos para toda la aplicación
  - Esquema optimizado para múltiples tipos de usuarios
  - Tablas principales:
    - Users (estudiantes, profesores, tutores, administradores)
    - Reports (reportes de bullying y comportamiento)
    - Rewards (sistema de recompensas)
    - Activities (registro de actividades)
    - Notifications (sistema de notificaciones)

### 3. Panel de Administrador (Dashboard)
- **Frontend**: React/Next.js
- **Características**:
  - Visualización de estadísticas generales
  - Gestión de usuarios
  - Administración de reportes
  - Control de recompensas
  - Configuración del sistema

## Conexiones y Flujo de Datos

### API REST
- **Endpoints principales**:
  - `/api/auth`: Autenticación y gestión de usuarios
  - `/api/admin`: Funciones administrativas
  - `/api/reports`: Gestión de reportes
  - `/api/rewards`: Sistema de recompensas
  - `/api/notifications`: Sistema de notificaciones

### Seguridad
- Autenticación mediante JWT
- Roles y permisos diferenciados
- Middleware de verificación para rutas protegidas

## Diagrama de Arquitectura
```
+----------------+     +-----------------+     +------------------+
|                |     |                 |     |                  |
|  APP CLIENTE   |     |  API REST       |     |     PANEL       |
|  (React/Next)  |<--->|  (Express.js)   |<--->|  ADMINISTRADOR  |
|                |     |                 |     |  (React/Next)    |
+----------------+     +-----------------+     +------------------+
                              ^
                              |
                              v
                      +---------------+
                      |               |
                      |  BASE DATOS   |
                      |   (MySQL)     |
                      |               |
                      +---------------+
```

## Flujo de Trabajo
1. Los usuarios acceden a la aplicación cliente
2. Las peticiones se procesan a través de la API REST
3. La API interactúa con la base de datos centralizada
4. El panel de administrador permite gestionar y visualizar todos los datos
5. Todas las modificaciones se reflejan en tiempo real en la aplicación cliente

## Ventajas de la Arquitectura
1. Centralización de datos
2. Escalabilidad
3. Mantenibilidad
4. Seguridad robusta
5. Experiencia de usuario consistente