import React from 'react';
import {
  Card,
  Group,
  Text,
  Badge,
  ActionIcon,
  Box,
  Stack,
  Tooltip,
  Divider,
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconBox,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconPackage,
  IconCurrencyDollar,
} from '@tabler/icons-react';

const ProductCard = ({ producto, onEdit, onDelete, onViewDetails }) => {
  
  // Obtener configuración de empresa
  let moneda = 'CLP';
  try {
    const config = JSON.parse(localStorage.getItem('configuracion_empresa'));
    if (config && config.moneda) {
      moneda = config.moneda;
    }
  } catch (e) {}

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda
    }).format(amount);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { 
      color: 'red', 
      text: 'Sin stock', 
      icon: <IconX size={16} style={{ fontSize: '16px' }} />,
      variant: 'light',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    };
    if (stock <= 5) return { 
      color: 'yellow', 
      text: 'Stock bajo', 
      icon: <IconAlertTriangle size={16} style={{ fontSize: '16px' }} />,
      variant: 'light',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    };
    return { 
      color: 'green', 
      text: 'En stock', 
      icon: <IconCheck size={16} style={{ fontSize: '16px' }} />,
      variant: 'light',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    };
  };

  const stockStatus = getStockStatus(producto.stock);

  return (
    <Card
      padding="xl"
      radius="lg"
      style={{
        height: '100%',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      {/* Efecto de brillo en el fondo */}
      <Box
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'rgba(59,130,246,0.03)',
          borderRadius: '50%',
          transform: 'rotate(45deg)',
          transition: 'all 0.3s ease',
        }}
      />
      
      {/* Header con icono y acciones */}
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
          }}
        >
          <IconBox size={28} style={{ fontSize: '28px' }} />
        </Box>
        
        <Group gap="xs">
          <Tooltip label="Ver detalles">
            <ActionIcon
              size="md"
              variant="light"
              onClick={() => onViewDetails(producto)}
              color="gray"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <IconEye size={18} style={{ fontSize: '18px' }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Editar">
            <ActionIcon
              size="md"
              variant="light"
              onClick={() => onEdit(producto)}
              color="blue"
              style={{
                background: 'rgba(59,130,246,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59,130,246,0.2)',
              }}
            >
              <IconEdit size={18} style={{ fontSize: '18px' }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Eliminar">
            <ActionIcon
              size="md"
              variant="light"
              color="red"
              onClick={() => onDelete(producto.id)}
              style={{
                background: 'rgba(239,68,68,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <IconTrash size={18} style={{ fontSize: '18px' }} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>

      {/* Contenido del producto */}
      <Box style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Text 
          fw={700} 
          size="lg"
          mb={12}
          lineClamp={2}
          style={{ 
            fontSize: '1.1rem',
            color: '#1e293b',
            lineHeight: 1.3,
          }}
        >
          {producto.nombre}
        </Text>
        
        <Text 
          size="sm" 
          c="dimmed"
          mb={20}
          lineClamp={2}
          style={{ 
            fontSize: '0.9rem',
            lineHeight: 1.4,
          }}
        >
          {producto.descripcion}
        </Text>
        
        <Group mb={20} gap="xs">
          <Badge
            size="sm"
            variant="light"
            color="blue"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: '#1d4ed8',
              fontWeight: 600,
            }}
          >
            {producto.categoria}
          </Badge>
          
          {/* Badge de stock status con gradiente */}
          <Box
            style={{
              background: stockStatus.gradient,
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {stockStatus.icon}
            {stockStatus.text}
          </Box>
        </Group>

        {/* Información de precio y stock con diseño mejorado */}
        <Stack gap={16}>
          <Box
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <Group justify="space-between" mb={12}>
              <Group gap="xs">
                <IconPackage size={16} style={{ color: '#64748b' }} />
                <Text size="sm" c="dimmed" fw={600}>
                  Precio unitario:
                </Text>
              </Group>
              <Text fw={700} size="sm" c="blue" style={{ fontSize: '1rem' }}>
                {formatCurrency(producto.precio)}
              </Text>
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconBox size={16} style={{ color: '#64748b' }} />
                <Text size="sm" c="dimmed" fw={600}>
                  Stock disponible:
                </Text>
              </Group>
              <Text 
                fw={700} 
                size="sm"
                c={producto.stock === 0 ? 'red' : producto.stock <= 5 ? 'yellow' : 'green'}
                style={{ fontSize: '1rem' }}
              >
                {producto.stock} unidades
              </Text>
            </Group>
          </Box>

          {/* Valor total destacado */}
          <Box
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
            }}
          >
            <Group justify="space-between">
              <Group gap="xs">
                <IconCurrencyDollar size={18} style={{ color: 'rgba(255,255,255,0.9)' }} />
                <Text size="sm" fw={600} style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Valor total:
                </Text>
              </Group>
              <Text 
                fw={800} 
                size="lg"
                style={{ 
                  color: 'white',
                  fontSize: '1.1rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                {formatCurrency(producto.precio * producto.stock)}
              </Text>
            </Group>
          </Box>
        </Stack>
      </Box>

      {/* Footer con fecha */}
      <Divider my={20} style={{ borderColor: '#e2e8f0' }} />
      <Text 
        size="xs" 
        c="dimmed"
        ta="center"
        style={{ 
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        Actualizado: {new Date(producto.updatedAt).toLocaleDateString('es-ES')}
      </Text>
    </Card>
  );
};

export default ProductCard; 