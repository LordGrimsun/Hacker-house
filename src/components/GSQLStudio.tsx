"use client";

import React, { useState } from "react";
import { X, Play, Terminal, Database, Code, CheckCircle2, Copy, Check } from "lucide-react";
import { GSQL_SCHEMA_DEFINITION, PRE_INSTALLED_GSQL_QUERIES, executeTigerGraphQuery, DEFAULT_TIGERGRAPH_CONFIG } from "@/lib/tigergraph";

interface GSQLStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GSQLStudio: React.FC<GSQLStudioProps> = ({ isOpen, onClose }) => {
  const [selectedQuery, setSelectedQuery] = useState(PRE_INSTALLED_GSQL_QUERIES[0]);
  const [queryCode, setQueryCode] = useState(selectedQuery.code);
  const [activeTab, setActiveTab] = useState<"QUERY_RUNNER" | "SCHEMA" | "MCP_SPECS">("QUERY_RUNNER");
  const [isRunning, setIsRunning] = useState(false);
  const [queryOutput, setQueryOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectQuery = (q: typeof PRE_INSTALLED_GSQL_QUERIES[0]) => {
    setSelectedQuery(q);
    setQueryCode(q.code);
    setQueryOutput(null);
  };

  const handleRunQuery = async () => {
    setIsRunning(true);
    const res = await executeTigerGraphQuery(selectedQuery.name, { target: "SAMPLE_SEED_01" }, DEFAULT_TIGERGRAPH_CONFIG);
    setQueryOutput(res);
    setIsRunning(false);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(GSQL_SCHEMA_DEFINITION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>TigerGraph GSQL Studio & Schema Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Savanna GSQL v3.9+
                </span>
              </h3>
              <p className="text-xs text-slate-400">Interactive GSQL Query Console & Knowledge Graph Schema</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab("QUERY_RUNNER")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "QUERY_RUNNER" ? "bg-orange-500 text-white font-medium shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                GSQL Runner
              </button>
              <button
                onClick={() => setActiveTab("SCHEMA")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "SCHEMA" ? "bg-orange-500 text-white font-medium shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                Graph Schema
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {activeTab === "QUERY_RUNNER" ? (
            <>
              {/* Left sidebar: query presets */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-y-auto space-y-1.5 bg-slate-900/40">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2 px-1">
                  Pre-Installed GSQL Queries
                </span>
                {PRE_INSTALLED_GSQL_QUERIES.map((q) => (
                  <button
                    key={q.name}
                    onClick={() => handleSelectQuery(q)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      selectedQuery.name === q.name
                        ? "bg-orange-500/20 border-orange-500/60 text-white font-semibold shadow-sm"
                        : "bg-slate-900/50 hover:bg-slate-900 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="font-mono text-orange-400 font-bold text-[11px] truncate">{q.name}</div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{q.description}</p>
                  </button>
                ))}
              </div>

              {/* Right area: code editor and execution output */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3 bg-[#080d19]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedQuery.name}.gsql</span>
                  </span>

                  <button
                    onClick={handleRunQuery}
                    disabled={isRunning}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isRunning ? "Executing in Savanna..." : "Run GSQL Query"}</span>
                  </button>
                </div>

                <textarea
                  value={queryCode}
                  onChange={(e) => setQueryCode(e.target.value)}
                  rows={10}
                  className="w-full p-3 bg-black/80 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed"
                />

                {queryOutput && (
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>TigerGraph Savanna Response (200 OK)</span>
                      </span>
                      <span className="text-slate-400">Latency: {queryOutput.executionTimeMs} ms</span>
                    </div>
                    <pre className="p-2.5 bg-black/60 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800/80">
                      {JSON.stringify(queryOutput.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Schema Tab */
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-orange-400" />
                  <span>FraudInvestigationGraph Schema Definition (GSQL DDL)</span>
                </span>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy DDL"}</span>
                </button>
              </div>

              <pre className="p-4 bg-black/80 rounded-xl text-cyan-300 border border-slate-800 leading-relaxed overflow-x-auto">
                {GSQL_SCHEMA_DEFINITION}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
