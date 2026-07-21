-- Reorganização técnica (20/07): fecha a dívida de nomenclatura mista pt/en
-- no schema e a inconsistência do campo `source` em lead_events.
--
-- 1. contacts.nome -> contacts.name (só nomenclatura, sem mudança de tipo/uso)
--    -- afeta app/perfil/page.tsx e lib/access.ts, já atualizados.
-- 2. lead_events.source deixa de ser escrito à mão e vira 3 colunas reais
--    (event_type/offer/product) + uma coluna gerada (source) só de leitura,
--    concatenando as 3 -- nunca mais grava direto em source.
--    Tabela tinha 0 linhas no momento da migration -- sem necessidade de
--    backfill de dado real.
--
-- Aplicar com: node scripts/run-migration.mjs supabase/migrations/0007_rename_nome_and_normalize_lead_events.sql <SENHA_DB>
-- Mesma alteração de schema também documentada em larinterior-site e
-- metodocalice-site (schema é compartilhado entre os 3 repos, aplicação
-- real é 1 só, contra o mesmo Postgres).

alter table contacts
  rename column nome to name;

alter table lead_events
  drop column source;

alter table lead_events
  add column event_type text not null;

alter table lead_events
  add column offer text not null;

alter table lead_events
  add column product text not null;

alter table lead_events
  add column source text generated always as (event_type || '-' || offer || '-' || product) stored;
