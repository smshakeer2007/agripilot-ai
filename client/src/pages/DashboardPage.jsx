import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Lightbulb, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { KPICard } from '../components/KPICard';
import { HealthBadge, RiskBadge, PriorityBadge } from '../components/Badges';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">
          AgriPilot AI is aggregating field telemetry & diagnostic records...
        </p>
      </div>
    );
  }

  const kpi = data?.kpi || {
    totalFields: 5,
    activeDiagnostics: 4,
    healthyCropsPct: 75,
    highPriorityThreats: 2,
    soilHealthIndex: 82,
    pendingActions: 3
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/20 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Real-time Farm Agronomic Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Farm Manager'}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Telemetry active for <strong>{user?.farm_name || 'AgriFarm'}</strong>. 
              {kpi.highPriorityThreats > 0 ? (
                <span className="text-amber-400 font-medium"> ⚠️ {kpi.highPriorityThreats} field alert requires priority intervention.</span>
              ) : (
                <span className="text-emerald-400 font-medium"> All monitored crops are within optimal health thresholds.</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/ai-advisor"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 group whitespace-nowrap"
            >
              <Sprout className="w-4 h-4" />
              <span>Diagnose Leaf or Query AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Monitored Fields"
          value={kpi.totalFields}
          unit="Plots"
          icon={Sprout}
          color="emerald"
        />
        <KPICard
          title="Active Diagnostics"
          value={kpi.activeDiagnostics}
          unit="Cases"
          icon={Activity}
          color="sky"
        />
        <KPICard
          title="Healthy Crops"
          value={kpi.healthyCropsPct}
          unit="%"
          icon={ShieldCheck}
          color={kpi.healthyCropsPct >= 80 ? 'emerald' : 'amber'}
        />
        <KPICard
          title="Priority Threats"
          value={kpi.highPriorityThreats}
          unit="Alerts"
          icon={AlertTriangle}
          color={kpi.highPriorityThreats > 0 ? 'rose' : 'emerald'}
        />
        <KPICard
          title="Soil Health Index"
          value={kpi.soilHealthIndex}
          unit="/100"
          icon={Layers}
          color="emerald"
        />
        <KPICard
          title="Pending Actions"
          value={kpi.pendingActions}
          unit="Tasks"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease & Pathology Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Crop Disease & Stress Distribution</h3>
              <p className="text-xs text-slate-400">Pathology, pest, and physiological cases</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live DB
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.diseaseDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issue Categories Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Diagnostic Intent Categories</h3>
              <p className="text-xs text-slate-400">Distribution by agronomic classification</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              AI Categorized
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categoryDistribution || []}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={5}
                >
                  {(data?.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Farm Intelligence & Yield Insights Row */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Farm Intelligence & Actionable Insights</h3>
              <p className="text-xs text-slate-400">Micro-climate, irrigation, and yield optimization recommendations</p>
            </div>
          </div>
          <Link
            to="/insights"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.insights || []).map((ins, idx) => (
            <div
              key={ins.id || idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white leading-snug line-clamp-1">
                    {ins.title}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    ins.severity === 'High' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : (ins.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')
                  }`}>
                    {ins.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {ins.description}
                </p>
              </div>

              {ins.recommended_action && (
                <div className="pt-2.5 border-t border-slate-800/60 flex items-start gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-[11px] leading-tight">
                    <strong>Action:</strong> {ins.recommended_action}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Field Consultations & Advisories */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Recent Agronomic Diagnoses & Consultations</h3>
            <p className="text-xs text-slate-400">Latest field logs analyzed by AgriPilot AI</p>
          </div>
          <Link
            to="/advisories"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Consultation Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-semibold">Consultation / Title</th>
                <th className="pb-3 font-semibold">Field Plot</th>
                <th className="pb-3 font-semibold">Diagnosis</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(data?.recentAdvisories || []).map((adv) => (
                <tr key={adv.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 font-medium text-white max-w-[220px] truncate">
                    {adv.title}
                  </td>
                  <td className="py-3.5 text-slate-300">
                    {adv.field_name || 'General Field'}
                  </td>
                  <td className="py-3.5 font-semibold text-emerald-300">
                    {adv.diagnosis || 'Healthy / Monitoring'}
                  </td>
                  <td className="py-3.5">
                    <PriorityBadge priority={adv.priority || 'Medium'} />
                  </td>
                  <td className="py-3.5 text-slate-300">
                    {adv.confidence_score ? `${Math.round(adv.confidence_score * 100)}%` : '85%'}
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/advisories/${adv.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white transition-colors text-xs font-semibold inline-block"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
