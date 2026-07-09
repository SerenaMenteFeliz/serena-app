-- Anotações pessoais no livro (recurso "Notas" da direção Santuário + Véu,
-- 09/07/2026). Uma nota por capítulo por pessoa: a paginação do leitor é
-- fluida (CSS multi-coluna, muda com o tamanho da tela), então "página 3"
-- não é um endereço estável — capítulo é.
--
-- Aplicar com: node scripts/run-migration.mjs supabase/migrations/0006_book_notes.sql <SENHA_DB>
-- Enquanto não for aplicada, o app esconde o recurso sozinho (lib/calice-notes.ts).

create table if not exists book_notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts (id) on delete cascade,
  product product_slug not null,
  chapter_order int not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contact_id, product, chapter_order)
);

alter table book_notes enable row level security;

-- Mesmo padrão do 0004: o vínculo é contacts.auth_user_id = auth.uid(),
-- nunca contact_id = auth.uid() direto.
create policy "contato vê e edita as próprias notas"
  on book_notes for all
  using (exists (
    select 1 from contacts
    where contacts.id = book_notes.contact_id
      and contacts.auth_user_id = auth.uid()
  ))
  with check (exists (
    select 1 from contacts
    where contacts.id = book_notes.contact_id
      and contacts.auth_user_id = auth.uid()
  ));
