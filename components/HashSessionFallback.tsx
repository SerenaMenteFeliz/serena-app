"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Cobre o caso de um link de autenticação (recuperar/criar senha, gerado
// pela Admin API do Supabase) vir no formato "implícito" (`#access_token=`,
// que o navegador nunca envia pro servidor) em vez do `?code=` esperado
// pelo fluxo PKCE padrão. Lê o hash no client e estabelece a sessão
// manualmente.
export function HashSessionFallback({ next }: { next?: string }) {
  const router = useRouter();
  const destino = next && next.startsWith("/") && !next.startsWith("//") ? next : "/pos-login";

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
      router.replace(error ? "/entrar?erro=auth" : destino);
    });
  }, [router, destino]);

  return (
    <main className="theme-hub veil-bg flex min-h-screen flex-col items-center justify-center gap-3" style={{ color: "var(--ink)" }}>
      <span className="skeleton h-[52px] w-[52px] rounded-full" aria-hidden />
      <p className="text-sm opacity-60">Entrando…</p>
    </main>
  );
}
