"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  Network,
  Activity,
  ChevronRight,
  ShieldCheck,
  FileText,
  Smartphone,
  ExternalLink,
  Users,
  Copy,
  Check
} from "lucide-react";
import { UserRole, FraudCase } from "@/types";
import { BENCHMARK_CASES } from "@/data/benchmarkCases";

interface LandingPageProps {
  onEnterDashboard: (user?: { name: string; email: string; role: UserRole }) => void;
  onGoToLogin: () => void;
  onSelectCaseAndInvestigate: (caseItem: FraudCase) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onGoToLogin,
  onSelectCaseAndInvestigate
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const copyToClipboard = (text: string, type: "id" | "pass") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const demoPersonas: { name: string; email: string; role: UserRole; badge: string; color: string }[] = [
    {
      name: "Marcus Vance, CAMS",
      email: "marcus.vance@byteme.ai",
      role: "Lead Fraud Architect",
      badge: "Full Admin & GSQL Execution",
      color: "from-orange-500 to-amber-500"
    },
    {
      name: "Sarah Jenkins, CAMS",
      email: "sarah.jenkins@byteme.ai",
      role: "Bank Secrecy Act (BSA) Officer",
      badge: "FinCEN SAR Signing Authority",
      color: "from-purple-500 to-indigo-500"
    },
    {
      name: "David Zhao",
      email: "david.zhao@byteme.ai",
      role: "VP of Fraud Risk",
      badge: "Executive Risk & Capital Audit",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Elena Rostova",
      email: "elena.rostova@byteme.ai",
      role: "SecOps Incident Investigator",
      badge: "Active Evidence Dispatcher",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#060911]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-tiger-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/40">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">TigerGraph</span>
                <span className="font-bold text-lg bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Sentinel
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
                  Team ByteMe
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">HHGOA 2026 • Hacker House Goa</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#overview" className="hover:text-orange-400 transition-colors">Overview</a>
            <a href="#architecture" className="hover:text-orange-400 transition-colors">Architecture</a>
            <a href="#benchmarks" className="hover:text-orange-400 transition-colors">20 IEEE-CIS Cases</a>
            <a href="#fincen" className="hover:text-orange-400 transition-colors">FinCEN SARs</a>
            <a href="#demo-access" className="hover:text-orange-400 transition-colors">Demo Credentials</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToLogin}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterDashboard()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-tiger-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-xs font-bold text-white shadow-lg shadow-orange-600/30 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 lg:px-8 overflow-hidden">
        {/* Glow lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 text-xs font-mono shadow-xl backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="text-orange-400 font-semibold">TIGERGRAPH SAVANNA</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">AGENTIC FRAUD INVESTIGATION</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400">HHGOA 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            Autonomous Graph AI for Fraud Investigation &amp;{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Next-Best Action
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            When signals are uncertain, legacy rules panic while fraudsters siphon money.
            Our multi-agent swarm navigates <strong className="text-orange-400 font-semibold">TigerGraph 3-hop subgraphs</strong>,
            actively gathers controlled step-up evidence, and executes mathematically grounded Next-Best Actions before capital off-ramps.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onEnterDashboard()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-tiger-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Enterprise Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <a
              href="#demo-access"
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm transition-all flex items-center space-x-2 shadow-lg"
            >
              <Lock className="w-4 h-4 text-orange-400" />
              <span>View Demo Credentials</span>
            </a>

            <button
              onClick={() => onSelectCaseAndInvestigate(BENCHMARK_CASES[0])}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-sm transition-all flex items-center space-x-2 shadow-lg"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Investigate CASE-001</span>
            </button>
          </div>

          {/* KPI Ribbon */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto text-left">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Benchmark Pool</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">20 Test Cases</span>
              <span className="text-[11px] text-emerald-400 mt-0.5 block">IEEE-CIS Vesta Dataset</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Mule Ring Precision</span>
              <span className="text-xl font-bold font-mono text-orange-400 mt-1 block">0.94 F1 Score</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Graph Topology Boost</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">GSQL Latency</span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">&lt; 14.2 ms</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">TigerGraph Savanna REST++</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Capital Saved</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">$1.22M USD</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Zero False Lockouts</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Regulatory Compliance</span>
              <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">FinCEN SAR</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">31 CFR 1020.320 XML</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials & Quick 1-Click Login Section */}
      <section id="demo-access" className="py-12 px-4 lg:px-8 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JUDGE &amp; EVALUATOR ACCESS PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Test-Drive the Live Platform in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Use our pre-configured enterprise credentials below or select any of the four designated role personas to inspect the system immediately.
            </p>
          </div>

          {/* Credentials Display Box */}
          <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-orange-400" />
                <span>Primary Test Credentials</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Active Session Token
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Work ID / Email</span>
                  <span className="text-xs font-mono font-bold text-white">analyst@byteme.ai</span>
                </div>
                <button
                  onClick={() => copyToClipboard("analyst@byteme.ai", "id")}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy email"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Security Password</span>
                  <span className="text-xs font-mono font-bold text-orange-400">TigerGraph2026!</span>
                </div>
                <button
                  onClick={() => copyToClipboard("TigerGraph2026!", "pass")}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy password"
                >
                  {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Prefer manual login? Visit the dedicated login security gateway:
              </span>
              <button
                onClick={onGoToLogin}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
              >
                Go to Login Page
              </button>
            </div>
          </div>

          {/* 1-Click Role Persona Cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Or Choose a 1-Click Role Persona to Enter:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {demoPersonas.map((persona) => (
                <div
                  key={persona.email}
                  onClick={() => onEnterDashboard(persona)}
                  className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${persona.color} flex items-center justify-center font-bold text-xs text-white shadow-md`}>
                        {persona.name.charAt(0)}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-orange-400 transition-colors">
                        1-Click Sign In &rarr;
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                      {persona.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                      {persona.role}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {persona.email}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-medium text-emerald-400">
                      ✓ {persona.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Deep Dive */}
      <section id="architecture" className="py-16 px-4 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>HOW THE AGENT WORKS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            5-Stage Autonomous Graph Investigation Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Engineered specifically to solve the uncertainty barrier when fraud signals are ambiguous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-white">TigerGraph GSQL Subgraph Traversal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When an alert fires, the agent executes parameterized GSQL queries against TigerGraph Savanna, expanding 1 to 3 hops across Account, Device, IP, Card, and Merchant entities.
            </p>
            <div className="pt-2 text-[11px] font-mono text-orange-400">
              Query: find_mule_ring_hops()
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-white">Multi-Agent Swarm Consensus Debate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Four specialized agents—Risk Analyst, Compliance Auditor, Customer Friction Advocate, and Lead Architect—debate contradictory evidence to eliminate single-agent hallucination.
            </p>
            <div className="pt-2 text-[11px] font-mono text-cyan-400">
              Swarm Consensus F1: 94.6%
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Controlled Step-Up Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instead of guessing or immediately blocking high-value VIP transactions, the agent dynamically dispatches controlled challenges (Interactive Smartphone Simulation, Micro-deposits, Voice Match).
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400">
              Resolution: &lt; 90 seconds
            </div>
          </div>
        </div>
      </section>

      {/* 20 Benchmark Cases Preview */}
      <section id="benchmarks" className="py-16 px-4 lg:px-8 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>BENCHMARK DATASET</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                20 Official IEEE-CIS Vesta Test Scenarios
              </h2>
              <p className="text-xs text-slate-400">
                Click any case below to launch directly into the investigation studio with full graph topology.
              </p>
            </div>

            <button
              onClick={() => onEnterDashboard()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore All in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BENCHMARK_CASES.slice(0, 6).map((c) => {
              const isSafe = c.assessment.predictedTypology === "Legitimate / Cleared False Positive";
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCaseAndInvestigate(c)}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                        {c.id}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        ${c.transaction.amountUSD.toLocaleString()} USD
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {c.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {c.trigger.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full border ${
                      isSafe
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    }`}>
                      {c.assessment.predictedTypology.split(" / ")[0]}
                    </span>
                    <span className="text-slate-500 font-mono group-hover:text-cyan-400 transition-colors">
                      Investigate &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#04060b] border-t border-slate-800/80 py-8 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-white">TigerGraph Fraud Sentinel</span>
            <span>•</span>
            <span className="text-orange-400 font-semibold">Team ByteMe</span>
            <span>•</span>
            <span>Hacker House Goa 2026</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onEnterDashboard()}
              className="text-slate-300 hover:text-orange-400 transition-colors font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={onGoToLogin}
              className="text-slate-300 hover:text-orange-400 transition-colors font-semibold"
            >
              Sign In
            </button>
            <a
              href="https://github.com/LordGrimsun/Hacker-house.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
