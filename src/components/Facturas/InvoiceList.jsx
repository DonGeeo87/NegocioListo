import React, { useState, useEffect } from 'react';
import { InvoicesService } from '../../services/InvoicesService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './InvoiceList.css';

const CONFIG_KEY = 'configuracion_empresa';

const InvoiceList = () => {
  const [facturas, setFacturas] = useState([]);
  const [filtros, setFiltros] = useState({ fechaDesde: '', fechaHasta: '', cliente: '', minMonto: '', maxMonto: '' });
  const [empresa, setEmpresa] = useState({ nombre: 'NegocioListo', rut: '', direccion: '', telefono: '', logo: '', pais: 'Chile', moneda: 'CLP', iva: 19 });

  useEffect(() => {
    // Migración automática de facturas antiguas
    const facturasRaw = InvoicesService.getAllInvoices();
    let migrado = false;
    const facturasMigradas = facturasRaw.map(f => {
      let nueva = { ...f };
      if (!nueva.clienteDatos) {
        nueva.clienteDatos = { correo: '', telefono: '', direccion: '', ciudad: '', region: '', pais: '' };
        migrado = true;
      }
      if (!Array.isArray(nueva.productos)) {
        nueva.productos = [];
        migrado = true;
      }
      if (typeof nueva.subtotal !== 'number') {
        nueva.subtotal = 0;
        migrado = true;
      }
      if (typeof nueva.iva !== 'number') {
        nueva.iva = 0;
        migrado = true;
      }
      if (typeof nueva.total !== 'number') {
        nueva.total = 0;
        migrado = true;
      }
      return nueva;
    });
    if (migrado) {
      localStorage.setItem('facturas', JSON.stringify(facturasMigradas));
    }
    setFacturas(facturasMigradas);
    // Cargar configuración de empresa
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      setEmpresa(JSON.parse(saved));
    }
  }, []);

  const handleFiltroChange = e => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => {
    const filtradas = InvoicesService.filterInvoices({
      ...filtros,
      minMonto: filtros.minMonto ? parseFloat(filtros.minMonto) : undefined,
      maxMonto: filtros.maxMonto ? parseFloat(filtros.maxMonto) : undefined
    });
    setFacturas(filtradas);
  };

  const limpiarFiltros = () => {
    setFiltros({ fechaDesde: '', fechaHasta: '', cliente: '', minMonto: '', maxMonto: '' });
    setFacturas(InvoicesService.getAllInvoices());
  };

  // Descargar PDF de una factura
  const descargarPDF = (factura) => {
    const doc = new jsPDF();
    // Logo
    let logo = empresa.logo;
    if (!logo) {
      const logoPath = window.location.origin + '/public/icon-512.png';
      doc.addImage(logoPath, 'PNG', 10, 8, 30, 30);
    } else {
      doc.addImage(logo, 'PNG', 10, 8, 30, 30);
    }
    doc.setFontSize(14);
    doc.text(empresa.nombre, 50, 15);
    doc.setFontSize(10);
    doc.text(`RUT: ${empresa.rut}`, 50, 22);
    doc.text(`Dirección: ${empresa.direccion}`, 50, 27);
    doc.text(`Tel: ${empresa.telefono}`, 50, 32);
    doc.setFontSize(12);
    doc.text(`Factura N°: ${factura.numero || ''}`, 150, 15);
    doc.text(`Fecha: ${factura.fecha ? new Date(factura.fecha).toLocaleDateString('es-CL') : ''}`, 150, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', 10, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(factura.cliente, 30, 45);
    let y = 50;
    if (factura.clienteDatos) {
      const { correo, telefono, direccion, ciudad, region, pais } = factura.clienteDatos;
      if (correo) { doc.text(`Correo: ${correo}`, 30, y); y += 5; }
      if (telefono) { doc.text(`Teléfono: ${telefono}`, 30, y); y += 5; }
      if (direccion) { doc.text(`Dirección: ${direccion}`, 30, y); y += 5; }
      if (ciudad) { doc.text(`Ciudad: ${ciudad}`, 30, y); y += 5; }
      if (region) { doc.text(`Región/Estado: ${region}`, 30, y); y += 5; }
      if (pais) { doc.text(`País: ${pais}`, 30, y); y += 5; }
    }
    doc.setDrawColor(180);
    doc.line(10, y, 200, y);
    autoTable(doc, {
      startY: y + 5,
      head: [['Producto', 'Cantidad', 'Precio', 'Subtotal']],
      body: (Array.isArray(factura.productos) ? factura.productos : []).map(p => [p.nombre, p.cantidad, `$${p.precio?.toLocaleString('es-CL') ?? ''}`, `$${((p.precio || 0) * (p.cantidad || 0)).toLocaleString('es-CL')}`]),
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50] },
      styles: { fontSize: 10 }
    });
    const finalY = doc.lastAutoTable?.finalY || (y + 25);
    doc.setFontSize(12);
    doc.text(`Subtotal: $${(factura.subtotal || 0).toLocaleString('es-CL')}`, 150, finalY + 6);
    if (empresa.iva > 0) {
      doc.text(`IVA (${empresa.iva}%): $${(factura.iva || 0).toLocaleString('es-CL')}`, 150, finalY + 12);
    }
    doc.text(`Total: $${(factura.total || 0).toLocaleString('es-CL')}`, 150, finalY + (empresa.iva > 0 ? 18 : 12));
    doc.setFontSize(9);
    doc.text('Gracias por su compra. NegocioListo - App para emprendedores', 10, 285);
    doc.save(`Factura_${factura.numero || ''}.pdf`);
  };

  return (
    <div className="invoice-list-container">
      <div className="invoice-list-header">
        <h2>Historial de Facturas</h2>
        <div className="invoice-filtros">
          <input type="date" name="fechaDesde" value={filtros.fechaDesde} onChange={handleFiltroChange} className="form-input" />
          <input type="date" name="fechaHasta" value={filtros.fechaHasta} onChange={handleFiltroChange} className="form-input" />
          <input type="text" name="cliente" value={filtros.cliente} onChange={handleFiltroChange} className="form-input" placeholder="Cliente" />
          <input type="number" name="minMonto" value={filtros.minMonto} onChange={handleFiltroChange} className="form-input" placeholder="Monto mínimo" />
          <input type="number" name="maxMonto" value={filtros.maxMonto} onChange={handleFiltroChange} className="form-input" placeholder="Monto máximo" />
          <button className="btn btn-primary" onClick={aplicarFiltros}>Filtrar</button>
          <button className="btn btn-secondary" onClick={limpiarFiltros}>Limpiar</button>
        </div>
      </div>
      <div className="invoice-list-table">
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">No hay facturas registradas.</td>
              </tr>
            ) : (
              facturas.map(factura => (
                <tr key={factura.id}>
                  <td>{factura.numero}</td>
                  <td>{new Date(factura.fecha).toLocaleDateString('es-CL')}</td>
                  <td>{factura.cliente}</td>
                  <td>${factura.total.toLocaleString('es-CL')}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => descargarPDF(factura)}>
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList; 