# 🚗 Trackora UI

![Angular](https://img.shields.io/badge/Angular-20-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Angular Material](https://img.shields.io/badge/Angular%20Material-20-green)
![License](https://img.shields.io/badge/license-MIT-blue)

Trackora UI is the modern Angular frontend for **Trackora**, a cloud-native fleet operations platform designed to help organizations manage vehicles, maintenance, fuel usage, operational alerts, and real-time fleet activity from a single dashboard.

The application consumes the Trackora REST API and provides an intuitive, responsive experience for fleet managers, dispatchers, and administrators.

---

# ✨ Features

## Dashboard

- Fleet KPIs
- Vehicle statistics
- Fuel analytics
- Maintenance summaries
- Recent alerts
- AI-generated fleet insights
- Responsive dashboard widgets

---

## Fleet Management

- Create and manage fleets
- Fleet statistics
- Fleet overview
- Fleet filtering
- Fleet detail pages

---

## Vehicle Management

- Create, edit and archive vehicles
- VIN management
- Vehicle assignments
- Mileage tracking
- Vehicle details
- Vehicle AI summaries
- Vehicle document management

---

## Maintenance

- Schedule maintenance
- Maintenance history
- Cost tracking
- Service intervals
- Upload invoices and service documents
- Maintenance status tracking

---

## Fuel Management

- Fuel log management
- MPG calculations
- Fuel cost analytics
- Fuel history
- Fuel efficiency insights

---

## Alerts

- Operational alerts
- Severity filtering

Supported severities:

- INFO
- WARNING
- CRITICAL

Additional capabilities:

- Alert resolution
- Pagination
- Search & filtering

---

## AI Fleet Copilot

Trackora integrates AI-powered operational insights.

Generate summaries for:

- Fleets
- Vehicles

Features include:

- AI-generated recommendations
- Fleet summaries
- Vehicle summaries
- Error handling
- Loading indicators
- Daily usage limits
- Mock AI support for development

---

## Authentication

- JWT Authentication
- Login
- Registration
- Route Guards
- HTTP Interceptor
- Automatic token handling
- Session persistence

---

## UI Features

- Angular Material
- Responsive layouts
- Mobile-friendly design
- Snackbar notifications
- Loading spinners
- Confirmation dialogs
- Pagination
- Search
- Filtering
- Form validation
- Lazy-loaded feature modules
- Standalone Angular components

---

# 🛠 Tech Stack

- Angular 20
- Angular Material
- TypeScript
- RxJS
- Angular Signals
- Chart.js
- Leaflet (Maps)
- STOMP/WebSockets
- JWT Authentication
- REST APIs

---

# 📂 Project Structure

```text
src/app
├── core
│   ├── guards
│   ├── interceptors
│   ├── services
│   └── models
│
├── features
│   ├── auth
│   ├── dashboard
│   ├── fleets
│   ├── vehicles
│   ├── maintenance
│   ├── fuel
│   ├── alerts
│   ├── ai
│   └── documents
│
├── layout
│
├── shared
│   ├── components
│   ├── pipes
│   └── directives
│
└── environments
```

---

# ⚙️ Environment Configuration

Update:

```text
src/environments/environment.ts
```

Example:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

---

# 🚀 Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Application:

```
http://localhost:4200
```

---

# 🏗 Production Build

```bash
ng build
```

Production files are generated in:

```
dist/
```

---

# 🧪 Testing

Run unit tests:

```bash
ng test
```

---

# 🔐 Backend

Trackora UI communicates with the Trackora Spring Boot backend.

Default local API:

```
http://localhost:8080/api
```

Swagger:

```
http://localhost:8080/swagger-ui/index.html
```

---

# ☁️ Deployment

Current production deployment:

| Component | Platform |
|------------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |
| Messaging | Azure Service Bus |

---

# 📈 Observability

The backend exposes production metrics using:

- Spring Boot Actuator
- Micrometer
- Prometheus endpoint

Metrics are available through:

```
/actuator/prometheus
```

---

# 🔮 Roadmap

Future enhancements include:

- Dark Mode
- Role-based access control
- Organization management
- Real-time notifications
- Advanced reporting
- GPS tracking
- Driver management
- Geofencing
- Mobile application
- Offline support
- Push notifications

---

# 📄 License

MIT License
