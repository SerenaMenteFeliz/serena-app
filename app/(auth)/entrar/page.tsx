import { LoginForm } from "@/components/LoginForm";
import { PortalArch } from "@/components/PortalArch";

export default function EntrarPage() {
  return (
    <main className="theme-hub portal-bg flex min-h-screen flex-col items-center justify-center gap-8 p-6" style={{ color: "var(--ink)" }}>
      <PortalArch width={150} height={190} />
      <h1 className="font-display text-2xl">Serena Mente Feliz</h1>
      <LoginForm />
    </main>
  );
}
