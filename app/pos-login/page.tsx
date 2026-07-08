import { requireAuth, getActiveProducts, resolveEntryRoute } from "@/lib/access";
import { redirect } from "next/navigation";

// Página de trânsito: nunca é vista pelo usuário. Só decide para onde mandar
// depois do login — hub (2+ produtos) ou direto na seção comprada (1 produto).
export default async function PosLoginPage() {
  const { contactId } = await requireAuth();
  const products = await getActiveProducts(contactId);
  redirect(resolveEntryRoute(products));
}
