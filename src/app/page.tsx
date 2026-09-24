"use client";

import React, { useState } from "react";
import { BENCHMARK_CASES } from "@/data/benchmarkCases";
import { FraudCase } from "@/types";
import { AgentInvestigationEngine } from "@/lib/agentEngine";
import { Header } from "@/components/Header";
import { CaseQueue } from "@/components/CaseQueue";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { InvestigationConsole } from "@/components/InvestigationConsole";
import { ControlledEvidenceGatherer } from "@/components/ControlledEvidenceGatherer";
import { ActionApprovalCard } from "@/components/ActionApprovalCard";
import { SARReportView } from "@/components/SARReportView";
import { GSQLStudio } from "@/components/GSQLStudio";
import { CaseMemoryView } from "@/components/CaseMemoryView";
import { ConnectionSettingsModal } from "@/components/ConnectionSettingsModal";
import { BenchmarkExporter } from "@/components/BenchmarkExporter";
import { DocumentationModal } from "@/components/DocumentationModal";
import { DEFAULT_TIGERGRAPH_CONFIG, TigerGraphConfig } from "@/lib/tigergraph";

export default function FraudInvestigationDashboard() {
  // State for cases & selection
  const [casesList, setCasesList] = useState<FraudCase[]>(BENCHMARK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(BENCHMARK_CASES[0].id);

  // Active case object
  const currentCase = casesList.find((c) => c.id === selectedCaseId) || casesList[0];

  // Modals state
  const [isSAROpen, setIsSAROpen] = useState(false);
  const [isGsqlOpen, setIsGsqlOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // TigerGraph config
  const [tgConfig, setTgConfig] = useState<TigerGraphConfig>(DEFAULT_TIGERGRAPH_CONFIG);

  // Handler for case selection
  const handleSelectCase = (caseItem: FraudCase) => {
    setSelectedCaseId(caseItem.id);
  };

  // Handler for simulating controlled evidence feedback
  const handleSimulateEvidenceOutcome = (
    outcome: "CONFIRMED_FRAUD" | "VERIFIED_LEGITIMATE" | "FAILED_CHALLENGE"
  ) => {
    const updated = AgentInvestigationEngine.simulateControlledEvidenceResponse(currentCase, outcome);

    // Update in casesList
    setCasesList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      {/* Global Header */}
      <Header
        cases={casesList}
        selectedCase={currentCase}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGsqlStudio={() => setIsGsqlOpen(true)}
        onOpenMemoryBank={() => setIsMemoryOpen(true)}
        onOpenExporter={() => setIsExporterOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        isConnectedLive={tgConfig.useLiveConnection}
      />

      {/* Main Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: 20 Benchmark Cases Queue */}
        <CaseQueue
          cases={casesList}
          selectedCaseId={selectedCaseId}
          onSelectCase={handleSelectCase}
        />

        {/* Center & Right Investigation Canvas */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
          {/* Top Row: TigerGraph Topology & Investigation Console */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Left 6 cols: TigerGraph Interactive Visualizer */}
            <div className="xl:col-span-6 h-[460px]">
              <GraphVisualizer
                subgraph={currentCase.subgraph}
                gsqlQueries={currentCase.gsqlQueries}
                caseId={currentCase.id}
              />
            </div>

            {/* Right 6 cols: Agent Investigation Console */}
            <div className="xl:col-span-6 h-[460px]">
              <InvestigationConsole
                currentCase={currentCase}
                onOpenSAR={() => setIsSAROpen(true)}
              />
            </div>
          </div>

          {/* Bottom Row: Next-Best Action Governance & Controlled Evidence Gathering */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Left 7 cols: Side-by-Side NBA Comparison Before vs After Evidence */}
            <div className="xl:col-span-7">
              <ActionApprovalCard currentCase={currentCase} />
            </div>

            {/* Right 5 cols: Controlled Evidence Simulator */}
            <div className="xl:col-span-5">
              <ControlledEvidenceGatherer
                evidence={currentCase.controlledEvidence}
                currentCase={currentCase}
                onSimulateOutcome={handleSimulateEvidenceOutcome}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals and Drawers */}
      <SARReportView
        sarReport={currentCase.sarReport}
        isOpen={isSAROpen}
        onClose={() => setIsSAROpen(false)}
      />

      <GSQLStudio
        isOpen={isGsqlOpen}
        onClose={() => setIsGsqlOpen(false)}
      />

      <CaseMemoryView
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
      />

      <ConnectionSettingsModal
        config={tgConfig}
        onSaveConfig={setTgConfig}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <BenchmarkExporter
        cases={casesList}
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
