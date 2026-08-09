import { CaliceNav } from "./CaliceNav";

// Casca do Método Cálice na linguagem Santuário + Véu: véu gradiente de fundo,
// coluna mobile-first centrada e nav flutuante de vidro. Telas imersivas
// (leitor, player de aula) desligam a nav com `nav={false}` pra não competir
// com o conteúdo.
export function CaliceShell({
  children,
  nav = true,
}: {
  children: React.ReactNode;
  nav?: boolean;
}) {
  return (
    <div className="theme-metodo-calice veil-bg" style={{ color: "var(--ink)" }}>
      {/* o respiro de baixo soma a safe area (barra de gestos do Android /
          home indicator do iOS) — sem isso o último elemento encosta nela */}
      <main
        className="mx-auto w-full max-w-md px-5 pt-6"
        style={{ paddingBottom: `calc(${nav ? "8rem" : "2rem"} + env(safe-area-inset-bottom, 0px))` }}
      >
        {children}
      </main>
      {nav && <CaliceNav />}
    </div>
  );
}
