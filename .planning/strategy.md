---
title: Conduit Strategy
type: planning
status: active
created: 2026-04-23
---

# Conduit Strategy

Strategic overview. For the weekly plan see [[roadmap]], for project decisions see [[decisions]], for the YAML spec see [[manifest-spec]].

## One-liner

Any AU/APAC SaaS, plugged into Claude in one OAuth click. Or paste your own OpenAPI spec and get a hosted MCP endpoint.

## Wedge

**Lead surface (marketing)**: "MCP for AU operators."
Audience: AU solo founders, consultants, small SaaS teams who already pay for Xero, Employment Hero, Canva, Atlassian, etc. and want Claude to automate across them.

**Unlock surface (power users)**: "Paste any OpenAPI spec."
Audience: devs with internal APIs or long-tail SaaS. Also covers anything we haven't pre-integrated yet.

One codebase. Two landing pages. Different copy, same product.

## Why this shape wins for a solo dev

- Composio, Klavis, Arcade, Zapier MCP chase US SaaS breadth. Nobody is building the AU operator stack.
- BYO-OpenAPI mode side-steps the integration bottleneck: users unblock themselves for anything we haven't pre-built.
- Open core + paid hosting = free distribution (community PRs for new integrations, GitHub stars as marketing).
- Build in public = audience on day 1, not at launch.
- Leverages the exact Korvo stack (Next.js 16 + Supabase + Stripe + BullMQ), so the stack-learning curve is zero.

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

- **Composio** (YC-backed, ~150 pre-built integrations, opaque pricing). The breadth play.
- **Klavis AI** (MCP-native, well-funded, launched late 2025).
- **Arcade.dev** (multi-LLM tool calling with OAuth).
- **Zapier MCP** (piggybacks Zapier's 7000+ existing integrations).
- **Pipedream** (MCP-compatible workflows).

A solo dev cannot out-integrate these on breadth. Conduit's wedge is regional focus (AU/APAC) + BYO OpenAPI + open-core community moat. Not "better Composio," different shape.

## Do not do

- Do not market as "Composio competitor." AU operators wedge, not beat-the-incumbent messaging.
- Do not ship integrations outside the v1 list until v1.5.
- Do not accept support contracts before v1 is stable.
- Do not build features that require ongoing manual work per-customer.
- Do not discuss pricing changes with private beta users during the beta.

## Cross-references

- [[roadmap]] — 12-week plan, weekly milestones, kill criteria.
- [[manifest-spec]] — YAML schema + worked Xero example + BYO OpenAPI flow.
- [[decisions]] — project-local decision log.
- [[why-conduit]] — decision rationale (how we got here over other ideas).
- [[../CLAUDE]] — project rules + stack lockdown.
- [[../README]] — public-facing.
- Nango OSS: https://github.com/NangoHQ/nango
- MCP spec: https://modelcontextprotocol.io
