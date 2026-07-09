import { notFound } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { getChapter, getChapters, saveBookProgress, evaluateCompletion } from "@/lib/calice";
import { AppShell } from "@/components/AppShell";
import { BookReader } from "@/components/BookReader";

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
      <p className="mx-auto mb-3 max-w-2xl text-center text-sm opacity-60">
        Capítulo {chapter.order_index} · {chapter.title}
      </p>
      <BookReader
        bodyMd={chapter.body_md}
        prevHref={anterior ? `/metodo-calice/livro/${anterior.order_index}` : null}
        nextHref={proximo ? `/metodo-calice/livro/${proximo.order_index}` : null}
      />
    </AppShell>
  );
}
