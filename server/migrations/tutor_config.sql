-- Migración para crear la tabla de configuración de tutores
CREATE TABLE IF NOT EXISTS tutor_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notificaciones TEXT DEFAULT '{}',
    privacidad TEXT DEFAULT '{}',
    tema_oscuro INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tutors(id) ON DELETE CASCADE
);

-- Crear índice para búsquedas rápidas por user_id
CREATE INDEX IF NOT EXISTS idx_tutor_config_user_id ON tutor_config(user_id);