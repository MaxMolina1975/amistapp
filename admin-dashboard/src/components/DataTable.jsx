import React, { useState } from 'react';
import {
  DataGrid, GridToolbar, GridActionsCellItem,
  GridRowModes, GridRowEditStopReasons
} from '@mui/x-data-grid';
import {
  Box, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, Snackbar, Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  Add as AddIcon
} from '@mui/icons-material';

function DataTable({
  rows,
  columns,
  loading,
  onSave,
  onDelete,
  onCreate,
  title
}) {
  const [rowModesModel, setRowModesModel] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(rowToDelete);
      setSnackbar({ children: 'Registro eliminado correctamente', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSnackbar({ children: `Error al eliminar: ${error.message}`, severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const processRowUpdate = async (newRow) => {
    try {
      const updatedRow = await onSave(newRow);
      setSnackbar({ children: 'Registro guardado correctamente', severity: 'success' });
      return updatedRow;
    } catch (error) {
      console.error('Error al guardar:', error);
      setSnackbar({ children: `Error al guardar: ${error.message}`, severity: 'error' });
      throw error;
    }
  };

  const handleProcessRowUpdateError = (error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  };

  const handleAddNewRow = () => {
    if (onCreate) {
      onCreate();
    }
  };

  // Agregar columna de acciones a las columnas existentes
  const columnsWithActions = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Guardar"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewRow}
        >
          Agregar
        </Button>
      </Box>
      
      <DataGrid
        rows={rows}
        columns={columnsWithActions}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
      />
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para mostrar mensajes */}
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.children}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default DataTable;