import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  History,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  PackageOpen
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import SparePartModal from '../components/inventario/SparePartModal';
import Modal from '../components/common/Modal';

export default function Inventario() {
  const {
    inventory,
    kardexMovements,
    lowStockItems,
    globalSearch,
    addSparePart,
    updateSparePart,
    adjustStockWithReason,
    deleteSparePart,
    formatCurrency,
    showToast
  } = useAppData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('catalogo');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedStockFilter, setSelectedStockFilter] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [deletingPart, setDeletingPart] = useState(null);

  const [isSupplyOpen, setIsSupplyOpen] = useState(false);
  const [supplyForm, setSupplyForm] = useState({
    repuestoId: '',
    cantidad: '',
    proveedor: '',
    documentoRemision: ''
  });

  const categories = useMemo(() => {
    const cats = new Set(inventory.map((item) => item.categoria));
    return ['Todas', ...Array.from(cats)];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    const term = (localSearch || globalSearch).toLowerCase().trim();

    return inventory.filter((item) => {
      const matchesSearch =
        !term ||
        item.codigo.toLowerCase().includes(term) ||
        item.descripcion.toLowerCase().includes(term) ||
        (item.maquinaria || '').toLowerCase().includes(term) ||
        (item.marca || '').toLowerCase().includes(term);

      const matchesStock =
        selectedStockFilter === 'Todos' || item.estado === selectedStockFilter;

      const matchesCategory =
        selectedCategory === 'Todas' || item.categoria === selectedCategory;

      return matchesSearch && matchesStock && matchesCategory;
    });
  }, [inventory, localSearch, globalSearch, selectedStockFilter, selectedCategory]);

  const totalUnits = inventory.reduce((acc, i) => acc + i.stock, 0);
  const totalValuation = inventory.reduce((acc, i) => acc + i.stock * i.precioUnitario, 0);

  const handleOpenAdd = () => {
    setEditingPart(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (part) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  const handleSavePart = (formData) => {
    if (editingPart) {
      return updateSparePart(editingPart.id, formData);
    } else {
      return addSparePart(formData, `${currentUser?.nombre || 'Administrador'}`);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingPart) {
      deleteSparePart(deletingPart.id);
      setDeletingPart(null);
    }
  };

  const handleQuickStockChange = (item, delta) => {
    adjustStockWithReason(
      item.id,
      delta,
      delta > 0 ? 'Incremento directo en catálogo' : 'Salida directa en catálogo',
      delta > 0 ? 'Entrada Manual' : 'Salida Manual',
      `${currentUser?.nombre || 'Administrador'}`
    );
  };

  const handleOpenSupplyModal = () => {
    if (inventory.length === 0) {
      showToast('Catálogo vacío', 'Primero registra un producto en el catálogo antes de cargar entradas de proveedor.', 'info');
      setIsModalOpen(true);
      return;
    }
    setSupplyForm({
      repuestoId: inventory[0]?.id || '',
      cantidad: '',
      proveedor: '',
      documentoRemision: ''
    });
    setIsSupplyOpen(true);
  };

  const handleSupplySubmit = (e) => {
    e.preventDefault();
    if (!supplyForm.repuestoId) return;
    adjustStockWithReason(
      supplyForm.repuestoId,
      Number(supplyForm.cantidad) || 1,
      `Entrada Proveedor (${supplyForm.proveedor || 'Directo'}) - Doc: ${supplyForm.documentoRemision || 'S/N'}`,
      'Entrada Proveedor',
      `${currentUser?.nombre || 'Administrador'}`
    );
    setIsSupplyOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-surface-dark tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-agri" />
            <span>Catálogo de Productos e Inventario</span>
          </h1>
          <p className="text-xs text-surface-muted mt-0.5">
            Gestiona tus repuestos, existencias en bodega y movimientos de Kardex en tiempo real
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-surface-border rounded-xl p-1 text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('catalogo')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'catalogo' ? 'bg-agri text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Catálogo ({inventory.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kardex')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'kardex' ? 'bg-agri text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Kardex ({kardexMovements.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenSupplyModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-agri" />
            <span>Entrada de Bodega</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri text-white font-bold text-xs hover:bg-agri-hover transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Producto</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-premium">
          <span className="text-[11px] font-bold uppercase text-surface-muted">Productos en Catálogo</span>
          <h3 className="text-2xl font-display font-bold text-surface-dark mt-1 font-mono">{inventory.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-premium">
          <span className="text-[11px] font-bold uppercase text-surface-muted">Unidades Totales</span>
          <h3 className="text-2xl font-display font-bold text-agri mt-1 font-mono">{totalUnits}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-premium">
          <span className="text-[11px] font-bold uppercase text-surface-muted">Alertas de Stock Bajo</span>
          <h3 className="text-2xl font-display font-bold text-amber-700 mt-1 font-mono">{lowStockItems.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-premium">
          <span className="text-[11px] font-bold uppercase text-surface-muted">Valorización Total</span>
          <h3 className="text-2xl font-display font-bold text-surface-dark mt-1 font-mono">{formatCurrency(totalValuation)}</h3>
        </div>
      </div>

      {activeTab === 'catalogo' ? (
        inventory.length === 0 ? (
          /* Estado Vacío Premium cuando aún no hay productos registrados */
          <div className="bg-white rounded-2xl border border-emerald-400/60 shadow-premium p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-agri-soft text-agri border border-emerald-200 flex items-center justify-center mx-auto">
              <PackageOpen className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-display font-bold text-surface-dark">
                Tu catálogo de productos está limpio
              </h3>
              <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                Registra tu primer repuesto o insumo en el catálogo. Una vez creado aquí, estará disponible inmediatamente en <strong>Entrada de Bodega</strong>, <strong>Ventas</strong>, <strong>Cotizaciones</strong> y <strong>Taller</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri text-white font-bold text-xs hover:bg-agri-hover shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar nuevo producto en el catálogo</span>
            </button>
          </div>
        ) : (
          <>
            {/* Filtros y Buscador */}
            <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-premium space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3.5 my-auto pointer-events-none" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Buscar por código SKU, nombre o marca..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Categoría:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-xl font-medium w-full md:w-auto"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-400">Estado:</span>
                {['Todos', 'En stock', 'Stock bajo', 'Agotado'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setSelectedStockFilter(filterOption)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedStockFilter === filterOption
                        ? 'bg-agri text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabla de Catálogo */}
            <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-4 py-3.5">Código SKU</th>
                      <th className="px-4 py-3.5">Nombre Comercial / Producto</th>
                      <th className="px-4 py-3.5">Categoría / Marca</th>
                      <th className="px-4 py-3.5 text-center">Ubicación</th>
                      <th className="px-4 py-3.5 text-center">Existencias</th>
                      <th className="px-4 py-3.5 text-right">Precio Unit.</th>
                      <th className="px-4 py-3.5 text-center">Estado</th>
                      <th className="px-4 py-3.5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-700">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-agri whitespace-nowrap">
                          {item.codigo}
                        </td>

                        <td className="px-4 py-3.5 max-w-sm">
                          <p className="font-bold text-slate-900 leading-snug">{item.descripcion}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.maquinaria || 'Aplicación general'} • Manejo en: {item.unidad || 'Unidad'}
                          </p>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-medium text-slate-700 block">{item.categoria}</span>
                          <span className="text-[10px] font-bold text-agri bg-agri-soft px-2 py-0.5 rounded border border-emerald-200">
                            {item.marca || 'Original'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center whitespace-nowrap font-mono text-slate-600">
                          {item.ubicacion || 'Bodega'}
                        </td>

                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 bg-surface-bg border border-surface-border px-1.5 py-0.5 rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleQuickStockChange(item, -1)}
                              disabled={item.stock <= 0}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-rose-600 disabled:opacity-30 font-bold cursor-pointer"
                              title="Descontar 1 unidad"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs text-slate-900 w-8 text-center">
                              {item.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuickStockChange(item, 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-emerald-700 font-bold cursor-pointer"
                              title="Sumar 1 unidad"
                            >
                              +
                            </button>
                          </div>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Alerta mín: {item.stockMinimo}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          {formatCurrency(item.precioUnitario)}
                        </td>

                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <Badge status={item.estado}>{item.estado}</Badge>
                        </td>

                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-agri hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingPart(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      ) : (
        /* Pestaña Kardex */
        <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
          <div className="p-5 border-b border-surface-border">
            <h3 className="text-sm font-display font-bold text-slate-900">
              Historial Kardex de Movimientos
            </h3>
            <p className="text-xs text-surface-muted">
              Trazabilidad automática de cada ingreso, venta, consumo en taller o devolución
            </p>
          </div>

          {kardexMovements.length === 0 ? (
            <div className="p-10 text-center text-xs text-surface-muted">
              Aún no se han registrado movimientos en el Kardex.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Operación</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Detalle</th>
                    <th className="px-4 py-3 text-center">Cant.</th>
                    <th className="px-4 py-3 text-center">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-slate-700">
                  {kardexMovements.map((mov) => {
                    const isEntry = mov.stockNuevo >= mov.stockAnterior;
                    return (
                      <tr key={mov.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-agri">{mov.id}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{mov.fecha}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                              isEntry
                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}
                          >
                            {isEntry ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span>{mov.tipo}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <strong className="font-mono text-slate-900">{mov.codigo}</strong> - {mov.descripcion}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{mov.motivo}</td>
                        <td className="px-4 py-3 text-center font-mono font-bold">
                          {isEntry ? `+${mov.cantidad}` : `-${mov.cantidad}`}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          {mov.stockAnterior} → <strong>{mov.stockNuevo}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Agregar/Editar Producto */}
      <SparePartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePart}
        editingPart={editingPart}
      />

      {/* Modal Entrada de Bodega */}
      <Modal
        isOpen={isSupplyOpen}
        onClose={() => setIsSupplyOpen(false)}
        title="Registrar Entrada de Bodega"
        subtitle="Incrementa las existencias de un producto existente y registra el ingreso en el Kardex."
        size="md"
      >
        <form onSubmit={handleSupplySubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-semibold mb-1.5">Producto del catálogo *</label>
            <select
              value={supplyForm.repuestoId}
              onChange={(e) => setSupplyForm({ ...supplyForm, repuestoId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
            >
              {inventory.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codigo} - {p.descripcion} (Disponible: {p.stock})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold mb-1.5">Cantidad que ingresa *</label>
              <input
                type="number"
                min="1"
                required
                value={supplyForm.cantidad}
                onChange={(e) => setSupplyForm({ ...supplyForm, cantidad: e.target.value })}
                placeholder="Ej: 10"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1.5">No. Factura / Remisión</label>
              <input
                type="text"
                value={supplyForm.documentoRemision}
                onChange={(e) => setSupplyForm({ ...supplyForm, documentoRemision: e.target.value })}
                placeholder="Ej: REM-001"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1.5">Proveedor</label>
            <input
              type="text"
              value={supplyForm.proveedor}
              onChange={(e) => setSupplyForm({ ...supplyForm, proveedor: e.target.value })}
              placeholder="Nombre del proveedor o distribuidor"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setIsSupplyOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 border border-surface-border rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-agri hover:bg-agri-hover rounded-xl cursor-pointer"
            >
              Guardar entrada en bodega
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal
        isOpen={!!deletingPart}
        onClose={() => setDeletingPart(null)}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            ¿Deseas eliminar <strong className="text-slate-900">{deletingPart?.codigo} - {deletingPart?.descripcion}</strong> del catálogo?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setDeletingPart(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
