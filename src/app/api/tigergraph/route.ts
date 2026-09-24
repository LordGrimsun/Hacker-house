import { NextRequest, NextResponse } from "next/server";
import { executeTigerGraphQuery, DEFAULT_TIGERGRAPH_CONFIG } from "@/lib/tigergraph";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { queryName, parameters, config } = body;

    const result = await executeTigerGraphQuery(
      queryName || "find_shared_device_rings",
      parameters || {},
      config || DEFAULT_TIGERGRAPH_CONFIG
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute TigerGraph query" },
      { status: 500 }
    );
  }
}
