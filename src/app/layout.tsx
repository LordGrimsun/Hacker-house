import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TigerGraph Agentic Fraud Sentinel | Team ByteMe (HHGOA 2026)",
  description: "AI Agent for Fraud Investigation and Next-Best Action powered by TigerGraph Savanna, GSQL, GraphRAG, and Uncertainty Reasoning.",
  keywords: ["TigerGraph", "Fraud Detection", "AI Agent", "GraphRAG", "GSQL", "IEEE-CIS", "Vesta", "FinCEN SAR", "ByteMe"],
  authors: [{ name: "Team ByteMe" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#060911] text-slate-100 selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
