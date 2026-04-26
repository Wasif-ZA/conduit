---
title: Conduit Strategy
type: planning
status: active
created: 2026-04-23
revised: 2026-04-24 (post-/office-hours pivot from AU wedge to developer-first)
---

# Conduit Strategy

Strategic overview. For the weekly plan see [[roadmap]] and [[week-1]], for project decisions see [[decisions]], for the YAML spec see [[manifest-spec]].

## One-liner

The polished connect-debug-ship loop for wiring authenticated SaaS and OpenAPI specs to Claude via MCP. Get from "I have an account and an API spec" to "Claude can use it" in 8 minutes without fighting auth, schemas, or MCP glue.

## Wedge

**The polished developer loop above Nango.** Schema import, manifest inspection, tool testing, request/response logs, one-click debug. Nango handles OAuth and the API proxy; the wedge is everything Nango doesn't ship — the part a developer touches.

**Target user**: indie developer or small team with an authenticated SaaS account or an internal API + OpenAPI spec who wants Claude to drive it. Global. Self-serve. Values developer experience and ergonomics over catalog size.

**Spike scope (Week 1, ships 2026-04-29):** one provider (Notion), plus BYO OpenAPI 3.x. Done beautifully, end-to-end, with the test-tool UI and the request/response logs visible in the demo GIF. Width comes after the 5-DM signal bar.

## Why this shape wins for a solo dev

- **The loop above Nango is craft-shaped, not catalog-shaped.** Nango covers ~250 providers and will ship hosted MCP themselves. Conduit's defensible surface is the polished developer experience on top — the part Nango won't prioritize because it doesn't fit their B2B contract.
- **BYO OpenAPI side-steps the integration bottleneck**: users unblock themselves for anything we haven't pre-built. This makes the catalog-race irrelevant.
- **Open core + paid hosting = free distribution**: community PRs for new integrations, GitHub stars as marketing, Linear-style craft signal compounds.
- **Build in public = audience on day 1**, not at launch. Wed 2026-04-29 demo post is the public commit, not week 12.
- **Leverages the Korvo stack** (Next.js 16 + Supabase + BullMQ patterns), zero stack-learning curve.
- **Cross-model second opinion is built into the rhythm.** Codex catches what a single model misses; the workflow is plan → Claude + Codex consult → build → review with Codex → ship.

## Previous (rejected) wedge framings

Recorded so the "why not X?" is answerable later. Both surfaced and rejected during `/office-hours` 2026-04-24.

- **"MCP for AU operators."** Wedge was geographic. Rejected: target user (indie dev wiring SaaS to Claude) is not AU-first. Founder named the user as "AU SaaS founder / builder" then admitted on second pass that the differentiated instinct was developer-first self-serve, not regional.
- **"Nango-backed hosted MCP catalog."** Wedge was being _with_ Nango. Rejected: Nango will ship hosted MCP themselves; the wedge needs to be _above_ Nango, not next to it. The developer loop is the part Nango won't ship.

## Tech architecture

```
┌────────────────────────────────────────┐
│  Web app (Next.js 16 + App Router)     │
│  - Dashboard, OAuth start, billing     │
└────────────────┬───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│  API layer (Next.js route handlers +   │
│  webhooks for OAuth callbacks)         │
└────────┬──────────────┬────────────────┘
         │              │
┌────────▼──────┐  ┌───▼──────────────────┐
│  Nango (OSS)  │  │  Supabase            │
│  OAuth +      │  │  - Users, teams      │
│  API proxy    │  │  - Encrypted creds   │
│  ~250         │  │  - MCP endpoint IDs  │
│  providers    │  │  - Usage log         │
└────────┬──────┘  └──────────────────────┘
         │
┌────────▼──────────────────────────────┐
│  MCP wrapper service (Node/TS worker) │
│  - Receives MCP JSON-RPC from Claude  │
│  - Loads per-user creds               │
│  - Translates tool call to API call   │
│  - Returns MCP-shaped response        │
│  - Caches, rate-limits, retries       │
└───────────────────────────────────────┘
```

The engineering work is the MCP translation layer on top of Nango. Per integration, a YAML manifest maps API endpoints to MCP tools (see [[manifest-spec]] for schema + worked Xero example). Generic runtime reads YAML, exposes MCP tools, forwards to Nango. BYO mode: upload OpenAPI spec, parser generates candidate manifest, one-shot Claude call (direct Anthropic SDK, NOT Agent SDK) refines descriptions.

## Open core structure

- Public monorepo, MIT license.
- `/packages/core` — MCP wrapper service. OSS.
- `/packages/integrations/*.yaml` — integration manifests. OSS. Community PRs encouraged.
- `/apps/mcp-runtime` — per-user MCP server. OSS.
- `/apps/web` — dashboard + billing + team management. **Closed source**, not in public repo.
- README clear: fork and self-host for free, or pay us to host it.
- Discord opens at week 4 for contributors and early adopters.

## Revenue path

| Tier     | AUD/mo | Included                                                                       |
| -------- | ------ | ------------------------------------------------------------------------------ |
| Free     | $0     | 1 integration, 100 tool calls/mo                                               |
| Solo     | $29    | 5 integrations, 5000 tool calls/mo, BYO OpenAPI                                |
| Team     | $99    | Unlimited integrations, 25k tool calls/mo, shared workspace, audit log         |
| Self-host kit | $99 one-off | Docker compose + Terraform + setup docs                              |

Target path:
- 20 Solo + 5 Team = $580 + $495 = $1075 AUD/mo
- 40 Solo + 10 Team = $1160 + $990 = $2150 AUD/mo

Commit: 25 paying users by month 3 post-launch or revisit decision. See [[../../../05 Meta/decisions]] for revisit trigger 2026-07-16.

## Build-in-public rhythm

From day 1:

- Public GitHub repo, MIT core. Domain + GitHub + X handle registered week 1.
- `STATUS.md` at repo root, updated weekly.
- Weekly X thread every Sunday (ties into vault's `sunday-planner` routine).
- Weekly devlog post to wasifzaman.tech + dev.to.
- 1 integration build live-streamed per week during Project Blocks.
- Launch: Product Hunt + HN Show + r/ClaudeAI + r/AUstartups + r/mcp when 5 integrations are verified end-to-end against Claude Desktop + Cursor.

## Competitive landscape

- **Composio** (YC-backed, ~150 pre-built integrations, opaque pricing). Breadth play. Owns the catalog race.
- **Klavis AI** (MCP-native, well-funded, launched late 2025). Direct competitor on shape; differentiation is craft.
- **Arcade.dev** (multi-LLM tool calling with OAuth).
- **Zapier MCP** (piggybacks Zapier's 7000+ existing integrations). Maximum breadth.
- **Pipedream** (MCP-compatible workflows).
- **Nango** (the OAuth/API-proxy layer Conduit sits on top of). Will ship hosted MCP themselves at some point. Friend until then, then competitor on the layer Conduit deliberately occupies above them.

A solo dev cannot out-integrate Composio, Zapier, or Pipedream on breadth. Conduit's wedge is the polished developer loop — schema import, manifest inspection, test-tool UI, request/response logs — that none of them have prioritised because their pitch is catalog size. Plus BYO OpenAPI from day 1, plus open-core community moat (Linear analog). Not "better Composio," different shape entirely.

## Do not do

- Do not chase breadth before craft. The 5-DM signal bar gates Week 2 expansion; building Xero #2 before Notion #1 is loved is a catalog-race trap.
- Do not market as "Composio competitor" or "better-Composio." The pitch is the developer loop, not catalog parity.
- Do not ship integrations outside the spike before the 5-DM bar is hit (Sun 2026-05-03).
- Do not accept support contracts before v1 is stable.
- Do not build features that require ongoing manual work per-customer.
- Do not discuss pricing changes with private beta users during the beta.
- Do not pull Stripe forward into Week 1. Demand validation before checkout.

## Cross-references

- [[roadmap]] — 12-week plan, weekly milestones, kill criteria.
- [[manifest-spec]] — YAML schema + worked Xero example + BYO OpenAPI flow.
- [[decisions]] — project-local decision log.
- [[why-conduit]] — decision rationale (how we got here over other ideas).
- [[../CLAUDE]] — project rules + stack lockdown.
- [[../README]] — public-facing.
- Nango OSS: https://github.com/NangoHQ/nango
- MCP spec: https://modelcontextprotocol.io
