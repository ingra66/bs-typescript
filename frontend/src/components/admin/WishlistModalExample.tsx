import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const WishlistModalExample: React.FC = () => {
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [userWishlist, setUserWishlist] = useState<any[]>([]);

  // Datos de ejemplo
  const exampleUser = {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com"
  };

  const exampleWishlist = [
    {
      id: 1,
      product: {
        id: 1,
        name: "Producto de Ejemplo 1",
        slug: "producto-ejemplo-1",
        price: 99.99,
        main_image: "https://via.placeholder.com/150",
        category: { name: "Electrónicos" }
      },
      notes: "Me gusta mucho este producto",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      product: {
        id: 2,
        name: "Producto de Ejemplo 2",
        slug: "producto-ejemplo-2",
        price: 149.99,
        main_image: "https://via.placeholder.com/150",
        category: { name: "Ropa" }
      },
      notes: null,
      created_at: "2024-01-10T15:45:00Z"
    },
    {
      id: 3,
      product: {
        id: 3,
        name: "Producto de Ejemplo 3",
        slug: "producto-ejemplo-3",
        price: 79.99,
        main_image: null,
        category: { name: "Hogar" }
      },
      notes: "Para regalo",
      created_at: "2024-01-05T09:15:00Z"
    }
  ];

  const handleMonitorUser = () => {
    setStatsModalOpen(true);
  };

  const handleViewWishlist = () => {
    setWishlistModalOpen(true);
    setWishlistLoading(true);
    
    // Simular carga
    setTimeout(() => {
      setUserWishlist(exampleWishlist);
      setWishlistLoading(false);
    }, 1000);
  };

  const handleCloseStatsModal = () => {
    setStatsModalOpen(false);
  };

  const handleCloseWishlistModal = () => {
    setWishlistModalOpen(false);
    setUserWishlist([]);
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Ejemplo: Modal de Wishlist en Panel de Administración
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Flujo de Funcionalidad
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Este ejemplo muestra cómo funciona la nueva funcionalidad de ver wishlist de usuarios en el panel de administración.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMonitorUser}
              startIcon={<ViewIcon />}
            >
              Abrir Modal de Estadísticas
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de estadísticas de usuario */}
      <Dialog open={statsModalOpen} onClose={handleCloseStatsModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Estadísticas de {exampleUser.name}
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              <b>Total de órdenes:</b> 5
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              <b>Monto gastado:</b> $1,250.00
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              <b>Promedio por orden:</b> $250.00
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              <b>Productos en wishlist:</b> 3
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleViewWishlist}
            color="secondary"
            variant="outlined"
            startIcon={<FavoriteIcon />}
            sx={{ mr: 'auto' }}
          >
            Ver Wishlist
          </Button>
          <Button onClick={handleCloseStatsModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de wishlist de usuario */}
      <Dialog open={wishlistModalOpen} onClose={handleCloseWishlistModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Wishlist de {exampleUser.name}
        </DialogTitle>
        <DialogContent dividers>
          {wishlistLoading ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1">Cargando wishlist...</Typography>
            </Box>
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
                            src={item.product.main_image}
                            alt={item.product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '4px'
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
                            alert(`Se abriría el producto: ${item.product.name}`);
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

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Características Implementadas
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Botón "Ver Wishlist" en modal de estadísticas</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Modal dedicado para mostrar wishlist</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Imagen en miniatura del producto</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Nombre y precio del producto</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Link para ver el producto en la tienda</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Mensaje cuando no hay productos</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Consulta al backend para obtener wishlist</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="✅" size="small" color="success" />
              <Typography variant="body2">Estilos coherentes con el panel</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Flujo de Uso
          </Typography>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Administrador hace click en "Monitorear" en la tabla de clientes</li>
            <li>Se abre el modal de estadísticas del usuario</li>
            <li>Administrador hace click en "Ver Wishlist"</li>
            <li>Se abre un nuevo modal con la lista de productos favoritos</li>
            <li>Administrador puede ver detalles y hacer click en "Ver Producto"</li>
            <li>Si no hay productos, se muestra mensaje informativo</li>
          </ol>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WishlistModalExample; 