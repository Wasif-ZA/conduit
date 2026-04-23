---
title: Conduit Project Decisions
type: planning
---

# Conduit Project Decisions

Project-local decision log. Vault-wide strategic decisions live in `05 Meta/decisions.md`.

## Active

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

## Resolved

_(none yet)_
