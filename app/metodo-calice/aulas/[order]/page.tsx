import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { getLessonByOrder, getLessonsWithProgress } from "@/lib/calice";
import { marcarAulaConcluida } from "@/lib/actions/calice";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { LessonBlockRenderer } from "@/components/LessonBlockRenderer";
import { ChevronLeftIcon, CheckIcon } from "@/components/calice/icons";

export default async function AulaPage({ params }: { params: Promise<{ order: string }> }) {
  const { order } = await params;
  const orderNum = Number(order);

  const { contactId } = await requireProductAccess("metodo_calice");
  const lesson = await getLessonByOrder("metodo_calice", orderNum);
  if (!lesson) notFound();

  const lessonsProgress = await getLessonsWithProgress(contactId, "metodo_calice");
  const progress = lessonsProgress.find((l) => l.id === lesson.id);
  if (progress?.locked) redirect("/metodo-calice/aulas");

  const jaConcluida = progress?.completed ?? false;
  const proxima = lessonsProgress.find((l) => l.order_index === orderNum + 1);

  const marcarConcluidaComArgs = marcarAulaConcluida.bind(null, lesson.id, orderNum);

  return (
    <CaliceShell nav={false}>
      <div className="flex items-center justify-between">
        <Link href="/metodo-calice/aulas" aria-label="Voltar pras aulas" className="-ml-1 p-1 opacity-70 transition-opacity hover:opacity-100">
          <ChevronLeftIcon />
        </Link>
        <span className="font-veil-sans text-[11px] font-semibold uppercase tracking-[0.08em] opacity-55">
          Dia {lesson.order_index} de {lessonsProgress.length}
        </span>
        <span className="w-7" aria-hidden />
      </div>

      <h1 className="font-display mt-3 text-[22px] italic leading-snug">{lesson.title}</h1>

      <div className="mt-4 flex flex-col gap-4">
        {lesson.blocks.map((block) => (
          <LessonBlockRenderer key={block.id} block={block} />
        ))}
      </div>

      <div className="mt-6">
        {jaConcluida ? (
          <>
            <div
              className="flex items-center justify-center gap-2 rounded-[20px] py-3.5 font-veil-sans text-sm font-bold"
              style={{ background: "color-mix(in srgb, var(--gold) 15%, transparent)", color: "var(--accent)" }}
            >
              <CheckIcon /> Aula concluída
            </div>
            {proxima && !proxima.locked && !proxima.completed && (
              <Link
                href={`/metodo-calice/aulas/${proxima.order_index}`}
                className="mt-3 block text-center font-veil-sans text-sm font-bold"
                style={{ color: "var(--accent)" }}
              >
                Ir pro Dia {proxima.order_index} — {proxima.title} ›
              </Link>
            )}
          </>
        ) : (
          <form action={marcarConcluidaComArgs}>
            <button
              type="submit"
              className="surface-card-dark w-full cursor-pointer rounded-[20px] py-3.5 font-veil-sans text-sm font-bold transition-transform active:scale-[0.99]"
              style={{ color: "var(--gold-soft)" }}
            >
              Concluir aula
            </button>
          </form>
        )}
      </div>
    </CaliceShell>
  );
}
