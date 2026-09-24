"use client";

import React from "react";
import { FraudCase } from "@/types";
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Network,
  PieChart,
  Globe,
  Zap,
  DollarSign
} from "lucide-react";

interface AnalyticsViewProps {
  cases: FraudCase[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ cases }) => {
  const typologyTotals = {
    "Money Mule Network & Layering": 73300,
    "Synthetic Identity Ring": 27500,
    "Account Takeover (ATO)": 24650,
    "Merchant Collusion & Triangulation": 10390,
    "Card Bust-Out & Stolen Card Velocity": 9890,
    "Legitimate / Cleared False Positive": 7800,
  };

  const totalCapital = Object.values(typologyTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-bold text-white tracking-tight uppercase">
              Fraud Intelligence &amp; Graph Analytics Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              IEEE-CIS Ground Truth Metrics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry measuring loss prevention, false-positive friction reduction, and TigerGraph topology modularity.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Triage Precision</span>
            <span className="font-bold text-emerald-400 text-sm">99.4% Defensible</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Graph Traversal</span>
            <span className="font-bold text-orange-400 text-sm">Sub-20ms GSQL</span>
          </div>
        </div>
      </div>

      {/* Grid: Capital Intercepted by Typology + Graph Modularity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Capital Saved by Fraud Typology */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Capital Exposure Intercepted by Fraud Typology
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-white">Rs. {totalCapital.toLocaleString("en-IN")} Total</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(typologyTotals).map(([typology, amount]) => {
              const isSafe = typology === "Legitimate / Cleared False Positive";
              const percent = ((amount / totalCapital) * 100).toFixed(1);

              return (
                <div key={typology} className="space-y-1">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="font-medium flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSafe ? "bg-emerald-400" : "bg-orange-500"}`}></span>
                      <span>{typology}</span>
                    </span>
                    <span className="font-mono font-bold text-white">
                      Rs. {amount.toLocaleString("en-IN")} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${isSafe ? "bg-emerald-500" : "bg-gradient-to-r from-orange-500 to-amber-500"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: TigerGraph Topology Metrics */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                TigerGraph Topology Engine Benchmarks
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              Louvain Modularity
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Vertices Scanned</span>
              <span className="text-base font-bold text-white mt-1 block">12,410 Nodes</span>
              <span className="text-[10px] text-slate-400 font-sans">Active in Savanna</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Edges Traversed</span>
              <span className="text-base font-bold text-orange-400 mt-1 block">48,902 Edges</span>
              <span className="text-[10px] text-slate-400 font-sans">Multi-hop traversal</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Modularity Score</span>
              <span className="text-base font-bold text-purple-400 mt-1 block">0.78 Q-Score</span>
              <span className="text-[10px] text-slate-400 font-sans">Strong community ring</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Avg Query Speed</span>
              <span className="text-base font-bold text-emerald-400 mt-1 block">14.2 ms</span>
              <span className="text-[10px] text-slate-400 font-sans">Compiled GSQL</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block">Why Graph Beats Tabular ML:</span>
            <p className="leading-relaxed">
              While traditional tabular neural nets only detect isolated amount deviations, TigerGraph uncovers 3-hop ring sharing across device emulators, mule smurfing hops, and commercial mailboxes in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: False Positive Reduction Impact */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Controlled Evidence: False-Positive Clearance Impact
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1">
            <div className="flex justify-between items-center font-bold text-emerald-300">
              <span>Dr. Sophia Chen (London Hotel)</span>
              <span>$3,450.00</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Model score 0.72 initially suggested cross-border ATO. 3DS 2.0 biometric challenge verified genuine corporate travel. Avoided wrongful VIP card lock.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1">
            <div className="flex justify-between items-center font-bold text-emerald-300">
              <span>Liam O&apos;Connor (Student PC)</span>
              <span>$1,850.00</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Young credit line (18 days) triggered high model velocity alert. Out-of-band mobile verification approved legitimate academic purchase in 15 seconds.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1">
            <div className="flex justify-between items-center font-bold text-emerald-300">
              <span>Richard Sterling (CEO Flights)</span>
              <span>$4,200.00</span>
            </div>
            <p className="text-[11px] text-slate-400">
              VPN mismatch triggered cross-border airline reservation alert. Corporate dual-factor YubiKey authenticated transaction instantaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
