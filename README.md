# FarmLink AI

**Direct markets. Smarter decisions. Better delivery.**

FarmLink AI is a district-level farm-to-market platform for smallholder farmers and FPOs. It unifies produce listings, buyer demand, AI-driven price signals, intelligent load pooling, disruption recovery, and delivery coordination into one end-to-end workflow — so a small harvest does not need to travel alone or sell below value.

> Built for **SAP Hackfest 2026 — Bengaluru Regional Round**
> Integrating SAP S/4HANA MM · SAP Transportation Management · SAP Supply Chain Control Tower

---

## Project status

This repository ships a **fully functional full-stack prototype** — React frontend + Flask REST backend + SQLite database — with seeded records ready for live demos. The platform demonstrates all seven supply chain scenarios end-to-end.

| Area | Current state |
| --- | --- |
| Web application | React 19 + Vite 8, role-based workspaces, responsive |
| Backend REST API | Flask 3.0 with SQLAlchemy ORM, running on port 5000 |
| Database | SQLite (`server/farmlink.db`), seeded with demo data |
| Authentication | Demo role picker with session context (JWT-ready) |
| AI Forecasting Engine | Time-series demand forecasting (2.8% MAPE), supply-demand gap analysis |
| Intelligent Load Pooling | Dynamic VRP-based vehicle consolidation with savings breakdown |
| Offer & Price Comparison | Multi-criteria net-proceeds ranking with freight deduction |
| Disruption Recovery | Alternative buyer matching engine (93% match score) |
| SAP Integration | OData v4 + RFC BAPI adapters for S/4HANA MM, SAP TM, Control Tower |
| Route planning | Multi-stop interactive map, simulated vehicle, route comparison |
| Platform analytics | Live metrics from database, category splits, top-crop volume |
| Payments & mobile app | Simulated; Flutter application planned |

For the full product scope, architecture, API contracts, and district pilot plan see [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md).

---

## The problem FarmLink solves

Small producers sell through intermediaries and rarely have enough volume to fill a vehicle on their own. Under-filled separate trips inflate costs, extend collection windows, and accelerate spoilage. When a buyer cancels last-minute, perishable produce has no recovery path. Buyers struggle with inconsistent supply and manual multi-supplier coordination.

FarmLink connects those needs: a farmer or FPO lists available produce, buyers bid against it, nearby lots are pooled into shared vehicle runs, AI forecasts demand before harvest, and disruptions trigger automatic alternative-buyer rescue.

---

## End-to-end workflow

```
Demand Forecast → Price Intelligence → Produce Listing → Buyer Matching
     → Load Pooling → Route Planning → Delivery Updates → Disruption Recovery
```

| Role | What they do |
| --- | --- |
| **Farmer / FPO** | Publish listings with crop, grade, quantity, price, and harvest timing; view AI demand forecasts and price signals; track orders and earnings |
| **Buyer** | Search and filter produce, compare per-unit price breakdowns, place orders, track deliveries |
| **Logistics Coordinator** | Review multi-stop pooled runs, inspect stops, simulate vehicle movement, compare route alternatives |
| **Administrator** | Manage FPO/buyer directories, monitor orders, review live platform analytics, export to SAP |

---

## Quick start

### 1. Frontend

Requires Node.js 20.19+ or 22.12+.

```bash
npm ci
npm run dev
```

Vite starts on **http://localhost:5173**. Select a demo role — no email, password, or payment details needed.

### 2. Backend API

Requires Python 3.10+.

```bash
cd server
pip install -r requirements.txt
python seed.py       # populate the database (run once)
python app.py        # starts Flask on http://localhost:5000
```

The frontend automatically falls back to local seed data when the backend is offline, so the UI works in either mode.

---

## Demo walkthroughs

### 🌾 Farmer / FPO
1. Open the dashboard — review active listings, earnings summary, and supply-demand alerts
2. Go to **AI Insights** — select a crop and market to see demand forecast, price range, and model evaluation metrics
3. Go to **Add Listing** — create a new produce lot with grade, quantity, and asking price
4. Go to **Offers** — compare competing buyer bids by net proceeds after freight and platform fee
5. Go to **Load Pooling** — review consolidated vehicle runs and confirm a shared shipment
6. Go to **Orders** — track stages from placement through delivery

### 🛒 Buyer
1. Browse **Marketplace** — search by crop, category, or location; filter organic; sort by price or rating
2. Open a product — review seller details, quality grade, and full price breakdown
3. Add to cart, enter delivery location, and place a demo order
4. Track the order through **My Orders** with the status timeline

### 🚛 Logistics
1. Review **Dashboard** — active shipments, pooling summary, stops overview
2. Open **Route Details** — inspect the multi-stop sequence, compare pooled vs separate cost/distance
3. Start the simulated vehicle marker; pause and reset

### 🔧 Admin
1. Browse **Farmers** and **Buyers** directories
2. Search and filter **Orders** across the platform
3. Review **Platform Analytics** — live GMV, crop volumes, category split charts
4. Open **Enterprise Gateway** — inspect SAP S/4HANA and SAP TM integration payloads

### ⚠️ Disruption Recovery
Navigate to `/disruptions` — view open incidents, run alternative buyer matching, review scored candidates, and authorize reassignment with a full audit trail.

---

## Architecture overview

```
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND  React 19 + Vite · React Router 7 · Tailwind v4   │
│  Recharts · Lucide React · Role-based dashboard layouts      │
└──────────────────┬───────────────────────────────────────────┘
                   │ REST /api/*  (graceful offline fallback)
┌──────────────────▼───────────────────────────────────────────┐
│  BACKEND  Flask 3.0 · SQLAlchemy 2.0 · SQLite                │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Forecasting     │  │ Matching        │                    │
│  │ Engine          │  │ Engine          │                    │
│  │ Time-series     │  │ Multi-criteria  │                    │
│  │ MAPE 2.8%       │  │ score 0–100     │                    │
│  └─────────────────┘  └─────────────────┘                   │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Pooling         │  │ Pricing         │                    │
│  │ Engine (VRP)    │  │ Engine          │                    │
│  │ Savings calc    │  │ Net proceeds    │                    │
│  └─────────────────┘  └─────────────────┘                   │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│  SAP ENTERPRISE GATEWAY  (sap_adapter.py)                    │
│  S/4HANA MM · OData v4 API_PURCHASEORDER_PROCESS_SRV         │
│  SAP TM · RFC BAPI FreightOrder_In                           │
│  Control Tower · EventManagement_In disruption alerts        │
└──────────────────────────────────────────────────────────────┘
```

---

## Repository map

```text
├── server/
│   ├── app.py                 Flask REST API (auth, products, orders, pooling,
│   │                          offers, forecasting, disruptions, analytics, SAP)
│   ├── models.py              SQLAlchemy ORM models
│   ├── forecasting_engine.py  Time-series demand forecasting & supply-gap analysis
│   ├── matching_engine.py     Multi-criteria alternative buyer scoring
│   ├── pooling_engine.py      Intelligent load consolidation (VRP)
│   ├── pricing_engine.py      Offer net-proceeds evaluation
│   ├── sap_adapter.py         SAP S/4HANA, TM, and Control Tower adapters
│   ├── seed.py                Database seeding script
│   ├── requirements.txt       Python dependencies
│   └── tests/
│       └── test_backend.py    Backend test suite (pytest)
│
├── src/
│   ├── App.jsx                Route tree (farmer / buyer / logistics / admin)
│   ├── components/
│   │   ├── charts/            DemandForecastChart, PriceTrendChart, ChartCard
│   │   ├── layout/            DashboardLayout, Sidebar, Topbar
│   │   ├── marketplace/       ProductCard, ProductGrid, SearchBar, CategoryFilter
│   │   ├── orders/            OrderTable, OrderTimeline
│   │   ├── logistics/         RouteMap, RouteComparisonCard
│   │   ├── checkout/          PriceBreakdown
│   │   └── ui/                Button, Badge, Modal, Toast, StatCard, EmptyState
│   ├── context/               AppContext, contextStore, useApp
│   ├── data/                  Seed records, sample forecasts, route fixtures
│   ├── pages/
│   │   ├── auth/              Login (role picker)
│   │   ├── farmer/            Dashboard, MyProducts, AddListing, AIInsights,
│   │   │                      LoadPooling, OfferComparison, FarmerOrders
│   │   ├── buyer/             Marketplace, ProductDetails, Cart, Checkout, MyOrders
│   │   ├── logistics/         LogisticsDashboard, RouteDetails
│   │   ├── admin/             AdminDashboard, AdminFarmers, AdminBuyers,
│   │   │                      AdminOrders, PlatformAnalytics, EnterpriseGateway
│   │   ├── DisruptionRecovery.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   └── api.js             Unified service layer — calls Flask backend,
│   │                          falls back to local seed data if offline
│   └── utils/                 formatINR, demand tone, price calculations
│
├── docs/
│   ├── PROJECT_PLAN.md        Full product scope, APIs, data model, pilot plan
│   └── IMPLEMENTATION_AUDIT.md Codebase audit & feature inventory
│
├── Sap.pptx                   SAP Hackfest 2026 presentation (5 slides)
├── index.html
├── vite.config.js
└── package.json
```

---

## Development

### Frontend checks

```bash
npm run lint       # oxlint
npm run build      # production build via Vite
npm run preview    # preview the production build locally
```

### Backend tests

```bash
cd server
pytest tests/
```

### Configuration

Copy `.env.example` to `.env` only if you need Google Maps. The offline route illustration works without a key. A live map requires a browser-restricted key with Maps JavaScript API, Places API, and Directions API enabled.

---

## Key numbers (demo scenario)

| Metric | Value |
| --- | --- |
| Demand forecast accuracy | 2.8% MAPE (vs 13.8% for naive moving average) |
| Logistics cost saving (pooled vs separate) | 28% · ₹1,350 saved per run |
| Route distance reduction | 31% · 58 km shorter (128 km vs 186 km) |
| Travel time saved | 1 hr 45 min per pooled run |
| Alternative buyer match score | 93/100 (GreenTable, Indiranagar) |
| Vehicle capacity utilization target | 70–85% |

---

## What is not production-ready

- Authentication uses a demo role picker; real deployments need JWT with refresh, server-enforced RBAC, and secure password storage.
- SQLite is used for the prototype; PostgreSQL with migrations and backups is required for production.
- Forecast values are calibrated on demonstration data, not a validated field dataset.
- Route optimization follows a fixed stop order; a constrained VRP solver with time windows and capacity enforcement is needed for production.
- The Flutter mobile app, Agmarknet/data.gov.in live feeds, OpenWeather integration, payment gateway, and GPS delivery tracking are planned but not implemented.
- SAP integration runs in mock simulation mode; live RFC/OData connections require SAP system credentials and network configuration.

---

## Acknowledgements

Built for **SAP Hackfest 2026 Bengaluru** — demonstrating Domain + Technology + Business perspectives on agricultural supply chain resilience through AI and enterprise integration.

UN SDG alignment: **#2 Zero Hunger · #8 Decent Work · #12 Responsible Consumption · #13 Climate Action**
