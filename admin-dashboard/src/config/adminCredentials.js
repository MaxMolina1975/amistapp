/**
 * Credenciales de acceso para el panel de administración
 * 
 * Este archivo contiene las credenciales predeterminadas para acceder al panel de administración.
 * Estas credenciales deben ser utilizadas solo para el primer acceso y luego deben ser cambiadas
 * o preferiblemente configuradas en el servidor.
 */

// Credenciales de administrador predeterminadas
export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'Administradorpanel2025@',
  password: 'Admin@2025',
  role: 'admin'
};

/**
 * Instrucciones de uso:
 * 
 * 1. Utiliza estas credenciales para el primer inicio de sesión en el panel de administración.
 * 2. Una vez dentro del panel, crea nuevos usuarios administradores con credenciales seguras.
 * 3. Por seguridad, cambia estas credenciales predeterminadas lo antes posible.
 * 
 * Nota: En un entorno de producción, estas credenciales deberían estar almacenadas
 * de forma segura en el servidor y no en el código fuente del cliente.
 */