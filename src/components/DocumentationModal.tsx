"use client";

import React, { useState } from "react";
import { X, BookOpen, Share2, Video, Copy, Check, Sparkles, Cpu, Database, Network } from "lucide-react";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"BLOG" | "SOCIAL" | "ARCHITECTURE">("ARCHITECTURE");
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const blogPostText = `# Agentic Fraud Investigation & Next-Best Action with TigerGraph
**By Team ByteMe (HHGOA 2026 Hackathon)**

## 1. Executive Summary & Problem
Fraud analysts at financial institutions face an overwhelming deluge of high-velocity alerts. Traditional ML models output isolated risk scores, but cannot trace the interconnected graph of money movement, shared devices, or synthetic identities in real time. The result is delayed investigations, customer friction from false positives, and severe financial losses when money leaves before an analyst acts.

Team **ByteMe** engineered **TigerGraph Agentic Fraud Sentinel**: an autonomous AI agent combining **TigerGraph Savanna GSQL algorithms**, **TigerGraph MCP**, **GraphRAG**, and **Bayesian Uncertainty Quantification** to investigate fraud cases, execute controlled evidence gathering, and prescribe compliant Next-Best Actions (NBAs) with rigorous approval routing.

## 2. System Architecture
- **Graph Core (TigerGraph Savanna / CE)**: High-speed GSQL schema linking Customers, Accounts, Cards, Transactions, Devices, IPs, and Merchants.
- **TigerGraph MCP Server**: Equips LLM agents with native tools to execute pre-installed GSQL queries (\`find_shared_device_rings\`, \`detect_mule_layering\`, \`card_velocity_burst\`, \`cosine_case_similarity\`).
- **GraphRAG Engine**: Grounds reasoning by retrieving connected subgraphs and referencing bank fraud policies (POL-001 through POL-005) plus 4 months of closed historical case memory.
- **Uncertainty Quantification Core**: Calculates evidential certainty (0-100%). When signals are ambiguous, the agent refrains from destructive actions and initiates policy-approved controlled evidence (3DS 2.0 biometric re-auth, SMS out-of-band challenge, or analyst phone probe).
- **Next-Best Action & Approval Governance**: Records the exact NBA and approval route *before* and *after* evidence is received, guaranteeing compliance and zero unapproved account locks.
- **Automated Regulatory SAR Generation**: Generates compliant FinCEN Suspicious Activity Reports with multi-hop graph nexus and chronology.

## 3. How TigerGraph is Used
TigerGraph provides the foundational analytical backbone:
1. **Multi-Hop Traversal (2-3 Hops)**: Uncovers hidden card rings, proxy hops, and residential emulator farms that relational databases fail to detect in real time.
2. **Louvain Community Detection**: Discovers synthetic identity clusters sharing mail drops (CMRA) and hardware hashes.
3. **Temporal Cycle & Layering Queries**: Intercepts money mule smurfing networks before funds off-ramp into crypto exchanges.
4. **Graph Vector Memory**: Persists investigation findings back into the graph to inform future case memory.

## 4. Key Learnings & Future Roadmap
- GraphRAG delivers vastly superior explainability over black-box tabular neural nets.
- Distinguishing ambiguous signals from true malice prevents millions in false-positive customer attrition.
- Future roadmap: Real-time streaming GSQL triggers integrated with Apache Kafka and distributed multi-agent swarm negotiation.`;

  const socialPostText = `🚀 Thrilled to reveal what we built for the @TigerGraphDB Hackathon HHGOA!

Introducing TigerGraph Agentic Fraud Sentinel by Team #ByteMe:
An autonomous AI agent for Fraud Investigation & Next-Best Action! 🛡️

🔍 Powered by:
⚡ TigerGraph Savanna & GSQL Graph Algorithms
🤖 TigerGraph MCP & GraphRAG
📉 Bayesian Uncertainty Reasoning
📝 FinCEN Suspicious Activity Report (SAR) auto-generation
🔄 Complete evaluation across all 20 IEEE-CIS benchmark cases!

Watch how it turns uncertain fraud signals into defensible, compliant action before the money is gone.

Demo & Repo: https://github.com/byteme-fraud-agent
#TigerGraph #AI #Fintech #GraphRAG #FraudDetection #AgenticAI`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Architecture, Technical Blog & Pitch Deck</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Team ByteMe
                </span>
              </h3>
              <p className="text-xs text-slate-400">TigerGraph HHGOA Hackathon Submission Deliverables</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab("ARCHITECTURE")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "ARCHITECTURE" ? "bg-orange-500 text-white font-medium" : "text-slate-400 hover:text-white"
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setActiveTab("BLOG")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "BLOG" ? "bg-orange-500 text-white font-medium" : "text-slate-400 hover:text-white"
                }`}
              >
                Technical Blog
              </button>
              <button
                onClick={() => setActiveTab("SOCIAL")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "SOCIAL" ? "bg-orange-500 text-white font-medium" : "text-slate-400 hover:text-white"
                }`}
              >
                X / LinkedIn Post
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-300">
          {activeTab === "ARCHITECTURE" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="p-1.5 w-fit rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs">1. TigerGraph Savanna Core</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ultra-fast GSQL graph traversal detecting multi-hop device sharing, synthetic identity clusters, and mule layering cycles in sub-20ms latency.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="p-1.5 w-fit rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Network className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs">2. GraphRAG & Case Memory</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Grounds the agent with graph subnetwork context, bank fraud policy compliance rules, and historical episodic case memory from months 1–4.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="p-1.5 w-fit rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-xs">3. Uncertainty & NBA Engine</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Measures Bayesian signal entropy. When uncertain, executes controlled evidence gathering (3DS / SMS) before finalizing defensible actions.
                  </p>
                </div>
              </div>

              {/* Investigation Pipeline Flowchart Box */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Agentic Investigation Lifecycle:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-orange-400 font-bold block mb-1">STAGE 1: TRIGGER</span>
                    <span className="text-slate-400 text-[10px]">Model score or anomaly alert</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-cyan-400 font-bold block mb-1">STAGE 2: GSQL GRAPH</span>
                    <span className="text-slate-400 text-[10px]">2-hop traversal & rings</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-amber-400 font-bold block mb-1">STAGE 3: EVIDENCE</span>
                    <span className="text-slate-400 text-[10px]">Controlled 3DS / SMS probe</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-emerald-400 font-bold block mb-1">STAGE 4: NBA & SAR</span>
                    <span className="text-slate-400 text-[10px]">Action, sign-off & filing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "BLOG" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  Complete Technical Blog Post (Submission Deliverable)
                </span>
                <button
                  onClick={() => handleCopy(blogPostText, "blog")}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition-colors"
                >
                  {copied === "blog" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === "blog" ? "Copied" : "Copy Blog Post"}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/80 rounded-xl border border-slate-800 text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                {blogPostText}
              </pre>
            </div>
          )}

          {activeTab === "SOCIAL" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  X / LinkedIn Submission Announcement (Tagged @TigerGraphDB)
                </span>
                <button
                  onClick={() => handleCopy(socialPostText, "social")}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition-colors"
                >
                  {copied === "social" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === "social" ? "Copied" : "Copy Social Post"}</span>
                </button>
              </div>
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs whitespace-pre-wrap">
                {socialPostText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Team ByteMe • TigerGraph HHGOA Hackathon Entry</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
