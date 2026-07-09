import Link from "next/link";
import { requireProductAccess } from "@/lib/access";
import { getLessonsWithProgress } from "@/lib/calice";
import { AppShell } from "@/components/AppShell";

export default async function AulasPage() {
  const { contactId } = await requireProductAccess("metodo_calice");
  const lessons = await getLessonsWithProgress(contactId, "metodo_calice");

  return (
    <AppShell
      theme="metodo-calice"
      homeHref="/metodo-calice"
      extraNav={[
        { href: "/metodo-calice/livro", label: "Livro" },
        { href: "/metodo-calice/aulas", label: "Aulas" },
      ]}
    >
      <h1 className="font-display text-2xl mb-6">Aulas práticas</h1>
      <ol className="flex flex-col gap-2">
        {lessons.map((l) =>
          l.locked ? (
            <li
              key={l.id}
              className="surface-card flex items-center justify-between px-4 py-3 opacity-50"
            >
              <span>
                <span className="opacity-60 mr-2">{l.order_index}.</span>
                {l.title}
              </span>
              <span className="text-xs">🔒</span>
            </li>
          ) : (
            <li key={l.id}>
              <Link href={`/metodo-calice/aulas/${l.order_index}`} className="surface-card block px-4 py-3">
                <span className="opacity-60 mr-2">{l.order_index}.</span>
                {l.title}
                {l.completed && <span className="ml-2 text-xs opacity-60">concluída</span>}
              </Link>
            </li>
          )
        )}
      </ol>
    </AppShell>
  );
}
