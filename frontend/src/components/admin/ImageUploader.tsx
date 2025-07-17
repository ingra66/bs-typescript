import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface ImageFile {
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error' | 'idle';
  progress?: number;
  error?: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // en bytes
  acceptedFormats?: string[];
  showPreview?: boolean;
  multiple?: boolean;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  showPreview = true,
  multiple = true,
}: ImageUploaderProps) {


  // Función para validar archivos
  const validateFile = (file: File): string | null => {
    // Verificar formato
    if (!acceptedFormats.includes(file.type)) {
      return `Formato no soportado. Formatos permitidos: ${acceptedFormats.join(', ')}`;
    }

    // Verificar tamaño
    if (file.size > maxSize) {
      return `El archivo es demasiado grande. Tamaño máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }

    // Verificar cantidad de archivos
    if (images.length >= maxFiles) {
      return `Máximo ${maxFiles} imágenes permitidas`;
    }

    return null;
  };

  // Función para procesar archivos
  const processFiles = useCallback((acceptedFiles: File[]) => {
    const newImages: ImageFile[] = [];

    acceptedFiles.forEach((file) => {
      const error = validateFile(file);
      
      if (error) {
        // Mostrar error
        console.error(error);
        return;
      }

      const imageFile: ImageFile = {
        file,
        preview: URL.createObjectURL(file),
        status: 'idle',
      };

      newImages.push(imageFile);
    });

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, onImagesChange, maxFiles, maxSize, acceptedFormats, validateFile]);

  // Configurar dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    accept: {
      'image/*': acceptedFormats,
    },
    maxSize,
    maxFiles: maxFiles - images.length,
    multiple,
  });

  // Eliminar imagen
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  // Simular progreso de carga (en producción esto vendría del backend)
  const simulateUpload = (image: ImageFile, index: number) => {
    const newImages = [...images];
    newImages[index] = { ...image, status: 'uploading', progress: 0 };
    onImagesChange(newImages);

    const interval = setInterval(() => {
      const currentImage = newImages[index];
      if (currentImage.progress! < 100) {
        newImages[index] = { ...currentImage, progress: currentImage.progress! + 10 };
        onImagesChange([...newImages]);
      } else {
        newImages[index] = { ...currentImage, status: 'success' };
        onImagesChange([...newImages]);
        clearInterval(interval);
      }
    }, 100);
  };

  // Obtener icono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'uploading':
        return <ImageIcon color="primary" />;
      default:
        return <ImageIcon color="disabled" />;
    }
  };

  // Obtener color del chip según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Área de drop */}
      <Paper
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'primary.50' : 'background.paper',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          },
        }}
      >
        <input {...getInputProps()} />
        
        <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Suelta las imágenes aquí' : 'Arrastra imágenes aquí o haz clic'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Formatos soportados: JPEG, PNG, GIF, WebP
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Tamaño máximo: {(maxSize / 1024 / 1024).toFixed(1)}MB por imagen
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Máximo {maxFiles} imágenes
        </Typography>

        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          sx={{ mt: 2 }}
        >
          Seleccionar imágenes
        </Button>
      </Paper>

      {/* Información de imágenes */}
      {images.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Imágenes ({images.length}/{maxFiles})
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {images.map((image, index) => (
              <Card key={index} sx={{ position: 'relative' }}>
                <CardContent sx={{ p: 1 }}>
                  {/* Preview de imagen */}
                  {showPreview && (
                    <Box sx={{ position: 'relative', mb: 1 }}>
                      <img
                        src={image.preview}
                        alt={`Imagen ${index + 1}`}
                        style={{
                          width: '100%',
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                      
                      {/* Overlay con información */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: image.status === 'idle' ? 0 : 1,
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        {getStatusIcon(image.status)}
                      </Box>
                    </Box>
                  )}

                  {/* Información del archivo */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" display="block" noWrap>
                      {image.file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>

                  {/* Estado y progreso */}
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={image.status}
                      color={getStatusColor(image.status)}
                      size="small"
                      icon={getStatusIcon(image.status)}
                    />
                  </Box>

                  {/* Barra de progreso */}
                  {image.status === 'uploading' && image.progress !== undefined && (
                    <Box sx={{ mb: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={image.progress} 
                        sx={{ height: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {image.progress}%
                      </Typography>
                    </Box>
                  )}

                  {/* Error */}
                  {image.error && (
                    <Alert severity="error" sx={{ mb: 1, fontSize: '0.75rem' }}>
                      {image.error}
                    </Alert>
                  )}

                  {/* Botones de acción */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeImage(index)}
                      sx={{ flex: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    
                    {image.status === 'idle' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => simulateUpload(image, index)}
                        sx={{ flex: 1 }}
                      >
                        Procesar
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Alertas */}
      {images.length >= maxFiles && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Has alcanzado el límite máximo de {maxFiles} imágenes
        </Alert>
      )}
    </Box>
  );
} 