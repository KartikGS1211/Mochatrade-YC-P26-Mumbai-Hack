// ---------------------------------------------------------------------------
// MochaShield – Production-grade TypeScript interfaces for Pre-trade Risk
// ---------------------------------------------------------------------------

export type TradeSide = "Long" | "Short";

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  side: TradeSide;
  margin: number;
  leverage: number;
  exposure: number;
  dayChange: string;
  riskTags: string[];
}

export interface Portfolio {
  equity: number;
  grossExposure: number;
  grossLeverage: number;
  riskScore: number;
  riskLabel: string;
  openPositions: number;
  dataWindow: string;
  dataTimestamp?: string;
  holdings: Holding[];
}

export interface ProposedOrder {
  symbol: string;
  side: TradeSide;
  margin: number;
  leverage: number;
  exposure: number;
  note?: string;
}

export interface ScoreComponent {
  component: string;
  before: number;
  after: number;
  delta: number;
  description: string;
  tooltip: string;
}

export interface CorrelationMatrixData {
  assets: string[];
  matrix: number[][];
  insight: string;
}

export interface StressScenarioData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  disclaimer: string;
  beforeLossAmount: number;
  beforeLossPercent: number;
  afterLossAmount: number;
  afterLossPercent: number;
  changeAmount: number;
  mostAffected: string;
}

export interface AlternativeOption {
  id: string;
  title: string;
  margin: number;
  leverage: number;
  exposure: number;
  riskScore: number;
  delta: number;
  buttonLabel?: string;
}

export interface GroundedExplanation {
  headline: string;
  narrative: string;
  summaryDriver: string;
  whatChanged: string;
  worstScenario: string;
  possibleOptions: string;
  disclaimer: string;
}

export interface RiskAnalysisResult {
  currentScore: number;
  proposedScore: number;
  delta: number;
  orderLeverage: number;
  portfolioLeverageBefore: number;
  portfolioLeverageAfter: number;
  alertHeadline: string;
  alertStatement: string;
  primaryDriver: string;
  alertWarning: string;
  components: ScoreComponent[];
  correlation: CorrelationMatrixData;
  scenarios: StressScenarioData[];
  alternatives: AlternativeOption[];
  explanation: GroundedExplanation;
}
