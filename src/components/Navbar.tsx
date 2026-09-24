"use client";

import React, { useState } from "react";
import { NavigationTab, UserRole } from "@/types";
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
  Menu,
  X,
  Database,
  Download,
  Terminal,
  Bell
} from "lucide-react";

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentUser: { name: string; email: string; role: UserRole };
  onLogout: () => void;
  onOpenGsqlStudio: () => void;
  onOpenExporter: () => void;
  totalCases: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenGsqlStudio,
  onOpenExporter,
  totalCases,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { tab: NavigationTab; label: string; icon: any }[] = [
    { tab: "DASHBOARD", label: "Command Center", icon: LayoutDashboard },
    { tab: "INVESTIGATION", label: "Investigation Studio", icon: Cpu },
    { tab: "CASES", label: "Case Queue (20)", icon: Layers },
    { tab: "ANALYTICS", label: "Fraud Intelligence", icon: BarChart3 },
    { tab: "TEAM", label: "Team & Roles", icon: Users },
    { tab: "PROFILE", label: "User Profile", icon: User },
    { tab: "SETTINGS", label: "Settings & APIs", icon: Settings },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-950/95 border-b border-slate-800/80 backdrop-blur sticky top-0 z-50 px-4 lg:px-6 py-2.5 shadow-xl">
      <div className="flex items-center justify-between">
        {/* Brand & Team Name */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => onSelectTab("DASHBOARD")}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-tiger-500 to-amber-600 shadow-md shadow-orange-500/20 ring-1 ring-orange-400/40">
              <ShieldAlert className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-white">TigerGraph</span>
                <span className="font-bold text-base bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Sentinel
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full">
                  ByteMe
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                HHGOA 2026 • Agentic Fraud Platform
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden xl:flex items-center space-x-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold shadow-md shadow-orange-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions & User Profile Badge */}
        <div className="flex items-center space-x-2.5">
          {/* Fast GSQL query studio */}
          <button
            onClick={onOpenGsqlStudio}
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-colors"
            title="Open TigerGraph GSQL Studio"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">GSQL Studio</span>
          </button>

          {/* Export benchmark package */}
          <button
            onClick={onOpenExporter}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 text-xs font-semibold transition-all hover:scale-[1.02]"
            title="Download Official 20-Case Benchmark Package"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 20 Cases</span>
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => onSelectTab("PROFILE")}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-[11px] text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-200 leading-none">{currentUser.name.split(",")[0]}</div>
              <div className="text-[10px] text-orange-400 font-mono mt-0.5">{currentUser.role.slice(0, 16)}...</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 xl:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-slate-800 space-y-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-orange-500 text-white font-bold"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs px-2">
            <button
              onClick={() => {
                onOpenGsqlStudio();
                setMobileMenuOpen(false);
              }}
              className="text-cyan-400 font-mono flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" /> GSQL Studio
            </button>
            <button
              onClick={() => {
                onOpenExporter();
                setMobileMenuOpen(false);
              }}
              className="text-orange-400 font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export 20 Cases
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
