"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Tela de erro na linguagem de vidro — cada seção passa seu `theme` pra
// paleta certa aparecer (o layout da seção segue vivo por baixo do error.tsx,
// então as fonts por produto continuam carregadas). Tom acolhedor de
// propósito: é um app de saúde mental, a falha não pode gritar com a pessoa.
export function ErrorVeil({
  theme,
  error,
  retry,
  homeHref = "/",
  homeLabel = "voltar pro início",
}: {
  theme: "theme-hub" | "theme-lar-interior" | "theme-metodo-calice";
  error: Error & { digest?: string };
  retry: () => void;
  homeHref?: string;
  homeLabel?: string;
}) {
  useEffect(() => {
    console.error(error);
    if (posthog.__loaded) {
      posthog.capture("app_error_boundary", { theme, digest: error.digest ?? "" });
    }
  }, [error, theme]);

  return (
    <div className={`${theme} veil-bg flex items-center justify-center px-5`} style={{ color: "var(--ink)" }}>
      <div className="w-full max-w-md">
        <div className="veil-arch glass-card relative overflow-hidden px-6 pb-8 pt-14 text-center">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 20%, var(--bg-glow), transparent 62%)" }}
          />
          <div className="relative">
            <span
              className="glass-orb mx-auto h-[52px] w-[52px]"
              style={{ borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
            >
              <span className="font-display text-xl" style={{ color: "var(--accent)" }}>
                ~
              </span>
            </span>
            <h1 className="font-display mt-4 text-[22px] italic leading-snug">
              Algo saiu do lugar por aqui
            </h1>
            <p className="mx-auto mt-2 max-w-[34ch] text-[13px] leading-relaxed opacity-60">
              Não foi nada que você fez. Respire fundo — seu progresso está guardado — e tente de
              novo.
            </p>
            <button
              type="button"
              onClick={retry}
              className="surface-card-dark mt-6 w-full cursor-pointer rounded-[20px] py-3.5 text-sm font-bold transition-transform active:scale-[0.99]"
            >
              Tentar de novo
            </button>
            <a
              href={homeHref}
              className="mt-3 block text-center text-sm font-bold"
              style={{ color: "var(--accent)" }}
            >
              {homeLabel}
            </a>
            {error.digest && (
              <p className="mt-4 text-[10px] uppercase tracking-[0.08em] opacity-30">
                código {error.digest}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
