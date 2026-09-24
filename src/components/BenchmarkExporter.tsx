"use client";

import React, { useState } from "react";
import { FraudCase } from "@/types";
import { AgentInvestigationEngine } from "@/lib/agentEngine";
import { X, Download, Copy, Check, FileJson, CheckCircle2, ShieldCheck } from "lucide-react";

interface BenchmarkExporterProps {
  cases: FraudCase[];
  isOpen: boolean;
  onClose: () => void;
}

export const BenchmarkExporter: React.FC<BenchmarkExporterProps> = ({ cases, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const officialOutput = AgentInvestigationEngine.generateOfficialSubmissionJson(cases);
  const jsonString = JSON.stringify(officialOutput, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ByteMe_TigerGraph_HHGOA_20_Benchmark_Cases_Evaluation.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Official Hackathon 20-Case Benchmark Submission Package</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready for Submission
                </span>
              </h3>
              <p className="text-xs text-slate-400">Team: ByteMe • Format compliant with HHGOA Evaluation Specifications</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied JSON" : "Copy All JSON"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md shadow-orange-600/30 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON File</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overview Banner */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> 20 of 20 Cases Fully Synthesized
            </span>
            <span>•</span>
            <span>Contains Before & After Next Best Actions</span>
            <span>•</span>
            <span>Includes Regulatory SARs & Graph Subnetworks</span>
          </div>
          <span className="font-mono text-slate-500">File size: ~{(jsonString.length / 1024).toFixed(1)} KB</span>
        </div>

        {/* JSON Preview Window */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#080d19]">
          <pre className="text-[11px] font-mono text-cyan-300 p-4 bg-black/80 rounded-xl border border-slate-800/80 leading-relaxed overflow-x-auto">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Submission Form link: forms.gle/yxXzqSULGgZ9VUF56</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
