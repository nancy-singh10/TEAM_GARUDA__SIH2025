# Quick Start Guide - Run Everything & Get Your Best Forecast

## **You're Almost Done! Just 3 Simple Steps:**

---

## **Step 1: Open the Best Forecast File**

### **File Location:**
```
c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml\best_model_forecast_2026.csv
```

### **Option A: Open in Excel**
1. Go to folder: `c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml\`
2. Double-click: `best_model_forecast_2026.csv`
3. Open with: Excel (or any spreadsheet app)

### **Option B: Open in VS Code**
1. Open VS Code
2. File > Open File
3. Navigate to the file above
4. View in spreadsheet preview

---

## **What You Have:**

### **Column 1: Date**
- Dates from 2026-01-01 to 2026-12-31 (365 days)

### **Column 2: Solar_Energy_Forecast_2026_kWh** ⭐ **USE THIS!**
- The **best model forecast** (Ensemble method)
- Daily solar energy prediction in kWh
- Most accurate and stable

### **Column 3: Solar_Consensus_Mean_kWh**
- Average of all 4 models
- For comparison/verification

### **Column 4: Solar_Min_kWh**
- Lowest prediction across models
- Conservative estimate

### **Column 5: Solar_Max_kWh**
- Highest prediction across models
- Optimistic estimate

### **Column 6: Solar_Std_kWh**
- Uncertainty/variability between models
- Low = high confidence, High = low confidence

---

## **Step 2: Use the Forecast**

### **For Daily Planning:**
```
Use: Solar_Energy_Forecast_2026_kWh
```
This is your primary forecast column.

### **For Risk Assessment:**
```
Conservative Estimate = Solar_Energy_Forecast_2026_kWh - Solar_Std_kWh
Optimistic Estimate = Solar_Energy_Forecast_2026_kWh + Solar_Std_kWh
```

### **For Monthly Planning:**
Look at the monthly aggregates section below ⬇️

---

## **Step 3: Reference Information**

### **Annual Total:**
📊 **3,041.66 MWh for 2026**

### **Monthly Breakdown:**

| Month | Daily Avg | Monthly Total |
|-------|-----------|---------------|
| January | 7.63 kWh | 236.5 MWh |
| February | 7.94 kWh | 222.4 MWh |
| March | 8.34 kWh | 258.4 MWh |
| April | 8.73 kWh | 261.9 MWh |
| **May** | **9.08 kWh** | **281.6 MWh** |
| **June** | **9.20 kWh** | **276.1 MWh** |
| **July** | **9.17 kWh** | **284.3 MWh** |
| August | 8.84 kWh | 274.0 MWh |
| September | 8.32 kWh | 249.6 MWh |
| October | 7.90 kWh | 244.8 MWh |
| November | 7.52 kWh | 225.7 MWh |
| December | 7.30 kWh | 226.2 MWh |

**Peak months:** May, June, July
**Lowest months:** January, February, December

---

## **How the Forecast Was Generated**

### **4 Different Models Were Tested:**
1. ✅ **Ensemble** (4-method weighted average) — **BEST**
2. XGBoost (machine learning with features)
3. LSTM (deep learning neural network)
4. Prophet (Facebook statistical model)

### **Selection Criteria:**
- **Accuracy** (RMSE): Ensemble won with 0.4362
- **Stability** (CV): Ensemble at 7.94%
- **Consistency** (MAE): Ensemble at 0.4304

---

## **What You Can Do Now:**

### ✅ **For Reports:**
Copy the CSV file to your reporting tool (Power BI, Tableau, etc.)

### ✅ **For Excel Analysis:**
- Create pivot tables by month
- Generate charts and graphs
- Compare with actual data later

### ✅ **For Dashboards:**
Import into any dashboard system using the CSV format

### ✅ **For Forecasting/Planning:**
Use the daily values for capacity planning, resource allocation, contracts

### ✅ **For Decision Making:**
- Use Min/Max columns for scenario planning
- Use Std column for confidence assessment
- Monthly totals for budget allocation

---

## **Want to Run Everything Again?**

If you need to regenerate the forecast:

```powershell
# Navigate to ml folder
cd c:\Users\NANCY_SINGH\Documents\sih\clonesih\TeamGaruda-SIH\ml

# Run the best output script
python find_best_output.py
```

This will regenerate:
- `best_model_forecast_2026.csv` (main forecast)
- `best_model_report.json` (detailed metrics)

---

## **Files You Have:**

### **Main Forecast (USE THIS):**
- `best_model_forecast_2026.csv` ⭐

### **All Models Combined:**
- `all_models_forecast_2026.csv`

### **Validation Report:**
- `best_model_report.json`

### **Individual Models (if needed):**
- `solar_energy_forecast_2026.csv` (Ensemble)
- `prophet_forecast_2026.csv` (Prophet)
- `lstm_forecast_2026.csv` (LSTM)
- `xgboost_forecast_2026.csv` (XGBoost)

---

## **Summary**

| Item | Details |
|------|---------|
| **File to Use** | `best_model_forecast_2026.csv` |
| **Column to Use** | `Solar_Energy_Forecast_2026_kWh` |
| **Best Model** | Ensemble (4-method weighted average) |
| **Annual Total** | 3,041.66 MWh |
| **Daily Average** | 8.33 kWh |
| **Confidence** | HIGH (RMSE: 0.4362) |
| **Ready for** | Reports, dashboards, planning, contracts |

---

**Your 2026 energy forecast is ready to use! 🚀**

Questions? Check the individual model notebooks or validation report.
