// Ícones de traço fino (1.5px) do app inteiro — desenhados à mão pra manter
// o mesmo peso visual entre si (emoji varia de plataforma). Nasceram no
// Método Cálice e foram promovidos a compartilhados quando o Lar Interior e
// o hub entraram na mesma linguagem.
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

export function BookIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" />
    </svg>
  );
}

export function PlayIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9.2v5.6l4.6-2.8L10 9.2Z" />
    </svg>
  );
}

export function PenIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" />
      <path d="M14.5 6.5l3 3" />
    </svg>
  );
}

// Avatar genérico do canto superior direito (15/08/2026). Substituiu a
// inicial do nome dentro do orbe: inicial é fallback de plataforma que não
// tem foto, e no app inteiro ninguém tem foto — então era uma letra solta
// onde toda plataforma põe um rosto. Desenhado sem marcador de gênero
// (sem cabelo, sem traço de ombro que sugira roupa), só cabeça e busto
// arredondados, no peso preenchido pra ler bem a 20px dentro do orbe.
export function AvatarIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="8.6" r="3.9" fill="currentColor" />
      <path
        d="M4.9 20.4c0-3.9 3.2-6.6 7.1-6.6s7.1 2.7 7.1 6.6c0 .5-.4.9-.9.9H5.8c-.5 0-.9-.4-.9-.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UserIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" />
    </svg>
  );
}

export function LockIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12.5l4.2 4L19 7" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M14.5 5.5L8 12l6.5 6.5" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9.5 5.5L16 12l-6.5 6.5" />
    </svg>
  );
}

export function SunIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </svg>
  );
}

export function LeafIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M19 4c-8.5.5-13 4.5-13 10a6 6 0 0 0 6 6c5.5 0 9.5-5.5 7-16Z" />
      <path d="M6.5 17.5C9 13 12.5 9.5 17 7" />
    </svg>
  );
}

export function GiftIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M12 9v11M4 13.5h16" />
      <path d="M12 9C10 9 7.5 8.2 7.5 6.2S10.5 4 12 6.5C13.5 4 16.5 4.2 16.5 6.2S14 9 12 9Z" />
    </svg>
  );
}

export function MoonIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M19.5 14A8 8 0 1 1 10 4.5a6.5 6.5 0 0 0 9.5 9.5Z" />
    </svg>
  );
}

export function DownloadIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 4v10.5M7.5 11l4.5 4.5L16.5 11" />
      <path d="M5 19.5h14" />
    </svg>
  );
}

export function SparkleIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 4c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6Z" />
      <path d="M18.5 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.2-2.2.9-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" />
    </svg>
  );
}

// ── Player de áudio ─────────────────────────────────────────────────────────
// Play/pause preenchidos (não de traço): num botão redondo de fundo sólido o
// traço fino some, e é o único lugar do app onde ícone cheio fica certo.

export function PlayFilledIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.2c0-.9 1-1.5 1.8-1l9 6.8c.7.5.7 1.5 0 2l-9 6.8c-.8.5-1.8-.1-1.8-1V5.2Z" />
    </svg>
  );
}

export function PauseFilledIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6.5" y="4.5" width="4" height="15" rx="1.4" />
      <rect x="13.5" y="4.5" width="4" height="15" rx="1.4" />
    </svg>
  );
}

// Voltar/avançar 15s — seta circular com o número dentro, padrão que player
// de podcast consagrou (a pessoa reconhece sem legenda).
export function Replay15Icon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M11.8 6.2V3.4L8 6.2l3.8 2.8V6.2Z" fill="currentColor" stroke="none" />
      <path d="M11.8 6.2a7 7 0 1 0 7 7" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" stroke="none">
        15
      </text>
    </svg>
  );
}

export function Forward15Icon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12.2 6.2V3.4L16 6.2l-3.8 2.8V6.2Z" fill="currentColor" stroke="none" />
      <path d="M12.2 6.2a7 7 0 1 1-7 7" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" stroke="none">
        15
      </text>
    </svg>
  );
}

export function HeadphonesIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5h2a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-4.5Z" />
      <path d="M19.5 13.5h-2a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4.5Z" />
    </svg>
  );
}
