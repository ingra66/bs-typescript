import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AnalyticsIcon,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, description }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography color="textSecondary" variant="body2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ color: change >= 0 ? 'success.main' : 'error.main' }}>
          {change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
        </Box>
        <Typography variant="body2" color={change >= 0 ? 'success.main' : 'error.main'}>
          {change >= 0 ? '+' : ''}{change}%
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default function Analytics() {
  const metrics = [
    {
      title: 'Tasa de Conversión',
      value: '3.2%',
      change: 0.4,
      description: 'vs mes anterior',
    },
    {
      title: 'Valor Promedio del Pedido',
      value: '$45.67',
      change: 2.1,
      description: 'vs mes anterior',
    },
    {
      title: 'Tiempo Promedio de Entrega',
      value: '28 min',
      change: -5.2,
      description: 'vs mes anterior',
    },
    {
      title: 'Satisfacción del Cliente',
      value: '4.8/5',
      change: 0.1,
      description: 'vs mes anterior',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Análisis detallado del rendimiento de tu negocio
        </Typography>
      </Box>

      {/* Métricas principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </Box>

      {/* Gráficos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ventas por Categoría
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
                  Gráfico de Dona
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
              Tendencias de Ventas
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
                  Gráfico de Línea
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Integrar con Chart.js o Recharts
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Análisis detallado */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Análisis de Rendimiento por Hora
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
                  Gráfico de Barras
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
              Métricas Rápidas
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Productos Más Vendidos
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Alas de Pollo
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  234 unidades vendidas
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Hora Pico
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  7:00 PM
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Mayor actividad
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Cliente VIP
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Carlos López
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  $780.25 gastado
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
} 