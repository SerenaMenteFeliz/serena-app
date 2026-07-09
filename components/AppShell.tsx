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
    <div className={`theme-${theme} portal-bg flex flex-col`} style={{ color: "var(--ink)" }}>
      <main className="flex-1 p-6">{children}</main>
      <nav
        className="flex items-center justify-around border-t py-3 text-sm backdrop-blur-sm"
        style={{ borderColor: "color-mix(in srgb, var(--accent) 15%, transparent)", background: "color-mix(in srgb, var(--surface) 70%, transparent)" }}
      >
        <Link href={homeHref} className="opacity-70 transition-opacity hover:opacity-100">
          Início
        </Link>
        {extraNav?.map((item) => (
          <Link key={item.href} href={item.href} className="opacity-70 transition-opacity hover:opacity-100">
            {item.label}
          </Link>
        ))}
        {/* Discreto de propósito — a pessoa só vem aqui se quiser, não é
            empurrado. Ver decisão em Painel - Hoje / memoria-negocio. */}
        {showHubLink && (
          <Link href="/hub" className="opacity-70 transition-opacity hover:opacity-100">
            Serena Mente Feliz
          </Link>
        )}
        <Link href="/perfil" className="opacity-70 transition-opacity hover:opacity-100">
          Perfil
        </Link>
      </nav>
    </div>
  );
}
