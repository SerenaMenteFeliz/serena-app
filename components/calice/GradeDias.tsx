import Link from "next/link";
import { IconeDia } from "./icons-dias";
import { LockIcon, CheckIcon } from "./icons";

export type EstadoDia = "concluido" | "atual" | "bloqueado";

export type DiaDaGrade = {
  order: number;
  /** título curto, já sem o "Dia N — " (usar `tituloAula`) */
  nome: string;
  estado: EstadoDia;
};

// Grade dos dias de prática — substituiu a lista vertical + a trilha de
// barrinhas (as duas diziam a mesma coisa empilhadas, e a lista gastava a
// altura da tela inteira).
//
// Serve prévia e pós-compra sem ramificar: o que muda é só o `estado` de
// cada dia. Manter assim é o que garante que um ajuste visual feito na
// vitrine apareça igual pra quem pagou.
//
// Dia bloqueado é LINK, não `<div>` inerte: a explicação de por que ele não
// abre vive no momento em que a pessoa esbarra na trava (ver o portão em
// `aulas/[order]`), não em rótulo de "grátis/limitado" espalhado pela
// vitrine. Se o card não for tocável, a pessoa nunca é barrada e a
// explicação nunca aparece.
export function GradeDias({ dias }: { dias: DiaDaGrade[] }) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {dias.map((d) => (
        <li key={d.order}>
          <CardDia dia={d} />
        </li>
      ))}
    </ul>
  );
}

function CardDia({ dia }: { dia: DiaDaGrade }) {
  const { order, nome, estado } = dia;
  const bloqueado = estado === "bloqueado";
  const atual = estado === "atual";

  // O bloqueado é o único card escuro da grade. Dois motivos: o cadeado passa
  // a ler como "conteúdo guardado" em vez de "desabilitado", e o roxo do quiz
  // volta pra dentro do produto sem precisar pintar a tela toda.
  const classe = bloqueado
    ? "surface-card-dark"
    : `glass-card ${atual ? "glass-card-strong" : ""}`;

  return (
    <Link
      href={`/metodo-calice/aulas/${order}`}
      aria-label={`Dia ${order} — ${nome}${bloqueado ? " (bloqueado)" : ""}`}
      className={`${classe} relative flex h-full min-h-[112px] flex-col items-center justify-start gap-1.5 px-2 pb-2.5 pt-3.5 text-center transition-transform active:scale-[0.97]`}
    >
      <span
        className="absolute right-1.5 top-1.5"
        style={{ color: bloqueado ? "var(--gold-soft)" : "var(--accent)" }}
      >
        {bloqueado ? (
          <LockIcon size={13} className="opacity-70" />
        ) : estado === "concluido" ? (
          <CheckIcon size={13} className="opacity-80" />
        ) : null}
      </span>

      <span
        style={{
          color: bloqueado
            ? "var(--gold-soft)"
            : atual
              ? "var(--deep-lavender)"
              : "var(--accent)",
        }}
      >
        <IconeDia order={order} size={24} />
      </span>

      <span
        className="font-veil-sans text-[9.5px] font-bold uppercase tracking-[0.1em]"
        style={{ color: bloqueado ? "var(--gold-soft)" : "var(--accent)", opacity: bloqueado ? 0.75 : 0.7 }}
      >
        Dia {order}
      </span>

      {/* o nome do dia fica legível mesmo bloqueado: borrar mataria o desejo,
          ninguém quer o que não consegue ler */}
      <span
        className={`font-veil-sans text-[11.5px] leading-[1.25] ${atual ? "font-bold" : "font-semibold"}`}
        style={{ color: bloqueado ? "var(--surface-dark-foreground)" : undefined, opacity: bloqueado ? 0.92 : 1 }}
      >
        {nome}
      </span>
    </Link>
  );
}
