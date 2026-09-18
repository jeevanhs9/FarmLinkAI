export const logisticsOrders = [
  { id: 'FL-1021', stopId: 'kolar', buyer: 'Bengaluru North Buyer', product: 'Tomato', quantityKg: 280, pricePerKg: 30, status: 'Packed', eta: '03:10 PM' },
  { id: 'FL-1024', stopId: 'kolar', buyer: 'Bengaluru North Buyer', product: 'Onion', quantityKg: 170, pricePerKg: 22, status: 'Packed', eta: '03:10 PM' },
  { id: 'FL-1028', stopId: 'chikkaballapur', buyer: 'Bengaluru East Buyer', product: 'Potato', quantityKg: 360, pricePerKg: 20, status: 'Picked Up', eta: '05:00 PM' },
  { id: 'FL-1030', stopId: 'tumakuru', buyer: 'Bengaluru Central Buyer', product: 'Green Chilli', quantityKg: 90, pricePerKg: 40, status: 'Confirmed', eta: '04:00 PM' },
  { id: 'FL-1032', stopId: 'north', buyer: 'Bengaluru East Buyer', product: 'Tomato', quantityKg: 280, pricePerKg: 30, status: 'In Transit', eta: '05:00 PM' },
  { id: 'FL-1034', stopId: 'east', buyer: 'Bengaluru East Buyer', product: 'Spinach', quantityKg: 270, pricePerKg: 18, status: 'Confirmed', eta: '05:00 PM' },
]

export const logisticsStops = [
  { id: 'kolar', sequence: 1, type: 'pickup', name: 'Kolar FPO', location: 'Kolar, Karnataka', position: { lat: 13.1358, lng: 78.1326 }, orderIds: ['FL-1021', 'FL-1024'], eta: '08:15 AM', status: 'Packed' },
  { id: 'chikkaballapur', sequence: 2, type: 'pickup', name: 'Chikkaballapur FPO', location: 'Chikkaballapur, Karnataka', position: { lat: 13.435, lng: 77.7315 }, orderIds: ['FL-1028'], eta: '10:00 AM', status: 'Picked Up' },
  { id: 'tumakuru', sequence: 3, type: 'pickup', name: 'Tumakuru FPO', location: 'Tumakuru, Karnataka', position: { lat: 13.3409, lng: 77.101 }, orderIds: ['FL-1030'], eta: '12:15 PM', status: 'Confirmed' },
  { id: 'north', sequence: 4, type: 'delivery', name: 'Bengaluru North Buyer', location: 'Hebbal, Bengaluru', position: { lat: 13.0358, lng: 77.597 }, orderIds: ['FL-1021', 'FL-1024'], eta: '03:10 PM', status: 'In Transit' },
  { id: 'central', sequence: 5, type: 'delivery', name: 'Bengaluru Central Buyer', location: 'Vasanth Nagar, Bengaluru', position: { lat: 12.986, lng: 77.594 }, orderIds: ['FL-1030'], eta: '04:00 PM', status: 'Upcoming' },
  { id: 'east', sequence: 6, type: 'delivery', name: 'Bengaluru East Buyer', location: 'Mahadevapura, Bengaluru', position: { lat: 12.993, lng: 77.697 }, orderIds: ['FL-1028', 'FL-1032', 'FL-1034'], eta: '05:00 PM', status: 'Confirmed' },
]

export const routeComparison = {
  baseline: { distance: '186 km', time: '6h 20m', cost: 4800 },
  optimized: { distance: '128 km', time: '4h 35m', cost: 3450 },
}

export const logisticsCounts = { orders: 6, stops: 6, fpos: 3, buyers: 3 }

export const totalRouteQuantityKg = logisticsOrders.reduce((total, order) => total + order.quantityKg, 0)

export function getStopOrders(stop) { return logisticsOrders.filter((order) => stop.orderIds.includes(order.id)) }
