import Link from "next/link";
import { requireProductAccess } from "@/lib/access";
import { getChapters, getBookProgress } from "@/lib/calice";
import { AppShell } from "@/components/AppShell";

export default async function LivroPage() {
  const { contactId } = await requireProductAccess("metodo_calice");
  const [chapters, progress] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
  ]);

  const proximoCapitulo = progress.completed
    ? chapters[0]?.order_index
    : chapters.find((c) => c.order_index > progress.last_chapter_order)?.order_index ??
      progress.last_chapter_order ??
      chapters[0]?.order_index;

  return (
    <AppShell
      theme="metodo-calice"
      homeHref="/metodo-calice"
      extraNav={[
        { href: "/metodo-calice/livro", label: "Livro" },
        { href: "/metodo-calice/aulas", label: "Aulas" },
      ]}
    >
      <h1 className="font-display text-2xl mb-2">Método Cálice — o livro</h1>
      {progress.last_chapter_order > 0 && !progress.completed && (
        <p className="mb-6 opacity-80">
          Você parou no capítulo {progress.last_chapter_order}.{" "}
          <Link href={`/metodo-calice/livro/${proximoCapitulo}`} className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
            Continuar de onde parou
          </Link>
        </p>
      )}
      {progress.completed && <p className="mb-6 opacity-80">Livro concluído. 🎉</p>}

      <ol className="flex flex-col gap-2">
        {chapters.map((c) => (
          <li key={c.order_index}>
            <Link href={`/metodo-calice/livro/${c.order_index}`} className="surface-card block px-4 py-3">
              <span className="opacity-60 mr-2">{c.order_index}.</span>
              {c.title}
              {c.order_index <= progress.last_chapter_order && (
                <span className="ml-2 text-xs opacity-60">lido</span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
