import { HistoricalCaseMemory } from "@/types";

export const HISTORICAL_CASE_MEMORY: HistoricalCaseMemory[] = [
  {
    caseId: "MEM-M1-001",
    month: "Month 1",
    typology: "Account Takeover (ATO)",
    verdict: "CONFIRMED_FRAUD",
    summary: "Compromised credential dump resulted in session hijack via residential proxy. Target customer account experienced $4,200 wire transfer 4 minutes after unauthorized device registration.",
    keyGraphPatterns: [
      "New Device node with spoofed User-Agent (Chrome on Linux)",
      "IPAddress node geolocated to Amsterdam VPN exit node while customer registered in Ohio",
      "Immediate password change prior to transaction attempt"
    ],
    actionTaken: "Temporary debit freeze executed; customer contacted via verified telephone on file; credentials invalidated; funds recovered via ACH recall."
  },
  {
    caseId: "MEM-M1-002",
    month: "Month 1",
    typology: "Synthetic Identity Ring",
    verdict: "CONFIRMED_FRAUD",
    summary: "Network of 6 credit builder accounts established using SSN randomize sequence with common virtual office mailing address in Delaware.",
    keyGraphPatterns: [
      "6 Customer nodes linked to single Address vertex '1209 Orange St'",
      "Shared disposable burner VoIP phone number prefix (+1-302-555)",
      "Identical hardware canvas fingerprint across 4 disparate online applications"
    ],
    actionTaken: "Permanent account terminations, SAR filed with FinCEN reference #SAR-2024-0012, credit bureau fraud alerts broadcast."
  },
  {
    caseId: "MEM-M2-003",
    month: "Month 2",
    typology: "Card Bust-Out & Stolen Card Velocity",
    verdict: "CONFIRMED_FRAUD",
    summary: "Stolen card batch purchased on darknet forum tested with $1.50 micro-charges at gas stations, followed within 30 minutes by $1,800 gift card purchases at electronics retailers.",
    keyGraphPatterns: [
      "Single Device node attached to 8 distinct Card nodes within 45 minutes",
      "Velocity spike on Vesta C1_C14 count = 19 attempts",
      "Rapid geographic teleportation across POS terminals"
    ],
    actionTaken: "Real-time card cancellation, merchant terminal alerts issued, POS velocity block applied to BIN cluster."
  },
  {
    caseId: "MEM-M2-004",
    month: "Month 2",
    typology: "Legitimate / Cleared False Positive",
    verdict: "CLEARED",
    summary: "Executive customer traveled to Tokyo on business trip without filing travel notice. Flagged by anomaly model due to Japan IP and $2,400 hotel charge.",
    keyGraphPatterns: [
      "Customer node has 7-year unblemished tenure and Full KYC status",
      "Device hardware hash matched historical authorized iPad",
      "Zero shared edges with fraud rings or blacklisted entities"
    ],
    actionTaken: "Out-of-band push notification approved by customer; temporary hold removed; travel tag appended for 14 days."
  },
  {
    caseId: "MEM-M3-005",
    month: "Month 3",
    typology: "Money Mule Network & Layering",
    verdict: "CONFIRMED_FRAUD",
    summary: "Romance scam victim recruited as unwitting money mule receiving $18,000 in incoming fraudulent wires and distributing them to 5 offshore P2P wallets within 2 hours.",
    keyGraphPatterns: [
      "Account node exhibits fan-in of $18,000 immediately followed by 5 fan-out transfers of $3,500 each",
      "Louvain community links account to known organized crime syndicate wallet",
      "Velocity delta D1 = 0.02 hours"
    ],
    actionTaken: "Immediate account freeze; outbound wire recalls initiated (intercepted $14,000); mandatory SAR filed; customer victim counseling initiated."
  },
  {
    caseId: "MEM-M3-006",
    month: "Month 3",
    typology: "Merchant Collusion & Triangulation",
    verdict: "CONFIRMED_FRAUD",
    summary: "Rogue online storefront listed luxury consumer electronics at 40% discount, took customer orders, and fulfilled them by purchasing from real retail vendors using stolen credit cards.",
    keyGraphPatterns: [
      "Merchant node had 84% chargeback rate across 30 days",
      "Multiple distinct billing cards shipped to non-matching consumer drop-ship addresses",
      "Single IP subnet registering multiple merchant seller accounts"
    ],
    actionTaken: "Merchant acquiring account suspended; rolling reserve seized; federal postal inspector notified."
  },
  {
    caseId: "MEM-M4-007",
    month: "Month 4",
    typology: "Legitimate / Cleared False Positive",
    verdict: "CLEARED",
    summary: "College student purchased high-end gaming PC for $3,100 using new student debit card. High model risk score due to young account age (18 days) and large transaction.",
    keyGraphPatterns: [
      "Customer matched university IP subnet (.edu)",
      "Zero links to suspicious devices or blacklisted card rings",
      "Prior transactions showed regular campus cafeteria micro-purchases"
    ],
    actionTaken: "Step-up SMS OTP verified by customer within 42 seconds; transaction released; credit limit adjusted."
  },
  {
    caseId: "MEM-M4-008",
    month: "Month 4",
    typology: "Account Takeover (ATO)",
    verdict: "CONFIRMED_FRAUD",
    summary: "SIM swap attack bypassed legacy SMS OTP. Threat actor logged in from new Android device in Texas, drained $9,800 savings via external wire.",
    keyGraphPatterns: [
      "Cellular carrier ID change signal received 1 hour prior to transaction",
      "New Device node with zero shared history",
      "Immediate request to add high-risk external wire beneficiary"
    ],
    actionTaken: "Emergency kill-switch wire intercept; account credentials frozen; customer contacted via in-branch biometric verification."
  }
];
