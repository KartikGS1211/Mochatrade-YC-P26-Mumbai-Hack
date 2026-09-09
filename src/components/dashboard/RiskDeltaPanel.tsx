"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RiskAnalysisResult } from "@/types/risk";

interface RiskDeltaPanelProps {
  analysis: RiskAnalysisResult;
  onScrollToAlternatives?: () => void;
  onEditOrder?: () => void;
}

export function RiskDeltaPanel({
  analysis,
  onScrollToAlternatives,
  onEditOrder,
}: RiskDeltaPanelProps) {
  const {
    currentScore,
    proposedScore,
    delta,
    orderLeverage,
    portfolioLeverageBefore,
    portfolioLeverageAfter,
    alertStatement,
    primaryDriver,
    alertWarning,
  } = analysis;

  return (
    <Card className="bg-ms-navy text-white border-0 shadow-elevated overflow-hidden relative">
      {/* Decorative subtle background gradient */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-ms-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-ms-red/10 rounded-full blur-3xl pointer-events-none" />

      <CardContent className="p-6 sm:p-8 space-y-6 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-bold text-ms-blue uppercase tracking-wider block">
              Risk Delta · Calculated Output
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Here’s what could break the trade.
            </h2>
          </div>
          <Badge
            variant="destructive"
            className="bg-ms-red text-white font-bold text-xs px-3 py-1 self-start sm:self-auto uppercase tracking-wide border-0 shadow-subtle animate-soft-pulse"
          >
            ● High Risk Detected
          </Badge>
        </div>

        {/* ── Main Score Transition Focus ── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Current Score */}
          <div className="text-center sm:text-left">
            <span className="text-xs text-white/60 font-semibold uppercase tracking-wider block mb-1">
              Current Portfolio
            </span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-4xl sm:text-5xl font-extrabold text-ms-amber font-tabular">
                {currentScore}
              </span>
              <span className="text-xs text-white/60 font-medium">/ 100</span>
            </div>
            <Badge
              variant="outline"
              className="mt-1 border-amber-500/40 text-amber-300 text-[10px] font-semibold"
            >
              Moderate
            </Badge>
          </div>

          {/* Delta Indicator */}
          <div className="flex flex-col items-center">
            <div className="bg-ms-red text-white text-base sm:text-lg font-extrabold px-4 py-1.5 rounded-full shadow-subtle flex items-center gap-1.5 font-tabular">
              <span>▲</span>
              <span>+{delta} pts</span>
            </div>
            <span className="text-[11px] text-white/50 mt-1 uppercase tracking-wider">
              Calculated Jump
            </span>
          </div>

          {/* Proposed Score */}
          <div className="text-center sm:text-right">
            <span className="text-xs text-white/60 font-semibold uppercase tracking-wider block mb-1">
              Post-Trade Risk
            </span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-end">
              <span className="text-4xl sm:text-5xl font-extrabold text-ms-red font-tabular">
                {proposedScore}
              </span>
              <span className="text-xs text-white/60 font-medium">/ 100</span>
            </div>
            <Badge
              variant="destructive"
              className="mt-1 bg-ms-red text-white text-[10px] font-bold"
            >
              High Risk
            </Badge>
          </div>
        </div>

        {/* ── Explanatory Statement & Warning ── */}
        <div className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm sm:text-base font-semibold text-white leading-snug">
            “{alertStatement}”
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 pt-1 border-t border-white/10">
            <div>
              <span className="text-white/50 mr-1.5">Primary driver:</span>
              <span className="font-bold text-ms-blue">{primaryDriver}</span>
            </div>
            <div className="text-rose-300 font-medium">
              ⚠ {alertWarning}
            </div>
          </div>
        </div>

        {/* ── Leverage Breakdown: Order vs Total Portfolio ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
            <span className="text-[11px] text-white/60 block mb-0.5">Order Leverage</span>
            <span className="text-base font-extrabold text-white font-tabular">
              {orderLeverage}×
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
            <span className="text-[11px] text-white/60 block mb-0.5">Portfolio Leverage (Before)</span>
            <span className="text-base font-extrabold text-amber-300 font-tabular">
              {portfolioLeverageBefore}×
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
            <span className="text-[11px] text-white/60 block mb-0.5">Portfolio Leverage (After)</span>
            <span className="text-base font-extrabold text-rose-300 font-tabular">
              {portfolioLeverageAfter}×
            </span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onScrollToAlternatives && (
            <Button
              variant="default"
              size="sm"
              onClick={onScrollToAlternatives}
              className="bg-ms-blue hover:bg-blue-600 text-white font-semibold text-xs h-9 cursor-pointer"
            >
              Compare alternatives
            </Button>
          )}

          {onEditOrder && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditOrder}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 text-xs h-9 font-semibold cursor-pointer"
            >
              Edit order
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-9 cursor-pointer"
          >
            Continue with awareness →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
