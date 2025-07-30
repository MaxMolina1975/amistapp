/*
  # Sistema de reportes y análisis avanzados

  Este archivo de migración implementa:
  1. Tablas para almacenar datos de análisis y estadísticas
  2. Vistas para reportes de progreso de estudiantes
  3. Funciones para generar reportes personalizados
  4. Políticas de seguridad para acceso a reportes
*/

-- Crear tabla de estadísticas de estudiantes
CREATE TABLE IF NOT EXISTS student_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users NOT NULL,
  points_earned integer DEFAULT 0,
  points_spent integer DEFAULT 0,
  rewards_claimed integer DEFAULT 0,
  activities_completed integer DEFAULT 0,
  behavioral_reports integer DEFAULT 0,
  academic_reports integer DEFAULT 0,
  attendance_percentage numeric(5,2) DEFAULT 100.0,
  last_calculated_at timestamptz DEFAULT now(),
  UNIQUE(student_id)
);

ALTER TABLE student_statistics ENABLE ROW LEVEL SECURITY;

-- Crear tabla de reportes periódicos
CREATE TABLE IF NOT EXISTS periodic_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users NOT NULL,
  creator_id uuid REFERENCES auth.users NOT NULL,
  report_period text NOT NULL CHECK (report_period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  academic_summary text,
  behavioral_summary text,
  points_summary text,
  recommendations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE periodic_reports ENABLE ROW LEVEL SECURITY;

-- Crear tabla de métricas de actividad
CREATE TABLE IF NOT EXISTS activity_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  login_count integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  points_spent integer DEFAULT 0,
  messages_sent integer DEFAULT 0,
  activities_completed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE activity_metrics ENABLE ROW LEVEL SECURITY;

-- Crear vista para reportes de progreso de estudiantes
CREATE OR REPLACE VIEW student_progress_view AS
SELECT 
  up.id as student_id,
  up.full_name,
  up.available_points,
  COALESCE(ss.points_earned, 0) as total_points_earned,
  COALESCE(ss.points_spent, 0) as total_points_spent,
  COALESCE(ss.rewards_claimed, 0) as total_rewards_claimed,
  COALESCE(ss.activities_completed, 0) as total_activities_completed,
  COALESCE(ss.behavioral_reports, 0) as total_behavioral_reports,
  COALESCE(ss.academic_reports, 0) as total_academic_reports,
  COALESCE(ss.attendance_percentage, 100.0) as attendance_percentage
FROM user_profiles up
LEFT JOIN student_statistics ss ON up.id = ss.student_id
WHERE up.role = 'student';

-- Políticas para estadísticas de estudiantes
CREATE POLICY "Students can view their own statistics"
  ON student_statistics
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Teachers and tutors can view statistics of their students"
  ON student_statistics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
      AND (
        -- Para profesores: estudiantes en sus cursos
        EXISTS (
          SELECT 1 FROM course_enrollments ce
          JOIN courses c ON ce.course_id = c.id
          WHERE ce.student_id = student_statistics.student_id
          AND c.teacher_id = auth.uid()
        )
        OR
        -- Para tutores: estudiantes asignados
        EXISTS (
          SELECT 1 FROM tutor_student_relations
          WHERE tutor_id = auth.uid()
          AND student_id = student_statistics.student_id
          AND approved = true
        )
      )
    )
  );

-- Políticas para reportes periódicos
CREATE POLICY "Users can view reports they created"
  ON periodic_reports
  FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Students can view their own reports"
  ON periodic_reports
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Teachers and tutors can create reports"
  ON periodic_reports
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Teachers and tutors can update reports they created"
  ON periodic_reports
  FOR UPDATE
  USING (creator_id = auth.uid());

-- Políticas para métricas de actividad
CREATE POLICY "Users can view their own activity metrics"
  ON activity_metrics
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Teachers and tutors can view activity metrics of their students"
  ON activity_metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
      AND (
        -- Para profesores: estudiantes en sus cursos
        EXISTS (
          SELECT 1 FROM course_enrollments ce
          JOIN courses c ON ce.course_id = c.id
          WHERE ce.student_id = activity_metrics.user_id
          AND c.teacher_id = auth.uid()
        )
        OR
        -- Para tutores: estudiantes asignados
        EXISTS (
          SELECT 1 FROM tutor_student_relations
          WHERE tutor_id = auth.uid()
          AND student_id = activity_metrics.user_id
          AND approved = true
        )
      )
    )
  );

-- Función para actualizar estadísticas de estudiantes
CREATE OR REPLACE FUNCTION update_student_statistics(p_student_id uuid)
RETURNS void AS $$
DECLARE
  v_points_earned integer;
  v_points_spent integer;
  v_rewards_claimed integer;
  v_activities_completed integer;
  v_behavioral_reports integer;
  v_academic_reports integer;
  v_attendance_percentage numeric(5,2);
BEGIN
  -- Calcular puntos ganados
  SELECT COALESCE(SUM(amount), 0) INTO v_points_earned
  FROM point_transactions
  WHERE user_id = p_student_id AND amount > 0;
  
  -- Calcular puntos gastados
  SELECT COALESCE(SUM(ABS(amount)), 0) INTO v_points_spent
  FROM point_transactions
  WHERE user_id = p_student_id AND amount < 0;
  
  -- Calcular recompensas reclamadas
  SELECT COUNT(*) INTO v_rewards_claimed
  FROM reward_claims
  WHERE user_id = p_student_id;
  
  -- Calcular actividades completadas
  SELECT COUNT(*) INTO v_activities_completed
  FROM point_assignments
  WHERE user_id = p_student_id;
  
  -- Calcular reportes de comportamiento
  SELECT COUNT(*) INTO v_behavioral_reports
  FROM reports
  WHERE student_id = p_student_id AND type = 'behavior';
  
  -- Calcular reportes académicos
  SELECT COUNT(*) INTO v_academic_reports
  FROM reports
  WHERE student_id = p_student_id AND type = 'academic';
  
  -- Calcular porcentaje de asistencia (ejemplo simplificado)
  v_attendance_percentage := 100.0; -- Valor por defecto
  
  -- Insertar o actualizar estadísticas
  INSERT INTO student_statistics (
    student_id, 
    points_earned, 
    points_spent, 
    rewards_claimed, 
    activities_completed, 
    behavioral_reports, 
    academic_reports, 
    attendance_percentage,
    last_calculated_at
  ) VALUES (
    p_student_id,
    v_points_earned,
    v_points_spent,
    v_rewards_claimed,
    v_activities_completed,
    v_behavioral_reports,
    v_academic_reports,
    v_attendance_percentage,
    now()
  )
  ON CONFLICT (student_id) DO UPDATE SET
    points_earned = v_points_earned,
    points_spent = v_points_spent,
    rewards_claimed = v_rewards_claimed,
    activities_completed = v_activities_completed,
    behavioral_reports = v_behavioral_reports,
    academic_reports = v_academic_reports,
    attendance_percentage = v_attendance_percentage,
    last_calculated_at = now();
END;
$$ language 'plpgsql';

-- Función para registrar actividad diaria
CREATE OR REPLACE FUNCTION log_daily_activity(p_user_id uuid, p_activity_type text, p_count integer DEFAULT 1)
RETURNS void AS $$
DECLARE
  v_today date := current_date;
BEGIN
  INSERT INTO activity_metrics (user_id, date)
  VALUES (p_user_id, v_today)
  ON CONFLICT (user_id, date) DO NOTHING;
  
  IF p_activity_type = 'login' THEN
    UPDATE activity_metrics
    SET login_count = login_count + p_count
    WHERE user_id = p_user_id AND date = v_today;
  ELSIF p_activity_type = 'points_earned' THEN
    UPDATE activity_metrics
    SET points_earned = points_earned + p_count
    WHERE user_id = p_user_id AND date = v_today;
  ELSIF p_activity_type = 'points_spent' THEN
    UPDATE activity_metrics
    SET points_spent = points_spent + p_count
    WHERE user_id = p_user_id AND date = v_today;
  ELSIF p_activity_type = 'messages_sent' THEN
    UPDATE activity_metrics
    SET messages_sent = messages_sent + p_count
    WHERE user_id = p_user_id AND date = v_today;
  ELSIF p_activity_type = 'activities_completed' THEN
    UPDATE activity_metrics
    SET activities_completed = activities_completed + p_count
    WHERE user_id = p_user_id AND date = v_today;
  END IF;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en periodic_reports
CREATE TRIGGER update_periodic_reports_updated_at
  BEFORE UPDATE ON periodic_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar estadísticas cuando se asignan puntos
CREATE OR REPLACE FUNCTION trigger_update_statistics()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_student_statistics(NEW.user_id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_statistics_after_point_transaction
  AFTER INSERT ON point_transactions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_statistics();

CREATE TRIGGER update_statistics_after_reward_claim
  AFTER INSERT ON reward_claims
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_statistics();