"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ms-bg text-ms-text flex flex-col">
      {/* ── Marketing Header ── */}
      <header className="border-b border-ms-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ms-navy flex items-center justify-center text-white text-sm shadow-subtle">
              🛡️
            </div>
            <div>
              <span className="font-extrabold text-ms-navy text-lg tracking-tight">
                MochaShield
              </span>
              <span className="text-[10px] font-bold text-ms-blue tracking-wider uppercase ml-2 hidden sm:inline">
                Risk Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ms-muted">
            <a href="#how-it-works" className="hover:text-ms-navy transition-colors">
              How it works
            </a>
            <Link href="/methodology" className="hover:text-ms-navy transition-colors">
              Methodology
            </Link>
            <Link href="/portfolio" className="hover:text-ms-navy transition-colors">
              Portfolio
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/risk-check">
              <Button className="bg-ms-navy hover:bg-ms-navy/90 text-white font-semibold text-xs sm:text-sm h-9 sm:h-10 px-4 sm:px-5 cursor-pointer shadow-subtle">
                Open risk check →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ms-softblue border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-ms-blue animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-ms-blue">
                  Built for the moment before execution
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ms-navy tracking-tight leading-[1.1]">
                The AI risk firewall for{" "}
                <span className="text-ms-blue underline decoration-ms-blue/30 decoration-wavy underline-offset-8">
                  leveraged global trading.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-ms-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                See what a proposed trade could do to your entire portfolio before the order is placed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/risk-check" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-ms-blue hover:bg-blue-600 text-white font-bold h-12 px-8 text-base shadow-card cursor-pointer"
                  >
                    Try live risk check →
                  </Button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-ms-border text-ms-navy hover:bg-white font-semibold h-12 px-6 text-base cursor-pointer"
                  >
                    See how it works
                  </Button>
                </a>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-ms-muted">
                <div className="flex items-center gap-1.5">
                  <span className="text-ms-green font-bold">✓</span>
                  <span>Institutional Covariance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-ms-green font-bold">✓</span>
                  <span>Pre-Trade Frictionless</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-ms-green font-bold">✓</span>
                  <span>Deterministic Engine</span>
                </div>
              </div>
            </div>

            {/* Right Hero Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-ms-border shadow-elevated p-6 sm:p-7 space-y-5 relative">
                {/* Header tag */}
                <div className="flex items-center justify-between border-b border-ms-border pb-3">
                  <span className="text-xs font-bold text-ms-muted uppercase tracking-wider">
                    Simulation Outcome
                  </span>
                  <Badge className="bg-rose-50 text-ms-red border border-rose-200 text-xs font-bold px-2.5 py-0.5">
                    ● High Impact Order
                  </Badge>
                </div>

                {/* Score Jump Graphic */}
                <div className="bg-ms-navy rounded-xl p-5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-white/60 uppercase tracking-wider block">
                      Current Portfolio
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-extrabold text-ms-amber font-tabular">52</span>
                      <span className="text-[11px] text-white/50 font-medium">Moderate</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-extrabold text-white bg-ms-red px-2.5 py-0.5 rounded-full font-tabular shadow-subtle">
                      +27
                    </span>
                    <span className="text-[10px] text-white/50 mt-1">Risk Surge</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-white/60 uppercase tracking-wider block">
                      After Proposed Order
                    </span>
                    <div className="flex items-baseline gap-1 justify-end mt-0.5">
                      <span className="text-3xl font-extrabold text-ms-red font-tabular">79</span>
                      <span className="text-[11px] text-rose-300 font-bold">High</span>
                    </div>
                  </div>
                </div>

                {/* Proposed Order Attributes */}
                <div className="grid grid-cols-3 gap-2.5 text-center bg-ms-bg p-3 rounded-lg border border-ms-border">
                  <div>
                    <span className="text-[10px] text-ms-muted uppercase font-semibold block">Proposed</span>
                    <span className="text-xs font-bold text-ms-navy">NVDA · Long</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ms-muted uppercase font-semibold block">Exposure</span>
                    <span className="text-xs font-bold text-ms-navy font-tabular">₹60,000</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ms-muted uppercase font-semibold block">Leverage</span>
                    <span className="text-xs font-bold text-ms-navy font-tabular">3×</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                    <span>⚠</span> Shared risk detected
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    <span>✓</span> AI explanation ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works Section ── */}
        <section id="how-it-works" className="bg-white border-y border-ms-border py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ms-blue">
                Architecture & Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-ms-navy tracking-tight">
                How MochaShield protects capital
              </h2>
              <p className="text-sm sm:text-base text-ms-muted leading-relaxed">
                A simple 3-stage mathematical firewall designed to catch hidden vulnerabilities before you press submit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-ms-bg p-6 rounded-xl border border-ms-border space-y-3 shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-ms-navy text-white font-bold flex items-center justify-center text-sm shadow-subtle">
                  1
                </div>
                <h3 className="text-lg font-bold text-ms-navy">Propose a trade</h3>
                <p className="text-xs sm:text-sm text-ms-muted leading-relaxed">
                  Enter ticker, direction, margin, and leverage on the pre-trade ticket. Real-time notional exposure is calibrated immediately.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-ms-bg p-6 rounded-xl border border-ms-border space-y-3 shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-ms-blue text-white font-bold flex items-center justify-center text-sm shadow-subtle">
                  2
                </div>
                <h3 className="text-lg font-bold text-ms-navy">Check portfolio impact</h3>
                <p className="text-xs sm:text-sm text-ms-muted leading-relaxed">
                  The engine recalculates concentration, correlation co-movements, total gross leverage, and scenario stress drawdowns.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-ms-bg p-6 rounded-xl border border-ms-border space-y-3 shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-subtle">
                  3
                </div>
                <h3 className="text-lg font-bold text-ms-navy">Compare alternatives</h3>
                <p className="text-xs sm:text-sm text-ms-muted leading-relaxed">
                  Review lower-risk configurations (e.g., smaller position or reduced leverage) that fulfill your market thesis with less portfolio risk.
                </p>
              </div>
            </div>

            {/* Product Promise Quote */}
            <div className="mt-14 p-6 rounded-xl bg-ms-softblue/50 border border-blue-200 text-center max-w-3xl mx-auto">
              <p className="text-sm sm:text-base font-semibold text-ms-navy italic leading-relaxed">
                “A portfolio can look diversified while hidden risk remains concentrated. MochaShield calculates how a proposed order changes concentration, correlation, leverage, and stress risk before the user places it.”
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-ms-border py-8 text-center text-xs text-ms-muted">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-ms-navy">
            MochaShield · Pre-Trade Portfolio Risk Intelligence
          </p>
          <p className="text-[11px] text-ms-muted">
            Decision support only. Not investment advice or a market prediction. Does not execute trades or liquidate positions.
          </p>
        </div>
      </footer>
    </div>
  );
}
