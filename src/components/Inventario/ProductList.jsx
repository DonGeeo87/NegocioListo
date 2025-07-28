import React, { useState, useEffect } from 'react';
import { InventarioService } from '../../services/InventarioService';
import ProductForm from './ProductForm';
import {
  Container,
  Card,
  Group,
  Title,
  Text,
  Stack,
  Box,
  Button,
  TextInput,
  Select,
  Modal,
  ActionIcon,
  SimpleGrid,
  rem,
} from '@mantine/core';
import {
  IconBox,
  IconPlus,
  IconSearch,
  IconSortAscending,
  IconAlertTriangle,
  IconCurrencyDollar,
  IconEdit,
  IconTrash,
  IconChartBar,
} from '@tabler/icons-react';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductos();
  }, []);

  // Filtrar y ordenar productos cuando cambien los filtros
  useEffect(() => {
    if (productos.length > 0) {
      filterAndSortProductos();
    } else {
      setFilteredProductos([]);
    }
  }, [productos, searchTerm, categoryFilter, sortBy, showLowStockOnly]);

  const loadProductos = () => {
    setLoading(true);
    try {
      setError(null);
      const productosData = InventarioService.getAllProducts();
      // Si no hay productos, agregar algunos de prueba
      if (productosData.length === 0) {
        const productosPrueba = [
          {
            id: '1',
            nombre: 'Laptop HP Pavilion',
            descripcion: 'Laptop de 15 pulgadas con procesador Intel i5, 8GB RAM, 256GB SSD',
            precio: 599990,
            stock: 5,
            categoria: 'Electrónicos',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            nombre: 'Mouse Inalámbrico Logitech',
            descripcion: 'Mouse inalámbrico con sensor óptico de alta precisión',
            precio: 29990,
            stock: 15,
            categoria: 'Electrónicos',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            nombre: 'Camiseta de Algodón',
            descripcion: 'Camiseta 100% algodón, talla M, color azul',
            precio: 15990,
            stock: 25,
            categoria: 'Ropa',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '4',
            nombre: 'Café Colombiano Premium',
            descripcion: 'Café en grano de origen colombiano, 500g',
            precio: 8990,
            stock: 8,
            categoria: 'Alimentos',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '5',
            nombre: 'Pelota de Fútbol',
            descripcion: 'Pelota oficial de fútbol, tamaño 5, material sintético',
            precio: 45990,
            stock: 3,
            categoria: 'Deportes',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '6',
            nombre: 'Libro de Programación React',
            descripcion: 'Guía completa de React.js para desarrolladores',
            precio: 29990,
            stock: 12,
            categoria: 'Libros',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        // Guardar productos de prueba
        productosPrueba.forEach(producto => {
          InventarioService.addProduct(producto);
        });
        
        setProductos(productosPrueba);
      } else {
        setProductos(productosData);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProductos = () => {
    let filtered = [...productos];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoryFilter) {
      filtered = filtered.filter(producto => producto.categoria === categoryFilter);
    }

    // Filtrar por stock bajo
    if (showLowStockOnly) {
      filtered = filtered.filter(producto => producto.stock <= 5);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc':
          return b.nombre.localeCompare(a.nombre);
        case 'precio':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'stock':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'categoria':
          return a.categoria.localeCompare(b.categoria);
        case 'fecha':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'fecha-desc':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        default:
          return 0;
      }
    });

    setFilteredProductos(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (producto) => {
    setEditingProduct(producto);
    setShowForm(true);
  };

  const handleDeleteProduct = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    try {
      InventarioService.deleteProduct(showDeleteConfirm);
      loadProductos();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setError('Error al eliminar el producto. Por favor, intenta de nuevo.');
    }
  };

  const handleSaveProduct = (producto) => {
    loadProductos();
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleViewDetails = (producto) => {
    alert(`Detalles de ${producto.nombre}\nPrecio: $${producto.precio}\nStock: ${producto.stock}`);
  };

  const getStats = () => {
    const totalProductos = productos.length;
    const totalUnidades = productos.reduce((sum, p) => sum + p.stock, 0);
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
    const productosStockBajo = productos.filter(p => p.stock <= 5).length;
    const productosSinStock = productos.filter(p => p.stock === 0).length;
    const categoriasUnicas = [...new Set(productos.map(p => p.categoria))].length;
    const valorPromedio = totalProductos > 0 ? valorTotal / totalProductos : 0;
    
    return {
      totalProductos,
      totalUnidades,
      valorTotal,
      productosStockBajo,
      productosSinStock,
      categoriasUnicas,
      valorPromedio
    };
  };

  const stats = getStats();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setSortBy('nombre');
  };

  // Debug: Verificar que el componente se renderiza
  console.log('ProductList renderizando con:', {
    productos: productos.length,
    filteredProductos: filteredProductos.length,
    stats: stats,
    loading
  });

  if (loading) {
    return (
      <Box style={{ 
        background: '#f8fafc', 
        minHeight: '100vh', 
        padding: '0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <Container 
          size="xl" 
          style={{ 
            maxWidth: '100%', 
            padding: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Box style={{ textAlign: 'center', padding: '40px' }}>
            <Text size="xl" style={{ fontSize: rem(48), marginBottom: '16px' }}>⏳</Text>
            <Text>Cargando inventario...</Text>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ 
      background: '#f8fafc', 
      minHeight: '100vh', 
      padding: '0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Container 
        size="xl" 
        style={{ 
          maxWidth: '100%', 
          padding: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <Box mb="xl" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Title 
            order={1} 
            mb="lg"
            style={{ 
              fontSize: rem(28),
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            Inventario
          </Title>
          <Text 
            size="lg" 
            color="dimmed"
            style={{ 
              textAlign: 'center',
              fontSize: rem(16),
              color: '#64748b'
            }}
          >
            Gestiona tus productos y controla el stock
          </Text>
        </Box>

        {/* Estadísticas Principales */}
        <Box mb="xl" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Title 
            order={2} 
            mb="lg"
            style={{ 
              fontSize: rem(28),
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            Estadísticas Principales
          </Title>
          <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 2, lg: 4, xl: 4 }}
            spacing="lg"
            data-stats="true"
          >
            <Card
              style={{
                background: '#faf5ff',
                border: 'none',
                borderRadius: '20px',
                padding: '28px',
                minHeight: '250px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <Box
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
                }}
              >
                <IconBox size={28} color="white" />
              </Box>
              
              <Box style={{ flex: 1 }}>
                <Text 
                  size="xl" 
                  weight={700}
                  style={{ 
                    color: '#1e293b',
                    fontSize: rem(28),
                    marginBottom: '8px',
                    lineHeight: 1.2,
                  }}
                >
                  {stats.totalProductos}
                </Text>
                
                <Text 
                  size="sm" 
                  weight={600}
                  style={{ 
                    fontSize: rem(16),
                    marginBottom: '4px',
                    color: '#475569',
                  }}
                >
                  TOTAL PRODUCTOS
                </Text>
                
                <Text 
                  size="xs" 
                  color="dimmed"
                  style={{ 
                    fontSize: rem(13),
                    opacity: 0.7,
                  }}
                >
                  vs semana anterior
                </Text>
              </Box>
            </Card>

            <Card
              style={{
                background: '#ecfeff',
                border: 'none',
                borderRadius: '20px',
                padding: '28px',
                minHeight: '250px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <Box
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
                }}
              >
                <IconCurrencyDollar size={28} color="white" />
              </Box>
              
              <Box style={{ flex: 1 }}>
                <Text 
                  size="xl" 
                  weight={700}
                  style={{ 
                    color: '#1e293b',
                    fontSize: rem(28),
                    marginBottom: '8px',
                    lineHeight: 1.2,
                  }}
                >
                  {formatCurrency(stats.valorTotal)}
                </Text>
                
                <Text 
                  size="sm" 
                  weight={600}
                  style={{ 
                    fontSize: rem(16),
                    marginBottom: '4px',
                    color: '#475569',
                  }}
                >
                  VALOR TOTAL
                </Text>
                
                <Text 
                  size="xs" 
                  color="dimmed"
                  style={{ 
                    fontSize: rem(13),
                    opacity: 0.7,
                  }}
                >
                  vs semana anterior
                </Text>
              </Box>
            </Card>

            <Card
              style={{
                background: '#eef2ff',
                border: 'none',
                borderRadius: '20px',
                padding: '28px',
                minHeight: '250px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <Box
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                }}
              >
                <IconAlertTriangle size={28} color="white" />
              </Box>
              
              <Box style={{ flex: 1 }}>
                <Text 
                  size="xl" 
                  weight={700}
                  style={{ 
                    color: '#1e293b',
                    fontSize: rem(28),
                    marginBottom: '8px',
                    lineHeight: 1.2,
                  }}
                >
                  {stats.productosStockBajo}
                </Text>
                
                <Text 
                  size="sm" 
                  weight={600}
                  style={{ 
                    fontSize: rem(16),
                    marginBottom: '4px',
                    color: '#475569',
                  }}
                >
                  STOCK BAJO
                </Text>
                
                <Text 
                  size="xs" 
                  color="dimmed"
                  style={{ 
                    fontSize: rem(13),
                    opacity: 0.7,
                  }}
                >
                  vs semana anterior
                </Text>
              </Box>
            </Card>

            <Card
              style={{
                background: '#faf5ff',
                border: 'none',
                borderRadius: '20px',
                padding: '28px',
                minHeight: '250px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <Box
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.25)',
                }}
              >
                <IconChartBar size={28} color="white" />
              </Box>
              
              <Box style={{ flex: 1 }}>
                <Text 
                  size="xl" 
                  weight={700}
                  style={{ 
                    color: '#1e293b',
                    fontSize: rem(28),
                    marginBottom: '8px',
                    lineHeight: 1.2,
                  }}
                >
                  {stats.categoriasUnicas}
                </Text>
                
                <Text 
                  size="sm" 
                  weight={600}
                  style={{ 
                    fontSize: rem(16),
                    marginBottom: '4px',
                    color: '#475569',
                  }}
                >
                  CATEGORÍAS
                </Text>
                
                <Text 
                  size="xs" 
                  color="dimmed"
                  style={{ 
                    fontSize: rem(13),
                    opacity: 0.7,
                  }}
                >
                  vs semana anterior
                </Text>
              </Box>
            </Card>
          </SimpleGrid>
        </Box>

        {/* Acciones Rápidas */}
        <Box mt="xl" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Title 
            order={2} 
            mb="lg"
            style={{ 
              fontSize: rem(28),
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            Acciones Rápidas
          </Title>
          <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
            spacing="md" 
            style={{ width: '100%' }}
            data-actions="true"
          >
            <Card
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '24px',
                minHeight: '140px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={handleAddProduct}
            >
              <Group gap="md" wrap="nowrap">
                <Box
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconPlus size={24} color="white" />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text 
                    size="sm" 
                    weight={600}
                    style={{ 
                      color: '#1e293b',
                      fontSize: rem(16),
                      marginBottom: '4px'
                    }}
                  >
                    Agregar Producto
                  </Text>
                  <Text 
                    size="xs"
                    color="dimmed"
                    style={{ 
                      fontSize: rem(14)
                    }}
                  >
                    Inventario
                  </Text>
                </Box>
              </Group>
            </Card>

            <Card
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '24px',
                minHeight: '140px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            >
              <Group gap="md" wrap="nowrap">
                <Box
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconAlertTriangle size={24} color="white" />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text 
                    size="sm" 
                    weight={600}
                    style={{ 
                      color: '#1e293b',
                      fontSize: rem(16),
                      marginBottom: '4px'
                    }}
                  >
                    Stock Bajo
                  </Text>
                  <Text 
                    size="xs"
                    color="dimmed"
                    style={{ 
                      fontSize: rem(14)
                    }}
                  >
                    Inventario
                  </Text>
                </Box>
              </Group>
            </Card>

            <Card
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '24px',
                minHeight: '140px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => setSortBy('nombre')}
            >
              <Group gap="md" wrap="nowrap">
                <Box
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconSearch size={24} color="white" />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text 
                    size="sm" 
                    weight={600}
                    style={{ 
                      color: '#1e293b',
                      fontSize: rem(16),
                      marginBottom: '4px'
                    }}
                  >
                    Buscar
                  </Text>
                  <Text 
                    size="xs"
                    color="dimmed"
                    style={{ 
                      fontSize: rem(14)
                    }}
                  >
                    Inventario
                  </Text>
                </Box>
              </Group>
            </Card>

            <Card
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '24px',
                minHeight: '140px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => setSortBy('stock')}
            >
              <Group gap="md" wrap="nowrap">
                <Box
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#a855f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconSortAscending size={24} color="white" />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text 
                    size="sm" 
                    weight={600}
                    style={{ 
                      color: '#1e293b',
                      fontSize: rem(16),
                      marginBottom: '4px'
                    }}
                  >
                    Ordenar
                  </Text>
                  <Text 
                    size="xs"
                    color="dimmed"
                    style={{ 
                      fontSize: rem(14)
                    }}
                  >
                    Inventario
                  </Text>
                </Box>
              </Group>
            </Card>
          </SimpleGrid>
        </Box>

        {/* Filtros y Búsqueda */}
        <Box mt="xl" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Card
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div className="filters-row">
              <TextInput
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ flex: 1 }}
              />
              
              <Select
                placeholder="Categoría"
                value={categoryFilter}
                onChange={handleCategoryFilter}
                data={[
                  { value: '', label: 'Todas las categorías' },
                  ...Array.from(new Set(productos.map(p => p.categoria))).map(cat => ({
                    value: cat,
                    label: cat
                  }))
                ]}
                className="category-select"
              />
              
              <Select
                placeholder="Ordenar por"
                value={sortBy}
                onChange={handleSort}
                data={[
                  { value: 'nombre', label: 'Nombre A-Z' },
                  { value: 'nombre-desc', label: 'Nombre Z-A' },
                  { value: 'precio', label: 'Precio menor a mayor' },
                  { value: 'precio-desc', label: 'Precio mayor a menor' },
                  { value: 'stock', label: 'Stock menor a mayor' },
                  { value: 'stock-desc', label: 'Stock mayor a menor' },
                  { value: 'fecha', label: 'Más recientes' },
                  { value: 'fecha-desc', label: 'Más antiguos' }
                ]}
                className="sort-select"
              />
              
              <Button
                variant="subtle"
                onClick={limpiarFiltros}
                className="clear-button"
              >
                Limpiar
              </Button>
            </div>
          </Card>
        </Box>

        {/* Lista de Productos */}
        <Box mt="xl" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Card
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Title 
              order={3}
              mb="lg"
              style={{ 
                fontSize: rem(20),
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '20px'
              }}
            >
              Productos
            </Title>
            
            {filteredProductos.length > 0 ? (
              <SimpleGrid 
                cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
                spacing="lg"
                data-products="true"
              >
                {filteredProductos.map(producto => (
                  <Card
                    key={producto.id}
                    style={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleViewDetails(producto)}
                  >
                    <Group gap="md" wrap="nowrap">
                      <Box
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: producto.stock <= 5 
                            ? 'linear-gradient(135deg, #dc3545 60%, #c82333 100%)' 
                            : 'linear-gradient(135deg, #28a745 60%, #218838 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconBox size={20} color="white" />
                      </Box>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text 
                          size="sm" 
                          weight={600}
                          style={{ 
                            color: '#1e293b',
                            fontSize: rem(14),
                            marginBottom: '4px'
                          }}
                        >
                          {producto.nombre}
                        </Text>
                        <Text 
                          size="xs"
                          color="dimmed"
                          style={{ 
                            fontSize: rem(12),
                            marginBottom: '8px'
                          }}
                        >
                          {producto.categoria}
                        </Text>
                        <Text 
                          size="xs"
                          style={{ 
                            fontSize: rem(12),
                            color: '#64748b',
                            marginBottom: '4px'
                          }}
                        >
                          {producto.descripcion}
                        </Text>
                        <Group gap="xs" mt="xs">
                          <Text 
                            size="sm" 
                            weight={700}
                            style={{ 
                              color: '#8b5cf6',
                              fontSize: rem(14)
                            }}
                          >
                            {formatCurrency(producto.precio)}
                          </Text>
                          <Text 
                            size="xs"
                            style={{ 
                              color: producto.stock <= 5 ? '#dc3545' : '#64748b',
                              fontWeight: producto.stock <= 5 ? '600' : '400'
                            }}
                          >
                            Stock: {producto.stock}
                          </Text>
                        </Group>
                      </Box>
                      <Group gap="xs">
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(producto);
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(producto.id);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Box style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#64748b'
              }}>
                <Text 
                  size="xl"
                  style={{ 
                    fontSize: rem(48),
                    marginBottom: '24px',
                    opacity: '0.6'
                  }}
                >
                  📦
                </Text>
                <Text 
                  size="lg"
                  weight={600}
                  style={{ 
                    fontSize: rem(18),
                    marginBottom: '8px',
                    color: '#1e293b'
                  }}
                >
                  No se encontraron productos
                </Text>
                <Text size="sm">
                  {searchTerm || categoryFilter ? 'Intenta con otros filtros' : 'Agrega tu primer producto'}
                </Text>
              </Box>
            )}
          </Card>
        </Box>
      </Container>

      {/* Modal para agregar/editar producto */}
      {showForm && (
        <ProductForm
          producto={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
          isEditing={!!editingProduct}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal
        opened={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirmar eliminación"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Text>¿Estás seguro de que quieres eliminar este producto?</Text>
          <Text size="sm" c="dimmed">Esta acción no se puede deshacer.</Text>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setShowDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default ProductList; 