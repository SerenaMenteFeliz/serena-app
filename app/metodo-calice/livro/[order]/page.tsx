import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { requireProductAccess } from "@/lib/access";
import { getChapter, getChapters, saveBookProgress, evaluateCompletion } from "@/lib/calice";
import { AppShell } from "@/components/AppShell";

export default async function CapituloPage({ params }: { params: Promise<{ order: string }> }) {
  const { order } = await params;
  const orderNum = Number(order);

  const { contactId } = await requireProductAccess("metodo_calice");
  const [chapter, chapters] = await Promise.all([
    getChapter("metodo_calice", orderNum),
    getChapters("metodo_calice"),
  ]);

  if (!chapter) notFound();

  await saveBookProgress(contactId, "metodo_calice", orderNum);
  await evaluateCompletion(contactId, "metodo_calice");

  const proximo = chapters.find((c) => c.order_index === orderNum + 1);
  const anterior = chapters.find((c) => c.order_index === orderNum - 1);

  return (
    <AppShell
      theme="metodo-calice"
      homeHref="/metodo-calice"
      extraNav={[
        { href: "/metodo-calice/livro", label: "Livro" },
        { href: "/metodo-calice/aulas", label: "Aulas" },
      ]}
    >
      <article className="surface-card mx-auto max-w-2xl px-6 py-8">
        <p className="mb-1 text-sm opacity-60">Capítulo {chapter.order_index}</p>
        <h1 className="mb-6 text-2xl font-semibold">{chapter.title}</h1>
        <div className="prose prose-invert max-w-none leading-relaxed">
          <ReactMarkdown>{chapter.body_md}</ReactMarkdown>
        </div>
      </article>

      <div className="mx-auto mt-6 flex max-w-2xl justify-between">
        {anterior ? (
          <Link href={`/metodo-calice/livro/${anterior.order_index}`} className="underline opacity-80">
            ← {anterior.title}
          </Link>
        ) : (
          <span />
        )}
        {proximo ? (
          <Link href={`/metodo-calice/livro/${proximo.order_index}`} className="underline opacity-80">
            {proximo.title} →
          </Link>
        ) : (
          <span className="opacity-60">Fim do livro</span>
        )}
      </div>
    </AppShell>
  );
}
