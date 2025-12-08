#!/usr/bin/env python3
"""
Aggregate all 2026 forecast CSVs from different models into a single file.
Supports: SARIMA, Prophet, LSTM, XGBoost, Ensemble
"""

import pandas as pd
import os
from pathlib import Path

# Set working directory to ml folder
ML_DIR = Path(__file__).parent
os.chdir(ML_DIR)

print("=" * 70)
print("AGGREGATING ALL 2026 FORECASTS")
print("=" * 70)

# Define expected forecast files and their model names
FORECAST_FILES = {
    'model1_ensemble': 'solar_energy_forecast_2026.csv',
    'model2_sarima': 'sarima_forecast_2026.csv',
    'model3_prophet': 'prophet_forecast_2026.csv',
    'model4_lstm': 'lstm_forecast_2026.csv',
    'model5_xgboost': 'xgboost_forecast_2026.csv',
}

# Load all available forecasts
forecasts = {}
missing_files = []

for model_name, filename in FORECAST_FILES.items():
    filepath = ML_DIR / filename
    if filepath.exists():
        df = pd.read_csv(filepath)
        forecasts[model_name] = df
        print(f"✓ Loaded {model_name}: {filename} ({len(df)} rows)")
    else:
        missing_files.append(filename)
        print(f"✗ Not found: {filename}")

if missing_files:
    print(f"\nWarning: {len(missing_files)} forecast file(s) missing.")
    print("Run the individual model notebooks to generate them.")
    print()

if not forecasts:
    print("\nError: No forecast files found. Please run the model notebooks first.")
    exit(1)

# Create standard date range (2026-01-01 to 2026-12-31, 365 days)
standard_dates = pd.date_range('2026-01-01', '2026-12-31', freq='D')
base_df = pd.DataFrame({'Date': standard_dates})

print(f"\nStandard date range: {base_df['Date'].min().date()} to {base_df['Date'].max().date()}")
print(f"Total days: {len(base_df)}")

# Merge forecasts from all models
for model_name, df in forecasts.items():
    df_copy = df.copy()
    df_copy['Date'] = pd.to_datetime(df_copy['Date'])
    
    # Sort by date and keep only 365 rows starting from 2026-01-01
    df_copy = df_copy[df_copy['Date'] >= '2026-01-01'].sort_values('Date').reset_index(drop=True)
    df_copy = df_copy.head(365)  # Take only first 365 rows
    
    # Merge with base_df on Date (left join to keep standard dates)
    if 'Solar_Energy_Forecast_kWh' in df_copy.columns:
        solar_col_name = f'Solar_{model_name}'
        df_solar = df_copy[['Date', 'Solar_Energy_Forecast_kWh']].copy()
        df_solar.columns = ['Date', solar_col_name]
        base_df = base_df.merge(df_solar, on='Date', how='left')
    
    # Extract Wind forecast if available
    if 'Wind_Energy_Forecast_kWh' in df_copy.columns:
        wind_col_name = f'Wind_{model_name}'
        df_wind = df_copy[['Date', 'Wind_Energy_Forecast_kWh']].copy()
        df_wind.columns = ['Date', wind_col_name]
        base_df = base_df.merge(df_wind, on='Date', how='left')

# Reorder columns: Date first, then Solar models, then Wind models
solar_cols = [col for col in base_df.columns if col.startswith('Solar_')]
wind_cols = [col for col in base_df.columns if col.startswith('Wind_')]
final_cols = ['Date'] + sorted(solar_cols) + sorted(wind_cols)
base_df = base_df[final_cols]

# Save aggregated forecast
output_file = ML_DIR / 'all_models_forecast_2026.csv'
base_df.to_csv(output_file, index=False)
print(f"\n✓ Aggregated forecast saved to: {output_file.name}")

# Display summary
print(f"\n{'='*70}")
print("AGGREGATED FORECAST SUMMARY")
print(f"{'='*70}")
print(f"Total rows: {len(base_df)}")
print(f"Total columns: {len(base_df.columns)}")
print(f"\nColumns:")
for col in base_df.columns:
    print(f"  - {col}")

# Display sample (first 10 days)
print(f"\nSample (First 10 days):")
print(base_df.head(10).to_string(index=False))

# Calculate and display statistics
print(f"\n{'='*70}")
print("STATISTICS FOR EACH MODEL (SOLAR)")
print(f"{'='*70}")

for solar_col in sorted(solar_cols):
    model_label = solar_col.replace('Solar_', '').replace('_', ' ').title()
    mean_val = base_df[solar_col].mean()
    std_val = base_df[solar_col].std()
    min_val = base_df[solar_col].min()
    max_val = base_df[solar_col].max()
    total_val = base_df[solar_col].sum()
    
    print(f"\n{model_label}:")
    print(f"  Mean:  {mean_val:.2f} kWh/day")
    print(f"  Std:   {std_val:.2f} kWh/day")
    print(f"  Min:   {min_val:.2f} kWh/day")
    print(f"  Max:   {max_val:.2f} kWh/day")
    print(f"  Total: {total_val:,.2f} kWh (2026)")

if wind_cols:
    print(f"\n{'='*70}")
    print("STATISTICS FOR EACH MODEL (WIND)")
    print(f"{'='*70}")
    
    for wind_col in sorted(wind_cols):
        model_label = wind_col.replace('Wind_', '').replace('_', ' ').title()
        mean_val = base_df[wind_col].mean()
        std_val = base_df[wind_col].std()
        min_val = base_df[wind_col].min()
        max_val = base_df[wind_col].max()
        total_val = base_df[wind_col].sum()
        
        print(f"\n{model_label}:")
        print(f"  Mean:  {mean_val:.2f} kWh/day")
        print(f"  Std:   {std_val:.2f} kWh/day")
        print(f"  Min:   {min_val:.2f} kWh/day")
        print(f"  Max:   {max_val:.2f} kWh/day")
        print(f"  Total: {total_val:,.2f} kWh (2026)")

print(f"\n{'='*70}")
print("✓ AGGREGATION COMPLETE")
print(f"{'='*70}")
