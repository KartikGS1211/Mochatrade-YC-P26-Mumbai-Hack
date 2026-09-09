"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ScoreComponent } from "@/types/risk";

interface ScoreCompositionProps {
  components: ScoreComponent[];
  compositeBefore: number;
  compositeAfter: number;
  compositeDelta: number;
}

export function ScoreComposition({
  components,
  compositeBefore,
  compositeAfter,
  compositeDelta,
}: ScoreCompositionProps) {
  return (
    <Card className="bg-white border-ms-border shadow-card">
      <CardHeader className="pb-3 border-b border-ms-border/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
              Component Attribution
            </div>
            <CardTitle className="text-base font-bold text-ms-navy">
              What moved the index?
            </CardTitle>
          </div>
          <span className="text-xs font-semibold bg-ms-softblue text-ms-blue px-2.5 py-1 rounded-full">
            Each component weighted 25%
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-ms-border text-[11px] font-semibold text-ms-muted uppercase tracking-wider">
                <th className="py-2.5 px-3">Risk Component</th>
                <th className="py-2.5 px-3 text-right">Before</th>
                <th className="py-2.5 px-3 text-right">After</th>
                <th className="py-2.5 px-3 text-right">Delta</th>
                <th className="py-2.5 px-4 w-1/3">Impact Spectrum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ms-border/50 text-xs">
              {components.map((item) => (
                <tr key={item.component} className="hover:bg-ms-bg/60 transition-colors">
                  <td className="py-3 px-3">
                    <Tooltip>
                      <TooltipTrigger className="font-bold text-ms-navy cursor-help flex items-center gap-1.5 text-left">
                        <span>{item.component}</span>
                        <span className="text-[11px] text-ms-muted">ⓘ</span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-ms-navy text-white text-xs p-2.5">
                        <p className="font-semibold mb-1">{item.component} Factor</p>
                        <p className="text-white/80">{item.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="text-[11px] text-ms-muted mt-0.5">{item.description}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-ms-muted font-tabular">
                    {item.before}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-ms-red font-tabular">
                    {item.after}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-ms-red font-tabular">
                    +{item.delta}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <Progress
                        value={item.after}
                        className="h-2 bg-ms-bg [&>div]:bg-ms-red"
                        aria-label={`${item.component} risk score ${item.after} out of 100`}
                      />
                      <div className="flex justify-between text-[10px] text-ms-muted font-tabular">
                        <span>Base: {item.before}</span>
                        <span>Shift: +{item.delta}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Composite Total Row */}
              <tr className="bg-ms-softblue/30 font-bold border-t-2 border-ms-border">
                <td className="py-3.5 px-3 text-ms-navy uppercase tracking-wider text-xs">
                  Composite Score
                </td>
                <td className="py-3.5 px-3 text-right text-ms-navy font-tabular text-sm">
                  {compositeBefore}
                </td>
                <td className="py-3.5 px-3 text-right text-ms-red font-tabular text-sm">
                  {compositeAfter}
                </td>
                <td className="py-3.5 px-3 text-right text-ms-red font-tabular text-sm">
                  +{compositeDelta}
                </td>
                <td className="py-3.5 px-4">
                  <Progress
                    value={compositeAfter}
                    className="h-2.5 bg-ms-bg [&>div]:bg-ms-navy"
                    aria-label={`Composite risk score ${compositeAfter} out of 100`}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
