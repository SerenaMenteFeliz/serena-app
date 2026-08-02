import { CheckoutForm } from "@/components/CheckoutForm";
import { CaliceBook } from "@/components/calice/CaliceBook";
import { caliceFontVars } from "@/lib/fonts/calice";
import { PRODUCT_PRICE, formatPrice } from "@/lib/pricing";

// Ancoragem R$341→R$37 e a lista de inclusos vêm da precificação decidida em
// 30/07/2026 (ver "Método Cálice - Visão Geral" no vault) — valor simbólico
// somado do livro (R$97) + 10 dias de prática (R$197) + acompanhamento (R$47).
const INCLUSOS = [
  "O Livro completo — 13 capítulos",
  "Os 10 Dias de Prática Guiada",
  "Notas pessoais por capítulo",
  "Acesso vitalício",
];

export default function ComprarMetodoCalicePage() {
  const { label, value } = PRODUCT_PRICE.metodo_calice;

  return (
    <main
      className={`${caliceFontVars} theme-metodo-calice veil-bg flex min-h-screen flex-col items-center justify-center gap-6 p-6`}
      style={{ color: "var(--ink)" }}
    >
      <div className="veil-arch glass-card relative h-[200px] w-[180px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 85%, rgba(217,168,84,0.22), transparent 60%)" }}
        />
        <div
          className="absolute left-1/2 top-3.5 h-[110px] w-[110px] -translate-x-1/2 rounded-full"
          style={{ border: "1px dashed color-mix(in srgb, var(--gold) 50%, transparent)" }}
        />
        <div className="float-slow absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
          <CaliceBook width={82} height={116} />
        </div>
      </div>

      <div className="text-center">
        <h1 className="font-display text-[26px]">{label}</h1>
        <p className="font-veil-sans mt-1.5 text-sm">
          <span className="opacity-45 line-through">R$341</span>{" "}
          <span className="font-bold" style={{ color: "var(--accent)" }}>
            {formatPrice(value)}
          </span>{" "}
          <span className="opacity-55">· turma fundadora · Pix</span>
        </p>
      </div>

      <ul className="glass-card flex w-full max-w-sm flex-col gap-2 rounded-[20px] px-5 py-4">
        {INCLUSOS.map((item) => (
          <li key={item} className="font-veil-sans flex items-center gap-2 text-sm">
            <span aria-hidden style={{ color: "var(--accent)" }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      <CheckoutForm product="metodo_calice" entryHref="/metodo-calice/entrar" />
    </main>
  );
}
