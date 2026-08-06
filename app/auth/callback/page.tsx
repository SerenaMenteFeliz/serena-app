import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HashSessionFallback } from "@/components/HashSessionFallback";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>;
}) {
  const { code, next } = await searchParams;
  // `next` só é usado quando aponta pra dentro do app (hoje só
  // /redefinir-senha, vindo do link de "esqueci minha senha") — nunca
  // redirecionar pra uma URL externa vinda de query string.
  const destino = next && next.startsWith("/") && !next.startsWith("//") ? next : "/pos-login";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(destino);
    redirect("/entrar?erro=auth");
  }

  // Sem `code` na query — pode ser um link no formato implícito
  // (`#access_token=...`), que o servidor nunca vê. Delega pro client.
  // Links gerados pela Admin API (webhook de compra, recuperar senha) caem
  // aqui — por isso o `next` precisa seguir junto.
  return <HashSessionFallback next={destino} />;
}
