"use client";

import { FileDown, Download, Calendar, Filter, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

export default function ExportReportPage() {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [reportType, setReportType] = useState("comprehensive");

  const reportTypes = [
    { id: "comprehensive", name: "Comprehensive Energy Report", icon: Zap },
    { id: "consumption", name: "Consumption Analysis", icon: TrendingUp },
    { id: "savings", name: "Cost Savings Report", icon: TrendingDown },
    { id: "renewable", name: "Renewable Energy Stats", icon: Zap },
  ];

  const handleExport = (format: string) => {
    // TODO: Implement actual export logic
    alert(`Exporting ${reportType} report as ${format.toUpperCase()} for ${dateRange}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
            Export Energy Reports
          </h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive energy analytics reports
          </p>
        </div>

        {/* Report Configuration Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Filter className="h-5 w-5 text-green-500" />
            Configure Report
          </h2>

          {/* Date Range Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="last-year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Report Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Report Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border transition-all
                      ${
                        reportType === type.id
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow-lg shadow-green-500/30"
                          : "bg-card border-border hover:border-green-500 hover:shadow-md"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Format Buttons */}
          <div>
            <label className="block text-sm font-medium mb-3">Export Format</label>
            <div className="flex flex-wrap gap-3">
              {["PDF", "Excel", "CSV", "JSON"].map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all shadow-green-500/30"
                >
                  <Download className="h-4 w-4" />
                  Export as {format}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Preview */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Report Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
              <div className="text-sm text-muted-foreground mb-1">Total Energy</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                12,450 kWh
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
              <div className="text-sm text-muted-foreground mb-1">Cost Savings</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹18,675
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
              <div className="text-sm text-muted-foreground mb-1">Renewable %</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                82.6%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
