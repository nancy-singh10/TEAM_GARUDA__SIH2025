import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import the new chart components we will create
import PerformanceChart from "./performance-chart";
import GenerationChart from "./generation-chart";

// --- Mock Data ---
// In a real app, you would fetch this from your backend API
const performanceData = [
  { name: 'Sep 24', Consumption: 950, 'Solar Gen': 800, 'Wind Gen': 200 },
  { name: 'Sep 25', Consumption: 980, 'Solar Gen': 850, 'Wind Gen': 210 },
  { name: 'Sep 26', Consumption: 900, 'Solar Gen': 780, 'Wind Gen': 190 },
  { name: 'Sep 27', Consumption: 1000, 'Solar Gen': 900, 'Wind Gen': 220 },
  { name: 'Sep 28', Consumption: 920, 'Solar Gen': 810, 'Wind Gen': 200 },
  { name: 'Sep 29', Consumption: 880, 'Solar Gen': 750, 'Wind Gen': 180 },
];

const generationData = [
  { name: 'Solar', value: 4500, fill: '#F9A825' }, // Yellow
  { name: 'Wind', value: 1210, fill: '#0288D1' }, // Blue
];

const financialData = {
  totalEnergyCost: 439655,
  gridExportRevenue: 0,
  netSavings: 868282,
};
// --- End Mock Data ---


export default async function AnalyticsPage() {
  // In a real app, you would fetch data here:
  // const data = await getAnalyticsData();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-[#0d1117] text-white">
      {/* 1. Header with Tabs */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orchestration Hub</h2>
        <div className="flex items-center space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700">Switch to Consumer View</Button>
        </div>
      </div>

      {/* 2. Tab Navigation */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="bg-[#161b22] border border-[#30363d]">
          <TabsTrigger value="overview" className="text-gray-400">Overview</TabsTrigger>
          <TabsTrigger value="management" className="text-gray-400">Management</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#1f6feb] data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-gray-400">Alerts & Logs</TabsTrigger>
          <TabsTrigger value="automation" className="text-gray-400">Automation</TabsTrigger>
          <TabsTrigger value="settings" className="text-gray-400">Settings</TabsTrigger>
        </TabsList>

        {/* 3. Main Analytics Content */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            
            {/* Left Column: Performance Chart */}
            <Card className="lg:col-span-2 bg-[#161b22] border-[#30363d] text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  Performance Over Time
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {/* We can add Date Pickers here later */}
                  <Button className="bg-green-600 hover:bg-green-700">Export</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  {/* This is our new client component for the chart */}
                  <PerformanceChart data={performanceData} />
                </div>
              </CardContent>
            </Card>

            {/* Right Column: Financials & Generation Mix */}
            <Card className="bg-[#161b22] border-[#30363d] text-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  Financial & Source Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Financial Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Total Energy Cost</p>
                    <p className="text-2xl font-bold text-red-500">
                      ₹{financialData.totalEnergyCost.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Grid Export Revenue</p>
                    <p className="text-2xl font-bold">
                      ₹{financialData.gridExportRevenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Net Savings</p>
                    <p className="text-2xl font-bold text-green-500">
                      ₹{financialData.netSavings.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Generation Mix Chart */}
                <div>
                  <h3 className="text-lg font-medium text-center mb-2">Generation Mix</h3>
                  <div className="h-[250px] w-full">
                    {/* This is our new client component for the donut chart */}
                    <GenerationChart data={generationData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}