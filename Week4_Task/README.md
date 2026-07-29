# Week 4 — Complex Data Handling: File Uploads & Relational Data

**Synexus Software Technologies — Full Stack Track, Week 4 Evaluation Task**

Extends the Week 1-3 Inventory Management module with product image uploads and a real
relational link between inventory items and suppliers.

## What's New This Week

- **Image upload**: creating an item now supports attaching a product photo, sent as
  `multipart/form-data` and handled server-side by Multer.
- **Client-side image preview**: the selected image is shown immediately, before upload,
  using `URL.createObjectURL`.
- **Validation on both ends**: file type and size are checked in the browser (fast feedback)
  and re-checked on the server (the only check that can actually be trusted).
- **A new `Supplier` collection**, with each `Item` optionally referencing one supplier by
  ID (`mongoose.Schema.Types.ObjectId`, `ref: "Supplier"`) — a genuine one-to-many
  relationship, resolved via `.populate()` rather than duplicating supplier details onto
  every item.
- Uploaded images are served as static files from `/uploads`, and cleaned up from disk
  automatically when an item is deleted or its image is replaced.

## Setup Instructions

```bash
cd server
cp .env.example .env   # set MONGO_URI and a real JWT_SECRET
npm install
npm run seed              # populates suppliers + sample items
npm run dev

cd ../client
cp .env.example .env
npm install
npm run dev
```

The `server/uploads/` folder is created automatically on first run if it doesn't already
exist, so no manual setup is needed for it.

## New API Endpoints

### `POST /api/items` and `PUT /api/items/:id` (updated)
Now accept `multipart/form-data` instead of JSON. Fields:

| Field | Type | Notes |
|---|---|---|
| `name`, `sku`, `category`, `subCategory`, `quantity`, `price` | text | Same as before |
| `supplier` | text | A Supplier's `_id`, or empty string for none |
| `variants` | text | A JSON-stringified array (FormData can't hold arrays directly) |
| `image` | file | Optional. JPEG/PNG/WEBP/GIF, up to 5MB |

**Example (conceptual — this is sent as a multipart form, not raw JSON):**
```
name: Wireless Mouse
sku: WM-001
category: Electronics
quantity: 42
price: 19.99
supplier: 665f2a1b3c...
variants: []
image: <binary file data>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Wireless Mouse",
    "imageUrl": "/uploads/1721830000000-482910374.jpg",
    "supplier": { "_id": "...", "name": "Northwind Traders", "contactEmail": "..." }
  },
  "error": null
}
```
Note `supplier` comes back as the full populated object, not just an ID — that's the
relational "join" happening via `.populate()`.

### `GET /api/suppliers`
Returns all suppliers, sorted by name.

### `POST /api/suppliers`
Creates a new supplier (`name`, `contactEmail`, `phone`).

### `DELETE /api/suppliers/:id`
Deletes a supplier, but only if no item currently references it — returns `409` otherwise,
preventing items from being left pointing at a deleted supplier.

## How File Upload Actually Works Here

1. The frontend builds a `FormData` object (`itemService.js`) — text fields via
   `formData.append("name", ...)`, the file via `formData.append("image", file)`.
2. Axios sends this as `multipart/form-data`, letting the browser handle the low-level
   encoding automatically.
3. On the server, `multer` (configured in `middleware/upload.js`) intercepts the request
   before it reaches the controller: it validates the file's MIME type and size, writes it
   to `server/uploads/` with a collision-proof filename (`timestamp-random.ext`), and
   populates `req.file`. Regular text fields land in `req.body` exactly as normal.
4. The controller saves the relative path (`/uploads/filename.jpg`) on the `Item` document
   — not the raw file itself — and `server.js` serves that folder statically, so the path
   is directly loadable as an image URL from the frontend.

## Why Store a File Path, Not the File Itself, in MongoDB

Storing large binary data directly inside MongoDB documents is generally avoided — it
bloats the database, slows down queries that don't even need the image, and complicates
backups. Instead, the actual file lives on disk (or, in a production system, object
storage like S3), and MongoDB just stores a small text pointer to it. This is the same
"reference, don't duplicate" principle used for the Supplier relationship below.

## Why a Real Supplier Collection Instead of a Text Field

An earlier, simpler approach would add a `supplierName` text field directly on `Item`. This
was deliberately avoided: it duplicates the same supplier details across every item from
that supplier, and if a supplier's email or phone changes, every single item referencing
them would need to be updated individually. Instead, `Item.supplier` stores just a
reference (an `ObjectId`), and `.populate("supplier")` resolves that reference into the
real, current supplier document at query time — update a supplier once, and every item
referencing them reflects the change automatically.

## Demo Walkthrough (what to check)

1. Log in, then open the "Add Inventory Item" form.
2. Select a product image — confirm a live preview appears immediately, before submitting.
3. Try selecting a non-image file (e.g. a `.txt` file) — confirm it's rejected client-side
   with a clear error, before any request is sent.
4. Try selecting an image over 5MB — confirm it's rejected client-side.
5. Pick a supplier from the dropdown, fill in the rest of the form, and submit.
6. Confirm the new item appears in the table with its image thumbnail and supplier name.
7. Refresh the page — confirm the image and supplier are still shown (proving they're
   persisted in MongoDB/disk, not just held in local state).
8. Delete that item — confirm it's removed from the table, and its uploaded image file is
   removed from `server/uploads/` on disk.

## Tradeoffs & Known Limitations

- Files are stored on the local server disk, not cloud object storage (e.g. S3) — fine for
  this evaluation environment, but wouldn't scale across multiple server instances in a
  real production deployment.
- Server-side validation checks the browser-reported MIME type, not the file's actual
  binary signature ("magic bytes") — a reasonable safeguard for this project, though a
  production system handling untrusted uploads at scale would typically add that deeper
  check too.
- The create/edit form doesn't yet expose variant management — that remains a
  create-via-API-only feature, consistent with Week 3's scope.
- No image resizing/compression on upload; large (but under 5MB) images are stored as-is.

## Improvements With More Time

- Move file storage to a cloud provider (e.g. AWS S3) behind a signed-URL pattern, so the
  Express server itself never has to serve static files directly.
- Add server-side image resizing/thumbnail generation on upload (e.g. via `sharp`).
- Add a supplier management UI (currently suppliers can be created via the API but there's
  no dedicated frontend page for it).
- Verify uploaded files' actual binary signature server-side, not just the reported MIME
  type, for stronger validation against spoofed file types.
