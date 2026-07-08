import { LoginForm } from "@/components/LoginForm";

export default function EntrarPage() {
  return (
    <main className="theme-hub flex min-h-screen flex-col items-center justify-center gap-6 p-6" style={{ background: "var(--surface)", color: "var(--surface-foreground)" }}>
      <h1 className="text-2xl font-semibold">Serena Mente Feliz</h1>
      <LoginForm />
    </main>
  );
}
