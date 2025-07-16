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
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import orderService from '../../services/orderService';
import type { Order } from '../../types/order';
import { useAuthStore } from '../../stores/authStore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'Procesando';
    case 'shipped':
      return 'Enviado';
    case 'delivered':
      return 'Entregado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'success';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'paid':
      return 'Pagado';
    case 'failed':
      return 'Fallido';
    default:
      return status;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  // Estadísticas
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    console.log('🔐 Estado de autenticación:', { isAuthenticated, user });
    if (isAuthenticated && user?.is_admin) {
      fetchOrders();
    } else {
      setError('No tienes permisos de administrador');
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Intentando obtener órdenes del admin...');
      console.log('🔑 Token actual:', localStorage.getItem('auth_token'));
      console.log('👤 Usuario actual:', localStorage.getItem('user'));
      console.log('👤 Usuario del store:', user);
      
      const response = await orderService.getAdminOrders({ per_page: 1000 });
      console.log('✅ Respuesta de la API:', response);
      
      if (response.success) {
        setOrders(response.data);
        calculateStats(response.data);
        console.log('📊 Órdenes cargadas:', response.data.length);
      } else {
        setError('Error al cargar los pedidos');
        console.error('❌ Error en la respuesta:', response);
      }
    } catch (err: any) {
      setError(`Error al cargar los pedidos: ${err.message}`);
      console.error('❌ Error fetching orders:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error data:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData: Order[]) => {
    const totalRevenue = ordersData
      .filter(order => order.payment_status === 'paid' || order.status === 'delivered')
      .reduce((acc, order) => acc + Number(order.total_amount), 0);

    const paidOrders = ordersData.filter(order => order.payment_status === 'paid').length;
    const pendingOrders = ordersData.filter(order => order.status === 'pending').length;

    setStats({
      totalOrders: ordersData.length,
      totalRevenue,
      paidOrders,
      pendingOrders,
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.payment_status === paymentStatusFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Cargando órdenes...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No estás autenticado. Por favor, inicia sesión como administrador.
        </Alert>
        <Button variant="contained" onClick={() => window.location.href = '/login'}>
          Ir al Login
        </Button>
      </Box>
    );
  }

  if (!user?.is_admin) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          No tienes permisos de administrador. Tu rol actual es: {user?.is_admin ? 'Admin' : 'Usuario'}
        </Alert>
        <Button variant="contained" onClick={() => window.location.href = '/'}>
          Volver al Inicio
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchOrders}>
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
          Gestión de Pedidos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra y rastrea todas las ventas del sistema
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
                Total Pedidos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalOrders}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Ventas Totales
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(stats.totalRevenue)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Pagados
              </Typography>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {stats.paidOrders}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Pendientes
              </Typography>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {stats.pendingOrders}
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
              placeholder="Buscar por número de pedido o cliente..."
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
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Estado del Pedido</InputLabel>
              <Select
                value={statusFilter}
                label="Estado del Pedido"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="processing">Procesando</MenuItem>
                <MenuItem value="shipped">Enviado</MenuItem>
                <MenuItem value="delivered">Entregado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Estado del Pago</InputLabel>
              <Select
                value={paymentStatusFilter}
                label="Estado del Pago"
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos los pagos</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="paid">Pagado</MenuItem>
                <MenuItem value="failed">Fallido</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="body2" color="text.secondary">
              {filteredOrders.length} de {orders.length} pedidos
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Tabla de Pedidos */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Número</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado Pedido</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado Pago</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No se encontraron pedidos
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {order.order_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {order.shipping_address?.name || 'Cliente'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(order.total_amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(order.status)}
                          size="small"
                          color={getStatusColor(order.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getPaymentStatusText(order.payment_status)}
                          size="small"
                          color={getPaymentStatusColor(order.payment_status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        {order.items?.length || 0} items
                      </TableCell>
                      <TableCell>
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              color="primary"
                            >
                              <ViewIcon />
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
    </Box>
  );
} 