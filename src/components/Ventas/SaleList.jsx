import React, { useState, useEffect } from 'react';
import { SalesService } from '../../services/SalesService';
import { InventarioService } from '../../services/InventarioService';
import './SaleList.css';

const SaleList = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({ fechaDesde: '', fechaHasta: '', productoId: '', minMonto: '', maxMonto: '' });

  useEffect(() => {
    setProductos(InventarioService.getAllProducts());
    setVentas(SalesService.getAllSales());
  }, []);

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => {
    const filtradas = SalesService.filterSales({
      ...filtros,
      minMonto: filtros.minMonto ? parseFloat(filtros.minMonto) : undefined,
      maxMonto: filtros.maxMonto ? parseFloat(filtros.maxMonto) : undefined
    });
    setVentas(filtradas);
  };

  const limpiarFiltros = () => {
    setFiltros({ fechaDesde: '', fechaHasta: '', productoId: '', minMonto: '', maxMonto: '' });
    setVentas(SalesService.getAllSales());
  };

  return (
    <div className="sale-list-container">
      <div className="sale-list-header">
        <h2>Historial de Ventas</h2>
        <div className="sale-filtros">
          <input type="date" name="fechaDesde" value={filtros.fechaDesde} onChange={handleFiltroChange} className="form-input" />
          <input type="date" name="fechaHasta" value={filtros.fechaHasta} onChange={handleFiltroChange} className="form-input" />
          <select name="productoId" value={filtros.productoId} onChange={handleFiltroChange} className="form-input">
            <option value="">Todos los productos</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <input type="number" name="minMonto" value={filtros.minMonto} onChange={handleFiltroChange} className="form-input" placeholder="Monto mínimo" />
          <input type="number" name="maxMonto" value={filtros.maxMonto} onChange={handleFiltroChange} className="form-input" placeholder="Monto máximo" />
          <button className="btn btn-primary" onClick={aplicarFiltros}>Filtrar</button>
          <button className="btn btn-secondary" onClick={limpiarFiltros}>Limpiar</button>
        </div>
      </div>
      <div className="sale-list-table">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">No hay ventas registradas.</td>
              </tr>
            ) : (
              ventas.map(venta => (
                <tr key={venta.id}>
                  <td>{new Date(venta.fecha).toLocaleDateString('es-ES')}</td>
                  <td>{venta.cliente || '-'}</td>
                  <td>
                    <ul>
                      {venta.productos.map((p, idx) => (
                        <li key={idx}>{p.nombre} x{p.cantidad}</li>
                      ))}
                    </ul>
                  </td>
                  <td>${venta.total.toLocaleString('es-ES')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleList; 