// Trilha dos 10 dias — a mesma leitura de "onde eu estou na jornada" que o
// Lar Interior já dava com o rastreador de barrinhas, trazida pro Cálice.
// Serve prévia e pós-compra: o que muda é só quantos dias vêm como
// `concluido` / `atual`.
export type EstadoDia = "concluido" | "atual" | "bloqueado";

export function TrilhaDias({ dias }: { dias: { num: number; estado: EstadoDia }[] }) {
  return (
    <div className="flex justify-between gap-1" aria-hidden>
      {dias.map((d) => (
        <span
          key={d.num}
          className="h-2.5 flex-1 rounded-full transition-colors"
          style={{
            background:
              d.estado === "concluido"
                ? "var(--gold)"
                : d.estado === "atual"
                  ? "var(--deep-lavender)"
                  : "color-mix(in srgb, var(--ink) 12%, transparent)",
          }}
        />
      ))}
    </div>
  );
}
