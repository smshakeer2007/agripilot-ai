import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Layers, 
  HeartPulse, 
  ShieldAlert, 
  ArrowLeft, 
  Bot, 
  Edit3, 
  Trash2, 
  Calendar, 
  FileText,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { HealthBadge, RiskBadge, PriorityBadge } from '../components/Badges';
import { FieldModal } from '../components/FieldModal';

export function FieldDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchField = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/fields/${id}`);
      if (res.success) {
        setField(res.field);
      }
    } catch (err) {
      setError(err.message || 'Field not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchField();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${field?.name}? All linked historical advisories will be preserved.`)) {
      try {
        await api.delete(`/fields/${id}`);
        navigate('/fields');
      } catch (err) {
        alert('Failed to delete field: ' + err.message);
      }
    }
  };

  const handleUpdate = async (formData) => {
    await api.put(`/fields/${id}`, formData);
    await fetchField();
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading field profile...</p>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Field Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">{error || 'This plot does not exist or access is denied.'}</p>
        <Link to="/fields" className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200">
          Back to Fields List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button */}
      <Link to="/fields" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fields Management</span>
      </Link>

      {/* Main Profile Header */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HealthBadge status={field.status} />
              <RiskBadge level={field.risk_level} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {field.name}
            </h1>
            <p className="text-sm font-medium text-emerald-400 mt-0.5">
              Crop Variety: {field.crop_type}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/ai-advisor?field_id=${field.id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 flex items-center gap-2 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Diagnostic</span>
            </Link>

            <button
              onClick={() => setModalOpen(true)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Edit Field"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Delete Field"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Field Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Acreage</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{field.acreage} Acres</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Soil Profile</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block truncate">{field.soil_type}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Location</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block truncate">{field.location || 'Block Sector'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Health Index</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">{field.health_score || 85}%</span>
          </div>
        </div>
      </div>

      {/* Linked Consultations & Crop History */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">Agronomic Diagnostic History for this Field</h3>
              <p className="text-xs text-slate-400">Past AI consultations, pathogen reports, and spray treatments</p>
            </div>
          </div>
        </div>

        {(!field.advisories || field.advisories.length === 0) ? (
          <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs">No prior diagnostic advisories logged for this plot.</p>
            <Link
              to={`/ai-advisor?field_id=${field.id}`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Initiate First Diagnostic Check-in</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {field.advisories.map((adv) => (
              <div
                key={adv.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{adv.title}</span>
                    <PriorityBadge priority={adv.priority || 'Medium'} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Diagnosis: <strong className="text-emerald-300">{adv.diagnosis || 'Healthy / Monitoring'}</strong></span>
                    <span>•</span>
                    <span>{new Date(adv.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link
                  to={`/advisories/${adv.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold self-start sm:self-auto transition-colors"
                >
                  View Full Consultation
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <FieldModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleUpdate}
        initialData={field}
      />
    </div>
  );
}
