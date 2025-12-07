// "use client";

// import { ArrowLeft, Wind, TrendingUp, Calendar, Zap, Gauge, BarChart3, Activity, Cloud, Target, ThermometerSun, ChevronDown, ChevronUp } from "lucide-react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";

// export default function WindPage() {
//   const [selectedDay, setSelectedDay] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "forecast">("overview");

//   const windData = {
//     current: 27,
//     peak: 52.3,
//     today: 432.8,
//     capacity: 150,
//     windSpeed: 6.2,
//     turbines: 12,
//     predictionAccuracy: 89.7,
//   };

//   const hourlyGeneration = [
//     { hour: "12 AM", generation: 18.2, speed: 5.1 },
//     { hour: "3 AM", generation: 22.5, speed: 5.8 },
//     { hour: "6 AM", generation: 28.3, speed: 6.5 },
//     { hour: "9 AM", generation: 32.8, speed: 7.2 },
//     { hour: "12 PM", generation: 27.6, speed: 6.3 },
//     { hour: "3 PM", generation: 35.4, speed: 7.8 },
//     { hour: "6 PM", generation: 42.1, speed: 8.9 },
//     { hour: "9 PM", generation: 38.5, speed: 8.2 },
//   ];

//   const maxGen = Math.max(...hourlyGeneration.map((h) => h.generation));

//   // Prediction vs Actual data for all 24 hours
//   const predictionVsActual = Array.from({ length: 24 }, (_, i) => ({
//     hour: `${i.toString().padStart(2, '0')}:00`,
//     predicted: Math.round(15 + Math.random() * 30 + Math.sin(i / 24 * Math.PI * 2) * 10),
//     actual: Math.round(14 + Math.random() * 30 + Math.sin(i / 24 * Math.PI * 2) * 10),
//     speed: (4 + Math.random() * 5 + Math.sin(i / 24 * Math.PI * 2) * 2).toFixed(1),
//   }));

//   // Wind speed vs Production correlation
//   const speedVsProduction = Array.from({ length: 24 }, (_, i) => ({
//     speed: (3 + i * 0.3).toFixed(1),
//     production: Math.round(10 + i * 2.5 + Math.random() * 5),
//   }));

//   // 7-Day Forecast with 24 hourly predictions per day
//   const weeklyForecast = Array.from({ length: 7 }, (_, dayIndex) => ({
//     day: dayIndex + 1,
//     date: `Dec ${4 + dayIndex}`,
//     dayName: ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"][dayIndex],
//     total: Math.round(380 + Math.random() * 120),
//     peak: Math.round(40 + Math.random() * 15),
//     weather: ["Windy", "Breezy", "Calm", "Gusty", "Moderate", "Strong", "Light"][dayIndex],
//     avgSpeed: (5 + Math.random() * 3).toFixed(1),
//     hourly: Array.from({ length: 24 }, (_, hourIndex) => ({
//       hour: `${hourIndex.toString().padStart(2, '0')}:00`,
//       prediction: Math.round(15 + Math.random() * 25 + Math.sin(hourIndex / 24 * Math.PI * 2) * 8),
//       speed: (4 + Math.random() * 4 + Math.sin(hourIndex / 24 * Math.PI * 2) * 2).toFixed(1),
//     })),
//   }));

//   const maxPred = Math.max(...predictionVsActual.map(d => Math.max(d.predicted, d.actual)));
//   const maxSpeed = Math.max(...speedVsProduction.map(d => parseFloat(d.speed)));
//   const maxProd = Math.max(...speedVsProduction.map(d => d.production));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/20 py-10 px-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Back Button */}
//         <Link
//           href="/campusAdmin/dashboard"
//           className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Dashboard
//         </Link>

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <div className="flex items-center gap-4 mb-4">
//             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
//               <Wind className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
//                 Wind Generation
//               </h1>
//               <p className="text-muted-foreground mt-1">Wind turbine performance and wind speed analytics</p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Tab Navigation */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-border overflow-x-auto mb-8"
//         >
//           <button
//             onClick={() => setActiveTab("overview")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
//               activeTab === "overview"
//                 ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
//                 : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
//             }`}
//           >
//             <Activity className="h-4 w-4" />
//             Overview
//           </button>
//           <button
//             onClick={() => setActiveTab("predictions")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
//               activeTab === "predictions"
//                 ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
//                 : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
//             }`}
//           >
//             <BarChart3 className="h-4 w-4" />
//             Predictions
//           </button>
//           <button
//             onClick={() => setActiveTab("forecast")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
//               activeTab === "forecast"
//                 ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
//                 : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
//             }`}
//           >
//             <Cloud className="h-4 w-4" />
//             7-Day Forecast
//           </button>
//         </motion.div>

//         {/* Overview Tab */}
//         {activeTab === "overview" && (
//           <>
//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-6 shadow-xl text-white"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sky-100">Current Output</span>
//               <Zap className="h-5 w-5 text-sky-200" />
//             </div>
//             <div className="text-4xl font-bold">{windData.current} kW</div>
//             <div className="text-sky-100 text-sm mt-2">Wind speed: {windData.windSpeed} m/s</div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-sky-100 dark:border-sky-900"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-muted-foreground">Peak Today</span>
//               <TrendingUp className="h-5 w-5 text-sky-600" />
//             </div>
//             <div className="text-4xl font-bold text-sky-600">{windData.peak} kW</div>
//             <div className="text-sm text-muted-foreground mt-2">At 6:00 PM</div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-sky-100 dark:border-sky-900"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-muted-foreground">Today's Total</span>
//               <Calendar className="h-5 w-5 text-sky-600" />
//             </div>
//             <div className="text-4xl font-bold text-sky-600">{windData.today} kWh</div>
//             <div className="text-sm text-muted-foreground mt-2">Generated so far</div>
//           </motion.div>
//         </div>

//         {/* Hourly Generation Chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl mb-8 border border-border"
//         >
//           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//             <Gauge className="h-5 w-5 text-sky-600" />
//             Generation & Wind Speed Pattern
//           </h2>
//           <div className="space-y-4">
//             {hourlyGeneration.map((item, index) => (
//               <motion.div
//                 key={item.hour}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="text-sm font-medium">{item.hour}</div>
//                   <div className="text-xs text-muted-foreground">Wind: {item.speed} m/s</div>
//                 </div>
//                 <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${(item.generation / maxGen) * 100}%` }}
//                     transition={{ duration: 1, delay: 0.7 + index * 0.08, ease: "easeOut" }}
//                     className="h-full bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-end pr-3"
//                   >
//                     <span className="text-xs font-semibold text-white">{item.generation} kW</span>
//                   </motion.div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* System Info */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6"
//         >
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//             <div className="text-sm text-muted-foreground mb-2">System Capacity</div>
//             <div className="text-3xl font-bold text-sky-600 mb-3">{windData.capacity} kW</div>
//             <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
//               <div
//                 style={{ width: `${(windData.current / windData.capacity) * 100}%` }}
//                 className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
//               />
//             </div>
//             <div className="text-xs text-muted-foreground mt-2">
//               Currently at {((windData.current / windData.capacity) * 100).toFixed(1)}%
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//             <div className="text-sm text-muted-foreground mb-2">Average Wind Speed</div>
//             <div className="text-3xl font-bold text-sky-600">{windData.windSpeed} m/s</div>
//             <div className="text-xs text-muted-foreground mt-2">Optimal conditions</div>
//           </div>

//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//             <div className="text-sm text-muted-foreground mb-2">Active Turbines</div>
//             <div className="text-3xl font-bold text-sky-600">{windData.turbines}</div>
//             <div className="text-xs text-muted-foreground mt-2">All turbines operational</div>
//           </div>
//         </motion.div>
//           </>
//         )}

//         {/* Predictions Tab */}
//         {activeTab === "predictions" && (
//           <>
//             {/* Prediction Accuracy */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-xl text-white mb-8"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <Target className="h-5 w-5" />
//                     <span className="text-sm">Prediction Accuracy</span>
//                   </div>
//                   <div className="text-4xl font-bold">{windData.predictionAccuracy}%</div>
//                   <div className="text-sm text-green-100 mt-1">Based on last 30 days</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm text-green-100">Model Performance</div>
//                   <div className="text-2xl font-semibold">Excellent</div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Prediction vs Actual Chart */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border mb-8"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <Target className="h-5 w-5 text-sky-600" />
//                 24-Hour Prediction vs Actual Generation
//               </h2>
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {predictionVsActual.map((item, index) => (
//                   <motion.div
//                     key={item.hour}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: 0.4 + index * 0.02 }}
//                   >
//                     <div className="flex items-center justify-between mb-1">
//                       <div className="text-xs font-medium w-16">{item.hour}</div>
//                       <div className="text-xs text-muted-foreground">
//                         Pred: {item.predicted} kW | Actual: {item.actual} kW
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-5 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${(item.predicted / maxPred) * 100}%` }}
//                           transition={{ duration: 0.8, delay: 0.5 + index * 0.02, ease: "easeOut" }}
//                           className="h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-1"
//                         >
//                           <span className="text-xs font-semibold text-white">{item.predicted}</span>
//                         </motion.div>
//                       </div>
//                       <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-5 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${(item.actual / maxPred) * 100}%` }}
//                           transition={{ duration: 0.8, delay: 0.5 + index * 0.02, ease: "easeOut" }}
//                           className="h-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-end pr-1"
//                         >
//                           <span className="text-xs font-semibold text-white">{item.actual}</span>
//                         </motion.div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//               <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded" />
//                   <span className="text-sm text-muted-foreground">Predicted</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 bg-gradient-to-r from-sky-400 to-sky-600 rounded" />
//                   <span className="text-sm text-muted-foreground">Actual</span>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Wind Speed vs Production */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.5 }}
//               className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <Gauge className="h-5 w-5 text-sky-600" />
//                 Wind Speed vs Production Correlation
//               </h2>
//               <div className="space-y-3">
//                 {speedVsProduction.map((item, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: 0.6 + index * 0.03 }}
//                     className="flex items-center gap-4"
//                   >
//                     <div className="w-20 text-sm font-medium">{item.speed} m/s</div>
//                     <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${(item.production / maxProd) * 100}%` }}
//                         transition={{ duration: 1, delay: 0.7 + index * 0.03, ease: "easeOut" }}
//                         className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-end pr-3"
//                       >
//                         <span className="text-xs font-semibold text-white">{item.production} kW</span>
//                       </motion.div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </>
//         )}

//         {/* Forecast Tab */}
//         {activeTab === "forecast" && (
//           <>
//             {/* 7-Day Forecast Table */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-sky-600" />
//                 7-Day Wind Generation Forecast
//               </h2>
//               <div className="space-y-3">
//                 {weeklyForecast.map((day, index) => (
//                   <motion.div
//                     key={day.day}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
//                   >
//                     <button
//                       onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
//                       className="w-full bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 hover:from-sky-100 hover:to-blue-100 dark:hover:from-sky-900/20 dark:hover:to-blue-900/20 rounded-lg p-4 border border-sky-200 dark:border-sky-800 transition-all cursor-pointer"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className="text-left">
//                             <div className="font-semibold text-lg">{day.date}</div>
//                             <div className="text-sm text-muted-foreground">{day.dayName}</div>
//                           </div>
//                           <div className="text-sm px-3 py-1 bg-sky-200 dark:bg-sky-900/30 text-sky-800 dark:text-sky-400 rounded-full">
//                             {day.weather}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-6">
//                           <div className="text-right">
//                             <div className="text-sm text-muted-foreground">Expected Total</div>
//                             <div className="text-xl font-bold text-sky-600">{day.total} kWh</div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm text-muted-foreground">Peak</div>
//                             <div className="text-lg font-semibold text-sky-600">{day.peak} kW</div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm text-muted-foreground">Avg Speed</div>
//                             <div className="text-lg font-semibold">{day.avgSpeed} m/s</div>
//                           </div>
//                           {selectedDay === day.day ? (
//                             <ChevronUp className="h-5 w-5 text-sky-600" />
//                           ) : (
//                             <ChevronDown className="h-5 w-5 text-sky-600" />
//                           )}
//                         </div>
//                       </div>
//                     </button>

//                     {/* Hourly Breakdown - All 24 Hours */}
//                     <AnimatePresence>
//                       {selectedDay === day.day && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="overflow-hidden"
//                         >
//                           <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-sky-200 dark:border-sky-800">
//                             <h3 className="font-semibold mb-3 text-sm">24-Hour Forecast</h3>
//                             <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
//                               {day.hourly.map((hour, hIndex) => (
//                                 <motion.div
//                                   key={hour.hour}
//                                   initial={{ opacity: 0, scale: 0.9 }}
//                                   animate={{ opacity: 1, scale: 1 }}
//                                   transition={{ duration: 0.2, delay: hIndex * 0.02 }}
//                                   className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-border"
//                                 >
//                                   <div className="text-xs text-muted-foreground mb-1">{hour.hour}</div>
//                                   <div className="text-sm font-bold text-sky-600">{hour.prediction} kW</div>
//                                   <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                                     <Gauge className="h-3 w-3" />
//                                     {hour.speed} m/s
//                                   </div>
//                                 </motion.div>
//                               ))}
//                             </div>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { ArrowLeft, Wind, TrendingUp, Calendar, Zap, Gauge, BarChart3, Activity, Cloud, Target, ThermometerSun, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// --- Types ---
interface WindData {
  current: number;
  peak: number;
  today: number;
  capacity: number;
  windSpeed: number;
  turbines: number;
  predictionAccuracy: number;
}

interface HourlyData {
  hour: string;
  generation: number;
  speed: number;
}

interface PredictionData {
  hour: string;
  predicted: number;
  actual: number;
  speed: number;
}

interface SpeedCorrelation {
  speed: number;
  production: number;
}

interface ForecastDay {
  day: number;
  date: string;
  dayName: string;
  total: number;
  peak: number;
  weather: string;
  avgSpeed: number;
  hourly: { hour: string; prediction: number; speed: number }[];
}

export default function WindPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "forecast">("overview");
  
  // --- State Initialization ---
  const [loading, setLoading] = useState(true);
  const [windData, setWindData] = useState<WindData | null>(null);
  const [hourlyGeneration, setHourlyGeneration] = useState<HourlyData[]>([]);
  const [predictionVsActual, setPredictionVsActual] = useState<PredictionData[]>([]);
  const [speedVsProduction, setSpeedVsProduction] = useState<SpeedCorrelation[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<ForecastDay[]>([]);

  // --- Fetch Data ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/wind-data");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setWindData(data.windData);
        setHourlyGeneration(data.hourlyGeneration);
        setPredictionVsActual(data.predictionVsActual);
        setSpeedVsProduction(data.speedVsProduction);
        setWeeklyForecast(data.weeklyForecast);
      } catch (error) {
        console.error("Error fetching wind data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          <p className="text-sky-600 font-medium">Loading wind data...</p>
        </div>
      </div>
    );
  }

  if (!windData) return <div className="p-10 text-center">No wind data found.</div>;

  const maxGen = Math.max(...hourlyGeneration.map((h) => h.generation), 1);
  const maxPred = Math.max(...predictionVsActual.map(d => Math.max(d.predicted, d.actual)), 1);
  const maxProd = Math.max(...speedVsProduction.map(d => d.production), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/20 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/campusAdmin/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
              <Wind className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
                Wind Generation
              </h1>
              <p className="text-muted-foreground mt-1">Wind turbine performance and wind speed analytics</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-border overflow-x-auto mb-8"
        >
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Activity className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("predictions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === "predictions"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Predictions
          </button>
          <button
            onClick={() => setActiveTab("forecast")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === "forecast"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Cloud className="h-4 w-4" />
            7-Day Forecast
          </button>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-6 shadow-xl text-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sky-100">Current Output</span>
                  <Zap className="h-5 w-5 text-sky-200" />
                </div>
                <div className="text-4xl font-bold">{windData.current} kW</div>
                <div className="text-sky-100 text-sm mt-2">Wind speed: {windData.windSpeed} m/s</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-sky-100 dark:border-sky-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Peak Today</span>
                  <TrendingUp className="h-5 w-5 text-sky-600" />
                </div>
                <div className="text-4xl font-bold text-sky-600">{windData.peak} kW</div>
                <div className="text-sm text-muted-foreground mt-2">At 6:00 PM</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-sky-100 dark:border-sky-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Today's Total</span>
                  <Calendar className="h-5 w-5 text-sky-600" />
                </div>
                <div className="text-4xl font-bold text-sky-600">{windData.today} kWh</div>
                <div className="text-sm text-muted-foreground mt-2">Generated so far</div>
              </motion.div>
            </div>

            {/* Hourly Generation Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl mb-8 border border-border"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-sky-600" />
                Generation & Wind Speed Pattern
              </h2>
              <div className="space-y-4">
                {hourlyGeneration.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{item.hour}</div>
                      <div className="text-xs text-muted-foreground">Wind: {item.speed} m/s</div>
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.generation / maxGen) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.08, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-end pr-3"
                      >
                        <span className="text-xs font-semibold text-white">{item.generation} kW</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* System Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <div className="text-sm text-muted-foreground mb-2">System Capacity</div>
                <div className="text-3xl font-bold text-sky-600 mb-3">{windData.capacity} kW</div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    style={{ width: `${(windData.current / windData.capacity) * 100}%` }}
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Currently at {((windData.current / windData.capacity) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <div className="text-sm text-muted-foreground mb-2">Average Wind Speed</div>
                <div className="text-3xl font-bold text-sky-600">{windData.windSpeed} m/s</div>
                <div className="text-xs text-muted-foreground mt-2">Optimal conditions</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <div className="text-sm text-muted-foreground mb-2">Active Turbines</div>
                <div className="text-3xl font-bold text-sky-600">{windData.turbines}</div>
                <div className="text-xs text-muted-foreground mt-2">All turbines operational</div>
              </div>
            </motion.div>
          </>
        )}

        {/* Predictions Tab */}
        {activeTab === "predictions" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-xl text-white mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5" />
                    <span className="text-sm">Prediction Accuracy</span>
                  </div>
                  <div className="text-4xl font-bold">{windData.predictionAccuracy}%</div>
                  <div className="text-sm text-green-100 mt-1">Based on last 30 days</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-100">Model Performance</div>
                  <div className="text-2xl font-semibold">Excellent</div>
                </div>
              </div>
            </motion.div>

            {/* Prediction vs Actual Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border mb-8"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-sky-600" />
                Prediction vs Actual Generation
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {predictionVsActual.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.02 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium w-16">{item.hour}</div>
                      <div className="text-xs text-muted-foreground">
                        Pred: {item.predicted} kW | Actual: {item.actual} kW
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.predicted / maxPred) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + index * 0.02, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-1"
                        >
                          <span className="text-xs font-semibold text-white">{item.predicted}</span>
                        </motion.div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.actual / maxPred) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + index * 0.02, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-end pr-1"
                        >
                          <span className="text-xs font-semibold text-white">{item.actual}</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Wind Speed vs Production */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-sky-600" />
                Wind Speed vs Production Correlation
              </h2>
              <div className="space-y-3">
                {speedVsProduction.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.03 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-20 text-sm font-medium">{item.speed} m/s</div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.production / maxProd) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.03, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-end pr-3"
                      >
                        <span className="text-xs font-semibold text-white">{item.production} kW</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Forecast Tab */}
        {activeTab === "forecast" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sky-600" />
                7-Day Wind Generation Forecast
              </h2>
              <div className="space-y-3">
                {weeklyForecast.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
                      className="w-full bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 hover:from-sky-100 hover:to-blue-100 dark:hover:from-sky-900/20 dark:hover:to-blue-900/20 rounded-lg p-4 border border-sky-200 dark:border-sky-800 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <div className="font-semibold text-lg">{day.date}</div>
                            <div className="text-sm text-muted-foreground">{day.dayName}</div>
                          </div>
                          <div className="text-sm px-3 py-1 bg-sky-200 dark:bg-sky-900/30 text-sky-800 dark:text-sky-400 rounded-full">
                            {day.weather}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Expected Total</div>
                            <div className="text-xl font-bold text-sky-600">{day.total} kWh</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Peak</div>
                            <div className="text-lg font-semibold text-sky-600">{day.peak} kW</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Avg Speed</div>
                            <div className="text-lg font-semibold">{day.avgSpeed} m/s</div>
                          </div>
                          {selectedDay === day.day ? (
                            <ChevronUp className="h-5 w-5 text-sky-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-sky-600" />
                          )}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {selectedDay === day.day && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-sky-200 dark:border-sky-800">
                            <h3 className="font-semibold mb-3 text-sm">24-Hour Forecast</h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
                              {day.hourly.map((hour, hIndex) => (
                                <motion.div
                                  key={hIndex}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2, delay: hIndex * 0.02 }}
                                  className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-border"
                                >
                                  <div className="text-xs text-muted-foreground mb-1">{hour.hour}</div>
                                  <div className="text-sm font-bold text-sky-600">{hour.prediction} kW</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Gauge className="h-3 w-3" />
                                    {hour.speed} m/s
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}