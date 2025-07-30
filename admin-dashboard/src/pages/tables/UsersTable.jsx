import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import DataTable from '../../components/DataTable';
import { usersService } from '../../services/api';
import { toast } from 'react-toastify';

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (user) => {
    try {
      let response;
      if (user.id) {
        // Actualizar usuario existente
        response = await usersService.update(user.id, user);
        setUsers(users.map(u => u.id === user.id ? response.data : u));
      } else {
        // Crear nuevo usuario
        response = await usersService.create(user);
        setUsers([...users, response.data]);
      }
      toast.success('Usuario guardado correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error(`Error al guardar usuario: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await usersService.delete(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error(`Error al eliminar usuario: ${error.response?.data?.error || error.message}`);
      throw error;
    }
  };

  const handleCreateUser = () => {
    // Crear un nuevo usuario con valores predeterminados
    const newUser = {
      id: 'new-' + Date.now(), // ID temporal
      email: '',
      name: '',
      role: 'teacher', // Valor predeterminado
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isNew: true // Marcar como nuevo para el procesamiento
    };
    setUsers([...users, newUser]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'name', headerName: 'Nombre', width: 200, editable: true },
    { 
      field: 'role', 
      headerName: 'Rol', 
      width: 150, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'teacher', 'student', 'tutor']
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
        Gestión de Usuarios
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Administra todos los usuarios del sistema. Puedes crear, editar y eliminar usuarios.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={users}
            columns={columns}
            loading={loading}
            onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            onCreate={handleCreateUser}
          />
        )}
      </Paper>
    </>
  );
}

export default UsersTable;