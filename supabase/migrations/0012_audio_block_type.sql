-- Áudio como formato de bloco de aula. O produto é vendido como
-- "reprogramação mental" e o Lar Interior como meditação guiada, mas até
-- 08/08/2026 os 70 blocos existentes eram todos `text` e o enum nem tinha a
-- opção — o app não conseguia receber uma gravação nem que ela existisse.
--
-- Serve os dois produtos: Cálice e Lar Interior compartilham `lessons` /
-- `lesson_blocks`, separados só pelo `product`.
--
-- content esperado: {"url": "...", "title": "...", "subtitle": "..."}
--
-- ATENÇÃO ao rodar: `alter type ... add value` não roda dentro de bloco de
-- transação em Postgres. No SQL Editor do Supabase, executar esta linha
-- sozinha (selecionar só ela e rodar) se der erro de transação.

alter type calice_block_type add value if not exists 'audio';
