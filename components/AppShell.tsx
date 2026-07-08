import Link from "next/link";

// Casca compartilhada entre hub e seções de produto: mesma estrutura de
// navegação em todo lugar. `theme` troca só a paleta (CSS vars); o conteúdo
// de cada produto define seu próprio visual/funcionalidades por dentro.
export function AppShell({
  theme,
  homeHref,
  showHubLink = false,
  children,
}: {
  theme: "hub" | "lar-interior" | "metodo-calice";
  homeHref: string;
  showHubLink?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`theme-${theme} min-h-screen flex flex-col`}
      style={{ background: "var(--surface)", color: "var(--surface-foreground)" }}
    >
      <main className="flex-1 p-6">{children}</main>
      <nav
        className="flex items-center justify-around border-t py-3"
        style={{ background: "var(--surface)" }}
      >
        <Link href={homeHref}>Início</Link>
        {/* Discreto de propósito — a pessoa só vem aqui se quiser, não é
            empurrado. Ver decisão em Painel - Hoje / memoria-negocio. */}
        {showHubLink && <Link href="/hub">Serena Mente Feliz</Link>}
        <Link href="/perfil">Perfil</Link>
      </nav>
    </div>
  );
}
