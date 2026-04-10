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
  ArrowRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for initial state
const INITIAL_STATS = [
  { label: "Total Economic Volume", value: "1.248 USDC", icon: TrendingUp, color: "text-green-400" },
  { label: "Active Agent Sessions", value: "42", icon: Zap, color: "text-yellow-400" },
  { label: "Providers in Bazaar", value: "12", icon: Cpu, color: "text-blue-400" },
  { label: "System Trust Score", value: "99.2%", icon: ShieldCheck, color: "text-purple-400" },
];

const MOCK_PROVIDERS = [
  { id: 1, name: "Search-A", category: "Search", price: "0.005", trust: 95, type: "MPP", status: "Active" },
  { id: 2, name: "Search-B", category: "Search", price: "0.020", trust: 99, type: "x402", status: "Active" },
  { id: 3, name: "Market-Insights", category: "Data", price: "0.150", trust: 92, type: "x402", status: "Active" },
];

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState(INITIAL_STATS);

  useEffect(() => {
    // Simulated live feed
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addLog({
          id: Date.now(),
          agent: "SubAgent-" + Math.floor(Math.random() * 10),
          action: "paid",
          amount: (Math.random() * 0.01).toFixed(3),
          provider: "Search-" + (Math.random() > 0.5 ? "A" : "B")
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (log: any) => {
    setLogs(prev => [log, ...prev].slice(0, 10));
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    addLog({ id: Date.now(), type: "system", message: "🚀 Initiating Agent 'Ada' Research Workflow..." });
    
    // Simulate step 1
    await new Promise(r => setTimeout(r, 1500));
    addLog({ id: Date.now(), type: "action", message: "Ada: Identifying best search provider for 'Stellar MPP optimization'..." });
    
    // Simulate intelligence
    await new Promise(r => setTimeout(r, 2000));
    addLog({ id: Date.now(), type: "intel", message: "Intelligence Layer: Switched to Search-A (MPP) - Projected savings: 35%" });
    
    // Simulate payment
    await new Promise(r => setTimeout(r, 1500));
    addLog({ id: Date.now(), agent: "Ada", action: "paid", amount: "0.005", provider: "Search-A", type: "MPP" });
    
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-12 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Agent<span className="text-gradient">Mesh</span> Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">The live economic heart of the Stellar agent economy.</p>
        </div>
        <button 
          onClick={handleSimulate}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
            isSimulating 
            ? "bg-muted cursor-not-allowed opacity-50" 
            : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95"
          }`}
        >
          {isSimulating ? <RefreshCcw className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5 fill-current" />}
          {isSimulating ? "Simulating Ada..." : "Simulate Agent Ada"}
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass-card p-6 rounded-2xl"
          >
            <div className={`p-2 w-fit rounded-lg bg-white/5 mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Feed */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-card rounded-2xl p-8 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-sm opacity-70">Economic Nervous System</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full uppercase tracking-tighter">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Network
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-4 scrollbar-hide">
              <AnimatePresence initial={false}>
                {logs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <Search className="w-12 h-12 mb-4" />
                    <p>Waiting for agent activity...</p>
                  </div>
                )}
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl border ${
                      log.type === 'intel' ? 'bg-indigo-900/10 border-indigo-500/20' : 
                      log.type === 'system' ? 'bg-white/5 border-white/10' :
                      'bg-white/5 border-transparent'
                    }`}
                  >
                    {log.type === 'intel' ? (
                      <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-200 text-sm italic">{log.message}</span>
                      </div>
                    ) : log.type === 'system' ? (
                      <span className="text-muted-foreground text-sm font-mono">{log.message}</span>
                    ) : log.agent ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold">
                            {log.agent[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              <span className="text-indigo-400 font-bold">{log.agent}</span> paid <span className="font-bold text-green-400">{log.amount} USDC</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Type: {log.type || 'x402'} • Provider: {log.provider}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-30" />
                      </div>
                    ) : (
                      <p className="text-sm">{log.message}</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-lg font-bold mb-6">Autonomous Spending Trends</h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { time: '10:00', value: 0.1 },
                  { time: '10:10', value: 0.4 },
                  { time: '10:20', value: 0.2 },
                  { time: '10:30', value: 0.8 },
                  { time: '10:40', value: 0.6 },
                  { time: '10:50', value: 1.2 },
                ]}>
                  <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={3} dot={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Bazaar & Wallets */}
        <div className="flex flex-col gap-8">
          {/* Bazaar Marketplace */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Bazaar Registry
            </h2>
            <div className="space-y-4">
              {MOCK_PROVIDERS.map((provider) => (
                <div key={provider.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm tracking-wide">{provider.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase">{provider.category}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      provider.type === 'x402' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {provider.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-mono text-green-400">{provider.price} USDC</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      {provider.trust}% Trust
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Management */}
          <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-400" />
              Agent Wallets
            </h2>
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-white/10 bg-black/40">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Ada (Researcher)</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">0.842</span>
                  <span className="text-xs text-muted-foreground mb-1.5">USDC</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground">Policy: Daily Cap 5 USDC</span>
                  <span className="text-indigo-400">Yield: Active</span>
                </div>
              </div>

               <div className="p-4 rounded-xl border border-white/10 opacity-50">
                <p className="text-xs text-muted-foreground mb-1">SubAgent-7</p>
                <div className="flex items-end gap-2">
                  <span className="text-lg font-bold">12.00</span>
                  <span className="text-[10px] text-muted-foreground mb-1">USDC</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors">
              Deploy New Agent Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
