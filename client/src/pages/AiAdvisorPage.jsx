import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Sprout, 
  MessageSquare, 
  Clock, 
  User, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { LeafImageDropzone } from '../components/LeafImageDropzone';
import { DiagnosticResultCard } from '../components/DiagnosticResultCard';
import { PriorityBadge, HealthBadge } from '../components/Badges';

export function AiAdvisorPage() {
  const [searchParams] = useSearchParams();
  const initialFieldId = searchParams.get('field_id') || '';

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFieldId);
  const [query, setQuery] = useState('');
  const [imageData, setImageData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [advisoryId, setAdvisoryId] = useState(null);
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  // Fetch registered fields
  useEffect(() => {
    async function fetchFields() {
      try {
        const res = await api.get('/fields');
        if (res.success) {
          setFields(res.fields);
          if (!selectedFieldId && res.fields.length > 0) {
            setSelectedFieldId(res.fields[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to load fields:', err.message);
      }
    }
    fetchFields();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, analyzing]);

  // Handle preset sample selection from the gallery
  const handleSelectPreset = (preset) => {
    setImageData(preset.url);
    setQuery(preset.symptoms);
    
    // Auto-match field if matching name exists
    const matching = fields.find(f => f.name.toLowerCase().includes(preset.crop.toLowerCase()) || f.crop_type.toLowerCase().includes(preset.crop.toLowerCase()));
    if (matching) {
      setSelectedFieldId(matching.id);
    }
  };

  // Submit diagnosis request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() && !imageData) {
      setError('Please provide a field symptom description or upload a plant leaf photo.');
      return;
    }

    setError('');
    const userQuery = query.trim() || 'Please examine attached plant leaf photo and diagnose disease severity, pathogen category, and treatments.';
    const currentImage = imageData;

    // Optimistically append user message to chat
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      sender_type: 'farmer',
      content: userQuery,
      image_url: currentImage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setQuery('');
    setImageData(null);
    setAnalyzing(true);

    try {
      const selectedField = fields.find(f => f.id === selectedFieldId);

      const payload = {
        advisory_id: advisoryId || undefined,
        field_id: selectedFieldId || null,
        query: userQuery,
        image_data: currentImage,
        crop_type: selectedField?.crop_type || 'Tomato',
        soil_type: selectedField?.soil_type || 'Loamy Clay',
        weather_context: 'Microclimate: 85% RH, morning mist'
      };

      const res = await api.post('/ai/analyze', payload);

      if (res.success) {
        setAdvisoryId(res.advisory_id);
        setLatestAnalysis(res.analysis);

        // Append AI response
        const aiMsg = {
          id: 'ai-' + Date.now(),
          sender_type: 'ai',
          content: `Analysis complete: ${res.analysis.diagnosis} detected (${Math.round(res.analysis.confidence_score * 100)}% confidence).\n\nSummary: ${res.analysis.summary}\n\nRecommended Action: ${res.analysis.recommended_action}`,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while analyzing the field data. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
    setLatestAnalysis(null);
    setAdvisoryId(null);
    setImageData(null);
    setQuery('');
    setError('');
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Bot className="w-4 h-4" />
            <span>Multimodal Agronomic Advisor • Computer Vision & Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Crop Advisory & Disease Diagnosis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Instant plant pathology, soil nutrient classification, and dual organic/chemical treatment plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetConversation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Consultation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Input & Dropzone, Right is Real-time Result & Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Diagnostics Input (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Target Field Context
            </h2>

            {/* Field Plot Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                Select Field Plot to Link Diagnostics
              </label>
              <select
                value={selectedFieldId}
                onChange={(e) => setSelectedFieldId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">-- General Unassigned Plot --</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.crop_type})
                  </option>
                ))}
              </select>
            </div>

            {selectedField && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop Variety:</span>
                  <span className="font-semibold text-slate-200">{selectedField.crop_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Soil Type:</span>
                  <span className="font-semibold text-slate-200">{selectedField.soil_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Acreage:</span>
                  <span className="font-semibold text-slate-200">{selectedField.acreage} Acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Health:</span>
                  <span className="font-semibold text-emerald-400">{selectedField.health_score || 85}% Score</span>
                </div>
              </div>
            )}

            {/* Multimodal Leaf Image Upload */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                Plant Leaf Imagery (Computer Vision)
              </label>
              <LeafImageDropzone
                selectedImage={imageData}
                onImageSelected={(dataUrl) => setImageData(dataUrl)}
                onClearImage={() => setImageData(null)}
                onSelectPreset={handleSelectPreset}
              />
            </div>

            {/* Text Query / Symptoms Input */}
            <form onSubmit={handleSubmit} className="pt-2 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Describe Symptoms & Soil/Weather Context
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. My tomato plants have dark brown concentric ring spots on lower leaves with yellowing edges. Humidity has been 85% for three days and soil nitrogen is low."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Leaf & Soil Context...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute AI Diagnostic Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Diagnostic Result & Chat Stream (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Analyzing Banner */}
          {analyzing && (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center animate-pulse-subtle shadow-xl">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">
                AgriPilot AI is analyzing leaf diagnostic patterns and soil context...
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Running computer vision feature extraction for necrotic lesions, chlorosis index, and evaluating micro-climate spore spread vulnerability.
              </p>
            </div>
          )}

          {/* Diagnostic Result Card */}
          {latestAnalysis && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Primary Diagnostic Result
                </span>
                <span className="text-xs text-slate-400">
                  Case ID: #{latestAnalysis.id?.substring(0, 8)}
                </span>
              </div>
              <DiagnosticResultCard analysis={latestAnalysis} />
            </div>
          )}

          {/* Interactive Consultation Chat Stream */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-[520px]">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Consultation Thread & Field Logs</h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {messages.length} messages
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
                  <Bot className="w-12 h-12 text-slate-700 mb-3" />
                  <h4 className="text-sm font-semibold text-slate-400">No active consultation in this session</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Upload a leaf photo or pick a sample from the left panel to trigger an autonomous agronomic evaluation.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
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
                          <div className="mb-2 rounded-lg overflow-hidden border border-white/20 max-h-40">
                            <img
                              src={msg.image_url}
                              alt="Uploaded leaf"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span className="block text-[10px] mt-1.5 opacity-60 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {isFarmer && (
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Follow-up Question Input */}
            <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask a follow-up (e.g. Can I mix copper fungicide with foliar zinc?)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={analyzing || !query.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors"
                title="Send follow-up"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
