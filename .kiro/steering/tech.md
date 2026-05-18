# Tech Stack

## Framework & Runtime
- **Next.js 15** (App Router) with React 19
- **Turbopack** used in dev (`next dev --turbopack`)
- JavaScript only — no TypeScript

## Styling
- **SCSS Modules** — every component has a co-located `.module.scss` file
- Global styles: `src/Common/styles/global.scss`
- SCSS variables: `src/Common/styles/_varible.scss` (colors, shared tokens)
- A global `.container` CSS class is used for page-width centering (defined in global styles)

## Database
- **MongoDB** via **Mongoose** — connection managed in `src/lib/mongodb.js` with global caching to avoid hot-reload reconnects
- Connection string read from `MONGO_URI` env var via `src/envConfig.js`

## Key Libraries
| Package | Purpose |
|---|---|
| `mongoose` | MongoDB ODM |
| `@iconify/react` | Icon system |
| `bcryptjs` | Password hashing |
| `sass` | SCSS compilation |
| `next/font` | Google Fonts (Bai Jamjuree) |

## External Services
- **Cloudinary** — image hosting; remote pattern configured in `next.config.mjs`
- **Google Analytics** — GA4 tag `G-W9DTRVJWC5` injected in root layout via `next/script`

## Environment Variables
Stored in `.env.local`. Accessed only through `src/envConfig.js` — never read `process.env` directly in components or services.

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Auth token signing |

## Common Commands
```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Rendering Strategy
- Pages default to `force-dynamic` (set in root layout)
- Data fetching in Server Components calls internal API routes via absolute URL using `serverApiDomain` from `src/static/static.js`
- API routes use `cache: "no-store"` on fetch calls
