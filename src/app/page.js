"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  MessageSquare, 
  Cpu, 
  Database, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight, 
  Globe,
  Settings,
  Activity
} from 'lucide-react';

export default function UltraModernDashboard() {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  // CONFIG
  const CLINIC_ID = 1; 
  const BACKEND_URL = "https://dental-assistant-bot-production.up.railway.app";

  useEffect(() => {
    async function getClinic() {
      const { data } = await supabase.from('clinics').select('*').eq('id', CLINIC_ID).maybeSingle();
      if (data) setClinic(data);
      setLoading(false);
    }
    getClinic();
  }, []);

  const handleConnect = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/google/login/${CLINIC_ID}`);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert("System initializing... check back in 1 minute.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <div className="text-blue-500 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Booting Dental_OS...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        
        {/* --- Top Navigation --- */}
        <header className="flex justify-between items-center mb-16 backdrop-blur-md bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu size={22} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight uppercase italic">DentalBot <span className="text-blue-500">v2.0</span></div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Autonomous Agent</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4 text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              <span className="text-blue-400">Node_Online</span>
              <span>DB_Connected</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <Settings size={18} className="text-slate-400 cursor-pointer hover:text-white transition-colors" />
          </div>
        </header>

        {/* --- Hero Branding Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
              AI-Driven <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Clinic Scale.
              </span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed">
              Transforming patient acquisition through autonomous WhatsApp agents and real-time calendar synchronization.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleConnect}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1"
              >
                <Calendar size={18} />
                {clinic?.google_refresh_token ? "System Synced" : "Authorize Calendar"}
              </button>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-bold transition-all">
                View Agent Logs
              </button>
            </div>
          </div>

          {/* --- Technical Pulse Card --- */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
             <div className="flex justify-between items-start mb-10">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400"><Activity size={24}/></div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Status</div>
                  <div className="text-emerald-400 font-mono text-sm font-bold">● SYSTEM_HEALTHY</div>
                </div>
             </div>
             
             <div className="space-y-6">
                <IntegrationRow icon={<MessageSquare size={16}/>} label="WhatsApp Engine" status="Twilio API v3" color="text-blue-400" />
                <IntegrationRow icon={<Zap size={16}/>} label="Inference Brain" status="Llama 3.1 8B" color="text-purple-400" />
                <IntegrationRow icon={<Database size={16}/>} label="Storage Layer" status="Postgres Realtime" color="text-indigo-400" />
                <IntegrationRow icon={<Globe size={16}/>} label="Deployment" status="Vercel Edge" color="text-cyan-400" />
             </div>
          </div>
        </div>

        {/* --- Features Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
           <FeatureBox 
              title="Multi-Tenancy" 
              desc="Full RLS data isolation for secure clinical operations." 
              tag="Security"
            />
           <FeatureBox 
              title="Conflict Resolution" 
              desc="Real-time Google Calendar API polling to prevent double-bookings." 
              tag="Sync"
            />
           <FeatureBox 
              title="Agentic Reasoning" 
              desc="Function-calling architecture for autonomous DB transactions." 
              tag="AI Logic"
            />
        </div>

      </div>
    </div>
  );
}

function IntegrationRow({ icon, label, status, color }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-white/5 rounded-lg ${color}`}>{icon}</div>
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{status}</span>
    </div>
  )
}

function FeatureBox({ title, desc, tag }) {
  return (
    <div className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all hover:border-blue-500/50">
      <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">{tag}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}