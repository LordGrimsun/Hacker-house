import { TeamMember } from "@/types";

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "TM-01",
    name: "Marcus Vance, CAMS",
    email: "analyst@byteme.ai",
    role: "Lead Fraud Architect",
    clearanceLevel: "Level 4",
    region: "Global Operations",
    status: "ON_SHIFT",
    casesAssigned: 8,
    phone: "+1 (415) 890-4412",
    avatarBg: "bg-orange-500",
    permissions: ["INVESTIGATE", "APPROVE_ACTIONS", "SUBMIT_SAR", "GSQL_EXEC", "MANAGE_TEAM"],
    joinedDate: "2024-02-10"
  },
  {
    id: "TM-02",
    name: "Sarah Jenkins, JD",
    email: "s.jenkins@byteme.ai",
    role: "Bank Secrecy Act (BSA) Officer",
    clearanceLevel: "Level 4",
    region: "Americas / FinCEN",
    status: "ON_SHIFT",
    casesAssigned: 4,
    phone: "+1 (212) 555-0192",
    avatarBg: "bg-purple-600",
    permissions: ["SUBMIT_SAR", "COMPLIANCE_SIGN_OFF", "REGULATORY_AUDIT"],
    joinedDate: "2024-04-18"
  },
  {
    id: "TM-03",
    name: "Devon Thorne",
    email: "d.thorne@byteme.ai",
    role: "Senior Fraud Operations Lead",
    clearanceLevel: "Level 3",
    region: "EMEA Risk Hub",
    status: "ON_SHIFT",
    casesAssigned: 5,
    phone: "+44 20 7946 0912",
    avatarBg: "bg-blue-600",
    permissions: ["INVESTIGATE", "APPROVE_ACTIONS", "FREEZE_ACCOUNTS", "RECALL_WIRES"],
    joinedDate: "2024-06-01"
  },
  {
    id: "TM-04",
    name: "Priya Nair",
    email: "p.nair@byteme.ai",
    role: "Risk Engineering Lead",
    clearanceLevel: "Level 3",
    region: "APAC Infrastructure",
    status: "ACTIVE",
    casesAssigned: 2,
    phone: "+65 6712 9001",
    avatarBg: "bg-cyan-600",
    permissions: ["GSQL_EXEC", "TUNING_ALGORITHMS", "SAVANNA_CONFIG", "API_KEYS"],
    joinedDate: "2024-08-15"
  },
  {
    id: "TM-05",
    name: "Alexei Volkov",
    email: "a.volkov@byteme.ai",
    role: "Tier 1 Fraud Analyst",
    clearanceLevel: "Level 2",
    region: "Cardholder Triage",
    status: "OFF_SHIFT",
    casesAssigned: 1,
    phone: "+1 (312) 555-9018",
    avatarBg: "bg-emerald-600",
    permissions: ["INVESTIGATE", "DISPATCH_SMS", "STEP_UP_CHALLENGE"],
    joinedDate: "2025-01-20"
  }
];
