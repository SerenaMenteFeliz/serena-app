import { LarNav } from "./LarNav";

// Casca do Lar Interior na linguagem "Amanhecer": véu creme→pêssego de fundo,
// coluna mobile-first centrada e nav flutuante de vidro. Telas imersivas
// (player de sessão, onboarding) desligam a nav com `nav={false}`.
export function LarShell({
  children,
  nav = true,
}: {
  children: React.ReactNode;
  nav?: boolean;
}) {
  return (
    <div className="theme-lar-interior veil-bg" style={{ color: "var(--ink)" }}>
      <main className={`mx-auto w-full max-w-md px-5 pt-6 ${nav ? "pb-32" : "pb-8"}`}>
        {children}
      </main>
      {nav && <LarNav />}
    </div>
  );
}
