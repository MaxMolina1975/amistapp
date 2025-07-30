import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { studentsService } from '../../services/api';
import { toast } from 'react-toastify';

function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsService.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      toast.error('Error al cargar la lista de estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStudent = async (student) => {
    try {
      let response;
      if (student.id) {
        // Actualizar estudiante existente
        response = await studentsService.update(student.id, student);
        setStudents(students.map(s => s.id === student.id ? response.data : s));
      } else {
        // Crear nuevo estudiante
        response = await studentsService.create(student);
        setStudents([...students, response.data]);
      }
      toast.success('Estudiante guardado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      toast.error(`Error al guardar estudiante: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await studentsService.delete(id);
      setStudents(students.filter(student => student.id !== id));
      toast.success('Estudiante eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      toast.error(`Error al eliminar estudiante: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateStudent = () => {
    // Crear un nuevo estudiante con valores predeterminados
    const newStudent = {
      id: 'new-' + Date.now(), // ID temporal
      name: '',
      email: '',
      grade: '',
      school: '',
      tutor_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setStudents([...students, newStudent]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nombre', width: 200, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'grade', headerName: 'Grado', width: 120, editable: true },
    { field: 'school', headerName: 'Escuela', width: 200, editable: true },
    { field: 'tutor_id', headerName: 'ID Tutor', width: 120, editable: true },
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
        Gestión de Estudiantes
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todos los estudiantes del sistema. Puedes crear, editar y eliminar estudiantes.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={students}
            columns={columns}
            loading={loading}
            onSave={handleSaveStudent}
            onDelete={handleDeleteStudent}
            onCreate={handleCreateStudent}
          />
        )}
      </Paper>
    </>
  );
}

export default StudentsTable;