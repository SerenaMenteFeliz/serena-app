-- Supabase habilita RLS por padrão em toda tabela nova, mesmo sem pedir
-- explicitamente — sem nenhuma policy, a tabela fica bloqueada pra todo
-- mundo (só service_role, que sempre ignora RLS, enxergava). Faltou dar essa
-- policy quando a tabela foi criada em 0002. O conteúdo da regra não é
-- sensível (não é dado de usuário), então leitura liberada pra autenticados.
create policy "regra de conclusão é pública pra autenticados"
  on product_completion_rules for select
  to authenticated
  using (true);
