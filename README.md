# Omnicart Frontend

Omnicart is a React + Vite ecommerce frontend with authentication, protected customer routes, product browsing, cart and checkout flows, order history, profile settings, and two-factor authentication support.

## Features

- Login, registration, OTP verification, 2FA setup, and password reset flows
- Protected customer area with dashboard, profile, settings, cart, checkout, and orders pages
- Product listing with infinite scroll and product detail view
- Add-to-cart and buy-now actions
- Rating interaction on the product page
- Customer address management and account security controls in settings

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS 4
- Heroicons
- ESLint and Prettier

## Project Structure

- `src/main.jsx` bootstraps the app with `BrowserRouter`, `AuthProvider`, and `CustomerProvider`
- `src/App.jsx` defines public and protected routes
- `src/components/` contains reusable UI and auth components
- `src/context/` contains auth and customer state
- `src/layouts/` contains shared layout wrappers
- `src/pages/` contains the main application screens
- `src/services/` contains API helpers

## Routes

Public routes:

- `/` - auth landing page with login, register, OTP, 2FA, and forgot password flows
- `/reset-password/:resetToken` - password reset screen

Protected routes:

- `/dashboard` - product feed with infinite scroll
- `/product/:productId` - product details, add to cart, buy now, and rating
- `/cart` - cart screen
- `/checkout/:productId` - checkout flow
- `/my-orders` - order history
- `/profile` - profile screen
- `/settings` - account, address, and 2FA management

## Backend API

The frontend currently talks to a local backend at:

- `http://localhost:5000/api/v1`

That base URL is configured in `src/services/api.js` and uses `withCredentials: true` for cookie-based auth.

If your backend runs on a different host or port, update that file before starting the app.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A running backend that exposes the Omnicart API

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

## Notes

- The app expects authenticated user data from `/auth/current-user` on startup.
- Protected routes redirect unauthenticated users back to the auth page.
- Product data is fetched from the customer API and displayed in the dashboard and product detail pages.

## License

No license has been specified for this project yet.
