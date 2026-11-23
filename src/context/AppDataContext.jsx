import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  INITIAL_INVENTORY,
  INITIAL_ORDERS_TALLER,
  INITIAL_COTIZACIONES,
  INITIAL_VENTAS,
  INITIAL_KARDEX_MOVEMENTS,
  INITIAL_PEDIDOS,
  INITIAL_DEVOLUCIONES,
  INITIAL_ASESORIAS,
  INITIAL_CONSULTAS_ASESORIA,
  INITIAL_AUDIT_LOGS,
  SERVICE_PACKAGES,
  DIAN_STATUS_INFO
} from '../data/mockData';

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  // Base de datos local inicializada en limpio (v4 clean)
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [tallerOrders, setTallerOrders] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_taller');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS_TALLER;
  });

  const [cotizaciones, setCotizaciones] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_cotizaciones');
    return saved ? JSON.parse(saved) : INITIAL_COTIZACIONES;
  });

  const [ventas, setVentas] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_ventas');
    return saved ? JSON.parse(saved) : INITIAL_VENTAS;
  });

  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_pedidos');
    return saved ? JSON.parse(saved) : INITIAL_PEDIDOS;
  });

  const [devoluciones, setDevoluciones] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_devoluciones');
    return saved ? JSON.parse(saved) : INITIAL_DEVOLUCIONES;
  });

  const [asesorias, setAsesorias] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_asesorias');
    return saved ? JSON.parse(saved) : INITIAL_ASESORIAS;
  });

  const [consultasAsesoria, setConsultasAsesoria] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_consultas');
    return saved ? JSON.parse(saved) : INITIAL_CONSULTAS_ASESORIA;
  });

  const [kardexMovements, setKardexMovements] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_kardex');
    return saved ? JSON.parse(saved) : INITIAL_KARDEX_MOVEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('centro_je_clean_v4_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [globalSearch, setGlobalSearch] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Sincronización automática en localStorage
  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_taller', JSON.stringify(tallerOrders));
  }, [tallerOrders]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_cotizaciones', JSON.stringify(cotizaciones));
  }, [cotizaciones]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_ventas', JSON.stringify(ventas));
  }, [ventas]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_devoluciones', JSON.stringify(devoluciones));
  }, [devoluciones]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_asesorias', JSON.stringify(asesorias));
  }, [asesorias]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_consultas', JSON.stringify(consultasAsesoria));
  }, [consultasAsesoria]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_kardex', JSON.stringify(kardexMovements));
  }, [kardexMovements]);

  useEffect(() => {
    localStorage.setItem('centro_je_clean_v4_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Atajo global Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (title, message = '', type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllData = () => {
    setInventory([]);
    setTallerOrders([]);
    setCotizaciones([]);
    setVentas([]);
    setPedidos([]);
    setDevoluciones([]);
    setConsultasAsesoria([]);
    setKardexMovements([]);
    setAuditLogs([]);
    showToast('Sistema Reiniciado en Limpio', 'Todos los registros de prueba fueron eliminados.', 'info');
  };

  const logAudit = (modulo, accion, usuario = 'Administrador', rol = 'Administrador') => {
    const newLog = {
      id: `LOG-${String(auditLogs.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuario,
      rol,
      modulo,
      accion
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const formatCurrency = (val) => {
    const number = Number(val) || 0;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(number);
  };

  const numberToWordsCOP = (num) => {
    const n = Math.round(Number(num) || 0);
    if (n === 0) return 'CERO PESOS M/CTE.';

    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    const convertGroup = (val) => {
      if (val === 0) return '';
      if (val === 100) return 'CIEN';
      let out = '';
      const c = Math.floor(val / 100);
      const r = val % 100;
      if (c > 0) out += centenas[c] + ' ';
      if (r >= 10 && r < 20) {
        out += especiales[r - 10];
      } else if (r >= 20 && r < 30) {
        out += r === 20 ? 'VEINTE' : 'VEINTI' + unidades[r - 20];
      } else {
        const d = Math.floor(r / 10);
        const u = r % 10;
        if (d > 0) {
          out += decenas[d];
          if (u > 0) out += ' Y ' + unidades[u];
        } else if (u > 0) {
          out += unidades[u];
        }
      }
      return out.trim();
    };

    const millones = Math.floor(n / 1000000);
    const miles = Math.floor((n % 1000000) / 1000);
    const resto = n % 1000;
    const parts = [];

    if (millones > 0) {
      parts.push(millones === 1 ? 'UN MILLÓN' : `${convertGroup(millones)} MILLONES`);
    }
    if (miles > 0) {
      parts.push(miles === 1 ? 'MIL' : `${convertGroup(miles)} MIL`);
    }
    if (resto > 0) {
      parts.push(convertGroup(resto));
    }

    return `${parts.join(' ')} PESOS M/CTE.`;
  };

  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => item.stock <= item.stockMinimo);
  }, [inventory]);

  // RF-002: Acciones de Inventario con validación de duplicados
  const addSparePart = (part, usuario = 'Administrador') => {
    const cleanCode = (part.codigo || '').trim().toUpperCase();
    const cleanDesc = (part.descripcion || '').trim();

    // Validación intuitiva para evitar errores de clave duplicada
    const duplicate = inventory.find(
      (item) =>
        item.codigo.toLowerCase() === cleanCode.toLowerCase() ||
        item.descripcion.toLowerCase() === cleanDesc.toLowerCase()
    );

    if (duplicate) {
      showToast(
        'Producto ya registrado',
        `Ya existe "${duplicate.codigo} - ${duplicate.descripcion}" en el catálogo. Puedes editar su stock directamente.`,
        'warning'
      );
      return false;
    }

    const newPart = {
      ...part,
      id: `REP-${String(inventory.length + 1).padStart(3, '0')}`,
      codigo: cleanCode,
      descripcion: cleanDesc,
      unidad: part.unidad || 'Unidad',
      stock: Number(part.stock) || 0,
      stockMinimo: Number(part.stockMinimo) || 0,
      precioCosto: Number(part.precioCosto || Math.round(Number(part.precioUnitario) * 0.7)),
      precioUnitario: Number(part.precioUnitario) || 0,
      proveedor: part.proveedor || 'Proveedor Directo',
      estado:
        Number(part.stock) === 0
          ? 'Agotado'
          : Number(part.stock) <= Number(part.stockMinimo)
          ? 'Stock bajo'
          : 'En stock'
    };

    setInventory((prev) => [newPart, ...prev]);

    const newMovement = {
      id: `MOV-${String(kardexMovements.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tipo: 'Ingreso Inicial',
      repuestoId: newPart.id,
      codigo: newPart.codigo,
      descripcion: newPart.descripcion,
      cantidad: newPart.stock,
      motivo: 'Registro inicial en catálogo',
      usuario,
      stockAnterior: 0,
      stockNuevo: newPart.stock
    };
    setKardexMovements((prev) => [newMovement, ...prev]);
    logAudit('Inventario', `Registro de producto ${newPart.codigo} - ${newPart.descripcion} (${newPart.stock} unids)`, usuario);

    showToast('Producto Guardado', `${newPart.codigo} - ${newPart.descripcion} disponible en inventario.`);
    return true;
  };

  const updateSparePart = (id, updatedFields) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : item.stock;
          const newMin = updatedFields.stockMinimo !== undefined ? Number(updatedFields.stockMinimo) : item.stockMinimo;
          const newPrice = updatedFields.precioUnitario !== undefined ? Number(updatedFields.precioUnitario) : item.precioUnitario;

          let estado = 'En stock';
          if (newStock === 0) estado = 'Agotado';
          else if (newStock <= newMin) estado = 'Stock bajo';

          return {
            ...item,
            ...updatedFields,
            stock: newStock,
            stockMinimo: newMin,
            precioUnitario: newPrice,
            estado
          };
        }
        return item;
      })
    );
    showToast('Catálogo Actualizado', 'Los cambios se guardaron correctamente.');
    return true;
  };

  const adjustStockWithReason = (id, delta, motivo = 'Ajuste manual', tipoOverride = '', usuario = 'Taller J&E') => {
    const item = inventory.find((p) => p.id === id);
    if (!item) return;

    const oldStock = item.stock;
    const newStock = Math.max(0, oldStock + delta);
    updateSparePart(id, { stock: newStock });

    const tipoMov = tipoOverride || (delta > 0 ? 'Entrada Proveedor' : 'Salida / Consumo');

    const newMovement = {
      id: `MOV-${String(kardexMovements.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tipo: tipoMov,
      repuestoId: item.id,
      codigo: item.codigo,
      descripcion: item.descripcion,
      cantidad: Math.abs(delta),
      motivo,
      usuario,
      stockAnterior: oldStock,
      stockNuevo: newStock
    };
    setKardexMovements((prev) => [newMovement, ...prev]);
  };

  const deleteSparePart = (id) => {
    const part = inventory.find((p) => p.id === id);
    setInventory((prev) => prev.filter((item) => item.id !== id));
    logAudit('Inventario', `Eliminación de producto ${part?.codigo || id}`);
    showToast('Producto Eliminado', `${part?.codigo || 'Ítem'} retirado del catálogo.`, 'danger');
  };

  // RF-007: Acciones de Taller
  const addTallerOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-2026-${String(tallerOrders.length + 1).padStart(3, '0')}`,
      serie: order.serie || 'S/N',
      documentoCliente: order.documentoCliente || '',
      actividadesEfectuadas: order.actividadesEfectuadas || 'Recepción e inspección inicial.',
      observacionesTecnico: order.observacionesTecnico || '',
      manoObra: Number(order.manoObra || order.presupuestoEstimado || 0),
      presupuestoEstimado: Number(order.presupuestoEstimado) || 0,
      fechaIngreso: order.fechaIngreso || new Date().toISOString().split('T')[0],
      fechaEstimada: order.fechaEstimada || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      progreso: order.estado === 'Listo para Entrega' ? 100 : order.estado === 'En Proceso' ? 50 : 15,
      repuestosAsignados: order.repuestosAsignados || [],
      checklist: order.checklist || {
        chispaBujia: false,
        compresionMotor: false,
        filtroLimpio: false,
        fugaAceite: false,
        cajaEngranajesOK: false
      }
    };
    setTallerOrders((prev) => [newOrder, ...prev]);
    logAudit('Taller', `Ingreso de orden ${newOrder.id} (${newOrder.modelo}) para ${newOrder.propietario}`);
    showToast('Orden Creada', `Orden ${newOrder.id} registrada en el taller.`);
    return newOrder;
  };

  const assignPartToOrder = (orderId, partId, cantidad = 1) => {
    const part = inventory.find((p) => p.id === partId);
    if (!part) return false;

    if (part.stock < cantidad) {
      showToast('Stock Insuficiente', `No hay suficientes existencias de ${part.codigo}`, 'danger');
      return false;
    }

    adjustStockWithReason(partId, -cantidad, `Consumo en Orden ${orderId}`, 'Consumo en Taller', 'Servicio Técnico');

    setTallerOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const currentParts = ord.repuestosAsignados || [];
          const existing = currentParts.find((p) => p.id === partId);
          let updatedParts;
          if (existing) {
            updatedParts = currentParts.map((p) =>
              p.id === partId ? { ...p, cantidad: p.cantidad + cantidad } : p
            );
          } else {
            updatedParts = [
              ...currentParts,
              {
                id: part.id,
                codigo: part.codigo,
                descripcion: part.descripcion,
                cantidad,
                precio: part.precioUnitario
              }
            ];
          }

          const addedCost = part.precioUnitario * cantidad;
          return {
            ...ord,
            presupuestoEstimado: (Number(ord.presupuestoEstimado) || 0) + addedCost,
            repuestosAsignados: updatedParts
          };
        }
        return ord;
      })
    );

    logAudit('Taller & Inventario', `Repuesto ${part.codigo} (x${cantidad}) asignado a Orden ${orderId}`);
    showToast('Repuesto Asignado', `${cantidad}x ${part.codigo} descontado del stock y sumado a la orden.`);
    return true;
  };

  const updateTallerOrderStatus = (orderId, newStatus) => {
    setTallerOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          let progreso = order.progreso;
          if (newStatus === 'Listo para Entrega') progreso = 100;
          else if (newStatus === 'En Proceso') progreso = 60;
          else if (newStatus === 'Ingresado') progreso = 15;

          return {
            ...order,
            estado: newStatus,
            progreso
          };
        }
        return order;
      })
    );
    logAudit('Taller', `Orden ${orderId} actualizada a estado: ${newStatus}`);
    showToast('Estado Actualizado', `Orden ${orderId} pasó a: ${newStatus}`, 'info');
  };

  const updateTallerOrder = (orderId, updatedFields) => {
    setTallerOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...updatedFields } : order))
    );
    logAudit('Taller', `Actualización técnica en orden ${orderId}`);
    showToast('Orden Actualizada', `Se guardaron los cambios de la orden ${orderId}`);
  };

  // RF-004: Cotizaciones
  const addCotizacion = (nuevaCotizacion) => {
    const newId = `COT-2026-${String(cotizaciones.length + 1).padStart(4, '0')}`;
    const quoteWithId = {
      ...nuevaCotizacion,
      id: newId,
      fecha: nuevaCotizacion.fecha || new Date().toISOString().split('T')[0],
      estado: nuevaCotizacion.estado || 'Pendiente'
    };
    setCotizaciones((prev) => [quoteWithId, ...prev]);
    logAudit('Cotizaciones', `Creación de cotización ${newId} por ${formatCurrency(quoteWithId.total)}`);
    showToast('Cotización Guardada', `Cotización ${newId} generada exitosamente.`);
    return quoteWithId;
  };

  const updateCotizacion = (quoteId, updatedQuote) => {
    setCotizaciones((prev) =>
      prev.map((c) => (c.id === quoteId ? { ...c, ...updatedQuote } : c))
    );
    logAudit('Cotizaciones', `Modificación de cotización ${quoteId}`);
    showToast('Cotización Modificada', `Se actualizaron los datos de ${quoteId}.`);
  };

  const updateCotizacionStatus = (quoteId, nuevoEstado) => {
    setCotizaciones((prev) =>
      prev.map((c) => (c.id === quoteId ? { ...c, estado: nuevoEstado } : c))
    );
    logAudit('Cotizaciones', `Estado de cotización ${quoteId} cambiado a ${nuevoEstado}`);
    showToast('Estado Actualizado', `Cotización marcada como: ${nuevoEstado}`);
  };

  const convertQuoteToSale = (quoteId) => {
    const quote = cotizaciones.find((c) => c.id === quoteId);
    if (!quote) return null;

    const nextInvoiceNumber = `FE-${String(1001 + ventas.length).padStart(6, '0')}`;
    const cufeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newSale = {
      id: `VTA-2026-${String(1 + ventas.length).padStart(4, '0')}`,
      numeroFactura: nextInvoiceNumber,
      cufe: cufeHash,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cliente: quote.cliente.nombre,
      documentoCliente: quote.cliente.documento,
      telefonoCliente: quote.cliente.telefono || '',
      direccionCliente: quote.cliente.ciudad || 'Mostrador Principal',
      emailCliente: quote.cliente.correo || '',
      vendedor: 'Juan Fernando Posada',
      metodoPago: 'Transferencia',
      estadoDian: 'Aprobada',
      itemsCount: quote.items.reduce((acc, i) => acc + Number(i.cantidad || 1), 0),
      subtotal: quote.subtotal,
      iva: quote.iva,
      total: quote.total,
      estadoPedido: 'Entregado',
      itemsDetalle: quote.items.map((it, idx) => ({
        id: idx + 1,
        codigo: it.codigo || (it.tipo === 'mano_obra' ? 'SRV-MO' : `ITEM-0${idx + 1}`),
        descripcion: it.descripcion,
        unidad: it.tipo === 'mano_obra' ? 'Servicio' : 'Unidad',
        cantidad: it.cantidad,
        valorUnitario: it.valorUnitario
      }))
    };

    setVentas((prev) => [newSale, ...prev]);
    updateCotizacionStatus(quoteId, 'Facturada');
    logAudit('Facturación DIAN', `Conversión de cotización ${quoteId} en Factura Electrónica ${nextInvoiceNumber}`);
    showToast('Cotización Facturada', `Factura electrónica DIAN ${nextInvoiceNumber} emitida.`);
    return newSale;
  };

  // RF-001 & RF-006: Ventas y Facturación DIAN
  const addVenta = (ventaData) => {
    const nextInvoiceNumber = `FE-${String(1001 + ventas.length).padStart(6, '0')}`;
    const cufeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newVenta = {
      id: `VTA-2026-${String(1 + ventas.length).padStart(4, '0')}`,
      numeroFactura: nextInvoiceNumber,
      cufe: cufeHash,
      fecha: ventaData.fecha ? `${ventaData.fecha} ${new Date().toTimeString().substring(0, 5)}` : nowStr,
      estadoDian: 'Aprobada',
      estadoPedido: ventaData.estadoPedido || 'Entregado',
      documentoCliente: ventaData.documentoCliente || '',
      direccionCliente: ventaData.direccionCliente || 'Mostrador Principal J&E',
      telefonoCliente: ventaData.telefonoCliente || '',
      emailCliente: ventaData.emailCliente || '',
      ...ventaData
    };

    setVentas((prev) => [newVenta, ...prev]);

    if (ventaData.itemsDetalle && ventaData.itemsDetalle.length > 0) {
      ventaData.itemsDetalle.forEach((it) => {
        if (it.repuestoId) {
          adjustStockWithReason(
            it.repuestoId,
            -Number(it.cantidad),
            `Venta Factura Electrónica ${nextInvoiceNumber}`,
            'Venta Mostrador',
            ventaData.vendedor || 'Administrador'
          );
        }
      });
    }

    const newPedido = {
      id: `PED-2026-${String(1 + pedidos.length).padStart(3, '0')}`,
      fecha: nowStr,
      cliente: newVenta.cliente,
      documento: newVenta.documentoCliente,
      telefono: newVenta.telefonoCliente,
      direccionEntrega: newVenta.direccionCliente,
      responsable: newVenta.vendedor,
      estado: newVenta.estadoPedido || 'Entregado',
      facturaAsociada: nextInvoiceNumber,
      items: (ventaData.itemsDetalle || []).map((it) => ({
        repuestoId: it.repuestoId,
        codigo: it.codigo || 'ITEM',
        descripcion: it.descripcion,
        cantidad: it.cantidad,
        precioUnitario: it.valorUnitario
      })),
      total: newVenta.total,
      historial: [
        { fecha: nowStr, estado: 'Pendiente', nota: 'Venta registrada en sistema' },
        { fecha: nowStr, estado: newVenta.estadoPedido || 'Entregado', nota: `Factura DIAN ${nextInvoiceNumber} emitida` }
      ]
    };
    setPedidos((prev) => [newPedido, ...prev]);

    logAudit('Ventas & Facturación DIAN', `Emisión de factura ${nextInvoiceNumber} a ${newVenta.cliente} por ${formatCurrency(newVenta.total)}`);
    showToast('Venta y Factura Registrada', `Comprobante ${nextInvoiceNumber} emitido exitosamente.`);
    return newVenta;
  };

  const reEmitirDian = (ventaId) => {
    setVentas((prev) =>
      prev.map((v) => (v.id === ventaId ? { ...v, estadoDian: 'Aprobada' } : v))
    );
    showToast('Sincronización DIAN', 'Comprobante aprobado por la DIAN.');
  };

  // RF-005: Gestión de Pedidos
  const addPedido = (pedidoData) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newPedido = {
      id: `PED-2026-${String(1 + pedidos.length).padStart(3, '0')}`,
      fecha: nowStr,
      cliente: pedidoData.cliente,
      documento: pedidoData.documento || '',
      telefono: pedidoData.telefono || '',
      direccionEntrega: pedidoData.direccionEntrega || 'Mostrador Principal',
      responsable: pedidoData.responsable || 'Administrador',
      estado: pedidoData.estado || 'Pendiente',
      facturaAsociada: pedidoData.facturaAsociada || 'Por facturar',
      items: pedidoData.items || [],
      total: pedidoData.total || 0,
      historial: [
        { fecha: nowStr, estado: pedidoData.estado || 'Pendiente', nota: pedidoData.nota || 'Pedido registrado' }
      ]
    };
    setPedidos((prev) => [newPedido, ...prev]);
    logAudit('Gestión de Pedidos', `Nuevo pedido ${newPedido.id} registrado para ${newPedido.cliente}`);
    showToast('Pedido Registrado', `Pedido ${newPedido.id} creado en estado ${newPedido.estado}.`);
    return newPedido;
  };

  const updatePedidoStatus = (pedidoId, nuevoEstado, nota = '') => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setPedidos((prev) =>
      prev.map((p) => {
        if (p.id === pedidoId) {
          const entry = {
            fecha: nowStr,
            estado: nuevoEstado,
            nota: nota || `Cambio de estado a ${nuevoEstado}`
          };
          return {
            ...p,
            estado: nuevoEstado,
            historial: [...(p.historial || []), entry]
          };
        }
        return p;
      })
    );
    logAudit('Gestión de Pedidos', `Pedido ${pedidoId} actualizado a estado: ${nuevoEstado}`);
    showToast('Estado Actualizado', `El pedido ${pedidoId} pasó a: ${nuevoEstado}`, 'info');
  };

  // RF-009: Devoluciones
  const addDevolucion = (devData) => {
    const part = inventory.find((p) => p.id === devData.repuestoId);
    const cantidad = Number(devData.cantidad) || 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newDev = {
      id: `DEV-2026-${String(devoluciones.length + 1).padStart(3, '0')}`,
      fecha: nowStr,
      facturaOrigen: devData.facturaOrigen || 'S/F',
      cliente: devData.cliente || 'Cliente Mostrador',
      repuestoId: part?.id || '',
      codigo: part?.codigo || devData.codigoManual || 'ITEM',
      descripcion: part?.descripcion || devData.descripcionManual || 'Producto devuelto',
      cantidad,
      tipoAccion: devData.tipoAccion || 'Reingreso a Inventario',
      motivo: devData.motivo || 'Devolución registrada',
      usuarioResponsable: devData.usuarioResponsable || 'Administrador',
      valorReintegrado: (part?.precioUnitario || Number(devData.valorUnitario) || 0) * cantidad,
      estado: 'Procesada'
    };

    setDevoluciones((prev) => [newDev, ...prev]);

    if (part && newDev.tipoAccion === 'Reingreso a Inventario') {
      adjustStockWithReason(
        part.id,
        cantidad,
        `Devolución ${newDev.id}: ${newDev.motivo}`,
        'Devolución Cliente',
        newDev.usuarioResponsable
      );
    }

    logAudit('Devoluciones (RF-009)', `Devolución ${newDev.id} registrada (${cantidad}x ${newDev.codigo})`, newDev.usuarioResponsable);
    showToast('Devolución Procesada', `${newDev.id} registrada correctamente.`);
    return newDev;
  };

  // RF-010: Consultas de Asesoría
  const addConsultaAsesoria = (consultaData) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newConsulta = {
      id: `ASE-2026-${String(consultasAsesoria.length + 1).padStart(2, '0')}`,
      fecha: nowStr,
      cliente: consultaData.cliente,
      equipo: consultaData.equipo,
      consulta: consultaData.consulta,
      respuestaTecnica: consultaData.respuestaTecnica || 'Recomendación técnica registrada.',
      atendidoPor: consultaData.atendidoPor || 'Especialista J&E',
      estado: 'Respondida'
    };
    setConsultasAsesoria((prev) => [newConsulta, ...prev]);
    logAudit('Módulo de Asesorías', `Nueva asesoría ${newConsulta.id} para ${newConsulta.cliente}`);
    showToast('Asesoría Guardada', `Recomendación registrada para ${newConsulta.cliente}.`);
    return newConsulta;
  };

  return (
    <AppDataContext.Provider
      value={{
        inventory,
        tallerOrders,
        cotizaciones,
        ventas,
        pedidos,
        devoluciones,
        asesorias,
        consultasAsesoria,
        kardexMovements,
        auditLogs,
        servicePackages: SERVICE_PACKAGES,
        globalSearch,
        setGlobalSearch,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        lowStockItems,
        toasts,
        showToast,
        removeToast,
        clearAllData,
        formatCurrency,
        numberToWordsCOP,
        dianInfo: DIAN_STATUS_INFO,
        logAudit,
        addSparePart,
        updateSparePart,
        adjustStockWithReason,
        deleteSparePart,
        addTallerOrder,
        assignPartToOrder,
        updateTallerOrderStatus,
        updateTallerOrder,
        addCotizacion,
        updateCotizacion,
        updateCotizacionStatus,
        convertQuoteToSale,
        addVenta,
        reEmitirDian,
        addPedido,
        updatePedidoStatus,
        addDevolucion,
        addConsultaAsesoria
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData debe ser utilizado dentro de un AppDataProvider');
  }
  return context;
};
