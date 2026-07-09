import Link from "next/link";
import { requireProductAccess } from "@/lib/access";
import { getLessonsWithProgress } from "@/lib/calice";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { LockIcon } from "@/components/calice/icons";

export default async function AulasPage() {
  const { contactId } = await requireProductAccess("metodo_calice");
  const lessons = await getLessonsWithProgress(contactId, "metodo_calice");
  const concluidas = lessons.filter((l) => l.completed).length;

  return (
    <CaliceShell>
      <h1 className="font-display text-2xl">Aulas práticas</h1>
      <p className="mt-0.5 font-veil-sans text-xs opacity-55">
        {concluidas} de {lessons.length} concluídas
      </p>

      <ol className="mt-4 flex flex-col gap-2.5">
        {lessons.map((l) => {
          const atual = !l.completed && !l.locked;
          if (l.locked) {
            return (
              <li key={l.id} className="glass-card flex items-center gap-3 px-4 py-3.5" style={{ background: "rgba(255,255,255,0.4)" }}>
                {/* título já vem "Dia N — ..." do banco, não prefixar */}
                <span className="min-w-0 flex-1 font-veil-sans text-sm font-medium leading-snug opacity-40">
                  {l.title}
                </span>
                <LockIcon className="shrink-0 opacity-35" />
              </li>
            );
          }
          return (
            <li key={l.id}>
              <Link
                href={`/metodo-calice/aulas/${l.order_index}`}
                className={`glass-card flex items-center gap-3 px-4 py-3.5 ${atual ? "glass-card-strong" : ""}`}
              >
                <span
                  className={`min-w-0 flex-1 font-veil-sans text-sm leading-snug ${atual ? "font-bold" : "font-medium"}`}
                  style={atual ? { color: "color-mix(in srgb, var(--deep-lavender) 45%, var(--ink))" } : undefined}
                >
                  {l.title}
                </span>
                {l.completed && (
                  <span className="shrink-0 font-veil-sans text-[10.5px] font-bold" style={{ color: "var(--accent)" }}>
                    concluída
                  </span>
                )}
                {atual && (
                  <span className="shrink-0 font-veil-sans text-[10.5px] font-bold" style={{ color: "var(--deep-lavender)" }}>
                    hoje
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </CaliceShell>
  );
}
