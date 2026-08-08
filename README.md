# Clixo

A decentralised opinion market on Ethereum Sepolia.

A creator posts a question with 2–10 image options and stakes ETH against it. Workers vote
blind — without seeing the running tally — and split the stake once the vote target is
reached. The stake is the incentive to answer honestly rather than follow the crowd.

TypeScript end to end, two processes, 159 commits.

> **Status:** Sepolia testnet. No test suite and no CI — see
> [Known limitations](#known-limitations).
>
> **Live demo:** _set `NEXT_PUBLIC_SITE_URL` and paste the URL here after deploying —
> see [Deploying](#deploying)._ Browsing tasks and playing the landing-page ballot need no
> wallet; answering a task does.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, configured **in CSS** via `@theme inline` — no `tailwind.config.ts` |
| Wallet | wagmi + viem + RainbowKit |
| State | Zustand (persisted) for client state, TanStack Query for server state |
| Motion | framer-motion behind `LazyMotion`, guarded by `useReducedMotion()` |
| Backend | Express 5, TypeScript (ESM, run through `tsx`) |
| Database | PostgreSQL (Neon) via Prisma 6 |
| Auth | SIWE-shaped challenge → sign → verify, issuing a JWT |
| Chain | ethers v6 against Ethereum Sepolia |
| Storage | IPFS through Pinata |

UI primitives in `components/ui/` are hand-rolled — no Radix, no shadcn. Roles, `aria-*`,
keyboard traversal and focus return are handled directly.

**There are no smart contracts in this repository.** Payouts are executed by a server-held
wallet sending transactions with ethers. The settlement logic lives in the API, not on chain.

---

## How it works

1. **Create** — a creator connects a wallet, writes a question, uploads 2–10 image options,
   and funds the task. Images are pinned to IPFS via Pinata at upload time; the returned CID,
   URI and gateway URL are stored per option.
2. **Vote** — workers open a task and pick an option without seeing the current distribution.
   Each submission credits the worker's `pending_amount`.
3. **Settle** — once a task reaches its vote target, aggregation closes it and rewards are
   settled across the workers who voted.
4. **Withdraw** — a worker with a linked wallet and a positive balance requests a payout, and
   the server sends ETH to their address.

---

## Authentication

Wallet-based, no passwords.

The client requests a challenge, the wallet signs it, and the server verifies the signature
before issuing a JWT. The signed token carries the worker identity used by every authenticated
route. Challenge state lives in `auth/siweStore.ts`; token issue and verification in
`auth/jwt.ts`.

---

## The payout path

The withdrawal endpoint is the part of this codebase worth reading:
[`backend/src/controllers/payoutExecutionController.ts`](backend/src/controllers/payoutExecutionController.ts).

Sending money is not the hard part. Not sending it twice is.

A worker's balance is split across two columns — `pending_amount` (withdrawable) and
`locked_amount` (mid-withdrawal). `executePayout` runs in three phases:

**Guard.** Reject if the worker has no linked wallet, if `pending_amount <= 0`, or if
`locked_amount > 0`. That third condition is the one that matters: a payout already in flight
blocks a second request.

**Lock.** Move the full balance from `pending_amount` to `locked_amount` in a transaction, then
write a `Payout` row with status `PENDING`. From this point the funds are invisible to any
other withdrawal attempt, and the intent is durable — if the process dies mid-transfer, the
`PENDING` row is the record that it was attempted.

**Settle.** Send the ETH, then clear `locked_amount` and mark the payout `SUCCESS` with the
transaction hash — both in a single transaction, so the balance and the payout record can never
disagree.

The ordering is deliberate. Locking before sending means a crash leaves funds locked and a
`PENDING` row to reconcile against; sending before locking would mean a crash could leave the
balance still withdrawable after the ETH had already left.

See [Known limitations](#known-limitations) for where this guard is still not airtight.

---

## Repository layout

```
backend/
├── prisma/
│   ├── schema.prisma       User · Task · Option · Worker · Submission · Payout · Funding
│   └── migrations/         see the Prisma warning below
└── src/
    ├── auth/               siweStore.ts, jwt.ts
    ├── blockchain/         ethClient.ts — JsonRpcProvider + server wallet
    ├── controllers/        14 controllers
    ├── middleware/         authMiddleware.ts
    ├── routes/
    ├── validators/
    └── index.ts

frontend/
├── app/                    landing · browse · create-task · dashboard · tasks/[id] · vote/[id]
│   └── globals.css         design tokens — changes cascade everywhere
├── components/             ui · layout · wallet · tasks · vote · dashboard · create-task · home
├── hooks/                  useWalletUser, useEthPrice, useBreadcrumbs, useCountUp
├── lib/                    api.ts, wagmi.ts, queryClient.ts, utils.ts
└── store/useAppStore.ts
```

The 14 controllers: `auth`, `me`, `task`, `taskPublic`, `taskStats`, `submission`,
`aggregation`, `reward`, `rewardSettlement`, `funding`, `upload`, `payoutPreview`,
`payoutExecution`, `payoutHistory`.

---

## Running locally

Requires Node 20+, a PostgreSQL database, a Pinata account, and a funded Sepolia wallet.

```bash
# Backend — http://localhost:4000
cd backend
cp .env.example .env       # fill it in
npm install
npm run dev

# Frontend — http://localhost:3000
cd frontend
cp .env.example .env.local # fill it in
npm install
npm run dev
```

`backend/.env`:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Signing secret for issued tokens |
| `RPC_URL` | Sepolia JSON-RPC endpoint |
| `SERVER_PRIVATE_KEY` | Server wallet that funds payouts |
| `PINATA_JWT` | Pinata API token for IPFS pinning |
| `PORT` | API port (defaults to 4000) |
| `MAX_UPLOAD_MB` | Upload size cap |
| `ALLOWED_MIMES` | Permitted image MIME types |
| `ALLOWED_ORIGINS` | Comma-separated browser origins allowed to call the API. localhost is always allowed on top of these |

Type-check both packages before committing:

```bash
npx tsc --noEmit          # run in backend/ and frontend/
cd frontend && npm run build   # catches server/client boundary violations
```

### ⚠️ Prisma

The database was provisioned with `prisma db push`, so `prisma/migrations/` is behind the live
schema and `prisma migrate status` reports every migration as unapplied.

**Do not run `prisma migrate dev`.** It reads the live database as drifted and offers a
destructive reset. Use `prisma db push` for schema changes until the history is baselined.

---

## Deploying

Two services and one database. Deploying touches no schema — the existing Neon database is
used as-is, so nothing here goes near Prisma migrations.

**1. Backend → Render** (`render.yaml` in the repo root is picked up by *New → Blueprint*).
Root directory `backend`, build `npm install && npm run build`, start `npm start`. Set every
variable from `backend/.env.example`; leave `ALLOWED_ORIGINS` empty for now.

**2. Frontend → Vercel.** Root directory `frontend`; the framework preset is detected. Set:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<render-service>.onrender.com/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` |
| `NEXT_PUBLIC_SERVER_WALLET_ADDRESS` | same address as the backend's `SERVER_PRIVATE_KEY` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | from WalletConnect Cloud |

**3. Close the loop.** Set the backend's `ALLOWED_ORIGINS` to the Vercel URL and redeploy it —
until then every browser request is blocked by CORS. Add the Vercel URL to the WalletConnect
project's allowed domains too, or the wallet modal will refuse to open.

**4. Keep it warm.** `.github/workflows/keep-warm.yml` pings the API every 10 minutes so a
visitor does not land on a 30–60s cold start. Set the repo variable `KEEP_WARM_URL` to the
Render URL to switch it on.

Then paste the live URL into the badge at the top of this file and into the GitHub repo's
About field.

---

## Known limitations

Recorded rather than hidden — these are real and I know where they are.

- **The payout guard has a narrow race.** The check on `locked_amount` and the write that sets
  it are two separate statements, so two requests arriving in the same window could both read
  `locked_amount === 0` before either writes. The fix is a conditional update — `updateMany`
  with `locked_amount: 0` in the `where` clause, then acting on the affected-row count — so the
  database decides the winner atomically. It has not bitten in practice because the window is
  small and there is a single server, but it is a correctness bug, not a theoretical one.
- **`GAS_FEE` and `ETH_PER_CREDIT` are hardcoded constants** in the payout controller rather
  than configuration or a live gas estimate.
- **No test suite and no CI.** Type-checking is the only automated gate.
- **`backend` runs through `tsx` in production too**, rather than compiling to `dist/`.
  `tsconfig.json` keeps `noEmit: true` and every internal import carries an explicit `.ts`
  specifier, so emitting JS would produce a bundle importing files that do not exist.
  `tsx` is a runtime dependency and `npm start` uses it directly; `npx tsc --noEmit` is still
  the type gate.
- **`backend/src/generated/prisma/` is stale** — dead weight from a superseded generator
  config, and the copy `grep` finds first.
- **The hosted API sleeps.** On a free tier the backend spins down when idle and the first
  request after that takes 30–60s. The frontend fails fast (15s axios timeout) and says the
  API is unreachable rather than hanging.

---

## Documentation

- `CLAUDE.md` — backend conventions and repository rules
- `DEVELOPMENT_GUIDE.md` — authoritative frontend reference: design tokens, motion rules, state
  contracts, page architectures
