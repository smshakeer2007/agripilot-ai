import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Building, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    farm_name: user?.farm_name || '',
    farming_sector: user?.farming_sector || 'Horticulture',
    farming_approach: user?.farming_approach || 'Integrated Pest Management (IPM)',
    primary_goal: user?.primary_goal || 'Maximize Yield',
    risk_alert_threshold: user?.risk_alert_threshold || 'Medium'
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateUser(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>Farm Operations & Advisory Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Farm & AI Advisor Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Adjust your agricultural sector, management approach, and threat alert sensitivities.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Farm settings and AI advisory parameters saved successfully.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Manager / Lead Agronomist Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Farm / Organization Name
              </label>
              <input
                type="text"
                required
                value={formData.farm_name}
                onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Primary Farming Sector
              </label>
              <select
                value={formData.farming_sector}
                onChange={(e) => setFormData({ ...formData, farming_sector: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Horticulture">Horticulture (Vegetables & Fruits)</option>
                <option value="Cereal & Grain">Cereal & Grain Farming</option>
                <option value="Organic Farming">Certified Organic Production</option>
                <option value="Commercial Greenhouses">Commercial Greenhouse Complex</option>
                <option value="Cash Crops">Cash Crops (Cotton, Sugarcane, Coffee)</option>
                <option value="Hydroponics">Hydroponics & CEA</option>
                <option value="Plantation Crops">Plantation Orchards</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Agronomic Management Approach
              </label>
              <select
                value={formData.farming_approach}
                onChange={(e) => setFormData({ ...formData, farming_approach: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Integrated Pest Management (IPM)">Integrated Pest Management (IPM)</option>
                <option value="Organic">Organic Only (No Synthetic Chemicals)</option>
                <option value="Conventional Chemical">Conventional Chemical Spray Regimes</option>
                <option value="Hydroponics / Soilless">Hydroponic Substrate Regimes</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Influences the AI advisor's biological vs synthetic chemical recommendations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Primary Enterprise Goal
              </label>
              <select
                value={formData.primary_goal}
                onChange={(e) => setFormData({ ...formData, primary_goal: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Maximize Yield">Maximize Total Yield Output</option>
                <option value="Disease Eradication">Pathogen & Spore Eradication</option>
                <option value="Soil Regeneration">Soil Regeneration & Microbial Health</option>
                <option value="Reduce Water & Input Costs">Minimize Water & Fertilizer Expenditure</option>
                <option value="Premium Quality Produce">Produce Premium Grade Export Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Risk Alert Threshold
              </label>
              <select
                value={formData.risk_alert_threshold}
                onChange={(e) => setFormData({ ...formData, risk_alert_threshold: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Moderate">Moderate (Early Inception Alerts)</option>
                <option value="High">High (Definite Intervention Alerts)</option>
                <option value="Critical Only">Critical Only (Severe Loss Threat)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
