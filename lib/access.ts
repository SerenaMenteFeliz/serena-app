import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProductSlug = "lar_interior" | "metodo_calice";

const PRODUCT_ROUTES: Record<ProductSlug, string> = {
  lar_interior: "/lar-interior",
  metodo_calice: "/metodo-calice",
};

export async function getActiveProducts(userId: string): Promise<ProductSlug[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_access")
    .select("product")
    .eq("contact_id", userId)
    .eq("status", "active");

  if (error) {
    console.error("getActiveProducts falhou", error);
    return [];
  }

  return (data ?? []).map((row) => row.product as ProductSlug);
}

// 0 produtos: sem acesso (não deveria acontecer pós-compra, mas é o fallback
// seguro). 1 produto: cai direto na seção comprada. 2+: cai no hub.
export function resolveEntryRoute(products: ProductSlug[]): string {
  if (products.length === 0) return "/sem-acesso";
  if (products.length === 1) return PRODUCT_ROUTES[products[0]];
  return "/hub";
}

// Usar no topo de cada page.tsx de seção — garante a checagem de acesso perto
// da fonte de dados (recomendação Next.js), não só no proxy otimista.
export async function requireProductAccess(product: ProductSlug) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const products = await getActiveProducts(user.id);
  if (!products.includes(product)) redirect("/hub");

  return user;
}
