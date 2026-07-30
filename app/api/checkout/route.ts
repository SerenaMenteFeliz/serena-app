import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findOrCreateCustomer, createPixPayment, getPixQrCode } from "@/lib/asaas";
import { PRODUCT_PRICE } from "@/lib/pricing";
import type { ProductSlug } from "@/lib/access";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const product = body?.product as ProductSlug | undefined;
  const name = (body?.name as string | undefined)?.trim();
  const email = (body?.email as string | undefined)?.trim().toLowerCase();
  const cpfCnpj = (body?.cpfCnpj as string | undefined)?.trim();

  if (!product || !PRODUCT_PRICE[product]) {
    return NextResponse.json({ error: "produto inválido" }, { status: 400 });
  }
  if (!name || !email || !cpfCnpj) {
    return NextResponse.json({ error: "nome, e-mail e CPF são obrigatórios" }, { status: 400 });
  }

  const admin = createAdminClient();

  // contact pode já existir (veio do quiz/captura de lead) — reaproveita o
  // mesmo id, senão essa compra vira um contact novo desde já.
  const { data: existing } = await admin.from("contacts").select("id").eq("email", email).maybeSingle();

  let contactId = existing?.id as string | undefined;

  if (contactId) {
    await admin.from("contacts").update({ name, cpf: cpfCnpj }).eq("id", contactId);
  } else {
    const { data: created, error } = await admin
      .from("contacts")
      .insert({ email, name, cpf: cpfCnpj })
      .select("id")
      .single();
    if (error || !created) {
      console.error("checkout: falha ao registrar contato", error);
      return NextResponse.json({ error: "falha ao registrar contato" }, { status: 500 });
    }
    contactId = created.id;
  }

  const externalReference = `${contactId}:${product}`;
  const { label, value } = PRODUCT_PRICE[product];

  try {
    const customerId = await findOrCreateCustomer({ name, email, cpfCnpj, externalReference: contactId! });
    const { paymentId } = await createPixPayment({
      customerId,
      value,
      description: label,
      externalReference,
    });
    const qr = await getPixQrCode(paymentId);

    return NextResponse.json({
      contactId,
      paymentId,
      qrCodeImage: qr.encodedImage,
      copyPaste: qr.payload,
      expirationDate: qr.expirationDate,
    });
  } catch (err) {
    console.error("checkout falhou", err);
    return NextResponse.json({ error: "não deu pra gerar a cobrança, tenta de novo" }, { status: 500 });
  }
}
