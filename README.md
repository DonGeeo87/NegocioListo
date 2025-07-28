# 📊 NegocioListo - Web v0.1

**Sistema completo de gestión empresarial para pymes chilenas**

Una aplicación web moderna y responsiva diseñada específicamente para pequeñas y medianas empresas chilenas. NegocioListo ofrece una solución integral para gestionar inventario, ventas, gastos, facturación y calendario tributario desde una sola plataforma.

## 🎯 Características Principales

### 📈 **Dashboard Inteligente**
- Resumen visual de ingresos, egresos y balance en tiempo real
- Estadísticas principales con métricas clave del negocio
- Acciones rápidas para tareas frecuentes
- Actividad reciente de ventas y gastos
- Próximo evento destacado del calendario

### 📅 **Calendario Tributario**
- Gestión completa de eventos y recordatorios
- Eventos pre-cargados del calendario tributario chileno 2025
- Navegación independiente por meses
- Panel lateral con eventos próximos y vencidos
- Vista de matriz de calendario con 3 paneles

### 📦 **Gestión de Inventario**
- Control completo de productos con CRUD
- Categorización y organización de productos
- Control de stock y precios
- Búsqueda y filtros avanzados
- Vista en grid responsivo

### 💰 **Sistema de Ventas**
- Registro detallado de ventas
- Múltiples productos por venta
- Historial completo de transacciones
- Filtros por fecha y estado
- Exportación de datos

### 💸 **Control de Gastos**
- Registro de gastos por categorías
- Seguimiento de costos operativos
- Historial detallado de egresos
- Reportes por categoría y período

### 📄 **Facturación Profesional**
- Generación de facturas en PDF
- Plantillas personalizables
- Numeración automática
- Datos de empresa configurables
- Exportación directa

### 📊 **Reportes Avanzados**
- Ventas mensuales con gráficos
- Gastos por categoría
- Ranking de clientes y productos
- Comparación ventas vs gastos
- Exportación en múltiples formatos

### ⚙️ **Configuración Empresarial**
- Datos de la empresa
- Configuración de facturación
- Preferencias del sistema
- Backup y restauración

## 🛠️ Stack Técnico

### **Frontend**
- **Framework**: React 18 + Vite
- **UI Library**: Mantine v7 (componentes modernos)
- **Estilos**: CSS Modules + Variables CSS personalizadas
- **Iconos**: Tabler Icons
- **Gráficos**: Chart.js + react-chartjs-2

### **Persistencia y Datos**
- **Almacenamiento**: localStorage (offline-first)
- **PDF**: jsPDF + jspdf-autotable
- **PWA**: Service Workers para funcionalidad offline

### **Diseño y UX**
- **Responsive**: Mobile-first design
- **Accesibilidad**: WCAG 2.1 compliant
- **Performance**: Optimizado para velocidad
- **PWA**: Instalable como app nativa

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18+ 
- npm 9+ o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/negociolisto.git
cd negociolisto

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

### Uso
1. Abre `http://localhost:5173` en tu navegador
2. Configura los datos de tu empresa
3. Comienza agregando productos al inventario
4. Registra ventas y gastos
5. Genera facturas profesionales
6. Monitorea tu negocio desde el dashboard

## 📱 Uso en Móvil (PWA)

### Instalación
- **Chrome/Edge**: Toca el ícono de instalación en la barra de direcciones
- **Safari**: Toca "Compartir" → "Agregar a pantalla de inicio"
- **Firefox**: Toca el ícono de instalación en la barra de direcciones

### Funcionalidades Offline
- Acceso completo sin conexión
- Sincronización automática al reconectar
- Datos guardados localmente

## 🎨 Sistema de Diseño

### **Paleta de Colores**
- **Azul Principal**: #009fe3 (brand color)
- **Morado Secundario**: #312783 (accent color)
- **Gris Claro**: #f8fafc (background)
- **Gris Medio**: #64748b (text secondary)
- **Gris Oscuro**: #1e293b (text primary)

### **Tipografía**
- **Títulos**: Inter, sans-serif (700-900 weight)
- **Cuerpo**: Inter, sans-serif (400-500 weight)
- **Monospace**: JetBrains Mono (para datos)

### **Componentes**
- **Cards**: Bordes redondeados, sombras suaves
- **Botones**: Gradientes, hover effects
- **Formularios**: Validación en tiempo real
- **Tablas**: Responsive, ordenamiento

## 📋 Estructura del Proyecto

```
src/
├── components/
│   ├── Calendario/
│   │   ├── CalendarioPage.jsx
│   │   └── CalendarioPage.css
│   ├── common/
│   │   ├── Loader.jsx
│   │   ├── Loader.css
│   │   ├── Toast.jsx
│   │   └── Toast.css
│   ├── Configuracion/
│   │   ├── ConfiguracionPage.jsx
│   │   └── ConfiguracionPage.css
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── StatWidget.jsx
│   │   └── WidgetGrid.jsx
│   ├── Facturas/
│   │   ├── FacturasPage.jsx
│   │   ├── FacturasPage.css
│   │   ├── InvoiceForm.jsx
│   │   ├── InvoiceForm.css
│   │   ├── InvoiceList.jsx
│   │   └── InvoiceList.css
│   ├── Gastos/
│   │   ├── GastosPage.jsx
│   │   ├── GastosPage.css
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseForm.css
│   │   ├── ExpenseList.jsx
│   │   └── ExpenseList.css
│   ├── Inventario/
│   │   ├── ProductCard.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProductList.jsx
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   └── Layout.jsx
│   ├── Reportes/
│   │   ├── ReportesPage.jsx
│   │   ├── ReportesPage.css
│   │   └── tabs/
│   │       ├── GastosPorCategoriaReporte.jsx
│   │       ├── RankingClientesReporte.jsx
│   │       ├── RankingProductosReporte.jsx
│   │       ├── VentasMensualesReporte.jsx
│   │       └── VentasVsGastosReporte.jsx
│   └── Ventas/
│       ├── VentasPage.jsx
│       ├── VentasPage.css
│       ├── SaleForm.jsx
│       ├── SaleForm.css
│       ├── SaleList.jsx
│       └── SaleList.css
├── services/
│   ├── ExpensesService.js
│   ├── InventarioService.js
│   ├── InvoicesService.js
│   ├── NotificationService.js
│   └── SalesService.js
├── styles/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🔄 Funcionalidades Implementadas (v0.1)

### ✅ **Completado**
- [x] Dashboard con estadísticas y métricas
- [x] Sistema de calendario con eventos tributarios
- [x] Gestión completa de inventario (CRUD)
- [x] Registro y seguimiento de ventas
- [x] Control de gastos por categorías
- [x] Generación de facturas en PDF
- [x] Reportes con gráficos interactivos
- [x] Configuración empresarial
- [x] Diseño responsive y PWA
- [x] Sidebar de calendario con navegación
- [x] Sistema de diseño unificado
- [x] Moneda CLP integrada
- [x] Eventos tributarios chilenos 2025

### 🚧 **En Desarrollo**
- [ ] Sincronización en la nube
- [ ] Múltiples usuarios/negocios
- [ ] Notificaciones push
- [ ] Exportación avanzada de datos
- [ ] Integración con APIs tributarias

### 📋 **Próximas Funcionalidades**
- [ ] Backup automático en la nube
- [ ] Módulo de clientes
- [ ] Sistema de alertas de stock
- [ ] Integración con bancos
- [ ] App móvil nativa

## 🌟 Características Destacadas

### **Calendario Tributario Inteligente**
- Eventos pre-cargados del SII 2025
- Recordatorios automáticos
- Navegación independiente por meses
- Separación de eventos próximos y vencidos

### **Dashboard Profesional**
- Métricas en tiempo real
- Gráficos interactivos
- Acciones rápidas
- Próximo evento destacado

### **Sistema de Diseño Unificado**
- Variables CSS centralizadas
- Componentes reutilizables
- Consistencia visual en toda la app
- Paleta de colores profesional

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Guías de Contribución**
- Sigue el sistema de diseño establecido
- Mantén la consistencia con el código existente
- Documenta nuevas funcionalidades
- Prueba en múltiples dispositivos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- 📧 Email: ginterdonatop@gmail.com
- 📱 WhatsApp: +56 9 396 88275
- 🌐 Web: https://negociolisto.app (por adquirir)

## 🏆 Reconocimientos

- **Mantine**: Por su excelente biblioteca de componentes
- **Tabler Icons**: Por los iconos profesionales
- **Chart.js**: Por las capacidades de visualización
- **Comunidad React**: Por el ecosistema robusto

---

**Desarrollado con ❤️ para emprendedores chilenos**

*NegocioListo Web v0.1 - Sistema completo de gestión empresarial*
