import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { tutorsService } from '../../services/api';
import { toast } from 'react-toastify';

function TutorsTable() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await tutorsService.getAll();
      setTutors(response.data);
    } catch (error) {
      console.error('Error al cargar tutores:', error);
      toast.error('Error al cargar la lista de tutores');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTutor = async (tutor) => {
    try {
      let response;
      if (tutor.id) {
        // Actualizar tutor existente
        response = await tutorsService.update(tutor.id, tutor);
        setTutors(tutors.map(t => t.id === tutor.id ? response.data : t));
      } else {
        // Crear nuevo tutor
        response = await tutorsService.create(tutor);
        setTutors([...tutors, response.data]);
      }
      toast.success('Tutor guardado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar tutor:', error);
      toast.error(`Error al guardar tutor: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteTutor = async (id) => {
    try {
      await tutorsService.delete(id);
      setTutors(tutors.filter(tutor => tutor.id !== id));
      toast.success('Tutor eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar tutor:', error);
      toast.error(`Error al eliminar tutor: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateTutor = () => {
    // Crear un nuevo tutor con valores predeterminados
    const newTutor = {
      id: 'new-' + Date.now(), // ID temporal
      name: '',
      email: '',
      phone: '',
      relationship: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setTutors([...tutors, newTutor]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nombre', width: 200, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'phone', headerName: 'Teléfono', width: 150, editable: true },
    { 
      field: 'relationship', 
      headerName: 'Parentesco', 
      width: 150, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Padre', 'Madre', 'Abuelo/a', 'Tío/a', 'Hermano/a', 'Otro']
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
        Gestión de Tutores
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todos los tutores del sistema. Puedes crear, editar y eliminar tutores.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={tutors}
            columns={columns}
            loading={loading}
            onSave={handleSaveTutor}
            onDelete={handleDeleteTutor}
            onCreate={handleCreateTutor}
          />
        )}
      </Paper>
    </>
  );
}

export default TutorsTable;