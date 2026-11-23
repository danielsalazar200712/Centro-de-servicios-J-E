import React from 'react';

/**
 * Badge accesible WCAG con código de colores sobrio:
 * Verde: Completado / En stock / Aprobada
 * Amarillo: En proceso / Stock bajo / Esperando Repuestos / En Validación
 * Rojo: Agotado / Pendiente / Urgente / Rechazada
 */
export default function Badge({ children, status, variant, className = '' }) {
  const getStyle = () => {
    const s = (status || children || '').toString().toLowerCase();

    if (
      s.includes('en stock') ||
      s.includes('completado') ||
      s.includes('aprobada') ||
      s.includes('entregado') ||
      s.includes('listo') ||
      s.includes('activo') ||
      variant === 'success'
    ) {
      return 'bg-emerald-50 text-emerald-900 border-emerald-300';
    }

    if (
      s.includes('stock bajo') ||
      s.includes('en proceso') ||
      s.includes('en validación') ||
      s.includes('esperando') ||
      s.includes('en despacho') ||
      s.includes('media') ||
      variant === 'warning'
    ) {
      return 'bg-amber-50 text-amber-950 border-amber-300';
    }

    if (
      s.includes('agotado') ||
      s.includes('pendiente') ||
      s.includes('urgente') ||
      s.includes('alta') ||
      s.includes('rechazada') ||
      s.includes('cancelado') ||
      variant === 'danger'
    ) {
      return 'bg-rose-50 text-rose-950 border-rose-300';
    }

    if (s.includes('ingresado') || s.includes('baja') || variant === 'info') {
      return 'bg-slate-100 text-slate-800 border-slate-300';
    }

    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getDotColor = () => {
    const s = (status || children || '').toString().toLowerCase();
    if (s.includes('en stock') || s.includes('completado') || s.includes('aprobada') || s.includes('listo') || variant === 'success') {
      return 'bg-emerald-700';
    }
    if (s.includes('stock bajo') || s.includes('en proceso') || s.includes('en validación') || variant === 'warning') {
      return 'bg-amber-600';
    }
    if (s.includes('agotado') || s.includes('pendiente') || s.includes('urgente') || variant === 'danger') {
      return 'bg-rose-600';
    }
    return 'bg-slate-500';
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getStyle()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} aria-hidden="true" />
      {children}
    </span>
  );
}
