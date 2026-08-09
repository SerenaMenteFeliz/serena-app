"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  PlayFilledIcon,
  PauseFilledIcon,
  Replay15Icon,
  Forward15Icon,
  HeadphonesIcon,
} from "@/components/icons";

// Player de áudio do app inteiro (Método Cálice e Lar Interior usam a mesma
// tabela `lesson_blocks`, então o mesmo player serve os dois). Desenhado na
// linguagem de vidro: sem cromo de navegador, controle grande o suficiente
// pra usar de olho fechado, e nada de autoplay — a pessoa escolhe começar.
//
// Deliberadamente sem barra de volume: no celular o volume é do aparelho, e
// um slider a mais só rouba área de toque do que importa.

function formatarTempo(segundos: number): string {
  if (!Number.isFinite(segundos) || segundos < 0) return "0:00";
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  subtitle,
}: {
  src: string;
  title?: string;
  subtitle?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barraId = useId();
  const [tocando, setTocando] = useState(false);
  const [atual, setAtual] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState(false);

  // O <audio> é a fonte da verdade: os listeners mantêm o estado do React
  // colado nele, em vez de o React tentar dirigir o elemento (é o que evita
  // o botão dizer "tocando" quando o sistema pausou por uma ligação, por
  // exemplo).
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setAtual(el.currentTime);
    const onMeta = () => {
      setDuracao(el.duration);
      setPronto(true);
    };
    const onPlay = () => setTocando(true);
    const onPause = () => setTocando(false);
    const onEnd = () => {
      setTocando(false);
      setAtual(0);
    };
    const onError = () => {
      setErro(true);
      setPronto(false);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("error", onError);
    };
  }, []);

  function alternar() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => setErro(true));
    else el.pause();
  }

  function pular(delta: number) {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.min(Math.max(el.currentTime + delta, 0), el.duration || 0);
  }

  function irPara(valor: number) {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = valor;
    setAtual(valor);
  }

  const progresso = duracao > 0 ? (atual / duracao) * 100 : 0;

  if (erro) {
    return (
      <div className="glass-card px-5 py-4">
        <p className="font-veil-sans text-sm font-medium">Não consegui carregar este áudio.</p>
        <p className="mt-1 font-veil-sans text-xs opacity-60">
          Confere sua conexão e recarrega a página. Se continuar, o texto abaixo tem o mesmo
          conteúdo.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card-strong px-5 py-5">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-2.5">
        <HeadphonesIcon size={15} className="shrink-0 opacity-50" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-veil-sans text-sm font-bold leading-snug">
            {title ?? "Áudio guiado"}
          </p>
          {subtitle && (
            <p className="mt-0.5 truncate font-veil-sans text-[11px] opacity-55">{subtitle}</p>
          )}
        </div>
      </div>

      {/* barra de progresso — o range nativo é o que dá arrastar acessível de
          graça (teclado, leitor de tela); a pintura é toda por cima dele */}
      <div className="relative mt-4 h-6">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ background: "color-mix(in srgb, var(--ink) 12%, transparent)" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-150"
            style={{ width: `${progresso}%`, background: "var(--accent)" }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full shadow-sm transition-[left] duration-150"
          style={{
            left: `calc(${progresso}% - 7px)`,
            background: "var(--accent)",
            opacity: pronto ? 1 : 0.35,
          }}
        />
        <input
          id={barraId}
          type="range"
          min={0}
          max={duracao || 0}
          step={0.5}
          value={atual}
          disabled={!pronto}
          onChange={(e) => irPara(Number(e.target.value))}
          aria-label="Posição do áudio"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      <div className="mt-1 flex justify-between font-veil-sans text-[11px] tabular-nums opacity-55">
        <span>{formatarTempo(atual)}</span>
        <span>{pronto ? formatarTempo(duracao) : "carregando…"}</span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-7">
        <button
          type="button"
          onClick={() => pular(-15)}
          disabled={!pronto}
          aria-label="Voltar 15 segundos"
          className="cursor-pointer p-1 opacity-65 transition-opacity hover:opacity-100 disabled:opacity-30"
        >
          <Replay15Icon />
        </button>

        <button
          type="button"
          onClick={alternar}
          aria-label={tocando ? "Pausar" : "Tocar"}
          className="flex h-[58px] w-[58px] cursor-pointer items-center justify-center rounded-full transition-transform active:scale-95"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          {tocando ? <PauseFilledIcon size={24} /> : <PlayFilledIcon size={24} />}
        </button>

        <button
          type="button"
          onClick={() => pular(15)}
          disabled={!pronto}
          aria-label="Avançar 15 segundos"
          className="cursor-pointer p-1 opacity-65 transition-opacity hover:opacity-100 disabled:opacity-30"
        >
          <Forward15Icon />
        </button>
      </div>
    </div>
  );
}
