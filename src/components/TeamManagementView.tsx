"use client";

import React, { useState } from "react";
import { TeamMember, UserRole } from "@/types";
import { INITIAL_TEAM_MEMBERS } from "@/data/teamMembers";
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  Globe,
  Lock,
  X,
  Plus,
  Key
} from "lucide-react";

export const TeamManagementView: React.FC = () => {
  const [teamList, setTeamList] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Tier 1 Fraud Analyst");
  const [clearanceLevel, setClearanceLevel] = useState<"Level 1" | "Level 2" | "Level 3" | "Level 4">("Level 2");
  const [region, setRegion] = useState("North America Hub");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "INVESTIGATE",
    "STEP_UP_CHALLENGE"
  ]);

  const permissionOptions = [
    { key: "INVESTIGATE", label: "Investigate Fraud Alerts" },
    { key: "STEP_UP_CHALLENGE", label: "Dispatch Step-Up / Controlled Evidence" },
    { key: "APPROVE_ACTIONS", label: "Authorize Account Freezes & Wire Recalls" },
    { key: "SUBMIT_SAR", label: "Sign & File FinCEN Regulatory SARs" },
    { key: "GSQL_EXEC", label: "Execute Live TigerGraph GSQL Queries" },
    { key: "MANAGE_TEAM", label: "Team Admin & API Credential Provisioning" }
  ];

  const handleTogglePermission = (permKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember: TeamMember = {
      id: `TM-${(teamList.length + 1).toString().padStart(2, "0")}`,
      name: name.trim(),
      email: email.trim(),
      role,
      clearanceLevel,
      region,
      status: "ACTIVE",
      casesAssigned: 0,
      phone: phone.trim(),
      avatarBg: "bg-orange-500",
      permissions: selectedPermissions,
      joinedDate: new Date().toISOString().split("T")[0]
    };

    setTeamList([newMember, ...teamList]);
    setIsAddModalOpen(false);

    // Reset Form
    setName("");
    setEmail("");
    setPhone("+1 (555) 234-5678");
  };

  const handleRemoveMember = (id: string) => {
    setTeamList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-bold text-white tracking-tight uppercase">
              Team Roster &amp; Role-Based Access Control (RBAC)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {teamList.length} Active Personnel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage authorized investigators, clearance tiers, operational regions, and compliance sign-off permissions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Roster Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Member Name &amp; Contact</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Clearance Level</th>
                <th className="py-3 px-4">Operational Region</th>
                <th className="py-3 px-4">Assigned Cases</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Key Permissions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teamList.map((member) => (
                <tr key={member.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${member.avatarBg} flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{member.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{member.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-orange-400">{member.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300 font-bold">
                      {member.clearanceLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>{member.region}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {member.casesAssigned} active
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      member.status === "ON_SHIFT" || member.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {member.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {member.permissions.slice(0, 3).map((p, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded text-[9px] font-mono">
                          {p}
                        </span>
                      ))}
                      {member.permissions.length > 3 && (
                        <span className="text-[10px] text-slate-500 font-mono">+{member.permissions.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Deactivate Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Add New Fraud Personnel to ByteMe Sentinel
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Legal Name &amp; Title:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes, CFE"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Work Email:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="j.hayes@byteme.ai"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Direct Secure Line:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Role Title:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Tier 1 Fraud Analyst">Tier 1 Fraud Analyst</option>
                    <option value="Senior Fraud Operations Lead">Senior Fraud Operations Lead</option>
                    <option value="Bank Secrecy Act (BSA) Officer">Bank Secrecy Act (BSA) Officer</option>
                    <option value="Lead Fraud Architect">Lead Fraud Architect</option>
                    <option value="Risk Engineering Lead">Risk Engineering Lead</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Clearance Tier:</label>
                  <select
                    value={clearanceLevel}
                    onChange={(e) => setClearanceLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Level 1">Level 1 (Read-Only)</option>
                    <option value="Level 2">Level 2 (Triage Investigator)</option>
                    <option value="Level 3">Level 3 (Action Authority)</option>
                    <option value="Level 4">Level 4 (BSA &amp; Executive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assigned Operational Jurisdiction:</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. North America / EMEA High-Risk Division"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Permissions checkboxes */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">Granted System Authorities:</label>
                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {permissionOptions.map((opt) => (
                    <label key={opt.key} className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(opt.key)}
                        onChange={() => handleTogglePermission(opt.key)}
                        className="rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-900"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/30"
                >
                  Confirm &amp; Provision Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
