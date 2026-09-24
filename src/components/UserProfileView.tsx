"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
import { INITIAL_USER_PROFILE } from "@/data/userProfile";
import {
  User,
  Shield,
  Key,
  Lock,
  Mail,
  Phone,
  Building,
  Globe,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Plus
} from "lucide-react";

export const UserProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isSaved, setIsSaved] = useState(false);

  // Form Fields
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [department, setDepartment] = useState(profile.department);
  const [region, setRegion] = useState(profile.region);
  const [twoFactor, setTwoFactor] = useState(profile.twoFactorEnabled);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name,
      phone,
      department,
      region,
      twoFactorEnabled: twoFactor,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Badge */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 via-tiger-500 to-amber-500 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-orange-500/20 ring-2 ring-orange-400/40">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{profile.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Badge: <span className="text-white font-bold">{profile.badgeId}</span> • Clearance:{" "}
              <span className="text-emerald-400 font-bold">{profile.clearanceLevel}</span>
            </p>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-500 uppercase block">Cases Investigated</span>
            <span className="font-bold text-white text-base">{profile.casesInvestigated}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-500 uppercase block">SARs Filed</span>
            <span className="font-bold text-purple-400 text-base">{profile.sarFiledCount}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-500 uppercase block">Triage Accuracy</span>
            <span className="font-bold text-emerald-400 text-base">{profile.accuracyRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Settings + API Tokens + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Edit Personal Info */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Investigator Identity &amp; Contact Details
              </h2>
            </div>
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Legal Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Enterprise Work Email:</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800/80 rounded-xl text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Direct Secure Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Department / Division:</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Operational Region / Oversight:</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* 2FA Toggle */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-semibold block">Hardware Security Key / 2FA:</span>
                <p className="text-[11px] text-slate-400">
                  Enforce FIDO2 / WebAuthn biometric verification for high-value wire freezes and FinCEN SAR filings.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/30 flex items-center space-x-1.5 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 cols: API Tokens & Recent Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active API Keys */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Investigator API Keys
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">2 Active</span>
            </div>

            <div className="space-y-2 text-xs">
              {profile.apiTokens.map((tok) => (
                <div key={tok.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white truncate max-w-[200px]">{tok.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{tok.expiresIn}</span>
                  </div>
                  <div className="font-mono text-[11px] text-orange-400 bg-slate-950 p-1.5 rounded border border-slate-800">
                    {tok.prefix}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Activity Stream */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recent Investigation Audit Trail
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {profile.recentActivity.map((act) => (
                <div key={act.id} className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-slate-200 font-medium leading-relaxed">{act.action}</p>
                    <span className="text-[10px] font-mono text-orange-400 font-semibold">{act.targetCaseId}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
