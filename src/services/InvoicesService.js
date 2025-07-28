const INVOICES_KEY = 'facturas';
import { NotificationService } from './NotificationService.js';

export class InvoicesService {
  // Obtener todas las facturas
  static getAllInvoices() {
    try {
      const facturas = localStorage.getItem(INVOICES_KEY);
      return facturas ? JSON.parse(facturas) : [];
    } catch (error) {
      console.error('Error obteniendo facturas:', error);
      return [];
    }
  }

  // Obtener el siguiente número de factura
  static getNextInvoiceNumber() {
    const facturas = this.getAllInvoices();
    if (facturas.length === 0) return 1;
    const maxNum = Math.max(...facturas.map(f => f.numero || 0));
    return maxNum + 1;
  }

  // Agregar nueva factura
  static addInvoice(factura) {
    try {
      const facturas = this.getAllInvoices();
      const nuevaFactura = {
        ...factura,
        id: this.generateId(),
        numero: this.getNextInvoiceNumber(),
        fecha: new Date().toISOString()
      };
      facturas.push(nuevaFactura);
      localStorage.setItem(INVOICES_KEY, JSON.stringify(facturas));
      
      // Mostrar notificación
      NotificationService.showInvoiceNotification(nuevaFactura);
      
      return nuevaFactura;
    } catch (error) {
      console.error('Error agregando factura:', error);
      throw error;
    }
  }

  // Eliminar factura
  static deleteInvoice(id) {
    try {
      const facturas = this.getAllInvoices();
      const filtradas = facturas.filter(f => f.id !== id);
      localStorage.setItem(INVOICES_KEY, JSON.stringify(filtradas));
      return true;
    } catch (error) {
      console.error('Error eliminando factura:', error);
      throw error;
    }
  }

  // Filtrar facturas por fecha, cliente, monto
  static filterInvoices({ fechaDesde, fechaHasta, cliente, minMonto, maxMonto }) {
    let facturas = this.getAllInvoices();
    if (fechaDesde) facturas = facturas.filter(f => new Date(f.fecha) >= new Date(fechaDesde));
    if (fechaHasta) facturas = facturas.filter(f => new Date(f.fecha) <= new Date(fechaHasta));
    if (cliente) facturas = facturas.filter(f => f.cliente && f.cliente.toLowerCase().includes(cliente.toLowerCase()));
    if (minMonto) facturas = facturas.filter(f => f.total >= minMonto);
    if (maxMonto) facturas = facturas.filter(f => f.total <= maxMonto);
    return facturas;
  }

  // Generar ID único
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 