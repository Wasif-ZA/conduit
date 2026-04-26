---
title: Week 1 Plan (post-pivot, post-eng-review)
type: planning
status: active
supersedes: original 2026-04-23 pre-pivot week-1 plan (preserved in git history)
source_of_truth: ~/.gstack/projects/Wasif-ZA-conduit/wasif-main-design-20260424-133253.md
spike_window: 2026-04-26T17:00+10:00 → 2026-04-29T09:00+10:00
week_1_close: 2026-05-03T23:59+10:00
---

# Week 1 Plan: Connect-Debug-Ship Spike

Concrete schedule for the rescheduled Sun-Wed spike that lands the connect-debug-ship demo, plus Mon-Sun polish. The design doc above is the spec; this file is the calendar against it.

## What changed since the original week-1.md

- **Pivot 2026-04-24** (`/office-hours`): wedge moved from "AU/APAC SaaS" to "global developer-first MCP toolkit, AU bundled." Provider for the spike is **Notion**, not Xero. BYO OpenAPI is the second surface from day 1.
- **Spike rescheduled 2026-04-25**: original Fri-Sun → **Sun-Wed**. Today (Sun 2026-04-26) is admin night, not Saturday.
- **Stack deviations for the spike**: Nango **Cloud** (not self-hosted), **single Next.js app** (not Turborepo). Both logged in `decisions.md`. Reconverge in Weeks 2-6.
- **Stripe deferred** to Week 2. Xero gated on 5 DMs.
- **Eng review 2026-04-25** added: `mcp-handler@1.0.4` for the MCP runtime, `ConduitError` with 3 polished states for the spike (Notion-token-revoked, OpenAPI-invalid, Notion-rate-limited), explicit `resolveUserFromBearer` resolver, MCP route runs in **stateless mode** to sidestep serverless session state.

If you hit a blocker that can't be cleared same-day (registrar delay, Nango outage, MCP transport regression), drop that item to the stretch list at the bottom and keep moving. Do not stall the whole week on a single blocker.

## Exit conditions for the spike (Wed 2026-04-29 09:00 AEST)

Mark the spike shipped only when all six are true:

1. Public GitHub repo exists at `github.com/Wasif-ZA/conduit`, MIT, green CI on `main`.
2. Live URL (custom domain or `*.vercel.app` fallback per design doc) reachable from the public internet.
3. End-to-end happy path works in Claude Desktop: connect Notion → paste OpenAPI URL → preview manifest → create endpoint → Claude lists tools → both demo actions return real results in under 30s each.
4. Demo GIF recorded to spec: ≤ 30s, ≤ 10 MB, 1280×720, three moments in one take, no voiceover.
5. Demo post live on X + LinkedIn + Bluesky at 09:00 AEST Wed.
6. Waitlist email capture is wired and auto-replies on submit.

If only five are true by Wed 09:00, post anyway (the demo is the load-bearing piece, the rest can land within hours). Do not let perfectionism push the launch into Thursday.

## Exit conditions for Week 1 close (Sun 2026-05-03 23:59 AEST)

1. **5 named developer DMs** (X handles or emails) asking for access, walkthrough, or follow-up. This is the go / no-go bar for Week 2 expansion.
2. ≥ 1 invite user has tried the demo end-to-end and reported back.
3. `decisions.md` has both stack-deviation entries (Nango Cloud, single-app) with re-convergence plans.
4. `STATUS.md` Week 1 entry is live, ties to commits.
5. `week-2.md` exists in draft.

If 5-DM bar is missed: stop Week 2 feature work, re-run `/office-hours` with the actual reactions as data. Do not push harder into Week 2 on zero signal (per design doc failure criteria).

## Sun 2026-04-26: admin night (17:00 → 23:00, ~7h)

**Goal**: every non-code blocker is gone before Mon 19:00 scaffold start. Public commit history begins under the post-pivot rules, not the old AU-wedge ones.

Order matters. DNS and Notion-app approvals have async wait times that block coding tomorrow if started late.

- [ ] **17:00-17:45 Pivot rewrites of CLAUDE.md, strategy.md, decisions.md** (~45 min). Per design doc Assignment step 1+2: drop "no better-Composio" DO-NOT rule, reframe one-liner, log Nango Cloud + single-app deviations in decisions.md. Commit: `docs: pivot positioning to developer-first after /office-hours diagnosis`.
- [ ] **17:45-18:00 Buy domain** (~15 min). Cloudflare registrar. Don't wait for DNS propagation, kick it off now so SSL has 36+ hours by Wed 09:00. Fallback: ship Wed on `*.vercel.app` if registrar drags.
- [ ] **18:00-18:30 Register X, LinkedIn, Bluesky handles** (~30 min). `@conduit_mcp` first choice, fallbacks `@conduitmcp` / `@conduit_dev` / `@getconduit`.
- [ ] **18:30-19:15 Create Notion public integration** (~45 min). Notion developer portal. Set redirect URI to Nango's callback. Stash client ID + secret in password manager.
- [ ] **19:15-20:00 Set up Nango Cloud** (~45 min). Sign up, create the Notion provider connector, paste Notion client ID + secret. Test a sample OAuth from Nango's UI. Confirm end-to-end before moving on.
- [ ] **20:00-20:30 Create public GitHub repo** (~30 min). `github.com/Wasif-ZA/conduit`. MIT LICENSE, `.gitignore`, topics (`mcp`, `model-context-protocol`, `claude`, `nango`, `oauth`), Issues + Discussions + Dependabot on, branch protection on `main`. First public push is the pivoted CLAUDE.md / strategy.md / decisions.md from step 1.
- [ ] **20:30-21:15 MCP transport+auth validation spike** (the load-bearing gate, ~45 min). Per design doc Assignment step 9. 20-line Next.js API route returning a minimal MCP `initialize` + `tools/list`. Deploy to Vercel preview. Try **Option 1** (streamable-HTTP, `url`+`headers` config) in Claude Desktop. If it connects + lists tools: Option 1 locked. If it fails: switch to **Option 2** (`mcp-remote` stdio bridge). Lock the choice tonight. Tomorrow's MCP runtime work depends on which shape we're targeting.
- [ ] **21:15-21:30 Install GIF tooling** (~15 min). Windows 11. `winget install gifski` (preferred) or `winget install ffmpeg`. Plus ShareX for capture if not already installed. Doing this tonight means Tue's "record GIF" step doesn't start with a package install.
- [ ] **21:30-22:00 Sanity check + buffer** (~30 min). Fresh git clone into a scratch dir. README reads cleanly. STATUS.md draft for tonight's update (see separate task) ready to commit. Anything that ran long today eats this buffer.
- [ ] **22:00-23:00 Sunday STATUS.md build-in-public update** (~30 min) + **block Mon-Wed calendar windows** (~30 min). Recurring blocks for Mon 19:00-23:00, Tue 19:00-23:00, Wed 09:00-12:00 reply-guard. Push the STATUS.md update as the second public commit so the timeline starts from real, not stub.

**Done when**: domain bought, Notion app created, Nango Cloud connected to Notion, MCP transport choice locked in writing in `decisions.md`, public repo live with two commits, GIF tooling installed, STATUS.md update live.

## Mon 2026-04-27: build day 1 (~13h around uni)

**Goal**: scaffold + Supabase schema + Notion connect flow + paste-OpenAPI flow + Vitest tests for the parser. Manifest UI lands tomorrow.

Calendar today: 09:00 ENGG4001 Lect, 12:00 ENGG4001 Workshop, 15:00 COMP3310 Practical, 17:00 COMP3100 Workshop, **19:00-23:00 Conduit Day 1 scaffold+schema**. The 13h figure is upper bound; realistic Conduit-time is ~4h core block + earlier stolen cycles between classes if the energy is there.

Use the **Day-1 scaffold checklist** at `.planning/scaffold-checklist.md` so 19:00 starts with `pnpm create next-app` not searching docs.

- [ ] **Scaffold the Next.js 16 app** (~1h). Single app, no Turborepo. TypeScript, Tailwind 4, App Router, Turbopack. shadcn/ui init: `button`, `card`, `input`, `textarea`, `dialog` only. Supabase client wired (`@supabase/ssr`). `/login` magic link. `/dashboard` placeholder. Commit: `feat: next.js 16 scaffold + supabase auth`.
- [ ] **Supabase schema for the spike** (~1h). Migration `0001_spike.sql`. Tables: `connections`, `manifests`, `endpoints` per design doc Saturday step 2 (no `teams` table — Week 2). RLS on every table: rows where `user_id = auth.uid()`. Apply via `supabase db push` to the hosted project. Commit: `feat(db): spike schema (connections, manifests, endpoints) with RLS`.
- [ ] **Connect flow for Notion** (~3h). `/connect` page. Dropdown with one provider (Notion). **Use Nango Connect UI** (`@nangohq/frontend` SDK with `nango.openConnectUI()`) — do NOT roll a custom popup. On success: callback writes a row in `connections`. `/dashboard` shows the connected account. Commit: `feat(connect): notion oauth via nango connect ui`.
- [ ] **Paste-OpenAPI flow** (~3h). `/import` page. URL input (paste-only for the spike, no file upload). Server-side fetch + parse with `@apidevtools/swagger-parser`. Validate: OpenAPI 3.x only, friendly error on Swagger 2 or malformed. Show checkbox list of GET+POST operations, max 10. User picks, submits. Server writes a `manifests` row. Commit: `feat(import): paste openapi 3.x → manifest draft`.
- [ ] **Vitest tests for the OpenAPI parser** (~1h). Three fixtures: a valid 3.0 spec (subset of Notion's), a Swagger 2.0 spec (must error friendly), a malformed JSON (must error friendly). Test that GET+POST extraction caps at 10. Commit: `test(parser): openapi 3.x extraction + friendly errors`.
- [ ] **Buffer + push every breakpoint** (~3h soak). Build-in-public means visible commits, not one Sunday-night dump. Push at every logical chunk, not just EOD.

**Done when**: from a fresh signup flow you can reach `/dashboard`, connect Notion, paste an OpenAPI URL, see GET+POST ops in a checkbox list, and submit to create a manifest row. CI green. No manifest preview yet (tomorrow).

If Mon slips past midnight: push manifest preview into Tue morning and compress Tue afternoon. Demo time on Wed is fixed.

## Tue 2026-04-28: build day 2 (~9h around uni)

**Goal**: manifest preview, MCP runtime, test-tool UI, ConduitError + 3 polished error states, end-to-end dogfood, GIF.

Calendar today: classes through the day, **19:00-23:00 Conduit Day 2 polish+runtime**. ~9h figure assumes earlier stolen cycles. The runtime is the load-bearing item — if any slip is forced, the slip is in the polish, not the runtime.

- [ ] **Manifest preview + edit page** (~2h). `/manifests/:id`. List of tools, descriptions, params schema. Allow per-tool rename. Save. Commit: `feat(manifests): preview + per-tool rename`.
- [ ] **Endpoint creation + token** (~2h). "Create endpoint" button. Generates slug, creates bearer token, hashes via `argon2` or bcrypt into `endpoints.token_hash`, shows token ONCE with copy-to-clipboard. Render Claude Desktop config JSON snippet for paste. Commit: `feat(endpoints): per-user mcp endpoint with bearer token`.
- [ ] **MCP runtime via `mcp-handler@1.0.4`** (~5h, the load-bearing block). `/api/mcp/[slug]/route.ts`. Stateless mode (no in-memory session state on serverless). Bearer-from-header verification via explicit `resolveUserFromBearer(token)` resolver that compares against `endpoints.token_hash`. `initialize`, `tools/list` (from `manifests.operations`), `tools/call` (dispatches to Notion via Nango or to an arbitrary URL for BYO OpenAPI tools). `export const maxDuration = 60`. Cut BYO OpenAPI **dispatch** (not the UI) if at 5h mark `tools/call` doesn't round-trip for Notion — ship Wed with "Notion live, BYO endpoints queued." Commit: `feat(mcp): stateless runtime with bearer auth + notion dispatch`.
- [ ] **Test-tool UI on manifest page** (~1h). For each tool, a "Try" button. Shows request, response, latency. **This is the single most important "craft" demonstration** in the demo, do not skip. Commit: `feat(test-tool): per-tool try button with request/response/latency`.
- [ ] **ConduitError + 3 polished error states** (~1h). Single error class with discriminated `kind`. Three states get bespoke UI per eng review D4: `notion-token-revoked` (re-connect button), `openapi-invalid` (line-pointer if parser gives one), `notion-rate-limited` (retry-after countdown). Other 7 fall back to a generic styled message; polish them as they actually trip in real user sessions. Commit: `feat(errors): conduiterror + 3 polished states`.
- [ ] **End-to-end dogfood** (~1h). Install Claude Desktop locally. Paste generated config. Run the two demo actions:
  - "Claude, search my Notion workspace for pages mentioning 'Q2 planning' and summarize the top three."
  - "Claude, create a new Notion page titled 'Conduit demo recap 2026-04-29' under my Scratch database with that summary as content."
  Confirm both work end-to-end. Time each. If either is over 30s, find the bottleneck and fix it tonight, not Wed.
- [ ] **Record the GIF** (~30 min). Three takes max. ShareX → ffmpeg `palette.png` trick or gifski. Spec: ≤ 30s, ≤ 10 MB, 1280×720. If over, cut content, don't aggressively re-encode (kills quality).
- [ ] **Pre-schedule Wed posts** (~30 min if X / LinkedIn allow scheduling). Tweet copy + LinkedIn long form + Bluesky variant. Five reply drafts ready: "Why not Composio?", "Will you support self-host?", "What's the AU angle?", "Pricing?", "When can I try it?".

**Done when**: end-to-end demo runs in under 30s per action in Claude Desktop, GIF is on disk and meets spec, posts are scheduled or drafted ready to publish manually at 09:00 AEST Wed.

## Wed 2026-04-29 09:00 AEST: demo day (~3h active)

- [ ] **08:55 final check**: live URL loads, demo path runs, GIF still under 10 MB.
- [ ] **09:00 confirm posts go live** (auto or manual).
- [ ] **09:00-09:30 reply-guard**: stay online, reply to first 10-20 comments personally within minutes. Algorithmic momentum hinges on the first 30-min window. Do not walk away.
- [ ] **09:30-12:00 watch analytics + DMs**: X impressions, click-throughs to demo URL, waitlist signups. Note who's saving, replying, DMing.
- [ ] **Track every DM**. Five named developers is the Week 1 bar. Respond to every one, ask their use case, send invites from waitlist queue in batches of 5-10 so you can actually support what you send.
- [ ] **Do not start Week 2 work today**. Wed is launch day, not another build day. Rest after the launch window.

## Thu 2026-04-30 → Sat 2026-05-02: polish week

Hard rules (from design doc):

- **Do not build Xero.** Not until 5-DM bar is hit.
- **Do not build Stripe.** Week 2.
- **Do not scaffold Turborepo.** Week 2.
- **Do not expand beyond Notion + BYO OpenAPI.** Polish what's there.
- **If a real user hits a bug in the deployed spike, that's the only thing worth dropping everything for.**

Concrete polish targets if no user-bug fires emerge:

- [ ] Polish 1-2 of the 7 unpolished error states **only if they're tripping in real sessions** (not preemptively).
- [ ] README quickstart so a stranger can clone and `pnpm dev` in <5 min.
- [ ] `docker-compose.yml` at repo root: Postgres + Redis for fully-local dev (skip Nango locally).
- [ ] Quick `/gstack-review` pass over the week's diff.
- [ ] Dependabot PRs reviewed + merged if clean.

## Sun 2026-05-03: `/retro` + Week 1 close

- [ ] **Run `/gstack-retro`**. Save artifacts.
- [ ] **Update STATUS.md** with Week 1 entry: 3-5 bullets on what shipped + commit links + 2-3 bullets on what's next + DM count vs the 5-bar.
- [ ] **Compose Week 1 X thread** (4-6 tweets, screenshots: deployed dashboard, Nango connect popup, MCP Inspector / test-tool UI, green CI). Schedule for Sun 19:00 AEST.
- [ ] **Vault side**: ping `05 Meta/routines/sunday-planner.md` so this week's Conduit progress lands in the weekly brief.
- [ ] **Draft `week-2.md`**. Week 2 goals depend on the 5-DM result:
  - **5+ DMs**: Stripe Solo tier checkout (day 1), Turborepo split (mid), Xero as second provider (end-of-week), self-host Nango migration starts.
  - **<5 DMs**: stop feature work. Re-run `/office-hours` with actual reactions. Do not "push harder."

**Done when**: STATUS.md updated, X thread scheduled, week-2.md drafted, 5-DM count recorded.

## Stretch (only if everything finishes early)

- PostHog + Sentry wired with minimal events (`user.signup`, `manifest.created`, `endpoint.created`, `tool.invoked`).
- Branded 404 page.
- `CONTRIBUTING.md` with the manifest-PR flow.

Do not pull these in at the cost of the spike or the 5-DM count. Slip to Week 2 buffer.

## Risks for this week specifically

1. **MCP transport regression between Sun validation and Tue runtime build.** Re-test in Claude Desktop the morning of Tue 28 against the deployed preview before building on assumptions. If transport changes, fall back to `mcp-remote` bridge — don't spend Tue chasing transport bugs.
2. **Nango Cloud quota or rate limits surprise.** Free tier covers the spike; check the dashboard once on Mon and once on Tue. If we hit limits on Wed during launch, escalate to paid tier same-day (~$50/mo, acceptable for the launch window).
3. **Vercel function timeout on `tools/call`.** `maxDuration = 60` on Pro covers it. Log any duration > 8s and treat as a bug. If streaming sessions exceed 60s during dogfood, fall back to `mcp-remote` stdio bridge per design doc.
4. **Uni or interview collision Mon-Tue.** If a full study block gets eaten, drop GIF polish and one of the polished error states. Hold the runtime + dogfood path. The demo loses zero punch if errors fall back to the generic styled message; it loses everything if `tools/call` doesn't round-trip.
5. **Demand failure (< 5 DMs by Sun 2026-05-03).** Do not push harder. Re-run `/office-hours`. The wedge is weaker than this plan assumes; building Week 2 on zero signal is the exact failure mode the design doc was meant to prevent.

## Links

- Source-of-truth design doc: `~/.gstack/projects/Wasif-ZA-conduit/wasif-main-design-20260424-133253.md`
- Day-1 scaffold checklist: `.planning/scaffold-checklist.md`
- Roadmap (12-week, **needs Week 1 entry rewrite after the spike**): `.planning/roadmap.md`
- Manifest spec: `.planning/manifest-spec.md`
- Decisions: `.planning/decisions.md`
- Status: `STATUS.md` (repo root)
- TODOs (deferred, not forgotten): `TODOS.md`
- Vault claude-context: `../../05 Meta/claude-context.md`
- Nango docs: https://docs.nango.dev
- MCP spec: https://modelcontextprotocol.io
- mcp-handler: https://github.com/vercel/mcp-handler
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
