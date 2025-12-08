// "use client";

// import { ArrowLeft, Sun, TrendingUp, Calendar, Zap, CloudSun, ThermometerSun, Target, ChevronDown, ChevronUp, BarChart3, Activity, Cloud, Battery } from "lucide-react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";

// export default function SolarPage() {
//   const [selectedDay, setSelectedDay] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "forecast">("overview");

//   const solarData = {
//     current: 24.32,
//     peak: 45.8,
//     today: 156.4,
//     capacity: 200,
//     efficiency: 87.3,
//     panels: 180,
//     predictionAccuracy: 92.4,
//   };

//   const hourlyGeneration = [
//     { hour: "6 AM", generation: 2.5 },
//     { hour: "7 AM", generation: 8.3 },
//     { hour: "8 AM", generation: 15.6 },
//     { hour: "9 AM", generation: 24.2 },
//     { hour: "10 AM", generation: 32.8 },
//     { hour: "11 AM", generation: 40.5 },
//     { hour: "12 PM", generation: 45.8 },
//     { hour: "1 PM", generation: 44.2 },
//     { hour: "2 PM", generation: 38.6 },
//     { hour: "3 PM", generation: 28.4 },
//     { hour: "4 PM", generation: 18.2 },
//     { hour: "5 PM", generation: 9.5 },
//     { hour: "6 PM", generation: 3.2 },
//   ];

//   // Prediction vs Actual data
//   const predictionVsActual = [
//     { hour: "6 AM", predicted: 2.8, actual: 2.5, temp: 18 },
//     { hour: "7 AM", predicted: 8.0, actual: 8.3, temp: 20 },
//     { hour: "8 AM", predicted: 15.2, actual: 15.6, temp: 22 },
//     { hour: "9 AM", predicted: 23.5, actual: 24.2, temp: 25 },
//     { hour: "10 AM", predicted: 32.0, actual: 32.8, temp: 28 },
//     { hour: "11 AM", predicted: 39.8, actual: 40.5, temp: 31 },
//     { hour: "12 PM", predicted: 45.0, actual: 45.8, temp: 33 },
//     { hour: "1 PM", predicted: 44.8, actual: 44.2, temp: 34 },
//     { hour: "2 PM", predicted: 39.2, actual: 38.6, temp: 33 },
//     { hour: "3 PM", predicted: 28.8, actual: 28.4, temp: 31 },
//     { hour: "4 PM", predicted: 18.5, actual: 18.2, temp: 29 },
//     { hour: "5 PM", predicted: 9.2, actual: 9.5, temp: 26 },
//     { hour: "6 PM", predicted: 3.0, actual: 3.2, temp: 23 },
//   ];

//   // Temperature vs Production correlation
//   const tempVsProduction = [
//     { temp: 18, production: 2.5 },
//     { temp: 20, production: 8.3 },
//     { temp: 22, production: 15.6 },
//     { temp: 25, production: 24.2 },
//     { temp: 28, production: 32.8 },
//     { temp: 31, production: 40.5 },
//     { temp: 33, production: 45.8 },
//     { temp: 34, production: 44.2 },
//     { temp: 33, production: 38.6 },
//     { temp: 31, production: 28.4 },
//     { temp: 29, production: 18.2 },
//     { temp: 26, production: 9.5 },
//     { temp: 23, production: 3.2 },
//   ];

//   // Next 7 days forecast
//   const weeklyForecast = [
//     {
//       day: 0,
//       date: "Dec 4",
//       dayName: "Wednesday",
//       total: 168.5,
//       peak: 47.2,
//       weather: "Sunny",
//       temp: 32,
//       hourly: [
//         { hour: "6 AM", prediction: 2.9, temp: 19 },
//         { hour: "7 AM", prediction: 8.5, temp: 21 },
//         { hour: "8 AM", prediction: 16.2, temp: 24 },
//         { hour: "9 AM", prediction: 25.1, temp: 27 },
//         { hour: "10 AM", prediction: 34.2, temp: 29 },
//         { hour: "11 AM", prediction: 42.3, temp: 31 },
//         { hour: "12 PM", prediction: 47.2, temp: 32 },
//         { hour: "1 PM", prediction: 46.8, temp: 32 },
//         { hour: "2 PM", prediction: 41.5, temp: 31 },
//         { hour: "3 PM", prediction: 30.2, temp: 30 },
//         { hour: "4 PM", prediction: 19.5, temp: 28 },
//         { hour: "5 PM", prediction: 10.1, temp: 25 },
//         { hour: "6 PM", prediction: 3.5, temp: 22 },
//       ],
//     },
//     {
//       day: 1,
//       date: "Dec 5",
//       dayName: "Thursday",
//       total: 155.2,
//       peak: 43.8,
//       weather: "Partly Cloudy",
//       temp: 30,
//       hourly: [
//         { hour: "6 AM", prediction: 2.6, temp: 18 },
//         { hour: "7 AM", prediction: 7.8, temp: 20 },
//         { hour: "8 AM", prediction: 14.9, temp: 23 },
//         { hour: "9 AM", prediction: 23.2, temp: 26 },
//         { hour: "10 AM", prediction: 31.8, temp: 28 },
//         { hour: "11 AM", prediction: 39.5, temp: 30 },
//         { hour: "12 PM", prediction: 43.8, temp: 30 },
//         { hour: "1 PM", prediction: 43.2, temp: 30 },
//         { hour: "2 PM", prediction: 38.1, temp: 29 },
//         { hour: "3 PM", prediction: 27.5, temp: 28 },
//         { hour: "4 PM", prediction: 17.8, temp: 26 },
//         { hour: "5 PM", prediction: 9.2, temp: 24 },
//         { hour: "6 PM", prediction: 3.1, temp: 21 },
//       ],
//     },
//     {
//       day: 2,
//       date: "Dec 6",
//       dayName: "Friday",
//       total: 172.3,
//       peak: 48.5,
//       weather: "Clear",
//       temp: 33,
//       hourly: [
//         { hour: "6 AM", prediction: 3.1, temp: 20 },
//         { hour: "7 AM", prediction: 9.0, temp: 22 },
//         { hour: "8 AM", prediction: 17.2, temp: 25 },
//         { hour: "9 AM", prediction: 26.5, temp: 28 },
//         { hour: "10 AM", prediction: 36.1, temp: 31 },
//         { hour: "11 AM", prediction: 44.8, temp: 33 },
//         { hour: "12 PM", prediction: 48.5, temp: 33 },
//         { hour: "1 PM", prediction: 47.9, temp: 33 },
//         { hour: "2 PM", prediction: 42.3, temp: 32 },
//         { hour: "3 PM", prediction: 31.2, temp: 31 },
//         { hour: "4 PM", prediction: 20.1, temp: 29 },
//         { hour: "5 PM", prediction: 10.5, temp: 26 },
//         { hour: "6 PM", prediction: 3.6, temp: 23 },
//       ],
//     },
//     {
//       day: 3,
//       date: "Dec 7",
//       dayName: "Saturday",
//       total: 142.8,
//       peak: 40.2,
//       weather: "Cloudy",
//       temp: 28,
//       hourly: [
//         { hour: "6 AM", prediction: 2.3, temp: 17 },
//         { hour: "7 AM", prediction: 7.1, temp: 19 },
//         { hour: "8 AM", prediction: 13.5, temp: 22 },
//         { hour: "9 AM", prediction: 21.0, temp: 25 },
//         { hour: "10 AM", prediction: 28.9, temp: 27 },
//         { hour: "11 AM", prediction: 35.8, temp: 28 },
//         { hour: "12 PM", prediction: 40.2, temp: 28 },
//         { hour: "1 PM", prediction: 39.5, temp: 28 },
//         { hour: "2 PM", prediction: 34.8, temp: 27 },
//         { hour: "3 PM", prediction: 25.2, temp: 26 },
//         { hour: "4 PM", prediction: 16.3, temp: 24 },
//         { hour: "5 PM", prediction: 8.4, temp: 22 },
//         { hour: "6 PM", prediction: 2.8, temp: 20 },
//       ],
//     },
//     {
//       day: 4,
//       date: "Dec 8",
//       dayName: "Sunday",
//       total: 165.7,
//       peak: 46.3,
//       weather: "Sunny",
//       temp: 31,
//       hourly: [
//         { hour: "6 AM", prediction: 2.8, temp: 19 },
//         { hour: "7 AM", prediction: 8.3, temp: 21 },
//         { hour: "8 AM", prediction: 15.8, temp: 24 },
//         { hour: "9 AM", prediction: 24.6, temp: 27 },
//         { hour: "10 AM", prediction: 33.6, temp: 29 },
//         { hour: "11 AM", prediction: 41.7, temp: 31 },
//         { hour: "12 PM", prediction: 46.3, temp: 31 },
//         { hour: "1 PM", prediction: 45.8, temp: 31 },
//         { hour: "2 PM", prediction: 40.5, temp: 30 },
//         { hour: "3 PM", prediction: 29.6, temp: 29 },
//         { hour: "4 PM", prediction: 19.1, temp: 27 },
//         { hour: "5 PM", prediction: 9.9, temp: 25 },
//         { hour: "6 PM", prediction: 3.4, temp: 22 },
//       ],
//     },
//     {
//       day: 5,
//       date: "Dec 9",
//       dayName: "Monday",
//       total: 158.9,
//       peak: 44.7,
//       weather: "Partly Cloudy",
//       temp: 30,
//       hourly: [
//         { hour: "6 AM", prediction: 2.7, temp: 18 },
//         { hour: "7 AM", prediction: 8.0, temp: 20 },
//         { hour: "8 AM", prediction: 15.3, temp: 23 },
//         { hour: "9 AM", prediction: 23.8, temp: 26 },
//         { hour: "10 AM", prediction: 32.5, temp: 28 },
//         { hour: "11 AM", prediction: 40.3, temp: 30 },
//         { hour: "12 PM", prediction: 44.7, temp: 30 },
//         { hour: "1 PM", prediction: 44.1, temp: 30 },
//         { hour: "2 PM", prediction: 39.0, temp: 29 },
//         { hour: "3 PM", prediction: 28.3, temp: 28 },
//         { hour: "4 PM", prediction: 18.3, temp: 26 },
//         { hour: "5 PM", prediction: 9.5, temp: 24 },
//         { hour: "6 PM", prediction: 3.2, temp: 21 },
//       ],
//     },
//     {
//       day: 6,
//       date: "Dec 10",
//       dayName: "Tuesday",
//       total: 170.4,
//       peak: 47.8,
//       weather: "Clear",
//       temp: 32,
//       hourly: [
//         { hour: "6 AM", prediction: 3.0, temp: 19 },
//         { hour: "7 AM", prediction: 8.8, temp: 22 },
//         { hour: "8 AM", prediction: 16.8, temp: 25 },
//         { hour: "9 AM", prediction: 26.1, temp: 28 },
//         { hour: "10 AM", prediction: 35.5, temp: 30 },
//         { hour: "11 AM", prediction: 44.0, temp: 32 },
//         { hour: "12 PM", prediction: 47.8, temp: 32 },
//         { hour: "1 PM", prediction: 47.2, temp: 32 },
//         { hour: "2 PM", prediction: 41.7, temp: 31 },
//         { hour: "3 PM", prediction: 30.6, temp: 30 },
//         { hour: "4 PM", prediction: 19.8, temp: 28 },
//         { hour: "5 PM", prediction: 10.3, temp: 25 },
//         { hour: "6 PM", prediction: 3.5, temp: 22 },
//       ],
//     },
//   ];

//   const maxGen = Math.max(...hourlyGeneration.map((h) => h.generation));
//   const maxPred = Math.max(...predictionVsActual.map((h) => Math.max(h.predicted, h.actual)));
//   const maxTemp = Math.max(...tempVsProduction.map((t) => t.temp));
//   const maxProd = Math.max(...tempVsProduction.map((t) => t.production));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-background to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-yellow-950/20 py-10 px-6">
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
//             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg">
//               <Sun className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
//                 Solar Generation
//               </h1>
//               <p className="text-muted-foreground mt-1">Real-time solar panel performance and analytics</p>
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
//                 ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
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
//                 ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
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
//                 ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
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
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 shadow-xl text-white"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-yellow-100">Current Output</span>
//                   <Zap className="h-5 w-5 text-yellow-200" />
//                 </div>
//                 <div className="text-4xl font-bold">{solarData.current} kW</div>
//                 <div className="text-yellow-100 text-sm mt-2">+12% from yesterday</div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-yellow-100 dark:border-yellow-900"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-muted-foreground">Peak Today</span>
//                   <TrendingUp className="h-5 w-5 text-yellow-600" />
//                 </div>
//                 <div className="text-4xl font-bold text-yellow-600">{solarData.peak} kW</div>
//                 <div className="text-sm text-muted-foreground mt-2">At 12:00 PM</div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-yellow-100 dark:border-yellow-900"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-muted-foreground">Today's Total</span>
//                   <Calendar className="h-5 w-5 text-yellow-600" />
//                 </div>
//                 <div className="text-4xl font-bold text-yellow-600">{solarData.today} kWh</div>
//                 <div className="text-sm text-muted-foreground mt-2">Generated so far</div>
//               </motion.div>
//             </div>

//             {/* Hourly Generation Chart */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl mb-8 border border-border"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <CloudSun className="h-5 w-5 text-yellow-600" />
//                 Hourly Generation Pattern
//               </h2>
//               <div className="space-y-3">
//                 {hourlyGeneration.map((item, index) => (
//                   <motion.div
//                     key={item.hour}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
//                     className="flex items-center gap-4"
//                   >
//                     <div className="w-16 text-sm text-muted-foreground font-medium">{item.hour}</div>
//                     <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${(item.generation / maxGen) * 100}%` }}
//                         transition={{ duration: 1, delay: 0.7 + index * 0.05, ease: "easeOut" }}
//                         className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-end pr-3"
//                       >
//                         <span className="text-xs font-semibold text-white">{item.generation} kW</span>
//                       </motion.div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* System Info */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.6 }}
//               className="grid grid-cols-1 md:grid-cols-3 gap-6"
//             >
//               <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <div className="text-sm text-muted-foreground mb-2">System Capacity</div>
//                 <div className="text-3xl font-bold text-yellow-600 mb-3">{solarData.capacity} kW</div>
//                 <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
//                   <div
//                     style={{ width: `${(solarData.current / solarData.capacity) * 100}%` }}
//                     className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"
//                   />
//                 </div>
//                 <div className="text-xs text-muted-foreground mt-2">
//                   Currently at {((solarData.current / solarData.capacity) * 100).toFixed(1)}%
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <div className="text-sm text-muted-foreground mb-2">System Efficiency</div>
//                 <div className="text-3xl font-bold text-yellow-600">{solarData.efficiency}%</div>
//                 <div className="text-xs text-muted-foreground mt-2">Above average performance</div>
//               </div>

//               <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <div className="text-sm text-muted-foreground mb-2">Active Panels</div>
//                 <div className="text-3xl font-bold text-yellow-600">{solarData.panels}</div>
//                 <div className="text-xs text-muted-foreground mt-2">All panels operational</div>
//               </div>
//             </motion.div>
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
//               className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-xl text-white"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <Target className="h-5 w-5" />
//                     <span className="text-sm">Prediction Accuracy</span>
//                   </div>
//                   <div className="text-4xl font-bold">{solarData.predictionAccuracy}%</div>
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
//               className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//             >
//           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//             <Target className="h-5 w-5 text-yellow-600" />
//             Today's Prediction vs Actual Generation
//           </h2>
//           <div className="space-y-3">
//             {predictionVsActual.map((item, index) => (
//               <motion.div
//                 key={item.hour}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: 0.9 + index * 0.04 }}
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="text-sm font-medium w-20">{item.hour}</div>
//                   <div className="text-xs text-muted-foreground">
//                     Predicted: {item.predicted} kW | Actual: {item.actual} kW
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(item.predicted / maxPred) * 100}%` }}
//                       transition={{ duration: 1, delay: 1.1 + index * 0.04, ease: "easeOut" }}
//                       className="h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-2"
//                     >
//                       <span className="text-xs font-semibold text-white">{item.predicted}</span>
//                     </motion.div>
//                   </div>
//                   <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${(item.actual / maxPred) * 100}%` }}
//                       transition={{ duration: 1, delay: 1.1 + index * 0.04, ease: "easeOut" }}
//                       className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-end pr-2"
//                     >
//                       <span className="text-xs font-semibold text-white">{item.actual}</span>
//                     </motion.div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//           <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded" />
//               <span className="text-sm text-muted-foreground">Predicted</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-600 rounded" />
//               <span className="text-sm text-muted-foreground">Actual</span>
//             </div>
//           </div>
//         </motion.div>

//         {/* Temperature vs Production */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//         >
//           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//             <ThermometerSun className="h-5 w-5 text-yellow-600" />
//             Temperature vs Production Correlation
//           </h2>
//           <div className="space-y-3">
//             {tempVsProduction.map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: 1.1 + index * 0.04 }}
//                 className="flex items-center gap-4"
//               >
//                 <div className="w-20 text-sm font-medium">{item.temp}°C</div>
//                 <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${(item.production / maxProd) * 100}%` }}
//                     transition={{ duration: 1, delay: 1.3 + index * 0.04, ease: "easeOut" }}
//                     className="h-full bg-gradient-to-r from-orange-400 via-yellow-500 to-amber-600 flex items-center justify-end pr-3"
//                   >
//                     <span className="text-xs font-semibold text-white">{item.production} kW</span>
//                   </motion.div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//           </>
//         )}

//         {/* Forecast Tab */}
//         {activeTab === "forecast" && (
//           <>
//             {/* 7-Day Forecast Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//         >
//           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//             <Calendar className="h-5 w-5 text-yellow-600" />
//             7-Day Solar Generation Forecast
//           </h2>
//           <div className="space-y-3">
//             {weeklyForecast.map((day, index) => (
//               <motion.div
//                 key={day.day}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
//               >
//                 <button
//                   onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
//                   className="w-full bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/20 dark:hover:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 transition-all cursor-pointer"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="text-left">
//                         <div className="font-semibold text-lg">{day.date}</div>
//                         <div className="text-sm text-muted-foreground">{day.dayName}</div>
//                       </div>
//                       <div className="text-sm px-3 py-1 bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
//                         {day.weather}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-6">
//                       <div className="text-right">
//                         <div className="text-sm text-muted-foreground">Expected Total</div>
//                         <div className="text-xl font-bold text-yellow-600">{day.total} kWh</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm text-muted-foreground">Peak</div>
//                         <div className="text-lg font-semibold text-yellow-600">{day.peak} kW</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm text-muted-foreground">Temp</div>
//                         <div className="text-lg font-semibold">{day.temp}°C</div>
//                       </div>
//                       {selectedDay === day.day ? (
//                         <ChevronUp className="h-5 w-5 text-yellow-600" />
//                       ) : (
//                         <ChevronDown className="h-5 w-5 text-yellow-600" />
//                       )}
//                     </div>
//                   </div>
//                 </button>

//                 {/* Hourly Breakdown */}
//                 <AnimatePresence>
//                   {selectedDay === day.day && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
//                         <h3 className="font-semibold mb-3 text-sm">Hourly Forecast (6 AM - 6 PM)</h3>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                           {day.hourly.map((hour, hIndex) => (
//                             <motion.div
//                               key={hour.hour}
//                               initial={{ opacity: 0, scale: 0.9 }}
//                               animate={{ opacity: 1, scale: 1 }}
//                               transition={{ duration: 0.2, delay: hIndex * 0.03 }}
//                               className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-border"
//                             >
//                               <div className="text-xs text-muted-foreground mb-1">{hour.hour}</div>
//                               <div className="text-lg font-bold text-yellow-600">{hour.prediction} kW</div>
//                               <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                                 <ThermometerSun className="h-3 w-3" />
//                                 {hour.temp}°C
//                               </div>
//                             </motion.div>
//                           ))}
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



// "use client";

// import { ArrowLeft, Sun, TrendingUp, Calendar, Zap, CloudSun, ThermometerSun, Target, ChevronDown, ChevronUp, BarChart3, Activity, Cloud } from "lucide-react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect } from "react";

// // --- 1. Define the shapes of the data we expect from the Database ---
// interface SolarData {
//   current: number;
//   peak: number;
//   today: number;
//   capacity: number;
//   efficiency: number;
//   panels: number;
//   predictionAccuracy: number;
// }

// interface HourlyData {
//   hour: string;
//   generation: number;
// }

// interface PredictionData {
//   hour: string;
//   predicted: number;
//   actual: number;
//   temp: number;
// }

// interface TempCorrelation {
//   temp: number;
//   production: number;
// }

// interface ForecastDay {
//   day: number;
//   date: string;
//   dayName: string;
//   total: number;
//   peak: number;
//   weather: string;
//   temp: number;
//   hourly: { hour: string; prediction: number; temp: number }[];
// }

// export default function SolarPage() {
//   const [selectedDay, setSelectedDay] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "forecast">("overview");

//   // --- 2. Initialize State as NULL (No hardcoded values here!) ---
//   const [loading, setLoading] = useState(true);
//   const [solarData, setSolarData] = useState<SolarData | null>(null);
//   const [hourlyGeneration, setHourlyGeneration] = useState<HourlyData[]>([]);
//   const [predictionVsActual, setPredictionVsActual] = useState<PredictionData[]>([]);
//   const [tempVsProduction, setTempVsProduction] = useState<TempCorrelation[]>([]);
//   const [weeklyForecast, setWeeklyForecast] = useState<ForecastDay[]>([]);

//   // --- 3. The "Bridge": Fetch data from your API (Supabase) ---
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // This calls the file: app/api/solar-data/route.ts
//         const res = await fetch("/api/solar-data"); 

//         if (!res.ok) throw new Error("Failed to fetch");

//         const data = await res.json();

//         // Save the database data into React State
//         setSolarData(data.solarData);
//         setHourlyGeneration(data.hourlyGeneration);
//         setPredictionVsActual(data.predictionVsActual);
//         setTempVsProduction(data.tempVsProduction);
//         setWeeklyForecast(data.weeklyForecast);
//       } catch (error) {
//         console.error("Error fetching solar data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   // --- 4. Loading Screen (Shows while waiting for DB) ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-yellow-50 dark:bg-slate-950">
//         <div className="flex flex-col items-center gap-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
//           <p className="text-yellow-600 font-medium">Loading live data from Supabase...</p>
//         </div>
//       </div>
//     );
//   }

//   // If DB returned nothing (Safety check)
//   if (!solarData) {
//     return <div className="p-10 text-center">No data found in database. Please run the SQL Insert script.</div>;
//   }

//   // Calculations for dynamic chart scaling
//   const maxGen = Math.max(...hourlyGeneration.map((h) => h.generation), 1);
//   const maxPred = Math.max(...predictionVsActual.map((h) => Math.max(h.predicted, h.actual)), 1);
//   const maxProd = Math.max(...tempVsProduction.map((t) => t.production), 1);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-background to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-yellow-950/20 py-10 px-6">
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
//             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg">
//               <Sun className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
//                 Solar Generation
//               </h1>
//               <p className="text-muted-foreground mt-1">Real-time solar panel performance and analytics</p>
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
//                 ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
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
//                 ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
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
//                 ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
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
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 shadow-xl text-white"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-yellow-100">Current Output</span>
//                   <Zap className="h-5 w-5 text-yellow-200" />
//                 </div>
//                 {/* DYNAMIC VALUE */}
//                 <div className="text-4xl font-bold">{solarData.current} kW</div>
//                 <div className="text-yellow-100 text-sm mt-2">+12% from yesterday</div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-yellow-100 dark:border-yellow-900"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-muted-foreground">Peak Today</span>
//                   <TrendingUp className="h-5 w-5 text-yellow-600" />
//                 </div>
//                 {/* DYNAMIC VALUE */}
//                 <div className="text-4xl font-bold text-yellow-600">{solarData.peak} kW</div>
//                 <div className="text-sm text-muted-foreground mt-2">At 12:00 PM</div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-yellow-100 dark:border-yellow-900"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-muted-foreground">Today's Total</span>
//                   <Calendar className="h-5 w-5 text-yellow-600" />
//                 </div>
//                 {/* DYNAMIC VALUE */}
//                 <div className="text-4xl font-bold text-yellow-600">{solarData.today} kWh</div>
//                 <div className="text-sm text-muted-foreground mt-2">Generated so far</div>
//               </motion.div>
//             </div>

//             {/* Hourly Generation Chart */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl mb-8 border border-border"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <CloudSun className="h-5 w-5 text-yellow-600" />
//                 Hourly Generation Pattern
//               </h2>
//               <div className="space-y-3">
//                 {hourlyGeneration.map((item, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
//                     className="flex items-center gap-4"
//                   >
//                     <div className="w-16 text-sm text-muted-foreground font-medium">{item.hour}</div>
//                     <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${(item.generation / maxGen) * 100}%` }}
//                         transition={{ duration: 1, delay: 0.7 + index * 0.05, ease: "easeOut" }}
//                         className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-end pr-3"
//                       >
//                         <span className="text-xs font-semibold text-white">{item.generation} kW</span>
//                       </motion.div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* System Info */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.6 }}
//               className="grid grid-cols-1 md:grid-cols-3 gap-6"
//             >
//               <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <div className="text-sm text-muted-foreground mb-2">System Capacity</div>
//                 <div className="text-3xl font-bold text-yellow-600 mb-3">{solarData.capacity} kW</div>
//                 <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
//                   <div
//                     style={{ width: `${(solarData.current / solarData.capacity) * 100}%` }}
//                     className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"
//                   />
//                 </div>
//                 <div className="text-xs text-muted-foreground mt-2">
//                   Currently at {((solarData.current / solarData.capacity) * 100).toFixed(1)}%
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <div className="text-sm text-muted-foreground mb-2">System Efficiency</div>
//                 <div className="text-3xl font-bold text-yellow-600">{solarData.efficiency}%</div>
//                 <div className="text-xs text-muted-foreground mt-2">Above average performance</div>
//               </div>

//               <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <div className="text-sm text-muted-foreground mb-2">Active Panels</div>
//                 <div className="text-3xl font-bold text-yellow-600">{solarData.panels}</div>
//                 <div className="text-xs text-muted-foreground mt-2">All panels operational</div>
//               </div>
//             </motion.div>
//           </>
//         )}

//         {/* Predictions Tab */}
//         {activeTab === "predictions" && (
//           <>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-xl text-white"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <Target className="h-5 w-5" />
//                     <span className="text-sm">Prediction Accuracy</span>
//                   </div>
//                   <div className="text-4xl font-bold">{solarData.predictionAccuracy}%</div>
//                   <div className="text-sm text-green-100 mt-1">Based on last 30 days</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm text-green-100">Model Performance</div>
//                   <div className="text-2xl font-semibold">Excellent</div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <Target className="h-5 w-5 text-yellow-600" />
//                 Today's Prediction vs Actual Generation
//               </h2>
//               <div className="space-y-3">
//                 {predictionVsActual.map((item, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: 0.9 + index * 0.04 }}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="text-sm font-medium w-20">{item.hour}</div>
//                       <div className="text-xs text-muted-foreground">
//                         Predicted: {item.predicted} kW | Actual: {item.actual} kW
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${(item.predicted / maxPred) * 100}%` }}
//                           transition={{ duration: 1, delay: 1.1 + index * 0.04, ease: "easeOut" }}
//                           className="h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-2"
//                         >
//                           <span className="text-xs font-semibold text-white">{item.predicted}</span>
//                         </motion.div>
//                       </div>
//                       <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${(item.actual / maxPred) * 100}%` }}
//                           transition={{ duration: 1, delay: 1.1 + index * 0.04, ease: "easeOut" }}
//                           className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-end pr-2"
//                         >
//                           <span className="text-xs font-semibold text-white">{item.actual}</span>
//                         </motion.div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.5 }}
//               className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <ThermometerSun className="h-5 w-5 text-yellow-600" />
//                 Temperature vs Production Correlation
//               </h2>
//               <div className="space-y-3">
//                 {tempVsProduction.map((item, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: 1.1 + index * 0.04 }}
//                     className="flex items-center gap-4"
//                   >
//                     <div className="w-20 text-sm font-medium">{item.temp}°C</div>
//                     <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${(item.production / maxProd) * 100}%` }}
//                         transition={{ duration: 1, delay: 1.3 + index * 0.04, ease: "easeOut" }}
//                         className="h-full bg-gradient-to-r from-orange-400 via-yellow-500 to-amber-600 flex items-center justify-end pr-3"
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
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//             >
//               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-yellow-600" />
//                 7-Day Solar Generation Forecast
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
//                       className="w-full bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/20 dark:hover:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 transition-all cursor-pointer"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className="text-left">
//                             <div className="font-semibold text-lg">{day.date}</div>
//                             <div className="text-sm text-muted-foreground">{day.dayName}</div>
//                           </div>
//                           <div className="text-sm px-3 py-1 bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
//                             {day.weather}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-6">
//                           <div className="text-right">
//                             <div className="text-sm text-muted-foreground">Expected Total</div>
//                             <div className="text-xl font-bold text-yellow-600">{day.total} kWh</div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm text-muted-foreground">Peak</div>
//                             <div className="text-lg font-semibold text-yellow-600">{day.peak} kW</div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm text-muted-foreground">Temp</div>
//                             <div className="text-lg font-semibold">{day.temp}°C</div>
//                           </div>
//                           {selectedDay === day.day ? (
//                             <ChevronUp className="h-5 w-5 text-yellow-600" />
//                           ) : (
//                             <ChevronDown className="h-5 w-5 text-yellow-600" />
//                           )}
//                         </div>
//                       </div>
//                     </button>

//                     <AnimatePresence>
//                       {selectedDay === day.day && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="overflow-hidden"
//                         >
//                           <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
//                             <h3 className="font-semibold mb-3 text-sm">Hourly Forecast (6 AM - 6 PM)</h3>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                               {day.hourly.length > 0 ? (
//                                 day.hourly.map((hour, hIndex) => (
//                                   <motion.div
//                                     key={hIndex}
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ duration: 0.2, delay: hIndex * 0.03 }}
//                                     className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-border"
//                                   >
//                                     <div className="text-xs text-muted-foreground mb-1">{hour.hour}</div>
//                                     <div className="text-lg font-bold text-yellow-600">{hour.prediction} kW</div>
//                                     <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                                       <ThermometerSun className="h-3 w-3" />
//                                       {hour.temp}°C
//                                     </div>
//                                   </motion.div>
//                                 ))
//                               ) : (
//                                 <p className="text-sm text-muted-foreground col-span-4 text-center">No hourly data available for this date.</p>
//                               )}
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

import { ArrowLeft, Sun, TrendingUp, Calendar, Zap, CloudSun, ThermometerSun, Target, ChevronDown, ChevronUp, BarChart3, Activity, Cloud } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// --- TYPES ---
interface SolarData {
  current: number;
  peak: number;
  today: number;
  capacity: number;
  efficiency: number;
  panels: number;
  predictionAccuracy: number;
}

interface HourlyData {
  hour: string;
  generation: number;
}

interface PredictionData {
  hour: string;
  predicted: number;
  actual: number;
  temp: number;
}

interface TempCorrelation {
  temp: number;
  production: number;
}

interface ForecastDay {
  day: number;
  date: string;
  dayName: string;
  total: number;
  peak: number;
  weather: string;
  temp: number;
  hourly: { hour: string; prediction: number; temp: number }[];
}

export default function SolarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "forecast">("overview");

  const [loading, setLoading] = useState(true);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [hourlyGeneration, setHourlyGeneration] = useState<HourlyData[]>([]);
  const [predictionVsActual, setPredictionVsActual] = useState<PredictionData[]>([]);
  const [tempVsProduction, setTempVsProduction] = useState<TempCorrelation[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<ForecastDay[]>([]);

  useEffect(() => {
    // --- IMPORT FROM LOCAL STORAGE (The Bridge) ---
    const loadFromSimulation = () => {
      try {
        const savedData = localStorage.getItem("campus-simulation-data");

        // DEFAULT VALUES (Used if dashboard hasn't run yet)
        let currentSolar = 0;
        let logs: any[] = [];
        let capacity = 900; // Default capacity from dashboard logic

        if (savedData) {
          const parsed = JSON.parse(savedData);
          currentSolar = parsed.solar || 0;
          logs = parsed.hourlyLogs || [];
          // If capacity exists in logs, use it, otherwise default
          if (parsed.capacities && parsed.capacities.solar) {
            capacity = parsed.capacities.solar;
          }
        }

        // --- 1. PROCESS SOLAR DATA ---
        // Calculate Peak: Max of history logs OR current value
        const peakSoFar = logs.length > 0
          ? Math.max(...logs.map((l: any) => l.solar), currentSolar)
          : currentSolar;

        const todayTotal = logs.reduce((acc: number, curr: any) => acc + curr.solar, 0);

        setSolarData({
          current: Math.round(currentSolar),
          peak: Math.round(peakSoFar),
          today: Math.round(todayTotal),
          capacity: capacity,
          efficiency: 22.4, // Hardware constant
          panels: 124,      // Hardware constant
          predictionAccuracy: 94.2, // Model constant
        });

        // --- 2. PROCESS HOURLY GENERATION ---
        const formattedHourly: HourlyData[] = logs.map((log: any) => ({
          hour: log.hour,
          generation: log.solar
        }));
        setHourlyGeneration(formattedHourly);

        // --- 3. SIMULATE PREDICTIONS (Based on real logs) ---
        // We simulate "Predicted" vs "Actual" by taking the actual simulation data 
        // and adding slight noise to create the "Predicted" value.
        const predictions: PredictionData[] = logs.map((log: any) => {
          const hourInt = parseInt(log.hour.split(':')[0]);
          // Simulate a temperature curve peaking at 2pm (14:00)
          const temp = Math.round(25 + 10 * Math.sin(Math.PI * (hourInt - 8) / 12));

          return {
            hour: log.hour,
            // Predicted is Actual +/- 15% noise
            predicted: Math.round(log.solar * (0.85 + Math.random() * 0.3)),
            actual: log.solar,
            temp: Math.max(20, temp) // Min temp 20C
          };
        });
        setPredictionVsActual(predictions);

        // --- 4. TEMP CORRELATION ---
        // Filter out night hours (low production) to see real correlation
        const correlations: TempCorrelation[] = predictions
          .filter(p => p.actual > 10)
          .map(p => ({ temp: p.temp, production: p.actual }))
          .sort((a, b) => a.temp - b.temp)
          .filter((_, i) => i % 2 === 0) // Take every 2nd point to de-clutter
          .slice(0, 6);
        setTempVsProduction(correlations);

        // --- 5. GENERATE FORECAST ---
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayDate = new Date();

        const forecast: ForecastDay[] = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(todayDate);
          d.setDate(todayDate.getDate() + i);
          const isSunny = Math.random() > 0.3; // 70% chance of sun
          const dailyPeak = isSunny ? capacity * 0.9 : capacity * 0.4;

          return {
            day: i,
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            dayName: days[d.getDay()],
            total: Math.round(dailyPeak * 5.5), // Rough integration of bell curve
            peak: Math.round(dailyPeak),
            weather: isSunny ? "Sunny" : "Cloudy",
            temp: Math.round(28 + (Math.random() * 5)),
            hourly: [
              { hour: "08:00 AM", prediction: Math.round(dailyPeak * 0.3), temp: 24 },
              { hour: "12:00 PM", prediction: Math.round(dailyPeak), temp: 32 },
              { hour: "04:00 PM", prediction: Math.round(dailyPeak * 0.5), temp: 29 },
            ]
          };
        });
        setWeeklyForecast(forecast);

      } catch (error) {
        console.error("Failed to load simulation data", error);
      } finally {
        setLoading(false);
      }
    };

    // Load immediately on mount
    loadFromSimulation();

    // Optional: Poll every 2 seconds to keep in sync if dashboard is running in another tab
    const interval = setInterval(loadFromSimulation, 2000);
    return () => clearInterval(interval);
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className="text-yellow-600 font-medium">Syncing with Digital Twin...</p>
        </div>
      </div>
    );
  }

  // Safety check if no data initialized
  if (!solarData) return null;

  // Scaling factors for charts
  const maxGen = Math.max(...hourlyGeneration.map((h) => h.generation), 1);
  const maxPred = Math.max(...predictionVsActual.map((h) => Math.max(h.predicted, h.actual)), 1);
  const maxProd = Math.max(...tempVsProduction.map((t) => t.production), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-background to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-yellow-950/20 py-10 px-6">
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg">
              <Sun className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
                Solar Generation
              </h1>
              <p className="text-muted-foreground mt-1">Real-time solar panel performance and analytics</p>
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "overview"
                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
          >
            <Activity className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("predictions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "predictions"
                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
          >
            <BarChart3 className="h-4 w-4" />
            Predictions
          </button>
          <button
            onClick={() => setActiveTab("forecast")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === "forecast"
                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 shadow-xl text-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-100">Current Output</span>
                  <Zap className="h-5 w-5 text-yellow-200" />
                </div>
                {/* DYNAMIC VALUE */}
                <div className="text-4xl font-bold">{solarData.current} kW</div>
                <div className="text-yellow-100 text-sm mt-2">
                  {solarData.current > 0 ? "Active Generation" : "System Idle (Night)"}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-yellow-100 dark:border-yellow-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Peak Today</span>
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                {/* DYNAMIC VALUE */}
                <div className="text-4xl font-bold text-yellow-600">{solarData.peak} kW</div>
                <div className="text-sm text-muted-foreground mt-2">Highest recorded today</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-yellow-100 dark:border-yellow-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Today's Total</span>
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                {/* DYNAMIC VALUE */}
                <div className="text-4xl font-bold text-yellow-600">{solarData.today} kWh</div>
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
                <CloudSun className="h-5 w-5 text-yellow-600" />
                Hourly Generation Pattern
              </h2>
              {hourlyGeneration.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No data generated yet. Run the simulation on the Dashboard to see charts.
                </div>
              ) : (
                <div className="space-y-3">
                  {hourlyGeneration.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-16 text-sm text-muted-foreground font-medium">{item.hour}</div>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.generation / maxGen) * 100}%` }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.05, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-end pr-3"
                        >
                          <span className="text-xs font-semibold text-white">{item.generation} kW</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
                <div className="text-3xl font-bold text-yellow-600 mb-3">{solarData.capacity} kW</div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    style={{ width: `${(solarData.current / solarData.capacity) * 100}%` }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Currently at {solarData.capacity > 0 ? ((solarData.current / solarData.capacity) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <div className="text-sm text-muted-foreground mb-2">System Efficiency</div>
                <div className="text-3xl font-bold text-yellow-600">{solarData.efficiency}%</div>
                <div className="text-xs text-muted-foreground mt-2">Above average performance</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <div className="text-sm text-muted-foreground mb-2">Active Panels</div>
                <div className="text-3xl font-bold text-yellow-600">{solarData.panels}</div>
                <div className="text-xs text-muted-foreground mt-2">All panels operational</div>
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-xl text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5" />
                    <span className="text-sm">Prediction Accuracy</span>
                  </div>
                  <div className="text-4xl font-bold">{solarData.predictionAccuracy}%</div>
                  <div className="text-sm text-green-100 mt-1">Based on last 30 days</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-100">Model Performance</div>
                  <div className="text-2xl font-semibold">Excellent</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-600" />
                Today's Prediction vs Actual Generation
              </h2>
              {predictionVsActual.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Run the simulation to generate prediction data.</div>
              ) : (
                <div className="space-y-3">
                  {predictionVsActual.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.04 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium w-20">{item.hour}</div>
                        <div className="text-xs text-muted-foreground">
                          Predicted: {item.predicted} kW | Actual: {item.actual} kW
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.predicted / maxPred) * 100}%` }}
                            transition={{ duration: 1, delay: 1.1 + index * 0.04, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-2"
                          >
                            <span className="text-xs font-semibold text-white">{item.predicted}</span>
                          </motion.div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.actual / maxPred) * 100}%` }}
                            transition={{ duration: 1, delay: 1.1 + index * 0.04, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-end pr-2"
                          >
                            <span className="text-xs font-semibold text-white">{item.actual}</span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ThermometerSun className="h-5 w-5 text-yellow-600" />
                Temperature vs Production Correlation
              </h2>
              {tempVsProduction.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Insufficient data for correlation analysis.</div>
              ) : (
                <div className="space-y-3">
                  {tempVsProduction.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.1 + index * 0.04 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-20 text-sm font-medium">{item.temp}°C</div>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.production / maxProd) * 100}%` }}
                          transition={{ duration: 1, delay: 1.3 + index * 0.04, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-orange-400 via-yellow-500 to-amber-600 flex items-center justify-end pr-3"
                        >
                          <span className="text-xs font-semibold text-white">{item.production} kW</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
                <Calendar className="h-5 w-5 text-yellow-600" />
                7-Day Solar Generation Forecast
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
                      className="w-full bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/20 dark:hover:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <div className="font-semibold text-lg">{day.date}</div>
                            <div className="text-sm text-muted-foreground">{day.dayName}</div>
                          </div>
                          <div className="text-sm px-3 py-1 bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                            {day.weather}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Expected Total</div>
                            <div className="text-xl font-bold text-yellow-600">{day.total} kWh</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Peak</div>
                            <div className="text-lg font-semibold text-yellow-600">{day.peak} kW</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Temp</div>
                            <div className="text-lg font-semibold">{day.temp}°C</div>
                          </div>
                          {selectedDay === day.day ? (
                            <ChevronUp className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-yellow-600" />
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
                          <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <h3 className="font-semibold mb-3 text-sm">Hourly Forecast (6 AM - 6 PM)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {day.hourly.length > 0 ? (
                                day.hourly.map((hour, hIndex) => (
                                  <motion.div
                                    key={hIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: hIndex * 0.03 }}
                                    className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-border"
                                  >
                                    <div className="text-xs text-muted-foreground mb-1">{hour.hour}</div>
                                    <div className="text-lg font-bold text-yellow-600">{hour.prediction} kW</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <ThermometerSun className="h-3 w-3" />
                                      {hour.temp}°C
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground col-span-4 text-center">No hourly data available for this date.</p>
                              )}
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