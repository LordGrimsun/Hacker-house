import { UserProfile } from "@/types";

export const INITIAL_USER_PROFILE: UserProfile = {
  id: "USR-BYTEME-001",
  name: "Marcus Vance, CAMS",
  email: "analyst@byteme.ai",
  role: "Lead Fraud Architect",
  clearanceLevel: "Level 4 (Executive & BSA)",
  badgeId: "BYTEME-TG-8819",
  department: "Financial Crimes & Graph Intelligence Unit",
  region: "National Cyber Cell & FIU-IND Hub, Mumbai",
  phone: "+91 98201 45892",
  casesInvestigated: 418,
  sarFiledCount: 64,
  accuracyRate: 99.4,
  twoFactorEnabled: true,
  lastLogin: "2026-09-24 09:45 IST",
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
      name: "FIU-IND / FinCEN Regulatory XML Submitter",
      prefix: "fiu_efile_***88",
      createdDate: "2026-08-15",
      expiresIn: "120 days",
      permissions: ["SAR_PREVIEW", "SAR_SUBMIT"]
    }
  ],
  recentActivity: [
    {
      id: "ACT-01",
      action: "Executed 3DS 2.0 Biometric Re-auth on Rs. 3,450 International TXN",
      targetCaseId: "CASE-BENCH-03",
      timestamp: "12 mins ago",
      status: "SUCCESS"
    },
    {
      id: "ACT-02",
      action: "Triggered Emergency IMPS / Wire Clawback on Rs. 24,500 Mule Transfer",
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
      action: "Approved FIU-IND Suspicious Activity Report (STR / SAR #001)",
      targetCaseId: "CASE-BENCH-01",
      timestamp: "3 hours ago",
      status: "SUCCESS"
    }
  ]
};
