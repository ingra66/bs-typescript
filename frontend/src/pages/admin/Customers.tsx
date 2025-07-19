import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert as MuiAlert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import userService from '../../services/userService';
import type { User } from '../../services/userService';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (value: any): string => {
  const numValue = Number(value);
  return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
};

export default function AdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminFilter, setAdminFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

  // Estadísticas
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    verifiedUsers: 0,
    adminUsers: 0,
    usersWithOrders: 0,
  });

  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [userStatsError, setUserStatsError] = useState<string | null>(null);
  
  // Wishlist
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [userWishlist, setUserWishlist] = useState<any[]>([]);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  // Refs para manejar el foco
  const statsModalRef = useRef<HTMLDivElement>(null);
  const wishlistModalRef = useRef<HTMLDivElement>(null);
  const viewWishlistButtonRef = useRef<HTMLButtonElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', password_confirmation: '', is_admin: false });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', password_confirmation: '', is_admin: false });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Cargando usuarios...');
      const response = await userService.getAdminUsers({ per_page: 1000 });
      console.log('✅ Usuarios cargados:', response);
      
      if (response.success) {
        setUsers(response.data);
        console.log('📊 Usuarios cargados:', response.data.length);
      } else {
        setError('Error al cargar los usuarios');
        console.error('❌ Error en la respuesta:', response);
      }
    } catch (err: any) {
      setError(`Error al cargar los usuarios: ${err.message}`);
      console.error('❌ Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await userService.getUsersStatistics();
      if (response.success) {
        setStats({
          totalUsers: response.data.total_users,
          newUsersThisMonth: response.data.new_users_this_month,
          verifiedUsers: response.data.verified_users,
          adminUsers: response.data.admin_users,
          usersWithOrders: response.data.users_with_orders,
        });
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAdmin = adminFilter === 'all' || 
      (adminFilter === 'admin' && user.is_admin) ||
      (adminFilter === 'customer' && !user.is_admin);
    
    const matchesVerified = verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && user.email_verified_at) ||
      (verifiedFilter === 'unverified' && !user.email_verified_at);
    
    return matchesSearch && matchesAdmin && matchesVerified;
  });

  const handleViewUser = (user: User) => {
    setSelectedUserForView(user);
    setViewDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      is_admin: user.is_admin,
    });
    setEditError(null);
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateUser = () => {
    setCreateForm({ name: '', email: '', password: '', password_confirmation: '', is_admin: false });
    setCreateError(null);
    setCreateDialogOpen(true);
  };

  const handleCreateSave = async () => {
    // Validación básica
    if (!createForm.name.trim()) {
      setCreateError('El nombre es requerido');
      return;
    }
    
    if (!createForm.email.trim()) {
      setCreateError('El email es requerido');
      return;
    }
    
    if (!createForm.password) {
      setCreateError('La contraseña es requerida');
      return;
    }
    
    if (createForm.password.length < 8) {
      setCreateError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (createForm.password !== createForm.password_confirmation) {
      setCreateError('Las contraseñas no coinciden');
      return;
    }
    
    setCreateLoading(true);
    setCreateError(null);
    
    try {
      const payload = {
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        password_confirmation: createForm.password_confirmation,
        is_admin: createForm.is_admin,
      };
      
      const response = await userService.createUser(payload);
      
      if (response.success) {
        setSnackbar({ 
          open: true, 
          message: 'Usuario creado correctamente', 
          severity: 'success' 
        });
        setUsers((prev) => [...prev, response.data]);
        setCreateDialogOpen(false);
        setCreateForm({ name: '', email: '', password: '', password_confirmation: '', is_admin: false });
        fetchStatistics(); // Actualizar estadísticas
      } else {
        setCreateError(response.message || 'Error al crear usuario');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Error al crear usuario');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!userToEdit) return;
    
    // Validación básica
    if (!editForm.name.trim()) {
      setEditError('El nombre es requerido');
      return;
    }
    
    if (!editForm.email.trim()) {
      setEditError('El email es requerido');
      return;
    }
    
    if (editForm.password && editForm.password !== editForm.password_confirmation) {
      setEditError('Las contraseñas no coinciden');
      return;
    }
    
    if (editForm.password && editForm.password.length < 8) {
      setEditError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setEditLoading(true);
    setEditError(null);
    
    try {
      const payload: any = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        is_admin: editForm.is_admin,
      };
      
      if (editForm.password) {
        payload.password = editForm.password;
        payload.password_confirmation = editForm.password_confirmation;
      }
      
      const response = await userService.updateUser(userToEdit.id, payload);
      
      if (response.success) {
        setSnackbar({ 
          open: true, 
          message: 'Usuario actualizado correctamente', 
          severity: 'success' 
        });
        setUsers((prev) => prev.map((u) => (u.id === userToEdit.id ? response.data : u)));
        setEditDialogOpen(false);
        setUserToEdit(null);
        setEditForm({ name: '', email: '', password: '', password_confirmation: '', is_admin: false });
      } else {
        setEditError(response.message || 'Error al actualizar usuario');
      }
    } catch (err: any) {
      setEditError(err.message || 'Error al actualizar usuario');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await userService.deleteUser(userToDelete.id);
      if (response.success) {
        setSnackbar({ open: true, message: 'Usuario eliminado correctamente', severity: 'success' });
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        fetchStatistics(); // Actualizar estadísticas
      } else {
        setSnackbar({ open: true, message: response.message || 'Error al eliminar usuario', severity: 'error' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Error al eliminar usuario', severity: 'error' });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleMonitorUser = async (user: User) => {
    console.log('🔍 Iniciando monitoreo de usuario:', user);
    setSelectedUser(user);
    setStatsModalOpen(true);
    setStatsLoading(true);
    setUserStats(null);
    setUserStatsError(null);
    
    try {
      console.log('📊 Obteniendo estadísticas para usuario ID:', user.id);
      const response = await userService.getUserStatistics(user.id);
      console.log('✅ Respuesta de estadísticas:', response);
      console.log('📊 Datos de estadísticas:', response.data);
      console.log('💰 Total gastado (tipo):', typeof response.data?.total_spent, 'valor:', response.data?.total_spent);
      
      if (response.success) {
        setUserStats(response.data);
        console.log('📈 Estadísticas cargadas:', response.data);
      } else {
        setUserStatsError('No se pudieron obtener las estadísticas');
        console.error('❌ Error en respuesta:', response);
      }
    } catch (err: any) {
      console.error('❌ Error al obtener estadísticas:', err);
      setUserStatsError('Error al obtener estadísticas: ' + err.message);
    } finally {
      setStatsLoading(false);
      console.log('🏁 Finalizado monitoreo de usuario');
    }
  };

  const handleCloseStatsModal = () => {
    setStatsModalOpen(false);
    setSelectedUser(null);
    setUserStats(null);
    setUserStatsError(null);
    
    // Restaurar el foco al body después de cerrar el modal
    setTimeout(() => {
      document.body.focus();
    }, 100);
  };

  const handleViewWishlist = async (user: User) => {
    console.log('🔍 Obteniendo wishlist de usuario:', user);
    setSelectedUser(user);
    
    // Cerrar el modal de estadísticas primero
    setStatsModalOpen(false);
    
    // Esperar un poco para que el modal se cierre completamente
    setTimeout(() => {
      setWishlistModalOpen(true);
      setWishlistLoading(true);
      setUserWishlist([]);
      setWishlistError(null);
      
      // Cargar los datos de wishlist
      loadWishlistData(user);
    }, 150);
  };

  const loadWishlistData = async (user: User) => {
    try {
      console.log('📊 Obteniendo wishlist para usuario ID:', user.id);
      const response = await userService.getUserWishlist(user.id);
      console.log('✅ Respuesta de wishlist:', response);
      
      if (response.success) {
        setUserWishlist(response.data);
        console.log('📈 Wishlist cargada:', response.data);
      } else {
        setWishlistError('No se pudo obtener la wishlist');
        console.error('❌ Error en respuesta:', response);
      }
    } catch (err: any) {
      console.error('❌ Error al obtener wishlist:', err);
      setWishlistError('Error al obtener wishlist: ' + err.message);
    } finally {
      setWishlistLoading(false);
      console.log('🏁 Finalizado obtención de wishlist');
    }
  };

  const handleCloseWishlistModal = () => {
    setWishlistModalOpen(false);
    setSelectedUser(null);
    setUserWishlist([]);
    setWishlistError(null);
    
    // Restaurar el foco al body después de cerrar el modal
    setTimeout(() => {
      document.body.focus();
    }, 100);
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Cargando usuarios...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchUsers}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Gestión de Clientes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra todos los usuarios del sistema
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Estadísticas
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Clientes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Nuevos este Mes
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {stats.newUsersThisMonth}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Email Verificado
              </Typography>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {stats.verifiedUsers}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Administradores
              </Typography>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {stats.adminUsers}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Con Órdenes
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.usersWithOrders}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
              sx={{ minWidth: 300 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={adminFilter}
                label="Tipo"
                onChange={(e) => setAdminFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="admin">Administradores</MenuItem>
                <MenuItem value="customer">Clientes</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Email</InputLabel>
              <Select
                value={verifiedFilter}
                label="Email"
                onChange={(e) => setVerifiedFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="verified">Verificado</MenuItem>
                <MenuItem value="unverified">No verificado</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="body2" color="text.secondary">
              {filteredUsers.length} de {users.length} usuarios
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateUser}
              sx={{ ml: 'auto' }}
            >
              Crear Usuario
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabla de Usuarios */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email Verificado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha Registro</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No se encontraron usuarios
                          </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                    <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          #{user.id}
                        </Typography>
                    </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                          label={user.is_admin ? 'Admin' : 'Cliente'}
                        size="small"
                          color={user.is_admin ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                          label={user.email_verified_at ? 'Verificado' : 'No verificado'}
                        size="small"
                          color={user.email_verified_at ? 'success' : 'error'}
                      />
                    </TableCell>
                      <TableCell>
                        {formatDate(user.created_at)}
                      </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewUser(user)}
                            >
                          <ViewIcon />
                        </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleEditUser(user)}
                            >
                          <EditIcon />
                        </IconButton>
                          </Tooltip>
                          <Tooltip title="Monitorear">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleMonitorUser(user)}
                            >
                              <AnalyticsIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <DeleteIcon />
                        </IconButton>
                          </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal de estadísticas de usuario */}
      <Dialog 
        open={statsModalOpen} 
        onClose={handleCloseStatsModal} 
        maxWidth="sm" 
        fullWidth
        disableEnforceFocus
        disableAutoFocus
        keepMounted={false}
      >
        <DialogTitle>
          Estadísticas de {selectedUser?.name}
        </DialogTitle>
        <DialogContent dividers>
          {statsLoading ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1">Cargando estadísticas...</Typography>
            </Box>
          ) : userStatsError ? (
            <Alert severity="error">{userStatsError}</Alert>
          ) : userStats ? (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <b>Total de órdenes:</b> {userStats?.total_orders || 0}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <b>Monto gastado:</b> ${formatCurrency(userStats?.total_spent)}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <b>Promedio por orden:</b> ${formatCurrency(userStats?.average_order_value)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Última orden:</b>
              </Typography>
              {userStats?.last_order_date ? (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Fecha: {new Date(userStats.last_order_date).toLocaleString('es-AR')}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  No hay órdenes
                </Typography>
              )}
              {userStats?.last_order && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Número: <b>{userStats.last_order.order_number}</b>
                  </Typography>
                  <Typography variant="body2">
                    Estado: <b>{userStats.last_order.status}</b>
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Órdenes por estado:</b>
              </Typography>
              {userStats?.orders_by_status && Object.keys(userStats.orders_by_status).length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {Object.entries(userStats.orders_by_status).map(([status, count]) => (
                    <Chip key={status} label={`${status}: ${count}`} color="primary" variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin órdenes
                </Typography>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button 
            ref={viewWishlistButtonRef}
            onClick={() => handleViewWishlist(selectedUser!)}
            color="secondary"
            variant="outlined"
            sx={{ mr: 'auto' }}
          >
            Ver Wishlist
          </Button>
          <Button onClick={handleCloseStatsModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalles del usuario */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles del Usuario: {selectedUserForView?.name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedUserForView && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="h6" color="primary">
                  Información Personal
                </Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    ID del Usuario
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    #{selectedUserForView.id}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {selectedUserForView.name}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {selectedUserForView.email}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo de Usuario
                  </Typography>
                  <Chip
                    label={selectedUserForView.is_admin ? 'Administrador' : 'Cliente'}
                    color={selectedUserForView.is_admin ? 'warning' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estado del Email
                  </Typography>
                  <Chip
                    label={selectedUserForView.email_verified_at ? 'Verificado' : 'No verificado'}
                    color={selectedUserForView.email_verified_at ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Registro
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formatDate(selectedUserForView.created_at)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Información de la Cuenta
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Última Actualización
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatDate(selectedUserForView.updated_at)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tiempo en el Sistema
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {Math.floor((new Date().getTime() - new Date(selectedUserForView.created_at).getTime()) / (1000 * 60 * 60 * 24))} días
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Acciones Rápidas
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleEditUser(selectedUserForView);
                    }}
                  >
                    Editar Usuario
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleMonitorUser(selectedUserForView);
                    }}
                  >
                    Ver Estadísticas
                  </Button>
                  
                  {selectedUserForView.id !== 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setViewDialogOpen(false);
                        handleDeleteUser(selectedUserForView);
                      }}
                    >
                      Eliminar Usuario
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edición de usuario */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre"
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              fullWidth
              required
              type="email"
            />
            <TextField
              label="Contraseña (dejar vacío para no cambiar)"
              name="password"
              value={editForm.password}
              onChange={handleEditFormChange}
              fullWidth
              type="password"
            />
            <TextField
              label="Confirmar contraseña"
              name="password_confirmation"
              value={editForm.password_confirmation}
              onChange={handleEditFormChange}
              fullWidth
              type="password"
            />
            <FormControlLabel
              control={<Checkbox checked={editForm.is_admin} onChange={handleEditFormChange} name="is_admin" />}
              label="Administrador"
            />
            {editError && <MuiAlert severity="error">{editError}</MuiAlert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={editLoading}>Cancelar</Button>
          <Button onClick={handleEditSave} color="primary" disabled={editLoading}>
            {editLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de creación de usuario */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear nuevo usuario</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre"
              name="name"
              value={createForm.name}
              onChange={handleCreateFormChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={createForm.email}
              onChange={handleCreateFormChange}
              fullWidth
              required
              type="email"
            />
            <TextField
              label="Contraseña"
              name="password"
              value={createForm.password}
              onChange={handleCreateFormChange}
              fullWidth
              required
              type="password"
            />
            <TextField
              label="Confirmar contraseña"
              name="password_confirmation"
              value={createForm.password_confirmation}
              onChange={handleCreateFormChange}
              fullWidth
              required
              type="password"
            />
            <FormControlLabel
              control={<Checkbox checked={createForm.is_admin} onChange={handleCreateFormChange} name="is_admin" />}
              label="Administrador"
            />
            {createError && <MuiAlert severity="error">{createError}</MuiAlert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={createLoading}>Cancelar</Button>
          <Button onClick={handleCreateSave} color="primary" disabled={createLoading}>
            {createLoading ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de confirmación de borrado */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que deseas eliminar al usuario <b>{userToDelete?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>Cancelar</Button>
          <Button onClick={confirmDeleteUser} color="error" disabled={deleteLoading}>
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de wishlist de usuario */}
      <Dialog 
        open={wishlistModalOpen} 
        onClose={handleCloseWishlistModal} 
        maxWidth="md" 
        fullWidth
        disableEnforceFocus
        disableAutoFocus
        keepMounted={false}
      >
        <DialogTitle>
          Wishlist de {selectedUser?.name}
        </DialogTitle>
        <DialogContent dividers>
          {wishlistLoading ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1">Cargando wishlist...</Typography>
            </Box>
          ) : wishlistError ? (
            <Alert severity="error">{wishlistError}</Alert>
          ) : userWishlist.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Este usuario no tiene productos en su wishlist.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <b>Total de productos favoritos:</b> {userWishlist.length}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {userWishlist.map((item) => (
                  <Card key={item.id} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      {/* Imagen del producto */}
                      <Box sx={{ mr: 2, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.product.main_image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${item.product.main_image}`}
                            alt={item.product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'grey.300',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Sin imagen
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      {/* Información del producto */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {item.product.category?.name || 'Sin categoría'}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          ${Number(item.product.price).toFixed(2)}
                        </Typography>
                        {item.notes && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Nota: "{item.notes}"
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Link al producto */}
                      <Box sx={{ ml: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
                            window.open(`${frontendUrl}/product/${item.product.slug}`, '_blank');
                          }}
                        >
                          Ver Producto
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWishlistModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}