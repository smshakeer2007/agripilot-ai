import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bot, 
  User, 
  Send, 
  Calendar, 
  Sprout, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import { DiagnosticResultCard } from '../components/DiagnosticResultCard';
import { PriorityBadge } from '../components/Badges';

export function AdvisoryDetailPage() {
  const { id } = useParams();
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdvisory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/advisories/${id}`);
      if (res.success) {
        setAdvisory(res.advisory);
      }
    } catch (err) {
      setError(err.message || 'Failed to load advisory details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [id]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/advisories/${id}/messages`, {
        content: reply,
        sender_type: 'farmer'
      });
      setReply('');
      await fetchAdvisory();
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading consultation records...</p>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Consultation Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">{error || 'This record does not exist or access is denied.'}</p>
        <Link to="/advisories" className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200">
          Back to Advisories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button */}
      <Link to="/advisories" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Advisory Archive</span>
      </Link>

      {/* Header Banner */}
      <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Initiated {new Date(advisory.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{advisory.status}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {advisory.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Field: <strong>{advisory.field_name || 'General Field'}</strong> ({advisory.crop_type})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              Ref ID: #{advisory.id.substring(0, 8)}
            </span>
          </div>
        </div>
      </div>

      {/* Primary AI Diagnostic Card */}
      {advisory.latestAnalysis && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Diagnostic Finding & Prescribed Protocol
          </h2>
          <DiagnosticResultCard analysis={advisory.latestAnalysis} />
        </div>
      )}

      {/* Message Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Consultation Thread ({advisory.messages?.length || 0} Entries)
        </h3>

        <div className="space-y-4 pt-2">
          {(advisory.messages || []).map((msg) => {
            const isFarmer = msg.sender_type === 'farmer';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isFarmer ? 'justify-end' : 'justify-start'}`}
              >
                {!isFarmer && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isFarmer
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.image_url && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-white/20 max-h-48">
                      <img
                        src={msg.image_url}
                        alt="Uploaded leaf"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className="block text-[10px] mt-1.5 opacity-60 text-right">
                    {new Date(msg.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>

                {isFarmer && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Append Follow-up Reply */}
        <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Add follow-up field observations or questions..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={submitting || !reply.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Log</span>
          </button>
        </form>
      </div>
    </div>
  );
}
