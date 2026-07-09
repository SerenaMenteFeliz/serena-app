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
      <main className={`mx-auto w-full max-w-md px-5 pt-6 ${nav ? "pb-32" : "pb-8"}`}>
        {children}
      </main>
      {nav && <CaliceNav />}
    </div>
  );
}
