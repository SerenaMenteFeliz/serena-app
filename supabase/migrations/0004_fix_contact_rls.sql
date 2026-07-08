-- Corrige as policies de 0001/0002: todas comparavam `contact_id = auth.uid()`
-- diretamente, mas contact_id referencia contacts.id (criado na captura do
-- lead, antes de qualquer login) — nunca é igual ao auth.uid() da pessoa.
-- O vínculo correto é contacts.auth_user_id = auth.uid() (ver 0003).

drop policy if exists "contato vê o próprio acesso" on product_access;
create policy "contato vê o próprio acesso"
  on product_access for select
  using (exists (
    select 1 from contacts
    where contacts.id = product_access.contact_id
      and contacts.auth_user_id = auth.uid()
  ));

drop policy if exists "contato vê e edita o próprio progresso de leitura" on book_progress;
create policy "contato vê e edita o próprio progresso de leitura"
  on book_progress for all
  using (exists (
    select 1 from contacts
    where contacts.id = book_progress.contact_id
      and contacts.auth_user_id = auth.uid()
  ))
  with check (exists (
    select 1 from contacts
    where contacts.id = book_progress.contact_id
      and contacts.auth_user_id = auth.uid()
  ));

drop policy if exists "contato vê e edita o próprio progresso de aula" on lesson_progress;
create policy "contato vê e edita o próprio progresso de aula"
  on lesson_progress for all
  using (exists (
    select 1 from contacts
    where contacts.id = lesson_progress.contact_id
      and contacts.auth_user_id = auth.uid()
  ))
  with check (exists (
    select 1 from contacts
    where contacts.id = lesson_progress.contact_id
      and contacts.auth_user_id = auth.uid()
  ));

drop policy if exists "contato vê os próprios eventos" on product_events;
create policy "contato vê os próprios eventos"
  on product_events for select
  using (exists (
    select 1 from contacts
    where contacts.id = product_events.contact_id
      and contacts.auth_user_id = auth.uid()
  ));

drop policy if exists "conteúdo do livro visível pra quem comprou" on book_chapters;
create policy "conteúdo do livro visível pra quem comprou"
  on book_chapters for select
  using (exists (
    select 1 from product_access
    join contacts on contacts.id = product_access.contact_id
    where contacts.auth_user_id = auth.uid()
      and product_access.product = book_chapters.product
      and product_access.status = 'active'
  ));

drop policy if exists "aulas visíveis pra quem comprou" on lessons;
create policy "aulas visíveis pra quem comprou"
  on lessons for select
  using (exists (
    select 1 from product_access
    join contacts on contacts.id = product_access.contact_id
    where contacts.auth_user_id = auth.uid()
      and product_access.product = lessons.product
      and product_access.status = 'active'
  ));

drop policy if exists "blocos de aula visíveis pra quem comprou" on lesson_blocks;
create policy "blocos de aula visíveis pra quem comprou"
  on lesson_blocks for select
  using (exists (
    select 1 from lessons
    join product_access on product_access.product = lessons.product
    join contacts on contacts.id = product_access.contact_id
    where lessons.id = lesson_blocks.lesson_id
      and contacts.auth_user_id = auth.uid()
      and product_access.status = 'active'
  ));
