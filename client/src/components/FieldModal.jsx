import React, { useState, useEffect } from 'react';
import { X, Sprout, MapPin, Layers, HeartPulse } from 'lucide-react';

const SOIL_TYPES = [
  'Loamy',
  'Loamy Clay',
  'Sandy Loam',
  'Silty Clay Loam',
  'Clay Loam',
  'Rich Humus Loam',
  'Black Soil',
  'Red Soil',
  'Hydroponic Substrate'
];

export function FieldModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    acreage: '5.0',
    soil_type: 'Loamy',
    location: 'North Quadrant',
    status: 'Healthy',
    risk_level: 'Low',
    health_score: '88'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        crop_type: initialData.crop_type || '',
        acreage: String(initialData.acreage || 5.0),
        soil_type: initialData.soil_type || 'Loamy',
        location: initialData.location || 'North Quadrant',
        status: initialData.status || 'Healthy',
        risk_level: initialData.risk_level || 'Low',
        health_score: String(initialData.health_score || 85)
      });
    } else {
      setFormData({
        name: '',
        crop_type: '',
        acreage: '5.0',
        soil_type: 'Loamy',
        location: 'North Quadrant',
        status: 'Healthy',
        risk_level: 'Low',
        health_score: '88'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim() || !formData.crop_type.trim()) {
      setError('Field plot name and crop type are required.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save field.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialData ? 'Edit Field Plot' : 'Register New Field Plot'}
              </h3>
              <p className="text-xs text-slate-400">Configure crop, soil, and management bounds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Field Name / Plot Identifier *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Block B - Roma Tomatoes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Crop Type *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tomato (Solanum lycopersicum)"
                value={formData.crop_type}
                onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Acreage (Acres) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.acreage}
                onChange={(e) => setFormData({ ...formData, acreage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Soil Type
              </label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              >
                {SOIL_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Location / Sector
              </label>
              <input
                type="text"
                placeholder="e.g. East Valley Flatlands"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
                <option value="Under Treatment">Under Treatment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Risk Level
              </label>
              <select
                value={formData.risk_level}
                onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Health Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.health_score}
                onChange={(e) => setFormData({ ...formData, health_score: e.target.value })}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/50 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : (initialData ? 'Update Field' : 'Save Field Plot')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
