import React, { useState } from 'react';
import { ExpensesService } from '../../services/ExpensesService';
import './ExpenseForm.css';

const categorias = [
  'Servicios',
  'Insumos',
  'Personal',
  'Transporte',
  'Alquiler',
  'Publicidad',
  'Impuestos',
  'Otros'
];

const ExpenseForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    categoria: '',
    monto: '',
    descripcion: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    // Validaciones
    if (!form.categoria) {
      setError('Selecciona una categoría.'); setIsSubmitting(false); return;
    }
    if (!form.monto || isNaN(form.monto) || parseFloat(form.monto) <= 0) {
      setError('El monto debe ser mayor a 0.'); setIsSubmitting(false); return;
    }
    // Guardar gasto
    try {
      ExpensesService.addExpense({
        categoria: form.categoria,
        monto: parseFloat(form.monto),
        descripcion: form.descripcion.trim()
      });
      onSave && onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Registrar Gasto</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label className="form-label">Categoría *</label>
          <select name="categoria" className="form-input" value={form.categoria} onChange={handleChange} required>
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Monto *</label>
          <input type="number" name="monto" className="form-input" value={form.monto} onChange={handleChange} min={0} step={0.01} required />
        </div>
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-input form-textarea" value={form.descripcion} onChange={handleChange} maxLength={200} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Registrar Gasto'}</button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm; 