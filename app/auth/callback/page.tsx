import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HashSessionFallback } from "@/components/HashSessionFallback";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect("/pos-login");
    redirect("/entrar?erro=auth");
  }

  // Sem `code` na query — pode ser um link no formato implícito
  // (`#access_token=...`), que o servidor nunca vê. Delega pro client.
  return <HashSessionFallback />;
}
