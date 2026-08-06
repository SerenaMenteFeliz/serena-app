import { requireAuth } from "@/lib/access";
import { PasswordForm } from "@/components/PasswordForm";
import { SparkleIcon } from "@/components/icons";

// Alcançada só pelo link de "esqueci minha senha" (e-mail) — o clique já
// deixa uma sessão de recuperação ativa (via /auth/callback), então
// requireAuth aqui é o mesmo guard de qualquer página logada, não precisa
// de um caso especial pra sessão de recovery.
export default async function RedefinirSenhaPage() {
  await requireAuth();

  return (
    <main
      className="theme-hub veil-bg flex min-h-screen flex-col items-center justify-center gap-6 p-6"
      style={{ color: "var(--ink)" }}
    >
      <div className="veil-arch glass-card relative flex h-[200px] w-[180px] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 70%, rgba(94,182,166,0.22), transparent 62%)" }}
        />
        <span className="float-slow" style={{ color: "var(--accent)" }}>
          <SparkleIcon size={54} />
        </span>
      </div>
      <PasswordForm title="Defina sua nova senha" redirectTo="/pos-login" />
    </main>
  );
}
