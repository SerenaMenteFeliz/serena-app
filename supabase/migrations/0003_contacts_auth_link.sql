-- `contacts` é criado na captura de lead (antes de qualquer login) — id
-- próprio, sem relação com auth.users. Quando a pessoa loga no app pela
-- primeira vez (magic link), precisamos ligar o contato existente (mesmo
-- e-mail) ao auth.uid() dela. Sem isso, toda política de RLS que compara
-- contact_id = auth.uid() diretamente está incorreta (nunca bate).

alter table contacts add column if not exists auth_user_id uuid unique references auth.users (id) on delete set null;

alter table contacts enable row level security;

create policy "contato vê o próprio registro"
  on contacts for select
  using (auth.uid() = auth_user_id);

-- Não existe policy de update/insert pro client: a "reivindicação" do contato
-- pré-existente por e-mail (auth_user_id ainda nulo) é feita só pelo server
-- com service_role (ver lib/access.ts -> ensureContactLink), nunca pelo
-- client autenticado — evita qualquer brecha de um usuário tentando se
-- apropriar do contato/compras de outra pessoa via update direto.
