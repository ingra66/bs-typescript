import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Grid,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import categoryService from '../../services/categoryService';
import type { Category, CategoryStatistics } from '../../services/categoryService';
import CategoryForm from '../../components/admin/CategoryForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AlertModal from '../../components/ui/AlertModal';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [statistics, setStatistics] = useState<CategoryStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [orderBy, setOrderBy] = useState('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  
  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Estados de acciones
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showStatusErrorAlert, setShowStatusErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page + 1,
        per_page: rowsPerPage,
        search: search || undefined,
        active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
        order_by: orderBy,
        order_direction: orderDirection,
      };

      const [categoriesResponse, statsResponse] = await Promise.all([
        categoryService.getCategories(params),
        categoryService.getStatistics(),
      ]);

      setCategories(categoriesResponse.data);
      setTotal(categoriesResponse.pagination?.total || 0);
      setStatistics(statsResponse.data);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      setError(err.response?.data?.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, search, statusFilter, orderBy, orderDirection]);

  // Manejar cambio de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Abrir formulario para crear
  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  // Abrir formulario para editar
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  // Manejar éxito del formulario
  const handleFormSuccess = () => {
    handleCloseForm();
    loadData();
  };

  // Eliminar categoría
  const handleDelete = async (category: Category) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
      return;
    }

    try {
      setActionLoading(category.id);
      await categoryService.deleteCategory(category.id);
      loadData();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar la categoría';
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
    } finally {
      setActionLoading(null);
    }
  };

  // Cambiar estado de categoría
  const handleToggleStatus = async (category: Category) => {
    try {
      setActionLoading(category.id);
      await categoryService.toggleStatus(category.id);
      loadData();
    } catch (err: any) {
      console.error('Error toggling category status:', err);
      setShowStatusErrorAlert(true);
    } finally {
      setActionLoading(null);
    }
  };

  // Obtener URL de imagen
  const getImageUrl = (imagePath?: string) => {
    return categoryService.getImageUrl(imagePath);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner message="Cargando categorías..." />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Administrar Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nueva Categoría
        </Button>
      </Box>

      {/* Estadísticas */}
      {statistics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Categorías
                </Typography>
                <Typography variant="h4">
                  {statistics.total_categories}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Categorías Activas
                </Typography>
                <Typography variant="h4" color="success.main">
                  {statistics.active_categories}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Con Productos
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {statistics.categories_with_products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Sin Productos
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {statistics.categories_without_products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="Buscar categorías"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Activos</MenuItem>
              <MenuItem value="inactive">Inactivos</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={orderBy}
              label="Ordenar por"
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <MenuItem value="name">Nombre</MenuItem>
              <MenuItem value="created_at">Fecha de creación</MenuItem>
              <MenuItem value="products_count">Cantidad de productos</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc')}
            size="small"
          >
            {orderDirection === 'asc' ? '↑' : '↓'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            size="small"
          >
            Actualizar
          </Button>
        </Box>
      </Paper>

      {/* Tabla */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {category.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {category.description || 'Sin descripción'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${category.products_count || 0} productos`}
                      color={category.products_count && category.products_count > 0 ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.is_active ? 'Activo' : 'Inactivo'}
                      color={category.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(category.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(category)}
                          disabled={actionLoading === category.id}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={category.is_active ? 'Desactivar' : 'Activar'}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(category)}
                            disabled={actionLoading === category.id}
                            color={category.is_active ? 'warning' : 'success'}
                          >
                            <Switch
                              checked={category.is_active}
                              size="small"
                              disabled={actionLoading === category.id}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                      
                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(category)}
                            disabled={actionLoading === category.id || (category.products_count || 0) > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Formulario */}
      <Dialog
        open={showForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <CategoryForm
            category={editingCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <AlertModal
        isOpen={showErrorAlert}
        title="Error"
        message={errorMessage}
        confirmText="Aceptar"
        onConfirm={() => setShowErrorAlert(false)}
        onCancel={() => setShowErrorAlert(false)}
      />
      
      <AlertModal
        isOpen={showStatusErrorAlert}
        title="Error"
        message="Error al cambiar el estado de la categoría"
        confirmText="Aceptar"
        onConfirm={() => setShowStatusErrorAlert(false)}
        onCancel={() => setShowStatusErrorAlert(false)}
      />
    </Box>
  );
} 