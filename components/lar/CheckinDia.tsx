"use client";

import { useState, useSyncExternalStore } from "react";
import posthog from "posthog-js";

// Check-in do dia: "como você chega hoje?" vira a intenção do dia respondendo
// à pessoa, não só ao calendário. A escolha vive em localStorage (nada de
// humor no banco — é um toque de personalização, não prontuário) e zera
// naturalmente no dia seguinte. Antes de responder — ou sem JS — vale a
// intenção do rodízio por data, que continua sendo o fallback.

type Humor = "leve" | "cansada" | "ansiosa" | "animada";

const HUMORES: { id: Humor; label: string }[] = [
  { id: "leve", label: "leve" },
  { id: "animada", label: "animada" },
  { id: "cansada", label: "cansada" },
  { id: "ansiosa", label: "ansiosa" },
];

// intenções por estado — mesma voz da Liz do rodízio original
const INTENCOES_POR_HUMOR: Record<Humor, string[]> = {
  ansiosa: ["respirar antes de responder", "o corpo sabe, escute", "menos pressa, mais pausa"],
  cansada: ["devagar é um ritmo", "acolher o que chega", "silêncio também é resposta"],
  leve: ["presença", "hoje é o único dia", "começar de onde você está"],
  animada: ["um passo de cada vez", "confiar no processo", "seu ritmo é o certo"],
};

function intencaoPara(humor: Humor, dia: string): string {
  const [y, m, d] = dia.split("-").map(Number);
  const pool = INTENCOES_POR_HUMOR[humor];
  return pool[(y + m + d) % pool.length];
}

const subscribeNoop = () => () => {};

export function CheckinDia({ dia, fallbackIntencao }: { dia: string; fallbackIntencao: string }) {
  // hidratação sem mismatch: server (e 1º paint) mostram o fallback; depois
  // de montado, o localStorage decide — sem setState em effect
  const montado = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const [escolhaSessao, setEscolhaSessao] = useState<Humor | "perguntar" | null>(null);

  const humor: Humor | "perguntar" | null =
    escolhaSessao ??
    (montado ? ((localStorage.getItem(`lar_humor_${dia}`) as Humor | null) ?? "perguntar") : null);

  function escolher(h: Humor) {
    localStorage.setItem(`lar_humor_${dia}`, h);
    setEscolhaSessao(h);
    if (posthog.__loaded) posthog.capture("lar_checkin", { humor: h });
  }

  const intencao =
    humor && humor !== "perguntar" ? intencaoPara(humor, dia) : fallbackIntencao;

  return (
    <div className="surface-card-dark relative mt-4 overflow-hidden px-[18px] py-4">
      <div
        className="absolute -right-2.5 -top-2.5 h-[60px] w-[60px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, var(--sun-soft), transparent 70%)" }}
      />

      {humor === "perguntar" ? (
        <>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--sun-soft)" }}>
            Como você chega hoje?
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {HUMORES.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => escolher(h.id)}
                className="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-transform active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "var(--surface-dark-foreground)",
                }}
              >
                {h.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] italic opacity-45">
            sem resposta certa — a intenção do dia se ajusta a você
          </p>
        </>
      ) : (
        <>
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--sun-soft)" }}>
              Intenção do dia
            </p>
            {humor && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(`lar_humor_${dia}`);
                  setEscolhaSessao("perguntar");
                }}
                className="cursor-pointer text-[10px] opacity-45 transition-opacity hover:opacity-100"
                style={{ color: "var(--surface-dark-foreground)" }}
              >
                chegando {humor} · trocar
              </button>
            )}
          </div>
          <p className="mt-1.5 font-display text-base italic leading-snug">“{intencao}”</p>
        </>
      )}
    </div>
  );
}
