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
  uncertaintyScore?: number; // 0 (certain) to 100 (high uncertainty)
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
    confidenceDelta: number; // e.g. -45% uncertainty or +30% fraud risk
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
  id: string; // e.g., CASE-BENCH-01
  caseNumber: number; // 1 to 20
  title: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;

  // Transaction details (IEEE-CIS standard)
  transaction: {
    transactionId: string;
    amountUSD: number;
    timestamp: string;
    productCd: "W" | "C" | "R" | "H" | "S";
    card: {
      card1: string; // BIN
      card2: string; // issuer
      card3: string; // country code
      card4: "visa" | "mastercard" | "discover" | "amex";
      card5: string; // category
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
      initialBankModelRiskScore: number; // 0.00 to 1.00
    };
  };

  // Trigger
  trigger: {
    type: "RISK_SCORE_THRESHOLD" | "CUSTOMER_DISPUTE" | "ANALYST_QUEUE" | "GRAPH_RING_ALERT";
    description: string;
    score: number;
  };

  // Typology & Risk
  assessment: {
    predictedTypology: FraudTypology;
    initialRiskScore: number;
    initialUncertainty: number; // 0-100%
    finalRiskScore: number;
    finalUncertainty: number;
    confidenceScore: number; // 0-100%
  };

  // Graph Evidence
  subgraph: GraphSubnetwork;
  gsqlQueries: GSQLQueryExecution[];

  // Investigation Trace
  steps: InvestigationStep[];

  // Actions Before Evidence
  actionBeforeEvidence: {
    recommendedAction: NextAction;
    approvalRoute: ApprovalRoute;
    rationale: string;
    canAutoExecute: boolean;
  };

  // Controlled Evidence
  controlledEvidence: ControlledEvidenceAction;

  // Actions After Evidence
  actionAfterEvidence: {
    recommendedAction: NextAction;
    approvalRoute: ApprovalRoute;
    rationale: string;
    status: "PROPOSED" | "APPROVED" | "EXECUTED";
  };

  // SAR
  sarReport?: SuspiciousActivityReport;

  // Historical Memory Match
  similarHistoricalCases: HistoricalCaseMemory[];

  // Graph Writeback Record
  graphMemoryPersisted: boolean;
}
