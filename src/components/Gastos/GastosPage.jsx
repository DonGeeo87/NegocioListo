import React, { useState } from 'react';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import './GastosPage.css';

const GastosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);

  const handleNuevoGasto = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleGastoGuardado = () => {
    setShowForm(false);
    setReload(!reload);
  };

  return (
    <div className="gastos-page-container">
      <div className="gastos-container">
        <div className="gastos-header">
          <h1>Gastos</h1>
          <p>Controla los gastos de tu negocio</p>
        </div>
        
        <div className="calendario-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--color-title)', margin: 0 }}>Registro de Gastos</h2>
            <button 
              className="btn btn-primary" 
              onClick={handleNuevoGasto}
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
              + Nuevo Gasto
            </button>
          </div>
          <ExpenseList key={reload} />
        </div>
      </div>
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExpenseForm onSave={handleGastoGuardado} onCancel={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GastosPage; 