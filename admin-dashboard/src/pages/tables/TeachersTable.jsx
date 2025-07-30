import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { teachersService } from '../../services/api';
import { toast } from 'react-toastify';

function TeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teachersService.getAll();
      setTeachers(response.data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
      toast.error('Error al cargar la lista de docentes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTeacher = async (teacher) => {
    try {
      let response;
      if (teacher.id) {
        // Actualizar docente existente
        response = await teachersService.update(teacher.id, teacher);
        setTeachers(teachers.map(t => t.id === teacher.id ? response.data : t));
      } else {
        // Crear nuevo docente
        response = await teachersService.create(teacher);
        setTeachers([...teachers, response.data]);
      }
      toast.success('Docente guardado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar docente:', error);
      toast.error(`Error al guardar docente: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await teachersService.delete(id);
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      toast.success('Docente eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar docente:', error);
      toast.error(`Error al eliminar docente: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateTeacher = () => {
    // Crear un nuevo docente con valores predeterminados
    const newTeacher = {
      id: 'new-' + Date.now(), // ID temporal
      name: '',
      email: '',
      school: '',
      subject: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setTeachers([...teachers, newTeacher]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nombre', width: 200, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'school', headerName: 'Escuela', width: 200, editable: true },
    { field: 'subject', headerName: 'Asignatura', width: 150, editable: true },
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
        Gestión de Docentes
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todos los docentes del sistema. Puedes crear, editar y eliminar docentes.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={teachers}
            columns={columns}
            loading={loading}
            onSave={handleSaveTeacher}
            onDelete={handleDeleteTeacher}
            onCreate={handleCreateTeacher}
          />
        )}
      </Paper>
    </>
  );
}

export default TeachersTable;