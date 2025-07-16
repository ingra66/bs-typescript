import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import Products from '../../pages/admin/Products';
import Orders from '../../pages/admin/Orders';
import Customers from '../../pages/admin/Customers';

const drawerWidth = 240;
const miniDrawerWidth = 64;

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    const content = {
      dashboard: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Panel de administración - Próximamente
          </Typography>
        </Box>
      ),
      products: <Products />,
      orders: <Orders />,
      customers: <Customers />,
      analytics: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>
            Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análisis de datos - Próximamente
          </Typography>
        </Box>
      ),
      settings: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>
            Configuración
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configuración del sistema - Próximamente
          </Typography>
        </Box>
      ),
    };

    return content[currentPage as keyof typeof content] || content.dashboard;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${(sidebarOpen ? drawerWidth : miniDrawerWidth)}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          transition: 'width 0.2s',
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
} 