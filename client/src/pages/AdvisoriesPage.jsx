import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Bot, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  SlidersHorizontal 
} from 'lucide-react';
import api from '../services/api';
import { PriorityBadge, HealthBadge } from '../components/Badges';

export function AdvisoriesPage() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function fetchAdvisories() {
      try {
        setLoading(true);
        const res = await api.get('/advisories');
        if (res.success) {
          setAdvisories(res.advisories);
        }
      } catch (err) {
        console.warn('Failed to load advisories:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAdvisories();
  }, []);

  const filtered = advisories.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(q) ||
      (a.field_name && a.field_name.toLowerCase().includes(q)) ||
      (a.diagnosis && a.diagnosis.toLowerCase().includes(q)) ||
      (a.crop_type && a.crop_type.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <FileText className="w-4 h-4" />
            <span>Agronomic Logs & Consultation Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Field Advisory Consultations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Archive of historical diagnoses, chemical spray interventions, and organic treatment records.
          </p>
        </div>

        <Link
          to="/ai-advisor"
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>New AI Consultation</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by diagnosis, field, or crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 flex-1 sm:flex-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Advisories Table / List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading historical advisories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No advisory logs found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Run a diagnostic analysis in the AI Advisor to log your first field consultation.
          </p>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5 font-semibold">Consultation Subject</th>
                  <th className="pb-3.5 font-semibold">Field & Crop</th>
                  <th className="pb-3.5 font-semibold">AI Diagnosis</th>
                  <th className="pb-3.5 font-semibold">Priority</th>
                  <th className="pb-3.5 font-semibold">Status</th>
                  <th className="pb-3.5 font-semibold">Date Logged</th>
                  <th className="pb-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-4 font-medium text-white max-w-[240px] truncate">
                      {adv.title}
                    </td>
                    <td className="py-4 text-slate-300">
                      <div>{adv.field_name || 'General Field'}</div>
                      <div className="text-[11px] text-slate-500">{adv.crop_type}</div>
                    </td>
                    <td className="py-4 font-semibold text-emerald-300">
                      {adv.diagnosis || 'Healthy / Monitoring'}
                    </td>
                    <td className="py-4">
                      <PriorityBadge priority={adv.priority || 'Medium'} />
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        adv.status === 'Resolved' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : (adv.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300')
                      }`}>
                        {adv.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400">
                      {new Date(adv.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/advisories/${adv.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white transition-colors text-xs font-semibold inline-block"
                      >
                        Open Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
