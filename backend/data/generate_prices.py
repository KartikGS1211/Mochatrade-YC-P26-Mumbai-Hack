import numpy as np
import pandas as pd
import os

np.random.seed(42)

n_days = 90
symbols = ["AAPL", "AMD", "COIN", "NVDA"]

target_corr = np.array([
    [1.00, 0.68, 0.48, 0.74],
    [0.68, 1.00, 0.56, 0.82],
    [0.48, 0.56, 1.00, 0.58],
    [0.74, 0.82, 0.58, 1.00],
])

L = np.linalg.cholesky(target_corr)
returns = np.random.normal(0.0005, 0.02, (n_days, 4))
correlated = L @ returns.T
correlated = correlated.T

base_prices = {"AAPL": 195.0, "AMD": 155.0, "COIN": 245.0, "NVDA": 880.0}
volatility = {"AAPL": 0.018, "AMD": 0.028, "COIN": 0.035, "NVDA": 0.032}

dates = pd.bdate_range(start="2025-06-01", periods=n_days, freq="B")

price_data = {}
for i, sym in enumerate(symbols):
    prices = [base_prices[sym]]
    for j in range(1, n_days):
        ret = correlated[j, i]
        drift = 0.0003
        sigma = volatility[sym]
        new_price = prices[-1] * (1 + drift + sigma * ret)
        prices.append(round(new_price, 2))
    price_data[sym] = prices

df = pd.DataFrame(price_data, index=dates)
df.index.name = "date"

out_path = os.path.join(os.path.dirname(__file__), "demo_prices.csv")
df.to_csv(out_path)
print(f"Generated {out_path}")
print(df.head())
print(f"\nCorrelation matrix:")
print(df.pct_change().dropna().corr().round(2))
