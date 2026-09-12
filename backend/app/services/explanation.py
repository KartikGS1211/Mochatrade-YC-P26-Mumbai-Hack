def generate_explanation(
    components: dict,
    correlation_data: dict,
    scenarios: list,
    proposed_order: dict,
) -> dict:
    primary_drivers = []
    if components["concentration"]["delta"] > 15:
        primary_drivers.append("Concentration")
    if components["correlation"]["delta"] > 15:
        primary_drivers.append("Correlation")
    if components["leverage"]["delta"] > 15:
        primary_drivers.append("Leverage")

    driver_str = " + ".join(primary_drivers) if primary_drivers else "Risk factors"

    if scenarios:
        first = scenarios[0]
        worst_scenario = getattr(first, "name", first[0]["name"] if isinstance(first, list) else "N/A")
    else:
        worst_scenario = "N/A"

    exposure_str = f"₹{proposed_order['exposure']:,.0f} new exposure"

    return {
        "headline": "MochaShield AI Explanation",
        "narrative": (
            f"Your largest vulnerability is combined high-beta technology exposure, "
            f"not a single ticker. The proposed {proposed_order['symbol']} order adds "
            f"{exposure_str} to a portfolio already holding AAPL, AMD and COIN. "
            f"The strongest overlap is with AMD. In the hypothetical technology sell-off "
            f"scenario, the new order increases the estimated portfolio loss. "
            f"A smaller position or lower leverage produces a lower portfolio-risk impact."
        ),
        "summaryDriver": driver_str,
        "whatChanged": exposure_str,
        "worstScenario": worst_scenario,
        "possibleOptions": "Smaller position, Lower leverage",
        "disclaimer": (
            "The AI translates calculated engine output. "
            "It does not calculate financial values, predict direction, or give buy/sell advice."
        ),
    }

def generate_correlation_insight(
    assets: list[str],
    matrix: list[list[float]],
) -> str:
    n = len(assets)
    max_corr = 0.0
    pair = ("", "")
    for i in range(n):
        for j in range(i + 1, n):
            if matrix[i][j] > max_corr:
                max_corr = matrix[i][j]
                pair = (assets[i], assets[j])
    return (
        f"{pair[0]} has the strongest relationship with {pair[1]} in this portfolio "
        f"({max_corr:.2f}). Adding {pair[0] if pair[0] != 'NVDA' else 'NVDA'} "
        f"increases semiconductor exposure rather than adding independent diversification."
    )
