"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Zap,
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import { FraudCase } from "@/types";

interface DashboardHeaderProps {
  cases: FraudCase[];
  currentCase: FraudCase;
  onSelectCase: (c: FraudCase) => void;
  onOpenMobile: () => void;
  onOpenBatchRunner: () => void;
  onOpenDocs: () => void;
  activeTabName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  cases,
  currentCase,
  onSelectCase,
  onOpenMobile,
  onOpenBatchRunner,
  onOpenDocs,
  activeTabName,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredCases = searchQuery.trim()
    ? cases.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.transaction.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.assessment.predictedTypology.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 bg-[#060911]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger menu toggle + View Breadcrumb */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobile}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {activeTabName}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                TigerGraph Savanna Engine Active
              </span>
            </div>
          </div>
        </div>

        {/* Center: Omni-Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search 20 benchmark cases, accounts, IPs, typologies..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && filteredCases.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto space-y-1">
              <div className="text-[10px] font-mono text-slate-500 px-2 py-1 uppercase">
                Matching Benchmark Cases ({filteredCases.length})
              </div>
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCase(c);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2 rounded-lg hover:bg-slate-900 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-orange-400">{c.id}</span>
                      <span className="font-semibold text-slate-200 truncate">{c.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Rs. {c.transaction.amountUSD.toLocaleString("en-IN")} • {c.assessment.predictedTypology}
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono shrink-0">Open &rarr;</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Active Case Badge */}
          <div
            onClick={() => onSelectCase(currentCase)}
            className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-orange-500/40 transition-colors"
            title="Click to jump into Investigation Studio for this case"
          >
            <span className="text-[10px] text-slate-500 font-mono uppercase">Case:</span>
            <span className="text-xs font-mono font-bold text-orange-400">{currentCase.id}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {(currentCase.assessment.initialRiskScore * 100).toFixed(0)}% Risk
            </span>
          </div>

          {/* Run All 20 Cases Benchmark Button */}
          <button
            onClick={onOpenBatchRunner}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            title="Open 20-Case Automated Benchmark Suite"
          >
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline">Benchmark Suite</span>
          </button>

          {/* Architecture Docs Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-xs font-semibold text-orange-300 transition-colors"
            title="TigerGraph Agentic Architecture Specification"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline">Docs &amp; Architecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
