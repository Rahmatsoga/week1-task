# Week 3 — Server-Side Filtering, Pagination & Dynamic UI

**Synexus Software Technologies — Full Stack Track, Week 3 Evaluation Task**

Extends the Week 1/2 Inventory Management module with a highly interactive data table:
server-side search, category filtering, sorting, and pagination, with the current view
reflected directly in the URL.

## What's New This Week

- Richer `Item` schema: added `subCategory` and an embedded `variants` array (each item
  can have multiple purchasable variants, e.g. sizes), plus database indexes on the fields
  used for searching/filtering/sorting.
- `GET /api/items` now accepts `search`, `category`, `sortBy`, `order`, `page`, and `limit`
  query parameters, and returns only the matching, sorted, paginated slice — never the
  full collection.
- New `GET /api/items/categories` endpoint powers the category filter dropdown from real
  data instead of a hardcoded list.
- Debounced search input (400ms) — the API is only called once the user pauses typing.
- All search/filter/sort/page state lives in the URL via `useSearchParams`, so refreshing,
  sharing a link, or using the browser's back/forward buttons all restore the exact same
  view.
- A 42-item seed script spread across 5 categories, with a subset of items given real
  variants, so pagination and filtering are meaningful to test.

## Setup Instructions

Same as Week 2 — see that week's README for the full explanation of each step.

```bash
cd server
cp .env.example .env   # set MONGO_URI and a real JWT_SECRET
npm install
npm run seed              # populates 42 sample items across 5 categories
npm run dev

cd ../client
cp .env.example .env
npm install
npm run dev
```

## Updated API: `GET /api/items`

| Query param | Type | Default | Notes |
|---|---|---|---|
| `search` | string | `""` | Case-insensitive partial match on item name |
| `category` | string | `"all"` | Exact match; `"all"` or omitted returns every category |
| `sortBy` | string | `"createdAt"` | One of `name`, `price`, `quantity`, `createdAt` (allowlisted) |
| `order` | string | `"desc"` | `"asc"` or `"desc"` |
| `page` | number | `1` | 1-indexed |
| `limit` | number | `10` | Capped at 100 per page |

**Example request:**
```
GET /api/items?search=mouse&category=Electronics&sortBy=price&order=asc&page=1&limit=10
```

**Example response:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "name": "Wireless Mouse", "...": "..." } ],
  "error": null,
  "pagination": { "page": 1, "limit": 10, "totalCount": 3, "totalPages": 1 }
}
```

### `GET /api/items/categories`
Returns the distinct list of categories currently present in the collection, sorted
alphabetically — used to populate the filter dropdown without hardcoding options that
could drift out of sync with real data.

## Why Server-Side Instead of Client-Side Filtering

An earlier, simpler approach would be to fetch every item once and filter/sort/paginate
in the browser with JavaScript. This was deliberately avoided: it means the server does
unnecessary work sending data that's immediately thrown away, and it gets slower — and
eventually breaks entirely — as the dataset grows into the thousands or millions. Instead,
MongoDB performs the filtering, sorting, and slicing itself via `.find(filter).sort().skip().limit()`,
backed by indexes on `name`, `category`, `price`, and `createdAt` (see `models/Item.js`),
so only the small slice actually needed is ever sent over the network.

## Why Debounce the Search Input

Firing an API request on every keystroke while typing "wireless mouse" would mean up to
14 separate requests for a single search, wasting bandwidth and risking out-of-order
responses overwriting newer results with stale ones. `useDebounce` (in
`client/src/hooks/useDebounce.js`) waits for a 400ms pause in typing before the search
value is passed up and written into the URL — one request per pause, not per keystroke.

## Why URL State Instead of Component State

Search/filter/sort/page values are read from and written to the URL via
`useSearchParams`, rather than being kept in local React state. This means:
- Refreshing the page preserves exactly what you were looking at.
- A URL like `?search=mouse&category=Electronics&page=2&sortBy=price&order=asc` can be
  copied and shared, and it reproduces the exact same view for anyone who opens it.
- The browser's back/forward buttons correctly step through filter changes.

## Demo Walkthrough (what to check)

1. Load the Inventory page — confirm the first 10 items appear with pagination controls
   showing "Page 1 of 5" (or similar, depending on seeded count).
2. Type into the search box — confirm the list updates only after you pause typing
   (not on every keystroke), and the URL gains a `?search=...` parameter.
3. Select a category from the dropdown — confirm the list and URL update, and the page
   resets to 1.
4. Change the sort dropdown — confirm the order changes and the URL reflects it.
5. Click "Next" / "Previous" — confirm the page changes and the URL's `page` parameter
   updates.
6. Refresh the browser mid-filter — confirm the exact same search/filter/sort/page is
   restored from the URL.
7. Copy the URL and open it in a new tab — confirm it reproduces the same view.

## Tradeoffs & Known Limitations

- The create-item form (`ItemForm`) doesn't yet expose `subCategory` or `variants` for
  input — those fields can be set via `PUT`/seed data, but the Week 3 focus was the
  read/query side (filtering, search, pagination) rather than the create form.
- Search matches only the `name` field; searching across `category`/`sku` as well would
  be a reasonable next step.
- No debounce/throttle was needed for pagination or filter dropdowns since those are
  discrete click/select events, not continuous ones — debounce was applied only to the
  free-text search input, where it's actually needed.

## Improvements With More Time

- Add `subCategory` and variant management to the create/edit form.
- Add multi-field search (name + SKU + category) using a MongoDB text index.
- Add a compound index (e.g. `{ category: 1, price: 1 }`) if filter+sort combinations on
  multiple fields simultaneously become a common access pattern.
- Add a "items per page" selector in the UI (backend already supports arbitrary `limit`
  up to 100).
