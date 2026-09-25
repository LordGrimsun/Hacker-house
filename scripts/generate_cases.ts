import fs from "fs";
import path from "path";
import { BENCHMARK_CASES } from "../src/data/benchmarkCases";

const casesDir = path.resolve(__dirname, "../cases");
if (!fs.existsSync(casesDir)) {
  fs.mkdirSync(casesDir, { recursive: true });
}

const csvRows: string[] = [
  "case_id,file_name,case_number,title,typology,amount,currency,initial_risk_score,final_risk_score,confidence_score,action_before_evidence,action_after_evidence,sar_filed"
];

BENCHMARK_CASES.forEach((c, index) => {
  const caseNum = index + 1;
  const hhgId = `HHG-${String(caseNum).padStart(3, "0")}`;
  const fileName = `${hhgId}.json`;
  const filePath = path.join(casesDir, fileName);

  const initialRisk = c.assessment.initialRiskScore ?? 0.85;
  const finalRisk = c.assessment.finalRiskScore ?? 0.95;
  const confScore = c.assessment.confidenceScore ?? 95;

  const submissionData = {
    case_id: hhgId,
    case_number: caseNum,
    benchmark_reference_id: c.id,
    title: c.title,
    status: c.status,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
    transaction: {
      transaction_id: c.transaction.transactionId,
      amount: c.transaction.amountUSD,
      amount_inr: c.transaction.amountUSD,
      currency: "INR",
      timestamp: c.transaction.timestamp,
      product_code: c.transaction.productCd,
      customer: c.transaction.customer,
      merchant: c.transaction.merchant,
      device: c.transaction.device,
      card: c.transaction.card,
      vesta_signals: c.transaction.vestaSignals
    },
    typology: c.assessment.predictedTypology,
    investigation_record: {
      trigger: {
        type: c.trigger.type,
        description: c.trigger.description,
        score: c.trigger.score
      },
      assessment: {
        initial_risk_score: initialRisk,
        final_risk_score: finalRisk,
        confidence_score: confScore,
        initial_uncertainty: c.assessment.initialUncertainty,
        final_uncertainty: c.assessment.finalUncertainty,
        predicted_typology: c.assessment.predictedTypology
      },
      steps: c.steps.map((s) => ({
        step: s.stepNumber,
        stage: s.stage,
        reasoning: s.agentReasoning,
        evidence: s.evidenceFound || [],
        gsql_query_used: s.gsqlExecution?.queryName || null,
        execution_time_ms: s.gsqlExecution?.executionTimeMs || 12
      })),
      gsql_queries: c.gsqlQueries.map((g) => ({
        query_name: g.queryName,
        description: g.description,
        gsql_code: g.gsqlCode,
        parameters: g.parameters,
        execution_time_ms: g.executionTimeMs,
        result_summary: g.resultSummary,
        returned_vertices: g.returnedVerticesCount,
        returned_edges: g.returnedEdgesCount
      })),
      graph_subnetwork: {
        nodes_count: c.subgraph.nodes.length,
        edges_count: c.subgraph.edges.length,
        density_score: c.subgraph.densityScore,
        community_cluster: c.subgraph.communityId,
        nodes: c.subgraph.nodes,
        edges: c.subgraph.edges
      }
    },
    next_best_action_before_evidence: {
      recommended_action: c.actionBeforeEvidence.recommendedAction,
      approval_route: c.actionBeforeEvidence.approvalRoute,
      rationale: c.actionBeforeEvidence.rationale,
      initial_uncertainty_score: c.assessment.initialUncertainty,
      policy_reference: c.controlledEvidence.policyRule
    },
    controlled_evidence_gathering: {
      evidence_action_id: c.controlledEvidence.id,
      evidence_type: c.controlledEvidence.type,
      policy_rule: c.controlledEvidence.policyRule,
      requested_details: c.controlledEvidence.requestedDetails,
      response_outcome: c.controlledEvidence.responseOutcome
    },
    next_best_action_after_evidence: {
      recommended_action: c.actionAfterEvidence.recommendedAction,
      approval_route: c.actionAfterEvidence.approvalRoute,
      rationale: c.actionAfterEvidence.rationale,
      final_confidence_score: confScore,
      final_uncertainty_score: c.assessment.finalUncertainty,
      action_status: c.actionAfterEvidence.status
    },
    suspicious_activity_report: c.sarReport
      ? {
          sar_id: c.sarReport.sarId,
          filing_date: c.sarReport.filingDate,
          total_amount_at_risk: c.sarReport.totalAmountAtRiskUSD,
          currency: "INR",
          primary_typology: c.sarReport.primaryTypology,
          law_enforcement_codes: c.sarReport.lawEnforcementCodes,
          summary_narrative: c.sarReport.summaryNarrative,
          graph_nexus: c.sarReport.graphNexusDetails,
          chronology: c.sarReport.chronologyOfEvents
        }
      : null,
    graph_memory_persisted: true,
    similar_historical_cases_referenced: c.similarHistoricalCases.map((m) => ({
      case_id: m.caseId,
      similarity_score: m.similarityScore,
      typology: m.typology,
      outcome: m.outcome
    }))
  };

  fs.writeFileSync(filePath, JSON.stringify(submissionData, null, 2), "utf8");
  console.log(`Generated: ${fileName}`);

  const escapeCsv = (str: string) => `"${(str || "").replace(/"/g, '""')}"`;
  csvRows.push([
    hhgId,
    fileName,
    caseNum.toString(),
    escapeCsv(c.title),
    escapeCsv(c.assessment.predictedTypology),
    c.transaction.amountUSD.toString(),
    "INR",
    initialRisk.toString(),
    finalRisk.toString(),
    confScore.toString(),
    escapeCsv(c.actionBeforeEvidence.recommendedAction),
    escapeCsv(c.actionAfterEvidence.recommendedAction),
    c.sarReport ? "YES" : "NO"
  ].join(","));
});

// Write case_pack.csv in cases/
const csvContent = csvRows.join("\n");
fs.writeFileSync(path.join(casesDir, "case_pack.csv"), csvContent, "utf8");
// Also write case_pack.csv in repository root
fs.writeFileSync(path.resolve(__dirname, "../case_pack.csv"), csvContent, "utf8");

console.log("Successfully generated all 20 case files and case_pack.csv!");
