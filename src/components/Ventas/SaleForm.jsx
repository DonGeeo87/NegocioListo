import React, { useState, useEffect } from 'react';
import { InventarioService } from '../../services/InventarioService';
import { SalesService } from '../../services/SalesService';
import './SaleForm.css';

const SaleForm = ({ onSave, onCancel }) => {
  const [productos, setProductos] = useState([]);
  const [items, setItems] = useState([]); // [{id, nombre, precio, cantidad, subtotal}]
  const [cliente, setCliente] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const productosDisponibles = InventarioService.getAllProducts().filter(p => p.stock > 0);
    setProductos(productosDisponibles);
    setItems([]);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: '', nombre: '', precio: 0, cantidad: 1, subtotal: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'id') {
      const producto = productos.find(p => p.id === value);
      newItems[index] = {
        ...newItems[index],
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        subtotal: producto.precio
      };
    } else if (field === 'cantidad') {
      const cantidad = parseInt(value) || 1;
      const producto = productos.find(p => p.id === newItems[index].id);
      newItems[index].cantidad = cantidad;
      newItems[index].subtotal = producto ? producto.precio * cantidad : 0;
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    // Validaciones
    if (items.length === 0) {
      setError('Debes agregar al menos un producto.');
      setIsSubmitting(false);
      return;
    }
    for (const item of items) {
      if (!item.id) {
        setError('Selecciona un producto en cada línea.');
        setIsSubmitting(false);
        return;
      }
      const producto = productos.find(p => p.id === item.id);
      if (!producto || item.cantidad > producto.stock) {
        setError(`Stock insuficiente para ${producto ? producto.nombre : 'producto desconocido'}`);
        setIsSubmitting(false);
        return;
      }
    }
    // Guardar venta
    try {
      const venta = {
        productos: items.map(item => ({ id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad })),
        cliente: cliente.trim(),
        total: calcularTotal()
      };
      SalesService.addSale(venta);
      onSave && onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sale-form-container">
      <h2>Registrar Venta</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="sale-form">
        <div className="form-group">
          <label className="form-label">Cliente (opcional)</label>
          <input type="text" className="form-input" value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Nombre del cliente" />
        </div>
        <div className="sale-items">
          {items.map((item, idx) => (
            <div className="sale-item-row" key={idx}>
              <select
                className="form-input"
                value={item.id}
                onChange={e => handleItemChange(idx, 'id', e.target.value)}
                required
              >
                <option value="">Selecciona producto</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Stock: {p.stock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="form-input"
                min={1}
                max={item.id ? productos.find(p => p.id === item.id)?.stock : 1}
                value={item.cantidad}
                onChange={e => handleItemChange(idx, 'cantidad', e.target.value)}
                required
              />
              <span className="item-price">${item.subtotal.toLocaleString('es-ES')}</span>
              <button type="button" className="btn btn-error" onClick={() => handleRemoveItem(idx)}>
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleAddItem}>
            + Agregar Producto
          </button>
        </div>
        <div className="sale-total">
          <strong>Total: </strong> ${calcularTotal().toLocaleString('es-ES')}
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Registrar Venta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm; 