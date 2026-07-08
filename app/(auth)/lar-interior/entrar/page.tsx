import { LoginForm } from "@/components/LoginForm";
import { PortalArch } from "@/components/PortalArch";

// Link enviado no e-mail de confirmação de compra do Desafio de 7 Dias
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarLarInteriorPage() {
  return (
    <main className="theme-lar-interior portal-bg flex flex-col items-center justify-center gap-6 p-6">
      <PortalArch width={160} height={200} />
      <h1 className="text-2xl font-semibold -mt-16">Lar Interior</h1>
      <p className="opacity-80">Desafio de 7 Dias</p>
      <LoginForm produto="Lar Interior" />
    </main>
  );
}
