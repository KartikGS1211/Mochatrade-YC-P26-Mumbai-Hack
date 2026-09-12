import subprocess, time, json, sys, urllib.request, os, shutil

# Kill any existing uvicorn
subprocess.run(['taskkill', '/F', '/IM', 'python3.exe'], capture_output=True)
time.sleep(1)

# Clear all cache
for root, dirs, files in os.walk(r'D:\Mochatrade-YC-P26-Mumbai-Hack\backend'):
    for d in dirs:
        if d == '__pycache__':
            shutil.rmtree(os.path.join(root, d))

p = subprocess.Popen(
    ['python3', '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000', '--reload', '--reload-dir', r'D:\Mochatrade-YC-P26-Mumbai-Hack\backend\app'],
    cwd=r'D:\Mochatrade-YC-P26-Mumbai-Hack\backend',
    stdout=subprocess.PIPE, stderr=subprocess.PIPE,
)
time.sleep(3)

try:
    req_data = json.dumps({
        'equity': 100000,
        'positions': [
            {'symbol': 'AAPL', 'side': 'long', 'margin': 15000, 'leverage': 2},
            {'symbol': 'AMD', 'side': 'long', 'margin': 12500, 'leverage': 2},
            {'symbol': 'COIN', 'side': 'long', 'margin': 10000, 'leverage': 2}
        ],
        'proposedOrder': {'symbol': 'NVDA', 'side': 'long', 'margin': 20000, 'leverage': 3}
    }).encode()

    req = urllib.request.Request('http://127.0.0.1:8000/api/v1/risk/analyze', data=req_data, headers={'Content-Type': 'application/json'})
    resp = urllib.request.urlopen(req, timeout=10)
    result = json.loads(resp.read().decode())

    keys = list(result.keys())
    print("Response keys:", keys)

    assert 'currentRisk' in result, f"currentRisk not in keys: {keys}"
    assert result['currentRisk'] == 52, f"currentRisk: {result['currentRisk']}"
    assert result['postTradeRisk'] == 79, f"postTradeRisk: {result['postTradeRisk']}"
    assert result['riskDelta'] == 27
    assert result['portfolioLeverage']['before'] == 0.75
    assert result['portfolioLeverage']['after'] == 1.35
    assert len(result['components']) == 4
    assert len(result['scenarios']) == 3
    assert len(result['alternatives']) == 3
    assert len(result['correlation']['assets']) == 4
    assert len(result['correlationMatrix']) == 4

    print("\nALL TESTS PASSED!")
    print(f"currentRisk={result['currentRisk']}, postTradeRisk={result['postTradeRisk']}, delta={result['riskDelta']}")
    print(f"portfolioLeverage before={result['portfolioLeverage']['before']}, after={result['portfolioLeverage']['after']}")

    # Test smaller position
    req_data2 = json.dumps({
        'equity': 100000,
        'positions': [
            {'symbol': 'AAPL', 'side': 'long', 'margin': 15000, 'leverage': 2},
            {'symbol': 'AMD', 'side': 'long', 'margin': 12500, 'leverage': 2},
            {'symbol': 'COIN', 'side': 'long', 'margin': 10000, 'leverage': 2}
        ],
        'proposedOrder': {'symbol': 'NVDA', 'side': 'long', 'margin': 10000, 'leverage': 3}
    }).encode()
    req2 = urllib.request.Request('http://127.0.0.1:8000/api/v1/risk/analyze', data=req_data2, headers={'Content-Type': 'application/json'})
    resp2 = urllib.request.urlopen(req2, timeout=10)
    result2 = json.loads(resp2.read().decode())
    print(f"\nSmaller position (10k @ 3x): currentRisk={result2['currentRisk']}, postTradeRisk={result2['postTradeRisk']}, delta={result2['riskDelta']}")

    # Test lower leverage
    req_data3 = json.dumps({
        'equity': 100000,
        'positions': [
            {'symbol': 'AAPL', 'side': 'long', 'margin': 15000, 'leverage': 2},
            {'symbol': 'AMD', 'side': 'long', 'margin': 12500, 'leverage': 2},
            {'symbol': 'COIN', 'side': 'long', 'margin': 10000, 'leverage': 2}
        ],
        'proposedOrder': {'symbol': 'NVDA', 'side': 'long', 'margin': 20000, 'leverage': 1}
    }).encode()
    req3 = urllib.request.Request('http://127.0.0.1:8000/api/v1/risk/analyze', data=req_data3, headers={'Content-Type': 'application/json'})
    resp3 = urllib.request.urlopen(req3, timeout=10)
    result3 = json.loads(resp3.read().decode())
    print(f"Lower leverage (20k @ 1x): currentRisk={result3['currentRisk']}, postTradeRisk={result3['postTradeRisk']}, delta={result3['riskDelta']}")

    # Verify smaller position has lower risk than original
    assert result2['postTradeRisk'] < result['postTradeRisk'], "Smaller position should have lower risk"
    assert result3['postTradeRisk'] < result['postTradeRisk'], "Lower leverage should have lower risk"
    print("\nAlternative comparisons verified!")

finally:
    p.terminate()
    p.wait()
