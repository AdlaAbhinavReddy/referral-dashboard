# Go Business — Referral Dashboard

A referral management dashboard built for Go Business. Users can log in, see an overview of their referral stats, share their referral link/code, and browse through all their referrals with search, sort, and pagination.

## What it does

- Secure login with email/password (JWT-based auth, stored in a cookie)
- Protected routes — you can't reach the dashboard or referral details without logging in
- Dashboard with:
  - An overview of key metrics (balance, earnings, discounts, etc.)
  - A service summary
  - Your referral link and code, with one-click copy buttons
  - A table of all referrals — searchable by name/service, sortable by date, and paginated (10 rows per page)
- A detail page for each individual referral
- A proper 404 page for any route that doesn't exist
- Logout that clears the session and sends you back to the login page

## Built with

- React + Vite
- React Router
- Tailwind CSS
- js-cookie

## Running it locally

```bash
git clone https://github.com/AdlaAbhinavReddy/referral-dashboard.git
cd referral-dashboard
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Test login

Email: admin@example.com

Password: admin123

## Live demo

[Add your Vercel URL here once deployed]

## A note on the data

All referral data, metrics, and auth come from a live API — nothing here is hardcoded or mocked. Pagination happens entirely on the client side since the API itself returns the full filtered/sorted list per request.