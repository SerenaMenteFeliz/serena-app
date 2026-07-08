import { LoginForm } from "@/components/LoginForm";

// Link enviado no e-mail de confirmação de compra do Desafio de 7 Dias
// aponta pra cá — primeira impressão já bate com o que a pessoa comprou.
export default function EntrarLarInteriorPage() {
  return (
    <main className="theme-lar-interior flex min-h-screen flex-col items-center justify-center gap-6 p-6" style={{ background: "var(--surface)", color: "var(--surface-foreground)" }}>
      <h1 className="text-2xl font-semibold">Lar Interior</h1>
      <p>Desafio de 7 Dias</p>
      <LoginForm produto="Lar Interior" />
    </main>
  );
}
