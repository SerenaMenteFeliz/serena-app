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
          // aba ativa ganha ponto dourado embaixo: peso de fonte sozinho é
          // sinal fraco demais pra barra de navegação, e a barra é justamente
          // o elemento que faz o produto parecer app
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex flex-col items-center gap-1 px-2 py-1 transition-opacity ${
              active ? "font-semibold" : "opacity-55 hover:opacity-100"
            }`}
            style={{ color: "var(--ink)" }}
          >
            {item.label}
            <span
              className="h-[3px] w-[3px] rounded-full"
              style={{ background: active ? "var(--gold)" : "transparent" }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
