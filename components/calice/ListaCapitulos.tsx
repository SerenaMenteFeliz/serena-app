import Link from "next/link";
import { tituloCapitulo } from "@/lib/calice-format";
import { LockIcon, CheckIcon } from "./icons";

export type EstadoCapitulo = "lido" | "atual" | "aberto" | "bloqueado";

export type CapituloDaLista = {
  order: number;
  /** título cru do banco ("Capítulo 3.1 · O Papel da Intuição") */
  title: string;
  estado: EstadoCapitulo;
};

// Lista de capítulos do livro, compartilhada pela vitrine e pela versão paga.
//
// O problema que ela resolve (15/08/2026): o livro tem 13 capítulos e **dez
// deles começam com as mesmas palavras** — "Capítulo 3.1 ·", "Capítulo 3.2 ·"
// e assim por diante, porque o Capítulo 3 original era longo demais e foi
// quebrado em dez partes. Numa lista chapada, com o título inteiro em cada
// linha, as dez ficam visualmente idênticas e o olho não acha nada.
//
// A correção tem duas partes: separar rótulo e nome (o rótulo vira etiqueta
// pequena, o nome ganha o peso) e agrupar as dez partes sob um divisor do
// Capítulo 3. O agrupamento é derivado do próprio rótulo, não é curadoria —
// nenhum título de grupo foi inventado.
export function ListaCapitulos({ capitulos }: { capitulos: CapituloDaLista[] }) {
  // "Capítulo 3.1" → grupo "3"; "Capítulo 1" e "Introdução" → sem grupo
  const grupoDe = (title: string) => {
    const { rotulo } = tituloCapitulo(title);
    const m = rotulo?.match(/(\d+)\.\d+/);
    return m ? m[1] : null;
  };

  const linhas: Array<{ tipo: "divisor"; grupo: string; total: number } | { tipo: "item"; cap: CapituloDaLista }> = [];
  for (const cap of capitulos) {
    const g = grupoDe(cap.title);
    const anterior = linhas.filter((l) => l.tipo === "item").slice(-1)[0];
    const gAnterior = anterior && anterior.tipo === "item" ? grupoDe(anterior.cap.title) : null;
    if (g && g !== gAnterior) {
      linhas.push({
        tipo: "divisor",
        grupo: g,
        total: capitulos.filter((c) => grupoDe(c.title) === g).length,
      });
    }
    linhas.push({ tipo: "item", cap });
  }

  return (
    <ol className="mt-4 flex flex-col gap-2">
      {linhas.map((l, i) =>
        l.tipo === "divisor" ? (
          <li key={`d-${l.grupo}`} className={i === 0 ? "" : "mt-3"}>
            <div className="flex items-center gap-2.5 px-1">
              <span
                className="font-veil-sans text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "var(--accent)" }}
              >
                Capítulo {l.grupo}
              </span>
              <span className="h-px flex-1" style={{ background: "color-mix(in srgb, var(--ink) 14%, transparent)" }} />
              <span className="font-veil-sans text-[10px] opacity-45">{l.total} partes</span>
            </div>
          </li>
        ) : (
          <li key={l.cap.order}>
            <LinhaCapitulo cap={l.cap} agrupado={grupoDe(l.cap.title) != null} />
          </li>
        ),
      )}
    </ol>
  );
}

function LinhaCapitulo({ cap, agrupado }: { cap: CapituloDaLista; agrupado: boolean }) {
  const { rotulo, nome } = tituloCapitulo(cap.title);
  // dentro do grupo o rótulo perde a palavra repetida: "Capítulo 3.1" → "3.1"
  const etiqueta = agrupado ? rotulo?.replace(/^cap[ií]tulo\s*/i, "") : rotulo;

  const bloqueado = cap.estado === "bloqueado";
  const atual = cap.estado === "atual";
  const lido = cap.estado === "lido";

  const conteudo = (
    <>
      {/* etiqueta em coluna própria e largura fixa: alinha o começo de todos
          os nomes, que é o que faz a lista ser varrida com o olho */}
      <span
        className="w-[38px] shrink-0 font-veil-sans text-[10.5px] font-bold uppercase tracking-[0.06em]"
        style={{
          color: lido ? "var(--gold)" : atual ? "var(--deep-lavender)" : "var(--accent)",
          opacity: bloqueado ? 0.4 : 0.85,
        }}
      >
        {etiqueta ?? ""}
      </span>

      <span
        className={`min-w-0 flex-1 font-veil-sans text-[13.5px] leading-snug ${atual ? "font-bold" : "font-semibold"}`}
        style={{ opacity: bloqueado ? 0.5 : 1 }}
      >
        {nome}
      </span>

      {bloqueado ? (
        <span
          role="img"
          aria-label="bloqueado"
          className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--surface-dark)", color: "var(--gold-soft)" }}
        >
          <LockIcon size={11} />
        </span>
      ) : lido ? (
        <CheckIcon size={14} className="shrink-0" />
      ) : atual ? (
        <span
          className="shrink-0 font-veil-sans text-[10px] font-bold uppercase tracking-[0.08em]"
          style={{ color: "var(--deep-lavender)" }}
        >
          atual
        </span>
      ) : null}
    </>
  );

  const classeBase = "flex items-center gap-3 px-3.5 py-3";

  if (bloqueado) {
    return (
      <div
        className={`glass-card ${classeBase} cursor-default select-none`}
        style={{ background: "rgba(255,255,255,0.28)", borderColor: "rgba(255,255,255,0.55)", boxShadow: "none" }}
      >
        {conteudo}
      </div>
    );
  }

  return (
    <Link
      href={`/metodo-calice/livro/${cap.order}`}
      className={`glass-card ${atual ? "glass-card-strong" : ""} ${classeBase} transition-transform active:scale-[0.99]`}
    >
      {conteudo}
    </Link>
  );
}
