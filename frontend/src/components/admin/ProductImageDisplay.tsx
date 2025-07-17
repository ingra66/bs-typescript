import { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import {
  ZoomIn as ZoomIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

interface ProductImage {
  original: string;
  thumbnail?: string;
  medium?: string;
  large?: string;
}

interface ProductImageDisplayProps {
  images: string[] | ProductImage[];
  productName: string;
  showThumbnails?: boolean;
  maxThumbnails?: number;
  size?: 'small' | 'medium' | 'large';
}

export default function ProductImageDisplay({
  images,
  productName,
  showThumbnails = true,
  maxThumbnails = 3,
  size = 'medium',
}: ProductImageDisplayProps) {
  const [openDialog, setOpenDialog] = useState(false);

  // Normalizar imágenes
  const normalizedImages = images.map((image) => {
    if (typeof image === 'string') {
      // Construir URLs completas con el dominio
      const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : (import.meta.env.VITE_API_URL || 'http://localhost:8000');
      const originalUrl = `${baseUrl}/storage/${image}`;
      
      // Generar URLs para versiones optimizadas
      const pathInfo = image.split('.');
      const baseName = pathInfo.slice(0, -1).join('.');
      const extension = pathInfo[pathInfo.length - 1];
      
      return {
        original: originalUrl,
        thumbnail: `${baseUrl}/storage/${baseName}_thumbnail.${extension}`,
        medium: `${baseUrl}/storage/${baseName}_medium.${extension}`,
        large: `${baseUrl}/storage/${baseName}_large.${extension}`,
      };
    }
    return image;
  });

  // Obtener URL de imagen según el tamaño
  const getImageUrl = (image: ProductImage, size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return image.thumbnail || image.original;
      case 'medium':
        return image.medium || image.original;
      case 'large':
        return image.large || image.original;
      default:
        return image.original;
    }
  };

  // Obtener dimensiones según el tamaño
  const getImageDimensions = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'medium':
        return { width: 120, height: 120 };
      case 'large':
        return { width: 200, height: 200 };
      default:
        return { width: 120, height: 120 };
    }
  };

  const dimensions = getImageDimensions(size);

  if (!normalizedImages.length) {
    return (
      <Box
        sx={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'grey.300',
        }}
      >
        <ImageIcon color="disabled" />
      </Box>
    );
  }

  const displayImages = showThumbnails 
    ? normalizedImages.slice(0, maxThumbnails)
    : [normalizedImages[0]];

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {/* Imagen principal */}
        <Card
          sx={{
            width: dimensions.width,
            height: dimensions.height,
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              '& .zoom-overlay': {
                opacity: 1,
              },
            },
          }}
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <CardMedia
            component="img"
            image={getImageUrl(normalizedImages[0], size)}
            alt={`${productName} - Imagen principal`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback a imagen original si la optimizada no existe
              const target = e.target as HTMLImageElement;
              if (target.src !== normalizedImages[0].original) {
                target.src = normalizedImages[0].original;
              }
            }}
          />
          
          {/* Overlay con zoom */}
          <Box
            className="zoom-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <ZoomIcon sx={{ color: 'white' }} />
          </Box>

          {/* Badge con cantidad de imágenes */}
          {normalizedImages.length > 1 && (
            <Chip
              label={`+${normalizedImages.length - 1}`}
              size="small"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontSize: '0.75rem',
              }}
            />
          )}
        </Card>

        {/* Thumbnails adicionales */}
        {showThumbnails && normalizedImages.length > 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {displayImages.slice(1).map((image, index) => (
              <Card
                key={index}
                sx={{
                  width: dimensions.width * 0.6,
                  height: dimensions.height * 0.6,
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    '& .zoom-overlay': {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <CardMedia
                  component="img"
                  image={getImageUrl(image, 'small')}
                  alt={`${productName} - Imagen ${index + 2}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== image.original) {
                      target.src = image.original;
                    }
                  }}
                />
                
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <ZoomIcon sx={{ fontSize: 16, color: 'white' }} />
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Dialog para vista ampliada */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {productName} - Imágenes
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {normalizedImages.map((image, index) => (
              <Card
                key={index}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease',
                  },
                }}
                                  onClick={() => setOpenDialog(true)}
              >
                <CardMedia
                  component="img"
                  image={image.original}
                  alt={`${productName} - Imagen ${index + 1}`}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 