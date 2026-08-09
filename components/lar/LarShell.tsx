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
      {/* mesmo respiro de safe area do CaliceShell */}
      <main
        className="mx-auto w-full max-w-md px-5 pt-6"
        style={{ paddingBottom: `calc(${nav ? "8rem" : "2rem"} + env(safe-area-inset-bottom, 0px))` }}
      >
        {children}
      </main>
      {nav && <LarNav />}
    </div>
  );
}
