import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  Table
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Badge from '../components/common/Badge';

export default function Reportes() {
  const {
    ventas,
    inventory,
    pedidos,
    tallerOrders,
    devoluciones,
    auditLogs,
    formatCurrency,
    showToast,
    logAudit
  } = useAppData();

  const [tipoReporte, setTipoReporte] = useState('ventas');
  const [fechaInicio, setFechaInicio] = useState('2026-01-01');
  const [fechaFin, setFechaFin] = useState('2026-12-31');
  const [isExporting, setIsExporting] = useState(false);

  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalIvaRecaudado = ventas.reduce((acc, v) => acc + v.iva, 0);
  const valorInventario = inventory.reduce((acc, i) => acc + i.stock * i.precioUnitario, 0);

  const handleExportExcel = () => {
    setIsExporting(true);
    let headers = [];
    let rows = [];

    if (tipoReporte === 'ventas') {
      headers = ['ID Venta', 'No. Factura DIAN', 'Fecha', 'Cliente', 'Documento', 'Vendedor', 'Medio Pago', 'Subtotal COP', 'IVA 19% COP', 'Total COP', 'Estado DIAN', 'CUFE'];
      rows = ventas.map((v) => [
        v.id,
        v.numeroFactura,
        v.fecha,
        v.cliente,
        v.documentoCliente || '',
        v.vendedor,
        v.metodoPago,
        v.subtotal,
        v.iva,
        v.total,
        v.estadoDian,
        v.cufe
      ]);
    } else if (tipoReporte === 'inventario') {
      headers = ['ID', 'Codigo SKU', 'Descripcion', 'Categoria', 'Marca', 'Stock Actual', 'Stock Minimo', 'Precio Unitario COP', 'Valor Total Stock', 'Ubicacion', 'Estado'];
      rows = inventory.map((i) => [
        i.id,
        i.codigo,
        i.descripcion,
        i.categoria,
        i.marca,
        i.stock,
        i.stockMinimo,
        i.precioUnitario,
        i.stock * i.precioUnitario,
        i.ubicacion,
        i.estado
      ]);
    } else if (tipoReporte === 'pedidos') {
      headers = ['ID Pedido', 'Fecha', 'Cliente', 'Documento', 'Destino Entrega', 'Factura Asociada', 'Total COP', 'Estado'];
      rows = pedidos.map((p) => [
        p.id,
        p.fecha,
        p.cliente,
        p.documento,
        p.direccionEntrega,
        p.facturaAsociada,
        p.total,
        p.estado
      ]);
    } else if (tipoReporte === 'taller') {
      headers = ['No. Orden', 'Fecha Ingreso', 'Equipo y Modelo', 'Serie', 'Cliente', 'Tecnico Asignado', 'Diagnostico', 'Presupuesto COP', 'Estado'];
      rows = tallerOrders.map((o) => [
        o.id,
        o.fechaIngreso,
        o.modelo,
        o.serie || '',
        o.propietario,
        o.tecnicoAsignado,
        o.diagnostico,
        o.presupuestoEstimado,
        o.estado
      ]);
    } else if (tipoReporte === 'devoluciones') {
      headers = ['ID Devolucion', 'Fecha', 'Factura Origen', 'Cliente', 'Codigo Repuesto', 'Cantidad', 'Accion Inventario', 'Motivo', 'Responsable', 'Valor Reintegrado'];
      rows = devoluciones.map((d) => [
        d.id,
        d.fecha,
        d.facturaOrigen,
        d.cliente,
        d.codigo,
        d.cantidad,
        d.tipoAccion,
        d.motivo,
        d.usuarioResponsable,
        d.valorReintegrado
      ]);
    } else {
      headers = ['ID Log', 'Fecha y Hora', 'Usuario', 'Rol', 'Modulo', 'Accion Registrada'];
      rows = auditLogs.map((l) => [l.id, l.fecha, l.usuario, l.rol, l.modulo, l.accion]);
    }

    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(';'), ...rows.map((r) => r.map(escapeCsv).join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${tipoReporte.toUpperCase()}_CentroServiciosJE.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsExporting(false);
      logAudit('Reportes', `Exportación a Excel (.csv) del reporte de ${tipoReporte.toUpperCase()}`);
      showToast('Reporte Excel Descargado', `Archivo CSV generado con los registros reales.`);
    }, 300);
  };

  const handleExportPDF = () => {
    logAudit('Reportes', `Impresión PDF del reporte de ${tipoReporte.toUpperCase()}`);
    window.print();
  };

  return (
    <div id="printable-fiscal-invoice" className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-surface-dark tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-agri" />
            <span>Reportes Administrativos y Exportación (PDF / Excel)</span>
          </h1>
          <p className="text-xs text-surface-muted mt-0.5">
            Genera informes consolidados basados en los registros reales del sistema
          </p>
        </div>

        <div className="no-print flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri hover:bg-agri-hover text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel (.csv)</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Exportar PDF / Imprimir</span>
          </button>
        </div>
      </div>

      {/* Selector de Reporte */}
      <div className="no-print bg-white p-5 rounded-2xl border border-surface-border shadow-premium">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Módulo a consultar
            </label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="ventas">1. Ventas y Facturación DIAN ({ventas.length})</option>
              <option value="inventario">2. Catálogo e Inventario ({inventory.length})</option>
              <option value="pedidos">3. Gestión de Pedidos ({pedidos.length})</option>
              <option value="taller">4. Órdenes de Taller ({tallerOrders.length})</option>
              <option value="devoluciones">5. Devoluciones Registradas ({devoluciones.length})</option>
              <option value="auditoria">6. Bitácora de Auditoría ({auditLogs.length})</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fecha inicial
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fecha final
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* KPIs Reales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-premium">
          <span className="text-[11px] font-bold uppercase text-surface-muted">Total Facturado</span>
          <h3 className="text-2xl font-display font-bold text-slate-900 mt-1 font-mono">{formatCurrency(totalVentas)}</h3>
          <span className="text-xs text-surface-muted">{ventas.length} facturas emitidas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-premium">
          <span className="text-[11px] font-bold uppercase text-surface-muted">IVA Liquidado (19%)</span>
          <h3 className="text-2xl font-display font-bold text-agri mt-1 font-mono">{formatCurrency(totalIvaRecaudado)}</h3>
          <span className="text-xs text-surface-muted">Impuesto calculado sobre ventas reales</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-premium">
          <span className="text-[11px] font-bold uppercase text-surface-muted">Valorización de Inventario</span>
          <h3 className="text-2xl font-display font-bold text-slate-900 mt-1 font-mono">{formatCurrency(valorInventario)}</h3>
          <span className="text-xs text-surface-muted">{inventory.length} productos en catálogo</span>
        </div>
      </div>

      {/* Tabla de Datos del Reporte */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-bg">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-agri" />
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-slate-800">
              Vista Preliminar del Reporte: {tipoReporte.toUpperCase()}
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          {tipoReporte === 'ventas' &&
            (ventas.length === 0 ? (
              <div className="p-10 text-center text-xs text-surface-muted">No hay ventas registradas para reportar.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Factura DIAN</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Vendedor</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                    <th className="px-4 py-3 text-right">IVA (19%)</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {ventas.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-agri">{v.numeroFactura}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{v.fecha}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{v.cliente}</td>
                      <td className="px-4 py-3 text-slate-600">{v.vendedor}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(v.subtotal)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(v.iva)}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

          {tipoReporte === 'inventario' &&
            (inventory.length === 0 ? (
              <div className="p-10 text-center text-xs text-surface-muted">No hay productos registrados en el catálogo.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Marca / Categoría</th>
                    <th className="px-4 py-3 text-center">Stock</th>
                    <th className="px-4 py-3 text-right">Precio Unit.</th>
                    <th className="px-4 py-3 text-right">Valorizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {inventory.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-agri">{i.codigo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{i.descripcion}</td>
                      <td className="px-4 py-3 text-slate-600">{i.marca} • {i.categoria}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold">{i.stock}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(i.precioUnitario)}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{formatCurrency(i.stock * i.precioUnitario)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

          {tipoReporte === 'pedidos' &&
            (pedidos.length === 0 ? (
              <div className="p-10 text-center text-xs text-surface-muted">No hay pedidos registrados.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">ID Pedido</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Entrega</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {pedidos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-agri">{p.id}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{p.fecha}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{p.cliente}</td>
                      <td className="px-4 py-3 text-slate-600">{p.direccionEntrega}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{formatCurrency(p.total)}</td>
                      <td className="px-4 py-3 text-center"><Badge status={p.estado}>{p.estado}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

          {tipoReporte === 'taller' &&
            (tallerOrders.length === 0 ? (
              <div className="p-10 text-center text-xs text-surface-muted">No hay órdenes de taller registradas.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Orden</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Equipo</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3 text-right">Presupuesto</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {tallerOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-agri">{o.id}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{o.fechaIngreso}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{o.modelo}</td>
                      <td className="px-4 py-3 text-slate-700">{o.propietario}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{formatCurrency(o.presupuestoEstimado)}</td>
                      <td className="px-4 py-3 text-center"><Badge status={o.estado}>{o.estado}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

          {tipoReporte === 'devoluciones' &&
            (devoluciones.length === 0 ? (
              <div className="p-10 text-center text-xs text-surface-muted">No hay devoluciones registradas.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Factura</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Motivo</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {devoluciones.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-agri">{d.id}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{d.fecha}</td>
                      <td className="px-4 py-3 font-mono">{d.facturaOrigen}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{d.codigo} (x{d.cantidad})</td>
                      <td className="px-4 py-3 text-slate-600">{d.motivo}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{formatCurrency(d.valorReintegrado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

          {tipoReporte === 'auditoria' &&
            (auditLogs.length === 0 ? (
              <div className="p-10 text-center text-xs text-surface-muted">Aún no hay eventos registrados en la bitácora.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Módulo</th>
                    <th className="px-4 py-3">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {auditLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-agri">{l.id}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{l.fecha}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{l.usuario}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{l.modulo}</td>
                      <td className="px-4 py-3 text-slate-600">{l.accion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
        </div>
      </div>
    </div>
  );
}
