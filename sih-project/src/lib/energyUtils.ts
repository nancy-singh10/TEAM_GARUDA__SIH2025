
export interface EnergyDataPoint {
  time: string;
  solar: number;
  wind: number;
  consumption: number;
  battery: number;
}

export function generateEnergyData(
  minSolar: number,
  maxSolar: number,
  minWind: number,
  maxWind: number,
  batteryStart: number
): EnergyDataPoint[] {
  const data: EnergyDataPoint[] = [];
  
  // Generate for 24 hours
  for (let i = 0; i < 24; i++) {
    const hour = i;
    let solar = 0;
    
    // Solar logic: 0 before 6 and after 18. Peak around 12-14.
    if (hour >= 6 && hour <= 18) {
      // Parabolic curve for solar
      const peakHour = 12;
      const spread = 6; // Standard deviation-ish
      const normalizedTime = (hour - peakHour) / spread;
      const curve = Math.exp(-0.5 * normalizedTime * normalizedTime);
      
      // Randomize the peak for this specific hour within min/max bounds scaled by the curve
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 variation
      solar = maxSolar * curve * randomFactor;
      
      // Clamp
      solar = Math.max(minSolar, Math.min(maxSolar, solar));
      if (solar < 0.1) solar = 0;
    }

    // Wind logic: More random, but maybe higher at night or consistent
    const windRandom = Math.random();
    let wind = minWind + (maxWind - minWind) * windRandom;
    
    // Add some "gustiness" or trends (e.g., higher in evening)
    if (hour > 16 || hour < 5) {
        wind *= 1.2;
    }
    wind = Math.min(maxWind, wind);

    // Consumption logic (Typical residential/campus curve: low at night, peak morning, peak evening)
    // Base load + activity
    let consumption = 10 + Math.random() * 5; // Base
    if (hour >= 8 && hour <= 17) consumption += 20; // Work day
    if (hour >= 18 && hour <= 22) consumption += 15; // Evening activity
    
    // Battery logic (Simple simulation)
    // If generation > consumption, charge. Else discharge.
    // This is a cumulative calculation, but for a static snapshot we might just simulate a trend
    // Let's just make it fluctuate slightly from the start value for the "snapshot" purpose, 
    // or actually simulate the flow if we want it to look real.
    // For the graph, we usually plot generation/consumption. Battery level is usually a separate metric or a secondary axis.
    // The prompt asks for "battery percentage" as input. I'll treat it as the *current* level or average level.
    // Let's just return it as a value that might change slightly.
    
    const battery = Math.max(0, Math.min(100, batteryStart + (Math.random() * 10 - 5)));

    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      solar: parseFloat(solar.toFixed(2)),
      wind: parseFloat(wind.toFixed(2)),
      consumption: parseFloat(consumption.toFixed(2)),
      battery: parseFloat(battery.toFixed(2))
    });
  }

  return data;
}
