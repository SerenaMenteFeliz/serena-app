import { LoginForm } from "@/components/LoginForm";

// Link enviado no e-mail de confirmação de compra do Método Cálice
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarMetodoCalicePage() {
  return (
    <main className="theme-metodo-calice flex min-h-screen flex-col items-center justify-center gap-6 p-6" style={{ background: "var(--surface)", color: "var(--surface-foreground)" }}>
      <h1 className="text-2xl font-semibold">Método Cálice</h1>
      <LoginForm produto="Método Cálice" />
    </main>
  );
}
