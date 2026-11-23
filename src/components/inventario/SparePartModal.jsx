import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function SparePartModal({ isOpen, onClose, onSave, editingPart }) {
  const initialEmptyState = {
    codigo: '',
    descripcion: '',
    categoria: 'Motosierras',
    marca: 'STIHL',
    unidad: 'Unidad',
    maquinaria: '',
    stock: '',
    stockMinimo: '',
    precioUnitario: '',
    ubicacion: '',
    proveedor: ''
  };

  const [formData, setFormData] = useState(initialEmptyState);

  const categoriasDisponibles = [
    'Motosierras',
    'Guadañadoras',
    'Sopladoras',
    'Fumigadoras & Estacionarias',
    'Motoazadas & Rotavatos',
    'Podadoras de Césped',
    'Cuatrimotos Infantiles',
    'Lubricantes & Consumibles'
  ];

  const marcasDisponibles = ['STIHL', 'Husqvarna', 'Royal Cóndor', 'Honda', 'Oregon', 'Walbro', 'NGK', 'Universal'];
  const unidadesDisponibles = ['Unidad', 'Kit / Juego', 'Litro (L)', 'Galón', 'Metro (m)', 'Rollo'];

  useEffect(() => {
    if (editingPart) {
      setFormData({
        codigo: editingPart.codigo || '',
        descripcion: editingPart.descripcion || '',
        categoria: editingPart.categoria || 'Motosierras',
        marca: editingPart.marca || 'STIHL',
        unidad: editingPart.unidad || 'Unidad',
        maquinaria: editingPart.maquinaria || '',
        stock: editingPart.stock ?? '',
        stockMinimo: editingPart.stockMinimo ?? '',
        precioUnitario: editingPart.precioUnitario ?? '',
        ubicacion: editingPart.ubicacion || '',
        proveedor: editingPart.proveedor || ''
      });
    } else {
      setFormData(initialEmptyState);
    }
  }, [editingPart, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onSave({
      ...formData,
      stock: Number(formData.stock) || 0,
      stockMinimo: Number(formData.stockMinimo) || 0,
      precioUnitario: Number(formData.precioUnitario) || 0
    });
    if (success !== false) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPart ? 'Editar producto del catálogo' : 'Registrar nuevo producto en el catálogo'}
      subtitle="Una vez creado aquí, aparecerá disponible en Inventario, Registro de Ventas, Cotizaciones y Taller."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        {/* Fila 1: Nombre comercial / Descripción, Código SKU, Unidad de manejo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Código / Referencia SKU *
            </label>
            <input
              type="text"
              required
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
              placeholder="Ej: REP-001 o CAB-46"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono uppercase text-xs"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre comercial / Repuesto *
            </label>
            <input
              type="text"
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Ej: Bujía NGK o Cabezal Nylon"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Unidad de manejo en bodega *
            </label>
            <select
              value={formData.unidad}
              onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs font-medium"
            >
              {unidadesDisponibles.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fila 2: Categoría, Marca, Maquinaria Compatible */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Categoría de equipo *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs font-medium"
            >
              {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Marca fabricante *
            </label>
            <select
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs font-medium"
            >
              {marcasDisponibles.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Modelos compatibles / Aplicación
            </label>
            <input
              type="text"
              value={formData.maquinaria}
              onChange={(e) => setFormData({ ...formData, maquinaria: e.target.value })}
              placeholder="Ej: FS 250, MS 382, General"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Fila 3: Stock inicial, Stock mínimo de alerta, Precio unitario */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cantidad inicial en bodega *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono font-bold text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Stock mínimo de alerta
            </label>
            <input
              type="number"
              min="0"
              value={formData.stockMinimo}
              onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
              placeholder="0"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Precio unitario de venta (COP) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.precioUnitario}
              onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })}
              placeholder="Ej: 45000"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono font-bold text-xs"
            />
          </div>
        </div>

        {/* Fila 4: Ubicación y Proveedor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ubicación en estantería / bodega
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              placeholder="Ej: Estante A-1 / Gaveta 3"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Proveedor / Distribuidor
            </label>
            <input
              type="text"
              value={formData.proveedor}
              onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
              placeholder="Ej: Distribuidora Oficial"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-surface-border hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-agri hover:bg-agri-hover rounded-xl shadow-sm cursor-pointer transition-all"
          >
            {editingPart ? 'Guardar cambios' : 'Guardar en el catálogo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
