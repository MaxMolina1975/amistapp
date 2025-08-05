/*
  # Sistema de recompensas y puntos para todos los roles

  Este archivo de migración implementa:
  1. Actualización del sistema de recompensas para todos los roles
  2. Creación de tabla de transacciones de puntos
  3. Actualización de políticas de seguridad para recompensas
  4. Sistema de asignación de puntos entre roles
  5. Registro de actividades que generan puntos
*/

-- Añadir columna de puntos disponibles a la tabla de perfiles de usuario
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS available_points integer NOT NULL DEFAULT 0;

-- Crear tabla de actividades que generan puntos
CREATE TABLE IF NOT EXISTS point_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points integer NOT NULL CHECK (points > 0),
  activity_type text NOT NULL CHECK (activity_type IN ('academic', 'behavioral', 'participation', 'attendance', 'other')),
  creator_id uuid REFERENCES auth.users NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE point_activities ENABLE ROW LEVEL SECURITY;

-- Crear tabla de asignaciones de puntos por actividad
CREATE TABLE IF NOT EXISTS point_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES point_activities NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  points_earned integer NOT NULL CHECK (points_earned > 0),
  assigned_by uuid REFERENCES auth.users NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE point_assignments ENABLE ROW LEVEL SECURITY;

-- Políticas para actividades de puntos
CREATE POLICY "Teachers and tutors can create point activities"
  ON point_activities
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Users can view active point activities"
  ON point_activities
  FOR SELECT
  USING (active = true OR creator_id = auth.uid());

CREATE POLICY "Creators can manage their point activities"
  ON point_activities
  FOR ALL
  USING (creator_id = auth.uid());

-- Políticas para asignaciones de puntos
CREATE POLICY "Teachers and tutors can assign points"
  ON point_assignments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Users can view their own point assignments"
  ON point_assignments
  FOR SELECT
  USING (user_id = auth.uid() OR assigned_by = auth.uid());

-- Trigger para actualizar puntos cuando se crea una asignación de puntos
CREATE OR REPLACE FUNCTION update_points_after_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar puntos del usuario
  UPDATE user_profiles
  SET available_points = available_points + NEW.points_earned
  WHERE id = NEW.user_id;
  
  -- Crear registro de transacción
  INSERT INTO point_transactions (user_id, amount, type, description, awarded_by, related_id)
  VALUES (NEW.user_id, NEW.points_earned, 'assignment', 'Points from activity', NEW.assigned_by, NEW.activity_id);
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_points_after_point_assignment
  AFTER INSERT ON point_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_points_after_assignment();

-- Trigger para actualizar updated_at en point_activities
CREATE TRIGGER update_point_activities_updated_at
  BEFORE UPDATE ON point_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Crear tabla de recompensas mejorada
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  points_cost integer NOT NULL CHECK (points_cost > 0),
  image_url text,
  available boolean DEFAULT true,
  limited_quantity boolean DEFAULT false,
  quantity integer,
  expiration_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Crear tabla de solicitudes de recompensas
CREATE TABLE IF NOT EXISTS reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid REFERENCES rewards NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  points_spent integer NOT NULL CHECK (points_spent > 0),
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'delivered')),
  approved_by uuid REFERENCES auth.users,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  delivered_at timestamptz
);

ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;

-- Crear tabla de transacciones de puntos
CREATE TABLE IF NOT EXISTS point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('reward', 'assignment', 'bonus', 'system')),
  description text,
  awarded_by uuid REFERENCES auth.users,
  related_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para recompensas
CREATE POLICY "Teachers and tutors can create rewards"
  ON rewards
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "Users can view available rewards"
  ON rewards
  FOR SELECT
  USING (available = true OR creator_id = auth.uid());

CREATE POLICY "Creators can manage their rewards"
  ON rewards
  FOR ALL
  USING (creator_id = auth.uid());

-- Políticas para solicitudes de recompensas
CREATE POLICY "Students can claim rewards"
  ON reward_claims
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'student'
    )
  );

CREATE POLICY "Users can view their own reward claims"
  ON reward_claims
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Reward creators can manage claims for their rewards"
  ON reward_claims
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM rewards
      WHERE id = reward_claims.reward_id
      AND creator_id = auth.uid()
    )
  );

-- Políticas para transacciones de puntos
CREATE POLICY "Users can view their own point transactions"
  ON point_transactions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Teachers and tutors can award points"
  ON point_transactions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'tutor')
    )
  );

CREATE POLICY "System can create point transactions"
  ON point_transactions
  FOR INSERT
  WITH CHECK (type = 'system');

-- Función para otorgar puntos por bonificación
CREATE OR REPLACE FUNCTION award_bonus_points(p_user_id uuid, p_amount integer, p_description text, p_awarded_by uuid)
RETURNS uuid AS $$
DECLARE
  v_transaction_id uuid;
BEGIN
  -- Verificar que el usuario que otorga los puntos sea profesor o tutor
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_awarded_by
    AND role IN ('teacher', 'tutor')
  ) THEN
    RAISE EXCEPTION 'Only teachers and tutors can award bonus points';
  END IF;
  
  -- Crear transacción de puntos
  INSERT INTO point_transactions (user_id, amount, type, description, awarded_by)
  VALUES (p_user_id, p_amount, 'bonus', p_description, p_awarded_by)
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$ language 'plpgsql';

-- Función para otorgar puntos del sistema
CREATE OR REPLACE FUNCTION award_system_points(p_user_id uuid, p_amount integer, p_description text)
RETURNS uuid AS $$
DECLARE
  v_transaction_id uuid;
BEGIN
  -- Crear transacción de puntos del sistema
  INSERT INTO point_transactions (user_id, amount, type, description)
  VALUES (p_user_id, p_amount, 'system', p_description)
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$ language 'plpgsql';

-- Función para actualizar puntos de usuario
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_profiles
    SET available_points = available_points + NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar puntos cuando se crea una transacción
CREATE TRIGGER update_points_after_transaction
  AFTER INSERT ON point_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();

-- Función para verificar puntos disponibles al reclamar recompensa
CREATE OR REPLACE FUNCTION check_points_for_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si el usuario tiene suficientes puntos
  IF EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = NEW.user_id
    AND available_points < NEW.points_spent
  ) THEN
    RAISE EXCEPTION 'Insufficient points to claim this reward';
  END IF;
  
  -- Verificar si la recompensa está disponible
  IF EXISTS (
    SELECT 1 FROM rewards
    WHERE id = NEW.reward_id
    AND (available = false OR 
         (limited_quantity = true AND quantity <= 0) OR
         (expiration_date IS NOT NULL AND expiration_date < now()))
  ) THEN
    RAISE EXCEPTION 'Reward is no longer available';
  END IF;
  
  -- Reducir la cantidad disponible si es una recompensa limitada
  UPDATE rewards
  SET quantity = quantity - 1
  WHERE id = NEW.reward_id
  AND limited_quantity = true;
  
  -- Deducir puntos
  UPDATE user_profiles
  SET available_points = available_points - NEW.points_spent
  WHERE id = NEW.user_id;
  
  -- Crear registro de transacción
  INSERT INTO point_transactions (user_id, amount, type, description, related_id)
  VALUES (NEW.user_id, -NEW.points_spent, 'reward', 'Reward claim', NEW.reward_id);
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para verificar puntos al reclamar recompensa
CREATE TRIGGER check_points_before_reward_claim
  BEFORE INSERT ON reward_claims
  FOR EACH ROW
  EXECUTE FUNCTION check_points_for_reward();

-- Trigger para actualizar updated_at en rewards
CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en reward_claims
CREATE TRIGGER update_reward_claims_updated_at
  BEFORE UPDATE ON reward_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();