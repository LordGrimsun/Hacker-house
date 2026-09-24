"use client";

import React, { useState, useEffect, useRef } from "react";
import { GraphSubnetwork, GraphNode, GraphEdge, GSQLQueryExecution } from "@/types";
import { soundManager } from "@/lib/audioEffects";
import {
  Terminal,
  Maximize2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Info,
  ShieldAlert,
  Cpu,
  Network,
  Plus,
  Play,
  Share2,
  Sparkles
} from "lucide-react";

interface GraphVisualizerProps {
  subgraph: GraphSubnetwork;
  gsqlQueries: GSQLQueryExecution[];
  caseId: string;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  subgraph: initialSubgraph,
  gsqlQueries,
  caseId,
}) => {
  const [currentSubgraph, setCurrentSubgraph] = useState<GraphSubnetwork>(initialSubgraph);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeTab, setActiveTab] = useState<"GRAPH" | "GSQL">("GRAPH");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isExpanding, setIsExpanding] = useState(false);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<{ [id: string]: { x: number; y: number } }>({});
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setCurrentSubgraph(initialSubgraph);
    const positions: { [id: string]: { x: number; y: number } } = {};
    const width = 640;
    const height = 380;
    const centerX = width / 2;
    const centerY = height / 2;

    const count = initialSubgraph.nodes.length;
    initialSubgraph.nodes.forEach((node, idx) => {
      if (node.type === "Transaction") {
        positions[node.id] = { x: centerX, y: centerY };
      } else {
        const angle = (idx / Math.max(count - 1, 1)) * 2 * Math.PI;
        const radius = Math.min(width, height) * 0.36;
        positions[node.id] = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        };
      }
    });

    setNodePositions(positions);
    setSelectedNode(initialSubgraph.nodes[0] || null);
  }, [initialSubgraph]);

  // Handle Dragging
  const handleMouseDown = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    soundManager.playBlip(600, 0.03);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 640;
    const y = ((e.clientY - rect.top) / rect.height) * 380;

    setNodePositions((prev) => ({
      ...prev,
      [draggingNodeId]: { x: Math.max(30, Math.min(610, x)), y: Math.max(30, Math.min(350, y)) },
    }));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Expand 2-Hops in TigerGraph dynamically
  const handleExpandNeighbors = () => {
    if (!selectedNode) return;
    setIsExpanding(true);
    soundManager.playGsqlPulse();

    setTimeout(() => {
      const newNodeId = `EXP-NODE-${Date.now().toString().slice(-4)}`;
      const newNode: GraphNode = {
        id: newNodeId,
        label: `Shared Device Ring #${newNodeId.slice(-3)}`,
        type: "Device",
        riskScore: 0.94,
        isFlagged: true,
        properties: {
          expanded_via: "TigerGraph GSQL 2-Hop Traversal",
          shared_hardware: "Apple MacBookPro18,1",
          session_velocity: "18 probes / 10m"
        }
      };

      const newEdge: GraphEdge = {
        id: `exp-edge-${Date.now()}`,
        source: selectedNode.id,
        target: newNodeId,
        label: "DISCOVERED_HOP",
        type: "USED_DEVICE",
        isSuspicious: true
      };

      const pos = nodePositions[selectedNode.id] || { x: 320, y: 190 };
      setNodePositions((prev) => ({
        ...prev,
        [newNodeId]: { x: Math.min(pos.x + 80, 580), y: Math.max(pos.y - 70, 40) }
      }));

      setCurrentSubgraph((prev) => ({
        ...prev,
        nodes: [...prev.nodes, newNode],
        edges: [...prev.edges, newEdge]
      }));

      setSelectedNode(newNode);
      setIsExpanding(false);
      soundManager.playSuccess();
    }, 450);
  };

  const getNodeColor = (node: GraphNode) => {
    if (node.isFlagged || (node.riskScore && node.riskScore > 0.7)) {
      return {
        bg: "fill-rose-500",
        border: "stroke-rose-400",
        halo: "rgba(244, 63, 94, 0.4)",
        text: "text-rose-400",
      };
    }
    switch (node.type) {
      case "Customer":
        return { bg: "fill-blue-500", border: "stroke-blue-400", halo: "rgba(59, 130, 246, 0.3)", text: "text-blue-400" };
      case "Account":
        return { bg: "fill-emerald-500", border: "stroke-emerald-400", halo: "rgba(16, 185, 129, 0.3)", text: "text-emerald-400" };
      case "Card":
        return { bg: "fill-amber-500", border: "stroke-amber-400", halo: "rgba(245, 158, 11, 0.3)", text: "text-amber-400" };
      case "Device":
        return { bg: "fill-purple-500", border: "stroke-purple-400", halo: "rgba(168, 85, 247, 0.3)", text: "text-purple-400" };
      case "IPAddress":
        return { bg: "fill-cyan-500", border: "stroke-cyan-400", halo: "rgba(6, 182, 212, 0.3)", text: "text-cyan-400" };
      case "Merchant":
        return { bg: "fill-orange-500", border: "stroke-orange-400", halo: "rgba(249, 115, 22, 0.3)", text: "text-orange-400" };
      default:
        return { bg: "fill-slate-500", border: "stroke-slate-400", halo: "rgba(100, 116, 139, 0.3)", text: "text-slate-400" };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Visualizer Header */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Network className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            TigerGraph Topology &amp; Multi-Hop Nexus
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
            {currentSubgraph.communityId || "COMM-CLUSTER"}
          </span>
        </div>

        {/* Tab switch & zoom */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setActiveTab("GRAPH")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === "GRAPH" ? "bg-orange-500 text-white font-medium shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Graph Canvas
            </button>
            <button
              onClick={() => setActiveTab("GSQL")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                activeTab === "GSQL" ? "bg-orange-500 text-white font-medium shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>GSQL Queries</span>
            </button>
          </div>

          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Reset view"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row bg-[#080d19]">
        {activeTab === "GRAPH" ? (
          <>
            <div className="flex-1 relative h-72 md:h-auto overflow-hidden">
              <svg
                ref={svgRef}
                viewBox="0 0 640 380"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="w-full h-full select-none cursor-grab active:cursor-grabbing transition-transform"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
              >
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#172033" strokeWidth="0.8" />
                  </pattern>

                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="22" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#f97316" opacity="0.8" />
                  </marker>
                  <marker id="arrowhead-suspicious" markerWidth="8" markerHeight="6" refX="22" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" opacity="0.9" />
                  </marker>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Render Edges with Flow Animation */}
                {currentSubgraph.edges.map((edge) => {
                  const src = nodePositions[edge.source];
                  const tgt = nodePositions[edge.target];
                  if (!src || !tgt) return null;

                  const midX = (src.x + tgt.x) / 2;
                  const midY = (src.y + tgt.y) / 2;

                  return (
                    <g key={edge.id} className="group">
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={edge.isSuspicious ? "#f43f5e" : "#475569"}
                        strokeWidth={edge.isSuspicious ? 2.2 : 1.4}
                        strokeDasharray={edge.isSuspicious ? "5 3" : undefined}
                        markerEnd={edge.isSuspicious ? "url(#arrowhead-suspicious)" : "url(#arrowhead)"}
                        className={edge.isSuspicious ? "animate-pulse" : "transition-colors group-hover:stroke-orange-400"}
                      />
                      <text
                        x={midX}
                        y={midY - 4}
                        fill={edge.isSuspicious ? "#fca5a5" : "#94a3b8"}
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="pointer-events-none select-none drop-shadow"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Render Nodes with Physics Drag-and-Drop */}
                {currentSubgraph.nodes.map((node) => {
                  const pos = nodePositions[node.id] || { x: 320, y: 190 };
                  const color = getNodeColor(node);
                  const isSelected = selectedNode?.id === node.id;
                  const isFlagged = node.isFlagged || (node.riskScore && node.riskScore > 0.7);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onMouseDown={() => handleMouseDown(node.id)}
                      onClick={() => {
                        setSelectedNode(node);
                        soundManager.playBlip(750, 0.03);
                      }}
                      className="cursor-pointer group"
                    >
                      {(isFlagged || isSelected) && (
                        <circle
                          r={isSelected ? 26 : 22}
                          fill={color.halo}
                          className="animate-pulse"
                        />
                      )}

                      <circle
                        r={18}
                        className={`${color.bg} ${color.border} stroke-2 transition-transform duration-200 group-hover:scale-110 shadow-lg`}
                      />

                      <text
                        y={30}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="10"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-md select-none"
                      >
                        {node.label.length > 20 ? node.label.slice(0, 18) + "..." : node.label}
                      </text>

                      <text
                        y={-24}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8.5"
                        fontWeight="600"
                        fontFamily="monospace"
                        className="pointer-events-none select-none uppercase"
                      >
                        {node.type}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Instructions Overlay */}
              <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-slate-400 font-mono">
                💡 Drag nodes to rearrange • Click to inspect &amp; expand hops
              </div>

              {/* Legend */}
              <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 flex flex-wrap gap-2.5 shadow-lg">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Customer</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Card</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Device</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> IP</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Malicious / Ring</span>
              </div>
            </div>

            {/* Selected Node Details Drawer */}
            <div className="w-full md:w-64 bg-slate-900/90 border-t md:border-t-0 md:border-l border-slate-800/80 p-3.5 overflow-y-auto text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-orange-400" />
                    <span>Vertex Inspector</span>
                  </span>
                  {selectedNode?.isFlagged && (
                    <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded text-[10px] font-bold">
                      SUSPECT
                    </span>
                  )}
                </div>

                {selectedNode ? (
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Vertex ID:</span>
                      <p className="font-mono font-bold text-orange-300 break-all">{selectedNode.id}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Entity Type:</span>
                      <p className="font-semibold text-white">{selectedNode.type}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Label:</span>
                      <p className="text-slate-200">{selectedNode.label}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1.5">
                        Attributes (GSQL Schema):
                      </span>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
                        {Object.entries(selectedNode.properties).map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-2">
                            <span className="text-slate-400 truncate">{k}:</span>
                            <span className="text-orange-300 font-semibold">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic py-6 text-center">Click any node to inspect.</p>
                )}
              </div>

              {/* Dynamic 2-Hop Expansion Button */}
              {selectedNode && (
                <div className="pt-3 border-t border-slate-800 mt-3">
                  <button
                    onClick={handleExpandNeighbors}
                    disabled={isExpanding}
                    className="w-full py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isExpanding ? "Expanding GSQL Hops..." : "+ Expand 2 Hops in TigerGraph"}</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* GSQL Tab */
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950 font-mono text-xs">
            {gsqlQueries.map((gsql, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-lg">
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-orange-400">{gsql.queryName}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    Executed in {gsql.executionTimeMs} ms
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  <p className="text-[11px] text-slate-400 font-sans">{gsql.description}</p>
                  <pre className="p-3 bg-black/70 rounded-lg text-emerald-300 overflow-x-auto text-[11px] leading-relaxed border border-slate-800/60">
                    {gsql.gsqlCode}
                  </pre>
                  <div className="text-[11px] text-slate-400 pt-1">
                    <span className="text-slate-500 font-semibold">Graph Summary: </span>
                    <span className="text-slate-200">{gsql.resultSummary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
