import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { activitiesService } from '../../services/api';
import { toast } from 'react-toastify';

function ActivitiesTable() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activitiesService.getAll();
      setActivities(response.data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      toast.error('Error al cargar la lista de actividades');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActivity = async (activity) => {
    try {
      let response;
      if (activity.id) {
        // Actualizar actividad existente
        response = await activitiesService.update(activity.id, activity);
        setActivities(activities.map(a => a.id === activity.id ? response.data : a));
      } else {
        // Crear nueva actividad
        response = await activitiesService.create(activity);
        setActivities([...activities, response.data]);
      }
      toast.success('Actividad guardada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      toast.error(`Error al guardar actividad: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await activitiesService.delete(id);
      setActivities(activities.filter(activity => activity.id !== id));
      toast.success('Actividad eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      toast.error(`Error al eliminar actividad: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateActivity = () => {
    // Crear una nueva actividad con valores predeterminados
    const newActivity = {
      id: 'new-' + Date.now(), // ID temporal
      name: '',
      description: '',
      points: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setActivities([...activities, newActivity]);
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
        Gestión de Actividades
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todas las actividades del sistema. Puedes crear, editar y eliminar actividades.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={activities}
            columns={columns}
            loading={loading}
            onSave={handleSaveActivity}
            onDelete={handleDeleteActivity}
            onCreate={handleCreateActivity}
          />
        )}
      </Paper>
    </>
  );
}

export default ActivitiesTable;