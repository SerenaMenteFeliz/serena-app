import "server-only";

// E-mail de confirmação de compra — antes de 01/08 esse gap era total: o
// webhook do Asaas liberava o acesso em silêncio, ninguém avisava a pessoa
// que pagou. Dispara na hora (chamado direto do webhook, não por cron —
// isso é evento, não agenda), com onboarding curto do que fazer primeiro.
//
// Reaproveita a mesma API transacional do Brevo que o metodocalice-site já
// usa pra nutrição — precisa da env var BREVO_API_KEY setada no projeto
// serena-app na Vercel (mesma chave que já existe no projeto
// metodocalice-site, só falta copiar pra cá).
//
// Best-effort: falha aqui nunca pode derrubar o webhook (o acesso já foi
// liberado antes disso rodar) — só loga e segue.

const SENDER = { name: "Método Cálice", email: "serenamentefelizoficial@gmail.com" };
const ENTRAR_URL = "https://serena-app-lac.vercel.app/metodo-calice/entrar";

function firstName(name: string | null | undefined) {
  const first = (name || "").trim().split(/\s+/)[0];
  if (!first) return null;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function html(nome: string | null) {
  return `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;padding:24px;color:#2b1e42;line-height:1.6;font-size:15px;">
      <p>Oi${nome ? ", " + nome : ""}.</p>
      <p><strong>Seu pagamento foi confirmado</strong> e o Método Cálice já está liberado no seu acesso.</p>
      <p>Pra entrar, é só usar este e-mail na tela de login (mandamos um link, sem senha pra decorar):</p>
      <p style="text-align:center;margin:28px 0;">
        <a href="${ENTRAR_URL}" style="background:#2b1e42;color:#f7efe3;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:bold;display:inline-block;">
          Entrar no Método Cálice
        </a>
      </p>
      <p>Por dentro do app você encontra:</p>
      <p><strong>O Livro</strong>, com 13 capítulos, e <strong>os 10 Dias de Prática Guiada</strong>, um dia de cada vez.</p>
      <p>Seu progresso fica salvo sozinho, no seu ritmo, sem prazo de validade.</p>
      <p>Qualquer dúvida, é só responder este e-mail.</p>
      <p>Geovana &middot; Método Cálice</p>
    </div>
  `;
}

export async function enviarConfirmacaoCompra({ email, name }: { email: string; name: string | null }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("enviarConfirmacaoCompra: BREVO_API_KEY ausente — pulando (acesso já liberado)");
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
        subject: nome ? `${nome}, seu Método Cálice está liberado` : "Seu Método Cálice está liberado",
        htmlContent: html(nome),
      }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      console.error("enviarConfirmacaoCompra: Brevo falhou", resp.status, err);
    }
  } catch (err) {
    console.error("enviarConfirmacaoCompra: erro de rede", err);
  }
}
