
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {

  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as CustomersIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const miniDrawerWidth = 64;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' },
  { text: 'Productos', icon: <ProductsIcon />, page: 'products' },
  { text: 'Pedidos', icon: <OrdersIcon />, page: 'orders' },
  { text: 'Clientes', icon: <CustomersIcon />, page: 'customers' },
  { text: 'Analytics', icon: <AnalyticsIcon />, page: 'analytics' },
  { text: 'Configuración', icon: <SettingsIcon />, page: 'settings' },
];

export default function Sidebar({ open, onToggle, currentPage, onPageChange }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const drawer = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold', textShadow: '0 0 10px rgba(220, 38, 38, 0.5)', display: open ? 'block' : 'none' }}>
          BELTSPOT
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={currentPage === item.page}
              onClick={() => onPageChange(item.page)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  boxShadow: '0 0 15px rgba(220, 38, 38, 0.3)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{
                color: currentPage === item.page ? 'white' : 'primary.main',
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
              }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)` },
          ml: { md: `${open ? drawerWidth : miniDrawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onToggle}
            sx={{ mr: 2, display: { md: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find(item => item.page === currentPage)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: open ? drawerWidth : miniDrawerWidth }, flexShrink: { md: 0 }, height: '100vh', position: 'relative' }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={open}
          onClose={onToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: open ? drawerWidth : miniDrawerWidth,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowX: 'hidden',
              transition: 'width 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{drawer}</Box>
          <Box sx={{ p: 1, pb: 2, display: 'flex', justifyContent: 'center' }}>
            <IconButton
              color="primary"
              onClick={() => navigate('/')}
              sx={{
                width: open ? '100%' : 48,
                borderRadius: 2,
                justifyContent: 'center',
                backgroundColor: 'rgba(220,38,38,0.08)',
                '&:hover': { backgroundColor: 'rgba(220,38,38,0.18)' },
                transition: 'width 0.2s',
                px: open ? 2 : 0,
              }}
            >
              <HomeIcon />
              {open && <Typography sx={{ ml: 1, fontWeight: 500 }}>Ir al Home</Typography>}
            </IconButton>
          </Box>
        </Drawer>
      </Box>
    </>
  );
} 