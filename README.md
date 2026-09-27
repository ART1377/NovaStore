# NovaStore

A production-minded full-stack e-commerce platform built with **Next.js 16**, **React 19**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Tailwind CSS v4**.

NovaStore ships a complete customer-facing storefront alongside a feature-rich admin workspace, with a strong focus on **data integrity**, **consistent design tokens**, **reusable patterns**, and a **clean, maintainable codebase**.

<p align="center">
  <a href="https://nova-store-topaz.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit-000?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/ART1377/NovaStore">
    <img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github" alt="Source" />
  </a>
</p>

---

## 📖 Overview

NovaStore is designed as a realistic e-commerce experience with two distinct surfaces:

- A **storefront** with browsing, filtering, comparison, cart, and checkout flows
- An **admin workspace** with products, orders, users, inventory, reviews, coupons, and homepage curation

Beyond the features, the project applies production-grade engineering discipline:

- **Atomic checkout** with stock concurrency control
- **Idempotent order creation** to prevent duplicates from retries or double-clicks
- **Design tokens** powering 10 runtime-switchable themes
- **Reusable admin patterns** (pagination, mutation wrapper, delete confirmation)
- **Consistent error handling** across client and server
- **Real-time notifications** through Pusher channels

---

## ✨ Features

### Storefront

- 🛍️ Product browsing with category and brand filters
- 🔎 Debounced search with live suggestions
- 💰 Price range filtering with a dual-thumb slider
- 📦 Product variants with live stock awareness
- 🖼️ Fullscreen image gallery with keyboard navigation
- ⚡ Quick View modal for fast inspection
- ⚖️ Persisted product comparison
- ❤️ Wishlist with move-to-cart action
- 🛒 Live cart with quantity controls and stock limits
- 🎟️ Coupon validation aware of shipping method
- 💳 Checkout with atomic stock reservation
- ⭐ Purchase-verified ratings, reviews, and threaded replies
- 📍 Multiple delivery addresses with default selection
- 📋 Order history and live order tracking
- 🕒 Recently viewed products
- 🎨 10 runtime-switchable color themes
- ✨ Smooth Framer Motion animations
- 📱 RTL-first Persian UI with full mobile support

### Admin Workspace

- 📊 Dashboard with revenue chart, order status, low stock alerts, and best sellers
- 📦 Product management with variants, images, and Cloudinary upload
- 🏷️ Categories and brands with slug-stable editing
- 📋 Order management with status workflow and tracking numbers
- 👥 User management with role assignment
- 📦 Inventory management with inline stock editing
- ⭐ Review moderation
- 🎟️ Coupon management (percentage / fixed types)
- 🏠 Homepage placement editor (Hero, featured, discounted, best sellers, newest)
- 🖼️ Cloudinary media upload with confirm-before-delete
- 🔐 Role-based access control at routing and API boundaries
- 📄 Server-side pagination on every admin list
- 🎯 Consistent toast, error, and empty states

---

## 🏗️ Architecture

NovaStore follows a **feature-first architecture** with explicit separation of concerns:

```text
┌──────────────────────────┐
│   App Router (pages)     │  thin, data-fetching only
├──────────────────────────┤
│   Feature modules        │  components · hooks · api · validation · types
├──────────────────────────┤
│   Shared UI / hooks      │  primitives, layout, cross-cutting logic
├──────────────────────────┤
│   Lib / services         │  auth, pricing, cache, api client
├──────────────────────────┤
│   Prisma / PostgreSQL    │  schema, seed, migrations
└──────────────────────────┘
```

**Key architectural decisions:**

- **Server Components by default** — client components are introduced only where browser interactivity is required
- **Shared business rules** — pricing, coupon validation, and cart subtotal live in `lib/` so checkout and preview endpoints stay in sync
- **Consistent admin patterns** — a shared mutation wrapper, generic resource handlers, and a reusable delete confirmation are used across every admin page
- **Design tokens over hardcoded values** — every color flows from CSS variables on `html[data-theme]`, so adding a theme never requires touching a component
- **Data integrity first** — checkout runs in a single transaction with conditional stock updates, and order creation is deduplicated by an idempotency key

---

## 🛠️ Tech Stack

**Core** — Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4

**Data & Backend** — Prisma 6 · PostgreSQL (Neon) · NextAuth v4 · REST API routes

**Services** — Cloudinary (media) · Pusher (real-time notifications)

**Forms, State & UI** — React Hook Form · Zod · TanStack Query v5 · Framer Motion · custom Nova UI kit built on Tailwind v4 tokens

**Tooling** — pnpm · ESLint · Prettier · Husky · Commitlint · lint-staged

---

## 📁 Project Structure

```text
src/
├── app/                          # App Router: pages + API routes
│   ├── account/                  # Authenticated user area
│   ├── admin/                    # Admin workspace
│   └── api/                      # REST endpoints
├── components/
│   ├── layout/                   # Header, Footer, ThemeSwitcher
│   ├── shared/                   # Cross-feature UI (ImageWithFallback, …)
│   └── ui/                       # Primitives (Button, Input, Select, …)
├── features/                     # Domain modules
│   ├── admin/                    # Admin UI, hooks, api, validation
│   ├── account/                  # Profile, addresses, auth
│   ├── cart/                     # Cart state and actions
│   ├── catalog/                  # Products, filters, product detail
│   ├── checkout/                 # Address, shipping, coupon, order
│   ├── compare/                  # Persisted compare tool
│   ├── home/                     # Homepage data + sections
│   ├── notifications/            # Real-time + persistent notifications
│   ├── orders/                   # Order history and tracking
│   └── wishlist/                 # Wishlist state and UI
├── constants/                    # Shared enums, thresholds, labels
├── hooks/                        # Generic reusable hooks
├── lib/                          # Auth, prisma, api client, pricing, cache
├── providers/                    # Session + React Query providers
└── types/                        # Ambient type declarations
```

Every feature module follows the same shape:

```text
feature-name/
├── api/          # fetch functions using the shared api client
├── components/   # UI specific to this feature
├── hooks/        # React Query hooks + local state
├── types/        # domain types
└── validation/   # Zod schemas
```

---

## 🔐 Environment Variables

NovaStore requires a Postgres database, a NextAuth secret, Cloudinary credentials, and Pusher channels. Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

```env
# Database (Neon or any Postgres)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"   # for migrations

# NextAuth
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Pusher — create a free app at https://dashboard.pusher.com
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""
PUSHER_APP_ID=""
PUSHER_SECRET=""
PUSHER_CLUSTER=""

# Cloudinary — create a free account at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A Postgres database (Neon's free tier works well)

### Setup

```bash
# 1. Clone and install
git clone https://github.com/ART1377/NovaStore.git
cd NovaStore
pnpm install

# 2. Configure environment
cp .env.example .env
# Fill in the values described above

# 3. Set up the database
pnpm db:push           # sync schema to the database
pnpm db:seed           # seed demo data (admin, customers, orders, reviews)

# 4. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Accounts

After seeding, sign in with any of these accounts:

| Role     | Email            | Password    |
| -------- | ---------------- | ----------- |
| Admin    | `admin@shop.dev` | `Admin123!` |
| Customer | `demo@shop.dev`  | `Admin123!` |
| Customer | `sara@shop.dev`  | `Admin123!` |

> The admin account is seeded intentionally so reviewers can explore the full admin workspace immediately.

### Available Scripts

| Script           | Purpose                          |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Start the dev server             |
| `pnpm build`     | Production build                 |
| `pnpm start`     | Run the production build locally |
| `pnpm lint`      | ESLint across the repo           |
| `pnpm lint:fix`  | ESLint with auto-fix             |
| `pnpm format`    | Prettier write                   |
| `pnpm typecheck` | TypeScript without emit          |
| `pnpm db:push`   | Apply schema to the database     |
| `pnpm db:seed`   | Seed demo data                   |
| `pnpm db:reset`  | Drop, recreate, and re-seed      |
| `pnpm db:studio` | Open Prisma Studio               |

---

## 🧪 Quality Gates

Every commit is guarded by:

- **ESLint** with `unused-imports` — auto-removes dead imports
- **Prettier** with the Tailwind plugin
- **TypeScript** in strict mode
- **Husky hooks** — lint-staged before commit, full build before push
- **Commitlint** enforcing Conventional Commits

Run the same checks locally:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

---

## 🎯 Notable Engineering Decisions

A few highlights that reflect the care put into the codebase:

- **Idempotent checkout** — every order carries a client-generated idempotency key. Retries and double-clicks cannot create duplicate orders, and concurrent requests converge on a single row.
- **Atomic stock reservation** — checkout runs inside a Prisma transaction and decrements stock with a conditional `updateMany`, so an order never oversells.
- **Single source of truth for pricing** — `lib/coupon-pricing.ts` powers both `/checkout` and `/coupons/validate`, so the cart preview and the server-authoritative total always agree.
- **Design tokens over hardcoded colors** — all UI colors flow from CSS variables, letting 10 themes switch at runtime without a single re-render.
- **Shared admin mutation wrapper** — every admin mutation declares _what_ changed via `invalidateKeys`, and the wrapper handles toasts, cache invalidation, and error mapping.
- **Graceful image fallbacks** — remote images that fail to load (VPN, offline, expired asset) render a Nova placeholder instead of a broken icon.
- **ISR on the storefront** — the homepage is statically generated with a 60-second revalidation window, and checkout invalidates it on demand.

---

## 👨‍💻 Author

**Alireza Tahavori** — Frontend / Full-Stack Developer

- 🌐 Portfolio: [alireza-tahavori.vercel.app](https://alireza-tahavori.vercel.app)
- 💼 LinkedIn: [in/alireza-tahavori](https://www.linkedin.com/in/alireza-tahavori)
- 🐙 GitHub: [@ART1377](https://github.com/ART1377)

---

Built with **Next.js 16**, **React 19**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Tailwind CSS v4**.
