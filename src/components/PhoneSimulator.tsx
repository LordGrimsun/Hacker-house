"use client";

import React, { useState } from "react";
import { FraudCase } from "@/types";
import { soundManager } from "@/lib/audioEffects";
import {
  Smartphone,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Fingerprint,
  MessageSquare,
  Lock,
  Volume2,
  VolumeX,
  X,
  Sparkles
} from "lucide-react";

interface PhoneSimulatorProps {
  currentCase: FraudCase;
  isOpen: boolean;
  onClose: () => void;
  onSimulateOutcome: (outcome: "CONFIRMED_FRAUD" | "VERIFIED_LEGITIMATE" | "FAILED_CHALLENGE") => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentCase,
  isOpen,
  onClose,
  onSimulateOutcome,
}) => {
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [completedState, setCompletedState] = useState<string | null>(null);

  if (!isOpen) return null;

  const txn = currentCase.transaction;
  const isBiometric = currentCase.controlledEvidence.type === "STEP_UP_BIOMETRIC";

  const handleApprove = () => {
    soundManager.playBlip(900, 0.08);
    setIsScanningBiometric(true);
    setTimeout(() => {
      soundManager.playSuccess();
      setIsScanningBiometric(false);
      setCompletedState("VERIFIED_LEGITIMATE");
      setTimeout(() => {
        onSimulateOutcome("VERIFIED_LEGITIMATE");
        onClose();
        setCompletedState(null);
      }, 900);
    }, 1200);
  };

  const handleReject = () => {
    soundManager.playAlert();
    setCompletedState("CONFIRMED_FRAUD");
    setTimeout(() => {
      onSimulateOutcome("CONFIRMED_FRAUD");
      onClose();
      setCompletedState(null);
    }, 900);
  };

  const handleGhost = () => {
    soundManager.playBlip(300, 0.1);
    setCompletedState("FAILED_CHALLENGE");
    setTimeout(() => {
      onSimulateOutcome("FAILED_CHALLENGE");
      onClose();
      setCompletedState(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-300 px-2 max-w-[340px]">
          <div className="flex items-center space-x-1.5">
            <Smartphone className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Cardholder Device Twin
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iPhone Chassis Container */}
        <div className="w-[320px] h-[640px] bg-slate-950 rounded-[48px] border-[6px] border-slate-800 shadow-2xl ring-2 ring-orange-500/30 overflow-hidden flex flex-col relative select-none">
          {/* Dynamic Island / Camera Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full flex items-center justify-end px-2 z-30 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Status Bar */}
          <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[10px] font-mono text-slate-400 z-20">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <span>5G</span>
              <span className="w-4 h-2 border border-slate-400 rounded-sm inline-block p-0.5">
                <span className="w-full h-full bg-white block rounded-xs"></span>
              </span>
            </div>
          </div>

          {/* Screen Body */}
          <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 flex flex-col justify-between overflow-y-auto">
            {/* Header info on phone */}
            <div className="pt-8 text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-400">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Horizon National Bank</h4>
              <p className="text-[10px] text-slate-400">Cardholder Security Verification</p>
            </div>

            {/* Notification / Verification Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-orange-400 border-b border-slate-800 pb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Urgent Authorization Required</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-400 text-[10px] uppercase font-mono">Amount Attempted:</div>
                <div className="text-xl font-bold font-mono text-white">
                  ${txn.amountUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                </div>
                <div className="text-slate-300 text-xs">
                  Merchant: <span className="font-semibold text-white">{txn.merchant.merchantName}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Card: <span className="font-mono text-white">{txn.card.card4.toUpperCase()} •••• {txn.card.card1}</span>
                </div>
                {txn.device.geoMismatch && (
                  <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono">
                    ⚠️ Detected location: Frankfurt, DE (Tor Exit)
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                &ldquo;Did you or an authorized user initiate this transaction right now?&rdquo;
              </p>
            </div>

            {/* Biometric Scanning Animation if active */}
            {isScanningBiometric && (
              <div className="py-4 text-center space-y-2 animate-fadeIn">
                <Fingerprint className="w-12 h-12 text-emerald-400 animate-pulse mx-auto" />
                <span className="text-xs font-mono font-bold text-emerald-300 block">
                  FaceID / Secure Enclave Scanning...
                </span>
              </div>
            )}

            {completedState && (
              <div className="py-3 text-center space-y-1.5 animate-fadeIn">
                {completedState === "VERIFIED_LEGITIMATE" ? (
                  <div className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> Authenticated via FaceID
                  </div>
                ) : (
                  <div className="text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5">
                    <XCircle className="w-5 h-5" /> Fraud Confirmed &amp; Card Severed
                  </div>
                )}
              </div>
            )}

            {/* Interactive Phone Buttons */}
            {!isScanningBiometric && !completedState && (
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleApprove}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>YES, I AUTHORIZE (Approve)</span>
                </button>

                <button
                  onClick={handleReject}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                >
                  <XCircle className="w-4 h-4" />
                  <span>NO! REPORT FRAUD &amp; LOCK</span>
                </button>

                <button
                  onClick={handleGhost}
                  className="w-full py-1.5 text-[10px] text-slate-400 hover:text-slate-200 transition-colors text-center font-mono"
                >
                  Simulate: Timeout / No Response
                </button>
              </div>
            )}

            {/* Bottom Home Indicator Bar */}
            <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
