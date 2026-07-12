"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Analytics do app (PostHog). Sem NEXT_PUBLIC_POSTHOG_KEY no ambiente, nada
// inicializa — o app inteiro funciona igual, só não mede. `defaults` recente
// já captura pageview em navegação SPA (history change), sem effect de rota.
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true,
      // app de saúde mental: nunca gravar o que a pessoa digita (diário, notas)
      autocapture: false,
      session_recording: { maskAllInputs: true },
    });
  }, []);

  return <>{children}</>;
}
