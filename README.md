# BONESYDE — Headless Shopify Storefront

A premium, production-ready headless storefront for BONESYDE, built with Next.js 15
(App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP, and the Shopify
Storefront API.

**Shopify is the single source of truth.** There is no hardcoded product, price,
image, or collection data anywhere in this codebase — every page fetches live
from your Shopify store. Add a product in Shopify and it appears on the site
automatically; change a price, upload a new image, mark something sold out —
the site reflects it without a single code change or redeploy (data is fetched
at request time).

---

## 1. Set up the Shopify side (do this first)

You need a **Storefront API** access token. This is different from your Admin
API token — it's safe to use because it only exposes published, public storefront
data (no customer data, no orders).

1. In Shopify Admin, go to **Settings → Apps and sales channels → Develop apps**.
2. Click **Allow custom app development** if you haven't already, then
   **Create an app** (e.g. name it "BONESYDE Storefront").
3. Open the app → **Configuration** → **Storefront API integration** → **Configure**.
4. Enable at minimum these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_read_checkouts` / `unauthenticated_write_checkouts`
   - `unauthenticated_read_customer_tags` (only if you plan to use customer-tag
     based merchandising)
5. Save, then go to the **API credentials** tab and **install the app**.
6. Copy the **Storefront API access token** — you'll need it below.
7. Note your store domain, e.g. `your-store.myshopify.com`.

### Product setup notes
- **Best Sellers** section/sort uses Shopify's `BEST_SELLING` sort key, which is
  driven by actual sales data — it will be empty/unsorted on a brand-new store
  with no orders yet. This is expected Shopify behavior, not a bug.
- **Featured Collection** on the homepage looks for a collection with the handle
  `featured` first; if none exists, it falls back to whichever collection
  Shopify returns first. Create a collection with handle `featured` to control
  this explicitly.
- Add at least one image per product — the UI is designed around full-bleed
  imagery and looks best with high-resolution photography (min. 1600px on the
  long edge recommended).

---

## 2. Configure environment variables

Copy the example file and fill in your real values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_STOREFRONT_API_VERSION=2025-01
NEXT_PUBLIC_SITE_URL=https://www.bonesyde.com
```

> `SHOPIFY_STOREFRONT_ACCESS_TOKEN` has **no** `NEXT_PUBLIC_` prefix — it stays
> server-side only. Cart mutations are routed through Next.js Server Actions
> (`src/lib/actions/cart.ts`) specifically so this token never reaches the browser.

---

## 3. Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

Deploy anywhere that supports Next.js (Vercel is the path of least resistance —
just import the repo and paste in the same environment variables).

---

## 4. Project structure

```
src/
  app/                      Routes (App Router)
    page.tsx                Home
    shop/                   Shop (search, filters, sort, pagination)
    collections/            Collections index + [handle] detail
    products/[handle]/      Product detail page
    about/, contact/        Static-ish marketing pages
    cart/                   Full-page cart (in addition to the slide-out drawer)
    api/newsletter/         Newsletter signup endpoint (stub — wire to ESP)
    api/contact/            Contact form endpoint (stub — wire to inbox/helpdesk)
    sitemap.ts, robots.ts   SEO, generated from live Shopify data

  components/
    layout/                 Header, mobile menu, footer
    home/                   Hero, New Arrivals, Featured Collection, Best
                            Sellers, Collection Grid, Brand Story, Newsletter,
                            Instagram-style gallery
    product/                Gallery, variant/size form, grid, card, related
    shop/                   Search, filters, sort, paginated grid
    cart/                   Slide-out drawer + line item row
    ui/                     Reusable primitives (animated section, marquee,
                            loader)

  lib/
    shopify/
      client.ts             Low-level fetch wrapper around the Storefront API
      queries.ts             GraphQL queries
      mutations.ts          GraphQL cart mutations
      fragments.ts           Shared field selections
      types.ts               Clean, app-facing TypeScript types
      index.ts               High-level functions (getProducts, getCart, etc.)
    actions/                Server actions (cart mutations, pagination)
    utils.ts                Price formatting, sale logic, etc.

  context/
    CartContext.tsx          Client-side cart state, persisted cart ID,
                            talks to Shopify exclusively via server actions
```

Every product/collection/cart-facing component imports from `@/lib/shopify` —
there's a single, well-typed boundary between this app and Shopify, so the
Storefront API version or schema can evolve without touching UI code.

---

## 5. Design system

Colors, type, and spacing are centralized in `tailwind.config.ts` and
`src/app/globals.css`:

| Token                  | Value                  |
|-------------------------|-------------------------|
| `background`            | `#020E0E`               |
| `background-secondary`  | `#05614B`               |
| `accent`                | `#01DE82`               |
| `foreground`            | `#FFFFFF`               |
| `foreground-secondary`  | `rgba(255,255,255,0.7)` |

Typography pairs **Bricolage Grotesque** (display/headlines) with **Inter**
(body copy) and **IBM Plex Mono** (small data labels like SKU/price tags),
loaded via `next/font/google` for zero layout shift and no external request
at runtime.

To rebrand colors or fonts, edit `tailwind.config.ts` and the font imports in
`src/app/layout.tsx` — nothing else needs to change.

---

## 6. Notes on a few deliberate decisions

- **Cart**: uses Shopify's Cart API (not the legacy Checkout API). `checkoutUrl`
  from the cart object sends customers straight to Shopify-hosted checkout —
  no custom checkout UI to maintain or that could fall out of PCI compliance.
- **Pagination**: the shop and collection pages render an initial page on the
  server (good for SEO/performance) and use a "Load More" button backed by a
  server action for subsequent pages — this avoids shipping the entire catalog
  to the client up front while staying simple and robust (no IntersectionObserver
  edge cases).
- **Images**: configured to read from `cdn.shopify.com` only
  (`next.config.ts`) and served through `next/image` for automatic resizing,
  lazy loading, and modern formats (AVIF/WebP).
- **Resilience**: every Shopify data function catches and logs errors instead
  of throwing into the page — if the Storefront API is briefly unreachable, the
  site degrades gracefully (empty states) instead of 500ing.

## 7. Things you'll likely want to wire up next

- **Newsletter / contact form backends** — both routes
  (`src/app/api/newsletter/route.ts`, `src/app/api/contact/route.ts`) are
  intentionally left as clearly-marked stubs. Plug in Klaviyo, a transactional
  email provider, or the Shopify Admin API as you prefer.
- **Real Instagram feed** — the homepage gallery currently showcases live
  product photography (so it's accurate without extra API setup). Swap in the
  Instagram Graph API if you want literal IG post embeds.
- **Logo / favicon** — drop your brand mark into `public/` and reference it
  from `src/app/layout.tsx` metadata and `src/components/layout/Header.tsx`.
