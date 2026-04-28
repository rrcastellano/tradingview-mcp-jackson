import pandas as pd
import os

def get_prices(file_path, date, et_times):
    if not os.path.exists(file_path):
        return f"File {file_path} not found"
    
    df = pd.read_csv(file_path)
    # Ensure et_date is string
    df['et_date'] = df['et_date'].astype(str)
    
    # Filter by date
    day_df = df[df['et_date'] == date]
    
    results = {}
    for et_time in et_times:
        # Match time (HH:MM:SS format in CSV usually, or HH:MM)
        # Let's check the format first
        # We'll use a string match for the beginning of the time string
        match = day_df[day_df['et_time'].str.startswith(et_time)]
        if not match.empty:
            results[et_time] = match.iloc[0]['close']
        else:
            # Try to find the closest one
            results[et_time] = "N/A"
            
    return results

date = "2026-04-09"
et_times = ["10:20", "12:17", "10:24", "11:16", "11:24", "11:32", "11:35", "11:48", "12:11", "13:37"]

spx_file = "/Users/ronaldo.ribeirocastellano/Github/alpaca/data/SPX.csv"
vix_file = "/Users/ronaldo.ribeirocastellano/Github/alpaca/data/VIX.csv"

spx_results = get_prices(spx_file, date, et_times)
vix_results = get_prices(vix_file, date, et_times)

print("SPX Results:")
for t, p in spx_results.items():
    print(f"{t}: {p}")

print("\nVIX Results:")
for t, p in vix_results.items():
    print(f"{t}: {p}")
