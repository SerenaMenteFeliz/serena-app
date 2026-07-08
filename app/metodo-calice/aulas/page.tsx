import Link from "next/link";
import { requireProductAccess } from "@/lib/access";
import { getLessons, getCompletedLessonIds } from "@/lib/calice";
import { AppShell } from "@/components/AppShell";

export default async function AulasPage() {
  const { contactId } = await requireProductAccess("metodo_calice");
  const [lessons, completedIds] = await Promise.all([
    getLessons("metodo_calice"),
    getCompletedLessonIds(contactId, "metodo_calice"),
  ]);

  return (
    <AppShell
      theme="metodo-calice"
      homeHref="/metodo-calice"
      extraNav={[
        { href: "/metodo-calice/livro", label: "Livro" },
        { href: "/metodo-calice/aulas", label: "Aulas" },
      ]}
    >
      <h1 className="text-2xl font-semibold mb-6">Aulas práticas</h1>
      <ol className="flex flex-col gap-2">
        {lessons.map((l) => (
          <li key={l.id}>
            <Link href={`/metodo-calice/aulas/${l.order_index}`} className="surface-card block px-4 py-3">
              <span className="opacity-60 mr-2">{l.order_index}.</span>
              {l.title}
              {completedIds.has(l.id) && <span className="ml-2 text-xs opacity-60">concluída</span>}
            </Link>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
