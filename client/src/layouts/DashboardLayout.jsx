import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
  Bot, 
  FileText, 
  Lightbulb, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout() {
  const { user, logout, seedDemoData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDemoData();
      setSeedSuccess(true);
      setTimeout(() => {
        setSeedSuccess(false);
        window.location.reload();
      }, 1200);
    } catch (err) {
      alert('Seeding failed: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Fields & Crops', path: '/fields', icon: Sprout },
    { name: 'AI Disease Advisor', path: '/ai-advisor', icon: Bot, badge: 'Multimodal' },
    { name: 'Advisory Logs', path: '/advisories', icon: FileText },
    { name: 'Farm Intelligence', path: '/insights', icon: Lightbulb },
    { name: 'Farm Settings', path: '/settings', icon: Settings },
  ];

  // Breadcrumb derivation
  const currentPath = location.pathname;
  const currentItem = navItems.find(item => item.path === currentPath);
  const pageTitle = currentItem ? currentItem.name : (currentPath.includes('/fields/') ? 'Field Details' : 'Advisory Detail');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-900/40">
                <Sprout className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  AgriPilot <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                  Autonomous AgTech
                </span>
              </div>
            </NavLink>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Farm Details Card */}
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Active Organization
            </div>
            <div className="text-sm font-bold text-emerald-300 truncate mt-0.5">
              {user?.farm_name || 'AgriFarm Plots'}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{user?.farming_sector || 'Horticulture'}</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 hover:text-slate-200 cursor-pointer" onClick={() => navigate('/dashboard')}>
                AgriPilot
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="font-semibold text-white">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Seed Button */}
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm"
              title="Populates or resets sample fields, crop diagnostics, and AI insights for demo"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{seeding ? 'Seeding...' : (seedSuccess ? 'Demo Data Loaded!' : 'Seed Demo Data')}</span>
            </button>

            <NavLink
              to="/ai-advisor"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant AI Diagnosis</span>
            </NavLink>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
