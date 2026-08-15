import { requireProductAccess } from "@/lib/access";
import { getLessonsWithProgress } from "@/lib/calice";
import { tituloAula } from "@/lib/calice-format";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { GradeDias, type EstadoDia } from "@/components/calice/GradeDias";

export default async function AulasPage() {
  const { contactId } = await requireProductAccess("metodo_calice");
  const lessons = await getLessonsWithProgress(contactId, "metodo_calice");
  const concluidas = lessons.filter((l) => l.completed).length;
  const atual = lessons.find((l) => !l.completed && !l.locked);

  // Mesma grade da home e da prévia (15/08/2026). A lista vertical daqui
  // divergia da vitrine em tudo — layout, ícone, tratamento do bloqueado — e
  // era a mesma jornada vista de dois jeitos.
  const grade = lessons.map((l) => ({
    order: l.order_index,
    nome: tituloAula(l.title),
    estado: (l.completed ? "concluido" : l.id === atual?.id ? "atual" : "bloqueado") as EstadoDia,
  }));

  return (
    <CaliceShell>
      <h1 className="font-display text-2xl">Aulas práticas</h1>
      <p className="mt-0.5 font-veil-sans text-xs opacity-55">
        {concluidas} de {lessons.length} concluídas
      </p>

      <div className="mt-4">
        <GradeDias dias={grade} />
      </div>
    </CaliceShell>
  );
}
