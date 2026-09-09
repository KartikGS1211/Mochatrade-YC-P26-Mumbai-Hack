"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CorrelationMatrixData } from "@/types/risk";

interface CorrelationHeatmapProps {
  data: CorrelationMatrixData;
}

export function CorrelationHeatmap({ data }: CorrelationHeatmapProps) {
  const { assets, matrix, insight } = data;

  // Compute background shade based on correlation value
  const getCellBg = (val: number) => {
    if (val === 1.0) return "bg-ms-navy text-white font-bold";
    if (val >= 0.8) return "bg-rose-100 text-rose-900 font-bold border border-rose-200";
    if (val >= 0.65) return "bg-amber-100 text-amber-900 font-semibold border border-amber-200";
    if (val >= 0.5) return "bg-blue-50 text-blue-900 border border-blue-100";
    return "bg-slate-50 text-slate-700 border border-slate-100";
  };

  return (
    <Card className="bg-white border-ms-border shadow-card">
      <CardHeader className="pb-3 border-b border-ms-border/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
              Cross-Asset Co-movement
            </div>
            <CardTitle className="text-base font-bold text-ms-navy">
              Correlation Heatmap
            </CardTitle>
          </div>
          <span className="text-xs text-ms-muted">90-Day Rolling Pairwise</span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Responsive Heatmap Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[360px]">
            <thead>
              <tr>
                <th className="p-2 text-xs font-semibold text-ms-muted text-left">Asset</th>
                {assets.map((asset) => (
                  <th key={asset} className="p-2 text-xs font-bold text-ms-navy">
                    {asset}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((rowAsset, i) => (
                <tr key={rowAsset}>
                  <td className="p-2 text-xs font-bold text-ms-navy text-left">{rowAsset}</td>
                  {matrix[i].map((val, j) => {
                    const isHighPair = (rowAsset === "NVDA" && assets[j] === "AMD") || (rowAsset === "AMD" && assets[j] === "NVDA");
                    return (
                      <td key={`${rowAsset}-${assets[j]}`} className="p-1">
                        <div
                          className={`py-2 px-1 rounded-md text-xs font-tabular transition-transform hover:scale-105 ${getCellBg(
                            val
                          )} ${isHighPair ? "ring-2 ring-rose-500 ring-offset-1" : ""}`}
                          title={`${rowAsset} ↔ ${assets[j]}: ${val.toFixed(2)} correlation`}
                        >
                          {val.toFixed(2)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-ms-border/60 text-[11px] text-ms-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300 inline-block" />
            <span>High correlation (&gt;0.80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" />
            <span>Moderate (0.65–0.79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-50 border border-blue-200 inline-block" />
            <span>Lower (&lt;0.65)</span>
          </div>
        </div>

        {/* Insight callout */}
        <div className="bg-ms-bg p-3.5 rounded-lg border border-ms-border text-xs text-ms-navy leading-relaxed flex items-start gap-2.5">
          <span className="text-base shrink-0">💡</span>
          <p>{insight}</p>
        </div>
      </CardContent>
    </Card>
  );
}
