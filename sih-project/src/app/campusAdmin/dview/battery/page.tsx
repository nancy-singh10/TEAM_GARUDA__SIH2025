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
  Zap, TrendingUp, Gauge, AlertTriangle, Wifi, Activity, 
  CheckCircle2, Thermometer, Battery, LayoutDashboard 
} from "lucide-react"

// --- Types ---
interface AnimatedValues {
  soc: number
  voltage: number
  current: number
  temperature: number
  health: number
}

// --- Data Constants ---
const chargeDischargeData = [
  { time: '12 AM', charge: 5, discharge: 15, soc: 45 },
  { time: '3 AM', charge: 3, discharge: 8, soc: 52 },
  { time: '6 AM', charge: 20, discharge: 5, soc: 68 },
  { time: '9 AM', charge: 35, discharge: 10, soc: 78 },
  { time: '12 PM', charge: 40, discharge: 25, soc: 82 },
  { time: '3 PM', charge: 30, discharge: 35, soc: 72 },
  { time: '6 PM', charge: 15, discharge: 40, soc: 58 },
  { time: '9 PM', charge: 8, discharge: 12, soc: 48 },
]

const cellBalanceData = [
  { cell: 'Cell 1', voltage: 3.82, temp: 28 },
  { cell: 'Cell 2', voltage: 3.81, temp: 28.2 },
  { cell: 'Cell 3', voltage: 3.82, temp: 28.1 },
  { cell: 'Cell 4', voltage: 3.80, temp: 27.9 },
  { cell: 'Cell 5', voltage: 3.81, temp: 28.0 },
  { cell: 'Cell 6', voltage: 3.82, temp: 28.2 },
  { cell: 'Cell 7', voltage: 3.81, temp: 27.95 },
  { cell: 'Cell 8', voltage: 3.82, temp: 28.1 },
]

const temperatureData = [
  { time: '12:00', pack: 28.0, cell1: 28.1, cell8: 28.2 },
  { time: '02:00', pack: 26.5, cell1: 26.6, cell8: 26.8 },
  { time: '04:00', pack: 25.8, cell1: 25.9, cell8: 26.0 },
  { time: '06:00', pack: 27.2, cell1: 27.3, cell8: 27.5 },
  { time: '08:00', pack: 29.8, cell1: 29.9, cell8: 30.2 },
  { time: '10:00', pack: 31.5, cell1: 31.6, cell8: 32.0 },
  { time: '12:00', pack: 32.1, cell1: 32.2, cell8: 32.5 },
  { time: '14:00', pack: 31.2, cell1: 31.3, cell8: 31.6 },
]

const efficiencyData = [
  { hour: '0', roundTrip: 94.2, charge: 96.5, discharge: 97.8 },
  { hour: '4', roundTrip: 93.8, charge: 96.2, discharge: 97.5 },
  { hour: '8', roundTrip: 94.5, charge: 96.8, discharge: 98.0 },
  { hour: '12', roundTrip: 92.1, charge: 95.5, discharge: 96.8 },
  { hour: '16', roundTrip: 93.3, charge: 95.9, discharge: 97.2 },
  { hour: '20', roundTrip: 94.0, charge: 96.3, discharge: 97.6 },
]

const batteryHealthData = [
  { metric: 'Capacity', value: 95.2, max: 100 },
  { metric: 'Resistance', value: 82.5, max: 100 },
  { metric: 'Cycle Life', value: 88.0, max: 100 },
  { metric: 'Temperature', value: 91.5, max: 100 },
  { metric: 'Voltage Bal', value: 96.8, max: 100 },
]

const powerFlowData = [
  { name: 'Charging', value: 35 },
  { name: 'Discharging', value: 40 },
  { name: 'Idle', value: 25 },
]

// Theme Colors from your dashboard image
const THEME = {
  primary: '#10b981', // Mint/Emerald Green (Dashboard Button)
  secondary: '#8b5cf6', // Soft Purple (Grid Exchange)
  accent: '#f59e0b', // Orange (Solar/Renewable)
  blue: '#3b82f6', // Blue (Wind)
  background: '#f8fafc', // Very light gray/slate background
  cardBg: '#ffffff',
  textMain: '#1e293b',
  textMuted: '#64748b'
}

const COLORS = [THEME.primary, THEME.secondary, THEME.blue, THEME.accent];

export default function BatteryPageMUI() {
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({
    soc: 0,
    voltage: 0,
    current: 0,
    temperature: 0,
    health: 0,
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
        soc: Math.floor(825 * progress) / 10,
        voltage: Math.floor(4815 * progress) / 100,
        current: Math.floor(450 * progress) / 10,
        temperature: Math.floor(320 * progress) / 10,
        health: Math.floor(952 * progress) / 10,
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues({
          soc: 82.5,
          voltage: 48.15,
          current: 45.0,
          temperature: 32.0,
          health: 95.2,
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

  // Custom Circular Gauge adapted to Green Theme
  const CircularGauge = ({ value, max = 100, label }: { value: number; max?: number; label: string }) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const percentage = (value / max) * 100
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={THEME.primary}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">{value.toFixed(1)}<span className="text-sm">%</span></span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
        </div>
      </div>
    )
  }

  // --- Styled Components Helper ---
  const DashboardCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <Card 
      elevation={0} 
      className={`rounded-xl border border-slate-100 shadow-sm bg-white overflow-visible ${className}`}
    >
      {children}
    </Card>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      {/* Header Bar - Matching Dashboard Image */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg text-white shadow-emerald-200 shadow-lg">
                <Battery className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Battery Management</h1>
                <p className="text-sm text-slate-500">Campus Energy Management System</p>
            </div>
        </div>

        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm font-medium">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                <Wifi className="w-4 h-4" />
                IoT Status: Online
            </button>
        </div>
      </div>

      {/* Top Metrics Row - Matching Dashboard Cards Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        
        {/* SOC Card */}
        <DashboardCard className="relative overflow-hidden group">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Typography variant="subtitle2" className="text-slate-500 mb-2 font-medium">State of Charge</Typography>
            <CircularGauge value={animatedValues.soc} label="SOC" />
            <div className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
               Optimal Range
            </div>
          </CardContent>
        </DashboardCard>

        {/* Voltage Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Pack Voltage</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.voltage.toFixed(2)} <span className="text-lg text-slate-400">V</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#f0f9ff', color: '#0ea5e9' }} variant="rounded">
                  <Zap size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Bus Voltage Status</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 96 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#e0f2fe',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#0ea5e9' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Current Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Current Flow</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.current.toFixed(1)} <span className="text-lg text-slate-400">A</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#fdf4ff', color: '#d946ef' }} variant="rounded">
                  <Activity size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Discharging Phase</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 45 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#fae8ff',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#d946ef' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Temp Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Temperature</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.temperature.toFixed(1)} <span className="text-lg text-slate-400">°C</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#fff7ed', color: '#f97316' }} variant="rounded">
                  <Thermometer size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">Within Safe Limits</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 32 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#ffedd5',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#f97316' }
                }}
            />
          </CardContent>
        </DashboardCard>

        {/* Health Card */}
        <DashboardCard>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <Typography variant="subtitle2" className="text-slate-500 mb-1 font-medium">Battery SOH</Typography>
                 <Typography variant="h4" className="font-bold text-slate-800">
                    {animatedValues.health.toFixed(1)} <span className="text-lg text-slate-400">%</span>
                 </Typography>
               </div>
               <Avatar sx={{ bgcolor: '#ecfdf5', color: '#10b981' }} variant="rounded">
                  <CheckCircle2 size={20} />
               </Avatar>
            </div>
            <Typography variant="caption" className="text-slate-400">State of Health</Typography>
            <LinearProgress 
                variant="determinate" 
                value={chartAnimated ? 95 : 0} 
                className="mt-3 h-2 rounded-full"
                sx={{ 
                    backgroundColor: '#d1fae5',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' }
                }}
            />
          </CardContent>
        </DashboardCard>
      </div>

      {/* Main Content Area */}
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
                value={currentTab} 
                onChange={handleTabChange} 
                aria-label="dashboard tabs"
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
                <Tab label="Charge Profile" />
                <Tab label="Temperature Monitoring" />
                <Tab label="Cell Balance" />
                <Tab label="Health & Efficiency" />
            </Tabs>
        </Box>

        {/* Tab 1: Charge Profile */}
        {currentTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                        title="Charge & Discharge Rates" 
                        subheader="Amperage flow over 24 hours"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chargeDischargeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="charge" fill={THEME.primary} name="Charge (A)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="discharge" fill={THEME.secondary} name="Discharge (A)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>

                <DashboardCard>
                    <CardHeader 
                        title="Power Flow Distribution" 
                        subheader="Current system state analysis"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={powerFlowData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {powerFlowData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend verticalAlign="middle" align="right" layout="vertical" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>

                <DashboardCard className="lg:col-span-2">
                    <CardHeader 
                        title="State of Charge (SoC) Trend" 
                        subheader="Battery capacity over time"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chargeDischargeData}>
                                <defs>
                                    <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="soc" 
                                    stroke={THEME.primary} 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorSoc)" 
                                    name="SoC (%)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>
            </div>
        )}

        {/* Tab 2: Temperature */}
        {currentTab === 1 && (
             <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                         title="Thermal Monitoring" 
                         subheader="Pack and individual cell temperatures"
                         titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                     />
                     <CardContent className="h-[400px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={temperatureData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                 <YAxis axisLine={false} tickLine={false} />
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend />
                                 <Line type="monotone" dataKey="pack" stroke={THEME.primary} strokeWidth={3} dot={{r:4}} />
                                 <Line type="monotone" dataKey="cell1" stroke={THEME.accent} strokeWidth={2} dot={{r:4}} />
                                 <Line type="monotone" dataKey="cell8" stroke={THEME.blue} strokeWidth={2} dot={{r:4}} />
                             </LineChart>
                         </ResponsiveContainer>
                     </CardContent>
                </DashboardCard>
             </div>
        )}

        {/* Tab 3: Cells */}
        {currentTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <DashboardCard>
                    <CardHeader 
                        title="Cell Voltage Monitor" 
                        subheader="Individual cell performance"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent>
                        <div className="space-y-4">
                            {cellBalanceData.map((cell, idx) => (
                                <div key={cell.cell} className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-slate-700">{cell.cell}</span>
                                        <div className="flex gap-3">
                                            <span className="text-slate-600 font-medium">{cell.voltage.toFixed(2)}V</span>
                                            <span className="text-slate-400">|</span>
                                            <span className="text-slate-600 font-medium">{cell.temp.toFixed(1)}°C</span>
                                        </div>
                                    </div>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(cell.voltage / 4) * 100} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4,
                                            bgcolor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': { backgroundColor: THEME.primary }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </DashboardCard>

                <DashboardCard>
                    <CardHeader 
                        title="Health Radar" 
                        subheader="Multi-point diagnostic scan"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={120} data={batteryHealthData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar 
                                    name="Health Score" 
                                    dataKey="value" 
                                    stroke={THEME.primary} 
                                    fill={THEME.primary} 
                                    fillOpacity={0.5} 
                                />
                                <Radar 
                                    name="Target" 
                                    dataKey="max" 
                                    stroke={THEME.secondary} 
                                    fill={THEME.secondary} 
                                    fillOpacity={0.1} 
                                />
                                <Legend />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DashboardCard>
            </div>
        )}
        
        {/* Tab 4: Health & Efficiency */}
        {currentTab === 3 && (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
                 <DashboardCard>
                    <CardHeader 
                        title="Efficiency Analysis" 
                        subheader="Round-trip energy efficiency"
                        titleTypographyProps={{variant:'h6', fontWeight:'bold', color: 'text.primary'}}
                    />
                    <CardContent className="h-[400px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={efficiencyData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                                 <YAxis domain={[85, 100]} axisLine={false} tickLine={false} />
                                 <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                                 <Legend />
                                 <Line type="monotone" dataKey="roundTrip" stroke={THEME.primary} strokeWidth={3} />
                                 <Line type="monotone" dataKey="charge" stroke={THEME.secondary} strokeDasharray="5 5" />
                                 <Line type="monotone" dataKey="discharge" stroke={THEME.accent} strokeDasharray="5 5" />
                             </LineChart>
                         </ResponsiveContainer>
                    </CardContent>
                 </DashboardCard>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Cycles', val: '2,847', sub: 'Life exp: 8,000', color: 'text-emerald-500' },
                        { label: 'Capacity Rem.', val: '95.2%', sub: 'Nominal: 100Ah', color: 'text-purple-500' },
                        { label: 'Op. Hours', val: '12,456', sub: 'Since install', color: 'text-blue-500' }
                    ].map((stat, i) => (
                        <DashboardCard key={i}>
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                <Typography variant="caption" className="uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</Typography>
                                <Typography variant="h3" className={`font-bold my-2 ${stat.color}`}>{stat.val}</Typography>
                                <Typography variant="body2" className="text-slate-500">{stat.sub}</Typography>
                            </CardContent>
                        </DashboardCard>
                    ))}
                 </div>
            </div>
        )}

      </Box>

      {/* System Alerts Section */}
      <DashboardCard className="mt-8">
        <CardHeader 
            title="System Diagnostics" 
            subheader="Real-time alerts and warnings"
            avatar={<AlertTriangle className="text-orange-500" />}
            titleTypographyProps={{variant:'h6', fontWeight:'bold'}}
        />
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    <div>
                        <p className="font-semibold text-sm text-emerald-900">Temp Check</p>
                        <p className="text-xs text-emerald-700">32.0°C - Normal</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    <div>
                        <p className="font-semibold text-sm text-emerald-900">Cell Balance</p>
                        <p className="text-xs text-emerald-700">Max Δ: 0.02V</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    <div>
                        <p className="font-semibold text-sm text-emerald-900">Voltage</p>
                        <p className="text-xs text-emerald-700">48.15V - Stable</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <AlertTriangle className="text-yellow-600 w-5 h-5" />
                    <div>
                        <p className="font-semibold text-sm text-yellow-900">Maintenance</p>
                        <p className="text-xs text-yellow-700">Due in 5 months</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </DashboardCard>

    </div>
  )
}