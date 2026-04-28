-- connections (per-user OAuth connections via Nango)
create table connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  nango_connection_id text not null,
  display_name text,
  created_at timestamptz default now(),
  unique (user_id, provider, nango_connection_id)
);
alter table connections enable row level security;
create policy "users see own connections" on connections
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- manifests (per-user manifest drafts, from Notion or pasted OpenAPI)
create table manifests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  source_type text check (source_type in ('nango','openapi')) not null,
  source_ref text not null,
  name text not null,
  operations jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);
alter table manifests enable row level security;
create policy "users see own manifests" on manifests
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- endpoints (per-user MCP endpoints with hashed bearer tokens)
create table endpoints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  manifest_id uuid references manifests(id) on delete cascade not null,
  slug text unique not null,
  token_hash text not null,
  created_at timestamptz default now(),
  revoked_at timestamptz
);
alter table endpoints enable row level security;
create policy "users see own endpoints" on endpoints
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- The MCP route uses service-role key + explicit resolveUserFromBearer,
-- so it does not go through RLS.
create index endpoints_slug_idx on endpoints (slug);
