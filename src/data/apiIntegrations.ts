import { ApiIntegrationConfig } from "@/types";

export const INITIAL_API_INTEGRATIONS: ApiIntegrationConfig[] = [
  {
    id: "API-TG-SAVANNA",
    name: "TigerGraph Savanna Graph Database (REST++)",
    serviceCategory: "GRAPH_DATABASE",
    endpoint: "https://savanna.tgcloud.io/instance-hhgoa-byteme",
    apiKeyMasked: "tg_savanna_live_***9a",
    status: "CONNECTED",
    latencyMs: 14,
    lastSync: "Just now",
    description: "Multi-hop GSQL query execution, Louvain community detection, and topological vector search."
  },
  {
    id: "API-VESTA-ML",
    name: "IEEE-CIS / Vesta Corporation ML Risk Scorer",
    serviceCategory: "RISK_ENGINE",
    endpoint: "https://api.vesta-fraud-intel.com/v2/score",
    apiKeyMasked: "vst_prod_***42",
    status: "CONNECTED",
    latencyMs: 38,
    lastSync: "1 min ago",
    description: "Evaluates cardholder identity attributes, C1-C14 velocity, and D1-D15 temporal deltas."
  },
  {
    id: "API-THREATMETRIX",
    name: "LexisNexis ThreatMetrix Device Intelligence",
    serviceCategory: "IDENTITY_VERIFICATION",
    endpoint: "https://risk.threatmetrix.com/api/fp/v3",
    apiKeyMasked: "tmx_corp_***81",
    status: "CONNECTED",
    latencyMs: 44,
    lastSync: "3 mins ago",
    description: "Hardware canvas hashing, TCP/IP OS fingerprinting, and Tor/Proxy risk scoring."
  },
  {
    id: "API-FINCEN-SAR",
    name: "FinCEN BSA E-Filing System (31 CFR 1020.320)",
    serviceCategory: "REGULATORY_FILING",
    endpoint: "https://bsaefiling.fincen.treas.gov/api/v1/sar",
    apiKeyMasked: "fincen_efile_***88",
    status: "STANDBY",
    latencyMs: 110,
    lastSync: "15 mins ago",
    description: "Automated submission of suspicious activity reports with graph topology nexus."
  },
  {
    id: "API-SLACK-ALERT",
    name: "SOC Triage Alerts (Slack Webhook & PagerDuty)",
    serviceCategory: "ALERT_WEBHOOK",
    endpoint: "https://hooks.slack.com/services/T00/B00/X00",
    apiKeyMasked: "hooks_slack_***12",
    status: "CONNECTED",
    latencyMs: 22,
    lastSync: "Just now",
    description: "Real-time notifications sent to #fraud-incident-command for High/Critical tier alerts."
  }
];
