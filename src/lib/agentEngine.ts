import { FraudCase, InvestigationStep, NextAction, ApprovalRoute, ControlledEvidenceAction, SuspiciousActivityReport } from "@/types";
import { BANK_FRAUD_POLICIES, FRAUD_TYPOLOGIES_KNOWLEDGE } from "@/data/fraudPolicies";
import { HISTORICAL_CASE_MEMORY } from "@/data/historicalMemory";

export interface InvestigationExecutionProgress {
  currentStepIndex: number;
  totalSteps: number;
  activeStage: string;
  logs: string[];
}

export class AgentInvestigationEngine {
  public static async runInvestigationStep(
    targetCase: FraudCase,
    stepIndex: number
  ): Promise<{ updatedCase: FraudCase; stepResult: InvestigationStep }> {
    const updatedCase = { ...targetCase };
    const step = updatedCase.steps[stepIndex];

    if (!step) {
      throw new Error(`Step index ${stepIndex} out of bounds`);
    }

    step.status = "completed";

    // Update case status depending on step
    if (step.stage === "TRIGGER") {
      updatedCase.status = "INVESTIGATING";
    } else if (step.stage === "EVIDENCE_GATHERING") {
      updatedCase.status = "EVIDENCE_REQUESTED";
    } else if (step.stage === "ACTION_SYNTHESIS") {
      updatedCase.status = updatedCase.assessment.predictedTypology === "Legitimate / Cleared False Positive" ? "RESOLVED" : "ACTION_RECOMMENDED";
    }

    return { updatedCase, stepResult: step };
  }

  public static simulateControlledEvidenceResponse(
    currentCase: FraudCase,
    manualOutcome?: "CONFIRMED_FRAUD" | "VERIFIED_LEGITIMATE" | "FAILED_CHALLENGE"
  ): FraudCase {
    const updatedCase = JSON.parse(JSON.stringify(currentCase)) as FraudCase;
    const outcome = manualOutcome || updatedCase.controlledEvidence.responseOutcome?.result || "CONFIRMED_FRAUD";

    updatedCase.status = "EVIDENCE_RECEIVED";
    updatedCase.controlledEvidence.status = "RECEIVED";

    if (outcome === "VERIFIED_LEGITIMATE") {
      updatedCase.controlledEvidence.responseOutcome = {
        result: "VERIFIED_LEGITIMATE",
        details: "Customer completed biometric face scan and confirmed the transaction was genuine.",
        verifiedAt: new Date().toISOString(),
        confidenceDelta: -65
      };
      updatedCase.assessment.finalRiskScore = 0.05;
      updatedCase.assessment.finalUncertainty = 2;
      updatedCase.assessment.confidenceScore = 98;
      updatedCase.actionAfterEvidence = {
        recommendedAction: "Allow Transaction & Close Case",
        approvalRoute: "Auto-Approved (Low Risk Tier 1)",
        rationale: "Customer biometric verification succeeded. Graph demonstrates clean history. Whitelisting device.",
        status: "EXECUTED"
      };
      updatedCase.status = "RESOLVED";
      updatedCase.sarReport = undefined; // No SAR needed for cleared legitimate cases
    } else {
      updatedCase.controlledEvidence.responseOutcome = {
        result: outcome,
        details: outcome === "CONFIRMED_FRAUD"
          ? "Cardholder explicitly confirmed unauthorized transaction via out-of-band mobile challenge."
          : "Authentication challenge failed. Forged documentation or multiple incorrect credentials supplied.",
        verifiedAt: new Date().toISOString(),
        confidenceDelta: 35
      };
      updatedCase.assessment.finalRiskScore = 0.98;
      updatedCase.assessment.finalUncertainty = 1;
      updatedCase.assessment.confidenceScore = 99;

      // Select appropriate post-evidence action
      let nextAct: NextAction = "Permanent Card Cancellation & Re-issue";
      let appRoute: ApprovalRoute = "Senior Fraud Operations Lead Approval";

      if (updatedCase.assessment.predictedTypology === "Money Mule Network & Layering") {
        nextAct = "Freeze Account & Clawback Associated Transfers";
        appRoute = "Bank Secrecy Act (BSA) / Compliance Officer";
      } else if (updatedCase.assessment.predictedTypology === "Synthetic Identity Ring") {
        nextAct = "Freeze Account & Clawback Associated Transfers";
        appRoute = "Bank Secrecy Act (BSA) / Compliance Officer";
      }

      updatedCase.actionAfterEvidence = {
        recommendedAction: nextAct,
        approvalRoute: appRoute,
        rationale: "Evidence confirmed illicit unauthorized activity. Terminating exposure and executing policy-mandated freeze.",
        status: "EXECUTED"
      };
      updatedCase.status = "ACTION_RECOMMENDED";
    }

    // Persist to graph memory
    updatedCase.graphMemoryPersisted = true;
    return updatedCase;
  }

  public static generateOfficialSubmissionJson(cases: FraudCase[]) {
    return cases.map((c) => ({
      case_id: c.id,
      case_number: c.caseNumber,
      title: c.title,
      transaction_id: c.transaction.transactionId,
      amount_usd: c.transaction.amountUSD,
      typology: c.assessment.predictedTypology,
      investigation_record: {
        trigger: c.trigger,
        steps: c.steps.map((s) => ({
          step: s.stepNumber,
          stage: s.stage,
          reasoning: s.agentReasoning,
          evidence: s.evidenceFound || [],
          gsql_query_used: s.gsqlExecution?.queryName || null
        })),
        graph_subnetwork: {
          nodes_count: c.subgraph.nodes.length,
          edges_count: c.subgraph.edges.length,
          density_score: c.subgraph.densityScore,
          community_cluster: c.subgraph.communityId
        }
      },
      next_best_action_before_evidence: {
        recommended_action: c.actionBeforeEvidence.recommendedAction,
        approval_route: c.actionBeforeEvidence.approvalRoute,
        rationale: c.actionBeforeEvidence.rationale,
        initial_uncertainty_score: c.assessment.initialUncertainty
      },
      controlled_evidence_gathering: {
        evidence_action_id: c.controlledEvidence.id,
        evidence_type: c.controlledEvidence.type,
        policy_rule: c.controlledEvidence.policyRule,
        response_outcome: c.controlledEvidence.responseOutcome
      },
      next_best_action_after_evidence: {
        recommended_action: c.actionAfterEvidence.recommendedAction,
        approval_route: c.actionAfterEvidence.approvalRoute,
        rationale: c.actionAfterEvidence.rationale,
        final_confidence_score: c.assessment.confidenceScore,
        final_uncertainty_score: c.assessment.finalUncertainty,
        action_status: c.actionAfterEvidence.status
      },
      suspicious_activity_report: c.sarReport ? {
        sar_id: c.sarReport.sarId,
        filing_date: c.sarReport.filingDate,
        total_amount_at_risk: c.sarReport.totalAmountAtRiskUSD,
        primary_typology: c.sarReport.primaryTypology,
        law_enforcement_codes: c.sarReport.lawEnforcementCodes,
        summary_narrative: c.sarReport.summaryNarrative,
        graph_nexus: c.sarReport.graphNexusDetails,
        chronology: c.sarReport.chronologyOfEvents
      } : null,
      graph_memory_persisted: c.graphMemoryPersisted,
      similar_historical_cases_referenced: c.similarHistoricalCases.map((m) => m.caseId)
    }));
  }
}
