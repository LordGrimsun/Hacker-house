"use client";

import React from "react";
import { X, Network, Database, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { HISTORICAL_CASE_MEMORY } from "@/data/historicalMemory";

interface CaseMemoryViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseMemoryView: React.FC<CaseMemoryViewProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Episodic Graph Memory Bank (Months 1–4)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  TigerGraph Vector Store
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Grounding GraphRAG investigations with closed historical precedents & analyst outcomes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Historical Cases */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-purple-200 flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              When a new transaction is flagged, the agent queries TigerGraph's case memory using graph topology embeddings (cosine similarity) to surface identical modus operandi from past resolved investigations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {HISTORICAL_CASE_MEMORY.map((mem) => {
              const isFraud = mem.verdict === "CONFIRMED_FRAUD";

              return (
                <div
                  key={mem.caseId}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-purple-400">{mem.caseId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {mem.month}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isFraud
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}>
                        {mem.verdict}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs mb-1">{mem.typology}</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed mb-2">{mem.summary}</p>

                    {/* Key Graph Patterns */}
                    <div className="space-y-1 mb-2 pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Key Graph Signatures:</span>
                      <ul className="list-disc list-inside text-[10px] text-slate-400 space-y-0.5">
                        {mem.keyGraphPatterns.map((pat, i) => (
                          <li key={i} className="truncate">{pat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800/40">
                    <span className="font-semibold text-emerald-400">Resolution Applied: </span>
                    <span>{mem.actionTaken}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Episodic Memory Bank synchronized with TigerGraph Savanna</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Bank
          </button>
        </div>
      </div>
    </div>
  );
};
