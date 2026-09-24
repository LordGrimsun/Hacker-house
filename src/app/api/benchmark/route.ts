import { NextResponse } from "next/server";
import { BENCHMARK_CASES } from "@/data/benchmarkCases";
import { AgentInvestigationEngine } from "@/lib/agentEngine";

export async function GET() {
  const officialEvaluationFormat = AgentInvestigationEngine.generateOfficialSubmissionJson(BENCHMARK_CASES);
  return NextResponse.json({
    hackathon: "TigerGraph Agentic Fraud Investigation HHGOA",
    team_name: "ByteMe",
    submission_date: "2026-09-24",
    total_cases_evaluated: BENCHMARK_CASES.length,
    cases: officialEvaluationFormat
  });
}
