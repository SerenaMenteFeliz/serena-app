import { LoginForm } from "@/components/LoginForm";
import { PortalArch } from "@/components/PortalArch";

// Link enviado no e-mail de confirmação de compra do Método Cálice
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarMetodoCalicePage() {
  return (
    <main className="theme-metodo-calice portal-bg flex flex-col items-center justify-center gap-6 p-6">
      <PortalArch width={160} height={200} />
      <h1 className="text-2xl font-semibold -mt-16">Método Cálice</h1>
      <LoginForm produto="Método Cálice" />
    </main>
  );
}
