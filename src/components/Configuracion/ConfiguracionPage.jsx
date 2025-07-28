import React, { useState, useEffect } from 'react';
import './ConfiguracionPage.css';
import Toast from '../common/Toast';

const CONFIG_KEY = 'configuracion_empresa';

const defaultConfig = {
  nombre: 'Mi Negocio',
  rut: '',
  direccion: '',
  telefono: '',
  logo: '',
  pais: 'Chile',
  moneda: 'CLP',
  iva: 19
};

const ConfiguracionPage = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [logoPreview, setLogoPreview] = useState('');
  const [toast, setToast] = useState(null);
  const [showBackupHelp, setShowBackupHelp] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        setLogoPreview(parsed.logo || '');
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setConfig(prev => ({ ...prev, logo: ev.target.result }));
        setLogoPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    setToast({ message: 'Configuración guardada correctamente', type: 'success' });
  };

  const handleCargarDatosPrueba = () => {
    if (!window.confirm('¿Estás seguro de que quieres cargar datos de prueba? Esto sobreescribirá los datos actuales.')) return;
    
    const productos = [
      { id: '1', nombre: 'Café', descripcion: 'Café en grano premium', categoria: 'Bebidas', precio: 5000, stock: 30, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', nombre: 'Té', descripcion: 'Té verde importado', categoria: 'Bebidas', precio: 3500, stock: 20, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', nombre: 'Azúcar', descripcion: 'Azúcar blanca 1kg', categoria: 'Alimentos', precio: 1200, stock: 50, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    
    const ventas = [
      { id: '1', cliente: 'Juan Pérez', productos: [{ id: '1', nombre: 'Café', cantidad: 2, precio: 5000 }], total: 10000, fecha: new Date().toISOString() },
      { id: '2', cliente: 'Ana López', productos: [{ id: '2', nombre: 'Té', cantidad: 1, precio: 3500 }], total: 3500, fecha: new Date().toISOString() },
    ];
    
    const gastos = [
      { id: '1', categoria: 'Servicios', descripcion: 'Internet', monto: 20000, fecha: new Date().toISOString() },
      { id: '2', categoria: 'Insumos', descripcion: 'Vasos descartables', monto: 5000, fecha: new Date().toISOString() },
    ];
    
    const facturas = [
      {
        id: '1',
        numero: 1,
        cliente: 'Juan Pérez',
        clienteDatos: {
          correo: 'juan.perez@email.com',
          telefono: '+56 9 1234 5678',
          direccion: 'Av. Principal 123',
          ciudad: 'Santiago',
          region: 'Región Metropolitana',
          pais: 'Chile'
        },
        productos: [{ id: '1', nombre: 'Café', cantidad: 2, precio: 5000 }],
        subtotal: 10000,
        iva: 1900,
        total: 11900,
        empresa: config,
        fecha: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('ventas', JSON.stringify(ventas));
    localStorage.setItem('gastos', JSON.stringify(gastos));
    localStorage.setItem('facturas', JSON.stringify(facturas));
    
    setToast({ message: 'Datos de prueba cargados correctamente', type: 'success' });
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleBorrarDatosPrueba = () => {
    if (!window.confirm('¿Estás seguro de que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) return;
    
    localStorage.removeItem('productos');
    localStorage.removeItem('ventas');
    localStorage.removeItem('gastos');
    localStorage.removeItem('facturas');
    
    setToast({ message: 'Todos los datos han sido borrados', type: 'success' });
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleExportBackup = () => {
    try {
      const backup = {
        productos: JSON.parse(localStorage.getItem('productos') || '[]'),
        ventas: JSON.parse(localStorage.getItem('ventas') || '[]'),
        gastos: JSON.parse(localStorage.getItem('gastos') || '[]'),
        facturas: JSON.parse(localStorage.getItem('facturas') || '[]'),
        configuracion: JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'),
        fecha: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `negociolisto_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setToast({ message: 'Backup exportado correctamente', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error al exportar backup', type: 'error' });
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!window.confirm('Esta acción reemplazará TODOS los datos actuales por los del backup seleccionado. ¿Deseas continuar?')) {
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.productos || !data.ventas || !data.gastos || !data.facturas || !data.configuracion) {
          setToast({ message: 'El archivo no es un backup válido', type: 'error' });
          return;
        }
        
        localStorage.setItem('productos', JSON.stringify(data.productos));
        localStorage.setItem('ventas', JSON.stringify(data.ventas));
        localStorage.setItem('gastos', JSON.stringify(data.gastos));
        localStorage.setItem('facturas', JSON.stringify(data.facturas));
        localStorage.setItem(CONFIG_KEY, JSON.stringify(data.configuracion));
        
        setToast({ message: 'Backup importado correctamente', type: 'success' });
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        setToast({ message: 'Error al importar backup', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="configuracion-page-container">
      <div className="configuracion-container">
        <div className="configuracion-header">
          <h1>Configuración</h1>
          <p>Configura los datos de tu empresa</p>
        </div>
        
        <div className="calendario-card">
          <h2 style={{ color: 'var(--color-title)', marginBottom: '24px' }}>Datos de la Empresa</h2>
      
      <form className="config-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre de la empresa *</label>
          <input 
            type="text" 
            name="nombre" 
            className="form-input" 
            value={config.nombre} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">RUT *</label>
          <input 
            type="text" 
            name="rut" 
            className="form-input" 
            value={config.rut} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Dirección *</label>
          <input 
            type="text" 
            name="direccion" 
            className="form-input" 
            value={config.direccion} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Teléfono *</label>
          <input 
            type="text" 
            name="telefono" 
            className="form-input" 
            value={config.telefono} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Logo</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleLogoChange} 
          />
          {logoPreview && (
            <img 
              src={logoPreview} 
              alt="Logo" 
              style={{ maxHeight: 60, marginTop: 8 }} 
            />
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">País</label>
          <select 
            name="pais" 
            className="form-input" 
            value={config.pais} 
            onChange={handleChange}
          >
            <option value="Chile">Chile</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Moneda</label>
          <select 
            name="moneda" 
            className="form-input" 
            value={config.moneda} 
            onChange={handleChange}
          >
            <option value="CLP">CLP ($)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">IVA (%)</label>
          <input 
            type="number" 
            name="iva" 
            className="form-input" 
            value={config.iva} 
            onChange={handleChange} 
            min={0} 
            max={100} 
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
        
        <div className="form-actions" style={{ marginTop: 16, gap: 8 }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleCargarDatosPrueba}
          >
            Cargar datos de prueba
          </button>
          <button 
            type="button" 
            className="btn btn-error" 
            onClick={handleBorrarDatosPrueba}
          >
            Borrar todos los datos
          </button>
        </div>
        
        <div className="form-actions" style={{ marginTop: 16, gap: 8, flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              type="button" 
              className="btn btn-success" 
              onClick={handleExportBackup}
            >
              Exportar Backup Completo
            </button>
            <label className="btn btn-warning" style={{ cursor: 'pointer', marginTop: 0 }}>
              Importar Backup
              <input 
                type="file" 
                accept="application/json" 
                style={{ display: 'none' }} 
                onChange={handleImportBackup} 
              />
            </label>
            <button 
              type="button" 
              className="btn btn-info" 
              style={{ marginLeft: 8 }} 
              onClick={() => setShowBackupHelp(true)}
            >
              ¿Cómo funciona?
            </button>
          </div>
        </div>
      </form>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
      
      {showBackupHelp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 420, padding: 32 }}>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: 16 }}>
              ¿Cómo funciona el Backup?
            </h2>
            <ul style={{ textAlign: 'left', color: 'var(--color-text-primary)', fontSize: 16, marginBottom: 16 }}>
              <li><b>Exportar Backup:</b> Descarga un archivo <code>.json</code> con todos tus datos (productos, ventas, gastos, facturas, configuración). Guárdalo en un lugar seguro.</li>
              <li><b>Importar Backup:</b> Sube un archivo <code>.json</code> previamente exportado. <b>¡Advertencia!</b> Esto reemplazará todos los datos actuales por los del backup.</li>
              <li>Se recomienda hacer un backup antes de importar o borrar datos.</li>
              <li>La importación es útil para migrar datos a otro dispositivo o restaurar información.</li>
            </ul>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowBackupHelp(false)} 
              style={{ width: '100%' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionPage; 