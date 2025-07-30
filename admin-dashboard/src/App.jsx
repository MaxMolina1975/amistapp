import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersTable from './pages/tables/UsersTable';
import TeachersTable from './pages/tables/TeachersTable';
import StudentsTable from './pages/tables/StudentsTable';
import TutorsTable from './pages/tables/TutorsTable';
import ReportsTable from './pages/tables/ReportsTable';
import RewardsTable from './pages/tables/RewardsTable';
import ActivitiesTable from './pages/tables/ActivitiesTable';
import AchievementsTable from './pages/tables/AchievementsTable';

// Context and hooks
import { useAuth } from './contexts/AuthContext';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Tema de la aplicación
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="tables">
            <Route path="users" element={<UsersTable />} />
            <Route path="teachers" element={<TeachersTable />} />
            <Route path="students" element={<StudentsTable />} />
            <Route path="tutors" element={<TutorsTable />} />
            <Route path="reports" element={<ReportsTable />} />
            <Route path="rewards" element={<RewardsTable />} />
            <Route path="activities" element={<ActivitiesTable />} />
            <Route path="achievements" element={<AchievementsTable />} />
          </Route>
        </Route>
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;