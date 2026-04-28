---
title: Day-1 Scaffold Checklist
type: planning
status: active
when: Mon 2026-04-27 19:00-23:00 AEST
purpose: 19:00 starts with `pnpm create next-app`, not searching docs
---

# Day-1 Scaffold Checklist

Concrete commands, ordering, and acceptance for Mon Day-1's scaffold + schema + connect + import + parser-tests block. Open this file and the Sun-night `decisions.md` MCP-transport entry side-by-side; that's the only context you need at 19:00.

## Pre-flight (do before 19:00)

Have these ready in a password manager (NOT in the repo):

- [ ] `NEXT_PUBLIC_SUPABASE_URL` (Supabase project, ap-southeast-2)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NANGO_SECRET_KEY` (Nango Cloud, from Sun admin night)
- [ ] `NEXT_PUBLIC_NANGO_PUBLIC_KEY`
- [ ] `NOTION_CLIENT_ID` (from Notion developer portal, Sun admin night)
- [ ] `NOTION_CLIENT_SECRET`
- [ ] MCP transport choice locked (Option 1 streamable-HTTP or Option 2 `mcp-remote` bridge), per Sun-night validation result in `decisions.md`.

Tooling:

- [ ] Node 22 LTS (`node -v` → v22.x). If wrong, `nvm install 22` or fnm equivalent.
- [ ] pnpm 9 (`pnpm -v`). If missing: `npm i -g pnpm@9`.
- [ ] Supabase CLI: `pnpm dlx supabase --version` works (no global install needed).
- [ ] Repo cloned locally from Sunday's first push: `git clone git@github.com:Wasif-ZA/conduit && cd conduit`.

## 19:00-20:00 Scaffold the Next.js 16 app (~1h)

```bash
# at repo root, NOT inside a subfolder
pnpm create next-app@latest . --ts --app --tailwind --turbopack --eslint --import-alias "@/*"
# Will prompt to overwrite existing CLAUDE.md/STATUS.md/.planning/ — say no, keep them
```

If the prompt won't let you keep `.planning/`: scaffold into a temp dir, `mv` only the new files into the repo, delete the temp.

**Tailwind 4 sanity:** `tailwind.config.ts` should be minimal; Tailwind 4 reads `@import "tailwindcss"` from `app/globals.css` directly.

**shadcn/ui init:**

```bash
pnpm dlx shadcn@latest init
# Defaults: TypeScript, Default style, Slate base color, src/ no, RSC yes
pnpm dlx shadcn@latest add button card input textarea dialog
```

**Supabase client wiring:**

```bash
pnpm add @supabase/ssr @supabase/supabase-js
```

Files to create:

- `lib/supabase/client.ts` — browser client (`createBrowserClient`)
- `lib/supabase/server.ts` — server client (`createServerClient`) for Server Components
- `lib/supabase/proxy.ts` — proxy helper that refreshes the Supabase session on every request
- `proxy.ts` (repo root) — Next.js 16 proxy entry; gates `/dashboard/*` behind auth via the helper above
- `.env.example` — all six env vars from Pre-flight, with placeholder values
- `.env.local` — real values, NOT committed (already in `.gitignore`)

Routes for the scaffold:

- `app/page.tsx` — placeholder "Conduit" h1, link to `/login`
- `app/login/page.tsx` — magic-link form, calls `supabase.auth.signInWithOtp({ email })`
- `app/auth/callback/route.ts` — handle the magic-link callback, redirect to `/dashboard`
- `app/dashboard/page.tsx` — placeholder, shows current user email

**Acceptance:** `pnpm dev` runs, `/` and `/login` render, magic-link email arrives, clicking it lands on `/dashboard` with the user email visible.

**Commit:** `feat: next.js 16 scaffold + supabase auth`

## 20:00-21:00 Supabase schema for the spike (~1h)

```bash
pnpm dlx supabase init   # creates supabase/ folder, only needed once
pnpm dlx supabase login
pnpm dlx supabase link --project-ref <YOUR_PROJECT_REF>
```

Create `supabase/migrations/0001_spike.sql`:

```sql
-- connections (per-user OAuth connections via Nango)
create table connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  nango_connection_id text not null,
  display_name text,
  created_at timestamptz default now(),
  unique (user_id, provider, nango_connection_id)
);
alter table connections enable row level security;
create policy "users see own connections" on connections
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- manifests (per-user manifest drafts, from Notion or pasted OpenAPI)
create table manifests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  source_type text check (source_type in ('nango','openapi')) not null,
  source_ref text not null,
  name text not null,
  operations jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);
alter table manifests enable row level security;
create policy "users see own manifests" on manifests
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- endpoints (per-user MCP endpoints with hashed bearer tokens)
create table endpoints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  manifest_id uuid references manifests(id) on delete cascade not null,
  slug text unique not null,
  token_hash text not null,
  created_at timestamptz default now(),
  revoked_at timestamptz
);
alter table endpoints enable row level security;
create policy "users see own endpoints" on endpoints
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- The MCP route uses service-role key + explicit resolveUserFromBearer,
-- so it doesn't go through RLS.
create index endpoints_slug_idx on endpoints (slug);
```

```bash
pnpm dlx supabase db push
```

**Acceptance:** Supabase Studio shows all three tables, RLS enabled badge visible on each, you can `select` your own rows but a different user's auth.uid() returns zero rows.

**Commit:** `feat(db): spike schema (connections, manifests, endpoints) with rls`

## 21:00-22:30 Connect flow for Notion via Nango Connect UI (~1.5h, was 3h plan)

Why faster than the design doc 3h estimate: Nango Connect UI is a drop-in modal, not a custom popup. The 3h budget assumed custom OAuth UX work that we deliberately deferred.

```bash
pnpm add @nangohq/frontend @nangohq/node
```

Files:

- `lib/nango/server.ts` — `import { Nango } from '@nangohq/node'`; export a singleton with `NANGO_SECRET_KEY`.
- `app/api/nango/session-token/route.ts` — POST handler; for the authed user, creates a Nango Connect session token (`nango.createConnectSession({ end_user: { id: user.id, email: user.email } })`), returns the `token`.
- `app/api/nango/callback/route.ts` — POST webhook from Nango on successful connection; insert a row in `connections` with `provider = 'notion'`, `nango_connection_id` from payload, `user_id` from session metadata.
- `app/connect/page.tsx` — single dropdown (Notion only), "Connect" button. On click: fetch session token, call `nango.openConnectUI({ sessionToken })`, on success redirect to `/dashboard`.
- `app/dashboard/page.tsx` — list current user's `connections` rows.

Configure Nango webhook URL in Nango dashboard → Project Settings → Webhooks → `https://YOUR_DOMAIN/api/nango/callback`.

**Acceptance:** click Connect → Nango popup → Notion OAuth → callback → row appears in `connections` → dashboard shows it.

**Commit:** `feat(connect): notion oauth via nango connect ui`

## 22:30-23:00 Paste-OpenAPI flow + parser tests (~30 min for the UI shell, parser+tests on Tue morning if Mon runs over)

```bash
pnpm add @apidevtools/swagger-parser
pnpm add -D vitest @vitest/ui
```

Files:

- `app/import/page.tsx` — single URL input + Submit button. POSTs to `/api/import`.
- `app/api/import/route.ts` — fetches the URL, parses with `SwaggerParser.validate()`, extracts GET+POST operations, caps at 10, returns `{ ok: true, manifestId }` after inserting a `manifests` row, or `{ ok: false, error: 'unsupported_swagger_2' | 'invalid_spec' | 'no_operations' }`.
- `lib/openapi/parse.ts` — pure function, takes a parsed spec, returns `{ operations: Operation[] }`. Operations limited to GET+POST, max 10.
- `tests/openapi-parse.test.ts` — three fixtures (valid 3.0, Swagger 2.0, malformed JSON). Three tests: extracts ≤10 GET+POST ops, returns `unsupported_swagger_2` for Swagger 2, returns `invalid_spec` for malformed.
- `vitest.config.ts` — minimal, just enables `tests/` directory.

**Fixtures** in `tests/fixtures/`:

- `notion-subset.openapi.json` — copy from Notion's public OpenAPI doc, trim to 5 endpoints to keep the test fast.
- `petstore-swagger2.json` — well-known Swagger 2.0 example.
- `malformed.json` — `{"openapi":` (truncated).

**Acceptance:** `pnpm test` passes 3/3. UI: paste a Notion OpenAPI URL → see GET+POST operations in a checkbox list (this UI lands Tue if Mon runs out of time, but the parser + tests must be done tonight so Tue can build manifest preview on top).

**Commit:** `feat(import): paste openapi 3.x → manifest draft` + `test(parser): openapi 3.x extraction + friendly errors`

## Slip rules

If Mon runs past 23:00:

- **Cut**: paste-OpenAPI UI shell (move to Tue morning before manifest preview). Keep parser + tests done tonight.
- **Do not cut**: scaffold, schema, Notion connect. Tue's runtime work hard-blocks on these.
- **Push** at every commit, do not save up a single Sunday-night dump. Build-in-public means visible commits along the way.

## Done-when (Mon EOD)

Fresh signup → `/dashboard` → click Connect → Notion OAuth via Nango popup → `connections` row appears → dashboard lists it → CI green on push.

Manifest preview, MCP runtime, test-tool UI, ConduitError, dogfood, GIF all land Tue.
