export type FraudTypology =
  | "Synthetic Identity Ring"
  | "Account Takeover (ATO)"
  | "Card Bust-Out & Stolen Card Velocity"
  | "Money Mule Network & Layering"
  | "Merchant Collusion & Triangulation"
  | "Legitimate / Cleared False Positive";

export type ApprovalRoute =
  | "Auto-Approved (Low Risk Tier 1)"
  | "Tier 1 Fraud Analyst Approval"
  | "Senior Fraud Operations Lead Approval"
  | "Bank Secrecy Act (BSA) / Compliance Officer"
  | "Executive Risk Committee Approval";

export type NextAction =
  | "Allow Transaction & Close Case"
  | "Allow with Ongoing Account Monitoring"
  | "Request Step-Up 3DS 2.0 Biometric Re-auth"
  | "Send SMS Cardholder Verification"
  | "Hold Funds 24 Hours Pending Verification"
  | "Temporary Account Debit Freeze"
  | "Permanent Card Cancellation & Re-issue"
  | "Freeze Account & Clawback Associated Transfers"
  | "File Suspicious Activity Report (SAR) with FinCEN"
  | "Blacklist Device Fingerprint & IP Subnet in TigerGraph"
  | "Escalate to Law Enforcement Financial Crimes Unit";

export type CaseStatus =
  | "TRIGGERED"
  | "INVESTIGATING"
  | "EVIDENCE_REQUESTED"
  | "EVIDENCE_RECEIVED"
  | "ACTION_RECOMMENDED"
  | "RESOLVED"
  | "CLOSED";

export interface GraphNode {
  id: string;
  label: string;
  type: "Customer" | "Account" | "Card" | "Transaction" | "Device" | "IPAddress" | "Merchant" | "Case";
  riskScore?: number;
  properties: Record<string, string | number | boolean>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  isFlagged?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: "USED_DEVICE" | "ASSOCIATED_IP" | "TRANSFERRED_TO" | "LINKED_CARD" | "INVOLVED_IN" | "PURCHASED_AT";
  weight?: number;
  timestamp?: string;
  isSuspicious?: boolean;
}

export interface GraphSubnetwork {
  nodes: GraphNode[];
  edges: GraphEdge[];
  communityId?: string;
  densityScore: number;
}

export interface GSQLQueryExecution {
  queryName: string;
  description: string;
  gsqlCode: string;
  parameters: Record<string, any>;
  executionTimeMs: number;
  resultSummary: string;
  returnedVerticesCount: number;
  returnedEdgesCount: number;
}

export interface InvestigationStep {
  stepNumber: number;
  title: string;
  stage: "TRIGGER" | "GRAPH_TRAVERSAL" | "EVALUATION" | "UNCERTAINTY" | "EVIDENCE_GATHERING" | "ACTION_SYNTHESIS" | "SAR_FILING" | "MEMORY_UPDATE";
  description: string;
  timestamp: string;
  status: "completed" | "in_progress" | "pending";
  agentReasoning: string;
  evidenceFound?: string[];
  gsqlExecution?: GSQLQueryExecution;
  uncertaintyScore?: number;
}

export interface ControlledEvidenceAction {
  id: string;
  name: string;
  type: "CUSTOMER_SMS_VERIFY" | "STEP_UP_BIOMETRIC" | "ANALYST_CALL" | "DEVICE_GEO_PROBE" | "MERCHANT_DISPUTE_CHECK";
  policyRule: string;
  description: string;
  initiatedAt: string;
  status: "PENDING" | "RECEIVED" | "TIMED_OUT";
  requestedDetails: string;
  responseOutcome?: {
    result: "CONFIRMED_FRAUD" | "VERIFIED_LEGITIMATE" | "NO_RESPONSE" | "FAILED_CHALLENGE";
    details: string;
    verifiedAt: string;
    confidenceDelta: number;
  };
}

export interface SuspiciousActivityReport {
  sarId: string;
  filingDate: string;
  financialInstitution: string;
  suspectName: string;
  suspectIdentifier: string;
  totalAmountAtRiskUSD: number;
  primaryTypology: FraudTypology;
  lawEnforcementCodes: string[];
  summaryNarrative: string;
  graphNexusDetails: string;
  chronologyOfEvents: string[];
  recommendedActions: string[];
  preparedBy: string;
}

export interface HistoricalCaseMemory {
  caseId: string;
  month: "Month 1" | "Month 2" | "Month 3" | "Month 4";
  typology: FraudTypology;
  verdict: "CONFIRMED_FRAUD" | "CLEARED";
  summary: string;
  keyGraphPatterns: string[];
  similarityScore?: number;
  actionTaken: string;
}

export interface FraudCase {
  id: string;
  caseNumber: number;
  title: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;

  transaction: {
    transactionId: string;
    amountUSD: number;
    timestamp: string;
    productCd: "W" | "C" | "R" | "H" | "S";
    card: {
      card1: string;
      card2: string;
      card3: string;
      card4: "visa" | "mastercard" | "discover" | "amex";
      card5: string;
      card6: "credit" | "debit";
    };
    device: {
      deviceInfo: string;
      deviceType: "mobile" | "desktop";
      os: string;
      browser: string;
      ipSubnet: string;
      geoMismatch: boolean;
      proxyOrVpnDetected: boolean;
    };
    customer: {
      customerId: string;
      name: string;
      accountAgeDays: number;
      historicalAvgTransactionUSD: number;
      accountBalanceUSD: number;
      kycTier: "FULL_KYC" | "SIMPLIFIED" | "SUSPECT";
    };
    merchant: {
      merchantId: string;
      merchantName: string;
      merchantCategory: string;
      merchantRiskLevel: "LOW" | "MEDIUM" | "HIGH";
    };
    vestaSignals: {
      c1_c14_velocity: number;
      d1_d15_delta: number;
      v_anomaly_score: number;
      initialBankModelRiskScore: number;
    };
  };

  trigger: {
    type: "RISK_SCORE_THRESHOLD" | "CUSTOMER_DISPUTE" | "ANALYST_QUEUE" | "GRAPH_RING_ALERT";
    description: string;
    score: number;
  };

  assessment: {
    predictedTypology: FraudTypology;
    initialRiskScore: number;
    initialUncertainty: number;
    finalRiskScore: number;
    finalUncertainty: number;
    confidenceScore: number;
  };

  subgraph: GraphSubnetwork;
  gsqlQueries: GSQLQueryExecution[];
  steps: InvestigationStep[];

  actionBeforeEvidence: {
    recommendedAction: NextAction;
    approvalRoute: ApprovalRoute;
    rationale: string;
    canAutoExecute: boolean;
  };

  controlledEvidence: ControlledEvidenceAction;

  actionAfterEvidence: {
    recommendedAction: NextAction;
    approvalRoute: ApprovalRoute;
    rationale: string;
    status: "PROPOSED" | "APPROVED" | "EXECUTED";
  };

  sarReport?: SuspiciousActivityReport;
  similarHistoricalCases: HistoricalCaseMemory[];
  graphMemoryPersisted: boolean;
}

// User & Role-Based Access Control Models
export type UserRole =
  | "Lead Fraud Architect"
  | "Senior Fraud Operations Lead"
  | "Tier 1 Fraud Analyst"
  | "Bank Secrecy Act (BSA) Officer"
  | "Risk Engineering Lead"
  | "VP of Fraud Risk"
  | "SecOps Incident Investigator";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clearanceLevel: "Level 1 (Read-Only)" | "Level 2 (Investigator)" | "Level 3 (Action Lead)" | "Level 4 (Executive & BSA)";
  badgeId: string;
  department: string;
  region: string;
  phone: string;
  casesInvestigated: number;
  sarFiledCount: number;
  accuracyRate: number; // e.g. 99.4%
  twoFactorEnabled: boolean;
  lastLogin: string;
  apiTokens: {
    id: string;
    name: string;
    prefix: string;
    createdDate: string;
    expiresIn: string;
    permissions: string[];
  }[];
  recentActivity: {
    id: string;
    action: string;
    targetCaseId: string;
    timestamp: string;
    status: "SUCCESS" | "FLAGGED" | "PENDING";
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clearanceLevel: "Level 1" | "Level 2" | "Level 3" | "Level 4";
  region: string;
  status: "ACTIVE" | "ON_SHIFT" | "OFF_SHIFT" | "LEAVE";
  casesAssigned: number;
  phone: string;
  avatarBg: string;
  permissions: string[];
  joinedDate: string;
}

export interface ApiIntegrationConfig {
  id: string;
  name: string;
  serviceCategory: "GRAPH_DATABASE" | "RISK_ENGINE" | "IDENTITY_VERIFICATION" | "REGULATORY_FILING" | "ALERT_WEBHOOK";
  endpoint: string;
  apiKeyMasked: string;
  status: "CONNECTED" | "DEGRADED" | "STANDBY";
  latencyMs: number;
  lastSync: string;
  description: string;
}

export interface TigerGraphConfig {
  endpoint: string;
  graphName: string;
  apiToken: string;
  secret?: string;
  useLiveConnection: boolean;
}

export type NavigationTab =
  | "DASHBOARD"
  | "INVESTIGATION"
  | "CASES"
  | "BATCH_EVALUATION"
  | "ANALYTICS"
  | "TEAM"
  | "PROFILE"
  | "SETTINGS";
