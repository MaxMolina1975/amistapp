import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, CardHeader, 
  CircularProgress, Box, Paper, Divider 
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Report as ReportIcon,
  EmojiEvents as RewardsIcon,
  Event as ActivityIcon
} from '@mui/icons-material';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar las estadísticas del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#fff9f9' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  // Si no hay datos reales todavía, mostrar datos de ejemplo
  const dashboardData = stats || {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalTutors: 0,
    totalReports: 0,
    pendingReports: 0,
    totalRewards: 0,
    totalActivities: 0
  };

  const statCards = [
    { 
      title: 'Usuarios', 
      value: dashboardData.totalUsers, 
      icon: <PeopleIcon fontSize="large" color="primary" />,
      details: [
        { label: 'Profesores', value: dashboardData.totalTeachers },
        { label: 'Estudiantes', value: dashboardData.totalStudents },
        { label: 'Tutores', value: dashboardData.totalTutors }
      ]
    },
    { 
      title: 'Reportes', 
      value: dashboardData.totalReports, 
      icon: <ReportIcon fontSize="large" color="error" />,
      details: [
        { label: 'Pendientes', value: dashboardData.pendingReports },
        { label: 'Resueltos', value: dashboardData.totalReports - dashboardData.pendingReports }
      ]
    },
    { 
      title: 'Actividades', 
      value: dashboardData.totalActivities, 
      icon: <ActivityIcon fontSize="large" color="success" />,
      details: [
        { label: 'Total', value: dashboardData.totalActivities }
      ]
    },
    { 
      title: 'Premios', 
      value: dashboardData.totalRewards, 
      icon: <RewardsIcon fontSize="large" color="warning" />,
      details: [
        { label: 'Total', value: dashboardData.totalRewards }
      ]
    }
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Bienvenido al panel de administración de AmistApp. Aquí puedes ver un resumen de la información del sistema.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="dashboard-card">
              <CardHeader
                avatar={card.icon}
                title={card.title}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent className="dashboard-card-content">
                <Typography variant="h3" component="div" align="center" sx={{ mb: 2 }}>
                  {card.value}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                {card.details.map((detail, idx) => (
                  <Box key={idx} display="flex" justifyContent="space-between" sx={{ my: 0.5 }}>
                    <Typography variant="body2" color="textSecondary">
                      {detail.label}:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {detail.value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Dashboard;