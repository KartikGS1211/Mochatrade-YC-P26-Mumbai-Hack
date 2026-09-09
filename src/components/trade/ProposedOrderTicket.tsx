"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AVAILABLE_SYMBOLS } from "@/lib/mock-risk-data";
import type { ProposedOrder, TradeSide } from "@/types/risk";

interface ProposedOrderTicketProps {
  order: ProposedOrder;
  onChangeOrder: (updated: Partial<ProposedOrder>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ProposedOrderTicket({
  order,
  onChangeOrder,
  onSubmit,
  isLoading,
}: ProposedOrderTicketProps) {
  const currentAsset =
    AVAILABLE_SYMBOLS.find((s) => s.symbol === order.symbol) ||
    AVAILABLE_SYMBOLS[0];

  const calculatedExposure = order.margin * order.leverage;

  const formatINR = (val: number) =>
    val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <Card className="bg-white border-ms-border shadow-card hover:shadow-elevated transition-shadow">
      <CardHeader className="pb-3 border-b border-ms-border/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
              Order Simulation
            </div>
            <CardTitle className="text-base font-bold text-ms-navy">
              Pre-trade Order Ticket
            </CardTitle>
          </div>
          <span className="text-[11px] bg-ms-softblue text-ms-blue font-semibold px-2 py-0.5 rounded">
            Pre-flight Check
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Symbol Select */}
        <div className="space-y-1.5">
          <Label htmlFor="order-symbol" className="text-xs font-semibold text-ms-navy">
            Asset Symbol
          </Label>
          <Select
            value={order.symbol}
            onValueChange={(val) => val && onChangeOrder({ symbol: val })}
          >
            <SelectTrigger
              id="order-symbol"
              className="bg-ms-bg border-ms-border text-xs font-medium text-ms-navy h-9"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {AVAILABLE_SYMBOLS.map((asset) => (
                <SelectItem key={asset.symbol} value={asset.symbol} className="text-xs">
                  <span className="font-bold text-ms-navy">{asset.symbol}</span> · {asset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sector context banner */}
          <div className="bg-ms-softblue/60 text-ms-blue text-[11px] font-medium px-2.5 py-1.5 rounded-md flex items-center gap-1.5">
            <span>ℹ️</span>
            <span>{currentAsset.sector}</span>
          </div>
        </div>

        {/* Direction Segmented Control */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-ms-navy">Direction</Label>
          <div className="grid grid-cols-2 gap-2 bg-ms-bg p-1 rounded-lg border border-ms-border">
            {(["Long", "Short"] as TradeSide[]).map((side) => {
              const isSelected = order.side === side;
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => onChangeOrder({ side })}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    isSelected
                      ? side === "Long"
                        ? "bg-emerald-600 text-white shadow-subtle"
                        : "bg-rose-600 text-white shadow-subtle"
                      : "text-ms-muted hover:text-ms-navy"
                  }`}
                >
                  {side === "Long" ? "▲ Long (Buy)" : "▼ Short (Sell)"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Margin Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="order-margin" className="text-xs font-semibold text-ms-navy">
              Margin Allocated
            </Label>
            <span className="text-[11px] text-ms-muted font-tabular">
              Available: ₹25,000
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-bold text-ms-muted">₹</span>
            <Input
              id="order-margin"
              type="number"
              min={1000}
              step={1000}
              value={order.margin}
              onChange={(e) =>
                onChangeOrder({
                  margin: Number(e.target.value) || 0,
                  exposure: (Number(e.target.value) || 0) * order.leverage,
                })
              }
              className="bg-ms-bg border-ms-border pl-7 text-xs font-bold text-ms-navy font-tabular h-9"
            />
          </div>
        </div>

        {/* Leverage Segmented Control */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-ms-navy">Leverage Multiplier</Label>
            <span className="text-[11px] text-ms-blue font-semibold font-tabular">
              {order.leverage}× Notional
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 bg-ms-bg p-1 rounded-lg border border-ms-border">
            {[1, 2, 3, 5].map((lev) => {
              const isSelected = order.leverage === lev;
              return (
                <button
                  key={lev}
                  type="button"
                  onClick={() =>
                    onChangeOrder({
                      leverage: lev,
                      exposure: order.margin * lev,
                    })
                  }
                  className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer font-tabular ${
                    isSelected
                      ? "bg-ms-navy text-white shadow-subtle"
                      : "text-ms-muted hover:text-ms-navy hover:bg-white/60"
                  }`}
                >
                  {lev}×
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculated Market Exposure */}
        <div className="p-3 rounded-lg bg-ms-bg border border-ms-border space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ms-muted font-medium">Calculated Market Exposure</span>
            <span className="font-extrabold text-ms-navy font-tabular text-sm">
              {formatINR(calculatedExposure)}
            </span>
          </div>
          <p className="text-[11px] text-ms-muted font-tabular">
            {formatINR(order.margin)} margin × {order.leverage}× leverage = {formatINR(calculatedExposure)}
          </p>
        </div>

        {/* Optional Trade Note */}
        <div className="space-y-1">
          <Label htmlFor="order-note" className="text-xs font-semibold text-ms-navy">
            Execution Note (Optional)
          </Label>
          <Input
            id="order-note"
            type="text"
            placeholder="Review risk before placement..."
            value={order.note || ""}
            onChange={(e) => onChangeOrder({ note: e.target.value })}
            className="bg-ms-bg border-ms-border text-xs text-ms-navy h-8"
          />
        </div>

        {/* Main Action Button */}
        <Button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="w-full bg-ms-blue hover:bg-blue-600 text-white font-bold h-11 text-xs sm:text-sm cursor-pointer shadow-subtle"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Checking portfolio risk…
            </span>
          ) : (
            "Check portfolio risk"
          )}
        </Button>

        {/* Loading skeleton state */}
        {isLoading && (
          <div className="pt-2 space-y-2.5" aria-live="polite">
            <div className="flex items-center gap-2 text-xs font-medium text-ms-blue">
              <span className="inline-block w-2 h-2 rounded-full bg-ms-blue animate-ping" />
              Evaluating covariance matrix & stress drawdown...
            </div>
            <Skeleton className="h-4 w-full bg-ms-bg" />
            <Skeleton className="h-4 w-4/5 bg-ms-bg" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
