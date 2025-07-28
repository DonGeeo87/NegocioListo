import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Inventario/ProductList';
import VentasPage from './components/Ventas/VentasPage';
import GastosPage from './components/Gastos/GastosPage';
import FacturasPage from './components/Facturas/FacturasPage';
import ConfiguracionPage from './components/Configuracion/ConfiguracionPage';
import ReportesPage from './components/Reportes/ReportesPage';
import CalendarioPage from './components/Calendario/CalendarioPage';
import { NotificationService } from './services/NotificationService.js';
// import './styles/variables.css';
// import './styles/base.css';
import './App.css'; // Reactivado con protección contra iconos gigantes

function App() {
  useEffect(() => {
    // Inicializar notificaciones
    const initNotifications = async () => {
      try {
        await NotificationService.requestPermission();
        NotificationService.setupAutomaticReminders();
      } catch (error) {
        console.log('Error inicializando notificaciones:', error);
      }
    };

    initNotifications();
  }, []);

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventario" element={<ProductList />} />
              <Route path="/ventas" element={<VentasPage />} />
              <Route path="/gastos" element={<GastosPage />} />
              <Route path="/facturas" element={<FacturasPage />} />
              <Route path="/calendario" element={<CalendarioPage />} />
              <Route path="/reportes" element={<ReportesPage />} />
              <Route path="/configuracion" element={<ConfiguracionPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
