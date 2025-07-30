/*
  # Tabla de reportes

  1. Nuevas Tablas
    - `reports`
      - `id` (uuid)
      - `user_id` (uuid, referencia a auth.users)
      - `type` (text)
      - `title` (text)
      - `description` (text)
      - `priority` (text)
      - `status` (text)
      - `anonymous` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `resolved_at` (timestamp)
      - `resolved_by` (uuid)
      - `resolution` (text)

  2. Seguridad
    - Enable RLS
    - Políticas para reportes anónimos y no anónimos
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('behavior', 'bullying', 'academic', 'suggestion', 'other')),
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL CHECK (status IN ('pending', 'in_review', 'resolved', 'dismissed')),
  anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users,
  resolution text,
  CONSTRAINT valid_resolution CHECK (
    (status = 'resolved' AND resolution IS NOT NULL) OR
    (status != 'resolved')
  )
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their own reports"
  ON reports
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    (
      anonymous = true AND
      EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role = 'teacher'
      )
    )
  );

CREATE POLICY "Users can create reports"
  ON reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can update reports"
  ON reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Trigger para actualizar updated_at
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();