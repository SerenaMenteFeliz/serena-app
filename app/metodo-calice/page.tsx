import Link from "next/link";
import { requireProductAccess } from "@/lib/access";
import { AppShell } from "@/components/AppShell";
import { PortalArch } from "@/components/PortalArch";

export default async function MetodoCalicePage() {
  await requireProductAccess("metodo_calice");

  return (
    <AppShell
      theme="metodo-calice"
      homeHref="/metodo-calice"
      showHubLink
      extraNav={[
        { href: "/metodo-calice/livro", label: "Livro" },
        { href: "/metodo-calice/aulas", label: "Aulas" },
      ]}
    >
      <div className="flex flex-col items-center gap-6 pt-8 text-center">
        <h1 className="text-2xl font-semibold">Método Cálice</h1>
        <Link href="/metodo-calice/livro" className="group">
          <PortalArch width={200} height={280}>
            <div
              className="flex h-[220px] w-[150px] flex-col items-center justify-center rounded-sm p-4 text-center shadow-2xl transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(160deg, #2a1a4d, #120a24)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              <span className="text-sm tracking-widest opacity-70">O LIVRO</span>
              <span className="mt-2 font-serif text-lg">Método Cálice</span>
            </div>
          </PortalArch>
        </Link>
        <p className="max-w-xs opacity-80">Toque no livro para entrar na leitura.</p>
        <Link href="/metodo-calice/aulas" className="underline opacity-80">
          Ir para as aulas práticas
        </Link>
      </div>
    </AppShell>
  );
}
