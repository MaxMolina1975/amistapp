/*
  # Tabla de emociones

  1. Nuevas Tablas
    - `emotions`
      - `id` (uuid)
      - `user_id` (uuid, referencia a auth.users)
      - `type` (text)
      - `intensity` (integer 1-5)
      - `note` (text, opcional)
      - `created_at` (timestamp)

  2. Seguridad
    - Enable RLS
    - Políticas para estudiantes y profesores
*/

CREATE TABLE IF NOT EXISTS emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('happy', 'calm', 'motivated', 'sad', 'angry', 'anxious', 'tired', 'excited')),
  intensity integer NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their own emotions"
  ON emotions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emotions"
  ON emotions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Teachers can view emotions of their students
CREATE POLICY "Teachers can view student emotions"
  ON emotions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );