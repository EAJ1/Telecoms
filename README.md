# Imbali Telecoms

**Website:** [Visit Imbali Telecoms](https://eaj1.github.io/Telecoms/)

A Wi-Fi and telecommunications website focused on home internet, business connectivity and a **My Imbali companion-app concept**. The original `Imbali Telecoms.jpeg` logo is retained unchanged.

The site uses a light, green visual design with a CSS router illustration, responsive navigation, home/business connection cards, coverage enquiries, quote dialogs, FAQs and an interactive app preview.

## Run locally

Use Node.js 20 or newer, then:

```sh
cd backend
npm ci
cp .env.example .env
npm start
```

Open **http://localhost:3001**. The Express server serves the website and API together; no frontend build is required.

Without Supabase credentials, the website and app concept work, but enquiry submissions return an unavailable response. Customer input is preserved on a failed submission. The forms need the server; opening the HTML file alone is only useful for a visual preview.

## What works

- Home/business buttons switch between three connection options per audience.
- Each option opens a native, keyboard-accessible quote dialog with the chosen plan selected.
- Quote submissions include the audience and selected option in the stored message.
- Coverage enquiries transfer a suburb or town into the contact form for a manual review.
- Contact and quote forms show pending, success, unavailable and network-error states.
- The My Imbali concept has Overview, Devices and Help screens. Sample devices can be paused/resumed locally within the preview.
- Mobile navigation, native FAQ disclosures, visible focus indicators and reduced-motion styles are included.
- Reading text and controls use at least 16px at default browser settings, with larger main copy, stronger contrast and simpler wording. Small section labels and notes use at least 14px outside the decorative hero illustration.
- Mobile contact shortcuts hide near the coverage/contact sections and while a form field or quote dialog is active. Coverage enquiries show a clear two-step flow.

The app preview is **not a released mobile app**. It does not authenticate users, read live network data or control actual routers. There are no download links or announced launch dates. The website includes an app-interest enquiry action.

## Service content

Connection categories are enquiry starting points, not confirmed packages. Speeds, prices, equipment, installation and terms must be confirmed through a quote. The website does not invent package prices, coverage results, customer reviews or uptime figures.

The frontend catalogue is defined in `script.js` and remains available without a database. `/api/services` is retained as an optional API for database-backed service records, with Wi-Fi-focused fallback categories; the current landing page does not fetch it. `/api/news` remains available to integrations but is not displayed on the landing page.

## Supabase setup

1. Create a Supabase project.
2. Run [`backend/schema.sql`](backend/schema.sql) in its SQL editor.
3. Set these values in `backend/.env`:

   ```dotenv
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anonymous-key
   PORT=3001
   ```

4. Restart the server, submit a test enquiry and verify the row in the dashboard.

The supplied policies enable anonymous service/news reads and enquiry inserts. They do not allow anonymous enquiry reads. Review any pre-existing database policies: the schema does not remove unrelated policies. Do not put service-role keys in frontend code or commit `.env` files.

Submissions are stored in Supabase. Email delivery, customer accounts, payments and mobile-app publishing are not implemented. Configure abuse prevention and appropriate privacy information before collecting public enquiries.

## API

| Method | Endpoint | Fields / purpose |
| --- | --- | --- |
| GET | `/api/services` | Database service records or illustrative connection categories |
| GET | `/api/news` | Up to six articles, newest first |
| POST | `/api/contact` | `name`, `email`, `message` |
| POST | `/api/contracts` | `company`, `email`, `plan`, optional `message` |

The API retains the plan identifiers `basic`, `pro` and `enterprise`; the quote message records the customer-facing option and home/business audience. The `company` field accepts a person's name for a home enquiry.

Database-dependent routes return HTTP 503 when credentials are absent. Form validation checks required fields, basic email structure, field types and lengths. Forms have a 15-second request timeout; a timeout cannot establish whether the server stored a submission.

## GitHub Pages

The public website is hosted at **https://eaj1.github.io/Telecoms/**. Changes to the website files on `main` deploy automatically through [the Pages workflow](.github/workflows/pages.yml). Check the repository’s Actions tab for deployment status.

Only `index.html`, `styles.css`, `script.js` and the original logo are published. Backend code, dependencies and environment files are excluded from the website artifact.

GitHub Pages serves static files and cannot run the Express API. The app concept works there, while enquiry submission is disabled until a hosted backend origin is entered in the `api-base` meta tag. Set `FRONTEND_ORIGIN=https://eaj1.github.io` on that backend; origins do not include the `/Telecoms/` path.

## Hosting

Deploy `backend` alongside `index.html`, `styles.css`, `script.js` and the original logo. Run `npm start` from `backend`, supply the environment variables and use HTTPS. The server exposes only the listed public assets, not the backend directory.

The default API origin is the website origin. For separate frontend hosting, set the `api-base` meta tag in `index.html` to your backend origin and set `FRONTEND_ORIGIN` on the server to the exact frontend origin.

## Files

```text
index.html             Landing page, forms, FAQ and app-preview shell
styles.css             Responsive visual design and CSS illustrations
script.js              Connection options, app preview and form interactions
Imbali Telecoms.jpeg    Existing logo, unchanged
backend/server.js      Express API and public-asset routes
backend/schema.sql     Database tables and access policies
backend/.env.example   Configuration template
TODO.md                Remaining launch requirements
```

## Validation

```sh
node --check script.js
node --check backend/server.js
```

Also check desktop/mobile layouts, home/business selection, dialog keyboard behaviour, coverage transfer, app-preview controls and form failure/success states. Real database submissions and policies require a configured Supabase project.

## License

No license file is supplied. Choose and add a license before distributing the project under specific terms.
