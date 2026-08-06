# Clixo

A decentralised opinion market on Ethereum Sepolia.

A creator posts a question with 2–10 image options and stakes ETH against it. Workers vote
blind — without seeing the running tally — and split the stake once the vote target is
reached. The stake is the incentive to answer honestly rather than follow the crowd.

TypeScript end to end, two processes, 159 commits.

> **Status:** Sepolia testnet, not deployed publicly. Runs locally against a hosted Postgres.
> There is no test suite and no CI — see [Known limitations](#known-limitations).

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
npm install
npm run dev

# Frontend — http://localhost:3000
cd frontend
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
- **`npm run build` / `npm start` do not work in `backend/`** — `tsconfig.json` sets
  `noEmit: true`, so `tsc` produces no `dist/`. Development runs through `tsx`.
- **`backend/src/generated/prisma/` is stale** — dead weight from a superseded generator
  config, and the copy `grep` finds first.
- **Not deployed.** Sepolia testnet only.

---

## Documentation

- `CLAUDE.md` — backend conventions and repository rules
- `DEVELOPMENT_GUIDE.md` — authoritative frontend reference: design tokens, motion rules, state
  contracts, page architectures
