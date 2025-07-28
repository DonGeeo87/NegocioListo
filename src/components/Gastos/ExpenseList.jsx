import React, { useState, useEffect } from 'react';
import { ExpensesService } from '../../services/ExpensesService';
import './ExpenseList.css';

const categorias = [
  'Todas',
  'Servicios',
  'Insumos',
  'Personal',
  'Transporte',
  'Alquiler',
  'Publicidad',
  'Impuestos',
  'Otros'
];

const ExpenseList = () => {
  const [gastos, setGastos] = useState([]);
  const [filtros, setFiltros] = useState({ fechaDesde: '', fechaHasta: '', categoria: 'Todas', minMonto: '', maxMonto: '' });

  useEffect(() => {
    setGastos(ExpensesService.getAllExpenses());
  }, []);

  const handleFiltroChange = e => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => {
    const filtrados = ExpensesService.filterExpenses({
      ...filtros,
      minMonto: filtros.minMonto ? parseFloat(filtros.minMonto) : undefined,
      maxMonto: filtros.maxMonto ? parseFloat(filtros.maxMonto) : undefined
    });
    setGastos(filtrados);
  };

  const limpiarFiltros = () => {
    setFiltros({ fechaDesde: '', fechaHasta: '', categoria: 'Todas', minMonto: '', maxMonto: '' });
    setGastos(ExpensesService.getAllExpenses());
  };

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Historial de Gastos</h2>
        <div className="expense-filtros">
          <input type="date" name="fechaDesde" value={filtros.fechaDesde} onChange={handleFiltroChange} className="form-input" />
          <input type="date" name="fechaHasta" value={filtros.fechaHasta} onChange={handleFiltroChange} className="form-input" />
          <select name="categoria" value={filtros.categoria} onChange={handleFiltroChange} className="form-input">
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input type="number" name="minMonto" value={filtros.minMonto} onChange={handleFiltroChange} className="form-input" placeholder="Monto mínimo" />
          <input type="number" name="maxMonto" value={filtros.maxMonto} onChange={handleFiltroChange} className="form-input" placeholder="Monto máximo" />
          <button className="btn btn-primary" onClick={aplicarFiltros}>Filtrar</button>
          <button className="btn btn-secondary" onClick={limpiarFiltros}>Limpiar</button>
        </div>
      </div>
      <div className="expense-list-table">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {gastos.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">No hay gastos registrados.</td>
              </tr>
            ) : (
              gastos.map(gasto => (
                <tr key={gasto.id}>
                  <td>{new Date(gasto.fecha).toLocaleDateString('es-ES')}</td>
                  <td>{gasto.categoria}</td>
                  <td>{gasto.descripcion || '-'}</td>
                  <td>${gasto.monto.toLocaleString('es-ES')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList; 