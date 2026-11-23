import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  Wrench,
  Receipt,
  BookOpenCheck,
  ShoppingBag
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export default function GlobalSearchModal() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    inventory,
    tallerOrders,
    ventas,
    pedidos,
    asesorias,
    formatCurrency
  } = useAppData();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const term = query.toLowerCase().trim();

  const repuestos = term
    ? inventory
        .filter(
          (i) =>
            i.codigo.toLowerCase().includes(term) ||
            i.descripcion.toLowerCase().includes(term) ||
            i.marca?.toLowerCase().includes(term)
        )
        .slice(0, 3)
    : [];

  const ordenes = term
    ? tallerOrders
        .filter(
          (o) =>
            o.id.toLowerCase().includes(term) ||
            o.modelo?.toLowerCase().includes(term) ||
            o.propietario?.toLowerCase().includes(term)
        )
        .slice(0, 3)
    : [];

  const facturas = term
    ? ventas
        .filter(
          (v) =>
            v.numeroFactura.toLowerCase().includes(term) ||
            v.cliente.toLowerCase().includes(term)
        )
        .slice(0, 3)
    : [];

  const pedidosMatch = term
    ? pedidos
        .filter(
          (p) =>
            p.id.toLowerCase().includes(term) ||
            p.cliente.toLowerCase().includes(term)
        )
        .slice(0, 2)
    : [];

  const asesoriasMatch = term
    ? asesorias
        .filter(
          (a) =>
            a.titulo.toLowerCase().includes(term) ||
            a.categoria.toLowerCase().includes(term)
        )
        .slice(0, 2)
    : [];

  const handleSelect = (path) => {
    setIsCommandPaletteOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-xl transform rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all overflow-hidden border border-surface-border">
        <div className="relative flex items-center border-b border-surface-border px-4 py-3 bg-white">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar repuesto STIHL, orden de taller, pedido, factura o asesoría..."
            className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-none placeholder-slate-400 text-slate-800"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer font-medium"
          >
            ESC
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 text-xs divide-y divide-slate-100">
          {!query ? (
            <div className="p-4 text-center text-slate-400">
              <p className="font-semibold text-slate-600 mb-1">Buscador Rápido Global (IEEE 830)</p>
              <p className="text-[11px]">
                Busque por SKU (<code>CAB-AUT-46</code>), modelo (<code>FS 450</code>), factura (<code>FE-001248</code>) o cliente.
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleSelect('/ventas')}
                  className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:text-agri hover:bg-emerald-50 cursor-pointer"
                >
                  Registrar Venta (RF-001)
                </button>
                <button
                  onClick={() => handleSelect('/inventario')}
                  className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:text-agri hover:bg-emerald-50 cursor-pointer"
                >
                  Inventario (RF-002)
                </button>
                <button
                  onClick={() => handleSelect('/taller')}
                  className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:text-agri hover:bg-emerald-50 cursor-pointer"
                >
                  Taller (RF-007)
                </button>
                <button
                  onClick={() => handleSelect('/asesorias')}
                  className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:text-agri hover:bg-emerald-50 cursor-pointer"
                >
                  Asesorías (RF-010)
                </button>
              </div>
            </div>
          ) : repuestos.length === 0 &&
            ordenes.length === 0 &&
            facturas.length === 0 &&
            pedidosMatch.length === 0 &&
            asesoriasMatch.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No se encontraron coincidencias para "{query}"
            </div>
          ) : (
            <div className="space-y-3 p-1">
              {repuestos.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Repuestos en Inventario (RF-002)
                  </div>
                  {repuestos.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect('/inventario')}
                      className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-agri flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-agri">
                            {item.codigo} - {item.descripcion}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {item.maquinaria} • Stock: {item.stock} unids
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-700">
                        {formatCurrency(item.precioUnitario)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {ordenes.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Historial de Reparaciones (RF-007)
                  </div>
                  {ordenes.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => handleSelect('/taller')}
                      className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Wrench className="w-4 h-4 text-amber-700 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-agri">
                            {ord.id}: {ord.modelo}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {ord.propietario} • Estado: {ord.estado}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {ord.estado}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {facturas.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Facturas Electrónicas DIAN (RF-006)
                  </div>
                  {facturas.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleSelect('/ventas')}
                      className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Receipt className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-agri">
                            {v.numeroFactura} - {v.cliente}
                          </p>
                          <p className="text-[10px] text-slate-500">Fecha: {v.fecha}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(v.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {pedidosMatch.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pedidos de Clientes (RF-005)
                  </div>
                  {pedidosMatch.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect('/ventas')}
                      className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-agri flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-agri">
                            {p.id} - {p.cliente}
                          </p>
                          <p className="text-[10px] text-slate-500">Estado: {p.estado}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(p.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {asesoriasMatch.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Asesorías Técnicas (RF-010)
                  </div>
                  {asesoriasMatch.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleSelect('/asesorias')}
                      className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpenCheck className="w-4 h-4 text-agri flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-agri">
                            {a.titulo}
                          </p>
                          <p className="text-[10px] text-slate-500">{a.categoria}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-4 py-2 border-t border-surface-border flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Presiona <kbd className="font-bold text-slate-600 bg-white border border-slate-200 px-1 rounded">ESC</kbd> para cerrar
          </span>
          <span className="text-agri font-semibold">Atajo: Ctrl + K</span>
        </div>
      </div>
    </div>
  );
}
