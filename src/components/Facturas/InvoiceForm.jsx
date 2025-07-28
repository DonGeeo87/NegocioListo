import React, { useState, useEffect } from 'react';
import { InventarioService } from '../../services/InventarioService';
import { InvoicesService } from '../../services/InvoicesService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './InvoiceForm.css';

const CONFIG_KEY = 'configuracion_empresa';

const InvoiceForm = ({ onSave, onCancel }) => {
  const [productos, setProductos] = useState([]);
  const [items, setItems] = useState([]); // [{id, nombre, precio, cantidad, subtotal}]
  const [cliente, setCliente] = useState('');
  const [clienteDatos, setClienteDatos] = useState({
    correo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    pais: ''
  });
  const [empresa, setEmpresa] = useState({ nombre: 'NegocioListo', rut: '', direccion: '', telefono: '', logo: '', pais: 'Chile', moneda: 'CLP', iva: 19 });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProductos(InventarioService.getAllProducts().filter(p => p.stock > 0));
    setItems([]);
    // Cargar configuración de empresa
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      setEmpresa(JSON.parse(saved));
    }
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

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calcularIVA = () => {
    const subtotal = calcularSubtotal();
    return empresa.iva > 0 ? subtotal * (empresa.iva / 100) : 0;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };

  const handleClienteDatosChange = (e) => {
    const { name, value } = e.target;
    setClienteDatos(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    if (!cliente.trim()) {
      setError('El nombre del cliente es obligatorio.'); setIsSubmitting(false); return;
    }
    if (items.length === 0) {
      setError('Debes agregar al menos un producto.'); setIsSubmitting(false); return;
    }
    for (const item of items) {
      if (!item.id) {
        setError('Selecciona un producto en cada línea.'); setIsSubmitting(false); return;
      }
      const producto = productos.find(p => p.id === item.id);
      if (!producto || item.cantidad > producto.stock) {
        setError(`Stock insuficiente para ${producto ? producto.nombre : 'producto desconocido'}`); setIsSubmitting(false); return;
      }
    }
    // Guardar factura
    try {
      const factura = {
        cliente: cliente.trim(),
        clienteDatos: { ...clienteDatos },
        productos: items.map(item => ({ id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad })),
        subtotal: calcularSubtotal(),
        iva: calcularIVA(),
        total: calcularTotal(),
        empresa
      };
      const nuevaFactura = InvoicesService.addInvoice(factura);
      generarPDF(nuevaFactura);
      onSave && onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generar PDF con jsPDF
  const generarPDF = (factura) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    // Logo
    let logo = factura.empresa.logo;
    if (!logo) {
      const logoPath = window.location.origin + '/public/icon-512.png';
      doc.addImage(logoPath, 'PNG', 10, 8, 30, 30);
    } else {
      doc.addImage(logo, 'PNG', 10, 8, 30, 30);
    }
    // Encabezado empresa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(factura.empresa.nombre, 50, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`RUT: ${factura.empresa.rut}`, 50, 25);
    doc.text(`Dirección: ${factura.empresa.direccion}`, 50, 30);
    doc.text(`Tel: ${factura.empresa.telefono}`, 50, 35);
    // Datos de factura
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Factura N°: ${factura.numero || ''}`, 160, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha: ${factura.fecha ? new Date(factura.fecha).toLocaleDateString('es-CL') : ''}`, 160, 25);
    // Cliente
    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', 10, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(factura.cliente, 30, 50);
    let y = 55;
    if (factura.clienteDatos) {
      const { correo, telefono, direccion, ciudad, region, pais } = factura.clienteDatos;
      if (correo) { doc.text(`Correo: ${correo}`, 30, y); y += 5; }
      if (telefono) { doc.text(`Teléfono: ${telefono}`, 30, y); y += 5; }
      if (direccion) { doc.text(`Dirección: ${direccion}`, 30, y); y += 5; }
      if (ciudad) { doc.text(`Ciudad: ${ciudad}`, 30, y); y += 5; }
      if (region) { doc.text(`Región/Estado: ${region}`, 30, y); y += 5; }
      if (pais) { doc.text(`País: ${pais}`, 30, y); y += 5; }
    }
    // Línea separadora
    doc.setDrawColor(180);
    doc.line(10, y, 200, y);
    // Tabla productos
    autoTable(doc, {
      startY: y + 5,
      head: [['Producto', 'Cantidad', 'Precio', 'Subtotal']],
      body: (Array.isArray(factura.productos) ? factura.productos : []).map(p => [p.nombre, p.cantidad, `$${p.precio?.toLocaleString('es-CL') ?? ''}`, `$${((p.precio || 0) * (p.cantidad || 0)).toLocaleString('es-CL')}`]),
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { left: 10, right: 10 },
      tableLineColor: 180,
      tableLineWidth: 0.2
    });
    // Subtotal, IVA, Total
    const finalY = doc.lastAutoTable?.finalY || (y + 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Subtotal:`, 150, finalY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${(factura.subtotal || 0).toLocaleString('es-CL')}`, 180, finalY + 8, { align: 'right' });
    if (factura.empresa.iva > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text(`IVA (${factura.empresa.iva}%):`, 150, finalY + 14);
      doc.setFont('helvetica', 'normal');
      doc.text(`$${(factura.iva || 0).toLocaleString('es-CL')}`, 180, finalY + 14, { align: 'right' });
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`Total:`, 150, finalY + (factura.empresa.iva > 0 ? 20 : 14));
    doc.setFont('helvetica', 'normal');
    doc.text(`$${(factura.total || 0).toLocaleString('es-CL')}`, 180, finalY + (factura.empresa.iva > 0 ? 20 : 14), { align: 'right' });
    // Pie de página
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('Gracias por su compra. NegocioListo - App para emprendedores', 105, 287, { align: 'center' });
    // Borde exterior
    doc.setDrawColor(100);
    doc.rect(7, 5, 196, 287, 'S');
    doc.save(`Factura_${factura.numero || ''}.pdf`);
  };

  return (
    <div className="invoice-form-container">
      <h2>Generar Factura</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-group">
          <label className="form-label">Cliente *</label>
          <input type="text" className="form-input" value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Nombre del cliente" required />
        </div>
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input type="email" name="correo" className="form-input" value={clienteDatos.correo} onChange={handleClienteDatosChange} placeholder="cliente@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input type="text" name="telefono" className="form-input" value={clienteDatos.telefono} onChange={handleClienteDatosChange} placeholder="Ej: +56 9 1234 5678" />
        </div>
        <div className="form-group">
          <label className="form-label">Dirección</label>
          <input type="text" name="direccion" className="form-input" value={clienteDatos.direccion} onChange={handleClienteDatosChange} placeholder="Dirección del cliente" />
        </div>
        <div className="form-group">
          <label className="form-label">Ciudad</label>
          <input type="text" name="ciudad" className="form-input" value={clienteDatos.ciudad} onChange={handleClienteDatosChange} placeholder="Ciudad" />
        </div>
        <div className="form-group">
          <label className="form-label">Región / Estado</label>
          <input type="text" name="region" className="form-input" value={clienteDatos.region} onChange={handleClienteDatosChange} placeholder="Región o Estado" />
        </div>
        <div className="form-group">
          <label className="form-label">País</label>
          <input type="text" name="pais" className="form-input" value={clienteDatos.pais} onChange={handleClienteDatosChange} placeholder="País" />
        </div>
        <div className="invoice-items">
          {items.map((item, idx) => (
            <div className="invoice-item-row" key={idx}>
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
              <span className="item-price">${item.subtotal.toLocaleString('es-CL')}</span>
              <button type="button" className="btn btn-error" onClick={() => handleRemoveItem(idx)}>
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleAddItem}>
            + Agregar Producto
          </button>
        </div>
        <div className="invoice-total">
          <strong>Subtotal: </strong> ${calcularSubtotal().toLocaleString('es-CL')}<br />
          {empresa.iva > 0 && <><strong>IVA ({empresa.iva}%):</strong> ${calcularIVA().toLocaleString('es-CL')}<br /></>}
          <strong>Total: </strong> ${calcularTotal().toLocaleString('es-CL')}
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Generando...' : 'Generar Factura y PDF'}</button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm; 