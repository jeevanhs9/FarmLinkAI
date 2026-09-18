// Order stage sequence used by OrderTimeline
export const ORDER_STAGES = ['Order Placed', 'Confirmed', 'Packed', 'Picked Up', 'In Transit', 'Delivered']

export const orders = [
  { id: 'ORD-1042', buyerId: 'b1', buyer: 'ABC Hostel', farmerId: 'f1', farmer: "Farmers' FPO, Kolar", product: 'Tomato', quantity: 120, unit: 'kg', total: 3960, stage: 'In Transit', placedOn: '2026-09-16', eta: '2026-09-19' },
  { id: 'ORD-1041', buyerId: 'b2', buyer: 'GreenTable Restaurants', farmerId: 'f2', farmer: 'Namma FPO, Chikkaballapur', product: 'Onion', quantity: 200, unit: 'kg', total: 4840, stage: 'Picked Up', placedOn: '2026-09-17', eta: '2026-09-20' },
  { id: 'ORD-1040', buyerId: 'b3', buyer: 'FreshMart Retail', farmerId: 'f3', farmer: 'Sri Sai FPO, Tumkur', product: 'Potato', quantity: 500, unit: 'kg', total: 10500, stage: 'Delivered', placedOn: '2026-09-10', eta: '2026-09-13' },
  { id: 'ORD-1039', buyerId: 'b1', buyer: 'ABC Hostel', farmerId: 'f4', farmer: 'Green Farms FPO', product: 'Spinach', quantity: 40, unit: 'kg', total: 792, stage: 'Confirmed', placedOn: '2026-09-17', eta: '2026-09-19' },
  { id: 'ORD-1038', buyerId: 'b4', buyer: 'Sunrise Grocers', farmerId: 'f6', farmer: 'Malnad Growers FPO', product: 'Banana', quantity: 150, unit: 'kg', total: 5460, stage: 'Delivered', placedOn: '2026-09-08', eta: '2026-09-11' },
  { id: 'ORD-1037', buyerId: 'b5', buyer: 'City Hospital Canteen', farmerId: 'f5', farmer: 'Krishna FPO, Mandya', product: 'Rice (Sona Masoori)', quantity: 300, unit: 'kg', total: 13230, stage: 'Delivered', placedOn: '2026-09-05', eta: '2026-09-09' },
  { id: 'ORD-1036', buyerId: 'b6', buyer: 'Spice Route Exports', farmerId: 'f7', farmer: 'Konkan Ridge FPO', product: 'Mango (Alphonso)', quantity: 100, unit: 'kg', total: 18900, stage: 'Packed', placedOn: '2026-09-17', eta: '2026-09-19' },
  { id: 'ORD-1035', buyerId: 'b2', buyer: 'GreenTable Restaurants', farmerId: 'f9', farmer: 'Erode Organic FPO', product: 'Organic Turmeric', quantity: 60, unit: 'kg', total: 5985, stage: 'Order Placed', placedOn: '2026-09-18', eta: '2026-09-21' },
  { id: 'ORD-1034', buyerId: 'b3', buyer: 'FreshMart Retail', farmerId: 'f8', farmer: 'Doddaballapur Dairy Coop', product: 'Milk (Cow)', quantity: 400, unit: 'litre', total: 21580, stage: 'Delivered', placedOn: '2026-09-02', eta: '2026-09-04' },
  { id: 'ORD-1033', buyerId: 'b7', buyer: 'Bloom Cafe Co.', farmerId: 'f1', farmer: "Farmers' FPO, Kolar", product: 'Green Chilli', quantity: 25, unit: 'kg', total: 1029, stage: 'Delivered', placedOn: '2026-08-29', eta: '2026-09-01' },
  { id: 'ORD-1032', buyerId: 'b8', buyer: 'Metro Wholesale Traders', farmerId: 'f10', farmer: 'Northern Plains FPO', product: 'Organic Wheat', quantity: 800, unit: 'kg', total: 30875, stage: 'Delivered', placedOn: '2026-08-25', eta: '2026-08-29' },
  { id: 'ORD-1031', buyerId: 'b1', buyer: 'ABC Hostel', farmerId: 'f2', farmer: 'Namma FPO, Chikkaballapur', product: 'Carrot', quantity: 60, unit: 'kg', total: 1622, stage: 'Delivered', placedOn: '2026-08-20', eta: '2026-08-23' },
]
