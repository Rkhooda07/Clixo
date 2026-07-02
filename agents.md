# Clixo — Development Guide

Clixo is a decentralized thumbnail testing platform. Creators upload thumbnail variants, stake ETH as a reward, and get real human votes from workers who earn ETH for participating. The frontend is a precision instrument — cold, data-forward, surgical. No consumer-app decoration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.1.0 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Wallet | wagmi + RainbowKit |
| Auth | SIWE (Sign-In with Ethereum) |
| Global state | Zustand (`persist` middleware, key: `"clixo-storage"`) |
| Server state | @tanstack/react-query |
| HTTP | Axios (`frontend/lib/api.ts`) |
| Toasts | Sonner |
| Icons | Lucide React |
| Images | `next/image` |
| Backend | Node.js API at `localhost:4000` (separate repo) |
| Network | Sepolia testnet |

---

## Repository Layout

```
/
├── frontend/          ← All Next.js code (work here)
│   ├── app/           ← App Router pages and layouts
│   │   ├── globals.css        ← Design tokens (do not touch lightly)
│   │   ├── layout.tsx         ← Root layout (Navbar + Footer + Providers)
│   │   ├── page.tsx           ← Landing page (server component)
│   │   ├── browse/            ← Task browser
│   │   ├── vote/[id]/         ← Voting page (most used screen)
│   │   ├── dashboard/         ← User dashboard + layout.tsx
│   │   └── create-task/       ← Task creation
│   ├── components/
│   │   ├── dashboard/         ← StatsRow, ActivityTabs, MyTasks, MyWork
│   │   ├── home/              ← LiveStats
│   │   ├── layout/            ← Navbar, Footer
│   │   ├── tasks/             ← TaskCard, ThumbnailUploader, WinnerBanner, ResultsGrid
│   │   ├── ui/                ← EmptyState, Skeleton, etc.
│   │   ├── vote/              ← ThumbnailGallery, AlreadyVoted
│   │   └── wallet/            ← ConnectButton, WalletGuard, Providers
│   ├── hooks/
│   │   └── useWalletUser.ts   ← SIWE auth flow hook
│   ├── lib/
│   │   ├── api.ts             ← Axios API client (all endpoints)
│   │   └── queryClient.ts     ← React Query client singleton
│   ├── store/
│   │   └── useAppStore.ts     ← Zustand store (token, walletAddress)
│   └── types/
│       └── index.ts           ← Core TypeScript types
└── backend/           ← Separate Node.js API (do not modify from frontend work)
```

---

## Design System

All tokens are defined as CSS custom properties in `frontend/app/globals.css` and mapped to Tailwind via `@theme inline`. Never add color scales or override the theme mapping.

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#0c0c0e` | Page background |
| `--surface-1` | `#111113` | Cards, panels, sticky sidebars |
| `--surface-2` | `#19191d` | Hover states, inputs, raised elements |
| `--line` | `#242428` | Borders, dividers, table headers |
| `--line-subtle` | `#1c1c20` | Table row dividers |
| `--text-1` | `#f0f0f0` | Primary text, headings, active labels |
| `--text-2` | `#888890` | Body text, secondary labels |
| `--text-3` | `#4a4a52` | Muted labels, disabled text, mono data |
| `--amber` | `#e8a020` | ETH values, rewards, highlights |
| `--amber-dim` | `#3d2a08` | Amber backgrounds |
| `--green` | `#22c55e` | OPEN status, success states |
| `--red` | `#f43f5e` | Error states, wrong network |

### Typography

Three fonts. Each has a specific role — do not swap them.

| Font | Variable | Role |
|---|---|---|
| Geist | `"Geist, system-ui, sans-serif"` | Display, headings, titles, CTA buttons, tab labels |
| Inter | `"Inter, system-ui, sans-serif"` | Body copy, descriptions, prose |
| JetBrains Mono | `"JetBrains Mono, monospace"` | ETH values, stats, table headers, status labels, dates, codes |

Declare font constants at the top of every client component file:

```tsx
const mono = "JetBrains Mono, monospace";
const geist = "Geist, system-ui, sans-serif";
const inter = "Inter, system-ui, sans-serif";
```

### Type Scale (common sizes)

- Section eyebrows / table headers: 10px mono, `text-3`, `letter-spacing: 0.1em`, uppercase
- Status labels (OPEN/CLOSED): 10–11px mono, green or text-3
- Body / table data: 13px Inter, `text-2`
- Card titles: 16px Geist weight 500, `text-1`
- Panel headings: 20–24px Geist weight 500, `text-1`, `letter-spacing: -0.02em`
- ETH values in stats: 22–24px mono, amber
- Hero H1: `clamp(44px, 5.5vw, 72px)` Geist weight 500

---

## Styling Conventions

### Inline Styles — Always

All visual styling uses inline `style={{}}` props, not Tailwind utility classes. Tailwind is used **only** for responsive breakpoints and display toggling.

```tsx
// Correct
<div style={{ color: "var(--text-1)", fontFamily: geist, fontSize: "13px" }}>

// Wrong — Tailwind color/typography utilities
<div className="text-zinc-100 font-geist text-sm">
```

### Responsive Classes — Tailwind Only for Display

```tsx
// Correct — Tailwind class controls display, no inline display style
<div className="hidden md:flex">
  ...
</div>

// Wrong — inline display overrides Tailwind responsive class
<div className="md:hidden" style={{ display: "flex" }}>
```

**Critical**: Never put `display` in an inline style on an element that also uses `md:hidden`, `md:flex`, `hidden`, etc. Wrap in a container div that holds only the Tailwind class.

### Hover States — useState Pattern

Tailwind `hover:` pseudo-classes cannot override inline styles. Use `onMouseEnter`/`onMouseLeave` with a `useState`:

```tsx
const [hovered, setHovered] = useState(false);

<div
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{
    border: `1px solid ${hovered ? "var(--text-3)" : "var(--line)"}`,
  }}
>
```

### Border Radius

- Cards, panels: `6px`
- Buttons, badges, inputs: `5px`
- Thumbnail images: `3px`
- Progress bars: `1px`
- No `rounded-xl`, `rounded-2xl`, `rounded-3xl` — those are the old design

### Borders

- Standard: `1px solid var(--line)`
- Subtle (table rows): `1px solid var(--line-subtle)`
- Active/selected: `1px solid var(--text-1)`
- Hover lift: `1px solid var(--text-3)`

### Shadows / Glows / Blur

None. No `box-shadow`, no `backdrop-blur`, no `drop-shadow`. No glassmorphism. No ambient glows.

---

## Component Patterns

### Server vs. Client

- Default to server components (no `"use client"`)
- Add `"use client"` only when the component uses hooks, event handlers, or browser APIs
- Landing page (`app/page.tsx`) is a server component — use `hover:` Tailwind classes for simple hover on links, extract interactive parts to client components

### Named Exports

Components use named exports. Only Next.js page/layout files use default exports.

```tsx
// components/tasks/TaskCard.tsx
export function TaskCard({ ... }) { ... }

// app/browse/page.tsx
export default function BrowsePage() { ... }
```

### Props Typing

Inline interfaces at the top of the file, not in a separate types file (unless shared across many files):

```tsx
interface TaskCardProps {
  task: Task;
  mode: "browse" | "creator-dashboard" | "worker-dashboard";
}
```

### `React.CSSProperties` for style objects

When extracting reusable style objects, type them:

```tsx
const TH_STYLE: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "10px",
  ...
};
```

---

## Key UI Patterns

### Progress Bar

```tsx
// Track
<div style={{ height: "2px", background: "var(--line)", borderRadius: "1px", overflow: "hidden" }}>
  // Fill
  <div style={{ height: "100%", width: `${pct}%`, background: "var(--text-2)", transition: "width 0.4s ease-out" }} />
</div>
```

### Status Label

```tsx
<span style={{ fontFamily: mono, fontSize: "11px", color: isOpen ? "var(--green)" : "var(--text-3)", letterSpacing: "0.04em" }}>
  {isOpen ? "OPEN" : "CLOSED"}
</span>
```

No badge pills. Status is plain mono text. `OPEN` = green, `CLOSED` = text-3.

### ETH Value

```tsx
<span style={{ fontFamily: mono, fontSize: "12px", color: "var(--amber)" }}>
  Ξ {rewardEth} ETH
</span>
```

Always `Ξ` prefix, amber, mono. Calculate from budget: `(task.budget * 0.001).toFixed(3)`.

### Section Eyebrow

```tsx
<div style={{ fontFamily: mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
  Section Label
</div>
```

### Data Tables

```tsx
<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th style={{ fontFamily: mono, fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 400, textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>
        Column
      </th>
    </tr>
  </thead>
  <tbody>
    <tr style={{ height: "48px", borderBottom: "1px solid var(--line-subtle)", background: hovered ? "var(--surface-2)" : "transparent" }}>
      <td style={{ fontFamily: inter, fontSize: "13px", color: "var(--text-2)", padding: "0 12px", verticalAlign: "middle" }}>
        Cell
      </td>
    </tr>
  </tbody>
</table>
```

### Full-Viewport Sections

Navbar is 52px. Use `calc(100dvh - 52px)` for full-screen sections:

```tsx
style={{ minHeight: "calc(100dvh - 52px)" }}
// sticky panels:
style={{ position: "sticky", top: "52px", height: "calc(100dvh - 52px)" }}
```

---

## Layout Dimensions

| Context | Value |
|---|---|
| Navbar height | `52px` |
| Page horizontal padding (desktop) | `40px` |
| Page horizontal padding (mobile) | `16px` |
| Stats section top padding | `32px` |
| Dashboard table padding | `24px 40px` |

---

## State Management

### Auth / Session (Zustand)

`useAppStore` persists `token` and `walletAddress` to localStorage under key `"clixo-storage"`. Never read localStorage directly — use `useAppStore()`.

`useWalletUser()` wraps wagmi + Zustand auth:
- Returns: `{ address, isConnected, isAuthenticating, isInitializing, isLogged, token, login, logout }`
- `isInitializing` is true while wagmi reconnects or the store is hydrating — always show a loading state while this is true

### Server State (React Query)

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["my-tasks", address],   // always include address in key for wallet-scoped queries
  queryFn: () => meApi.getTasks(),
  enabled: !!address,                // never fetch without wallet
});
```

### UI State (useState)

Local hover, selection, tab, accordion open/closed — always `useState`. Do not lift purely visual state into Zustand or React Query.

---

## API Conventions

Base URL: `http://localhost:4000`

Key endpoints (from `frontend/lib/api.ts`):

| Call | Purpose |
|---|---|
| `taskApi.getById(id)` | Fetch task + options |
| `taskApi.getStats(id)` | Vote breakdown per option |
| `meApi.getTasks()` | Creator's tasks |
| `meApi.getSubmissions()` | Worker's vote records |
| `meApi.getEarnings()` | Earnings: `{ pending, locked, totalEarned }` |
| `submissionApi.submit(taskId, optionId)` | Submit a vote |
| `authApi.getChallenge(address)` | SIWE challenge message |
| `authApi.verify(address, sig, nonce)` | Verify signature, returns JWT |

Error handling: catch `err.response?.data?.message` for backend error messages.

---

## Authentication

Pages requiring auth must be wrapped in `<WalletGuard>`. It handles three states: no token, token but wallet not connected (reconnecting), and wallet connected. Never duplicate this logic.

The voting page (`vote/[id]/page.tsx`) and dashboard are wallet-gated. Browse page is public.

---

## Images

Always use `next/image`. Two patterns:

**Fill (aspect-ratio containers):**
```tsx
<div style={{ position: "relative", aspectRatio: "16 / 9" }}>
  <Image src={src} alt="..." fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
</div>
```

**Fixed size (inline in tables/lists):**
```tsx
<Image src={src} alt="..." width={40} height={24} style={{ objectFit: "cover", borderRadius: "2px", display: "block" }} />
```

Always provide `sizes` with `fill`. Thumbnail sources: `option.gateway_url || option.image_url || ""`.

---

## Responsive Design

Desktop-first with mobile support. Breakpoint: `md` (768px).

- Desktop sidebar, split-panel, and multi-column layouts use `className="hidden md:flex"` wrappers
- Mobile alternatives use `className="md:hidden"` wrappers
- Mobile often collapses context into an accordion (e.g., voting page right panel → top accordion)
- Fixed bottom elements on mobile: `position: fixed; bottom: 0; left: 0; right: 0` + `borderTop: "1px solid var(--line)"` + `background: "var(--ink)"`
- Add `paddingBottom: "88px"` to scrollable mobile content above fixed bottom elements

---

## Voting Page Architecture

The voting page (`app/vote/[id]/page.tsx`) is the most-used screen. Its structure:
- **Desktop**: 60% left (thumbnail grid) / 40% right (sticky context panel with task info, reward, submit)
- **Mobile**: top accordion (collapsed task context) / full-width grid / fixed bottom submit button
- `ThumbnailGallery` is a pure presentational component — receives `selectedId` and `onSelect` from the page
- The page owns: selection state, vote submission, data fetching, layout

---

## Dashboard Architecture

The dashboard (`app/dashboard/`) uses a layout that is a transparent pass-through (no sidebar). All layout is self-contained in `page.tsx`. Structure: stats row → subnav tabs → table content.

`ActivityTabs` does NOT receive counts or use icons — plain Geist 500 text tabs with `border-bottom` active indicator.

---

## Animation & Interaction Principles

- Hover: border color lift only (`var(--line)` → `var(--text-3)` → `var(--text-1)`), `transition: 0.1s`
- Image brightness: `brightness(0.85)` unselected, `brightness(1.0)` hovered/selected, `transition: filter 0.15s`
- Progress bars: `transition: width 0.4s ease-out`
- Tab active indicator: `border-bottom`, no animation needed
- No scale transforms on hover
- No Framer Motion (installed, not used — leave it)

---

## Git Conventions

Commit prefix:
- `design:` — visual/UI changes
- `feat:` — new functionality
- `fix:` — bug fixes
- `refactor:` — restructuring without behavior change

Commit message body: explain architectural decisions, not what lines changed.

Always co-author AI-assisted commits:
```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Commit after each self-contained piece of work (one component, one page, one system). Do not batch unrelated changes.

---

## Definition of Done

Before marking any frontend task complete:

1. **TypeScript**: `npx tsc --noEmit` passes with no new errors in changed files
2. **Dev server**: start `npm run dev` and navigate to the changed page(s)
3. **Visual check**: screenshot with Playwright to verify layout matches spec
4. **Console errors**: no new errors in `browser_console_messages`
5. **Mobile check**: resize to mobile breakpoint and verify responsive behavior
6. **WalletGuard**: if the page is auth-gated, verify the pre-auth prompt renders correctly
7. **Empty states**: verify empty/loading states are handled (no blank divs, no crashes)
8. **Commit**: staged and committed with the correct prefix and co-author line

---

## Files That Require Extra Care

| File | Why |
|---|---|
| `frontend/app/globals.css` | Defines all design tokens. Changes cascade to every component. |
| `frontend/tailwind.config.ts` | Minimal by design. Do not add color scales or theme extensions. |
| `frontend/types/index.ts` | Shared types. Adding fields here affects all consumers. |
| `frontend/store/useAppStore.ts` | Persisted auth state. Schema changes break existing sessions. |
| `frontend/lib/api.ts` | All backend calls. Axios interceptors set auth headers here. |
| `frontend/hooks/useWalletUser.ts` | SIWE auth flow. The reconnect/hydration logic is fragile. |
| `frontend/components/wallet/Providers.tsx` | wagmi + RainbowKit config. Wrong config breaks wallet entirely. |
| `frontend/app/layout.tsx` | Root layout. Affects every page. |

---

## What Not To Do

- **No purple, cyan, or emerald** — these are explicitly out of the design system
- **No glassmorphism** — no `backdrop-blur`, `bg-opacity`, frosted glass cards
- **No glow effects** — no `box-shadow` with color, no blurred background divs
- **No large border radii** — `rounded-xl`, `rounded-2xl`, `rounded-3xl` do not belong
- **No Tailwind color utilities** — `bg-zinc-*`, `text-purple-*`, `border-emerald-*`, etc.
- **No `hover:` Tailwind classes** on elements with inline `style={}` (they can't win)
- **No badge pills for status** — status is plain mono text
- **No count badges on tabs** — tabs are just text labels
- **No decorative sidebar** — the dashboard layout.tsx is a pass-through
- **No icons in nav tabs**
- **No comments explaining what code does** — only comment the non-obvious WHY
- **No `display` inline styles on elements with Tailwind responsive classes**
