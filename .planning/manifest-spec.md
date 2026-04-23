---
title: Conduit Manifest Spec v0
type: planning
status: draft
---

# Conduit Manifest Spec v0

This is the YAML format for every integration in `packages/integrations/`. Community PRs conform to this.

## Design goals

1. **Flat enough to write by hand.** One person should be able to add a new integration in an afternoon.
2. **Structured enough to generate.** BYO OpenAPI mode auto-emits manifests in this format.
3. **Opinionated on MCP shape.** Every entry resolves to a deterministic MCP tool definition without runtime Claude intervention.
4. **Nango-native.** Auth, base URL, rate limits, and refresh handled upstream by Nango, so the manifest only describes tools, not auth.

## Top-level shape

```yaml
meta:
  name: string                     # human-readable
  slug: string                     # kebab-case, unique, used in MCP tool prefix
  provider_id: string              # Nango provider id, e.g. "xero"
  version: semver                  # manifest version, bump on breaking tool changes
  base_url: string                 # may include ${connection.metadata.x} templating
  docs_url: url
  tier_hint: "free" | "solo" | "team"   # minimum plan to use this integration

auth:
  type: "oauth2" | "api_key" | "basic"
  scopes: [string]                 # optional, for documentation
  tenant_header: string            # optional, e.g. "Xero-Tenant-Id"

rate_limits:
  per_second: number
  per_minute: number
  per_day: number

tools:
  - name: string                   # snake_case, will be namespaced as ${slug}__${name} in MCP
    description: string            # shown to Claude verbatim, write in 2nd person
    endpoint:
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
      path: string                 # with ${param.x} templating
    params:
      - name: string
        in: "query" | "path" | "body" | "header"
        type: "string" | "number" | "boolean" | "date" | "object" | "array"
        required: boolean
        description: string
        default: any                # optional
        enum: [any]                 # optional
    response:
      shape: "list" | "object" | "raw"
      select: string                # JSONPath to extract the useful bit, e.g. "$.Invoices"
      max_items: number             # clip lists to avoid context bloat
    caching:
      ttl_seconds: number | "none"
    notes: string                  # freeform, for manifest maintainers
```

## Tool naming convention

MCP tools are exposed as `${slug}__${name}`. Example: `xero__list_invoices`, `notion__search`.

The `__` double-underscore separator is load-bearing. Do not use a single underscore, it conflicts with some provider names.

## Response shaping rules

1. Every list response MUST set `max_items` (default 50). Claude contexts choke on unbounded result sets.
2. Every object response MUST pick a `select` JSONPath unless the raw is already lean.
3. Dates come back as ISO 8601 with timezone. Provider-native formats (Xero's `/Date(timestamp)/`) get normalized in `packages/core/transform.ts`.
4. If a response includes binary data (PDFs, images), return a signed URL, not base64. This is a hard rule for context budget.

## Worked example: Xero

```yaml
# packages/integrations/xero.yaml
meta:
  name: Xero
  slug: xero
  provider_id: xero
  version: 0.1.0
  base_url: https://api.xero.com
  docs_url: https://developer.xero.com/documentation/api/accounting/overview
  tier_hint: solo

auth:
  type: oauth2
  scopes: [accounting.transactions, accounting.contacts, accounting.settings]
  tenant_header: Xero-Tenant-Id

rate_limits:
  per_second: 10
  per_minute: 60
  per_day: 5000

tools:
  - name: list_invoices
    description: |
      List invoices for the connected Xero organization. Filter by status, contact, or date range.
      Returns up to 100 most recent invoices by default.
    endpoint:
      method: GET
      path: /api.xro/2.0/Invoices
    params:
      - name: where
        in: query
        type: string
        required: false
        description: Xero filter expression, e.g. "Status==\"AUTHORISED\""
      - name: order
        in: query
        type: string
        required: false
        default: "Date DESC"
        description: Field and direction, e.g. "Date DESC"
      - name: page
        in: query
        type: number
        required: false
        default: 1
    response:
      shape: list
      select: "$.Invoices"
      max_items: 100
    caching:
      ttl_seconds: 60
    notes: |
      Xero uses "/Date(timestamp+offset)/" format internally. Normalize to ISO 8601 in transform.

  - name: get_invoice
    description: Get a single invoice by Xero InvoiceID or InvoiceNumber.
    endpoint:
      method: GET
      path: /api.xro/2.0/Invoices/${param.invoice_id}
    params:
      - name: invoice_id
        in: path
        type: string
        required: true
        description: Xero InvoiceID (GUID) or InvoiceNumber (e.g. "INV-0042")
    response:
      shape: object
      select: "$.Invoices[0]"
    caching:
      ttl_seconds: 30

  - name: list_contacts
    description: List contacts (customers and suppliers) in the organization.
    endpoint:
      method: GET
      path: /api.xro/2.0/Contacts
    params:
      - name: where
        in: query
        type: string
        required: false
        description: Xero filter, e.g. "IsCustomer==true"
      - name: page
        in: query
        type: number
        required: false
        default: 1
    response:
      shape: list
      select: "$.Contacts"
      max_items: 100
    caching:
      ttl_seconds: 300

  - name: list_accounts
    description: List the chart of accounts (for journaling, reconciliation, reporting).
    endpoint:
      method: GET
      path: /api.xro/2.0/Accounts
    params: []
    response:
      shape: list
      select: "$.Accounts"
      max_items: 500
    caching:
      ttl_seconds: 3600

  - name: get_organization
    description: Get the connected organization's profile (name, country, tax settings, financial year end).
    endpoint:
      method: GET
      path: /api.xro/2.0/Organisation
    params: []
    response:
      shape: object
      select: "$.Organisations[0]"
    caching:
      ttl_seconds: 3600

  - name: list_bank_transactions
    description: List bank transactions (spend and receive money entries) for reconciliation views.
    endpoint:
      method: GET
      path: /api.xro/2.0/BankTransactions
    params:
      - name: where
        in: query
        type: string
        required: false
      - name: order
        in: query
        type: string
        required: false
        default: "Date DESC"
      - name: page
        in: query
        type: number
        required: false
        default: 1
    response:
      shape: list
      select: "$.BankTransactions"
      max_items: 100
    caching:
      ttl_seconds: 60
```

## Runtime expansion

At runtime, `packages/core/manifest.ts`:

1. Loads the YAML for the requested integration.
2. For each `tools[]` entry, emits an MCP tool definition: `name = "${slug}__${tool.name}"`, `inputSchema` generated from `params[]`, `description` verbatim.
3. On tool call: resolves path templating, validates params, forwards to Nango with the user's connection id, applies `response.select` JSONPath + `max_items` clip, normalizes dates, returns MCP-shaped content.

Nango handles: token refresh, tenant header injection (from `connection.metadata.tenant_id`), rate-limit backoff.

## BYO OpenAPI flow

1. User uploads OpenAPI 3.0 spec (YAML or JSON).
2. `packages/core/openapi-to-manifest.ts` walks `paths[]`:
   - Each path operation becomes a tool.
   - `summary` or `description` becomes tool description.
   - Parameters + request body schema become `params[]`.
   - Response `200` schema is inspected for list vs object shape.
3. Initial manifest saved as draft.
4. One-shot Claude call (Sonnet 4.6, direct Anthropic SDK, NOT Agent SDK):
   - Rewrites each tool description to 2nd-person imperative style.
   - Flags tools that look dangerous (`DELETE`, `POST /admin/*`) for user review.
   - Proposes `max_items` and `caching.ttl_seconds` values.
5. User reviews + approves in dashboard.
6. Manifest saved to user's private integrations table (not the public OSS repo).

Estimated cost per BYO ingest: ~$0.03 (one Sonnet call with 2–5k output tokens).

## Validation

Every manifest in `packages/integrations/*.yaml` runs through CI:

- Schema validated against the spec above with Zod.
- At least 3 tools per integration.
- All paths resolve to valid URL templates.
- `response.select` JSONPaths are syntactically valid.
- `rate_limits` declared.

Manifests that fail validation block merge.
