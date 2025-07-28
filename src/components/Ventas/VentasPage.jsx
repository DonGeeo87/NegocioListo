import React, { useState } from 'react';
import SaleList from './SaleList';
import SaleForm from './SaleForm';
import './VentasPage.css';

const VentasPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);

  const handleNuevaVenta = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleVentaGuardada = () => {
    setShowForm(false);
    setReload(!reload);
  };

  return (
    <div className="ventas-page-container">
      <div className="ventas-container">
        <div className="ventas-header">
          <h1>Ventas</h1>
          <p>Gestiona las ventas de tu negocio</p>
        </div>
        
        <div className="calendario-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--color-title)', margin: 0 }}>Registro de Ventas</h2>
            <button 
              className="btn btn-primary" 
              onClick={handleNuevaVenta}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition-normal)'
              }}
            >
              + Nueva Venta
            </button>
          </div>
          <SaleList key={reload} />
        </div>
      </div>
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <SaleForm onSave={handleVentaGuardada} onCancel={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasPage; 