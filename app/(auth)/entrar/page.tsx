import { LoginForm } from "@/components/LoginForm";
import { PortalArch } from "@/components/PortalArch";

export default function EntrarPage() {
  return (
    <main className="theme-hub portal-bg flex flex-col items-center justify-center gap-6 p-6">
      <PortalArch width={160} height={200} />
      <h1 className="text-2xl font-semibold -mt-16">Serena Mente Feliz</h1>
      <LoginForm />
    </main>
  );
}
