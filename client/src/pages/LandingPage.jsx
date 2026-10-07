import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Layers, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  Eye, 
  Cpu, 
  Sparkles,
  Droplets,
  Microscope,
  FileText
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-900/50">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                AgriPilot <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                Autonomous Agronomic Suite
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Workflow</a>
            <a href="#multimodal" className="hover:text-emerald-400 transition-colors">Vision AI</a>
            <a href="#sectors" className="hover:text-emerald-400 transition-colors">Agri Sectors</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI for Smart Agriculture • Multimodal Gemini 2.5 Flash</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Protect Your Crops. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Optimize Every Input.
            </span> <br />
            Harvest Higher Yields.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The intelligent agronomic advisory platform combining multimodal leaf disease diagnosis, soil NPK analysis, micro-climate disease forecasting, and organic + chemical field intervention plans.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950 transition-all flex items-center gap-2 group"
            >
              <span>Launch Live Agronomic App</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl text-base font-semibold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 transition-all"
            >
              Explore Demo Farm
            </Link>
          </div>

          {/* Interactive Flow Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-900/90 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-left glow-emerald-lg">
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Live Hackathon Diagnostic Scenario
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Plot: <strong>Block B - Roma Tomatoes (12.5 Acres)</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  1. Field Symptom Input
                </div>
                <p className="text-xs text-slate-300 italic">
                  "Concentric ring spots on lower leaves with yellow halos. Humidity has been 85% for 3 days and soil nitrogen is low."
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Leaf photo uploaded (Alternaria)
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  2. AI Computer Vision Diagnosis
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Diagnosis:</span>
                    <span className="font-bold text-white">Early Blight</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity:</span>
                    <span className="font-bold text-orange-400">High (24-48h)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="font-bold text-emerald-400">94%</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-2">
                  <Zap className="w-4 h-4" />
                  3. Field Action Plan
                </div>
                <p className="text-xs text-slate-200">
                  <strong>Organic:</strong> Neem oil (5ml/L) or Bacillus subtilis.<br />
                  <strong>Chemical:</strong> Copper Oxychloride 50% WP @ 2.5g/L.<br />
                  <strong>Action:</strong> Prune lower leaves & switch to drip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Agronomic Problem */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              The Agricultural Dilemma
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Why Farm Operations Lose 20% to 40% of Potential Yield
            </h2>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">
              Traditional farmers struggle to get timely, expert pathology advice. Delayed visual diagnosis, over-application of costly chemicals, and uncoordinated irrigation trigger severe crop stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Late Disease Detection</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Fungal lesions like Early Blight or Stripe Rust are often noticed only after spore germination has compromised 30%+ of the canopy, multiplying intervention costs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Inefficient Chemical & Water Timing</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Overhead spraying during high humidity spreads bacterial spots, while midday irrigation suffers 22% evaporative loss without reaching the deep rootzone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Disconnected Farm Signals</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Soil NPK depletion, pest emergence, and micro-climate fluctuations are tracked in isolated notebooks instead of a cohesive agronomic intelligence system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Engineered for Field Performance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Autonomous Agronomic Intelligence Suite
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <Eye className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">Multimodal Vision Diagnostics</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Upload leaf imagery or capture field photos. The vision model pinpoints necrotic lesions, powdery cankers, and insect vectors with confidence scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <Leaf className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">Dual Treatment Architecture</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Never sacrifice sustainability. Every diagnosis generates verified bio-organic protocols alongside regulated IPM chemical treatments with exact dosages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <Layers className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">Soil NPK & Stress Profiling</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Correlate foliar chlorosis with soil nitrogen, phosphorus, and potassium deficiencies. Receive automated split-dose fertigation instructions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <Zap className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">Dynamic Urgency Classifier</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Differentiates routine maintenance from acute outbreaks. Prioritizes critical field interventions required within 24 hours to prevent total yield loss.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <BarChart3 className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">Executive Farm Dashboard</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Track field health scores, disease distributions, soil health index, and pending interventions across all acreage in real time with Recharts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <Bot className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">Farm Business Insights</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Autonomous agronomic reasoning evaluates micro-climate humidity spikes, irrigation scheduling improvements, and yield bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Domains */}
      <section id="sectors" className="py-20 border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Multi-Sector Versatility
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Tailored for Every Agricultural Domain
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12 text-center">
            {[
              { title: 'Horticulture', subtitle: 'Fruits & Veg' },
              { title: 'Cereal & Grains', subtitle: 'Wheat & Corn' },
              { title: 'Greenhouses', subtitle: 'Controlled Ag' },
              { title: 'Orchards', subtitle: 'Fruit Groves' },
              { title: 'Organic Farms', subtitle: 'Zero Chemical' },
              { title: 'Hydroponics', subtitle: 'Soilless CEA' },
            ].map((sector, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors">
                <span className="text-sm font-bold text-slate-100 block">{sector.title}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">{sector.subtitle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Transform Your Farm Operations?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base">
            Join agricultural advisors and progressive farm managers making data-driven, yield-maximizing decisions with AgriPilot AI.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950 transition-all flex items-center gap-2 group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">AgriPilot AI</span>
            <span>• Hackathon Theme: AI for Smart Agriculture</span>
          </div>
          <div>
            Built with React, Vite, Tailwind CSS, Express, Supabase PostgreSQL, and Google Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
