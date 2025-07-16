import React, { useEffect, useState } from 'react';
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', password_confirmation: '', is_admin: false });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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
    console.log('Ver usuario:', user);
    // TODO: Implementar vista detallada
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

  const handleEditSave = async () => {
    if (!userToEdit) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        is_admin: editForm.is_admin,
      };
      if (editForm.password) {
        payload.password = editForm.password;
        payload.password_confirmation = editForm.password_confirmation;
      }
      const response = await userService.updateUser(userToEdit.id, payload);
      if (response.success) {
        setSnackbar({ open: true, message: 'Usuario actualizado correctamente', severity: 'success' });
        setUsers((prev) => prev.map((u) => (u.id === userToEdit.id ? response.data : u)));
        setEditDialogOpen(false);
        setUserToEdit(null);
      } else {
        setEditError(response.message || 'Error al actualizar usuario');
      }
    } catch (err: any) {
      setEditError('Error al actualizar usuario: ' + err.message);
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
      } else {
        setSnackbar({ open: true, message: response.message || 'Error al eliminar usuario', severity: 'error' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: 'Error al eliminar usuario: ' + err.message, severity: 'error' });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleMonitorUser = async (user: User) => {
    setSelectedUser(user);
    setStatsModalOpen(true);
    setStatsLoading(true);
    setUserStats(null);
    setUserStatsError(null);
    try {
      const response = await userService.getUserStatistics(user.id);
      if (response.success) {
        setUserStats(response.data);
      } else {
        setUserStatsError('No se pudieron obtener las estadísticas');
      }
    } catch (err: any) {
      setUserStatsError('Error al obtener estadísticas: ' + err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCloseStatsModal = () => {
    setStatsModalOpen(false);
    setSelectedUser(null);
    setUserStats(null);
    setUserStatsError(null);
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
      <Dialog open={statsModalOpen} onClose={handleCloseStatsModal} maxWidth="sm" fullWidth>
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
                <b>Total de órdenes:</b> {userStats.total_orders}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <b>Monto gastado:</b> ${userStats.total_spent.toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <b>Promedio por orden:</b> ${userStats.average_order_value.toFixed(2)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Última orden:</b>
              </Typography>
              {userStats.last_order_date ? (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Fecha: {new Date(userStats.last_order_date).toLocaleString('es-AR')}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  No hay órdenes
                </Typography>
              )}
              {userStats.last_order && (
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
              {userStats.orders_by_status && Object.keys(userStats.orders_by_status).length > 0 ? (
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
          <Button onClick={handleCloseStatsModal} color="primary">
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

      {/* Snackbar de feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
} 