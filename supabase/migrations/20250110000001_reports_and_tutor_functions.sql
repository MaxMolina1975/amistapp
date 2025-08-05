/*
  # Actualización de reportes y funcionalidades para tutores

  Este archivo de migración implementa:
  1. Actualización de la tabla de reportes para incluir reportes de tutores
  2. Creación de tabla de notificaciones para todos los roles
  3. Actualización de políticas de seguridad para reportes
  4. Funcionalidades específicas para tutores
*/

-- Actualizar la tabla de reportes para incluir reportes de tutores
ALTER TABLE reports
  DROP CONSTRAINT IF EXISTS reports_type_check;

ALTER TABLE reports
  ADD CONSTRAINT reports_type_check 
  CHECK (type IN ('behavior', 'bullying', 'academic', 'attendance', 'suggestion', 'emotional', 'other'));

-- Crear tabla de notificaciones para todos los roles
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('report', 'emotion', 'reward', 'course', 'system')),
  related_id uuid,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Crear tabla de seguimiento socioemocional para tutores
CREATE TABLE IF NOT EXISTS emotional_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users NOT NULL,
  tutor_id uuid REFERENCES auth.users NOT NULL,
  notes text NOT NULL,
  mood_rating integer CHECK (mood_rating BETWEEN 1 AND 5),
  follow_up_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_tutor_student
    FOREIGN KEY (tutor_id, student_id)
    REFERENCES tutor_student_relations(tutor_id, student_id)
);

ALTER TABLE emotional_tracking ENABLE ROW LEVEL SECURITY;

-- Crear tabla de objetivos socioemocionales
CREATE TABLE IF NOT EXISTS emotional_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE emotional_goals ENABLE ROW LEVEL SECURITY;

-- Políticas para notificaciones
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- Políticas para seguimiento emocional
CREATE POLICY "Tutors can manage emotional tracking for their students"
  ON emotional_tracking
  FOR ALL
  USING (
    tutor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM tutor_student_relations
      WHERE tutor_id = auth.uid()
      AND student_id = emotional_tracking.student_id
      AND approved = true
    )
  );

CREATE POLICY "Students can view their emotional tracking"
  ON emotional_tracking
  FOR SELECT
  USING (student_id = auth.uid());

-- Políticas para objetivos emocionales
CREATE POLICY "Users can manage emotional goals they created"
  ON emotional_goals
  FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Students can view their emotional goals"
  ON emotional_goals
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Tutors can view emotional goals of their students"
  ON emotional_goals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'tutor'
      AND EXISTS (
        SELECT 1 FROM tutor_student_relations
        WHERE tutor_id = auth.uid()
        AND student_id = emotional_goals.student_id
        AND approved = true
      )
    )
  );

-- Trigger para actualizar updated_at en emotional_tracking
CREATE TRIGGER update_emotional_tracking_updated_at
  BEFORE UPDATE ON emotional_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en emotional_goals
CREATE TRIGGER update_emotional_goals_updated_at
  BEFORE UPDATE ON emotional_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();