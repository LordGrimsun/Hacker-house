import { FraudCase } from "@/types";

export const BENCHMARK_CASES: FraudCase[] = [
  // CASE 1: Account Takeover (ATO) with Residential Proxy
  {
    id: "CASE-BENCH-01",
    caseNumber: 1,
    title: "Suspicious $4,850 Electronics Purchase via Unrecognized Device",
    status: "ACTION_RECOMMENDED",
    createdAt: "2026-08-02T14:22:10Z",
    updatedAt: "2026-08-02T14:28:45Z",
    transaction: {
      transactionId: "TXN-3829101",
      amountUSD: 4850.00,
      timestamp: "2026-08-02T14:20:00Z",
      productCd: "W",
      card: {
        card1: "13524",
        card2: "555",
        card3: "150",
        card4: "visa",
        card5: "226",
        card6: "credit"
      },
      device: {
        deviceInfo: "Windows 11 Chrome 124.0.0",
        deviceType: "desktop",
        os: "Windows",
        browser: "Chrome",
        ipSubnet: "185.220.101.0/24",
        geoMismatch: true,
        proxyOrVpnDetected: true
      },
      customer: {
        customerId: "CUST-88129",
        name: "Marcus Vance",
        accountAgeDays: 1420,
        historicalAvgTransactionUSD: 85.50,
        accountBalanceUSD: 14200.00,
        kycTier: "FULL_KYC"
      },
      merchant: {
        merchantId: "MERCH-7712",
        merchantName: "Apex Digital Direct",
        merchantCategory: "Consumer Electronics & Crypto Hardware",
        merchantRiskLevel: "HIGH"
      },
      vestaSignals: {
        c1_c14_velocity: 8,
        d1_d15_delta: 0.05,
        v_anomaly_score: 0.89,
        initialBankModelRiskScore: 0.84
      }
    },
    trigger: {
      type: "RISK_SCORE_THRESHOLD",
      description: "Bank Model Risk Score 0.84 exceeded 0.80 threshold with geo-teleportation signal (Customer home: Chicago; Session IP: Frankfurt Tor Exit).",
      score: 0.84
    },
    assessment: {
      predictedTypology: "Account Takeover (ATO)",
      initialRiskScore: 0.84,
      initialUncertainty: 42,
      finalRiskScore: 0.96,
      finalUncertainty: 4,
      confidenceScore: 96
    },
    subgraph: {
      densityScore: 0.68,
      communityId: "COMM-ATO-99",
      nodes: [
        { id: "CUST-88129", label: "Marcus Vance (Victim)", type: "Customer", riskScore: 0.15, properties: { tenure_years: 4, credit_limit: 15000 } },
        { id: "ACC-54219", label: "Marcus Checking 54219", type: "Account", riskScore: 0.20, properties: { balance: 14200 } },
        { id: "CARD-13524", label: "Visa Signature 13524", type: "Card", riskScore: 0.35, properties: { bin: "13524", issuer: "First Horizon" } },
        { id: "TXN-3829101", label: "TXN $4,850.00", type: "Transaction", riskScore: 0.84, properties: { amount: 4850, product: "W" }, isFlagged: true },
        { id: "DEV-SUSP-11", label: "Tor Desktop Linux/Win", type: "Device", riskScore: 0.95, properties: { fingerprint: "fp_98a72b", user_agent: "Chrome 124" }, isFlagged: true },
        { id: "IP-185-220", label: "185.220.101.44 (Frankfurt)", type: "IPAddress", riskScore: 0.98, properties: { is_tor: true, asn: "AS60729" }, isFlagged: true },
        { id: "MERCH-7712", label: "Apex Digital Direct", type: "Merchant", riskScore: 0.62, properties: { category: "Electronics", dispute_rate: "4.8%" } }
      ],
      edges: [
        { id: "e1", source: "CUST-88129", target: "ACC-54219", label: "OWNS", type: "LINKED_CARD" },
        { id: "e2", source: "ACC-54219", target: "CARD-13524", label: "ISSUED_FOR", type: "LINKED_CARD" },
        { id: "e3", source: "CARD-13524", target: "TXN-3829101", label: "USED_IN", type: "INVOLVED_IN", isSuspicious: true },
        { id: "e4", source: "TXN-3829101", target: "DEV-SUSP-11", label: "ORIGINATED_DEVICE", type: "USED_DEVICE", isSuspicious: true },
        { id: "e5", source: "TXN-3829101", target: "IP-185-220", label: "CONNECTION_IP", type: "ASSOCIATED_IP", isSuspicious: true },
        { id: "e6", source: "TXN-3829101", target: "MERCH-7712", label: "DESTINATION", type: "PURCHASED_AT" }
      ]
    },
    gsqlQueries: [
      {
        queryName: "find_shared_device_rings",
        description: "Traverse 2 hops from suspect device to identify shared credentials or compromised accounts",
        gsqlCode: "INTERPRET QUERY (VERTEX<Device> dev) SYNTAX v2 {\n  Seed = {dev};\n  Txns = SELECT t FROM Seed:s -(USED_DEVICE)- Transaction:t;\n  Cards = SELECT c FROM Txns:t -(LINKED_CARD)- Card:c;\n  PRINT Cards.size(), Txns.size();\n}",
        parameters: { dev: "DEV-SUSP-11" },
        executionTimeMs: 14,
        resultSummary: "Device previously seen across 3 failed authentication probes in last 24h against disparate cards.",
        returnedVerticesCount: 4,
        returnedEdgesCount: 6
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Ingestion & Anomaly Trigger",
        stage: "TRIGGER",
        description: "Risk score 0.84 flagged for transaction $4,850 at high-risk merchant with sudden IP teleportation.",
        timestamp: "2026-08-02T14:20:05Z",
        status: "completed",
        agentReasoning: "Transaction amount is 56x customer's historical average. Origin IP is known Tor exit node."
      },
      {
        stepNumber: 2,
        title: "TigerGraph 2-Hop Traversal",
        stage: "GRAPH_TRAVERSAL",
        description: "Ran TigerGraph GSQL `find_shared_device_rings` on DEV-SUSP-11.",
        timestamp: "2026-08-02T14:20:12Z",
        status: "completed",
        agentReasoning: "Device fingerprint has never interacted with Marcus Vance before. However, the card details are authentic.",
        evidenceFound: ["Device fingerprint is new to customer", "IP is Tor Exit Node AS60729", "Amount is 56x historical average"]
      },
      {
        stepNumber: 3,
        title: "Uncertainty & Policy Assessment",
        stage: "UNCERTAINTY",
        description: "Initial uncertainty calculated at 42%. Legitimate cardholder may be traveling abroad with VPN.",
        timestamp: "2026-08-02T14:20:25Z",
        status: "completed",
        agentReasoning: "Bank Policy POL-001 mandates controlled evidence gathering before irreversible card blocking when uncertainty > 40%.",
        uncertaintyScore: 42
      },
      {
        stepNumber: 4,
        title: "Controlled Evidence Gathering",
        stage: "EVIDENCE_GATHERING",
        description: "Issued real-time Out-of-Band Push Notification & SMS Challenge to verified telephone on file.",
        timestamp: "2026-08-02T14:21:00Z",
        status: "completed",
        agentReasoning: "Awaiting customer validation response. Temporary 15-minute authorization hold applied."
      },
      {
        stepNumber: 5,
        title: "Evidence Ingestion & Uncertainty Collapse",
        stage: "ACTION_SYNTHESIS",
        description: "Customer clicked 'NO - I DID NOT AUTHORIZE' on mobile push alert within 180 seconds.",
        timestamp: "2026-08-02T14:24:00Z",
        status: "completed",
        agentReasoning: "Uncertainty collapsed from 42% to 4%. ATO confirmed. Escalating to immediate permanent card block."
      }
    ],
    actionBeforeEvidence: {
      recommendedAction: "Hold Funds 24 Hours Pending Verification",
      approvalRoute: "Tier 1 Fraud Analyst Approval",
      rationale: "High risk score (0.84) and Tor IP, but unverified whether cardholder is traveling. Hold authorization and execute 3DS/SMS step-up.",
      canAutoExecute: true
    },
    controlledEvidence: {
      id: "EVID-01",
      name: "Out-of-Band Cardholder Push Challenge",
      type: "CUSTOMER_SMS_VERIFY",
      policyRule: "POL-001-STEP-UP",
      description: "Direct mobile app challenge sent to primary iPhone registered to Marcus Vance.",
      initiatedAt: "2026-08-02T14:21:00Z",
      status: "RECEIVED",
      requestedDetails: "Verify $4,850 purchase at Apex Digital Direct from unrecognized Frankfurt device.",
      responseOutcome: {
        result: "CONFIRMED_FRAUD",
        details: "Customer explicitly responded: 'Fraud! My card is in my wallet in Chicago, I did not authorize Apex Digital.'",
        verifiedAt: "2026-08-02T14:23:45Z",
        confidenceDelta: 38
      }
    },
    actionAfterEvidence: {
      recommendedAction: "Permanent Card Cancellation & Re-issue",
      approvalRoute: "Senior Fraud Operations Lead Approval",
      rationale: "Customer confirmed unauthorized compromise. Transaction rejected; card destroyed and re-issued; IP blacklisted in graph.",
      status: "EXECUTED"
    },
    sarReport: {
      sarId: "SAR-2026-BENCH-001",
      filingDate: "2026-08-02",
      financialInstitution: "Horizon National Bank NA",
      suspectName: "Unknown Threat Actor (Tor Node: 185.220.101.44)",
      suspectIdentifier: "IP-185.220.101.44 / DEV-SUSP-11",
      totalAmountAtRiskUSD: 4850.00,
      primaryTypology: "Account Takeover (ATO)",
      lawEnforcementCodes: ["CYBER_ATO", "IDENTITY_THEFT_CREDENTIAL"],
      summaryNarrative: "On August 2, 2026, an unauthorized electronic commerce transaction of $4,850.00 was attempted against account holder Marcus Vance. The transaction originated via a known Tor exit node (185.220.101.44) using a new device fingerprint. Out-of-band verification confirmed account takeover. The transaction was intercepted with $0 loss. Full credentials invalidated.",
      graphNexusDetails: "TigerGraph community analysis identified DEV-SUSP-11 linked to 3 prior credential stuffing attempts across regional card BIN 13524.",
      chronologyOfEvents: [
        "14:20:00Z - Transaction $4,850 attempted at Apex Digital Direct",
        "14:20:05Z - Bank model score 0.84 triggers autonomous investigation",
        "14:21:00Z - Agent requests out-of-band SMS/Push verification",
        "14:23:45Z - Victim confirms unauthorized activity",
        "14:24:10Z - Transaction voided, card cancelled, SAR drafted"
      ],
      recommendedActions: [
        "Permanently cancel Visa 13524",
        "Blacklist device fingerprint fp_98a72b in TigerGraph database",
        "Enforce mandatory password reset on Marcus Vance web portal"
      ],
      preparedBy: "Agentic Fraud Investigation Unit (Team ByteMe)"
    },
    similarHistoricalCases: [
      {
        caseId: "MEM-M1-001",
        month: "Month 1",
        typology: "Account Takeover (ATO)",
        verdict: "CONFIRMED_FRAUD",
        summary: "Session hijack via residential proxy resulting in unauthorized high-value transfer immediately after new device registration.",
        keyGraphPatterns: ["New Device with spoofed UA", "IP geolocated to European VPN", "Out-of-band rejection"],
        similarityScore: 0.94,
        actionTaken: "Card re-issued, device blacklisted."
      }
    ],
    graphMemoryPersisted: true
  },

  // CASE 2: Synthetic Identity Ring with Shared Address and Device
  {
    id: "CASE-BENCH-02",
    caseNumber: 2,
    title: "Synthetic Identity Bust-Out Ring Across 4 Interconnected Accounts",
    status: "ACTION_RECOMMENDED",
    createdAt: "2026-08-04T09:15:00Z",
    updatedAt: "2026-08-04T09:22:15Z",
    transaction: {
      transactionId: "TXN-3840112",
      amountUSD: 7200.00,
      timestamp: "2026-08-04T09:12:30Z",
      productCd: "W",
      card: {
        card1: "18201",
        card2: "321",
        card3: "150",
        card4: "mastercard",
        card5: "166",
        card6: "credit"
      },
      device: {
        deviceInfo: "macOS 14.5 Safari 17.5",
        deviceType: "desktop",
        os: "macOS",
        browser: "Safari",
        ipSubnet: "73.189.44.0/24",
        geoMismatch: false,
        proxyOrVpnDetected: false
      },
      customer: {
        customerId: "CUST-SYN-04",
        name: "David K. Alvarez",
        accountAgeDays: 68,
        historicalAvgTransactionUSD: 45.00,
        accountBalanceUSD: 7500.00,
        kycTier: "SIMPLIFIED"
      },
      merchant: {
        merchantId: "MERCH-3310",
        merchantName: "Prestige Bullion & Coins",
        merchantCategory: "Precious Metals & Liquidity",
        merchantRiskLevel: "HIGH"
      },
      vestaSignals: {
        c1_c14_velocity: 14,
        d1_d15_delta: 0.01,
        v_anomaly_score: 0.94,
        initialBankModelRiskScore: 0.88
      }
    },
    trigger: {
      type: "GRAPH_RING_ALERT",
      description: "TigerGraph Louvain Community Detection flagged CUST-SYN-04 clustered with 3 other newly opened accounts sharing SSN prefix and address.",
      score: 0.88
    },
    assessment: {
      predictedTypology: "Synthetic Identity Ring",
      initialRiskScore: 0.88,
      initialUncertainty: 28,
      finalRiskScore: 0.99,
      finalUncertainty: 1,
      confidenceScore: 99
    },
    subgraph: {
      densityScore: 0.88,
      communityId: "COMM-SYN-104",
      nodes: [
        { id: "CUST-SYN-04", label: "David Alvarez (Synthetic)", type: "Customer", riskScore: 0.95, properties: { ssn_area: "987-65", kyc_tier: "Simplified" }, isFlagged: true },
        { id: "CUST-SYN-02", label: "Elena Rostova (Linked Synthetic)", type: "Customer", riskScore: 0.92, properties: { ssn_area: "987-65" }, isFlagged: true },
        { id: "CUST-SYN-03", label: "Julian Sterling (Linked Synthetic)", type: "Customer", riskScore: 0.90, properties: { ssn_area: "987-65" }, isFlagged: true },
        { id: "ADDR-DROP", label: "Drop Box: 442 Commerce Blvd Ste 9", type: "Device", riskScore: 0.98, properties: { type: "Mail Drop / CMRA" }, isFlagged: true },
        { id: "TXN-3840112", label: "TXN $7,200 (Gold Bullion)", type: "Transaction", riskScore: 0.94, properties: { amount: 7200 }, isFlagged: true },
        { id: "CARD-18201", label: "Mastercard 18201", type: "Card", riskScore: 0.89, properties: { limit: 7500 }, isFlagged: true },
        { id: "DEV-SHARED-44", label: "Shared Mac Hardware Hash #M1-88", type: "Device", riskScore: 0.96, properties: { hardware_id: "hw_mac_88192" }, isFlagged: true }
      ],
      edges: [
        { id: "se1", source: "CUST-SYN-04", target: "ADDR-DROP", label: "RESIDENTIAL_ADDR", type: "ASSOCIATED_IP", isSuspicious: true },
        { id: "se2", source: "CUST-SYN-02", target: "ADDR-DROP", label: "RESIDENTIAL_ADDR", type: "ASSOCIATED_IP", isSuspicious: true },
        { id: "se3", source: "CUST-SYN-03", target: "ADDR-DROP", label: "RESIDENTIAL_ADDR", type: "ASSOCIATED_IP", isSuspicious: true },
        { id: "se4", source: "CUST-SYN-04", target: "DEV-SHARED-44", label: "REGISTERED_DEVICE", type: "USED_DEVICE", isSuspicious: true },
        { id: "se5", source: "CUST-SYN-02", target: "DEV-SHARED-44", label: "REGISTERED_DEVICE", type: "USED_DEVICE", isSuspicious: true },
        { id: "se6", source: "CUST-SYN-04", target: "TXN-3840112", label: "EXECUTES", type: "INVOLVED_IN", isSuspicious: true }
      ]
    },
    gsqlQueries: [
      {
        queryName: "synthetic_identity_clustering",
        description: "Identify multi-account clusters sharing commercial mail drop addresses and device hardware hashes",
        gsqlCode: "INTERPRET QUERY () SYNTAX v2 {\n  Seed = {Customer.*};\n  CMRA = SELECT c FROM Seed:c -(ASSOCIATED_ADDR)- Address:a WHERE a.is_cmra == true;\n  PRINT CMRA.size();\n}",
        parameters: { address: "442 Commerce Blvd Ste 9" },
        executionTimeMs: 22,
        resultSummary: "Discovered 4 synthetic customer profiles opened within 60 days sharing 1 physical mail receiving agency.",
        returnedVerticesCount: 7,
        returnedEdgesCount: 11
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Graph Cluster Anomaly Trigger",
        stage: "TRIGGER",
        description: "TigerGraph ring detection tripped on sudden $7,200 bullion purchase right as credit file matured.",
        timestamp: "2026-08-04T09:12:45Z",
        status: "completed",
        agentReasoning: "Classic bust-out pattern: Account established, nurtured with micro-payments for 60 days, followed by sudden maximum liquidity drain."
      },
      {
        stepNumber: 2,
        title: "TigerGraph Multi-Hop Identity Expansion",
        stage: "GRAPH_TRAVERSAL",
        description: "Traversed 2 hops across Customer -> Address -> Customers and Customer -> Device -> Customers.",
        timestamp: "2026-08-04T09:13:30Z",
        status: "completed",
        agentReasoning: "Found 3 other active credit profiles sharing exact Commercial Mail Receiving Agency (CMRA) box and Mac hardware fingerprint.",
        evidenceFound: ["Shared CMRA mail drop with 3 accounts", "Same Mac hardware UUID applied for 4 cards", "SSN numbers match deceased individual sequence"]
      },
      {
        stepNumber: 3,
        title: "Uncertainty & Policy Evaluation",
        stage: "UNCERTAINTY",
        description: "Initial uncertainty 28%. Low doubt regarding fraud ring existence, but need identity proof verification.",
        timestamp: "2026-08-04T09:14:10Z",
        status: "completed",
        agentReasoning: "Policy POL-004 mandates freezing entire connected subgraph if shared attributes confirmed.",
        uncertaintyScore: 28
      },
      {
        stepNumber: 4,
        title: "Controlled Evidence Gathering",
        stage: "EVIDENCE_GATHERING",
        description: "Dispatched automated request for certified SSA-89 Form and Real ID photographic document verification.",
        timestamp: "2026-08-04T09:15:00Z",
        status: "completed",
        agentReasoning: "Legitimate customers can provide SSA-89 and live facial selfie; synthetic identities cannot."
      },
      {
        stepNumber: 5,
        title: "Evidence Ingestion & Graph Lock",
        stage: "ACTION_SYNTHESIS",
        description: "Document upload failed: Submitted Photoshop altered utility bill with mismatched fonts and invalid barcode.",
        timestamp: "2026-08-04T09:20:00Z",
        status: "completed",
        agentReasoning: "Synthetic fraud confirmed beyond doubt. Uncertainty reduced to 1%. Immediate total ring collapse."
      }
    ],
    actionBeforeEvidence: {
      recommendedAction: "Hold Funds 24 Hours Pending Verification",
      approvalRoute: "Tier 1 Fraud Analyst Approval",
      rationale: "Hold gold bullion purchase while requesting certified identity documentation (SSA-89 / Real ID).",
      canAutoExecute: true
    },
    controlledEvidence: {
      id: "EVID-02",
      name: "Government ID & SSA-89 Direct Verification Probe",
      type: "ANALYST_CALL",
      policyRule: "POL-004-SYNTHETIC-RING",
      description: "Request official digital identity verification with live biometric selfie and social security validation.",
      initiatedAt: "2026-08-04T09:15:00Z",
      status: "RECEIVED",
      requestedDetails: "Upload valid driver license and signed SSA-89 verification consent.",
      responseOutcome: {
        result: "FAILED_CHALLENGE",
        details: "Provided forged documentation with duplicate serial number belonging to a deceased Florida resident.",
        verifiedAt: "2026-08-04T09:19:40Z",
        confidenceDelta: 45
      }
    },
    actionAfterEvidence: {
      recommendedAction: "Freeze Account & Clawback Associated Transfers",
      approvalRoute: "Bank Secrecy Act (BSA) / Compliance Officer",
      rationale: "Confirmed synthetic fraud ring. Freeze all 4 cluster accounts, terminate $32,000 combined credit limits, file mandatory FinCEN SAR.",
      status: "EXECUTED"
    },
    sarReport: {
      sarId: "SAR-2026-BENCH-002",
      filingDate: "2026-08-04",
      financialInstitution: "Horizon National Bank NA",
      suspectName: "Synthetic Ring 'Alvarez / Rostova / Sterling'",
      suspectIdentifier: "CMRA Box 442 Commerce Blvd Ste 9 / HW-mac_88192",
      totalAmountAtRiskUSD: 32400.00,
      primaryTypology: "Synthetic Identity Ring",
      lawEnforcementCodes: ["SYNTHETIC_IDENTITY", "MAIL_FRAUD", "ORGANIZED_CRIME"],
      summaryNarrative: "Between June and August 2026, an organized synthetic identity ring manufactured at least four identities using randomized SSN sequences and a shared mail forwarding location in Delaware. The ring attempted a coordinated bust-out starting with a $7,200.00 bullion transaction by account David K. Alvarez. Graph traversal isolated all 4 accounts before cumulative exposure could be liquidated.",
      graphNexusDetails: "TigerGraph Louvain community #COMM-SYN-104 revealed 7 vertices tightly coupled via shared hardware hash and commercial drop box address.",
      chronologyOfEvents: [
        "09:12:30Z - $7,200 bullion purchase attempted",
        "09:13:30Z - TigerGraph algorithm detects shared CMRA mail drop with 3 other active cards",
        "09:15:00Z - Agent triggers step-up KYC audit",
        "09:19:40Z - Forged documentation detected",
        "09:22:00Z - Entire 4-node account cluster frozen, credit lines cancelled"
      ],
      recommendedActions: [
        "Freeze all accounts in TigerGraph Community COMM-SYN-104",
        "File SAR with FinCEN and transmit dossier to US Postal Inspection Service",
        "Broadcast hardware UUID to consortium fraud intelligence"
      ],
      preparedBy: "Agentic Fraud Investigation Unit (Team ByteMe)"
    },
    similarHistoricalCases: [
      {
        caseId: "MEM-M1-002",
        month: "Month 1",
        typology: "Synthetic Identity Ring",
        verdict: "CONFIRMED_FRAUD",
        summary: "6 accounts established using shared Delaware CMRA address and burner VoIP numbers.",
        keyGraphPatterns: ["Shared CMRA address", "Disposable VOIP numbers", "Identical canvas fingerprint"],
        similarityScore: 0.97,
        actionTaken: "All accounts terminated, SAR filed."
      }
    ],
    graphMemoryPersisted: true
  },

  // CASE 3: Legitimate Executive Traveling Abroad (False Positive Restraint)
  {
    id: "CASE-BENCH-03",
    caseNumber: 3,
    title: "High-Value $3,450 Hotel Reservation in London with IP Mismatch",
    status: "RESOLVED",
    createdAt: "2026-08-05T18:40:12Z",
    updatedAt: "2026-08-05T18:44:20Z",
    transaction: {
      transactionId: "TXN-3855209",
      amountUSD: 3450.00,
      timestamp: "2026-08-05T18:38:00Z",
      productCd: "W",
      card: {
        card1: "15432",
        card2: "490",
        card3: "150",
        card4: "visa",
        card5: "226",
        card6: "credit"
      },
      device: {
        deviceInfo: "iPhone 15 Pro iOS 17.5",
        deviceType: "mobile",
        os: "iOS",
        browser: "Mobile Safari",
        ipSubnet: "82.165.197.0/24",
        geoMismatch: true,
        proxyOrVpnDetected: false
      },
      customer: {
        customerId: "CUST-10492",
        name: "Sophia Chen, MD",
        accountAgeDays: 2890,
        historicalAvgTransactionUSD: 420.00,
        accountBalanceUSD: 89000.00,
        kycTier: "FULL_KYC"
      },
      merchant: {
        merchantId: "MERCH-9941",
        merchantName: "The Savoy Hotel London",
        merchantCategory: "Luxury Lodging & Hospitality",
        merchantRiskLevel: "LOW"
      },
      vestaSignals: {
        c1_c14_velocity: 2,
        d1_d15_delta: 0.8,
        v_anomaly_score: 0.69,
        initialBankModelRiskScore: 0.72
      }
    },
    trigger: {
      type: "RISK_SCORE_THRESHOLD",
      description: "Model score 0.72 triggered due to sudden cross-border location (Customer based in San Francisco; IP located in Central London UK).",
      score: 0.72
    },
    assessment: {
      predictedTypology: "Legitimate / Cleared False Positive",
      initialRiskScore: 0.72,
      initialUncertainty: 68,
      finalRiskScore: 0.08,
      finalUncertainty: 2,
      confidenceScore: 98
    },
    subgraph: {
      densityScore: 0.15,
      communityId: "COMM-VIP-GENUINE",
      nodes: [
        { id: "CUST-10492", label: "Dr. Sophia Chen (Premier Client)", type: "Customer", riskScore: 0.02, properties: { tenure_years: 8, net_worth: "Tier 1" } },
        { id: "CARD-15432", label: "Visa Infinite 15432", type: "Card", riskScore: 0.04, properties: { limit: 50000 } },
        { id: "TXN-3855209", label: "TXN $3,450.00", type: "Transaction", riskScore: 0.72, properties: { merchant: "The Savoy Hotel London" } },
        { id: "DEV-IPHONE", label: "iPhone 15 Pro (Known Device 3 yrs)", type: "Device", riskScore: 0.01, properties: { biometric_enrolled: true } },
        { id: "IP-LONDON", label: "82.165.197.10 (Vodafone UK Mobile)", type: "IPAddress", riskScore: 0.10, properties: { isp: "Vodafone UK" } }
      ],
      edges: [
        { id: "e1", source: "CUST-10492", target: "CARD-15432", label: "OWNS", type: "LINKED_CARD" },
        { id: "e2", source: "CARD-15432", target: "TXN-3855209", label: "BILLED_TO", type: "INVOLVED_IN" },
        { id: "e3", source: "TXN-3855209", target: "DEV-IPHONE", label: "EXECUTED_ON", type: "USED_DEVICE" },
        { id: "e4", source: "TXN-3855209", target: "IP-LONDON", label: "ROUTED_VIA", type: "ASSOCIATED_IP" }
      ]
    },
    gsqlQueries: [
      {
        queryName: "historical_device_trust",
        description: "Assess historical device longevity and previous international travel patterns",
        gsqlCode: "INTERPRET QUERY (VERTEX<Customer> c, VERTEX<Device> d) SYNTAX v2 {\n  Seed = {c};\n  Matched = SELECT d FROM Seed:s -(USED_DEVICE)- Device:d WHERE d.fingerprint == d.fingerprint;\n  PRINT Matched.size();\n}",
        parameters: { customer: "CUST-10492", device: "DEV-IPHONE" },
        executionTimeMs: 9,
        resultSummary: "Device fingerprint has 412 successful historical transactions over 3 years. Clean trust score.",
        returnedVerticesCount: 2,
        returnedEdgesCount: 1
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Ingestion of Cross-Border Transaction",
        stage: "TRIGGER",
        description: "Transaction for $3,450 at luxury London hotel triggered 0.72 anomaly score on location difference.",
        timestamp: "2026-08-05T18:38:05Z",
        status: "completed",
        agentReasoning: "While geolocation is international, merchant is reputable 5-star hotel and card is Visa Infinite."
      },
      {
        stepNumber: 2,
        title: "TigerGraph Device Trust & KYC Traversal",
        stage: "GRAPH_TRAVERSAL",
        description: "Evaluated customer graph neighborhood in TigerGraph.",
        timestamp: "2026-08-05T18:38:45Z",
        status: "completed",
        agentReasoning: "Hardware device fingerprint has been linked to Sophia Chen since 2023. IP is legitimate mobile cellular IP, not a proxy/Tor.",
        evidenceFound: ["Device has 3-year verified history", "0 shared links to fraud rings", "Legitimate Vodafone UK mobile gateway"]
      },
      {
        stepNumber: 3,
        title: "Uncertainty Quantification",
        stage: "UNCERTAINTY",
        description: "Uncertainty is high (68%) because customer did not log travel notice, but graph signals are pristine.",
        timestamp: "2026-08-05T18:39:20Z",
        status: "completed",
        agentReasoning: "Hard blocking would inflict severe negative customer experience on a high-value private banking client. Applying POL-005 Safe Passage protocol.",
        uncertaintyScore: 68
      },
      {
        stepNumber: 4,
        title: "Controlled Evidence Gathering (3DS 2.0 Biometric)",
        stage: "EVIDENCE_GATHERING",
        description: "Prompted 3DS 2.0 frictionless FaceID confirmation on registered iPhone.",
        timestamp: "2026-08-05T18:40:00Z",
        status: "completed",
        agentReasoning: "Allows instantaneous confirmation without interrupting customer's check-in."
      },
      {
        stepNumber: 5,
        title: "Customer Authentication Verified",
        stage: "ACTION_SYNTHESIS",
        description: "Dr. Chen completed FaceID authentication successfully in 12 seconds.",
        timestamp: "2026-08-05T18:40:15Z",
        status: "completed",
        agentReasoning: "Risk score collapsed to 0.08. Uncertainty reduced to 2%. Releasing hold and appending travel itinerary."
      }
    ],
    actionBeforeEvidence: {
      recommendedAction: "Request Step-Up 3DS 2.0 Biometric Re-auth",
      approvalRoute: "Auto-Approved (Low Risk Tier 1)",
      rationale: "High model score due strictly to international IP; device is longstanding trusted hardware. Prompt 3DS re-auth rather than blocking.",
      canAutoExecute: true
    },
    controlledEvidence: {
      id: "EVID-03",
      name: "3DS 2.0 Biometric Re-Authentication Challenge",
      type: "STEP_UP_BIOMETRIC",
      policyRule: "POL-005-FALSE-POSITIVE-CLEAR",
      description: "Trigger cryptographic FaceID authentication on customer's authenticated primary iOS device.",
      initiatedAt: "2026-08-05T18:40:00Z",
      status: "RECEIVED",
      requestedDetails: "Authenticate transaction for $3,450 at The Savoy Hotel London.",
      responseOutcome: {
        result: "VERIFIED_LEGITIMATE",
        details: "Customer authenticated via Apple Secure Enclave FaceID with cryptographically signed token.",
        verifiedAt: "2026-08-05T18:40:14Z",
        confidenceDelta: -66
      }
    },
    actionAfterEvidence: {
      recommendedAction: "Allow Transaction & Close Case",
      approvalRoute: "Auto-Approved (Low Risk Tier 1)",
      rationale: "Identity verified via hardware biometrics. Allow transaction; auto-whitelist London IP subnet for next 14 days.",
      status: "EXECUTED"
    },
    similarHistoricalCases: [
      {
        caseId: "MEM-M2-004",
        month: "Month 2",
        typology: "Legitimate / Cleared False Positive",
        verdict: "CLEARED",
        summary: "Executive customer traveling in Tokyo flagged by location anomaly, verified via out-of-band challenge.",
        keyGraphPatterns: ["Trusted device", "Pristine KYC", "0 links to fraud clusters"],
        similarityScore: 0.95,
        actionTaken: "Approved, travel tag added."
      }
    ],
    graphMemoryPersisted: true
  },

  // CASE 4: Money Mule Rapid Fan-Out & Smurfing Layering
  {
    id: "CASE-BENCH-04",
    caseNumber: 4,
    title: "Rapid Mule Layering: $24,500 Incoming Wire Dispersed in 4 Smurf Transfers",
    status: "ACTION_RECOMMENDED",
    createdAt: "2026-08-07T11:05:00Z",
    updatedAt: "2026-08-07T11:14:30Z",
    transaction: {
      transactionId: "TXN-3866104",
      amountUSD: 24500.00,
      timestamp: "2026-08-07T11:00:00Z",
      productCd: "W",
      card: {
        card1: "19230",
        card2: "111",
        card3: "150",
        card4: "visa",
        card5: "226",
        card6: "debit"
      },
      device: {
        deviceInfo: "Samsung Galaxy S23 Android 14",
        deviceType: "mobile",
        os: "Android",
        browser: "Chrome Mobile",
        ipSubnet: "172.56.21.0/24",
        geoMismatch: false,
        proxyOrVpnDetected: false
      },
      customer: {
        customerId: "CUST-MULE-81",
        name: "Tyler Jenkins (Mule Conduit)",
        accountAgeDays: 24,
        historicalAvgTransactionUSD: 12.00,
        accountBalanceUSD: 24650.00,
        kycTier: "SIMPLIFIED"
      },
      merchant: {
        merchantId: "MERCH-P2P-9",
        merchantName: "Instant Crypto On-Ramp / P2P Transit",
        merchantCategory: "Money Service Business (MSB)",
        merchantRiskLevel: "HIGH"
      },
      vestaSignals: {
        c1_c14_velocity: 18,
        d1_d15_delta: 0.02,
        v_anomaly_score: 0.96,
        initialBankModelRiskScore: 0.92
      }
    },
    trigger: {
      type: "GRAPH_RING_ALERT",
      description: "TigerGraph GSQL Cycle Detection alert: Account received $24,500 from known compromised elder account and immediately issued 4 P2P transfers under $5,000 threshold.",
      score: 0.92
    },
    assessment: {
      predictedTypology: "Money Mule Network & Layering",
      initialRiskScore: 0.92,
      initialUncertainty: 20,
      finalRiskScore: 0.98,
      finalUncertainty: 2,
      confidenceScore: 98
    },
    subgraph: {
      densityScore: 0.79,
      communityId: "COMM-MULE-441",
      nodes: [
        { id: "ACC-VICTIM-ELDER", label: "Elder Victim Account #90124", type: "Account", riskScore: 0.85, properties: { loss_amount: 24500 }, isFlagged: true },
        { id: "CUST-MULE-81", label: "Tyler Jenkins (Mule)", type: "Customer", riskScore: 0.94, properties: { tenure_days: 24 }, isFlagged: true },
        { id: "ACC-MULE-81", label: "Conduit Account 81", type: "Account", riskScore: 0.96, properties: { balance: 24650 }, isFlagged: true },
        { id: "ACC-SMURF-A", label: "Smurf Recipient #1 ($4,900)", type: "Account", riskScore: 0.91, isFlagged: true, properties: {} },
        { id: "ACC-SMURF-B", label: "Smurf Recipient #2 ($4,850)", type: "Account", riskScore: 0.91, isFlagged: true, properties: {} },
        { id: "ACC-SMURF-C", label: "Smurf Recipient #3 ($4,950)", type: "Account", riskScore: 0.91, isFlagged: true, properties: {} },
        { id: "ACC-SMURF-D", label: "Smurf Recipient #4 ($4,900)", type: "Account", riskScore: 0.91, isFlagged: true, properties: {} }
      ],
      edges: [
        { id: "me1", source: "ACC-VICTIM-ELDER", target: "ACC-MULE-81", label: "FRAUD_INFLOW $24,500", type: "TRANSFERRED_TO", isSuspicious: true },
        { id: "me2", source: "ACC-MULE-81", target: "ACC-SMURF-A", label: "OUTFLOW $4,900", type: "TRANSFERRED_TO", isSuspicious: true },
        { id: "me3", source: "ACC-MULE-81", target: "ACC-SMURF-B", label: "OUTFLOW $4,850", type: "TRANSFERRED_TO", isSuspicious: true },
        { id: "me4", source: "ACC-MULE-81", target: "ACC-SMURF-C", label: "OUTFLOW $4,950", type: "TRANSFERRED_TO", isSuspicious: true },
        { id: "me5", source: "ACC-MULE-81", target: "ACC-SMURF-D", label: "OUTFLOW $4,900", type: "TRANSFERRED_TO", isSuspicious: true }
      ]
    },
    gsqlQueries: [
      {
        queryName: "detect_mule_layering",
        description: "Detect fan-in followed immediately by fan-out smurfing transactions within a 2-hour window",
        gsqlCode: "INTERPRET QUERY (VERTEX<Account> src) SYNTAX v2 {\n  Seed = {src};\n  Inflows = SELECT a FROM Seed:s <-(TRANSFERRED_TO)- Account:a;\n  Outflows = SELECT b FROM Seed:s -(TRANSFERRED_TO)-> Account:b;\n  PRINT Inflows.size(), Outflows.size();\n}",
        parameters: { src: "ACC-MULE-81" },
        executionTimeMs: 18,
        resultSummary: "High centrality hub detected: 1 inbound transfer ($24,500) followed within 12 minutes by 4 outbound transfers totaling $19,600.",
        returnedVerticesCount: 6,
        returnedEdgesCount: 5
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Smurfing Velocity Alert",
        stage: "TRIGGER",
        description: "Triggered by rapid dispersal of $24,500 incoming wire in 4 structured transfers below the $5,000 reporting threshold.",
        timestamp: "2026-08-07T11:02:00Z",
        status: "completed",
        agentReasoning: "Classic structuring/smurfing pattern designed to evade Bank Secrecy Act CTR triggers."
      },
      {
        stepNumber: 2,
        title: "TigerGraph Layering Trace",
        stage: "GRAPH_TRAVERSAL",
        description: "Ran `detect_mule_layering` query in TigerGraph.",
        timestamp: "2026-08-07T11:03:15Z",
        status: "completed",
        agentReasoning: "Inbound wire traced back to 84-year-old victim account which filed an unauthorized access report 40 minutes ago.",
        evidenceFound: ["Source account belongs to elder abuse victim", "Outbound transfers structured precisely under $5k", "Conduit account opened only 24 days prior"]
      },
      {
        stepNumber: 3,
        title: "Uncertainty & Emergency Policy Trigger",
        stage: "UNCERTAINTY",
        description: "Uncertainty is very low (20%). High velocity of fund dissipation requires immediate intervention.",
        timestamp: "2026-08-07T11:04:00Z",
        status: "completed",
        agentReasoning: "Policy POL-003 authorizes immediate debit freeze on recipient accounts to prevent total loss.",
        uncertaintyScore: 20
      },
      {
        stepNumber: 4,
        title: "Controlled Evidence Gathering",
        stage: "EVIDENCE_GATHERING",
        description: "Audited originating sender's fraud affidavit and conducted emergency phone query with victim's local branch.",
        timestamp: "2026-08-07T11:05:00Z",
        status: "completed",
        agentReasoning: "Branch confirmed victim was misled via tech-support remote access scam into authorizing wire."
      },
      {
        stepNumber: 5,
        title: "Autonomous Fund Interception & Freeze",
        stage: "ACTION_SYNTHESIS",
        description: "Frozen $19,600 in transit and seized remaining $4,900 in conduit account. Net recovery: 100%.",
        timestamp: "2026-08-07T11:10:00Z",
        status: "completed",
        agentReasoning: "Uncertainty 2%. Confirmed money laundering conduit. Drafting mandatory BSA SAR filing."
      }
    ],
    actionBeforeEvidence: {
      recommendedAction: "Temporary Account Debit Freeze",
      approvalRoute: "Senior Fraud Operations Lead Approval",
      rationale: "Emergency debit freeze to stop immediate offramping of funds while victim affidavit is checked.",
      canAutoExecute: true
    },
    controlledEvidence: {
      id: "EVID-04",
      name: "Originating Victim Branch Emergency Affidavit Probe",
      type: "ANALYST_CALL",
      policyRule: "POL-003-ACCOUNT-FREEZE",
      description: "Direct outreach to victim branch manager regarding $24,500 wire authorization validity.",
      initiatedAt: "2026-08-07T11:05:00Z",
      status: "RECEIVED",
      requestedDetails: "Verify whether wire transfer #W-90124 was authorized by victim account holder.",
      responseOutcome: {
        result: "CONFIRMED_FRAUD",
        details: "Branch manager confirms victim is elderly customer reporting AnyDesk screen control scam; requested urgent clawback.",
        verifiedAt: "2026-08-07T11:08:30Z",
        confidenceDelta: 28
      }
    },
    actionAfterEvidence: {
      recommendedAction: "Freeze Account & Clawback Associated Transfers",
      approvalRoute: "Bank Secrecy Act (BSA) / Compliance Officer",
      rationale: "Clawback all 4 outbound transfers via NACHA/Fedwire urgent recall; freeze mule conduit; submit SAR to FinCEN.",
      status: "EXECUTED"
    },
    sarReport: {
      sarId: "SAR-2026-BENCH-004",
      filingDate: "2026-08-07",
      financialInstitution: "Horizon National Bank NA",
      suspectName: "Tyler Jenkins (Mule Conduit)",
      suspectIdentifier: "ACC-MULE-81 / CUST-MULE-81",
      totalAmountAtRiskUSD: 24500.00,
      primaryTypology: "Money Mule Network & Layering",
      lawEnforcementCodes: ["MONEY_LAUNDERING_MULE", "ELDER_FINANCIAL_EXPLOITATION", "STRUCTURING_SMURFING"],
      summaryNarrative: "On August 7, 2026, subject Tyler Jenkins utilized a recently established account to receive $24,500.00 derived from an elder financial exploitation scam. Within minutes of receipt, subject attempted four structured outbound P2P transfers of $4,900, $4,850, $4,950, and $4,900 to evade currency transaction thresholds. Autonomous intervention intercepted the funds before withdrawal.",
      graphNexusDetails: "TigerGraph flow analysis identified directed acyclic smurfing topology from victim vertex to 4 destination wallets.",
      chronologyOfEvents: [
        "11:00:00Z - $24,500 wire received from victim",
        "11:01:15Z - 4 structured outbound transfers initiated",
        "11:03:15Z - TigerGraph mule layering query identifies smurfing topology",
        "11:05:00Z - Urgent branch affidavit verified scam",
        "11:10:00Z - All outbound transfers recalled and frozen"
      ],
      recommendedActions: [
        "Permanent account closure and blacklisting of Tyler Jenkins",
        "Full restitution of $24,500 to victim elder account",
        "Transmit SAR to FinCEN and FBI IC3 division"
      ],
      preparedBy: "Agentic Fraud Investigation Unit (Team ByteMe)"
    },
    similarHistoricalCases: [
      {
        caseId: "MEM-M3-005",
        month: "Month 3",
        typology: "Money Mule Network & Layering",
        verdict: "CONFIRMED_FRAUD",
        summary: "$18,000 incoming fraudulent wire dispersed to 5 offshore P2P wallets within 2 hours.",
        keyGraphPatterns: ["Fan-in followed by fan-out", "Structured transfers", "Young conduit account"],
        similarityScore: 0.98,
        actionTaken: "Emergency freeze, wire recall, SAR filed."
      }
    ],
    graphMemoryPersisted: true
  },

  // CASE 5: Stolen Card Velocity Burst across Multiple Online Merchants
  {
    id: "CASE-BENCH-05",
    caseNumber: 5,
    title: "Darknet Dump Stolen Card Burst: 9 Rapid Micro-Authorizations in 4 Minutes",
    status: "ACTION_RECOMMENDED",
    createdAt: "2026-08-09T03:12:00Z",
    updatedAt: "2026-08-09T03:18:10Z",
    transaction: {
      transactionId: "TXN-3877991",
      amountUSD: 1250.00,
      timestamp: "2026-08-09T03:10:00Z",
      productCd: "C",
      card: {
        card1: "14109",
        card2: "202",
        card3: "150",
        card4: "visa",
        card5: "226",
        card6: "credit"
      },
      device: {
        deviceInfo: "Linux Android Emulator BlueStacks",
        deviceType: "desktop",
        os: "Linux",
        browser: "Headless Chrome 122",
        ipSubnet: "194.26.29.0/24",
        geoMismatch: true,
        proxyOrVpnDetected: true
      },
      customer: {
        customerId: "CUST-44120",
        name: "Arthur Pendelton",
        accountAgeDays: 910,
        historicalAvgTransactionUSD: 40.00,
        accountBalanceUSD: 5200.00,
        kycTier: "FULL_KYC"
      },
      merchant: {
        merchantId: "MERCH-GAME-22",
        merchantName: "Global Gaming Currency Ltd",
        merchantCategory: "Digital Goods & In-Game Currency",
        merchantRiskLevel: "HIGH"
      },
      vestaSignals: {
        c1_c14_velocity: 28,
        d1_d15_delta: 0.001,
        v_anomaly_score: 0.98,
        initialBankModelRiskScore: 0.95
      }
    },
    trigger: {
      type: "RISK_SCORE_THRESHOLD",
      description: "Risk score 0.95: 9 rapid authorization attempts within 240 seconds from an automated headless emulator.",
      score: 0.95
    },
    assessment: {
      predictedTypology: "Card Bust-Out & Stolen Card Velocity",
      initialRiskScore: 0.95,
      initialUncertainty: 12,
      finalRiskScore: 0.99,
      finalUncertainty: 1,
      confidenceScore: 99
    },
    subgraph: {
      densityScore: 0.92,
      communityId: "COMM-BOT-CARDING",
      nodes: [
        { id: "EMULATOR-DEV-99", label: "BlueStacks Headless Bot", type: "Device", riskScore: 0.99, properties: { headless: true, user_agent: "HeadlessChrome" }, isFlagged: true },
        { id: "IP-194-26", label: "194.26.29.112 (Russian Hostinger VPS)", type: "IPAddress", riskScore: 0.97, properties: { host_type: "DataCenter / VPS" }, isFlagged: true },
        { id: "CARD-14109", label: "Visa 14109 (Arthur Pendelton)", type: "Card", riskScore: 0.88, properties: { limit: 5000 }, isFlagged: true },
        { id: "TXN-3877991", label: "TXN #9 ($1,250)", type: "Transaction", riskScore: 0.95, isFlagged: true, properties: {} },
        { id: "TXN-MICRO-1", label: "TXN #1 ($1.20 Steam)", type: "Transaction", riskScore: 0.91, isFlagged: true, properties: {} },
        { id: "TXN-MICRO-2", label: "TXN #2 ($1.00 Blizzard)", type: "Transaction", riskScore: 0.91, isFlagged: true, properties: {} }
      ],
      edges: [
        { id: "be1", source: "EMULATOR-DEV-99", target: "IP-194-26", label: "HOSTED_ON", type: "ASSOCIATED_IP", isSuspicious: true },
        { id: "be2", source: "CARD-14109", target: "TXN-MICRO-1", label: "TEST_AUTH", type: "INVOLVED_IN", isSuspicious: true },
        { id: "be3", source: "CARD-14109", target: "TXN-MICRO-2", label: "TEST_AUTH", type: "INVOLVED_IN", isSuspicious: true },
        { id: "be4", source: "CARD-14109", target: "TXN-3877991", label: "BURST_CHARGE", type: "INVOLVED_IN", isSuspicious: true },
        { id: "be5", source: "EMULATOR-DEV-99", target: "CARD-14109", label: "AUTOMATED_PROBE", type: "USED_DEVICE", isSuspicious: true }
      ]
    },
    gsqlQueries: [
      {
        queryName: "card_velocity_burst",
        description: "Compute rolling transaction count and merchant diversity within short time window",
        gsqlCode: "INTERPRET QUERY (VERTEX<Card> c) SYNTAX v2 {\n  Seed = {c};\n  Txns = SELECT t FROM Seed:s -(INVOLVED_IN)- Transaction:t WHERE datetime_diff(now(), t.timestamp) < 300;\n  PRINT Txns.size();\n}",
        parameters: { c: "CARD-14109" },
        executionTimeMs: 11,
        resultSummary: "9 authorization attempts detected in 240 seconds across 3 digital gaming merchants. Automated carding script signature.",
        returnedVerticesCount: 7,
        returnedEdgesCount: 8
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Automated Bot Velocity Trigger",
        stage: "TRIGGER",
        description: "Velocity spike: 9 card authorization attempts within 4 minutes from VPS datacenter IP.",
        timestamp: "2026-08-09T03:10:05Z",
        status: "completed",
        agentReasoning: "Headless Chrome User-Agent signature and rapid micro-charges indicate credential testing bot."
      },
      {
        stepNumber: 2,
        title: "TigerGraph Botnet Analysis",
        stage: "GRAPH_TRAVERSAL",
        description: "Queried TigerGraph for device emulator fingerprints.",
        timestamp: "2026-08-09T03:10:45Z",
        status: "completed",
        agentReasoning: "The same VPS IP address attempted carding attacks on 14 other bank cards in the last 48 hours.",
        evidenceFound: ["Headless Chrome automation telemetry", "VPS Datacenter IP 194.26.29.112", "Micro-charge testing pattern preceding large burst"]
      },
      {
        stepNumber: 3,
        title: "Uncertainty & Policy Evaluation",
        stage: "UNCERTAINTY",
        description: "Uncertainty is 12%. Clear synthetic/bot velocity attack.",
        timestamp: "2026-08-09T03:11:10Z",
        status: "completed",
        agentReasoning: "Zero legitimate customer probability. Automated kill-switch authorization.",
        uncertaintyScore: 12
      },
      {
        stepNumber: 4,
        title: "Controlled Evidence Gathering",
        stage: "EVIDENCE_GATHERING",
        description: "Checked CVV retry failure logs and 3DS response telemetry.",
        timestamp: "2026-08-09T03:11:40Z",
        status: "completed",
        agentReasoning: "Carding script attempted 3 random CVVs before guessing correctly on attempt 4."
      },
      {
        stepNumber: 5,
        title: "Autonomous Block & BIN Protection",
        stage: "ACTION_SYNTHESIS",
        description: "Permanently killed card, blacklisted VPS IP across gateway, notified cardholder.",
        timestamp: "2026-08-09T03:12:00Z",
        status: "completed",
        agentReasoning: "Uncertainty 1%. Immediate card revocation and reissue."
      }
    ],
    actionBeforeEvidence: {
      recommendedAction: "Permanent Card Cancellation & Re-issue",
      approvalRoute: "Auto-Approved (Low Risk Tier 1)",
      rationale: "Bot attack in progress with multiple CVV failures and VPS origin. Immediate kill-switch to protect customer balance.",
      canAutoExecute: true
    },
    controlledEvidence: {
      id: "EVID-05",
      name: "Gateway CVV Failure & Telemetry Verification",
      type: "DEVICE_GEO_PROBE",
      policyRule: "POL-003-ACCOUNT-FREEZE",
      description: "Inspect payment gateway logs for CVV brute-forcing telemetry.",
      initiatedAt: "2026-08-09T03:11:40Z",
      status: "RECEIVED",
      requestedDetails: "Query authorization engine for failed CVV attempts on card 14109.",
      responseOutcome: {
        result: "CONFIRMED_FRAUD",
        details: "Gateway confirms 3 consecutive failed CVV mismatches prior to successful submission.",
        verifiedAt: "2026-08-09T03:11:55Z",
        confidenceDelta: 15
      }
    },
    actionAfterEvidence: {
      recommendedAction: "Permanent Card Cancellation & Re-issue",
      approvalRoute: "Tier 1 Fraud Analyst Approval",
      rationale: "Brute-force carding verified. Terminate card, re-issue new PAN with dynamic CVV, block VPS IP across perimeter firewall.",
      status: "EXECUTED"
    },
    sarReport: {
      sarId: "SAR-2026-BENCH-005",
      filingDate: "2026-08-09",
      financialInstitution: "Horizon National Bank NA",
      suspectName: "Automated Carding Bot Network",
      suspectIdentifier: "IP-194.26.29.112 / Hostinger VPS",
      totalAmountAtRiskUSD: 1250.00,
      primaryTypology: "Card Bust-Out & Stolen Card Velocity",
      lawEnforcementCodes: ["CYBER_BOTNET", "CARD_FRAUD_VELOCITY"],
      summaryNarrative: "On August 9, 2026, automated threat actors utilized a headless browser originating from VPS IP 194.26.29.112 to conduct a CVV brute-force attack against credit card ending in 14109. After three failed attempts, a $1,250.00 digital currency purchase was attempted. The agentic system recognized the bot pattern and severed the card before settlement.",
      graphNexusDetails: "TigerGraph pattern analysis linked the VPS IP to 14 prior credential stuffing incidents in Month 3.",
      chronologyOfEvents: [
        "03:10:00Z - Bot begins micro-auth tests",
        "03:10:05Z - Velocity score triggers agentic intervention",
        "03:11:55Z - Gateway logs confirm CVV brute force",
        "03:12:00Z - Card terminated, IP permanently blacklisted"
      ],
      recommendedActions: [
        "Reissue card with updated EMV token",
        "Share IP 194.26.29.112 with Visa Fraud Intelligence Registry"
      ],
      preparedBy: "Agentic Fraud Investigation Unit (Team ByteMe)"
    },
    similarHistoricalCases: [
      {
        caseId: "MEM-M2-003",
        month: "Month 2",
        typology: "Card Bust-Out & Stolen Card Velocity",
        verdict: "CONFIRMED_FRAUD",
        summary: "Stolen card batch tested with micro-charges at gas stations followed by rapid electronics burst.",
        keyGraphPatterns: ["Rapid micro-charges", "Headless browser", "High velocity count C1"],
        similarityScore: 0.96,
        actionTaken: "Real-time card cancellation and gateway block."
      }
    ],
    graphMemoryPersisted: true
  },

  // CASE 6: Triangulation Fraud with Collusive E-commerce Merchant
  {
    id: "CASE-BENCH-06",
    caseNumber: 6,
    title: "Triangulation E-Commerce Storefront Exploiting Compromised Cards",
    status: "ACTION_RECOMMENDED",
    createdAt: "2026-08-11T16:20:00Z",
    updatedAt: "2026-08-11T16:26:40Z",
    transaction: {
      transactionId: "TXN-3889104",
      amountUSD: 2890.00,
      timestamp: "2026-08-11T16:18:00Z",
      productCd: "W",
      card: {
        card1: "16720",
        card2: "380",
        card3: "150",
        card4: "mastercard",
        card5: "224",
        card6: "credit"
      },
      device: {
        deviceInfo: "Windows 10 Firefox 125",
        deviceType: "desktop",
        os: "Windows",
        browser: "Firefox",
        ipSubnet: "104.244.72.0/24",
        geoMismatch: true,
        proxyOrVpnDetected: true
      },
      customer: {
        customerId: "CUST-55198",
        name: "Clara Oswald",
        accountAgeDays: 1820,
        historicalAvgTransactionUSD: 60.00,
        accountBalanceUSD: 9400.00,
        kycTier: "FULL_KYC"
      },
      merchant: {
        merchantId: "MERCH-TRI-88",
        merchantName: "LuxeHome Direct Discounts",
        merchantCategory: "Designer Furniture & Appliances",
        merchantRiskLevel: "HIGH"
      },
      vestaSignals: {
        c1_c14_velocity: 6,
        d1_d15_delta: 0.04,
        v_anomaly_score: 0.86,
        initialBankModelRiskScore: 0.81
      }
    },
    trigger: {
      type: "RISK_SCORE_THRESHOLD",
      description: "Merchant LuxeHome Direct has a 76% chargeback ratio over past 14 days. Transaction amount $2,890 deviates from customer profile.",
      score: 0.81
    },
    assessment: {
      predictedTypology: "Merchant Collusion & Triangulation",
      initialRiskScore: 0.81,
      initialUncertainty: 35,
      finalRiskScore: 0.97,
      finalUncertainty: 2,
      confidenceScore: 97
    },
    subgraph: {
      densityScore: 0.84,
      communityId: "COMM-TRIANGULATION-1",
      nodes: [
        { id: "MERCH-TRI-88", label: "LuxeHome Direct (Rogue Store)", type: "Merchant", riskScore: 0.98, properties: { dispute_rate: "76%", age_days: 28 }, isFlagged: true },
        { id: "CUST-55198", label: "Clara Oswald (Victim Cardholder)", type: "Customer", riskScore: 0.12, properties: { residence: "Denver, CO" } },
        { id: "CARD-16720", label: "Mastercard 16720", type: "Card", riskScore: 0.78, properties: { issuer: "Horizon" }, isFlagged: true },
        { id: "TXN-3889104", label: "TXN $2,890 (Espresso Machine)", type: "Transaction", riskScore: 0.81, isFlagged: true, properties: {} },
        { id: "SHIP-DROP-MIAMI", label: "Drop Ship Addr: Miami Freight Forwarder", type: "Device", riskScore: 0.95, properties: { category: "Freight Forwarder" }, isFlagged: true }
      ],
      edges: [
        { id: "te1", source: "CARD-16720", target: "TXN-3889104", label: "CHARGED_FOR", type: "INVOLVED_IN", isSuspicious: true },
        { id: "te2", source: "TXN-3889104", target: "MERCH-TRI-88", label: "MERCHANT_TERMINAL", type: "PURCHASED_AT", isSuspicious: true },
        { id: "te3", source: "TXN-3889104", target: "SHIP-DROP-MIAMI", label: "DESTINATION_SHIPPING", type: "ASSOCIATED_IP", isSuspicious: true },
        { id: "te4", source: "CUST-55198", target: "CARD-16720", label: "OWNER", type: "LINKED_CARD" }
      ]
    },
    gsqlQueries: [
      {
        queryName: "merchant_chargeback_centrality",
        description: "Compute high chargeback clustering on suspect online storefront",
        gsqlCode: "INTERPRET QUERY (VERTEX<Merchant> m) SYNTAX v2 {\n  Seed = {m};\n  Disputes = SELECT t FROM Seed:s -(PURCHASED_AT)- Transaction:t WHERE t.has_dispute == true;\n  PRINT Disputes.size();\n}",
        parameters: { m: "MERCH-TRI-88" },
        executionTimeMs: 16,
        resultSummary: "Merchant processed 38 transactions in 14 days, with 29 already resulting in unauthorized billing claims.",
        returnedVerticesCount: 5,
        returnedEdgesCount: 8
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Merchant Cluster Trigger",
        stage: "TRIGGER",
        description: "Transaction flagged by merchant reputation score: LuxeHome Direct shows anomalous chargeback spike.",
        timestamp: "2026-08-11T16:18:05Z",
        status: "completed",
        agentReasoning: "Pattern matches triangulation scheme: Fake online shop receives cash orders, buys real goods using stolen credit cards."
      },
      {
        stepNumber: 2,
        title: "TigerGraph Shipping Nexus Traversal",
        stage: "GRAPH_TRAVERSAL",
        description: "Traversed shipping address in TigerGraph.",
        timestamp: "2026-08-11T16:18:50Z",
        status: "completed",
        agentReasoning: "Shipping address is a notorious freight-forwarding warehouse in Miami exporting to Eastern Europe.",
        evidenceFound: ["Shipping address is freight forwarder", "Cardholder lives 2,000 miles away in Denver", "Merchant has 76% dispute rate"]
      },
      {
        stepNumber: 3,
        title: "Uncertainty & Policy Check",
        stage: "UNCERTAINTY",
        description: "Uncertainty is 35%. Need customer confirmation before declining genuine order.",
        timestamp: "2026-08-11T16:19:30Z",
        status: "completed",
        agentReasoning: "Dispatching SMS verification with merchant name and shipping destination explicitly detailed.",
        uncertaintyScore: 35
      },
      {
        stepNumber: 4,
        title: "Controlled Evidence Gathering",
        stage: "EVIDENCE_GATHERING",
        description: "Sent SMS: 'Did you authorize $2,890 to LuxeHome Direct shipping to Miami, FL?'",
        timestamp: "2026-08-11T16:20:00Z",
        status: "completed",
        agentReasoning: "Cardholder responded: 'NO! Never heard of LuxeHome, cancel immediately!'"
      },
      {
        stepNumber: 5,
        title: "Action Synthesis & Merchant Block",
        stage: "ACTION_SYNTHESIS",
        description: "Declined charge, blocked merchant ID bank-wide, submitted triangulation intelligence alert.",
        timestamp: "2026-08-11T16:25:00Z",
        status: "completed",
        agentReasoning: "Cardholder spared $2,890 loss. Merchant merchant processor account flagged for closure."
      }
    ],
    actionBeforeEvidence: {
      recommendedAction: "Send SMS Cardholder Verification",
      approvalRoute: "Tier 1 Fraud Analyst Approval",
      rationale: "High risk merchant, but customer may have ordered genuine furniture. Validate shipping destination with cardholder.",
      canAutoExecute: true
    },
    controlledEvidence: {
      id: "EVID-06",
      name: "Out-of-Band Shipping Destination Validation",
      type: "CUSTOMER_SMS_VERIFY",
      policyRule: "POL-001-STEP-UP",
      description: "SMS query to Clara Oswald regarding freight forwarder shipping address.",
      initiatedAt: "2026-08-11T16:20:00Z",
      status: "RECEIVED",
      requestedDetails: "Confirm whether shipping address in Miami, FL is authorized by cardholder.",
      responseOutcome: {
        result: "CONFIRMED_FRAUD",
        details: "Customer replied: 'FRAUD - I live in Denver, have no connections in Miami. Please block.'",
        verifiedAt: "2026-08-11T16:22:15Z",
        confidenceDelta: 33
      }
    },
    actionAfterEvidence: {
      recommendedAction: "Permanent Card Cancellation & Re-issue",
      approvalRoute: "Senior Fraud Operations Lead Approval",
      rationale: "Card compromised in triangulation scam. Block card, freeze merchant acquiring terminal, alert acquirer bank.",
      status: "EXECUTED"
    },
    sarReport: {
      sarId: "SAR-2026-BENCH-006",
      filingDate: "2026-08-11",
      financialInstitution: "Horizon National Bank NA",
      suspectName: "LuxeHome Direct & Miami Freight Forwarding Hub",
      suspectIdentifier: "MERCH-TRI-88 / Addr-Miami-Forwarder",
      totalAmountAtRiskUSD: 109820.00,
      primaryTypology: "Merchant Collusion & Triangulation",
      lawEnforcementCodes: ["TRIANGULATION_FRAUD", "FREIGHT_FORWARDING_EXPORT"],
      summaryNarrative: "The subject merchant LuxeHome Direct operates a fraudulent triangulation scheme. Stolen payment cards are charged for high-end luxury goods which are routed through Miami freight forwarding entities for international re-export. Aggregated fraudulent transactions across the merchant terminal exceed $109,000 USD over 14 days.",
      graphNexusDetails: "TigerGraph merchant analysis revealed 29 victim cardholders connected to single Miami freight forwarder address.",
      chronologyOfEvents: [
        "16:18:00Z - $2,890 charge submitted",
        "16:18:50Z - Graph reveals freight forwarder destination",
        "16:20:00Z - Cardholder SMS challenge dispatched",
        "16:22:15Z - Customer confirms theft",
        "16:25:00Z - Merchant network blocked across card portfolio"
      ],
      recommendedActions: [
        "Cancel and reissue Clara Oswald card",
        "Submit terminal freeze request to merchant acquiring bank",
        "File SAR and refer to Department of Homeland Security / CBP"
      ],
      preparedBy: "Agentic Fraud Investigation Unit (Team ByteMe)"
    },
    similarHistoricalCases: [
      {
        caseId: "MEM-M3-006",
        month: "Month 3",
        typology: "Merchant Collusion & Triangulation",
        verdict: "CONFIRMED_FRAUD",
        summary: "Rogue storefront sold discounted electronics using stolen cards to purchase from legit retailers.",
        keyGraphPatterns: ["Disproportionate chargeback rate", "Freight forwarder shipping", "Dispersed cardholders"],
        similarityScore: 0.93,
        actionTaken: "Merchant account suspended, reserve seized."
      }
    ],
    graphMemoryPersisted: true
  }
];

// Dynamically generate the remaining benchmark cases (7 through 20) with full IEEE-CIS fidelity
const ADDITIONAL_CASE_CONFIGS = [
  {
    num: 7,
    title: "Suspicious $6,100 International Wire to Unverified Beneficiary",
    typology: "Account Takeover (ATO)" as const,
    risk: 0.87,
    amt: 6100.0,
    prod: "W" as const,
    cust: "Elena Rostova",
    merch: "SWIFT Transit Bank Zurich",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "SIM swap attack confirmed by cellular telemetry provider; customer unable to receive SMS.",
    afterAction: "Freeze Account & Clawback Associated Transfers" as const,
    sarNeeded: true
  },
  {
    num: 8,
    title: "Student Laptop Purchase with New Credit Line (Uncertain Risk)",
    typology: "Legitimate / Cleared False Positive" as const,
    risk: 0.68,
    amt: 1850.0,
    prod: "W" as const,
    cust: "Liam O'Connor",
    merch: "Campus Tech Store",
    outcome: "VERIFIED_LEGITIMATE" as const,
    evidenceDetails: "Student verified biometric face scan via mobile banking app in 15 seconds.",
    afterAction: "Allow Transaction & Close Case" as const,
    sarNeeded: false
  },
  {
    num: 9,
    title: "Coordinated 5-Account Bust-Out at Wholesale Liquidity Vault",
    typology: "Synthetic Identity Ring" as const,
    risk: 0.93,
    amt: 9500.0,
    prod: "W" as const,
    cust: "Synthetic Cluster Bravo",
    merch: "Bullion Direct Depot",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "TigerGraph detected shared VoIP burner phone prefix and identical browser canvas fingerprint.",
    afterAction: "Freeze Account & Clawback Associated Transfers" as const,
    sarNeeded: true
  },
  {
    num: 10,
    title: "Rapid In-Game Micro-Transaction Velocity Burst (22 Authorizations)",
    typology: "Card Bust-Out & Stolen Card Velocity" as const,
    risk: 0.91,
    amt: 840.0,
    prod: "C" as const,
    cust: "Devon Miller",
    merch: "Riot Gaming Points",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Automated scripting tool probed CVV sequences from Indonesian residential proxy.",
    afterAction: "Permanent Card Cancellation & Re-issue" as const,
    sarNeeded: true
  },
  {
    num: 11,
    title: "Layered Crypto Off-Ramp via Intermediary P2P Conduit",
    typology: "Money Mule Network & Layering" as const,
    risk: 0.89,
    amt: 17800.0,
    prod: "W" as const,
    cust: "Kiran Patel (Mule)",
    merch: "BitRapid P2P Exchange",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Source funds traced to corporate payroll redirect phish; recipient account frozen.",
    afterAction: "Freeze Account & Clawback Associated Transfers" as const,
    sarNeeded: true
  },
  {
    num: 12,
    title: "Appliance Storefront Chargeback Cluster and Drop-Shipping",
    typology: "Merchant Collusion & Triangulation" as const,
    risk: 0.82,
    amt: 3400.0,
    prod: "W" as const,
    cust: "Amara Washington",
    merch: "Discount Appliance Warehouse",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Cardholder was in Seattle while goods were marked for freight forwarding in New Jersey.",
    afterAction: "Permanent Card Cancellation & Re-issue" as const,
    sarNeeded: true
  },
  {
    num: 13,
    title: "Executive Business Class Flight Booking with VPN Telemetry",
    typology: "Legitimate / Cleared False Positive" as const,
    risk: 0.71,
    amt: 4200.0,
    prod: "W" as const,
    cust: "Richard Sterling, CEO",
    merch: "Singapore Airlines Corporate",
    outcome: "VERIFIED_LEGITIMATE" as const,
    evidenceDetails: "Client confirmed via corporate dual-factor YubiKey prompt.",
    afterAction: "Allow Transaction & Close Case" as const,
    sarNeeded: false
  },
  {
    num: 14,
    title: "Session Hijack via Credential Stuffing on Dormant Savings Account",
    typology: "Account Takeover (ATO)" as const,
    risk: 0.88,
    amt: 8900.0,
    prod: "W" as const,
    cust: "Beatrix Potter",
    merch: "RemitGlobal Wire Services",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Customer affirmed password was leaked in recent retail credential breach; did not authorize wire.",
    afterAction: "Freeze Account & Clawback Associated Transfers" as const,
    sarNeeded: true
  },
  {
    num: 15,
    title: "Fabricated Credit Repair Profile with Shared Authorized Tradeline",
    typology: "Synthetic Identity Ring" as const,
    risk: 0.85,
    amt: 5400.0,
    prod: "W" as const,
    cust: "Julian Vance (Synthetic)",
    merch: "Luxury Timepiece Vault",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Social Security Administration database query returned SSN assigned to deceased individual.",
    afterAction: "Freeze Account & Clawback Associated Transfers" as const,
    sarNeeded: true
  },
  {
    num: 16,
    title: "Stolen Debit Card PIN Probing at Multiple Foreign POS Terminals",
    typology: "Card Bust-Out & Stolen Card Velocity" as const,
    risk: 0.94,
    amt: 1600.0,
    prod: "R" as const,
    cust: "Hannah Abbott",
    merch: "Cancun Resort ATM Terminal",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Customer reported physical card stolen from hotel gym locker 1 hour prior.",
    afterAction: "Permanent Card Cancellation & Re-issue" as const,
    sarNeeded: true
  },
  {
    num: 17,
    title: "Elder Romance Scam Conduit Funneling Retirement Savings",
    typology: "Money Mule Network & Layering" as const,
    risk: 0.91,
    amt: 31000.0,
    prod: "W" as const,
    cust: "Mildred Hayes (Elder Victim)",
    merch: "Overseas Private Trust Wire",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Local branch manager executed emergency welfare intervention; victim acknowledged online romance persona.",
    afterAction: "Freeze Account & Clawback Associated Transfers" as const,
    sarNeeded: true
  },
  {
    num: 18,
    title: "High-End Jewelry Purchase with Verified In-Branch Appointment",
    typology: "Legitimate / Cleared False Positive" as const,
    risk: 0.69,
    amt: 8500.0,
    prod: "W" as const,
    cust: "Dr. Evelyn Reed",
    merch: "Tiffany & Co. Flagship",
    outcome: "VERIFIED_LEGITIMATE" as const,
    evidenceDetails: "Customer presented physical driver license and Chip+PIN at certified merchant terminal.",
    afterAction: "Allow Transaction & Close Case" as const,
    sarNeeded: false
  },
  {
    num: 19,
    title: "Digital Gift Card Liquidation Burst Across 12 Cards in 10 Minutes",
    typology: "Card Bust-Out & Stolen Card Velocity" as const,
    risk: 0.96,
    amt: 6200.0,
    prod: "C" as const,
    cust: "Multiple Compromised PANs",
    merch: "GiftCard Mall Online",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "TigerGraph connected all 12 cards to single AWS EC2 instance executing automated Selenium script.",
    afterAction: "Permanent Card Cancellation & Re-issue" as const,
    sarNeeded: true
  },
  {
    num: 20,
    title: "Cross-Border Ghost Merchant Dispersing Counterfeit Luxury Goods",
    typology: "Merchant Collusion & Triangulation" as const,
    risk: 0.86,
    amt: 4100.0,
    prod: "W" as const,
    cust: "Neville Longbottom",
    merch: "Elite Bags London",
    outcome: "CONFIRMED_FRAUD" as const,
    evidenceDetails: "Dispute history confirms 89% of customers received cheap replica trinkets rather than ordered handbags.",
    afterAction: "Permanent Card Cancellation & Re-issue" as const,
    sarNeeded: true
  }
];

// Generate and append cases 7 to 20
ADDITIONAL_CASE_CONFIGS.forEach((cfg) => {
  const caseId = `CASE-BENCH-${cfg.num.toString().padStart(2, "0")}`;
  const isFraud = cfg.outcome === "CONFIRMED_FRAUD";

  const caseObj: FraudCase = {
    id: caseId,
    caseNumber: cfg.num,
    title: cfg.title,
    status: isFraud ? "ACTION_RECOMMENDED" : "RESOLVED",
    createdAt: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T10:00:00Z`,
    updatedAt: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T10:07:30Z`,
    transaction: {
      transactionId: `TXN-${3900000 + cfg.num * 1421}`,
      amountUSD: cfg.amt,
      timestamp: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T09:58:00Z`,
      productCd: cfg.prod,
      card: {
        card1: (12000 + cfg.num * 311).toString(),
        card2: "321",
        card3: "150",
        card4: cfg.num % 2 === 0 ? "visa" : "mastercard",
        card5: "226",
        card6: cfg.amt > 5000 ? "credit" : "debit"
      },
      device: {
        deviceInfo: cfg.typology === "Legitimate / Cleared False Positive" ? "Apple iPhone 15 Pro" : "Android/Windows Emulator",
        deviceType: cfg.typology === "Legitimate / Cleared False Positive" ? "mobile" : "desktop",
        os: cfg.typology === "Legitimate / Cleared False Positive" ? "iOS" : "Linux/Android",
        browser: cfg.typology === "Legitimate / Cleared False Positive" ? "Mobile Safari" : "Chrome",
        ipSubnet: isFraud ? "185.190.22.0/24" : "71.212.18.0/24",
        geoMismatch: isFraud,
        proxyOrVpnDetected: isFraud
      },
      customer: {
        customerId: `CUST-${10000 + cfg.num * 412}`,
        name: cfg.cust,
        accountAgeDays: isFraud ? 45 : 1200,
        historicalAvgTransactionUSD: isFraud ? 45.0 : 380.0,
        accountBalanceUSD: cfg.amt * 2.5,
        kycTier: isFraud ? "SIMPLIFIED" : "FULL_KYC"
      },
      merchant: {
        merchantId: `MERCH-${8000 + cfg.num}`,
        merchantName: cfg.merch,
        merchantCategory: cfg.typology,
        merchantRiskLevel: isFraud ? "HIGH" : "LOW"
      },
      vestaSignals: {
        c1_c14_velocity: isFraud ? 14 : 2,
        d1_d15_delta: isFraud ? 0.02 : 1.2,
        v_anomaly_score: cfg.risk,
        initialBankModelRiskScore: cfg.risk
      }
    },
    trigger: {
      type: "RISK_SCORE_THRESHOLD",
      description: `Anomaly score ${cfg.risk} exceeded policy threshold for typology: ${cfg.typology}.`,
      score: cfg.risk
    },
    assessment: {
      predictedTypology: cfg.typology,
      initialRiskScore: cfg.risk,
      initialUncertainty: isFraud ? 32 : 65,
      finalRiskScore: isFraud ? 0.97 : 0.05,
      finalUncertainty: isFraud ? 2 : 1,
      confidenceScore: isFraud ? 98 : 99
    },
    subgraph: {
      densityScore: isFraud ? 0.78 : 0.12,
      communityId: `COMM-BENCH-${cfg.num}`,
      nodes: [
        { id: `CUST-${cfg.num}`, label: `${cfg.cust}`, type: "Customer", riskScore: isFraud ? 0.92 : 0.03, properties: { name: cfg.cust } },
        { id: `CARD-${cfg.num}`, label: `Card ${cfg.num}`, type: "Card", riskScore: isFraud ? 0.88 : 0.02, properties: {} },
        { id: `TXN-${cfg.num}`, label: `TXN $${cfg.amt.toLocaleString()}`, type: "Transaction", riskScore: cfg.risk, isFlagged: isFraud, properties: { amount: cfg.amt } },
        { id: `DEV-${cfg.num}`, label: `Device #D-${cfg.num}`, type: "Device", riskScore: isFraud ? 0.95 : 0.01, isFlagged: isFraud, properties: {} },
        { id: `MERCH-${cfg.num}`, label: `${cfg.merch}`, type: "Merchant", riskScore: isFraud ? 0.84 : 0.05, properties: {} }
      ],
      edges: [
        { id: `be-${cfg.num}-1`, source: `CUST-${cfg.num}`, target: `CARD-${cfg.num}`, label: "OWNS", type: "LINKED_CARD" },
        { id: `be-${cfg.num}-2`, source: `CARD-${cfg.num}`, target: `TXN-${cfg.num}`, label: "BILLED", type: "INVOLVED_IN", isSuspicious: isFraud },
        { id: `be-${cfg.num}-3`, source: `TXN-${cfg.num}`, target: `DEV-${cfg.num}`, label: "ACCESSED_BY", type: "USED_DEVICE", isSuspicious: isFraud },
        { id: `be-${cfg.num}-4`, source: `TXN-${cfg.num}`, target: `MERCH-${cfg.num}`, label: "PAID_TO", type: "PURCHASED_AT" }
      ]
    },
    gsqlQueries: [
      {
        queryName: "subgraph_neighborhood_expansion",
        description: "Expand 2-hop neighborhood to discover connected entities and shared fraud markers",
        gsqlCode: `INTERPRET QUERY (VERTEX<Transaction> t) SYNTAX v2 {\n  Seed = {t};\n  Connected = SELECT v FROM Seed:s -(INVOLVED_IN|USED_DEVICE|ASSOCIATED_IP)- :v;\n  PRINT Connected.size();\n}`,
        parameters: { t: `TXN-${cfg.num}` },
        executionTimeMs: 12 + (cfg.num % 7),
        resultSummary: `Traversed 2 hops in TigerGraph. Found ${isFraud ? "high cluster risk density with multiple shared edges" : "isolated clean personal KYC graph"}.`,
        returnedVerticesCount: 5,
        returnedEdgesCount: 4
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Ingestion & Anomaly Trigger",
        stage: "TRIGGER",
        description: `Risk score ${cfg.risk} detected on $${cfg.amt.toLocaleString()} transaction at ${cfg.merch}.`,
        timestamp: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T09:58:10Z`,
        status: "completed",
        agentReasoning: `Triggered policy threshold for ${cfg.typology}. Initiating TigerGraph investigation.`
      },
      {
        stepNumber: 2,
        title: "TigerGraph Knowledge Traversal",
        stage: "GRAPH_TRAVERSAL",
        description: "Traversed entity neighborhood and checked historical case memory.",
        timestamp: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T09:59:00Z`,
        status: "completed",
        agentReasoning: `Graph topology reveals ${isFraud ? "shared risk attributes and anomalous device signals" : "longstanding trusted client profile"}.`,
        evidenceFound: isFraud
          ? ["Suspicious IP/Device fingerprint mismatch", "Velocity exceeds standard deviation", "Merchant flagged in fraud database"]
          : ["Known trusted device fingerprint", "Clean historical credit record", "No common edges with fraud clusters"]
      },
      {
        stepNumber: 3,
        title: "Uncertainty Assessment & Policy Routing",
        stage: "UNCERTAINTY",
        description: `Initial uncertainty calculated at ${isFraud ? "32%" : "65%"}.`,
        timestamp: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T09:59:45Z`,
        status: "completed",
        agentReasoning: "Gathering controlled evidence to reach defensible legal threshold.",
        uncertaintyScore: isFraud ? 32 : 65
      },
      {
        stepNumber: 4,
        title: "Controlled Evidence Gathering",
        stage: "EVIDENCE_GATHERING",
        description: "Dispatched controlled challenge (SMS verification or Biometric 3DS).",
        timestamp: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T10:00:30Z`,
        status: "completed",
        agentReasoning: "Awaiting customer authentication feedback."
      },
      {
        stepNumber: 5,
        title: "Final Decision & Memory Persistence",
        stage: "ACTION_SYNTHESIS",
        description: `Received evidence outcome: ${cfg.outcome}. Action synthesized.`,
        timestamp: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T10:03:00Z`,
        status: "completed",
        agentReasoning: `Uncertainty resolved. Executing ${cfg.afterAction}. Graph memory updated.`
      }
    ],
    actionBeforeEvidence: {
      recommendedAction: isFraud ? "Hold Funds 24 Hours Pending Verification" : "Request Step-Up 3DS 2.0 Biometric Re-auth",
      approvalRoute: isFraud ? "Tier 1 Fraud Analyst Approval" : "Auto-Approved (Low Risk Tier 1)",
      rationale: `Signal uncertainty requires controlled evidence collection before permanent action.`,
      canAutoExecute: true
    },
    controlledEvidence: {
      id: `EVID-${cfg.num.toString().padStart(2, "0")}`,
      name: isFraud ? "Cardholder Out-of-Band Challenge" : "3DS 2.0 Biometric Challenge",
      type: isFraud ? "CUSTOMER_SMS_VERIFY" : "STEP_UP_BIOMETRIC",
      policyRule: isFraud ? "POL-001-STEP-UP" : "POL-005-FALSE-POSITIVE-CLEAR",
      description: `Targeted authentication challenge sent for transaction $${cfg.amt.toLocaleString()} at ${cfg.merch}.`,
      initiatedAt: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T10:00:30Z`,
      status: "RECEIVED",
      requestedDetails: "Verify transaction authorization and device legitimacy.",
      responseOutcome: {
        result: cfg.outcome,
        details: cfg.evidenceDetails,
        verifiedAt: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}T10:02:15Z`,
        confidenceDelta: isFraud ? 30 : -60
      }
    },
    actionAfterEvidence: {
      recommendedAction: cfg.afterAction,
      approvalRoute: isFraud ? (cfg.amt > 5000 ? "Bank Secrecy Act (BSA) / Compliance Officer" : "Senior Fraud Operations Lead Approval") : "Auto-Approved (Low Risk Tier 1)",
      rationale: `Evidence confirmed status as ${cfg.outcome}. Final next best action executed in compliance with policy.`,
      status: "EXECUTED"
    },
    sarReport: cfg.sarNeeded ? {
      sarId: `SAR-2026-BENCH-${cfg.num.toString().padStart(3, "0")}`,
      filingDate: `2026-08-${(cfg.num + 5).toString().padStart(2, "0")}`,
      financialInstitution: "Horizon National Bank NA",
      suspectName: cfg.cust,
      suspectIdentifier: `CASE-${cfg.num} / ${cfg.merch}`,
      totalAmountAtRiskUSD: cfg.amt,
      primaryTypology: cfg.typology,
      lawEnforcementCodes: [cfg.typology.toUpperCase().replace(/\s+/g, "_")],
      summaryNarrative: `On August ${(cfg.num + 5)}, 2026, an unauthorized financial transaction of $${cfg.amt.toLocaleString()} USD was intercepted matching the typology '${cfg.typology}'. Graph analysis confirmed malicious nexus. Controlled evidence verification failed, and funds were preserved.`,
      graphNexusDetails: `TigerGraph community COMM-BENCH-${cfg.num} revealed anomalous cluster density.`,
      chronologyOfEvents: [
        "09:58:00Z - Suspicious transaction attempted",
        "09:58:10Z - Model risk score triggered autonomous agent",
        "10:00:30Z - Controlled evidence challenge issued",
        "10:02:15Z - Challenge failed / confirmed illicit",
        "10:03:00Z - Remediation action executed and SAR generated"
      ],
      recommendedActions: [
        `Execute ${cfg.afterAction}`,
        "Persist graph signature in TigerGraph memory"
      ],
      preparedBy: "Agentic Fraud Investigation Unit (Team ByteMe)"
    } : undefined,
    similarHistoricalCases: [
      {
        caseId: `MEM-M${(cfg.num % 4) + 1}-00${cfg.num % 5 + 1}`,
        month: `Month ${((cfg.num % 4) + 1) as 1 | 2 | 3 | 4}` as any,
        typology: cfg.typology,
        verdict: isFraud ? "CONFIRMED_FRAUD" : "CLEARED",
        summary: `Prior historical case exhibiting identical ${cfg.typology} signals and topology.`,
        keyGraphPatterns: ["Matching GSQL traversal pattern", "Similar risk score distribution"],
        similarityScore: 0.91,
        actionTaken: isFraud ? "Account frozen and SAR filed." : "Transaction approved, travel tag added."
      }
    ],
    graphMemoryPersisted: true
  };

  BENCHMARK_CASES.push(caseObj);
});
