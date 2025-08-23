## Fork & Flame — Restaurant Website

Modern, responsive restaurant website showcasing a menu, featured dishes, contact, reviews, and a simple checkout flow. Built with React 19, TypeScript, Vite 7, Tailwind CSS, React Router 7, React Query v5, Axios, and Framer Motion.

### Tech Stack
- React 19 + TypeScript
- Vite 7 with `@vitejs/plugin-react`
- Tailwind CSS 3 + PostCSS + Autoprefixer
- React Router 7
- @tanstack/react-query 5 (+ Devtools in development)
- Axios for HTTP
- Framer Motion for animations
- ESLint 9 + TypeScript ESLint + React Hooks/Refresh plugins

### Getting Started
1) Prerequisites: Node 18+ and npm.
2) Install dependencies:
```bash
npm install
```
3) Run the dev server:
```bash
npm run dev
```
4) Production build:
```bash
npm run build
```
5) Preview the production build locally:
```bash
npm run preview
```
6) Lint:
```bash
npm run lint
```

### Environment Variables
The API base URL can be configured via `VITE_API_BASE_URL`.
- Default: `https://free-food-menus-api-two.vercel.app`
- Create a `.env` file at the project root if you want to override:
```bash
VITE_API_BASE_URL=https://your-api.example.com
```

### Project Structure
```
Fork-Flame/
├─ public/
│  ├─ _redirects          # Optional hosting redirects
│  ├─ robots.txt          # Crawling rules, points at /sitemap.xml
│  └─ sitemap.xml         # Static sitemap entries
├─ src/
│  ├─ assets/             # Static assets (e.g., logos)
│  ├─ components/
│  │  ├─ common/
│  │  │  ├─ ErrorBoundary.tsx  # App-wide error boundary
│  │  │  ├─ Footer.tsx         # Footer with links and newsletter
│  │  │  ├─ Navigation.tsx     # Responsive navbar with dark mode & mobile menu
│  │  │  └─ Preloader.tsx      # Splash preloader before app content
│  │  ├─ layout/
│  │  │  └─ Layout.tsx         # Wraps pages with nav/footer/scroll-to-top
│  │  └─ ui/
│  │     ├─ Button.tsx         # Reusable button variants/sizes
│  │     ├─ Card.tsx           # Generic and food-specific cards
│  │     ├─ LoadingSpinner.tsx # Spinners, dots, pulse, overlay
│  │     ├─ PageHero.tsx       # Standardized hero section per page
│  │     └─ SkeletonLoader.tsx # Skeletons for loading states
│  ├─ contexts/
│  │  └─ ThemeContext.tsx      # Dark mode state + localStorage persistence
│  ├─ hooks/
│  │  ├─ useImageValidation.ts # Validate image URLs with timeout
│  │  ├─ useMenuData.ts        # Data fetching (React Query), filters, pagination
│  │  └─ useScrollToTop.ts     # Auto-scroll on route changes
│  ├─ pages/
│  │  ├─ Home.tsx              # Hero, featured dishes, CTAs
│  │  ├─ Menu.tsx              # Menu with search, filters, cart, mobile cart
│  │  ├─ About.tsx             # Story, values, team, achievements
│  │  ├─ Contact.tsx           # Contact info + validated form + map
│  │  ├─ Order.tsx             # Checkout, validation, simulated submission
│  │  ├─ Reviews.tsx           # Reviews list, stats, add review modal
│  │  └─ NotFound.tsx          # 404 page
│  ├─ services/
│  │  └─ api.ts                # Axios client, endpoints, helpers (search/filter/sort)
│  ├─ types/
│  │  └─ index.ts              # FoodItem, CartItem types
│  ├─ utils/
│  │  └─ constants.ts          # API, routes, theme, keys, breakpoints
│  ├─ App.tsx                  # Router, providers, lazy routes, preloader
│  ├─ index.css                # Tailwind layers, utilities, design tokens
│  ├─ main.tsx                 # React root
│  └─ vite-env.d.ts
├─ tailwind.config.js          # Theme tokens, animations
├─ postcss.config.js
├─ eslint.config.js
├─ vite.config.js
├─ tsconfig*.json
└─ package.json
```

### Routing
Client-side routing via `react-router-dom` with lazy-loaded routes in `src/App.tsx`:
- `/` → `Home`
- `/menu` → `Menu`
- `/about` → `About`
- `/contact` → `Contact`
- `/order` → `Order`
- `/reviews` → `Reviews`
- Fallback `*` → `NotFound`

`Layout.tsx` ensures consistent `Navigation`, `Footer`, and `ScrollToTop` across pages.

### Data Layer and API
- Axios client configured in `src/services/api.ts` using `API_CONFIG` from `src/utils/constants.ts`.
- Endpoints (prefixed by `VITE_API_BASE_URL`):
  - `/best-foods`, `/burgers`, `/pizzas`, `/desserts`, `/drinks`, `/ice-cream`, `/bbqs`, `/sandwiches`, `/steaks`.
- `getAllFoods` aggregates multiple categories with `Promise.allSettled`, tagging items with `category` and `uniqueId` to dedupe.
- Utility helpers: `searchFoods`, `filterFoodsByPrice`, `filterFoodsByRating`, `sortFoods`.
- React Query hooks in `src/hooks/useMenuData.ts`:
  - `useAllFoods`, `useBestFoods`, `useFoodsByCategory`.
  - `useAllFoodsWithValidation` validates a subset of image URLs, caches results in `localStorage` for 24h, reorders rather than dropping invalids, includes progress tracking.
  - `useFilteredMenuData`, `useMenuSearch` (debounced), `useMenuPagination`.

### UI/UX Highlights
- Tailwind theme extensions: semantic colors (`primary`, `secondary`, `background`, `text`, `surface`, `accent`), fonts, custom keyframes (`fadeIn`, `slideUp`, `shimmer`, etc.).
- `Navigation.tsx`: responsive menu, body-scroll lock, outside-click close, active tab indicator, dark mode toggle.
- `Preloader.tsx`: animated splash that respects `prefers-reduced-motion`.
- `PageHero.tsx`: reusable page hero with gradient, overlay, motion.
- `SkeletonLoader.tsx` and `LoadingSpinner.tsx`: loading states.
- `Menu.tsx`: search, category filter, incremental pagination (“Show More”), cart with desktop sidebar and mobile drawer, totals, and “Buy Now” → `Order`.
- `Order.tsx`: cart review, customer info validation, totals (delivery, tax), simulated submission with success/error/processing states.
- `Contact.tsx`: validated form, actionable contact cards (copy-to-clipboard where relevant), embedded Google Map, toast notifications.
- `Reviews.tsx`: ratings stats, distribution bars, filter by rating, add review modal.
- `ThemeContext.tsx`: persistent dark mode via `localStorage` and `document.documentElement.classList`.
- `ErrorBoundary.tsx`: graceful error UI in production; logs in dev.

### Accessibility and Performance
- Respects `prefers-reduced-motion` in preloader and animations.
- Lazy-loaded routes reduce initial bundle.
- Image validation reorders rather than dropping to keep UX consistent.
- Buttons and controls include focus styles; semantic elements and ARIA where appropriate.

### SEO and Meta
- `index.html` sets basic meta tags and social previews (Open Graph, Twitter) with `fork-flame-og.png` placeholder.
- `public/robots.txt` and `public/sitemap.xml` included.

### Development Conventions
- TypeScript-first with explicit interfaces for domain entities (`FoodItem`, `CartItem`).
- Centralized constants in `src/utils/constants.ts` (routes, storage keys, API).
- UI components prefer composition (e.g., `CardHeader`, `CardBody`, `CardFooter`).
- Avoid deep nesting; early returns and clear guard clauses.

### Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — run ESLint

### Deployment Notes
- The app is a static SPA; deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).
- If hosting without server-side routing, ensure SPA fallback routing is enabled (e.g., Netlify `_redirects` set to `/* /index.html 200`).

### Future Improvements
- Persist cart to `localStorage` and sync across pages.
- Real backend integration for orders and reviews.
- Image CDN with transformations for responsive images.
- Unit and integration tests.

### License
MIT — see LICENSE if provided.
