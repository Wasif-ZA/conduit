---
title: Why Conduit (Decision Trail)
type: planning
status: resolved
created: 2026-04-23
---

# Why Conduit

Founding-context doc. Records what was evaluated and rejected before Conduit was picked. Not an active planning doc, preserved so the "why not X?" is answerable later.

## The goal (2026-04-23)

- $500–2k AUD/mo side income.
- Replace Korvo as primary side-project time allocation.
- Bias toward extending existing skills, not a standing start.

## What was audited in each existing project

### Korvo
- Production-grade SaaS scaffolding: Next.js 16, Supabase RLS, Stripe webhooks, Gmail OAuth, BullMQ FlowProducer DAG, 4-agent Claude pipeline, demo mode. Gmail send-quota warm-up ramp + bounce circuit breaker genuinely novel.
- Rejected as revenue path: cold-email PMF weak by own admission. Space is crowded (Apollo, Instantly, Smartlead). Kept as portfolio artifact.

### AutoDocs
- Real engineering: ts-morph AST walker, prompt design with structured output, file-hash cache with TTL, PII/credential sanitizer, rate-limit + retry, GitHub Actions workflow.
- Rejected: doc-gen tools have a retention graveyard. Commercial angle narrower than the code suggests. 3–4 month build with marketing overhead not available during job-search batches.

### Say-Less / Imposter Party
- Fully designed offline React Native party game on Expo. ~70% built.
- Rejected by Wasif: party-game App Store market saturated, winning requires $10k+ marketing budget we don't have.

### UTBDSOC/ComponentLibrary-
- 30+ production React components across 3 brand themes. Template-marketplace material.
- Backup option as Gumroad template pack. Not primary because prices are low ($79 one-off) and it's packaging work, not product work.

### UTBDSOC-website, WasifZaman.js, Rank2Revenue
- Distribution surfaces and client-proof, not products.

## Candidates explored for a NEW project

Generated across four batches as ideas were floated, pinned, or discarded.

Pinned during ideation (alternatives kept warm):

- **Morningstar** — daily brief SaaS for founders (productize the morning-brief artifact).
- **Stagehand** — Claude Code plugin marketplace.
- **MCP Forge** — no-code MCP server builder for devs.
- **VisaTrack** — Partner visa 820/801 tracker SaaS.

Discarded:

- **NextShip** (Korvo-as-starter-kit): still Korvo-adjacent, violates "move off Korvo" intent.
- **Imposter Party (ship to store)**: party-game market saturated, marketing-heavy.
- **AutoDocs SaaS**: dev-tool retention graveyard, too slow to revenue.
- **Halalfit, Sharia Invest**: consumer app / compliance DB grind, off-brand for skills.
- **ChangeFeed**: overlaps Morningstar too much.
- **BallotBox, AcademicLoop, FreelanceHub AU, Silicon Sydney**: each fine, none as strong as the final pick.
- **EssayMaster AU, StrataOS, Mosque Admin, Sponsor Sheet**: interesting niches, not the shortest path.
- **ComplyTrack, AgentTrace, Connector Radar**: all generated from pinned-DNA prompts. AgentTrace too competitive, Connector Radar interesting but pairs with Morningstar not standalone, ComplyTrack a wider VisaTrack which could still be a follow-on product.

## Why Conduit won

MCP Bridge / Conduit came out of the "use pinned DNA" round and landed because:

1. **Feasibility is concrete**: Wasif said "this is possible for me to make" on first pass. Stack overlaps Korvo exactly.
2. **Bridge vs Forge unification**: what started as two ideas (MCP Forge for devs building from scratch, MCP Bridge for OAuth wrappers) collapsed into one product with two audiences, which tightens the pitch.
3. **Wedge exists**: AU/APAC SaaS is not the priority target for Composio, Klavis, or Arcade. Room to build a regional brand before they care.
4. **Open core unlocks free distribution**: matches the build-in-public preference and lets community PRs grow the integration library without Wasif writing every manifest.
5. **Price points hit the $500–2k/mo target in single-digit to low-double-digit customer counts**: $29 + $99 tiers work the math out at 25 paying users by month 3.
6. **AI surface area is narrow**: the product is infrastructure. Default AI touch-points (BYO-OpenAPI description refinement, tool-name rewriting) are one-shot and fit Vercel AI SDK or direct Anthropic SDK. Claude Agent SDK stays available for any future feature that genuinely needs multi-step reasoning; it's just not the default.

## Parked follow-ons

Kept in mind as v2 / sibling products if Conduit v1 hits numbers:

- **ComplyTrack** (generalized VisaTrack) — could ride the same Conduit billing + auth infra.
- **Morningstar** — also fits inside a Conduit-branded suite later.
- **AgentTrace** — observability for Claude agents including Conduit BYO users.

## Where the live docs live

- [[strategy]] — current strategic overview.
- [[roadmap]] — weekly plan + kill criteria.
- [[manifest-spec]] — YAML format.
- [[decisions]] — project-local decisions.
- [[../../../05 Meta/decisions]] — vault-level decision entry for Conduit.

## Related vault context

- Vault-level decision: `05 Meta/decisions.md` entry "Conduit chosen as primary side project; Korvo frozen" (2026-04-23).
- Active focus swap: `05 Meta/claude-context.md` Active focus #4 updated same day.
- Activity log: `05 Meta/activity-log.md` entries 2026-04-23T19:05, 19:18, 19:34, 19:52, 20:xx.
