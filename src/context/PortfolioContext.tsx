"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { Portfolio, Holding, ProposedOrder, RiskAnalysisResult, AlternativeOption } from "@/types/risk";
import { fetchPortfolio, analyzePortfolioRisk } from "@/lib/risk-api";
import { DEFAULT_PROPOSED_ORDER, DEFAULT_RISK_ANALYSIS } from "@/lib/mock-risk-data";
import { toast } from "sonner";

interface PortfolioContextType {
  portfolio: Portfolio | null;
  isLoading: boolean;
  order: ProposedOrder;
  analysisResult: RiskAnalysisResult | null;
  isAnalyzing: boolean;
  handleAddHolding: (h: Holding) => void;
  handleEditHolding: (h: Holding) => void;
  handleRemoveHolding: (id: string) => void;
  handleResetHoldings: () => void;
  handleChangeOrder: (updated: Partial<ProposedOrder>) => void;
  handleRunAnalysis: (customOrder?: ProposedOrder) => Promise<RiskAnalysisResult | undefined>;
  handleApplyAlternative: (alt: AlternativeOption) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  portfolio: null,
  isLoading: true,
  order: DEFAULT_PROPOSED_ORDER,
  analysisResult: DEFAULT_RISK_ANALYSIS,
  isAnalyzing: false,
  handleAddHolding: () => {},
  handleEditHolding: () => {},
  handleRemoveHolding: () => {},
  handleResetHoldings: () => {},
  handleChangeOrder: () => {},
  handleRunAnalysis: async () => undefined,
  handleApplyAlternative: async () => {},
});

const STORAGE_KEY = "mochashield-portfolio";
const ORDER_STORAGE_KEY = "mochashield-order";
const ANALYSIS_STORAGE_KEY = "mochashield-analysis";

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<ProposedOrder>(DEFAULT_PROPOSED_ORDER);
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(DEFAULT_RISK_ANALYSIS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const initializationTimer = window.setTimeout(() => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      const storedOrder = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (storedOrder) {
        try {
          setOrder(JSON.parse(storedOrder));
        } catch {}
      }

      const storedAnalysis = sessionStorage.getItem(ANALYSIS_STORAGE_KEY);
      if (storedAnalysis) {
        try {
          setAnalysisResult(JSON.parse(storedAnalysis));
        } catch {}
      }

      // Show a stored portfolio immediately, then refresh it from yfinance.
      const storedPortfolio = sessionStorage.getItem(STORAGE_KEY);
      if (storedPortfolio) {
        try {
          const parsed: Portfolio = JSON.parse(storedPortfolio);
          setPortfolio(parsed);
          setIsLoading(false);
        } catch {}
      }

      fetchPortfolio().then((data) => {
        setPortfolio(data);
        setIsLoading(false);
      });
    }, 0);

    return () => window.clearTimeout(initializationTimer);
  }, []);

  useEffect(() => {
    if (portfolio) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    }
  }, [portfolio]);

  useEffect(() => {
    sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  }, [order]);

  useEffect(() => {
    if (analysisResult) {
      sessionStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

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

  const handleChangeOrder = useCallback((updated: Partial<ProposedOrder>) => {
    setOrder((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleRunAnalysis = useCallback(async (customOrder?: unknown) => {
    const isOrderObj =
      Boolean(customOrder &&
      typeof customOrder === "object" &&
      "symbol" in customOrder &&
      typeof (customOrder as ProposedOrder).symbol === "string");
    const targetOrder = isOrderObj ? (customOrder as ProposedOrder) : order;
    setIsAnalyzing(true);
    try {
      const result = await analyzePortfolioRisk(targetOrder);
      setAnalysisResult(result);
      return result;
    } catch {
      toast.error("Error evaluating portfolio risk");
    } finally {
      setIsAnalyzing(false);
    }
  }, [order]);

  const handleApplyAlternative = useCallback(async (alt: AlternativeOption) => {
    const updatedOrder: ProposedOrder = {
      ...order,
      margin: alt.margin,
      leverage: alt.leverage,
      exposure: alt.exposure,
    };
    setOrder(updatedOrder);
    setIsAnalyzing(true);
    try {
      const result = await analyzePortfolioRisk(updatedOrder);
      setAnalysisResult(result);
      toast.success(`Applied ${alt.title} (Score: ${alt.riskScore})`);
    } catch {
      toast.error("Error evaluating portfolio risk");
    } finally {
      setIsAnalyzing(false);
    }
  }, [order]);

  const handleResetHoldings = useCallback(() => {
    setIsLoading(true);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(ORDER_STORAGE_KEY);
    sessionStorage.removeItem(ANALYSIS_STORAGE_KEY);
    setOrder(DEFAULT_PROPOSED_ORDER);
    setAnalysisResult(DEFAULT_RISK_ANALYSIS);
    initializedRef.current = false;
    fetchPortfolio().then((data) => {
      setPortfolio(data);
      setIsLoading(false);
    });
    toast.info("Reset portfolio to live data");
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        isLoading,
        order,
        analysisResult,
        isAnalyzing,
        handleAddHolding,
        handleEditHolding,
        handleRemoveHolding,
        handleResetHoldings,
        handleChangeOrder,
        handleRunAnalysis,
        handleApplyAlternative,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
