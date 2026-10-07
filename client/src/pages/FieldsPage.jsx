import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Plus, 
  Search, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  ArrowRight, 
  HeartPulse, 
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import api from '../services/api';
import { HealthBadge, RiskBadge } from '../components/Badges';
import { FieldModal } from '../components/FieldModal';

export function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fields');
      if (res.success) {
        setFields(res.fields);
      }
    } catch (err) {
      console.warn('Error fetching fields:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleSaveField = async (formData) => {
    if (editingField) {
      await api.put(`/fields/${editingField.id}`, formData);
    } else {
      await api.post('/fields', formData);
    }
    await fetchFields();
  };

  const filteredFields = fields.filter((f) => {
    const matchesSearch = 
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.crop_type.toLowerCase().includes(search.toLowerCase()) ||
      f.soil_type.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Sprout className="w-4 h-4" />
            <span>Farm Plots & Crop Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Registered Field Plots
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage field acreage, crop cycles, soil classifications, and pathology vulnerability.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingField(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Field Plot</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search fields, crops, or soil type..."
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
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
            <option value="Under Treatment">Under Treatment</option>
          </select>
        </div>
      </div>

      {/* Field Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading registered fields...</p>
        </div>
      ) : filteredFields.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <Sprout className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No field plots match query</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or click "Add New Field Plot" to register your first parcel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <div
              key={field.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Status Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <HealthBadge status={field.status} />
                  <RiskBadge level={field.risk_level} />
                </div>

                {/* Field Title & Crop */}
                <Link to={`/fields/${field.id}`} className="block">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {field.name}
                  </h3>
                  <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                    {field.crop_type}
                  </p>
                </Link>

                {/* Field Details */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{field.location || 'Plot Main'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>{field.acreage} Acres</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Soil:</span>
                    <span className="text-slate-300 truncate">{field.soil_type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-slate-200">{field.health_score || 85}% Score</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link
                  to={`/ai-advisor?field_id=${field.id}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Diagnose</span>
                </Link>

                <Link
                  to={`/fields/${field.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Field Create/Edit Modal */}
      <FieldModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveField}
        initialData={editingField}
      />
    </div>
  );
}
