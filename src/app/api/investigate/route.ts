import { NextRequest, NextResponse } from "next/server";
import { BENCHMARK_CASES } from "@/data/benchmarkCases";
import { AgentInvestigationEngine } from "@/lib/agentEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, stepIndex, simulateOutcome } = body;

    const targetCase = BENCHMARK_CASES.find((c) => c.id === caseId) || BENCHMARK_CASES[0];

    if (simulateOutcome) {
      const updatedCase = AgentInvestigationEngine.simulateControlledEvidenceResponse(targetCase, simulateOutcome);
      return NextResponse.json({ success: true, case: updatedCase });
    }

    if (stepIndex !== undefined) {
      const { updatedCase, stepResult } = await AgentInvestigationEngine.runInvestigationStep(targetCase, stepIndex);
      return NextResponse.json({ success: true, case: updatedCase, stepResult });
    }

    return NextResponse.json({ success: true, case: targetCase });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
