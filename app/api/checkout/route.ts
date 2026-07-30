import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStaticPixCharge } from "@/lib/asaas";
import { PRODUCT_PRICE } from "@/lib/pricing";
import type { ProductSlug } from "@/lib/access";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const product = body?.product as ProductSlug | undefined;
  const name = (body?.name as string | undefined)?.trim();
  const email = (body?.email as string | undefined)?.trim().toLowerCase();

  if (!product || !PRODUCT_PRICE[product]) {
    return NextResponse.json({ error: "produto inválido" }, { status: 400 });
  }
  if (!name || !email) {
    return NextResponse.json({ error: "nome e e-mail são obrigatórios" }, { status: 400 });
  }

  const admin = createAdminClient();

  // contact pode já existir (veio do quiz/captura de lead) — reaproveita o
  // mesmo id, senão essa compra vira um contact novo desde já.
  const { data: existing } = await admin.from("contacts").select("id").eq("email", email).maybeSingle();

  let contactId = existing?.id as string | undefined;

  if (contactId) {
    await admin.from("contacts").update({ name }).eq("id", contactId);
  } else {
    const { data: created, error } = await admin.from("contacts").insert({ email, name }).select("id").single();
    if (error || !created) {
      console.error("checkout: falha ao registrar contato", error);
      return NextResponse.json({ error: "falha ao registrar contato" }, { status: 500 });
    }
    contactId = created.id;
  }

  const { label, value } = PRODUCT_PRICE[product];

  try {
    const charge = await createStaticPixCharge({
      value,
      description: label,
      externalReference: `${contactId}:${product}`,
    });

    // Vínculo de verdade pro webhook: `payment.pixQrCodeId` bate com `charge.id`.
    const { error: chargeError } = await admin
      .from("pix_charges")
      .insert({ id: charge.id, contact_id: contactId, product });
    if (chargeError) {
      console.error("checkout: falha ao registrar cobrança", chargeError);
      return NextResponse.json({ error: "falha ao registrar cobrança" }, { status: 500 });
    }

    return NextResponse.json({
      contactId,
      chargeId: charge.id,
      qrCodeImage: charge.encodedImage,
      copyPaste: charge.payload,
    });
  } catch (err) {
    console.error("checkout falhou", err);
    return NextResponse.json({ error: "não deu pra gerar a cobrança, tenta de novo" }, { status: 500 });
  }
}
