# Conduit

**The polished connect-debug-ship loop for wiring authenticated SaaS and OpenAPI specs to Claude via MCP.** From "I have an account and an API spec" to "Claude can use it" in 8 minutes, without fighting auth, schemas, or MCP glue.

> **Status**: pre-alpha, Week 1 spike shipping 2026-04-29. Building in public. Follow progress: [STATUS.md](./STATUS.md) · [tryconduit.dev](https://tryconduit.dev) · [Wasif Zaman](https://wasifzaman.tech)

---

## Why Conduit

The Model Context Protocol (MCP) is how Claude talks to your tools. Writing and maintaining an MCP server per SaaS is a grind, and existing catalogs treat the developer experience as an afterthought.

Conduit's wedge is the developer loop, not the catalog:

1. **Connect** any pre-built provider in one OAuth click, or paste an OpenAPI 3.x spec for anything we haven't built yet.
2. **Debug** with a manifest preview, per-tool test UI, and live request/response logs. The loop a real developer needs.
3. **Ship** a per-user MCP endpoint Claude Desktop can talk to, with bearer-in-header auth and one-paste config.
4. **Open core**, MIT. Self-host the runtime for free, or pay us to host it.

Target user: indie developer or small team with an authenticated SaaS account, or an internal API plus an OpenAPI spec, who wants Claude to drive it. Global. Self-serve.

## Week 1 spike (ships Wed 2026-04-29)

End-to-end demo of the connect-debug-ship loop with one provider plus BYO OpenAPI:

- **Notion** via Nango
- **BYO OpenAPI 3.x**: paste a spec, pick GET and POST operations, generate a live per-user MCP endpoint

The loop is what's polished, not the catalog. Width comes after the 5-named-developer-DMs signal bar (Sun 2026-05-03). See [STATUS.md](./STATUS.md) for what's currently shipped vs. on the roadmap.

## Planned providers (post-spike, gated on signal)

Order is by demand, not the original list. Listed alphabetically:

- Airtable
- Atlassian (Jira + Confluence)
- Canva
- Employment Hero
- Google Workspace (Drive, Docs, Sheets)
- HubSpot
- Hnry
- Slack
- Xero

Plus BYO OpenAPI from day 1.

## Pricing (pre-launch draft)

| Tier       | Price AUD/mo  | Included                                                                |
| ---------- | ------------- | ----------------------------------------------------------------------- |
| Free       | $0            | 1 integration, 100 tool calls/mo                                        |
| Solo       | $29           | 5 integrations, 5000 tool calls/mo, BYO OpenAPI                         |
| Team       | $99           | Unlimited integrations, 25k tool calls/mo, shared workspace, audit log  |
| Self-host  | Free (MIT)    | Fork the core, run it yourself. $99 one-off starter kit for setup docs. |

## Stack

- Next.js 16 + React 19.2 (App Router, Turbopack)
- TailwindCSS 4 + shadcn/ui
- Supabase (Postgres + RLS + Auth + Vault)
- Nango for OAuth and API proxy, ~250 providers (Cloud for Week 1, self-hosted on Railway from Week 6)
- `mcp-handler@1.0.4` for the Vercel-native MCP runtime, stateless mode, bearer-in-header auth
- BullMQ 5 + ioredis for async tool dispatch
- Stripe (Checkout + Customer Portal, AUD pricing with GST invoices)
- Vercel (web) + Railway (Nango + Redis)

Full stack rationale in [CLAUDE.md](./CLAUDE.md).

## Repo structure (Week 1 spike, single Next.js app)

```
conduit/
├── .planning/                Strategy, roadmap, decisions, manifest spec
├── app/                      Next.js 16 App Router (login, dashboard, connect, import, manifests, api/mcp/[slug])
├── components/               UI (shadcn-derived)
├── lib/                      Supabase client, Nango client, OpenAPI parser, mcp-handler glue, ConduitError
├── supabase/migrations/      SQL migrations (0001_spike.sql etc.)
├── tests/                    Vitest unit + integration
├── README.md
├── STATUS.md                 Weekly build-in-public log
├── TODOS.md                  Deferred items, gated by signal or schedule
├── LICENSE                   MIT
└── CLAUDE.md                 Project rules
```

The Week 2+ Turborepo split (`apps/web`, `apps/mcp-runtime`, `packages/core`, `packages/integrations`) is deferred per [decisions.md](./.planning/decisions.md) until a second app actually exists.

## Contributing

PRs welcome on:

- Documentation
- Bug fixes
- New integration manifests once the YAML spec stabilises post-spike (see [manifest-spec](./.planning/manifest-spec.md))

## License

MIT for the entire Week 1 spike repo. After the Week 2+ Turborepo split, MIT continues for `packages/core`, `packages/integrations`, and `apps/mcp-runtime`. The hosted dashboard and Stripe billing in `apps/web` move closed-source at that point; the hosted product is a separate offering.

---

Built by [Wasif Zaman](https://wasifzaman.tech) in Sydney.
