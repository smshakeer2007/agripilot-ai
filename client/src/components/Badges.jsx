import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, Sparkles } from 'lucide-react';

export function HealthBadge({ status = 'Healthy' }) {
  const s = (status || '').toLowerCase();
  if (s === 'healthy') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <ShieldCheck className="w-3.5 h-3.5" />
        Healthy
      </span>
    );
  }
  if (s === 'warning') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3.5 h-3.5" />
        Warning
      </span>
    );
  }
  if (s === 'critical') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
        <AlertOctagon className="w-3.5 h-3.5" />
        Critical
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
      <Activity className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

export function RiskBadge({ level = 'Low' }) {
  const l = (level || '').toLowerCase();
  if (l === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
        High Risk
      </span>
    );
  }
  if (l === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        Medium Risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
      Low Risk
    </span>
  );
}

export function PriorityBadge({ priority = 'Medium' }) {
  const p = (priority || '').toLowerCase();
  if (p === 'critical') {
    return (
      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-sm shadow-rose-900/50">
        🚨 Critical (Immediate)
      </span>
    );
  }
  if (p === 'high') {
    return (
      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40">
        ⚠️ High (24-48h)
      </span>
    );
  }
  if (p === 'medium') {
    return (
      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        Medium (3-5 Days)
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
      Low (Routine)
    </span>
  );
}

export function CategoryBadge({ category = 'Pathology' }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
      <Sparkles className="w-3 h-3 text-emerald-400" />
      {category}
    </span>
  );
}
