import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import categoryService from '../../services/categoryService';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../services/categoryService';

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Cargar datos de la categoría si se está editando
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active,
      });
      
      // Cargar imagen existente como preview
      if (category.image) {
        setImagePreview(categoryService.getImageUrl(category.image));
      }
    }
  }, [category]);

  // Manejar cambios en el formulario
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.name || formData.name.trim() === '') {
      return 'El nombre de la categoría es requerido';
    }
    if (formData.name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    return null;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores anteriores
    setError(null);
    setFieldErrors({});
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (category) {
        // Actualizar categoría existente
        const updateData: UpdateCategoryRequest = {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active,
        };

        // Solo enviar imagen si se seleccionó una nueva
        if (imageFile) {
          updateData.image = imageFile;
        }

        await categoryService.updateCategory(category.id, updateData);
      } else {
        // Crear nueva categoría
        const createData: CreateCategoryRequest = {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active,
        };

        // Solo enviar imagen si se seleccionó una
        if (imageFile) {
          createData.image = imageFile;
        }

        await categoryService.createCategory(createData);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving category:', err);
      
      // Manejar errores específicos del backend
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const errorMessages = Object.values(backendErrors).flat();
        setError(errorMessages.join(', '));
        
        // Mapear errores del backend a campos específicos
        const fieldErrorMap: Record<string, string> = {};
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            fieldErrorMap[field] = messages[0];
          }
        });
        setFieldErrors(fieldErrorMap);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Error de conexión: ${err.message}`);
      } else {
        setError('Error inesperado al guardar la categoría');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* Información básica */}
        <TextField
          fullWidth
          label="Nombre de la categoría"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={!!fieldErrors.name}
          helperText={fieldErrors.name}
          required
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
            />
          }
          label="Categoría activa"
        />

        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <TextField
            fullWidth
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
            helperText="Descripción opcional de la categoría"
          />
        </Box>

        {/* Imagen de la categoría */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <Typography variant="h6" gutterBottom>
            Imagen de la categoría
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              {imagePreview ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '200px',
                    height: '200px',
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50',
                    },
                  }}
                  onClick={() => document.getElementById('image-input')?.click()}
                >
                  <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Hacer clic para subir imagen
                  </Typography>
                </Box>
              )}
              
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ mt: 2 }}
                disabled={!!imagePreview}
              >
                {imagePreview ? 'Imagen seleccionada' : 'Seleccionar imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : (category ? <EditIcon /> : <AddIcon />)}
        >
          {loading ? 'Guardando...' : (category ? 'Actualizar' : 'Crear')}
        </Button>
        
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
} 