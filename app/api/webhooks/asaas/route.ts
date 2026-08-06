import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { captureServer } from "@/lib/analytics/server";
import { enviarConfirmacaoCompra } from "@/lib/email/confirmacao-compra";
import { gerarLinkDeSenha } from "@/lib/auth/link-senha";

// Eventos que liberam acesso. PAYMENT_RECEIVED cobre casos em que o dinheiro
// já caiu mas o Asaas ainda não "confirmou" formalmente — mais seguro pegar
// os dois do que perder um lançamento por causa de ordem de eventos.
const GRANTING_EVENTS = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);

export async function POST(request: Request) {
  // Header enviado pelo Asaas em toda notificação, configurado como
  // `authToken` na criação do webhook — confirma que a chamada é legítima.
  const token = request.headers.get("asaas-access-token");
  if (!token || token !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "token inválido" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const event: string | undefined = body?.event;
  // Checkout usa QR Code Pix estático (sem cliente/CPF cadastrado) — o
  // Asaas cria a cobrança sozinho quando alguém paga, e o único jeito
  // confiável de saber qual QR foi pago é este campo (ver lib/asaas.ts e
  // migration 0009_pix_charges.sql).
  const pixQrCodeId: string | undefined = body?.payment?.pixQrCodeId;

  if (!event || !GRANTING_EVENTS.has(event) || !pixQrCodeId) {
    // Outros eventos (PAYMENT_CREATED, PAYMENT_OVERDUE, PAYMENT_DELETED...)
    // ou cobranças fora do fluxo do QR estático não fazem nada aqui —
    // respondemos 200 pra não gerar retry do Asaas.
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();

  const { data: charge, error: chargeError } = await admin
    .from("pix_charges")
    .select("contact_id, product")
    .eq("id", pixQrCodeId)
    .maybeSingle();

  if (chargeError || !charge) {
    console.error("webhook Asaas: pixQrCodeId sem cobrança registrada", pixQrCodeId, chargeError);
    return NextResponse.json({ ok: true });
  }

  // Confere se já estava ativo ANTES do upsert — o Asaas reenvia o mesmo
  // evento com frequência, e sem essa checagem cada reenvio contaria como
  // uma nova venda na PostHog (upsert é idempotente pro Supabase, mas não
  // pro capture() se disparasse toda vez).
  const { data: existing } = await admin
    .from("product_access")
    .select("status")
    .eq("contact_id", charge.contact_id)
    .eq("product", charge.product)
    .maybeSingle();
  const wasAlreadyActive = existing?.status === "active";

  // upsert é o que torna isso idempotente — reenvio do mesmo evento (comum
  // no Asaas) não duplica nem quebra, só regrava o mesmo estado "active".
  const { error } = await admin
    .from("product_access")
    .upsert(
      { contact_id: charge.contact_id, product: charge.product, status: "active" },
      { onConflict: "contact_id,product" }
    );

  if (error) {
    console.error("webhook Asaas: falha ao liberar acesso", error);
    return NextResponse.json({ error: "falha ao liberar acesso" }, { status: 500 });
  }

  if (!wasAlreadyActive) {
    // Ground truth de conversão — fecha o funil (quiz → lead → purchase) no
    // mesmo distinct_id (contactId) usado em todo o resto do app. Só na
    // primeira vez que este produto vira "active" pra este contact.
    await captureServer(charge.contact_id, "purchase", { product: charge.product });

    // Confirmação de compra por e-mail — antes de 01/08 esse passo não
    // existia, quem pagava não recebia nenhum aviso (achado real, revisão
    // do Yan). Só Método Cálice por enquanto (decisão do Yan, 01/08); Lar
    // Interior fica pra uma sessão futura. Best-effort: nunca bloqueia a
    // resposta do webhook nem desfaz o acesso já liberado.
    if (charge.product === "metodo_calice") {
      const { data: contact } = await admin
        .from("contacts")
        .select("email, name")
        .eq("id", charge.contact_id)
        .maybeSingle();
      if (contact?.email) {
        // Cria a conta (ou reaproveita, se já existir) e manda o link de
        // criar senha junto com a confirmação — sem link mágico, é assim
        // que a pessoa entra pela primeira vez. Best-effort: nunca bloqueia
        // a resposta do webhook nem desfaz o acesso já liberado.
        const actionLink = await gerarLinkDeSenha({ email: contact.email, criarSeNaoExistir: true });
        await enviarConfirmacaoCompra({ email: contact.email, name: contact.name, actionLink });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
