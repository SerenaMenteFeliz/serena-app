import Link from "next/link";
import { getProductAccessState } from "@/lib/access";
import { getChapters, getBookProgress, getCaliceOutline } from "@/lib/calice";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { ListaCapitulos, type EstadoCapitulo } from "@/components/calice/ListaCapitulos";

// Catálogo do livro. Como a rota das aulas, desde 15/08/2026 esta tela não
// expulsa mais quem não comprou — mostra os treze capítulos com o primeiro
// aberto e o resto trancado. Ver o comentário em `aulas/page.tsx`.
//
// A lista em si mora em `ListaCapitulos`, compartilhada com a versão paga:
// separada, as duas divergiam, e era a mesma lista vista de dois jeitos.
export default async function LivroPage() {
  const { contactId, owned } = await getProductAccessState("metodo_calice");

  if (!owned) {
    const { chapters } = await getCaliceOutline("metodo_calice");
    const lista = chapters.map((c, i) => ({
      order: c.order_index,
      title: c.title,
      estado: (i === 0 ? "atual" : "bloqueado") as EstadoCapitulo,
    }));

    return (
      <CaliceShell>
        <h1 className="font-display text-2xl">Método Cálice — o livro</h1>
        <p className="mt-0.5 font-veil-sans text-xs opacity-55">
          A base teórica, em capítulos de leitura curta.
        </p>
        <ListaCapitulos capitulos={lista} />
      </CaliceShell>
    );
  }

  const [chapters, progress] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
  ]);

  const lidos = Math.min(progress.last_chapter_order, chapters.length);
  const atual = chapters.find((c) => c.order_index > progress.last_chapter_order)?.order_index;

  const lista = chapters.map((c) => ({
    order: c.order_index,
    title: c.title,
    estado: (c.order_index <= progress.last_chapter_order
      ? "lido"
      : c.order_index === atual && !progress.completed
        ? "atual"
        : "aberto") as EstadoCapitulo,
  }));

  return (
    <CaliceShell>
      <h1 className="font-display text-2xl">Método Cálice — o livro</h1>
      <p className="mt-0.5 font-veil-sans text-xs opacity-55">
        {progress.completed
          ? `livro concluído — os ${chapters.length} capítulos lidos`
          : `${lidos} de ${chapters.length} capítulos lidos`}
      </p>

      {atual != null && lidos > 0 && !progress.completed && (
        <Link href={`/metodo-calice/livro/${atual}`} className="surface-card-dark mt-4 block px-4 py-3.5">
          <p className="font-veil-sans text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--gold-soft)" }}>
            Marcador de página — continuar de
          </p>
          <p className="mt-1 font-display text-[15px]">
            {chapters.find((c) => c.order_index === atual)?.title}
          </p>
        </Link>
      )}

      <ListaCapitulos capitulos={lista} />
    </CaliceShell>
  );
}
