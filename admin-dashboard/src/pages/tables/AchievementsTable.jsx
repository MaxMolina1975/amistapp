import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { achievementsService } from '../../services/api';
import { toast } from 'react-toastify';

function AchievementsTable() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementsService.getAll();
      setAchievements(response.data);
    } catch (error) {
      console.error('Error al cargar logros:', error);
      toast.error('Error al cargar la lista de logros');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAchievement = async (achievement) => {
    try {
      let response;
      if (achievement.id) {
        // Actualizar logro existente
        response = await achievementsService.update(achievement.id, achievement);
        setAchievements(achievements.map(a => a.id === achievement.id ? response.data : a));
      } else {
        // Crear nuevo logro
        response = await achievementsService.create(achievement);
        setAchievements([...achievements, response.data]);
      }
      toast.success('Logro guardado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar logro:', error);
      toast.error(`Error al guardar logro: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteAchievement = async (id) => {
    try {
      await achievementsService.delete(id);
      setAchievements(achievements.filter(achievement => achievement.id !== id));
      toast.success('Logro eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar logro:', error);
      toast.error(`Error al eliminar logro: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateAchievement = () => {
    // Crear un nuevo logro con valores predeterminados
    const newAchievement = {
      id: 'new-' + Date.now(), // ID temporal
      name: '',
      description: '',
      points: 0,
      requirements: '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setAchievements([...achievements, newAchievement]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nombre', width: 200, editable: true },
    { field: 'description', headerName: 'Descripción', width: 300, editable: true },
    { 
      field: 'points', 
      headerName: 'Puntos', 
      width: 120, 
      editable: true,
      type: 'number'
    },
    { 
      field: 'requirements', 
      headerName: 'Requisitos', 
      width: 250, 
      editable: true 
    },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 120, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['active', 'inactive']
    },
    { 
      field: 'created_at', 
      headerName: 'Fecha de creación', 
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleString();
      }
    },
    { 
      field: 'updated_at', 
      headerName: 'Última actualización', 
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleString();
      }
    },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Gestión de Logros
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todos los logros del sistema. Puedes crear, editar y eliminar logros.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={achievements}
            columns={columns}
            loading={loading}
            onSave={handleSaveAchievement}
            onDelete={handleDeleteAchievement}
            onCreate={handleCreateAchievement}
          />
        )}
      </Paper>
    </>
  );
}

export default AchievementsTable;