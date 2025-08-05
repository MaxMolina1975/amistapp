/*
  # Añadir columna de código a la tabla de cursos

  Este archivo de migración implementa:
  1. Añade la columna 'code' a la tabla de cursos si no existe
  2. Asegura que la columna sea única para evitar duplicados
  3. Actualiza los cursos existentes con códigos generados automáticamente
  4. Añade una restricción NOT NULL después de actualizar los datos existentes
*/

-- Verificar si la columna 'code' existe en la tabla 'courses'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'code') THEN
    -- Añadir la columna 'code' a la tabla 'courses'
    ALTER TABLE courses ADD COLUMN code text;
    
    -- Actualizar los cursos existentes con códigos generados automáticamente
    UPDATE courses
    SET code = 'CURSO-' || SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 6)
    WHERE code IS NULL;
    
    -- Añadir restricción UNIQUE a la columna 'code'
    ALTER TABLE courses ADD CONSTRAINT courses_code_unique UNIQUE (code);
    
    -- Añadir restricción NOT NULL a la columna 'code'
    ALTER TABLE courses ALTER COLUMN code SET NOT NULL;
  END IF;
END
$$;

-- Crear o reemplazar la función para generar códigos de curso
CREATE OR REPLACE FUNCTION generate_course_code()
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Generar un código aleatorio con formato 'CURSO-XXXXXX'
    new_code := 'CURSO-' || SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 6);
    
    -- Verificar si el código ya existe
    SELECT EXISTS (SELECT 1 FROM courses WHERE code = new_code) INTO code_exists;
    
    -- Si el código no existe, salir del bucle
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Crear o reemplazar la función para actualizar el código de un curso
CREATE OR REPLACE FUNCTION update_course_code(p_course_id uuid, p_new_code text)
RETURNS boolean AS $$
BEGIN
  -- Verificar si el código ya existe en otro curso
  IF EXISTS (SELECT 1 FROM courses WHERE code = p_new_code AND id != p_course_id) THEN
    RAISE EXCEPTION 'El código de curso ya está en uso';
    RETURN false;
  END IF;
  
  -- Actualizar el código del curso
  UPDATE courses
  SET code = p_new_code,
      updated_at = now()
  WHERE id = p_course_id;
  
  RETURN true;
EXCEPTION
  WHEN others THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql;