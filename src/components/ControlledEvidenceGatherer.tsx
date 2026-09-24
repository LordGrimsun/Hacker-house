"use client";

import React, { useState } from "react";
import { ControlledEvidenceAction, FraudCase } from "@/types";
import { soundManager } from "@/lib/audioEffects";
import {
  MessageSquareText,
  Fingerprint,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Sparkles
} from "lucide-react";

interface ControlledEvidenceGathererProps {
  evidence: ControlledEvidenceAction;
  currentCase: FraudCase;
  onSimulateOutcome: (outcome: "CONFIRMED_FRAUD" | "VERIFIED_LEGITIMATE" | "FAILED_CHALLENGE") => void;
  onOpenPhoneSimulator?: () => void;
}

export const ControlledEvidenceGatherer: React.FC<ControlledEvidenceGathererProps> = ({
  evidence,
  currentCase,
  onSimulateOutcome,
  onOpenPhoneSimulator,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = (outcome: "CONFIRMED_FRAUD" | "VERIFIED_LEGITIMATE" | "FAILED_CHALLENGE") => {
    setIsSimulating(true);
    soundManager.playBlip(700, 0.05);

    setTimeout(() => {
      onSimulateOutcome(outcome);
      setIsSimulating(false);
      if (outcome === "VERIFIED_LEGITIMATE") {
        soundManager.playSuccess();
      } else {
        soundManager.playAlert();
      }
    }, 400);
  };

  const getActionIcon = (type: ControlledEvidenceAction["type"]) => {
    switch (type) {
      case "CUSTOMER_SMS_VERIFY":
        return <MessageSquareText className="w-4 h-4 text-cyan-400" />;
      case "STEP_UP_BIOMETRIC":
        return <Fingerprint className="w-4 h-4 text-purple-400" />;
      case "ANALYST_CALL":
        return <PhoneCall className="w-4 h-4 text-amber-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-orange-400" />;
    }
  };

  const outcome = evidence.responseOutcome;

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            {getActionIcon(evidence.type)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Controlled Evidence Gathering (Policy Action)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                {evidence.policyRule}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{evidence.name}</p>
          </div>
        </div>

        {onOpenPhoneSimulator && (
          <button
            onClick={onOpenPhoneSimulator}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition-all hover:scale-[1.02] shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Launch Phone Simulator</span>
          </button>
        )}
      </div>

      {/* Description & Requested Details */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
        <p className="text-slate-300 leading-relaxed">{evidence.description}</p>
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300">
          <span className="text-slate-500 block text-[10px] font-sans font-bold uppercase">Challenge Payload:</span>
          {evidence.requestedDetails}
        </div>
      </div>

      {/* Outcome Banner */}
      {outcome && (
        <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
          outcome.result === "VERIFIED_LEGITIMATE"
            ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
            : "bg-rose-950/40 border-rose-800/60 text-rose-200"
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              {outcome.result === "VERIFIED_LEGITIMATE" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>Outcome: {outcome.result}</span>
            </span>
            <span className="text-[10px] font-mono opacity-75">{outcome.verifiedAt}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">{outcome.details}</p>
          <div className="text-[10px] font-mono font-bold flex items-center gap-2 pt-1 border-t border-slate-800/40">
            <span>Uncertainty Delta:</span>
            <span className={outcome.confidenceDelta < 0 ? "text-emerald-400" : "text-rose-400"}>
              {outcome.confidenceDelta > 0 ? `+${outcome.confidenceDelta}% Risk` : `${outcome.confidenceDelta}% Uncertainty Removed`}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Simulation Action Buttons */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[11px] font-semibold text-slate-400 block mb-2">
          Test Agent Next-Best Action Adaptability (Quick Simulation):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => handleSimulate("CONFIRMED_FRAUD")}
            disabled={isSimulating}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-semibold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Confirm Fraud (Report Theft)</span>
          </button>

          <button
            onClick={() => handleSimulate("VERIFIED_LEGITIMATE")}
            disabled={isSimulating}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verify Legitimate (FaceID)</span>
          </button>

          <button
            onClick={() => handleSimulate("FAILED_CHALLENGE")}
            disabled={isSimulating}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSimulating ? "animate-spin" : ""}`} />
            <span>Failed Challenge / Spoof</span>
          </button>
        </div>
      </div>
    </div>
  );
};
