"use client";

import React, { useState } from "react";
import { SuspiciousActivityReport } from "@/types";
import { X, Copy, Check, FileText, ShieldAlert, Download, Scale } from "lucide-react";

interface SARReportViewProps {
  sarReport?: SuspiciousActivityReport;
  isOpen: boolean;
  onClose: () => void;
}

export const SARReportView: React.FC<SARReportViewProps> = ({
  sarReport,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !sarReport) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(sarReport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sarReport, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${sarReport.sarId}_FinCEN_Filing.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  FinCEN Suspicious Activity Report (SAR)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
                  {sarReport.sarId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generated per 31 CFR 1020.320 & USA PATRIOT Act Section 314(b)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Copy SAR JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Download SAR JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300">
          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Filing Date:</span>
              <p className="font-mono font-bold text-white mt-0.5">{sarReport.filingDate}</p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Amount at Risk:</span>
              <p className="font-mono font-bold text-rose-400 mt-0.5">
                ${sarReport.totalAmountAtRiskUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Primary Typology:</span>
              <p className="font-bold text-orange-400 mt-0.5">{sarReport.primaryTypology}</p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Filing Institution:</span>
              <p className="font-semibold text-slate-200 mt-0.5">{sarReport.financialInstitution}</p>
            </div>
          </div>

          {/* Suspect Identifiers */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Suspect Subject(s) & Identifiers:</span>
            <p className="font-mono text-cyan-300 font-semibold">{sarReport.suspectName}</p>
            <p className="font-mono text-[11px] text-slate-400">{sarReport.suspectIdentifier}</p>
          </div>

          {/* Narrative */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
              Official FinCEN Narrative (Section V):
            </span>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 leading-relaxed font-sans text-slate-200 text-xs">
              {sarReport.summaryNarrative}
            </div>
          </div>

          {/* TigerGraph Nexus */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
              TigerGraph Multi-Hop Forensic Nexus:
            </span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-orange-300">
              {sarReport.graphNexusDetails}
            </div>
          </div>

          {/* Chronology of Events */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
              Chronology of Suspicious Events:
            </span>
            <div className="space-y-1">
              {sarReport.chronologyOfEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center space-x-2 font-mono text-[11px] text-slate-300 bg-slate-900/40 p-2 rounded border border-slate-800/40">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-orange-400 font-bold">
                    {idx + 1}
                  </span>
                  <span>{evt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Law Enforcement Actions */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Recommended Compliance Directives:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              {sarReport.recommendedActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Prepared by: {sarReport.preparedBy}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
