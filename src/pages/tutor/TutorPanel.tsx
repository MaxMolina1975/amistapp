import { useState } from 'react';
import { 
  Routes, 
  Route, 
  useNavigate, 
  useLocation, 
  Navigate 
} from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';

// Pages
import Dashboard from './Dashboard';
import StudentsList from './students/StudentsList';
import StudentDetail from './students/StudentDetail';
import ReportsList from './reports/ReportsList';
import ReportDetail from './reports/ReportDetail';
import ActivitiesList from './activities/ActivitiesList';
import CommunicationHub from './communication/CommunicationHub';
import ProfileTutor from './perfil/ProfileTutor';
import TutorSettings from './settings/TutorSettings';
import { GuiaTutores, EstrategiasComunicacion } from './recursos';
import RecursosHub from './recursos/RecursosHub';

// Icons
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';

export default function TutorPanel() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          className="p-2 rounded-lg bg-white shadow text-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out md:static md:inset-auto md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 px-6 flex items-center justify-between border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <h1 className="ml-2 text-xl font-semibold text-gray-800">AMISTAPP</h1>
            </div>
            <button
              className="md:hidden"
              onClick={closeSidebar}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/dashboard') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/dashboard');
                closeSidebar();
              }}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </button>

            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/students') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/students');
                closeSidebar();
              }}
            >
              <Users className="h-5 w-5 mr-3" />
              Estudiantes
            </button>

            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/reports') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/reports');
                closeSidebar();
              }}
            >
              <FileText className="h-5 w-5 mr-3" />
              Informes
            </button>

            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/activities') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/activities');
                closeSidebar();
              }}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Actividades
            </button>

            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/communication') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/communication');
                closeSidebar();
              }}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Comunicaciones
            </button>

            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/profile') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/profile');
                closeSidebar();
              }}
            >
              <UserCircle className="h-5 w-5 mr-3" />
              Perfil
            </button>

            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/recursos') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/recursos');
                closeSidebar();
              }}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Recursos
            </button>

            <button
              className={`w-full flex items-center px-3 py-2 rounded-lg ${
                isActive('/tutor/settings') 
                  ? 'bg-violet-50 text-violet-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                navigate('/tutor/settings');
                closeSidebar();
              }}
            >
              <Settings className="h-5 w-5 mr-3" />
              Configuración
            </button>
          </div>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {currentUser?.name?.[0] || 'T'}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{currentUser?.name || 'Tutor'}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || 'tutor@amistaap.edu'}</p>
              </div>
            </div>
            <button
              className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 rounded-lg border border-red-100 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="reports" element={<ReportsList />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="activities" element={<ActivitiesList />} />
          <Route path="communication" element={<CommunicationHub />} />
          <Route path="profile" element={<ProfileTutor />} />
          <Route path="settings" element={<TutorSettings />} />
          <Route path="recursos/guia-tutores" element={<GuiaTutores />} />
          <Route path="recursos/estrategias-comunicacion" element={<EstrategiasComunicacion />} />
          <Route path="recursos" element={<RecursosHub />} />
          <Route path="*" element={<Navigate to="/tutor/dashboard" replace />} />
        </Routes>
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-20"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
