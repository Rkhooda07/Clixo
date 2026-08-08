# Clixo — frontend

Next.js 15 App Router client for Clixo. It is one half of a two-process app; the Express API
lives in [`../backend`](../backend).

```bash
cp .env.example .env.local   # fill in, then:
npm install
npm run dev                  # http://localhost:3000
```

The backend must be running on `:4000` (or `NEXT_PUBLIC_API_BASE_URL` pointed elsewhere) or
every page will render its API-unreachable state.

- Project overview, architecture, and setup → [`../README.md`](../README.md)
- Design tokens, motion rules, state contracts, Definition of Done →
  [`../DEVELOPMENT_GUIDE.md`](../DEVELOPMENT_GUIDE.md)
