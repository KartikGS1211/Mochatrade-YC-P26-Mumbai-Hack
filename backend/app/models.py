from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from typing import Literal

class Position(BaseModel):
    symbol: str
    side: Literal["long", "short"]
    margin: float = Field(..., gt=0)
    leverage: float = Field(..., gt=0)

    @property
    def exposure(self) -> float:
        return self.margin * self.leverage

class ProposedOrder(Position):
    pass

class RiskAnalyzeRequest(BaseModel):
    equity: float = Field(default=100_000, gt=0, le=10_000_000)
    positions: list[Position]
    proposedOrder: ProposedOrder

class ScoreComponent(BaseModel):
    component: str
    before: int
    after: int
    delta: int
    description: str = ""
    tooltip: str = ""

class CorrelationMatrixData(BaseModel):
    assets: list[str]
    matrix: list[list[float]]
    insight: str = ""

class StressScenarioData(BaseModel):
    id: str
    name: str
    subtitle: str = ""
    description: str = ""
    disclaimer: str = ""
    beforeLossAmount: float = 0
    beforeLossPercent: float = 0
    afterLossAmount: float = 0
    afterLossPercent: float = 0
    changeAmount: float = 0
    mostAffected: str = ""

class AlternativeOption(BaseModel):
    id: str
    title: str
    margin: float
    leverage: float
    exposure: float
    riskScore: int
    delta: int
    buttonLabel: Optional[str] = None

class GroundedExplanation(BaseModel):
    headline: str = ""
    narrative: str = ""
    summaryDriver: str = ""
    whatChanged: str = ""
    worstScenario: str = ""
    possibleOptions: str = ""
    disclaimer: str = ""

from typing import Optional

class RiskAnalysisResult(BaseModel):
    model_config = ConfigDict(extra="allow")

    currentScore: int
    proposedScore: int
    delta: int
    currentRisk: int
    postTradeRisk: int
    riskDelta: int
    orderLeverage: float
    portfolioLeverageBefore: float
    portfolioLeverageAfter: float
    portfolioLeverage: dict[str, float]
    alertHeadline: str = ""
    alertStatement: str = ""
    primaryDriver: str = ""
    alertWarning: str = ""
    components: list[ScoreComponent]
    correlation: CorrelationMatrixData
    scenarios: list[StressScenarioData]
    alternatives: list[AlternativeOption]
    explanation: GroundedExplanation
    correlationMatrix: dict[str, list[float]] = {}
    dataInfo: Optional[dict] = None

class RiskScoreResponse(BaseModel):
    currentRisk: int
    postTradeRisk: int
    riskDelta: int
    portfolioLeverage: dict[str, float]
    components: dict[str, dict[str, int]]
    correlationMatrix: dict[str, list[list[float]]]
    scenarios: list[dict]
    alternatives: list[dict]
    explanationInputs: dict
