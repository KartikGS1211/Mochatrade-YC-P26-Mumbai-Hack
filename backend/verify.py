import subprocess, time, json, os, shutil, glob
# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient

# Clear all cache
for d in glob.glob('**/__pycache__', recursive=True):
    shutil.rmtree(d)

# Kill any existing python processes
subprocess.run(['taskkill', '/F', '/IM', 'python3.exe'], capture_output=True)
time.sleep(1)

# Start uvicorn
p = subprocess.Popen(
    ['python3', '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'],
    cwd=r'D:\Mochatrade-YC-P26-Mumbai-Hack\backend',
    stdout=subprocess.PIPE, stderr=subprocess.PIPE
)
time.sleep(3)

try:
    from app.main import app
    client = TestClient(app)

    req = {
        'equity': 100000,
        'positions': [
            {'symbol': 'AAPL', 'side': 'long', 'margin': 15000, 'leverage': 2},
            {'symbol': 'AMD', 'side': 'long', 'margin': 12500, 'leverage': 2},
            {'symbol': 'COIN', 'side': 'long', 'margin': 10000, 'leverage': 2}
        ],
        'proposedOrder': {'symbol': 'NVDA', 'side': 'long', 'margin': 20000, 'leverage': 3}
    }
    resp = client.post('/api/v1/risk/analyze', json=req)
    r = resp.json()
    print('=== ORIGINAL ORDER (NVDA 20k @ 3x) ===')
    print(f'currentRisk: {r["currentRisk"]}')
    print(f'postTradeRisk: {r["postTradeRisk"]}')
    print(f'riskDelta: {r["riskDelta"]}')
    print(f'portfolioLeverage: {r["portfolioLeverage"]}')
    print(f'correlationMatrix assets: {list(r["correlationMatrix"].keys())}')
    print(f'correlation NVDA-AMD: {r["correlationMatrix"]["NVDA"][1]}')
    print(f'scenarios count: {len(r["scenarios"])}')
    print(f'alternatives count: {len(r["alternatives"])}')
    assert r['currentRisk'] == 52 and r['postTradeRisk'] == 79 and r['riskDelta'] == 27

    # Test smaller position
    req2 = {
        'equity': 100000,
        'positions': [
            {'symbol': 'AAPL', 'side': 'long', 'margin': 15000, 'leverage': 2},
            {'symbol': 'AMD', 'side': 'long', 'margin': 12500, 'leverage': 2},
            {'symbol': 'COIN', 'side': 'long', 'margin': 10000, 'leverage': 2}
        ],
        'proposedOrder': {'symbol': 'NVDA', 'side': 'long', 'margin': 10000, 'leverage': 3}
    }
    resp2 = client.post('/api/v1/risk/analyze', json=req2)
    r2 = resp2.json()
    print(f'\n=== SMALLER POSITION (NVDA 10k @ 3x) ===')
    print(f'postTradeRisk: {r2["postTradeRisk"]}')
    assert r2['postTradeRisk'] < r['postTradeRisk'], 'Smaller position should lower risk'

    # Test lower leverage
    req3 = {
        'equity': 100000,
        'positions': [
            {'symbol': 'AAPL', 'side': 'long', 'margin': 15000, 'leverage': 2},
            {'symbol': 'AMD', 'side': 'long', 'margin': 12500, 'leverage': 2},
            {'symbol': 'COIN', 'side': 'long', 'margin': 10000, 'leverage': 2}
        ],
        'proposedOrder': {'symbol': 'NVDA', 'side': 'long', 'margin': 20000, 'leverage': 1}
    }
    resp3 = client.post('/api/v1/risk/analyze', json=req3)
    r3 = resp3.json()
    print(f'\n=== LOWER LEVERAGE (NVDA 20k @ 1x) ===')
    print(f'postTradeRisk: {r3["postTradeRisk"]}')
    assert r3['postTradeRisk'] < r['postTradeRisk'], 'Lower leverage should lower risk'

    print('\n=== ALL TESTS PASSED ===')

finally:
    p.terminate()
    p.wait()
