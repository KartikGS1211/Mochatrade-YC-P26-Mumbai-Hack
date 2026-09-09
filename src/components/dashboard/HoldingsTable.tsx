"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Holding } from "@/types/risk";
import { toast } from "sonner";

interface HoldingsTableProps {
  holdings: Holding[];
  onAddHolding: (holding: Holding) => void;
  onEditHolding: (holding: Holding) => void;
  onRemoveHolding: (id: string) => void;
  onResetHoldings: () => void;
}

export function HoldingsTable({
  holdings,
  onAddHolding,
  onEditHolding,
  onRemoveHolding,
  onResetHoldings,
}: HoldingsTableProps) {
  // Add position dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("TSLA");
  const [newName, setNewName] = useState("Tesla Inc.");
  const [newMargin, setNewMargin] = useState("10000");
  const [newLeverage, setNewLeverage] = useState("2");

  // Edit position dialog state
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [editMargin, setEditMargin] = useState("");
  const [editLeverage, setEditLeverage] = useState("");

  const formatINR = (val: number) =>
    val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  const handleAdd = () => {
    const margin = Number(newMargin) || 10_000;
    const leverage = Number(newLeverage) || 1;
    const newPosition: Holding = {
      id: `pos-${Date.now()}`,
      symbol: newSymbol,
      name: newName,
      side: "Long",
      margin,
      leverage,
      exposure: margin * leverage,
      dayChange: "+0.5%",
      riskTags: ["High volatility", "Tech beta"],
    };
    onAddHolding(newPosition);
    setIsAddOpen(false);
    toast.success(`Added ${newSymbol} to portfolio`);
  };

  const handleOpenEdit = (holding: Holding) => {
    setEditingHolding(holding);
    setEditMargin(String(holding.margin));
    setEditLeverage(String(holding.leverage));
  };

  const handleSaveEdit = () => {
    if (!editingHolding) return;
    const margin = Number(editMargin) || editingHolding.margin;
    const leverage = Number(editLeverage) || editingHolding.leverage;
    onEditHolding({
      ...editingHolding,
      margin,
      leverage,
      exposure: margin * leverage,
    });
    setEditingHolding(null);
    toast.success(`Updated ${editingHolding.symbol} position`);
  };

  return (
    <Card className="bg-white border-ms-border shadow-card">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <div className="text-[11px] font-bold text-ms-blue uppercase tracking-wider mb-1">
            Portfolio Components
          </div>
          <CardTitle className="text-base font-bold text-ms-navy">
            Current Holdings
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Dialog */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-md border border-ms-blue/30 text-xs h-8 px-3 text-ms-blue hover:bg-ms-softblue font-semibold cursor-pointer">
              + Add position
            </DialogTrigger>
            <DialogContent className="bg-white max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-ms-navy font-bold">Add Portfolio Position</DialogTitle>
              </DialogHeader>
              <div className="space-y-3.5 py-2">
                <div className="space-y-1">
                  <Label htmlFor="add-symbol" className="text-xs font-semibold text-ms-navy">
                    Asset Symbol
                  </Label>
                  <Select
                    value={newSymbol}
                    onValueChange={(val) => {
                      if (!val) return;
                      setNewSymbol(val);
                      if (val === "TSLA") setNewName("Tesla Inc.");
                      if (val === "META") setNewName("Meta Platforms");
                      if (val === "MSFT") setNewName("Microsoft Corp.");
                      if (val === "BTC") setNewName("Bitcoin Perp");
                    }}
                  >
                    <SelectTrigger id="add-symbol" className="bg-white border-ms-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="TSLA">TSLA · Tesla Inc.</SelectItem>
                      <SelectItem value="META">META · Meta Platforms</SelectItem>
                      <SelectItem value="MSFT">MSFT · Microsoft Corp.</SelectItem>
                      <SelectItem value="BTC">BTC · Bitcoin Perp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="add-margin" className="text-xs font-semibold text-ms-navy">
                      Margin (₹)
                    </Label>
                    <Input
                      id="add-margin"
                      type="number"
                      value={newMargin}
                      onChange={(e) => setNewMargin(e.target.value)}
                      className="bg-white border-ms-border text-xs font-tabular"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="add-leverage" className="text-xs font-semibold text-ms-navy">
                      Leverage
                    </Label>
                    <Select value={newLeverage} onValueChange={(v) => v && setNewLeverage(v)}>
                      <SelectTrigger id="add-leverage" className="bg-white border-ms-border text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="1">1×</SelectItem>
                        <SelectItem value="2">2×</SelectItem>
                        <SelectItem value="3">3×</SelectItem>
                        <SelectItem value="5">5×</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAdd}
                  className="w-full bg-ms-navy text-white hover:bg-ms-navy/90 text-xs font-semibold cursor-pointer"
                >
                  Confirm Position
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetHoldings}
            className="text-xs h-8 text-ms-muted hover:text-ms-navy hover:bg-ms-bg cursor-pointer"
          >
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Responsive horizontal scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-ms-border text-[11px] font-semibold text-ms-muted uppercase tracking-wider">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3 text-center">Side</th>
                <th className="py-2.5 px-3 text-right">Margin</th>
                <th className="py-2.5 px-3 text-center">Lev.</th>
                <th className="py-2.5 px-3 text-right">Exposure</th>
                <th className="py-2.5 px-3 text-right">Day Change</th>
                <th className="py-2.5 px-3">Risk Tags</th>
                <th className="py-2.5 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ms-border/60 text-xs">
              {holdings.map((h) => (
                <tr key={h.id} className="hover:bg-ms-bg/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-ms-navy">{h.symbol}</div>
                    <div className="text-[11px] text-ms-muted">{h.name}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border-0 text-[10px] font-semibold px-1.5 py-0.5"
                    >
                      {h.side}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-ms-navy font-tabular">
                    {formatINR(h.margin)}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-ms-muted font-tabular">
                    {h.leverage}×
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-ms-navy font-tabular">
                    {formatINR(h.exposure)}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-semibold font-tabular ${
                      h.dayChange.startsWith("+") ? "text-ms-green" : "text-ms-red"
                    }`}
                  >
                    {h.dayChange}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {h.riskTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-ms-bg text-ms-muted border border-ms-border text-[10px] px-1.5 py-0.5 rounded font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(h)}
                        className="h-7 w-7 p-0 text-ms-muted hover:text-ms-blue hover:bg-ms-softblue cursor-pointer"
                        title="Edit position"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onRemoveHolding(h.id);
                          toast.info(`Removed ${h.symbol}`);
                        }}
                        className="h-7 w-7 p-0 text-ms-muted hover:text-ms-red hover:bg-rose-50 cursor-pointer"
                        title="Remove position"
                      >
                        ✕
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Supporting educational callout below table */}
        <div className="mt-4 pt-3 border-t border-ms-border/60 flex items-center justify-between text-xs text-ms-muted">
          <p className="italic">
            “Three different tickers can still share the same underlying risk.”
          </p>
          <span className="text-[11px] font-semibold text-ms-blue">
            Correlated high-beta profile
          </span>
        </div>
      </CardContent>

      {/* Edit Holding Dialog */}
      {editingHolding && (
        <Dialog open={!!editingHolding} onOpenChange={(open) => !open && setEditingHolding(null)}>
          <DialogContent className="bg-white max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-ms-navy font-bold">
                Edit {editingHolding.symbol} Position
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3.5 py-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-ms-navy">Margin (₹)</Label>
                <Input
                  type="number"
                  value={editMargin}
                  onChange={(e) => setEditMargin(e.target.value)}
                  className="bg-white border-ms-border text-xs font-tabular"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-ms-navy">Leverage</Label>
                <Select value={editLeverage} onValueChange={(v) => v && setEditLeverage(v)}>
                  <SelectTrigger className="bg-white border-ms-border text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1">1×</SelectItem>
                    <SelectItem value="2">2×</SelectItem>
                    <SelectItem value="3">3×</SelectItem>
                    <SelectItem value="5">5×</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSaveEdit}
                className="w-full bg-ms-navy text-white hover:bg-ms-navy/90 text-xs font-semibold cursor-pointer"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
