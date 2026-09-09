// ---------------------------------------------------------------------------
// MochaShield – Asynchronous Risk Analysis API Layer
//
// Structured for seamless integration with a FastAPI or Python risk engine.
// Currently simulates calculation latency (~800ms) with deterministic outputs.
// ---------------------------------------------------------------------------

import type { ProposedOrder, RiskAnalysisResult } from "@/types/risk";
import { DEFAULT_RISK_ANALYSIS } from "@/lib/mock-risk-data";

const SIMULATED_LATENCY_MS = 800;

/**
 * Evaluates the impact of a proposed trade ticket on the existing portfolio.
 *
 * In production, this issues an HTTP POST to:
 * `POST /api/v1/risk/analyze` with JSON payload { order, portfolioId }
 */
export async function analyzePortfolioRisk(
  order: ProposedOrder
): Promise<RiskAnalysisResult> {
  // Production FastAPI integration placeholder:
  //
  // const response = await fetch(`${process.env.NEXT_PUBLIC_RISK_API_URL}/api/v1/risk/analyze`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ order }),
  // });
  // if (!response.ok) throw new Error(`Risk evaluation failed: ${response.statusText}`);
  // return response.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      // Dynamic calculation based on order inputs
      const exposure = order.margin * order.leverage;
      const portfolioEquity = 100_000;
      const initialGrossExposure = 75_000;
      const newGrossExposure = initialGrossExposure + exposure;
      const newGrossLeverage = Number((newGrossExposure / portfolioEquity).toFixed(2));

      // Adjust risk score deterministically based on exposure and leverage
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
          // Default: 20k @ 3x = 60k exposure
          calculatedScore = 79;
          calculatedDelta = 27;
        }
      } else {
        // Other symbols calculation
        const factor = Math.min(1.8, Math.max(0.6, (exposure / 60_000) * (order.leverage / 3)));
        calculatedDelta = Math.round(27 * factor);
        calculatedScore = Math.min(95, Math.max(52, 52 + calculatedDelta));
      }

      const result: RiskAnalysisResult = {
        ...DEFAULT_RISK_ANALYSIS,
        currentScore: 52,
        proposedScore: calculatedScore,
        delta: calculatedDelta,
        orderLeverage: order.leverage,
        portfolioLeverageBefore: 0.75,
        portfolioLeverageAfter: newGrossLeverage,
        // Clone and adjust alternatives
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

      resolve(result);
    }, SIMULATED_LATENCY_MS);
  });
}
