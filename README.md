# Conduit

**Any SaaS, plugged into Claude in one OAuth click.** Plus bring-your-own OpenAPI for anything we haven't built yet.

Built for AU operators who want Claude to move work across Xero, Atlassian, Notion, HubSpot, Canva, and the rest of their stack without gluing together ten half-built MCPs.

> **Status**: pre-alpha. Building in public. Follow progress: [STATUS.md](./STATUS.md) · [@wasif on X](https://x.com/) · [wasifzaman.tech/conduit](https://wasifzaman.tech)

---

## Why Conduit

The Model Context Protocol (MCP) is how Claude talks to your tools. Writing an MCP server for every SaaS is a grind. Most AU and APAC operators don't have time for that.

Conduit handles it for you:

1. **Pre-built integrations** for the AU stack: Xero, Employment Hero, Hnry, Atlassian, Canva, and more.
2. **BYO OpenAPI** for anything we haven't built yet. Paste a spec, OAuth in, get a live MCP endpoint in under 2 minutes.
3. **Open core** (MIT). Self-host the runtime for free, pay us to host it.
4. **AU-first**: AUD pricing, GST invoices, no "contact sales" nonsense.

## Planned launch integrations

- Xero
- Employment Hero
- Hnry
- Atlassian (Jira + Confluence)
- Canva
- Notion
- Airtable
- HubSpot
- Google Workspace
- Slack

Follow progress in [STATUS.md](./STATUS.md).

## Pricing (pre-launch draft)

| Tier       | Price AUD/mo  | What's included                                                                |
| ---------- | ------------- | ------------------------------------------------------------------------------ |
| Free       | $0            | 1 integration, 100 tool calls/mo                                               |
| Solo       | $29           | 5 integrations, 5000 tool calls/mo, BYO OpenAPI                                |
| Team       | $99           | Unlimited integrations, 25k tool calls/mo, shared workspace, audit log         |
| Self-host  | Free (MIT)    | Fork the core, run it yourself. $99 one-off starter kit for setup docs.        |

## Stack

- Next.js 16 + React 19.2
- Supabase (Postgres + RLS + Auth + Vault)
- Nango (OSS OAuth middleware, ~250 providers)
- BullMQ + Redis
- Stripe
- Vercel + Railway

Full stack rationale in [CLAUDE.md](./CLAUDE.md).

## Repo structure

```
conduit/
├── apps/
│   ├── web/                 Next.js dashboard + landing pages
│   └── mcp-runtime/         Per-user MCP server
├── packages/
│   ├── core/                Manifest parser + MCP translation
│   └── integrations/        YAML manifests (PRs welcome)
├── .planning/               Internal roadmap + specs
└── CLAUDE.md                Project rules
```

## Contributing

PRs welcome on:
- New integration manifests in `packages/integrations/` (follow the format in [manifest-spec](./.planning/manifest-spec.md))
- Documentation
- Bug fixes

Closed source: the hosted dashboard (`apps/web`) and billing (`apps/web/api/stripe/*`) are not in this repo.

## License

MIT — for the core and integration manifests. Hosted service is a separate product.

---

Built by [Wasif Zaman](https://wasifzaman.tech) in Sydney.
