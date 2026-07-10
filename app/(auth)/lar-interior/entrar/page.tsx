import { LoginForm } from "@/components/LoginForm";
import { LarSun } from "@/components/lar/LarSun";
import { larFontVars } from "@/lib/fonts/lar";

// Link enviado no e-mail de confirmação de compra do Desafio de 7 Dias
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarLarInteriorPage() {
  return (
    <main
      className={`${larFontVars} theme-lar-interior veil-bg flex min-h-screen flex-col items-center justify-center gap-6 p-6`}
      style={{ color: "var(--ink)" }}
    >
      <div className="veil-arch glass-card relative flex h-[200px] w-[180px] items-end justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 80%, rgba(236,194,124,0.28), transparent 62%)" }}
        />
        <LarSun width={150} height={104} />
      </div>

      <div className="text-center">
        <h1 className="font-display text-[26px]">Lar Interior</h1>
        <p className="mt-1 text-xs opacity-55">Desafio de 7 Dias — sua meditação começa aqui</p>
      </div>

      <LoginForm produto="Lar Interior" />
    </main>
  );
}
