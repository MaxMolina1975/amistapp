/*
  # Actualización completa de roles y funcionalidades

  Este archivo de migración implementa:
  1. Actualización de la tabla de usuarios para soportar todos los roles
  2. Creación de tabla de tutores y sus relaciones
  3. Actualización de políticas de seguridad para todos los roles
  4. Relaciones entre estudiantes, profesores y tutores
*/

-- Actualizar la tabla user_profiles para incluir el rol de tutor
ALTER TABLE user_profiles
  DROP CONSTRAINT user_profiles_role_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_role_check 
  CHECK (role IN ('student', 'teacher', 'tutor'));

-- Crear tabla de relaciones tutor-estudiante
CREATE TABLE IF NOT EXISTS tutor_student_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid REFERENCES auth.users NOT NULL,
  student_id uuid REFERENCES auth.users NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tutor_id, student_id)
);

ALTER TABLE tutor_student_relations ENABLE ROW LEVEL SECURITY;

-- Crear tabla de cursos y grupos
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  teacher_id uuid REFERENCES auth.users NOT NULL,
  grade_level text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Crear tabla de miembros de cursos
CREATE TABLE IF NOT EXISTS course_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'teacher', 'tutor')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_id)
);

ALTER TABLE course_members ENABLE ROW LEVEL SECURITY;

-- Actualizar políticas para la tabla de emociones
CREATE POLICY "Tutors can view emotions of their students"
  ON emotions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'tutor'
      AND EXISTS (
        SELECT 1 FROM tutor_student_relations
        WHERE tutor_id = auth.uid()
        AND student_id = emotions.user_id
        AND approved = true
      )
    )
  );

-- Políticas para la tabla de tutores y estudiantes
CREATE POLICY "Tutors can manage their student relations"
  ON tutor_student_relations
  FOR ALL
  USING (tutor_id = auth.uid());

CREATE POLICY "Students can view their tutor relations"
  ON tutor_student_relations
  FOR SELECT
  USING (student_id = auth.uid());

-- Políticas para cursos
CREATE POLICY "Teachers can manage their courses"
  ON courses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    ) AND teacher_id = auth.uid()
  );

CREATE POLICY "Users can view courses they are members of"
  ON courses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_members
      WHERE course_id = courses.id
      AND user_id = auth.uid()
    )
  );

-- Políticas para miembros de cursos
CREATE POLICY "Teachers can manage course members"
  ON course_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_members.course_id
      AND teacher_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their course memberships"
  ON course_members
  FOR SELECT
  USING (user_id = auth.uid());

-- Trigger para actualizar updated_at en tutor_student_relations
CREATE TRIGGER update_tutor_student_relations_updated_at
  BEFORE UPDATE ON tutor_student_relations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en courses
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();