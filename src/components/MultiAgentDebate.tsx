"use client";

import React, { useState } from "react";
import { FraudCase } from "@/types";
import {
  Cpu,
  Database,
  ShieldCheck,
  Scale,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw
} from "lucide-react";

interface MultiAgentDebateProps {
  currentCase: FraudCase;
}

export const MultiAgentDebate: React.FC<MultiAgentDebateProps> = ({ currentCase }) => {
  const isSafe = currentCase.assessment.predictedTypology === "Legitimate / Cleared False Positive";
  const [activeTab, setActiveTab] = useState<"DEBATE" | "CONSENSUS_VOTE">("DEBATE");

  const agents = [
    {
      name: "Agent Alpha: Graph Specialist",
      specialty: "TigerGraph Savanna GSQL & Community Detection",
      avatar: "Database",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      vote: isSafe ? "LOW RISK (Clean 1-hop KYC)" : "CRITICAL RISK (Shared Device Ring)",
      confidence: isSafe ? 98 : 96,
      statement: isSafe
        ? "Graph traversal reveals Dr. Chen's hardware UUID has a 3-year verified history with 412 clean transactions. 0 edges connected to any blacklisted entity or fraud cluster."
        : `GSQL multi-hop query on ${currentCase.subgraph.communityId || "cluster"} identified dense interconnectivity across ${currentCase.subgraph.nodes.length} vertices with high Louvain modularity. Typology matches ${currentCase.assessment.predictedTypology}.`
    },
    {
      name: "Agent Beta: Identity & Telemetry",
      specialty: "Vesta IEEE-CIS Signals & Device Fingerprinting",
      avatar: "Cpu",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      vote: isSafe ? "MEDIUM RISK (IP Geolocation Mismatch)" : "HIGH RISK (Proxy/Emulator Anomaly)",
      confidence: isSafe ? 74 : 94,
      statement: isSafe
        ? "Initial risk model gave 0.72 because of cross-border IP. However, device telemetry confirms genuine Apple iOS mobile Safari without proxy encapsulation."
        : `Vesta velocity features C1-C14 spike to ${currentCase.transaction.vestaSignals.c1_c14_velocity} standard deviations. Geo-mismatch flag active with proxy score ${currentCase.transaction.vestaSignals.v_anomaly_score}.`
    },
    {
      name: "Agent Gamma: Regulatory & Compliance",
      specialty: "Bank Fraud Policies & FinCEN BSA Thresholds",
      avatar: "Scale",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      vote: isSafe ? "POLICY POL-005 (Safe Passage / 3DS Step-Up)" : "POLICY POL-002 (Mandatory FinCEN SAR)",
      confidence: 99,
      statement: isSafe
        ? "Per CFPB Regulation E and Policy POL-005, hard blocking without out-of-band step-up constitutes wrongful customer friction. Issue 3DS 2.0 biometric challenge."
        : `Total exposure of $${currentCase.transaction.amountUSD.toLocaleString()} USD exceeds FinCEN reporting criteria. Mandate SAR generation and senior operational sign-off.`
    },
    {
      name: "Agent Omega: Chief Action Synthesizer",
      specialty: "Bayesian Uncertainty Reasoning & Decision Theory",
      avatar: "ShieldCheck",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      vote: isSafe ? "ALLOW TRANSACTION" : "SEVER EXPOSURE & FREEZE",
      confidence: currentCase.assessment.confidenceScore,
      statement: isSafe
        ? `Consensus achieved: Biometric verification collapsed initial uncertainty from ${currentCase.assessment.initialUncertainty}% down to ${currentCase.assessment.finalUncertainty}%. Action: Allow transaction and append 14-day travel tag.`
        : `Controlled evidence confirmed threat vector. Uncertainty collapsed from ${currentCase.assessment.initialUncertainty}% down to ${currentCase.assessment.finalUncertainty}%. Action: ${currentCase.actionAfterEvidence.recommendedAction}.`
    }
  ];

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Multi-Agent Swarm Debate &amp; Consensus Engine
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                4 Specialized Agents
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous deliberative reasoning synthesizing graph, telemetry, policy, and uncertainty models
            </p>
          </div>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveTab("DEBATE")}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === "DEBATE" ? "bg-orange-500 text-white font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Debate Stream
          </button>
          <button
            onClick={() => setActiveTab("CONSENSUS_VOTE")}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === "CONSENSUS_VOTE" ? "bg-orange-500 text-white font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Voting Dials
          </button>
        </div>
      </div>

      {activeTab === "DEBATE" ? (
        <div className="space-y-3 text-xs">
          {agents.map((agent, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border ${agent.bgColor} ${agent.borderColor} space-y-1.5 transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${agent.color}`}>{agent.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">• {agent.specialty}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white border border-slate-800">
                  Confidence: {agent.confidence}%
                </span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed font-sans">{agent.statement}</p>
              <div className="text-[10px] font-mono font-semibold pt-1 border-t border-slate-800/40 text-slate-400">
                Vote: <span className={agent.color}>{agent.vote}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Voting Consensus Matrix */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {agents.map((agent, i) => (
            <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-center">
              <span className={`font-bold text-xs ${agent.color} block truncate`}>{agent.name.split(":")[1]}</span>
              <div className="text-2xl font-bold text-white">{agent.confidence}%</div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${agent.confidence}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 truncate block mt-1">{agent.vote}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
