"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AppHeaderProps {
  title?: string;
}

const NAV_ITEMS = [
  { name: "Pre-trade Check", href: "/risk-check", icon: "⚡" },
  { name: "Portfolio", href: "/portfolio", icon: "💼" },
  { name: "Stress Scenarios", href: "/scenarios", icon: "📊" },
  { name: "Methodology", href: "/methodology", icon: "📐" },
];

function formatMarketDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function AppHeader({ title = "Pre-trade Risk Check" }: AppHeaderProps) {
  const pathname = usePathname();
  const { portfolio, isLoading } = usePortfolio();
  const latestTradingDay = formatMarketDate(portfolio?.dataTimestamp);
  const isYfinanceData = portfolio?.dataSource === "yfinance";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ms-border px-4 sm:px-8 py-3.5 flex items-center shadow-subtle">
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
              Market data · yfinance
            </Badge>
            {(isLoading || (isYfinanceData && latestTradingDay)) && (
              <span className="hidden md:inline text-xs text-ms-muted">
                {isLoading
                  ? "Loading latest trading day…"
                  : `Latest trading day · ${latestTradingDay}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
