# Melhorias 12/07 — 8 itens (pós-pesquisa de mercado)

Segunda passada sobre o app completo. Pagamento (Asaas) ficou **fora de propósito** — prompt separado. Nada em `product_access` foi escrito (só leitura).

## O que entrou

1. **Error boundaries** — `app/error.tsx` (tema hub), `app/lar-interior/error.tsx`, `app/metodo-calice/error.tsx` (via `components/ErrorVeil.tsx`) + `app/global-error.tsx` autocontido (inline styles, sobrevive a falha do root layout). Next 16.2: prop de retry é `unstable_retry`.
2. **Cross-sell no hub** — `getCompletedProducts()` novo em `lib/access.ts` (leitura de `completed_at`); banner escuro no hub sugere o outro produto (CTA se liberado, convite se não). Evento `cross_sell_viewed`.
3. **PostHog** — `posthog-js` (client: `components/analytics/PostHogProvider.tsx` no root layout, pageviews SPA automáticos, autocapture off + inputs mascarados por ser app de saúde mental) + `posthog-node` (server: `lib/analytics/server.ts`, ground truth de conclusões). `components/analytics/Track.tsx` pra eventos de tela em server components, identify por `contactId` nos dois lados. **No-op sem `NEXT_PUBLIC_POSTHOG_KEY`** — adicionar a env var no `.env.local` e na Vercel pra ligar (host default us.i.posthog.com, `NEXT_PUBLIC_POSTHOG_HOST` opcional). Eventos: `login` (1x/sessão de navegador), `lar_session_started/completed`, `calice_chapter_opened`, `calice_lesson_started/completed`, `product_completed`, `cross_sell_viewed`, `share_card_viewed/shared`, `lar_checkin`, `app_error_boundary`.
4. **Constância** — `lib/constancia.ts` deriva dias ativos de `lesson_progress` + eventos `chapter_read` (zero migration, fuso SP). Sem pontos/níveis/badge (decisão de produto); nunca mostra "0 dias" — sequência ≥2 mostra sequência, senão total acumulado, 0-1 dias não mostra nada. Pill no hub e nas duas homes.
5. **Diário do Lar** — reusa a tabela `book_notes` com `product='lar_interior'` (enum já cobria — **zero migration nova**). `calice-notes.ts` generalizado (`NotesProduct`), action `guardarReflexao` em `lib/actions/lar.ts`, `components/lar/SessionReflection.tsx` na sessão vivida. **Gated pela migration 0006** (mesma das notas do Cálice): fica oculto até ela ser aplicada, liga sozinho.
6. **SOS Ansiedade** — pill flutuante fixa na home do Lar (terracota, acima da nav) → `/lar-interior/bonus#sos` (âncora com scroll-margin).
7. **Check-in de humor** — `components/lar/CheckinDia.tsx` substitui o card estático de intenção na home do Lar. 4 estados (leve/animada/cansada/ansiosa) → intenção do pool do humor (voz da Liz). localStorage por dia (humor não vai pro banco de propósito), fallback = rodízio por data. Hidratação via `useSyncExternalStore`.
8. **Card compartilhável** — `/lar-interior/celebracao` e `/metodo-calice/celebracao` (guardadas: sem completar → redirect). Copy em 1ª pessoa (é a pessoa postando no story), stats por produto, `components/ShareActions.tsx` (Web Share nativo ou copiar + dica de print). Entradas: home dos dois produtos + última sessão do Lar.

## Verificação (dado real, screenshots em `screenshots-melhorias/`)

- Build de produção limpo (TypeScript ok) + ESLint zero warnings.
- `scripts/verify-melhorias.mjs`: monta estados reais no banco (jornada completa, Cálice com `completed_at`, progresso espalhado em dias) e fotografa as 10 telas logado, viewport 390×844.
- Conferido na tela: cross-sell + constância no hub; check-in pergunta→resposta→**persistência pós-reload** (3 asserts true no build final); SOS visível sem cobrir a nav (artefato de fullPage descartado com shot de viewport); celebrações com copy corrigida (1ª pessoa; stats sem mistura de produto); error boundaries dos 3 temas (rotas de teste temporárias, deletadas depois).

## Não verificado ainda (honesto)

- Captura PostHog de ponta a ponta — **sem chave no ambiente**, o código roda como no-op. Ligar = criar projeto no PostHog e setar a env var.
- Web Share em celular real (verificado só o fallback de copiar no Chromium desktop).
- Diário do Lar na tela — oculto até a migration 0006 (comportamento correto verificado: página da sessão vivida renderiza sem o campo e sem erro).
