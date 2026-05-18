# Project Structure

## Top-Level Layout
```
src/
├── app/          # Next.js App Router — pages and API routes
├── Common/       # Shared layout components and global styles
├── Components/   # Feature-specific UI components (grouped by module)
├── lib/          # Infrastructure utilities (DB connection)
├── models/       # Mongoose schemas/models
├── services/     # Client-side data fetching functions
├── static/       # Shared constants, nav config, utility functions
└── envConfig.js  # Single source for all env vars
```

## `src/app/` — Routing
Follows Next.js App Router conventions. Each route folder contains a `page.js`.

```
app/
├── layout.js               # Root layout — font, Header, Footer, GA
├── page.js                 # Home page
├── about/page.js
├── blog/
│   ├── page.js
│   └── [blog]/page.js      # Dynamic blog detail
├── destination/
│   ├── page.js
│   └── [destination]/page.js
├── package/[package]/page.js
├── contact/page.js
├── privacy/page.js
├── terms/page.js
├── sitemap.js
└── api/                    # API route handlers
    ├── blog/route.js
    ├── blog/[routePath]/
    ├── destination/route.js
    ├── destination/[routePath]/
    ├── contact/route.js
    └── subscribe/route.js
```

Page files are thin — they set `metadata` and render a single feature component.

## `src/Common/` — Shared UI
Components used across all pages: `Header`, `Footer`, `AboutBanner`, `TextInput`.
Each component lives in its own folder with a `.jsx` and a `.module.scss` file.

## `src/Components/` — Feature Modules
Grouped by page/feature in `*Module` or named folders. Each module folder contains sub-components, each with their own `.jsx` + `.module.scss`.

```
Components/
├── HomeModule/         # HomeBanner, HomeDestinations, OurPackage, HomeBlog, etc.
├── AboutModule/
├── ContactModule/
├── blogModule/         # Blog list, BlogCard, BlogDetail, RecentBlogCard
├── destination/        # Destination list, DestinationCard, DestinationDetail
├── packageDetail/      # PackageDetail, BookingCard, TourDetail, PhotoGallery
├── faqSection/
├── PrivacyModule/
└── TermsConditions/
```

## `src/models/` — Mongoose Models
One file per model. Always use the `mongoose.models.X || mongoose.model('X', schema)` pattern to avoid model re-registration during hot reload.

Models: `blogModel`, `bContentModel`, `Destination`, `Author`, `Category`, `Faq`, `Contact`, `Subscriber`, `User`

## `src/services/` — Data Fetching
Plain async functions that call internal API routes. Used in Server Components. Always use the `serverApiDomain` constant from `src/static/static.js` as the base URL — never hardcode it.

## `src/static/static.js` — Shared Constants
- `navLinks` — navigation config
- `BaseUrl` — canonical domain for metadata
- `serverApiDomain` — base URL for server-side fetch calls
- Shared utility functions: `formatBlogDate`, `getDatePart`, `removeInlineStyles`

## Path Alias
`@/*` maps to `src/*` — always use this alias for imports instead of relative paths.

## Naming Conventions
- **Components**: PascalCase filename, e.g. `HomeBanner.jsx`
- **SCSS modules**: camelCase matching component name, e.g. `homeBanner.module.scss`
- **Folders**: PascalCase for component folders, camelCase for module groupings
- **API route params**: use `routePath` as the dynamic segment name for slug-based lookups
- **`'use client'`**: only added when the component needs browser APIs or React hooks (e.g. `useState`, `usePathname`)
