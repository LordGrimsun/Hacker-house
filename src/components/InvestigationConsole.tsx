"use client";

import React, { useState } from "react";
import { FraudCase, InvestigationStep } from "@/types";
import { Cpu, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, Scale, FileText, ChevronRight } from "lucide-react";
import { BANK_FRAUD_POLICIES } from "@/data/fraudPolicies";

interface InvestigationConsoleProps {
  currentCase: FraudCase;
  onOpenSAR: () => void;
}

export const InvestigationConsole: React.FC<InvestigationConsoleProps> = ({
  currentCase,
  onOpenSAR,
}) => {
  const [activeTab, setActiveTab] = useState<"STEPS" | "VESTA_SIGNALS" | "POLICIES">("STEPS");

  // Determine uncertainty status
  const uncertainty = currentCase.assessment.finalUncertainty;
  const isSafe = currentCase.assessment.predictedTypology === "Legitimate / Cleared False Positive";

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Banner: Status, Typology, Uncertainty Gauge */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Agent Investigation
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold">
                {currentCase.assessment.predictedTypology}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Transaction ID: <span className="font-mono text-slate-200">{currentCase.transaction.transactionId}</span> • Amount:{" "}
              <span className="font-mono font-bold text-emerald-400">Rs. {currentCase.transaction.amountUSD.toLocaleString("en-IN")}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Uncertainty Meter */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Signal Uncertainty</span>
            <span className={`text-xs font-mono font-bold ${
              uncertainty <= 10 ? "text-emerald-400" : uncertainty <= 40 ? "text-amber-400" : "text-rose-400"
            }`}>
              {uncertainty}% ({uncertainty <= 10 ? "Defensible" : "Ambiguous"})
            </span>
          </div>

          <div className="w-20 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                uncertainty <= 10 ? "bg-emerald-500" : uncertainty <= 40 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${uncertainty}%` }}
            />
          </div>

          {currentCase.sarReport && (
            <button
              onClick={onOpenSAR}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold hover:bg-rose-500/30 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View SAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-slate-800/80 bg-slate-900/30 flex space-x-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab("STEPS")}
          className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "STEPS" ? "border-orange-500 text-orange-400 font-bold" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Agent Execution Trace ({currentCase.steps.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("VESTA_SIGNALS")}
          className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "VESTA_SIGNALS" ? "border-orange-500 text-orange-400 font-bold" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>IEEE-CIS / Vesta Signals</span>
        </button>
        <button
          onClick={() => setActiveTab("POLICIES")}
          className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "POLICIES" ? "border-orange-500 text-orange-400 font-bold" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bank Policy Compliance</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "STEPS" && (
          <div className="space-y-3">
            {currentCase.steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 shadow-md hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold border border-orange-500/40">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{step.title}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {step.stage}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{step.description}</p>

                {/* Agent reasoning block */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-orange-300/90 flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block mb-0.5">
                      LLM Reasoning & GraphRAG Synthesis:
                    </span>
                    <p className="leading-relaxed">{step.agentReasoning}</p>
                  </div>
                </div>

                {/* Evidence found chips */}
                {step.evidenceFound && step.evidenceFound.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold">Evidence Isolated:</span>
                    {step.evidenceFound.map((ev, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-800/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40"
                      >
                        ✓ {ev}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "VESTA_SIGNALS" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Product Code:</span>
                <p className="font-mono font-bold text-white text-base mt-0.5">
                  {currentCase.transaction.productCd}
                </p>
                <span className="text-[10px] text-slate-500">IEEE-CIS ProductCD</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Card Category:</span>
                <p className="font-mono font-bold text-orange-400 text-base mt-0.5">
                  {currentCase.transaction.card.card4.toUpperCase()} ({currentCase.transaction.card.card6})
                </p>
                <span className="text-[10px] text-slate-500">BIN: {currentCase.transaction.card.card1}</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Velocity C1-C14:</span>
                <p className="font-mono font-bold text-cyan-400 text-base mt-0.5">
                  {currentCase.transaction.vestaSignals.c1_c14_velocity} txns/window
                </p>
                <span className="text-[10px] text-slate-500">Vesta count features</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Time Delta D1-D15:</span>
                <p className="font-mono font-bold text-purple-400 text-base mt-0.5">
                  {currentCase.transaction.vestaSignals.d1_d15_delta} days
                </p>
                <span className="text-[10px] text-slate-500">Deviation from mean</span>
              </div>
            </div>

            {/* Device & Connection Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide block">
                Device & Telemetry Fingerprint (id_30 - id_38)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-400">DeviceInfo:</span>
                  <span className="text-white">{currentCase.transaction.device.deviceInfo}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-400">Operating System (id_30):</span>
                  <span className="text-white">{currentCase.transaction.device.os}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-400">Browser (id_31):</span>
                  <span className="text-white">{currentCase.transaction.device.browser}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-400">IP Subnet:</span>
                  <span className="text-white">{currentCase.transaction.device.ipSubnet}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-400">Geo Mismatch:</span>
                  <span className={currentCase.transaction.device.geoMismatch ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {currentCase.transaction.device.geoMismatch ? "TRUE (Teleportation Flag)" : "FALSE (Normal)"}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-400">Proxy / VPN / Tor:</span>
                  <span className={currentCase.transaction.device.proxyOrVpnDetected ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {currentCase.transaction.device.proxyOrVpnDetected ? "DETECTED (High Risk)" : "CLEAN"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "POLICIES" && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-400 text-[11px]">
              The agent validates every proposed action against bank fraud governance policies and regulatory frameworks:
            </p>
            {BANK_FRAUD_POLICIES.map((pol) => (
              <div key={pol.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-400">{pol.name} ({pol.id})</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {pol.authorizedRole}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{pol.description}</p>
                <div className="pt-1.5 border-t border-slate-800/60 flex flex-wrap justify-between text-[10px] text-slate-400 font-mono">
                  <span>Trigger: {pol.triggerCondition}</span>
                  <span className="text-cyan-400">Ref: {pol.regulatoryReference}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
