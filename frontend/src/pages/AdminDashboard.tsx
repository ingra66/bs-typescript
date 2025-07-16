import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import AdminLayout from '../components/admin/AdminLayout';
import { adminTheme } from '../theme/adminTheme';

export default function AdminDashboard() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AdminLayout />
    </ThemeProvider>
  );
} 