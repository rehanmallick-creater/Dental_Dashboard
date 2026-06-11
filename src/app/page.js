"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function DentalSaaS() {
  // 1. State management
  const [appointments, setAppointments] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================================
  // 🛠️ CONFIGURATION - CHECK THESE TWO CAREFULLY
  // =========================================================================
  // IMPORTANT: Go to Supabase Table Editor -> clinics and copy the ID.
  // If it's a number, use: 1. If it's a long UUID string, use: "your-uuid-here"
  const CLINIC_ID = 1; 
  const BACKEND_URL = "https://dental-assistant-bot-production.up.railway.app";
  // =========================================================================
  
  useEffect(() => {
    // We define the function INSIDE the effect to stop the "Cascading Render" red line
    async function loadDashboardData() {
      try {
        setLoading(true);

        // A. Fetch Clinic Information
        const { data: clinicData, error: clinicErr } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', CLINIC_ID)
          .maybeSingle(); // Does not crash if 0 rows found

        if (clinicErr) throw clinicErr;
        
        if (!clinicData) {
          setError(`Clinic ID ${CLINIC_ID} not found. Check your Supabase table!`);
        } else {
          setClinic(clinicData);
        }

        // B. Fetch Appointments
        const { data: apptData, error: apptErr } = await supabase
          .from('appointments')
          .select('*')
          .eq('clinic_id', CLINIC_ID)
          .order('created_at', { ascending: false });

        if (apptErr) throw apptErr;
        setAppointments(apptData || []);
        
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();

    // C. Set up Real-time Sync (Websockets)
    // Whenever the AI books a row, the UI updates automatically
    const channel = supabase.channel('dashboard-sync')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        () => {
          loadDashboardData(); // Refresh list on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [CLINIC_ID]); // Only re-run if CLINIC_ID changes

  // Handler for Google Calendar Sync
  const handleGoogleConnect = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/google/login/${CLINIC_ID}`);
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Could not get Login URL from Backend");
      }
    } catch (err) {
      alert("Backend not responding. Make sure Railway is Active and CORS is enabled.");
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm tracking-widest animate-pulse">SYNCING ENCRYPTED DATABASE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAV / HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {clinic?.clinic_name || "DentalBot"}
            </h1>
            <p className="text-slate-500 font-medium">Real-time AI Receptionist Dashboard</p>
          </div>

          <button 
            onClick={handleGoogleConnect}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition shadow-lg hover:scale-105 active:scale-95 ${
              clinic?.google_refresh_token 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Calendar size={20} />
            {clinic?.google_refresh_token ? 'GOOGLE CALENDAR CONNECTED' : 'CONNECT GOOGLE CALENDAR'}
          </button>
        </div>

        {/* ERROR MESSAGE BOX */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="text-sm font-bold">Error: {error}</span>
          </div>
        )}

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Bookings</p>
            <p className="text-3xl font-black">{appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">AI Status</p>
            <p className="text-3xl font-black text-emerald-500">Active</p>
          </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                  <th className="px-8 py-6">Patient Number</th>
                  <th className="px-8 py-6">Appointment Details</th>
                  <th className="px-8 py-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-20 text-center text-slate-400 italic">
                      No appointments found. Send a WhatsApp message to your Twilio number to test!
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 font-bold text-slate-700">{app.customer_phone}</td>
                      <td className="px-8 py-6 text-slate-600 font-medium">{app.appointment_date}</td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700">
                          <Clock size={12} />
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}