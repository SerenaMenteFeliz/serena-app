import { InstallPrompt } from "@/components/InstallPrompt";
import { SparkleIcon } from "@/components/icons";

// Passo antes do login pra quem está testando o fluxo de app instalado
// (não a landing pública — essa página não tem link em lugar nenhum do
// funil ainda, é só o ponto de entrada manual pro teste).
export default function InstalarPage() {
  return (
    <main
      className="theme-hub veil-bg flex min-h-screen flex-col items-center justify-center gap-6 p-6"
      style={{ color: "var(--ink)" }}
    >
      <div className="veil-arch glass-card relative flex h-[200px] w-[180px] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 70%, rgba(94,182,166,0.22), transparent 62%)" }}
        />
        <div
          className="absolute left-1/2 top-5 h-[120px] w-[120px] -translate-x-1/2 rounded-full"
          style={{ border: "1px dashed color-mix(in srgb, var(--accent) 45%, transparent)" }}
        />
        <span className="float-slow" style={{ color: "var(--accent)" }}>
          <SparkleIcon size={54} />
        </span>
      </div>

      <div className="text-center">
        <h1 className="font-display text-[26px]">Instalar o Serena Mente Feliz</h1>
        <p className="mt-1 text-xs opacity-55">antes de entrar, instala o app na tela inicial</p>
      </div>

      <InstallPrompt />
    </main>
  );
}
