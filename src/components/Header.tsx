"use client";

import React from "react";
import { ShieldAlert, Cpu, Database, FileText, Download, Terminal, Network } from "lucide-react";
import { FraudCase } from "@/types";

interface HeaderProps {
  cases: FraudCase[];
  selectedCase: FraudCase;
  onOpenSettings: () => void;
  onOpenGsqlStudio: () => void;
  onOpenMemoryBank: () => void;
  onOpenExporter: () => void;
  onOpenDocs: () => void;
  isConnectedLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  selectedCase,
  onOpenSettings,
  onOpenGsqlStudio,
  onOpenMemoryBank,
  onOpenExporter,
  onOpenDocs,
  isConnectedLive,
}) => {
  const totalAmountAtRisk = cases.reduce((acc, c) => acc + c.transaction.amountUSD, 0);
  const investigatedCount = cases.filter((c) => c.status === "ACTION_RECOMMENDED" || c.status === "RESOLVED").length;

  return (
    <header className="bg-slate-950/90 border-b border-slate-800/80 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo & Hackathon Details */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 via-tiger-500 to-amber-600 shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/40">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>TigerGraph</span>
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Agentic Fraud Sentinel</span>
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full">
                Team ByteMe
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 rounded-full hidden sm:inline-block">
                HHGOA 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Next-Best Action & Uncertainty Reasoning Engine</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono">IEEE-CIS / Vesta Benchmark (20 Cases)</span>
            </p>
          </div>
        </div>

        {/* Global Metrics & Fast Toolbars */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* TigerGraph Status Pill */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isConnectedLive
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-orange-500/50 hover:text-orange-400"
            }`}
            title="Configure TigerGraph Savanna / CE endpoint"
          >
            <Database className="w-3.5 h-3.5 text-orange-400" />
            <span className="flex items-center gap-1.5">
              <span>TigerGraph:</span>
              <span className="font-semibold text-white">Savanna</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            </span>
          </button>

          {/* GSQL Studio Button */}
          <button
            onClick={onOpenGsqlStudio}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all hover:text-white hover:border-slate-600"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>GSQL Studio</span>
          </button>

          {/* Case Memory Bank */}
          <button
            onClick={onOpenMemoryBank}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all hover:text-white hover:border-slate-600"
          >
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span>Graph Memory (M1-M4)</span>
          </button>

          {/* Documentation / Architecture */}
          <button
            onClick={onOpenDocs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all hover:text-white hover:border-slate-600"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Architecture & Pitch</span>
          </button>

          {/* 20 Benchmark Case Official Export */}
          <button
            onClick={onOpenExporter}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold shadow-md shadow-orange-600/30 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 20 Cases (Submission)</span>
          </button>
        </div>
      </div>

      {/* Mini metric ticker bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <span className="text-slate-500">Benchmark Pool:</span>
            <span className="font-mono font-bold text-white">20 Cases Evaluated</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-500">Decisions Finalized:</span>
            <span className="font-mono font-bold text-emerald-400">{investigatedCount} / 20</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-500">Total Capital Monitored:</span>
            <span className="font-mono font-bold text-amber-300">Rs. {totalAmountAtRisk.toLocaleString("en-IN")}</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
          <span className="text-slate-500">Active Benchmark Case:</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-orange-300 font-semibold">
            {selectedCase.id} ({selectedCase.title.slice(0, 36)}...)
          </span>
        </div>
      </div>
    </header>
  );
};
