import React, { useState } from 'react';
import {
  Trash2,
  Calculator,
  Eye,
  Printer,
  Edit3,
  Package,
  Wrench,
  FileText
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function Cotizaciones() {
  const {
    cotizaciones,
    inventory,
    addCotizacion,
    updateCotizacion,
    updateCotizacionStatus,
    convertQuoteToSale,
    formatCurrency,
    showToast
  } = useAppData();

  const [activeTab, setActiveTab] = useState('crear');
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState(null);

  const emptyCliente = {
    nombre: '',
    documento: '',
    telefono: '',
    correo: '',
    ciudad: ''
  };

  const emptyMaquinaria = {
    modelo: '',
    serie: '',
    horometro: ''
  };

  const emptyItem = () => ({
    id: Date.now(),
    tipo: 'repuesto',
    descripcion: '',
    cantidad: 1,
    valorUnitario: ''
  });

  const [cliente, setCliente] = useState(emptyCliente);
  const [maquinaria, setMaquinaria] = useState(emptyMaquinaria);
  const [items, setItems] = useState([emptyItem()]);
  const [selectedRepuestoId, setSelectedRepuestoId] = useState('');

  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.valorUnitario) || 0),
    0
  );
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const handleAddItem = (tipo = 'repuesto') => {
    setItems([
      ...items,
      {
        id: Date.now(),
        tipo,
        descripcion: '',
        cantidad: 1,
        valorUnitario: ''
      }
    ]);
  };

  const handleAddFromInventory = () => {
    if (!selectedRepuestoId) return;
    const part = inventory.find((p) => p.id === selectedRepuestoId);
    if (!part) return;

    setItems([
      ...items.filter((i) => i.descripcion.trim() !== ''),
      {
        id: Date.now(),
        tipo: 'repuesto',
        codigo: part.codigo,
        descripcion: `${part.codigo} - ${part.descripcion}`,
        cantidad: 1,
        valorUnitario: part.precioUnitario
      }
    ]);
    setSelectedRepuestoId('');
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter((it) => it.id !== id));
  };

  const handleEditExistingQuote = (cot) => {
    setEditingQuoteId(cot.id);
    setCliente(cot.cliente);
    setMaquinaria(cot.maquinaria);
    setItems(cot.items);
    setActiveTab('crear');
    showToast('Editando cotización', `Modificando ${cot.id}`, 'info');
  };

  const handleGuardarCotizacion = (e) => {
    e.preventDefault();
    const cleanedItems = items.map((it) => ({
      ...it,
      cantidad: Number(it.cantidad) || 1,
      valorUnitario: Number(it.valorUnitario) || 0
    }));

    if (editingQuoteId) {
      updateCotizacion(editingQuoteId, {
        cliente,
        maquinaria,
        items: cleanedItems,
        subtotal,
        iva,
        total
      });
      setEditingQuoteId(null);
    } else {
      addCotizacion({
        cliente,
        maquinaria,
        items: cleanedItems,
        subtotal,
        iva,
        total,
        validezDias: 15
      });
    }

    setCliente(emptyCliente);
    setMaquinaria(emptyMaquinaria);
    setItems([emptyItem()]);
    setActiveTab('historial');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-surface-dark tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-agri" />
            <span>Cotizaciones de Reparación y Repuestos</span>
          </h1>
          <p className="text-xs text-surface-muted mt-0.5">
            Elabora presupuestos detallados de mano de obra y repuestos con conversión directa a factura DIAN
          </p>
        </div>

        <div className="flex items-center bg-white border border-surface-border rounded-xl p-1 text-xs font-semibold shadow-2xs">
          <button
            onClick={() => {
              setEditingQuoteId(null);
              setActiveTab('crear');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'crear' ? 'bg-agri text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {editingQuoteId ? `Editando ${editingQuoteId}` : 'Nueva Cotización'}
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'historial' ? 'bg-agri text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historial ({cotizaciones.length})
          </button>
        </div>
      </div>

      {activeTab === 'crear' ? (
        <form onSubmit={handleGuardarCotizacion} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-emerald-400/60 shadow-premium space-y-3.5">
              <span className="text-xs font-bold text-agri uppercase tracking-wide block border-b border-surface-border pb-2">
                1. Datos del Cliente
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nombre o razón social *
                  </label>
                  <input
                    type="text"
                    required
                    value={cliente.nombre}
                    onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                    placeholder="Ej: Hacienda San José o Carlos Ramírez"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      NIT / Cédula *
                    </label>
                    <input
                      type="text"
                      required
                      value={cliente.documento}
                      onChange={(e) => setCliente({ ...cliente, documento: e.target.value })}
                      placeholder="Ej: 901.000.000-1"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-border rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Teléfono de contacto
                    </label>
                    <input
                      type="text"
                      value={cliente.telefono}
                      onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                      placeholder="Ej: 310 000 0000"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-400/60 shadow-premium space-y-3.5">
              <span className="text-xs font-bold text-agri uppercase tracking-wide block border-b border-surface-border pb-2">
                2. Maquinaria / Equipo a Cotizar
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Equipo y modelo *
                  </label>
                  <input
                    type="text"
                    required
                    value={maquinaria.modelo}
                    onChange={(e) => setMaquinaria({ ...maquinaria, modelo: e.target.value })}
                    placeholder="Ej: Guadañadora STIHL FS 450 o Motosierra Husqvarna"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Número de serie
                    </label>
                    <input
                      type="text"
                      value={maquinaria.serie}
                      onChange={(e) => setMaquinaria({ ...maquinaria, serie: e.target.value })}
                      placeholder="Ej: SN-00192"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-border rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tiempo de uso / Observación
                    </label>
                    <input
                      type="text"
                      value={maquinaria.horometro}
                      onChange={(e) => setMaquinaria({ ...maquinaria, horometro: e.target.value })}
                      placeholder="Ej: 200 horas de uso"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-surface-border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Conceptos */}
          <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
            <div className="p-4 border-b border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-display font-bold text-slate-800">
                3. Conceptos de la Cotización (Repuestos y Mano de Obra)
              </span>

              {inventory.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRepuestoId}
                    onChange={(e) => setSelectedRepuestoId(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-surface-border rounded-xl font-medium max-w-[240px]"
                  >
                    <option value="">+ Cargar del catálogo...</option>
                    {inventory.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} - {p.descripcion} ({formatCurrency(p.precioUnitario)})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddFromInventory}
                    disabled={!selectedRepuestoId}
                    className="px-3 py-1.5 bg-agri text-white text-xs font-semibold rounded-xl hover:bg-agri-hover disabled:opacity-40 cursor-pointer"
                  >
                    Insertar
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                  <tr>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3 min-w-[240px]">Descripción del repuesto o servicio *</th>
                    <th className="px-4 py-3 text-center w-24">Cant. *</th>
                    <th className="px-4 py-3 text-right w-36">Valor Unit. (COP) *</th>
                    <th className="px-4 py-3 text-right w-32">Subtotal</th>
                    <th className="px-4 py-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <select
                          value={item.tipo}
                          onChange={(e) => handleUpdateItem(item.id, 'tipo', e.target.value)}
                          className="px-2.5 py-1.5 bg-surface-bg border border-surface-border rounded-lg text-xs font-semibold text-slate-700"
                        >
                          <option value="repuesto">Repuesto</option>
                          <option value="mano_obra">Mano de Obra</option>
                        </select>
                      </td>

                      <td className="px-4 py-2.5">
                        <input
                          type="text"
                          required
                          value={item.descripcion}
                          onChange={(e) => handleUpdateItem(item.id, 'descripcion', e.target.value)}
                          placeholder="Escribe el repuesto o mano de obra..."
                          className="w-full px-3 py-1.5 bg-white border border-surface-border rounded-lg text-xs"
                        />
                      </td>

                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.cantidad}
                          onChange={(e) => handleUpdateItem(item.id, 'cantidad', e.target.value)}
                          className="w-16 px-2 py-1.5 bg-white border border-surface-border rounded-lg text-xs text-center font-mono font-bold"
                        />
                      </td>

                      <td className="px-4 py-2.5 text-right">
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.valorUnitario}
                          onChange={(e) => handleUpdateItem(item.id, 'valorUnitario', e.target.value)}
                          placeholder="0"
                          className="w-32 px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-xs text-right font-mono font-semibold"
                        />
                      </td>

                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                        {formatCurrency((Number(item.cantidad) || 0) * (Number(item.valorUnitario) || 0))}
                      </td>

                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-surface-bg border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem('repuesto')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-agri" />
                  <span>+ Añadir Repuesto</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('mano_obra')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-700" />
                  <span>+ Añadir Mano de Obra</span>
                </button>
              </div>

              <div className="w-full sm:w-64 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA (19%):</span>
                  <span className="font-mono font-semibold">{formatCurrency(iva)}</span>
                </div>
                <div className="pt-1.5 border-t border-surface-border flex justify-between text-sm font-display font-extrabold text-agri">
                  <span>TOTAL COTIZADO:</span>
                  <span className="font-mono">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-surface-border flex justify-end gap-2.5">
              <button
                type="submit"
                className="px-5 py-2.5 bg-agri text-white font-bold text-xs rounded-xl hover:bg-agri-hover transition-all cursor-pointer shadow-sm"
              >
                {editingQuoteId ? `Guardar cambios en ${editingQuoteId}` : 'Guardar cotización'}
              </button>
            </div>
          </div>
        </form>
      ) : cotizaciones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border shadow-premium p-12 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-display font-bold text-slate-800">Aún no hay cotizaciones registradas</h3>
          <p className="text-xs text-surface-muted max-w-sm mx-auto">
            Crea tu primera cotización en la pestaña <strong>Nueva Cotización</strong> para imprimirla o facturarla ante la DIAN.
          </p>
          <button
            onClick={() => setActiveTab('crear')}
            className="px-4 py-2 rounded-xl bg-agri text-white font-bold text-xs cursor-pointer"
          >
            Crear primera cotización
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                <tr>
                  <th className="px-4 py-3.5">No. Cotización</th>
                  <th className="px-4 py-3.5">Cliente</th>
                  <th className="px-4 py-3.5">Equipo</th>
                  <th className="px-4 py-3.5">Fecha</th>
                  <th className="px-4 py-3.5 text-right">Total</th>
                  <th className="px-4 py-3.5 text-center">Estado</th>
                  <th className="px-4 py-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-slate-700">
                {cotizaciones.map((cot) => (
                  <tr key={cot.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-agri">{cot.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{cot.cliente.nombre}</td>
                    <td className="px-4 py-3.5 text-slate-600">{cot.maquinaria.modelo}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono">{cot.fecha}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-900 font-mono">{formatCurrency(cot.total)}</td>
                    <td className="px-4 py-3.5 text-center"><Badge status={cot.estado}>{cot.estado}</Badge></td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedQuoteDetail(cot)}
                          className="p-1.5 text-slate-600 hover:text-agri hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Ver e Imprimir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditExistingQuote(cot)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {cot.estado === 'Pendiente' && (
                          <button
                            onClick={() => updateCotizacionStatus(cot.id, 'Aprobada')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-emerald-900 font-semibold rounded-lg text-[11px] cursor-pointer"
                          >
                            Aprobar
                          </button>
                        )}
                        {cot.estado !== 'Facturada' && (
                          <button
                            onClick={() => convertQuoteToSale(cot.id)}
                            className="px-3 py-1 bg-agri hover:bg-agri-hover text-white font-semibold rounded-lg text-[11px] cursor-pointer"
                          >
                            Facturar DIAN
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detalle Cotización */}
      <Modal
        isOpen={!!selectedQuoteDetail}
        onClose={() => setSelectedQuoteDetail(null)}
        title={`Cotización ${selectedQuoteDetail?.id}`}
        size="lg"
      >
        {selectedQuoteDetail && (
          <div id="printable-fiscal-invoice" className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-agri text-white rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-display font-extrabold text-sm">CENTRO DE SERVICIOS J&E</h4>
                <p className="text-[11px] text-emerald-200">Taller STIHL • Husqvarna • Royal Cóndor</p>
              </div>
              <span className="font-mono text-xs font-bold bg-white/15 px-3 py-1 rounded-lg">
                {selectedQuoteDetail.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border">
                <span className="text-[10px] font-bold uppercase text-slate-400">Cliente:</span>
                <p className="font-bold text-slate-900">{selectedQuoteDetail.cliente.nombre}</p>
                <p className="font-mono text-[11px]">{selectedQuoteDetail.cliente.documento}</p>
              </div>
              <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border">
                <span className="text-[10px] font-bold uppercase text-slate-400">Equipo:</span>
                <p className="font-bold text-slate-900">{selectedQuoteDetail.maquinaria.modelo}</p>
                <p className="font-mono text-[11px]">Serie: {selectedQuoteDetail.maquinaria.serie || 'N/A'}</p>
              </div>
            </div>

            <div className="border border-surface-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-2.5">Tipo</th>
                    <th className="p-2.5">Descripción</th>
                    <th className="p-2.5 text-center">Cant.</th>
                    <th className="p-2.5 text-right">V. Unitario</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {selectedQuoteDetail.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 uppercase text-[10px] font-bold text-slate-500">
                        {it.tipo === 'mano_obra' ? 'Mano Obra' : 'Repuesto'}
                      </td>
                      <td className="p-2.5 font-medium text-slate-900">{it.descripcion}</td>
                      <td className="p-2.5 text-center font-mono">{it.cantidad}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(it.valorUnitario)}</td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        {formatCurrency(it.cantidad * it.valorUnitario)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-56 text-right space-y-1 bg-surface-bg p-3.5 rounded-xl border border-surface-border">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <strong className="font-mono">{formatCurrency(selectedQuoteDetail.subtotal)}</strong>
                </p>
                <p className="flex justify-between">
                  <span>IVA (19%):</span>
                  <strong className="font-mono">{formatCurrency(selectedQuoteDetail.iva)}</strong>
                </p>
                <p className="flex justify-between text-agri font-extrabold text-sm border-t border-surface-border pt-1">
                  <span>Total:</span>
                  <strong className="font-mono">{formatCurrency(selectedQuoteDetail.total)}</strong>
                </p>
              </div>
            </div>

            <div className="no-print flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={() => setSelectedQuoteDetail(null)}
                className="px-4 py-2 bg-agri text-white font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
