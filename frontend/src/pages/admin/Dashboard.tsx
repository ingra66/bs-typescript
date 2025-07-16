import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography color="textSecondary" variant="body2">
          {title}
        </Typography>
        <Box sx={{ color: change >= 0 ? 'success.main' : 'error.main' }}>
          {change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
        </Box>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={`${change >= 0 ? '+' : ''}${change}%`}
          size="small"
          color={change >= 0 ? 'success' : 'error'}
        />
        <Typography variant="body2" color="textSecondary">
          vs mes anterior
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const popularItems = [
  { name: 'Alas de Pollo Picantes', orders: 234, revenue: '$2,340' },
  { name: 'Hamburguesa Clásica Deluxe', orders: 189, revenue: '$1,890' },
  { name: 'Pizza Margherita', orders: 156, revenue: '$1,560' },
  { name: 'Ensalada César', orders: 143, revenue: '$1,430' },
  { name: 'Brownie de Chocolate', orders: 98, revenue: '$980' },
];

export default function Dashboard() {
  const metrics = [
    {
      title: 'Ingresos Totales',
      value: '$31,956',
      change: 12.5,
      icon: <MoneyIcon />,
      color: 'primary.main',
    },
    {
      title: 'Pedidos',
      value: '6,696',
      change: 8.2,
      icon: <OrdersIcon />,
      color: 'secondary.main',
    },
    {
      title: 'Clientes',
      value: '1,574',
      change: 15.3,
      icon: <CustomersIcon />,
      color: 'success.main',
    },
    {
      title: 'Tasa de Conversión',
      value: '73%',
      change: -2.1,
      icon: <AnalyticsIcon />,
      color: 'warning.main',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          ¡Bienvenido de vuelta! Aquí está lo que está pasando con tu negocio.
        </Typography>
      </Box>

      {/* Métricas principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </Box>

      {/* Gráficos y elementos populares */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Valor Promedio de Pedido en el Tiempo
            </Typography>
            <Box
              sx={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
                borderRadius: 1,
                mt: 2,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  Placeholder de Gráfico de Línea
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Integrar con Chart.js o Recharts
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Productos Más Populares
            </Typography>
            <List>
              {popularItems.map((item, index) => (
                <ListItem key={index} divider={index < popularItems.length - 1}>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.orders} pedidos`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {item.revenue}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Vista general de ventas mensuales */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Vista General de Ventas Mensuales
          </Typography>
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 1,
              mt: 2,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                Placeholder de Gráfico de Barras
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Integrar con Chart.js o Recharts
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 