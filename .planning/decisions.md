---
title: Conduit Project Decisions
type: planning
---

# Conduit Project Decisions

Project-local decision log. Vault-wide strategic decisions live in `05 Meta/decisions.md`.

## Active

### Domain: tryconduit.dev
- **Date**: 2026-04-26 (Sun admin night, ~17:00 AEST)
- **Decision**: Buy `tryconduit.dev` via Cloudflare Registrar as the canonical Conduit domain. `conduit.dev` and `conduitmcp.*` taken; `try-` prefix is cleaner than `use-` and lines up with the connect-debug-ship demo loop ("try it"). Handles to register against this: `@tryconduit` first, fallbacks `@conduit_mcp` / `@getconduit`.
- **Why**: needed a `.dev` short enough to type, easy to dictate, and aligned with developer-tool branding. `tryconduit` reads cleanly, says what it is (a thing you try), and works for waitlist landing copy ("Try Conduit"). Bought tonight so SSL has 36+ hours before Wed 09:00 launch.
- **Revisit**: if a stronger short domain (`conduit.dev`, `conduit.tools`) frees up before v1 launch, evaluate the cost of a redirect-only swap. Otherwise hold.
- **Status**: active

### Wedge pivot: developer-first MCP toolkit, AU bundled (not positioned)
- **Date**: 2026-04-24 (post-`/office-hours` diagnosis with Codex cross-model second opinion)
- **Decision**: Reframe wedge from "AU/APAC SaaS to Claude" to "the polished connect-debug-ship loop above Nango." Target user is global indie developer or small team, self-serve, values DX over catalog size. AU integrations remain bundled features, not positioning.
- **Why**: original wedge framings did not survive diagnosis. The "AU operator" target was geographic dressing for what the founder actually wanted to build (developer-first self-serve). The "Nango-backed hosted MCP catalog" wedge was too close to Nango's own roadmap; Nango will ship hosted MCP themselves, so the wedge needs to be _above_ Nango (the developer loop) not _with_ them (the catalog).
- **Revisit**: 5-DM signal bar Sun 2026-05-03. <5 DMs = re-run `/office-hours` with actual reactions. >=5 DMs = pivot is validated, continue per `roadmap.md`.
- **Status**: active
- **Links**: `~/.gstack/projects/Wasif-ZA-conduit/wasif-main-design-20260424-133253.md`, `.planning/why-conduit.md`

### Spike deviation: Nango Cloud (not self-hosted) for Week 1
- **Date**: 2026-04-24
- **Decision**: Use **Nango Cloud** (not self-hosted on Railway) for the Week 1 spike. Reconverge to self-hosted Nango on Railway by end of Week 6.
- **Why**: self-hosting Nango in the spike adds 4+ hours of Railway setup, env wiring, and unfamiliar-failure-mode debugging on top of a 31-hour build window. Cloud is free for the spike's traffic. Self-host is the right end state (control, OSS alignment, no vendor lock-in) but not worth burning a launch window on.
- **Revisit**: end of Week 6 — migrate to self-host. Track in `TODOS.md` Week 2.
- **Status**: active
- **Risk accepted**: vendor lock-in for ~5 weeks. Mitigation: avoid Nango Cloud-only features (custom unified APIs, paid analytics) so the migration is mechanical.

### Spike deviation: single Next.js app (not Turborepo monorepo) for Week 1
- **Date**: 2026-04-24
- **Decision**: Ship the spike as a **single Next.js app** with `app/api/mcp/[slug]/route.ts` for the MCP runtime. Defer the Turborepo split (`apps/web` + `apps/mcp-runtime` + `packages/core` + `packages/integrations`) to Week 2 when a second app actually exists.
- **Why**: Turborepo overhead during the spike (workspace config, shared tsconfig, Vercel multi-project deploy) costs ~1 hour for zero spike-time benefit (one app, one deploy). The split makes sense once `mcp-runtime` legitimately needs to live separately (Week 2+) and `packages/core` has cross-app consumers.
- **Revisit**: Week 2 day 1 if the 5-DM bar is hit; otherwise hold pending demand.
- **Status**: active
- **Risk accepted**: minor refactor cost in Week 2. Mitigation: write `lib/` modules with clean boundaries today so the Week 2 split is mechanical (move files into `packages/core`, update imports).

### MCP runtime via `mcp-handler@1.0.4`, stateless mode, bearer-in-header auth
- **Date**: 2026-04-25 (post-eng-review)
- **Decision**: Use Vercel's `mcp-handler@1.0.4` for the `/api/mcp/[slug]` route. Run in **stateless mode** (no in-memory session state on serverless). Authenticate via **bearer-in-header** with an explicit `resolveUserFromBearer(token)` resolver that compares against `endpoints.token_hash`.
- **Why**: `mcp-handler` is the maintained, Vercel-native shape for MCP routes inside a Next.js app, matches our deploy target. Stateless mode sidesteps the serverless-cold-start session-state problem (no Redis required for the spike). Bearer-in-header is the cleanest UX in Claude Desktop's connector UI **if** Friday-night transport validation confirms it works (Option 1); fallback is `mcp-remote` stdio bridge (Option 2). Explicit resolver makes the auth boundary auditable rather than implicit.
- **Revisit**: if real users want long-running MCP sessions (paginated search across 1000+ Notion pages), add Redis-backed session state per `TODOS.md` Week 3+. If bearer-in-header is genuinely blocked by Claude Desktop's connector UI, add OAuth on `/api/mcp/[slug]` per `TODOS.md` Week 3+ (~6-10h).
- **Status**: active

### Error handling: ConduitError + 3 polished states for spike
- **Date**: 2026-04-25 (post-eng-review D4)
- **Decision**: Single `ConduitError` class with discriminated `kind`. Three error states get bespoke UI in the spike: `notion-token-revoked` (re-connect button), `openapi-invalid` (line-pointer if parser supplies one), `notion-rate-limited` (retry-after countdown). The other 7 error kinds fall back to a generic styled message and get polished as they actually trip in real user sessions, not preemptively.
- **Why**: polish-as-you-need keeps the spike honest about real failure modes vs. imagined ones. Each polished state is ~20 min of UI work, doing 10 preemptively is 3+ hours of speculative effort that may polish errors users never see.
- **Revisit**: per state, when it trips in a real session.
- **Status**: active

### AI SDK defaults: lighter by default, Agent SDK where justified
- **Date**: 2026-04-23 (revised from earlier "No Claude Agent SDK" stance)
- **Decision**: Default AI work in Conduit to **Vercel AI SDK** (native Next.js 16 fit) or **direct Anthropic SDK** (most control, least overhead). **Claude Agent SDK is allowed** where a multi-step autonomous loop clearly outperforms a one-shot call. Not banned, but not default. Every Agent SDK use gets a per-feature justification entry in this file so the token cost is intentional.
- **Why**: most Conduit AI surfaces are one-shot (BYO OpenAPI description refinement, tool-name rewriting). These don't benefit from autonomous loops and the Agent SDK overhead would be pure waste. But future features may genuinely need multi-step reasoning (intelligent tool routing, manifest debugging against a live API, agent-assisted integration authoring), and for those the Agent SDK is the right in-ecosystem tool, not a LangChain import.
- **Revisit**: per-feature as each new AI-using feature comes up. If Agent SDK usage creeps past 2–3 features, reassess whether we've drifted into "agent product" territory when we meant to ship infrastructure.
- **Status**: active

### Nango for OAuth + API proxy
- **Date**: 2026-04-23
- **Decision**: Use Nango (self-hosted on Railway) as the OAuth and API-proxy layer rather than rolling custom OAuth per provider.
- **Why**: Nango MIT-licensed, covers ~250 providers, handles token refresh + tenant headers + retries. Without Nango this is a 6-month project; with it, 12 weeks.
- **Revisit**: if Nango license changes or project is abandoned. Fork at v1 launch to de-risk.
- **Status**: active

### Monorepo (Turborepo)
- **Date**: 2026-04-23
- **Decision**: Single Turborepo with `apps/web`, `apps/mcp-runtime`, `packages/core`, `packages/integrations`.
- **Why**: Shared types between web dashboard and MCP runtime. Easier CI, single lockfile, easier for contributors to find things.
- **Revisit**: if repo grows past 50k LOC, reconsider splitting.
- **Status**: active

### Open core licensing boundary
- **Date**: 2026-04-23
- **Decision**: MIT license on `packages/core`, `packages/integrations`, `apps/mcp-runtime`. Closed source (not in public repo) for `apps/web`, Stripe billing, team management, audit log.
- **Why**: OSS core attracts contributors (new integrations, bug fixes) and gives users a free self-host path. Closed dashboard + billing is the monetisation layer.
- **Revisit**: 2027-01 if competitor open-sources their billing layer or community pressure mounts.
- **Status**: active

### gstack as workflow layer
- **Date**: 2026-04-23
- **Decision**: Use gstack (open-source Claude Code skill pack from Garry Tan / YC) as the workflow layer for Conduit. Team-mode install so the repo auto-loads gstack for every session and future collaborators.
- **Why**: Matches Conduit's sprint rhythm (plan → build → review → test → ship → reflect) without us having to build process scaffolding. `/autoplan` + `/review` + `/qa` + `/cso` + `/retro` covers 80% of the solo-dev discipline gap. MIT licensed, no lock-in.
- **Revisit**: 2026-06-23 (8 weeks in). If gstack is getting in the way more than it's helping, uninstall and go back to bare slash commands.
- **Status**: active
- **Links**: https://github.com/garrytan/gstack

### Nango connection ID convention + Connect Session auth flow
- **Date**: 2026-04-26 (Sun admin night, ~19:30 AEST, post Nango OAuth round-trip validation)
- **Decision**: Connection ID = Supabase user UUID (no provider prefix). Multiple providers per user disambiguated via `providerConfigKey`. Auth flow uses Nango Connect Sessions (Public Key model deprecated by Nango): backend mints a short-lived session token via `POST https://api.nango.dev/connect/sessions` authenticated with the Nango Secret Key, frontend passes that token to `nango.openConnectUI({ sessionToken })`.
- **Why**: simpler. One row per (user, provider) in Nango maps cleanly onto the spike `connections` table (composite key `user_id` + `provider`). Connect Sessions are the current Nango auth pattern after they deprecated client-side Public Keys; session-token approach avoids exposing any long-lived credential client-side. Locking the convention tonight saves a "wait, what was I going to use?" moment Mon during the `/connect` scaffold.
- **Revisit**: if Nango re-introduces a client-side public key or if a multi-tenant Conduit team needs to share a single Notion connection (Week 2+ teams work).
- **Status**: active
- **Implementation note for Mon**: `/connect` flow becomes `POST /api/nango/connect-session` (server-side, uses Secret Key) → returns `sessionToken` → frontend calls `nango.openConnectUI({ sessionToken })` → on success, callback writes a row in `connections` keyed on `auth.uid()`.

### Notion public connection: created, OAuth round-trip validated end-to-end
- **Date**: 2026-04-26 (Sun admin night, ~19:15 AEST)
- **Decision**: Public Notion connection `Conduit` created in Notion's developer portal with capabilities Read content + Update content + Insert content + Read user info incl. email. Redirect URI set to Nango Cloud's callback `https://api.nango.dev/oauth/callback`. Installable in: Any workspace. Marketplace gallery listing **not** submitted (separate review process, not needed for OAuth to work; defer until post-launch if at all).
- **Why**: spike provider per the Apr-24 pivot. Public (not Internal) is required so any future user can install. The 4 capabilities cover the spike's two demo actions (search pages, create page) plus the user-mapping needed for the `connections` table.
- **Revisit**: when adding Xero (Week 2 if 5-DM bar hits) — same pattern, separate Notion-style portal step. When polishing for v1 launch — replace placeholder photo icon with a real Conduit logo.
- **Status**: active
- **Credentials location**: password manager entry `Conduit — Notion OAuth (production)` (Client ID, Client Secret, Authorization URL).
- **Nango wiring**: provider config key `notion`, Nango secret key in password manager entry `Conduit — Nango Cloud (production)`. Test connection `8cba6e0b-d523-49b6-a5bc-9d6de7a1ca15` (`test_wasif_zaman`) from dashboard — kept as a pre-warmed fixture for Mon-Tue dogfood (saves re-auth).

## Resolved

_(none yet)_
