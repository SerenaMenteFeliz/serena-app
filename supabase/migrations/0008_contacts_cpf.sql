-- CPF do contato: obrigatório pra criar cliente no Asaas (cobrança Pix) e
-- pra emitir nota fiscal depois. Nasce vazio pra quem só é lead (captura de
-- quiz/landing); preenchido no checkout, antes de gerar a cobrança.

alter table contacts add column if not exists cpf text;
