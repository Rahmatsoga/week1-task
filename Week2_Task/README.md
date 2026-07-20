# Week 2 — Full-Stack Authentication & Protected Interfaces

**Synexus Software Technologies — Full Stack Track, Week 2 Evaluation Task**

Extends the Week 1 Inventory Management module with a complete registration/login flow.
Inventory routes are now protected — only authenticated users can view or manage items.

## What's New This Week

- User registration and login with hashed passwords (bcrypt) and JWT-based sessions.
- The JWT is stored in an **httpOnly cookie** (not localStorage) — see "Why an httpOnly
  cookie?" below.
- All `/api/items` routes now require authentication (`protect` middleware).
- Frontend routing (`react-router-dom`) with a `ProtectedRoute` wrapper that redirects
  unauthenticated users to `/login`.
- Session persists across page refresh — on load, the app asks `GET /api/auth/me` (which
  relies on the browser automatically sending the auth cookie) to restore the logged-in
  state, with no client-side token storage needed.
- Clear 401 (not logged in) vs the underlying validation/duplicate-email errors (400/409)
  on registration and login.

## Setup Instructions

### 1. Backend
```bash
cd server
cp .env.example .env   # then set MONGO_URI and a real JWT_SECRET
npm install
npm run dev              # starts on http://localhost:5000
```

Generate a strong `JWT_SECRET` (don't use the placeholder in `.env.example` for anything
real):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev               # starts on http://localhost:5173
```

Open `http://localhost:5173` — you'll be redirected to `/login` since there's no session
yet. Register a new account, and you'll land on the protected Inventory page.

## New API Endpoints

Base URL: `http://localhost:5000/api/auth`

### `POST /register`
```json
// Request
{ "name": "Rahmatullah", "email": "user@example.com", "password": "secret123" }

// Response 201
{ "success": true, "data": { "id": "...", "name": "Rahmatullah", "email": "user@example.com" }, "error": null }
```
Also sets an httpOnly `token` cookie, logging the user in immediately.

### `POST /login`
```json
// Request
{ "email": "user@example.com", "password": "secret123" }
```
Returns the same shape as register. Returns `401` with `"Invalid email or password"` on
failure (deliberately vague — doesn't reveal whether the email exists, to avoid leaking
account information to attackers).

### `POST /logout` *(protected)*
Clears the auth cookie. Requires a valid session to call.

### `GET /me` *(protected)*
Returns the current logged-in user's profile. Used on app load to restore a session after
a refresh. Returns `401` if there's no valid cookie.

## Why an httpOnly Cookie Instead of localStorage?

Two common ways to store a JWT on the client: `localStorage` or an `httpOnly` cookie. This
project uses an httpOnly cookie because:

- **localStorage is readable by any JavaScript running on the page.** If the app (or a
  dependency) ever had an XSS vulnerability, malicious script could read the token straight
  out of localStorage and impersonate the user.
- **An httpOnly cookie cannot be read by JavaScript at all** — the browser sends it
  automatically on every request to the API and the server can read it, but
  `document.cookie` in the browser console will never expose it.
- The tradeoff: cookie-based auth requires CORS to be configured with
  `credentials: true` on both the server (`cors` middleware) and every client request
  (Axios `withCredentials: true`), which this project has in place.

## Updated Inventory Routes

`server/routes/itemRoutes.js` now applies `router.use(protect)` before any item route, so
every inventory endpoint requires a valid session. A request without a valid cookie now
receives:
```json
{ "success": false, "data": null, "error": "Not authorized — no token provided" }
```
with HTTP status `401`.

## Demo Walkthrough (what to check)

1. Visit `http://localhost:5173` while logged out — confirm you're redirected to `/login`.
2. Register a new account — confirm you land on the Inventory page immediately, and your
   name appears in the "Signed in as" bar.
3. Refresh the page — confirm you're still logged in (session persistence).
4. Click **Log Out** — confirm you're redirected back to `/login` and the inventory page is
   no longer accessible.
5. Try visiting `http://localhost:5173/` directly while logged out — confirm the redirect
   happens rather than the page flashing inventory data.
6. Try registering with an email that's already used — confirm a `409` error is shown.
7. Try logging in with a wrong password — confirm a `401` error is shown, and it doesn't
   reveal whether the email itself was valid.

## Tradeoffs & Known Limitations

- No password reset / "forgot password" flow yet — out of scope for this week.
- No role-based access control (e.g. admin vs regular user) — every logged-in user has the
  same permissions on inventory items.
- No refresh-token rotation — the JWT is a single long-lived (7 day) token. A production
  app would typically pair a short-lived access token with a longer-lived refresh token.
- No rate limiting on login/register endpoints yet, which would help mitigate brute-force
  attempts.

## Improvements With More Time

- Add rate limiting (e.g. `express-rate-limit`) on `/auth/login` and `/auth/register`.
- Add email verification on registration.
- Add short-lived access tokens + refresh token rotation for better security.
- Add role-based permissions if multi-user inventory sharing becomes a requirement.
