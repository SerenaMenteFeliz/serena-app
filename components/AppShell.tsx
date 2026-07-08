import Link from "next/link";

// Casca compartilhada entre hub e seções de produto: mesma estrutura de
// navegação e linguagem visual (portal) em todo lugar. `theme` troca só a
// paleta (CSS vars); `extraNav` deixa cada produto plugar seus próprios
// atalhos (ex: Livro / Aulas no Método Cálice) sem duplicar a casca.
export function AppShell({
  theme,
  homeHref,
  showHubLink = false,
  extraNav,
  children,
}: {
  theme: "hub" | "lar-interior" | "metodo-calice";
  homeHref: string;
  showHubLink?: boolean;
  extraNav?: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className={`theme-${theme} portal-bg flex flex-col`}>
      <main className="flex-1 p-6">{children}</main>
      <nav className="flex items-center justify-around border-t border-white/10 py-3 backdrop-blur-sm">
        <Link href={homeHref}>Início</Link>
        {extraNav?.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        {/* Discreto de propósito — a pessoa só vem aqui se quiser, não é
            empurrado. Ver decisão em Painel - Hoje / memoria-negocio. */}
        {showHubLink && <Link href="/hub">Serena Mente Feliz</Link>}
        <Link href="/perfil">Perfil</Link>
      </nav>
    </div>
  );
}
