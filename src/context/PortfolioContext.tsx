"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { Portfolio, Holding } from "@/types/risk";
import { fetchPortfolio } from "@/lib/risk-api";
import { toast } from "sonner";

interface PortfolioContextType {
  portfolio: Portfolio | null;
  isLoading: boolean;
  handleAddHolding: (h: Holding) => void;
  handleEditHolding: (h: Holding) => void;
  handleRemoveHolding: (id: string) => void;
  handleResetHoldings: () => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  portfolio: null,
  isLoading: true,
  handleAddHolding: () => {},
  handleEditHolding: () => {},
  handleRemoveHolding: () => {},
  handleResetHoldings: () => {},
});

const STORAGE_KEY = "mochashield-portfolio";

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Portfolio = JSON.parse(stored);
        setPortfolio(parsed);
        setIsLoading(false);
      } catch {
        fetchPortfolio().then((data) => {
          setPortfolio(data);
          setIsLoading(false);
        });
      }
    } else {
      fetchPortfolio().then((data) => {
        setPortfolio(data);
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (portfolio) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    }
  }, [portfolio]);

  const handleAddHolding = useCallback((newHolding: Holding) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      const updated = [...prev.holdings, newHolding];
      const exposure = updated.reduce((acc, h) => acc + h.exposure, 0);
      return { ...prev, holdings: updated, openPositions: updated.length, grossExposure: exposure, grossLeverage: Number((exposure / prev.equity).toFixed(2)) };
    });
    toast.info(`Added ${newHolding.symbol} to portfolio`);
  }, []);

  const handleEditHolding = useCallback((updatedHolding: Holding) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      const updated = prev.holdings.map((h) => (h.id === updatedHolding.id ? updatedHolding : h));
      const exposure = updated.reduce((acc, h) => acc + h.exposure, 0);
      return { ...prev, holdings: updated, grossExposure: exposure, grossLeverage: Number((exposure / prev.equity).toFixed(2)) };
    });
    toast.info(`Updated ${updatedHolding.symbol}`);
  }, []);

  const handleRemoveHolding = useCallback((id: string) => {
    setPortfolio((prev) => {
      if (!prev) return prev;
      const updated = prev.holdings.filter((h) => h.id !== id);
      const exposure = updated.reduce((acc, h) => acc + h.exposure, 0);
      return { ...prev, holdings: updated, openPositions: updated.length, grossExposure: exposure, grossLeverage: Number((exposure / prev.equity).toFixed(2)) };
    });
  }, []);

  const handleResetHoldings = useCallback(() => {
    setIsLoading(true);
    sessionStorage.removeItem(STORAGE_KEY);
    initializedRef.current = false;
    fetchPortfolio().then((data) => {
      setPortfolio(data);
      setIsLoading(false);
    });
    toast.info("Reset portfolio to live data");
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolio, isLoading, handleAddHolding, handleEditHolding, handleRemoveHolding, handleResetHoldings }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
