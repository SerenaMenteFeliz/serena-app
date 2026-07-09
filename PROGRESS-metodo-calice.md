# PROGRESS — Redesign Método Cálice ("Santuário + Véu")

> Arquivo de continuidade: se a sessão do modelo terminar no meio, o próximo
> modelo retoma daqui. Atualizado a cada commit, não só no fim.
>
> Referências de design (inspiração, não spec): `C:\Users\Yan\Desktop\Método Cálice.html`
> (protótipo clicável) e `C:\Users\Yan\Desktop\Visual Directions.pdf`.
> Direção: vidro fosco (backdrop-blur) sobre véu creme→lilás→creme-dourado,
> tipografia Cormorant Garamond (serif) + Jost (labels) + Manrope (UI),
> dourado #D9A854 + roxo profundo #2B1E42 como contraste pontual.

## Plano

1. [ ] Base visual: tokens novos em `.theme-metodo-calice`, fontes via next/font,
       classes de vidro (`veil-bg`, `glass-card`, `glass-nav`, `veil-arch`) — commit 1
2. [ ] `CaliceShell` + nav flutuante de vidro + Home redesenhada (hero arco com
       livro flutuante, ícones circulares, card escuro "Pensamento do dia") — commit 2
3. [ ] Livro: lista de capítulos (dots de status) + leitor (painel de vidro,
       drop cap, botões explícitos de página) — commit 3
4. [ ] Aulas: lista (Dia N — título, estados) + player (CTA escuro arredondado) — commit 4
5. [ ] Notas por capítulo: migration `0006_book_notes.sql` + lib + UI
       (feature liga sozinha quando a migration for aplicada) — commit 5
6. [ ] Perfil (stats por produto, linguagem de vidro) + login do Cálice — commit 6
7. [ ] Verificação: build + screenshots mobile (Playwright 390×844, usuário de
       teste `preview-serena-app@example.com` via scripts/seed-test-user.mjs) — commit 7

## Feito

- **Commit 1** — base visual: tokens novos em `.theme-metodo-calice` (+ tokens
  de vidro nos 3 temas), fontes Cormorant/Jost/Manrope em `lib/fonts/calice.ts`
  + `app/metodo-calice/layout.tsx`, classes `veil-bg`/`glass-card`/`glass-orb`/
  `glass-nav`/`veil-arch`/`float-slow`/`book-drop-cap` no globals.css.
- **Commit 2** — `CaliceShell` + `CaliceNav` (nav flutuante de vidro, client
  só pro estado ativo) + ícones SVG próprios + Home nova: saudação com nome
  (contacts.nome via `getContactFirstName`), hero em arco com livro flutuante
  (leva pro próximo capítulo), fileira de categorias, card "Sua prática de
  hoje" (próxima aula destravada) e "Pensamento do dia" (rodízio diário em
  `lib/calice-daily.ts`, relógio de Brasília).
- **Commit 3** — livro: lista com dots de status (lido dourado / atual lilás
  em negrito) + card escuro "Marcador de página"; leitor com header próprio
  (voltar + Capítulo N), título serif itálico fixo fora da página, página de
  vidro, capitular dourada e controles explícitos anterior/próxima (o arrasto
  continua, mas deixou de ser o único caminho — fix de affordance).
- **Commit 4** — aulas: lista com estados claros (concluída dourada, dia atual
  "hoje" em destaque, bloqueadas com cadeado e sem link), player com header
  próprio, blocos em vidro (LessonBlockRenderer) e, após concluir, chip
  dourado + atalho "Ir pro Dia N+1".
- **Commit 5** — Notas por capítulo: migration `0006_book_notes.sql` (uma nota
  por capítulo/pessoa, RLS via contacts.auth_user_id), `lib/calice-notes.ts`
  com feature-flag automático (recurso oculto até a migration ser aplicada;
  liga sozinho depois), painel recolhível no leitor (`ChapterNote`, corpo
  vazio apaga), página `/metodo-calice/notas` (marcador + lista + remover) e
  orb "Notas" na home quando ativo.
- **Commit 6** — perfil do guarda-chuva redesenhado (avatar-inicial, stats
  reais do Cálice, produtos ativos, "Sair da conta" via server action nova em
  `lib/actions/auth.ts`) + login do Cálice com véu/arco/livro flutuante
  (`CaliceBook` extraído pra reuso) + LoginForm em vidro.

## Pendências que dependem do Yan

- **Aplicar a migration `supabase/migrations/0006_book_notes.sql`** quando ela
  existir (commit 5) — não há senha do banco no `.env.local`, só service role
  (REST não roda DDL). Comando: `node scripts/run-migration.mjs supabase/migrations/0006_book_notes.sql <SENHA_DB>`.
  Até lá o app funciona normal, o recurso de Notas só fica oculto.

## Decisões tomadas

- Notas ancoradas **por capítulo** (não por página): a paginação real é fluida
  (CSS multi-coluna, muda com o tamanho da tela), então "página 3" não é um
  endereço estável — capítulo é.
- Tokens de vidro (`--glass`, `--veil-*`, `--shadow-tint`) definidos nos 3 temas
  (calice, lar-interior, hub), pra linguagem poder ser adotada pelos outros
  produtos sem retrabalho. Nada visual muda no Lar Interior/hub por enquanto.
- Fontes do Cálice carregadas só no layout do produto (`app/metodo-calice/layout.tsx`
  + página de login dele) — não pesam nos outros produtos.
