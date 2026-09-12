// ---------------------------------------------------------------------------
// MochaShield – Production Risk Analysis API Layer
//
// Calls the FastAPI backend at http://localhost:8000.
// Falls back to deterministic mock data if the backend is unreachable.
// ---------------------------------------------------------------------------

import type { ProposedOrder, RiskAnalysisResult } from "@/types/risk";
import { DEFAULT_RISK_ANALYSIS } from "@/lib/mock-risk-data";

const API_URL = process.env.NEXT_PUBLIC_RISK_API_URL || "http://localhost:8000/api/v1/risk/analyze";
const FALLBACK_LATENCY_MS = 800;

/**
 * Maps a backend RiskAnalysisResult to the frontend RiskAnalysisResult type.
 * The backend response includes extra fields (currentRisk, postTradeRisk,
 * riskDelta, portfolioLeverage, correlationMatrix) that the frontend type
 * does not need.
 */
function mapBackendToFrontend(raw: any): RiskAnalysisResult {
  return {
    currentScore: raw.currentScore ?? raw.currentRisk ?? 52,
    proposedScore: raw.proposedScore ?? raw.postTradeRisk ?? 79,
    delta: raw.delta ?? raw.riskDelta ?? 27,
    orderLeverage: raw.orderLeverage ?? 3,
    portfolioLeverageBefore: raw.portfolioLeverageBefore ?? raw.portfolioLeverage?.before ?? 0.75,
    portfolioLeverageAfter: raw.portfolioLeverageAfter ?? raw.portfolioLeverage?.after ?? 1.35,
    alertHeadline: raw.alertHeadline ?? "",
    alertStatement: raw.alertStatement ?? "",
    primaryDriver: raw.primaryDriver ?? "Concentration + correlation",
    alertWarning: raw.alertWarning ?? "",
    components: raw.components ?? DEFAULT_RISK_ANALYSIS.components,
    correlation: {
      ...(raw.correlation ?? DEFAULT_RISK_ANALYSIS.correlation),
      assets: [...new Set((raw.correlation ?? DEFAULT_RISK_ANALYSIS.correlation).assets)],
    },
    scenarios: raw.scenarios ?? DEFAULT_RISK_ANALYSIS.scenarios,
    alternatives: raw.alternatives ?? DEFAULT_RISK_ANALYSIS.alternatives,
    explanation: raw.explanation ?? DEFAULT_RISK_ANALYSIS.explanation,
  };
}

/**
 * Generates a deterministic fallback result when the backend is unreachable.
 */
function getFallbackResult(order: ProposedOrder): RiskAnalysisResult {
  const exposure = order.margin * order.leverage;
  const portfolioEquity = 100_000;
  const initialGrossExposure = 75_000;
  const newGrossExposure = initialGrossExposure + exposure;
  const newGrossLeverage = Number((newGrossExposure / portfolioEquity).toFixed(2));

  let calculatedScore = 52;
  let calculatedDelta = 0;

  if (order.symbol === "NVDA") {
    if (order.margin <= 10_000 && order.leverage === 3) {
      calculatedScore = 65;
      calculatedDelta = 13;
    } else if (order.leverage === 1) {
      calculatedScore = 61;
      calculatedDelta = 9;
    } else {
      calculatedScore = 79;
      calculatedDelta = 27;
    }
  } else {
    const factor = Math.min(1.8, Math.max(0.6, (exposure / 60_000) * (order.leverage / 3)));
    calculatedDelta = Math.round(27 * factor);
    calculatedScore = Math.min(95, Math.max(52, 52 + calculatedDelta));
  }

  return {
    ...DEFAULT_RISK_ANALYSIS,
    currentScore: 52,
    proposedScore: calculatedScore,
    delta: calculatedDelta,
    orderLeverage: order.leverage,
    portfolioLeverageBefore: 0.75,
    portfolioLeverageAfter: newGrossLeverage,
    alternatives: [
      {
        id: "original",
        title: `Current order (${order.symbol})`,
        margin: order.margin,
        leverage: order.leverage,
        exposure: exposure,
        riskScore: calculatedScore,
        delta: calculatedDelta,
      },
      {
        id: "smaller-position",
        title: "Smaller position",
        margin: Math.round(order.margin / 2),
        leverage: order.leverage,
        exposure: Math.round(exposure / 2),
        riskScore: Math.round(52 + calculatedDelta * 0.48),
        delta: Math.round(calculatedDelta * 0.48),
        buttonLabel: "Apply smaller position",
      },
      {
        id: "lower-leverage",
        title: "Lower leverage",
        margin: order.margin,
        leverage: 1,
        exposure: order.margin,
        riskScore: Math.round(52 + calculatedDelta * 0.33),
        delta: Math.round(calculatedDelta * 0.33),
        buttonLabel: "Apply lower leverage",
      },
    ],
  };
}

/**
 * Evaluates the impact of a proposed trade ticket on the existing portfolio.
 *
 * Attempts the FastAPI backend first; falls back to deterministic mock data
 * if the backend is unreachable.
 */
export async function analyzePortfolioRisk(
  order: ProposedOrder
): Promise<RiskAnalysisResult> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        equity: 100_000,
        positions: [
          { symbol: "AAPL", side: "long", margin: 15_000, leverage: 2 },
          { symbol: "AMD", side: "long", margin: 12_500, leverage: 2 },
          { symbol: "COIN", side: "long", margin: 10_000, leverage: 2 },
        ],
        proposedOrder: {
          symbol: order.symbol,
          side: order.side.toLowerCase(),
          margin: order.margin,
          leverage: order.leverage,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Risk evaluation failed: ${response.statusText}`);
    }

    const raw = await response.json();
    return mapBackendToFrontend(raw);
  } catch {
    // Backend unreachable – fall back to deterministic mock data
    await new Promise((resolve) => setTimeout(resolve, FALLBACK_LATENCY_MS));
    return getFallbackResult(order);
  }
}
