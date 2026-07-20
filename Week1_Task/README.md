# Inventory Management Module

**Synexus Software Technologies — Full Stack Track, Week 1 Evaluation Task**

A full-stack CRUD module that lets a user create an inventory item from a
React form, persists it to MongoDB via an Express/Mongoose API, and
immediately reflects the change in the UI — the record survives a page
refresh.

## Project Overview

| Layer | Tech |
|---|---|
| Frontend | React 18 (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| API client | Axios |

```
inventory-app/
├── server/          # Express API
│   ├── config/       # DB connection
│   ├── controllers/  # Route handler logic
│   ├── middleware/   # Error handling, async wrapper
│   ├── models/       # Mongoose schema
│   ├── routes/       # REST route definitions
│   ├── seed/          # Sample-data seeding script
│   └── server.js
└── client/          # React app
    └── src/
        ├── components/  # ItemForm, ItemTable, Spinner
        ├── hooks/       # useItems (state management)
        ├── pages/       # InventoryPage
        └── services/    # itemService (Axios API layer)
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- A running MongoDB instance (local or Atlas)

### 1. Backend

```bash
cd server
cp .env.example .env   # then edit MONGO_URI if needed
npm install
npm run seed            # optional: populate sample data
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev              # starts on http://localhost:5173
```

Open `http://localhost:5173` in a browser, add an item, then refresh the
page — the item persists because it's stored in MongoDB, not local state.

## Environment Variables

**server/.env**
| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/inventory_db` |
| `CLIENT_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

**client/.env**
| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the API | `http://localhost:5000/api` |

## API Documentation

Base URL: `http://localhost:5000/api`

All responses follow the shape: `{ success, data, error }`.

### `GET /items`
Returns all inventory items.

```json
{
  "success": true,
  "count": 2,
  "data": [
    { "_id": "665f...", "name": "Wireless Mouse", "sku": "WM-001", "category": "Electronics", "quantity": 42, "price": 19.99, "createdAt": "..." }
  ],
  "error": null
}
```

### `GET /items/:id`
Returns a single item, or `404` if not found.

### `POST /items`
Creates a new item.

**Request body**
```json
{ "name": "Wireless Mouse", "sku": "WM-001", "category": "Electronics", "quantity": 42, "price": 19.99 }
```

**Response `201`**
```json
{ "success": true, "data": { "_id": "665f...", "name": "Wireless Mouse", "...": "..." }, "error": null }
```

**Validation error `400`**
```json
{ "success": false, "data": null, "error": "Item name is required, Price is required" }
```

### `PUT /items/:id`
Updates an existing item. Same body shape as `POST`. Returns `404` if the
id doesn't exist.

### `DELETE /items/:id`
Deletes an item. Returns the deleted document on success, `404` if not
found.

## Sample Test Data

Run `npm run seed` inside `server/` to insert 5 sample inventory items
(Wireless Mouse, Mechanical Keyboard, Office Chair, Notebook, Standing
Desk) so the reviewer can test immediately without manual data entry.

## Demo Walkthrough (what to check)

1. Start both servers as described above.
2. Open the app — the seeded items should load in the table.
3. Fill in the "Add Inventory Item" form and submit.
   - Client-side validation blocks empty/invalid fields.
   - On success, the new item appears in the table without a manual refresh.
4. Refresh the browser — the new item is still there (confirms DB
   persistence, not just local React state).
5. Click **Delete** on a row — confirm the item disappears and stays
   gone after a refresh.
6. Try submitting a duplicate SKU — the API returns a `409` and the UI
   surfaces the error message.

## Tradeoffs & Known Limitations

- No authentication yet — that's the Week 2 deliverable. All endpoints
  are currently public.
- `PUT` (update) is implemented on the backend and in `itemService`, but
  there's no edit UI yet in this week's scope — only create/read/delete
  are wired into the interface, per the Week 1 task requirements.
- Pagination/search (Week 3 scope) is not implemented; `GET /items`
  returns the full collection, which is fine for the current dataset size
  but wouldn't scale to a large catalog.
- Using `window.confirm` for delete confirmation is functional but
  minimal; a proper modal would be a nicer UX in a production build.

## Improvements With More Time

- Add optimistic UI updates on create/delete instead of a full re-fetch.
- Add unit tests (Jest + React Testing Library on the client, Supertest
  on the server).
- Add request-body validation middleware (e.g. `express-validator`) as
  a defense-in-depth layer in front of Mongoose schema validation.
- Dockerize both services with a `docker-compose.yml` including MongoDB.
