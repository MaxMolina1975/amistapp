/*
  # Rewards System Schema

  1. New Tables
    - `rewards`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `points` (integer)
      - `active` (boolean)
      - `stock` (integer)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)
      - `expires_at` (timestamp, optional)
      - `image_url` (text, optional)

    - `reward_claims`
      - `id` (uuid, primary key)
      - `reward_id` (uuid, references rewards)
      - `user_id` (uuid, references auth.users)
      - `claimed_at` (timestamp)
      - `status` (text)
      - `points` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for teachers and students
*/

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points integer NOT NULL CHECK (points >= 0),
  active boolean NOT NULL DEFAULT true,
  stock integer CHECK (stock >= 0),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  expires_at timestamptz,
  image_url text,
  CONSTRAINT valid_dates CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Create reward claims table
CREATE TABLE IF NOT EXISTS reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid REFERENCES rewards NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  claimed_at timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'delivered')),
  points integer NOT NULL CHECK (points >= 0),
  CONSTRAINT unique_active_claim UNIQUE (reward_id, user_id, status)
    WHERE status = 'pending'
);

-- Enable RLS
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;

-- Policies for rewards table
CREATE POLICY "Anyone can view active rewards"
  ON rewards
  FOR SELECT
  USING (active = true OR auth.uid() = created_by);

CREATE POLICY "Teachers can manage rewards"
  ON rewards
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Policies for reward claims
CREATE POLICY "Students can view their own claims"
  ON reward_claims
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Students can create claims"
  ON reward_claims
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    status = 'pending' AND
    EXISTS (
      SELECT 1 FROM rewards
      WHERE id = reward_id
      AND active = true
      AND (stock IS NULL OR stock > 0)
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

CREATE POLICY "Teachers can manage claims"
  ON reward_claims
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION check_points_available()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has enough points
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE id = NEW.user_id
    AND available_points >= NEW.points
  ) THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  
  -- Deduct points if claim is created
  UPDATE users
  SET available_points = available_points - NEW.points
  WHERE id = NEW.user_id;
  
  -- Decrease stock if available
  UPDATE rewards
  SET stock = stock - 1
  WHERE id = NEW.reward_id
  AND stock IS NOT NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for points check
CREATE TRIGGER check_points_before_claim
  BEFORE INSERT ON reward_claims
  FOR EACH ROW
  EXECUTE FUNCTION check_points_available();

-- Function to handle claim status changes
CREATE OR REPLACE FUNCTION handle_claim_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If claim is rejected, return points to user
  IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    UPDATE users
    SET available_points = available_points + NEW.points
    WHERE id = NEW.user_id;
    
    -- Return stock
    UPDATE rewards
    SET stock = stock + 1
    WHERE id = NEW.reward_id
    AND stock IS NOT NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for claim status changes
CREATE TRIGGER handle_claim_status_change
  AFTER UPDATE ON reward_claims
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_claim_status_change();