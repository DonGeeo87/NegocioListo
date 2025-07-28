import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  Group,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Box,
  useMantineTheme,
  rem,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { 
  IconCash, 
  IconArrowDown, 
  IconBox, 
  IconChartBar, 
  IconPlus, 
  IconTrendingUp, 
  IconTrendingDown, 
  IconReceipt,
  IconCalendar,
  IconClock,
  IconBell,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';

const CONFIG_KEY = 'configuracion_empresa';

const Dashboard = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Estilos CSS personalizados para el dashboard
  useEffect(() => {
    const dashboardStyles = `
      /* Sobrescribir estilos globales para widgets */
      .dashboard-widget {
        position: relative;
        overflow: hidden;
        min-height: 250px !important;
        border-radius: 20px !important;
        padding: 28px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        transition: all 0.3s ease !important;
      }
      
      .dashboard-widget::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      
      .dashboard-widget:hover::before {
        opacity: 1;
      }
      
      .dashboard-widget:hover {
        transform: translateY(-4px) scale(1.02) !important;
        box-shadow: 0 12px 32px rgba(0,0,0,0.15) !important;
      }
      
      /* Sobrescribir estilos para acciones rápidas */
      .quick-action-card {
        position: relative;
        overflow: hidden;
        min-height: 140px !important;
        border-radius: 18px !important;
        padding: 24px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        transition: all 0.3s ease !important;
      }
      
      .quick-action-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
      }
      
      .quick-action-card:hover::after {
        left: 100%;
      }
      
      .quick-action-card:hover {
        transform: translateY(-4px) scale(1.02) !important;
        box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
        border-color: var(--action-color) !important;
      }
      
      /* Colores específicos para cada acción */
      .quick-action-card[data-color="#8b5cf6"]:hover {
        border-color: #8b5cf6 !important;
      }
      
      .quick-action-card[data-color="#06b6d4"]:hover {
        border-color: #06b6d4 !important;
      }
      
      .quick-action-card[data-color="#6366f1"]:hover {
        border-color: #6366f1 !important;
      }
      
      .quick-action-card[data-color="#a855f7"]:hover {
        border-color: #a855f7 !important;
      }
      
      /* Forzar grid de 4 columnas en desktop */
      @media (min-width: 1200px) {
        .dashboard-stats-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 24px !important;
        }
      }
      
      @media (max-width: 1199px) and (min-width: 768px) {
        .dashboard-stats-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 20px !important;
        }
      }
      
      @media (max-width: 767px) {
        .dashboard-stats-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
      }
      
      /* Centrado del contenido principal */
      .dashboard-container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        width: 100% !important;
        max-width: 1200px !important;
        margin: 0 auto !important;
      }
      
      /* Grid de acciones rápidas */
      .dashboard-actions-grid {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 16px !important;
      }
      
      @media (max-width: 767px) {
        .dashboard-actions-grid {
          grid-template-columns: 1fr !important;
          gap: 12px !important;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = dashboardStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [stats, setStats] = useState({
    ingresos: 0,
    egresos: 0,
    productos: 0,
    facturas: 0,
  });
  const [empresa, setEmpresa] = useState({ nombre: 'NegocioListo', moneda: 'CLP' });
  const [recentActivities, setRecentActivities] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      loadStats();
      loadRecentActivities();
      loadNextEvent();
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) setEmpresa(JSON.parse(saved));
    }
  }, [location.pathname]);

  const loadStats = () => {
    try {
      const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
      const gastos = JSON.parse(localStorage.getItem('gastos') || '[]');
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      const totalIngresos = ventas.reduce((sum, venta) => sum + parseFloat(venta.total), 0);
      const totalEgresos = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto), 0);
      setStats({
        ingresos: totalIngresos,
        egresos: totalEgresos,
        productos: productos.length,
        facturas: facturas.length,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const loadRecentActivities = () => {
    try {
      const ventas = JSON.parse(localStorage.getItem('ventas') || '[]').map(v => ({
        type: 'venta',
        date: v.fecha,
        description: `Venta de ${v.productos.length} productos`,
        amount: parseFloat(v.total),
        id: v.id,
      }));
      const gastos = JSON.parse(localStorage.getItem('gastos') || '[]').map(g => ({
        type: 'gasto',
        date: g.fecha,
        description: `Gasto en ${g.categoria}`,
        amount: parseFloat(g.monto),
        id: g.id,
      }));

      const allActivities = [...ventas, ...gastos];
      allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentActivities(allActivities.slice(0, 5));
    } catch (error) {
      console.error('Error cargando actividades recientes:', error);
    }
  };

  const loadNextEvent = () => {
    try {
      const events = JSON.parse(localStorage.getItem('calendar_events') || '[]');
      const now = new Date();
      
      // Filtrar eventos futuros y ordenarlos por fecha
      const futureEvents = events
        .filter(event => {
          const eventDate = new Date(event.date + ' ' + (event.time || '00:00'));
          return eventDate > now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
          const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
          return dateA - dateB;
        });

      setNextEvent(futureEvents.length > 0 ? futureEvents[0] : null);
    } catch (error) {
      console.error('Error cargando próximo evento:', error);
      setNextEvent(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: empresa.moneda || 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatEventDate = (dateStr, timeStr) => {
    const date = new Date(dateStr + ' ' + (timeStr || '00:00'));
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Mañana';
    } else if (diffDays < 7) {
      return `En ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const formatEventTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: '#3b82f6',
      payment: '#ef4444',
      inventory: '#10b981',
      birthday: '#f59e0b',
      reminder: '#8b5cf6',
      tax: '#dc2626',
      other: '#64748b',
    };
    return colors[type] || colors.other;
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return <IconCalendar size={24} color="white" />;
      case 'payment':
        return <IconCash size={24} color="white" />;
      case 'inventory':
        return <IconBox size={24} color="white" />;
      case 'reminder':
        return <IconBell size={24} color="white" />;
      default:
        return <IconCalendar size={24} color="white" />;
    }
  };

  // Acciones rápidas
  const quickActions = [
    {
      title: 'Agregar Producto',
      subtitle: 'Inventario',
      icon: <IconPlus size={24} color="white" />,
      color: '#8b5cf6',
      path: '/inventario',
    },
    {
      title: 'Registrar Venta',
      subtitle: 'Ventas',
      icon: <IconTrendingUp size={24} color="white" />,
      color: '#06b6d4',
      path: '/ventas',
    },
    {
      title: 'Registrar Gasto',
      subtitle: 'Gastos',
      icon: <IconTrendingDown size={24} color="white" />,
      color: '#6366f1',
      path: '/gastos',
    },
    {
      title: 'Crear Factura',
      subtitle: 'Facturas',
      icon: <IconReceipt size={24} color="white" />,
      color: '#a855f7',
      path: '/facturas',
    },
  ];

  // Widgets de estadísticas semanales
  const statWidgets = [
    {
      key: 'ingresos',
      label: 'Ingresos',
      value: formatCurrency(stats.ingresos),
      trend: '+12.5%',
      trendText: 'vs semana anterior',
      icon: <IconCash size={24} color="#8b5cf6" />,
      color: '#8b5cf6',
      bg: '#faf5ff',
      iconBg: '#8b5cf6',
    },
    {
      key: 'egresos',
      label: 'Egresos',
      value: formatCurrency(stats.egresos),
      trend: '-5.2%',
      trendText: 'vs semana anterior',
      icon: <IconArrowDown size={24} color="#06b6d4" />,
      color: '#06b6d4',
      bg: '#ecfeff',
      iconBg: '#06b6d4',
    },
    {
      key: 'balance',
      label: 'Balance',
      value: formatCurrency(stats.ingresos - stats.egresos),
      trend: '+18.3%',
      trendText: 'vs semana anterior',
      icon: <IconChartBar size={24} color="#6366f1" />,
      color: '#6366f1',
      bg: '#eef2ff',
      iconBg: '#6366f1',
    },
    {
      key: 'productos',
      label: 'Productos',
      value: stats.productos,
      trend: '+2.1%',
      trendText: 'vs semana anterior',
      icon: <IconBox size={24} color="#a855f7" />,
      color: '#a855f7',
      bg: '#faf5ff',
      iconBg: '#a855f7',
    },
  ];

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
        {/* Logo en móvil */}
        <Box 
          mb="lg"
          visibleFrom="xs"
          hiddenFrom="md"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            style={{
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              border: '2px solid #e2e8f0',
              marginBottom: '16px',
            }}
          >
            <img 
              src="/logo-blanco.png" 
              alt="Logo NegocioListo" 
              style={{ 
                width: '60px', 
                height: '60px',
                objectFit: 'contain',
                filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(240deg) brightness(104%) contrast(97%)'
              }} 
            />
          </Box>
          <Text 
            weight={700} 
            size="lg"
            style={{ 
              color: '#1e293b',
              fontSize: rem(20),
              fontWeight: 700,
            }}
          >
            NegocioListo
          </Text>
        </Box>

                {/* Header con balance principal */}
        <Box mb="xl" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
              borderRadius: '24px',
              padding: '36px',
              border: 'none',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.25)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Efecto de brillo */}
            <Box
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                transform: 'rotate(45deg)',
                pointerEvents: 'none',
              }}
            />
            <Group justify="space-between" align="center">
              <Box>
                <Text 
                  size="sm" 
                  style={{ 
                    fontSize: rem(16),
                    fontWeight: 500,
                    opacity: 0.9,
                    marginBottom: '8px'
                  }}
                >
                  Balance Total
                </Text>
                <Title 
                  order={1} 
                  style={{ 
                    fontSize: rem(48),
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '8px'
                  }}
                  sx={{
                    '@media (max-width: 768px)': {
                      fontSize: rem(32),
                    },
                    '@media (max-width: 480px)': {
                      fontSize: rem(24),
                    }
                  }}
                >
                  {formatCurrency(stats.ingresos - stats.egresos)}
                </Title>
                <Text 
                  size="sm"
                  style={{ 
                    fontSize: rem(14),
                    opacity: 0.8
                  }}
                >
                  Última actualización: {new Date().toLocaleDateString()}
                </Text>
              </Box>
              <Box
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}
              >
                <IconChartBar size={44} color="white" />
              </Box>
            </Group>
          </Card>
        </Box>

        {/* Estadísticas Principales */}
        <Box style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
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
            className="dashboard-stats-grid"
            cols={4} 
            spacing="lg"
            breakpoints={[
              { maxWidth: 'xl', cols: 4, spacing: 'md' },
              { maxWidth: 'lg', cols: 2, spacing: 'md' },
              { maxWidth: 'md', cols: 2, spacing: 'md' },
              { maxWidth: 'sm', cols: 1, spacing: 'sm' },
            ]}
          >
            {statWidgets.map((widget) => (
              <Card
                key={widget.key}
                className="dashboard-widget"
                style={{
                  background: widget.bg,
                  border: 'none',
                }}
              >
                <Box
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: widget.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 4px 12px ${widget.iconBg}40`,
                  }}
                >
                  {React.cloneElement(widget.icon, { 
                    size: 28,
                    color: 'white'
                  })}
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
                    {widget.value}
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
                    {widget.label}
                  </Text>
                  
                  <Text 
                    size="xs" 
                    color="dimmed"
                    style={{ 
                      fontSize: rem(13),
                      opacity: 0.7,
                    }}
                  >
                    {widget.trendText}
                  </Text>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Próximo Evento */}
        {nextEvent && (
          <Box mt="xl" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
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
              Próximo Evento
            </Title>
            <Card
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                borderRadius: '20px',
                padding: '32px',
                border: 'none',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.25)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Efecto de brillo */}
              <Box
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  transform: 'rotate(45deg)',
                  pointerEvents: 'none',
                }}
              />
              
              <Group justify="space-between" align="flex-start">
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="md" align="center" mb="md">
                    <Box
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      {React.cloneElement(getEventTypeIcon(nextEvent.type), { 
                        size: 28,
                        color: 'white'
                      })}
                    </Box>
                    <Box>
                      <Text 
                        size="sm" 
                        style={{ 
                          fontSize: rem(14),
                          fontWeight: 500,
                          opacity: 0.9,
                          marginBottom: '4px'
                        }}
                      >
                        Próximo Evento
                      </Text>
                      <Text 
                        size="lg" 
                        weight={700}
                        style={{ 
                          fontSize: rem(20),
                          color: 'white',
                          marginBottom: '4px',
                          lineHeight: 1.3
                        }}
                        truncate
                      >
                        {nextEvent.title}
                      </Text>
                    </Box>
                  </Group>
                  
                  <Text 
                    size="sm"
                    style={{ 
                      fontSize: rem(14),
                      opacity: 0.9,
                      marginBottom: '8px'
                    }}
                  >
                    {formatEventDate(nextEvent.date, nextEvent.time)} a las {formatEventTime(nextEvent.time)}
                  </Text>
                  
                  {nextEvent.description && (
                    <Text 
                      size="sm"
                      style={{ 
                        fontSize: rem(14),
                        opacity: 0.8,
                        lineHeight: 1.4
                      }}
                    >
                      {nextEvent.description}
                    </Text>
                  )}
                </Box>
                
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onClick={() => navigate('/calendario')}
                >
                  <IconCalendar size={20} />
                </ActionIcon>
              </Group>
            </Card>
          </Box>
        )}

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
            className="dashboard-actions-grid"
            cols={2} 
            spacing="md" 
            style={{ width: '100%' }}
            breakpoints={[
              { maxWidth: 'sm', cols: 1, spacing: 'sm' },
            ]}
          >
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className="quick-action-card"
                data-color={action.color}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  width: '100%',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(action.path)}
              >
                <Group gap="md" wrap="nowrap">
                  <Box
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: action.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(action.icon, { 
                      size: 24,
                      color: 'white'
                    })}
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
                      {action.title}
                    </Text>
                    <Text 
                      size="xs"
                      color="dimmed"
                      style={{ 
                        fontSize: rem(14)
                      }}
                    >
                      {action.subtitle}
                    </Text>
                  </Box>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Box>



        {/* Actividad reciente - Centrada */}
        <Box mt="xl" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
          <Group justify="space-between" mb="md">
            <Title 
              order={2}
              style={{ 
                fontSize: rem(24),
                fontWeight: 600,
                color: '#1e293b'
              }}
            >
              Actividad Reciente
            </Title>
            <Text 
              size="sm" 
              color="dimmed"
              style={{ 
                cursor: 'pointer',
                fontSize: rem(14)
              }}
            >
              Ver todo
            </Text>
          </Group>
          
          <Card
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {recentActivities.length > 0 ? (
              <Stack gap="md">
                {recentActivities.map((activity, index) => (
                  <Group 
                    key={activity.type + '-' + activity.id}
                    justify="space-between" 
                    wrap="wrap"
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: index % 2 === 0 ? '#f8fafc' : 'white',
                      border: '1px solid #e2e8f0',
                      width: '100%',
                    }}
                  >
                    <Group gap="md" wrap="nowrap">
                      <Box
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: activity.type === 'venta' 
                            ? '#dcfce7' 
                            : '#fee2e2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconReceipt 
                          size={24} 
                          color={activity.type === 'venta' ? '#16a34a' : '#dc2626'} 
                        />
                      </Box>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text 
                          size="sm" 
                          weight={500}
                          style={{ 
                            color: '#1e293b',
                            fontSize: rem(15),
                            marginBottom: '4px'
                          }}
                        >
                          {activity.description}
                        </Text>
                        <Text 
                          size="xs" 
                          color="dimmed"
                          style={{ 
                            fontSize: rem(13)
                          }}
                        >
                          {new Date(activity.date).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Group>
                    <Text 
                      size="sm" 
                      weight={600}
                      style={{ 
                        color: activity.type === 'venta' ? '#16a34a' : '#dc2626',
                        fontSize: rem(15)
                      }}
                    >
                      {formatCurrency(activity.amount)}
                    </Text>
                  </Group>
                ))}
              </Stack>
            ) : (
              <Box
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: '#64748b',
                }}
              >
                <IconCalendar size={64} color="#94a3b8" style={{ marginBottom: '24px' }} />
                <Text color="dimmed" style={{ fontSize: rem(16), fontWeight: 500, marginBottom: '8px' }}>
                  No hay actividad reciente
                </Text>
                <Text color="dimmed" size="sm" style={{ fontSize: rem(14) }}>
                  Comienza registrando ventas o gastos para ver tu actividad aquí
                </Text>
              </Box>
            )}
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 