# Clixo — Development Guide

Clixo is a decentralised opinion market on Sepolia. Creators post a question with 2–10 image options and stake ETH; workers vote blind and split the stake when the vote target is reached. The frontend is a precision instrument — cold, data-forward, surgical. No consumer-app decoration.

This guide covers the **frontend**. Backend conventions live in `CLAUDE.md`.

> Rewritten 2026-08-04 to match the design-system overhaul. The previous version mandated inline `style={{}}` objects, per-file font constants, and `useState` hover — all removed. If you find a copy of this file saying otherwise, it is stale; delete it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.1 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, configured **in CSS** (`@theme inline`) — there is no `tailwind.config.ts` |
| Motion | framer-motion behind `LazyMotion` |
| Wallet | wagmi + RainbowKit |
| Auth | SIWE-shaped challenge/sign/verify → JWT |
| Global state | Zustand (`persist`, key `"clixo-storage"`) |
| Server state | @tanstack/react-query |
| HTTP | Axios (`lib/api.ts`) |
| Toasts | Sonner · Icons: Lucide · Charts: Recharts · Uploads: react-dropzone |
| Backend | Express API at `localhost:4000` (this repo, `backend/`) |
| Network | Sepolia testnet |

---

## Repository Layout

```
frontend/
├── app/
│   ├── globals.css          ← design tokens (see below — changes cascade everywhere)
│   ├── layout.tsx           ← root: fonts, Providers, Navbar, Breadcrumb, Footer
│   ├── page.tsx             ← landing
│   ├── browse/ dashboard/ create-task/ vote/[id]/ tasks/[id]/
│   │   └── layout.tsx       ← exists only to set `metadata.title`; renders <>{children}</>
├── components/
│   ├── ui/                  ← 12 primitives + buttonVariants.ts
│   ├── layout/              ← Navbar, Footer, Breadcrumb, PageWrapper, ScrollToTop
│   ├── wallet/              ← Providers, ConnectButton, WalletGuard
│   ├── tasks/ vote/ dashboard/ create-task/ home/
├── hooks/                   ← useWalletUser, useEthPrice, useBreadcrumbs, useCountUp
├── lib/                     ← api.ts, wagmi.ts, queryClient.ts, utils.ts (cn)
├── store/useAppStore.ts
└── types/                   ← index.ts (domain), global.d.ts (window.ethereum)
```

---

## Design System

Tokens are CSS custom properties in `app/globals.css`, exposed to Tailwind through `@theme inline`. **Name the role, never the value.** Never a raw hex, never a Tailwind palette colour (`bg-zinc-800`, `text-purple-400`).

### Colour

| Token | Utility | Value | Usage |
|---|---|---|---|
| `--ink` | `bg-ink` | `#0c0c0e` | page background |
| `--surface-1` | `bg-surface` | `#111113` | cards, panels, sticky sidebars |
| `--surface-2` | `bg-raised` | `#19191d` | hover states, inputs, raised elements |
| `--line` | `border-line` | `#242428` | borders, dividers, table headers |
| `--line-subtle` | `border-subtle` | `#1c1c20` | table row dividers |
| `--text-1` | `text-hi` | `#f0f0f0` | primary text, headings, active labels |
| `--text-2` | `text-lo` | `#888890` | body text, secondary labels |
| `--text-3` | `text-dim` | `#4a4a52` | muted labels, disabled, mono data |
| `--amber` | `text-amber` | `#e8a020` | **ETH and money only** |
| `--amber-dim` | `bg-amber-bg` | `#3d2a08` | amber backgrounds |
| `--green` | `text-green` | `#22c55e` | OPEN status, success |
| `--red` | `text-red` | `#f43f5e` | errors, wrong network |

Amber is reserved for money. If a value is not ETH, it is not amber.

### Typography

Three fonts, each with one job. Loaded via `next/font/google` in `app/layout.tsx` and reachable as Tailwind utilities — **do not declare font constants in component files.**

| Font | Utility | Role |
|---|---|---|
| Geist | `font-display` | headings, titles, buttons, tab labels |
| Inter | (body default) | body copy, descriptions, table cells |
| JetBrains Mono | `font-mono` | ETH values, stats, table headers, status, dates, addresses |

`h1`–`h6` already get Geist, weight 500, `-0.02em` tracking, `--text-1` from the base layer. Do not re-specify.

**`eyebrow` is a custom utility**, not a set of classes — the app's signature mono-uppercase micro-label:

```tsx
<div className="eyebrow mb-2">Section Label</div>
```

`scrollbar-none` is the other custom utility (used on horizontally scrolling tab strips).

### Radii and Motion

`rounded-xs` 2px (micro-thumbs) · `rounded-sm` 3px (images) · `rounded-md` 5px (buttons, inputs, badges) · `rounded-lg` 6px (cards, panels). Nothing larger.

Named animations live in `@theme`: `animate-shimmer` (skeletons), `animate-fade-up`, `animate-scroll-hint`, plus `ease-out-quart`. All are disabled under `prefers-reduced-motion` by a global block in `globals.css`.

### Elevation

Shadows are used **sparingly and only for elevation or focus**, never as decoration:

- card hover lift — `hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]`
- input/textarea focus ring — `focus:shadow-[0_0_0_3px_rgba(240,240,240,0.05)]`
- floating surfaces (wallet dropdown)
- one amber glow, on `WinnerBanner` and the landing hero card — the only decorative exception

`backdrop-blur` appears exactly once, on the mobile fixed submit bar. Do not add more. No glassmorphism, no ambient glows, no coloured drop-shadows.

---

## Styling Conventions

**Tailwind utility classes over token names.** Not inline styles.

```tsx
// Correct
<div className="bg-surface border border-line rounded-lg p-4 text-[13px] text-lo">

// Wrong — raw values, and unstyleable by hover/focus variants
<div style={{ background: "#111113", border: "1px solid #242428" }}>
```

Inline `style` is acceptable for exactly one thing: a **computed** value that cannot be a class, such as a progress-bar width.

```tsx
<div className="h-0.5 overflow-hidden rounded-[1px] bg-line">
  <div className="h-full bg-lo transition-[width] duration-[400ms] ease-out"
       style={{ width: `${progressPct}%` }} />
</div>
```

**Compose classes with `cn()`** (`lib/utils.ts` — clsx + tailwind-merge) so conditional classes override cleanly rather than fighting over specificity.

**Hover, focus, and reduced-motion are CSS variants**, not React state: `hover:`, `focus-visible:`, `motion-reduce:`, `group-hover:`, `starting:`. Focus rings are already global (`*:focus-visible` in `globals.css`) — do not add per-component outlines.

---

## Component Patterns

**Server by default.** Add `"use client"` only for hooks, event handlers, or browser APIs. The landing page is a server component.

**Named exports** for components; default exports only for `page.tsx` / `layout.tsx`.

**Props typed inline** at the top of the file, unless shared across many files (then `types/index.ts`).

**Reach for the platform before a library.** The mobile drawer is a native `<dialog>` + `showModal()` — Escape, focus trap, background inertness and `::backdrop` are free. Its entry animation is CSS `starting:translate-x-full`. Check for a native element before writing or installing a component.

**Primitives are hand-rolled** (`components/ui/`) — no Radix, no shadcn CLI. That means **accessibility is your responsibility**: role, `aria-*`, keyboard traversal, focus return. `Tabs` is the reference implementation (`role="tablist"`, `aria-selected`, roving `tabIndex`, arrow-key navigation).

**`buttonVariants` is server-safe.** Import from `components/ui/buttonVariants` to style a `<Link>` or a server component without pulling the client `Button` into the bundle:

```tsx
<Link href="/create-task" className={buttonVariants({ variant: "outline", size: "sm" })}>
```

Variants: `primary | outline | ghost | amber | danger`. Sizes: `sm | md | lg`.

**Available primitives:** `Badge` `Button` `Card` `EmptyState` `Input` `PageTransition` `Reveal` `Skeleton` `Spinner` `StatBlock` `Tabs` `Textarea`. Check this list before building a new one.

---

## Motion

framer-motion runs behind `LazyMotion features={domMax} strict` in `Providers.tsx`.

- **Use `m.div`, never `motion.div`.** `strict` makes `motion.` a runtime throw, not a type error.
- Guard every animation with `useReducedMotion()` and return the static element when it is true — `PageTransition` and `Reveal` are the reference.
- `PageTransition` wraps page content (fade + 4px rise). `Reveal` is scroll-triggered, `viewport={{ once: true }}`.
- Prefer CSS (`transition-colors`, `@starting-style`, keyframes in `@theme`) for anything a class can express. Reserve framer-motion for enter/exit choreography, layout animation, and `AnimatePresence`.
- Hover is border-colour lift plus, on cards, a 2px rise. No scale transforms on hover except the 1.02 image zoom inside `TaskCard`.

---

## State Management

**Auth (Zustand).** `useAppStore` persists `token`, `walletAddress`, `userId`, `workerId` under `"clixo-storage"`. Never read `localStorage` directly.

**`useWalletUser()`** wraps wagmi + Zustand and returns `{ address, isConnected, isAuthenticating, isInitializing, isLogged, token, login, logout }`.

Three states, not one — always branch on all three:

- `isInitializing` — wagmi reconnecting **or** the store still hydrating. Show a loading state.
- `isAuthenticating` — signature in flight.
- `isLogged` — token present **and** its address matches the currently connected wallet.

Switching accounts in the wallet clears the session; the check is address equality, case-insensitive.

**Server state (React Query).** Wallet-scoped queries take `address` in the key *and* gate on it:

```tsx
useQuery({
  queryKey: ["my-tasks", address],
  queryFn: () => meApi.getTasks(),
  enabled: !!address,
});
```

Both halves are needed — the key alone still lets an unauthenticated 401 into the cache. The client is a singleton in `lib/queryClient.ts` (`refetchOnWindowFocus: false`, `retry: 1`, `staleTime: 5min`).

**UI state (`useState`).** Hover, selection, tabs, accordions. Do not lift purely visual state into Zustand or React Query.

---

## API and Auth

Base URL `NEXT_PUBLIC_API_BASE_URL`, default `http://localhost:4000/api`. All endpoints are declared in `lib/api.ts`; an Axios request interceptor attaches the bearer token. Read backend errors from `err.response?.data?.message` via `axios.isAxiosError(err)`.

Groups: `authApi` `taskApi` `uploadApi` `submissionApi` `meApi` — plus `aggregationApi`, `rewardApi`, `payoutApi`, which are **declared but have no call sites**. The settlement and withdrawal flows are not wired up; see `known-defects.md` in Developer Brain before assuming they work.

Auth-gated pages wrap in `<WalletGuard>`, which renders the three states above. Never reimplement it. `/browse` and `/` are public; vote, dashboard, task detail and create-task are gated.

---

## Images

Always `next/image`. Remote hosts are allow-listed in `next.config.ts` (`gateway.pinata.cloud`, `ipfs.io`) — an image from anywhere else will fail at runtime.

```tsx
// Aspect-ratio container — always pass `sizes` with `fill`
<div className="relative aspect-video">
  <Image src={src} alt="…" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
</div>
```

Source is `option.gateway_url || option.image_url || ""`. For local `File` previews, create the object URL in a `useEffect` keyed on the file and revoke it in the cleanup (`ThumbnailUploader` is the reference).

---

## Layout and Responsive

Navbar is `52px`. Sticky full-height panels: `top-[52px] h-[calc(100dvh-52px)]`.

`PageWrapper` owns horizontal padding (`px-4 sm:px-8 lg:px-12`) — use it rather than re-specifying per page. Navbar content is capped at `max-w-[1280px]`.

Breakpoint is `md` (768px). Desktop and mobile variants are separate subtrees (`hidden md:flex` / `md:hidden`), not one tree with overrides. Established mobile patterns:

- context panels collapse into a top accordion (voting page)
- tables collapse into stacked cards
- fixed bottom action bars need `pb-[88px]` on the scrolling content above them

Every page must work at mobile width. Every table must have a card form.

---

## Page Architectures

**Voting (`app/vote/[id]/page.tsx`)** — the most-used screen. Desktop: 60% thumbnail grid / 40% sticky context panel with reward, progress, and submit. Mobile: collapsible context accordion, full-width grid, fixed bottom submit. `ThumbnailGallery` is purely presentational — the page owns selection, submission, fetching, and layout. Distinct terminal states: loading, not-found, closed, creator-blocked, already-voted.

**Task detail (`app/tasks/[id]/page.tsx`)** — creator-facing results. Header stats, winner banner when complete, results grid, votes-over-time chart. Recharts is `next/dynamic` with `ssr: false` and a `Skeleton` fallback at the chart's exact height; keep it that way.

**Dashboard (`app/dashboard/page.tsx`)** — stats row → `Tabs` subnav → table content. The active tab is persisted in the URL (`?tab=tasks|work`), so the page is wrapped in `<Suspense>` for `useSearchParams`. `layout.tsx` is a metadata-only pass-through — no sidebar.

**Create task (`app/create-task/page.tsx`)** — 4-step wizard (Details → Upload → Confirm → Success) with a desktop summary sidebar. `ethers` is `await import()`-ed inside the submit handler so it stays out of the route bundle. Uploads run in parallel with a live progress counter.

---

## Performance Rules

- Defer heavy dependencies to their moment of use, and **write the reason and the size in a comment** so the next reader can judge whether it still pays (`ethers`, `recharts` are the two examples).
- Parallelise independent network calls in submit handlers (`Promise.all`) — the user is watching.
- `useMemo` list filtering/sorting; use a `Set` for membership lookups across a list.
- Share cross-component fetches through one React Query key (`useEthPrice` is one CoinGecko call for three consumers).
- Mark a knowingly-cheap shortcut in place with its ceiling and its trigger:
  `// ponytail: client-side aggregation; move to a backend /stats endpoint if the task list grows.`

---

## Definition of Done

1. `npx tsc --noEmit` clean in the package you touched
2. `npm run build` clean (catches server/client boundary violations)
3. Dev server: navigate to the changed page(s)
4. No new console errors
5. Mobile breakpoint checked
6. If auth-gated: the pre-auth `WalletGuard` state renders
7. Empty and loading states handled — no blank divs, no crashes
8. **If the change touches a multi-step flow, run the flow end to end** — a screen that renders is not a flow that works
9. Committed with a Conventional Commit message

---

## Files That Require Extra Care

| File | Why |
|---|---|
| `app/globals.css` | every token; changes cascade to every component |
| `types/index.ts` | shared domain types; `TaskStatus` must match the backend's status strings |
| `store/useAppStore.ts` | persisted auth; schema changes break live sessions |
| `lib/api.ts` | every backend call and the auth interceptor |
| `hooks/useWalletUser.ts` | SIWE flow; the reconnect/hydration logic is fragile |
| `components/wallet/Providers.tsx` | wagmi + RainbowKit + LazyMotion; wrong config breaks wallets or all motion |
| `app/layout.tsx` | fonts and root shell; affects every page |

---

## What Not To Do

- **No `motion.` components** — `m.` only, under `LazyMotion strict`
- **No raw hex or Tailwind palette colours** — `bg-zinc-*`, `text-purple-*`, `border-emerald-*`
- **No purple, cyan, or emerald**; amber is for money and nothing else
- **No glassmorphism**, no ambient glows, no coloured drop-shadows
- **No radii above 6px** — `rounded-xl`/`2xl`/`3xl` do not belong
- **No per-file font constants** — use `font-display` / `font-mono`
- **No `useState` hover** — use `hover:` and `group-hover:`
- **No inline `style`** except for computed values (widths, transforms from state)
- **No `tailwind.config.ts`** — Tailwind v4 is configured in `globals.css`
- **No AI attribution in commits** — no `Co-Authored-By`, no `Generated-by`
- **No comments explaining what code does** — comment the non-obvious *why*
