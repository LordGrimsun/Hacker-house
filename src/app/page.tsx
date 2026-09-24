"use client";

import React, { useState } from "react";
import { BENCHMARK_CASES } from "@/data/benchmarkCases";
import { FraudCase, NavigationTab, UserRole } from "@/types";
import { AgentInvestigationEngine } from "@/lib/agentEngine";
import { soundManager } from "@/lib/audioEffects";
import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/LoginPage";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardOverview } from "@/components/DashboardOverview";
import { CaseManagementView } from "@/components/CaseManagementView";
import { BenchmarkBatchRunner } from "@/components/BenchmarkBatchRunner";
import { AnalyticsView } from "@/components/AnalyticsView";
import { TeamManagementView } from "@/components/TeamManagementView";
import { UserProfileView } from "@/components/UserProfileView";
import { SettingsView } from "@/components/SettingsView";
import { CaseQueue } from "@/components/CaseQueue";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { InvestigationConsole } from "@/components/InvestigationConsole";
import { ControlledEvidenceGatherer } from "@/components/ControlledEvidenceGatherer";
import { ActionApprovalCard } from "@/components/ActionApprovalCard";
import { MultiAgentDebate } from "@/components/MultiAgentDebate";
import { PhoneSimulator } from "@/components/PhoneSimulator";
import { SARReportView } from "@/components/SARReportView";
import { GSQLStudio } from "@/components/GSQLStudio";
import { CaseMemoryView } from "@/components/CaseMemoryView";
import { BenchmarkExporter } from "@/components/BenchmarkExporter";
import { DocumentationModal } from "@/components/DocumentationModal";
import { DEFAULT_TIGERGRAPH_CONFIG, TigerGraphConfig } from "@/lib/tigergraph";

type ViewMode = "LANDING" | "LOGIN" | "APP";

const TAB_TITLES: Record<NavigationTab, string> = {
  DASHBOARD: "Executive Command Center",
  INVESTIGATION: "Investigation Studio & Graph AI",
  CASES: "Benchmark Case Triage (20 Cases)",
  BATCH_EVALUATION: "Benchmark Evaluation Suite",
  ANALYTICS: "Fraud Graph Intelligence & Metrics",
  TEAM: "Team Roster & Access Control (RBAC)",
  PROFILE: "Investigator Profile & Credentials",
  SETTINGS: "Settings & API Gateway",
};

export default function FraudInvestigationPlatform() {
  // Top-level Navigation Mode: Landing / Login / App Dashboard
  const [viewMode, setViewMode] = useState<ViewMode>("LANDING");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: UserRole }>({
    name: "Marcus Vance, CAMS",
    email: "analyst@byteme.ai",
    role: "Lead Fraud Architect"
  });

  // Active Navigation Tab inside the Dashboard
  const [activeTab, setActiveTab] = useState<NavigationTab>("DASHBOARD");

  // Cases List & Active Selection
  const [casesList, setCasesList] = useState<FraudCase[]>(BENCHMARK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(BENCHMARK_CASES[0].id);

  // Active Case Object
  const currentCase = casesList.find((c) => c.id === selectedCaseId) || casesList[0];

  // Modals
  const [isSAROpen, setIsSAROpen] = useState(false);
  const [isGsqlOpen, setIsGsqlOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isPhoneSimulatorOpen, setIsPhoneSimulatorOpen] = useState(false);

  // TigerGraph Config
  const [tgConfig, setTgConfig] = useState<TigerGraphConfig>(DEFAULT_TIGERGRAPH_CONFIG);

  // Handle Login
  const handleLogin = (user?: { name: string; email: string; role: UserRole }) => {
    soundManager.playSuccess();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoggedIn(true);
    setViewMode("APP");
    setActiveTab("DASHBOARD");
  };

  // Handle Logout
  const handleLogout = () => {
    soundManager.playBlip(400, 0.08);
    setIsLoggedIn(false);
    setViewMode("LOGIN");
  };

  // Return to landing page
  const handleGoHome = () => {
    soundManager.playBlip(600, 0.04);
    setViewMode("LANDING");
  };

  // Select case and jump directly into the investigation studio
  const handleSelectCaseAndInvestigate = (caseItem: FraudCase) => {
    soundManager.playBlip(800, 0.04);
    setSelectedCaseId(caseItem.id);
    setIsLoggedIn(true);
    setViewMode("APP");
    setActiveTab("INVESTIGATION");
  };

  // Simulate controlled evidence outcome
  const handleSimulateEvidenceOutcome = (
    outcome: "CONFIRMED_FRAUD" | "VERIFIED_LEGITIMATE" | "FAILED_CHALLENGE"
  ) => {
    const updated = AgentInvestigationEngine.simulateControlledEvidenceResponse(currentCase, outcome);
    setCasesList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // VIEW 1: Landing Page (Public Home)
  if (viewMode === "LANDING") {
    return (
      <LandingPage
        onEnterDashboard={(persona) => handleLogin(persona)}
        onGoToLogin={() => setViewMode("LOGIN")}
        onSelectCaseAndInvestigate={handleSelectCaseAndInvestigate}
      />
    );
  }

  // VIEW 2: Dedicated Login Page
  if (viewMode === "LOGIN") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBackToHome={() => setViewMode("LANDING")}
      />
    );
  }

  // VIEW 3: Full Enterprise Dashboard with Fixed Left Sidebar
  return (
    <div className="min-h-screen flex bg-[#060911] text-slate-100 overflow-hidden">
      {/* Persistent Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
        onOpenGsqlStudio={() => setIsGsqlOpen(true)}
        onOpenPhoneSimulator={() => setIsPhoneSimulatorOpen(true)}
        onOpenSAR={() => setIsSAROpen(true)}
        onOpenExporter={() => setIsExporterOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Column (offset by left sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-72">
        {/* Top Header Bar */}
        <DashboardHeader
          cases={casesList}
          currentCase={currentCase}
          onSelectCase={(c) => {
            setSelectedCaseId(c.id);
            setActiveTab("INVESTIGATION");
          }}
          onOpenMobile={() => setIsMobileSidebarOpen(true)}
          onOpenBatchRunner={() => setActiveTab("BATCH_EVALUATION")}
          onOpenDocs={() => setIsDocsOpen(true)}
          activeTabName={TAB_TITLES[activeTab]}
        />

        {/* Dynamic View Body Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#070b14]">
          {activeTab === "DASHBOARD" && (
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full space-y-6">
              <DashboardOverview
                cases={casesList}
                onSelectCaseAndInvestigate={handleSelectCaseAndInvestigate}
                onNavigateTab={setActiveTab}
                onOpenExporter={() => setIsExporterOpen(true)}
                onOpenGsqlStudio={() => setIsGsqlOpen(true)}
              />
            </main>
          )}

          {activeTab === "INVESTIGATION" && (
            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
              {/* Left Sub-Queue: 20 Cases Sidebar within Investigation Studio */}
              <CaseQueue
                cases={casesList}
                selectedCaseId={selectedCaseId}
                onSelectCase={(c) => {
                  soundManager.playBlip(750, 0.03);
                  setSelectedCaseId(c.id);
                }}
              />

              {/* Investigation Studio Workspace */}
              <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
                {/* Top Row: Graph Topology + Agent Execution Console */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  <div className="xl:col-span-6 h-[460px]">
                    <GraphVisualizer
                      subgraph={currentCase.subgraph}
                      gsqlQueries={currentCase.gsqlQueries}
                      caseId={currentCase.id}
                    />
                  </div>
                  <div className="xl:col-span-6 h-[460px]">
                    <InvestigationConsole
                      currentCase={currentCase}
                      onOpenSAR={() => setIsSAROpen(true)}
                    />
                  </div>
                </div>

                {/* Middle Row: Side-by-Side NBA Comparison + Controlled Evidence Simulator */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  <div className="xl:col-span-7">
                    <ActionApprovalCard currentCase={currentCase} />
                  </div>
                  <div className="xl:col-span-5">
                    <ControlledEvidenceGatherer
                      evidence={currentCase.controlledEvidence}
                      currentCase={currentCase}
                      onSimulateOutcome={handleSimulateEvidenceOutcome}
                      onOpenPhoneSimulator={() => setIsPhoneSimulatorOpen(true)}
                    />
                  </div>
                </div>

                {/* Bottom Row: Multi-Agent Consensus Swarm Debate */}
                <div>
                  <MultiAgentDebate currentCase={currentCase} />
                </div>
              </main>
            </div>
          )}

          {activeTab === "CASES" && (
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
              <CaseManagementView
                cases={casesList}
                onSelectCaseAndInvestigate={handleSelectCaseAndInvestigate}
                onOpenExporter={() => setIsExporterOpen(true)}
              />
            </main>
          )}

          {activeTab === "BATCH_EVALUATION" && (
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
              <BenchmarkBatchRunner
                cases={casesList}
                onSelectCaseAndInvestigate={handleSelectCaseAndInvestigate}
                onOpenExporter={() => setIsExporterOpen(true)}
              />
            </main>
          )}

          {activeTab === "ANALYTICS" && (
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
              <AnalyticsView cases={casesList} />
            </main>
          )}

          {activeTab === "TEAM" && (
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
              <TeamManagementView />
            </main>
          )}

          {activeTab === "PROFILE" && (
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
              <UserProfileView />
            </main>
          )}

          {activeTab === "SETTINGS" && (
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
              <SettingsView
                tgConfig={tgConfig}
                onSaveTgConfig={setTgConfig}
              />
            </main>
          )}
        </div>
      </div>

      {/* Global Interactive Smartphone Simulator */}
      <PhoneSimulator
        currentCase={currentCase}
        isOpen={isPhoneSimulatorOpen}
        onClose={() => setIsPhoneSimulatorOpen(false)}
        onSimulateOutcome={handleSimulateEvidenceOutcome}
      />

      {/* Global Modals */}
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
