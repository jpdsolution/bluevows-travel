# Travel Company V1

This is the complete V1 foundation for the travel-company website.

## Stack
- React + Vite
- Supabase (database/auth/storage)
- Resend (email, connected later through a server-side function)
- Cloudflare Pages for free hosting
- UPI QR generated from the quotation advance amount

## Important
The UI is intentionally responsive:
- no fixed-width cards that force horizontal scrolling
- mobile planner fields stack vertically
- grids collapse on smaller screens
- long text is allowed to wrap
- images use contained responsive containers

## Run locally
1. Install Node.js LTS.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL shown by Vite.

## Supabase
Open `supabase/schema.sql` and run it in Supabase SQL Editor after creating the project.

Copy `.env.example` to `.env` and add only the Supabase URL and ANON/PUBLISHABLE key.

Never put a Supabase service-role key in frontend code.

## Current routes
- `/` public home
- `/destinations`
- `/packages`
- `/hotels`
- `/activities`
- `/about`
- `/contact`
- `/admin` initial admin UI shell

The next integration stage connects the admin UI and public content to Supabase, then adds real quotation storage, UPI QR generation and Resend email sending.
