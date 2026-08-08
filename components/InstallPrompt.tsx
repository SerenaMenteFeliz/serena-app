"use client";

import { useEffect, useState } from "react";

// beforeinstallprompt só existe no Chrome/Edge (Android e desktop) — o
// TypeScript do DOM não tem esse tipo, então declaramos só o que usamos.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Plataforma = "ios" | "android-chrome" | "outro";

function detectarPlataforma(): Plataforma {
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document);
  if (isIOS) return "ios";
  return "android-chrome";
}

function jaInstalado(): boolean {
  // Dois jeitos de detectar "já rodando como app instalado": o padrão
  // (display-mode: standalone) e o específico do Safari/iOS (navigator.standalone).
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const [ambiente, setAmbiente] = useState<{ plataforma: Plataforma; instalado: boolean } | null>(null);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [resultado, setResultado] = useState<"aceito" | "recusado" | null>(null);

  useEffect(() => {
    // Leitura de ambiente do navegador (userAgent, matchMedia) — não dá pra
    // saber isso no server, só depois de montar no client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAmbiente({ plataforma: detectarPlataforma(), instalado: jaInstalado() });

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  async function instalar() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    setResultado(outcome === "accepted" ? "aceito" : "recusado");
    setPromptEvent(null);
  }

  if (ambiente === null) return null; // evita flash errado antes do useEffect rodar
  const { plataforma, instalado } = ambiente;

  if (instalado || resultado === "aceito") {
    return (
      <div className="glass-card flex w-full max-w-sm flex-col items-center gap-3 rounded-[20px] px-6 py-6 text-center">
        <p>App instalado. Pode continuar pelo ícone na tela inicial.</p>
        <a href="/entrar" className="underline underline-offset-2 text-sm">
          Continuar para o login
        </a>
      </div>
    );
  }

  return (
    <div className="glass-card flex w-full max-w-sm flex-col items-center gap-4 rounded-[20px] px-6 py-6 text-center">
      {plataforma === "ios" ? (
        <>
          <p className="text-sm opacity-80">
            No Safari: toque no ícone de <strong>Compartilhar</strong> (o quadrado com a seta pra cima) e depois em{" "}
            <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.
          </p>
          <p className="text-xs opacity-60">Precisa ser pelo Safari — outros navegadores no iPhone não instalam PWA.</p>
        </>
      ) : promptEvent ? (
        <button
          type="button"
          onClick={instalar}
          className="cursor-pointer rounded-full px-5 py-2.5 font-semibold transition-transform active:scale-[0.98]"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          Instalar app
        </button>
      ) : (
        <p className="text-sm opacity-80">
          No menu do navegador (⋮), procure <strong>&ldquo;Instalar app&rdquo;</strong> ou{" "}
          <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.
        </p>
      )}

      <a href="/entrar" className="underline underline-offset-2 text-xs opacity-70">
        Já instalei / prefiro continuar pelo navegador
      </a>
    </div>
  );
}
