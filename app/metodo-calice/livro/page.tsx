import Link from "next/link";
import { getProductAccessState } from "@/lib/access";
import { getChapters, getBookProgress, getCaliceOutline } from "@/lib/calice";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { LockIcon } from "@/components/calice/icons";

// Catálogo do livro. Como a rota das aulas, desde 15/08/2026 esta tela não
// expulsa mais quem não comprou — mostra os treze capítulos com o primeiro
// aberto e o resto trancado. Ver o comentário em `aulas/page.tsx`.
export default async function LivroPage() {
  const { contactId, owned } = await getProductAccessState("metodo_calice");

  if (!owned) {
    const { chapters } = await getCaliceOutline("metodo_calice");
    return (
      <CaliceShell>
        <h1 className="font-display text-2xl">Método Cálice — o livro</h1>
        <p className="mt-0.5 font-veil-sans text-xs opacity-55">
          A base teórica, em capítulos de leitura curta.
        </p>

        <ol className="mt-4 flex flex-col gap-2.5">
          {chapters.map((c, i) => {
            if (i === 0) {
              return (
                <li key={c.order_index}>
                  <Link
                    href={`/metodo-calice/livro/${c.order_index}`}
                    className="glass-card glass-card-strong flex items-center gap-3 px-4 py-3.5 transition-transform active:scale-[0.99]"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--deep-lavender)" }} />
                    <span className="min-w-0 flex-1 font-veil-sans text-sm font-bold leading-snug">{c.title}</span>
                  </Link>
                </li>
              );
            }
            // mesmo tratamento da grade de dias: tudo esmaecido e o cadeado
            // como único elemento nítido, e o card não responde ao toque
            return (
              <li
                key={c.order_index}
                className="glass-card flex cursor-default select-none items-center gap-3 px-4 py-3.5"
                style={{ background: "rgba(255,255,255,0.28)", borderColor: "rgba(255,255,255,0.55)", boxShadow: "none" }}
              >
                <span className="min-w-0 flex-1 font-veil-sans text-sm font-medium leading-snug opacity-50">
                  {c.title}
                </span>
                <span
                  role="img"
                  aria-label="bloqueado"
                  className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--surface-dark)", color: "var(--gold-soft)" }}
                >
                  <LockIcon size={11} />
                </span>
              </li>
            );
          })}
        </ol>
      </CaliceShell>
    );
  }

  const [chapters, progress] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
  ]);

  const lidos = Math.min(progress.last_chapter_order, chapters.length);
  const atual = chapters.find((c) => c.order_index > progress.last_chapter_order)?.order_index;

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

      <ol className="mt-4 flex flex-col gap-2.5">
        {chapters.map((c) => {
          const lido = c.order_index <= progress.last_chapter_order;
          const ehAtual = c.order_index === atual && !progress.completed;
          const dot = lido ? "var(--gold)" : ehAtual ? "var(--deep-lavender)" : "color-mix(in srgb, var(--ink) 25%, transparent)";
          return (
            <li key={c.order_index}>
              <Link
                href={`/metodo-calice/livro/${c.order_index}`}
                className={`glass-card flex items-center gap-3 px-4 py-3.5 ${ehAtual ? "glass-card-strong" : ""}`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: dot }} />
                {/* título já se auto-descreve ("Capítulo 3.1 · ..."), não numerar */}
                <span className={`min-w-0 flex-1 font-veil-sans text-sm leading-snug ${ehAtual ? "font-bold" : "font-medium"}`}>
                  {c.title}
                </span>
                {(lido || ehAtual) && (
                  <span className="shrink-0 font-veil-sans text-[10.5px] font-bold" style={{ color: dot }}>
                    {lido ? "lido" : "atual"}
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
