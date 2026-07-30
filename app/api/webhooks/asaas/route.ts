import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductSlug } from "@/lib/access";

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
  const externalReference: string | undefined = body?.payment?.externalReference;

  if (!event || !GRANTING_EVENTS.has(event) || !externalReference) {
    // Outros eventos (PAYMENT_CREATED, PAYMENT_OVERDUE, PAYMENT_DELETED...)
    // não fazem nada aqui — respondemos 200 pra não gerar retry do Asaas.
    return NextResponse.json({ ok: true });
  }

  const [contactId, product] = externalReference.split(":") as [string, ProductSlug];
  if (!contactId || !product) {
    console.error("webhook Asaas: externalReference sem o formato esperado", externalReference);
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();
  // upsert é o que torna isso idempotente — reenvio do mesmo evento (comum
  // no Asaas) não duplica nem quebra, só regrava o mesmo estado "active".
  const { error } = await admin
    .from("product_access")
    .upsert({ contact_id: contactId, product, status: "active" }, { onConflict: "contact_id,product" });

  if (error) {
    console.error("webhook Asaas: falha ao liberar acesso", error);
    return NextResponse.json({ error: "falha ao liberar acesso" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
