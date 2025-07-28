import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Group,
  Stack,
  Text,
  rem,
  Image,
  Drawer,
  ScrollArea,
  Burger,
  useMantineTheme,
  Modal,
  ActionIcon,
  Card,
  Title,
  SimpleGrid,
} from '@mantine/core';
import {
  IconHome,
  IconBox,
  IconShoppingCart,
  IconReceipt,
  IconReport,
  IconSettings,
  IconTrendingDown,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconClock,
  IconBell,
  IconPlus,
} from '@tabler/icons-react';

// Estilos CSS personalizados para el layout - Comentado temporalmente
/*
const layoutStyles = `
  .main-content {
    transition: all 0.3s ease !important;
    margin: 0 auto !important;
  }
  
  @media (min-width: 1200px) {
    .main-content {
      margin-left: 280px !important;
      margin-right: 360px !important;
      width: calc(100vw - 640px) !important;
      max-width: 1200px !important;
      min-width: 800px !important;
    }
    
    .main-content.collapsed {
      margin-left: 120px !important;
      margin-right: 360px !important;
      width: calc(100vw - 480px) !important;
      max-width: 1400px !important;
      min-width: 800px !important;
    }
    
    .main-content.no-right-sidebar {
      margin-left: 280px !important;
      margin-right: 0 !important;
      width: calc(100vw - 280px) !important;
      max-width: 1400px !important;
      min-width: 800px !important;
    }
    
    .main-content.no-right-sidebar.collapsed {
      margin-left: 120px !important;
      margin-right: 0 !important;
      width: calc(100vw - 120px) !important;
      max-width: 1600px !important;
      min-width: 800px !important;
    }
  }
  
  @media (min-width: 768px) and (max-width: 1199px) {
    .main-content {
      margin-left: 280px !important;
      margin-right: 360px !important;
      width: calc(100vw - 640px) !important;
      max-width: 1000px !important;
      min-width: 600px !important;
    }
    
    .main-content.collapsed {
      margin-left: 120px !important;
      margin-right: 360px !important;
      width: calc(100vw - 480px) !important;
      max-width: 1200px !important;
      min-width: 600px !important;
    }
    
    .main-content.no-right-sidebar {
      margin-left: 280px !important;
      margin-right: 0 !important;
      width: calc(100vw - 280px) !important;
      max-width: 1200px !important;
      min-width: 600px !important;
    }
    
    .main-content.no-right-sidebar.collapsed {
      margin-left: 120px !important;
      margin-right: 0 !important;
      width: calc(100vw - 120px) !important;
      max-width: 1400px !important;
      min-width: 600px !important;
    }
  }
  
  @media (max-width: 767px) {
    .main-content {
      margin-left: 0 !important;
      margin-right: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: auto !important;
    }
  }
`;
*/

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: IconHome },
  { label: 'Inventario', path: '/inventario', icon: IconBox },
  { label: 'Ventas', path: '/ventas', icon: IconShoppingCart },
  { label: 'Gastos', path: '/gastos', icon: IconTrendingDown },
  { label: 'Facturas', path: '/facturas', icon: IconReceipt },
  { label: 'Calendario', path: '/calendario', icon: IconCalendar },
  { label: 'Reportes', path: '/reportes', icon: IconReport },
];

// Componente del panel lateral derecho
function RightSidebar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [eventsPerPage] = useState(8);
  const navigate = useNavigate();

  // Cargar eventos desde localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Agregar eventos del calendario tributario chileno 2025
      const calendarEvents = [
        // ENERO 2025
        {
          id: 'tax_jan_13',
          title: 'Vence F-29/F-50 sin pago - Diciembre 2024',
          description: 'Servicio de Impuestos Internos',
          date: '2025-01-13',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_jan_20',
          title: 'F-29 con pago electrónico - Diciembre 2024',
          description: 'Servicio de Impuestos Internos (beneficio día 20)',
          date: '2025-01-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_jan_31',
          title: 'Pago Patente Comercial 1er semestre + ISIF F-50',
          description: 'Las Condes - Servicio de Impuestos Internos',
          date: '2025-01-31',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '5_days',
        },
        
        // FEBRERO 2025
        {
          id: 'tax_feb_12',
          title: 'F-29/F-50 sin pago - Enero 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-02-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_feb_20',
          title: 'F-29 con pago electrónico - Enero 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-02-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        
        // MARZO 2025
        {
          id: 'tax_mar_3_28',
          title: 'Plazo principal Declaraciones Juradas',
          description: 'Res. Ex. SII 91/2024 - Servicio de Impuestos Internos',
          date: '2025-03-28',
          time: '23:59',
          type: 'reminder',
          priority: 'high',
          reminder: '7_days',
        },
        {
          id: 'tax_mar_12',
          title: 'F-29/F-50 sin pago - Febrero 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-03-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_mar_20',
          title: 'F-29 con pago electrónico - Febrero 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-03-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        
        // ABRIL 2025
        {
          id: 'tax_apr_1_30',
          title: 'Declaración de Renta (F-22)',
          description: 'Todas las empresas y personas naturales - SII',
          date: '2025-04-30',
          time: '23:59',
          type: 'reminder',
          priority: 'high',
          reminder: '7_days',
        },
        {
          id: 'tax_apr_14',
          title: 'F-29/F-50 sin pago - Marzo 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-04-14',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_apr_21',
          title: 'F-29 con pago electrónico - Marzo 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-04-21',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_apr_30',
          title: '1ª cuota Contribuciones de Bienes Raíces',
          description: 'ChileAtiende',
          date: '2025-04-30',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '5_days',
        },
        
        // MAYO 2025
        {
          id: 'tax_may_12',
          title: 'F-29/F-50 sin pago - Abril 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-05-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_may_16',
          title: 'Últimas DJ que vencen en mayo',
          description: 'Ej: 1837 - Servicio de Impuestos Internos',
          date: '2025-05-16',
          time: '23:59',
          type: 'reminder',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_may_20',
          title: 'F-29 con pago electrónico - Abril 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-05-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        
        // JUNIO 2025
        {
          id: 'tax_jun_12',
          title: 'F-29/F-50 sin pago - Mayo 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-06-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_jun_20',
          title: 'F-29 con pago electrónico - Mayo 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-06-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_jun_30',
          title: '2ª cuota Contribuciones + último bloque DJ',
          description: 'ChileAtiende - Servicio de Impuestos Internos',
          date: '2025-06-30',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '5_days',
        },
        
        // JULIO 2025
        {
          id: 'tax_jul_14',
          title: 'F-29/F-50 sin pago - Junio 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-07-14',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_jul_21',
          title: 'F-29 con pago electrónico - Junio 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-07-21',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_jul_31',
          title: 'Pago Patente Comercial 2º semestre',
          description: 'Portal Innova',
          date: '2025-07-31',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '5_days',
        },
        
        // AGOSTO 2025
        {
          id: 'tax_aug_12',
          title: 'F-29/F-50 sin pago - Julio 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-08-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_aug_20',
          title: 'F-29 con pago electrónico - Julio 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-08-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        
        // SEPTIEMBRE 2025
        {
          id: 'tax_sep_12',
          title: 'F-29/F-50 sin pago - Agosto 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-09-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_sep_22',
          title: 'F-29 con pago electrónico - Agosto 2025',
          description: 'Servicio de Impuestos Internos (trasladado por fin de semana)',
          date: '2025-09-22',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_sep_30',
          title: '3ª cuota Contribuciones de Bienes Raíces',
          description: 'ChileAtiende',
          date: '2025-09-30',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '5_days',
        },
        
        // OCTUBRE 2025
        {
          id: 'tax_oct_13',
          title: 'F-29/F-50 sin pago - Septiembre 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-10-13',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_oct_20',
          title: 'F-29 con pago electrónico - Septiembre 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-10-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        
        // NOVIEMBRE 2025
        {
          id: 'tax_nov_12',
          title: 'F-29/F-50 sin pago - Octubre 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-11-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_nov_20',
          title: 'F-29 con pago electrónico - Octubre 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-11-20',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        
        // DICIEMBRE 2025
        {
          id: 'tax_dec_1',
          title: '4ª cuota Contribuciones',
          description: 'ChileAtiende (trasladado por fin de semana)',
          date: '2025-12-01',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '5_days',
        },
        {
          id: 'tax_dec_12',
          title: 'F-29/F-50 sin pago - Noviembre 2025',
          description: 'Servicio de Impuestos Internos',
          date: '2025-12-12',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_dec_22',
          title: 'F-29 con pago electrónico - Noviembre 2025',
          description: 'Servicio de Impuestos Internos (trasladado por fin de semana)',
          date: '2025-12-22',
          time: '23:59',
          type: 'payment',
          priority: 'high',
          reminder: '3_days',
        },
        {
          id: 'tax_dec_31',
          title: 'Cierre ejercicio comercial 2025',
          description: 'Preparar antecedentes para Operación Renta 2026',
          date: '2025-12-31',
          time: '23:59',
          type: 'reminder',
          priority: 'high',
          reminder: '7_days',
        },
      ];
      
      setEvents(calendarEvents);
      localStorage.setItem('calendar_events', JSON.stringify(calendarEvents));
    }
  }, []);

  // Resetear página cuando cambie el mes
  useEffect(() => {
    setCurrentPage(0);
  }, [currentDate.getMonth(), currentDate.getFullYear()]);

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Convertir: 0 (domingo) = 7, 1 (lunes) = 1, 2 (martes) = 2, etc.
    const startingDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  // Función para obtener eventos del mes actual
  const getCurrentMonthEvents = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
  };

  // Función para obtener eventos paginados del mes actual
  const getPaginatedEvents = () => {
    const currentMonthEvents = getCurrentMonthEvents();
    return currentMonthEvents.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);
  };

  // Función para navegar a la página anterior
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  // Función para navegar a la página siguiente
  const goToNextPage = () => {
    const currentMonthEvents = getCurrentMonthEvents();
    const maxPage = Math.ceil(currentMonthEvents.length / eventsPerPage) - 1;
    setCurrentPage(prev => Math.min(maxPage, prev + 1));
  };

  const currentMonthEvents = getCurrentMonthEvents();
  const totalPages = Math.ceil(currentMonthEvents.length / eventsPerPage);
  const paginatedEvents = getPaginatedEvents();

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  return (
    <Box
      style={{
        width: '320px',
        minHeight: '100vh',
        background: 'white',
        borderLeft: '1px solid #e2e8f0',
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 50,
        overflowY: 'auto',
        padding: '20px 16px',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      }}
    >
      {/* Mini Calendario */}
      <Card
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '20px',
        }}
      >
        <Group justify="space-between" mb="md">
          <Text weight={600} style={{ color: '#1e293b', fontSize: rem(14), textTransform: 'uppercase' }}>
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </Text>
          <Group gap="xs">
            <ActionIcon 
              size="sm" 
              variant="subtle"
              style={{ color: '#64748b' }}
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            >
              <IconChevronLeft size={12} />
            </ActionIcon>
            <ActionIcon 
              size="sm" 
              variant="subtle"
              style={{ color: '#64748b' }}
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            >
              <IconChevronRight size={12} />
            </ActionIcon>
          </Group>
        </Group>
        
        {/* Grid del calendario */}
        <Box style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '0px',
          padding: '12px 0',
          rowGap: '0px'
        }}>
          {/* Días de la semana */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <Box
              key={day}
              style={{
                textAlign: 'center',
                padding: '4px 2px',
                fontSize: rem(9),
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {day}
            </Box>
          ))}
          
          {/* Días vacíos al inicio */}
          {Array.from({ length: startingDay - 1 }, (_, i) => (
            <Box key={`empty-${i}`} style={{ height: '24px' }} />
          ))}
          
          {/* Días del mes */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = day === new Date().getDate() && 
                           currentDate.getMonth() === new Date().getMonth() &&
                           currentDate.getFullYear() === new Date().getFullYear();
            const dayEvents = getEventsForDay(day);
            
            return (
              <Box
                key={day}
                style={{
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: rem(10),
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? 'white' : '#1e293b',
                  background: isToday ? '#3b82f6' : 'transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  width: '24px',
                  margin: '0 auto',
                }}
                onMouseEnter={(e) => {
                  if (!isToday) {
                    e.currentTarget.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isToday) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {day}
                {dayEvents.length > 0 && (
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      background: getEventTypeColor(dayEvents[0].type),
                      borderRadius: '50%',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Card>

      {/* Próximos Eventos */}
      <Card
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Group justify="space-between" mb="md">
          <Box>
            <Text weight={600} style={{ color: '#1e293b', fontSize: rem(14) }}>
              Mis Eventos
            </Text>
            <Text size="xs" color="dimmed" style={{ fontSize: rem(10) }}>
              {currentMonthEvents.length} eventos este mes
            </Text>
          </Box>
          <Group gap="xs">
            <ActionIcon
              size="sm"
              style={{
                background: '#3b82f6',
                color: 'white',
                borderRadius: '6px',
              }}
              onClick={() => navigate('/calendario')}
              title="Agregar evento"
            >
              <IconPlus size={12} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              style={{
                background: '#10b981',
                color: 'white',
                borderRadius: '6px',
              }}
              onClick={() => navigate('/calendario')}
              title="Ver todos los eventos"
            >
              <IconCalendar size={12} />
            </ActionIcon>
          </Group>
        </Group>
        
        <Stack gap="sm">
          {currentMonthEvents.length > 0 ? (
            <>
              {paginatedEvents.map(event => (
                  <Group 
                    key={event.id}
                    gap="xs"
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(2px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => navigate('/calendario')}
                  >
                    <Box
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        background: getEventTypeColor(event.type),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'white',
                        fontSize: rem(9),
                        fontWeight: 600,
                      }}
                    >
                      {new Date(event.date).getDate()}
                    </Box>
                    <Text 
                      size="xs" 
                      weight={500}
                      style={{ 
                        color: '#1e293b',
                        fontSize: rem(11),
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {event.title}
                    </Text>
                  </Group>
                ))}
              
              {/* Navegación de eventos */}
              {totalPages > 1 && (
                <Group justify="space-between" align="center" mt="sm">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    disabled={currentPage === 0}
                    onClick={goToPreviousPage}
                    style={{
                      color: currentPage === 0 ? '#cbd5e1' : '#64748b',
                      cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <IconChevronLeft size={14} />
                  </ActionIcon>
                  
                  <Text 
                    size="xs" 
                    color="dimmed"
                    style={{ 
                      fontSize: rem(10),
                      fontWeight: 500
                    }}
                  >
                    {currentPage + 1} de {totalPages}
                  </Text>
                  
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    disabled={currentPage === totalPages - 1}
                    onClick={goToNextPage}
                    style={{
                      color: currentPage === totalPages - 1 ? '#cbd5e1' : '#64748b',
                      cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <IconChevronRight size={14} />
                  </ActionIcon>
                </Group>
              )}
              
              {/* Botón para ver todos los eventos */}
              {currentMonthEvents.length > eventsPerPage && (
                <Box
                  style={{
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => navigate('/calendario')}
                >
                  <Text 
                    size="xs" 
                    weight={600}
                    style={{ 
                      color: '#3b82f6',
                      fontSize: rem(10)
                    }}
                  >
                    Ver todos los eventos
                  </Text>
                </Box>
              )}
            </>
          ) : (
            <Box
              style={{
                textAlign: 'center',
                padding: '24px 16px',
                color: '#64748b',
              }}
            >
              <IconCalendar size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <Text size="xs" color="dimmed" style={{ fontSize: rem(11) }}>
                No hay eventos
              </Text>
            </Box>
          )}
        </Stack>
      </Card>
    </Box>
  );
}

function SidebarMenu({ active, onSectionChange, collapsed, onToggleCollapse }) {
  const theme = useMantineTheme();
  return (
    <Box
      component="nav"
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: collapsed ? '24px 8px' : '24px 16px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo y título */}
      <Group mb="xl" style={{ justifyContent: 'center', flexDirection: 'column' }}>
        <Box
          style={{
            width: collapsed ? '48px' : '80px',
            height: collapsed ? '48px' : '80px',
            background: 'white',
            borderRadius: collapsed ? '12px' : '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            border: '3px solid rgba(255,255,255,0.3)',
            marginBottom: collapsed ? '8px' : '16px',
            transition: 'all 0.3s ease',
          }}
        >
          <Image 
            src="/logo-blanco.png" 
            alt="Logo NegocioListo" 
            width={collapsed ? 36 : 60} 
            height={collapsed ? 36 : 60} 
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(240deg) brightness(104%) contrast(97%)',
              transition: 'all 0.3s ease',
            }}
          />
        </Box>
        {!collapsed && (
          <Text 
            weight={800} 
            size="xl" 
            style={{ 
              color: 'white', 
              letterSpacing: 1.5, 
              fontSize: rem(20),
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            NegocioListo
          </Text>
        )}
      </Group>
      
      {/* Enlaces de navegación */}
      <Stack gap="xs" style={{ flex: 1 }}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = active === link.path;
          return (
            <Box
              key={link.path}
              onClick={() => onSectionChange && onSectionChange(link.path)}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  : 'transparent',
                borderRadius: theme.radius.md,
                padding: collapsed ? '12px' : '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                fontWeight: isActive ? 700 : 500,
                color: 'white',
                fontSize: rem(15),
                gap: collapsed ? 0 : 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                minHeight: '48px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <Icon 
                size={collapsed ? 20 : 18} 
                color={isActive ? 'white' : 'rgba(255,255,255,0.8)'} 
                style={{ 
                  filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
              {!collapsed && (
                <Text 
                  style={{ 
                    color: isActive ? 'white' : 'rgba(255,255,255,0.9)',
                    fontWeight: isActive ? 700 : 500,
                    textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </Text>
              )}
            </Box>
          );
        })}
      </Stack>
      
      {/* Configuración */}
      <Box
        onClick={() => onSectionChange && onSectionChange('/configuracion')}
        style={{
          background: active === '/configuracion' 
            ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' 
            : 'rgba(255,255,255,0.05)',
          borderRadius: theme.radius.md,
          padding: collapsed ? '12px' : '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          fontWeight: active === '/configuracion' ? 700 : 500,
          color: 'white',
          fontSize: rem(15),
          gap: collapsed ? 0 : 12,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: active === '/configuracion' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          boxShadow: active === '/configuracion' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
          transform: active === '/configuracion' ? 'translateX(4px)' : 'translateX(0)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: '16px',
          paddingTop: '20px',
          minHeight: '48px',
        }}
        onMouseEnter={(e) => {
          if (active !== '/configuracion') {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateX(4px)';
          }
        }}
        onMouseLeave={(e) => {
          if (active !== '/configuracion') {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }
        }}
      >
        <IconSettings 
          size={collapsed ? 20 : 18} 
          color={active === '/configuracion' ? 'white' : 'rgba(255,255,255,0.8)'} 
          style={{ 
            filter: active === '/configuracion' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
            transition: 'all 0.2s ease',
          }}
        />
        {!collapsed && (
          <Text 
            style={{ 
              color: active === '/configuracion' ? 'white' : 'rgba(255,255,255,0.9)',
              fontWeight: active === '/configuracion' ? 700 : 500,
              textShadow: active === '/configuracion' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Configuración
          </Text>
        )}
      </Box>
      
      {/* Botón de colapsar/expandir */}
      <Box
        onClick={onToggleCollapse}
        style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          marginTop: '16px',
          alignSelf: 'center',
          transition: 'all 0.2s ease',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <IconChevronLeft 
          size={20} 
          color="white" 
          style={{ 
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </Box>
    </Box>
  );
}

const Layout = () => {
  console.log('Layout component is loading...'); // Temporal para debugging
  const [menuOpened, setMenuOpened] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const theme = useMantineTheme();

  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpened(false);
  };

  // Calcular el ancho del sidebar dinámicamente
  const sidebarWidth = sidebarCollapsed ? 80 : 240;
  const rightSidebarWidth = 360;
  const isDesktop = windowWidth >= 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isMobile = windowWidth < 768;

  return (
    <Box style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar para desktop */}
      {isDesktop && (
        <Box
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            width: sidebarWidth,
            height: '100vh',
          }}
        >
          <SidebarMenu
            active={location.pathname}
            onSectionChange={handleNavigation}
            collapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
          />
        </Box>
      )}
      
      {/* Botón de menú para mobile */}
      {isMobile && (
        <Box
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 99999,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onClick={() => {
            setMenuOpened(true);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(59,130,246,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.3)';
          }}
        >
          <Burger
            opened={false}
            size="md"
            color="white"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        </Box>
      )}
      
      {/* Menú móvil elegante */}
      {menuOpened && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => {
            setMenuOpened(false);
          }}
        >
          <Box
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              padding: '32px 24px',
              borderRadius: '20px',
              maxWidth: '320px',
              width: '90%',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              position: 'relative',
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Header del menú */}
            <Group mb="xl" style={{ justifyContent: 'center' }}>
              <Image 
                src="/logo-blanco.png" 
                alt="Logo NegocioListo" 
                width={80} 
                height={80} 
                radius="md"
                style={{ 
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              />
              <Text 
                weight={800} 
                size="lg" 
                style={{ 
                  color: 'white', 
                  letterSpacing: 1,
                  fontSize: rem(20),
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                NegocioListo
              </Text>
            </Group>

            {/* Enlaces de navegación */}
            <Stack gap="xs" mb="lg">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Box
                    key={link.path}
                    onClick={() => {
                      handleNavigation(link.path);
                    }}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: isActive ? 700 : 500,
                      color: 'white',
                      fontSize: rem(16),
                      gap: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                      boxShadow: isActive ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                      transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <Icon 
                      size={22} 
                      color={isActive ? 'white' : 'rgba(255,255,255,0.8)'} 
                      style={{ 
                        filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                      }}
                    />
                    <Text 
                      style={{ 
                        color: isActive ? 'white' : 'rgba(255,255,255,0.9)',
                        fontWeight: isActive ? 700 : 500,
                        textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      {link.label}
                    </Text>
                  </Box>
                );
              })}
            </Stack>

            {/* Configuración */}
            <Box
              onClick={() => {
                handleNavigation('/configuracion');
              }}
              style={{
                background: location.pathname === '/configuracion' 
                  ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' 
                  : 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: location.pathname === '/configuracion' ? 700 : 500,
                color: 'white',
                fontSize: rem(16),
                gap: 16,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: location.pathname === '/configuracion' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                boxShadow: location.pathname === '/configuracion' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                transform: location.pathname === '/configuracion' ? 'translateX(4px)' : 'translateX(0)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                marginTop: '16px',
                paddingTop: '20px',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/configuracion') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/configuracion') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <IconSettings 
                size={22} 
                color={location.pathname === '/configuracion' ? 'white' : 'rgba(255,255,255,0.8)'} 
                style={{ 
                  filter: location.pathname === '/configuracion' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
                }}
              />
              <Text 
                style={{ 
                  color: location.pathname === '/configuracion' ? 'white' : 'rgba(255,255,255,0.9)',
                  fontWeight: location.pathname === '/configuracion' ? 700 : 500,
                  textShadow: location.pathname === '/configuracion' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                Configuración
              </Text>
            </Box>

            {/* Botón de cerrar */}
            <ActionIcon
              onClick={() => {
                setMenuOpened(false);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                background: 'rgba(239,68,68,0.9)',
                color: 'white',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.9)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <IconX size={20} style={{ display: 'block' }} />
            </ActionIcon>
          </Box>
        </Box>
      )}
      
      {/* Panel lateral derecho para desktop - oculto en página de calendario */}
      {isDesktop && location.pathname !== '/calendario' && (
        <Box
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            zIndex: 100,
            width: rightSidebarWidth,
            height: '100vh',
          }}
        >
          <RightSidebar />
        </Box>
      )}
      
      {/* Contenido principal */}
      <Box
        style={{
          marginLeft: isDesktop ? sidebarWidth : 0,
          marginRight: isDesktop && location.pathname !== '/calendario' ? rightSidebarWidth : 0,
          minHeight: '100vh',
          paddingTop: isMobile ? '80px' : '16px',
          paddingLeft: isMobile ? '12px' : '16px',
          paddingRight: isMobile ? '12px' : '16px',
          paddingBottom: isMobile ? '12px' : '16px',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease',
          width: isDesktop 
            ? `calc(100vw - ${sidebarWidth}px - ${location.pathname !== '/calendario' ? rightSidebarWidth : 0}px)` 
            : '100vw',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 