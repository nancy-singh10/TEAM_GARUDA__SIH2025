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
  Legend, ResponsiveContainer, Area, AreaChart, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts'
import { 
  Zap, TrendingUp, Gauge, AlertCircle, Wifi, 
  Activity, Cloud, CheckCircle2, AlertTriangle, LayoutDashboard 
} from "lucide-react"

// --- Types ---
interface AnimatedValues {
  frequency: number
  voltage: number
  load: number
  stability: number
}

interface HourlyLoadData {
  time: string
  demand: number
  supply: number
  renewable: number
}

interface FrequencyData {
  time: string
  frequency: number
  voltage: number
}

interface RegionData {
  name: string
  value: number
  demand: number
  supply: number
}

interface GridStabilityData {
  metric: string
  value: number
  max: number
}

interface DemandForecastData {
  hour: string
  actual: number
  forecast: number
  baseline: number
}

interface InterconnectionData {
  name: string
  value: number
}

interface GenerationSourcesData {
  source: string
  fossil: number
  hydro: number
  solar: number
  wind: number
}

// --- Data Constants ---
const hourlyLoadData: HourlyLoadData[] = [
  { time: '12 AM', demand: 420, supply: 450, renewable: 180 },
  { time: '3 AM', demand: 380, supply: 400, renewable: 150 },
  { time: '6 AM', demand: 520, supply: 550, renewable: 220 },
  { time: '9 AM', demand: 680, supply: 700, renewable: 380 },
  { time: '12 PM', demand: 750, supply: 760, renewable: 450 },
  { time: '3 PM', demand: 700, supply: 710, renewable: 420 },
  { time: '6 PM', demand: 820, supply: 830, renewable: 320 },
  { time: '9 PM', demand: 600, supply: 620, renewable: 120 },
]

const frequencyData: FrequencyData[] = [
  { time: '12:00', frequency: 50.02, voltage: 230 },
  { time: '02:00', frequency: 49.98, voltage: 229.5 },
  { time: '04:00', frequency: 50.01, voltage: 230.2 },
  { time: '06:00', frequency: 50.05, voltage: 230.8 },
  { time: '08:00', frequency: 49.97, voltage: 229.8 },
  { time: '10:00', frequency: 50.03, voltage: 230.5 },
  { time: '12:00', frequency: 50.00, voltage: 230.1 },
  { time: '14:00', frequency: 49.99, voltage: 230.0 },
  { time: '16:00', frequency: 50.02, voltage: 230.3 },
]

const regionData: RegionData[] = [
  { name: 'North Zone', value: 24, demand: 320, supply: 340 },
  { name: 'South Zone', value: 28, demand: 380, supply: 395 },
  { name: 'East Zone', value: 22, demand: 280, supply: 305 },
  { name: 'West Zone', value: 26, demand: 350, supply: 360 },
]

const gridStabilityData: GridStabilityData[] = [
  { metric: 'Frequency', value: 50.02, max: 50.5 },
  { metric: 'Voltage', value: 230, max: 250 },
  { metric: 'Load Factor', value: 85, max: 100 },
  { metric: 'Reserve Margin', value: 72, max: 100 },
  { metric: 'Renewable %', value: 45, max: 100 },
]

const demandForecastData: DemandForecastData[] = [
  { hour: '14:00', actual: 680, forecast: 700, baseline: 650 },
  { hour: '15:00', actual: 710, forecast: 720, baseline: 680 },
  { hour: '16:00', actual: 750, forecast: 740, baseline: 700 },
  { hour: '17:00', actual: 820, forecast: 810, baseline: 750 },
  { hour: '18:00', actual: 850, forecast: 860, baseline: 800 },
  { hour: '19:00', actual: 780, forecast: 790, baseline: 740 },
  { hour: '20:00', actual: 720, forecast: 730, baseline: 680 },
]

const interconnectionData: InterconnectionData[] = [
  { name: 'Local Gen', value: 35 },
  { name: 'Renewables', value: 30 },
  { name: 'Grid Import', value: 20 },
  { name: 'Reserve', value: 15 },
]

const generationSourcesData: GenerationSourcesData[] = [
  { source: '12 AM', fossil: 250, hydro: 80, solar: 0, wind: 120 },
  { source: '4 AM', fossil: 280, hydro: 70, solar: 0, wind: 50 },
  { source: '8 AM', fossil: 200, hydro: 80, solar: 120, wind: 150 },
  { source: '12 PM', fossil: 180, hydro: 90, solar: 240, wind: 250 },
  { source: '4 PM', fossil: 150, hydro: 85, solar: 200, wind: 275 },
  { source: '8 PM', fossil: 280, hydro: 75, solar: 0, wind: 265 },
]

// Theme Colors
const THEME = {
  primary: '#10b981', // Mint/Emerald Green (Global Actions)
  secondary: '#8b5cf6', // Soft Purple
  accent: '#d946ef', // Pink/Magenta
  violet: '#a855f7', // Violet
  background: '#f8fafc',
  cardBg: '#ffffff',
  textMain: '#1e293b',
  textMuted: '#64748b'
}

const COLORS = [THEME.violet, THEME.accent, THEME.secondary, '#f43f5e'];

export default function GridPageMUI() {
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({
    frequency: 0,
    voltage: 0,
    load: 0,
    stability: 0,
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
        frequency: 49.85 + Math.floor(340 * progress) / 1000,
        voltage: Math.floor(2280 * progress) / 10,
        load: Math.floor(8180 * progress) / 10,
        stability: Math.floor(945 * progress) / 10,
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues({
          frequency: 50.02,
          voltage: 230,
          load: 818,
          stability: 94.5,
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
  const CircularGauge = ({ value, max = 100, label }: { value: number; max?: number; label: string }) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const percentage = (value / max) * 100
    const strokeDashoffset = circumference - (percentage / 100) * circumference

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
            stroke={THEME.violet}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">{value.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3">
            <div className="bg-violet-500 p-2 rounded-lg text-white shadow-violet-200 shadow-lg">
                <Zap className="w-6 h-6 animate-pulse" style={{ animationDuration: '2s' }} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Grid Management</h1>
                <p className="text-sm text-slate-500">Real-time stability & load control</p>
            </div>
        </div>

        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm font-medium">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                <Wifi className="w-4 h-4 text-emerald-500" />
                Status: Stable
            </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Frequency Card */}
        <DashboardCard className="relative overflow-hidden group">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CircularGauge value={animatedValues.frequency} max={50.5} label="Hz" />
            <div className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
               Within Limits
            </div>
          </CardContent>
        </DashboardCard>

        {/* Voltage Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Grid Voltage</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.voltage.toFixed(1)} <span className="text-lg text-slate-400">V</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#f3e8ff', color: '#a855f7' }} variant="rounded">
                  <Zap size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Nominal Voltage</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 92 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#f3e8ff',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#a855f7' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Load Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Current Load</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.load.toFixed(0)} <span className="text-lg text-slate-400">MW</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#fae8ff', color: '#d946ef' }} variant="rounded">
                  <Activity size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Peak Demand</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 82 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#fae8ff',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#d946ef' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Stability Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Stability Index</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.stability.toFixed(1)} <span className="text-lg text-slate-400">%</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981' }} variant="rounded">
                  <CheckCircle2 size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">System Healthy</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 94 : 0} 
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
                aria-label="grid dashboard tabs"
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
                <Tab label="Load Profile" />
                <Tab label="Frequency & Voltage" />
                <Tab label="Regional Dist." />
                <Tab label="Generation Mix" />
            </Tabs>
        </Box>

        {/* Tab 1: Load Profile */}
        {currentTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                        title="Hourly Load & Supply" 
                        subheader="Demand vs Supply curve"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyLoadData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="demand" fill={THEME.violet} name="Demand (MW)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="supply" fill={THEME.accent} name="Supply (MW)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>

                <DashboardCard>
                    <CardHeader 
                        title="Demand Forecast" 
                        subheader="Predicted vs Actual Load"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={demandForecastData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="actual" stroke={THEME.violet} strokeWidth={3} dot={{r:4}} name="Actual" />
                                <Line type="monotone" dataKey="forecast" stroke={THEME.accent} strokeWidth={2} strokeDasharray="5 5" dot={{r:4}} name="Forecast" />
                                <Line type="monotone" dataKey="baseline" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} name="Baseline" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>
            </div>
        )}

        {/* Tab 2: Frequency & Voltage */}
        {currentTab === 1 && (
             <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                     <CardHeader 
                         title="Stability Monitoring" 
                         subheader="Frequency & Voltage fluctuations"
                         titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                     />
                     <CardContent className="h-[400px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={frequencyData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <YAxis yAxisId="left" domain={[49.8, 50.2]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <YAxis yAxisId="right" orientation="right" domain={[228, 232]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                 <Line yAxisId="left" type="monotone" dataKey="frequency" stroke={THEME.violet} strokeWidth={3} dot={{r:4}} name="Frequency (Hz)" />
                                 <Line yAxisId="right" type="monotone" dataKey="voltage" stroke={THEME.accent} strokeWidth={3} dot={{r:4}} name="Voltage (V)" />
                             </LineChart>
                         </ResponsiveContainer>
                     </CardContent>
                </DashboardCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <DashboardCard>
                        <CardHeader 
                            title="Grid Stability Metrics" 
                            titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                        />
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={90} data={gridStabilityData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Current" dataKey="value" stroke={THEME.violet} fill={THEME.violet} fillOpacity={0.5} />
                                    <Radar name="Max" dataKey="max" stroke={THEME.accent} fill={THEME.accent} fillOpacity={0.1} />
                                    <Legend />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                     </DashboardCard>

                     {/* Alerts Panel */}
                     <DashboardCard>
                        <CardHeader 
                            title="Active Alerts" 
                            avatar={<AlertTriangle className="text-orange-500" />}
                            titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                        />
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                    <div>
                                        <p className="font-semibold text-sm text-emerald-900">Frequency Normal</p>
                                        <p className="text-xs text-emerald-700">50.02 Hz</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                    <div>
                                        <p className="font-semibold text-sm text-emerald-900">Voltage Stable</p>
                                        <p className="text-xs text-emerald-700">230V Nominal</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <AlertTriangle className="text-amber-500 w-5 h-5" />
                                    <div>
                                        <p className="font-semibold text-sm text-amber-900">High Demand Warning</p>
                                        <p className="text-xs text-amber-700">Load at 82% Capacity</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                     </DashboardCard>
                </div>
             </div>
        )}

        {/* Tab 3: Regional Dist */}
        {currentTab === 2 && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                     <CardHeader 
                         title="Regional Load" 
                         subheader="Distribution across zones"
                         titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                     />
                     <CardContent className="h-[350px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie
                                     data={regionData}
                                     cx="50%"
                                     cy="50%"
                                     innerRadius={80}
                                     outerRadius={110}
                                     paddingAngle={5}
                                     dataKey="value"
                                 >
                                     {regionData.map((entry, index) => (
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
                        title="Zone Performance" 
                        subheader="Demand vs Supply Analysis"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent>
                        <div className="space-y-6">
                            {regionData.map((region, idx) => (
                                <div key={region.name} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-slate-700">{region.name}</span>
                                        <span className="text-violet-600 font-bold bg-violet-50 px-2 rounded">
                                            {region.demand} / {region.supply} MW
                                        </span>
                                    </div>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(region.value / 28) * 100} 
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
                                        <span>Load Factor: {((region.demand / region.supply) * 100).toFixed(1)}%</span>
                                        <span>Reserve: {region.supply - region.demand} MW</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </DashboardCard>
             </div>
        )}

        {/* Tab 4: Generation Mix */}
        {currentTab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                         title="Generation Mix" 
                         subheader="Source Contribution over 24h"
                         titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                     />
                     <CardContent className="h-[350px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={generationSourcesData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="source" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend />
                                 <Area type="monotone" dataKey="fossil" stackId="1" stroke={THEME.violet} fill={THEME.violet} fillOpacity={0.6} name="Fossil" />
                                 <Area type="monotone" dataKey="hydro" stackId="1" stroke={THEME.accent} fill={THEME.accent} fillOpacity={0.6} name="Hydro" />
                                 <Area type="monotone" dataKey="solar" stackId="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.6} name="Solar" />
                                 <Area type="monotone" dataKey="wind" stackId="1" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.6} name="Wind" />
                             </AreaChart>
                         </ResponsiveContainer>
                     </CardContent>
                </DashboardCard>

                <DashboardCard>
                    <CardHeader 
                         title="Energy Contribution" 
                         subheader="Current Grid Composition"
                         titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                     />
                     <CardContent className="h-[350px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie
                                     data={interconnectionData}
                                     cx="50%"
                                     cy="50%"
                                     innerRadius={80}
                                     outerRadius={110}
                                     paddingAngle={5}
                                     dataKey="value"
                                 >
                                     {interconnectionData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                 </Pie>
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend verticalAlign="middle" align="right" layout="vertical" />
                             </PieChart>
                         </ResponsiveContainer>
                     </CardContent>
                </DashboardCard>
            </div>
        )}
      </Box>

      {/* Footer */}
      <div className="mt-8 p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-sm">
         <div className="flex items-center gap-3">
             <div className="bg-emerald-100 p-2 rounded-full">
                <Wifi className="w-5 h-5 text-emerald-600 animate-pulse" />
             </div>
             <div>
                <p className="text-sm font-semibold text-slate-800">Grid Synchronized</p>
                <p className="text-xs text-slate-500">Last synced: Just now</p>
             </div>
         </div>
         <Chip 
            icon={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />} 
            label="Real-time Monitoring" 
            sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 600, border: '1px solid #a7f3d0' }}
         />
      </div>

    </div>
  )
}