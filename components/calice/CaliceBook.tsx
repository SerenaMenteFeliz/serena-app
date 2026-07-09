// O livro-objeto da direção Santuário + Véu: vidro branco em perspectiva
// leve, lombada dourada. Usado no hero da home e na tela de entrada.
export function CaliceBook({ width = 104, height = 146 }: { width?: number; height?: number }) {
  return (
    <div
      className="relative"
      style={{
        width,
        height,
        transform: "perspective(700px) rotateY(-12deg)",
        borderRadius: "3px 8px 8px 3px",
        background: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(255,255,255,0.95)",
        boxShadow: "0 18px 34px -10px rgba(155,130,200,0.35)",
      }}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-2"
        style={{ background: "color-mix(in srgb, var(--gold) 55%, transparent)", borderRadius: "3px 0 0 3px" }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-2.5 text-center">
        <span className="font-display text-[14px] leading-snug" style={{ color: "#6b5240" }}>
          Método
          <br />
          Cálice
        </span>
      </div>
    </div>
  );
}
