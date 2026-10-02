# FarmLink AI — Product and Delivery Plan

## 1. Product summary

FarmLink AI is a direct farm-to-market coordination platform for smallholder farmers, farmer producer organizations (FPOs), buyers, and logistics providers. It joins selling decisions with aggregation and transportation so available supply can be matched to demand and moved as a pooled load.

The first intended rollout is a district pilot connected through local FPOs. The prototype demonstrates the user journeys and the core records those journeys need. Production services, verified data integrations, and field validation remain separate delivery stages.

## 2. Users and jobs to be done

| User | Main job | Information needed |
| --- | --- | --- |
| Farmer or FPO coordinator | List available produce, compare markets, coordinate aggregation, and follow orders | Crop, grade, harvest date, quantity, price, nearby demand, pickup plan, order stage |
| Institutional, retail, or food-service buyer | Source reliable quantities from multiple sellers and coordinate delivery | Availability, quality, seller/FPO, delivered price, committed quantity, ETA |
| Logistics coordinator or transporter | Consolidate collection and delivery work into usable vehicle runs | Stops, quantities, handling needs, route sequence, time windows, status |
| Platform administrator | Review participation and resolve marketplace or fulfillment issues | FPO and buyer records, listings, orders, shipment state, aggregate activity |

FPO-assisted onboarding is a key operating model. A coordinator should be able to help farmers create or update listings when a farmer does not use the app directly. The current role picker represents an FPO workspace; assisted onboarding screens and regional-language support have not been implemented yet.

## 3. Product workflow

1. **Capture supply:** an FPO or farmer records crop, grade, available quantity, unit, price, harvest or ready date, pickup location, handling notes, and photos.
2. **Understand demand and price:** the platform presents market references and forecasts with their source, timestamp, unit, and uncertainty.
3. **Match buyers:** buyer requirements are matched against crop, quantity, grade, delivery area, timing, and seller readiness.
4. **Pool the load:** compatible seller quantities are grouped into a shipment while respecting vehicle capacity, handling compatibility, and pickup timing.
5. **Plan the route:** pickup and delivery stops are sequenced with pickup-before-delivery constraints, time windows, and perishable-product priorities.
6. **Coordinate fulfillment:** each stop and order receives status updates from the responsible farmer, FPO, buyer, or logistics provider.
7. **Measure outcomes:** compare utilization, distance, cost, elapsed time, fulfillment rate, rejection, and spoilage against a defined baseline.

## 4. Current prototype coverage

| Capability | In the web prototype | Production work still needed |
| --- | --- | --- |
| Role workspaces | Farmer, buyer, logistics, and admin routes with seeded examples | Account creation, verified identity, server-enforced permissions |
| Produce listings | Create a listing and browse shared sample records | Server validation, edit/withdraw workflow, image storage, traceability |
| Buyer matching | Search, category, location, price and demand sorting, organic filter | Buyer requirement records, ranking rules, match explanations, acceptance flow |
| Cart and orders | Demo checkout, consistent fees, order history and status timeline | Reservation/expiry, concurrency control, cancellations, returns, settlement |
| Inventory | Cart quantity is limited; placing a demo order decrements local stock | Transactional reservation and release in the database |
| Forecast and price screens | Deterministic demonstration values and sample charts | Ingested market history, trained/validated models, freshness and confidence |
| Route planning | Fixed-stop sample route, comparison card, interactive offline map, simulated vehicle | Constrained VRP solver, road-network matrix, capacity and time-window inputs |
| Notifications | In-app list derived from active demo orders | Persisted notification events, read state, email/SMS/WhatsApp policy |
| Local persistence | Browser `localStorage` | PostgreSQL source of truth, migrations, backups, audit log |
| Responsive UX | Responsive React web screens | Field testing on low-cost Android devices and low-bandwidth connections |

## 5. UI and accessibility direction

- Keep crop, quantity, grade, location, and total cost visible without requiring technical knowledge.
- Put the next action near the information it affects: create a listing from stock screens, review an order from its notification, and inspect route stops from the route map.
- Use explicit states for loading, empty results, unavailable services, success, warnings, and failures. Empty states should explain the next useful action.
- Make quantities and prices carry their units. Show the farmer price, logistics amount, platform fee, and total using one shared calculation.
- Distinguish live data from a sample or simulation on the same screen as the metric.
- Support keyboard use, visible focus, labeled form controls, readable contrast, and responsive touch targets.
- Offer Kannada and other pilot-region languages after translation review with local FPOs; provide simple language and assisted entry for low digital familiarity.

## 6. Planned technical architecture

### Web client

- React and Vite for role-based web workspaces.
- React Router for page routes and guarded workspace layout.
- A typed API client for authentication, listing, order, forecast, market, weather, and shipment calls.
- Keep server-owned business records out of long-lived browser storage. Cache only non-sensitive, recoverable UI preferences and drafts.

### Mobile client

- Flutter application for farmer and field-coordinator workflows.
- Offline-friendly listing drafts, image upload retry, language selection, accessible form sizes, and clear sync state.
- Reuse the same backend contracts as the web client.

### API and persistence

- Python with Flask REST APIs, request validation, role authorization, structured errors, pagination, and versioned endpoints.
- PostgreSQL for users and organizations, listings, orders, shipments, stops, price observations, weather snapshots, and forecasts.
- JWT access tokens with expiry and refresh/revocation strategy, secure password storage, audit events, rate limits, and least-privilege service credentials.
- Docker images for reproducible local and hosted deployments. Deployment provider should be selected after pilot requirements for region, backups, uptime, and cost are known.

### AI and external data

- Pandas and NumPy for feature preparation; scikit-learn and XGBoost may be evaluated for demand and price models.
- Agmarknet and data.gov.in market sources, weather data, and a geocoding/road-routing provider need approved access, source tracking, usage limits, and failure handling.
- Forecasts should expose crop, market, target dates, unit, generated time, source coverage, confidence/interval, and model version.
- Route planning should consume committed shipment data and geocoded stops, then return ordered stops, distance, duration, capacity usage, and any constraint violations.

## 7. Proposed core data model

| Entity | Key fields and relationships |
| --- | --- |
| `users` | id, role, phone/email, auth identifiers, locale, active state |
| `organizations` | id, type (`FPO`, buyer, logistics), name, registration status, service area |
| `organization_members` | user id, organization id, role within organization, membership state |
| `produce_listings` | seller organization, crop, variety, grade, quantity, unit, available quantity, price, ready date, pickup point, handling notes, media, status |
| `buyer_requirements` | buyer organization, crop/grade, desired quantity, unit, delivery point, time window, target price, status |
| `orders` | buyer, seller, listing, accepted quantity, agreed price, fee snapshot, delivery point, state, timestamps |
| `shipments` | pooled order references, vehicle/capacity, route version, planned and actual metrics, state |
| `shipment_stops` | shipment, sequence, stop type, organization, coordinates, quantity, time window, planned/actual arrival, status |
| `market_price_observations` | source, market, crop, grade, unit, price, observed time, ingested time, quality flags |
| `weather_observations` | source, location, observed/forecast time, precipitation, temperature, alert level |
| `forecasts` | crop, market, target period, prediction, interval/confidence, model/source versions, generated time |
| `audit_events` | actor, action, entity, timestamp, request correlation id, safe change summary |

Quantities must be stored with a normalized unit and conversions must be explicit. Price and fee snapshots belong on the order so later listing or fee changes do not rewrite past transactions. Order and shipment transitions should be validated on the server and recorded in an audit trail.

## 8. Proposed API surface

All routes below are future API contracts. The current `src/services/api.js` reads sample data and does not call them.

| Method and path | Purpose |
| --- | --- |
| `POST /api/v1/auth/session` | Authenticate a user and return bounded access credentials |
| `GET /api/v1/me` | Load the current user and organization permissions |
| `GET /api/v1/listings` | Search active listings by crop, category, location, grade, price, and availability |
| `POST /api/v1/listings` | Create a validated produce listing |
| `PATCH /api/v1/listings/{id}` | Update or withdraw a listing owned by the caller's organization |
| `GET /api/v1/buyer-requirements` | List buyer demand visible to an authorized seller/FPO |
| `POST /api/v1/orders` | Place an order with an idempotency key and reserve available quantity |
| `GET /api/v1/orders` | List orders filtered by the caller's role and organization |
| `POST /api/v1/orders/{id}/transitions` | Apply an allowed order-state transition and write an audit event |
| `GET /api/v1/forecasts/demand` | Return a versioned demand forecast and uncertainty metadata |
| `GET /api/v1/markets/prices` | Return sourced market observations and age/quality metadata |
| `GET /api/v1/shipments` | List pooled shipment runs for an authorized logistics workspace |
| `POST /api/v1/shipments/plan` | Build a constrained route plan from accepted orders and a vehicle |
| `POST /api/v1/shipments/{id}/stops/{stopId}/events` | Record pickup/delivery progress with actor and timestamp |

## 9. Business rules to settle before pilot

- Minimum and maximum order quantities, partial acceptance, listing expiry, and stock reservation timeout.
- Fee calculation, tax treatment, rounding, refunds, cancellation fees, and who pays each logistics cost.
- Produce grading vocabulary, quality evidence, weighing responsibility, and dispute handling.
- Vehicle capacity by weight and volume, loading compatibility, cold-chain requirements, route time windows, and handoff responsibility.
- Buyer and seller verification, FPO membership permissions, consent for contact/location data, retention, and audit access.
- Source terms and permitted use for market, weather, geocoding, and routing datasets.
- Pilot definitions for the baseline route, cost inputs, measurement period, spoilage, on-time arrival, and farmer net realization.

## 10. Model and route validation

The current forecast uses stable sample numbers generated in code; it is not a trained model. Before field use, build a versioned dataset and compare simple seasonal baselines against candidate models with time-based holdouts. Report error by crop, market, forecast horizon, and season. Do not expose a confidence score until it has a defined calibration method.

The current logistics sequence and comparison metrics are demo data. The optional Google Directions call follows the supplied stop order (`optimizeWaypoints: false`) and does not solve a vehicle-routing problem. A production planner should enforce pickup-before-delivery, vehicle capacity, service time, delivery windows, perishability priority, maximum detour, and driver-hour limits. Evaluate accepted plans against a documented baseline using actual route distance, elapsed time, paid cost, utilization, on-time delivery, and produce loss.

The sample comparison is 186 km / 6 h 20 m / ₹4,800 versus 128 km / 4 h 35 m / ₹3,450. This corresponds to approximately 31% shorter distance, 28% lower estimated cost, and 1 h 45 m saved inside the prototype scenario. It is a demonstration calculation, not an independently validated field result.

## 11. Pilot rollout and acceptance

### Stage A — district discovery

- Select a district and identify participating FPOs, crop calendar, active buyers, transporters, and market days.
- Verify languages, connectivity, device access, data consent, quality grades, and payment/settlement practices with participants.
- Define a baseline collection and delivery process before measuring savings.

### Stage B — operational MVP

- Deliver authentication, organization membership, listing/order APIs, transactional stock reservation, notifications, and audit logs.
- Start with assisted FPO listing, simple buyer requirements, one pooled shipment workflow, and human-reviewed route suggestions.
- Connect one verified market-price source and show source freshness; add weather signals only after source and interpretation are agreed.

### Stage C — measured pilot

- Train participants and provide a phone and offline support path.
- Record planned versus actual route and order events, failed matches, cancellations, quality disputes, late deliveries, and spoilage.
- Compare farmer net realization and buyer delivered cost against the pre-agreed baseline.

### Stage D — expansion decision

- Review adoption, repeat orders, fill rate, truck utilization, service levels, net farmer outcomes, support effort, and unit economics.
- Improve the workflow and data quality before adding districts; expand through FPO networks when the operating model is repeatable.

### Prototype acceptance checks

- Role guards keep users inside their own workspace.
- A farmer-created listing appears in the marketplace and remains scoped to that farmer's listing page.
- Cart quantities cannot exceed available stock; a completed demo order updates local stock and appears for its buyer and seller.
- The same fee calculation is shown in product detail, cart, checkout, and the saved order.
- Search filters, no-result states, route stops, order detail modals, notifications, and logout remain usable on keyboard and narrow screens.
- Demo data, fixed sequences, simulated vehicle movement, and live-provider state are labeled accurately.

## 12. Security and operations checklist for a live service

- Keep `.env` and all credentials out of Git; rotate credentials that have entered repository history. Restrict browser keys by HTTP referrer and allowed API.
- Enforce authorization and ownership in the API; client-side route guards are only a convenience.
- Use HTTPS, secure token storage, request validation, rate limits, dependency updates, least privilege, and secret scanning.
- Make order creation idempotent and transactional; preserve immutable price and fee snapshots.
- Configure database migrations, encrypted backups, restore drills, monitoring, structured logs, and incident ownership.
- Track data-source freshness, model version, route-provider availability, API errors, and user-visible fallbacks.
- Publish privacy and retention terms before collecting real identities, precise locations, or transactional data.
