import React from 'react';

export function KPICard({ title, value, unit = '', change, changeType = 'positive', icon: Icon, color = 'emerald' }) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'hover:shadow-emerald-950/40',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'hover:shadow-amber-950/40',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'hover:shadow-rose-950/40',
    },
    sky: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      text: 'text-sky-400',
      glow: 'hover:shadow-sky-950/40',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-lg ${scheme.glow}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${scheme.bg} ${scheme.border} border ${scheme.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>

      {change && (
        <div className="mt-2 flex items-center text-xs">
          <span className={changeType === 'positive' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
            {change}
          </span>
          <span className="ml-1.5 text-slate-500">vs last cycle</span>
        </div>
      )}
    </div>
  );
}
