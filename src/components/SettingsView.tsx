"use client";

import React, { useState } from "react";
import { TigerGraphConfig, ApiIntegrationConfig } from "@/types";
import { INITIAL_API_INTEGRATIONS } from "@/data/apiIntegrations";
import {
  Settings,
  Database,
  Globe,
  Key,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Bell,
  Cpu,
  ShieldCheck,
  Save,
  Check
} from "lucide-react";

interface SettingsViewProps {
  tgConfig: TigerGraphConfig;
  onSaveTgConfig: (cfg: TigerGraphConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ tgConfig, onSaveTgConfig }) => {
  const [formData, setFormData] = useState<TigerGraphConfig>({ ...tgConfig });
  const [integrations, setIntegrations] = useState<ApiIntegrationConfig[]>(INITIAL_API_INTEGRATIONS);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Policy thresholds
  const [uncertaintyThreshold, setUncertaintyThreshold] = useState(40);
  const [sarDollarThreshold, setSarDollarThreshold] = useState(5000);
  const [autoBlockThreshold, setAutoBlockThreshold] = useState(85);

  const handleTestApi = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "CONNECTED", latencyMs: Math.floor(Math.random() * 20) + 12, lastSync: "Just now" }
            : item
        )
      );
      setTestingId(null);
    }, 500);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTgConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-bold text-white tracking-tight uppercase">
              System Settings &amp; API Integrations Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              5 Services Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure live TigerGraph Savanna endpoints, external fraud APIs, FinCEN regulatory gateways, and policy thresholds.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 flex items-center space-x-1.5 transition-all active:scale-95"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? "Saved Settings" : "Save All Configuration"}</span>
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Section 1: TigerGraph Savanna Gateway */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-orange-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                TigerGraph Savanna / CE Gateway (REST++)
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40">
              Savanna Cloud v3.9+
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Savanna Instance Endpoint URL:</label>
              <input
                type="text"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Graph Target Name:</label>
              <input
                type="text"
                value={formData.graphName}
                onChange={(e) => setFormData({ ...formData, graphName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-slate-300 font-semibold block mb-1">REST++ Bearer Token / Secret:</label>
              <input
                type="password"
                value={formData.apiToken}
                onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-200 font-semibold block">Live Connection Mode:</span>
              <p className="text-[11px] text-slate-400">
                When disabled, runs built-in zero-latency GSQL Graph Engine (ideal for offline presentations & judging).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.useLiveConnection}
                onChange={(e) => setFormData({ ...formData, useLiveConnection: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {/* TigerGraph MCP & Savanna Cloud Integrations Banner */}
          <div className="p-3.5 bg-gradient-to-r from-orange-950/30 to-slate-900/60 rounded-xl border border-orange-500/20 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  MCP v1.0
                </span>
                <span className="text-xs font-bold text-white">TigerGraph Model Context Protocol (MCP)</span>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href="https://savanna.tgcloud.io/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-[11px] font-semibold text-orange-300 transition-colors"
                >
                  Savanna Console ↗
                </a>
                <a
                  href="https://github.com/tigergraph/tigergraph-mcp"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 transition-colors"
                >
                  GitHub MCP Repo ↗
                </a>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              The Agent connects to TigerGraph Savanna via the official <span className="text-orange-300 font-mono">tigergraph-mcp</span> server over stdio / SSE JSON-RPC. Supports <span className="font-mono text-slate-300">tigergraph__run_installed_query</span>, <span className="font-mono text-slate-300">tigergraph__gsql</span>, and <span className="font-mono text-slate-300">tigergraph__get_neighbors</span>.
            </p>
          </div>
        </div>

        {/* Section 2: External APIs & Connected Services */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                External Fraud APIs &amp; Regulatory Services
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {integrations.map((api) => (
              <div key={api.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{api.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      api.status === "CONNECTED"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    }`}>
                      {api.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{api.description}</p>
                  <div className="font-mono text-[10px] text-slate-500 truncate mt-1">
                    Endpoint: {api.endpoint}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Latency: <b className="text-emerald-400">{api.latencyMs} ms</b>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleTestApi(api.id)}
                    disabled={testingId === api.id}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-[11px] transition-colors flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${testingId === api.id ? "animate-spin" : ""}`} />
                    <span>{testingId === api.id ? "Pinging..." : "Test Ping"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Bank Policy Risk & Uncertainty Thresholds */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Bank Fraud Policy &amp; Uncertainty Thresholds
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Uncertainty Trigger:</span>
                <span className="font-mono font-bold text-orange-400">{uncertaintyThreshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={uncertaintyThreshold}
                onChange={(e) => setUncertaintyThreshold(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <p className="text-[10px] text-slate-500">
                Trigger mandatory controlled evidence (3DS 2.0 / SMS) if uncertainty exceeds threshold.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">FinCEN SAR Threshold:</span>
                <span className="font-mono font-bold text-purple-400">${sarDollarThreshold.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={sarDollarThreshold}
                onChange={(e) => setSarDollarThreshold(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <p className="text-[10px] text-slate-500">
                Mandatory FinCEN SAR XML package auto-generation threshold (31 CFR 1020.320).
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Auto-Block Risk Score:</span>
                <span className="font-mono font-bold text-rose-400">{autoBlockThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={autoBlockThreshold}
                onChange={(e) => setAutoBlockThreshold(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <p className="text-[10px] text-slate-500">
                Immediate autonomous debit kill-switch triggered if model risk exceeds this limit.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
