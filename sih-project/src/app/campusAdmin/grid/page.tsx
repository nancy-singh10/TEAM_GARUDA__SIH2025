// "use client";

// import { ArrowLeft, Zap, TrendingUp, TrendingDown, Calendar, Activity, ArrowUpDown, BarChart3, Gauge, MapPin, PieChart, AlertTriangle, CheckCircle } from "lucide-react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";

// export default function GridPage() {
//   const [activeTab, setActiveTab] = useState<"load" | "frequency" | "regional" | "generation">("load");

//   const gridData = {
//     current: 813.05,
//     status: "importing",
//     peakImport: 950.2,
//     peakExport: 245.8,
//     todayImport: 4250.6,
//     todayExport: 1320.4,
//     cost: 178.5,
//   };

//   // Load Profile Data
//   const demandSupplyData = Array.from({ length: 8 }, (_, i) => ({
//     hour: `${i * 3} ${i === 0 ? 'AM' : i < 4 ? 'AM' : 'PM'}`,
//     demand: 350 + Math.random() * 450,
//     supply: 360 + Math.random() * 440,
//   }));

//   const forecastData = Array.from({ length: 7 }, (_, i) => ({
//     hour: 14 + i,
//     actual: 700 + i * 20 + Math.random() * 50,
//     baseline: 680 + i * 15,
//     forecast: 710 + i * 18 + Math.random() * 40,
//   }));

//   // Frequency & Voltage Data
//   const stabilityData = Array.from({ length: 9 }, (_, i) => ({
//     time: `${i * 2}:00`.padStart(5, '0'),
//     frequency: 50 + (Math.sin(i * 0.5) * 0.1) + (Math.random() * 0.05 - 0.025),
//     voltage: 230 + (Math.sin(i * 0.4) * 1.2) + (Math.random() * 0.5 - 0.25),
//   }));

//   // Generation Mix Data (24h stacked area)
//   const generationMixData = Array.from({ length: 9 }, (_, i) => ({
//     hour: i * 3,
//     fossil: 150 + Math.random() * 100,
//     hydro: 80 + Math.random() * 40,
//     solar: i > 2 && i < 7 ? 200 + Math.random() * 100 : 50,
//     wind: 180 + Math.random() * 100,
//   }));

//   const hourlyFlow = [
//     { hour: "12 AM", import: 620, export: 0, net: -620 },
//     { hour: "3 AM", import: 580, export: 0, net: -580 },
//     { hour: "6 AM", import: 720, export: 0, net: -720 },
//     { hour: "9 AM", import: 420, export: 150, net: -270 },
//     { hour: "12 PM", import: 180, export: 380, net: 200 },
//     { hour: "3 PM", import: 250, export: 320, net: 70 },
//     { hour: "6 PM", import: 680, export: 80, net: -600 },
//     { hour: "9 PM", import: 813, export: 0, net: -813 },
//   ];

//   const maxValue = Math.max(
//     ...hourlyFlow.map((h) => Math.max(h.import, h.export))
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20 py-10 px-6">
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
//             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg">
//               <Zap className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
//                 Grid Exchange
//               </h1>
//               <p className="text-muted-foreground mt-1">Power grid import/export analytics and monitoring</p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Tab Navigation */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-border overflow-x-auto mb-8"
//         >
//           <button
//             onClick={() => setActiveTab("load")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
//               activeTab === "load"
//                 ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
//                 : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
//             }`}
//           >
//             <BarChart3 className="h-4 w-4" />
//             Load Profile
//           </button>
//           <button
//             onClick={() => setActiveTab("frequency")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
//               activeTab === "frequency"
//                 ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
//                 : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
//             }`}
//           >
//             <Gauge className="h-4 w-4" />
//             Frequency & Voltage
//           </button>
//           <button
//             onClick={() => setActiveTab("regional")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
//               activeTab === "regional"
//                 ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
//                 : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
//             }`}
//           >
//             <MapPin className="h-4 w-4" />
//             Regional Dist.
//           </button>
//           <button
//             onClick={() => setActiveTab("generation")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
//               activeTab === "generation"
//                 ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
//                 : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
//             }`}
//           >
//             <PieChart className="h-4 w-4" />
//             Generation Mix
//           </button>
//         </motion.div>

//         {/* Load Profile Tab */}
//         {activeTab === "load" && (
//           <AnimatePresence mode="wait">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-6"
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Hourly Load & Supply */}
//                 <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                   <h2 className="text-xl font-semibold mb-2">Hourly Load & Supply</h2>
//                   <p className="text-sm text-muted-foreground mb-6">Demand vs Supply curve</p>
                  
//                   <div className="space-y-4">
//                     {demandSupplyData.map((item, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
//                       >
//                         <div className="text-xs text-muted-foreground mb-1">{item.hour}</div>
//                         <div className="grid grid-cols-2 gap-2">
//                           <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               animate={{ width: `${(item.demand / 1000) * 100}%` }}
//                               transition={{ duration: 1, delay: 0.4 + index * 0.05 }}
//                               className="h-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center"
//                             >
//                               <span className="text-xs font-bold text-white">{Math.round(item.demand)}</span>
//                             </motion.div>
//                           </div>
//                           <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               animate={{ width: `${(item.supply / 1000) * 100}%` }}
//                               transition={{ duration: 1, delay: 0.4 + index * 0.05 }}
//                               className="h-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center"
//                             >
//                               <span className="text-xs font-bold text-white">{Math.round(item.supply)}</span>
//                             </motion.div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
                  
//                   <div className="flex items-center justify-center gap-6 mt-6">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-sm" />
//                       <span className="text-sm text-muted-foreground">Demand (MW)</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-sm" />
//                       <span className="text-sm text-muted-foreground">Supply (MW)</span>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Demand Forecast */}
//                 <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                   <h2 className="text-xl font-semibold mb-2">Demand Forecast</h2>
//                   <p className="text-sm text-muted-foreground mb-6">Predicted vs Actual Load</p>
                  
//                   <div className="relative h-64">
//                     <svg viewBox="0 0 700 200" className="w-full h-full">
//                       {/* Grid lines */}
//                       <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
//                       <line x1="40" y1="180" x2="680" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                      
//                       {/* Y-axis labels */}
//                       <text x="30" y="25" textAnchor="end" className="text-xs fill-current text-muted-foreground">1000</text>
//                       <text x="30" y="105" textAnchor="end" className="text-xs fill-current text-muted-foreground">750</text>
//                       <text x="30" y="185" textAnchor="end" className="text-xs fill-current text-muted-foreground">500</text>
                      
//                       {/* Lines */}
//                       {/* Actual (purple solid) */}
//                       <motion.polyline
//                         initial={{ pathLength: 0 }}
//                         animate={{ pathLength: 1 }}
//                         transition={{ duration: 2, delay: 0.3 }}
//                         points={forecastData.map((d, i) => `${50 + i * 90},${180 - (d.actual - 500) * 0.32}`).join(" ")}
//                         fill="none"
//                         stroke="#a855f7"
//                         strokeWidth="3"
//                       />
//                       {forecastData.map((d, i) => (
//                         <motion.circle
//                           key={`a-${i}`}
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ delay: 0.3 + i * 0.1 }}
//                           cx={50 + i * 90}
//                           cy={180 - (d.actual - 500) * 0.32}
//                           r="4"
//                           fill="#a855f7"
//                         />
//                       ))}
                      
//                       {/* Baseline (red dashed) */}
//                       <polyline
//                         points={forecastData.map((d, i) => `${50 + i * 90},${180 - (d.baseline - 500) * 0.32}`).join(" ")}
//                         fill="none"
//                         stroke="#ef4444"
//                         strokeWidth="2"
//                         strokeDasharray="5,5"
//                       />
                      
//                       {/* Forecast (purple dashed) */}
//                       <polyline
//                         points={forecastData.map((d, i) => `${50 + i * 90},${180 - (d.forecast - 500) * 0.32}`).join(" ")}
//                         fill="none"
//                         stroke="#8b5cf6"
//                         strokeWidth="2"
//                         strokeDasharray="5,5"
//                       />
                      
//                       {/* X-axis labels */}
//                       {forecastData.map((d, i) => (
//                         <text key={`x-${i}`} x={50 + i * 90} y="195" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
//                           {d.hour}:00
//                         </text>
//                       ))}
//                     </svg>
//                   </div>

//                   <div className="flex items-center justify-center gap-6 mt-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-0.5 bg-purple-500" />
//                       <span className="text-sm text-muted-foreground">Actual</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500" />
//                       <span className="text-sm text-muted-foreground">Baseline</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-0.5 bg-purple-400 border-dashed border-t-2 border-purple-400" />
//                       <span className="text-sm text-muted-foreground">Forecast</span>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Stats Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                   className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-muted-foreground">Peak Import</span>
//                     <TrendingDown className="h-5 w-5 text-red-600" />
//                   </div>
//                   <div className="text-4xl font-bold text-red-600">{gridData.peakImport} kW</div>
//                   <div className="text-sm text-muted-foreground mt-2">Maximum draw today</div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.4 }}
//                   className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-muted-foreground">Peak Export</span>
//                     <TrendingUp className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div className="text-4xl font-bold text-green-600">{gridData.peakExport} kW</div>
//                   <div className="text-sm text-muted-foreground mt-2">Maximum supply today</div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.5 }}
//                   className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-muted-foreground">Energy Cost</span>
//                     <Activity className="h-5 w-5 text-violet-600" />
//                   </div>
//                   <div className="text-4xl font-bold text-violet-600">${gridData.cost}</div>
//                   <div className="text-sm text-muted-foreground mt-2">Net cost today</div>
//                 </motion.div>
//               </div>

//               {/* Hourly Flow Chart */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.6 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
//               >
//                 <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                   <Calendar className="h-5 w-5 text-violet-600" />
//                   Hourly Import/Export Pattern
//                 </h2>
//                 <div className="space-y-6">
//                   {hourlyFlow.map((item, index) => (
//                     <motion.div
//                       key={item.hour}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.3, delay: 0.7 + index * 0.08 }}
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="text-sm font-medium w-20">{item.hour}</div>
//                         <div className={`text-xs px-2 py-1 rounded font-medium ${
//                           item.net < 0
//                             ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
//                             : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
//                         }`}>
//                           Net: {item.net > 0 ? "+" : ""}{item.net} kW
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         {/* Import Bar */}
//                         <div>
//                           <div className="text-xs text-muted-foreground mb-1">Import</div>
//                           <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               animate={{ width: `${(item.import / maxValue) * 100}%` }}
//                               transition={{ duration: 1, delay: 0.9 + index * 0.08, ease: "easeOut" }}
//                               className="h-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-end pr-2"
//                             >
//                               <span className="text-xs font-semibold text-white">{item.import}</span>
//                             </motion.div>
//                           </div>
//                         </div>
//                         {/* Export Bar */}
//                         <div>
//                           <div className="text-xs text-muted-foreground mb-1">Export</div>
//                           <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               animate={{ width: `${(item.export / maxValue) * 100}%` }}
//                               transition={{ duration: 1, delay: 0.9 + index * 0.08, ease: "easeOut" }}
//                               className="h-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-end pr-2"
//                             >
//                               {item.export > 0 && (
//                                 <span className="text-xs font-semibold text-white">{item.export}</span>
//                               )}
//                             </motion.div>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             </motion.div>
//           </AnimatePresence>
//         )}

//         {/* Frequency & Voltage Tab */}
//         {activeTab === "frequency" && (
//           <AnimatePresence mode="wait">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-6"
//             >
//               {/* Stability Monitoring */}
//               <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <h2 className="text-xl font-semibold mb-2">Stability Monitoring</h2>
//                 <p className="text-sm text-muted-foreground mb-6">Frequency & Voltage fluctuations</p>
                
//                 <div className="relative h-64 mb-8">
//                   <svg viewBox="0 0 800 200" className="w-full h-full">
//                     {/* Grid */}
//                     <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
//                     <line x1="40" y1="180" x2="780" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                    
//                     {/* Y-axis labels */}
//                     <text x="30" y="25" textAnchor="end" className="text-xs fill-current text-muted-foreground">50.2</text>
//                     <text x="30" y="65" textAnchor="end" className="text-xs fill-current text-muted-foreground">50.1</text>
//                     <text x="30" y="105" textAnchor="end" className="text-xs fill-current text-muted-foreground">50</text>
//                     <text x="30" y="145" textAnchor="end" className="text-xs fill-current text-muted-foreground">49.9</text>
//                     <text x="30" y="185" textAnchor="end" className="text-xs fill-current text-muted-foreground">49.8</text>
                    
//                     <text x="790" y="25" textAnchor="start" className="text-xs fill-current text-muted-foreground">232</text>
//                     <text x="790" y="65" textAnchor="start" className="text-xs fill-current text-muted-foreground">231</text>
//                     <text x="790" y="105" textAnchor="start" className="text-xs fill-current text-muted-foreground">230</text>
//                     <text x="790" y="145" textAnchor="start" className="text-xs fill-current text-muted-foreground">229</text>
//                     <text x="790" y="185" textAnchor="start" className="text-xs fill-current text-muted-foreground">228</text>
                    
//                     {/* Frequency line (purple) */}
//                     <motion.polyline
//                       initial={{ pathLength: 0 }}
//                       animate={{ pathLength: 1 }}
//                       transition={{ duration: 2, delay: 0.3 }}
//                       points={stabilityData.map((d, i) => `${50 + i * 90},${100 - (d.frequency - 50) * 400}`).join(" ")}
//                       fill="none"
//                       stroke="#a855f7"
//                       strokeWidth="3"
//                     />
//                     {stabilityData.map((d, i) => (
//                       <circle key={`f-${i}`} cx={50 + i * 90} cy={100 - (d.frequency - 50) * 400} r="4" fill="#a855f7" />
//                     ))}
                    
//                     {/* Voltage line (purple-darker) */}
//                     <motion.polyline
//                       initial={{ pathLength: 0 }}
//                       animate={{ pathLength: 1 }}
//                       transition={{ duration: 2, delay: 0.4 }}
//                       points={stabilityData.map((d, i) => `${50 + i * 90},${100 - (d.voltage - 230) * 40}`).join(" ")}
//                       fill="none"
//                       stroke="#8b5cf6"
//                       strokeWidth="3"
//                     />
//                     {stabilityData.map((d, i) => (
//                       <circle key={`v-${i}`} cx={50 + i * 90} cy={100 - (d.voltage - 230) * 40} r="4" fill="#8b5cf6" />
//                     ))}
                    
//                     {/* X-axis labels */}
//                     {stabilityData.map((d, i) => (
//                       <text key={`x-${i}`} x={50 + i * 90} y="195" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
//                         {d.time}
//                       </text>
//                     ))}
//                   </svg>
//                 </div>

//                 <div className="flex items-center justify-center gap-6">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-purple-500 rounded-full" />
//                     <span className="text-sm text-muted-foreground">Frequency (Hz)</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-purple-600 rounded-full" />
//                     <span className="text-sm text-muted-foreground">Voltage (V)</span>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Grid Metrics & Alerts */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Grid Stability Metrics */}
//                 <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                   <h2 className="text-xl font-semibold mb-6">Grid Stability Metrics</h2>
                  
//                   <div className="flex items-center justify-center h-64">
//                     <svg viewBox="0 0 200 200" className="w-full h-full max-w-xs">
//                       {/* Pentagon outline */}
//                       <polygon
//                         points="100,20 180,75 155,165 45,165 20,75"
//                         fill="none"
//                         stroke="#d946ef"
//                         strokeWidth="2"
//                         opacity="0.4"
//                       />
                      
//                       {/* Current metrics pentagon */}
//                       <motion.polygon
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ duration: 1, delay: 0.3 }}
//                         points="100,30 165,80 145,155 55,155 35,80"
//                         fill="#a855f7"
//                         opacity="0.5"
//                       />
//                       <polygon
//                         points="100,30 165,80 145,155 55,155 35,80"
//                         fill="none"
//                         stroke="#a855f7"
//                         strokeWidth="3"
//                       />
                      
//                       {/* Labels */}
//                       <text x="100" y="15" textAnchor="middle" className="text-xs font-medium fill-current">Frequency</text>
//                       <text x="190" y="80" textAnchor="start" className="text-xs font-medium fill-current">Voltage</text>
//                       <text x="160" y="180" textAnchor="middle" className="text-xs font-medium fill-current">Load Factor</text>
//                       <text x="40" y="180" textAnchor="middle" className="text-xs font-medium fill-current">Reserve Margin</text>
//                       <text x="10" y="80" textAnchor="start" className="text-xs font-medium fill-current">Renewable %</text>
//                     </svg>
//                   </div>

//                   <div className="flex items-center justify-center gap-6 mt-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-sm" />
//                       <span className="text-sm text-muted-foreground">Current</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-pink-500 rounded-sm opacity-40" />
//                       <span className="text-sm text-muted-foreground">Max</span>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Active Alerts */}
//                 <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                   <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                     <AlertTriangle className="h-5 w-5 text-orange-500" />
//                     Active Alerts
//                   </h2>
                  
//                   <div className="space-y-4">
//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.3 }}
//                       className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3"
//                     >
//                       <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="font-semibold text-emerald-900 dark:text-emerald-100">Frequency Normal</div>
//                         <div className="text-sm text-emerald-700 dark:text-emerald-300">50.02 Hz</div>
//                       </div>
//                     </motion.div>

//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.4 }}
//                       className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3"
//                     >
//                       <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="font-semibold text-emerald-900 dark:text-emerald-100">Voltage Stable</div>
//                         <div className="text-sm text-emerald-700 dark:text-emerald-300">230V Nominal</div>
//                       </div>
//                     </motion.div>

//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.5 }}
//                       className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3"
//                     >
//                       <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="font-semibold text-amber-900 dark:text-amber-100">High Demand Warning</div>
//                         <div className="text-sm text-amber-700 dark:text-amber-300">Load at 82% Capacity</div>
//                       </div>
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         )}

//         {/* Generation Mix Tab */}
//         {activeTab === "generation" && (
//           <AnimatePresence mode="wait">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="grid grid-cols-1 lg:grid-cols-2 gap-6"
//             >
//               {/* Generation Mix - Stacked Area */}
//               <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <h2 className="text-xl font-semibold mb-2">Generation Mix</h2>
//                 <p className="text-sm text-muted-foreground mb-6">Source Contribution over 24h</p>
                
//                 <div className="relative h-72">
//                   <svg viewBox="0 0 700 300" className="w-full h-full">
//                     {/* Axes */}
//                     <line x1="40" y1="250" x2="680" y2="250" stroke="currentColor" strokeWidth="1" className="text-border" />
                    
//                     {/* Y-axis labels */}
//                     <text x="30" y="30" textAnchor="end" className="text-xs fill-current text-muted-foreground">800</text>
//                     <text x="30" y="140" textAnchor="end" className="text-xs fill-current text-muted-foreground">400</text>
//                     <text x="30" y="255" textAnchor="end" className="text-xs fill-current text-muted-foreground">0</text>
                    
//                     {/* Stacked areas */}
//                     {/* Wind (top - light blue) */}
//                     <motion.polygon
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 0.7 }}
//                       transition={{ duration: 1, delay: 0.3 }}
//                       points={generationMixData.map((d, i) => {
//                         const x = 50 + i * 75;
//                         const total = d.fossil + d.hydro + d.solar + d.wind;
//                         const y = 250 - (total * 0.3);
//                         return `${x},${y}`;
//                       }).join(" ") + " 680,250 50,250"}
//                       fill="#7dd3fc"
//                     />
                    
//                     {/* Solar (yellow) */}
//                     <motion.polygon
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 0.7 }}
//                       transition={{ duration: 1, delay: 0.4 }}
//                       points={generationMixData.map((d, i) => {
//                         const x = 50 + i * 75;
//                         const total = d.fossil + d.hydro + d.solar;
//                         const y = 250 - (total * 0.3);
//                         return `${x},${y}`;
//                       }).join(" ") + " 680,250 50,250"}
//                       fill="#fbbf24"
//                     />
                    
//                     {/* Hydro (pink) */}
//                     <motion.polygon
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 0.7 }}
//                       transition={{ duration: 1, delay: 0.5 }}
//                       points={generationMixData.map((d, i) => {
//                         const x = 50 + i * 75;
//                         const total = d.fossil + d.hydro;
//                         const y = 250 - (total * 0.3);
//                         return `${x},${y}`;
//                       }).join(" ") + " 680,250 50,250"}
//                       fill="#f472b6"
//                     />
                    
//                     {/* Fossil (bottom - purple) */}
//                     <motion.polygon
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 0.7 }}
//                       transition={{ duration: 1, delay: 0.6 }}
//                       points={generationMixData.map((d, i) => {
//                         const x = 50 + i * 75;
//                         const y = 250 - (d.fossil * 0.3);
//                         return `${x},${y}`;
//                       }).join(" ") + " 680,250 50,250"}
//                       fill="#a855f7"
//                     />
                    
//                     {/* X-axis labels */}
//                     {generationMixData.map((d, i) => (
//                       <text key={i} x={50 + i * 75} y="265" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
//                         {d.hour} {d.hour === 0 ? 'AM' : d.hour < 12 ? 'AM' : 'PM'}
//                       </text>
//                     ))}
//                   </svg>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 mt-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-purple-500 rounded-sm" />
//                     <span className="text-sm text-muted-foreground">Fossil</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-pink-500 rounded-sm" />
//                     <span className="text-sm text-muted-foreground">Hydro</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
//                     <span className="text-sm text-muted-foreground">Solar</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-sky-400 rounded-sm" />
//                     <span className="text-sm text-muted-foreground">Wind</span>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Energy Contribution - Donut Chart */}
//               <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
//                 <h2 className="text-xl font-semibold mb-2">Energy Contribution</h2>
//                 <p className="text-sm text-muted-foreground mb-6">Current Grid Composition</p>
                
//                 <div className="flex items-center justify-center h-72">
//                   <svg viewBox="0 0 200 200" className="w-full h-full max-w-xs">
//                     <motion.circle
//                       initial={{ pathLength: 0 }}
//                       animate={{ pathLength: 1 }}
//                       transition={{ duration: 1, delay: 0.3 }}
//                       cx="100"
//                       cy="100"
//                       r="70"
//                       fill="none"
//                       stroke="#a855f7"
//                       strokeWidth="35"
//                       strokeDasharray="110 330"
//                       strokeDashoffset="0"
//                       transform="rotate(-90 100 100)"
//                     />
//                     <motion.circle
//                       initial={{ pathLength: 0 }}
//                       animate={{ pathLength: 1 }}
//                       transition={{ duration: 1, delay: 0.4 }}
//                       cx="100"
//                       cy="100"
//                       r="70"
//                       fill="none"
//                       stroke="#8b5cf6"
//                       strokeWidth="35"
//                       strokeDasharray="66 374"
//                       strokeDashoffset="-110"
//                       transform="rotate(-90 100 100)"
//                     />
//                     <motion.circle
//                       initial={{ pathLength: 0 }}
//                       animate={{ pathLength: 1 }}
//                       transition={{ duration: 1, delay: 0.5 }}
//                       cx="100"
//                       cy="100"
//                       r="70"
//                       fill="none"
//                       stroke="#c084fc"
//                       strokeWidth="35"
//                       strokeDasharray="154 286"
//                       strokeDashoffset="-176"
//                       transform="rotate(-90 100 100)"
//                     />
//                     <motion.circle
//                       initial={{ pathLength: 0 }}
//                       animate={{ pathLength: 1 }}
//                       transition={{ duration: 1, delay: 0.6 }}
//                       cx="100"
//                       cy="100"
//                       r="70"
//                       fill="none"
//                       stroke="#ef4444"
//                       strokeWidth="35"
//                       strokeDasharray="110 330"
//                       strokeDashoffset="-330"
//                       transform="rotate(-90 100 100)"
//                     />
//                   </svg>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-sm" />
//                       <span className="text-sm text-muted-foreground">Grid Import</span>
//                     </div>
//                     <span className="text-sm font-semibold">25%</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-600 rounded-sm" />
//                       <span className="text-sm text-muted-foreground">Local Gen</span>
//                     </div>
//                     <span className="text-sm font-semibold">15%</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-400 rounded-sm" />
//                       <span className="text-sm text-muted-foreground">Renewables</span>
//                     </div>
//                     <span className="text-sm font-semibold">35%</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-red-500 rounded-sm" />
//                       <span className="text-sm text-muted-foreground">Reserve</span>
//                     </div>
//                     <span className="text-sm font-semibold">25%</span>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </AnimatePresence>
//         )}

//         {/* Regional Distribution Tab - Placeholder */}
//         {activeTab === "regional" && (
//           <AnimatePresence mode="wait">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-xl border border-border text-center"
//             >
//               <MapPin className="h-16 w-16 text-violet-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-semibold mb-2">Regional Distribution</h2>
//               <p className="text-muted-foreground">Geographic power distribution map coming soon</p>
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { ArrowLeft, Zap, TrendingUp, TrendingDown, Calendar, Activity, ArrowUpDown, BarChart3, Gauge, MapPin, PieChart, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// --- Types for Database Data ---
interface GridStats {
  current: number;
  status: string;
  peakImport: number;
  peakExport: number;
  cost: number;
}

interface HourlyLoad {
  hour: string;
  demand: number;
  supply: number;
}

interface HourlyFlow {
  hour: string;
  import: number;
  export: number;
  net: number;
}

interface ForecastPoint {
  hour: number;
  actual: number;
  baseline: number;
  forecast: number;
}

export default function GridPage() {
  const [activeTab, setActiveTab] = useState<"load" | "frequency" | "regional" | "generation">("load");
  const [loading, setLoading] = useState(true);

  // --- Dynamic State (Fetched from API) ---
  const [gridStats, setGridStats] = useState<GridStats | null>(null);
  const [demandSupplyData, setDemandSupplyData] = useState<HourlyLoad[]>([]);
  const [hourlyFlow, setHourlyFlow] = useState<HourlyFlow[]>([]);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);

  // --- Static Data (Hardcoded as requested for other tabs) ---
  const stabilityData = Array.from({ length: 9 }, (_, i) => ({
    time: `${i * 2}:00`.padStart(5, '0'),
    frequency: 50 + (Math.sin(i * 0.5) * 0.1) + (Math.random() * 0.05 - 0.025),
    voltage: 230 + (Math.sin(i * 0.4) * 1.2) + (Math.random() * 0.5 - 0.25),
  }));

  const generationMixData = Array.from({ length: 9 }, (_, i) => ({
    hour: i * 3,
    fossil: 150 + Math.random() * 100,
    hydro: 80 + Math.random() * 40,
    solar: i > 2 && i < 7 ? 200 + Math.random() * 100 : 50,
    wind: 180 + Math.random() * 100,
  }));

  // --- Fetch Logic ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/grid-data");
        const data = await res.json();
        
        if (res.ok) {
          setGridStats(data.gridStats);
          setDemandSupplyData(data.demandSupplyData);
          setHourlyFlow(data.hourlyFlow);
          setForecastData(data.forecastData);
        }
      } catch (error) {
        console.error("Error fetching grid data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  // Fallback if DB is empty
  if (!gridStats) return <div className="p-10 text-center">No grid data found.</div>;

  const maxValue = Math.max(
    ...hourlyFlow.map((h) => Math.max(h.import, h.export))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20 py-10 px-6">
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Grid Exchange
              </h1>
              <p className="text-muted-foreground mt-1">Power grid import/export analytics and monitoring</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-border overflow-x-auto mb-8"
        >
          <button
            onClick={() => setActiveTab("load")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === "load"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Load Profile
          </button>
          <button
            onClick={() => setActiveTab("frequency")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === "frequency"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Gauge className="h-4 w-4" />
            Frequency & Voltage
          </button>
          <button
            onClick={() => setActiveTab("regional")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === "regional"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Regional Dist.
          </button>
          <button
            onClick={() => setActiveTab("generation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === "generation"
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <PieChart className="h-4 w-4" />
            Generation Mix
          </button>
        </motion.div>

        {/* Load Profile Tab (DYNAMIC - Connected to Database) */}
        {activeTab === "load" && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hourly Load & Supply */}
                <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                  <h2 className="text-xl font-semibold mb-2">Hourly Load & Supply</h2>
                  <p className="text-sm text-muted-foreground mb-6">Demand vs Supply curve</p>
                  
                  <div className="space-y-4">
                    {demandSupplyData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      >
                        <div className="text-xs text-muted-foreground mb-1">{item.hour}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.demand / 1000) * 100}%` }}
                              transition={{ duration: 1, delay: 0.4 + index * 0.05 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center"
                            >
                              <span className="text-xs font-bold text-white">{Math.round(item.demand)}</span>
                            </motion.div>
                          </div>
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-8 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.supply / 1000) * 100}%` }}
                              transition={{ duration: 1, delay: 0.4 + index * 0.05 }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center"
                            >
                              <span className="text-xs font-bold text-white">{Math.round(item.supply)}</span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-sm" />
                      <span className="text-sm text-muted-foreground">Demand (MW)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-sm" />
                      <span className="text-sm text-muted-foreground">Supply (MW)</span>
                    </div>
                  </div>
                </motion.div>

                {/* Demand Forecast */}
                <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                  <h2 className="text-xl font-semibold mb-2">Demand Forecast</h2>
                  <p className="text-sm text-muted-foreground mb-6">Predicted vs Actual Load</p>
                  
                  <div className="relative h-64">
                    <svg viewBox="0 0 700 200" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                      <line x1="40" y1="180" x2="680" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                      
                      {/* Y-axis labels */}
                      <text x="30" y="25" textAnchor="end" className="text-xs fill-current text-muted-foreground">1000</text>
                      <text x="30" y="105" textAnchor="end" className="text-xs fill-current text-muted-foreground">750</text>
                      <text x="30" y="185" textAnchor="end" className="text-xs fill-current text-muted-foreground">500</text>
                      
                      {/* Lines - Using Forecast Data from DB */}
                      {/* Actual (purple solid) */}
                      <motion.polyline
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.3 }}
                        points={forecastData.map((d, i) => `${50 + i * 90},${180 - (d.actual - 300) * 0.3}`).join(" ")}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3"
                      />
                      {forecastData.map((d, i) => (
                        <motion.circle
                          key={`a-${i}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          cx={50 + i * 90}
                          cy={180 - (d.actual - 300) * 0.3}
                          r="4"
                          fill="#a855f7"
                        />
                      ))}
                      
                      {/* Baseline (red dashed) */}
                      <polyline
                        points={forecastData.map((d, i) => `${50 + i * 90},${180 - (d.baseline - 300) * 0.3}`).join(" ")}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      
                      {/* Forecast (purple dashed) */}
                      <polyline
                        points={forecastData.map((d, i) => `${50 + i * 90},${180 - (d.forecast - 300) * 0.3}`).join(" ")}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      
                      {/* X-axis labels */}
                      {forecastData.map((d, i) => (
                        <text key={`x-${i}`} x={50 + i * 90} y="195" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
                          {d.hour}:00
                        </text>
                      ))}
                    </svg>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-purple-500" />
                      <span className="text-sm text-muted-foreground">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500" />
                      <span className="text-sm text-muted-foreground">Baseline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-purple-400 border-dashed border-t-2 border-purple-400" />
                      <span className="text-sm text-muted-foreground">Forecast</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Peak Import</span>
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-4xl font-bold text-red-600">{gridStats.peakImport} kW</div>
                  <div className="text-sm text-muted-foreground mt-2">Maximum draw today</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Peak Export</span>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold text-green-600">{gridStats.peakExport} kW</div>
                  <div className="text-sm text-muted-foreground mt-2">Maximum supply today</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-violet-100 dark:border-violet-900"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Energy Cost</span>
                    <Activity className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="text-4xl font-bold text-violet-600">${gridStats.cost}</div>
                  <div className="text-sm text-muted-foreground mt-2">Net cost today</div>
                </motion.div>
              </div>

              {/* Hourly Flow Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  Hourly Import/Export Pattern
                </h2>
                <div className="space-y-6">
                  {hourlyFlow.map((item, index) => (
                    <motion.div
                      key={item.hour}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.08 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium w-20">{item.hour}</div>
                        <div className={`text-xs px-2 py-1 rounded font-medium ${
                          item.net < 0
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}>
                          Net: {item.net > 0 ? "+" : ""}{item.net} kW
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Import Bar */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Import</div>
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.import / maxValue) * 100}%` }}
                              transition={{ duration: 1, delay: 0.9 + index * 0.08, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-end pr-2"
                            >
                              <span className="text-xs font-semibold text-white">{item.import}</span>
                            </motion.div>
                          </div>
                        </div>
                        {/* Export Bar */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Export</div>
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.export / maxValue) * 100}%` }}
                              transition={{ duration: 1, delay: 0.9 + index * 0.08, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-end pr-2"
                            >
                              {item.export > 0 && (
                                <span className="text-xs font-semibold text-white">{item.export}</span>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Frequency & Voltage Tab - HARDCODED/STATIC */}
        {activeTab === "frequency" && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stability Monitoring */}
              <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <h2 className="text-xl font-semibold mb-2">Stability Monitoring</h2>
                <p className="text-sm text-muted-foreground mb-6">Frequency & Voltage fluctuations</p>
                
                <div className="relative h-64 mb-8">
                  <svg viewBox="0 0 800 200" className="w-full h-full">
                    {/* Grid */}
                    <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                    <line x1="40" y1="180" x2="780" y2="180" stroke="currentColor" strokeWidth="1" className="text-border" />
                    
                    {/* Y-axis labels */}
                    <text x="30" y="25" textAnchor="end" className="text-xs fill-current text-muted-foreground">50.2</text>
                    <text x="30" y="65" textAnchor="end" className="text-xs fill-current text-muted-foreground">50.1</text>
                    <text x="30" y="105" textAnchor="end" className="text-xs fill-current text-muted-foreground">50</text>
                    <text x="30" y="145" textAnchor="end" className="text-xs fill-current text-muted-foreground">49.9</text>
                    <text x="30" y="185" textAnchor="end" className="text-xs fill-current text-muted-foreground">49.8</text>
                    
                    <text x="790" y="25" textAnchor="start" className="text-xs fill-current text-muted-foreground">232</text>
                    <text x="790" y="65" textAnchor="start" className="text-xs fill-current text-muted-foreground">231</text>
                    <text x="790" y="105" textAnchor="start" className="text-xs fill-current text-muted-foreground">230</text>
                    <text x="790" y="145" textAnchor="start" className="text-xs fill-current text-muted-foreground">229</text>
                    <text x="790" y="185" textAnchor="start" className="text-xs fill-current text-muted-foreground">228</text>
                    
                    {/* Frequency line (purple) */}
                    <motion.polyline
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.3 }}
                      points={stabilityData.map((d, i) => `${50 + i * 90},${100 - (d.frequency - 50) * 400}`).join(" ")}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3"
                    />
                    {stabilityData.map((d, i) => (
                      <circle key={`f-${i}`} cx={50 + i * 90} cy={100 - (d.frequency - 50) * 400} r="4" fill="#a855f7" />
                    ))}
                    
                    {/* Voltage line (purple-darker) */}
                    <motion.polyline
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.4 }}
                      points={stabilityData.map((d, i) => `${50 + i * 90},${100 - (d.voltage - 230) * 40}`).join(" ")}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                    />
                    {stabilityData.map((d, i) => (
                      <circle key={`v-${i}`} cx={50 + i * 90} cy={100 - (d.voltage - 230) * 40} r="4" fill="#8b5cf6" />
                    ))}
                    
                    {/* X-axis labels */}
                    {stabilityData.map((d, i) => (
                      <text key={`x-${i}`} x={50 + i * 90} y="195" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
                        {d.time}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-sm text-muted-foreground">Frequency (Hz)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                    <span className="text-sm text-muted-foreground">Voltage (V)</span>
                  </div>
                </div>
              </motion.div>

              {/* Grid Metrics & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grid Stability Metrics */}
                <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                  <h2 className="text-xl font-semibold mb-6">Grid Stability Metrics</h2>
                  
                  <div className="flex items-center justify-center h-64">
                    <svg viewBox="0 0 200 200" className="w-full h-full max-w-xs">
                      {/* Pentagon outline */}
                      <polygon
                        points="100,20 180,75 155,165 45,165 20,75"
                        fill="none"
                        stroke="#d946ef"
                        strokeWidth="2"
                        opacity="0.4"
                      />
                      
                      {/* Current metrics pentagon */}
                      <motion.polygon
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        points="100,30 165,80 145,155 55,155 35,80"
                        fill="#a855f7"
                        opacity="0.5"
                      />
                      <polygon
                        points="100,30 165,80 145,155 55,155 35,80"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3"
                      />
                      
                      {/* Labels */}
                      <text x="100" y="15" textAnchor="middle" className="text-xs font-medium fill-current">Frequency</text>
                      <text x="190" y="80" textAnchor="start" className="text-xs font-medium fill-current">Voltage</text>
                      <text x="160" y="180" textAnchor="middle" className="text-xs font-medium fill-current">Load Factor</text>
                      <text x="40" y="180" textAnchor="middle" className="text-xs font-medium fill-current">Reserve Margin</text>
                      <text x="10" y="80" textAnchor="start" className="text-xs font-medium fill-current">Renewable %</text>
                    </svg>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                      <span className="text-sm text-muted-foreground">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-sm opacity-40" />
                      <span className="text-sm text-muted-foreground">Max</span>
                    </div>
                  </div>
                </motion.div>

                {/* Active Alerts */}
                <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Active Alerts
                  </h2>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-emerald-900 dark:text-emerald-100">Frequency Normal</div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300">50.02 Hz</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-emerald-900 dark:text-emerald-100">Voltage Stable</div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300">230V Nominal</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3"
                    >
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-amber-900 dark:text-amber-100">High Demand Warning</div>
                        <div className="text-sm text-amber-700 dark:text-amber-300">Load at 82% Capacity</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Generation Mix Tab - HARDCODED/STATIC */}
        {activeTab === "generation" && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Generation Mix - Stacked Area */}
              <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <h2 className="text-xl font-semibold mb-2">Generation Mix</h2>
                <p className="text-sm text-muted-foreground mb-6">Source Contribution over 24h</p>
                
                <div className="relative h-72">
                  <svg viewBox="0 0 700 300" className="w-full h-full">
                    {/* Axes */}
                    <line x1="40" y1="250" x2="680" y2="250" stroke="currentColor" strokeWidth="1" className="text-border" />
                    
                    {/* Y-axis labels */}
                    <text x="30" y="30" textAnchor="end" className="text-xs fill-current text-muted-foreground">800</text>
                    <text x="30" y="140" textAnchor="end" className="text-xs fill-current text-muted-foreground">400</text>
                    <text x="30" y="255" textAnchor="end" className="text-xs fill-current text-muted-foreground">0</text>
                    
                    {/* Stacked areas */}
                    {/* Wind (top - light blue) */}
                    <motion.polygon
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      points={generationMixData.map((d, i) => {
                        const x = 50 + i * 75;
                        const total = d.fossil + d.hydro + d.solar + d.wind;
                        const y = 250 - (total * 0.3);
                        return `${x},${y}`;
                      }).join(" ") + " 680,250 50,250"}
                      fill="#7dd3fc"
                    />
                    
                    {/* Solar (yellow) */}
                    <motion.polygon
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1, delay: 0.4 }}
                      points={generationMixData.map((d, i) => {
                        const x = 50 + i * 75;
                        const total = d.fossil + d.hydro + d.solar;
                        const y = 250 - (total * 0.3);
                        return `${x},${y}`;
                      }).join(" ") + " 680,250 50,250"}
                      fill="#fbbf24"
                    />
                    
                    {/* Hydro (pink) */}
                    <motion.polygon
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      points={generationMixData.map((d, i) => {
                        const x = 50 + i * 75;
                        const total = d.fossil + d.hydro;
                        const y = 250 - (total * 0.3);
                        return `${x},${y}`;
                      }).join(" ") + " 680,250 50,250"}
                      fill="#f472b6"
                    />
                    
                    {/* Fossil (bottom - purple) */}
                    <motion.polygon
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      points={generationMixData.map((d, i) => {
                        const x = 50 + i * 75;
                        const y = 250 - (d.fossil * 0.3);
                        return `${x},${y}`;
                      }).join(" ") + " 680,250 50,250"}
                      fill="#a855f7"
                    />
                    
                    {/* X-axis labels */}
                    {generationMixData.map((d, i) => (
                      <text key={i} x={50 + i * 75} y="265" textAnchor="middle" className="text-xs fill-current text-muted-foreground">
                        {d.hour} {d.hour === 0 ? 'AM' : d.hour < 12 ? 'AM' : 'PM'}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                    <span className="text-sm text-muted-foreground">Fossil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-sm" />
                    <span className="text-sm text-muted-foreground">Hydro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                    <span className="text-sm text-muted-foreground">Solar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-400 rounded-sm" />
                    <span className="text-sm text-muted-foreground">Wind</span>
                  </div>
                </div>
              </motion.div>

              {/* Energy Contribution - Donut Chart */}
              <motion.div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border border-border">
                <h2 className="text-xl font-semibold mb-2">Energy Contribution</h2>
                <p className="text-sm text-muted-foreground mb-6">Current Grid Composition</p>
                
                <div className="flex items-center justify-center h-72">
                  <svg viewBox="0 0 200 200" className="w-full h-full max-w-xs">
                    <motion.circle
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="35"
                      strokeDasharray="110 330"
                      strokeDashoffset="0"
                      transform="rotate(-90 100 100)"
                    />
                    <motion.circle
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.4 }}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="35"
                      strokeDasharray="66 374"
                      strokeDashoffset="-110"
                      transform="rotate(-90 100 100)"
                    />
                    <motion.circle
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="35"
                      strokeDasharray="154 286"
                      strokeDashoffset="-176"
                      transform="rotate(-90 100 100)"
                    />
                    <motion.circle
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="35"
                      strokeDasharray="110 330"
                      strokeDashoffset="-330"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                      <span className="text-sm text-muted-foreground">Grid Import</span>
                    </div>
                    <span className="text-sm font-semibold">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-sm" />
                      <span className="text-sm text-muted-foreground">Local Gen</span>
                    </div>
                    <span className="text-sm font-semibold">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-sm" />
                      <span className="text-sm text-muted-foreground">Renewables</span>
                    </div>
                    <span className="text-sm font-semibold">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-sm" />
                      <span className="text-sm text-muted-foreground">Reserve</span>
                    </div>
                    <span className="text-sm font-semibold">25%</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Regional Distribution Tab - Placeholder */}
        {activeTab === "regional" && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-xl border border-border text-center"
            >
              <MapPin className="h-16 w-16 text-violet-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Regional Distribution</h2>
              <p className="text-muted-foreground">Geographic power distribution map coming soon</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}