import pandas as pd
import numpy as np
import os, datetime, json, time

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
CACHE_PATH = os.path.join(DATA_DIR, "price_cache.json")
CACHE_TTL_SECONDS = 3600  # 1 hour

SYMBOLS = ["AAPL", "AMD", "COIN", "NVDA"]

def _fetch_live_prices() -> pd.DataFrame | None:
    try:
        import yfinance as yf
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=120)
        df = yf.download(SYMBOLS, start=start_date, end=end_date, progress=False)
        if df is not None and not df.empty and "Close" in df.columns:
            prices = df["Close"].dropna()
            if len(prices) >= 60:
                return prices
    except Exception:
        pass
    return None

def _load_csv() -> pd.DataFrame | None:
    csv_path = os.path.join(DATA_DIR, "demo_prices.csv")
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path, index_col="date", parse_dates=True)
    return None

def _load_cache() -> pd.DataFrame | None:
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, "r") as f:
                cache = json.load(f)
            if "timestamp" in cache and "data" in cache:
                age = time.time() - cache["timestamp"]
                if age < CACHE_TTL_SECONDS:
                    df = pd.DataFrame.from_dict(cache["data"], orient="index")
            df.index = pd.to_datetime(df.index)
            return df
        except Exception:
            pass
    return None

def _save_cache(df: pd.DataFrame):
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        data = {str(idx): row.to_dict() for idx, row in df.iterrows()}
        with open(CACHE_PATH, "w") as f:
            json.dump({"timestamp": time.time(), "data": data}, f)
    except Exception:
        pass

def load_prices() -> pd.DataFrame:
    # 1. Try live data
    df = _fetch_live_prices()
    if df is not None:
        _save_cache(df)
        return df

    # 2. Try cache
    df = _load_cache()
    if df is not None and len(df) >= 60:
        return df

    # 3. Fall back to CSV
    df = _load_csv()
    if df is not None:
        return df

    # 4. Generate synthetic fallback
    np.random.seed(42)
    dates = pd.bdate_range(start="2025-06-01", periods=90, freq="B")
    prices_dict = {}
    base = {"AAPL": 195.0, "AMD": 155.0, "COIN": 245.0, "NVDA": 880.0}
    for sym in SYMBOLS:
        prices = [base[sym]]
        for _ in range(89):
            prices.append(prices[-1] * (1 + np.random.normal(0.0005, 0.02)))
        prices_dict[sym] = [round(p, 2) for p in prices]
    df = pd.DataFrame(prices_dict, index=dates)
    return df

LAST_N_ROWS = 5

def get_returns() -> pd.DataFrame:
    prices = load_prices().tail(LAST_N_ROWS)
    return prices.pct_change().dropna()

def get_correlation_matrix() -> pd.DataFrame:
    returns = get_returns()
    return returns.corr()

def get_data_info() -> dict:
    prices = load_prices()
    return {
        "source": "live" if _fetch_live_prices() is not None else ("cache" if _load_cache() is not None else "csv"),
        "rows": len(prices),
        "symbols": list(prices.columns),
        "start_date": str(prices.index[0].date()),
        "end_date": str(prices.index[-1].date()),
        "correlation_window": f"last {LAST_N_ROWS} rows",
        "correlation_rows": LAST_N_ROWS,
    }
