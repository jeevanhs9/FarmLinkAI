export const farmerPriceSeries = {
  Tomato: [{ day: 'Mon', price: 27 }, { day: 'Tue', price: 28 }, { day: 'Wed', price: 29 }, { day: 'Thu', price: 28 }, { day: 'Fri', price: 30 }, { day: 'Sat', price: 30 }, { day: 'Today', price: 30 }, { day: 'Next', price: 32, predicted: true }],
  'Green Chilli': [{ day: 'Mon', price: 36 }, { day: 'Tue', price: 37 }, { day: 'Wed', price: 38 }, { day: 'Thu', price: 38 }, { day: 'Fri', price: 39 }, { day: 'Sat', price: 40 }, { day: 'Today', price: 40 }, { day: 'Next', price: 43, predicted: true }],
}

export const nearbyMarketPrices = [
  { market: 'Kolar', tomato: 30, chilli: 40, reference: true },
  { market: 'Bengaluru', tomato: 32, chilli: 43 },
  { market: 'Tumakuru', tomato: 28, chilli: 38 },
  { market: 'Chikkaballapur', tomato: 29, chilli: 39 },
]

export const farmerForecast = { crop: 'Tomato', current: 30, predicted: 32, change: 6.7, demand: 'High', confidence: 78, quantity: 350, priceRange: [29, 32] }
