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

// Nome de vitrine de cada dia — curto de propósito, pra caber sempre nas
// mesmas duas linhas e a grade fechar alinhada (15/08/2026). O título de
// verdade continua vindo do banco e aparece inteiro na aula e no portão;
// aqui o card só precisa dar o tema.
//
// Fallback: dia sem entrada usa o título do banco. Se a Ge adicionar um 11º
// dia, a grade não quebra — só fica com um card de texto mais longo até
// alguém apelidar.
const NOME_CURTO: Record<number, string> = {
  1: "Detox Mental",
  2: "O Despejo",
  3: "O Corpo Fala",
  4: "A Voz Invisível",
  5: "O Silêncio",
  6: "A Linguagem",
  7: "O Ambiente",
  8: "A Identidade",
  9: "O Campo",
  10: "A Integração",
};

// Grade dos dias de prática — substituiu a lista vertical + a trilha de
// barrinhas (as duas diziam a mesma coisa empilhadas, e a lista gastava a
// altura da tela inteira).
//
// Serve prévia e pós-compra sem ramificar: o que muda é só o `estado` de
// cada dia. Manter assim é o que garante que um ajuste visual feito na
// vitrine apareça igual pra quem pagou.
export function GradeDias({ dias }: { dias: DiaDaGrade[] }) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {dias.map((d) => (
        <li key={d.order} className="flex">
          <CardDia dia={d} />
        </li>
      ))}
    </ul>
  );
}

// Casca visual comum aos três estados. O card bloqueado é `<div>`, não link:
// decisão do Yan (15/08/2026) depois de ver a grade no ar — clicar num dia
// trancado e ser mandado pra uma tela de oferta é atrito, e a trava fica
// mais honesta se o card simplesmente não responde ao toque.
//
// O `PortaoTrancado` continua existindo e não virou código morto: ele cobre
// quem chega por URL direta (link compartilhado, histórico do navegador) e
// quem já comprou mas tenta pular a ordem dos dias.
function CardDia({ dia }: { dia: DiaDaGrade }) {
  const { order, estado } = dia;
  const nome = NOME_CURTO[order] ?? dia.nome;
  const bloqueado = estado === "bloqueado";
  const atual = estado === "atual";

  // Roxo só no dia em que a pessoa está (decisão do Yan, 15/08/2026): quando
  // os nove bloqueados eram escuros, o peso ia todo pro que ela não pode
  // fazer. Agora o único card escuro da grade é o próximo passo dela.
  const conteudo = (
    <>
      {/* no card bloqueado o cadeado é o ÚNICO elemento em contraste cheio —
          ícone, rótulo e nome ficam esmaecidos em volta dele. É o contraste
          que comunica a trava, não a opacidade sozinha: card só apagado lê
          como "carregando", card apagado com um cadeado nítido lê como
          "fechado" */}
      <span
        className={
          bloqueado
            ? "absolute right-1.5 top-1.5 flex h-[19px] w-[19px] items-center justify-center rounded-full"
            : "absolute right-1.5 top-1.5"
        }
        style={
          bloqueado
            ? { background: "var(--surface-dark)", color: "var(--gold-soft)" }
            : { color: atual ? "var(--gold-soft)" : "var(--accent)" }
        }
      >
        {bloqueado ? (
          <LockIcon size={11} />
        ) : estado === "concluido" ? (
          <CheckIcon size={13} className="opacity-80" />
        ) : null}
      </span>

      <span
        style={{
          color: atual ? "var(--gold-soft)" : "var(--accent)",
          opacity: bloqueado ? 0.38 : 1,
        }}
      >
        <IconeDia order={order} size={24} />
      </span>

      <span
        className="font-veil-sans text-[9.5px] font-bold uppercase tracking-[0.1em]"
        style={{
          color: atual ? "var(--gold-soft)" : "var(--accent)",
          opacity: bloqueado ? 0.45 : 0.7,
        }}
      >
        Dia {order}
      </span>

      {/* caixa de duas linhas fixas: o nome curto quase sempre cabe em uma ou
          duas, e reservar a altura das duas mantém ícone, rótulo e título na
          mesma linha em todos os nove cards, independente do texto */}
      <span
        className="flex h-[28px] items-start justify-center overflow-hidden font-veil-sans text-[11.5px] leading-[1.22]"
        style={{ opacity: bloqueado ? 0.5 : 1 }}
      >
        <span className={atual ? "font-bold" : "font-semibold"}>{nome}</span>
      </span>
    </>
  );

  const classeBase =
    "relative flex h-full w-full flex-col items-center justify-start gap-1.5 px-2 pb-2.5 pt-3.5 text-center";

  if (bloqueado) {
    return (
      <div
        aria-label={`Dia ${order} — ${nome} (bloqueado)`}
        aria-disabled
        className={`glass-card ${classeBase} cursor-default select-none`}
        style={{
          background: "rgba(255,255,255,0.28)",
          borderColor: "rgba(255,255,255,0.55)",
          boxShadow: "none",
        }}
      >
        {conteudo}
      </div>
    );
  }

  return (
    <Link
      href={`/metodo-calice/aulas/${order}`}
      aria-label={`Dia ${order} — ${nome}`}
      className={`${atual ? "veil-sanctuary" : "glass-card"} ${classeBase} rounded-[20px] transition-transform active:scale-[0.97]`}
    >
      {conteudo}
    </Link>
  );
}
