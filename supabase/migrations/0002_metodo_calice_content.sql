-- Conteúdo do Método Cálice: livro (capítulos sequenciais) + aulas práticas
-- (blocos mistos de texto/vídeo/imagem). Progresso rastreado por pessoa,
-- pra alimentar o critério de "completou o produto" (product_completion_rules)
-- sem precisar hardcodar a regra no código do app.

create type calice_block_type as enum ('text', 'video', 'image');

create table if not exists book_chapters (
  id uuid primary key default gen_random_uuid(),
  product product_slug not null,
  order_index int not null,
  title text not null,
  body_md text not null,
  unique (product, order_index)
);

create table if not exists book_progress (
  contact_id uuid not null references contacts (id) on delete cascade,
  product product_slug not null,
  last_chapter_order int not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (contact_id, product)
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  product product_slug not null,
  order_index int not null,
  title text not null,
  unique (product, order_index)
);

create table if not exists lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  order_index int not null,
  block_type calice_block_type not null,
  -- text: {"markdown": "..."} · video: {"youtube_id": "..."} · image: {"url": "...", "alt": "..."}
  content jsonb not null,
  unique (lesson_id, order_index)
);

create table if not exists lesson_progress (
  contact_id uuid not null references contacts (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (contact_id, lesson_id)
);

-- Critério de "completou o produto", editável sem redeploy. Uma linha por
-- produto. `rule` é interpretado pelo app (lib/completion.ts) — formato
-- inicial: {"require_book": bool, "require_lessons": "all" | "none" | number}
create table if not exists product_completion_rules (
  product product_slug primary key,
  rule jsonb not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into product_completion_rules (product, rule) values
  ('metodo_calice', '{"require_book": true, "require_lessons": "all"}')
on conflict (product) do nothing;

-- Log append-only de eventos de progresso — base pra outros gatilhos futuros
-- (notificação, lembrete, e-mail) sem precisar remodelar as tabelas de novo.
create table if not exists product_events (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts (id) on delete cascade,
  product product_slug not null,
  event_type text not null, -- ex: 'chapter_read', 'lesson_completed', 'product_completed'
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table book_chapters enable row level security;
alter table book_progress enable row level security;
alter table lessons enable row level security;
alter table lesson_blocks enable row level security;
alter table lesson_progress enable row level security;
alter table product_events enable row level security;

-- Conteúdo (capítulos/aulas/blocos) só é visível pra quem tem o produto ativo
-- — defesa em profundidade, além da checagem já feita nas pages (requireProductAccess).
create policy "conteúdo do livro visível pra quem comprou"
  on book_chapters for select
  using (exists (
    select 1 from product_access
    where product_access.contact_id = auth.uid()
      and product_access.product = book_chapters.product
      and product_access.status = 'active'
  ));

create policy "aulas visíveis pra quem comprou"
  on lessons for select
  using (exists (
    select 1 from product_access
    where product_access.contact_id = auth.uid()
      and product_access.product = lessons.product
      and product_access.status = 'active'
  ));

create policy "blocos de aula visíveis pra quem comprou"
  on lesson_blocks for select
  using (exists (
    select 1 from lessons
    join product_access on product_access.product = lessons.product
    where lessons.id = lesson_blocks.lesson_id
      and product_access.contact_id = auth.uid()
      and product_access.status = 'active'
  ));

create policy "contato vê e edita o próprio progresso de leitura"
  on book_progress for all
  using (auth.uid() = contact_id)
  with check (auth.uid() = contact_id);

create policy "contato vê e edita o próprio progresso de aula"
  on lesson_progress for all
  using (auth.uid() = contact_id)
  with check (auth.uid() = contact_id);

create policy "contato vê os próprios eventos"
  on product_events for select
  using (auth.uid() = contact_id);
