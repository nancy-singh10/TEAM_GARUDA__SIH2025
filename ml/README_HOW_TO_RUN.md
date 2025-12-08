# How to Run the Energy Forecasting Models

This guide shows you exactly where and how to run all the ML code for 2026 energy forecasting.

---

## **Prerequisites**

✓ All data files in place:
- `energy_data_3_years.csv` — in `/ml/` folder
- Project folder: `c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml\`

---

## **STEP 1: Run Individual Model Notebooks**

All 5 model notebooks are in: `c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml\`

### **Option A: Using VS Code (Recommended)**

1. **Open VS Code**
2. **Navigate to the `/ml/` folder** via File > Open Folder
3. **Open each notebook** and click **"Run All"** button (or Ctrl+Shift+Enter)

#### Models to run (in order):

| # | Notebook | Runtime | Output File |
|---|----------|---------|------------|
| 1 | `model1.ipynb` | ~30 sec | `solar_energy_forecast_2026.csv` |
| 2 | `model2_sarima.ipynb` | ~2-3 min | `sarima_forecast_2026.csv` |
| 3 | `model3_prophet.ipynb` | ~2-3 min | `prophet_forecast_2026.csv` |
| 4 | `model4_lstm.ipynb` | ~3-5 min | `lstm_forecast_2026.csv` |
| 5 | `model5_xgboost.ipynb` | ~3-5 min | `xgboost_forecast_2026.csv` |

**Total time: ~12-18 minutes for all models**

---

### **Option B: Using Jupyter from Terminal**

```powershell
# Navigate to ml folder
cd c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml

# Run individual notebooks
jupyter notebook model1.ipynb
jupyter notebook model2_sarima.ipynb
jupyter notebook model3_prophet.ipynb
jupyter notebook model4_lstm.ipynb
jupyter notebook model5_xgboost.ipynb
```

---

## **STEP 2: Aggregate All Model Forecasts**

Once all 5 model notebooks complete, aggregate their outputs:

### **In Terminal (PowerShell):**

```powershell
cd c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml

python aggregate_forecasts.py
```

**Output:** `all_models_forecast_2026.csv` (5 models × 365 days)

**Runtime:** ~30 seconds

---

## **STEP 3: Validate & Select Best Model**

Open and run the validation notebook:

### **In VS Code:**
1. Open `validate_and_select_best_model.ipynb`
2. Click **"Run All"** (Ctrl+Shift+Enter)

**Output:** 
- `model_validation_report.json` (validation results)
- Console output showing rankings and recommendations

**Runtime:** ~1 minute

---

## **STEP 4: Extract Best Outputs**

Open and run the output extraction notebook:

### **In VS Code:**
1. Open `extract_best_outputs.ipynb`
2. Click **"Run All"** (Ctrl+Shift+Enter)

**Output files created:**
- `best_outputs_daily_2026.csv` — All models daily forecasts
- `best_outputs_monthly_2026.csv` — Monthly aggregates
- `best_outputs_annual_2026.csv` — Annual totals
- `best_outputs_comparison.csv` — Quick comparison table

**Runtime:** ~30 seconds

---

## **Complete Workflow (Quick Reference)**

```
Step 1: Run 5 model notebooks (12-18 min)
  ↓
Step 2: python aggregate_forecasts.py (30 sec)
  ↓
Step 3: Run validate_and_select_best_model.ipynb (1 min)
  ↓
Step 4: Run extract_best_outputs.ipynb (30 sec)
  ↓
✓ Done! All outputs ready (12-20 minutes total)
```

---

## **Final Output Files**

After completing all steps, you'll have:

### **Individual Model Forecasts:**
- `solar_energy_forecast_2026.csv` (Ensemble)
- `sarima_forecast_2026.csv` (SARIMA)
- `prophet_forecast_2026.csv` (Prophet)
- `lstm_forecast_2026.csv` (LSTM)
- `xgboost_forecast_2026.csv` (XGBoost)

### **Aggregated & Analysis:**
- `all_models_forecast_2026.csv` (All models merged)
- `model_validation_report.json` (Best model identified)
- `best_outputs_daily_2026.csv` (Recommended to use)
- `best_outputs_monthly_2026.csv` (For monthly planning)
- `best_outputs_annual_2026.csv` (For contracts)
- `best_outputs_comparison.csv` (For presentations)

---

## **How to Use Each Output File**

| File | Use Case | Best For |
|------|----------|----------|
| `best_outputs_daily_2026.csv` | **Primary forecast** | Daily operations, detailed analysis |
| `best_outputs_monthly_2026.csv` | **Monthly planning** | Budget planning, quarterly reviews |
| `best_outputs_annual_2026.csv` | **Contracts & agreements** | Board presentations, vendor negotiations |
| `best_outputs_comparison.csv` | **Stakeholder communication** | Reports, comparisons |
| `model_validation_report.json` | **Technical reference** | Model selection justification |

---

## **Troubleshooting**

### **Issue: ModuleNotFoundError in notebooks**

**Solution:** The notebooks have auto-install cells (first cell). Just run them:
```
Cell 1: Installer cell runs automatically
Cell 2+: Your analysis code
```

### **Issue: "File not found" error**

**Make sure you're running from the `/ml/` directory:**
```powershell
# Correct
cd c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml
python aggregate_forecasts.py

# Wrong (wrong directory)
cd c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH
python aggregate_forecasts.py  # ❌ Won't find files
```

### **Issue: Notebook runs but no output**

**Verify you have:** `energy_data_3_years.csv` in `/ml/` folder

### **Issue: Slow performance**

- LSTM and XGBoost may take 3-5 minutes each
- This is normal (neural network training)
- Don't interrupt or close the notebook

---

## **Next Steps After Running**

1. **Open `best_outputs_daily_2026.csv`** in Excel or any spreadsheet
2. **Use Solar_Mean column** for your final 2026 forecast
3. **Reference model_validation_report.json** for confidence metrics
4. **Share best_outputs_comparison.csv** with stakeholders

---

## **Questions?**

- **Which file to use?** → `best_outputs_daily_2026.csv` (recommended output)
- **Which model is best?** → Check `model_validation_report.json`
- **How confident?** → Look at 95% CI in validation report
- **For presentations?** → Use `best_outputs_annual_2026.csv`

---

**Happy forecasting! 🚀**
