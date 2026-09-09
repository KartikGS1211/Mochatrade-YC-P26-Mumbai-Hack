"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PresentationModeBannerProps {
  onExit: () => void;
  onTriggerPreset: (preset: "default" | "smaller" | "lower") => void;
}

export function PresentationModeBanner({
  onExit,
  onTriggerPreset,
}: PresentationModeBannerProps) {
  return (
    <div className="bg-ms-navy text-white px-4 py-2.5 border-b border-ms-blue/30 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
      <div className="flex items-center gap-2">
        <Badge className="bg-ms-blue text-white font-bold text-[10px] uppercase tracking-wide">
          Pitch Presentation Mode
        </Badge>
        <span className="text-white/80 hidden sm:inline">
          Demo Story: 3× NVDA trade raises correlated tech risk from 52 to 79 (+27 pts)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-white/60 text-[11px] hidden md:inline">Quick Presets:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTriggerPreset("default")}
          className="h-7 text-[11px] bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
        >
          1. 3× NVDA (+27)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTriggerPreset("smaller")}
          className="h-7 text-[11px] bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
        >
          2. Half Size (+13)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTriggerPreset("lower")}
          className="h-7 text-[11px] bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer"
        >
          3. 1× Leverage (+9)
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="h-7 text-[11px] text-white/70 hover:text-white cursor-pointer ml-1"
        >
          ✕ Exit
        </Button>
      </div>
    </div>
  );
}
