import { Routes, Route } from 'react-router-dom';
import { RoleBasedRoute } from '../components/common/RoleBasedRoute';

// Componentes de estudiantes
import { StudentRewards } from './student/rewards/StudentRewards';
import { StudentReport } from './student/reports/StudentReport';

// Componentes de docentes
import { TeacherRewardsManagement } from './teacher/rewards/TeacherRewardsManagement';
import { TeacherReportManagement } from './teacher/reports/TeacherReportManagement';
import { BullyingReportsManagement } from './teacher/reports/BullyingReportsManagement';
import { EnhancedTeacherReports } from './teacher/reports/EnhancedTeacherReports';

/**
 * Componente que configura las rutas diferenciadas según el rol del usuario
 * para los paneles de Premios y Reportes
 */
export function RoleBasedRoutes() {
  return (
    <Routes>
      {/* Rutas para el panel de Premios */}
      <Route 
        path="/rewards" 
        element={
          <RoleBasedRoute 
            studentComponent={StudentRewards}
            teacherComponent={TeacherRewardsManagement}
          />
        } 
      />

      {/* Rutas para el panel de Reportes */}
      <Route 
        path="/report" 
        element={
          <RoleBasedRoute 
            studentComponent={StudentReport}
            teacherComponent={TeacherReportManagement}
          />
        } 
      />

      {/* Rutas específicas para docentes */}
      <Route path="/teacher/rewards/*" element={<TeacherRewardsManagement />} />
      <Route path="/teacher/reports" element={<EnhancedTeacherReports />} />
      <Route path="/teacher/reports/all" element={<TeacherReportManagement />} />

      {/* Rutas específicas para estudiantes */}
      <Route path="/student/rewards" element={<StudentRewards />} />
      <Route path="/student/report" element={<StudentReport />} />
    </Routes>
  );
}