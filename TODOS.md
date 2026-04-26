# TODOs

Deferred from the weekend spike per `~/.gstack/projects/Wasif-ZA-conduit/wasif-main-design-20260424-133253.md` and `/gstack-plan-eng-review` 2026-04-25. These are tracked, not forgotten.

## This week (gated on schedule, not signal)

- [ ] **Register LinkedIn page for `tryconduit`**. Tue 2026-04-28 evening, before Wed posts get scheduled. Account email: `admin@tryconduit.dev`. Required for Wed 09:00 AEST launch (X + LinkedIn + Bluesky simultaneous, per `week-1.md`).
- [ ] **Register Bluesky handle**. Tue 2026-04-28 evening. First choice: `tryconduit.bsky.social`. Stretch: set custom handle `@tryconduit.dev` via Cloudflare DNS TXT record (free, ~2 min, higher signal). Account email: `admin@tryconduit.dev`. Required for Wed 09:00 AEST launch.

## Week 1 (gated on Monday signal)

- [ ] **Xero as second provider.** Gated on 5 named developer DMs by end of Week 1 (Sun 2026-05-03). Use existing Korvo OAuth tokens. If signal lands, ship in Week 2 day 1.
- [ ] **Stripe Solo tier checkout.** Week 2 day 1, after the 5-DM bar is hit. AUD pricing, GST-compliant invoices.

## Week 2

- [ ] **Turborepo split.** Move `app/api/mcp/[slug]/route.ts` into a separate `apps/mcp-runtime` package. `packages/core` for shared types and the OpenAPI parser. Per CLAUDE.md FOLDER STRUCTURE.
- [ ] **Self-host Nango migration.** Currently using Nango Cloud. Migrate to self-hosted Nango on Railway per CLAUDE.md stack rules. Reconverge target: end of Week 6.
- [ ] **Contract tests per provider manifest.** Per CLAUDE.md CONVENTIONS. Vitest. Verify each manifest against a recorded fixture of provider responses.
- [ ] **Playwright E2E for the demo path.** Sign up → connect Notion → import OpenAPI → test tool → install in Claude Desktop → tool call. One smoke test, hosted-Claude-Desktop is the part that has to be mocked.

## Week 3+

- [ ] **OAuth on Conduit's own MCP endpoints (if Friday validation requires).** The bearer-in-header auth shape is being validated Friday night per Codex protocol. If Claude Desktop's connector UI rejects the bearer header and the spike falls back to `mcp-remote` stdio bridge, then OAuth on `/api/mcp/[slug]` becomes the right Week 2-3 hardening to restore the cleaner UX. Authorization code flow, refresh tokens, consent screen. ~6-10h of work; do not start without confirmation that bearer-in-header is genuinely blocked.
- [ ] **JWT-mint defense-in-depth on the MCP route.** D3 option B from the eng review. Trade the bearer token for a short-lived Supabase JWT inside the MCP route, then use the regular RLS path. Adds defense-in-depth on top of the explicit `resolveUserFromBearer` resolver. ~1.5-2h.
- [ ] **Polish the remaining 7 error states.** D4 shipped 3 polished cases (Notion-token-revoked, OpenAPI-invalid, Notion-rate-limited). The other 7 fall back to a generic styled message. Polish them as they actually trip in real user sessions, not preemptively.
- [ ] **Resumable MCP sessions / external session store.** The spike uses stateless mode to sidestep in-memory-session-state-on-serverless. If real users want long-running MCP sessions (paginated search across 1000 Notion pages), add Redis-backed session state.
- [ ] **OpenAPI parser scope expansion.** Currently 3.x only, GET+POST only, in-doc `$ref` only, max 10 ops. Expand based on real BYO OpenAPI users hitting limits: PATCH/PUT/DELETE, remote `$ref`, Swagger 2.0 conversion, parameterized op limit.
- [ ] **Audit logs for tool invocations.** `tool_invocations` table is in v1. Surface as a per-user audit page in the dashboard. Required for Team tier later.

## v1.1 / Beyond

- [ ] **GitHub org `tryconduit`**. Currently the repo lives under personal `Wasif-ZA/conduit`. Move to org at v1 launch (Week 11-12) for clean billing, multi-collaborator visibility, and brand consistency. Account email: `admin@tryconduit.dev`.
- [ ] **Self-host starter kit ($99 one-off).** Docs + Docker compose + Terraform per CLAUDE.md REVENUE+PRICING. After v1 launches and there's demand evidence.
- [ ] **The remaining 7 launch integrations** (Employment Hero, Hnry, Atlassian, Canva, Airtable, HubSpot, Google Workspace, Slack). Per CLAUDE.md LAUNCH INTEGRATIONS. Ship as demand calls them out.
- [ ] **Team tier features.** Team OAuth, audit log, $99 AUD/mo. Implies a `teams` table + RLS pivot.
