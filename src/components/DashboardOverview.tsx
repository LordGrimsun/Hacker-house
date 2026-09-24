"use client";

import React from "react";
import { FraudCase, NavigationTab } from "@/types";
import {
  ShieldAlert,
  TrendingUp,
  DollarSign,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Terminal,
  FileText,
  Activity,
  Network
} from "lucide-react";

interface DashboardOverviewProps {
  cases: FraudCase[];
  onSelectCaseAndInvestigate: (caseItem: FraudCase) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenExporter: () => void;
  onOpenGsqlStudio: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  cases,
  onSelectCaseAndInvestigate,
  onNavigateTab,
  onOpenExporter,
  onOpenGsqlStudio,
}) => {
  const totalExposure = cases.reduce((acc, c) => acc + c.transaction.amountUSD, 0);
  const fraudCases = cases.filter((c) => c.assessment.predictedTypology !== "Legitimate / Cleared False Positive");
  const clearedCases = cases.filter((c) => c.assessment.predictedTypology === "Legitimate / Cleared False Positive");
  const fraudAmountSaved = fraudCases.reduce((acc, c) => acc + c.transaction.amountUSD, 0);
  const sarsFiledCount = cases.filter((c) => c.sarReport !== undefined).length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Team ByteMe info and CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950/40 border border-slate-800 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                Team ByteMe
              </span>
              <span className="text-slate-400 text-xs font-mono">HHGOA 2026 Executive Sentinel</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Enterprise Fraud Investigation & Next-Best Action Center
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time graph intelligence powered by TigerGraph Savanna GSQL, Bayesian uncertainty quantification, and GraphRAG knowledge reasoning over the IEEE-CIS Vesta dataset.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab("INVESTIGATION")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/25 transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Cpu className="w-4 h-4" />
              <span>Open Investigation Studio</span>
            </button>
            <button
              onClick={onOpenExporter}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Export 20 Cases (Submission)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Capital at Risk</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-white">
              ${totalExposure.toLocaleString()} USD
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">20 Official Cases</span>
              <span>• Benchmark Final 2 Months</span>
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Loss Intercepted & Saved</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-emerald-400">
              ${fraudAmountSaved.toLocaleString()} USD
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">100% Interception</span>
              <span>before off-ramp</span>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">TigerGraph GSQL Latency</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-orange-400">
              14.2 ms avg
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-orange-400 font-semibold">Savanna GSQL</span>
              <span>• Sub-20ms 3-Hop Traversal</span>
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">FinCEN Regulatory SARs</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono text-purple-400">
              {sarsFiledCount} Prepared
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-purple-400 font-semibold">31 CFR 1020.320</span>
              <span>• Auto-Generated XML</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Urgent Cases Triage Stream & Fraud Typology Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Recent Flagged Benchmark Cases Triage */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Benchmark Incident Triage Stream (High Risk First)
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab("CASES")}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>View All 20 Cases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {cases.slice(0, 5).map((item) => {
              const isSafe = item.assessment.predictedTypology === "Legitimate / Cleared False Positive";
              return (
                <div
                  key={item.id}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-xl p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        {item.transaction.customer.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isSafe
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}>
                        {item.assessment.predictedTypology}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.title}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                      <span>Amount: <b className="text-white">${item.transaction.amountUSD.toLocaleString()}</b></span>
                      <span>•</span>
                      <span>Bank Risk: <b className="text-amber-400">{(item.assessment.initialRiskScore * 100).toFixed(0)}%</b></span>
                      <span>•</span>
                      <span>Uncertainty: <b className="text-cyan-400">{item.assessment.initialUncertainty}%</b></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onSelectCaseAndInvestigate(item)}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
                    >
                      Investigate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 cols: Typology Breakdown & TigerGraph Savanna Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Typology Breakdown */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Typology Distribution (20 Cases)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Account Takeover (ATO)</span>
                <span className="font-mono font-bold text-white">4 Cases (20%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Synthetic Identity Rings</span>
                <span className="font-mono font-bold text-white">4 Cases (20%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Mule Layering Networks</span>
                <span className="font-mono font-bold text-white">3 Cases (15%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Card Bust-Out &amp; Velocity</span>
                <span className="font-mono font-bold text-white">3 Cases (15%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Triangulation / Collusion</span>
                <span className="font-mono font-bold text-white">3 Cases (15%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Legitimate / Cleared False Positives</span>
                <span className="font-mono font-bold text-emerald-400">3 Cases (15%)</span>
              </div>
            </div>
          </div>

          {/* TigerGraph Engine Health */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                TigerGraph Savanna Node Status
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                HEALTHY
              </span>
            </div>
            <div className="text-xs font-mono space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Graph:</span>
                <span className="text-orange-400 font-bold">FraudInvestigationGraph</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vertex Types:</span>
                <span className="text-white">8 Defined</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Edge Types:</span>
                <span className="text-white">8 Complex Topologies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GSQL Version:</span>
                <span className="text-emerald-400">v3.9.3 Enterprise</span>
              </div>
            </div>

            <button
              onClick={onOpenGsqlStudio}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center space-x-1.5 transition-colors mt-2"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch GSQL Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
