"use client";

import React from "react";
import { FraudCase, ApprovalRoute, NextAction } from "@/types";
import { ArrowRight, ShieldCheck, AlertOctagon, UserCheck, CheckCircle2, Clock } from "lucide-react";

interface ActionApprovalCardProps {
  currentCase: FraudCase;
}

export const ActionApprovalCard: React.FC<ActionApprovalCardProps> = ({ currentCase }) => {
  const before = currentCase.actionBeforeEvidence;
  const after = currentCase.actionAfterEvidence;

  const getApprovalBadge = (route: ApprovalRoute) => {
    if (route.includes("Auto-Approved")) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{route}</span>
        </span>
      );
    }
    if (route.includes("Compliance") || route.includes("BSA")) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
          <AlertOctagon className="w-3 h-3" />
          <span>{route}</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
        <UserCheck className="w-3 h-3" />
        <span>{route}</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Next-Best Action & Approval Governance Matrix
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Case: <span className="text-white font-bold">{currentCase.id}</span>
        </span>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BEFORE Evidence Action */}
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Before Additional Evidence</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-amber-400 rounded border border-slate-700">
                Uncertainty: {currentCase.assessment.initialUncertainty}%
              </span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 mb-2">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Action Recommended:</span>
              <p className="text-xs font-bold text-amber-300 mt-0.5">{before.recommendedAction}</p>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{before.rationale}</p>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Approval Route:</span>
            {getApprovalBadge(before.approvalRoute)}
          </div>
        </div>

        {/* AFTER Evidence Action */}
        <div className="p-3.5 bg-slate-900/60 border border-orange-500/40 rounded-xl flex flex-col justify-between space-y-3 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/20">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. After Additional Evidence Received</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-emerald-400 rounded border border-slate-700">
                Confidence: {currentCase.assessment.confidenceScore}%
              </span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 mb-2">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Final Action Taken:</span>
              <p className="text-xs font-bold text-emerald-300 mt-0.5">{after.recommendedAction}</p>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{after.rationale}</p>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Required Sign-Off:</span>
            {getApprovalBadge(after.approvalRoute)}
          </div>
        </div>
      </div>
    </div>
  );
};
