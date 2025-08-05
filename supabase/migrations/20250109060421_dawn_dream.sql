/*
  # Tabla de transacciones de puntos

  1. Nuevas Tablas
    - `point_transactions`
      - `id` (uuid)
      - `course_id` (uuid)
      - `user_id` (uuid)
      - `amount` (integer)
      - `type` (text)
      - `description` (text)
      - `created_by` (uuid)
      - `created_at` (timestamp)

  2. Seguridad
    - Enable RLS
    - Políticas para profesores y estudiantes
*/

CREATE TABLE IF NOT EXISTS point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('reward', 'bonus', 'penalty', 'transfer', 'system')),
  description text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their own transactions"
  ON point_transactions
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = point_transactions.course_id
      AND teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create transactions"
  ON point_transactions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = point_transactions.course_id
      AND teacher_id = auth.uid()
    )
  );

-- Función para actualizar puntos del usuario
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar puntos en course_members
  UPDATE course_members
  SET points = points + NEW.amount
  WHERE course_id = NEW.course_id
  AND user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar puntos
CREATE TRIGGER update_points_after_transaction
  AFTER INSERT ON point_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();