"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/metodo-calice", label: "Início", exact: true },
  { href: "/metodo-calice/livro", label: "Livro" },
  { href: "/metodo-calice/aulas", label: "Aulas" },
  { href: "/perfil", label: "Perfil" },
];

// Nav flutuante de vidro (Santuário + Véu) — client só pra saber a rota ativa.
export function CaliceNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-nav font-veil-sans text-[13px]" aria-label="Método Cálice">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`px-2 py-1 transition-opacity ${active ? "font-semibold" : "opacity-60 hover:opacity-100"}`}
            style={{ color: "var(--ink)" }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
