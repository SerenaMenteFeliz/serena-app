import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { gerarLinkDeSenha } from "@/lib/auth/link-senha";
import { enviarRecuperarSenha } from "@/lib/email/recuperar-senha";

// Chamado pelo LoginForm (modo "recuperar") no lugar do
// supabase.auth.resetPasswordForEmail direto — aquele dependia do mailer
// padrão do Supabase (rate limit). Aqui o link é gerado pela Admin API e o
// e-mail sai pelo Brevo, igual ao resto do app.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;

  if (!email) {
    return NextResponse.json({ error: "e-mail inválido" }, { status: 400 });
  }

  const actionLink = await gerarLinkDeSenha({ email, criarSeNaoExistir: false });

  // Sem conta com esse e-mail: responde sucesso igual, pra não vazar quais
  // e-mails têm conta no sistema.
  if (actionLink) {
    const admin = createAdminClient();
    const { data: contact } = await admin.from("contacts").select("name").eq("email", email).maybeSingle();
    await enviarRecuperarSenha({ email, name: contact?.name ?? null, actionLink });
  }

  return NextResponse.json({ ok: true });
}
