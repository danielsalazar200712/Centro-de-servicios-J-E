import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Package,
  Wrench,
  Plus,
  Receipt,
  ChevronRight,
  BookOpenCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    inventory,
    tallerOrders,
    ventas,
    pedidos,
    cotizaciones,
    auditLogs,
    lowStockItems,
    formatCurrency
  } = useAppData();

  const totalStockUnits = inventory.reduce((acc, item) => acc + item.stock, 0);
  const totalVentasValor = ventas.reduce((acc, v) => acc + v.total, 0);
  const activeTallerOrders = tallerOrders.filter((o) => o.estado !== 'Listo para Entrega').length;
  const activePedidos = pedidos.filter((p) => p.estado !== 'Entregado').length;

  const isSystemEmpty =
    inventory.length === 0 &&
    ventas.length === 0 &&
    tallerOrders.length === 0 &&
    cotizaciones.length === 0;

  return (
    <div className="space-y-6">
      {/* Encabezado Ejecutivo Premium */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-surface-border shadow-premium">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-surface-dark">
              Bienvenido, {currentUser?.nombre}
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-agri-soft text-agri border border-emerald-200">
              {currentUser?.rol}
            </span>
          </div>
          <p className="text-xs text-surface-muted mt-1">
            Centro de Servicios J&E • Panel operativo en tiempo real conectado con facturación electrónica DIAN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/inventario')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-agri" />
            <span>Catálogo Repuestos</span>
          </button>
          <button
            onClick={() => navigate('/taller')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-agri" />
            <span>Orden de Taller</span>
          </button>
          <button
            onClick={() => navigate('/ventas')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri text-white font-bold text-xs hover:bg-agri-hover transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Venta</span>
          </button>
        </div>
      </div>

      {/* Asistente Intuitivo de Inicio Rápido (Se muestra cuando el sistema está limpio sin datos) */}
      {isSystemEmpty && (
        <div className="bg-white rounded-2xl border border-emerald-400/60 shadow-premium p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-surface-dark">
                  Sistema Listo para Operar en Limpio
                </h2>
                <p className="text-xs text-surface-muted">
                  No hay artículos ni registros de muestra cargados. Sigue estos 3 pasos intuitivos para comenzar tu operación real:
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div
              onClick={() => navigate('/inventario')}
              className="p-4 rounded-xl bg-surface-bg/70 border border-surface-border hover:border-agri cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-agri mb-2">
                  Paso 1 • Inventario
                </span>
                <h3 className="text-sm font-display font-bold text-surface-dark group-hover:text-agri">
                  Registrar productos en el catálogo
                </h3>
                <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                  Crea tus repuestos, insumos o consumibles con su código SKU, stock inicial y precio de venta.
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-agri">
                <span>Ir a Inventario</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => navigate('/cotizaciones')}
              className="p-4 rounded-xl bg-surface-bg/70 border border-surface-border hover:border-agri cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-agri mb-2">
                  Paso 2 • Taller y Cotizaciones
                </span>
                <h3 className="text-sm font-display font-bold text-surface-dark group-hover:text-agri">
                  Ingresar equipos o cotizar servicios
                </h3>
                <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                  Registra órdenes de reparación de maquinaria agrícola o elabora cotizaciones con mano de obra.
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-agri">
                <span>Crear Cotización / Orden</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => navigate('/ventas')}
              className="p-4 rounded-xl bg-surface-bg/70 border border-surface-border hover:border-agri cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-agri mb-2">
                  Paso 3 • Ventas y DIAN
                </span>
                <h3 className="text-sm font-display font-bold text-surface-dark group-hover:text-agri">
                  Facturar y descontar inventario
                </h3>
                <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                  Emite facturas electrónicas DIAN con CUFE, seguimiento de pedidos y descuento automático de stock.
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-agri">
                <span>Registrar primera venta</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Reales (Cero datos ficticios) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas Facturadas"
          value={formatCurrency(totalVentasValor)}
          subtitle={`${ventas.length} facturas emitidas`}
          icon={DollarSign}
          trend={ventas.length > 0 ? 'DIAN Activo' : 'Sin ventas aún'}
          trendType="up"
          onClick={() => navigate('/ventas')}
        />

        <StatCard
          title="Catálogo e Inventario"
          value={`${totalStockUnits} unids`}
          subtitle={`${inventory.length} productos creados`}
          icon={Package}
          trend={lowStockItems.length > 0 ? `${lowStockItems.length} en alerta` : 'Catálogo al día'}
          trendType={lowStockItems.length > 0 ? 'down' : 'up'}
          onClick={() => navigate('/inventario')}
        />

        <StatCard
          title="Pedidos & Cotizaciones"
          value={`${pedidos.length} Pedidos`}
          subtitle={`${cotizaciones.length} cotizaciones`}
          icon={ShoppingBag}
          trend={activePedidos > 0 ? `${activePedidos} en curso` : 'Al día'}
          trendType="up"
          onClick={() => navigate('/cotizaciones')}
        />

        <StatCard
          title="Equipos en Taller"
          value={`${tallerOrders.length} Órdenes`}
          subtitle={`${activeTallerOrders} en reparación`}
          icon={Wrench}
          trend="Servicio Técnico"
          trendType="up"
          onClick={() => navigate('/taller')}
        />
      </div>

      {/* Sección Central: Últimas Facturas Reales y Equipos en Taller Reales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabla de Facturas Emitidas */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-bold text-surface-dark flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-agri" />
                  <span>Facturas Electrónicas Recientes</span>
                </h3>
                <p className="text-xs text-surface-muted mt-0.5">
                  Comprobantes reales registrados en la sesión
                </p>
              </div>
              <button
                onClick={() => navigate('/ventas')}
                className="text-xs font-bold text-agri hover:underline cursor-pointer"
              >
                Ir a Ventas →
              </button>
            </div>

            {ventas.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Aún no se han emitido facturas</p>
                  <p className="text-xs text-surface-muted mt-0.5 max-w-xs mx-auto">
                    Cuando registres tu primera venta o conviertas una cotización, aparecerá aquí con su CUFE.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/ventas')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-agri text-white text-xs font-bold hover:bg-agri-hover cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Emitir primera factura</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-4 py-3">Factura</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Pago</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center">DIAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-700">
                    {ventas.slice(0, 5).map((venta) => (
                      <tr key={venta.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-agri">
                          {venta.numeroFactura}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 truncate max-w-[180px]">
                          {venta.cliente}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700">
                            {venta.metodoPago}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(venta.total)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge status={venta.estadoDian}>{venta.estadoDian}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Órdenes de Taller y Actividad Reciente */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-bold text-surface-dark flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-agri" />
                  <span>Equipos en Servicio Técnico</span>
                </h3>
                <p className="text-xs text-surface-muted mt-0.5">
                  Órdenes activas en banco de trabajo
                </p>
              </div>
              <button
                onClick={() => navigate('/taller')}
                className="text-xs font-bold text-agri hover:underline cursor-pointer"
              >
                Ver taller →
              </button>
            </div>

            {tallerOrders.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Sin equipos ingresados en taller</p>
                  <p className="text-xs text-surface-muted mt-0.5 max-w-xs mx-auto">
                    Registra el ingreso de guadañadoras, motosierras o fumigadoras para llevar su trazabilidad.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/taller')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-agri" />
                  <span>Registrar orden de trabajo</span>
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-2.5">
                {tallerOrders.slice(0, 4).map((orden) => (
                  <div
                    key={orden.id}
                    onClick={() => navigate('/taller')}
                    className="p-3 rounded-xl border border-surface-border hover:border-agri/40 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-agri">{orden.id}</span>
                        <p className="text-xs font-bold text-slate-900 truncate">{orden.modelo}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        Cliente: {orden.propietario}
                      </p>
                    </div>
                    <Badge status={orden.estado}>{orden.estado}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bitácora de Auditoría Compacta */}
          {auditLogs.length > 0 && (
            <div className="p-3.5 bg-slate-50 border-t border-surface-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-4 h-4 text-agri flex-shrink-0" />
                <span className="text-slate-600 truncate">
                  Última acción: <strong>{auditLogs[0].accion}</strong>
                </span>
              </div>
              <button
                onClick={() => navigate('/reportes')}
                className="text-agri font-bold hover:underline flex-shrink-0 ml-2 cursor-pointer"
              >
                Logs ({auditLogs.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
