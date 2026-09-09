"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Portfolio } from "@/types/risk";

interface PortfolioHealthCardProps {
  portfolio: Portfolio;
}

export function PortfolioHealthCard({ portfolio }: PortfolioHealthCardProps) {
  const { riskScore, riskLabel, grossExposure, grossLeverage, equity, openPositions, dataWindow } = portfolio;

  // SVG Gauge parameters (r = 40, circumference ≈ 251.33)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = riskScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const formatINR = (val: number) =>
    val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* ── Main Score Card (2 columns wide) ── */}
      <Card className="md:col-span-2 bg-white border-ms-border shadow-card hover:shadow-elevated transition-shadow">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
              Relative Index · 0–100
            </div>
            <CardTitle className="text-base font-bold text-ms-navy">
              Portfolio Risk Health
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="bg-amber-50 text-ms-amber border-amber-200 font-semibold px-2.5 py-0.5 text-xs"
          >
            ● {riskLabel}
          </Badge>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Circular Gauge */}
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#E7EAF0"
                  strokeWidth="8"
                />
                {/* Value Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#D99B27"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="animate-dash transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-ms-navy font-tabular">
                  {riskScore}
                </span>
                <span className="text-[11px] text-ms-muted font-medium">/ 100</span>
              </div>
            </div>

            {/* Context & Metrics */}
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-ms-muted leading-relaxed">
                Before adding the proposed order, your portfolio carries a concentrated high-beta profile.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-ms-bg p-3 rounded-lg border border-ms-border">
                  <span className="text-[11px] font-semibold text-ms-muted uppercase tracking-wider block mb-0.5">
                    Gross Exposure
                  </span>
                  <span className="text-base font-bold text-ms-navy font-tabular">
                    {formatINR(grossExposure)}
                  </span>
                </div>

                <div className="bg-ms-bg p-3 rounded-lg border border-ms-border">
                  <span className="text-[11px] font-semibold text-ms-muted uppercase tracking-wider block mb-0.5">
                    Portfolio Gross Leverage
                  </span>
                  <span className="text-base font-bold text-ms-navy font-tabular">
                    {grossLeverage}×
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Summary Card (1 column wide) ── */}
      <Card className="bg-white border-ms-border shadow-card flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
            Capital Snapshot
          </div>
          <CardTitle className="text-base font-bold text-ms-navy">
            Portfolio Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3.5 pt-1">
          <div className="flex items-center justify-between pb-2.5 border-b border-ms-border">
            <span className="text-xs text-ms-muted font-medium">Portfolio Equity</span>
            <span className="text-sm font-bold text-ms-navy font-tabular">
              {formatINR(equity)}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-ms-border">
            <span className="text-xs text-ms-muted font-medium">Open Positions</span>
            <span className="text-sm font-bold text-ms-navy font-tabular">
              {openPositions}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-ms-muted font-medium">Data Window</span>
            <span className="text-xs font-semibold bg-ms-softblue text-ms-blue px-2 py-0.5 rounded">
              {dataWindow}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
