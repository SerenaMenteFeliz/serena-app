import { notFound, redirect } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { getLessonByOrder, getLessonsWithProgress } from "@/lib/calice";
import { marcarAulaConcluida } from "@/lib/actions/calice";
import { AppShell } from "@/components/AppShell";
import { LessonBlockRenderer } from "@/components/LessonBlockRenderer";

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

  const marcarConcluidaComArgs = marcarAulaConcluida.bind(null, lesson.id, orderNum);

  return (
    <AppShell
      theme="metodo-calice"
      homeHref="/metodo-calice"
      extraNav={[
        { href: "/metodo-calice/livro", label: "Livro" },
        { href: "/metodo-calice/aulas", label: "Aulas" },
      ]}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 className="text-2xl font-semibold">{lesson.title}</h1>
        {lesson.blocks.map((block) => (
          <LessonBlockRenderer key={block.id} block={block} />
        ))}

        <form action={marcarConcluidaComArgs}>
          <button
            type="submit"
            disabled={jaConcluida}
            className="rounded px-4 py-2 font-medium disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            {jaConcluida ? "Aula concluída" : "Marcar aula como concluída"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
