-- Controle de acesso por produto do app Serena Mente Feliz.
-- Reaproveita `contacts` (já existe do schema de captura do Lar Interior).
-- Um contato pode ter 0, 1 ou 2+ produtos ativos — a lógica de redirect
-- pós-login (lib/access.ts) decide hub vs seção única a partir daqui.

create type product_slug as enum ('lar_interior', 'metodo_calice');
create type product_access_status as enum ('active', 'revoked');

create table if not exists product_access (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts (id) on delete cascade,
  product product_slug not null,
  status product_access_status not null default 'active',
  purchased_at timestamptz not null default now(),
  completed_at timestamptz, -- TODO: gatilho de "completou o produto" ainda não definido (ver Método Cálice)
  unique (contact_id, product)
);

alter table product_access enable row level security;

-- Cada contato só enxerga o próprio acesso. contact_id = auth.uid() assume
-- que o id do contato É o id do usuário Supabase Auth (mesma conta única).
create policy "contato vê o próprio acesso"
  on product_access for select
  using (auth.uid() = contact_id);

-- Escrita só via service_role (webhook do Asaas), nunca do client.
