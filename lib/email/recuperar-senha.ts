import "server-only";

// E-mail de "esqueci minha senha" — mesma API transacional do Brevo dos
// outros e-mails do app (ver lib/email/confirmacao-compra.ts), pra não
// depender do mailer padrão do Supabase (rate limit em produção). O link em
// si vem pronto de lib/auth/link-senha.ts (Admin API do Supabase).

// Domínio autenticado na Brevo (DKIM+DMARC, 06/08) — sender genérico
// (cross-produto, não assina como uma criadora específica).
const SENDER = { name: "Serena Mente Feliz", email: "contato@serenamentefeliz.com" };

function firstName(name: string | null | undefined) {
  const first = (name || "").trim().split(/\s+/)[0];
  if (!first) return null;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function html(nome: string | null, actionLink: string) {
  return `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;padding:24px;color:#2b1e42;line-height:1.6;font-size:15px;">
      <p>Oi${nome ? ", " + nome : ""}.</p>
      <p>Recebemos um pedido pra redefinir a senha da sua conta no Serena Mente Feliz.</p>
      <p style="text-align:center;margin:28px 0;">
        <a href="${actionLink}" style="background:#2b1e42;color:#f7efe3;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:bold;display:inline-block;">
          Criar nova senha
        </a>
      </p>
      <p>Se não foi você quem pediu, pode ignorar este e-mail — sua senha continua a mesma.</p>
      <p>Serena Mente Feliz</p>
    </div>
  `;
}

export async function enviarRecuperarSenha({
  email,
  name,
  actionLink,
}: {
  email: string;
  name: string | null;
  actionLink: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("enviarRecuperarSenha: BREVO_API_KEY ausente — não deu pra mandar o e-mail");
    return;
  }
  const nome = firstName(name);
  try {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email, name: nome || undefined }],
        subject: "Redefinir sua senha no Serena Mente Feliz",
        htmlContent: html(nome, actionLink),
      }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      console.error("enviarRecuperarSenha: Brevo falhou", resp.status, err);
    }
  } catch (err) {
    console.error("enviarRecuperarSenha: erro de rede", err);
  }
}
