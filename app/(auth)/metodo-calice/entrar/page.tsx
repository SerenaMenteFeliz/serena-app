import { LoginForm } from "@/components/LoginForm";
import { CaliceBook } from "@/components/calice/CaliceBook";
import { caliceFontVars } from "@/lib/fonts/calice";

// Link enviado no e-mail de confirmação de compra do Método Cálice
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarMetodoCalicePage() {
  return (
    <main
      className={`${caliceFontVars} theme-metodo-calice veil-bg flex min-h-screen flex-col items-center justify-center gap-6 p-6`}
      style={{ color: "var(--ink)" }}
    >
      <div className="veil-arch glass-card relative h-[200px] w-[180px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 85%, rgba(217,168,84,0.22), transparent 60%)" }}
        />
        <div
          className="absolute left-1/2 top-3.5 h-[110px] w-[110px] -translate-x-1/2 rounded-full"
          style={{ border: "1px dashed color-mix(in srgb, var(--gold) 50%, transparent)" }}
        />
        <div className="float-slow absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
          <CaliceBook width={82} height={116} />
        </div>
      </div>

      <div className="text-center">
        <h1 className="font-display text-[26px]">Método Cálice</h1>
        <p className="font-veil-sans mt-1 text-xs opacity-55">um caminho de reprogramação mental</p>
      </div>

      <LoginForm produto="Método Cálice" />
    </main>
  );
}
