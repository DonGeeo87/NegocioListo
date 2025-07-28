export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('Permisos de notificación denegados');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async subscribeToPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications no soportadas');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY || '')
      });

      console.log('Suscripción a push exitosa:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error suscribiéndose a push:', error);
      return false;
    }
  }

  static async showNotification(title, options = {}) {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    const defaultOptions = {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      requireInteraction: false,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }

  static async checkLowStock() {
    try {
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const lowStockThreshold = 5;
      const lowStockProducts = productos.filter(p => p.stock <= lowStockThreshold);

      if (lowStockProducts.length > 0) {
        const productNames = lowStockProducts.map(p => p.nombre).join(', ');
        await this.showNotification(
          'Stock Bajo',
          {
            body: `Los siguientes productos tienen stock bajo: ${productNames}`,
            tag: 'low-stock',
            requireInteraction: true,
            actions: [
              {
                action: 'view',
                title: 'Ver Inventario'
              }
            ]
          }
        );
      }
    } catch (error) {
      console.error('Error verificando stock bajo:', error);
    }
  }

  static async showReminderNotification() {
    const lastReminder = localStorage.getItem('last_reminder');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    // Mostrar recordatorio una vez al día
    if (!lastReminder || (now - parseInt(lastReminder)) > oneDay) {
      await this.showNotification(
        'Recordatorio Diario',
        {
          body: 'No olvides revisar tu inventario y registrar tus ventas del día',
          tag: 'daily-reminder',
          requireInteraction: false
        }
      );
      localStorage.setItem('last_reminder', now.toString());
    }
  }

  static async showSaleNotification(sale) {
    await this.showNotification(
      'Venta Registrada',
      {
        body: `Venta de $${sale.total} registrada exitosamente`,
        tag: 'sale-completed',
        requireInteraction: false
      }
    );
  }

  static async showExpenseNotification(expense) {
    await this.showNotification(
      'Gasto Registrado',
      {
        body: `Gasto de $${expense.monto} en ${expense.categoria} registrado`,
        tag: 'expense-completed',
        requireInteraction: false
      }
    );
  }

  static async showInvoiceNotification(invoice) {
    await this.showNotification(
      'Factura Generada',
      {
        body: `Factura #${invoice.numero} generada para ${invoice.cliente}`,
        tag: 'invoice-completed',
        requireInteraction: false
      }
    );
  }

  // Utilidad para convertir VAPID key
  static urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Configurar recordatorios automáticos
  static setupAutomaticReminders() {
    // Verificar stock bajo cada hora
    setInterval(() => {
      this.checkLowStock();
    }, 60 * 60 * 1000);

    // Recordatorio diario a las 9 AM
    const now = new Date();
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    
    if (now > reminderTime) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.showReminderNotification();
      // Configurar recordatorio diario
      setInterval(() => {
        this.showReminderNotification();
      }, 24 * 60 * 60 * 1000);
    }, timeUntilReminder);
  }
} 