"use client";

import React, { useState } from "react";
import { FraudCase, FraudTypology } from "@/types";
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, ShieldCheck, Flame } from "lucide-react";

interface CaseQueueProps {
  cases: FraudCase[];
  selectedCaseId: string;
  onSelectCase: (caseItem: FraudCase) => void;
}

export const CaseQueue: React.FC<CaseQueueProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypology, setSelectedTypology] = useState<string>("ALL");

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.transaction.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.transaction.merchant.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTypology =
      selectedTypology === "ALL" || c.assessment.predictedTypology === selectedTypology;

    return matchesSearch && matchesTypology;
  });

  const typologies: { label: string; value: string }[] = [
    { label: "All (20)", value: "ALL" },
    { label: "ATO", value: "Account Takeover (ATO)" },
    { label: "Synthetic", value: "Synthetic Identity Ring" },
    { label: "Card Burst", value: "Card Bust-Out & Stolen Card Velocity" },
    { label: "Mule / Layering", value: "Money Mule Network & Layering" },
    { label: "Triangulation", value: "Merchant Collusion & Triangulation" },
    { label: "Cleared / Safe", value: "Legitimate / Cleared False Positive" },
  ];

  const getStatusBadge = (status: FraudCase["status"], typology: FraudTypology) => {
    if (status === "RESOLVED" || typology === "Legitimate / Cleared False Positive") {
      return (
        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3 h-3" />
          <span>Cleared / Safe</span>
        </span>
      );
    }
    if (status === "ACTION_RECOMMENDED") {
      return (
        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <AlertTriangle className="w-3 h-3" />
          <span>Action Ready</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3" />
        <span>In Review</span>
      </span>
    );
  };

  return (
    <aside className="w-full lg:w-96 flex flex-col bg-slate-950/80 border-r border-slate-800/80 h-full overflow-hidden">
      {/* Top Search & Filter Bar */}
      <div className="p-3.5 border-b border-slate-800/80 space-y-2.5 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Benchmark Case Queue</span>
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-800 text-orange-400 rounded-md border border-slate-700">
            {filteredCases.length} of {cases.length}
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search cases, customers, TXN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Typology Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {typologies.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedTypology(t.value)}
              className={`whitespace-nowrap px-2 py-1 rounded-md transition-all font-medium ${
                selectedTypology === t.value
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case List Scrollable Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1.5">
        {filteredCases.map((c) => {
          const isSelected = c.id === selectedCaseId;
          const isSafe = c.assessment.predictedTypology === "Legitimate / Cleared False Positive";

          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
                isSelected
                  ? "bg-slate-900/90 border-orange-500/70 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/30"
                  : "bg-slate-900/30 hover:bg-slate-900/60 border-slate-800/60 hover:border-slate-700/80"
              }`}
            >
              {/* Header row: ID, Case Number, and Status */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? "bg-orange-500/20 text-orange-400 border border-orange-500/40" : "bg-slate-800 text-slate-400"
                  }`}>
                    #{c.caseNumber.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {c.id}
                  </span>
                </div>
                {getStatusBadge(c.status, c.assessment.predictedTypology)}
              </div>

              {/* Title & Customer */}
              <h4 className="text-xs font-medium text-slate-200 line-clamp-1 mb-1">
                {c.title}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="truncate max-w-[160px] text-slate-300">
                  {c.transaction.customer.name}
                </span>
                <span className="font-mono font-bold text-white">
                  Rs. {Math.round(c.transaction.amountUSD).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Metadata Badges: Typology, Initial Model Score, Uncertainty */}
              <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/40">
                <span className={`px-1.5 py-0.5 rounded font-medium ${
                  isSafe ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40" : "bg-slate-800 text-slate-300"
                }`}>
                  {c.assessment.predictedTypology.replace(" (ATO)", "").replace(" & Stolen Card Velocity", "")}
                </span>

                <div className="flex items-center space-x-2 font-mono">
                  <span title="Initial Bank Model Risk Score" className={`font-semibold ${
                    c.assessment.initialRiskScore >= 0.85 ? "text-rose-400" : c.assessment.initialRiskScore >= 0.70 ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    Risk: {(c.assessment.initialRiskScore * 100).toFixed(0)}%
                  </span>
                  <span className="text-slate-600">|</span>
                  <span title="Signal Uncertainty" className="text-cyan-400">
                    Uncert: {c.assessment.initialUncertainty}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCases.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500">
            No benchmark cases match your search filter.
          </div>
        )}
      </div>
    </aside>
  );
};
