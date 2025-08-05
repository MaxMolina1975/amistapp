import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Emotions } from './pages/Emotions';
import { EmotionsReference } from './pages/EmotionsReference';
import { Rewards } from './pages/Rewards';
import { Report } from './pages/Report';
import { RoleBasedRoutes } from './pages/RoleBasedRoutes';
import { StudentRewards } from './pages/student/rewards/StudentRewards';
import { StudentReport } from './pages/student/reports/StudentReport';
import { TeacherRewardsManagement } from './pages/teacher/rewards/TeacherRewardsManagement';
import { TeacherReportManagement } from './pages/teacher/reports/TeacherReportManagement';
import { StudentPointsAssignment } from './pages/student/points/StudentPointsAssignment';
import { RoleBasedRoute } from './components/common/RoleBasedRoute';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { EstudianteDashboard } from './pages/estudiante/Dashboard';
import { Actividades } from './pages/estudiante/Actividades';
import { Companeros } from './pages/estudiante/Companeros';
import { Logros } from './pages/estudiante/Logros';
import { Calendario } from './pages/estudiante/Calendario';
import { Configuracion } from './pages/estudiante/Configuracion';
import { ProfileEstudiante } from './pages/estudiante/perfil/ProfileEstudiante';
import { ProfileDocente } from './pages/teacher/perfil/ProfileDocente';
import { ProfileTutor } from './pages/tutor/perfil/ProfileTutor';
import { TutorDashboard } from './pages/tutor/Dashboard';
import { CourseJoin } from './pages/CourseJoin';
import { SubscriptionRenewal } from './pages/SubscriptionRenewal';
import { ActiveSubscriptionPage } from './pages/subscription/ActiveSubscriptionPage';
import { ActivateSubscriptionPage } from './pages/subscription/ActivateSubscriptionPage';
import { EstudiantesHub } from './pages/tutor/estudiantes/EstudiantesHub';
import { PerfilEstudiante } from './pages/tutor/estudiantes/PerfilEstudiante';
import { VincularEstudiante } from './pages/tutor/estudiantes/VincularEstudiante';
import { ProgresoHub } from './pages/tutor/progreso/ProgresoHub';
import { ConfiguracionTutor } from './pages/tutor/configuracion/ConfiguracionTutor';
import { TutorRewardsInfo } from './pages/tutor/rewards/TutorRewardsInfo';
import { TutorReportsInfo } from './pages/tutor/reports/TutorReportsInfo';
import { AuthProvider } from './lib/context/AuthContext';
import { AlertProvider } from './components/AlertProvider';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { StudentRoute } from './components/auth/StudentRoute';
import { Login } from './pages/Login';
import { StudentLogin } from './pages/auth/StudentLogin';
import { TutorLogin } from './pages/auth/TutorLogin';
import { StudentRegister } from './pages/auth/StudentRegister';
import { AprendizajeEmocional, Monitoreo, Familia, Analisis, Ejercicios, Comunidad, RefuerzoPositivo, AntiBullying, ConvivenciaEducativa, ModeloEscuelaTotal } from './pages/promociones';
import { SocialEmotionalActionsPage as StudentSocialEmotionalActionsPage } from './pages/estudiante/resources/SocialEmotionalActionsPage';
import { Toaster } from 'react-hot-toast';
import { BottomNavigation } from './components/BottomNavigation';
import ServerTest from "./tools/ServerTest";
// import AuthDebugger from "./tools/AuthDebugger"; // Comenta o elimina esta línea
import { RewardsManagement } from "./pages/teacher/rewards/RewardsManagement";
import { PointsAssignment } from './pages/teacher/points/PointsAssignment';
import { StudentsManagement } from './pages/teacher/students/StudentsManagement';
import { StudentsHub } from './pages/teacher/students/StudentsHub';
import { AddStudent } from './pages/teacher/students/AddStudent';
import { EditStudent } from './pages/teacher/students/EditStudent';
import { CoursesManagement } from './pages/teacher/courses/CoursesManagement';
import { TeacherSettings } from './pages/teacher/settings/TeacherSettings';
import { EnhancedTeacherReports } from './pages/teacher/reports/EnhancedTeacherReports';
import { BullyingReportsManagement } from './pages/teacher/reports/BullyingReportsManagement';
import { RewardsHub } from './pages/teacher/rewards/RewardsHub';
import { SocialEmotionalActionsPage } from './pages/teacher/resources/SocialEmotionalActionsPage';
import { SocialEmotionalActionsPageEnhanced } from './pages/teacher/resources/SocialEmotionalActionsPageEnhanced';
import RecursosHub from './pages/tutor/recursos/RecursosHub';
import { GuiaTutores } from './pages/tutor/recursos/GuiaTutores';
import { EstrategiasComunicacion } from './pages/tutor/recursos/EstrategiasComunicacion';
// Importación del sistema de mensajería
import MensajesPage from './pages/mensajes';
import NotificationSettings from './pages/notifications/NotificationSettings';
import { registerServiceWorker } from './lib/utils/serviceWorkerRegistration';

// Registrar el service worker para las notificaciones
registerServiceWorker().then(registration => {
  console.log('Service Worker registrado correctamente:', registration);
}).catch(error => {
  console.error('Error al registrar el Service Worker:', error);
});

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <div className="pb-20 max-w-lg mx-auto">
              <Toaster position="top-center" />
              <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-estudiante" element={<StudentLogin />} />
              <Route path="/login-tutor" element={<TutorLogin />} />
              <Route path="/registro-estudiante" element={<StudentRegister />} />
              <Route path="/test-server" element={<ServerTest />} />
              {/* <Route path="/auth-debug" element={<AuthDebugger />} /> */}
              
              {/* Rutas promocionales públicas */}
              <Route path="/aprendizaje-emocional" element={<AprendizajeEmocional />} />
              <Route path="/monitoreo" element={<Monitoreo />} />
              <Route path="/familia" element={<Familia />} />
              <Route path="/analisis" element={<Analisis />} />
              <Route path="/ejercicios" element={<Ejercicios />} />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route path="/refuerzo-positivo" element={<RefuerzoPositivo />} />
              <Route path="/anti-bullying" element={<AntiBullying />} />
              <Route path="/convivencia-educativa" element={<ConvivenciaEducativa />} />
              <Route path="/modelo-escuela-total" element={<ModeloEscuelaTotal />} />

              {/* Ruta compartida de mensajería para todos los roles */}
              <Route
                path="/mensajes"
                element={
                  <RoleProtectedRoute allowedRoles={['student', 'teacher', 'tutor']}>
                    <MensajesPage />
                  </RoleProtectedRoute>
                }
              />

              {/* Rutas de perfil específicas por rol */}
              <Route
                path="/estudiante/perfil"
                element={
                  <StudentRoute>
                    <ProfileEstudiante />
                  </StudentRoute>
                }
              />

              <Route
                path="/teacher/perfil"
                element={
                  <RoleProtectedRoute allowedRoles={['teacher']}>
                    <ProfileDocente />
                  </RoleProtectedRoute>
                }
              />

              <Route
                path="/tutor/perfil"
                element={
                  <RoleProtectedRoute allowedRoles={['tutor']}>
                    <ProfileTutor />
                  </RoleProtectedRoute>
                }
              />

              {/* Rutas basadas en roles para Premios y Reportes */}
              <Route
                path="/rewards"
                element={
                  <RoleProtectedRoute allowedRoles={['student', 'teacher', 'tutor']}>
                    <RoleBasedRoute 
                      studentComponent={StudentRewards}
                      teacherComponent={TeacherRewardsManagement}
                      tutorComponent={TutorRewardsInfo}
                    />
                  </RoleProtectedRoute>
                }
              />

              <Route
                path="/report"
                element={
                  <RoleProtectedRoute allowedRoles={['student', 'teacher', 'tutor']}>
                    <RoleBasedRoute 
                      studentComponent={StudentReport}
                      teacherComponent={TeacherReportManagement}
                      tutorComponent={TutorReportsInfo}
                    />
                  </RoleProtectedRoute>
                }
              />

              <Route
                path="/emotions"
                element={
                  <RoleProtectedRoute allowedRoles={['student', 'teacher', 'tutor']}>
                    <RoleBasedRoute 
                      studentComponent={Emotions}
                      teacherComponent={EmotionsReference}
                      tutorComponent={EmotionsReference}
                    />
                  </RoleProtectedRoute>
                }
              />

              {/* Panel de Estudiante */}
              <Route
                path="/estudiante/*"
                element={
                  <StudentRoute>
                    <Routes>
                      <Route path="dashboard" element={<EstudianteDashboard />} />
                      <Route path="actividades" element={<Actividades />} />
                      <Route path="compañeros" element={<Companeros />} />
                      <Route path="logros" element={<Logros />} />
                      <Route path="calendario" element={<Calendario />} />
                      <Route path="configuracion" element={<Configuracion />} />
                      <Route path="points" element={<StudentPointsAssignment />} />
                      <Route path="mensajes" element={<MensajesPage />} />
                      <Route path="resources/social-emotional-actions" element={<StudentSocialEmotionalActionsPage />} />
                      <Route path="*" element={<EstudianteDashboard />} /> {/* Ruta de respaldo */}
                    </Routes>
                  </StudentRoute>
                }
              />
              
              {/* Ruta alternativa para compatibilidad con /student/points */}
              <Route
                path="/student/*"
                element={
                  <StudentRoute>
                    <Routes>
                      <Route path="points" element={<StudentPointsAssignment />} />
                      <Route path="*" element={<Navigate to="/estudiante/dashboard" />} />
                    </Routes>
                  </StudentRoute>
                }
              />

              {/* Panel de Docente */}
              <Route
                path="/teacher/*"
                element={
                  <RoleProtectedRoute allowedRoles={['teacher']}>
                    <Routes>
                      <Route path="dashboard" element={<TeacherDashboard />} />
                      <Route path="courses" element={<CoursesManagement />} />
                      <Route path="students" element={<StudentsHub />} />
                      <Route path="students/management" element={<StudentsManagement />} />
                      <Route path="students/add" element={<AddStudent />} />
                      <Route path="students/edit/:id" element={<EditStudent />} />
                      <Route path="reports" element={<EnhancedTeacherReports />} />
                      <Route path="reports/bullying" element={<BullyingReportsManagement />} />
                      <Route path="reports/enhanced" element={<TeacherReportManagement />} />
                      <Route path="rewards" element={<RewardsManagement />} />
                      <Route path="rewards/hub" element={<RewardsHub />} />
                      <Route path="points" element={<PointsAssignment />} />
                      <Route path="resources/social-emotional-actions" element={<SocialEmotionalActionsPageEnhanced />} />
                      <Route path="settings" element={<TeacherSettings />} />
                      <Route path="subscription" element={<ActiveSubscriptionPage />} />
                      <Route path="mensajes" element={<MensajesPage />} />
                    </Routes>
                  </RoleProtectedRoute>
                }
              />

              {/* Panel de Tutor */}
              <Route
                path="/tutor/*"
                element={
                  <RoleProtectedRoute allowedRoles={['tutor']}>
                    <Routes>
                      <Route path="dashboard" element={<TutorDashboard />} />
                      <Route path="estudiantes" element={<EstudiantesHub />} />
                      <Route path="estudiantes/perfil/:id" element={<PerfilEstudiante />} />
                      <Route path="estudiantes/vincular" element={<VincularEstudiante />} />
                      <Route path="progreso" element={<ProgresoHub />} />
                      <Route path="configuracion" element={<ConfiguracionTutor />} />
                      <Route path="settings" element={<Navigate to="/tutor/configuracion" replace />} />
                      <Route path="subscription" element={<ActiveSubscriptionPage />} />
                      <Route path="mensajes" element={<MensajesPage />} />
                      {/* <Route path="resources/social-emotional-actions" element={<StudentSocialEmotionalActionsPage />} /> */}
                      {/* The above line was removed as tutors might have their own specific page or this was an error. If tutors need access to student resources, it should be explicitly defined. */}
                      <Route path="recursos" element={<RecursosHub />} />
                      <Route path="recursos/guia-tutores" element={<GuiaTutores />} />
                      <Route path="recursos/estrategias-comunicacion" element={<EstrategiasComunicacion />} />
                      <Route path="rewards" element={<TutorRewardsInfo />} />
                      <Route path="reports" element={<TutorReportsInfo />} />
                    </Routes>
                  </RoleProtectedRoute>
                }
              />

              {/* Rutas de Suscripción */}
              <Route
                path="/subscription/*"
                element={
                  <RoleProtectedRoute allowedRoles={['teacher', 'tutor']}>
                    <Routes>
                      <Route path="active" element={<ActiveSubscriptionPage />} />
                      <Route path="renewal" element={<SubscriptionRenewal />} />
                      <Route path="activate" element={<ActivateSubscriptionPage />} />
                    </Routes>
                  </RoleProtectedRoute>
                }
              />

              {/* Ruta para unirse a un curso */}
              <Route
                path="/join"
                element={
                  <RoleProtectedRoute allowedRoles={['student']}>
                    <CourseJoin />
                  </RoleProtectedRoute>
                }
              />
              </Routes>
            </div>
            {/* Fixed position for bottom navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-40">
              <BottomNavigation />
            </div>
          </div>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;