import requests
import json

url = "http://127.0.0.1:8000/api/ml/predict"
payload = {
    "artist": "Taylor Swift",
    "year": 2024,
    "month": 5,
    "popularity": 95
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

url_clusters = "http://127.0.0.1:8000/api/ml/clusters"
try:
    response = requests.get(url_clusters)
    print(f"Clusters Count: {len(response.json())}")
except Exception as e:
    print(f"Error fetching clusters: {e}")
