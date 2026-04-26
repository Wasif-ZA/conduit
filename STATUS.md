# Conduit Status

Weekly build-in-public status. Updated every Sunday.

## 2026-04-26 (week 0, pre-spike)

Planning week, no code yet. Public commit history starts tonight.

**What shipped:**

- Pivoted the wedge after `/office-hours` 2026-04-24. Was: "any AU/APAC SaaS to Claude in one OAuth click." Now: "the polished connect-debug-ship loop above Nango." Target user is global indie devs and small teams, not AU operators. AU integrations remain bundled features, not positioning. Codex cross-model review converged on the same direction.
- Eng review 2026-04-25 locked the spike's runtime shape: `mcp-handler@1.0.4` on Vercel, stateless mode, bearer-in-header auth via explicit `resolveUserFromBearer` resolver. Single `ConduitError` class with 3 polished states for the spike (`notion-token-revoked`, `openapi-invalid`, `notion-rate-limited`); the other 7 fall back to a generic styled message and get polished only when they trip in real sessions.
- Two stack deviations logged in `.planning/decisions.md` for the spike window: Nango Cloud (not self-hosted, reconverge by Week 6), single Next.js app (not Turborepo, reconverge Week 2 if 5-DM bar hits).
- Spike rescheduled 2026-04-25: original Fri-Sun → **Sun-Wed**. Admin night starts tonight 17:00 AEST.
- `.planning/week-1.md` rewritten end-to-end against the new schedule + the post-eng-review spike shape.
- `CLAUDE.md` and `strategy.md` rewritten to drop the AU-wedge framing and the "no better-Composio" rule. Replaced with the developer-loop wedge and a craft-vs-breadth DO-NOT list.

**What's next (this week, Sun 2026-04-26 → Wed 2026-04-29):**

- **Sun admin night** (17:00-23:00): domain buy, X / LinkedIn / Bluesky handles, Notion public integration, Nango Cloud, MCP transport+auth validation spike (the load-bearing gate — picks Option 1 streamable-HTTP vs Option 2 `mcp-remote` bridge), GIF tooling, public repo first commit.
- **Mon scaffold** (~13h around uni): Next.js 16 + Tailwind + shadcn, Supabase schema, Notion connect via Nango Connect UI, paste-OpenAPI flow with `@apidevtools/swagger-parser`, Vitest tests for the parser.
- **Tue runtime + polish** (~9h around uni): manifest preview UI, MCP runtime via `mcp-handler@1.0.4`, test-tool UI (the single most important "craft" demo moment), ConduitError + 3 polished states, end-to-end dogfood in Claude Desktop, GIF.
- **Wed 09:00 AEST demo post**: X + LinkedIn + Bluesky. Reply-guard 30 min. Watch DMs.
- **Week 1 close Sun 2026-05-03**: 5 named developer DMs is the go / no-go bar for Week 2. <5 DMs = re-run `/office-hours` with actual reactions, do not push harder.

**What's deferred (per `TODOS.md`):**

- Stripe Solo tier checkout (Week 2, gated on 5-DM bar).
- Xero as second provider (Week 2 day 1, gated on 5-DM bar).
- Turborepo split (Week 2 if signal).
- Self-host Nango migration (Week 6 target).
- Polish on remaining 7 error states (only as they trip in real sessions).

## 2026-04-23 (pre-week-0)

- Spec drafted across `.planning/` (strategy, roadmap, manifest-spec, why-conduit).
- Name locked: **Conduit**.
- Stack locked: Next.js 16 + Supabase + Nango + Stripe. No Claude Agent SDK.
- Replaces Korvo as primary side project.
- Week 1 starts 2026-04-27.

## Weekly log

_(continued every Sunday from Week 1 close 2026-05-03 onward)_

## Metrics to track

- GitHub stars (weekly delta)
- X followers (weekly delta)
- Waitlist signups (when live)
- Private beta users (from week 10)
- Paying customers (from week 12 launch)
- MRR in AUD
- GitHub integrations PRs (external contributors)
