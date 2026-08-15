// Um ícone por dia da prática do Método Cálice, no mesmo traço de 1.5px dos
// ícones compartilhados. Dez cadeados iguais fazem uma lista; dez desenhos
// diferentes fazem um produto — o ícone é o que dá identidade ao dia antes
// de a pessoa poder abri-lo, e é o que sustenta o desejo enquanto está
// bloqueado (o título continua legível, ver a prévia em /metodo-calice).
//
// A ordem do array é a ordem real das aulas no banco (order_index 1..10):
// 1 Detox Mental · 2 O Despejo · 3 O Corpo Fala · 4 A Voz Invisível
// 5 O Silêncio Como Ferramenta · 6 A Linguagem que Cria · 7 O Ambiente como Sinal
// 8 A Identidade que Você Escolhe · 9 O Campo e a Coerência · 10 A Integração
import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string };

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

// 1 — Detox Mental: a cabeça e a espiral se desfazendo (o ruído saindo)
function Dia1({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3.2c-3.6 0-6.2 2.6-6.2 5.9 0 1.9.8 3.2.8 4.6 0 1-.6 1.6-.6 2.4 0 1.1 1 1.7 2.2 1.7h7.6c1.2 0 2.2-.6 2.2-1.7 0-.8-.6-1.4-.6-2.4 0-1.4.8-2.7.8-4.6 0-3.3-2.6-5.9-6.2-5.9Z" />
      <path d="M13.6 8.2c-1.5-.7-2.9.2-2.9 1.4 0 1.1 1.1 1.6 2 1.3" opacity=".85" />
      <path d="M9.4 13.4h5.2" opacity=".5" />
      <path d="M10.2 21h3.6" />
    </svg>
  );
}

// 2 — O Despejo: o cálice virando, o conteúdo saindo
function Dia2({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5.6 4.4h8.2l-.7 4.3a3.4 3.4 0 0 1-6.8 0L5.6 4.4Z" transform="rotate(28 9.7 7)" />
      <path d="M14.4 13.6c.6 1 .9 2 .9 3.1" opacity=".55" />
      <path d="M11.6 15.2c.4.8.6 1.6.6 2.5" opacity=".55" />
      <path d="M17 12.2c.7 1.2 1 2.4 1 3.6" opacity=".55" />
      <path d="M8.4 21h8" />
    </svg>
  );
}

// 3 — O Corpo Fala: a silhueta e o ponto de luz no peito
function Dia3({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="5.2" r="2.4" />
      <path d="M12 9c-2.8 0-4.6 1.8-4.6 4.4V21" />
      <path d="M12 9c2.8 0 4.6 1.8 4.6 4.4V21" />
      <circle cx="12" cy="13.4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.4" r="3.4" opacity=".4" />
    </svg>
  );
}

// 4 — A Voz Invisível: ondas dentro do círculo tracejado (o que fala sem corpo)
function Dia4({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.6" strokeDasharray="2.4 2.6" opacity=".6" />
      <path d="M8.2 10v4" />
      <path d="M10.7 8.2v7.6" />
      <path d="M13.3 9.4v5.2" />
      <path d="M15.8 11v2" opacity=".7" />
    </svg>
  );
}

// 5 — O Silêncio Como Ferramenta: o círculo cheio e a pausa aberta dentro
function Dia5({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M10.2 9.4v5.2" />
      <path d="M13.8 9.4v5.2" />
    </svg>
  );
}

// 6 — A Linguagem que Cria: a fala e a faísca que ela acende
function Dia6({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M20 12.6c0 3.6-3.6 6.2-8 6.2-.9 0-1.8-.1-2.6-.3L5 20.4l1.2-3.2C4.8 16 4 14.4 4 12.6 4 9 7.6 6.4 12 6.4s8 2.6 8 6.2Z" />
      <path d="M12 9.6l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 11.8l2-.3.9-1.9Z" />
    </svg>
  );
}

// 7 — O Ambiente como Sinal: o arco do véu com a luz entrando (rima com o hero)
function Dia7({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <path d="M3.4 21h17.2" />
      <path d="M12 21v-7" opacity=".55" />
      <path d="M9.2 11.6a2.9 2.9 0 0 1 5.6 0" opacity=".7" />
    </svg>
  );
}

// 8 — A Identidade que Você Escolhe: duas silhuetas, uma escolhida
function Dia8({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8.6" cy="7.4" r="2.6" opacity=".45" />
      <path d="M4 19.6c0-2.7 2.1-4.6 4.6-4.6" opacity=".45" />
      <circle cx="14.6" cy="8.6" r="3" fill="currentColor" stroke="none" opacity=".18" />
      <circle cx="14.6" cy="8.6" r="3" />
      <path d="M9.2 20.4c0-3.2 2.4-5.4 5.4-5.4s5.4 2.2 5.4 5.4" />
    </svg>
  );
}

// 9 — O Campo e a Coerência: os círculos concêntricos entrando em fase
function Dia9({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="4.6" opacity=".85" />
      <circle cx="12" cy="12" r="7.2" opacity=".55" />
      <circle cx="12" cy="12" r="9.8" opacity=".28" />
    </svg>
  );
}

// 10 — A Integração: o cálice inteiro, com o glow — fecha a jornada na marca
function Dia10({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6.6 3.6h10.8l-.9 5.2a4.5 4.5 0 0 1-9 0l-.9-5.2Z" />
      <path d="M12 13.6V19" />
      <path d="M7.8 21h8.4" />
      <path d="M12 6.6l.6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.2.7.2-1.4-1-1 1.4-.2.6-1.3Z" opacity=".7" />
    </svg>
  );
}

const DIAS = [Dia1, Dia2, Dia3, Dia4, Dia5, Dia6, Dia7, Dia8, Dia9, Dia10];

/**
 * Ícone do dia por `order_index` (1..10). Fora da faixa devolve o do último
 * dia — se a Ge adicionar um 11º dia no banco, a tela não quebra, só repete
 * um desenho até alguém desenhar o novo.
 */
export function IconeDia({ order, size = 22, className }: { order: number } & IconProps): ReactNode {
  const Icone = DIAS[Math.min(Math.max(order, 1), DIAS.length) - 1];
  return <Icone size={size} className={className} />;
}
