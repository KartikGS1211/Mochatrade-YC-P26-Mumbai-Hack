"use client";

import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { PresentationModeBanner } from "@/components/app/PresentationMode";
import { PortfolioHealthCard } from "@/components/dashboard/PortfolioHealthCard";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { ProposedOrderTicket } from "@/components/trade/ProposedOrderTicket";
import { RiskDeltaPanel } from "@/components/dashboard/RiskDeltaPanel";
import { ScoreComposition } from "@/components/dashboard/ScoreComposition";
import { CorrelationHeatmap } from "@/components/dashboard/CorrelationHeatmap";
import { StressTestPanel } from "@/components/dashboard/StressTestPanel";
import { AlternativesPanel } from "@/components/dashboard/AlternativesPanel";
import { ExplanationPanel } from "@/components/dashboard/ExplanationPanel";
import { usePortfolio } from "@/context/PortfolioContext";
import { DEFAULT_PROPOSED_ORDER, DEFAULT_RISK_ANALYSIS } from "@/lib/mock-risk-data";
import { analyzePortfolioRisk } from "@/lib/risk-api";
import type {
  ProposedOrder,
  RiskAnalysisResult,
  AlternativeOption,
} from "@/types/risk";
import { toast } from "sonner";

export default function RiskCheckPage() {
  const { portfolio, isLoading, handleAddHolding, handleEditHolding, handleRemoveHolding, handleResetHoldings } = usePortfolio();
  const [order, setProposedOrder] = useState<ProposedOrder>(DEFAULT_PROPOSED_ORDER);
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(
    DEFAULT_RISK_ANALYSIS
  );
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const alternativesRef = useRef<HTMLDivElement>(null);
  const orderTicketRef = useRef<HTMLDivElement>(null);

  const handleChangeOrder = (updated: Partial<ProposedOrder>) => {
    setProposedOrder((prev) => ({ ...prev, ...updated }));
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePortfolioRisk(order);
      setAnalysisResult(result);
      toast.success("Risk index calculated successfully");
    } catch {
      toast.error("Error evaluating portfolio risk");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAlternative = async (alt: AlternativeOption) => {
    const updatedOrder: ProposedOrder = {
      ...order,
      margin: alt.margin,
      leverage: alt.leverage,
      exposure: alt.exposure,
    };
    setProposedOrder(updatedOrder);
    setIsAnalyzing(true);
    try {
      const result = await analyzePortfolioRisk(updatedOrder);
      setAnalysisResult(result);
      toast.success(`Applied ${alt.title} (Score: ${alt.riskScore})`);
      orderTicketRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRunAnalysis();
    }, 600);
    return () => clearTimeout(timer);
  }, [order.margin, order.leverage, order.symbol]);

  const handleTriggerPreset = (preset: "default" | "smaller" | "lower") => {
    if (preset === "default") {
      handleChangeOrder({ symbol: "NVDA", margin: 20_000, leverage: 3, exposure: 60_000 });
      handleRunAnalysis();
    } else if (preset === "smaller") {
      handleChangeOrder({ symbol: "NVDA", margin: 10_000, leverage: 3, exposure: 30_000 });
      handleRunAnalysis();
    } else if (preset === "lower") {
      handleChangeOrder({ symbol: "NVDA", margin: 20_000, leverage: 1, exposure: 20_000 });
      handleRunAnalysis();
    }
  };

  return (
    <div className="flex min-h-screen bg-ms-bg">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Pre-trade Risk Check"
          onResetDemo={handleResetHoldings}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={() => setIsPresentationMode((prev) => !prev)}
        />

        {isPresentationMode && (
          <PresentationModeBanner
            onExit={() => setIsPresentationMode(false)}
            onTriggerPreset={handleTriggerPreset}
          />
        )}

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {isLoading || !portfolio ? (
            <div className="flex items-center justify-center h-64">
              <span className="text-ms-muted text-sm">Loading live portfolio data...</span>
            </div>
          ) : (
            <>
          {/* ── Intro Awareness Banner ── */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-ms-blue uppercase tracking-wider">
              As Portfolio Awareness Layer
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-ms-navy tracking-tight">
                Evaluate how a proposed order changes your portfolio before execution.
              </h2>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-ms-green animate-pulse" />
                <span className="text-xs font-bold text-ms-navy">Engine ready</span>
              </div>
            </div>
          </div>

          {/* ── Top Layout (Mobile: Order Ticket First, Desktop: 2-column) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <PortfolioHealthCard portfolio={portfolio} analysisResult={analysisResult} />
              <HoldingsTable
                holdings={portfolio.holdings}
                onAddHolding={handleAddHolding}
                onEditHolding={handleEditHolding}
                onRemoveHolding={handleRemoveHolding}
                onResetHoldings={handleResetHoldings}
              />
            </div>

            <div ref={orderTicketRef} className="lg:col-span-5 order-1 lg:order-2 sticky lg:top-20 space-y-4">
              <ProposedOrderTicket
                order={order}
                onChangeOrder={handleChangeOrder}
                onSubmit={handleRunAnalysis}
                isLoading={isAnalyzing}
              />
            </div>
          </div>

          {/* ── Completed Risk Analysis Section ── */}
          <div aria-live="polite" className="space-y-8 pt-4">
            {analysisResult && (
              <>
                <RiskDeltaPanel
                  analysis={analysisResult}
                  onScrollToAlternatives={() => alternativesRef.current?.scrollIntoView({ behavior: "smooth" })}
                  onEditOrder={() => orderTicketRef.current?.scrollIntoView({ behavior: "smooth" })}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7">
                    <ScoreComposition
                      components={analysisResult.components}
                      compositeBefore={analysisResult.currentScore}
                      compositeAfter={analysisResult.proposedScore}
                      compositeDelta={analysisResult.delta}
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <CorrelationHeatmap data={analysisResult.correlation} />
                  </div>
                </div>

                <StressTestPanel scenarios={analysisResult.scenarios} />

                <div ref={alternativesRef}>
                  <AlternativesPanel
                    alternatives={analysisResult.alternatives}
                    onApplyAlternative={handleApplyAlternative}
                  />
                </div>

                <ExplanationPanel explanation={analysisResult.explanation} />
              </>
            )}
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
