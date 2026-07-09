import { LoginForm } from "@/components/LoginForm";
import { PortalArch } from "@/components/PortalArch";

// Link enviado no e-mail de confirmação de compra do Desafio de 7 Dias
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarLarInteriorPage() {
  return (
    <main className="theme-lar-interior portal-bg flex min-h-screen flex-col items-center justify-center gap-8 p-6" style={{ color: "var(--ink)" }}>
      <PortalArch width={150} height={190} />
      <div className="text-center">
        <h1 className="font-display text-2xl">Lar Interior</h1>
        <p className="mt-1 text-sm italic opacity-60">Desafio de 7 Dias</p>
      </div>
      <LoginForm produto="Lar Interior" />
    </main>
  );
}
