import Link from "next/link";
import { PRODUCT_PRICE, formatPrice } from "@/lib/pricing";
import { CaliceShell } from "./CaliceShell";
import { IconeDia } from "./icons-dias";
import { ChevronLeftIcon, LockIcon, SparkleIcon } from "./icons";

// O único lugar do produto que fala em conteúdo trancado.
//
// Decisão do Yan (15/08/2026): a vitrine não anuncia "grátis" nem "limitado"
// em lugar nenhum — nem selo no livro, nem "fazer grátis" no primeiro dia,
// nem "1 liberado", nem "13 capítulos no total". A oferta aparece só quando a
// pessoa tenta abrir algo que não está liberado e é barrada aqui.
//
// Antes disso, o comportamento era um `redirect()` mudo pra /comprar: a
// pessoa perdia o contexto do que tinha tentado abrir e caía numa página de
// venda sem nexo. Aqui ela continua vendo o dia/capítulo que quis.
export function PortaoTrancado({
  tipo,
  order,
  nome,
  voltarHref,
  motivo = "compra",
  proximoHref,
}: {
  tipo: "dia" | "capitulo";
  /** order_index — no dia, também escolhe o ícone */
  order: number;
  /** nome curto, já sem o "Dia N — " / "Capítulo N ·" */
  nome: string;
  voltarHref: string;
  /**
   * `compra` — não comprou ainda, a saída é a oferta.
   * `sequencia` — já comprou, mas os dias abrem em ordem. Mesmo tratamento
   * visual de propósito: quem pagou também esbarra numa trava, e também
   * merece saber por quê em vez de ser jogado de volta na lista em silêncio.
   */
  motivo?: "compra" | "sequencia";
  /** para `sequencia`: o dia que a pessoa precisa fazer agora */
  proximoHref?: string;
}) {
  const { value } = PRODUCT_PRICE.metodo_calice;
  const rotulo = tipo === "dia" ? `Dia ${order}` : "Capítulo";
  const porCompra = motivo === "compra";

  return (
    <CaliceShell nav={false}>
      <div className="flex items-center justify-between">
        <Link
          href={voltarHref}
          aria-label="Voltar"
          className="-ml-1 p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <ChevronLeftIcon />
        </Link>
        <span className="w-7" aria-hidden />
      </div>

      <div className="surface-card-dark relative mt-4 overflow-hidden px-5 py-7 text-center">
        <div
          className="absolute -right-4 -top-4 h-[110px] w-[110px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
        <div
          className="absolute left-1/2 top-6 h-[124px] w-[124px] -translate-x-1/2 rounded-full"
          style={{ border: "1px dashed color-mix(in srgb, var(--gold) 40%, transparent)" }}
        />

        <span className="relative inline-flex" style={{ color: "var(--gold-soft)" }}>
          {tipo === "dia" ? <IconeDia order={order} size={44} /> : <LockIcon size={40} />}
        </span>

        <p
          className="relative mt-4 font-veil-sans text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--gold-soft)" }}
        >
          {rotulo}
        </p>
        <p className="relative mt-1 font-display text-[22px] italic leading-snug">{nome}</p>

        <p className="relative mx-auto mt-4 max-w-[280px] font-veil-sans text-[13px] leading-relaxed opacity-80">
          {!porCompra
            ? "Os dias abrem em ordem — cada prática prepara a seguinte. Conclua o dia anterior e este se abre."
            : tipo === "dia"
              ? "Esta prática faz parte da jornada completa. Ela abre junto com os outros dias e com o livro inteiro."
              : "Este capítulo faz parte do livro completo, que abre junto com os dez dias de prática."}
        </p>

        <Link
          href={porCompra ? "/comprar/metodo-calice" : (proximoHref ?? voltarHref)}
          className="relative mt-5 inline-flex items-center justify-center gap-2 rounded-[18px] px-6 py-3 font-veil-sans text-sm font-bold"
          style={{ background: "var(--gold)", color: "#2b1e42" }}
        >
          <SparkleIcon size={16} />{" "}
          {porCompra ? `Abrir o Método Cálice — ${formatPrice(value)}` : "Ir para a sua prática de hoje"}
        </Link>
      </div>

      <Link
        href={voltarHref}
        className="mt-4 block text-center font-veil-sans text-[12px] opacity-50 transition-opacity hover:opacity-80"
      >
        voltar
      </Link>
    </CaliceShell>
  );
}
