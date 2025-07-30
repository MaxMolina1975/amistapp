/*
  # Tablas de cursos y membresías

  1. Nuevas Tablas
    - `courses`
      - `id` (uuid)
      - `name` (text)
      - `code` (text, único)
      - `teacher_id` (uuid)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `course_members`
      - `course_id` (uuid)
      - `user_id` (uuid)
      - `joined_at` (timestamp)
      - `points` (integer)

  2. Seguridad
    - Enable RLS
    - Políticas para profesores y estudiantes
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  teacher_id uuid REFERENCES auth.users NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_members (
  course_id uuid REFERENCES courses NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  joined_at timestamptz DEFAULT now(),
  points integer NOT NULL DEFAULT 0 CHECK (points >= 0),
  PRIMARY KEY (course_id, user_id)
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_members ENABLE ROW LEVEL SECURITY;

-- Políticas para courses
CREATE POLICY "Teachers can manage their courses"
  ON courses
  FOR ALL
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM course_members
      WHERE course_id = courses.id
      AND user_id = auth.uid()
    )
  );

-- Políticas para course_members
CREATE POLICY "Users can view course members"
  ON course_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_members.course_id
      AND (
        teacher_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM course_members cm
          WHERE cm.course_id = courses.id
          AND cm.user_id = auth.uid()
        )
      )
    )
  );

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

-- Trigger para actualizar updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();