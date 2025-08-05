import React from 'react';
import ChatHub from '../../components/chat/ChatHub';
import DashboardLayout from '../../components/layout/DashboardLayout';

/**
 * Página principal del sistema de mensajería
 * Esta página muestra el hub de chat y permite a los usuarios
 * comunicarse con docentes, estudiantes y tutores.
 */
const MensajesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <ChatHub />
      </div>
    </DashboardLayout>
  );
};

export default MensajesPage;
