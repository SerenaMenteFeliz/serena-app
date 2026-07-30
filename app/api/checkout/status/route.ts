import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Polling simples da tela de checkout — sabe só dizer "liberado ou não" pro
// par (contactId, product); não expõe mais nada do contato.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");
  const product = searchParams.get("product");

  if (!contactId || !product) {
    return NextResponse.json({ error: "parâmetros faltando" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("product_access")
    .select("status")
    .eq("contact_id", contactId)
    .eq("product", product)
    .eq("status", "active")
    .maybeSingle();

  return NextResponse.json({ granted: !!data });
}
