import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const REDIRECT_TO = "https://serena-app-lac.vercel.app/auth/callback?next=/redefinir-senha";

// Gera o link de "criar/definir senha" direto pela Admin API do Supabase —
// não passa pelo mailer padrão do Supabase (o que está com rate limit em
// produção), o e-mail em si é disparado por quem chama isto, via Brevo.
//
// `criarSeNaoExistir: true` (webhook de compra) cria a conta na hora se
// ainda não existir (type "invite"); `false` (esqueci minha senha) só gera
// link pra quem já tem conta (type "recovery"), pra não criar conta pra
// quem nunca comprou nada.
export async function gerarLinkDeSenha({
  email,
  criarSeNaoExistir,
}: {
  email: string;
  criarSeNaoExistir: boolean;
}): Promise<string | null> {
  const admin = createAdminClient();

  if (criarSeNaoExistir) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: "invite",
      email,
      options: { redirectTo: REDIRECT_TO },
    });
    if (!error) return data.properties.action_link;
    if (!error.message.includes("already been registered")) {
      console.error("gerarLinkDeSenha: falha ao convidar", error);
      return null;
    }
    // Já tem conta (comprou de novo, ou já tinha vindo de outro fluxo) —
    // cai pro caminho de recovery abaixo.
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: REDIRECT_TO },
  });

  if (error) {
    // Só é esperado quando ninguém com esse e-mail tem conta ainda (fluxo
    // de "esqueci minha senha" chamado por quem nunca comprou) — quem chama
    // decide se isso vira silêncio (não vazar quem tem conta) ou log.
    return null;
  }

  return data.properties.action_link;
}
