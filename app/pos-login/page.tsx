import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveProducts, resolveEntryRoute } from "@/lib/access";

// Página de trânsito: nunca é vista pelo usuário. Só decide para onde mandar
// depois do login — hub (2+ produtos) ou direto na seção comprada (1 produto).
export default async function PosLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const products = await getActiveProducts(user.id);
  redirect(resolveEntryRoute(products));
}
