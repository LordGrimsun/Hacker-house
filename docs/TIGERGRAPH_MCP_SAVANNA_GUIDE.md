# TigerGraph Savanna Cloud & TigerGraph MCP Integration Guide

This guide explains how to connect the **ByteMe AI Fraud Investigation Agent** to a live **TigerGraph Savanna Cloud** managed instance (`https://savanna.tgcloud.io/`) using the official **TigerGraph MCP Server** (`https://github.com/tigergraph/tigergraph-mcp`).

---

## 1. Quick Architecture Overview

```
┌──────────────────────────────────────┐
│  ByteMe AI Fraud Investigation Agent │
│  (Next.js Dashboard & Next-Best-Action)│
└──────────────────┬───────────────────┘
                   │ MCP (Model Context Protocol)
                   ▼
┌──────────────────────────────────────┐
│    tigergraph-mcp Server             │
│    (Python pyTigerGraph Async Engine)│
└──────────────────┬───────────────────┘
                   │ REST++ & GSQL over TLS (:443)
                   ▼
┌────────────────────────────────────────────────────────┐
│  TigerGraph Savanna Cloud (https://savanna.tgcloud.io/)│
│  - FraudInvestigationGraph Schema                      │
│  - Pre-installed GSQL Queries                          │
│  - GraphRAG Memory & Vector Similarity                │
└────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Setup on TigerGraph Savanna

1. **Sign in to Savanna Cloud**:
   - Go to [https://savanna.tgcloud.io/](https://savanna.tgcloud.io/) and create/log into your account.
2. **Provision a Free Cluster**:
   - Click **Create Instance** -> Choose TigerGraph 4.x.
   - Name your instance (e.g., `byteme-fraud-investigation`).
   - Note your instance URL: `https://<your-instance>.i.tgcloud.io`.
3. **Deploy Schema & Queries**:
   - Open **GraphStudio** in Savanna.
   - Go to the **GSQL Editor** / **Write Queries** tab.
   - Paste the contents of [`scripts/tigergraph_savanna_setup.gsql`](../scripts/tigergraph_savanna_setup.gsql).
   - Click **Install Schema** and **Install Queries**.

---

## 3. Running `tigergraph-mcp`

Install the official TigerGraph MCP package:

```bash
pip install tigergraph-mcp
```

### Stdio Mode (for Claude Code, Cursor, Copilot, LangGraph)

Copy [`.env.example`](../.env.example) to `.env`:

```bash
TG_HOST=https://<your-instance>.i.tgcloud.io
TG_GRAPHNAME=FraudInvestigationGraph
TG_USERNAME=tigergraph
TG_PASSWORD=<your_savanna_password>
TG_TGCLOUD=true
TG_SSL_PORT=443
TG_RESTPP_PORT=443
TG_GS_PORT=14240
```

Start the MCP server:
```bash
tigergraph-mcp -v
```

### Streamable HTTP / SSE Mode (Multi-User Shared Server)

```bash
pip install uvicorn starlette
tigergraph-mcp --transport streamable-http --host 0.0.0.0 --port 8000
```

---

## 4. MCP Tools Used by Fraud Investigation Agent

The agent leverages these tools provided by `tigergraph-mcp`:

| Tool | Purpose in Fraud Investigation |
| :--- | :--- |
| `tigergraph__run_installed_query` | Executes pre-compiled GSQL algorithms (`find_shared_device_rings`, `detect_mule_layering`, `card_velocity_burst`). |
| `tigergraph__get_neighbors` | Dynamically traverses 1-3 hops around suspect accounts, cards, devices, and IPs. |
| `tigergraph__gsql` | Executes ad-hoc analytical graph queries for deep forensic tracing. |
| `tigergraph__get_graph_schema` | Inspects vertex & edge definitions and topology constraints. |
| `tigergraph__upsert_vertex` | Persists case findings, risk scores, and investigation history into graph memory. |
| `tigergraph__list_connections` | Manages connection pools across staging, prod, and Savanna Cloud profiles. |

---

## 5. IDE / AI Agent Configuration

You can configure `tigergraph-mcp` in Claude Desktop or Cursor using [`tigergraph_mcp_config.json`](../tigergraph_mcp_config.json):

```json
{
  "mcpServers": {
    "tigergraph": {
      "command": "tigergraph-mcp",
      "args": [],
      "env": {
        "TG_HOST": "https://your-instance.i.tgcloud.io",
        "TG_GRAPHNAME": "FraudInvestigationGraph",
        "TG_USERNAME": "tigergraph",
        "TG_PASSWORD": "your_savanna_password",
        "TG_TGCLOUD": "true",
        "TG_RESTPP_PORT": "443"
      }
    }
  }
}
```

---

## 6. Testing the Connection

In the ByteMe Sentinel web interface:
1. Navigate to **Settings** -> **TigerGraph Savanna Gateway**.
2. Enter your instance URL: `https://<your-instance>.i.tgcloud.io`.
3. Enter your password or API token.
4. Click **Test Endpoint** to verify live round-trip latency and GSQL query execution.
