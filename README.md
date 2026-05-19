# Trackora UI

Trackora UI is the Angular frontend for the Trackora fleet operations platform.

The application provides:

- Fleet management
- Vehicle management
- Maintenance tracking
- Fuel logging and analytics
- Operational alerts with severity filtering
- AI-generated fleet and vehicle insights
- Vehicle and maintenance document uploads
- Dashboard charts and KPIs
- Pagination and filtering
- Responsive Material UI experience

---

## Tech Stack

- Angular 21
- Angular Material
- TypeScript
- RxJS
- Angular Signals
- Chart.js
- Vite
- JWT Authentication

---

## Features

### Dashboard
- Fleet KPIs
- Fuel analytics
- Maintenance summaries
- AI-generated fleet insights
- Open alert counts

### Vehicles
- Vehicle management
- Vehicle detail views
- VIN support
- Fleet reassignment
- Mileage updates
- Vehicle AI summaries

### Maintenance
- Maintenance scheduling
- Maintenance history
- Status tracking
- Maintenance document uploads
- Invoice and image support

### Fuel Logs
- Fuel tracking
- MPG analytics
- Fuel anomaly alerts

### Alerts
- Severity levels:
  - CRITICAL
  - WARNING
  - INFO
- Filtering
- Pagination
- Alert resolution workflows

### Documents
- Vehicle document uploads
- Maintenance invoice uploads
- Image validation
- Secure downloads
- File size limits

---

## Project Structure

```text
src/app
 ├── core
 ├── features
 │    ├── alerts
 │    ├── auth
 │    ├── dashboard
 │    ├── fuel
 │    ├── maintenance
 │    └── vehicles
 ├── shared
 └── layout
```

---

## Environment Configuration

Update: `src/environments/environment.ts`

Example:
```javascript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

## Development Server

Install dependencies: `npm install`

Run locally: `ng serve`

Application URL: `http://localhost:4200`

## Building

Production build: `ng build`

Build artifacts are generated in folder: `dist`

## Running Tests

Unit tests: `ng test`

---

## Authentication

- Trackora UI authenticates using JWT tokens issued by the backend API.

### Authentication flow:

- Login/Register
- Receive JWT token
- Store token locally
- Automatically attach token to API requests
- AI Insights

### Trackora supports AI-generated operational summaries for:

- Fleets
- Vehicles

### Protections include:

- Daily generation limits
- Mock AI mode support
- Snackbar error handling

### UI Features

- Angular Material design
- Snackbar notifications
- Responsive layouts
- Loading states
- Pagination
- Filtering
- Severity badges
- Confirmation dialogs
- Backend API

### The frontend expects the Trackora API backend to be running:

http://localhost:8080

### Swagger UI:

http://localhost:8080/swagger-ui/index.html



## Future Improvements/Potential future enhancements:

- Dark mode
- Role-based access control
- Multi-tenant organizations
- Real-time notifications (rabbitmq or kafka)
- Mobile app support
- Export/reporting features (new microservice)
- GPS tracking (new microservice)
