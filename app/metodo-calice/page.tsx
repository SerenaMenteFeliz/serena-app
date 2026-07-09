import Link from "next/link";
import { requireProductAccess } from "@/lib/access";
import { getChapters, getBookProgress } from "@/lib/calice";
import { AppShell } from "@/components/AppShell";
import { PortalArch } from "@/components/PortalArch";

export default async function MetodoCalicePage() {
  const { contactId } = await requireProductAccess("metodo_calice");
  const [chapters, progress] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
  ]);

  const status = progress.completed
    ? "Livro concluído"
    : progress.last_chapter_order > 0
      ? `Capítulo ${progress.last_chapter_order} de ${chapters.length}`
      : "Toque no livro para começar";

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
      <div className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center gap-8 text-center">
        <div>
          <h1 className="font-serif text-3xl tracking-wide">Método Cálice</h1>
          <p className="mt-2 text-sm italic opacity-70">um caminho de reprogramação mental</p>
        </div>

        <Link href="/metodo-calice/livro" className="group">
          <PortalArch width={210} height={290}>
            <div
              className="book-cover flex h-[230px] w-[160px] flex-col items-center justify-between rounded-sm p-5 text-center transition-transform duration-300 group-hover:scale-105"
              style={{ background: "linear-gradient(160deg, #2e1c56, #150c2c)" }}
            >
              <span className="text-[11px] tracking-[0.3em] opacity-60">O LIVRO</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="book-ornament">
                <path d="M6 3h12l-1.2 8.4a4.8 4.8 0 0 1-4.8 4.1 4.8 4.8 0 0 1-4.8-4.1L6 3Z" />
                <path d="M12 15.5V19M9 21h6" strokeLinecap="round" />
              </svg>
              <span className="font-serif text-lg leading-tight">Método
                <br />Cálice</span>
            </div>
          </PortalArch>
        </Link>

        <p className="max-w-xs text-sm opacity-80">{status}</p>

        <Link href="/metodo-calice/aulas" className="pill-cta text-sm">
          Aulas práticas
          <span aria-hidden>→</span>
        </Link>
      </div>
    </AppShell>
  );
}
