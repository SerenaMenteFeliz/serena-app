"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Cobre o caso do link de magic link vir no formato "implícito"
// (`#access_token=...`, que o navegador nunca envia pro servidor) em vez do
// `?code=` esperado pelo fluxo PKCE padrão. Lê o hash no client e estabelece
// a sessão manualmente.
export function HashSessionFallback() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      router.replace("/entrar?erro=auth");
      return;
    }

    const supabase = createClient();
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      router.replace(error ? "/entrar?erro=auth" : "/pos-login");
    });
  }, [router]);

  return (
    <main className="theme-hub portal-bg flex min-h-screen items-center justify-center">
      <p>Entrando...</p>
    </main>
  );
}
