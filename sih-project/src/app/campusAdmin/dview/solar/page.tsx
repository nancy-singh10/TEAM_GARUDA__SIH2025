'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  LinearProgress,
  Avatar,
  Chip
} from "@mui/material"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, Area, AreaChart 
} from 'recharts'
import { 
  Sun, Zap, TrendingUp, Gauge, AlertCircle, Wifi, 
  Activity, Cloud, Wind, LayoutDashboard 
} from "lucide-react"

// --- Types ---
interface AnimatedValues {
  efficiency: number
  generation: number
  temperature: number
  irradiance: number
}

interface HourlyData {
  time: string
  production: number
  forecast: number
}

interface HourlyDetailedData {
  hour: string
  production: number
  temperature: number
}

interface BuildingData {
  name: string
  value: number
  kw: number
}

interface PredictionData {
  date: string
  actual: number
  predicted: number
}

interface ForecastData {
  date: string
  forecast: number
}

interface WeeklyTrendData {
  day: string
  generation: number
  consumption: number
  surplus: number
}

// --- Data Constants ---
const hourlyData: HourlyData[] = [
  { time: '6-9 AM', production: 180, forecast: 200 },
  { time: '9-12 PM', production: 680, forecast: 700 },
  { time: '12-3 PM', production: 720, forecast: 750 },
  { time: '3-6 PM', production: 340, forecast: 350 },
]

const hourlyDetailedData: HourlyDetailedData[] = [
  { hour: '6 AM', production: 45, temperature: 22 },
  { hour: '8 AM', production: 135, temperature: 24 },
  { hour: '10 AM', production: 320, temperature: 26 },
  { hour: '12 PM', production: 450, temperature: 28 },
  { hour: '2 PM', production: 480, temperature: 30 },
  { hour: '4 PM', production: 340, temperature: 28 },
  { hour: '6 PM', production: 120, temperature: 25 },
]

const buildingData: BuildingData[] = [
  { name: 'Engineering', value: 40, kw: 340 },
  { name: 'Admin Block', value: 25, kw: 210 },
  { name: 'Library', value: 20, kw: 165 },
  { name: 'Science Lab', value: 15, kw: 125 },
]

const predictionData: PredictionData[] = [
  { date: 'Jan 1', actual: 400, predicted: 410 },
  { date: 'Jan 2', actual: 420, predicted: 425 },
  { date: 'Jan 3', actual: 380, predicted: 385 },
  { date: 'Jan 4', actual: 450, predicted: 455 },
  { date: 'Jan 5', actual: 470, predicted: 468 },
  { date: 'Jan 6', actual: 440, predicted: 442 },
  { date: 'Jan 7', actual: 480, predicted: 485 },
]

const forecastData: ForecastData[] = [
  { date: 'Jan 8', forecast: 490 },
  { date: 'Jan 9', forecast: 510 },
  { date: 'Jan 10', forecast: 520 },
  { date: 'Jan 11', forecast: 505 },
  { date: 'Jan 12', forecast: 530 },
  { date: 'Jan 13', forecast: 545 },
  { date: 'Jan 14', forecast: 525 },
]

const weeklyTrendData: WeeklyTrendData[] = [
  { day: 'Mon', generation: 4200, consumption: 3800, surplus: 400 },
  { day: 'Tue', generation: 4500, consumption: 3900, surplus: 600 },
  { day: 'Wed', generation: 4100, consumption: 3700, surplus: 400 },
  { day: 'Thu', generation: 4800, consumption: 4000, surplus: 800 },
  { day: 'Fri', generation: 4600, consumption: 3850, surplus: 750 },
  { day: 'Sat', generation: 4300, consumption: 3600, surplus: 700 },
  { day: 'Sun', generation: 4400, consumption: 3700, surplus: 700 },
]

// Theme Colors (Matching the Dashboard Image)
const THEME = {
  primary: '#10b981', // Mint/Emerald Green
  secondary: '#8b5cf6', // Soft Purple
  accent: '#f59e0b', // Orange
  blue: '#3b82f6', // Blue
  background: '#f8fafc', // Very light gray/slate background
  cardBg: '#ffffff',
  textMain: '#1e293b',
  textMuted: '#64748b'
}

const COLORS = [THEME.primary, THEME.secondary, THEME.blue, THEME.accent];

export default function SolarPageMUI() {
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({
    efficiency: 0,
    generation: 0,
    temperature: 0,
    irradiance: 0,
  })

  const [currentTab, setCurrentTab] = useState(0);
  const [chartAnimated, setChartAnimated] = useState(false)

  // Animation Effect
  useEffect(() => {
    const animationDuration = 1500
    const steps = 60
    const stepDuration = animationDuration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        efficiency: Math.floor(873 * progress) / 10,
        generation: Math.floor(847.5 * progress * 10) / 10,
        temperature: Math.floor(28 * progress),
        irradiance: Math.floor(850 * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues({
          efficiency: 87.3,
          generation: 847.5,
          temperature: 28,
          irradiance: 850,
        })
      }
    }, stepDuration)

    const timer = setTimeout(() => setChartAnimated(true), 300)
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Styled Components Helper
  const DashboardCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <Card 
      elevation={0} 
      className={`rounded-xl border border-slate-100 shadow-sm bg-white overflow-visible ${className}`}
    >
      {children}
    </Card>
  )

  // Custom Gauge adapted to Theme
  const CircularEfficiency = ({ value }: { value: number }) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={THEME.accent}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">{value.toFixed(1)}<span className="text-sm">%</span></span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Efficiency</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg text-white shadow-orange-200 shadow-lg">
                <Sun className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Solar Management</h1>
                <p className="text-sm text-slate-500">Real-time PV monitoring & analytics</p>
            </div>
        </div>

        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm font-medium">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                <Wifi className="w-4 h-4 text-emerald-500" />
                System: Online
            </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Efficiency Card */}
        <DashboardCard className="relative overflow-hidden group">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CircularEfficiency value={animatedValues.efficiency} />
            <div className="mt-2 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
               High Performance
            </div>
          </CardContent>
        </DashboardCard>

        {/* Generation Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Current Output</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.generation.toFixed(1)} <span className="text-lg text-slate-400">kW</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#fff7ed', color: '#f97316' }} variant="rounded">
                  <Zap size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Solar Generation</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 85 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#fff7ed',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#f97316' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Panel Temp Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Panel Temp</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.temperature} <span className="text-lg text-slate-400">°C</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }} variant="rounded">
                  <Cloud size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Optimal Range</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 70 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#eff6ff',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#3b82f6' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Irradiance Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Irradiance</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.irradiance.toFixed(0)} <span className="text-lg text-slate-400">W/m²</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981' }} variant="rounded">
                  <Wind size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Light Intensity</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 90 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#f0fdf4',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' }
                }}
            />
          </CardContent>
        </DashboardCard>
      </div>

      {/* Main Tabs Section */}
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
                value={currentTab} 
                onChange={handleTabChange} 
                aria-label="solar dashboard tabs"
                TabIndicatorProps={{ style: { backgroundColor: THEME.primary } }}
                sx={{
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#64748b',
                        '&.Mui-selected': { color: THEME.primary },
                    }
                }}
            >
                <Tab label="Today's Production" />
                <Tab label="Building Wise" />
                <Tab label="Predictions" />
                <Tab label="7-Day Forecast" />
            </Tabs>
        </Box>

        {/* Tab 1: Today's Production */}
        {currentTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                        title="Hourly Production" 
                        subheader="Actual vs Forecast"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="production" fill={THEME.primary} name="Actual (kWh)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="forecast" fill={THEME.primary} fillOpacity={0.3} name="Forecast (kWh)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>

                <DashboardCard>
                    <CardHeader 
                        title="Detailed Hour View" 
                        subheader="Production vs Temperature correlation"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourlyDetailedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="production" stroke={THEME.primary} strokeWidth={3} dot={{r:4}} name="Output (kW)" />
                                <Line yAxisId="right" type="monotone" dataKey="temperature" stroke={THEME.accent} strokeWidth={2} dot={{r:4}} name="Temp (°C)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>
            </div>
        )}

        {/* Tab 2: Building Wise */}
        {currentTab === 1 && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                        title="Distribution" 
                        subheader="Energy contribution by building"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie
                                     data={buildingData}
                                     cx="50%"
                                     cy="50%"
                                     innerRadius={80}
                                     outerRadius={110}
                                     paddingAngle={5}
                                     dataKey="value"
                                 >
                                     {buildingData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                 </Pie>
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend verticalAlign="middle" align="right" layout="vertical" />
                             </PieChart>
                         </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>

                <DashboardCard>
                    <CardHeader 
                        title="Building Output" 
                        subheader="Current load vs Capacity"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent>
                        <div className="space-y-6">
                            {buildingData.map((building, idx) => (
                                <div key={building.name} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-slate-700">{building.name}</span>
                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 rounded">{building.kw} kW</span>
                                    </div>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(building.value / 40) * 100} 
                                        sx={{ 
                                            height: 10, 
                                            borderRadius: 5,
                                            bgcolor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': { 
                                                background: `linear-gradient(to right, ${COLORS[idx % COLORS.length]}, ${COLORS[idx % COLORS.length]}80)`
                                            }
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>{building.value}% of total</span>
                                        <span>{((building.kw / 840) * 100).toFixed(1)}% cap</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </DashboardCard>
             </div>
        )}

        {/* Tab 3: Predictions */}
        {currentTab === 2 && (
             <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                     <CardHeader 
                         title="AI Prediction Model" 
                         subheader="7-Day Predicted vs Actual Production"
                         titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                     />
                     <CardContent className="h-[400px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={predictionData}>
                                 <defs>
                                     <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                                         <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                                     </linearGradient>
                                     <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor={THEME.secondary} stopOpacity={0.3}/>
                                         <stop offset="95%" stopColor={THEME.secondary} stopOpacity={0}/>
                                     </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                 <Area type="monotone" dataKey="actual" stroke={THEME.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual (kW)" />
                                 <Area type="monotone" dataKey="predicted" stroke={THEME.secondary} strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted (kW)" />
                             </AreaChart>
                         </ResponsiveContainer>
                         <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                 <span className="font-semibold text-emerald-900 text-sm">Model Accuracy</span>
                             </div>
                             <span className="text-sm text-emerald-700 font-medium">MAPE: 2.3% (Excellent)</span>
                         </div>
                     </CardContent>
                </DashboardCard>
             </div>
        )}

        {/* Tab 4: Forecast */}
        {currentTab === 3 && (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                         title="7-Day Generation Forecast" 
                         subheader="Based on weather patterns"
                         titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                     />
                     <CardContent className="h-[350px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={forecastData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend />
                                 <Bar dataKey="forecast" fill={THEME.primary} name="Forecasted (kW)" radius={[6, 6, 0, 0]} />
                             </BarChart>
                         </ResponsiveContainer>
                         
                         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Avg Forecast</p>
                                <p className="text-2xl font-bold text-slate-800">520 kW</p>
                            </div>
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                                <p className="text-xs text-orange-600 uppercase font-semibold">Peak Forecast</p>
                                <p className="text-2xl font-bold text-orange-600">545 kW</p>
                            </div>
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                                <p className="text-xs text-emerald-600 uppercase font-semibold">Confidence</p>
                                <p className="text-2xl font-bold text-emerald-600">94%</p>
                            </div>
                         </div>
                     </CardContent>
                </DashboardCard>
            </div>
        )}
      </Box>

      {/* Weekly Trend Section */}
      <DashboardCard className="mt-8">
        <CardHeader 
            title="Weekly Trend Analysis" 
            subheader="Generation vs Consumption vs Surplus"
            avatar={<Activity className="text-emerald-500" />}
            titleTypographyProps={{variant:'h6', fontWeight:'bold'}}
        />
        <CardContent className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={weeklyTrendData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                     <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                     <Legend />
                     <Area type="monotone" dataKey="generation" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.2} name="Generation" />
                     <Area type="monotone" dataKey="consumption" stroke={THEME.secondary} fill={THEME.secondary} fillOpacity={0.2} name="Consumption" />
                     <Area type="monotone" dataKey="surplus" stroke={THEME.accent} fill={THEME.accent} fillOpacity={0.2} name="Surplus" />
                 </AreaChart>
             </ResponsiveContainer>
        </CardContent>
      </DashboardCard>
      
      {/* Footer */}
      <div className="mt-8 p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-sm">
         <div className="flex items-center gap-3">
             <div className="bg-emerald-100 p-2 rounded-full">
                <Wifi className="w-5 h-5 text-emerald-600 animate-pulse" />
             </div>
             <div>
                <p className="text-sm font-semibold text-slate-800">System Operational</p>
                <p className="text-xs text-slate-500">Last synced: Just now</p>
             </div>
         </div>
         <Chip 
            icon={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />} 
            label="Live Data Feed" 
            sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 600, border: '1px solid #a7f3d0' }}
         />
      </div>

    </div>
  )
}