import Link from "next/link";
import { requireAuth, getActiveProducts } from "@/lib/access";
import { AppShell } from "@/components/AppShell";

const CATALOGO = [
  { slug: "lar_interior", nome: "Lar Interior", href: "/lar-interior" },
  { slug: "metodo_calice", nome: "Método Cálice", href: "/metodo-calice" },
] as const;

export default async function HubPage() {
  const { contactId } = await requireAuth();
  const produtos = await getActiveProducts(contactId);

  return (
    <AppShell theme="hub" homeHref="/hub">
      <h1 className="text-2xl font-semibold mb-6">Seus produtos</h1>
      <ul className="flex flex-col gap-3">
        {CATALOGO.map((item) => {
          const liberado = produtos.includes(item.slug);
          return (
            <li key={item.slug}>
              {liberado ? (
                <Link href={item.href}>{item.nome}</Link>
              ) : (
                <span aria-disabled title="Ainda não liberado">
                  {item.nome} — bloqueado
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
