# Synexus Full Stack Development Track — Phase 1 Internship

**Rahmat Ullah** — 4-Week Progressive Full-Stack Evaluation — ✅ Complete

This repository contains my weekly submissions for the Synexus Software Technologies Full
Stack Development Track. Each week builds on the previous one, adding a new full-stack
capability to the same underlying application. Every week's work is self-contained in its
own folder, with its own `client/` (React) and `server/` (Node.js/Express) projects, so any
single week can be run and reviewed independently.

## Progress

| Week | Task                                                  | Status      | Folder                        |
| ---- | ----------------------------------------------------- | ----------- | ----------------------------- |
| 1    | End-to-End Setup & Core CRUD Integration              | ✅ Complete | [`Week1_Task/`](./Week1_Task) |
| 2    | Full-Stack Authentication & Protected Interfaces      | ✅ Complete | [`Week2_Task/`](./Week2_Task) |
| 3    | Server-Side Filtering, Pagination & Dynamic UI        | ✅ Complete | [`Week3_Task/`](./Week3_Task) |
| 4    | Complex Data Handling: File Uploads & Relational Data | ✅ Complete | [`Week4_Task/`](./Week4_Task) |

All four weeks of the Phase 1 evaluation have been completed, tested, and documented.

## What the Final Application Does

By Week 4, the application is a fully authenticated inventory management system with:

- Full CRUD for inventory items, backed by MongoDB (I have used MongoDB Compass but we can use ATLAS as well)
- Secure registration/login with JWT sessions stored in httpOnly cookies
- Protected routes on both the frontend and the API
- Server-side search, category filtering, sorting, and pagination, all reflected in the URL
- Product image uploads with client-side preview and validation
- A real relational link between inventory items and suppliers (Mongoose references +
  population)

## Tech Stack

- **Frontend:** React 18 (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT stored in httpOnly cookies, bcrypt password hashing
- **File uploads:** Multer
- **Data:** Server-side search, filtering, sorting, pagination, and relational references

## Repository Structure

```
week1-task/
├── Week1_Task/          # Week 1: Inventory CRUD module
│   ├── client/
│   ├── server/
│   └── README.md         # Week 1 details: setup, API docs, demo checklist
├── Week2_Task/          # Week 2: Authentication & protected routes
│   ├── client/
│   ├── server/
│   └── README.md         # Week 2 details: setup, API docs, demo checklist
├── Week3_Task/          # Week 3: Search, filtering, sorting, pagination
│   ├── client/
│   ├── server/
│   └── README.md         # Week 3 details: setup, API docs, demo checklist
├── Week4_Task/          # Week 4: File uploads & relational supplier data
│   ├── client/
│   ├── server/
│   └── README.md         # Week 4 details: setup, API docs, demo checklist
```

Each week's `README.md` contains full setup instructions, environment variables, API
documentation, and a demo walkthrough checklist specific to that week's deliverable — see
the links in the table above.

## Quick Start (any given week)

```bash
cd Week<N>_Task/server
cp .env.example .env    # then fill in real values (see that week's README)
npm install
npm run dev               # starts the API

cd ../client
cp .env.example .env
npm install
npm run dev               # starts the React app
```

## Submission Notes

A submission PDF accompanies each week's deliverable, covering what was implemented, how
it was implemented, and demo evidence (screenshots), in addition to the README in each
week's folder.
