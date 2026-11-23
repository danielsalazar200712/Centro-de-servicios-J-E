import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendType = 'up', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-card rounded-2xl p-5 border border-surface-border shadow-premium hover:border-emerald-400/70 transition-all duration-200 ${
        onClick ? 'cursor-pointer group' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-surface-muted">
            {title}
          </p>
          <h4 className="text-2xl font-display font-bold text-surface-dark tracking-tight mt-1.5 font-mono">
            {value}
          </h4>
        </div>
        <div className="p-2.5 rounded-xl bg-agri-soft text-agri border border-emerald-200/80 group-hover:bg-agri group-hover:text-white transition-colors">
          {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
        {subtitle && (
          <span className="text-surface-muted font-medium">
            {subtitle}
          </span>
        )}
        {trend && (
          <span
            className={`font-semibold text-[11px] px-2 py-0.5 rounded-md ${
              trendType === 'up'
                ? 'bg-emerald-50 text-emerald-900'
                : 'bg-amber-50 text-amber-900'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
