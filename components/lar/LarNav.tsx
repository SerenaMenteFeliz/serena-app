"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/lar-interior", label: "Início", exact: true },
  { href: "/lar-interior/sessoes", label: "Sessões" },
  { href: "/lar-interior/bonus", label: "Bônus" },
  { href: "/perfil", label: "Perfil" },
];

// Nav flutuante de vidro do Lar Interior — client só pra saber a rota ativa.
export function LarNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-nav text-[13px]" aria-label="Lar Interior">
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
