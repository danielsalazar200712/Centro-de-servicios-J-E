import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  AlertTriangle,
  LogOut,
  ChevronDown,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import Badge from '../components/common/Badge';

export default function Header({ onToggleMobileSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, availableUsers, switchRole, logout } = useAuth();
  const { lowStockItems, setIsCommandPaletteOpen, showToast, clearAllData } = useAppData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return { title: 'Panel de Control', subtitle: 'Resumen general de operación' };
    if (path.includes('/inventario')) return { title: 'Catálogo e Inventario', subtitle: 'Gestión de productos, existencias y Kardex' };
    if (path.includes('/cotizaciones')) return { title: 'Cotizaciones', subtitle: 'Presupuestos de repuestos y mano de obra' };
    if (path.includes('/ventas')) return { title: 'Ventas, Pedidos y Facturación DIAN', subtitle: 'Emisión de facturas electrónicas y devoluciones' };
    if (path.includes('/taller')) return { title: 'Taller de Maquinaria', subtitle: 'Órdenes de trabajo e historial por cliente' };
    if (path.includes('/asesorias')) return { title: 'Asesorías Técnicas', subtitle: 'Mantenimiento preventivo y mezcla 2T' };
    if (path.includes('/reportes')) return { title: 'Reportes Administrativos', subtitle: 'Exportación en formatos PDF y Excel' };
    return { title: 'Centro de Servicios J&E', subtitle: 'Sistema de Información' };
  };

  const pageInfo = getPageTitle();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="no-print sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-surface-border px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-base lg:text-lg font-display font-bold text-surface-dark tracking-tight truncate">
              {pageInfo.title}
            </h2>
            <p className="text-xs text-surface-muted hidden sm:block truncate">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Buscador Rápido Ctrl+K */}
        <div className="flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-surface-bg hover:bg-slate-100/80 border border-surface-border rounded-xl text-xs text-slate-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-agri flex-shrink-0" />
              <span className="truncate">Buscar productos, órdenes, facturas...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold bg-white border border-surface-border px-1.5 py-0.5 rounded-md text-slate-500 flex-shrink-0">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Notificaciones y Perfil */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-agri hover:bg-surface-bg transition-colors cursor-pointer"
              title="Alertas de Stock"
            >
              <Bell className="w-5 h-5" />
              {lowStockItems.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {lowStockItems.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-premium-lg border border-surface-border overflow-hidden z-50">
                <div className="p-3.5 bg-surface-bg border-b border-surface-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span className="font-display font-bold text-xs text-slate-800">
                      Alertas de Stock ({lowStockItems.length})
                    </span>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-surface-border">
                  {lowStockItems.length === 0 ? (
                    <div className="p-5 text-center text-surface-muted text-xs">
                      No hay productos con alerta de stock bajo.
                    </div>
                  ) : (
                    lowStockItems.map((item) => (
                      <div key={item.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-mono text-xs font-bold text-agri">{item.codigo}</span>
                          <Badge status={item.estado}>{item.estado}</Badge>
                        </div>
                        <p className="text-xs font-medium text-slate-900">{item.descripcion}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Disponible: <strong>{item.stock}</strong> (Mín: {item.stockMinimo})
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-surface-bg border-t border-surface-border text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/inventario');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-agri hover:underline cursor-pointer"
                  >
                    <span>Ir al catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-surface-border hover:border-emerald-300 hover:bg-surface-bg transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-agri text-white font-display font-bold text-xs flex items-center justify-center">
                {currentUser?.avatar || 'JF'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-surface-dark leading-tight truncate max-w-[140px]">
                  {currentUser?.nombre?.split(' ').slice(0, 2).join(' ')}
                </p>
                <span className="text-[10px] font-semibold text-agri uppercase tracking-wide block">
                  {currentUser?.rol}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-premium-lg border border-surface-border overflow-hidden z-50">
                <div className="p-4 bg-agri text-white">
                  <p className="font-display font-bold text-xs text-white">
                    {currentUser?.nombre}
                  </p>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    {currentUser?.cargo}
                  </p>
                </div>

                <div className="p-2.5 border-b border-surface-border bg-surface-bg">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-surface-muted mb-1.5 px-1">
                    Cambiar Vista de Rol:
                  </p>
                  <div className="space-y-1">
                    {availableUsers.map((u) => {
                      const isCurrent = currentUser?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            switchRole(u.id);
                            setShowUserMenu(false);
                            showToast('Rol Activo', `Sesión cambiada a ${u.nombre} (${u.rol})`, 'info');
                            navigate('/dashboard');
                          }}
                          className={`w-full px-3 py-1.5 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                            isCurrent
                              ? 'bg-agri text-white font-bold'
                              : 'bg-white border border-surface-border text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{u.nombre}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {u.rol}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      clearAllData();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-agri" />
                    <span>Reiniciar sistema en limpio</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
