import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { rewardsService } from '../../services/api';
import { toast } from 'react-toastify';

function RewardsTable() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await rewardsService.getAll();
      setRewards(response.data);
    } catch (error) {
      console.error('Error al cargar recompensas:', error);
      toast.error('Error al cargar la lista de recompensas');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReward = async (reward) => {
    try {
      let response;
      if (reward.id) {
        // Actualizar recompensa existente
        response = await rewardsService.update(reward.id, reward);
        setRewards(rewards.map(r => r.id === reward.id ? response.data : r));
      } else {
        // Crear nueva recompensa
        response = await rewardsService.create(reward);
        setRewards([...rewards, response.data]);
      }
      toast.success('Recompensa guardada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar recompensa:', error);
      toast.error(`Error al guardar recompensa: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteReward = async (id) => {
    try {
      await rewardsService.delete(id);
      setRewards(rewards.filter(reward => reward.id !== id));
      toast.success('Recompensa eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar recompensa:', error);
      toast.error(`Error al eliminar recompensa: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateReward = () => {
    // Crear una nueva recompensa con valores predeterminados
    const newReward = {
      id: 'new-' + Date.now(), // ID temporal
      name: '',
      description: '',
      points_required: 0,
      image_url: '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setRewards([...rewards, newReward]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nombre', width: 200, editable: true },
    { field: 'description', headerName: 'Descripción', width: 300, editable: true },
    { 
      field: 'points_required', 
      headerName: 'Puntos requeridos', 
      width: 150, 
      editable: true,
      type: 'number'
    },
    { field: 'image_url', headerName: 'URL de imagen', width: 200, editable: true },
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
        Gestión de Recompensas
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todas las recompensas del sistema. Puedes crear, editar y eliminar recompensas.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={rewards}
            columns={columns}
            loading={loading}
            onSave={handleSaveReward}
            onDelete={handleDeleteReward}
            onCreate={handleCreateReward}
          />
        )}
      </Paper>
    </>
  );
}

export default RewardsTable;