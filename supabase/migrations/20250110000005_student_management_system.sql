/*
  # Sistema de gestión de estudiantes mejorado

  Este archivo de migración implementa:
  1. Mejoras en la gestión de estudiantes para profesores y tutores
  2. Sistema de seguimiento de progreso académico
  3. Funcionalidades para visualizar estadísticas de estudiantes
  4. Políticas de seguridad para gestión de estudiantes
*/

-- Crear tabla de notas y evaluaciones académicas
CREATE TABLE IF NOT EXISTS student_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users NOT NULL,
  evaluator_id uuid REFERENCES auth.users NOT NULL,
  course_id uuid REFERENCES courses,
  title text NOT NULL,
  description text,
  score numeric(5,2),
  max_score numeric(5,2) DEFAULT 100.0,
  evaluation_date date DEFAULT current_date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_evaluations ENABLE ROW LEVEL SECURITY;

-- Crear tabla de observaciones de estudiantes
CREATE TABLE IF NOT EXISTS student_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users NOT NULL,
  observer_id uuid REFERENCES auth.users NOT NULL,
  observation_type text NOT NULL CHECK (observation_type IN ('academic', 'behavioral', 'emotional', 'other')),
  content text NOT NULL,
  requires_action boolean DEFAULT false,
  action_taken text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_observations ENABLE ROW LEVEL SECURITY;

-- Crear tabla de metas académicas
CREATE TABLE IF NOT EXISTS academic_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users NOT NULL,
  creator_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  due_date date,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  progress integer DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE academic_goals ENABLE ROW LEVEL SECURITY;

-- Crear tabla de grupos de estudiantes
CREATE TABLE IF NOT EXISTS student_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  creator_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_groups ENABLE ROW LEVEL SECURITY;

-- Crear tabla de miembros de grupos
CREATE TABLE IF NOT EXISTS student_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES student_groups NOT NULL,
  student_id uuid REFERENCES auth.users NOT NULL,
  added_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, student_id)
);

ALTER TABLE student_group_members ENABLE ROW LEVEL SECURITY;

-- Políticas para evaluaciones de estudiantes
CREATE POLICY "Teachers and tutors can create evaluations"
  ON student_evaluations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Teachers and tutors can manage evaluations they created"
  ON student_evaluations
  FOR ALL
  USING (evaluator_id = auth.uid());

CREATE POLICY "Students can view their own evaluations"
  ON student_evaluations
  FOR SELECT
  USING (student_id = auth.uid());

-- Políticas para observaciones de estudiantes
CREATE POLICY "Teachers and tutors can create observations"
  ON student_observations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Teachers and tutors can manage observations they created"
  ON student_observations
  FOR ALL
  USING (observer_id = auth.uid());

CREATE POLICY "Students can view their own observations"
  ON student_observations
  FOR SELECT
  USING (student_id = auth.uid());

-- Políticas para metas académicas
CREATE POLICY "Teachers and tutors can create academic goals"
  ON academic_goals
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Teachers and tutors can manage academic goals they created"
  ON academic_goals
  FOR ALL
  USING (creator_id = auth.uid());

CREATE POLICY "Students can view and update their own academic goals"
  ON academic_goals
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can update progress of their own academic goals"
  ON academic_goals
  FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid() AND (progress IS NULL OR progress BETWEEN 0 AND 100));

-- Políticas para grupos de estudiantes
CREATE POLICY "Teachers and tutors can create student groups"
  ON student_groups
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Teachers and tutors can manage groups they created"
  ON student_groups
  FOR ALL
  USING (creator_id = auth.uid());

CREATE POLICY "Users can view groups"
  ON student_groups
  FOR SELECT
  USING (true);

-- Políticas para miembros de grupos
CREATE POLICY "Teachers and tutors can add members to groups they created"
  ON student_group_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM student_groups
      WHERE id = student_group_members.group_id
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can view group members"
  ON student_group_members
  FOR SELECT
  USING (true);

CREATE POLICY "Group creators can remove members"
  ON student_group_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM student_groups
      WHERE id = student_group_members.group_id
      AND creator_id = auth.uid()
    )
  );

-- Función para obtener todos los estudiantes de un profesor
CREATE OR REPLACE FUNCTION get_teacher_students(p_teacher_id uuid)
RETURNS TABLE (student_id uuid, full_name text, email text, course_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    up.id as student_id,
    up.full_name,
    au.email,
    c.name as course_name
  FROM user_profiles up
  JOIN auth.users au ON up.id = au.id
  JOIN course_enrollments ce ON up.id = ce.student_id
  JOIN courses c ON ce.course_id = c.id
  WHERE c.teacher_id = p_teacher_id
  AND up.role = 'student'
  ORDER BY up.full_name;
END;
$$ language 'plpgsql';

-- Función para obtener todos los estudiantes de un tutor
CREATE OR REPLACE FUNCTION get_tutor_students(p_tutor_id uuid)
RETURNS TABLE (student_id uuid, full_name text, email text, relation_approved boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    up.id as student_id,
    up.full_name,
    au.email,
    tsr.approved as relation_approved
  FROM user_profiles up
  JOIN auth.users au ON up.id = au.id
  JOIN tutor_student_relations tsr ON up.id = tsr.student_id
  WHERE tsr.tutor_id = p_tutor_id
  AND up.role = 'student'
  ORDER BY up.full_name;
END;
$$ language 'plpgsql';

-- Función para obtener estadísticas resumidas de un estudiante
CREATE OR REPLACE FUNCTION get_student_summary(p_student_id uuid)
RETURNS TABLE (
  available_points integer,
  total_points_earned integer,
  total_points_spent integer,
  rewards_claimed integer,
  activities_completed integer,
  behavioral_reports integer,
  academic_reports integer,
  attendance_percentage numeric,
  average_evaluation_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.available_points,
    COALESCE(ss.points_earned, 0) as total_points_earned,
    COALESCE(ss.points_spent, 0) as total_points_spent,
    COALESCE(ss.rewards_claimed, 0) as rewards_claimed,
    COALESCE(ss.activities_completed, 0) as activities_completed,
    COALESCE(ss.behavioral_reports, 0) as behavioral_reports,
    COALESCE(ss.academic_reports, 0) as academic_reports,
    COALESCE(ss.attendance_percentage, 100.0) as attendance_percentage,
    COALESCE((SELECT AVG(score/max_score*100) FROM student_evaluations WHERE student_id = p_student_id), 0) as average_evaluation_score
  FROM user_profiles up
  LEFT JOIN student_statistics ss ON up.id = ss.student_id
  WHERE up.id = p_student_id;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en student_evaluations
CREATE TRIGGER update_student_evaluations_updated_at
  BEFORE UPDATE ON student_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en student_observations
CREATE TRIGGER update_student_observations_updated_at
  BEFORE UPDATE ON student_observations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en academic_goals
CREATE TRIGGER update_academic_goals_updated_at
  BEFORE UPDATE ON academic_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en student_groups
CREATE TRIGGER update_student_groups_updated_at
  BEFORE UPDATE ON student_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar completed_at cuando se completa una meta académica
CREATE OR REPLACE FUNCTION update_goal_completion_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at := now();
  ELSIF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_academic_goal_completion_date
  BEFORE UPDATE ON academic_goals
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION update_goal_completion_date();