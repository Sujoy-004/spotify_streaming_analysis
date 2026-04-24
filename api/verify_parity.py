import pandas as pd
import numpy as np
import joblib
import os
import sys

# Ensure local imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from data_manager import SpotifyDataManager
from spotify_transformers import ArtistTargetEncoder

def verify_parity():
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    oracle_path = os.path.join(models_dir, 'oracle_pipeline.joblib')
    
    # 1. Load Unified Pipeline
    pipeline = joblib.load(oracle_path)
    
    # 2. Create Test Input (API Request Format)
    test_input = {
        'artist': 'Taylor Swift',
        'year': 2024,
        'month': 4,
        'youtube_views': 10000000.0,
        'tiktok_views': 5000000.0,
        'shazam_counts': 200000.0,
        'apple_music_playlists': 150.0
    }
    
    # 3. Direct Pipeline Prediction
    # Pipeline expects features: ['Artist', 'Released Year', 'Released Month', 'YouTube Views', 'TikTok Views', 'Shazam Counts', 'Apple Music Playlist Count']
    df_input = pd.DataFrame([{
        'Artist': test_input['artist'],
        'Released Year': test_input['year'],
        'Released Month': test_input['month'],
        'YouTube Views': test_input['youtube_views'],
        'TikTok Views': test_input['tiktok_views'],
        'Shazam Counts': test_input['shazam_counts'],
        'Apple Music Playlist Count': test_input['apple_music_playlists']
    }])
    
    direct_prediction = pipeline.predict(df_input)[0]
    
    # 4. API Logic Prediction (via DataManager)
    dm = SpotifyDataManager()
    api_result = dm.predict_popularity(
        test_input['artist'], 
        {
            'Released Year': test_input['year'],
            'Released Month': test_input['month'],
            'YouTube Views': test_input['youtube_views'],
            'TikTok Views': test_input['tiktok_views'],
            'Shazam Counts': test_input['shazam_counts'],
            'Apple Music Playlist Count': test_input['apple_music_playlists']
        }
    )
    api_prediction = api_result['predicted_streams']
    
    # 5. Compare
    diff = abs(direct_prediction - api_prediction)
    status = "PASS" if diff < 1e-6 else "FAIL"
    
    # 6. Output
    print(f"DIRECT: {direct_prediction}")
    print(f"API: {api_prediction}")
    print(f"DIFF: {diff}")
    print(f"STATUS: {status}")

if __name__ == "__main__":
    verify_parity()
