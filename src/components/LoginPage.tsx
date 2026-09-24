"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Cpu,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle2,
  Database
} from "lucide-react";
import { UserRole } from "@/types";

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: UserRole }) => void;
  onBackToHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToHome }) => {
  const [email, setEmail] = useState("analyst@byteme.ai");
  const [password, setPassword] = useState("TigerGraph2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (email.trim() && password.trim()) {
        onLogin({
          name: "Marcus Vance, CAMS",
          email: email.trim(),
          role: "Lead Fraud Architect"
        });
      } else {
        setError("Please enter both work email and security credential.");
      }
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = (role: UserRole, demoEmail: string, name: string) => {
    setEmail(demoEmail);
    setPassword("TigerGraph2026!");
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name,
        email: demoEmail,
        role
      });
      setIsLoading(false);
    }, 300);
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText("analyst@byteme.ai / TigerGraph2026!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#060911] text-slate-100 p-4 relative overflow-hidden">
      {/* Background cyber glow accents */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Home Button */}
      {onBackToHome && (
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-5 my-8">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-tiger-500 to-amber-600 shadow-xl shadow-orange-500/20 ring-1 ring-orange-400/40 mb-1">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              TigerGraph <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Sentinel</span>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
              Team ByteMe
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-400 text-xs font-mono">HHGOA 2026</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Autonomous Graph AI Agent for Investigation, Uncertainty Reasoning &amp; Next-Best Action
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Security Portal Access
              </h2>
              <p className="text-[11px] text-slate-400">
                Authenticate to access the 20-case IEEE-CIS investigation terminal
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyCredentials}
              className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy Access Key"}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Enterprise Work ID:</span>
                <span className="text-[10px] text-slate-500 font-mono">Default: analyst@byteme.ai</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@byteme.ai"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Security Key / Password:</span>
                <span className="text-[10px] text-slate-500 font-mono">Default: TigerGraph2026!</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-tiger-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating Session..." : "Access Investigation Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              1-Click Instant Logins (Choose Persona):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("Lead Fraud Architect", "marcus.vance@byteme.ai", "Marcus Vance, CAMS")}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/50 text-left transition-all text-slate-300 group"
              >
                <div className="font-semibold text-orange-400 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Lead Architect</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">marcus.vance@byteme.ai</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("Bank Secrecy Act (BSA) Officer", "sarah.jenkins@byteme.ai", "Sarah Jenkins, CAMS")}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all text-slate-300 group"
              >
                <div className="font-semibold text-purple-400 text-xs flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>BSA Officer</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">sarah.jenkins@byteme.ai</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("VP of Fraud Risk", "david.zhao@byteme.ai", "David Zhao")}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-left transition-all text-slate-300 group"
              >
                <div className="font-semibold text-blue-400 text-xs flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                  <span>Risk VP</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">david.zhao@byteme.ai</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("Tier 1 Fraud Analyst", "elena.rostova@byteme.ai", "Elena Rostova")}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-left transition-all text-slate-300 group"
              >
                <div className="font-semibold text-emerald-400 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SecOps Analyst</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">elena.rostova@byteme.ai</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info badge */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center space-x-3 font-mono">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" /> Savanna Ready
          </span>
          <span>•</span>
          <span>FinCEN 31 CFR 1020.320</span>
          <span>•</span>
          <span>20 IEEE-CIS Cases</span>
        </div>
      </div>
    </div>
  );
};
