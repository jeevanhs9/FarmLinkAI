// Demonstration / mock AI insight values only.
// These are NOT real-world predictions. When the ML API is connected,
// this file's shape (see aiService.getForecast in src/services/api.js)
// should be returned by the backend instead.

export const insightCrops = ['Tomato', 'Onion', 'Potato', 'Spinach', 'Carrot', 'Rice (Sona Masoori)', 'Banana', 'Mango (Alphonso)']
export const insightLocations = ['Bengaluru', 'Mysuru', 'Mandya', 'Tumkur', 'Kolar']
export const insightWindows = ['Next 1 Week', 'Next 2 Weeks', 'Next 30 Days']

const demandSeries = [
  { date: 'Aug 20', actual: 1800, predicted: 1750 },
  { date: 'Aug 22', actual: 2100, predicted: 2050 },
  { date: 'Aug 24', actual: 2400, predicted: 2500 },
  { date: 'Aug 26', actual: 2200, predicted: 2350 },
  { date: 'Aug 28', actual: 2600, predicted: 2700 },
  { date: 'Aug 30', actual: 3100, predicted: 3050 },
  { date: 'Sep 1', actual: null, predicted: 3450 },
]

export function getForecast(crop, location, windowLabel) {
  // Deterministic pseudo-variation so different filter combinations
  // produce slightly different (but stable) demo numbers.
  const seed = (crop.length * 7 + location.length * 3 + windowLabel.length) % 5
  const demandLevels = ['Low', 'Medium', 'Medium', 'High', 'High']
  const demand = demandLevels[seed]
  const basePrice = 20 + (crop.charCodeAt(0) % 15)
  return {
    crop, location, window: windowLabel,
    demand,
    priceRange: [basePrice + seed, basePrice + seed + 4],
    recommendedQuantity: 250 + seed * 40,
    bestMarket: `${location} ${['North', 'South', 'East', 'Central', 'West'][seed]}`,
    bestWindow: `Next ${seed + 2} Days`,
    changePct: 18 + seed * 5,
    series: demandSeries.map((d, i) => ({
      ...d,
      predicted: Math.round(d.predicted * (0.85 + seed * 0.08)),
      actual: d.actual ? Math.round(d.actual * (0.85 + seed * 0.06)) : null,
    })),
  }
}

export const priceTrend = [
  { date: 'Aug 1', market: 27, farmlink: 30 },
  { date: 'Aug 10', market: 26, farmlink: 29 },
  { date: 'Aug 20', market: 28, farmlink: 31 },
  { date: 'Aug 30', market: 29, farmlink: 30 },
  { date: 'Sep 10', market: 27, farmlink: 30 },
  { date: 'Sep 18', market: 28, farmlink: 30 },
]

export const topCrops = [
  { name: 'Tomato', volume: 2450 },
  { name: 'Onion', volume: 2100 },
  { name: 'Potato', volume: 1800 },
  { name: 'Spinach', volume: 1200 },
  { name: 'Carrot', volume: 900 },
]
