import { LoginForm } from "@/components/LoginForm";
import { PortalArch } from "@/components/PortalArch";

// Link enviado no e-mail de confirmação de compra do Método Cálice
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarMetodoCalicePage() {
  return (
    <main className="theme-metodo-calice portal-bg flex min-h-screen flex-col items-center justify-center gap-8 p-6" style={{ color: "var(--ink)" }}>
      <PortalArch width={150} height={190} />
      <h1 className="font-display text-2xl">Método Cálice</h1>
      <LoginForm produto="Método Cálice" />
    </main>
  );
}
