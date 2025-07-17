import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Alert,
  Button,
} from '@mui/material';

interface ImageTestProps {
  imagePath: string;
}

export default function ImageTest({ imagePath }: ImageTestProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSize, setImageSize] = useState<string>('');

  const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : (import.meta.env.VITE_API_URL || 'http://localhost:8000');
  const imageUrl = `${baseUrl}/storage/${imagePath}`;

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    setImageError(false);
    
    // Obtener información del archivo
    const img = event.target as HTMLImageElement;
    console.log('Imagen cargada:', {
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
    });
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    setImageLoaded(false);
    console.error('Error cargando imagen:', {
      src: (event.target as HTMLImageElement).src,
      error: event,
    });
  };

  const checkImageSize = async () => {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          const sizeInBytes = parseInt(contentLength);
          const sizeInKB = (sizeInBytes / 1024).toFixed(2);
          setImageSize(`${sizeInKB} KB`);
        }
      }
    } catch (error) {
      console.error('Error verificando tamaño:', error);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Prueba de Imagen
      </Typography>
      
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Ruta: {imagePath}
      </Typography>
      
      <Typography variant="body2" color="textSecondary" gutterBottom>
        URL: {imageUrl}
      </Typography>

      <Card sx={{ maxWidth: 200, mb: 2 }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Test image"
          sx={{ height: 150, objectFit: 'cover' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </Card>

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={checkImageSize}
          sx={{ mr: 1 }}
        >
          Verificar Tamaño
        </Button>
        
        {imageSize && (
          <Typography variant="body2" color="primary">
            Tamaño: {imageSize}
          </Typography>
        )}
      </Box>

      {imageLoaded && (
        <Alert severity="success" sx={{ mb: 1 }}>
          ✓ Imagen cargada correctamente
        </Alert>
      )}

      {imageError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          ✗ Error cargando imagen
        </Alert>
      )}

      <Typography variant="caption" display="block">
        Estado: {imageLoaded ? 'Cargada' : imageError ? 'Error' : 'Cargando...'}
      </Typography>
    </Box>
  );
} 