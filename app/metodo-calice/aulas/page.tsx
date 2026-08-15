import { getProductAccessState } from "@/lib/access";
import { getLessonsWithProgress, getCaliceOutline } from "@/lib/calice";
import { tituloAula } from "@/lib/calice-format";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { GradeDias, type EstadoDia } from "@/components/calice/GradeDias";

// Catálogo das práticas. Desde 15/08/2026 esta rota NÃO expulsa mais quem não
// comprou (era `requireProductAccess` → redirect mudo pro /hub): ela mostra a
// jornada inteira com os dias trancados, do mesmo jeito que a home já fazia.
//
// O motivo é a nav: com esta rota e a do livro barrando o visitante, ligar a
// barra de navegação na prévia daria duas abas funcionando e duas armadilhas.
// E era o mesmo bounce silencioso que já tinha saído das telas de aula e de
// capítulo — sobrou só aqui e no livro.
export default async function AulasPage() {
  const { contactId, owned } = await getProductAccessState("metodo_calice");

  if (!owned) {
    const { lessons } = await getCaliceOutline("metodo_calice");
    const grade = lessons.map((l, i) => ({
      order: l.order_index,
      nome: tituloAula(l.title),
      estado: (i === 0 ? "atual" : "bloqueado") as EstadoDia,
    }));

    return (
      <CaliceShell>
        <h1 className="font-display text-2xl">Aulas práticas</h1>
        <p className="mt-0.5 font-veil-sans text-xs opacity-55">
          Dez dias, um de cada vez — cada prática prepara a seguinte.
        </p>
        <div className="mt-4">
          <GradeDias dias={grade} />
        </div>
      </CaliceShell>
    );
  }

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
