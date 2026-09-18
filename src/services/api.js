// Service abstraction layer.
//
// Every function here currently reads/writes the in-memory mock data in
// src/data/. The function signatures are written the way the real calls
// to the Flask REST API will look, so that swapping the body of each
// function for a `fetch('/api/...')` call is the only change needed later.
//
// Example of the intended future shape:
//   export async function listProducts(filters) {
//     const res = await fetch(`/api/products?${new URLSearchParams(filters)}`)
//     return res.json()
//   }

import { products as seedProducts } from '../data/products'
import { orders as seedOrders, ORDER_STAGES } from '../data/orders'
import { getForecast } from '../data/insights'

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms))

export const productService = {
  async list() {
    await delay()
    return seedProducts
  },
}

export const orderService = {
  stages: ORDER_STAGES,
  async list() {
    await delay()
    return seedOrders
  },
}

export const aiService = {
  async forecast(crop, location, windowLabel) {
    await delay(300)
    return getForecast(crop, location, windowLabel)
  },
}
