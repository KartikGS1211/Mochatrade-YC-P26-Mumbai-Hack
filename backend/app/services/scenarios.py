from app.models import StressScenarioData

SCENARIO_SHOCKS = {
    "tech-selloff": {
        "name": "Technology sell-off",
        "subtitle": "Illustrative shock",
        "description": "High-beta technology and semiconductor names reprice together.",
        "disclaimer": "Hypothetical stress scenario, not a forecast.",
        "shocks": {"AAPL": -0.12, "AMD": -0.18, "NVDA": -0.22, "COIN": -0.08},
    },
    "market-riskoff": {
        "name": "Broad market risk-off",
        "subtitle": "Macro liquidity contagion",
        "description": "Global equity indices and high-beta assets sell off concurrently.",
        "disclaimer": "Hypothetical stress scenario, not a forecast.",
        "shocks": {"AAPL": -0.10, "AMD": -0.14, "NVDA": -0.16, "COIN": -0.12},
    },
    "liquidity-shock": {
        "name": "Liquidity shock",
        "subtitle": "Sudden volatility spike",
        "description": "Sudden spread widening and margin volatility across leveraged positions.",
        "disclaimer": "Hypothetical stress scenario, not a forecast.",
        "shocks": {"AAPL": -0.06, "AMD": -0.08, "NVDA": -0.10, "COIN": -0.18},
    },
}

def calculate_scenario_losses(
    positions: list[dict],
    proposed_order: dict,
    equity: float,
) -> list[StressScenarioData]:
    all_positions = list(positions) + [proposed_order]
    existing_symbols = {p["symbol"] for p in positions}
    results = []

    for scenario_id, scenario in SCENARIO_SHOCKS.items():
        shocks = scenario["shocks"]
        total_loss_before = 0.0
        total_loss_after = 0.0
        most_affected = ""
        max_loss = 0.0

        for pos in all_positions:
            symbol = pos["symbol"]
            exposure = pos["exposure"]
            shock = shocks.get(symbol, 0.0)
            loss = abs(exposure * shock)

            if symbol in existing_symbols:
                total_loss_before += loss
            total_loss_after += loss

            if loss > max_loss:
                max_loss = loss
                most_affected = symbol

        before_loss = round(total_loss_before, 0)
        after_loss = round(total_loss_after, 0)

        results.append(StressScenarioData(
            id=scenario_id,
            name=scenario["name"],
            subtitle=scenario["subtitle"],
            description=scenario["description"],
            disclaimer=scenario["disclaimer"],
            beforeLossAmount=before_loss,
            beforeLossPercent=round((before_loss / equity) * 100, 1) if equity > 0 else 0,
            afterLossAmount=after_loss,
            afterLossPercent=round((after_loss / equity) * 100, 1) if equity > 0 else 0,
            changeAmount=round(after_loss - before_loss, 0),
            mostAffected=most_affected,
        ))

    return results
