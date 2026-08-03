# Clixo — Claude Operating Manual

## Developer Brain

Developer Brain lives at: `/Users/rkhooda/Documents/Rkxee Obsidian/Developer's brain`

At the start of every session, read in this order:

1. `/Users/rkhooda/Documents/Rkxee Obsidian/Developer's brain/CLAUDE.md` — governing operating principles
2. `/Users/rkhooda/Documents/Rkxee Obsidian/Developer's brain/ARCHITECTURE.md` — zone structure and content boundaries
3. `/Users/rkhooda/Documents/Rkxee Obsidian/Developer's brain/projects/Clixo/overview.md` — project context in Developer Brain (read if the file exists; skip if not)

The principles in Developer Brain govern every session in this repository. Do not duplicate them here. If anything here conflicts with Developer Brain, follow Developer Brain and flag the conflict.

---

## Project

**Name:** `Clixo`
*Must match the folder name at `Developer Brain/projects/Clixo/`.*

**What it is:** An opinion market on Ethereum Sepolia — creators post a question with 2–10 image options and stake ETH; workers vote blind and split the stake when the vote target is reached.

**Stack:** TypeScript throughout, two processes.
`backend/` — Express 5, Prisma, Neon Postgres, ethers v6, Pinata (IPFS), jsonwebtoken, multer.
`frontend/` — Next.js 15 App Router, React 19, Tailwind v4 (CSS-first), wagmi + RainbowKit, TanStack Query, Zustand, framer-motion, Axios, Recharts, sonner.

---

## Rules

### Commands

```
cd backend  && npm run dev      # tsx + nodemon on :4000
cd frontend && npm run dev      # Next dev server on :3000
npx tsc --noEmit                # run in each package; both must be clean
cd frontend && npm run build    # catches server/client boundary violations
```

There are no tests and no CI. `backend`'s `npm run build`/`start` do not currently work — `tsconfig.json` sets `noEmit: true`, so `tsc` produces no `dist/`.

### Database — read before touching Prisma

The database was provisioned with `prisma db push`, so `prisma/migrations/` describes a schema six features out of date and `prisma migrate status` reports every migration as never applied.

**Never run `prisma migrate dev`.** It reads the live database as drifted and offers a destructive reset of the only system of record for every task, vote, and balance. Use `prisma db push` for schema changes until the history is baselined (`prisma migrate resolve --applied` per migration, plus one squashed migration for the drift).

`backend/src/generated/prisma/` is stale dead weight from a superseded generator config. Ignore it; it is the copy grep finds first.

### Frontend work — read `DEVELOPMENT_GUIDE.md` first

It is the authoritative frontend reference: token tables, motion rules, state contracts, page architectures, and the Definition of Done. Rewritten 2026-08-04 to match the design-system overhaul. The summary below is the short form; the guide wins on any detail.

### Frontend conventions

- **Tokens, never values.** Colours, radii, and fonts live once in `frontend/app/globals.css` and reach Tailwind via `@theme inline`. Use semantic utilities (`bg-surface`, `text-lo`, `border-line`, `text-amber`); never a raw hex, never a Tailwind palette colour (`bg-zinc-*`). There is no `tailwind.config.ts` — Tailwind v4 is configured in CSS.
- **framer-motion is behind `LazyMotion features={domMax} strict`.** Use `m.div`, never `motion.div` — `motion.` throws at runtime under `strict`. Guard every animation with `useReducedMotion()`.
- **Prefer the native platform element.** The mobile drawer is a real `<dialog>` + `showModal()`; entry animation is CSS `@starting-style`. Check the platform before adding a component or a dependency.
- **Primitives are hand-rolled** in `components/ui/` — no Radix, no shadcn CLI. Accessibility is yours to get right: role, `aria-*`, keyboard traversal, focus return.
- Import `buttonVariants` from `components/ui/buttonVariants.ts` (server-safe) when styling a `<Link>` or a server component; import `Button` only where you need the client component.
- Wallet-scoped queries always take `address` in the `queryKey` and gate on `enabled: !!address`.

### Backend conventions

- **Identity never comes from the request body.** Read `workerId` / `walletAddress` from `req.auth` (set by `requireAuth`). Resolve the creator `User` by address, case-insensitively.
- `User` and `Worker` are separate tables with independent `SERIAL` sequences. A `workerId` is not a `userId`. This has already caused one cross-account data leak — see `known-defects.md` in Developer Brain.
- Money is integer credits at `0.001 ETH`. Keep `BigInt` confined to the lines that touch `tx.value`.
- New routes are auth-gated unless there is a stated reason to be public, and any route acting on a task checks ownership.

### Git

Conventional Commits with a scope (`feat(vote):`, `fix(payout):`, `polish(ui):`). No AI attribution of any kind.

---

## Session End

At the end of any significant session:

1. Has the project's technical state changed substantially? → Update `Developer Brain path/projects/Clixo/overview.md`
2. Was a significant architectural decision made? → Create `Developer Brain path/projects/Clixo/decision-[topic].md`
3. Does any knowledge from this session pass the promotion criteria in `Developer Brain path/WORKFLOW.md`? → Promote it

Do not update Developer Brain for routine task completion or information visible from the code.