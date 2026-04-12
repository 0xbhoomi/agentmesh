"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Wallet, 
  Cpu, 
  Search, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  RefreshCcw,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Terminal,
  Settings,
  Bell,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [missionData, setMissionData] = useState<any>(null);
  
  const steps = [
    { id: 'discover', label: 'Discovery', icon: Search },
    { id: 'execute', label: 'Logic', icon: Terminal },
    { id: 'collaborate', label: 'Mesh', icon: Users },
    { id: 'pay', label: 'Payment', icon: DollarSign },
    { id: 'earn', label: 'Revenue', icon: TrendingUp },
  ];

  const addLog = (log: any) => {
    setLogs(prev => [log, ...prev].slice(0, 5));
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setMissionData(null);
    setCurrentStep(0);
    setLogs([]);
    
    try {
      const response = await fetch('http://localhost:3001/agentmesh/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'Latest Stellar ecosystem updates' })
      });
      
      const data = await response.json();
      setMissionData(data);

      for (let i = 0; i < data.events.length; i++) {
        const event = data.events[i];
        // Advance stepper for specific stages
        if (['discover', 'collaborate', 'pay', 'earn', 'complete'].includes(event.step)) {
            setCurrentStep(prev => prev + 1);
        }
        addLog({ id: Date.now() + i, ...event });
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (error) {
      addLog({ id: Date.now(), step: 'error', message: 'Connection lost.' });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 font-sans selection:bg-sky-500/30">
      {/* Narrative Nav */}
      <nav className="flex justify-between items-center mb-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Agent<span className="text-sky-500">Mesh</span></span>
        </div>
        <div className="flex gap-4">
            <button className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:border-sky-500 transition-colors shadow-sm">
                <Bell className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:border-sky-500 transition-colors shadow-sm">
                <Settings className="w-4 h-4 text-slate-400" />
            </button>
        </div>
      </nav>

      {/* Main Orchestrator Centerpiece */}
      <div className="max-w-4xl mx-auto relative text-left">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pearl-glass rounded-[32px] p-8 lg:p-12 relative overflow-hidden"
        >
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase italic leading-[0.9]">
                    Agent Ada <span className="text-sky-500">Mission Control</span>
                </h1>
                <p className="text-slate-500 text-lg mb-12 max-w-lg font-medium leading-relaxed">
                    Autonomous collaborative economy. Agents hiring agents via Stellar USDC.
                </p>

                {/* Progress Stepper (Black Labels) */}
                <div className="flex justify-center items-center gap-6 mb-16 w-full max-w-lg">
                    {steps.map((step, i) => (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all ${
                                currentStep >= i ? 'bg-sky-500 text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)]' : 'bg-slate-100 text-slate-300'
                            }`}>
                                {currentStep > i ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4 lg:w-5 lg:h-5" />}
                            </div>
                            <span className="text-[8px] font-black uppercase text-slate-900 tracking-widest">{step.label}</span>
                        </div>
                    ))}
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className={`w-full py-6 rounded-3xl font-black text-xl italic uppercase tracking-tighter transition-all flex items-center justify-center gap-3 ${
                        isSimulating 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-2xl shadow-sky-500/40 hover:shadow-sky-500/60'
                    }`}
                >
                    {isSimulating ? <RefreshCcw className="animate-spin w-6 h-6" /> : <Zap className="w-6 h-6 fill-current" />}
                    {isSimulating ? 'Processing economic mesh...' : 'Launch Agent Ada'}
                </motion.button>
            </div>
        </motion.div>

        {/* Dynamic Trace (Floating Cards) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="pearl-glass rounded-[32px] p-8 flex flex-col h-[400px]">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8 italic">Economic Trace</h2>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide py-2">
                    <AnimatePresence mode="popLayout">
                        {logs.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                                <Search className="w-12 h-12 text-slate-200" />
                                <p className="text-xs font-bold text-slate-400">Mesh Ready</p>
                            </div>
                        )}
                        {logs.map((log) => (
                            <motion.div 
                                key={log.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4 transition-all hover:border-sky-200`}
                            >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${log.step === 'pay' ? 'bg-sky-500 shadow-sm' : log.step === 'collaborate' ? 'bg-indigo-500 shadow-sm' : 'bg-slate-200'}`}>
                                    {log.step === 'pay' ? <DollarSign className="w-4 h-4 text-white" /> : log.step === 'collaborate' ? <Users className="w-4 h-4 text-white" /> : <Activity className="w-4 h-4 text-slate-400" />}
                                </div>
                                <div className="flex-1 overflow-hidden text-left">
                                    <p className="text-xs font-bold text-slate-700 truncate leading-none mb-1">{log.message}</p>
                                    {log.tx_hash && <p className="text-[8px] font-mono text-slate-400 truncate">{log.tx_hash}</p>}
                                </div>
                                {log.tx_hash && (
                                    <a href={log.explorer_link} target="_blank" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-500 transition-all">
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex flex-col gap-6 text-left">
                <div className="pearl-glass rounded-[32px] p-8 flex-1 relative overflow-hidden bg-gradient-to-br from-white to-sky-50">
                     <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-6 italic">Agent Wallet</h2>
                     <div className="flex items-baseline gap-2 mb-2">
                         <span className="text-5xl font-black text-slate-900 italic tracking-tighter">0.892</span>
                         <span className="text-sm font-bold text-slate-300">USDC</span>
                     </div>
                     <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest tracking-tighter">+0.05 Earning Projected</p>
                     
                     <div className="mt-8 flex gap-1 h-3/4 opacity-10 blur-[1px]">
                         {[40, 70, 45, 90, 65, 80, 50, 85].map((v, i) => (
                             <div key={i} className="flex-1 bg-sky-500 rounded-t-lg self-end" style={{ height: `${v}%` }} />
                         ))}
                     </div>
                </div>
                
                <div className="pearl-glass rounded-[32px] p-6 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-[10px] uppercase font-black text-slate-900 tracking-widest">Network Secure</span>
                     </div>
                     <span className="text-[8px] font-mono text-slate-300">TESTNET-NODE-04</span>
                </div>
            </div>
        </div>
      </div>

      {/* Narrative Bottom (Black Text) */}
      <footer className="mt-24 text-center pb-8 border-t border-slate-100 pt-12">
           <div className="flex items-center justify-center gap-10 opacity-100 filter transition-all cursor-default">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Built on Stellar</span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">USDC Asset</span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Soroban Runtime</span>
           </div>
           <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.8em] mt-6 italic">© 2026 AgentMesh Economic OS</p>
      </footer>
    </div>
  );
}
