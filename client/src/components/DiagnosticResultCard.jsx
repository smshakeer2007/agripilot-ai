import React from 'react';
import { Leaf, ShieldAlert, Sparkles, CheckCircle2, FlaskConical, AlertCircle, Clock, Calendar } from 'lucide-react';
import { HealthBadge, RiskBadge, PriorityBadge, CategoryBadge } from './Badges';

export function DiagnosticResultCard({ analysis }) {
  if (!analysis) return null;

  const confidencePct = Math.round((Number(analysis.confidence_score) || 0.85) * 100);

  return (
    <div className="rounded-2xl bg-slate-900 border border-emerald-500/30 overflow-hidden shadow-2xl glow-emerald">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-emerald-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CategoryBadge category={analysis.category} />
            <RiskBadge level={analysis.risk_level} />
            <PriorityBadge priority={analysis.priority} />
          </div>
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Model Confidence:</span>
            <span className="font-bold text-emerald-400">{confidencePct}%</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Agronomic Diagnosis
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            {analysis.diagnosis}
          </h2>
        </div>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
          {analysis.summary}
        </p>
      </div>

      {/* Treatment Protocol: Organic vs Chemical */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            Integrated Field Treatment Protocols
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organic Treatment */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Certified Organic Remedy
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">
                  Eco-Friendly / Bio
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {analysis.organic_remedy}
              </p>
            </div>

            {/* Chemical / IPM Treatment */}
            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-sky-400" />
                  Regulated Chemical / IPM Remedy
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-medium">
                  Targeted Dosage
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {analysis.chemical_remedy}
              </p>
            </div>
          </div>
        </div>

        {/* Immediate Recommended Action */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Immediate Field Operator Action
            </span>
            <p className="text-sm text-amber-100 font-medium">
              {analysis.recommended_action}
            </p>
          </div>
        </div>

        {/* Agronomic Application Guidelines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Optimal Spray Window: <strong>05:30 - 08:30 AM</strong> or <strong>05:00 - 07:00 PM</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Post-Intervention Re-inspection: <strong>In 48 to 72 Hours</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
