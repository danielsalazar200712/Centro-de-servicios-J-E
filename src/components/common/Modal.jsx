import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, size = 'md' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-agri-deep/45 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-premium-lg transition-all sm:my-8 w-full ${
            sizeClasses[size] || sizeClasses.md
          } border border-emerald-400/60 ring-1 ring-emerald-500/10`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-surface-border px-6 py-4 bg-white">
            <div>
              <h3 className="text-base font-display font-bold text-surface-dark tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-surface-muted mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[82vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
