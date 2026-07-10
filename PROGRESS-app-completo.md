# PROGRESS — App completo (hub Serena Mente Feliz + Lar Interior + polish geral)

> Arquivo de continuidade: se a sessão do modelo terminar no meio, o próximo
> modelo retoma daqui. Atualizado a cada commit, não só no fim.
>
> Missão: deixar o app inteiro pronto — hub como casca "Serena Mente Feliz"
> com dois portais (Lar Interior + Método Cálice), Lar Interior no mesmo
> nível de acabamento do Cálice, e todas as telas transversais polidas.
> O Cálice ("Santuário + Véu", ver PROGRESS-metodo-calice.md) é a régua de
> qualidade, não a camisa de força.

## Estado encontrado (10/07/2026)

- Método Cálice: completo e polido (10 aulas + 13 capítulos no banco, todas
  as telas na linguagem de vidro, verificação visual feita em 09/07).
- **Lar Interior: stub absoluto** — `app/lar-interior/page.tsx` é um h1 + uma
  frase; ZERO conteúdo no banco (0 lessons, 0 chapters). A estrutura real
  existe no vault da família: 14 sessões = 7 temas × (teórica + prática),
  onboarding com escolha de ritmo (7 ou 14 dias), bônus definidos
  (Meditação p/ Dormir, Rastreador PDF, Carta do Dia 14 — nada gravado ainda).
- Hub: lista `<ul>` crua de links. Perfil: já redesenhado (vidro, stats do
  Cálice). Logins: Cálice novo, Lar/genérico ainda no "portal" antigo.
- Schema já é multi-produto (`lessons.product`, enum tem `lar_interior`) —
  dá pra popular o Lar Interior **sem migration nova** (dado, não DDL).

## Decisões de design tomadas

1. **Identidades**: hub = "clareira" (teal/água, serena, marca-mãe);
   Lar Interior = "amanhecer" (creme/dourado, sol nascendo no arco — evolui o
   glow-orb do portal antigo pra dentro da linguagem de vidro); Cálice segue
   como está. Casca comum (veil-bg + glass + nav flutuante), personalidade
   própria por paleta/tipografia/objeto-símbolo (livro / sol / clareira).
2. **Tipografia**: Cálice mantém Cormorant+Jost+Manrope. Lar Interior ganha
   Lora (serif quente, voz da Liz) + Manrope. Hub ganha Fraunces (serif
   acolhedora) + Manrope. Carregadas por layout de rota, como o Cálice.
3. **Ritmo 7/14 dias sem migration**: preferência gravada como evento em
   `product_events` (`pace_chosen`, payload `{pace}`) — event-sourced, o app
   lê o último evento. Zero DDL, trocável a qualquer momento.
4. **Desbloqueio das sessões**: sequencial (N exige N-1 concluída) + trava
   diária pelo ritmo (14 dias → 1 sessão/dia; 7 dias → 2/dia, o par do tema).
   Datas no fuso America/Sao_Paulo via completed_at do lesson_progress.
5. **Conteúdo semeado**: 14 lessons reais (títulos/temas do vault) com bloco
   de texto de boas-vindas por sessão (derivado da técnica real de cada dia,
   sem inventar doutrina). Vídeos ainda não gravados → player mostra estado
   "em gravação com a Liz" e o bloco de vídeo entra depois sem mudar código.
6. **Carta do Dia 14**: mecanismo pronto (só aparece ao concluir a sessão 14),
   mas o texto é da Liz — componente só renderiza quando o conteúdo existir.

## Plano

1. [ ] Seed do Lar Interior (scripts/seed-lar-interior.mjs, rodado) +
       `lib/lar.ts` (sessões, ritmo event-sourced, desbloqueio diário) — commit
2. [ ] Base visual Lar: paleta amanhecer + fontes + LarShell/LarNav/LarSun +
       onboarding `/lar-interior/comecar` + home nova — commit
3. [ ] Sessões: lista por tema (estados claros) + player com conclusão — commit
4. [ ] Bônus: tela + mecanismo da Carta do Dia 14 — commit
5. [ ] Hub Serena Mente Feliz: dois portais com progresso real + fontes — commit
6. [ ] Transversais: perfil multi-produto, logins (genérico + lar), sem-acesso,
       404, loading states — commit
7. [ ] PWA: manifest + ícones + theme-color — commit
8. [ ] Verificação: build limpo + screenshots Playwright 390×844 de tudo — commit

## Feito

- (nada ainda — plano commitado primeiro)

## Pendências que dependem do Yan/Liz/Ge

- Migration `0006_book_notes.sql` continua pendente (senha do banco) — recurso
  de Notas do Cálice segue oculto até lá. Nenhuma migration NOVA foi criada.
- Liz: gravar as 14 sessões + Meditação p/ Dormir; escrever a Carta do Dia 14;
  PDF do Rastreador. Ge: áudios dias 3/5/9 + vídeo dia 7 do Cálice.
