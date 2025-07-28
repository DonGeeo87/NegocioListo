import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Group,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Box,
  Button,
  Modal,
  TextInput,
  Select,
  Textarea,
  ActionIcon,
  Badge,
  useMantineTheme,
  rem,
  Grid,
  Paper,
  Divider,
} from '@mantine/core';
import {
  IconCalendar,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClock,
  IconMapPin,
  IconBell,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconSearch,
  IconFilter,
  IconSettings,
  IconDownload,
  IconShare,
} from '@tabler/icons-react';

const CalendarioPage = () => {
  const theme = useMantineTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'meeting',
    priority: 'medium',
    reminder: '1_hour',
  });

  // Cargar eventos desde localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar_events');
    if (savedEvents && JSON.parse(savedEvents).length > 0) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      } catch (error) {
        setEvents([]);
      }
    } else {
      // Inicializar eventos tributarios
      const calendarEvents = [
        // ENERO 2025
        { id: 'tax_jan_13', title: 'Vence F-29/F-50 sin pago - Diciembre 2024', description: 'Servicio de Impuestos Internos', date: '2025-01-13', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_jan_20', title: 'F-29 con pago electrónico - Diciembre 2024', description: 'Servicio de Impuestos Internos (beneficio día 20)', date: '2025-01-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_jan_31', title: 'Pago Patente Comercial 1er semestre + ISIF F-50', description: 'Las Condes - Servicio de Impuestos Internos', date: '2025-01-31', time: '23:59', type: 'payment', priority: 'high', reminder: '5_days' },
        // FEBRERO 2025
        { id: 'tax_feb_12', title: 'F-29/F-50 sin pago - Enero 2025', description: 'Servicio de Impuestos Internos', date: '2025-02-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_feb_20', title: 'F-29 con pago electrónico - Enero 2025', description: 'Servicio de Impuestos Internos', date: '2025-02-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        // MARZO 2025
        { id: 'tax_mar_3_28', title: 'Plazo principal Declaraciones Juradas', description: 'Res. Ex. SII 91/2024 - Servicio de Impuestos Internos', date: '2025-03-28', time: '23:59', type: 'reminder', priority: 'high', reminder: '7_days' },
        { id: 'tax_mar_12', title: 'F-29/F-50 sin pago - Febrero 2025', description: 'Servicio de Impuestos Internos', date: '2025-03-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_mar_20', title: 'F-29 con pago electrónico - Febrero 2025', description: 'Servicio de Impuestos Internos', date: '2025-03-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        // ABRIL 2025
        { id: 'tax_apr_1_30', title: 'Declaración de Renta (F-22)', description: 'Todas las empresas y personas naturales - SII', date: '2025-04-30', time: '23:59', type: 'reminder', priority: 'high', reminder: '7_days' },
        { id: 'tax_apr_14', title: 'F-29/F-50 sin pago - Marzo 2025', description: 'Servicio de Impuestos Internos', date: '2025-04-14', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_apr_21', title: 'F-29 con pago electrónico - Marzo 2025', description: 'Servicio de Impuestos Internos', date: '2025-04-21', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_apr_30', title: '1ª cuota Contribuciones de Bienes Raíces', description: 'ChileAtiende', date: '2025-04-30', time: '23:59', type: 'payment', priority: 'high', reminder: '5_days' },
        // MAYO 2025
        { id: 'tax_may_12', title: 'F-29/F-50 sin pago - Abril 2025', description: 'Servicio de Impuestos Internos', date: '2025-05-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_may_16', title: 'Últimas DJ que vencen en mayo', description: 'Ej: 1837 - Servicio de Impuestos Internos', date: '2025-05-16', time: '23:59', type: 'reminder', priority: 'high', reminder: '3_days' },
        { id: 'tax_may_20', title: 'F-29 con pago electrónico - Abril 2025', description: 'Servicio de Impuestos Internos', date: '2025-05-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        // JUNIO 2025
        { id: 'tax_jun_12', title: 'F-29/F-50 sin pago - Mayo 2025', description: 'Servicio de Impuestos Internos', date: '2025-06-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_jun_20', title: 'F-29 con pago electrónico - Mayo 2025', description: 'Servicio de Impuestos Internos', date: '2025-06-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_jun_30', title: '2ª cuota Contribuciones + último bloque DJ', description: 'ChileAtiende - Servicio de Impuestos Internos', date: '2025-06-30', time: '23:59', type: 'payment', priority: 'high', reminder: '5_days' },
        // JULIO 2025
        { id: 'tax_jul_14', title: 'F-29/F-50 sin pago - Junio 2025', description: 'Servicio de Impuestos Internos', date: '2025-07-14', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_jul_21', title: 'F-29 con pago electrónico - Junio 2025', description: 'Servicio de Impuestos Internos', date: '2025-07-21', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_jul_31', title: 'Pago Patente Comercial 2º semestre', description: 'Portal Innova', date: '2025-07-31', time: '23:59', type: 'payment', priority: 'high', reminder: '5_days' },
        // AGOSTO 2025
        { id: 'tax_aug_12', title: 'F-29/F-50 sin pago - Julio 2025', description: 'Servicio de Impuestos Internos', date: '2025-08-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_aug_20', title: 'F-29 con pago electrónico - Julio 2025', description: 'Servicio de Impuestos Internos', date: '2025-08-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        // SEPTIEMBRE 2025
        { id: 'tax_sep_12', title: 'F-29/F-50 sin pago - Agosto 2025', description: 'Servicio de Impuestos Internos', date: '2025-09-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_sep_22', title: 'F-29 con pago electrónico - Agosto 2025', description: 'Servicio de Impuestos Internos (trasladado por fin de semana)', date: '2025-09-22', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_sep_30', title: '3ª cuota Contribuciones de Bienes Raíces', description: 'ChileAtiende', date: '2025-09-30', time: '23:59', type: 'payment', priority: 'high', reminder: '5_days' },
        // OCTUBRE 2025
        { id: 'tax_oct_13', title: 'F-29/F-50 sin pago - Septiembre 2025', description: 'Servicio de Impuestos Internos', date: '2025-10-13', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_oct_20', title: 'F-29 con pago electrónico - Septiembre 2025', description: 'Servicio de Impuestos Internos', date: '2025-10-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        // NOVIEMBRE 2025
        { id: 'tax_nov_12', title: 'F-29/F-50 sin pago - Octubre 2025', description: 'Servicio de Impuestos Internos', date: '2025-11-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_nov_20', title: 'F-29 con pago electrónico - Octubre 2025', description: 'Servicio de Impuestos Internos', date: '2025-11-20', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        // DICIEMBRE 2025
        { id: 'tax_dec_1', title: '4ª cuota Contribuciones', description: 'ChileAtiende (trasladado por fin de semana)', date: '2025-12-01', time: '23:59', type: 'payment', priority: 'high', reminder: '5_days' },
        { id: 'tax_dec_12', title: 'F-29/F-50 sin pago - Noviembre 2025', description: 'Servicio de Impuestos Internos', date: '2025-12-12', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_dec_22', title: 'F-29 con pago electrónico - Noviembre 2025', description: 'Servicio de Impuestos Internos (trasladado por fin de semana)', date: '2025-12-22', time: '23:59', type: 'payment', priority: 'high', reminder: '3_days' },
        { id: 'tax_dec_31', title: 'Cierre ejercicio comercial 2025', description: 'Preparar antecedentes para Operación Renta 2026', date: '2025-12-31', time: '23:59', type: 'reminder', priority: 'high', reminder: '7_days' },
      ];
      setEvents(calendarEvents);
      localStorage.setItem('calendar_events', JSON.stringify(calendarEvents));
    }
  }, []);

  // Guardar eventos en localStorage
  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEventsForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return events.filter(event => {
      if (!event.date) return false;
      const [evYear, evMonth, evDay] = event.date.split('-');
      const normalized = `${evYear}-${String(evMonth).padStart(2, '0')}-${String(evDay).padStart(2, '0')}`;
      return normalized === dateStr;
    });
  };

  // Obtener eventos del mes actual agrupados por fecha
  const getCurrentMonthEventsGrouped = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const monthEvents = events.filter(event => {
      if (!event.date) return false;
      const [evYear, evMonth] = event.date.split('-');
      return evYear === String(year) && String(evMonth).padStart(2, '0') === month;
    }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

    // Agrupar por fecha
    const grouped = {};
    monthEvents.forEach(event => {
      const dateKey = event.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  };

  // Obtener eventos próximos y vencidos para el sidebar
  const getEventsForSidebar = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const upcomingEvents = [];
    const pastEvents = [];
    
    events.forEach(event => {
      if (!event.date) return;
      
      const eventDate = new Date(event.date + ' ' + (event.time || '00:00'));
      const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      if (eventDay >= today) {
        upcomingEvents.push(event);
      } else {
        pastEvents.push(event);
      }
    });
    
    // Ordenar eventos próximos por fecha ascendente
    upcomingEvents.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
      const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
      return dateA - dateB;
    });
    
    // Ordenar eventos vencidos por fecha descendente (más recientes primero)
    pastEvents.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
      const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
      return dateB - dateA;
    });
    
    return { upcomingEvents, pastEvents };
  };

  // Agrupar eventos por fecha para mostrar en el sidebar
  const groupEventsByDate = (eventsList) => {
    const grouped = {};
    eventsList.forEach(event => {
      const dateKey = event.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      time: '',
      type: 'meeting',
      priority: 'medium',
      reminder: '1_hour',
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      priority: event.priority,
      reminder: event.reminder,
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      ...eventForm,
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingEvent) {
      setEvents(events.map(event => event.id === editingEvent.id ? newEvent : event));
    } else {
      setEvents([...events, newEvent]);
    }

    setShowEventModal(false);
    setEditingEvent(null);
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

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981',
    };
    return colors[priority] || colors.medium;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
    return `${day} ${dayName}`;
  };

  const formatRelativeDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = eventDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Mañana';
    } else if (diffDays > 1 && diffDays <= 7) {
      return `En ${diffDays} días`;
    } else if (diffDays < 0) {
      return `Hace ${Math.abs(diffDays)} días`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const groupedEvents = getCurrentMonthEventsGrouped();
  const { upcomingEvents, pastEvents } = getEventsForSidebar();
  const upcomingGrouped = groupEventsByDate(upcomingEvents.slice(0, 10)); // Mostrar solo los próximos 10
  const pastGrouped = groupEventsByDate(pastEvents.slice(0, 5)); // Mostrar solo los 5 vencidos más recientes

  return (
    <div className="calendario-container">
      {/* Header */}
      <Box mb="xl" style={{ textAlign: 'center' }}>
        <Title 
          order={1} 
          style={{ 
            fontSize: rem(32),
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '8px'
          }}
        >
          Calendario
        </Title>
        <Text 
          size="lg" 
          color="dimmed"
          style={{ 
            fontSize: rem(16),
            color: '#64748b'
          }}
        >
          Gestiona tus eventos y recordatorios importantes
        </Text>
      </Box>

      {/* Panel Izquierdo - Lista de Eventos */}
      <div className="calendario-events-panel">
        <Paper
          shadow="sm"
          radius="lg"
          p="xl"
          style={{
            background: 'white',
            height: 'fit-content',
            position: 'sticky',
            top: '16px'
          }}
        >
          {/* Navegación independiente del sidebar */}
          <Group justify="space-between" mb="lg">
            <Title order={3} style={{ fontSize: rem(20), fontWeight: 600 }}>
              Eventos
            </Title>
            <Group gap="xs">
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => {
                  const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                  setCurrentDate(newDate);
                }}
              >
                <IconChevronLeft size={16} />
              </ActionIcon>
              <Text size="sm" style={{ fontSize: rem(12), color: '#64748b' }}>
                {currentDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
              </Text>
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => {
                  const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                  setCurrentDate(newDate);
                }}
              >
                <IconChevronRight size={16} />
              </ActionIcon>
            </Group>
          </Group>

          <Stack gap="lg">
            {/* Eventos Próximos */}
            <Box>
              <Group justify="space-between" mb="md">
                <Text 
                  size="sm" 
                  weight={600}
                  style={{ 
                    color: '#1e293b',
                    fontSize: rem(14),
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Próximos ({upcomingEvents.length})
                </Text>
                <Badge size="xs" style={{ background: '#10b981', color: 'white' }}>
                  {Object.keys(upcomingGrouped).length} días
                </Badge>
              </Group>

              {Object.keys(upcomingGrouped).length > 0 ? (
                <Stack gap="md">
                  {Object.entries(upcomingGrouped).map(([date, dayEvents]) => (
                    <Box key={date}>
                      <Text 
                        size="xs" 
                        weight={600}
                        style={{ 
                          color: '#64748b',
                          marginBottom: '6px',
                          fontSize: rem(11),
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {formatRelativeDate(date)} • {formatDate(date)}
                      </Text>
                      
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className="calendario-event-card"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Group gap="xs" align="flex-start">
                            <Box
                              style={{
                                width: '8px',
                                height: '100%',
                                background: getEventTypeColor(event.type),
                                borderRadius: '4px',
                                flexShrink: 0
                              }}
                            />
                            
                            <Box style={{ flex: 1, minWidth: 0 }}>
                              <Text 
                                size="sm" 
                                weight={600}
                                style={{ 
                                  color: '#1e293b',
                                  marginBottom: '4px',
                                  lineHeight: 1.3
                                }}
                                truncate
                              >
                                {event.title}
                              </Text>
                              
                              {event.description && (
                                <Text 
                                  size="xs" 
                                  color="dimmed"
                                  style={{ 
                                    marginBottom: '4px',
                                    lineHeight: 1.3
                                  }}
                                  lineClamp={2}
                                >
                                  {event.description}
                                </Text>
                              )}
                              
                              <Group gap="xs" align="center">
                                <Group gap={4} align="center">
                                  <IconClock size={12} style={{ color: '#64748b' }} />
                                  <Text size="xs" color="dimmed">
                                    {formatTime(event.time)}
                                  </Text>
                                </Group>
                                
                                <Badge
                                  size="xs"
                                  style={{
                                    background: getPriorityColor(event.priority),
                                    color: 'white',
                                    fontSize: '10px'
                                  }}
                                >
                                  {event.priority}
                                </Badge>
                              </Group>
                            </Box>
                          </Group>
                        </div>
                      ))}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box style={{ textAlign: 'center', padding: '20px' }}>
                  <Text size="sm" color="dimmed">
                    No hay eventos próximos
                  </Text>
                </Box>
              )}
            </Box>

            {/* Eventos Vencidos */}
            {Object.keys(pastGrouped).length > 0 && (
              <Box>
                <Divider mb="md" />
                <Group justify="space-between" mb="md">
                  <Text 
                    size="sm" 
                    weight={600}
                    style={{ 
                      color: '#64748b',
                      fontSize: rem(14),
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Vencidos ({pastEvents.length})
                  </Text>
                  <Badge size="xs" style={{ background: '#64748b', color: 'white' }}>
                    {Object.keys(pastGrouped).length} días
                  </Badge>
                </Group>

                <Stack gap="md">
                  {Object.entries(pastGrouped).map(([date, dayEvents]) => (
                    <Box key={date}>
                      <Text 
                        size="xs" 
                        weight={600}
                        style={{ 
                          color: '#94a3b8',
                          marginBottom: '6px',
                          fontSize: rem(11),
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {formatRelativeDate(date)} • {formatDate(date)}
                      </Text>
                      
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className="calendario-event-card"
                          style={{
                            opacity: 0.7,
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0'
                          }}
                          onClick={() => handleEditEvent(event)}
                        >
                          <Group gap="xs" align="flex-start">
                            <Box
                              style={{
                                width: '8px',
                                height: '100%',
                                background: '#94a3b8',
                                borderRadius: '4px',
                                flexShrink: 0
                              }}
                            />
                            
                            <Box style={{ flex: 1, minWidth: 0 }}>
                              <Text 
                                size="sm" 
                                weight={600}
                                style={{ 
                                  color: '#64748b',
                                  marginBottom: '4px',
                                  lineHeight: 1.3
                                }}
                                truncate
                              >
                                {event.title}
                              </Text>
                              
                              {event.description && (
                                <Text 
                                  size="xs" 
                                  color="dimmed"
                                  style={{ 
                                    marginBottom: '4px',
                                    lineHeight: 1.3
                                  }}
                                  lineClamp={2}
                                >
                                  {event.description}
                                </Text>
                              )}
                              
                              <Group gap="xs" align="center">
                                <Group gap={4} align="center">
                                  <IconClock size={12} style={{ color: '#94a3b8' }} />
                                  <Text size="xs" color="dimmed">
                                    {formatTime(event.time)}
                                  </Text>
                                </Group>
                                
                                <Badge
                                  size="xs"
                                  style={{
                                    background: '#94a3b8',
                                    color: 'white',
                                    fontSize: '10px'
                                  }}
                                >
                                  Vencido
                                </Badge>
                              </Group>
                            </Box>
                          </Group>
                        </div>
                      ))}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Estado vacío */}
            {Object.keys(upcomingGrouped).length === 0 && Object.keys(pastGrouped).length === 0 && (
              <Box style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Text size="xl" style={{ fontSize: rem(48), marginBottom: '16px', opacity: 0.6 }}>
                  📅
                </Text>
                <Text size="sm" color="dimmed">
                  No hay eventos programados
                </Text>
              </Box>
            )}
          </Stack>
        </Paper>
      </div>

      {/* Panel Central - Calendario */}
      <div className="calendario-main-panel">
        <Paper
          shadow="sm"
          radius="lg"
          p="xl"
          style={{ background: 'white' }}
        >
          {/* Navegación del mes */}
          <Group justify="space-between" mb="xl">
            <Group gap="md">
              <ActionIcon
                size="lg"
                variant="subtle"
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                }}
              >
                <IconChevronLeft size={20} />
              </ActionIcon>
              
              <Title order={2} style={{ fontSize: rem(24), fontWeight: 700 }}>
                {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </Title>
              
              <ActionIcon
                size="lg"
                variant="subtle"
                onClick={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                }}
              >
                <IconChevronRight size={20} />
              </ActionIcon>
            </Group>

            <Group gap="xs">
              <Button
                size="sm"
                variant={viewMode === 'month' ? 'filled' : 'light'}
                onClick={() => setViewMode('month')}
              >
                Mes
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'week' ? 'filled' : 'light'}
                onClick={() => setViewMode('week')}
              >
                Semana
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'day' ? 'filled' : 'light'}
                onClick={() => setViewMode('day')}
              >
                Día
              </Button>
            </Group>
          </Group>

          {/* Grid del calendario */}
          <div className="calendario-grid">
            {/* Días de la semana */}
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="calendario-day-header">
                {day}
              </div>
            ))}
            
            {/* Días vacíos al inicio */}
            {Array.from({ length: startingDay - 1 }, (_, i) => (
              <div key={`empty-${i}`} style={{ height: '100px' }} />
            ))}
            
            {/* Días del mes */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().toDateString() === currentDayDate.toDateString();
              const isSelected = selectedDate && selectedDate.toDateString() === currentDayDate.toDateString();
              
              return (
                <div
                  key={day}
                  className={`calendario-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDate(currentDayDate);
                    setEventForm({ ...eventForm, date: currentDayDate.toISOString().split('T')[0] });
                  }}
                >
                  <Text
                    size="sm"
                    weight={isToday ? 700 : 500}
                    style={{
                      color: isToday ? '#92400e' : '#1e293b',
                      marginBottom: '4px'
                    }}
                  >
                    {day}
                  </Text>
                  
                  <Stack gap={2}>
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="calendario-event"
                        style={{ background: getEventTypeColor(event.type) }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    
                    {dayEvents.length > 2 && (
                      <Text
                        size="xs"
                        color="dimmed"
                        style={{ textAlign: 'center' }}
                      >
                        +{dayEvents.length - 2} más
                      </Text>
                    )}
                  </Stack>
                </div>
              );
            })}
          </div>
        </Paper>
      </div>

      {/* Panel Inferior - Opciones y Acciones */}
      <div className="calendario-options-panel">
        <Paper
          shadow="sm"
          radius="lg"
          p="xl"
          style={{ background: 'white' }}
        >
          <Group justify="space-between" align="center" style={{ width: '100%' }}>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleAddEvent}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white'
              }}
            >
              Nuevo Evento
            </Button>
            
            <Button
              variant="light"
              leftSection={<IconSearch size={16} />}
            >
              Buscar Eventos
            </Button>
            
            <Button
              variant="light"
              leftSection={<IconFilter size={16} />}
            >
              Filtros
            </Button>
            
            <Button
              variant="subtle"
              leftSection={<IconDownload size={16} />}
            >
              Exportar
            </Button>
            
            <Button
              variant="subtle"
              leftSection={<IconShare size={16} />}
            >
              Compartir
            </Button>
            
            <Button
              variant="subtle"
              leftSection={<IconSettings size={16} />}
            >
              Configuración
            </Button>
          </Group>
        </Paper>
      </div>

      {/* Modal para agregar/editar evento */}
      <Modal
        opened={showEventModal}
        onClose={() => setShowEventModal(false)}
        title={editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        size="md"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Título del evento"
            placeholder="Ej: Reunión con cliente"
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            required
          />
          
          <Textarea
            label="Descripción"
            placeholder="Detalles del evento..."
            value={eventForm.description}
            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            rows={3}
          />
          
          <Group grow>
            <TextInput
              label="Fecha"
              type="date"
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              required
            />
            <TextInput
              label="Hora"
              type="time"
              value={eventForm.time}
              onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              required
            />
          </Group>
          
          <Group grow>
            <Select
              label="Tipo de evento"
              value={eventForm.type}
              onChange={(value) => setEventForm({ ...eventForm, type: value })}
              data={[
                { value: 'meeting', label: 'Reunión' },
                { value: 'payment', label: 'Pago' },
                { value: 'inventory', label: 'Inventario' },
                { value: 'birthday', label: 'Cumpleaños' },
                { value: 'reminder', label: 'Recordatorio' },
                { value: 'other', label: 'Otro' },
              ]}
            />
            <Select
              label="Prioridad"
              value={eventForm.priority}
              onChange={(value) => setEventForm({ ...eventForm, priority: value })}
              data={[
                { value: 'high', label: 'Alta' },
                { value: 'medium', label: 'Media' },
                { value: 'low', label: 'Baja' },
              ]}
            />
          </Group>
          
          <Select
            label="Recordatorio"
            value={eventForm.reminder}
            onChange={(value) => setEventForm({ ...eventForm, reminder: value })}
            data={[
              { value: '15_min', label: '15 minutos antes' },
              { value: '30_min', label: '30 minutos antes' },
              { value: '1_hour', label: '1 hora antes' },
              { value: '1_day', label: '1 día antes' },
              { value: '1_week', label: '1 semana antes' },
            ]}
          />
          
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => setShowEventModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEvent}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white'
              }}
            >
              {editingEvent ? 'Actualizar' : 'Crear'} Evento
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default CalendarioPage; 