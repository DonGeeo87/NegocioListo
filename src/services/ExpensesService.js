const EXPENSES_KEY = 'gastos';
import { NotificationService } from './NotificationService.js';

export class ExpensesService {
  // Obtener todos los gastos
  static getAllExpenses() {
    try {
      const gastos = localStorage.getItem(EXPENSES_KEY);
      return gastos ? JSON.parse(gastos) : [];
    } catch (error) {
      console.error('Error obteniendo gastos:', error);
      return [];
    }
  }

  // Agregar nuevo gasto
  static addExpense(gasto) {
    try {
      const gastos = this.getAllExpenses();
      const nuevoGasto = {
        ...gasto,
        id: this.generateId(),
        fecha: new Date().toISOString()
      };
      gastos.push(nuevoGasto);
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(gastos));
      
      // Mostrar notificación
      NotificationService.showExpenseNotification(nuevoGasto);
      
      return nuevoGasto;
    } catch (error) {
      console.error('Error agregando gasto:', error);
      throw error;
    }
  }

  // Eliminar gasto
  static deleteExpense(id) {
    try {
      const gastos = this.getAllExpenses();
      const filtrados = gastos.filter(g => g.id !== id);
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtrados));
      return true;
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      throw error;
    }
  }

  // Filtrar gastos por fecha, categoría, monto
  static filterExpenses({ fechaDesde, fechaHasta, categoria, minMonto, maxMonto }) {
    let gastos = this.getAllExpenses();
    if (fechaDesde) gastos = gastos.filter(g => new Date(g.fecha) >= new Date(fechaDesde));
    if (fechaHasta) gastos = gastos.filter(g => new Date(g.fecha) <= new Date(fechaHasta));
    if (categoria && categoria !== 'Todas') gastos = gastos.filter(g => g.categoria === categoria);
    if (minMonto) gastos = gastos.filter(g => g.monto >= minMonto);
    if (maxMonto) gastos = gastos.filter(g => g.monto <= maxMonto);
    return gastos;
  }

  // Generar ID único
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 