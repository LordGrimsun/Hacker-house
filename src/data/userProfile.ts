import { UserProfile } from "@/types";

export const INITIAL_USER_PROFILE: UserProfile = {
  id: "USR-BYTEME-001",
  name: "Marcus Vance, CAMS",
  email: "analyst@byteme.ai",
  role: "Lead Fraud Architect",
  clearanceLevel: "Level 4 (Executive & BSA)",
  badgeId: "BYTEME-TG-8819",
  department: "Financial Crimes & Graph Intelligence Unit",
  region: "North America & EMEA Oversight",
  phone: "+1 (415) 890-4412",
  casesInvestigated: 418,
  sarFiledCount: 64,
  accuracyRate: 99.4,
  twoFactorEnabled: true,
  lastLogin: "2026-09-24 09:45 UTC",
  apiTokens: [
    {
      id: "TOK-01",
      name: "TigerGraph Savanna Production Agent Secret",
      prefix: "tg_savanna_live_***9a",
      createdDate: "2026-08-01",
      expiresIn: "340 days",
      permissions: ["GSQL_EXECUTE", "SCHEMA_READ", "VERTEX_UPSERT"]
    },
    {
      id: "TOK-02",
      name: "FinCEN BSA Direct XML Submitter",
      prefix: "fincen_efile_***88",
      createdDate: "2026-08-15",
      expiresIn: "120 days",
      permissions: ["SAR_PREVIEW", "SAR_SUBMIT"]
    }
  ],
  recentActivity: [
    {
      id: "ACT-01",
      action: "Executed 3DS 2.0 Biometric Re-auth on London Hotel TXN",
      targetCaseId: "CASE-BENCH-03",
      timestamp: "12 mins ago",
      status: "SUCCESS"
    },
    {
      id: "ACT-02",
      action: "Triggered Emergency Wire Clawback on $24,500 Mule Transfer",
      targetCaseId: "CASE-BENCH-04",
      timestamp: "38 mins ago",
      status: "FLAGGED"
    },
    {
      id: "ACT-03",
      action: "Seized Commercial Mailbox Synthetic Identity Cluster",
      targetCaseId: "CASE-BENCH-02",
      timestamp: "2 hours ago",
      status: "SUCCESS"
    },
    {
      id: "ACT-04",
      action: "Approved FinCEN Suspicious Activity Report (SAR #001)",
      targetCaseId: "CASE-BENCH-01",
      timestamp: "3 hours ago",
      status: "SUCCESS"
    }
  ]
};
