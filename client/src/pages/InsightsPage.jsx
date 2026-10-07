import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  Droplets, 
  Layers,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

export function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      if (res.success && res.data?.insights) {
        setInsights(res.data.insights);
      }
    } catch (err) {
      console.warn('Failed to load insights:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');
      const res = await api.post('/ai/generate-insights');
      if (res.success) {
        await fetchInsights();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate farm insights.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Lightbulb className="w-4 h-4" />
            <span>Farm Intelligence & Yield Optimization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI-Driven Agronomic Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Proactive recommendations derived from field telemetry, pathology reports, and micro-climate conditions.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing Farm Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Fresh Insights</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Yield Optimization</span>
            <span className="text-sm font-bold text-white mt-0.5 block">+18% Efficiency Potential</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Water Conservation</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Early Morning Drip Shift</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Vulnerability Monitor</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Tomato Fungal Humidity Risk</span>
          </div>
        </div>
      </div>

      {/* Insights List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading agronomic intelligence...</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <Lightbulb className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No insights generated yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Generate Fresh Insights" to run autonomous agronomic reasoning across your fields.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((ins, idx) => (
            <div
              key={ins.id || idx}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                    {ins.insight_type || 'Agronomic Intelligence'}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                    ins.severity === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : (ins.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')
                  }`}>
                    {ins.severity} Severity
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {ins.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {ins.description}
                </p>
              </div>

              {ins.recommended_action && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-100">
                    <span className="font-bold text-emerald-400 block mb-0.5">Recommended Field Action:</span>
                    {ins.recommended_action}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
