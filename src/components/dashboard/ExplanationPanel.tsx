"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { GroundedExplanation } from "@/types/risk";

interface ExplanationPanelProps {
  explanation: GroundedExplanation;
  source?: "grok" | "rule-based";
  model?: string;
  isLoading?: boolean;
}

export function ExplanationPanel({
  explanation,
  source = "rule-based",
  model,
  isLoading = false,
}: ExplanationPanelProps) {
  const {
    headline,
    narrative,
    summaryDriver,
    whatChanged,
    worstScenario,
    possibleOptions,
    disclaimer,
  } = explanation;
  const isGrok = source === "grok";

  return (
    <Card className="bg-white border-ms-border shadow-card">
      <CardHeader className="pb-3 border-b border-ms-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
              Grounded Output · {isLoading ? "Updating" : isGrok ? "Grok AI" : "Rule-based fallback"}
            </div>
            <CardTitle className="text-base font-bold text-ms-navy">
              {headline}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold self-start sm:self-auto"
          >
            {isLoading
              ? "Grok is analyzing the updated order…"
              : isGrok
                ? `✓ ${model ?? "Grok"} · verified inputs`
                : "✓ Calculated inputs only"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4" role="status" aria-live="polite">
            <span className="sr-only">Generating an updated Grok explanation</span>
            <div className="bg-ms-bg p-4 rounded-xl border border-ms-border space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <>
        {/* Narrative Box */}
        <div className="bg-ms-bg p-4 rounded-xl border border-ms-border text-sm text-ms-navy leading-relaxed">
          {narrative}
        </div>

        {/* Structured Summary Items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-2.5 bg-white border border-ms-border rounded-lg shadow-subtle">
            <span className="text-[10px] uppercase font-bold text-ms-muted block mb-0.5">
              Summary
            </span>
            <span className="text-xs font-bold text-ms-navy">{summaryDriver}</span>
          </div>

          <div className="p-2.5 bg-white border border-ms-border rounded-lg shadow-subtle">
            <span className="text-[10px] uppercase font-bold text-ms-muted block mb-0.5">
              What Changed
            </span>
            <span className="text-xs font-bold text-ms-blue">{whatChanged}</span>
          </div>

          <div className="p-2.5 bg-white border border-ms-border rounded-lg shadow-subtle">
            <span className="text-[10px] uppercase font-bold text-ms-muted block mb-0.5">
              Worst Scenario
            </span>
            <span className="text-xs font-bold text-ms-red">{worstScenario}</span>
          </div>

          <div className="p-2.5 bg-white border border-ms-border rounded-lg shadow-subtle">
            <span className="text-[10px] uppercase font-bold text-ms-muted block mb-0.5">
              Possible Options
            </span>
            <span className="text-xs font-bold text-emerald-700">{possibleOptions}</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-ms-muted italic border-t border-ms-border/60 pt-3">
          “{disclaimer}”
        </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
