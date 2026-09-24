export interface FraudPolicyRule {
  id: string;
  name: string;
  category: "STEP_UP" | "AUTO_BLOCK" | "SAR_FILING" | "APPROVAL_ROUTING" | "GRAPH_INVESTIGATION";
  triggerCondition: string;
  mandatoryAction: string;
  authorizedRole: string;
  regulatoryReference: string;
  description: string;
}

export const BANK_FRAUD_POLICIES: FraudPolicyRule[] = [
  {
    id: "POL-001-STEP-UP",
    name: "Uncertain Signal Controlled Evidence Protocol",
    category: "STEP_UP",
    triggerCondition: "Model risk score between 0.65 and 0.85 OR uncertainty > 40% with device fingerprint mismatch",
    mandatoryAction: "Issue 3DS 2.0 biometric re-authentication or out-of-band SMS challenge before blocking card.",
    authorizedRole: "Autonomous Agent Pre-Approved",
    regulatoryReference: "FFIEC Authentication in an Internet Banking Environment (Section III.B)",
    description: "When fraud signals indicate suspicion but customer identity is unconfirmed, mandatory controlled evidence gathering must be executed to prevent false decline friction while protecting account balances."
  },
  {
    id: "POL-002-SAR-MANDATORY",
    name: "FinCEN Suspicious Activity Report (SAR) Filing Threshold",
    category: "SAR_FILING",
    triggerCondition: "Confirmed or strongly indicated financial crime activity with aggregated exposure exceeding $5,000 USD OR any transaction involving money mule layering rings",
    mandatoryAction: "Generate complete FinCEN SAR XML package with graph nexus within 30 days of investigation conclusion.",
    authorizedRole: "Bank Secrecy Act (BSA) Officer / Compliance Director",
    regulatoryReference: "31 CFR 1020.320 & USA PATRIOT Act Section 314(b)",
    description: "Any synthetic identity ring, mule fan-in/fan-out, or coordinated card bust-out exceeding regulatory thresholds requires immediate automated SAR generation and submission to compliance queue."
  },
  {
    id: "POL-003-ACCOUNT-FREEZE",
    name: "Emergency Debit Freeze & Clawback Matrix",
    category: "AUTO_BLOCK",
    triggerCondition: "Mule fan-out network detected with velocity > 3 outbound hops within 60 minutes OR confirmed ATO",
    mandatoryAction: "Immediate autonomous debit freeze on recipient accounts and automated notification to receiving financial institutions.",
    authorizedRole: "Senior Fraud Operations Lead or Autonomous Agent under Critical Emergency Policy",
    regulatoryReference: "Uniform Commercial Code (UCC) Article 4A & NACHA Rule 1.11",
    description: "Rapid intervention to intercept laundered funds before external crypto-offramp or ATM extraction occurs."
  },
  {
    id: "POL-004-SYNTHETIC-RING",
    name: "Synthetic Identity Graph Disruption Rule",
    category: "GRAPH_INVESTIGATION",
    triggerCondition: "TigerGraph Louvain community detects >= 3 accounts sharing identical SSN fragment, virtual phone prefix, or device hardware hash",
    mandatoryAction: "Traverse 2-hop graph neighborhood, link all associated synthetic profiles, freeze linked credit lines.",
    authorizedRole: "Tier 1 Fraud Analyst Approval with Graph Visual Audit",
    regulatoryReference: "Federal Reserve Synthetic Identity Fraud Mitigation Framework",
    description: "Synthetic identities rely on shared credit repair or fake identity attributes. When graph traversal reveals shared credentials, the entire component must be marked for joint closure."
  },
  {
    id: "POL-005-FALSE-POSITIVE-CLEAR",
    name: "Safe Passage & False Positive Resolution",
    category: "APPROVAL_ROUTING",
    triggerCondition: "Customer successfully confirms transaction via out-of-band challenge AND graph shows long-standing clean KYC profile with 0 shared blacklisted devices",
    mandatoryAction: "Release transaction hold immediately, whitelisting device fingerprint for 30 days to avoid future customer friction.",
    authorizedRole: "Tier 1 Fraud Analyst or Autonomous Agent",
    regulatoryReference: "Consumer Financial Protection Bureau (CFPB) Regulation E",
    description: "Protects high-value genuine customers traveling or upgrading hardware from repeated wrongful account locks."
  }
];

export const FRAUD_TYPOLOGIES_KNOWLEDGE = [
  {
    id: "TYP-1",
    name: "Synthetic Identity Ring",
    signals: ["Fabricated SSNs paired with real addresses", "Rapid credit file creation (piggybacking authorized user tradelines)", "Multiple accounts sharing identical physical device hashes or disposable VOIP numbers", "Dormant accounts suddenly active at high credit utilization"],
    graphSignature: "Dense bipartite graph between Customer nodes and shared Device/IP/Address nodes with Louvain modularity score > 0.72",
    recommendedInvestigationPath: "Traverse 2 hops from Account -> Device -> Other Accounts. Query SSN issuance database. Assess common mailbox drop address."
  },
  {
    id: "TYP-2",
    name: "Account Takeover (ATO)",
    signals: ["Login from previously unseen device/browser user-agent", "Immediate high-value wire, gift card purchase, or password/email change within 10 minutes of session", "High proxy/VPN confidence score on IPAddress node", "Vesta D1-D15 delta deviation > 4.5 standard deviations"],
    graphSignature: "Sudden branch edge from existing Customer to new Device node with high edge velocity, followed immediately by high-outdegree Transaction nodes",
    recommendedInvestigationPath: "Execute Step-Up 3DS 2.0 biometric re-auth. Probe IP subnet for datacenter/Tor exit nodes. Verify SIM swap records."
  },
  {
    id: "TYP-3",
    name: "Card Bust-Out & Stolen Card Velocity",
    signals: ["Series of micro-authorizations ($1-$5) followed by rapid maximal limit charges across multiple merchant categories", "Multiple cards from different issuing BINs tried in rapid succession on the same device", "Declines for incorrect CVV/expiration followed by immediate retry with alternate cards"],
    graphSignature: "Star topology: Single Device/IP node linked to 5+ distinct Card vertices within a 2-hour window",
    recommendedInvestigationPath: "Calculate 1-hour rolling velocity GSQL query. Immediately cancel and reissue card. Blacklist device hardware fingerprint."
  },
  {
    id: "TYP-4",
    name: "Money Mule Network & Layering",
    signals: ["Incoming wire or P2P transfer immediately split into smaller round-sum outbound transfers to multiple unverified recipients (smurfing)", "New account with zero genuine merchant history serving purely as a transit conduit", "Funds withdrawn via international ATMs or crypto exchanges"],
    graphSignature: "Directed acyclic graph (DAG) or circular flow (cycle detection) with high fan-in (in-degree > 5) quickly converted to high fan-out (out-degree > 5)",
    recommendedInvestigationPath: "Run TigerGraph GSQL multi-hop cycle detection and flow centrality algorithms. Place immediate debit freeze on beneficiary accounts."
  },
  {
    id: "TYP-5",
    name: "Merchant Collusion & Triangulation",
    signals: ["High ratio of refunds or disputes linked to a specific newly registered online merchant", "Customers claim goods never arrived while third-party buyer received stolen goods paid with compromised cards", "Cardholders geographically dispersed from merchant registration address"],
    graphSignature: "High centrality Merchant node with disproportionate cluster of disputed Transaction nodes and chargeback edges",
    recommendedInvestigationPath: "Cross-reference merchant processing account with bank settlement ledger. Freeze merchant payout reserves."
  }
];
