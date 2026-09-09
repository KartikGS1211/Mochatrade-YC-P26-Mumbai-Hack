"use client";

import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MethodologyPage() {
  return (
    <div className="flex min-h-screen bg-ms-bg">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader title="Risk Engine Methodology & Scoring Model" />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-ms-blue uppercase tracking-wider">
              Mathematical Foundation
            </span>
            <h2 className="text-2xl font-extrabold text-ms-navy tracking-tight">
              The MochaShield Composite Risk Index
            </h2>
            <p className="text-xs sm:text-sm text-ms-muted">
              How MochaShield translates multidimensional portfolio derivatives exposure into an intuitive 0–100 index.
            </p>
          </div>

          {/* Formula Card */}
          <Card className="bg-ms-navy text-white border-0 shadow-elevated">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ms-blue uppercase tracking-wider">
                  Core Mathematical Formula
                </span>
                <Badge className="bg-ms-blue text-white text-[10px] font-bold">
                  Equal Attribution
                </Badge>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 font-mono text-sm sm:text-base text-white/95 leading-relaxed space-y-2">
                <div className="text-ms-blue font-bold text-lg sm:text-xl">
                  Composite Risk Score (0–100) =
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">25%</span>
                    <span>Concentration Index</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">25%</span>
                    <span>Correlation Co-movement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">25%</span>
                    <span>Gross Portfolio Leverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">25%</span>
                    <span>Scenario Stress Drawdown</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/70 leading-relaxed pt-1">
                Each pillar is normalized on a standard 0–100 percentile scale before aggregation, ensuring that no single component overwhelms the warning threshold without transparent attribution.
              </p>
            </CardContent>
          </Card>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <Card className="bg-white border-ms-border shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    Pillar 1 · 25% Weight
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold">Concentration</Badge>
                </div>
                <CardTitle className="text-base font-bold text-ms-navy">
                  Herfindahl Concentration Index
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-ms-muted leading-relaxed space-y-2">
                <p>
                  Evaluates the distribution of capital notional across individual assets and correlated industry groups.
                </p>
                <p>
                  Adding ₹60,000 NVDA to a portfolio already holding AMD and AAPL causes the technology sector share of gross exposure to rise from 50% to over 70%, triggering a concentration jump from 46 to 81.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="bg-white border-ms-border shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Pillar 2 · 25% Weight
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold">Correlation</Badge>
                </div>
                <CardTitle className="text-base font-bold text-ms-navy">
                  90-Day Rolling Pairwise Covariance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-ms-muted leading-relaxed space-y-2">
                <p>
                  Measures historical daily log-return co-movements across a rolling 90-day window.
                </p>
                <div className="bg-ms-bg p-3 rounded-lg border border-ms-border text-[11px] font-medium text-ms-navy">
                  ⚠️ Note: Correlation is dynamic and non-stationary. Historical covariance can spike toward 1.0 during broad liquidity events.
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="bg-white border-ms-border shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Pillar 3 · 25% Weight
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold">Leverage</Badge>
                </div>
                <CardTitle className="text-base font-bold text-ms-navy">
                  Gross Portfolio Leverage Ratio
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-ms-muted leading-relaxed space-y-2">
                <p>
                  Calculates the aggregate notional market exposure across all long and short contracts divided by total net liquidating equity.
                </p>
                <p>
                  While the specific order uses 3× margin leverage, total portfolio leverage shifts from 0.75× to 1.35×, accelerating margin liquidation thresholds.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 4 */}
            <Card className="bg-white border-ms-border shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    Pillar 4 · 25% Weight
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold">Scenario Risk</Badge>
                </div>
                <CardTitle className="text-base font-bold text-ms-navy">
                  Deterministic Factor Stress Drawdown
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-ms-muted leading-relaxed space-y-2">
                <p>
                  Applies historical stress matrices (such as the 2022 tech compression or 2020 liquidity shock) to the combined positions.
                </p>
                <p>
                  Estimated loss under a tech re-pricing rises from -8.1% (-₹8,100) to -15.3% (-₹15,300), nearly doubling downside vulnerability.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Boundaries & Governance */}
          <Card className="bg-white border-ms-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-ms-navy">
                Model Boundaries & Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-ms-muted leading-relaxed space-y-2">
              <p>
                MochaShield provides deterministic portfolio decision support. It does not predict future prices, generate automated trading signals, or manage margin liquidation. All risk indices are relative gauges calibrated to assist leveraged traders in maintaining portfolio longevity.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
