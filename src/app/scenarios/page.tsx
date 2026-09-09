"use client";

import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_RISK_ANALYSIS } from "@/lib/mock-risk-data";

export default function ScenariosPage() {
  const { scenarios } = DEFAULT_RISK_ANALYSIS;

  const formatINR = (val: number) =>
    val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="flex min-h-screen bg-ms-bg">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader title="Hypothetical Stress Testing Scenarios" />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-ms-blue uppercase tracking-wider">
              Tail Risk Simulation
            </span>
            <h2 className="text-2xl font-extrabold text-ms-navy tracking-tight">
              Forward-Looking Stress Shocks
            </h2>
            <p className="text-xs sm:text-sm text-ms-muted">
              Simulated macroeconomic shocks comparing portfolio equity drawdowns before vs. after adding the proposed NVDA position.
            </p>
          </div>

          {/* Institutional Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
            <span className="text-lg text-amber-700 shrink-0">⚠️</span>
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-bold">Not a market forecast or guaranteed outcome.</p>
              <p className="text-amber-800 mt-0.5">
                Stress scenarios are deterministic stress tests calibrated on historical covariance shocks. They illustrate potential portfolio sensitivity under adverse market conditions to help traders size positions with awareness.
              </p>
            </div>
          </div>

          {/* 3 Full Scenario Deep-Dives */}
          <div className="grid grid-cols-1 gap-6">
            {scenarios.map((scen) => (
              <Card key={scen.id} className="bg-white border-ms-border shadow-card overflow-hidden">
                <CardHeader className="bg-ms-bg/60 border-b border-ms-border/60 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base sm:text-lg font-bold text-ms-navy">
                          {scen.name}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-ms-softblue text-ms-blue text-[10px] font-semibold">
                          {scen.subtitle}
                        </Badge>
                      </div>
                      <p className="text-xs text-ms-muted mt-1">{scen.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-ms-muted block">Vulnerability Focal Point</span>
                      <span className="text-xs font-bold text-ms-red">{scen.mostAffected}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Financial Loss Comparison Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-ms-bg/50 border border-ms-border rounded-xl">
                      <span className="text-[11px] text-ms-muted uppercase font-semibold block mb-1">
                        Current Portfolio Drawdown
                      </span>
                      <div className="text-xl font-extrabold text-ms-navy font-tabular">
                        -{formatINR(scen.beforeLossAmount)}
                      </div>
                      <span className="text-xs text-ms-amber font-semibold font-tabular">
                        {scen.beforeLossPercent}% of portfolio equity
                      </span>
                    </div>

                    <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl">
                      <span className="text-[11px] text-rose-700 uppercase font-semibold block mb-1">
                        Post-Order Drawdown
                      </span>
                      <div className="text-xl font-extrabold text-ms-red font-tabular">
                        -{formatINR(scen.afterLossAmount)}
                      </div>
                      <span className="text-xs text-ms-red font-bold font-tabular">
                        {scen.afterLossPercent}% of portfolio equity
                      </span>
                    </div>

                    <div className="p-4 bg-rose-100/60 border border-rose-300 rounded-xl">
                      <span className="text-[11px] text-rose-800 uppercase font-bold block mb-1">
                        Incremental Risk Added
                      </span>
                      <div className="text-xl font-extrabold text-ms-red font-tabular">
                        +{formatINR(scen.changeAmount)}
                      </div>
                      <span className="text-xs text-rose-900 font-semibold">
                        {Math.round(((scen.afterLossAmount - scen.beforeLossAmount) / scen.beforeLossAmount) * 100)}% increase in loss severity
                      </span>
                    </div>
                  </div>

                  {/* Drawdown Visual Bar Comparison */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-ms-muted">
                      <span>Capital Depletion Spectrum</span>
                      <span className="font-tabular font-medium">Equity Scale: 0% → 20%</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-ms-navy">Baseline Portfolio Loss</span>
                          <span className="font-bold text-ms-navy font-tabular">
                            {scen.beforeLossPercent}% (-{formatINR(scen.beforeLossAmount)})
                          </span>
                        </div>
                        <div className="h-3 bg-ms-bg rounded-full overflow-hidden border border-ms-border">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${(scen.beforeLossPercent / 20) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-bold text-ms-red">Proposed Order Portfolio Loss</span>
                          <span className="font-extrabold text-ms-red font-tabular">
                            {scen.afterLossPercent}% (-{formatINR(scen.afterLossAmount)})
                          </span>
                        </div>
                        <div className="h-3 bg-ms-bg rounded-full overflow-hidden border border-ms-border">
                          <div
                            className="h-full bg-ms-red rounded-full"
                            style={{ width: `${(scen.afterLossPercent / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
