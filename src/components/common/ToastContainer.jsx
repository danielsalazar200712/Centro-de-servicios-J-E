import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAppData();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />;
        let borderColor = 'border-emerald-200';

        if (toast.type === 'danger') {
          icon = <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" />;
          borderColor = 'border-rose-200';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />;
          borderColor = 'border-amber-200';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-sky-700 flex-shrink-0" />;
          borderColor = 'border-sky-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 bg-white rounded-lg shadow-lg border ${borderColor} transition-all`}
          >
            <div className="mt-0.5">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 leading-snug">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
