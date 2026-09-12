import numpy as np
import pandas as pd
from typing import Literal

def calc_exposure(margin: float, leverage: float) -> float:
    return margin * leverage

def calc_concentration_score(exposures: list[float]) -> float:
    total = sum(exposures)
    if total == 0:
        return 0.0
    weights = [e / total for e in exposures]
    hhi = sum(w ** 2 for w in weights)
    return normalise_0_100(hhi, 0.0, 1.0)

def calc_leverage_score(gross_exposure: float, equity: float) -> float:
    leverage = gross_exposure / equity if equity > 0 else 0.0
    return normalise_0_100(leverage, 0.0, 2.0)

def normalise_0_100(value: float, min_val: float, max_val: float) -> int:
    if max_val == min_val:
        return 50
    score = (value - min_val) / (max_val - min_val) * 100
    return int(round(max(0, min(100, score))))

def compute_risk_scores(
    positions: list[dict],
    proposed_order: dict,
    equity: float,
) -> dict:
    all_pos_before = positions
    all_pos_after = positions + [proposed_order]

    exposures_before = [calc_exposure(p["margin"], p["leverage"]) for p in all_pos_before]
    exposures_after = [calc_exposure(p["margin"], p["leverage"]) for p in all_pos_after]

    gross_exposure_before = sum(exposures_before)
    gross_exposure_after = sum(exposures_after)

    conc_before = calc_concentration_score(exposures_before)
    conc_after = calc_concentration_score(exposures_after)

    lev_before = calc_leverage_score(gross_exposure_before, equity)
    lev_after = calc_leverage_score(gross_exposure_after, equity)

    return {
        "exposures_before": exposures_before,
        "exposures_after": exposures_after,
        "gross_exposure_before": gross_exposure_before,
        "gross_exposure_after": gross_exposure_after,
        "concentration_before": conc_before,
        "concentration_after": conc_after,
        "leverage_before": lev_before,
        "leverage_after": lev_after,
    }
