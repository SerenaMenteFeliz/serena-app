import Link from "next/link";
import { SparkleIcon } from "@/components/icons";

// 404 global — mesma serenidade do resto da casa, sem cara de erro técnico.
export default function NotFound() {
  return (
    <main
      className={`theme-hub veil-bg flex min-h-screen flex-col items-center justify-center p-6 text-center`}
      style={{ color: "var(--ink)" }}
    >
      <span className="glass-orb h-[64px] w-[64px]" style={{ borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)" }}>
        <SparkleIcon size={24} className="opacity-70" />
      </span>

      <h1 className="font-display mt-5 text-2xl leading-snug">
        Essa página não
        <br />
        mora aqui
      </h1>

      <p className="mt-3 max-w-[280px] text-sm leading-relaxed opacity-65">
        O caminho que você tentou não existe (ou mudou de lugar). Vem, te levamos de volta pra casa.
      </p>

      <Link
        href="/pos-login"
        className="glass-card mt-6 rounded-full px-6 py-2.5 text-sm font-semibold transition-transform active:scale-[0.98]"
      >
        Voltar pro início
      </Link>
    </main>
  );
}
