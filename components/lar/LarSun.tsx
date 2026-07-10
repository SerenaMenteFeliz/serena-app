// Objeto-símbolo do Lar Interior: o sol da golden hour nascendo sobre o mar
// (o DNA visual do produto é a natureza de Ubatuba). Equivalente ao CaliceBook
// do Método Cálice — vive dentro do arco do hero e na tela de login.
export function LarSun({ width = 150, height = 108 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 150 108" fill="none" aria-hidden>
      <defs>
        <radialGradient id="lar-sun-disc" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#f6d795" />
          <stop offset="55%" stopColor="#ecc27c" />
          <stop offset="100%" stopColor="#d9973e" />
        </radialGradient>
        <radialGradient id="lar-sun-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(236, 194, 124, 0.5)" />
          <stop offset="100%" stopColor="rgba(236, 194, 124, 0)" />
        </radialGradient>
        <linearGradient id="lar-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(169, 196, 207, 0.55)" />
          <stop offset="100%" stopColor="rgba(169, 196, 207, 0.08)" />
        </linearGradient>
      </defs>

      {/* halo do sol */}
      <circle cx="75" cy="52" r="44" fill="url(#lar-sun-halo)" />

      {/* anel tracejado — mesmo gesto do santuário do Cálice */}
      <circle
        cx="75"
        cy="52"
        r="34"
        stroke="#d9973e"
        strokeOpacity="0.45"
        strokeDasharray="3 5"
        strokeLinecap="round"
      />

      {/* o sol, meio mergulhado no horizonte */}
      <clipPath id="lar-above-sea">
        <rect x="0" y="0" width="150" height="74" />
      </clipPath>
      <circle cx="75" cy="52" r="22" fill="url(#lar-sun-disc)" clipPath="url(#lar-above-sea)" />

      {/* o mar */}
      <rect x="10" y="74" width="130" height="26" fill="url(#lar-sea)" rx="4" />
      <path d="M18 74c10-2.5 20-2.5 30 0s20 2.5 30 0 20-2.5 30-0 14 2 24 0" stroke="rgba(169,196,207,0.9)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* reflexo do sol na água */}
      <path d="M63 81h24M68 88h14M71 95h8" stroke="#ecc27c" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" />
    </svg>
  );
}
