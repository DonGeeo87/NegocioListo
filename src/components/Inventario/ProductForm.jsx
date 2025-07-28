import React, { useState, useEffect } from 'react';
import { InventarioService } from '../../services/InventarioService';
import {
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  Text,
  Alert,
} from '@mantine/core';
import {
  IconPackage,
  IconCurrencyDollar,
  IconBox,
  IconCategory,
  IconAlertCircle,
} from '@tabler/icons-react';

const ProductForm = ({ producto, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorías predefinidas
  const categorias = [
    { value: 'Electrónicos', label: 'Electrónicos' },
    { value: 'Ropa', label: 'Ropa' },
    { value: 'Alimentos', label: 'Alimentos' },
    { value: 'Hogar', label: 'Hogar' },
    { value: 'Deportes', label: 'Deportes' },
    { value: 'Libros', label: 'Libros' },
    { value: 'Juguetes', label: 'Juguetes' },
    { value: 'Belleza', label: 'Belleza' },
    { value: 'Automotriz', label: 'Automotriz' },
    { value: 'Otros', label: 'Otros' }
  ];

  useEffect(() => {
    if (producto && isEditing) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        stock: producto.stock || '',
        categoria: producto.categoria || ''
      });
    }
  }, [producto, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else if (isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0';
    }

    if (!formData.stock) {
      newErrors.stock = 'El stock es requerido';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoria: formData.categoria,
        updatedAt: new Date().toISOString()
      };

      if (isEditing && producto) {
        productoData.id = producto.id;
        productoData.createdAt = producto.createdAt;
        InventarioService.updateProduct(productoData);
      } else {
        productoData.id = Date.now().toString();
        productoData.createdAt = new Date().toISOString();
        InventarioService.addProduct(productoData);
      }

      onSave(productoData);
    } catch (error) {
      console.error('Error guardando producto:', error);
      setErrors({ general: 'Error al guardar el producto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Stack gap="lg">
      <Text 
        size="lg" 
        fw={600}
        c="dark"
      >
        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      </Text>

      {errors.general && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error" 
          color="red"
        >
          {errors.general}
        </Alert>
      )}

      <TextInput
        label="Nombre del producto"
        placeholder="Ej: Laptop HP Pavilion"
        value={formData.nombre}
        onChange={(e) => handleInputChange('nombre', e.target.value)}
        leftSection={<IconPackage size={16} />}
        error={errors.nombre}
        required
        withAsterisk
      />

      <Textarea
        label="Descripción"
        placeholder="Describe el producto..."
        value={formData.descripcion}
        onChange={(e) => handleInputChange('descripcion', e.target.value)}
        rows={3}
      />

      <Group grow>
        <NumberInput
          label="Precio"
          placeholder="0.00"
          value={formData.precio}
          onChange={(value) => handleInputChange('precio', value)}
          leftSection={<IconCurrencyDollar size={16} />}
          error={errors.precio}
          required
          withAsterisk
          min={0}
          step={0.01}
          decimalScale={2}
        />

        <NumberInput
          label="Stock"
          placeholder="0"
          value={formData.stock}
          onChange={(value) => handleInputChange('stock', value)}
          leftSection={<IconBox size={16} />}
          error={errors.stock}
          required
          withAsterisk
          min={0}
        />
      </Group>

      <Select
        label="Categoría"
        placeholder="Selecciona una categoría"
        value={formData.categoria}
        onChange={(value) => handleInputChange('categoria', value)}
        data={categorias}
        leftSection={<IconCategory size={16} />}
        error={errors.categoria}
        required
        withAsterisk
      />

      <Group justify="flex-end" mt="md">
        <Button
          variant="subtle"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Producto
        </Button>
      </Group>
    </Stack>
  );
};

export default ProductForm; 