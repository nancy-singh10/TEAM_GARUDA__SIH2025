"use client"

import type React from "react"
import { useState } from "react"
import { Battery, ChevronLeft, ChevronRight, CloudSun, Home, PlugZap, Sun, Zap, Wind, AlertCircle, CheckCircle2, X, TrendingUp, Droplets, Gauge, Clock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const timeframeOptions = ["day", "month", "year", "lifetime"] as const

const plantDetails = [
  { label: "Installed Capacity", value: "70.00 kWp" },
  { label: "Weather", value: "30 °C, clear sky" },
  { label: "Site", value: "Deys, Street 1, City 2, Germany" },
  { label: "Last update", value: "2024-05-30 23:53:59 (UTC+1)" },
]

const plantData = [
  { label: "PV yield", value: "44.7 kW", sub: "Live inverter reading" },
  { label: "Grid import", value: "42.39 kW", sub: "Reduced vs peak" },
  { label: "Battery reserve", value: "77% / 0.18 kW", sub: "Discharge limited" },
  { label: "Facility load", value: "46.05 kW", sub: "Campus demand" },
]

const solarUtilization = [
  { label: "Self-consumption", value: "64%", delta: "+6% vs yesterday" },
  { label: "Exported to grid", value: "18%", delta: "−3% vs avg" },
  { label: "Battery cycling", value: "22.4 kWh", delta: "+1.2 kWh today" },
  { label: "Carbon avoided", value: "1.6 tCO₂e", delta: "+0.2 this week" },
]

// Solar Details Modal Component
function SolarDetailsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-background shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg border border-border bg-background p-2 hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                <Sun className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "4s" }} />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Solar Panel System</h1>
                <p className="text-muted-foreground mt-1">Real-time performance analytics</p>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Current Output</p>
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-yellow-600">44.7 kW</p>
                <p className="text-xs text-muted-foreground mt-2">Peak: 70 kWp</p>
                <div className="mt-3 w-full bg-yellow-200/30 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "64%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <Gauge className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">94.2%</p>
                <p className="text-xs text-muted-foreground mt-2">System health</p>
                <div className="mt-3 w-full bg-blue-200/30 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Today's Yield</p>
                  <Sun className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600">104 kWh</p>
                <p className="text-xs text-muted-foreground mt-2">Energy produced</p>
                <div className="mt-3 w-full bg-green-200/30 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600">99.8%</p>
                <p className="text-xs text-muted-foreground mt-2">System availability</p>
                <div className="mt-3 w-full bg-purple-200/30 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "99%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="details">Technical Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">All Systems Operational</p>
                        <p className="text-sm text-muted-foreground">No faults detected</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">Active</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Panel Count</p>
                      <p className="text-2xl font-bold">140 units</p>
                      <p className="text-xs text-muted-foreground mt-1">500W each</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Total Area</p>
                      <p className="text-2xl font-bold">280 m²</p>
                      <p className="text-xs text-muted-foreground mt-1">Roof mounted</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Inverter Type</p>
                      <p className="text-2xl font-bold">3-Phase</p>
                      <p className="text-xs text-muted-foreground mt-1">70 kW capacity</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Installation Date</p>
                      <p className="text-2xl font-bold">2022</p>
                      <p className="text-xs text-muted-foreground mt-1">2+ years active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* Pie Chart */}
                    <div className="flex items-center justify-center">
                      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="60" strokeDasharray="45 314" className="text-yellow-500" strokeDashoffset="0" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="60" strokeDasharray="87.92 314" className="text-orange-500" strokeDashoffset="-45" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="60" strokeDasharray="35.2 314" className="text-yellow-600" strokeDashoffset="-132.92" />
                        <circle cx="100" cy="100" r="50" fill="currentColor" className="text-background" />
                        <text x="100" y="105" textAnchor="middle" className="text-sm font-bold fill-foreground">104 kWh</text>
                      </svg>
                    </div>

                    {/* Legend */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <div>
                          <p className="font-medium">Morning (6AM - 12PM)</p>
                          <p className="text-sm text-muted-foreground">32 kWh (30.8%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                        <div>
                          <p className="font-medium">Afternoon (12PM - 6PM)</p>
                          <p className="text-sm text-muted-foreground">56 kWh (53.8%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                        <div>
                          <p className="font-medium">Evening (6PM - 9PM)</p>
                          <p className="text-sm text-muted-foreground">16 kWh (15.4%)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Energy Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, idx) => {
                      const values = [102, 98, 105, 101, 99, 107, 103]
                      const value = values[idx]
                      const percentage = (value / 107) * 100
                      return (
                        <div key={day}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium w-20">{day}</p>
                            <div className="flex-1 mx-4 bg-muted rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-sm font-semibold text-right w-16">{value} kWh</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Energy Distribution by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* Donut Chart */}
                    <div className="flex items-center justify-center">
                      <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-lg">
                        <circle cx="110" cy="110" r="90" fill="none" stroke="currentColor" strokeWidth="50" strokeDasharray="141.3 314" className="text-yellow-500" />
                        <circle cx="110" cy="110" r="90" fill="none" stroke="currentColor" strokeWidth="50" strokeDasharray="98.1 314" className="text-blue-500" strokeDashoffset="-141.3" />
                        <circle cx="110" cy="110" r="90" fill="none" stroke="currentColor" strokeWidth="50" strokeDasharray="74.6 314" className="text-pink-500" strokeDashoffset="-239.4" />
                        <circle cx="110" cy="110" r="50" fill="currentColor" className="text-background" />
                        <text x="110" y="110" textAnchor="middle" dy="0.3em" className="text-xs font-bold fill-foreground">Today</text>
                      </svg>
                    </div>

                    {/* Legend */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <div>
                          <p className="font-medium">Solar Generation</p>
                          <p className="text-sm text-muted-foreground">44.7 kW (45%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <div>
                          <p className="font-medium">Grid Import</p>
                          <p className="text-sm text-muted-foreground">31.2 kW (31%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                        <div>
                          <p className="font-medium">Battery Discharge</p>
                          <p className="text-sm text-muted-foreground">23.8 kW (24%)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Solar Prediction for Next 7 Days
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Next Day Prediction */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-muted-foreground mb-2">Tomorrow (Dec 2, 2025)</p>
                      <p className="text-3xl font-bold text-blue-600 mb-2">112 kWh</p>
                      <p className="text-sm text-muted-foreground mb-3">Predicted energy production</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Confidence</span>
                          <span className="font-semibold">92%</span>
                        </div>
                        <div className="w-full bg-blue-200/30 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Based on weather forecast & historical data</p>
                    </div>

                    {/* Solar Capacity Needed */}
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-muted-foreground mb-2">Additional Capacity Needed</p>
                      <p className="text-3xl font-bold text-green-600 mb-2">+8 kWp</p>
                      <p className="text-sm text-muted-foreground mb-3">To meet peak demand</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Current: 70 kWp</span>
                          <span className="font-semibold">Recommended: 78 kWp</span>
                        </div>
                        <div className="w-full bg-green-200/30 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Forecast Chart */}
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">7-Day Energy Production Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { day: "Tomorrow (Dec 2)", forecast: 112, confidence: 92, weather: "Sunny" },
                          { day: "Dec 3", forecast: 108, confidence: 88, weather: "Partly Cloudy" },
                          { day: "Dec 4", forecast: 95, confidence: 85, weather: "Cloudy" },
                          { day: "Dec 5", forecast: 118, confidence: 90, weather: "Sunny" },
                          { day: "Dec 6", forecast: 105, confidence: 87, weather: "Partly Cloudy" },
                          { day: "Dec 7", forecast: 115, confidence: 91, weather: "Sunny" },
                          { day: "Dec 8", forecast: 110, confidence: 86, weather: "Partly Cloudy" },
                        ].map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{item.day}</p>
                                <p className="text-xs text-muted-foreground">{item.weather}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{item.forecast} kWh</p>
                                <p className="text-xs text-muted-foreground">{item.confidence}% confidence</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full" 
                                  style={{ width: `${(item.forecast / 120) * 100}%` }}
                                ></div>
                              </div>
                              <div className="w-12 bg-muted rounded-full h-3 overflow-hidden">
                                <div 
                                  className="bg-blue-500 h-3 rounded-full" 
                                  style={{ width: `${item.confidence}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Recommendations for Next Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                        <div>
                          <p className="font-medium text-sm">Expand Solar Capacity</p>
                          <p className="text-xs text-muted-foreground">Add 8-10 kWp panels to meet projected demand growth</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                        <div>
                          <p className="font-medium text-sm">Optimize Battery Scheduling</p>
                          <p className="text-xs text-muted-foreground">Charge battery during peak solar hours (11AM-3PM) on Dec 2, 5, 7</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                        <div>
                          <p className="font-medium text-sm">Monitor Weather Patterns</p>
                          <p className="text-xs text-muted-foreground">Dec 4 shows cloudy conditions - prepare grid backup</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                        <div>
                          <p className="font-medium text-sm">Plan Maintenance</p>
                          <p className="text-xs text-muted-foreground">Schedule panel cleaning on Dec 3 (cloudy day) for optimal performance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Capacity Planning */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capacity Planning Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Current System</p>
                          <p className="text-2xl font-bold">70 kWp</p>
                          <p className="text-xs text-muted-foreground mt-2">Meets 85% of demand</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                          <p className="text-sm text-muted-foreground mb-2">Recommended</p>
                          <p className="text-2xl font-bold text-blue-600">78 kWp</p>
                          <p className="text-xs text-muted-foreground mt-2">Meets 95% of demand</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Investment</p>
                          <p className="text-2xl font-bold">€6,400</p>
                          <p className="text-xs text-muted-foreground mt-2">For 8 kWp expansion</p>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">ROI Projection: 6.8 years with current energy prices</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-600" />
                        Panel Information
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span className="text-muted-foreground">Panel Type:</span> <span className="font-medium">Monocrystalline</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Wattage:</span> <span className="font-medium">500W per unit</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Efficiency:</span> <span className="font-medium">22.5%</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Temperature Coeff:</span> <span className="font-medium">-0.35%/°C</span></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        Inverter Information
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span className="text-muted-foreground">Model:</span> <span className="font-medium">SMA Tripower</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Capacity:</span> <span className="font-medium">70 kW</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Efficiency:</span> <span className="font-medium">98.5%</span></li>
                        <li className="flex justify-between"><span className="text-muted-foreground">Warranty:</span> <span className="font-medium">10 years</span></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-muted-foreground mb-2">CO₂ Avoided (Today)</p>
                      <p className="text-2xl font-bold text-green-600">45.8 kg</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-muted-foreground mb-2">CO₂ Avoided (Lifetime)</p>
                      <p className="text-2xl font-bold text-green-600">1,245 tCO₂e</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-muted-foreground mb-2">Trees Equivalent</p>
                      <p className="text-2xl font-bold text-blue-600">18,450</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

type FlowNode = {
  id: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  caption?: string
  badge?: string
  position: { top: string; left: string }
  delay?: number
}

const flowNodes: FlowNode[] = [
  // Top row - Energy Sources
  { id: "pv", icon: Sun, label: "PV", value: "4.47 kW", position: { top: "8%", left: "15%" }, delay: 0 },
  {
    id: "wind",
    icon: Wind,
    label: "Wind",
    value: "2.85 kW",
    position: { top: "8%", left: "50%" },
    delay: 100,
  },
  {
    id: "grid",
    icon: PlugZap,
    label: "Grid",
    value: "42.39 kW",
    position: { top: "8%", left: "85%" },
    delay: 200,
  },
  // Bottom row - Storage & Load
  {
    id: "battery",
    icon: Battery,
    label: "Battery",
    value: "0.18 kW",
    caption: "77%",
    position: { top: "75%", left: "18%" },
    delay: 300,
  },
  { id: "load", icon: Home, label: "Load", value: "46.05 kW", position: { top: "75%", left: "82%" }, delay: 400 },
]

function FlowNodeCard({ icon: Icon, label, value, caption, badge, id, onSunClick }: FlowNode & { onNodeClick?: (id: string) => void; onSunClick?: () => void }) {
  const [isActive, setIsActive] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  
  const isSun = label === "PV"
  const isWind = label === "Wind"
  const isBattery = label === "Battery"
  const isLoad = label === "Load"
  const isGrid = label === "Grid"
  
  const handleClick = () => {
    setIsActive(!isActive)
    setShowStatus(true)
    setTimeout(() => setShowStatus(false), 2000)
    
    // Open solar details modal on sun button click
    if (isSun && onSunClick) {
      onSunClick()
    }
  }
  
  return (
    <div className="relative">
      <style>{`
        @keyframes sunShine {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.8)) drop-shadow(0 0 16px rgba(234, 179, 8, 0.6)) drop-shadow(0 0 24px rgba(234, 179, 8, 0.4));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 16px rgba(234, 179, 8, 1)) drop-shadow(0 0 32px rgba(234, 179, 8, 0.9)) drop-shadow(0 0 48px rgba(234, 179, 8, 0.7)) drop-shadow(0 0 64px rgba(234, 179, 8, 0.5));
            transform: scale(1.15);
          }
        }
        
        @keyframes sunRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes windShine {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 16px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 24px rgba(59, 130, 246, 0.4));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 16px rgba(59, 130, 246, 1)) drop-shadow(0 0 32px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 48px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 64px rgba(59, 130, 246, 0.5));
            transform: scale(1.15);
          }
        }
        
        @keyframes windRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes batteryPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 16px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 24px rgba(34, 197, 94, 0.4));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 16px rgba(34, 197, 94, 1)) drop-shadow(0 0 32px rgba(34, 197, 94, 0.9)) drop-shadow(0 0 48px rgba(34, 197, 94, 0.7));
            transform: scale(1.12);
          }
        }

        @keyframes loadPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 16px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 24px rgba(168, 85, 247, 0.4));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 16px rgba(168, 85, 247, 1)) drop-shadow(0 0 32px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 48px rgba(168, 85, 247, 0.7));
            transform: scale(1.12);
          }
        }

        @keyframes gridPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 16px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 24px rgba(236, 72, 153, 0.4));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 16px rgba(236, 72, 153, 1)) drop-shadow(0 0 32px rgba(236, 72, 153, 0.9)) drop-shadow(0 0 48px rgba(236, 72, 153, 0.7));
            transform: scale(1.12);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .sun-icon {
          animation: ${isSun ? 'sunShine 1.5s ease-in-out infinite, sunRotate 4s linear infinite' : 'none'};
          transform-origin: center;
        }
        
        .wind-icon {
          animation: ${isWind ? 'windShine 1.5s ease-in-out infinite, windRotate 4s linear infinite' : 'none'};
          transform-origin: center;
        }

        .battery-icon {
          animation: ${isBattery && isActive ? 'batteryPulse 1.5s ease-in-out infinite' : 'none'};
          transform-origin: center;
        }

        .load-icon {
          animation: ${isLoad && isActive ? 'loadPulse 1.5s ease-in-out infinite' : 'none'};
          transform-origin: center;
        }

        .grid-icon {
          animation: ${isGrid && isActive ? 'gridPulse 1.5s ease-in-out infinite' : 'none'};
          transform-origin: center;
        }

        .node-card {
          animation: ${isActive ? 'bounce 0.6s ease-in-out' : 'none'};
        }

        .status-badge {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
      
      <button
        onClick={handleClick}
        className={`rounded-xl border transition-all duration-400 px-3.5 py-2.5 text-center shadow-md w-24 flex flex-col items-center justify-center gap-1 cursor-pointer group node-card backdrop-blur-sm ${
          isActive
            ? 'border-primary/60 bg-primary/8 shadow-lg shadow-primary/20 scale-105'
            : 'border-border/60 bg-background/80 hover:shadow-lg hover:scale-102 hover:border-border'
        }`}
      >
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 ${
          isSun 
            ? `border-yellow-400/40 bg-yellow-50/60 dark:bg-yellow-950/25 ${isActive ? 'border-yellow-500/70 bg-yellow-100/70 dark:bg-yellow-900/50 ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-500/20' : 'group-hover:border-yellow-500/60 group-hover:bg-yellow-100/60 dark:group-hover:bg-yellow-900/35'}` 
            : isWind
            ? `border-blue-400/40 bg-blue-50/60 dark:bg-blue-950/25 ${isActive ? 'border-blue-500/70 bg-blue-100/70 dark:bg-blue-900/50 ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/20' : 'group-hover:border-blue-500/60 group-hover:bg-blue-100/60 dark:group-hover:bg-blue-900/35'}`
            : isBattery
            ? `border-green-400/40 bg-green-50/60 dark:bg-green-950/25 ${isActive ? 'border-green-500/70 bg-green-100/70 dark:bg-green-900/50 ring-2 ring-green-400/50 shadow-lg shadow-green-500/20' : 'group-hover:border-green-500/60 group-hover:bg-green-100/60 dark:group-hover:bg-green-900/35'}`
            : isLoad
            ? `border-purple-400/40 bg-purple-50/60 dark:bg-purple-950/25 ${isActive ? 'border-purple-500/70 bg-purple-100/70 dark:bg-purple-900/50 ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/20' : 'group-hover:border-purple-500/60 group-hover:bg-purple-100/60 dark:group-hover:bg-purple-900/35'}`
            : isGrid
            ? `border-pink-400/40 bg-pink-50/60 dark:bg-pink-950/25 ${isActive ? 'border-pink-500/70 bg-pink-100/70 dark:bg-pink-900/50 ring-2 ring-pink-400/50 shadow-lg shadow-pink-500/20' : 'group-hover:border-pink-500/60 group-hover:bg-pink-100/60 dark:group-hover:bg-pink-900/35'}`
            : 'border-border/40 bg-muted/40'
        }`}>
          <Icon className={`h-4.5 w-4.5 transition-all duration-300 ${
            isSun ? 'text-yellow-500 sun-icon' 
            : isWind ? 'text-blue-500 wind-icon' 
            : isBattery ? 'text-green-500 battery-icon'
            : isLoad ? 'text-purple-500 load-icon'
            : isGrid ? 'text-pink-500 grid-icon'
            : 'text-primary'
          }`} />
        </div>
        <p className="text-xs font-bold leading-tight">{value}</p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/90">{label}</p>
        {caption && <p className="text-[9px] font-medium text-muted-foreground/80">{caption}</p>}
        {badge && (
          <span className="mt-0.5 inline-flex items-center justify-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
            {badge}
          </span>
        )}
      </button>

      {showStatus && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 status-badge">
          <div className="flex items-center gap-1 bg-green-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isActive ? 'Activated' : 'Deactivated'}
          </div>
        </div>
      )}
    </div>
  )
}

const flowPaths = [
  // Energy sources to inverter (top to middle)
  { id: "pv-path", d: "M 15 16 Q 28 32 40 48", direction: "down", label: "PV" },
  { id: "wind-path", d: "M 50 16 L 50 44", direction: "down", label: "Wind" },
  { id: "grid-path", d: "M 85 16 Q 72 32 60 48", direction: "down", label: "Grid" },
  
  // Inverter to storage (bidirectional - charge/discharge)
  { id: "battery-path", d: "M 42 56 Q 30 62 18 75", direction: "down", label: "Charge/Discharge" },
  
  // Inverter to load
  { id: "load-path", d: "M 58 56 Q 70 62 82 75", direction: "down", label: "Supply" },
]

const connectorDots: any[] = []

function PowerFlowDiagram({ onSunClick }: { onSunClick?: () => void }) {
  const [inverterActive, setInverterActive] = useState(false)
  const [showInverterStatus, setShowInverterStatus] = useState(false)

  const handleInverterClick = () => {
    setInverterActive(!inverterActive)
    setShowInverterStatus(true)
    setTimeout(() => setShowInverterStatus(false), 2000)
  }

  return (
    <div className="relative mx-auto aspect-[4/3] max-w-full overflow-hidden rounded-lg border border-border bg-background p-6">
      <style>{`
        @keyframes inverterPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 24px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 36px rgba(59, 130, 246, 0.5));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 1)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.95)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.6));
            transform: scale(1.15);
          }
        }

        @keyframes inverterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .inverter-icon {
          animation: ${inverterActive ? 'inverterPulse 1.5s ease-in-out infinite, inverterRotate 3s linear infinite' : 'none'};
          transform-origin: center;
        }

        .inverter-bounce {
          animation: ${inverterActive ? 'bounce 0.6s ease-in-out' : 'none'};
        }
      `}</style>

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--color-primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--color-primary))" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="flowGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="1" />
          </linearGradient>
          
          {/* Arrow markers for light theme */}
          <marker id="arrowLight" markerWidth="8" markerHeight="8" refX="7" refY="2.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,5 L7,2.5 z" fill="hsl(var(--color-primary))" />
          </marker>
          
          {/* Arrow markers for dark theme */}
          <marker id="arrowDark" markerWidth="8" markerHeight="8" refX="7" refY="2.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,5 L7,2.5 z" fill="rgb(34, 197, 94)" />
          </marker>
          
          {/* Filter for glow effect */}
          <filter id="glowLight">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowDark">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Flow paths */}
        {flowPaths.map((path, idx) => (
          <g key={path.id}>
            {/* Light theme - subtle background path */}
            <path
              d={path.d}
              fill="none"
              stroke="hsl(var(--color-primary))"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.04"
              className="dark:hidden"
            />
            {/* Dark theme - subtle background path */}
            <path
              d={path.d}
              fill="none"
              stroke="rgb(34, 197, 94)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.08"
              className="hidden dark:block"
            />
            
            {/* Light theme - main path */}
            <path
              d={path.d}
              fill="none"
              stroke="url(#flowGradient)"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#arrowLight)"
              className="dark:hidden"
              style={{
                filter: 'drop-shadow(0 0 1.2px hsl(var(--color-primary)))',
              }}
            />
            {/* Dark theme - main path */}
            <path
              d={path.d}
              fill="none"
              stroke="url(#flowGradientDark)"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#arrowDark)"
              className="hidden dark:block"
              style={{
                filter: 'drop-shadow(0 0 1.2px rgb(34, 197, 94))',
              }}
            />
            
            {/* Animated flow dot - light theme */}
            <circle r={0.6} fill="hsl(var(--color-primary))" className="dark:hidden" style={{ filter: 'drop-shadow(0 0 0.8px hsl(var(--color-primary)))' }}>
              <animateMotion
                dur={`${8 + idx * 0.6}s`}
                repeatCount="indefinite"
                keyTimes="0;1"
                keySplines="0.4 0 0.2 1"
                calcMode="spline"
                path={path.d}
              />
              <animate
                attributeName="r"
                values="0.6;0.95;0.6"
                dur={`${8 + idx * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.95;0.6"
                dur={`${8 + idx * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Animated flow dot - dark theme */}
            <circle r={0.6} fill="rgb(34, 197, 94)" className="hidden dark:block" style={{ filter: 'drop-shadow(0 0 0.8px rgb(34, 197, 94))' }}>
              <animateMotion
                dur={`${8 + idx * 0.6}s`}
                repeatCount="indefinite"
                keyTimes="0;1"
                keySplines="0.4 0 0.2 1"
                calcMode="spline"
                path={path.d}
              />
              <animate
                attributeName="r"
                values="0.6;0.95;0.6"
                dur={`${8 + idx * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.95;0.6"
                dur={`${8 + idx * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Energy source nodes (top row) */}
      {flowNodes.slice(0, 3).map((node) => (
        <div key={node.id} className="absolute" style={{ top: node.position.top, left: node.position.left, transform: 'translate(-50%, -50%)' }}>
          <FlowNodeCard {...node} onSunClick={onSunClick} />
        </div>
      ))}

      {/* Central Inverter - Interactive Button */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 relative z-10 flex items-center justify-center">
        <button
          onClick={handleInverterClick}
          className={`flex w-28 flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-400 px-3 py-2.5 text-center shadow-md inverter-bounce backdrop-blur-sm ${
            inverterActive
              ? 'border-blue-500/70 bg-blue-50/80 dark:bg-blue-950/40 shadow-lg shadow-blue-500/20 scale-110'
              : 'border-border/60 bg-background/80 hover:shadow-lg hover:scale-105 hover:border-blue-400/40'
          }`}
        >
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300 ${
            inverterActive
              ? 'border-blue-500/60 bg-blue-100/60 dark:bg-blue-900/50 ring-2 ring-blue-400/50'
              : 'border-blue-400/40 bg-blue-50/50 dark:bg-blue-950/20 group-hover:border-blue-500/60 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/40'
          }`}>
            <Zap className={`h-5 w-5 transition-all duration-300 ${
              inverterActive ? 'text-blue-600 inverter-icon' : 'text-primary'
            }`} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wide">Inverter</p>
        </button>

        {showInverterStatus && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 status-badge">
            <div className="flex items-center gap-1 bg-blue-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {inverterActive ? 'Activated' : 'Deactivated'}
            </div>
          </div>
        )}
      </div>

      {/* Storage & Load nodes (bottom row) */}
      {flowNodes.slice(3).map((node) => (
        <div key={node.id} className="absolute" style={{ top: node.position.top, left: node.position.left, transform: 'translate(-50%, -50%)' }}>
          <FlowNodeCard {...node} />
        </div>
      ))}
    </div>
  )
}

export default function VirtualPowerPlantPage() {
  const [showSolarModal, setShowSolarModal] = useState(false)

  return (
    <>
      <SolarDetailsModal isOpen={showSolarModal} onClose={() => setShowSolarModal(false)} />
      <main className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Virtual Power Plant</h1>
          <p className="text-muted-foreground">Campus orchestration overview</p>
        </header>

        {/* Power Flow Diagram - Top Section */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Power Flow</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <PowerFlowDiagram onSunClick={() => setShowSolarModal(true)} />
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid - Diagram on Left, Info on Right */}
        <section className="grid gap-6 md:grid-cols-3 mb-6">
          {/* Left Column - Timeframe and Additional Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue={timeframeOptions[0]}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
                  {timeframeOptions.map((option) => (
                    <TabsTrigger key={option} value={option} className="capitalize">
                      {option}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" aria-label="Previous day">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="rounded-lg border px-4 py-2 text-sm font-medium">2024-05-30</div>
                  <Button variant="ghost" size="icon" aria-label="Next day">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {timeframeOptions.map((option) => (
                <TabsContent key={option} value={option} className="sr-only">
                  {option}
                </TabsContent>
              ))}
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Plant Data</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-4">
                  {/* PV Yield */}
                  <div className="rounded-lg border p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <p className="text-xs font-medium text-muted-foreground">PV Yield</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Live reading</p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">44.7 kW</p>
                    <div className="mt-2 w-full bg-yellow-200/30 dark:bg-yellow-900/30 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "64%" }}></div>
                    </div>
                  </div>

                  {/* Grid Import */}
                  <div className="rounded-lg border p-3 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PlugZap className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        <p className="text-xs font-medium text-muted-foreground">Grid Import</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Reduced vs peak</p>
                    </div>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">42.39 kW</p>
                    <div className="mt-2 w-full bg-pink-200/30 dark:bg-pink-900/30 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: "61%" }}></div>
                    </div>
                  </div>

                  {/* Battery Reserve */}
                  <div className="rounded-lg border p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <p className="text-xs font-medium text-muted-foreground">Battery Reserve</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Discharge limited</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">77%</p>
                    <p className="text-sm text-muted-foreground">0.18 kW</p>
                    <div className="mt-2 w-full bg-green-200/30 dark:bg-green-900/30 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "77%" }}></div>
                    </div>
                  </div>

                  {/* Facility Load */}
                  <div className="rounded-lg border p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-xs font-medium text-muted-foreground">Facility Load</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Campus demand</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">46.05 kW</p>
                    <div className="mt-2 w-full bg-purple-200/30 dark:bg-purple-900/30 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "66%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - System Information */}
          <div className="space-y-6">
            {/* Installed Capacity Gauge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Installed Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${(70 / 100) * 314} 314`}
                        className="text-yellow-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <p className="text-3xl font-bold text-yellow-500">70</p>
                      <p className="text-xs text-muted-foreground">kWp</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">System Capacity at 100%</p>
                </div>
              </CardContent>
            </Card>

            {/* Weather Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-blue-500" />
                  Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gradient-to-b from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                      <Sun className="h-12 w-12 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-500">30°C</p>
                  <p className="text-sm text-muted-foreground mt-2">Clear Sky</p>
                  <div className="mt-4 w-full bg-muted rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="text-lg font-semibold">65%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Site Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-green-500" />
                  Site Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Home className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm font-semibold">Deye, Street 1</p>
                      <p className="text-xs text-muted-foreground">City 2, Germany</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Update</p>
                      <p className="text-sm font-semibold">2024-05-30</p>
                      <p className="text-xs text-muted-foreground">23:55:39 UTC+1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>
    </>
  )
}