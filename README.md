# Mechanical Services Suite — Standalone Starter
Generated: 2025-08-25

This is a **full-custom, standalone** starter you can open in **Visual Studio Code**.
It includes:
- **Server**: Node.js + TypeScript + Express + Prisma (SQLite)
- **DB**: SQLite (file), ready for single‑machine use
- **Docs**: Swagger UI at http://localhost:4000/docs
- **PDF**: Quote PDF generation (server-side) with your branding
- **Web**: React + Vite + TypeScript + Material UI

## Quick Start
1. Install **Node.js LTS** (>= 18) and **npm**.
2. In VS Code, open this folder.
3. Terminal A:
   ```bash
   cd server
   npm install
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run dev
   ```
   - API running at http://localhost:4000
   - Swagger docs at http://localhost:4000/docs

4. Terminal B:
   ```bash
   cd web
   npm install
   npm run dev
   ```
   - Frontend running at http://localhost:5173

## Demo Users
No auth yet (kept simple). Add later via JWT/roles.

## What Works Now
- Create/list **Clients**, **Sites**, **Assets**, **Suppliers**, **Parts**
- Create **Quotes** with line items (Labour/Parts/Task text), GST calc (10%)
- Generate **Quote PDF** (server renders and returns a file)
- Basic **Service Report** create and **Signature** capture on the web (stores image)

## Next Steps (when ready)
- Add authentication & roles
- Add Work Orders, Time Entries approvals, RFQ→PO, Inventory
- Add offline field PWA and QR/NFC asset open

