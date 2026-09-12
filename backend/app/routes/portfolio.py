from fastapi import APIRouter, HTTPException
from typing import Any

from app.services.price_data import load_prices, SYMBOLS

router = APIRouter()

SYMBOL_NAMES = {
    "AAPL": "Apple Inc.",
    "AMD": "Advanced Micro Devices",
    "COIN": "Coinbase Global",
    "NVDA": "NVIDIA Corp.",
    "TSLA": "Tesla Inc.",
    "META": "Meta Platforms",
    "MSFT": "Microsoft Corp.",
    "SPY": "SPDR S&P 500 ETF",
    "BTC": "Bitcoin Perp",
    "GLD": "SPDR Gold Shares",
}

DEFAULT_POSITIONS = {
    "AAPL": {"margin": 15000, "leverage": 2},
    "AMD": {"margin": 12500, "leverage": 2},
    "COIN": {"margin": 10000, "leverage": 2},
}

DEFAULT_EQUITY = 100_000


@router.get("/api/v1/portfolio")
async def get_portfolio():
    try:
        prices_df = load_prices()
        if prices_df is None or prices_df.empty:
            raise HTTPException(status_code=503, detail="No price data available")

        prices = prices_df.dropna(how="all")
        latest_prices = prices.iloc[-1]
        prev_prices = prices.iloc[-2] if len(prices) >= 2 else prices.iloc[0]

        holdings = []
        total_exposure = 0.0
        holding_id = 0

        for symbol in DEFAULT_POSITIONS:
            if symbol not in latest_prices.index:
                continue

            current_price = float(latest_prices[symbol])
            prev_price = float(prev_prices[symbol]) if symbol in prev_prices.index else current_price
            day_change_pct = ((current_price - prev_price) / prev_price * 100) if prev_price != 0 else 0.0

            config = DEFAULT_POSITIONS[symbol]
            exposure = config["margin"] * config["leverage"]
            total_exposure += exposure
            holding_id += 1

            holdings.append({
                "id": f"pos-{holding_id}",
                "symbol": symbol,
                "name": SYMBOL_NAMES.get(symbol, symbol),
                "side": "Long",
                "margin": config["margin"],
                "leverage": config["leverage"],
                "exposure": exposure,
                "dayChange": f"{day_change_pct:+.2f}%",
                "currentPrice": current_price,
                "prevPrice": prev_price,
                "riskTags": ["Technology", "High beta"] if symbol in ("AAPL", "AMD", "NVDA") else ["Crypto-linked", "High beta"] if symbol == "COIN" else ["High volatility"],
            })

        gross_exposure = total_exposure
        gross_leverage = round(gross_exposure / DEFAULT_EQUITY, 2) if DEFAULT_EQUITY > 0 else 0
        open_positions = len(holdings)

        return {
            "equity": DEFAULT_EQUITY,
            "grossExposure": gross_exposure,
            "grossLeverage": gross_leverage,
            "riskScore": 52,
            "riskLabel": "Moderate",
            "openPositions": open_positions,
            "dataWindow": "Live yfinance",
            "dataTimestamp": str(__import__("datetime").datetime.now().isoformat()),
            "holdings": holdings,
        }

    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Portfolio fetch failed: {str(e)}\n{traceback.format_exc()}")