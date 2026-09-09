"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AppHeaderProps {
  title?: string;
  onResetDemo?: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

const NAV_ITEMS = [
  { name: "Pre-trade Check", href: "/risk-check", icon: "⚡" },
  { name: "Portfolio", href: "/portfolio", icon: "💼" },
  { name: "Stress Scenarios", href: "/scenarios", icon: "📊" },
  { name: "Methodology", href: "/methodology", icon: "📐" },
];

export function AppHeader({
  title = "Pre-trade Risk Check",
  onResetDemo,
  isPresentationMode = false,
  onTogglePresentationMode,
}: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ms-border px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-subtle">
      {/* Left title & context */}
      <div className="flex items-center gap-3">
        {/* Mobile menu sheet */}
        <Sheet>
          <SheetTrigger
            className="lg:hidden p-2 h-9 w-9 text-ms-navy border border-ms-border rounded-md hover:bg-ms-bg flex items-center justify-center cursor-pointer text-base"
            aria-label="Open navigation menu"
          >
            ☰
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-white">
            <SheetHeader className="p-6 border-b border-ms-border">
              <SheetTitle className="flex items-center gap-2 text-ms-navy font-bold text-left">
                🛡️ MochaShield
              </SheetTitle>
              <p className="text-xs text-ms-blue font-semibold uppercase tracking-wider text-left">
                Risk Intelligence
              </p>
            </SheetHeader>
            <nav className="p-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                    pathname === item.href
                      ? "bg-ms-softblue text-ms-blue font-semibold"
                      : "text-ms-text hover:bg-ms-bg"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-ms-navy tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge
              variant="secondary"
              className="bg-ms-softblue text-ms-blue text-[11px] font-semibold hover:bg-ms-softblue border-0 py-0.5"
            >
              Demo data · 90-day historical window
            </Badge>
            <span className="hidden md:inline text-xs text-ms-muted">
              Last refreshed · 08 Sep 2026, 19:42 IST
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onTogglePresentationMode && (
          <Button
            variant={isPresentationMode ? "default" : "outline"}
            size="sm"
            onClick={onTogglePresentationMode}
            className={`text-xs h-9 font-medium cursor-pointer border-ms-border ${
              isPresentationMode
                ? "bg-ms-navy text-white hover:bg-ms-navy/90"
                : "text-ms-navy hover:bg-ms-bg"
            }`}
          >
            <span>{isPresentationMode ? "Exit presentation" : "Presentation mode"}</span>
          </Button>
        )}

        {onResetDemo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetDemo}
            className="text-xs h-9 font-medium text-ms-muted hover:text-ms-navy hover:bg-ms-bg border-ms-border cursor-pointer"
          >
            Reset demo
          </Button>
        )}
      </div>
    </header>
  );
}
