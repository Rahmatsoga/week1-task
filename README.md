# Synexus Full Stack Development Track — Phase 1 Internship

**Rahmat Ullah** — 4-Week Progressive Full-Stack Evaluation

This repository contains my weekly submissions for the Synexus Software Technologies Full
Stack Development Track. Each week builds on the previous one, adding a new full-stack
capability to the same underlying application. Every week's work is self-contained in its
own folder, with its own `client/` (React) and `server/` (Node.js/Express) projects, so any
single week can be run and reviewed independently.

## Progress

| Week | Task | Status | Folder |
|---|---|---|---|
| 1 | End-to-End Setup & Core CRUD Integration | ✅ Complete | [`Week1_Task/`](./Week1_Task) |
| 2 | Full-Stack Authentication & Protected Interfaces | ✅ Complete | [`Week2_Task/`](./Week2_Task) |
| 3 | Server-Side Filtering, Pagination & Dynamic UI | ✅ Complete | [`Week3_Task/`](./Week3_Task) |
| 4 | Complex Data Handling: File Uploads & Relational Data | ⏳ Not started | — |

## Tech Stack

- **Frontend:** React 18 (Vite), React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT stored in httpOnly cookies, bcrypt password hashing
- **Data:** Server-side search, filtering, sorting, and pagination

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
it was implemented, and demo evidence (screenshots/recording), in addition to the README
in each week's folder.
