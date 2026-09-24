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
  Network
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
  onOpenMemory: () => void;
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
  onOpenMemory,
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

  const handleToolAction = (action: () => void) => {
    soundManager.playBlip(650, 0.04);
    action();
    onCloseMobile();
  };

  const navSections = [
    {
      title: "INVESTIGATION CENTER",
      items: [
        { tab: "DASHBOARD" as NavigationTab, label: "Command Center", icon: LayoutDashboard, badge: "Live" },
        { tab: "INVESTIGATION" as NavigationTab, label: "Investigation Studio", icon: Cpu, badge: "Graph AI" },
        { tab: "CASES" as NavigationTab, label: "Case Triage Queue", icon: Layers, badge: "20" },
        { tab: "BATCH_EVALUATION" as NavigationTab, label: "Benchmark Suite", icon: Zap, badge: "IEEE-CIS" },
      ]
    },
    {
      title: "GRAPH REASONING & TOOLS",
      items: [
        { tab: "ANALYTICS" as NavigationTab, label: "Fraud Analytics", icon: BarChart3 },
      ],
      tools: [
        { label: "GSQL Query Studio", icon: Terminal, action: onOpenGsqlStudio, tag: "GSQL", color: "text-cyan-400" },
        { label: "2FA Mobile Simulator", icon: Smartphone, action: onOpenPhoneSimulator, tag: "Step-Up", color: "text-emerald-400" },
        { label: "FinCEN SAR Filer", icon: FileText, action: onOpenSAR, tag: "XML", color: "text-purple-400" },
        { label: "Graph Memory Bank", icon: Network, action: onOpenMemory, tag: "M1-M4", color: "text-amber-400" },
        { label: "Export 20 Benchmarks", icon: Download, action: onOpenExporter, tag: "JSON", color: "text-orange-400" },
      ]
    },
    {
      title: "ADMINISTRATION & SECURITY",
      items: [
        { tab: "TEAM" as NavigationTab, label: "Team & Roles (RBAC)", icon: Users, badge: "5 Active" },
        { tab: "PROFILE" as NavigationTab, label: "Investigator Profile", icon: User },
        { tab: "SETTINGS" as NavigationTab, label: "Settings & API Gateway", icon: Settings },
      ],
      tools: [
        { label: "Architecture & Pitch", icon: BookOpen, action: onOpenDocs, tag: "Guide", color: "text-blue-400" },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#060911] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header Logo + Savanna Live Indicator */}
        <div className="p-3.5 border-b border-slate-800/80 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between">
            <div
              onClick={() => handleNav("DASHBOARD")}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-tiger-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/40 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm text-white tracking-tight">TigerGraph</span>
                  <span className="font-extrabold text-sm bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                    Sentinel
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Team ByteMe
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">HHGOA 2026</span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Compact Savanna Cloud Live Status */}
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-semibold">Savanna Cloud</span>
            </div>
            <span className="text-emerald-400 font-bold">14.2ms</span>
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-4">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                {section.title}
              </span>

              {/* Primary View Navigation Links */}
              <div className="space-y-0.5 pt-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleNav(item.tab)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
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

                {/* Direct Action Tools inside Section */}
                {section.tools && section.tools.map((tool, tIdx) => {
                  const ToolIcon = tool.icon;
                  return (
                    <button
                      key={tIdx}
                      onClick={() => handleToolAction(tool.action)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all text-left group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <ToolIcon className={`w-3.5 h-3.5 ${tool.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[11.5px]">{tool.label}</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 group-hover:border-slate-700">
                        {tool.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Compact Bottom Footer: Profile + Audio Toggle + Navigation Controls */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 shrink-0">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
            {/* User Profile Info (click to jump to profile) */}
            <div
              onClick={() => handleNav("PROFILE")}
              className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0 group"
              title="Click to view & edit profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md group-hover:scale-105 transition-transform">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-200 truncate group-hover:text-orange-400 transition-colors">
                  {currentUser.name.split(",")[0]}
                </div>
                <div className="text-[10px] text-orange-400 font-mono truncate">
                  {currentUser.role}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-1 shrink-0">
              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  isMuted
                    ? "bg-slate-900 border-slate-800 text-slate-500"
                    : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                }`}
                title={isMuted ? "Unmute Audio Effects" : "Mute Audio Effects"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Home Page Link */}
              <button
                onClick={onGoHome}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Return to Landing Page"
              >
                <Home className="w-3.5 h-3.5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
