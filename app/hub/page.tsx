import Link from "next/link";
import { requireAuth, getActiveProducts, getContactFirstName, type ProductSlug } from "@/lib/access";
import { getChapters, getBookProgress, getLessonsWithProgress } from "@/lib/calice";
import { getGreeting } from "@/lib/calice-daily";
import { getPace, getLarSessions } from "@/lib/lar";
import { CaliceBook } from "@/components/calice/CaliceBook";
import { LarSun } from "@/components/lar/LarSun";
import { LockIcon, ChevronRightIcon, SparkleIcon } from "@/components/icons";

// O hub Serena Mente Feliz: a clareira de onde se avistam os mundos. Cada
// produto é um portal — a janela em arco mostra o mundo de dentro com a
// paleta e a tipografia reais dele (o wrapper .theme-* resolve os tokens).
export default async function HubPage() {
  const { contactId } = await requireAuth();
  const [produtos, firstName] = await Promise.all([
    getActiveProducts(contactId),
    getContactFirstName(contactId),
  ]);

  const temCalice = produtos.includes("metodo_calice");
  const temLar = produtos.includes("lar_interior");

  // progresso real de cada caminho (só dos produtos liberados)
  const caliceInfo = temCalice
    ? await (async () => {
        const [chapters, book, lessons] = await Promise.all([
          getChapters("metodo_calice"),
          getBookProgress(contactId, "metodo_calice"),
          getLessonsWithProgress(contactId, "metodo_calice"),
        ]);
        const lidos = Math.min(book.last_chapter_order, chapters.length);
        const feitas = lessons.filter((l) => l.completed).length;
        if (lidos === 0 && feitas === 0) return "comece pelo livro — o cálice espera por você";
        return `${lidos} de ${chapters.length} capítulos · ${feitas} de ${lessons.length} práticas`;
      })()
    : null;

  const larInfo = temLar
    ? await (async () => {
        const pace = await getPace(contactId);
        if (!pace) return "escolha seu ritmo e comece o desafio";
        const { concluidas, diaAtual, totalDias, sessions } = await getLarSessions(contactId, pace);
        if (concluidas === sessions.length && sessions.length > 0) return "jornada completa — revisite quando quiser";
        return `Dia ${diaAtual} de ${totalDias} · ${concluidas} sessões vividas`;
      })()
    : null;

  const portais: {
    slug: ProductSlug;
    nome: string;
    sub: string;
    href: string;
    theme: string;
    liberado: boolean;
    info: string | null;
    objeto: React.ReactNode;
    glow: string;
  }[] = [
    {
      slug: "lar_interior",
      nome: "Lar Interior",
      sub: "Desafio de 7 Dias",
      href: "/lar-interior",
      theme: "theme-lar-interior",
      liberado: temLar,
      info: larInfo,
      glow: "rgba(236,194,124,0.3)",
      objeto: (
        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <LarSun width={130} height={92} />
        </div>
      ),
    },
    {
      slug: "metodo_calice",
      nome: "Método Cálice",
      sub: "reprogramação mental",
      href: "/metodo-calice",
      theme: "theme-metodo-calice",
      liberado: temCalice,
      info: caliceInfo,
      glow: "rgba(217,168,84,0.22)",
      objeto: (
        <div className="float-slow absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
          <CaliceBook width={66} height={94} />
        </div>
      ),
    },
  ];

  return (
    <div className="theme-hub veil-bg" style={{ color: "var(--ink)" }}>
      <main className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        {/* saudação da marca-mãe */}
        <header className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-55">
              <SparkleIcon size={13} /> Serena Mente Feliz
            </p>
            <p className="font-display mt-0.5 text-[26px] leading-tight">
              {getGreeting()}
              {firstName ? `, ${firstName}` : ""}
            </p>
          </div>
          <Link
            href="/perfil"
            aria-label="Perfil"
            className="glass-orb h-[42px] w-[42px]"
            style={{ borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
          >
            <span className="font-display text-lg" style={{ color: "var(--accent)" }}>
              {(firstName ?? "S").charAt(0)}
            </span>
          </Link>
        </header>

        <p className="mt-5 text-[13px] leading-relaxed opacity-60">
          Cada produto é um mundo. Escolha por qual portal entrar hoje.
        </p>

        {/* os dois portais, lado a lado como duas portas */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {portais.map((p) => {
            const janela = (
              <div className={`${p.theme} veil-arch relative h-[228px] overflow-hidden`} style={{ color: "var(--ink)" }}>
                {/* o mundo de dentro: véu do produto atrás do vidro */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(170deg, var(--veil-0) 0%, var(--veil-1) 55%, var(--veil-2) 100%)" }}
                />
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 72%, ${p.glow}, transparent 62%)` }} />
                <div
                  className="absolute left-1/2 top-4 h-[108px] w-[108px] -translate-x-1/2 rounded-full"
                  style={{ border: "1px dashed color-mix(in srgb, var(--accent) 40%, transparent)" }}
                />
                {p.objeto}
                <div className="absolute inset-x-0 bottom-0 px-3 pb-3.5 text-center">
                  <p className="font-display text-[17px] leading-tight">{p.nome}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] opacity-55">{p.sub}</p>
                </div>

                {!p.liberado && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]"
                    style={{ background: "rgba(255,255,255,0.45)" }}
                  >
                    <span className="glass-orb h-[44px] w-[44px]" style={{ borderColor: "var(--glass-border)" }}>
                      <LockIcon size={18} className="opacity-60" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-60">em breve pra você</span>
                  </div>
                )}
              </div>
            );

            return p.liberado ? (
              <Link
                key={p.slug}
                href={p.href}
                className="glass-card group block overflow-hidden p-1.5 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.985]"
                style={{ borderRadius: "137px 137px 25px 25px" }}
              >
                {janela}
              </Link>
            ) : (
              <div key={p.slug} className="glass-card overflow-hidden p-1.5" style={{ borderRadius: "137px 137px 25px 25px" }}>
                {janela}
              </div>
            );
          })}
        </div>

        {/* continue de onde parou */}
        {(caliceInfo || larInfo) && (
          <>
            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.1em] opacity-45">Seus caminhos</p>
            <div className="mt-2 flex flex-col gap-2">
              {portais
                .filter((p) => p.liberado && p.info)
                .map((p) => (
                  <Link key={p.slug} href={p.href} className="glass-card flex items-center gap-3 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{p.nome}</p>
                      <p className="mt-0.5 truncate text-xs opacity-60">{p.info}</p>
                    </div>
                    <ChevronRightIcon className="shrink-0 opacity-50" />
                  </Link>
                ))}
            </div>
          </>
        )}

        {/* a promessa da casa */}
        <div className="surface-card-dark relative mt-6 overflow-hidden px-[18px] py-4">
          <div
            className="absolute -right-2.5 -top-2.5 h-[60px] w-[60px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #9ad8c9, transparent 70%)" }}
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "#9ad8c9" }}>
            Serena Mente Feliz
          </p>
          <p className="font-display mt-1.5 text-base italic leading-snug">
            “Um lar pra sua mente — entre no seu tempo, fique o quanto precisar.”
          </p>
        </div>
      </main>
    </div>
  );
}
