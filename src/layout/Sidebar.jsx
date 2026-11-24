import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PackageCheck,
  FileText,
  Receipt,
  Wrench,
  BarChart3,
  BookOpenCheck,
  ShieldCheck,
  ChevronRight,
  Info,
  Database
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpenMobile, onCloseMobile }) {
  const { dianInfo, isSupabaseConfigured, isCloudSynced } = useAppData();
  const { currentUser, hasPermission } = useAuth();
  const [showDianModal, setShowDianModal] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Panel de Control', path: '/dashboard', icon: LayoutDashboard },
    { id: 'inventario', name: 'Catálogo e Inventario', path: '/inventario', icon: PackageCheck },
    { id: 'ventas', name: 'Ventas y Facturación', path: '/ventas', icon: Receipt },
    { id: 'cotizaciones', name: 'Cotizaciones', path: '/cotizaciones', icon: FileText },
    { id: 'taller', name: 'Taller de Maquinaria', path: '/taller', icon: Wrench },
    { id: 'asesorias', name: 'Asesorías Técnicas', path: '/asesorias', icon: BookOpenCheck },
    { id: 'reportes', name: 'Reportes PDF / Excel', path: '/reportes', icon: BarChart3 }
  ];

  const visibleNavItems = navItems.filter((item) => hasPermission(item.id));

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-surface-border">
      {/* Brand Header */}
      <div className="p-5 border-b border-surface-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-agri flex items-center justify-center text-white font-display font-extrabold text-sm shadow-sm flex-shrink-0">
          J&E
        </div>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-sm tracking-tight text-surface-dark leading-tight truncate">
            Centro de Servicios J&E
          </h1>
          <p className="text-[11px] text-surface-muted truncate mt-0.5 font-medium">
            Gestión & Facturación DIAN
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto" aria-label="Menú principal">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-surface-muted">
          Navegación Principal
        </div>
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-agri text-white shadow-sm'
                    : 'text-slate-600 hover:text-agri hover:bg-surface-bg'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom status badge: DIAN + Supabase Cloud Status */}
      <div className="p-3.5 border-t border-surface-border bg-surface-bg">
        <button
          type="button"
          onClick={() => setShowDianModal(true)}
          className="w-full text-left p-3 rounded-xl bg-white border border-surface-border hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
          aria-label="Ver estado de conexión con la DIAN y Base de Datos"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-xs font-display font-bold text-slate-800">
                {isSupabaseConfigured ? 'Supabase Cloud + DIAN' : 'DIAN En Línea'}
              </span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-agri" />
          </div>
          <p className="text-[10px] text-surface-muted mt-1 pl-4 font-mono">
            {isSupabaseConfigured
              ? isCloudSynced
                ? 'PostgreSQL Sincronizado'
                : 'Conectando a Supabase...'
              : 'Modo Local (Supabase Ready)'}
          </p>
        </button>
      </div>

      {/* DIAN & Supabase Info Modal */}
      <Modal
        isOpen={showDianModal}
        onClose={() => setShowDianModal(false)}
        title="Estado de Infraestructura: Base de Datos Supabase y Facturación DIAN"
        subtitle="Parámetros de conexión en la nube y resolución fiscal activa"
        size="md"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-agri-soft border border-emerald-200">
            <Database className="w-6 h-6 text-agri flex-shrink-0" />
            <div>
              <p className="font-bold text-agri">
                {isSupabaseConfigured
                  ? 'Base de Datos PostgreSQL (Supabase) Conectada'
                  : 'Integración Supabase Lista (.env pendiente)'}
              </p>
              <p className="text-slate-600 text-[11px]">
                {isSupabaseConfigured
                  ? 'Todas las operaciones se sincronizan en tiempo real con las tablas en la nube.'
                  : 'Ejecuta supabase/schema.sql en el SQL Editor de Supabase y configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-bg border border-surface-border">
            <ShieldCheck className="w-6 h-6 text-agri flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900">WebService DIAN Operativo</p>
              <p className="text-slate-600 text-[11px]">
                Intercambio de datos estructurados XML/UBL 2.1 y generación de CUFE habilitada.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-[11px]">
            <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
              <span className="text-surface-muted block font-semibold">Ambiente:</span>
              <strong className="text-slate-900">{dianInfo.ambiente}</strong>
            </div>
            <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
              <span className="text-surface-muted block font-semibold">Web Service:</span>
              <strong className="text-slate-900">{dianInfo.servidor}</strong>
            </div>
            <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
              <span className="text-surface-muted block font-semibold">Resolución:</span>
              <strong className="text-slate-900 font-mono">{dianInfo.resolucion}</strong>
            </div>
            <div className="p-3 bg-surface-bg rounded-xl border border-surface-border">
              <span className="text-surface-muted block font-semibold">Rango Autorizado:</span>
              <strong className="text-slate-900 font-mono">{dianInfo.rangoAutorizado}</strong>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );

  return (
    <>
      <aside className="no-print hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 z-30">
        {content}
      </aside>

      {isOpenMobile && (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-agri-deep/45 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
