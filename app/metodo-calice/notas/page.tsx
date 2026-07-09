import Link from "next/link";
import { requireProductAccess } from "@/lib/access";
import { getChapters, getBookProgress } from "@/lib/calice";
import { notesFeatureEnabled, getNotes } from "@/lib/calice-notes";
import { removerNota } from "@/lib/actions/calice";
import { CaliceShell } from "@/components/calice/CaliceShell";

export default async function NotasPage() {
  const { contactId } = await requireProductAccess("metodo_calice");
  const enabled = await notesFeatureEnabled();
  const [chapters, progress, notes] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
    enabled ? getNotes(contactId, "metodo_calice") : Promise.resolve([]),
  ]);

  const titulo = new Map(chapters.map((c) => [c.order_index, c.title]));
  const atual =
    chapters.find((c) => c.order_index > progress.last_chapter_order)?.order_index ??
    chapters[0]?.order_index;

  return (
    <CaliceShell>
      <h1 className="font-display text-2xl">Minhas anotações</h1>
      <p className="mt-0.5 font-veil-sans text-xs opacity-55">
        {notes.length > 0
          ? `${notes.length} ${notes.length === 1 ? "capítulo anotado" : "capítulos anotados"}`
          : "os pensamentos que a leitura acordar ficam aqui"}
      </p>

      {atual != null && !progress.completed && (
        <Link href={`/metodo-calice/livro/${atual}`} className="surface-card-dark mt-4 block px-4 py-3.5">
          <p className="font-veil-sans text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--gold-soft)" }}>
            Marcador de página — continuar de
          </p>
          <p className="mt-1 font-display text-[15px]">{titulo.get(atual)}</p>
        </Link>
      )}

      {!enabled ? (
        <p className="mt-10 text-center font-veil-sans text-[13px] leading-relaxed opacity-50">
          As anotações ainda não estão disponíveis por aqui.
          <br />
          Em breve.
        </p>
      ) : notes.length === 0 ? (
        <p className="mt-10 px-4 text-center font-veil-sans text-[13px] leading-relaxed opacity-50">
          Nenhuma anotação ainda. Durante a leitura, toque em
          {" “Anotar este capítulo” "}
          pra guardar um pensamento.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2.5">
          {notes.map((n) => (
            <li key={n.id} className="glass-card rounded-[14px] px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  href={`/metodo-calice/livro/${n.chapter_order}`}
                  className="font-veil-sans min-w-0 truncate text-[11px] font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {titulo.get(n.chapter_order) ?? `Capítulo ${n.chapter_order}`}
                </Link>
                <form action={removerNota.bind(null, n.chapter_order)}>
                  <button type="submit" className="font-veil-sans shrink-0 text-[11px] opacity-40 transition-opacity hover:opacity-70">
                    remover
                  </button>
                </form>
              </div>
              <p className="font-veil-sans mt-1 whitespace-pre-wrap text-[13px] leading-normal">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </CaliceShell>
  );
}
