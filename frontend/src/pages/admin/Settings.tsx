import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import {
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface SettingSection {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const settingSections: SettingSection[] = [
  {
    title: 'Información del Negocio',
    icon: <StoreIcon />,
    description: 'Configura los datos básicos de tu negocio',
  },
  {
    title: 'Notificaciones',
    icon: <NotificationsIcon />,
    description: 'Gestiona las notificaciones del sistema',
  },
  {
    title: 'Seguridad',
    icon: <SecurityIcon />,
    description: 'Configuración de seguridad y privacidad',
  },
  {
    title: 'Pagos',
    icon: <PaymentIcon />,
    description: 'Configuración de métodos de pago',
  },
  {
    title: 'Email',
    icon: <EmailIcon />,
    description: 'Configuración de correo electrónico',
  },
];

export default function Settings() {
  const [businessInfo, setBusinessInfo] = useState({
    name: 'SYMMLA Restaurant',
    email: 'info@symmla.com',
    phone: '+1 234-567-8900',
    address: '123 Main Street, City, State 12345',
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    customerReviews: false,
    systemUpdates: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Configuración
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Gestiona la configuración de tu sistema
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuración guardada exitosamente
        </Alert>
      )}

      {/* Información del Negocio */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <StoreIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Información del Negocio
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configura los datos básicos de tu negocio
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              fullWidth
              label="Nombre del Negocio"
              value={businessInfo.name}
              onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Dirección"
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <NotificationsIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Notificaciones
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gestiona las notificaciones del sistema
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.newOrders}
                  onChange={(e) => setNotifications({ ...notifications, newOrders: e.target.checked })}
                />
              }
              label="Nuevos Pedidos"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.lowStock}
                  onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                />
              }
              label="Stock Bajo"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.customerReviews}
                  onChange={(e) => setNotifications({ ...notifications, customerReviews: e.target.checked })}
                />
              }
              label="Reseñas de Clientes"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.systemUpdates}
                  onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                />
              }
              label="Actualizaciones del Sistema"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Otras Configuraciones */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Otras Configuraciones
          </Typography>
          <List>
            {settingSections.slice(2).map((section, index) => (
              <React.Fragment key={section.title}>
                <ListItem>
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText
                    primary={section.title}
                    secondary={section.description}
                  />
                </ListItem>
                {index < settingSections.slice(2).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Botón de Guardar */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ backgroundColor: 'primary.main' }}
        >
          Guardar Configuración
        </Button>
      </Box>
    </Box>
  );
} 