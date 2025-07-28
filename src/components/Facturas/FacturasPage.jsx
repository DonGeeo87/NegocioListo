import React, { useState } from 'react';
import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';
import './FacturasPage.css';

const FacturasPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);

  const handleNuevaFactura = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleFacturaGuardada = () => {
    setShowForm(false);
    setReload(!reload);
  };

  return (
    <div className="facturas-page-container">
      <div className="facturas-container">
        <div className="facturas-header">
          <h1>Facturación</h1>
          <p>Gestiona las facturas de tu negocio</p>
        </div>
        
        <div className="calendario-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--color-title)', margin: 0 }}>Registro de Facturas</h2>
            <button 
              className="btn btn-primary" 
              onClick={handleNuevaFactura}
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
              + Nueva Factura
            </button>
          </div>
          <InvoiceList key={reload} />
        </div>
      </div>
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InvoiceForm onSave={handleFacturaGuardada} onCancel={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturasPage; 