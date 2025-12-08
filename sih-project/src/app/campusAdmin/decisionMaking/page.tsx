"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CampusAdminHeader from "@/components/CampusAdminHeader";
import { Sun, Wind, Zap, Home } from "lucide-react";

// Assuming these components exist based on file list, if not we fall back to icons
import { MorphingSun } from "@/components/MorphingSun";
import { Windmill } from "@/components/Windmill";

// --- Types ---
type EnergySource = "solar" | "wind" | "grid";
type EnergyDest = "load" | "grid" | "battery";

interface Flow {
    from: EnergySource;
    to: EnergyDest;
    amount: number;
    color: string;
}

interface Scenario {
    id: string;
    title: string;
    condition: string;
    description: string;
    values: {
        solar: number;
        wind: number;
        load: number;
        gridAvailable?: number; // purely for context, GRID capacity is usually infinite for simulation
    };
}

// --- Data: Decision Scenarios ---
const SCENARIOS: Scenario[] = [
    {
        id: "solar_dominant",
        title: "Solar Dominance",
        condition: "Solar > Load",
        description:
            "Solar generation is sufficient to meet the entire Load demand. Excess solar energy is exported to the Grid. Wind energy (if any) is also exported.",
        values: { solar: 100, wind: 20, load: 60 },
    },
    {
        id: "hybrid_re",
        title: "Hybrid Renewables",
        condition: "Solar < Load && (Solar + Wind) > Load",
        description:
            "Solar alone is not enough. Wind energy supplements Solar to meet the Load. The remaining excess energy is exported to the Grid.",
        values: { solar: 40, wind: 40, load: 70 },
    },
    {
        id: "grid_import",
        title: "Grid Import Required",
        condition: "(Solar + Wind) < Load",
        description:
            "Renewable generation is insufficient. The Grid supplies the deficit to ensure the Load is met.",
        values: { solar: 20, wind: 10, load: 80 },
    },
    {
        id: "night_wind",
        title: "Night (Wind Only)",
        condition: "Solar = 0 && Wind > Load",
        description:
            "At night, Solar is zero. Strong Wind generation meets the Load demand fully, with excess exported to the Grid.",
        values: { solar: 0, wind: 90, load: 50 },
    },
    {
        id: "all_sources_needed",
        title: "Peak Demand",
        condition: "Solar + Wind < Load (Grid Max)",
        description: "Demand is very high. Both Solar and Wind are fully utilized, and the Grid supplies the remaining significant load.",
        values: { solar: 30, wind: 20, load: 150 }
    }
];

export default function DecisionMakingPage() {
    const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);

    const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

    // --- Logic to Calculate Flows ---
    const calculateFlows = (s: Scenario): Flow[] => {
        const flows: Flow[] = [];
        const { solar, wind, load } = s.values;

        let loadRemaining = load;

        // Priority 1: Solar -> Load
        if (solar > 0) {
            const solarToLoad = Math.min(solar, loadRemaining);
            if (solarToLoad > 0) {
                flows.push({ from: "solar", to: "load", amount: solarToLoad, color: "#F59E0B" }); // Amber/Orange
                loadRemaining -= solarToLoad;
            }

            // Excess Solar -> Grid
            const solarExcess = solar - solarToLoad;
            if (solarExcess > 0) {
                flows.push({ from: "solar", to: "grid", amount: solarExcess, color: "#F59E0B" });
            }
        }

        // Priority 2: Wind -> Load
        if (wind > 0) {
            const windToLoad = Math.min(wind, loadRemaining);
            if (windToLoad > 0) {
                flows.push({ from: "wind", to: "load", amount: windToLoad, color: "#3B82F6" }); // Blue
                loadRemaining -= windToLoad;
            }

            // Excess Wind -> Grid
            const windExcess = wind - windToLoad;
            if (windExcess > 0) {
                flows.push({ from: "wind", to: "grid", amount: windExcess, color: "#3B82F6" });
            }
        }

        // Priority 3: Grid -> Load (Import)
        if (loadRemaining > 0) {
            flows.push({ from: "grid", to: "load", amount: loadRemaining, color: "#EF4444" }); // Red
        }

        return flows;
    };

    const flows = calculateFlows(activeScenario);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <CampusAdminHeader title="Smart Energy Decision Logic" />

            <main className="flex-1 container max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* Intro */}
                <section className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Decision Making Engine</h2>
                    <p className="text-muted-foreground w-full max-w-2xl">
                        Visualize how the system decides energy allocation in real-time based on generation and demand.
                        The logic prioritizes Renewables (Solar First, then Wind) before relying on the Grid.
                    </p>
                </section>

                {/* Control Tabs */}
                <Tabs defaultValue={SCENARIOS[0].id} onValueChange={setActiveScenarioId} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
                        {SCENARIOS.map((s) => (
                            <TabsTrigger key={s.id} value={s.id} className="py-3 px-2 text-wrap h-full">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="font-semibold">{s.title}</span>
                                    <span className="text-xs opacity-70 hidden sm:block">{s.condition}</span>
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Logic Details Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeScenario.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="h-full border-l-4 border-l-primary shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-primary">{activeScenario.title}</CardTitle>
                                        <CardDescription className="text-lg font-medium text-foreground/80 mt-2">
                                            Condition: <code className="bg-muted px-2 py-1 rounded">{activeScenario.condition}</code>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <p className="leading-relaxed text-muted-foreground">
                                            {activeScenario.description}
                                        </p>

                                        <div className="space-y-4 pt-4 border-t">
                                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Current Metric Values</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                <MetricRow
                                                    label="Solar Gen"
                                                    value={activeScenario.values.solar}
                                                    unit="kW"
                                                    icon={Sun}
                                                    color="text-amber-500"
                                                />
                                                <MetricRow
                                                    label="Wind Gen"
                                                    value={activeScenario.values.wind}
                                                    unit="kW"
                                                    icon={Wind}
                                                    color="text-blue-500"
                                                />
                                                <MetricRow
                                                    label="Load Demand"
                                                    value={activeScenario.values.load}
                                                    unit="kW"
                                                    icon={Home}
                                                    color="text-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Visualization Panel */}
                    <div className="lg:col-span-2 min-h-[500px] relative bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border shadow-inner overflow-hidden p-6 flex flex-col items-center justify-center">
                        <Diagram flows={flows} activeScenario={activeScenario} />
                    </div>

                </div>
            </main>
        </div>
    );
}

// --- Helper Components ---

interface MetricRowProps {
    label: string;
    value: number;
    unit: string;
    icon: React.ElementType;
    color: string;
}

function MetricRow({ label, value, unit, icon: Icon, color }: MetricRowProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-background border shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-muted ${color}`}>
                    <Icon size={18} />
                </div>
                <span className="font-medium">{label}</span>
            </div>
            <span className="font-bold text-lg">{value} <span className="text-sm text-muted-foreground font-normal">{unit}</span></span>
        </div>
    )
}

function Diagram({ flows, activeScenario }: { flows: Flow[], activeScenario: Scenario }) {
    return (
        <div className="relative w-full h-[500px] max-w-3xl">
            {/* -- Positions -- 
                Solar: Top Left
                Wind: Top Right
                Load: Bottom Center
                Grid: Center (or Far Right/Left? Let's put Grid in Center Top or Bottom)
            */}

            {/* NODES */}
            <NodePosition className="top-10 left-10 md:left-20" label="Solar Farm">
                <div className="w-24 h-24 flex items-center justify-center relative">
                    <Sun className="absolute w-full h-full text-amber-500 opacity-20 animate-pulse" />
                    <div className="scale-125"><MorphingSun /></div>
                    <div className="absolute -bottom-8 bg-background/80 backdrop-blur px-2 py-1 rounded border shadow text-sm font-bold">
                        {activeScenario.values.solar} kW
                    </div>
                </div>
            </NodePosition>

            <NodePosition className="top-10 right-10 md:right-20" label="Wind Farm">
                <div className="w-24 h-24 flex items-center justify-center relative">
                    <Wind className="absolute w-full h-full text-blue-500 opacity-20 animate-pulse" />
                    <div className="scale-75"><Windmill /></div>
                    <div className="absolute -bottom-8 bg-background/80 backdrop-blur px-2 py-1 rounded border shadow text-sm font-bold">
                        {activeScenario.values.wind} kW
                    </div>
                </div>
            </NodePosition>

            {/* Grid Node */}
            <NodePosition className="bottom-20 left-10 md:left-32" label="Main Grid">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-slate-400 relative shadow-xl z-10">
                    <Zap className="w-10 h-10 text-slate-600 dark:text-slate-400" fill="currentColor" />
                    {/* Compute Net Grid Interaction */}
                    <GridStatusBadge flows={flows} />
                </div>
            </NodePosition>

            {/* Load Node */}
            <NodePosition className="bottom-20 right-10 md:right-32" label="Campus Load">
                <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500 relative shadow-2xl z-10">
                    <Home className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                        DEMAND
                    </div>
                    <div className="absolute -bottom-8 bg-background/80 backdrop-blur px-2 py-1 rounded border shadow text-sm font-bold">
                        {activeScenario.values.load} kW
                    </div>
                </div>
            </NodePosition>

            {/* CONNECTING LINES & ANIMATIONS */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
                    </marker>
                </defs>

                {/* Paths - Coordinates need to be roughly aligned with NodePositions above
                    We can hardcode percentages for responsiveness 
                    Solar: 15% 15%
                    Wind: 85% 15%
                    Grid: 25% 85%
                    Load: 75% 85%
                */}

                {/* Solar -> Load */}
                <FlowPath from={{ x: '15%', y: '15%' }} to={{ x: '75%', y: '85%' }}
                    active={flows.some(f => f.from === 'solar' && f.to === 'load')}
                    color="#F59E0B" />

                {/* Solar -> Grid */}
                <FlowPath from={{ x: '15%', y: '15%' }} to={{ x: '25%', y: '85%' }}
                    active={flows.some(f => f.from === 'solar' && f.to === 'grid')}
                    color="#F59E0B" dashed />

                {/* Wind -> Load */}
                <FlowPath from={{ x: '85%', y: '15%' }} to={{ x: '75%', y: '85%' }}
                    active={flows.some(f => f.from === 'wind' && f.to === 'load')}
                    color="#3B82F6" />

                {/* Wind -> Grid */}
                <FlowPath from={{ x: '85%', y: '15%' }} to={{ x: '25%', y: '85%' }}
                    active={flows.some(f => f.from === 'wind' && f.to === 'grid')}
                    color="#3B82F6" dashed />

                {/* Grid -> Load */}
                <FlowPath from={{ x: '25%', y: '85%' }} to={{ x: '75%', y: '85%' }}
                    active={flows.some(f => f.from === 'grid' && f.to === 'load')}
                    color="#EF4444" width={4} />

            </svg>

            {/* Particles (The moving dots) */}
            {flows.map((flow, i) => (
                <ParticleSystem key={i} flow={flow} />
            ))}

        </div>
    )
}

function NodePosition({ children, className, label }: { children: React.ReactNode, className: string, label: string }) {
    return (
        <div className={`absolute flex flex-col items-center gap-2 ${className}`}>
            <span className="font-semibold text-sm uppercase tracking-wide text-muted-foreground bg-background/50 backdrop-blur px-2 rounded">{label}</span>
            {children}
        </div>
    )
}

function GridStatusBadge({ flows }: { flows: Flow[] }) {
    const importFlow = flows.find(f => f.from === 'grid' && f.to === 'load')?.amount || 0;
    const exportFlow = flows.filter(f => f.to === 'grid').reduce((acc, curr) => acc + curr.amount, 0);

    if (importFlow > 0) return <div className="absolute -bottom-8 text-red-500 font-bold bg-background shadow px-2 py-1 rounded border">Importing {importFlow} kW</div>
    if (exportFlow > 0) return <div className="absolute -bottom-8 text-green-500 font-bold bg-background shadow px-2 py-1 rounded border">Exporting {exportFlow} kW</div>
    return <div className="absolute -bottom-8 text-muted-foreground font-bold bg-background shadow px-2 py-1 rounded border">Idle</div>
}

function FlowPath({ from, to, active, color, dashed, width = 2 }: { from: { x: string, y: string }, to: { x: string, y: string }, active: boolean, color: string, dashed?: boolean, width?: number }) {
    if (!active) return (
        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--border)" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
    );

    return (
        <motion.line
            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={color}
            strokeWidth={width}
            strokeDasharray={dashed ? "10,10" : "none"}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        />
    )
}

function ParticleSystem({ flow }: { flow: Flow }) {
    // Generate particles based on amount
    const particleCount = Math.max(1, Math.min(5, Math.ceil(flow.amount / 15)));
    // Example positions (Mapping node logic from CSS to JS roughly)
    // S: 15,15 | W: 85,15 | G: 25,85 | L: 75,85

    const getCoords = (type: EnergySource | EnergyDest) => {
        switch (type) {
            case 'solar': return { x: '15%', y: '15%' };
            case 'wind': return { x: '85%', y: '15%' };
            case 'grid': return { x: '25%', y: '85%' };
            case 'load': return { x: '75%', y: '85%' };
            default: return { x: '50%', y: '50%' };
        }
    }

    const start = getCoords(flow.from);
    const end = getCoords(flow.to);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full shadow-lg z-20"
                    style={{
                        backgroundColor: flow.color,
                        boxShadow: `0 0 10px ${flow.color}`
                    }}
                    initial={{ left: start.x, top: start.y, opacity: 0 }}
                    animate={{
                        left: [start.x, end.x],
                        top: [start.y, end.y],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.4
                    }}
                />
            ))}
        </div>
    )
}
