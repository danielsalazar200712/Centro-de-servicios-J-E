import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  History,
  PackagePlus,
  Printer,
  UserCheck,
  ClipboardCheck
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function TallerReparaciones() {
  const {
    tallerOrders,
    inventory,
    addTallerOrder,
    assignPartToOrder,
    updateTallerOrderStatus,
    updateTallerOrder,
    formatCurrency
  } = useAppData();

  const [viewMode, setViewMode] = useState('kanban');
  const [search, setSearch] = useState('');
  const [selectedClientFilter, setSelectedClientFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const [partIdToAssign, setPartIdToAssign] = useState('');
  const [partQtyToAssign, setPartQtyToAssign] = useState(1);

  const columnas = [
    { id: 'Ingresado', title: '1. Ingresado / Recepción' },
    { id: 'En Proceso', title: '2. En Diagnóstico y Reparación' },
    { id: 'Listo para Entrega', title: '3. Listo para Entrega' }
  ];

  const initialEmptyOrder = {
    modelo: '',
    tipoEquipo: 'Guadañadora',
    marca: 'STIHL',
    serie: '',
    propietario: '',
    documentoCliente: '',
    telefono: '',
    tecnicoAsignado: 'Yarlei Stiven Posada (Técnico Maquinaria)',
    diagnostico: '',
    actividadesEfectuadas: '',
    observacionesTecnico: '',
    prioridad: 'Media',
    presupuestoEstimado: '',
    estado: 'Ingresado'
  };

  const [newOrderForm, setNewOrderForm] = useState(initialEmptyOrder);

  const clientesUnicos = useMemo(() => {
    const set = new Set(tallerOrders.map((o) => o.propietario).filter(Boolean));
    return ['Todos', ...Array.from(set)];
  }, [tallerOrders]);

  const filteredOrders = tallerOrders.filter((ord) => {
    const term = search.toLowerCase();
    const matchesSearch =
      ord.id?.toLowerCase().includes(term) ||
      ord.modelo?.toLowerCase().includes(term) ||
      ord.tipoEquipo?.toLowerCase().includes(term) ||
      ord.propietario?.toLowerCase().includes(term) ||
      ord.marca?.toLowerCase().includes(term);

    const matchesClient =
      selectedClientFilter === 'Todos' || ord.propietario === selectedClientFilter;

    return matchesSearch && matchesClient;
  });

  const handleCreateOrder = (e) => {
    e.preventDefault();
    addTallerOrder({
      ...newOrderForm,
      presupuestoEstimado: Number(newOrderForm.presupuestoEstimado) || 0
    });
    setNewOrderForm(initialEmptyOrder);
    setIsNewOrderOpen(false);
  };

  const handleAssignPart = () => {
    const targetId = partIdToAssign || inventory[0]?.id;
    if (!selectedOrder || !targetId) return;
    const ok = assignPartToOrder(selectedOrder.id, targetId, Number(partQtyToAssign) || 1);
    if (ok) {
      const part = inventory.find((p) => p.id === targetId);
      if (part) {
        const currentParts = selectedOrder.repuestosAsignados || [];
        const existing = currentParts.find((p) => p.id === part.id);
        const newParts = existing
          ? currentParts.map((p) => (p.id === part.id ? { ...p, cantidad: p.cantidad + Number(partQtyToAssign) } : p))
          : [...currentParts, { id: part.id, codigo: part.codigo, descripcion: part.descripcion, cantidad: Number(partQtyToAssign), precio: part.precioUnitario }];
        setSelectedOrder({
          ...selectedOrder,
          presupuestoEstimado: (Number(selectedOrder.presupuestoEstimado) || 0) + part.precioUnitario * Number(partQtyToAssign),
          repuestosAsignados: newParts
        });
      }
    }
  };

  const handleToggleChecklist = (key) => {
    if (!selectedOrder) return;
    const updatedChecklist = {
      ...(selectedOrder.checklist || {}),
      [key]: !selectedOrder.checklist?.[key]
    };
    setSelectedOrder({ ...selectedOrder, checklist: updatedChecklist });
    updateTallerOrder(selectedOrder.id, { checklist: updatedChecklist });
  };

  const tecnicosDisponibles = [
    'Yarlei Stiven Posada (Técnico Maquinaria)',
    'Juan Fernando Posada (Admin / Técnico Senior)',
    'Eliecer Quintero (Mecánico Industrial)'
  ];

  const checklistLabels = {
    chispaBujia: 'Chispa de Bujía y Bobina OK',
    compresionMotor: 'Compresión de Cilindro OK',
    filtroLimpio: 'Filtro de Aire y Combustible Limpios',
    fugaAceite: 'Sin Fugas en Empaques / Retenedores',
    cajaEngranajesOK: 'Transmisión / Caja Reductora Engrasada'
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-surface-dark tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-agri" />
            <span>Taller de Maquinaria e Historial por Cliente</span>
          </h1>
          <p className="text-xs text-surface-muted mt-0.5">
            Registra órdenes de reparación, asigna repuestos del inventario y consulta el historial técnico por cliente
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-surface-border rounded-xl p-1 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-agri text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tablero Kanban
            </button>
            <button
              onClick={() => setViewMode('lista')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'lista' ? 'bg-agri text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista ({tallerOrders.length})
            </button>
            <button
              onClick={() => setViewMode('historial_cliente')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'historial_cliente' ? 'bg-agri text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historial por Cliente</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri text-white font-bold text-xs rounded-xl hover:bg-agri-hover transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden de Trabajo</span>
          </button>
        </div>
      </div>

      {tallerOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-emerald-400/60 shadow-premium p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-agri-soft text-agri border border-emerald-200 flex items-center justify-center mx-auto">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-display font-bold text-surface-dark">
              No hay órdenes de reparación activas
            </h3>
            <p className="text-xs text-surface-muted mt-1 leading-relaxed">
              Registra el ingreso de un equipo al taller para llevar el control de su diagnóstico, checklist mecánico, repuestos utilizados e historial por cliente.
            </p>
          </div>
          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri text-white font-bold text-xs hover:bg-agri-hover shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar primera orden de trabajo</span>
          </button>
        </div>
      ) : (
        <>
          {/* Buscador y Selector de Cliente */}
          <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-premium flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3.5 my-auto pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por orden, equipo, serie o cliente..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
              <UserCheck className="w-4 h-4 text-agri flex-shrink-0" />
              <span className="font-semibold text-slate-600 whitespace-nowrap">Cliente:</span>
              <select
                value={selectedClientFilter}
                onChange={(e) => setSelectedClientFilter(e.target.value)}
                className="px-3 py-2 bg-surface-bg border border-surface-border rounded-xl font-medium"
              >
                {clientesUnicos.map((cli) => (
                  <option key={cli} value={cli}>{cli}</option>
                ))}
              </select>
            </div>
          </div>

          {/* VISTA 1: KANBAN */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columnas.map((col) => {
                const columnOrders = filteredOrders.filter((o) => o.estado === col.id);
                return (
                  <div key={col.id} className="bg-white/60 rounded-2xl p-3.5 border border-surface-border flex flex-col min-h-[420px]">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
                      <span className="font-display font-bold text-xs text-slate-800 uppercase tracking-wide">
                        {col.title}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-agri border border-surface-border">
                        {columnOrders.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {columnOrders.length === 0 ? (
                        <div className="h-28 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                          Sin equipos en esta etapa
                        </div>
                      ) : (
                        columnOrders.map((orden) => (
                          <div
                            key={orden.id}
                            onClick={() => setSelectedOrder(orden)}
                            className="p-4 bg-white rounded-xl border border-surface-border hover:border-agri shadow-2xs transition-all cursor-pointer space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-agri">{orden.id}</span>
                              <span className="font-mono text-[10px] text-slate-400">{orden.fechaIngreso}</span>
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-sm text-slate-900">{orden.modelo}</h4>
                              <p className="text-xs text-slate-500">Cliente: {orden.propietario}</p>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 bg-surface-bg p-2.5 rounded-lg border border-surface-border">
                              {orden.diagnostico}
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                              <span className="font-mono font-bold text-agri">
                                {formatCurrency(orden.presupuestoEstimado)}
                              </span>
                              <div onClick={(e) => e.stopPropagation()}>
                                {col.id === 'Ingresado' && (
                                  <button
                                    onClick={() => updateTallerOrderStatus(orden.id, 'En Proceso')}
                                    className="px-2.5 py-1 bg-agri text-white font-semibold rounded-lg text-[11px] hover:bg-agri-hover cursor-pointer"
                                  >
                                    Iniciar →
                                  </button>
                                )}
                                {col.id === 'En Proceso' && (
                                  <button
                                    onClick={() => updateTallerOrderStatus(orden.id, 'Listo para Entrega')}
                                    className="px-2.5 py-1 bg-emerald-800 text-white font-semibold rounded-lg text-[11px] hover:bg-emerald-900 cursor-pointer"
                                  >
                                    Marcar Listo ✓
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VISTA 2: LISTA */}
          {viewMode === 'lista' && (
            <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-4 py-3.5">Orden</th>
                      <th className="px-4 py-3.5">Equipo & Serie</th>
                      <th className="px-4 py-3.5">Cliente</th>
                      <th className="px-4 py-3.5">Técnico</th>
                      <th className="px-4 py-3.5 text-right">Presupuesto</th>
                      <th className="px-4 py-3.5 text-center">Estado</th>
                      <th className="px-4 py-3.5 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-700">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3.5 font-mono font-bold text-agri">{ord.id}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-900 block">{ord.modelo}</span>
                          <span className="text-[10px] font-mono text-slate-400">Serie: {ord.serie || 'S/N'}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold">{ord.propietario}</td>
                        <td className="px-4 py-3.5 text-slate-600">{ord.tecnicoAsignado}</td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold">{formatCurrency(ord.presupuestoEstimado)}</td>
                        <td className="px-4 py-3.5 text-center"><Badge status={ord.estado}>{ord.estado}</Badge></td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 bg-agri text-white font-semibold rounded-lg text-xs hover:bg-agri-hover cursor-pointer"
                          >
                            Gestionar Orden
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 3: HISTORIAL POR CLIENTE (RF-007) */}
          {viewMode === 'historial_cliente' && (
            <div className="space-y-4">
              <div className="bg-agri-soft border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-bold text-agri">
                    Historial de Reparaciones por Cliente (RF-007)
                  </h3>
                  <p className="text-xs text-emerald-900">
                    Expediente técnico de diagnósticos, actividades ejecutadas, repuestos instalados y observaciones.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-agri text-white font-semibold text-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
              </div>

              {filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-surface-border shadow-premium p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-agri text-xs">{ord.id}</span>
                        <span>•</span>
                        <span className="font-display font-bold text-sm text-slate-900">{ord.propietario}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Equipo: <strong>{ord.modelo}</strong> (Serie: <span className="font-mono">{ord.serie || 'S/N'}</span>)
                      </p>
                    </div>
                    <Badge status={ord.estado}>{ord.estado}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border">
                      <span className="font-bold text-agri uppercase text-[10px] block mb-1">Diagnóstico</span>
                      <p className="text-slate-700">{ord.diagnostico}</p>
                    </div>
                    <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border">
                      <span className="font-bold text-agri uppercase text-[10px] block mb-1">Actividades Efectuadas</span>
                      <p className="text-slate-700">{ord.actividadesEfectuadas || 'En proceso'}</p>
                    </div>
                    <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border">
                      <span className="font-bold text-agri uppercase text-[10px] block mb-1">Observaciones del Técnico</span>
                      <p className="text-slate-700">{ord.observacionesTecnico || 'Sin observaciones adicionales'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Ficha Técnica de la Orden */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Orden de Reparación ${selectedOrder?.id}`}
        subtitle="Actualiza el diagnóstico, marca el checklist mecánico y asigna repuestos del inventario."
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between gap-3 p-4 bg-surface-bg rounded-xl border border-surface-border">
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900">{selectedOrder.modelo}</h4>
                <p className="text-xs text-slate-600">
                  Cliente: <strong>{selectedOrder.propietario}</strong> • Tel: {selectedOrder.telefono || 'N/A'}
                </p>
              </div>
              <Badge status={selectedOrder.estado}>{selectedOrder.estado}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Diagnóstico Técnico:</label>
                <textarea
                  rows={2}
                  value={selectedOrder.diagnostico}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, diagnostico: e.target.value })}
                  onBlur={() => updateTallerOrder(selectedOrder.id, { diagnostico: selectedOrder.diagnostico })}
                  className="w-full p-3 bg-white rounded-xl border border-surface-border"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Actividades Efectuadas:</label>
                <textarea
                  rows={2}
                  value={selectedOrder.actividadesEfectuadas || ''}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, actividadesEfectuadas: e.target.value })}
                  onBlur={() => updateTallerOrder(selectedOrder.id, { actividadesEfectuadas: selectedOrder.actividadesEfectuadas })}
                  className="w-full p-3 bg-white rounded-xl border border-surface-border"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Observaciones del Técnico:</label>
              <input
                type="text"
                value={selectedOrder.observacionesTecnico || ''}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, observacionesTecnico: e.target.value })}
                onBlur={() => updateTallerOrder(selectedOrder.id, { observacionesTecnico: selectedOrder.observacionesTecnico })}
                placeholder="Recomendaciones para el cliente..."
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-surface-border"
              />
            </div>

            <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-agri">
                <ClipboardCheck className="w-4 h-4" />
                <span>Checklist de Inspección Mecánica:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(checklistLabels).map(([key, label]) => {
                  const checked = !!selectedOrder.checklist?.[key];
                  return (
                    <label
                      key={key}
                      onClick={() => handleToggleChecklist(key)}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-surface-border cursor-pointer hover:border-agri"
                    >
                      <input type="checkbox" checked={checked} onChange={() => {}} className="w-4 h-4 text-agri rounded" />
                      <span className={checked ? 'font-semibold text-slate-900' : 'text-slate-500'}>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {inventory.length > 0 && (
              <div className="p-4 bg-white rounded-xl border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PackagePlus className="w-4 h-4 text-agri" />
                    <span>Asignar Repuesto del Catálogo</span>
                  </span>
                  <span className="font-mono font-bold text-agri">
                    Total Orden: {formatCurrency(selectedOrder.presupuestoEstimado)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={partIdToAssign}
                    onChange={(e) => setPartIdToAssign(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-surface-border rounded-xl"
                  >
                    {inventory.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.codigo} - {p.descripcion} ({formatCurrency(p.precioUnitario)}) [Stock: {p.stock}]
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={partQtyToAssign}
                    onChange={(e) => setPartQtyToAssign(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-2 bg-white border border-surface-border rounded-xl text-center font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAssignPart}
                    className="px-3.5 py-2 bg-agri hover:bg-agri-hover text-white font-semibold rounded-xl cursor-pointer"
                  >
                    + Asignar
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 pt-2">
              {['Ingresado', 'En Proceso', 'Listo para Entrega'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    updateTallerOrderStatus(selectedOrder.id, st);
                    setSelectedOrder({ ...selectedOrder, estado: st });
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold cursor-pointer ${
                    selectedOrder.estado === st
                      ? 'bg-agri text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Nueva Orden Limpio */}
      <Modal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        title="Registrar ingreso de equipo al taller"
        subtitle="Completa los datos del cliente, la máquina recibida y el diagnóstico inicial."
        size="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold mb-1.5">Tipo de equipo *</label>
              <select
                value={newOrderForm.tipoEquipo}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, tipoEquipo: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              >
                <option value="Guadañadora">Guadañadora</option>
                <option value="Motosierra">Motosierra</option>
                <option value="Sopladora">Sopladora</option>
                <option value="Bomba Estacionaria">Bomba Estacionaria / Fumigadora</option>
                <option value="Motoazada para Arar">Motoazada / Rotavator</option>
                <option value="Podadora de Césped">Podadora de Césped</option>
                <option value="Cuatrimoto Infantil">Cuatrimoto</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Modelo y marca *</label>
              <input
                type="text"
                required
                value={newOrderForm.modelo}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, modelo: e.target.value })}
                placeholder="Ej: STIHL FS 250 o Husqvarna 365"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Número de serie</label>
              <input
                type="text"
                value={newOrderForm.serie}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, serie: e.target.value })}
                placeholder="Ej: SN-44810"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold mb-1.5">Nombre del cliente / propietario *</label>
              <input
                type="text"
                required
                value={newOrderForm.propietario}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, propietario: e.target.value })}
                placeholder="Ej: Finca El Paraíso - Hernán Gómez"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Teléfono de contacto</label>
              <input
                type="text"
                value={newOrderForm.telefono}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, telefono: e.target.value })}
                placeholder="Ej: 312 000 0000"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1.5">Diagnóstico o falla reportada *</label>
            <textarea
              required
              rows={2}
              value={newOrderForm.diagnostico}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, diagnostico: e.target.value })}
              placeholder="Describe el síntoma o mantenimiento solicitado..."
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold mb-1.5">Técnico responsable</label>
              <select
                value={newOrderForm.tecnicoAsignado}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, tecnicoAsignado: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              >
                {tecnicosDisponibles.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Valor estimado mano de obra (COP)</label>
              <input
                type="number"
                min="0"
                value={newOrderForm.presupuestoEstimado}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, presupuestoEstimado: e.target.value })}
                placeholder="Ej: 65000"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setIsNewOrderOpen(false)}
              className="px-4 py-2.5 font-semibold text-slate-600 border border-surface-border rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-bold text-white bg-agri hover:bg-agri-hover rounded-xl shadow-sm cursor-pointer"
            >
              Guardar orden de trabajo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
