"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Cpu,
  Layers,
  BarChart3,
  Users,
  User,
  Settings,
  LogOut,
  Terminal,
  Zap,
  Volume2,
  VolumeX,
  FileText,
  Smartphone,
  Download,
  Database,
  Home,
  X,
  BookOpen,
  ChevronRight
} from "lucide-react";
import { NavigationTab, UserRole } from "@/types";
import { soundManager } from "@/lib/audioEffects";

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentUser: { name: string; email: string; role: UserRole };
  onLogout: () => void;
  onGoHome: () => void;
  onOpenGsqlStudio: () => void;
  onOpenPhoneSimulator: () => void;
  onOpenSAR: () => void;
  onOpenExporter: () => void;
  onOpenDocs: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onGoHome,
  onOpenGsqlStudio,
  onOpenPhoneSimulator,
  onOpenSAR,
  onOpenExporter,
  onOpenDocs,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    soundManager.isMuted = !soundManager.isMuted;
    setIsMuted(soundManager.isMuted);
    if (!soundManager.isMuted) {
      soundManager.playBlip(900, 0.05);
    }
  };

  const handleNav = (tab: NavigationTab) => {
    soundManager.playBlip(750, 0.03);
    onSelectTab(tab);
    onCloseMobile();
  };

  const navItems = [
    {
      group: "INVESTIGATION CENTER",
      items: [
        { tab: "DASHBOARD" as NavigationTab, label: "Command Center", icon: LayoutDashboard, badge: "Live" },
        { tab: "INVESTIGATION" as NavigationTab, label: "Investigation Studio", icon: Cpu, badge: "Graph AI" },
        { tab: "CASES" as NavigationTab, label: "Case Triage Queue", icon: Layers, badge: "20" },
        { tab: "BATCH_EVALUATION" as NavigationTab, label: "Benchmark Suite", icon: Zap, badge: "IEEE-CIS" },
      ]
    },
    {
      group: "GRAPH INTELLIGENCE",
      items: [
        { tab: "ANALYTICS" as NavigationTab, label: "Fraud Analytics", icon: BarChart3 },
      ]
    },
    {
      group: "ADMINISTRATION & SECURITY",
      items: [
        { tab: "TEAM" as NavigationTab, label: "Team & Roles (RBAC)", icon: Users, badge: "5" },
        { tab: "PROFILE" as NavigationTab, label: "Investigator Profile", icon: User },
        { tab: "SETTINGS" as NavigationTab, label: "Settings & API Gateway", icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#060911] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header Logo */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleNav("DASHBOARD")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-tiger-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/40 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base text-white tracking-tight">TigerGraph</span>
                <span className="font-extrabold text-base bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Sentinel
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Team ByteMe
                </span>
                <span className="text-[10px] text-slate-500 font-mono">HHGOA 2026</span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {navItems.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                {section.group}
              </span>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleNav(item.tab)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? "bg-gradient-to-r from-orange-600 via-tiger-500 to-amber-600 text-white shadow-md shadow-orange-600/25"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-orange-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white font-bold"
                              : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Interactive Fast Graph Tool Launchers */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              DIRECT TOOL SHORTCUTS
            </span>

            <div className="space-y-1 pt-1">
              <button
                onClick={() => {
                  soundManager.playBlip(600, 0.04);
                  onOpenGsqlStudio();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900/80 transition-all text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>GSQL Query Studio</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  GSQL
                </span>
              </button>

              <button
                onClick={() => {
                  soundManager.playBlip(650, 0.04);
                  onOpenPhoneSimulator();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-300 hover:bg-slate-900/80 transition-all text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Mobile Step-Up Sim</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  2FA Sim
                </span>
              </button>

              <button
                onClick={() => {
                  soundManager.playBlip(700, 0.04);
                  onOpenSAR();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-purple-300 hover:bg-slate-900/80 transition-all text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>FinCEN SAR Filer</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/40">
                  XML
                </span>
              </button>

              <button
                onClick={() => {
                  soundManager.playBlip(800, 0.04);
                  onOpenExporter();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-orange-300 hover:bg-slate-900/80 transition-all text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>Export 20 Cases</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-800/40">
                  JSON
                </span>
              </button>

              <button
                onClick={() => {
                  soundManager.playBlip(850, 0.04);
                  onOpenDocs();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-slate-900/80 transition-all text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Architecture Guide</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: TigerGraph Pulse + Sound Toggle + User Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5">
          {/* Live Savanna Cluster Status */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-[11px] font-semibold text-slate-200 leading-none">TigerGraph Savanna</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">FraudNet_V3 • 14.2ms</div>
              </div>
            </div>

            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isMuted
                  ? "bg-slate-900 border-slate-800 text-slate-500"
                  : "bg-orange-500/10 border-orange-500/30 text-orange-400"
              }`}
              title={isMuted ? "Unmute Audio" : "Mute Audio Effects"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div
              onClick={() => handleNav("PROFILE")}
              className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0"
              title="View & Edit Profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-orange-400 font-mono truncate">{currentUser.role}</div>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0 ml-2">
              <button
                onClick={onGoHome}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Return to Home Landing Page"
              >
                <Home className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
