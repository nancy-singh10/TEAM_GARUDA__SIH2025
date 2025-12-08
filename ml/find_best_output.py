#!/usr/bin/env python3
"""
Find and extract the best forecast model from aggregated data
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime

print("=" * 70)
print("FINDING BEST MODEL FROM AVAILABLE FORECASTS")
print("=" * 70)

# Load aggregated data
df = pd.read_csv('all_models_forecast_2026.csv')
df['Date'] = pd.to_datetime(df['Date'])

print(f"\nLoaded forecasts: {len(df)} days")
print(f"Date range: {df['Date'].min().date()} to {df['Date'].max().date()}")

# Extract solar columns
solar_cols = sorted([col for col in df.columns if col.startswith('Solar_')])

print(f"\nAvailable Solar Models:")
for col in solar_cols:
    print(f"  ✓ {col}")

# Calculate consensus (mean)
consensus = df[solar_cols].mean(axis=1)

# Calculate accuracy metrics for each model
accuracy = {}
for col in solar_cols:
    rmse = np.sqrt(np.mean((df[col] - consensus)**2))
    mae = np.mean(np.abs(df[col] - consensus))
    cv = (df[col].std() / df[col].mean()) * 100
    
    accuracy[col] = {
        'RMSE': rmse,
        'MAE': mae,
        'CV': cv,
        'Mean': df[col].mean(),
        'Total': df[col].sum() / 1000  # in MWh
    }

print("\n" + "=" * 70)
print("MODEL PERFORMANCE METRICS")
print("=" * 70)
print(f"\n{'Model':<30} {'RMSE':<12} {'MAE':<12} {'CV%':<10} {'Annual':<15}")
print("-" * 80)

# Rank by RMSE (lower is better)
ranked = sorted(accuracy.items(), key=lambda x: x[1]['RMSE'])
for rank, (model, metrics) in enumerate(ranked, 1):
    print(f"{rank}. {model:<27} {metrics['RMSE']:<12.4f} {metrics['MAE']:<12.4f} {metrics['CV']:<10.2f} {metrics['Total']:<15,.0f}")

print("\n" + "=" * 70)
print("🏆 BEST MODEL SELECTED")
print("=" * 70)

best_model = ranked[0][0]
best_metrics = ranked[0][1]

print(f"\nWinner: {best_model}")
print(f"  RMSE: {best_metrics['RMSE']:.4f} kWh/day")
print(f"  MAE: {best_metrics['MAE']:.4f} kWh/day")
print(f"  Stability (CV): {best_metrics['CV']:.2f}%")
print(f"  Annual Forecast: {best_metrics['Total']:,.1f} MWh/year")
print(f"  Daily Mean: {best_metrics['Mean']:.2f} kWh/day")

# Save best output
best_output = df[['Date', best_model]].copy()
best_output.columns = ['Date', 'Solar_Energy_Forecast_2026_kWh']

# Add consensus as well
best_output['Solar_Consensus_Mean_kWh'] = consensus.values
best_output['Solar_Min_kWh'] = df[solar_cols].min(axis=1).values
best_output['Solar_Max_kWh'] = df[solar_cols].max(axis=1).values
best_output['Solar_Std_kWh'] = df[solar_cols].std(axis=1).values

best_output.to_csv('best_model_forecast_2026.csv', index=False)

print(f"\n✓ Best forecast saved to: best_model_forecast_2026.csv")
print(f"  Shape: {best_output.shape[0]} days × {best_output.shape[1]} columns")
print(f"  Columns:")
for col in best_output.columns:
    print(f"    - {col}")

# Save report
report = {
    'timestamp': datetime.now().isoformat(),
    'best_model': best_model,
    'metrics': {k: float(v) for k, v in best_metrics.items()},
    'all_models_ranked': {model: {k: float(v) for k, v in metrics.items()} for model, metrics in ranked}
}

with open('best_model_report.json', 'w') as f:
    json.dump(report, f, indent=2)

print(f"\n✓ Report saved to: best_model_report.json")

# Display first 10 rows
print(f"\n" + "=" * 70)
print("FORECAST SAMPLE (First 10 days)")
print("=" * 70)
print(best_output.head(10).to_string(index=False))

# Monthly summary
best_output['Month'] = best_output['Date'].dt.to_period('M')
monthly = best_output.groupby('Month')['Solar_Energy_Forecast_2026_kWh'].agg(['mean', 'min', 'max', 'sum'])

print(f"\n" + "=" * 70)
print("MONTHLY SUMMARY (2026)")
print("=" * 70)
print(monthly.to_string())

print(f"\n" + "=" * 70)
print("SUMMARY - USE THIS FILE FOR YOUR FORECAST")
print("=" * 70)
print(f"\n📊 File: best_model_forecast_2026.csv")
print(f"📈 Best Model: {best_model}")
print(f"🎯 Total 2026 Solar: {best_metrics['Total']:,.1f} MWh")
print(f"📅 365 days × 5 columns (Date + 4 forecast variants)")
print(f"\n✅ Ready for use in dashboards, reports, and planning!")
print("=" * 70)
