import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { getChapter, getChapters, saveBookProgress, evaluateCompletion } from "@/lib/calice";
import { notesFeatureEnabled, getNote } from "@/lib/calice-notes";
import { guardarNota } from "@/lib/actions/calice";
import { tituloCapitulo } from "@/lib/calice-format";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { BookReader } from "@/components/BookReader";
import { ChapterNote } from "@/components/calice/ChapterNote";
import { ChevronLeftIcon } from "@/components/calice/icons";

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

  const notasOn = await notesFeatureEnabled();
  const nota = notasOn ? await getNote(contactId, "metodo_calice", orderNum) : null;

  const { rotulo, nome } = tituloCapitulo(chapter.title);

  return (
    <CaliceShell nav={false}>
      <div className="flex items-center justify-between">
        <Link href="/metodo-calice/livro" aria-label="Voltar pro livro" className="-ml-1 p-1 opacity-70 transition-opacity hover:opacity-100">
          <ChevronLeftIcon />
        </Link>
        <span className="font-veil-sans text-[11px] font-semibold uppercase tracking-[0.08em] opacity-55">
          {rotulo ?? "O livro"}
        </span>
        {/* espelho do botão de voltar, pra manter o label centrado */}
        <span className="w-7" aria-hidden />
      </div>

      <h1 className="font-display mb-4 mt-3 text-center text-[21px] italic leading-snug">
        {nome}
      </h1>

      <BookReader
        bodyMd={chapter.body_md}
        prevHref={anterior ? `/metodo-calice/livro/${anterior.order_index}` : null}
        nextHref={proximo ? `/metodo-calice/livro/${proximo.order_index}` : null}
        endHref="/metodo-calice/livro"
      />

      {notasOn && (
        <ChapterNote initialBody={nota?.body ?? ""} action={guardarNota.bind(null, orderNum)} />
      )}
    </CaliceShell>
  );
}
