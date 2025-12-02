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
  Wind, Zap, TrendingUp, Gauge, AlertCircle, Wifi, 
  Activity, Cloud, LayoutDashboard 
} from "lucide-react"

// --- Types ---
interface AnimatedValues {
  efficiency: number
  generation: number
  windSpeed: number
  power: number
}

interface HourlyData {
  time: string
  production: number
  forecast: number
}

interface HourlyDetailedData {
  hour: string
  production: number
  windSpeed: number
}

interface TurbineData {
  name: string
  value: number
  kw: number
  status: string
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
  { time: '12-3 AM', production: 150, forecast: 160 },
  { time: '3-6 AM', production: 280, forecast: 290 },
  { time: '6-9 AM', production: 450, forecast: 460 },
  { time: '9-12 PM', production: 320, forecast: 330 },
  { time: '12-3 PM', production: 280, forecast: 290 },
  { time: '3-6 PM', production: 380, forecast: 390 },
  { time: '6-9 PM', production: 520, forecast: 530 },
  { time: '9-12 AM', production: 380, forecast: 390 },
]

const hourlyDetailedData: HourlyDetailedData[] = [
  { hour: '12 AM', production: 120, windSpeed: 4.2 },
  { hour: '3 AM', production: 250, windSpeed: 5.8 },
  { hour: '6 AM', production: 380, windSpeed: 7.2 },
  { hour: '9 AM', production: 320, windSpeed: 6.5 },
  { hour: '12 PM', production: 280, windSpeed: 5.9 },
  { hour: '3 PM', production: 350, windSpeed: 6.8 },
  { hour: '6 PM', production: 480, windSpeed: 8.1 },
  { hour: '9 PM', production: 400, windSpeed: 7.5 },
]

const turbineData: TurbineData[] = [
  { name: 'Turbine A', value: 28, kw: 380, status: 'Active' },
  { name: 'Turbine B', value: 24, kw: 325, status: 'Active' },
  { name: 'Turbine C', value: 26, kw: 350, status: 'Active' },
  { name: 'Turbine D', value: 22, kw: 295, status: 'Maintenance' },
]

const predictionData: PredictionData[] = [
  { date: 'Jan 1', actual: 380, predicted: 390 },
  { date: 'Jan 2', actual: 420, predicted: 415 },
  { date: 'Jan 3', actual: 350, predicted: 360 },
  { date: 'Jan 4', actual: 480, predicted: 475 },
  { date: 'Jan 5', actual: 450, predicted: 455 },
  { date: 'Jan 6', actual: 410, predicted: 420 },
  { date: 'Jan 7', actual: 520, predicted: 515 },
]

const forecastData: ForecastData[] = [
  { date: 'Jan 8', forecast: 490 },
  { date: 'Jan 9', forecast: 530 },
  { date: 'Jan 10', forecast: 550 },
  { date: 'Jan 11', forecast: 520 },
  { date: 'Jan 12', forecast: 480 },
  { date: 'Jan 13', forecast: 510 },
  { date: 'Jan 14', forecast: 560 },
]

const weeklyTrendData: WeeklyTrendData[] = [
  { day: 'Mon', generation: 3200, consumption: 2800, surplus: 400 },
  { day: 'Tue', generation: 3600, consumption: 3000, surplus: 600 },
  { day: 'Wed', generation: 2900, consumption: 2700, surplus: 200 },
  { day: 'Thu', generation: 4100, consumption: 3200, surplus: 900 },
  { day: 'Fri', generation: 3800, consumption: 2950, surplus: 850 },
  { day: 'Sat', generation: 3400, consumption: 2600, surplus: 800 },
  { day: 'Sun', generation: 3900, consumption: 2800, surplus: 1100 },
]

// Theme Colors (Global Dashboard Theme)
const THEME = {
  primary: '#10b981', // Mint/Emerald Green (Global Actions)
  secondary: '#8b5cf6', // Soft Purple
  accent: '#f59e0b', // Orange
  blue: '#0ea5e9', // Sky Blue (Wind Specific)
  cyan: '#06b6d4', // Cyan (Wind Specific)
  background: '#f8fafc', 
  cardBg: '#ffffff',
  textMain: '#1e293b',
  textMuted: '#64748b'
}

const COLORS = [THEME.blue, THEME.cyan, THEME.primary, THEME.accent];

export default function WindPageMUI() {
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({
    efficiency: 0,
    generation: 0,
    windSpeed: 0,
    power: 0,
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
        efficiency: Math.floor(856 * progress) / 10,
        generation: Math.floor(835 * progress * 10) / 10,
        windSpeed: Math.floor(72 * progress) / 10,
        power: Math.floor(1350 * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues({
          efficiency: 85.6,
          generation: 835,
          windSpeed: 7.2,
          power: 1350,
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
            stroke={THEME.blue}
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
            <div className="bg-sky-500 p-2 rounded-lg text-white shadow-sky-200 shadow-lg">
                <Wind className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Wind Management</h1>
                <p className="text-sm text-slate-500">Turbine monitoring & wind forecasting</p>
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
            <div className="mt-2 text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
               Optimal Rotation
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
               <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0284c7' }} variant="rounded">
                  <Zap size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Wind Generation</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 85 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#e0f2fe',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#0284c7' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Wind Speed Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Wind Speed</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.windSpeed.toFixed(1)} <span className="text-lg text-slate-400">m/s</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#ecfeff', color: '#0891b2' }} variant="rounded">
                  <Wind size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Moderate Breeze</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 75 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#ecfeff',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#0891b2' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Total Power Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Total Power</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.power.toFixed(0)} <span className="text-lg text-slate-400">W</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981' }} variant="rounded">
                  <Activity size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Grid Injection</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 95 : 0} 
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
                aria-label="wind dashboard tabs"
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
                <Tab label="Turbine Status" />
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
                                <Bar dataKey="production" fill={THEME.blue} name="Actual (kWh)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="forecast" fill={THEME.cyan} fillOpacity={0.6} name="Forecast (kWh)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>

                <DashboardCard>
                    <CardHeader 
                        title="Wind Speed Analysis" 
                        subheader="Correlation with Energy Production"
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
                                <Line yAxisId="left" type="monotone" dataKey="production" stroke={THEME.blue} strokeWidth={3} dot={{r:4}} name="Output (kW)" />
                                <Line yAxisId="right" type="monotone" dataKey="windSpeed" stroke={THEME.cyan} strokeWidth={2} dot={{r:4}} name="Wind (m/s)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>
            </div>
        )}

        {/* Tab 2: Turbine Status */}
        {currentTab === 1 && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                        title="Turbine Contribution" 
                        subheader="Power share by unit"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie
                                     data={turbineData}
                                     cx="50%"
                                     cy="50%"
                                     innerRadius={80}
                                     outerRadius={110}
                                     paddingAngle={5}
                                     dataKey="value"
                                 >
                                     {turbineData.map((entry, index) => (
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
                        title="Unit Status" 
                        subheader="Real-time operational metrics"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent>
                        <div className="space-y-6">
                            {turbineData.map((turbine, idx) => (
                                <div key={turbine.name} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-700">{turbine.name}</span>
                                            <Chip 
                                                label={turbine.status} 
                                                size="small"
                                                sx={{ 
                                                    fontSize: '0.7rem',
                                                    height: '20px',
                                                    bgcolor: turbine.status === 'Active' ? '#f0fdf4' : '#fefce8',
                                                    color: turbine.status === 'Active' ? '#15803d' : '#a16207',
                                                    border: '1px solid',
                                                    borderColor: turbine.status === 'Active' ? '#bbf7d0' : '#fef08a'
                                                }} 
                                            />
                                        </div>
                                        <span className="text-sky-600 font-bold bg-sky-50 px-2 rounded">{turbine.kw} kW</span>
                                    </div>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(turbine.value / 28) * 100} 
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
                                        <span>{turbine.value}% of max</span>
                                        <span>{((turbine.kw / 1350) * 100).toFixed(1)}% total</span>
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
                                         <stop offset="5%" stopColor={THEME.blue} stopOpacity={0.3}/>
                                         <stop offset="95%" stopColor={THEME.blue} stopOpacity={0}/>
                                     </linearGradient>
                                     <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor={THEME.cyan} stopOpacity={0.3}/>
                                         <stop offset="95%" stopColor={THEME.cyan} stopOpacity={0}/>
                                     </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                 <Area type="monotone" dataKey="actual" stroke={THEME.blue} strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual (kW)" />
                                 <Area type="monotone" dataKey="predicted" stroke={THEME.cyan} strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted (kW)" />
                             </AreaChart>
                         </ResponsiveContainer>
                         <div className="mt-4 p-4 bg-sky-50 border border-sky-100 rounded-lg flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                                 <span className="font-semibold text-sky-900 text-sm">Model Accuracy</span>
                             </div>
                             <span className="text-sm text-sky-700 font-medium">MAPE: 3.2% (Excellent)</span>
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
                         subheader="Based on wind patterns"
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
                                 <Bar dataKey="forecast" fill={THEME.blue} name="Forecasted (kW)" radius={[6, 6, 0, 0]} />
                             </BarChart>
                         </ResponsiveContainer>
                         
                         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Avg Forecast</p>
                                <p className="text-2xl font-bold text-slate-800">520 kW</p>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <p className="text-xs text-blue-600 uppercase font-semibold">Peak Forecast</p>
                                <p className="text-2xl font-bold text-blue-600">560 kW</p>
                            </div>
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                                <p className="text-xs text-emerald-600 uppercase font-semibold">Confidence</p>
                                <p className="text-2xl font-bold text-emerald-600">92%</p>
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
                     <Area type="monotone" dataKey="generation" stroke={THEME.blue} fill={THEME.blue} fillOpacity={0.2} name="Generation" />
                     <Area type="monotone" dataKey="consumption" stroke={THEME.cyan} fill={THEME.cyan} fillOpacity={0.2} name="Consumption" />
                     <Area type="monotone" dataKey="surplus" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.2} name="Surplus" />
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