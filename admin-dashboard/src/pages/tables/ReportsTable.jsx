import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { reportsService } from '../../services/api';
import { toast } from 'react-toastify';

function ReportsTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsService.getAll();
      setReports(response.data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      toast.error('Error al cargar la lista de reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async (report) => {
    try {
      let response;
      if (report.id) {
        // Actualizar reporte existente
        response = await reportsService.update(report.id, report);
        setReports(reports.map(r => r.id === report.id ? response.data : r));
      } else {
        // Crear nuevo reporte
        response = await reportsService.create(report);
        setReports([...reports, response.data]);
      }
      toast.success('Reporte guardado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar reporte:', error);
      toast.error(`Error al guardar reporte: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await reportsService.delete(id);
      setReports(reports.filter(report => report.id !== id));
      toast.success('Reporte eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      toast.error(`Error al eliminar reporte: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateReport = () => {
    // Crear un nuevo reporte con valores predeterminados
    const newReport = {
      id: 'new-' + Date.now(), // ID temporal
      student_id: '',
      teacher_id: '',
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setReports([...reports, newReport]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'student_id', headerName: 'ID Estudiante', width: 120, editable: true },
    { field: 'teacher_id', headerName: 'ID Docente', width: 120, editable: true },
    { field: 'title', headerName: 'Título', width: 200, editable: true },
    { field: 'description', headerName: 'Descripción', width: 300, editable: true },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 120, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['pending', 'in_progress', 'resolved', 'closed']
    },
    { 
      field: 'priority', 
      headerName: 'Prioridad', 
      width: 120, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['low', 'medium', 'high', 'urgent']
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
        Gestión de Reportes
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todos los reportes del sistema. Puedes crear, editar y eliminar reportes.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={reports}
            columns={columns}
            loading={loading}
            onSave={handleSaveReport}
            onDelete={handleDeleteReport}
            onCreate={handleCreateReport}
          />
        )}
      </Paper>
    </>
  );
}

export default ReportsTable;