"use client";

import { useState } from "react";
import posthog from "posthog-js";

// Ações do card de marco: compartilhar nativo (Web Share) quando existir,
// senão a dica honesta do print — a tela toda foi composta pra caber num
// story. Sem gerar imagem no servidor: a própria tela é o card.
export function ShareActions({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  const podeCompartilhar = typeof navigator !== "undefined" && !!navigator.share;

  async function compartilhar() {
    if (posthog.__loaded) posthog.capture("share_card_shared", { method: "web_share" });
    try {
      await navigator.share({ text: texto });
    } catch {
      // pessoa fechou o sheet — não é erro
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
      if (posthog.__loaded) posthog.capture("share_card_shared", { method: "copy" });
    } catch {
      // clipboard bloqueado — a dica do print continua na tela
    }
  }

  return (
    <div className="mt-6">
      {podeCompartilhar ? (
        <button
          type="button"
          onClick={compartilhar}
          className="surface-card-dark w-full cursor-pointer rounded-[20px] py-3.5 text-sm font-bold transition-transform active:scale-[0.99]"
        >
          Compartilhar meu marco
        </button>
      ) : (
        <button
          type="button"
          onClick={copiar}
          className="surface-card-dark w-full cursor-pointer rounded-[20px] py-3.5 text-sm font-bold transition-transform active:scale-[0.99]"
        >
          {copiado ? "Copiado ✦" : "Copiar pra compartilhar"}
        </button>
      )}
      <p className="mt-3 text-center text-[11px] opacity-50">
        ou tire um print desta tela — ela foi feita pra caber no seu story
      </p>
    </div>
  );
}
