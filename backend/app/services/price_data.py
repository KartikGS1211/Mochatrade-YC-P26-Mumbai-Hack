import datetime
import json
import os
import time
from typing import Optional

import pandas as pd


DATA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data"
)
CACHE_PATH = os.path.join(DATA_DIR, "price_cache.json")
CACHE_TTL_SECONDS = 3600

SYMBOLS = ["AAPL", "AMD", "COIN", "NVDA"]
CORRELATION_ROWS = 90


def _with_metadata(
    prices: pd.DataFrame, *, fetched_at: str, retrieval: str
) -> pd.DataFrame:
    prices.attrs["source"] = "yfinance"
    prices.attrs["fetched_at"] = fetched_at
    prices.attrs["retrieval"] = retrieval
    return prices


def _fetch_yfinance_prices() -> Optional[pd.DataFrame]:
    try:
        import yfinance as yf

        downloaded = yf.download(
            SYMBOLS,
            period="6mo",
            interval="1d",
            auto_adjust=True,
            group_by="column",
            progress=False,
            threads=True,
            timeout=10,
        )
        if downloaded is None or downloaded.empty or "Close" not in downloaded.columns:
            return None

        prices = downloaded["Close"]
        if isinstance(prices, pd.Series):
            prices = prices.to_frame(name=SYMBOLS[0])

        prices = prices.reindex(columns=SYMBOLS).dropna(how="any")
        if len(prices) < CORRELATION_ROWS + 1:
            return None

        fetched_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return _with_metadata(prices, fetched_at=fetched_at, retrieval="live")
    except Exception:
        return None


def _load_cache(*, allow_stale: bool) -> Optional[pd.DataFrame]:
    if not os.path.exists(CACHE_PATH):
        return None

    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as cache_file:
            cache = json.load(cache_file)

        timestamp = float(cache["timestamp"])
        if not allow_stale and time.time() - timestamp >= CACHE_TTL_SECONDS:
            return None

        prices = pd.DataFrame.from_dict(cache["data"], orient="index")
        prices.index = pd.to_datetime(prices.index)
        prices = prices.reindex(columns=SYMBOLS).apply(pd.to_numeric, errors="coerce")
        prices = prices.dropna(how="any")
        if len(prices) < CORRELATION_ROWS + 1:
            return None

        fetched_at = cache.get(
            "fetched_at",
            datetime.datetime.fromtimestamp(
                timestamp, tz=datetime.timezone.utc
            ).isoformat(),
        )
        return _with_metadata(prices, fetched_at=fetched_at, retrieval="cache")
    except (KeyError, TypeError, ValueError, OSError, json.JSONDecodeError):
        return None


def _save_cache(prices: pd.DataFrame) -> None:
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        data = {
            pd.Timestamp(index).isoformat(): {
                symbol: None if pd.isna(value) else float(value)
                for symbol, value in row.items()
            }
            for index, row in prices.iterrows()
        }
        with open(CACHE_PATH, "w", encoding="utf-8") as cache_file:
            json.dump(
                {
                    "timestamp": time.time(),
                    "fetched_at": prices.attrs["fetched_at"],
                    "source": "yfinance",
                    "data": data,
                },
                cache_file,
            )
    except (OSError, TypeError, ValueError):
        pass


def load_prices() -> pd.DataFrame:
    cached_prices = _load_cache(allow_stale=False)
    if cached_prices is not None:
        return cached_prices

    live_prices = _fetch_yfinance_prices()
    if live_prices is not None:
        _save_cache(live_prices)
        return live_prices

    stale_prices = _load_cache(allow_stale=True)
    if stale_prices is not None:
        return stale_prices

    raise RuntimeError("yfinance market data is currently unavailable")


def get_returns(prices: Optional[pd.DataFrame] = None) -> pd.DataFrame:
    price_history = prices if prices is not None else load_prices()
    return price_history.tail(CORRELATION_ROWS + 1).pct_change().dropna(how="all")


def get_correlation_matrix(
    prices: Optional[pd.DataFrame] = None,
) -> pd.DataFrame:
    return get_returns(prices).corr()


def get_data_info(prices: Optional[pd.DataFrame] = None) -> dict:
    price_history = prices if prices is not None else load_prices()
    return {
        "source": price_history.attrs.get("source", "yfinance"),
        "retrieval": price_history.attrs.get("retrieval", "live"),
        "fetched_at": price_history.attrs.get("fetched_at"),
        "rows": len(price_history),
        "symbols": list(price_history.columns),
        "start_date": str(price_history.index[0].date()),
        "end_date": str(price_history.index[-1].date()),
        "correlation_window": f"last {CORRELATION_ROWS} returns",
        "correlation_rows": CORRELATION_ROWS,
    }
