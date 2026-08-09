import { QUIZ_URL, type Arquetipo } from "@/lib/arquetipo";
import { SparkleIcon, ChevronRightIcon } from "@/components/icons";

// Devolve pra dentro do app o resultado que a pessoa recebeu no Quiz
// Diagnóstico. Quem não fez o quiz (cadastro direto no app) vê o convite, não
// um espaço vazio nem um padrão chutado — campo vazio pede pra ser
// preenchido, palpite ensina a desconfiar da ferramenta.
export function ArquetipoCard({ arquetipo }: { arquetipo: Arquetipo | null }) {
  if (!arquetipo) {
    return (
      <a
        href={QUIZ_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card mt-4 flex items-center gap-3 px-4 py-3.5"
      >
        <SparkleIcon size={16} className="shrink-0 opacity-60" />
        <div className="min-w-0 flex-1">
          <p className="font-veil-sans text-sm font-bold leading-snug">Descubra o seu padrão</p>
          <p className="mt-0.5 font-veil-sans text-[12px] leading-relaxed opacity-60">
            O diagnóstico leva 2 minutos e diz qual dos 4 códigos roda em você.
          </p>
        </div>
        <ChevronRightIcon className="shrink-0 opacity-45" />
      </a>
    );
  }

  return (
    <div className="surface-card-dark relative mt-4 overflow-hidden px-[18px] py-4">
      <div
        className="absolute -right-2.5 -top-2.5 h-[60px] w-[60px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
      />
      <p
        className="font-veil-sans text-[10px] font-bold uppercase tracking-[0.1em]"
        style={{ color: "var(--gold-soft)" }}
      >
        Seu padrão · {arquetipo.label}
      </p>
      <p className="mt-1.5 font-display text-base italic leading-snug">{arquetipo.eco}</p>
    </div>
  );
}
