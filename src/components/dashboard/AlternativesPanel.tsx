"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AlternativeOption } from "@/types/risk";

interface AlternativesPanelProps {
  alternatives: AlternativeOption[];
  onApplyAlternative: (alt: AlternativeOption) => void;
}

export function AlternativesPanel({
  alternatives,
  onApplyAlternative,
}: AlternativesPanelProps) {
  const formatINR = (val?: number | null) =>
    (typeof val === "number" && !isNaN(val) ? val : 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <Card className="bg-white border-ms-border shadow-card" id="alternatives-section">
      <CardHeader className="pb-3 border-b border-ms-border/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
              Trade Calibration
            </div>
            <CardTitle className="text-base font-bold text-ms-navy">
              See how changing the order changes risk
            </CardTitle>
          </div>
          <span className="text-xs text-ms-muted">Dynamic Scenarios</span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alternatives.map((alt) => {
            const isOriginal = alt.id === "original";
            return (
              <div
                key={alt.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isOriginal
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-white border-ms-border hover:border-ms-blue/40 shadow-subtle"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-ms-navy">{alt.title}</span>
                    <Badge
                      variant={isOriginal ? "destructive" : "secondary"}
                      className={`text-[10px] font-bold ${
                        isOriginal
                          ? "bg-ms-red text-white"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      Score: {alt.riskScore} (+{alt.delta})
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-ms-muted border-b border-ms-border/60 pb-3 mb-3">
                    <div className="flex justify-between">
                      <span>Margin:</span>
                      <span className="font-semibold text-ms-navy font-tabular">
                        {formatINR(alt.margin)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leverage:</span>
                      <span className="font-semibold text-ms-navy font-tabular">
                        {alt.leverage}×
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Exposure:</span>
                      <span className="font-bold text-ms-navy font-tabular">
                        {formatINR(alt.exposure)}
                      </span>
                    </div>
                  </div>
                </div>

                {alt.buttonLabel ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyAlternative(alt)}
                    className="w-full text-xs font-bold text-ms-blue border-ms-blue/30 hover:bg-ms-softblue cursor-pointer h-9 mt-1"
                  >
                    {alt.buttonLabel}
                  </Button>
                ) : (
                  <div className="text-center py-2 text-[11px] font-semibold text-rose-700 bg-rose-100/60 rounded">
                    Current active order simulation
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Educational note */}
        <p className="text-[11px] text-ms-muted italic text-center pt-2">
          “Lower estimated impact does not mean safe.”
        </p>
      </CardContent>
    </Card>
  );
}
