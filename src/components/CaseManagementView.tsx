"use client";

import React, { useState } from "react";
import { FraudCase, FraudTypology, NavigationTab } from "@/types";
import {
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Download,
  CheckCircle2,
  Cpu
} from "lucide-react";

interface CaseManagementViewProps {
  cases: FraudCase[];
  onSelectCaseAndInvestigate: (caseItem: FraudCase) => void;
  onOpenExporter: () => void;
}

export const CaseManagementView: React.FC<CaseManagementViewProps> = ({
  cases,
  onSelectCaseAndInvestigate,
  onOpenExporter,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypology, setSelectedTypology] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.transaction.merchant.merchantName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTypology =
      selectedTypology === "ALL" || c.assessment.predictedTypology === selectedTypology;

    const matchesStatus =
      selectedStatus === "ALL" || c.status === selectedStatus;

    return matchesSearch && matchesTypology && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-bold text-white tracking-tight uppercase">
              Benchmark Case Management Triage Queue
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              20 Benchmark Cases
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, and audit autonomous agent investigation records, evidence findings, and regulatory SARs.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenExporter}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by case ID, customer, merchant, or keywords..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Typology Dropdown */}
        <select
          value={selectedTypology}
          onChange={(e) => setSelectedTypology(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="ALL">All Typologies</option>
          <option value="Account Takeover (ATO)">Account Takeover (ATO)</option>
          <option value="Synthetic Identity Ring">Synthetic Identity Ring</option>
          <option value="Card Bust-Out & Stolen Card Velocity">Card Bust-Out &amp; Velocity</option>
          <option value="Money Mule Network & Layering">Mule Network &amp; Layering</option>
          <option value="Merchant Collusion & Triangulation">Triangulation &amp; Collusion</option>
          <option value="Legitimate / Cleared False Positive">Legitimate / Cleared False Positive</option>
        </select>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="ALL">All Case Statuses</option>
          <option value="ACTION_RECOMMENDED">Action Recommended</option>
          <option value="RESOLVED">Resolved / Cleared</option>
          <option value="INVESTIGATING">Investigating</option>
        </select>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filtered.length} of {cases.length} cases
        </span>
      </div>

      {/* Master Case Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount (USD)</th>
                <th className="py-3 px-4">Typology</th>
                <th className="py-3 px-4">Bank Risk</th>
                <th className="py-3 px-4">Uncertainty</th>
                <th className="py-3 px-4">Final Action (After Evidence)</th>
                <th className="py-3 px-4">Approval Route</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((item) => {
                const isSafe = item.assessment.predictedTypology === "Legitimate / Cleared False Positive";
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectCaseAndInvestigate(item)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{item.transaction.customer.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">KYC: {item.transaction.customer.kycTier}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      ${item.transaction.amountUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isSafe
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}>
                        {item.assessment.predictedTypology}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={item.assessment.initialRiskScore >= 0.85 ? "text-rose-400" : "text-amber-400"}>
                        {(item.assessment.initialRiskScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-cyan-400 font-semibold">{item.assessment.initialUncertainty}%</span>
                      <span className="text-slate-600 text-[10px]"> → </span>
                      <span className="text-emerald-400 font-bold">{item.assessment.finalUncertainty}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-medium max-w-[200px] truncate" title={item.actionAfterEvidence.recommendedAction}>
                      {item.actionAfterEvidence.recommendedAction}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-slate-300">
                        {item.actionAfterEvidence.approvalRoute.replace(" Approval", "")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCaseAndInvestigate(item);
                        }}
                        className="px-3 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500/40 font-semibold text-xs transition-all flex items-center space-x-1 ml-auto"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Investigate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
