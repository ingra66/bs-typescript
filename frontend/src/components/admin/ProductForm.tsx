import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import productService from '../../services/productService';
import type { Product, Category } from '../../services/productService';

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    compare_price: '',
    stock: '',
    sku: '',
    is_active: true,
    is_featured: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Cargar datos del producto si se está editando
  useEffect(() => {
    if (product) {
      setFormData({
        category_id: product.category_id.toString(),
        name: product.name,
        description: product.description,
        price: typeof product.price === 'number' ? product.price.toString() : (product.price || '0'),
        compare_price: product.compare_price ? (typeof product.compare_price === 'number' ? product.compare_price.toString() : product.compare_price) : '',
        stock: typeof product.stock === 'number' ? product.stock.toString() : (product.stock || '0'),
        sku: product.sku,
        is_active: product.is_active,
        is_featured: product.is_featured,
      });
      
      // Cargar imágenes existentes como preview
      if (product.images) {
        setPreviewImages(product.images);
      }
    }
  }, [product]);

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

  // Validar un campo específico
  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'name':
        if (!value || value.trim() === '') {
          return 'El nombre es requerido';
        }
        if (value.trim().length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'description':
        if (!value || value.trim() === '') {
          return 'La descripción es requerida';
        }
        if (value.trim().length < 10) {
          return 'La descripción debe tener al menos 10 caracteres';
        }
        break;
      case 'price':
        if (!value || value === '') {
          return 'El precio es requerido';
        }
        const price = parseFloat(value);
        if (isNaN(price) || price <= 0) {
          return 'El precio debe ser mayor a 0';
        }
        break;
      case 'stock':
        if (!value || value === '') {
          return 'El stock es requerido';
        }
        const stock = parseInt(value);
        if (isNaN(stock) || stock < 0) {
          return 'El stock debe ser mayor o igual a 0';
        }
        break;
      case 'sku':
        if (!value || value.trim() === '') {
          return 'El SKU es requerido';
        }
        if (value.trim().length < 3) {
          return 'El SKU debe tener al menos 3 caracteres';
        }
        break;
      case 'category_id':
        if (!value || value === '') {
          return 'Selecciona una categoría';
        }
        break;
    }
    return '';
  };

  // Manejar subida de imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);

    // Crear previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Eliminar imagen
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Generar SKU automático
  const generateSKU = () => {
    const name = formData.name.replace(/\s+/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const sku = `${name}-${timestamp}`;
    handleChange('sku', sku);
  };

  // Validar formulario
  const validateForm = () => {
    // Validar categoría
    if (!formData.category_id || formData.category_id === '') {
      return 'Selecciona una categoría';
    }

    // Validar nombre
    if (!formData.name || formData.name.trim() === '') {
      return 'El nombre del producto es requerido';
    }
    if (formData.name.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar descripción
    if (!formData.description || formData.description.trim() === '') {
      return 'La descripción es requerida';
    }
    if (formData.description.trim().length < 10) {
      return 'La descripción debe tener al menos 10 caracteres';
    }

    // Validar precio
    if (!formData.price || formData.price === '') {
      return 'El precio es requerido';
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      return 'El precio debe ser un número mayor a 0';
    }

    // Validar precio de comparación (opcional)
    if (formData.compare_price && formData.compare_price !== '') {
      const comparePrice = parseFloat(formData.compare_price);
      if (isNaN(comparePrice) || comparePrice <= 0) {
        return 'El precio de comparación debe ser un número mayor a 0';
      }
      if (comparePrice <= price) {
        return 'El precio de comparación debe ser mayor al precio normal';
      }
    }

    // Validar stock
    if (!formData.stock || formData.stock === '') {
      return 'El stock es requerido';
    }
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      return 'El stock debe ser un número mayor o igual a 0';
    }

    // Validar SKU
    if (!formData.sku || formData.sku.trim() === '') {
      return 'El SKU es requerido';
    }
    if (formData.sku.trim().length < 3) {
      return 'El SKU debe tener al menos 3 caracteres';
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

      const submitData = {
        category_id: parseInt(formData.category_id),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : undefined,
        stock: parseInt(formData.stock),
        sku: formData.sku,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        images: images.length > 0 ? images : undefined,
      };

      if (product) {
        // Actualizar producto existente
        await productService.updateProduct({
          id: product.id,
          ...submitData,
        });
      } else {
        // Crear nuevo producto
        await productService.createProduct(submitData);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving product:', err);
      
      // Manejar errores específicos del backend
      if (err.response?.data?.errors) {
        // Errores de validación del backend
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
        // Mensaje de error del backend
        setError(err.response.data.message);
      } else if (err.message) {
        // Error de red o JavaScript
        setError(`Error de conexión: ${err.message}`);
      } else {
        // Error genérico
        setError('Error inesperado al guardar el producto');
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
          label="Nombre del producto"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={(e) => {
            const error = validateField('name', e.target.value);
            setFieldErrors(prev => ({ ...prev, name: error }));
          }}
          error={!!fieldErrors.name}
          helperText={fieldErrors.name}
          required
        />

        <FormControl fullWidth required error={!!fieldErrors.category_id}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={formData.category_id}
            label="Categoría"
            onChange={(e) => handleChange('category_id', e.target.value)}
            onBlur={(e) => {
              const error = validateField('category_id', e.target.value);
              setFieldErrors(prev => ({ ...prev, category_id: error }));
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {fieldErrors.category_id && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {fieldErrors.category_id}
            </Typography>
          )}
        </FormControl>

        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <TextField
            fullWidth
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={(e) => {
              const error = validateField('description', e.target.value);
              setFieldErrors(prev => ({ ...prev, description: error }));
            }}
            multiline
            rows={4}
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
            required
          />
        </Box>

        {/* Precios y stock */}
        <TextField
          fullWidth
          label="Precio"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          onBlur={(e) => {
            const error = validateField('price', e.target.value);
            setFieldErrors(prev => ({ ...prev, price: error }));
          }}
          inputProps={{ min: 0, step: 0.01 }}
          error={!!fieldErrors.price}
          helperText={fieldErrors.price}
          required
        />

        <TextField
          fullWidth
          label="Precio de comparación (opcional)"
          type="number"
          value={formData.compare_price}
          onChange={(e) => handleChange('compare_price', e.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          helperText="Para mostrar descuentos"
        />

        <TextField
          fullWidth
          label="Stock"
          type="number"
          value={formData.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
          onBlur={(e) => {
            const error = validateField('stock', e.target.value);
            setFieldErrors(prev => ({ ...prev, stock: error }));
          }}
          inputProps={{ min: 0 }}
          error={!!fieldErrors.stock}
          helperText={fieldErrors.stock}
          required
        />

        {/* SKU */}
        <TextField
          fullWidth
          label="SKU"
          value={formData.sku}
          onChange={(e) => handleChange('sku', e.target.value)}
          onBlur={(e) => {
            const error = validateField('sku', e.target.value);
            setFieldErrors(prev => ({ ...prev, sku: error }));
          }}
          error={!!fieldErrors.sku}
          helperText={fieldErrors.sku}
          required
        />

        <Button
          variant="outlined"
          onClick={generateSKU}
          fullWidth
          sx={{ height: '56px' }}
        >
          Generar SKU
        </Button>

        {/* Estados */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
            />
          }
          label="Producto activo"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.is_featured}
              onChange={(e) => handleChange('is_featured', e.target.checked)}
            />
          }
          label="Producto destacado"
        />

        {/* Imágenes */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <Typography variant="h6" gutterBottom>
            Imágenes del producto
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Subir imágenes
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Button>
          </Box>

          {/* Preview de imágenes */}
          {previewImages.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {previewImages.map((image, index) => (
                <Card key={index} sx={{ width: 120, height: 120, position: 'relative' }}>
                  <CardContent sx={{ p: 1 }}>
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.7)',
                        },
                      }}
                      onClick={() => removeImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
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