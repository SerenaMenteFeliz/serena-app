-- A prévia grátis do Método Cálice (1º capítulo do livro + 1º dia de
-- prática, decisão de 01/08) foi implementada no app (metodo-calice/page.tsx,
-- livro/[order]/page.tsx, aulas/[order]/page.tsx), mas as policies de RLS
-- de book_chapters/lessons/lesson_blocks (0002, reescritas em 0004) só
-- liberam select pra quem já tem product_access ativo. getChapters()/
-- getLessons()/getChapter()/getLessonByOrder() rodam com o client
-- RLS-scoped do usuário, então pra um lead sem compra a query voltava []
-- pra TUDO — inclusive o item que deveria ser público. Resultado: a tela de
-- prévia aparecia sem nenhum capítulo/aula listado, e o link direto pro
-- capítulo 1 caía em notFound() (getChapter retornava null).
--
-- Policies permissivas no Postgres se somam com OR — isso não substitui as
-- de 0002/0004, só abre uma exceção adicional pro primeiro item de cada
-- produto, pra qualquer autenticado (a página já exige login via
-- requireAuth antes de chegar aqui).

create policy "primeiro capítulo é prévia grátis pra autenticado"
  on book_chapters for select
  to authenticated
  using (
    order_index = (
      select min(bc2.order_index) from book_chapters bc2 where bc2.product = book_chapters.product
    )
  );

create policy "primeiro dia é prévia grátis pra autenticado"
  on lessons for select
  to authenticated
  using (
    order_index = (
      select min(l2.order_index) from lessons l2 where l2.product = lessons.product
    )
  );

create policy "blocos do primeiro dia são prévia grátis pra autenticado"
  on lesson_blocks for select
  to authenticated
  using (
    exists (
      select 1 from lessons l
      where l.id = lesson_blocks.lesson_id
        and l.order_index = (
          select min(l2.order_index) from lessons l2 where l2.product = l.product
        )
    )
  );
