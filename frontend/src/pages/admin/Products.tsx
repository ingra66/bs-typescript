import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Pagination,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import productService from '../../services/productService';
import type { Product, ProductFilters, Category } from '../../services/productService';
import categoryService from '../../services/categoryService';
import ProductForm from '../../components/admin/ProductForm';
import ProductImageDisplay from '../../components/admin/ProductImageDisplay';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorBoundary from '../../components/ui/ErrorBoundary';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    active: undefined,
    featured: undefined,
    in_stock: undefined,
    category_id: undefined,
    order_by: 'created_at',
    order_direction: 'desc',
    per_page: 10,
    page: 1,
  });

  // Estados para paginación
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Estados para el modal
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Cargar productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProducts(filters);
      
      if (response.success) {
        setProducts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Manejar cambios en filtros
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Resetear a primera página
    }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      active: undefined,
      featured: undefined,
      in_stock: undefined,
      category_id: undefined,
      order_by: 'created_at',
      order_direction: 'desc',
      per_page: 10,
      page: 1,
    });
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setSuccess('Producto eliminado exitosamente');
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error('Error deleting product:', err);
    }
  };

  // Manejar creación/edición exitosa
  const handleFormSuccess = () => {
    setOpenModal(false);
    setEditingProduct(null);
    setSuccess('Producto guardado exitosamente');
    loadProducts();
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  // Obtener nombre de categoría
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  // Obtener estado del stock
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sin stock', color: 'error' as const };
    if (stock <= 5) return { label: 'Stock bajo', color: 'warning' as const };
    return { label: 'En stock', color: 'success' as const };
  };

  return (
    <ErrorBoundary>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Productos
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestiona tu catálogo de productos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Agregar Producto
          </Button>
        </Box>

        {/* Alertas */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(6, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filters.category_id || ''}
                  label="Categoría"
                  onChange={(e) => handleFilterChange('category_id', e.target.value || undefined)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.active === undefined ? '' : filters.active.toString()}
                  label="Estado"
                  onChange={(e) => handleFilterChange('active', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Activo</MenuItem>
                  <MenuItem value="false">Inactivo</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Stock</InputLabel>
                <Select
                  value={filters.in_stock === undefined ? '' : filters.in_stock.toString()}
                  label="Stock"
                  onChange={(e) => handleFilterChange('in_stock', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">En stock</MenuItem>
                  <MenuItem value="false">Sin stock</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filters.order_by}
                  label="Ordenar por"
                  onChange={(e) => handleFilterChange('order_by', e.target.value)}
                >
                  <MenuItem value="created_at">Fecha</MenuItem>
                  <MenuItem value="name">Nombre</MenuItem>
                  <MenuItem value="price">Precio</MenuItem>
                  <MenuItem value="stock">Stock</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                fullWidth
              >
                Limpiar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Tabla de Productos */}
        <Card>
          <CardContent>
            {loading ? (
              <LoadingSpinner message="Cargando productos..." />
            ) : products.length === 0 ? (
              <EmptyState
                title="No hay productos"
                description="Aún no has creado ningún producto. Comienza agregando tu primer producto al catálogo."
                actionLabel="Crear primer producto"
                onAction={handleCreate}
                icon={<InventoryIcon sx={{ fontSize: 64 }} />}
              />
            ) : (
              <>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Destacado</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => {
                        const stockStatus = getStockStatus(product.stock);
                        return (
                          <TableRow key={product.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ProductImageDisplay
                                  images={product.images || []}
                                  productName={product.name}
                                  showThumbnails={false}
                                  size="small"
                                />
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {product.name}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    SKU: {product.sku}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{getCategoryName(product.category_id)}</TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || '0').toFixed(2)}
                                </Typography>
                                {product.compare_price && parseFloat(product.compare_price.toString()) > parseFloat(product.price.toString()) && (
                                  <Typography variant="caption" color="error">
                                    ${typeof product.compare_price === 'number' ? product.compare_price.toFixed(2) : parseFloat(product.compare_price || '0').toFixed(2)}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={stockStatus.label}
                                size="small"
                                color={stockStatus.color}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={product.is_active ? 'Activo' : 'Inactivo'}
                                size="small"
                                color={product.is_active ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={product.is_featured ? 'Destacado' : 'Normal'}
                                size="small"
                                color={product.is_featured ? 'warning' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Ver detalles">
                                  <IconButton size="small" color="primary">
                                    <ViewIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar">
                                  <IconButton 
                                    size="small" 
                                    color="secondary"
                                    onClick={() => handleEdit(product)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setDeleteConfirm(product.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Paginación */}
                {pagination.last_page > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={pagination.last_page}
                      page={pagination.current_page}
                      onChange={(_, page) => handleFilterChange('page', page)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal de Formulario */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingProduct ? 'Editar Producto' : 'Crear Producto'}
          </DialogTitle>
          <DialogContent>
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSuccess={handleFormSuccess}
              onCancel={() => setOpenModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmación de Eliminación */}
        <Dialog
          open={deleteConfirm !== null}
          onClose={() => setDeleteConfirm(null)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
} 