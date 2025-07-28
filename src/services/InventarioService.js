// Servicio para gestión de inventario usando localStorage
const STORAGE_KEY = 'productos';

export class InventarioService {
  // Obtener todos los productos
  static getAllProducts() {
    try {
      const productos = localStorage.getItem(STORAGE_KEY);
      return productos ? JSON.parse(productos) : [];
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  // Obtener producto por ID
  static getProductById(id) {
    const productos = this.getAllProducts();
    return productos.find(producto => producto.id === id);
  }

  // Agregar nuevo producto
  static addProduct(producto) {
    try {
      const productos = this.getAllProducts();
      const nuevoProducto = {
        ...producto,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      productos.push(nuevoProducto);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
      return nuevoProducto;
    } catch (error) {
      console.error('Error agregando producto:', error);
      throw new Error('No se pudo agregar el producto');
    }
  }

  // Actualizar producto
  static updateProduct(productoActualizado) {
    try {
      const productos = this.getAllProducts();
      const index = productos.findIndex(producto => producto.id === productoActualizado.id);
      
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      productos[index] = {
        ...productos[index],
        ...productoActualizado,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
      return productos[index];
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw new Error('No se pudo actualizar el producto');
    }
  }

  // Eliminar producto
  static deleteProduct(id) {
    try {
      const productos = this.getAllProducts();
      const productosFiltrados = productos.filter(producto => producto.id !== id);
      
      if (productosFiltrados.length === productos.length) {
        throw new Error('Producto no encontrado');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(productosFiltrados));
      return true;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw new Error('No se pudo eliminar el producto');
    }
  }

  // Buscar productos por nombre o descripción
  static searchProducts(query) {
    const productos = this.getAllProducts();
    const queryLower = query.toLowerCase();
    
    return productos.filter(producto => 
      producto.nombre.toLowerCase().includes(queryLower) ||
      producto.descripcion.toLowerCase().includes(queryLower) ||
      producto.categoria.toLowerCase().includes(queryLower)
    );
  }

  // Obtener productos con stock bajo
  static getLowStockProducts(threshold = 5) {
    const productos = this.getAllProducts();
    return productos.filter(producto => producto.stock <= threshold);
  }

  // Actualizar stock de producto
  static updateStock(id, cantidad) {
    try {
      const productos = this.getAllProducts();
      const index = productos.findIndex(producto => producto.id === id);
      
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      const nuevoStock = productos[index].stock + cantidad;
      if (nuevoStock < 0) {
        throw new Error('Stock no puede ser negativo');
      }

      productos[index].stock = nuevoStock;
      productos[index].updatedAt = new Date().toISOString();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
      return productos[index];
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw new Error('No se pudo actualizar el stock');
    }
  }

  // Obtener estadísticas del inventario
  static getInventoryStats() {
    const productos = this.getAllProducts();
    
    const totalProductos = productos.length;
    const totalStock = productos.reduce((sum, producto) => sum + producto.stock, 0);
    const valorTotal = productos.reduce((sum, producto) => 
      sum + (producto.precio * producto.stock), 0
    );
    const productosStockBajo = productos.filter(p => p.stock <= 5).length;
    const productosSinStock = productos.filter(p => p.stock === 0).length;

    return {
      totalProductos,
      totalStock,
      valorTotal,
      productosStockBajo,
      productosSinStock
    };
  }

  // Generar ID único
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Validar datos de producto
  static validateProduct(producto) {
    const errors = [];

    if (!producto.nombre || producto.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!producto.precio || producto.precio <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }

    if (producto.stock === undefined || producto.stock < 0) {
      errors.push('El stock no puede ser negativo');
    }

    if (!producto.categoria || producto.categoria.trim().length === 0) {
      errors.push('La categoría es requerida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Exportar datos
  static exportData() {
    const productos = this.getAllProducts();
    const dataStr = JSON.stringify(productos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `inventario_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // Importar datos
  static importData(jsonData) {
    try {
      const productos = JSON.parse(jsonData);
      
      if (!Array.isArray(productos)) {
        throw new Error('Formato de datos inválido');
      }

      // Validar cada producto
      for (const producto of productos) {
        const validation = this.validateProduct(producto);
        if (!validation.isValid) {
          throw new Error(`Producto inválido: ${validation.errors.join(', ')}`);
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
      return productos;
    } catch (error) {
      console.error('Error importando datos:', error);
      throw new Error('No se pudieron importar los datos');
    }
  }
} 