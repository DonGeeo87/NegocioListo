import { InventarioService } from './InventarioService';
import { NotificationService } from './NotificationService.js';

const SALES_KEY = 'ventas';

export class SalesService {
  // Obtener todas las ventas
  static getAllSales() {
    try {
      const ventas = localStorage.getItem(SALES_KEY);
      return ventas ? JSON.parse(ventas) : [];
    } catch (error) {
      console.error('Error obteniendo ventas:', error);
      return [];
    }
  }

  // Agregar nueva venta
  static addSale(venta) {
    try {
      const ventas = this.getAllSales();
      const nuevaVenta = {
        ...venta,
        id: this.generateId(),
        fecha: new Date().toISOString()
      };
      ventas.push(nuevaVenta);
      localStorage.setItem(SALES_KEY, JSON.stringify(ventas));
      
      // Actualizar stock de productos
      (venta.productos || []).forEach(productoVenta => {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        const producto = productos.find(p => p.id === productoVenta.id);
        if (producto) {
          producto.stock = Math.max(0, producto.stock - productoVenta.cantidad);
        }
        localStorage.setItem('productos', JSON.stringify(productos));
      });
      
      // Mostrar notificación
      NotificationService.showSaleNotification(nuevaVenta);
      
      return nuevaVenta;
    } catch (error) {
      console.error('Error agregando venta:', error);
      throw error;
    }
  }

  // Eliminar venta (no repone stock)
  static deleteSale(id) {
    try {
      const ventas = this.getAllSales();
      const filtradas = ventas.filter(v => v.id !== id);
      localStorage.setItem(SALES_KEY, JSON.stringify(filtradas));
      return true;
    } catch (error) {
      console.error('Error eliminando venta:', error);
      throw error;
    }
  }

  // Filtrar ventas por fecha, producto, monto
  static filterSales({ fechaDesde, fechaHasta, productoId, minMonto, maxMonto }) {
    let ventas = this.getAllSales();
    if (fechaDesde) ventas = ventas.filter(v => new Date(v.fecha) >= new Date(fechaDesde));
    if (fechaHasta) ventas = ventas.filter(v => new Date(v.fecha) <= new Date(fechaHasta));
    if (productoId) ventas = ventas.filter(v => v.productos.some(p => p.id === productoId));
    if (minMonto) ventas = ventas.filter(v => v.total >= minMonto);
    if (maxMonto) ventas = ventas.filter(v => v.total <= maxMonto);
    return ventas;
  }

  // Generar ID único
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 