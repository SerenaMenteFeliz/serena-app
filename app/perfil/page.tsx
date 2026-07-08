import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveProducts } from "@/lib/access";
import { AppShell } from "@/components/AppShell";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const produtos = await getActiveProducts(user.id);

  return (
    <AppShell theme="hub" homeHref="/perfil">
      <h1 className="text-2xl font-semibold mb-4">Perfil</h1>
      <p>{user.email}</p>
      <p className="mt-2 text-sm">Produtos ativos: {produtos.join(", ") || "nenhum"}</p>
    </AppShell>
  );
}
