-- 0010 tentou liberar o 1º capítulo/dia grátis com uma subquery correlacionada
-- na MESMA tabela dentro do USING (book_chapters -> book_chapters, lessons ->
-- lessons). Isso é autorreferência de RLS: pra decidir se uma linha é
-- visível, o Postgres precisa reavaliar a política da tabela de novo dentro
-- da subquery -- e estoura "infinite recursion detected in policy for
-- relation". getChapters()/getLessons()/getChapter()/getLessonByOrder() (lib/
-- calice.ts) não logavam `error`, só faziam `data ?? []`, então o erro ficou
-- mascarado como "lista vazia", indistinguível do bug original.
--
-- Fix: mover o cálculo do "primeiro item" pra dentro de função
-- security definer. Função security definer roda com o privilégio de quem
-- criou (o dono da tabela), e o dono de tabela é isento de RLS por padrão
-- (sem FORCE ROW LEVEL SECURITY) -- então a subquery lá dentro não reaciona
-- a política, sem recursão.

drop policy if exists "primeiro capítulo é prévia grátis pra autenticado" on book_chapters;
drop policy if exists "primeiro dia é prévia grátis pra autenticado" on lessons;
drop policy if exists "blocos do primeiro dia são prévia grátis pra autenticado" on lesson_blocks;

create or replace function public.calice_primeiro_capitulo(p_product product_slug)
returns int
language sql
security definer
set search_path = public
stable
as $$
  select min(order_index) from book_chapters where product = p_product
$$;

create or replace function public.calice_primeiro_dia(p_product product_slug)
returns int
language sql
security definer
set search_path = public
stable
as $$
  select min(order_index) from lessons where product = p_product
$$;

create or replace function public.calice_bloco_e_previa(p_lesson_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select l.order_index = public.calice_primeiro_dia(l.product)
  from lessons l
  where l.id = p_lesson_id
$$;

create policy "primeiro capítulo é prévia grátis pra autenticado"
  on book_chapters for select
  to authenticated
  using (order_index = public.calice_primeiro_capitulo(product));

create policy "primeiro dia é prévia grátis pra autenticado"
  on lessons for select
  to authenticated
  using (order_index = public.calice_primeiro_dia(product));

create policy "blocos do primeiro dia são prévia grátis pra autenticado"
  on lesson_blocks for select
  to authenticated
  using (public.calice_bloco_e_previa(lesson_id));
