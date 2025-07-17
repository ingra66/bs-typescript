import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#dc2626', // Rojo principal
      light: '#ef4444', // Rojo claro
      dark: '#b91c1c', // Rojo oscuro
    },
    secondary: {
      main: '#dc2626', // Rojo secundario
      light: '#ef4444',
      dark: '#b91c1c',
    },
    background: {
      default: '#0a0a0a', // Negro profundo
      paper: '#1a1a1a', // Negro más claro para cards
    },
    text: {
      primary: '#ffffff', // Blanco para texto principal
      secondary: '#a3a3a3', // Gris claro para texto secundario
    },
    success: {
      main: '#22c55e', // Verde para éxito
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444', // Rojo para errores
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b', // Amarillo para advertencias
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#dc2626', // Rojo para información
      light: '#ef4444',
      dark: '#b91c1c',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderRadius: 12,
          border: '1px solid rgba(220, 38, 38, 0.2)',
          backgroundColor: '#1a1a1a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a2a2a',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#ffffff',
          borderBottom: '1px solid rgba(220, 38, 38, 0.3)',
        },
        body: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(220, 38, 38, 0.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(220, 38, 38, 0.3)',
          backgroundColor: '#0a0a0a',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          backgroundColor: '#1a1a1a',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(220, 38, 38, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(220, 38, 38, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#dc2626',
            },
          },
        },
      },
    },
  },
}); 