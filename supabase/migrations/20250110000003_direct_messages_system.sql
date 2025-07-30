/*
  # Sistema de mensajes directos entre usuarios

  Este archivo de migración implementa:
  1. Creación de tabla de mensajes directos entre usuarios
  2. Políticas de seguridad para mensajes
  3. Sistema de conversaciones y chats
  4. Notificaciones para mensajes nuevos
*/

-- Crear tabla de conversaciones entre usuarios
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Crear tabla de participantes en conversaciones
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Crear tabla de mensajes directos
CREATE TABLE IF NOT EXISTS direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations NOT NULL,
  sender_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para conversaciones
CREATE POLICY "Users can view their conversations"
  ON conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = conversations.id
      AND user_id = auth.uid()
    )
  );

-- Políticas para participantes en conversaciones
CREATE POLICY "Users can view conversation participants"
  ON conversation_participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = conversation_participants.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Políticas para mensajes directos
CREATE POLICY "Users can view messages in their conversations"
  ON direct_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = direct_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations"
  ON direct_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = direct_messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON direct_messages
  FOR UPDATE
  USING (sender_id = auth.uid());

-- Función para crear una nueva conversación entre usuarios
CREATE OR REPLACE FUNCTION create_conversation(p_user_ids uuid[])
RETURNS uuid AS $$
DECLARE
  v_conversation_id uuid;
  v_user_id uuid;
BEGIN
  -- Crear nueva conversación
  INSERT INTO conversations DEFAULT VALUES
  RETURNING id INTO v_conversation_id;
  
  -- Añadir participantes
  FOREACH v_user_id IN ARRAY p_user_ids LOOP
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (v_conversation_id, v_user_id);
  END LOOP;
  
  RETURN v_conversation_id;
END;
$$ language 'plpgsql';

-- Función para marcar mensajes como leídos
CREATE OR REPLACE FUNCTION mark_messages_as_read(p_conversation_id uuid, p_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Actualizar último tiempo de lectura
  UPDATE conversation_participants
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id
  AND user_id = p_user_id;
  
  -- Marcar mensajes como leídos
  UPDATE direct_messages
  SET read = true
  WHERE conversation_id = p_conversation_id
  AND sender_id != p_user_id
  AND created_at <= (SELECT last_read_at FROM conversation_participants WHERE conversation_id = p_conversation_id AND user_id = p_user_id);
END;
$$ language 'plpgsql';

-- Trigger para actualizar la fecha de actualización de la conversación cuando se envía un mensaje
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  
  -- Crear notificación para los participantes que no son el remitente
  INSERT INTO notifications (user_id, title, message, type, related_id)
  SELECT 
    cp.user_id, 
    'Nuevo mensaje', 
    'Has recibido un nuevo mensaje', 
    'system', 
    NEW.conversation_id
  FROM conversation_participants cp
  WHERE cp.conversation_id = NEW.conversation_id
  AND cp.user_id != NEW.sender_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_after_message
  AFTER INSERT ON direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Trigger para actualizar updated_at en direct_messages
CREATE TRIGGER update_direct_messages_updated_at
  BEFORE UPDATE ON direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();