---
title: Conduit Roadmap
type: planning
owner: Wasif
target_launch: 2026-07-16
---

# Conduit Roadmap

12-week plan to v1 launch. Weekly checkpoints tie into `05 Meta/routines/sunday-planner.md`.

## Week-by-week

### Week 1 (2026-04-27 → 05-03): Foundations

- Buy `conduit.dev` or fallback (`trycondu.it`, `conduit-mcp.com`). Register `@conduit_mcp` on X.
- Public GitHub repo, MIT license on `/packages/core` and `/packages/integrations`.
- Turborepo monorepo scaffold (`apps/web`, `apps/mcp-runtime`, `packages/core`, `packages/integrations`).
- Supabase project created, schema v0: `users`, `teams`, `connections`, `mcp_endpoints`, `usage_log`. RLS on from day 1.
- Railway deploy: Nango self-host + Redis.
- **Day-0 X post**: "Starting Conduit. Open-core SaaS. 12 weeks to launch. Follow along."

### Week 2: First OAuth end-to-end

- Xero OAuth flow via Nango. User clicks "connect", returns with a working connection row in Supabase.
- Bare dashboard: list connected SaaS, show generated MCP endpoint URL (not functional yet).
- Empty MCP runtime that accepts JSON-RPC and returns empty tool list.
- Weekly X thread: "Week 2 done. First OAuth click works end-to-end."

### Week 3: Manifest runtime

- Lock the manifest schema (see `manifest-spec.md`).
- Write `packages/core/manifest.ts`: loads YAML, exposes MCP tools.
- Xero manifest with 6 tools: `list_invoices`, `get_invoice`, `list_contacts`, `list_accounts`, `get_organization`, `list_bank_transactions`.
- MCP runtime proxies tool calls through Nango to Xero API.
- Verify end-to-end: Claude Desktop connects, calls `list_invoices`, sees real data.

### Week 4: Second and third integrations

- Notion manifest (5 tools: `search`, `get_page`, `get_database`, `query_database`, `create_page`).
- Airtable manifest (4 tools).
- Open Discord server for early adopters + contributors.
- Weekly devlog on wasifzaman.tech.

### Week 5: Billing

- Stripe Checkout (Solo + Team tiers, AUD pricing).
- Usage metering: tool calls/mo, integration count per plan.
- Customer Portal for plan changes + cancel.
- Quota enforcement middleware in MCP runtime.

### Week 6: BYO OpenAPI parser

- Upload OpenAPI 3.0 spec (YAML or JSON).
- Parser generates candidate manifest.
- Claude one-shot (direct Anthropic SDK, NOT Agent SDK) refines tool descriptions.
- User reviews, approves, publishes.
- Test against 3 real specs: Stripe, OpenAI, Linear.

### Week 7: Fill integrations batch 1

- HubSpot, Atlassian (Jira + Confluence), Slack.
- Hardening: rate limiting, retry with exponential backoff, error translation to MCP-shaped errors.

### Week 8: Fill integrations batch 2

- Google Workspace (Drive + Docs + Sheets), Employment Hero, Hnry, Canva.
- Contract tests per integration: happy path, error cases, rate limit.

### Week 9: Landing pages + docs

- Two marketing pages: `/au-operators` (lead) + `/byo-openapi` (unlock).
- Docs site (Nextra or Fumadocs): quickstart per integration, MCP client setup guides (Claude Desktop, Cursor, Continue).
- 3 demo videos (Xero → Claude, BYO OpenAPI flow, team setup).

### Week 10: Private beta

- Invite 30 AU operators from network: UTBDSOC alumni, Atlassian referrals, Macquarie SE cohort, dev Twitter.
- Feedback form + weekly office hours.
- Fix top 10 bugs.

### Week 11: Polish + launch prep

- Product Hunt page drafted, assets ready.
- HN Show post drafted.
- Launch-day X thread + Bluesky + LinkedIn.
- Scheduled tweets across launch day.
- Lighthouse + a11y pass on landing.

### Week 12: Launch week

- **Monday**: email private beta, "go public Wednesday".
- **Tuesday**: final QA, reply drafts ready.
- **Wednesday**: Product Hunt launch at 00:01 PST. HN Show at 09:00 AEST. X thread. r/ClaudeAI, r/AUstartups, r/mcp posts.
- **Thursday/Friday**: respond, fix, iterate.
- **Sunday**: post-launch retro, numbers dump, plan week 13.

## Post-launch (weeks 13+)

- Month 2: v1.5 integrations (Stripe, Deputy, Airwallex, Linktree, Culture Amp, MYOB).
- Month 2: SOC 2 readiness prep if team-tier traction appears.
- Month 3: paid marketing experiments only if CAC < 3 months LTV.
- Month 3: revisit decision (`05 Meta/decisions.md`). Either grow or pivot/kill.

## Success criteria at week 12

- 5 integrations verified end-to-end against Claude Desktop + Cursor.
- BYO OpenAPI works for 3 distinct external specs.
- Private beta has ≥20 active users.
- 5 paying customers by launch day.
- GitHub stars ≥100 from build-in-public thread + launch.

## Kill criteria

Stop and pivot if at month 3 post-launch:

- Fewer than 10 paying customers AND no clear path to 25 within next 6 weeks.
- Composio or Anthropic ships direct "any SaaS to MCP" feature with better UX than Conduit.
- Nango project gets deprecated or license changes badly.

## Risks to actively manage

1. **Nango dependency** — monitor releases weekly, fork at v1 launch.
2. **MCP spec changes** — subscribe to modelcontextprotocol.io changelog in change-digest.
3. **Solo support load** — price Solo tier support at 1hr/mo email cap; hard stop.
4. **Uni + job search collision** — weekly Project Block for Conduit is non-negotiable, but if Batch 2 interviews stack up, shift launch from week 12 to week 14.
