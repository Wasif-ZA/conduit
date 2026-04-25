# CLAUDE.md — Conduit

Single source of truth for any Claude surface (Claude Code, Cowork) working on this repo.
Read this entire file before making changes. Follow precisely.

---

## PROJECT IDENTITY

- **Name**: Conduit
- **One-liner**: Any AU/APAC SaaS → Claude via MCP in one OAuth click. Plus BYO OpenAPI for the long tail.
- **Model**: Open core + paid hosting. MIT core, closed hosted-only features.
- **Primary side project**: Yes (replaces Korvo as of 2026-04-23).
- **Revenue target**: $500–2k AUD/mo by month 3 post-launch.
- **Ship style**: Build in public from week 1.

## STACK (mandatory, do not deviate without decision entry)

| Layer          | Choice                                              | Notes                                                                         |
| -------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| Framework      | **Next.js 16** (App Router, Turbopack, React 19.2)  | Match Korvo conventions; proxy.ts for auth guards.                            |
| UI             | TailwindCSS 4 + shadcn/ui                           | No framer-motion unless marketing page demands it.                            |
| Auth + DB      | **Supabase** (Postgres + RLS + Auth)                | JWT enforces RLS. Encrypted credential vault for per-user OAuth tokens.       |
| OAuth layer    | **Nango** (self-hosted on Railway)                  | MIT-licensed, covers ~250 providers. Do NOT roll custom OAuth per provider.   |
| Queue          | BullMQ 5 + ioredis                                  | For async MCP tool calls when provider APIs are slow.                         |
| Payments       | **Stripe** (Checkout + Customer Portal)             | AUD pricing with GST-compliant invoices.                                      |
| AI             | **Vercel AI SDK** (default) or **Anthropic SDK (direct)** or **Claude Agent SDK** where a multi-step loop is clearly justified | Default to lighter options for one-shot calls (BYO OpenAPI description refinement). Agent SDK is on the table when a feature genuinely needs autonomous reasoning. |
| Hosting        | Vercel (web) + Railway (Nango + Redis + worker)     | Same pattern as Korvo.                                                        |
| Observability  | PostHog + Sentry                                    | Funnel + error tracking from day 1.                                           |

### Stack rules

- **Default to lighter AI options.** Vercel AI SDK (native Next.js 16 fit) or direct Anthropic SDK for one-shot calls. Most Conduit AI surfaces are one-shot (description refinement, tool-name rewriting) and don't need an agent loop.
- **Claude Agent SDK is allowed** when a feature genuinely needs multi-step autonomous reasoning (e.g., intelligent tool routing, automated manifest debugging over a real spec). Not the default, but not banned. Any use gets a per-case justification entry in `.planning/decisions.md` so the token cost is intentional, not accidental.
- Do NOT roll custom OAuth for each provider. Nango is non-negotiable, it's the reason this is a 12-week build not 6 months.
- Do NOT use Prisma in hosted-only paths. Use Supabase client directly to keep RLS enforcement in the JWT.
- Do NOT add LangChain / LangGraph / CrewAI. If multi-step reasoning is needed, Claude Agent SDK is the in-ecosystem choice; avoid the Python / Node multi-framework zoo.

## FOLDER STRUCTURE (target)

```
conduit/
├── .planning/
│   ├── roadmap.md                 12-week plan, weekly milestones
│   ├── manifest-spec.md           YAML manifest format + worked Xero example
│   └── decisions.md               Project-local decisions (stack swaps, API picks)
├── apps/
│   ├── web/                       Next.js 16 dashboard + landing pages
│   └── mcp-runtime/               MCP server that serves per-user endpoints
├── packages/
│   ├── core/                      Manifest parser, MCP translation, shared types
│   └── integrations/              YAML manifests (OSS, PR-friendly)
│       ├── xero.yaml
│       ├── notion.yaml
│       └── ...
├── nango-config/                  Nango provider configs, self-host
├── docker-compose.yml             Local dev: Next + Redis + Nango + Supabase
├── .env.example
├── README.md                      Public-facing
├── LICENSE                        MIT (core + integrations only)
└── CLAUDE.md                      This file
```

## REVENUE + PRICING

- Free: 1 integration, 100 tool calls/mo.
- Solo: $29 AUD/mo, 5 integrations, 5000 tool calls/mo, BYO OpenAPI.
- Team: $99 AUD/mo, unlimited integrations, 25k tool calls/mo, team OAuth, audit log.
- Self-host starter kit: $99 one-off (docs + Docker compose + Terraform).

Target: 25 paying users by month 3 post-launch.

## CONVENTIONS

- **Dates are ISO + Sydney offset** (`+10:00` / `+11:00`). No naked `YYYY-MM-DD HH:MM`.
- **No em dashes anywhere.** Use commas, semicolons, colons, parentheses, periods.
- **File paths are repo-relative.**
- **Commits**: conventional commit messages, one feature per PR, link issue if applicable.
- **Tests**: Vitest for `packages/core`, Playwright for dashboard flows, contract tests for every manifest.
- **No secrets in repo.** Encrypted at rest in Supabase Vault; rotation documented in `docs/security.md`.
- **Tidy folders by default.** When a new file doesn't fit an existing folder, create a neat folder for it rather than dumping it at the repo root or next to unrelated files. Match the `FOLDER STRUCTURE` map above; if a new top-level folder is needed (e.g. `docs/`, `scripts/`, `sql/`, `.github/`), create it with a one-line `README.md` explaining what lives there. Group related files (migrations, fixtures, workflows, ADRs) into their own subfolder once there are 3+ of them, don't wait for sprawl. Never scatter loose `*.sql`, `*.sh`, or `*.md` files at the repo root.

## LAUNCH INTEGRATIONS (v1)

Ship with these 10 in `packages/integrations/`:

1. Xero
2. Employment Hero
3. Hnry
4. Atlassian (Jira + Confluence)
5. Canva
6. Notion
7. Airtable
8. HubSpot
9. Google Workspace (Drive + Docs + Sheets)
10. Slack

Plus BYO OpenAPI from v1 day 1.

## BUILD IN PUBLIC

- Public GitHub repo from day 1.
- `STATUS.md` at repo root, updated weekly with what shipped + what's next.
- Weekly X thread every Sunday (ties into `05 Meta/routines/sunday-planner.md` in the vault).
- Weekly devlog on wasifzaman.tech + dev.to.
- Discord opens at week 4.
- Launch: Product Hunt + HN Show + r/ClaudeAI + r/AUstartups when 5 integrations are verified end-to-end.

## DO NOT DO

- Do not ship a "competitor to Composio" messaging angle. AU wedge, not better-Composio.
- Do not add integrations outside the v1 list until v1.5.
- Do not ship features that require ongoing manual work per-customer (e.g., custom integrations for a single buyer).
- Do not accept support contracts before v1 is stable.
- Do not discuss pricing changes with users during private beta.

## CODEX SECOND OPINION (mandatory for decisions)

In this repo, Codex is the cross-model second opinion. Claude does not lock in a non-trivial decision alone. Before a decision is treated as final, Claude must consult Codex and weigh its response.

**When Codex must be consulted (blocking before commit/PR):**

- **Stack or library choices.** Adding, swapping, or removing anything in the `STACK` table, or pulling in any new runtime dependency.
- **Architecture decisions.** Schema changes, RLS policy edits, queue topology, MCP runtime boundaries, manifest format changes, anything that would land in `.planning/decisions.md`.
- **Security-sensitive code.** Auth flows, OAuth token handling, credential vault, encryption-at-rest, multi-tenant isolation.
- **Integration manifests.** Each manifest in `packages/integrations/` gets a Codex pass before merge.
- **Branch before PR.** Always run `/codex:review` (or `/codex` via gstack) on the diff. For high-stakes branches (auth, billing, RLS), also run `/codex:adversarial-review` to challenge the approach.
- **When Claude is uncertain.** If you'd hedge in a comment ("I think", "this should work"), consult Codex first instead of shipping the hedge.

**How to consult:**

- Default to `/codex:review --background` for diff review on long branches; check with `/codex:status` and `/codex:result`.
- Use `/codex:adversarial-review` when the question is "is this the right approach" rather than "is this code correct".
- Use `/codex:rescue` to delegate investigation (flaky tests, regressions, "why is this slow") rather than burning Claude context on it.
- For non-diff design questions, use the gstack `/codex` consult mode.

**Decision discipline:**

- Record the Codex verdict (pass / fail / disagreement) in the relevant `.planning/decisions.md` entry alongside Claude's reasoning. Both opinions stay in the record, even when they agree.
- If Codex disagrees, do not silently override. Either resolve the disagreement (update the plan, ask the user) or write down explicitly why Claude is overruling Codex and what risk is being accepted.
- Codex is read-only on review/adversarial-review. It will not edit the code, so the resolution is on Claude.

This is not optional polish. The point of running both models is to catch what a single model misses; skipping the second opinion defeats the setup.

## gstack

Use `/browse` from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools in Claude Code sessions on this repo.

Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation, /design-shotgun, /design-html, /review, /ship, /land-and-deploy, /canary, /benchmark, /browse, /connect-chrome, /qa, /qa-only, /design-review, /setup-browser-cookies, /setup-deploy, /retro, /investigate, /document-release, /codex, /cso, /autoplan, /plan-devex-review, /devex-review, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade, /learn.

### Conduit sprint rhythm (gstack mapping)

- Every new feature idea: `/office-hours` first, then `/autoplan`. Do not write code before a plan doc exists.
- Every branch before PR: `/review` + `/codex` for cross-model second opinion.
- Every integration manifest: `/qa-only` with Claude Desktop as MCP client; pure report, no code changes.
- Before v1 launch (week 11): `/cso` threat model. Non-negotiable because of per-user OAuth token handling.
- Every Sunday: `/retro`, feeds into build-in-public X thread and the vault's `sunday-planner` routine.
- `/learn` accumulates Conduit-specific patterns (Nango quirks, manifest conventions, MCP edge cases) across sessions. Review + prune monthly.

### Skill routing

- Use engineering skills from the `engineering` plugin (`engineering:architecture`, `engineering:debug`, etc.) when the question is about general design patterns or principles.
- Use gstack skills when the question is about this repo's sprint rhythm (plan → build → review → test → ship → reflect).
- Prefer gstack `/review` over `engineering:code-review` for branch-level review; they overlap but gstack has auto-fix.

## LINKS

- Strategy: `.planning/strategy.md`
- Roadmap: `.planning/roadmap.md`
- Manifest spec: `.planning/manifest-spec.md`
- Project decisions: `.planning/decisions.md`
- Why Conduit (founding context): `.planning/why-conduit.md`
- Vault claude-context: `../../05 Meta/claude-context.md`
- Vault decisions: `../../05 Meta/decisions.md`
- Nango OSS: https://github.com/NangoHQ/nango
- MCP spec: https://modelcontextprotocol.io
- gstack docs: https://github.com/garrytan/gstack
