import { TeamMember } from "@/types";

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "TM-01",
    name: "Marcus Vance, CAMS",
    email: "analyst@byteme.ai",
    role: "Lead Fraud Architect",
    clearanceLevel: "Level 4",
    region: "National Fraud Hub, Mumbai",
    status: "ON_SHIFT",
    casesAssigned: 8,
    phone: "+91 98201 45892",
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
    region: "Compliance & FIU-IND Cell, New Delhi",
    status: "ON_SHIFT",
    casesAssigned: 4,
    phone: "+91 98110 32419",
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
    region: "Cyber Crime Cell, Bengaluru",
    status: "ON_SHIFT",
    casesAssigned: 5,
    phone: "+91 98450 88201",
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
    region: "TigerGraph Savanna Center, Goa",
    status: "ACTIVE",
    casesAssigned: 2,
    phone: "+91 94220 19842",
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
    region: "UPI & Card Triage, Hyderabad",
    status: "OFF_SHIFT",
    casesAssigned: 1,
    phone: "+91 98850 71234",
    avatarBg: "bg-emerald-600",
    permissions: ["INVESTIGATE", "DISPATCH_SMS", "STEP_UP_CHALLENGE"],
    joinedDate: "2025-01-20"
  }
];
