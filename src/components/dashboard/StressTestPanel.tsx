"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { StressScenarioData } from "@/types/risk";

interface StressTestPanelProps {
  scenarios: StressScenarioData[];
}

export function StressTestPanel({ scenarios }: StressTestPanelProps) {
  const formatINR = (val: number) =>
    val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <Card className="bg-white border-ms-border shadow-card">
      <CardHeader className="pb-3 border-b border-ms-border/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
              Downside Vulnerability
            </div>
            <CardTitle className="text-base font-bold text-ms-navy">
              What could go wrong?
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold text-ms-muted border-ms-border">
            Hypothetical Stress Scenarios
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs defaultValue="tech-selloff" className="w-full">
          <TabsList className="grid grid-cols-3 bg-ms-bg p-1 rounded-lg border border-ms-border mb-4">
            <TabsTrigger
              value="tech-selloff"
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-ms-navy data-[state=active]:shadow-subtle cursor-pointer py-1.5"
            >
              Tech Sell-Off
            </TabsTrigger>
            <TabsTrigger
              value="market-riskoff"
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-ms-navy data-[state=active]:shadow-subtle cursor-pointer py-1.5"
            >
              Broad Risk-Off
            </TabsTrigger>
            <TabsTrigger
              value="liquidity-shock"
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-ms-navy data-[state=active]:shadow-subtle cursor-pointer py-1.5"
            >
              Liquidity Shock
            </TabsTrigger>
          </TabsList>

          {scenarios.map((scen) => (
            <TabsContent key={scen.id} value={scen.id} className="space-y-4 outline-none">
              {/* Scenario description */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-ms-bg p-3.5 rounded-lg border border-ms-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ms-navy">{scen.name}</span>
                    <span className="text-[10px] bg-ms-softblue text-ms-blue font-semibold px-2 py-0.5 rounded">
                      {scen.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-ms-muted mt-0.5">{scen.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-ms-muted block">Most Affected</span>
                  <span className="text-xs font-bold text-ms-red">{scen.mostAffected}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white border border-ms-border rounded-lg shadow-subtle text-center sm:text-left">
                  <span className="text-[11px] text-ms-muted block mb-0.5">Before-Trade Loss</span>
                  <div className="text-base font-bold text-ms-navy font-tabular">
                    -{formatINR(scen.beforeLossAmount)}
                  </div>
                  <span className="text-xs text-ms-amber font-semibold font-tabular">
                    {scen.beforeLossPercent}% of equity
                  </span>
                </div>

                <div className="p-3 bg-white border border-ms-border rounded-lg shadow-subtle text-center sm:text-left">
                  <span className="text-[11px] text-ms-muted block mb-0.5">After-Trade Loss</span>
                  <div className="text-base font-bold text-ms-red font-tabular">
                    -{formatINR(scen.afterLossAmount)}
                  </div>
                  <span className="text-xs text-ms-red font-semibold font-tabular">
                    {scen.afterLossPercent}% of equity
                  </span>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-center sm:text-left">
                  <span className="text-[11px] text-rose-700 font-semibold block mb-0.5">
                    Change in Loss Severity
                  </span>
                  <div className="text-base font-extrabold text-ms-red font-tabular">
                    +{formatINR(scen.changeAmount)}
                  </div>
                  <span className="text-xs text-rose-800 font-medium">
                    Nearly double drawdown
                  </span>
                </div>
              </div>

              {/* Loss Visualization Bars */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs text-ms-muted">
                  <span>Drawdown Exposure Comparison</span>
                  <span className="font-tabular font-medium">Max Simulated: 20% Equity</span>
                </div>

                <div className="space-y-2">
                  {/* Before */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-ms-navy font-semibold">Current Portfolio Loss</span>
                      <span className="text-ms-navy font-bold font-tabular">
                        {scen.beforeLossPercent}% (-{formatINR(scen.beforeLossAmount)})
                      </span>
                    </div>
                    <div className="h-3 bg-ms-bg rounded-full overflow-hidden border border-ms-border">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${(scen.beforeLossPercent / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-ms-red font-bold">Post-Order Portfolio Loss</span>
                      <span className="text-ms-red font-extrabold font-tabular">
                        {scen.afterLossPercent}% (-{formatINR(scen.afterLossAmount)})
                      </span>
                    </div>
                    <div className="h-3 bg-ms-bg rounded-full overflow-hidden border border-ms-border">
                      <div
                        className="h-full bg-ms-red rounded-full transition-all duration-500"
                        style={{ width: `${(scen.afterLossPercent / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-ms-muted italic text-center pt-2">
                “{scen.disclaimer}”
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
