-- Mapeia QR Code Pix estático (id do Asaas) -> quem tá comprando o quê.
-- Necessário porque o checkout sem CPF/cliente cadastrado não tem um
-- `externalReference` confiável no payment criado automaticamente pelo
-- Asaas; o webhook devolve só `payment.pixQrCodeId`, que bate com o `id`
-- que a gente recebeu na criação do QR Code (ver lib/asaas.ts).
--
-- Aplicar com: node scripts/run-migration.mjs supabase/migrations/0009_pix_charges.sql <SENHA_DB>

create table if not exists pix_charges (
  id text primary key, -- id do QR Code no Asaas, não gerado por nós
  contact_id uuid not null references contacts (id) on delete cascade,
  product product_slug not null,
  created_at timestamptz not null default now()
);

alter table pix_charges enable row level security;

-- Sem policy nenhuma: só o webhook (service_role) lê/escreve aqui. Cliente
-- autenticado não tem motivo pra acessar isso diretamente.
