"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { PortfolioHealthCard } from "@/components/dashboard/PortfolioHealthCard";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { INITIAL_PORTFOLIO } from "@/lib/mock-risk-data";
import type { Portfolio, Holding } from "@/types/risk";
import { toast } from "sonner";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio>(INITIAL_PORTFOLIO);

  const handleAddHolding = (newHolding: Holding) => {
    setPortfolio((prev) => {
      const updated = [...prev.holdings, newHolding];
      const exposure = updated.reduce((acc, h) => acc + h.exposure, 0);
      return {
        ...prev,
        holdings: updated,
        openPositions: updated.length,
        grossExposure: exposure,
        grossLeverage: Number((exposure / prev.equity).toFixed(2)),
      };
    });
  };

  const handleEditHolding = (updatedHolding: Holding) => {
    setPortfolio((prev) => {
      const updated = prev.holdings.map((h) => (h.id === updatedHolding.id ? updatedHolding : h));
      const exposure = updated.reduce((acc, h) => acc + h.exposure, 0);
      return {
        ...prev,
        holdings: updated,
        grossExposure: exposure,
        grossLeverage: Number((exposure / prev.equity).toFixed(2)),
      };
    });
  };

  const handleRemoveHolding = (id: string) => {
    setPortfolio((prev) => {
      const updated = prev.holdings.filter((h) => h.id !== id);
      const exposure = updated.reduce((acc, h) => acc + h.exposure, 0);
      return {
        ...prev,
        holdings: updated,
        openPositions: updated.length,
        grossExposure: exposure,
        grossLeverage: Number((exposure / prev.equity).toFixed(2)),
      };
    });
  };

  const handleResetHoldings = () => {
    setPortfolio(INITIAL_PORTFOLIO);
    toast.info("Reset portfolio state");
  };

  const formatINR = (val: number) =>
    val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="flex min-h-screen bg-ms-bg">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader title="Portfolio Exposure & Risk Factors" onResetDemo={handleResetHoldings} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-ms-blue uppercase tracking-wider">
              Asset Allocation Analysis
            </span>
            <h2 className="text-2xl font-extrabold text-ms-navy tracking-tight">
              Active Holdings & Correlation Exposure
            </h2>
            <p className="text-xs sm:text-sm text-ms-muted">
              Analyze margin deployment, gross leverage, and factor concentration across active positions.
            </p>
          </div>

          {/* Health Gauge & Capital Summary */}
          <PortfolioHealthCard portfolio={portfolio} />

          {/* Holdings Table */}
          <HoldingsTable
            holdings={portfolio.holdings}
            onAddHolding={handleAddHolding}
            onEditHolding={handleEditHolding}
            onRemoveHolding={handleRemoveHolding}
            onResetHoldings={handleResetHoldings}
          />

          {/* Asset Allocation & Sector Concentration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-ms-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-ms-navy">
                  Exposure Weights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {portfolio.holdings.map((h) => {
                  const pct = Math.round((h.exposure / portfolio.grossExposure) * 100);
                  return (
                    <div key={h.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-ms-navy">{h.symbol} · {h.name}</span>
                        <span className="font-bold font-tabular text-ms-navy">
                          {formatINR(h.exposure)} ({pct}%)
                        </span>
                      </div>
                      <Progress value={pct} className="h-2 bg-ms-bg" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-white border-ms-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-ms-navy">
                  Factor Clustering
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-ms-navy">High-Beta Tech & Semis</span>
                    <span className="font-bold text-ms-red font-tabular">73.3% of exposure</span>
                  </div>
                  <Progress value={73.3} className="h-2 bg-ms-bg [&>div]:bg-ms-red" />
                  <p className="text-[11px] text-ms-muted">AAPL and AMD share market sensitivity.</p>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-ms-navy">Crypto-Linked Risk</span>
                    <span className="font-bold text-amber-600 font-tabular">26.7% of exposure</span>
                  </div>
                  <Progress value={26.7} className="h-2 bg-ms-bg [&>div]:bg-amber-500" />
                  <p className="text-[11px] text-ms-muted">COIN adds crypto liquidity beta.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
