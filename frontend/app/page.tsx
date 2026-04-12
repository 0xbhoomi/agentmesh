"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, DollarSign, Cpu, Globe, Search, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-500/30 overflow-hidden relative bg-[#F0F9FF]">
      {/* Background radial glows over soft blue body */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-400/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-200/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Navigation */}
      <nav className="p-8 flex items-center justify-between relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Zap className="w-4 h-4 text-white fill-current" />
           </div>
           <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Agent<span className="text-sky-500">Mesh</span></span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-slate-600">
            <a href="#vision" className="hover:text-sky-600 transition-colors">The Vision</a>
            <a href="#tech" className="hover:text-sky-600 transition-colors">Stellar Tech</a>
            <Link href="/dashboard" className="text-sky-600 hover:text-sky-500 font-black">Live Dashboard</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-sky-100 text-sky-600 text-[10px] font-black uppercase tracking-widest mb-10 shadow-sm shadow-sky-500/5">
            <Globe className="w-3 h-3" />
            Empowering the Agent Economy
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.85] uppercase italic text-slate-900">
            Agents That <br />
            <span className="text-sky-500">Transact.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-16 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
            Stop building bots that just talk. Building agents that <span className="text-slate-900 font-black underline decoration-sky-500 underline-offset-8">discover, pay, and earn</span> autonomously on Stellar.
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
             <Link href="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-12 py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl italic shadow-2xl shadow-slate-900/20 flex items-center gap-4 transition-all uppercase tracking-tighter"
                >
                  Launch Dashboard <ArrowRight className="w-6 h-6 text-sky-500" />
                </motion.button>
             </Link>
             <a href="https://github.com/0xbhoomi/agentmesh" target="_blank" className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity text-slate-900">
                Verifiable Economics on GitHub
             </a>
          </div>
        </motion.div>

        {/* Feature Grid (Pearl Glass Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full">
            {[
                { title: "Autonomous Payments", desc: "Real x402 and MPP settlement for fractions of a cent.", icon: DollarSign },
                { title: "Economic Discovery", desc: "Bazaar Registry on Soroban for agent service lookup.", icon: Search },
                { title: "Revenue Capture", desc: "Agents that list their work and earn real USDC assets.", icon: TrendingUp }
            ].map((f, i) => (
                <motion.div 
                    key={f.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="p-10 rounded-[40px] pearl-glass text-left group hover:-translate-y-2 transition-all relative overflow-hidden border border-white shadow-xl shadow-sky-500/5 group"
                >
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-8 group-hover:bg-sky-500 transition-all duration-500">
                        <f.icon className="w-6 h-6 text-sky-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-black uppercase mb-3 italic tracking-tight text-slate-900">{f.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
            ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-16 text-center mt-20 relative z-10 w-full border-t border-slate-100">
         <div className="flex items-center justify-center gap-10 grayscale opacity-20 mb-8 font-black uppercase text-[10px] tracking-[0.4em] text-slate-900">
              <span>Stellar Runtime</span>
              <span>USDC Economy</span>
          </div>
          <p className="text-[8px] opacity-10 uppercase font-black tracking-[1em] text-slate-900">© 2026 AgentMesh Economic OS</p>
      </footer>
    </div>
  );
}
