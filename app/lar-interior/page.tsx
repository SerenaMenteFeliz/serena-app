import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProductAccess, getContactFirstName } from "@/lib/access";
import { getPace, getLarSessions, getIntencaoDoDia, getGreetingLar, tituloSessao } from "@/lib/lar";
import { getConstancia, fraseConstancia } from "@/lib/constancia";
import { LarShell } from "@/components/lar/LarShell";
import { LarSun } from "@/components/lar/LarSun";
import { CheckinDia } from "@/components/lar/CheckinDia";
import { Track } from "@/components/analytics/Track";
import { LeafIcon, GiftIcon, UserIcon, ChevronRightIcon, CheckIcon, MoonIcon, SparkleIcon } from "@/components/icons";

export default async function LarInteriorPage() {
  const { contactId } = await requireProductAccess("lar_interior");

  const pace = await getPace(contactId);
  if (!pace) redirect("/lar-interior/comecar");

  const [{ sessions, concluidas, diaAtual, totalDias }, constancia, firstName] = await Promise.all([
    getLarSessions(contactId, pace),
    getConstancia(contactId),
    getContactFirstName(contactId),
  ]);
  const frase = fraseConstancia(constancia);
  const diaSP = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());

  const sessaoDaVez = sessions.find((s) => s.status === "hoje");
  const sessaoAmanha = sessions.find((s) => s.status === "amanha");
  const completo = concluidas === sessions.length && sessions.length > 0;

  const heroHref = sessaoDaVez
    ? `/lar-interior/sessoes/${sessaoDaVez.order_index}`
    : "/lar-interior/sessoes";
  const heroLabel = completo
    ? "desafio completo — toque para revisitar as sessões"
    : sessaoDaVez
      ? concluidas === 0
        ? "toque para começar sua primeira sessão"
        : "toque para viver a sessão de hoje"
      : "sessão de hoje concluída — amanhã o sol nasce de novo";

  // rastreador da jornada: no ritmo de 7 dias cada dia é um tema (par de
  // sessões); no de 14, cada dia é uma sessão — eco do Rastreador em PDF
  const dias = Array.from({ length: totalDias }, (_, i) => {
    const feitas =
      pace === 7
        ? [sessions[i * 2], sessions[i * 2 + 1]].filter((s) => s?.status === "concluida").length / 2
        : sessions[i]?.status === "concluida"
          ? 1
          : 0;
    return { num: i + 1, cheio: feitas === 1, parcial: feitas > 0 && feitas < 1 };
  });

  const categorias = [
    { href: "/lar-interior/sessoes", label: "Sessões", border: "var(--sun)", icon: <LeafIcon /> },
    { href: "/lar-interior/bonus", label: "Bônus", border: "var(--terracotta)", icon: <GiftIcon /> },
    { href: "/perfil", label: "Perfil", border: "var(--sky)", icon: <UserIcon /> },
  ];

  return (
    <LarShell>
      <Track event="login" contactId={contactId} oncePerSession />
      {/* saudação */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-55">
            {getGreetingLar()}
          </p>
          <p className="font-display text-[26px] leading-tight">{firstName ?? "que bom te ver"}</p>
        </div>
        <Link
          href="/perfil"
          aria-label="Perfil"
          className="glass-orb h-[42px] w-[42px]"
          style={{ borderColor: "color-mix(in srgb, var(--sun) 55%, transparent)" }}
        >
          <span className="font-display text-lg" style={{ color: "var(--accent)" }}>
            {(firstName ?? "S").charAt(0)}
          </span>
        </Link>
      </header>

      {/* hero: o sol nascendo no arco */}
      <Link href={heroHref} className="veil-arch glass-card group relative mt-5 block h-[246px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 78%, rgba(236,194,124,0.28), transparent 62%)" }}
        />
        <div className="absolute inset-x-0 bottom-6 flex justify-center transition-transform duration-300 group-hover:scale-[1.03]">
          <LarSun width={210} height={150} />
        </div>
      </Link>
      <p className="mt-3 text-center text-xs opacity-60">{heroLabel}</p>

      {/* rastreador da jornada */}
      <div className="glass-card mt-5 px-4 py-3.5">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
            {completo ? "Jornada completa" : `Dia ${diaAtual} de ${totalDias}`}
          </p>
          <Link href="/lar-interior/comecar?trocar=1" className="text-[10px] opacity-45 transition-opacity hover:opacity-100">
            ritmo de {pace} dias · trocar
          </Link>
        </div>
        <div className="mt-2.5 flex justify-between">
          {dias.map((d) => (
            <span
              key={d.num}
              aria-label={`Dia ${d.num}`}
              className="h-2.5 rounded-full transition-colors"
              style={{
                width: totalDias === 7 ? "26px" : "12px",
                background: d.cheio
                  ? "var(--sun)"
                  : d.parcial
                    ? "linear-gradient(90deg, var(--sun) 50%, color-mix(in srgb, var(--sun) 18%, transparent) 50%)"
                    : "color-mix(in srgb, var(--sun) 18%, transparent)",
              }}
            />
          ))}
        </div>
        {frase && (
          <p className="mt-2.5 text-center text-[11px] font-semibold" style={{ color: "var(--accent)" }}>
            ✦ {frase}
          </p>
        )}
      </div>

      {/* marco da jornada completa — porta pro card de compartilhar */}
      {completo && (
        <Link
          href="/lar-interior/celebracao"
          className="glass-card glass-card-strong mt-4 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold"
          style={{ color: "var(--accent)" }}
        >
          <SparkleIcon size={16} /> Seu marco dos 7 dias — veja e compartilhe
        </Link>
      )}

      {/* categorias */}
      <div className="mt-5 flex justify-center gap-9">
        {categorias.map((cat) => (
          <Link key={cat.href} href={cat.href} className="flex flex-col items-center gap-1.5">
            <span className="glass-orb" style={{ borderColor: cat.border }}>
              {cat.icon}
            </span>
            <span className="text-[11px] font-semibold">{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* sessão de hoje */}
      <div className="mt-5">
        {sessaoDaVez ? (
          <Link
            href={`/lar-interior/sessoes/${sessaoDaVez.order_index}`}
            className="glass-card flex items-center gap-3 px-4 py-3.5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
                Sua sessão de hoje · ~{sessaoDaVez.minutos} min
              </p>
              <p className="mt-0.5 truncate text-sm font-medium">
                {sessaoDaVez.tema} — {tituloSessao(sessaoDaVez.title).subtitulo}
              </p>
            </div>
            <ChevronRightIcon className="shrink-0 opacity-50" />
          </Link>
        ) : completo ? (
          <div className="glass-card flex items-center gap-3 px-4 py-3.5">
            <CheckIcon className="shrink-0" />
            <p className="text-sm font-medium">As 14 sessões vividas — sua jornada está completa</p>
          </div>
        ) : (
          <div className="glass-card flex items-center gap-3 px-4 py-3.5">
            <MoonIcon className="shrink-0 opacity-60" />
            <div>
              <p className="text-sm font-medium">Por hoje é só — deixe a prática assentar</p>
              {sessaoAmanha && (
                <p className="mt-0.5 text-xs opacity-55">amanhã: {sessaoAmanha.tema}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* intenção do dia com check-in — "como você chega hoje?" */}
      <CheckinDia dia={diaSP} fallbackIntencao={getIntencaoDoDia()} />

      {/* SOS Ansiedade — flutuante, fora do menu: ansiedade não espera
          a pessoa navegar até o lugar certo */}
      <Link
        href="/lar-interior/bonus#sos"
        className="fixed right-4 z-50 flex items-center gap-2 rounded-full py-2.5 pl-3.5 pr-4 text-xs font-bold shadow-lg transition-transform active:scale-95"
        style={{
          bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
          background: "color-mix(in srgb, var(--terracotta) 92%, black)",
          color: "#fff7ef",
        }}
      >
        <SparkleIcon size={14} /> SOS Ansiedade
      </Link>
    </LarShell>
  );
}
