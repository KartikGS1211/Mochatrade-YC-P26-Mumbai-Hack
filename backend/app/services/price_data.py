import pandas as pd
import numpy as np
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")

def load_prices() -> pd.DataFrame:
    csv_path = os.path.join(DATA_DIR, "demo_prices.csv")
    df = pd.read_csv(csv_path, index_col="date", parse_dates=True)
    return df

def get_returns() -> pd.DataFrame:
    prices = load_prices()
    return prices.pct_change().dropna()

def get_correlation_matrix() -> pd.DataFrame:
    returns = get_returns()
    return returns.corr()
